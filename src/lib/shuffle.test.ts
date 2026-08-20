import { describe, expect, it } from "vitest";

import {
  isBinaryPair,
  isTerminalOption,
  seededPermutation,
  seededShuffle,
  shuffleAnswerOptions,
} from "./shuffle";

const LETTERS = ["a", "b", "c", "d", "e"];

describe("seededPermutation", () => {
  it("is a permutation, and the same one every time", () => {
    for (const n of [2, 3, 4, 5, 9]) {
      const first = seededPermutation("q-1", n);
      expect([...first].sort((x, y) => x - y)).toEqual(
        Array.from({ length: n }, (_, i) => i),
      );
      expect(seededPermutation("q-1", n)).toEqual(first);
    }
  });

  it("gives different questions different orders", () => {
    const a = seededPermutation("q-1", 4);
    const b = seededPermutation("q-2", 4);
    const c = seededPermutation("q-3", 4);
    expect([a, b, c].map((p) => p.join(""))).toHaveLength(3);
    expect(new Set([a.join(""), b.join(""), c.join("")]).size).toBeGreaterThan(1);
  });

  it("does not depend on the machine it runs on", () => {
    // Pinned literally. If a refactor changes the hash or the generator, every
    // learner's options silently reorder — which is survivable, but it must be
    // a decision somebody made, not a side effect. Regenerate deliberately.
    expect(seededPermutation("check-anchor", 4)).toEqual([0, 3, 2, 1]);
    expect(seededPermutation("check-anchor", 5)).toEqual([0, 4, 3, 2, 1]);
  });
});

describe("seededShuffle", () => {
  it("returns every item exactly once, carrying its authored index", () => {
    const out = seededShuffle("q", LETTERS);
    expect(out.map((o) => o.item).sort()).toEqual([...LETTERS].sort());
    for (const { item, from } of out) expect(LETTERS[from]).toBe(item);
  });

  it("leaves a list of one or zero alone", () => {
    expect(seededShuffle("q", [])).toEqual([]);
    expect(seededShuffle("q", ["only"])).toEqual([{ item: "only", from: 0 }]);
  });

  it("keeps pinned options at their authored position", () => {
    const items = ["a", "b", "c", "None of the above"];
    const out = seededShuffle("q", items, (t) => isTerminalOption(t));
    expect(out[3]).toEqual({ item: "None of the above", from: 3 });
    expect(out.slice(0, 3).map((o) => o.item).sort()).toEqual(["a", "b", "c"]);
  });

  it("still moves the others when one is pinned", () => {
    // Pinning must not degrade into "nothing moves" — that would silently
    // reintroduce the bias for any question with a terminal option.
    const items = ["a", "b", "c", "None of the above"];
    const out = seededShuffle("shift-me", items, (t) => isTerminalOption(t));
    expect(out.map((o) => o.item).join()).not.toBe(items.join());
  });

  it("does nothing when every option but one is pinned", () => {
    const out = seededShuffle("q", ["a", "b"], (_, i) => i === 0);
    expect(out.map((o) => o.from)).toEqual([0, 1]);
  });
});

describe("isTerminalOption", () => {
  it("catches the standard phrasings", () => {
    for (const t of [
      "None of the above",
      "none of these",
      "All of the above.",
      "Neither of them",
      "  Both of the above",
    ])
      expect(isTerminalOption(t), t).toBe(true);
  });

  it("does not catch ordinary answers that merely start with the words", () => {
    for (const t of [
      "None of the reports reached the regulator",
      "All of the compute was accounted for",
      "Above the reporting threshold",
    ])
      expect(isTerminalOption(t), t).toBe(false);
  });
});

describe("isBinaryPair", () => {
  it("recognises the conventional pairs in either order", () => {
    expect(isBinaryPair(["True", "False"])).toBe(true);
    expect(isBinaryPair(["false", "true"])).toBe(true);
    expect(isBinaryPair(["Yes", "No"])).toBe(true);
  });

  it("is not fooled by a two-option question that is not one", () => {
    expect(isBinaryPair(["The developer", "The auditor"])).toBe(false);
    expect(isBinaryPair(["True", "False", "Cannot tell"])).toBe(false);
  });
});

describe("shuffleAnswerOptions", () => {
  it("leaves true/false alone", () => {
    const out = shuffleAnswerOptions("q", ["True", "False"], (t) => t);
    expect(out.map((o) => o.from)).toEqual([0, 1]);
  });

  it("shuffles a real four-option question and pins its terminal option", () => {
    const items = ["first", "second", "third", "None of the above"];
    const out = shuffleAnswerOptions("some-question", items, (t) => t);
    expect(out.at(-1)!.item).toBe("None of the above");
    expect(out.map((o) => o.item).sort()).toEqual([...items].sort());
  });

  it("spreads the answer across the slots instead of leaving it at the top", () => {
    // The property the whole module exists for, stated as a test: take a bank
    // of questions that all had their answer authored first, and check that
    // after shuffling the answer is no longer reliably first.
    const positions = Array.from({ length: 60 }, (_, i) => {
      const out = shuffleAnswerOptions(
        `question-${i}`,
        ["ANSWER", "b", "c", "d"],
        (t) => t,
      );
      return out.findIndex((o) => o.from === 0);
    });
    const inSlotA = positions.filter((p) => p === 0).length;
    expect(inSlotA).toBeLessThan(positions.length / 2);
    expect(new Set(positions).size).toBe(4);
  });
});
