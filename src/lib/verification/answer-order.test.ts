import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { exercises } from "@/content/exercises.data";
import { shuffleAnswerOptions } from "@/lib/shuffle";

import { DRILLS_FOUNDATIONS } from "./data/drills-foundations";
import { DRILLS_GAMES } from "./data/drills-games";
import { DRILLS_INTEL_ASSESSMENT } from "./data/drills-intel-assessment";
import { DRILLS_INTEL_SIGNATURES } from "./data/drills-intel-signatures";
import { DRILLS_PRIMERS } from "./data/drills-primers";
import { QUICK_QUESTIONS } from "./data/policy-quick-check";
import { QUIZ } from "./data/protocol-actors";
import type { DrillDeck, DrillStep } from "./data/drills";

const DECKS: DrillDeck[] = [
  DRILLS_PRIMERS,
  DRILLS_FOUNDATIONS,
  DRILLS_GAMES,
  DRILLS_INTEL_SIGNATURES,
  DRILLS_INTEL_ASSESSMENT,
];

const POSITIONAL =
  /\b(the\s+(first|second|third|fourth|fifth|last|top|bottom)\s+(option|answer|choice))|(option\s+(one|two|three|four|five|[A-E]\b))/i;

function drillSteps(): { deck: string; bench: string; i: number; step: DrillStep }[] {
  return DECKS.flatMap((deck) =>
    deck.benches.flatMap((bench) =>
      bench.steps.map((step, i) => ({ deck: deck.id, bench: bench.id, i, step })),
    ),
  );
}

describe("prose never names an option by its position", () => {
  it("or the step opts out of shuffling, explicitly", () => {
    const offenders = drillSteps().filter(({ step }) => {
      const prose =
        step.type === "pick"
          ? step.why
          : step.type === "multi"
            ? (step.whyAll ?? "")
            : "";
      const fixed =
        (step.type === "pick" || step.type === "multi") && step.fixedOrder;
      return POSITIONAL.test(prose) && !fixed;
    });
    expect(offenders.map((o) => `${o.bench}#${o.i}`)).toEqual([]);
  });

  it("holds for the quick check's explanations too", () => {
    for (const q of QUICK_QUESTIONS) {
      expect(POSITIONAL.test(q.explanation), q.id).toBe(false);
      expect(/\b[A-E] and [A-E]\b/.test(q.explanation), q.id).toBe(false);
    }
  });
});

describe("the shuffle actually spreads the answers", () => {
  function slots(): { n: number; slot: number }[] {
    const out: { n: number; slot: number }[] = [];

    for (const ex of exercises) {
      if (!("options" in ex) || !Array.isArray(ex.correctOptionIds)) continue;
      if (ex.correctOptionIds.length !== 1) continue;
      const shown = shuffleAnswerOptions(ex.id, ex.options, (o) => o.label);
      out.push({
        n: ex.options.length,
        slot: shown.findIndex((s) => s.item.id === ex.correctOptionIds[0]),
      });
    }

    for (const q of QUICK_QUESTIONS) {
      const shown = shuffleAnswerOptions(q.id, q.choices, (c) => c.text);
      out.push({
        n: q.choices.length,
        slot: shown.findIndex((s) => s.item.id === q.answerId),
      });
    }

    for (const [id, entry] of Object.entries(QUIZ)) {
      const correct = entry.opts.filter((o) => o.correct);
      if (correct.length !== 1) continue;
      const shown = shuffleAnswerOptions(
        `protocol-actors:${id}`,
        entry.opts,
        (o) => o.text,
      );
      out.push({
        n: entry.opts.length,
        slot: shown.findIndex((s) => s.item.correct),
      });
    }

    for (const { bench, i, step } of drillSteps()) {
      if (step.type !== "pick" || step.fixedOrder) continue;
      const shown = shuffleAnswerOptions(`${bench}#${i}`, step.opts, (o) => o);
      out.push({
        n: step.opts.length,
        slot: shown.findIndex((s) => s.from === step.right),
      });
    }

    return out;
  }

  it("puts no slot far above what an even spread would give it", () => {
    const at = slots();
    expect(at.length).toBeGreaterThan(50);
    for (let slot = 0; slot < 5; slot++) {
      const observed = at.filter((r) => r.slot === slot).length / at.length;
      const expected =
        at.reduce((sum, r) => sum + (r.n > slot ? 1 / r.n : 0), 0) / at.length;
      expect(observed, `slot ${slot} (even spread would be ${(expected * 100).toFixed(1)}%)`)
        .toBeLessThan(expected + 0.12);
    }
  });

  it("no single bank puts every answer in one slot", () => {
    const perQuiz = Object.entries(QUIZ).map(([id, entry]) => {
      const shown = shuffleAnswerOptions(
        `protocol-actors:${id}`,
        entry.opts,
        (o) => o.text,
      );
      return shown.findIndex((s) => s.item.correct);
    });
    expect(new Set(perQuiz).size).toBeGreaterThan(1);
  });
});

describe("every answer surface goes through the shuffle", () => {
  const SURFACES = [
    "src/lib/content/exercise-view.ts",
    "src/components/verification/widgets/policy-quick-check.tsx",
    "src/components/verification/widgets/protocol-actors.tsx",
    "src/components/verification/widgets/whistleblower-levers.tsx",
    "src/components/verification/kit/drill-deck.tsx",
    "src/components/mdx/reader/check.tsx",
  ];

  for (const file of SURFACES) {
    it(`${file} shuffles`, () => {
      const src = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(src).toContain("shuffleAnswerOptions");
    });
  }

  it("keys the index-based banks on the authored index, not the shown one", () => {
    for (const file of [
      "src/components/verification/kit/drill-deck.tsx",
      "src/components/mdx/reader/check.tsx",
    ]) {
      const src = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(src, file).toMatch(/\{\s*item[^}]*,\s*from\s*\}/);
    }
  });
});
