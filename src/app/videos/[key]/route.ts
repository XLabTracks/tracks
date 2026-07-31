import { getCloudflareContext } from "@opennextjs/cloudflare";

// Serves lesson videos from the `videos` R2 bucket (wrangler.jsonc binding) —
// they are too heavy for Workers static assets (25 MiB/file limit forced
// re-encodes when they lived in public/videos/). Upload with
// `npx wrangler r2 object put videos/<name> --file <file> --remote`.
//
// Range requests are first-class: browsers fetch video with `Range:` headers
// and Safari refuses to seek unless byte ranges come back as 206 + Content-Range.

// Minimal structural view of the binding — cloudflare-env.d.ts is generated
// and gitignored, so typecheck can't lean on it (same reason src/lib/db.ts
// casts HYPERDRIVE structurally).
interface R2ObjectHead {
  size: number;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
}
interface R2ObjectBody extends R2ObjectHead {
  body: ReadableStream;
}
interface R2Bucket {
  head(key: string): Promise<R2ObjectHead | null>;
  get(
    key: string,
    options?: { range?: { offset: number; length: number } },
  ): Promise<R2ObjectBody | null>;
}

// Flat object keys only ([key] is a single path segment); anything else 404s.
const KEY_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

const CONTENT_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
};

function contentTypeFor(key: string, stored: string | undefined): string {
  if (stored) return stored;
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

// Resolves a single-range `Range:` header against the object size. Returns
// null to serve the full body (absent or malformed header — including
// multi-range, which we don't serve), or "unsatisfiable" for a 416.
function resolveRange(
  header: string | null,
  size: number,
): { offset: number; length: number } | "unsatisfiable" | null {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === "" && m[2] === "")) return null;
  // Any range against an empty object is unsatisfiable — and must not reach
  // R2, whose get() throws on zero-length ranges (e.g. the suffix branch
  // would produce { offset: 0, length: 0 } here).
  if (size === 0) return "unsatisfiable";
  if (m[1] === "") {
    // Suffix form (`bytes=-N`): the last N bytes.
    const suffix = Number(m[2]);
    if (suffix === 0) return "unsatisfiable";
    const length = Math.min(suffix, size);
    return { offset: size - length, length };
  }
  const offset = Number(m[1]);
  if (offset >= size) return "unsatisfiable";
  const end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  if (end < offset) return null;
  return { offset, length: end - offset + 1 };
}

// Reading request headers makes this dynamic anyway; the flag guards against
// any build-time evaluation, where getCloudflareContext() would misresolve.
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ key: string }> };

export async function GET(request: Request, ctx: RouteContext) {
  return serve(request, ctx, true);
}

export async function HEAD(request: Request, ctx: RouteContext) {
  return serve(request, ctx, false);
}

async function serve(
  request: Request,
  { params }: RouteContext,
  withBody: boolean,
): Promise<Response> {
  const { key } = await params;
  if (!KEY_RE.test(key)) return new Response("Not found", { status: 404 });

  let bucket: R2Bucket | undefined;
  try {
    const { env } = getCloudflareContext();
    bucket = (env as { videos?: R2Bucket }).videos;
  } catch {
    // Plain `next dev`: no emulated bindings (initOpenNextCloudflareForDev is
    // deliberately off — see next.config.ts), so getCloudflareContext throws.
  }
  if (!bucket) {
    // Dev fallback: let the deployed worker (origin from wrangler.jsonc vars)
    // serve the bytes; the browser retargets its range requests there.
    return Response.redirect(
      `https://tracks.xlabtracks.workers.dev/videos/${key}`,
      307,
    );
  }

  const head = await bucket.head(key);
  if (!head) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=86400",
    "content-type": contentTypeFor(key, head.httpMetadata?.contentType),
    etag: head.httpEtag,
  });

  const ifNoneMatch = request.headers.get("if-none-match");
  if (
    ifNoneMatch &&
    ifNoneMatch
      .split(",")
      .some((tag) => tag.trim().replace(/^W\//, "") === head.httpEtag)
  ) {
    return new Response(null, { status: 304, headers });
  }

  // If-Range guards a ranged read of an object that changed since the browser
  // cached its head: on etag mismatch, ignore the range and serve in full.
  const ifRange = request.headers.get("if-range");
  const rangeHeader =
    ifRange && ifRange !== head.httpEtag ? null : request.headers.get("range");
  const range = resolveRange(rangeHeader, head.size);

  if (range === "unsatisfiable") {
    headers.set("content-range", `bytes */${head.size}`);
    return new Response(null, { status: 416, headers });
  }

  if (range) {
    headers.set(
      "content-range",
      `bytes ${range.offset}-${range.offset + range.length - 1}/${head.size}`,
    );
    headers.set("content-length", String(range.length));
    if (!withBody) return new Response(null, { status: 206, headers });
    let object: R2ObjectBody | null = null;
    try {
      object = await bucket.get(key, { range });
    } catch (error) {
      // head()→get() race: the object was replaced by a smaller one and R2
      // rejected the now-stale range ("The requested range is not
      // satisfiable (10039)"). Anything else must propagate.
      if (!/range/i.test(String(error))) throw error;
      headers.delete("content-length");
      headers.set("content-range", `bytes */${head.size}`);
      return new Response(null, { status: 416, headers });
    }
    if (!object) return new Response("Not found", { status: 404 });
    return new Response(object.body, { status: 206, headers });
  }

  headers.set("content-length", String(head.size));
  if (!withBody) return new Response(null, { status: 200, headers });
  const object = await bucket.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, { status: 200, headers });
}
