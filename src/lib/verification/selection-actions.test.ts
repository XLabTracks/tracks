import { describe, it, expect } from "vitest";
import {
  actionsFor,
  wordCount,
  MIN_CHARS,
  SHORT_WORDS,
  type SelectionFacts,
} from "./selection-actions";

const facts = (over: Partial<SelectionFacts> = {}): SelectionFacts => ({
  text: "compute threshold",
  inReading: true,
  highlightSupported: true,
  ...over,
});

describe("actionsFor", () => {
  it("offers all three on a short phrase in the reading column", () => {
    expect(actionsFor(facts())).toEqual(["highlight", "define", "notebook"]);
  });

  it("drops Define once the selection is a passage rather than a term", () => {
    const long = "a".concat(" b".repeat(SHORT_WORDS));
    expect(wordCount(long)).toBe(SHORT_WORDS + 1);
    expect(actionsFor(facts({ text: long }))).toEqual(["highlight", "notebook"]);
    const atBound = "a".concat(" b".repeat(SHORT_WORDS - 1));
    expect(actionsFor(facts({ text: atBound }))).toContain("define");
  });

  it("offers Remove highlight instead of Highlight over an existing one", () => {
    expect(actionsFor(facts({ overlapsHighlight: true }))).toEqual([
      "unhighlight",
      "define",
      "notebook",
    ]);
    for (const over of [true, false]) {
      const got = actionsFor(facts({ overlapsHighlight: over }));
      expect(got.includes("highlight") && got.includes("unhighlight")).toBe(false);
    }
  });

  it("offers neither highlight action where the browser cannot paint one", () => {
    expect(
      actionsFor(facts({ highlightSupported: false, overlapsHighlight: true })),
    ).toEqual(["define", "notebook"]);
  });

  it("drops Highlight where the browser cannot paint one", () => {
    expect(actionsFor(facts({ highlightSupported: false }))).toEqual([
      "define",
      "notebook",
    ]);
  });

  it("offers nothing outside the reading column", () => {
    expect(actionsFor(facts({ inReading: false }))).toEqual([]);
  });

  it("offers nothing for a stray click-drag", () => {
    expect(actionsFor(facts({ text: "" }))).toEqual([]);
    expect(actionsFor(facts({ text: "  " }))).toEqual([]);
    expect(actionsFor(facts({ text: "a".repeat(MIN_CHARS - 1) }))).toEqual([]);
    expect(actionsFor(facts({ text: "a".repeat(MIN_CHARS) })).length).toBe(3);
  });

  it("keeps the notebook available at any length past the minimum", () => {
    const essay = "word ".repeat(400);
    expect(actionsFor(facts({ text: essay }))).toContain("notebook");
  });

  it("never returns a duplicate action", () => {
    for (const t of ["term", "a longer run of words than the bound allows"]) {
      for (const hl of [true, false]) {
        const got = actionsFor(facts({ text: t, highlightSupported: hl }));
        expect(new Set(got).size).toBe(got.length);
      }
    }
  });
});

describe("wordCount", () => {
  it("counts words across any run of whitespace, and nothing for empty", () => {
    expect(wordCount("one")).toBe(1);
    expect(wordCount("  one   two\nthree\t four ")).toBe(4);
    expect(wordCount("")).toBe(0);
    expect(wordCount("   ")).toBe(0);
  });
});
