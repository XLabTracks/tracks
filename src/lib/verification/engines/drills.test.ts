import { describe, expect, it } from "vitest";
import {
  benchComplete,
  benchDone,
  checkNumber,
  deckComplete,
  firstOpenStep,
  lintText,
  markStepDone,
  multiCommitState,
  nextOpenBench,
  pruneProgress,
  scoreMulti,
  type DrillProgress,
} from "./drills";
import type {
  DrillBench,
  DrillDeck,
  DrillMultiStep,
  DrillNumberStep,
  DrillTextStep,
} from "../data/drills";
import { DRILLS_FOUNDATIONS } from "../data/drills-foundations";
import { DRILLS_GAMES } from "../data/drills-games";
import { DRILLS_PRIMERS } from "../data/drills-primers";
import { DRILLS_SUPPLY_CHAIN } from "../data/drills-supply-chain";

const DECKS = [
  DRILLS_FOUNDATIONS,
  DRILLS_PRIMERS,
  DRILLS_SUPPLY_CHAIN,
  DRILLS_GAMES,
];

const multi: DrillMultiStep = {
  type: "multi",
  q: "Mark the three.",
  need: 3,
  items: [
    { t: "a", err: true, note: "" },
    { t: "b", err: false, note: "" },
    { t: "c", err: true, note: "" },
    { t: "d", err: true, note: "" },
  ],
};

const numberStep: DrillNumberStep = {
  type: "number",
  q: "How many days?",
  min: 120,
  max: 170,
  reveal: "",
};

const capped: DrillTextStep = {
  type: "text",
  q: "Two sentences.",
  minLen: 40,
  maxLen: 300,
  reveal: "",
};

function bench(id: string, steps: number): DrillBench {
  return {
    id,
    label: id,
    name: id,
    kicker: "",
    time: "",
    steps: Array.from({ length: steps }, () => ({ ...multi })),
  };
}

const deck: DrillDeck = {
  id: "d",
  title: "d",
  blurb: "",
  benches: [bench("one", 2), bench("two", 2)],
};

describe("scoreMulti", () => {
  it("splits marks into caught / missed / false-flagged", () => {
    const s = scoreMulti(multi, new Set([0, 1]));
    expect(s.caught).toBe(1); // a
    expect(s.missed).toBe(2); // c, d
    expect(s.falseFlagged).toBe(1); // b
    expect(s.rows.map((r) => r.verdict)).toEqual([
      "caught",
      "false-flag",
      "missed",
      "missed",
    ]);
  });

  it("a perfect set has no misses and no false flags", () => {
    const s = scoreMulti(multi, new Set([0, 2, 3]));
    expect([s.caught, s.missed, s.falseFlagged]).toEqual([3, 0, 0]);
  });
});

describe("multiCommitState", () => {
  it("an exact-count step commits only on that count", () => {
    expect(multiCommitState(multi, 2).ready).toBe(false);
    expect(multiCommitState(multi, 3).ready).toBe(true);
    expect(multiCommitState(multi, 4).ready).toBe(false);
    expect(multiCommitState(multi, 2).hint).toContain("exactly 3");
  });

  it("a mark-the-errors step commits on any non-empty selection", () => {
    const errors: DrillMultiStep = { ...multi, need: "errors" };
    expect(multiCommitState(errors, 0).ready).toBe(false);
    expect(multiCommitState(errors, 1).ready).toBe(true);
    expect(multiCommitState(errors, 4).ready).toBe(true);
  });
});

describe("checkNumber", () => {
  it("accepts anything inside the band, bounds included", () => {
    expect(checkNumber(numberStep, "145").inBand).toBe(true);
    expect(checkNumber(numberStep, "120").inBand).toBe(true);
    expect(checkNumber(numberStep, "170").inBand).toBe(true);
  });
  it("rejects outside the band but still reports the value", () => {
    expect(checkNumber(numberStep, "119")).toEqual({ value: 119, inBand: false });
  });
  it("reports a non-number as no value at all", () => {
    expect(checkNumber(numberStep, "")).toEqual({ value: null, inBand: false });
    expect(checkNumber(numberStep, "soon")).toEqual({ value: null, inBand: false });
  });
});

describe("lintText", () => {
  it("blocks under the floor", () => {
    const l = lintText(capped, "too short");
    expect(l.ready).toBe(false);
    expect(l.bad).toBe(true);
  });
  it("blocks over the cap", () => {
    const l = lintText(capped, "x".repeat(301));
    expect(l.ready).toBe(false);
    expect(l.hint).toContain("cut until it fits");
  });
  it("counts trimmed characters and passes inside the rule", () => {
    const l = lintText(capped, "  " + "x".repeat(120) + "  ");
    expect(l.chars).toBe(120);
    expect(l.ready).toBe(true);
    expect(l.bad).toBe(false);
  });
  it("an uncapped step only has a floor", () => {
    const uncapped: DrillTextStep = { ...capped, maxLen: undefined };
    expect(lintText(uncapped, "x".repeat(5000)).ready).toBe(true);
  });
});

