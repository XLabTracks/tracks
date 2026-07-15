import { buildGraphqlUrl, buildPostUrl, type LessWrongRef } from "./id";

/**
 * Fetch and classify a LessWrong / Alignment Forum post via the public
 * ForumMagnum GraphQL API — the same data the reader page hydrates from,
 * with the post body served as `contents.html`.
 */

/** Hard cap on the response body — post JSON runs to hundreds of KB, not MB. */
export const DOWNLOAD_CAP_BYTES = 20 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 25_000;

const USER_AGENT =
  "Tracks/0.1 (AI-safety learning platform; contact: akallu@andrew.cmu.edu)";

const POST_QUERY = `query TracksPost($id: String) {
  post(input: { selector: { _id: $id } }) {
    result {
      _id
      title
      slug
      postedAt
      draft
      user { displayName }
      coauthors { displayName }
      contents { html }
    }
  }
}`;

/** The subset of the post JSON the converter consumes. */
export interface LessWrongPost {
  title: string;
  authors: string[];
  postedAt?: string;
  canonicalUrl: string;
  bodyHtml: string;
}

export type PostFetchResult =
  | { kind: "post"; post: LessWrongPost }
  | { kind: "not-found" }
  /**
   * Exists but served no html body (link post, restricted content, or an
   * API hiccup — indistinguishable from outside). The pipeline treats this
   * as transient: the build fails loudly and retries rather than ever
   * committing a terminal artifact off a possibly-flaky response.
   */
  | { kind: "empty"; detail: string }
  | { kind: "transient-error"; detail: string };

export async function fetchPost(ref: LessWrongRef): Promise<PostFetchResult> {
  let res: Response;
  try {
    res = await fetch(buildGraphqlUrl(ref), {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: POST_QUERY,
        variables: { id: ref.postId },
      }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
      cache: "no-store",
    });
  } catch (err) {
    return { kind: "transient-error", detail: describeError(err) };
  }

  if (!res.ok) {
    // GraphQL errors ride in 200 responses; anything else is retryable.
    return {
      kind: "transient-error",
      detail: `GraphQL endpoint responded ${res.status}`,
    };
  }

  let text: string;
  try {
    text = await res.text();
  } catch (err) {
    return { kind: "transient-error", detail: describeError(err) };
  }
  if (text.length > DOWNLOAD_CAP_BYTES) {
    return { kind: "transient-error", detail: "response too large" };
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { kind: "transient-error", detail: "non-JSON response" };
  }
  return classifyPostResponse(ref, json);
}

/** Classify a GraphQL response payload. Exported for unit tests. */
export function classifyPostResponse(
  ref: LessWrongRef,
  json: unknown,
): PostFetchResult {
  if (typeof json !== "object" || json === null) {
    return { kind: "transient-error", detail: "unexpected response shape" };
  }
  const payload = json as {
    errors?: { message?: string }[];
    data?: { post?: { result?: Record<string, unknown> | null } | null };
  };

  const result = payload.data?.post?.result;
  if (!result) {
    // A null result WITH GraphQL errors is indistinguishable from a
    // resolver/rate-limit failure — treating it as not-found would
    // negative-cache (and commit) a terminal state off a transient blip.
    // Only a clean null result means the id resolves to nothing readable.
    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      const detail = payload.errors
        .map((e) => e?.message ?? "unknown GraphQL error")
        .join("; ");
      return { kind: "transient-error", detail };
    }
    return { kind: "not-found" };
  }

  // The API has been observed answering an unknown id with a DIFFERENT
  // post — never trust a result that doesn't echo the requested id.
  if (result._id !== ref.postId) return { kind: "not-found" };
  if (result.draft === true) return { kind: "not-found" };

  const title = result.title;
  if (typeof title !== "string" || title.length === 0) {
    return { kind: "transient-error", detail: "post JSON has no title" };
  }

  const contents = result.contents;
  const bodyHtml =
    typeof contents === "object" && contents !== null
      ? (contents as Record<string, unknown>).html
      : undefined;
  if (typeof bodyHtml !== "string" || bodyHtml.length === 0) {
    return { kind: "empty", detail: "post has no html body" };
  }

  const authors: string[] = [];
  const user = result.user;
  if (typeof user === "object" && user !== null) {
    const name = (user as Record<string, unknown>).displayName;
    if (typeof name === "string" && name !== "") authors.push(name);
  }
  if (Array.isArray(result.coauthors)) {
    for (const coauthor of result.coauthors) {
      if (typeof coauthor !== "object" || coauthor === null) continue;
      const name = (coauthor as Record<string, unknown>).displayName;
      if (typeof name === "string" && name !== "") authors.push(name);
    }
  }

  const slug = typeof result.slug === "string" ? result.slug : "";
  return {
    kind: "post",
    post: {
      title,
      authors,
      postedAt:
        typeof result.postedAt === "string" ? result.postedAt : undefined,
      canonicalUrl: slug
        ? `${buildPostUrl(ref)}/${slug}`
        : buildPostUrl(ref),
      bodyHtml,
    },
  };
}

function describeError(err: unknown): string {
  if (err instanceof Error) {
    return err.name === "TimeoutError" ? "fetch timed out" : err.message;
  }
  return String(err);
}
