import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Point the fallback cache at an isolated temp dir before the store loads.
const cacheDir = mkdtempSync(join(tmpdir(), "arxiv-store-test-"));
process.env.ARXIV_CACHE_DIR = cacheDir;

const { parseArxivId } = await import("./id");
const store = await import("./store");

const id = parseArxivId("2301.12345v1")!;

describe("filesystem fallback store", () => {
  beforeAll(() => {
    // No Netlify Blobs env in vitest → filesystem fallback is selected.
    expect(store.isUsingFilesystemFallback).toBeTypeOf("function");
  });

  it("round-trips binary assets (shared across processes via disk)", async () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);
    await store.setAsset(id, "figs/a.png", bytes);
    expect(await store.getAsset(id, "figs/a.png")).toEqual(bytes);
    // A distinct process would read the same file — confirm the fallback is
    // engaged (not an in-memory map) by checking the flag it sets.
    expect(store.isUsingFilesystemFallback()).toBe(true);
  });

  it("round-trips converted JSON with the converter-version guard", async () => {
    await store.setConvertedPaper(id, {
      html: "<p>hi</p>",
      warnings: [],
      meta: { title: "T" },
      assets: [],
      converterVersion: (await import("./types")).CONVERTER_VERSION,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    const got = await store.getConvertedPaper(id);
    expect(got?.html).toBe("<p>hi</p>");
  });

  it("returns null for a missing key", async () => {
    const other = parseArxivId("2202.00001v1")!;
    expect(await store.getAsset(other, "nope.png")).toBeNull();
    expect(await store.getConvertedPaper(other)).toBeNull();
  });

  afterAll(() => {
    delete process.env.ARXIV_CACHE_DIR;
  });
});
