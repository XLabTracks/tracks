import { getStore } from "@netlify/blobs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { ArxivId } from "./id";
import { CONVERTER_VERSION, type ConversionWarning, type TexMeta } from "./types";

/**
 * Cache layout in the site-scoped "arxiv-papers" Netlify Blobs store.
 * E-prints are immutable per pinned version, so entries never expire:
 *
 *   {id}/raw             decompressed e-print bytes (tar or bare .tex)
 *   {id}/converted.json  ConvertedPaper (checked against CONVERTER_VERSION)
 *   {id}/assets/{path}   figure bytes actually referenced by the HTML
 *   {id}/status.json     negative cache (pdf-only, too-large, failed, ...)
 *
 * In production and under `netlify dev`, Netlify Blobs backs this. Plain
 * `next dev` has no Blobs environment, so we fall back to a filesystem cache
 * under the OS temp dir. It MUST be filesystem-backed (not in-memory): the
 * page's server render and the asset route run in separate dev processes, so
 * an in-memory map would leave figures 404ing when the browser fetches them.
 */

export interface ConvertedPaper {
  html: string;
  warnings: ConversionWarning[];
  meta: TexMeta;
  assets: string[];
  converterVersion: number;
  createdAt: string;
}

export type PaperStatus =
  | { kind: "pdf-only" }
  | { kind: "too-large" }
  | { kind: "unsupported"; detail: string }
  | { kind: "not-found"; checkedAt: string }
  | { kind: "failed"; detail: string; converterVersion: number };

const NOT_FOUND_TTL_MS = 24 * 60 * 60 * 1000;

interface BlobBackend {
  getJSON(key: string): Promise<unknown | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getBytes(key: string): Promise<Uint8Array | null>;
  setBytes(key: string, value: Uint8Array): Promise<void>;
}

function netlifyBackend(): BlobBackend {
  const store = getStore({ name: "arxiv-papers", consistency: "strong" });
  return {
    async getJSON(key) {
      return (await store.get(key, { type: "json" })) ?? null;
    },
    async setJSON(key, value) {
      await store.setJSON(key, value);
    },
    async getBytes(key) {
      const buf = await store.get(key, { type: "arrayBuffer" });
      return buf ? new Uint8Array(buf) : null;
    },
    async setBytes(key, value) {
      // Copy into a fresh ArrayBuffer so typed-array views are handled.
      const copy = new Uint8Array(value);
      await store.set(key, copy.buffer as ArrayBuffer);
    },
  };
}

/**
 * Filesystem fallback for local dev without Blobs. Keys already encode a safe
 * relative path (validated id + sanitized asset path), so they map straight to
 * files. Shared across dev processes via the filesystem. Writes are idempotent
 * (immutable content), so concurrent writers are harmless; a torn read just
 * looks like a cache miss and re-converts.
 */
function filesystemBackend(): BlobBackend {
  const root =
    process.env.ARXIV_CACHE_DIR ?? join(tmpdir(), "tracks-arxiv-cache");
  const pathFor = (key: string) => join(root, key);
  const write = (key: string, data: string | Uint8Array) => {
    const p = pathFor(key);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, data);
  };
  return {
    async getJSON(key) {
      try {
        return JSON.parse(readFileSync(pathFor(key), "utf8"));
      } catch {
        return null;
      }
    },
    async setJSON(key, value) {
      write(key, JSON.stringify(value));
    },
    async getBytes(key) {
      try {
        return new Uint8Array(readFileSync(pathFor(key)));
      } catch {
        return null;
      }
    },
    async setBytes(key, value) {
      write(key, value);
    },
  };
}

let backend: BlobBackend | null = null;
let usingFilesystemFallback = false;

function getBackend(): BlobBackend {
  if (backend) return backend;
  try {
    backend = netlifyBackend();
  } catch {
    // No Blobs environment (plain `next dev` / unit tests).
    backend = filesystemBackend();
    usingFilesystemFallback = true;
    console.warn(
      "[arxiv] Netlify Blobs unavailable — caching papers under the OS temp " +
        "dir. Run `npx netlify dev` for the production-parity Blobs store.",
    );
  }
  return backend;
}

export function isUsingFilesystemFallback(): boolean {
  return usingFilesystemFallback;
}

export async function getRawEprint(id: ArxivId): Promise<Uint8Array | null> {
  return getBackend().getBytes(`${id.id}/raw`);
}

export async function setRawEprint(
  id: ArxivId,
  bytes: Uint8Array,
): Promise<void> {
  await getBackend().setBytes(`${id.id}/raw`, bytes);
}

export async function getConvertedPaper(
  id: ArxivId,
): Promise<ConvertedPaper | null> {
  const value = (await getBackend().getJSON(
    `${id.id}/converted.json`,
  )) as ConvertedPaper | null;
  if (!value || value.converterVersion !== CONVERTER_VERSION) return null;
  return value;
}

export async function setConvertedPaper(
  id: ArxivId,
  paper: ConvertedPaper,
): Promise<void> {
  await getBackend().setJSON(`${id.id}/converted.json`, paper);
}

/** Returns the effective status, treating stale not-found entries as absent. */
export async function getPaperStatus(id: ArxivId): Promise<PaperStatus | null> {
  const status = (await getBackend().getJSON(
    `${id.id}/status.json`,
  )) as PaperStatus | null;
  if (!status) return null;
  if (status.kind === "not-found") {
    const age = Date.now() - new Date(status.checkedAt).getTime();
    if (!Number.isFinite(age) || age > NOT_FOUND_TTL_MS) return null;
  }
  if (
    status.kind === "failed" &&
    status.converterVersion !== CONVERTER_VERSION
  ) {
    // A newer converter gets to retry papers that previously failed.
    return null;
  }
  return status;
}

export async function setPaperStatus(
  id: ArxivId,
  status: PaperStatus,
): Promise<void> {
  await getBackend().setJSON(`${id.id}/status.json`, status);
}

export async function getAsset(
  id: ArxivId,
  assetPath: string,
): Promise<Uint8Array | null> {
  return getBackend().getBytes(`${id.id}/assets/${assetPath}`);
}

export async function setAsset(
  id: ArxivId,
  assetPath: string,
  bytes: Uint8Array,
): Promise<void> {
  await getBackend().setBytes(`${id.id}/assets/${assetPath}`, bytes);
}
