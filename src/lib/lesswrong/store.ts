import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { LessWrongRef } from "./id";
import type { LessWrongPost } from "./fetch";
import { LESSWRONG_CONVERTER_VERSION, type ConvertedPost } from "./types";

/**
 * Authoring-time filesystem cache used by `npm run lesswrong:build` (and
 * unit tests) — the LessWrong mirror of src/lib/substack/store.ts. Posts
 * are mutable: while the cached post JSON lives, re-runs convert the same
 * source; `--refresh` (or OS eviction of the temp dir) refetches, picking
 * up author edits — the committed artifact is the durable pin either way.
 *
 *   {id}/post.json       raw post payload (title, authors, html body)
 *   {id}/converted.json  ConvertedPost (checked against LESSWRONG_CONVERTER_VERSION)
 *   {id}/assets/{path}   image bytes actually referenced by the HTML
 *   {id}/status.json     negative cache (not-found, failed)
 *
 * This never runs in the deployed app: the build script converts locally
 * and commits artifacts (src/content/lesswrong/, public/lesswrong/) that
 * the site reads. Lives under the OS temp dir by default; override with
 * LESSWRONG_CACHE_DIR.
 */

export type PostStatus =
  | { kind: "not-found"; checkedAt: string }
  | { kind: "failed"; detail: string; converterVersion: number };

/** Existence can change (drafts publish, posts undelete) — recheck daily. */
const RECHECK_TTL_MS = 24 * 60 * 60 * 1000;

const root = () =>
  process.env.LESSWRONG_CACHE_DIR ?? join(tmpdir(), "tracks-lesswrong-cache");

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

export async function getRawPost(
  ref: LessWrongRef,
): Promise<LessWrongPost | null> {
  return readJSON(`${ref.id}/post.json`) as LessWrongPost | null;
}

export async function setRawPost(
  ref: LessWrongRef,
  post: LessWrongPost,
): Promise<void> {
  write(`${ref.id}/post.json`, JSON.stringify(post));
}

export async function getConvertedPost(
  ref: LessWrongRef,
): Promise<ConvertedPost | null> {
  const value = readJSON(`${ref.id}/converted.json`) as ConvertedPost | null;
  if (!value || value.converterVersion !== LESSWRONG_CONVERTER_VERSION) {
    return null;
  }
  return value;
}

export async function setConvertedPost(
  ref: LessWrongRef,
  post: ConvertedPost,
): Promise<void> {
  write(`${ref.id}/converted.json`, JSON.stringify(post));
}

/** Returns the effective status, treating stale/superseded entries as absent. */
export async function getPostStatus(
  ref: LessWrongRef,
): Promise<PostStatus | null> {
  const status = readJSON(`${ref.id}/status.json`) as PostStatus | null;
  if (!status) return null;
  if (status.kind === "not-found") {
    const age = Date.now() - new Date(status.checkedAt).getTime();
    if (!Number.isFinite(age) || age > RECHECK_TTL_MS) return null;
  }
  if (
    status.kind === "failed" &&
    status.converterVersion !== LESSWRONG_CONVERTER_VERSION
  ) {
    // A newer converter gets to retry posts that previously failed.
    return null;
  }
  return status;
}

export async function setPostStatus(
  ref: LessWrongRef,
  status: PostStatus,
): Promise<void> {
  write(`${ref.id}/status.json`, JSON.stringify(status));
}

/**
 * Clear the negative cache. Called on successful conversion so a
 * current-version converted.json and a negative status never coexist.
 */
export async function clearPostStatus(ref: LessWrongRef): Promise<void> {
  rmSync(pathFor(`${ref.id}/status.json`), { force: true });
}

/**
 * Drop the cached post content. Called when a fetch classifies the post as
 * not-found: without this, the pre-removal caches would outlive the status
 * TTL and a later plain build would resurrect content the author deleted.
 */
export async function clearCachedPost(ref: LessWrongRef): Promise<void> {
  rmSync(pathFor(`${ref.id}/post.json`), { force: true });
  rmSync(pathFor(`${ref.id}/converted.json`), { force: true });
  rmSync(pathFor(`${ref.id}/assets`), { recursive: true, force: true });
}

export async function getAsset(
  ref: LessWrongRef,
  assetPath: string,
): Promise<Uint8Array | null> {
  return readBytes(`${ref.id}/assets/${assetPath}`);
}

export async function setAsset(
  ref: LessWrongRef,
  assetPath: string,
  bytes: Uint8Array,
): Promise<void> {
  write(`${ref.id}/assets/${assetPath}`, bytes);
}
