import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { SubstackRef } from "./id";
import type { SubstackPost } from "./fetch";
import { SUBSTACK_CONVERTER_VERSION, type ConvertedPost } from "./types";

/**
 * Authoring-time filesystem cache used by `npm run substack:build` (and unit
 * tests) — the Substack mirror of src/lib/arxiv/store.ts. Unlike arXiv
 * e-prints, Substack posts are mutable: while the cached post JSON lives,
 * re-runs convert the same source; `--refresh` (or OS eviction of the temp
 * dir) refetches, picking up author edits — the committed artifact is the
 * durable pin either way.
 *
 *   {id}/post.json       raw post payload (title, bylines, body_html)
 *   {id}/converted.json  ConvertedPost (checked against SUBSTACK_CONVERTER_VERSION)
 *   {id}/assets/{path}   image bytes actually referenced by the HTML
 *   {id}/status.json     negative cache (not-found, paywalled, failed)
 *
 * This never runs in the deployed app: the build script converts locally and
 * commits artifacts (src/content/substack/, public/substack/) that the site
 * reads. Lives under the OS temp dir by default; override with
 * SUBSTACK_CACHE_DIR.
 */

export type PostStatus =
  | { kind: "not-found"; checkedAt: string }
  | { kind: "paywalled"; checkedAt: string }
  | { kind: "failed"; detail: string; converterVersion: number };

/** Gating and existence can change — recheck both daily. */
const RECHECK_TTL_MS = 24 * 60 * 60 * 1000;

const root = () =>
  process.env.SUBSTACK_CACHE_DIR ?? join(tmpdir(), "tracks-substack-cache");

const pathFor = (key: string) => join(root(), key);

function write(key: string, data: string | Uint8Array): void {
  const p = pathFor(key);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, data);
}

function readJSON(key: string): unknown | null {
  try {
    return JSON.parse(readFileSync(pathFor(key), "utf8"));
  } catch {
    return null;
  }
}

function readBytes(key: string): Uint8Array | null {
  try {
    return new Uint8Array(readFileSync(pathFor(key)));
  } catch {
    return null;
  }
}

export async function getRawPost(ref: SubstackRef): Promise<SubstackPost | null> {
  return readJSON(`${ref.id}/post.json`) as SubstackPost | null;
}

export async function setRawPost(
  ref: SubstackRef,
  post: SubstackPost,
): Promise<void> {
  write(`${ref.id}/post.json`, JSON.stringify(post));
}

export async function getConvertedPost(
  ref: SubstackRef,
): Promise<ConvertedPost | null> {
  const value = readJSON(`${ref.id}/converted.json`) as ConvertedPost | null;
  if (!value || value.converterVersion !== SUBSTACK_CONVERTER_VERSION) {
    return null;
  }
  return value;
}

export async function setConvertedPost(
  ref: SubstackRef,
  post: ConvertedPost,
): Promise<void> {
  write(`${ref.id}/converted.json`, JSON.stringify(post));
}

/** Returns the effective status, treating stale/superseded entries as absent. */
export async function getPostStatus(ref: SubstackRef): Promise<PostStatus | null> {
  const status = readJSON(`${ref.id}/status.json`) as PostStatus | null;
  if (!status) return null;
  if (status.kind === "not-found" || status.kind === "paywalled") {
    const age = Date.now() - new Date(status.checkedAt).getTime();
    if (!Number.isFinite(age) || age > RECHECK_TTL_MS) return null;
  }
  if (
    status.kind === "failed" &&
    status.converterVersion !== SUBSTACK_CONVERTER_VERSION
  ) {
    // A newer converter gets to retry posts that previously failed.
    return null;
  }
  return status;
}

export async function setPostStatus(
  ref: SubstackRef,
  status: PostStatus,
): Promise<void> {
  write(`${ref.id}/status.json`, JSON.stringify(status));
}

/**
 * Clear the negative cache. Called on successful conversion so a
 * current-version converted.json and a negative status never coexist —
 * otherwise a stale "failed" status would shadow the fresh conversion on
 * the next plain (non-refresh) build and regress the committed artifact.
 */
export async function clearPostStatus(ref: SubstackRef): Promise<void> {
  rmSync(pathFor(`${ref.id}/status.json`), { force: true });
}

/**
 * Drop the cached post content (raw JSON, conversion, assets). Called when
 * a fetch classifies the post as not-found/paywalled: without this, the
 * pre-gating caches would outlive the status TTL and a later plain build
 * would resurrect content the publication has since gated or removed.
 */
export async function clearCachedPost(ref: SubstackRef): Promise<void> {
  rmSync(pathFor(`${ref.id}/post.json`), { force: true });
  rmSync(pathFor(`${ref.id}/converted.json`), { force: true });
  rmSync(pathFor(`${ref.id}/assets`), { recursive: true, force: true });
}

export async function getAsset(
  ref: SubstackRef,
  assetPath: string,
): Promise<Uint8Array | null> {
  return readBytes(`${ref.id}/assets/${assetPath}`);
}

export async function setAsset(
  ref: SubstackRef,
  assetPath: string,
  bytes: Uint8Array,
): Promise<void> {
  write(`${ref.id}/assets/${assetPath}`, bytes);
}
