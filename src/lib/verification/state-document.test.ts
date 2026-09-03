import { describe, expect, it } from "vitest";

import {
  mergeVerificationStateDocuments,
  normalizeVerificationStateDocument,
} from "./state-document";

describe("verification state documents", () => {
  it("merges concurrent edits independently by store", () => {
    const current = {
      version: 2,
      progress: { units: { intro: 100 } },
      notebook: { text: "server notebook", updatedAt: 300 },
      highlights: null,
      memos: null,
      fieldMap: { nodes: [], updatedAt: 120 },
      stamps: { progress: 100, notebook: 300, highlights: 0, memos: 0, fieldMap: 120 },
      updatedAt: 300,
    };
    const incoming = {
      version: 2,
      progress: { units: { intro: 100 } },
      notebook: { text: "stale notebook", updatedAt: 200 },
      highlights: null,
      memos: null,
      fieldMap: { nodes: [{ id: "new" }], updatedAt: 400 },
      stamps: { progress: 100, notebook: 200, highlights: 0, memos: 0, fieldMap: 400 },
      updatedAt: 400,
    };

    const result = mergeVerificationStateDocuments(current, incoming);

    expect(result.document.notebook).toEqual(current.notebook);
    expect(result.document.fieldMap).toEqual(incoming.fieldMap);
    expect(result.document.stamps).toMatchObject({ notebook: 300, fieldMap: 400 });
  });

  it("does not let a stale full document overwrite any newer store", () => {
    const current = {
      version: 2,
      progress: { updatedAt: 50 },
      notebook: { updatedAt: 60 },
      highlights: { updatedAt: 70 },
      memos: { _updatedAt: 80 },
      fieldMap: { updatedAt: 90 },
      stamps: { progress: 50, notebook: 60, highlights: 70, memos: 80, fieldMap: 90 },
      updatedAt: 90,
    };
    const stale = {
      version: 2,
      progress: { updatedAt: 10 },
      notebook: { updatedAt: 10 },
      highlights: { updatedAt: 10 },
      memos: { _updatedAt: 10 },
      fieldMap: { updatedAt: 10 },
      stamps: { progress: 10, notebook: 10, highlights: 10, memos: 10, fieldMap: 10 },
      updatedAt: 10,
    };

    const result = mergeVerificationStateDocuments(current, stale);
    expect(result.changed).toBe(false);
    expect(result.acceptedStores).toEqual([]);
  });

  it("upgrades legacy stores using nested stamps and the old global fallback", () => {
    const normalized = normalizeVerificationStateDocument({
      progress: { units: { one: 25, two: 40 } },
      notebook: { text: "undated legacy note" },
      updatedAt: 75,
    });

    expect(normalized.version).toBe(2);
    expect(normalized.stamps.progress).toBe(40);
    expect(normalized.stamps.notebook).toBe(75);
    expect(normalized.updatedAt).toBe(75);
  });

  it("merges widget states key by key, newest wins", () => {
    const current = {
      version: 2,
      widgets: {
        "v-standard-of-proof:v1": { value: { a: 1 }, updatedAt: 100 },
        "v-missing-board:v1": { value: { b: 1 }, updatedAt: 500 },
      },
    };
    const incoming = {
      version: 2,
      widgets: {
        "v-standard-of-proof:v1": { value: { a: 2 }, updatedAt: 200 },
        "v-missing-board:v1": { value: { b: 0 }, updatedAt: 400 },
        "v-drills:intel:v1": { value: null, updatedAt: 300 },
      },
    };

    const result = mergeVerificationStateDocuments(current, incoming);

    expect(result.acceptedStores).toEqual(["widgets"]);
    expect(result.document.widgets).toEqual({
      "v-standard-of-proof:v1": { value: { a: 2 }, updatedAt: 200 },
      "v-missing-board:v1": { value: { b: 1 }, updatedAt: 500 },
      "v-drills:intel:v1": { value: null, updatedAt: 300 },
    });
    expect(result.document.stamps.widgets).toBe(500);
    expect(mergeVerificationStateDocuments(result.document, current).changed).toBe(false);
  });

  it("accepts an equal-stamped retry idempotently", () => {
    const value = {
      version: 2,
      progress: null,
      notebook: { text: "same", updatedAt: 10 },
      highlights: null,
      memos: null,
      fieldMap: null,
      widgets: null,
      stamps: { progress: 0, notebook: 10, highlights: 0, memos: 0, fieldMap: 0, widgets: 0 },
      updatedAt: 10,
    };

    const result = mergeVerificationStateDocuments(value, value);
    expect(result.changed).toBe(false);
    expect(result.document).toEqual(value);
  });
});
