import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireUser } from "@/lib/auth";

/**
 * Stores a feedback screenshot and hands back the URL that goes in the form.
 *
 * A Google Form cannot take the image itself: a file-upload question forces
 * every responder to sign in to Google, which is exactly what the in-page
 * dialog exists to avoid. So the picture lives here and the form carries a
 * link to it.
 *
 * It writes into the existing `videos` R2 bucket under a `feedback/` prefix
 * rather than asking for a second bucket, a second binding and a deploy to
 * go with them. The name is the bucket's, not the file's.
 *
 * Sign-in is required, and that is the whole rate limit: this is an endpoint
 * that turns a POST into a public URL, which is an open file host if anyone
 * may call it. Playtesters are signed in. A signed-out reporter still sends
 * their report; they just send it without a picture.
 */
export const runtime = "nodejs";

interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer,
    options?: {
      httpMetadata?: { contentType?: string; cacheControl?: string };
      customMetadata?: Record<string, string>;
    },
  ): Promise<unknown>;
}

const MAX_BYTES = 8 * 1024 * 1024;
const PREFIX = "feedback/";
const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ ok: false, reason: "signed-out" }, { status: 401 });
  }

  const type = (request.headers.get("content-type") ?? "").split(";")[0]!.trim();
  if (!TYPES[type]) {
    return NextResponse.json({ ok: false, reason: "bad-type" }, { status: 415 });
  }

  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) {
    return NextResponse.json({ ok: false, reason: "bad-size" }, { status: 413 });
  }

  let bucket: R2Bucket | undefined;
  try {
    const { env } = getCloudflareContext();
    bucket = (env as { videos?: R2Bucket }).videos;
  } catch {
    // Plain `next dev` has no emulated bindings; the dialog treats a missing
    // screenshot as a report without one rather than as a failed report.
  }
  if (!bucket) {
    return NextResponse.json({ ok: false, reason: "no-store" }, { status: 503 });
  }

  const key = `${PREFIX}${crypto.randomUUID()}.${TYPES[type]}`;
  await bucket.put(key, bytes, {
    httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000" },
    customMetadata: { userId: user.id },
  });

  const origin = new URL(request.url).origin;
  return NextResponse.json({
    ok: true,
    url: `${origin}/feedback-shots/${key.slice(PREFIX.length)}`,
  });
}
