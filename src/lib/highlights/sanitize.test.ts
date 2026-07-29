import { describe, expect, it } from "vitest";
import { sanitizeHighlightInput, sanitizeHighlightNote } from "./sanitize";
import {
  HIGHLIGHT_MAX_BLOCKS,
  HIGHLIGHT_MAX_NOTE_CHARS,
  HIGHLIGHT_MAX_SENTENCE_SPAN,
  HIGHLIGHT_MAX_SNIPPET_CHARS,
} from "./types";

const span = {
  blockAnchor: "b-0042",
  sStart: 2,
  sEnd: 4,
  startOffset: 0,
  endOffset: -1,
  snippet: "The selected passage text.",
};

const valid = {
  spans: [span],
  note: "worth remembering",
  convVersion: 21,
};

/** Shorthand: the valid payload with one span field overridden. */
const withSpan = (patch: Record<string, unknown>) => ({
  ...valid,
  spans: [{ ...span, ...patch }],
});

describe("sanitizeHighlightInput", () => {
  it("accepts a well-formed payload", () => {
    expect(sanitizeHighlightInput(valid)).toEqual(valid);
  });

  it("accepts a multi-block group with distinct anchors", () => {
    const multi = {
      ...valid,
      spans: [span, { ...span, blockAnchor: "b-0043" }],
    };
    expect(sanitizeHighlightInput(multi)).toEqual(multi);
  });

  it("rejects duplicate anchors within one gesture", () => {
    expect(
      sanitizeHighlightInput({ ...valid, spans: [span, { ...span }] }),
    ).toBeNull();
  });

  it("caps the span count", () => {
    const spans = Array.from({ length: HIGHLIGHT_MAX_BLOCKS + 1 }, (_, i) => ({
      ...span,
      blockAnchor: `b-${String(i).padStart(4, "0")}`,
    }));
    expect(sanitizeHighlightInput({ ...valid, spans })).toBeNull();
    expect(
      sanitizeHighlightInput({ ...valid, spans: spans.slice(0, -1) }),
    ).not.toBeNull();
    expect(sanitizeHighlightInput({ ...valid, spans: [] })).toBeNull();
  });

  it("accepts a missing/null note as null", () => {
    expect(sanitizeHighlightInput({ ...valid, note: undefined })?.note).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, note: null })?.note).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, note: "  " })?.note).toBeNull();
  });

  it("rejects non-object payloads and non-array spans", () => {
    expect(sanitizeHighlightInput(null)).toBeNull();
    expect(sanitizeHighlightInput("b-0042")).toBeNull();
    expect(sanitizeHighlightInput([valid])).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, spans: span })).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, spans: ["x"] })).toBeNull();
  });

  it("rejects malformed block anchors", () => {
    for (const blockAnchor of ["b-", "p-0042", "b-00x2", "b-1234567", "B-0042"]) {
      expect(sanitizeHighlightInput(withSpan({ blockAnchor }))).toBeNull();
    }
  });

  it("rejects bad character offsets", () => {
    expect(sanitizeHighlightInput(withSpan({ startOffset: -1 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ startOffset: 1.5 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ startOffset: 10_001 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ endOffset: 0 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ endOffset: -2 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ endOffset: 10_001 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ endOffset: undefined }))).toBeNull();
    // Single-sentence spans must slice forward and non-empty.
    expect(
      sanitizeHighlightInput(
        withSpan({ sStart: 2, sEnd: 2, startOffset: 5, endOffset: 5 }),
      ),
    ).toBeNull();
    expect(
      sanitizeHighlightInput(
        withSpan({ sStart: 2, sEnd: 2, startOffset: 5, endOffset: 9 }),
      ),
    ).not.toBeNull();
    // The sentinel is fine even within one sentence.
    expect(
      sanitizeHighlightInput(
        withSpan({ sStart: 2, sEnd: 2, startOffset: 5, endOffset: -1 }),
      ),
    ).not.toBeNull();
  });

  it("rejects bad sentence ranges", () => {
    expect(sanitizeHighlightInput(withSpan({ sStart: 0 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ sStart: 5, sEnd: 4 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ sStart: 1.5, sEnd: 2 }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ sEnd: 10_001 }))).toBeNull();
    expect(
      sanitizeHighlightInput(
        withSpan({ sStart: 1, sEnd: HIGHLIGHT_MAX_SENTENCE_SPAN + 1 }),
      ),
    ).toBeNull();
    expect(
      sanitizeHighlightInput(
        withSpan({ sStart: 1, sEnd: HIGHLIGHT_MAX_SENTENCE_SPAN }),
      ),
    ).not.toBeNull();
  });

  it("rejects bad snippets", () => {
    expect(sanitizeHighlightInput(withSpan({ snippet: "" }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ snippet: "   " }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ snippet: 42 }))).toBeNull();
    expect(
      sanitizeHighlightInput(
        withSpan({ snippet: "x".repeat(HIGHLIGHT_MAX_SNIPPET_CHARS + 1) }),
      ),
    ).toBeNull();
    // Postgres can't store NUL bytes or lone surrogates. Escapes, not
    // literals — a literal NUL turns this file binary for git.
    expect(sanitizeHighlightInput(withSpan({ snippet: "a\u0000b" }))).toBeNull();
    expect(sanitizeHighlightInput(withSpan({ snippet: "a\uD800b" }))).toBeNull();
  });

  it("rejects oversized or unstorable notes", () => {
    expect(
      sanitizeHighlightInput({
        ...valid,
        note: "x".repeat(HIGHLIGHT_MAX_NOTE_CHARS + 1),
      }),
    ).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, note: "a\u0000b" })).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, note: 42 })).toBeNull();
  });

  it("rejects bad converter versions", () => {
    expect(sanitizeHighlightInput({ ...valid, convVersion: 0 })).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, convVersion: "21" })).toBeNull();
    expect(sanitizeHighlightInput({ ...valid, convVersion: 2.5 })).toBeNull();
  });
});

describe("sanitizeHighlightNote", () => {
  it("passes valid notes and clears on null/whitespace", () => {
    expect(sanitizeHighlightNote("a note")).toBe("a note");
    expect(sanitizeHighlightNote(null)).toBeNull();
    expect(sanitizeHighlightNote("   ")).toBeNull();
  });

  it("rejects invalid values with undefined", () => {
    expect(sanitizeHighlightNote(42)).toBeUndefined();
    expect(
      sanitizeHighlightNote("x".repeat(HIGHLIGHT_MAX_NOTE_CHARS + 1)),
    ).toBeUndefined();
    expect(sanitizeHighlightNote("a\u0000b")).toBeUndefined();
  });
});
