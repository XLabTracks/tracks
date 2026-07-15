import { convertPostHtml, ImageFetchError } from "./convert";
import { fetchPost, type SubstackPost } from "./fetch";
import type { SubstackRef } from "./id";
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
import { SUBSTACK_CONVERTER_VERSION, type ConvertedPost } from "./types";

export type PostResult =
  | { state: "ready"; post: ConvertedPost }
  | { state: "not-found" }
  | { state: "paywalled" }
  | { state: "failed" }
  | { state: "transient-error" };

const IMAGE_FETCH_TIMEOUT_MS = 25_000;
const IMAGE_CAP_BYTES = 30 * 1024 * 1024;

const USER_AGENT =
  "Tracks/0.1 (AI-safety learning platform; contact: akallu@andrew.cmu.edu)";

/**
 * Cache-first orchestrator, mirroring src/lib/arxiv/pipeline.ts: the cold
 * path persists the raw post JSON BEFORE converting (the cached source is
 * the working pin — see store.ts), terminal outcomes are negative-cached,
 * transient ones never are. `refresh` forces a refetch of the raw post and
 * re-download of images (how authors pick up post edits); it never bypasses
 * the terminal/transient commit discipline.
 *
 * Cache-coherence invariants (each guards a real regression):
 *   - a successful conversion clears any negative status (a stale "failed"
 *     would shadow it on the next plain build);
 *   - a not-found/paywalled classification clears the cached raw/converted
 *     content (it must not resurrect after the status TTL);
 *   - image downloads are network work inside the otherwise-deterministic
 *     conversion — ANY image failure is transient, never negative-cached.
 */
export async function getOrConvertPostUncached(
  ref: SubstackRef,
  options?: { refresh?: boolean },
): Promise<PostResult> {
  try {
    return await runPipeline(ref, options?.refresh === true);
  } catch (err) {
    if (err instanceof ImageFetchError) {
      console.error(`[substack] ${ref.id}: ${err.message}`);
      return { state: "transient-error" };
    }
    console.error(
      `[substack] pipeline error for ${ref.id}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return { state: "transient-error" };
  }
}

async function runPipeline(
  ref: SubstackRef,
  refresh: boolean,
): Promise<PostResult> {
  if (!refresh) {
    const status = await getPostStatus(ref);
    if (status) {
      switch (status.kind) {
        case "not-found":
          return { state: "not-found" };
        case "paywalled":
          return { state: "paywalled" };
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
      case "paywalled":
        await clearCachedPost(ref);
        await setPostStatus(ref, {
          kind: "paywalled",
          checkedAt: new Date().toISOString(),
        });
        return { state: "paywalled" };
      case "transient-error":
        console.error(`[substack] fetch failed for ${ref.id}: ${fetched.detail}`);
        return { state: "transient-error" };
    }
  }

  return convertFromRaw(ref, raw, refresh);
}

async function convertFromRaw(
  ref: SubstackRef,
  raw: SubstackPost,
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
        subtitle: raw.subtitle,
        authors: raw.authors.length > 0 ? raw.authors : undefined,
        postDate: raw.postDate,
        canonicalUrl: raw.canonicalUrl,
      },
      assets: [...result.assets.keys()],
      converterVersion: SUBSTACK_CONVERTER_VERSION,
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
  // Clearing the negative status rides in the same try — a fresh conversion
  // and a stale "failed"/"paywalled" status must never coexist.
  try {
    await clearPostStatus(ref);
    for (const [path, bytes] of assetBytes) await setAsset(ref, path, bytes);
    await setConvertedPost(ref, post);
  } catch (err) {
    console.error(
      `[substack] transient store write failure for ${ref.id}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return { state: "ready", post };
  }
  return { state: "ready", post };
}

/**
 * Image bytes, asset-cache first (bypassed on refresh so an edited post's
 * replaced images can't be served stale from a colliding path). Returns
 * null on any download problem — the converter turns that into
 * ImageFetchError (transient). The whole request INCLUDING the body read
 * sits inside the try: a mid-body timeout or connection reset must be
 * transient, not a permanent "failed" (see the arXiv fetch.ts notes — these
 * mid-body failures are real). Only https-final-URL raster images are
 * accepted: the bytes are committed verbatim under public/, so SVG (which
 * can script when navigated to directly) and anything unrecognized is
 * rejected.
 */
async function fetchImageCached(
  ref: SubstackRef,
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
  ref: SubstackRef,
  detail: string,
): Promise<void> {
  console.error(`[substack] conversion of ${ref.id} failed: ${detail}`);
  try {
    await setPostStatus(ref, {
      kind: "failed",
      detail,
      converterVersion: SUBSTACK_CONVERTER_VERSION,
    });
  } catch (err) {
    console.error(
      `[substack] could not record failed status for ${ref.id}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}
