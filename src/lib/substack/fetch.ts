import { buildApiUrl, type SubstackRef } from "./id";

/**
 * Fetch and classify a Substack post via the public JSON API
 * (`/api/v1/posts/{slug}` — the same payload the reader page hydrates from).
 * The API serves `body_html` directly, so no page scraping is involved, and
 * it follows the publication's redirects (e.g. *.substack.com → a custom
 * domain) transparently.
 */

/** Hard cap on the response body — post JSON runs to tens of KB, not MB. */
export const DOWNLOAD_CAP_BYTES = 20 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 25_000;

const USER_AGENT =
  "Tracks/0.1 (AI-safety learning platform; contact: akallu@andrew.cmu.edu)";

/** The subset of the post JSON the converter consumes. */
export interface SubstackPost {
  title: string;
  subtitle?: string;
  authors: string[];
  postDate?: string;
  canonicalUrl?: string;
  bodyHtml: string;
}

export type PostFetchResult =
  | { kind: "post"; post: SubstackPost }
  | { kind: "not-found" }
  | { kind: "paywalled" }
  | { kind: "transient-error"; detail: string };

export async function fetchPost(ref: SubstackRef): Promise<PostFetchResult> {
  let res: Response;
  try {
    res = await fetch(buildApiUrl(ref), {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
      cache: "no-store",
    });
  } catch (err) {
    return { kind: "transient-error", detail: describeError(err) };
  }

  if (res.status === 404) return { kind: "not-found" };
  if (!res.ok) {
    // 403/429/5xx are all retryable; never negative-cache them.
    return {
      kind: "transient-error",
      detail: `Substack responded ${res.status}`,
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
  return classifyPostJson(json);
}

/** Classify a post JSON payload. Exported for unit tests. */
export function classifyPostJson(json: unknown): PostFetchResult {
  if (typeof json !== "object" || json === null) {
    return { kind: "transient-error", detail: "unexpected response shape" };
  }
  const post = json as Record<string, unknown>;

  // Anything gated (paid/founding tiers) serves a truncated body at best —
  // never reproduce a partial post.
  if (post.audience !== "everyone") return { kind: "paywalled" };

  const bodyHtml = post.body_html;
  const title = post.title;
  if (typeof bodyHtml !== "string" || bodyHtml.length === 0) {
    return { kind: "paywalled" };
  }
  if (typeof title !== "string" || title.length === 0) {
    return { kind: "transient-error", detail: "post JSON has no title" };
  }

  const bylines = Array.isArray(post.publishedBylines)
    ? post.publishedBylines
    : [];
  const authors = bylines
    .map((b) =>
      typeof b === "object" && b !== null
        ? (b as Record<string, unknown>).name
        : undefined,
    )
    .filter((name): name is string => typeof name === "string" && name !== "");

  return {
    kind: "post",
    post: {
      title,
      subtitle: asNonEmptyString(post.subtitle),
      authors,
      postDate: asNonEmptyString(post.post_date),
      canonicalUrl: asNonEmptyString(post.canonical_url),
      bodyHtml,
    },
  };
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

function describeError(err: unknown): string {
  if (err instanceof Error) {
    return err.name === "TimeoutError" ? "fetch timed out" : err.message;
  }
  return String(err);
}
