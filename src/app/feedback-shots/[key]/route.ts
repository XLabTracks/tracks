import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Serves a feedback screenshot out of the `videos` R2 bucket's `feedback/`
 * prefix. The form holds one of these URLs per report, and whoever reads the
 * responses opens it — so it answers unauthenticated, like the video route
 * beside it. The key is a random UUID, which is what keeps one report's
 * picture from being guessable from another's.
 */
interface R2ObjectBody {
  body: ReadableStream;
  httpEtag: string;
}
interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
}

const KEY_RE = /^[0-9a-f-]{36}\.png$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  if (!KEY_RE.test(key)) return new Response("Not found", { status: 404 });

  let bucket: R2Bucket | undefined;
  try {
    const { env } = getCloudflareContext();
    bucket = (env as { videos?: R2Bucket }).videos;
  } catch {
    // Plain `next dev`: no emulated bindings.
  }
  if (!bucket) return new Response("Not found", { status: 404 });

  const object = await bucket.get(`feedback/${key}`);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
      etag: object.httpEtag,
    },
  });
}
