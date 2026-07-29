import { describe, expect, it } from "vitest";
import { isStorableText } from "@/lib/content/exercise-view";
import {
  findUniqueContaining,
  findUniqueMatch,
  matchesSnippet,
  sentenceRangeText,
  sliceRangeText,
  snippetForRange,
} from "./match";
import {
  HIGHLIGHT_END_OF_SENTENCE,
  HIGHLIGHT_MAX_SNIPPET_CHARS,
} from "./types";

describe("sentenceRangeText", () => {
  const sentences = ["First one.", "Second one.", "Third one."];

  it("joins an in-bounds range with single spaces", () => {
    expect(sentenceRangeText(sentences, 1, 2)).toBe("First one. Second one.");
    expect(sentenceRangeText(sentences, 3, 3)).toBe("Third one.");
  });

  it("rejects ranges running off the block", () => {
    expect(sentenceRangeText(sentences, 3, 4)).toBeNull();
    expect(sentenceRangeText([], 1, 1)).toBeNull();
  });

  it("rejects ranges crossing a sparse gap (nested block indexes separately)", () => {
    const sparse: (string | undefined)[] = ["First.", undefined, "Third."];
    expect(sentenceRangeText(sparse, 1, 3)).toBeNull();
    expect(sentenceRangeText(sparse, 1, 1)).toBe("First.");
  });
});

describe("snippetForRange / matchesSnippet", () => {
  it("passes short text through unchanged", () => {
    expect(snippetForRange("A short passage.")).toBe("A short passage.");
  });

  it("caps at the max and never ends on a dangling space", () => {
    const words = Array(80).fill("word").join(" ");
    const snippet = snippetForRange(words);
    expect(snippet.length).toBeLessThanOrEqual(HIGHLIGHT_MAX_SNIPPET_CHARS);
    expect(snippet).toBe(snippet.trimEnd());
    // Deterministic: recomputing over the same range matches.
    expect(matchesSnippet(words, snippet)).toBe(true);
  });

  it("never ends on a lone surrogate when the cap bisects an astral char", () => {
    // "𝒜" (U+1D49C) is two UTF-16 units; park its high half exactly on the
    // cap boundary so a naive slice would cut the pair in half. A lone
    // surrogate would fail the server's isStorableText and make the passage
    // permanently unhighlightable.
    const rangeText =
      "x".repeat(HIGHLIGHT_MAX_SNIPPET_CHARS - 1) + "\u{1D49C} tail";
    const snippet = snippetForRange(rangeText);
    expect(isStorableText(snippet)).toBe(true);
    expect(snippet).toBe("x".repeat(HIGHLIGHT_MAX_SNIPPET_CHARS - 1));
    // Stable under recompute: the server re-derives the same snippet from
    // the same range text, so the create-time tripwire still passes.
    expect(matchesSnippet(rangeText, snippet)).toBe(true);
  });

  it("detects drifted text", () => {
    expect(matchesSnippet("The text has changed.", "The original text.")).toBe(
      false,
    );
    expect(matchesSnippet("anything", "")).toBe(false);
  });

  it("rejects a snippet that is a strict prefix of the range text", () => {
    // Same sStart, longer range (renumbering merged sentences): the stored
    // snippet no longer equals the recomputed one — must not paint.
    expect(matchesSnippet("First one. Second one.", "First one.")).toBe(false);
  });
});