describe("progress", () => {
  it("counts done steps and finds the first open one", () => {
    let p: DrillProgress = {};
    expect(firstOpenStep(p, deck.benches[0]!)).toBe(0);
    p = markStepDone(p, "one", 0);
    expect(benchDone(p, deck.benches[0]!)).toBe(1);
    expect(firstOpenStep(p, deck.benches[0]!)).toBe(1);
    p = markStepDone(p, "one", 1);
    expect(benchComplete(p, deck.benches[0]!)).toBe(true);
    expect(firstOpenStep(p, deck.benches[0]!)).toBe(2);
  });

  it("markStepDone never mutates the map it was given", () => {
    const p: DrillProgress = {};
    markStepDone(p, "one", 0);
    expect(p).toEqual({});
  });

  it("a step completed out of order leaves the earlier one open", () => {
    const p = markStepDone({}, "one", 1);
    expect(benchDone(p, deck.benches[0]!)).toBe(1);
    expect(firstOpenStep(p, deck.benches[0]!)).toBe(0);
  });

  it("nextOpenBench skips the finished ones and the current one", () => {
    let p: DrillProgress = {};
    expect(nextOpenBench(p, deck)?.id).toBe("one");
    expect(nextOpenBench(p, deck, "one")?.id).toBe("two");
    p = markStepDone(markStepDone(p, "two", 0), "two", 1);
    expect(nextOpenBench(p, deck, "one")).toBeNull();
    expect(deckComplete(p, deck)).toBe(false);
    p = markStepDone(markStepDone(p, "one", 0), "one", 1);
    expect(deckComplete(p, deck)).toBe(true);
  });

  it("pruneProgress drops unknown benches and flags past the current length", () => {
    const stale: DrillProgress = {
      one: [true, true, true, true],
      retired: [true],
    };
    const p = pruneProgress(stale, deck);
    expect(Object.keys(p)).toEqual(["one"]);
    expect(benchDone(p, deck.benches[0]!)).toBe(2);
    expect(deckComplete(p, deck)).toBe(false);
  });
});

describe("ported deck content", () => {
  it("every step is well-formed", () => {
    for (const d of DECKS) {
      expect(d.benches.length, d.id + " has no benches").toBeGreaterThan(0);
      for (const b of d.benches) {
        expect(b.steps.length, b.id + " has no steps").toBeGreaterThan(0);
        for (const [i, step] of b.steps.entries()) {
          const where = `${d.id}/${b.id}/${i}`;
          expect(step.q, where + " has no prompt").toBeTruthy();
          if (step.type === "pick") {
            expect(step.opts.length, where).toBeGreaterThan(1);
            expect(step.right, where + " key out of range").toBeLessThan(
              step.opts.length,
            );
            expect(step.right).toBeGreaterThanOrEqual(0);
            expect(step.why, where + " has no reveal").toBeTruthy();
          } else if (step.type === "multi") {
            expect(step.items.length, where).toBeGreaterThan(1);
            const errs = step.items.filter((it) => it.err).length;
            expect(errs, where + " has nothing to mark").toBeGreaterThan(0);
            if (typeof step.need === "number") expect(step.need).toBe(errs);
          } else if (step.type === "number") {
            expect(step.min, where + " band is inverted").toBeLessThan(step.max);
            expect(step.reveal, where).toBeTruthy();
          } else {
            expect(step.minLen, where).toBeGreaterThan(0);
            if (step.maxLen !== undefined)
              expect(step.maxLen, where).toBeGreaterThan(step.minLen);
            expect(step.reveal, where).toBeTruthy();
          }
        }
      }
    }
  });

  it("bench ids are unique inside a deck, and deck ids across decks", () => {
    const deckIds = DECKS.map((d) => d.id);
    expect(new Set(deckIds).size).toBe(deckIds.length);
    for (const d of DECKS) {
      const ids = d.benches.map((b) => b.id);
      expect(new Set(ids).size, d.id + " has duplicate bench ids").toBe(
        ids.length,
      );
    }
  });

  it("carries no pointer to the source page's module numbering", () => {
    for (const d of DECKS) {
      const text = JSON.stringify(d);
      expect(text, d.id + " still names a source module").not.toMatch(
        /Module [0-9]|Modules 2\.3|\b2\.3’s\b|\b4\.2 regime\b/,
      );
    }
  });
});
