import { convertPostHtml, ImageFetchError } from "./convert";
import { fetchPost, type LessWrongPost } from "./fetch";
import type { LessWrongRef } from "./id";
import {
  clearCachedPost,
  clearPostStatus,
  getAsset,
  getConvertedPost,
  getPostStatus,
  getRawPost,
  setAsset,
  setConvertedPost,
  setPostStatus,
  setRawPost,
} from "./store";
import { looksLikeRasterImage } from "@/lib/paper-source/convert-shared";
import { LESSWRONG_CONVERTER_VERSION, type ConvertedPost } from "./types";

export type PostResult =
  | { state: "ready"; post: ConvertedPost }
  | { state: "not-found" }
  | { state: "failed" }
  | { state: "transient-error" };

const IMAGE_FETCH_TIMEOUT_MS = 25_000;
const IMAGE_CAP_BYTES = 30 * 1024 * 1024;

const USER_AGENT =
  "Tracks/0.1 (AI-safety learning platform; contact: akallu@andrew.cmu.edu)";

/**
 * Cache-first orchestrator, mirroring src/lib/substack/pipeline.ts (see its
 * header for the cache-coherence invariants; they hold verbatim here):
 * terminal outcomes are negative-cached, transient ones never are, a
 * successful conversion clears any negative status, a not-found
 * classification clears the cached content, and image-download failures are
 * always transient.
 */
export async function getOrConvertPostUncached(
  ref: LessWrongRef,
  options?: { refresh?: boolean },
): Promise<PostResult> {
  try {
    return await runPipeline(ref, options?.refresh === true);
  } catch (err) {
    if (err instanceof ImageFetchError) {
      console.error(`[lesswrong] ${ref.id}: ${err.message}`);
      return { state: "transient-error" };
    }
    console.error(
      `[lesswrong] pipeline error for ${ref.id}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return { state: "transient-error" };
  }
}

async function runPipeline(
  ref: LessWrongRef,
  refresh: boolean,
): Promise<PostResult> {
  if (!refresh) {
    const status = await getPostStatus(ref);
    if (status) {
      switch (status.kind) {
        case "not-found":
          return { state: "not-found" };
        case "failed":
          return { state: "failed" };
      }
    }
    const converted = await getConvertedPost(ref);
    if (converted) return { state: "ready", post: converted };
  }

  let raw = refresh ? null : await getRawPost(ref);
  if (!raw) {
    const fetched = await fetchPost(ref);
    switch (fetched.kind) {
      case "post":
        raw = fetched.post;
        await setRawPost(ref, raw);
        break;
      case "not-found":
        await clearCachedPost(ref);
        await setPostStatus(ref, {
          kind: "not-found",
          checkedAt: new Date().toISOString(),
        });
        return { state: "not-found" };
      case "empty":
        // Can't distinguish "genuinely has no body" from an API hiccup —
        // never negative-cache it; the build fails loudly and retries.
        console.error(`[lesswrong] ${ref.id}: ${fetched.detail}`);
        return { state: "transient-error" };
      case "transient-error":
        console.error(
          `[lesswrong] fetch failed for ${ref.id}: ${fetched.detail}`,
        );
        return { state: "transient-error" };
    }
  }

  return convertFromRaw(ref, raw, refresh);
}

async function convertFromRaw(
  ref: LessWrongRef,
  raw: LessWrongPost,
  refresh: boolean,
): Promise<PostResult> {
  let post: ConvertedPost;
  let assetBytes: Map<string, Uint8Array>;
  try {
    const result = await convertPostHtml(raw.bodyHtml, {
      ref,
      fetchImage: (url, assetPath) =>
        fetchImageCached(ref, url, assetPath, refresh),
    });
    post = {
      html: result.html,
      toc: result.toc,
      warnings: result.warnings,
      meta: {
        title: raw.title,
        authors: raw.authors.length > 0 ? raw.authors : undefined,
        postedAt: raw.postedAt,
        canonicalUrl: raw.canonicalUrl,
      },
      assets: [...result.assets.keys()],
      converterVersion: LESSWRONG_CONVERTER_VERSION,
      createdAt: new Date().toISOString(),
    };
    assetBytes = result.assets;
  } catch (err) {
    if (err instanceof ImageFetchError) throw err; // transient — handled above
    await tryFailPermanently(
      ref,
      err instanceof Error ? err.message : String(err),
    );
    return { state: "failed" };
  }

  // Store writes: a failure here is transient infrastructure, never cached.
  try {
    await clearPostStatus(ref);
    for (const [path, bytes] of assetBytes) await setAsset(ref, path, bytes);
    await setConvertedPost(ref, post);
  } catch (err) {
    console.error(
      `[lesswrong] transient store write failure for ${ref.id}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return { state: "ready", post };
  }
  return { state: "ready", post };
}

/**
 * Image bytes, asset-cache first (bypassed on refresh). Returns null on any
 * download problem — the converter turns that into ImageFetchError
 * (transient). The whole request INCLUDING the body read sits inside the
 * try, and only https-final-URL raster images are accepted (the bytes are
 * committed verbatim under public/).
 */
async function fetchImageCached(
  ref: LessWrongRef,
  url: string,
  assetPath: string,
  refresh: boolean,
): Promise<Uint8Array | null> {
  if (!refresh) {
    const cached = await getAsset(ref, assetPath);
    if (cached && cached.length > 0) return cached;
  }

  let buf: Uint8Array;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok) return null;
    if (!res.url.startsWith("https://")) return null; // redirected off https
    buf = new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
  if (buf.length === 0 || buf.length > IMAGE_CAP_BYTES) return null;
  if (!looksLikeRasterImage(buf)) return null;
  return buf;
}

async function tryFailPermanently(
  ref: LessWrongRef,
  detail: string,
): Promise<void> {
  console.error(`[lesswrong] conversion of ${ref.id} failed: ${detail}`);
  try {
    await setPostStatus(ref, {
      kind: "failed",
      detail,
      converterVersion: LESSWRONG_CONVERTER_VERSION,
    });
  } catch (err) {
    console.error(
      `[lesswrong] could not record failed status for ${ref.id}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}