describe("sliceRangeText", () => {
  const sentences = ["First one.", "Second one.", "Third one."];
  const span = (
    sStart: number,
    sEnd: number,
    startOffset: number,
    endOffset: number,
  ) => ({ sStart, sEnd, startOffset, endOffset });

  it("slices within a single sentence", () => {
    expect(sliceRangeText(sentences, span(1, 1, 6, 9))).toBe("one");
    expect(sliceRangeText(sentences, span(2, 2, 0, 6))).toBe("Second");
  });

  it("treats the sentinel as end-of-sentence", () => {
    expect(
      sliceRangeText(sentences, span(1, 1, 6, HIGHLIGHT_END_OF_SENTENCE)),
    ).toBe("one.");
    expect(
      sliceRangeText(sentences, span(1, 2, 0, HIGHLIGHT_END_OF_SENTENCE)),
    ).toBe("First one. Second one.");
  });

  it("slices across sentences from mid-word to mid-word", () => {
    expect(sliceRangeText(sentences, span(1, 3, 6, 5))).toBe(
      "one. Second one. Third",
    );
  });

  it("rejects out-of-bounds and empty slices", () => {
    expect(sliceRangeText(sentences, span(1, 1, 10, 11))).toBeNull();
    expect(sliceRangeText(sentences, span(1, 1, -1, 3))).toBeNull();
    expect(sliceRangeText(sentences, span(1, 1, 0, 11))).toBeNull();
    expect(sliceRangeText(sentences, span(1, 1, 4, 4))).toBeNull();
    expect(sliceRangeText(sentences, span(1, 1, 4, 3))).toBeNull();
    expect(sliceRangeText(sentences, span(3, 4, 0, 2))).toBeNull();
  });
});

describe("findUniqueContaining", () => {
  const blocks = [
    {
      anchor: "b-0001",
      sentences: ["Alpha beta gamma.", "Delta epsilon.", "Zeta eta."],
    },
    { anchor: "b-0002", sentences: ["Theta iota kappa."] },
  ];

  it("re-derives the span from a unique mid-word occurrence", () => {
    expect(findUniqueContaining(blocks, "eta gamma. Delta")).toEqual({
      blockAnchor: "b-0001",
      sStart: 1,
      sEnd: 2,
      startOffset: 7,
      endOffset: 5,
    });
  });

  it("emits the sentinel when an occurrence ends flush with a sentence", () => {
    expect(findUniqueContaining(blocks, "Zeta eta.")).toEqual({
      blockAnchor: "b-0001",
      sStart: 3,
      sEnd: 3,
      startOffset: 0,
      endOffset: HIGHLIGHT_END_OF_SENTENCE,
    });
  });

  it("refuses ambiguous snippets", () => {
    // "eta" occurs in beta, Zeta/eta, and Theta — many physical spots.
    expect(findUniqueContaining(blocks, "eta")).toBeNull();
  });

  it("refuses joiner-edged and absent snippets", () => {
    expect(findUniqueContaining(blocks, " Delta")).toBeNull();
    expect(findUniqueContaining(blocks, "nowhere at all")).toBeNull();
    expect(findUniqueContaining(blocks, "")).toBeNull();
  });

  it("does not match across a sparse hole", () => {
    const sparse = [
      { anchor: "b-0003", sentences: ["One two.", undefined, "Three four."] },
    ];
    expect(findUniqueContaining(sparse, "two. Three")).toBeNull();
    expect(findUniqueContaining(sparse, "Three four.")).toEqual({
      blockAnchor: "b-0003",
      sStart: 3,
      sEnd: 3,
      startOffset: 0,
      endOffset: HIGHLIGHT_END_OF_SENTENCE,
    });
  });
});

describe("findUniqueMatch", () => {
  const blocks = [
    { anchor: "b-0001", sentences: ["Alpha one.", "Beta two.", "Gamma three."] },
    { anchor: "b-0002", sentences: ["Delta four.", "Beta two."] },
  ];

  it("re-anchors a unique match after renumbering", () => {
    expect(findUniqueMatch(blocks, snippetForRange("Gamma three."), 1)).toEqual({
      blockAnchor: "b-0001",
      sStart: 3,
      sEnd: 3,
    });
    expect(
      findUniqueMatch(blocks, snippetForRange("Alpha one. Beta two."), 2),
    ).toEqual({ blockAnchor: "b-0001", sStart: 1, sEnd: 2 });
  });

  it("refuses ambiguous matches", () => {
    expect(findUniqueMatch(blocks, snippetForRange("Beta two."), 1)).toBeNull();
  });

  it("returns null when the text is gone", () => {
    expect(findUniqueMatch(blocks, snippetForRange("Removed text."), 1)).toBeNull();
    expect(findUniqueMatch(blocks, "", 1)).toBeNull();
  });

  it("only matches windows of the original span length", () => {
    expect(findUniqueMatch(blocks, snippetForRange("Alpha one."), 2)).toBeNull();
  });
});
