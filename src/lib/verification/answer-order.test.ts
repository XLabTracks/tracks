import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { exercises } from "@/content/exercises.data";
import { shuffleAnswerOptions } from "@/lib/shuffle";

import { DRILLS_FOUNDATIONS } from "./data/drills-foundations";
import { DRILLS_GAMES } from "./data/drills-games";
import { DRILLS_PRIMERS } from "./data/drills-primers";
import { QUICK_QUESTIONS } from "./data/policy-quick-check";
import { QUIZ } from "./data/protocol-actors";
import type { DrillDeck, DrillStep } from "./data/drills";

/**
 * The answer must not be findable from where it sits.
 *
 * This started as a measurement. Across the platform's question banks 86% of
 * correct answers were in slot A or B, and the individual banks were worse than
 * the average: one quiz ran four Bs out of five, the treaty phrase-quiz put a
 * correct option first in all fifteen of its questions, and the four-lever
 * matching offered its chips in the same order as its rows, so the whole thing
 * could be finished on the diagonal without reading it.
 *
 * Every one of those banks was written by Claude in this repo. The cause was
 * not authorial habit, it was that the exercises were built and never played:
 * the matching widget mapped one array over both its rows and its chips, which
 * produces a diagonal, and that is visible in ten seconds to anybody who tries
 * to solve their own exercise before shipping it.
 *
 * So the shuffle is the remedy and these tests are the discipline that was
 * missing — they ask, mechanically and every run, what the finished bank looks
 * like to somebody trying to beat it.
 */

const DECKS: DrillDeck[] = [DRILLS_PRIMERS, DRILLS_FOUNDATIONS, DRILLS_GAMES];

/** Prose that only makes sense if the options are in the order they were written. */
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
    // The trap this closes: a reveal reading "the second option is the planted
    // over-reading" is silently wrong the moment its options move. Three steps
    // in the benches are written that way and carry `fixedOrder`. A fourth
    // must either do the same or — better — name the option by what it says.
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
    // These were rewritten off letters ("A and C are real weaknesses") and on
    // to content. A letter is a position, and positions are display now.
    for (const q of QUICK_QUESTIONS) {
      expect(POSITIONAL.test(q.explanation), q.id).toBe(false);
      expect(/\b[A-E] and [A-E]\b/.test(q.explanation), q.id).toBe(false);
    }
  });
});

describe("the shuffle actually spreads the answers", () => {
  /** Where the correct option lands once the display order is applied. */
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
    // Compared against the spread these banks would have if every position
    // were equally likely — NOT against a flat percentage. A quarter of these
    // questions offer only two options, so slot A legitimately carries about a
    // third of all answers and a flat threshold would either pass everything
    // or fail on arithmetic.
    //
    // Expected share of slot k is the mean of 1/n over the questions that HAVE
    // a slot k. The tolerance is 12 points, about two standard errors at this
    // sample size: authored, slot A held 46% against an expected 32.6%, so the
    // state this test exists to prevent clears it, and ordinary luck does not
    // trip it.
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
    // The treaty quiz did exactly this — fifteen questions, fifteen answers
    // first. A bank-level check catches that even when the platform average
    // looks healthy.
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
  // Source checks, in the house style: the point is that a NEW renderer cannot
  // quietly render an authored order. Each of these lists options the learner
  // picks between, so each has to ask for the shuffle by name.
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
    // The one way to get this wrong that typecheck cannot see: comparing a
    // display position against a key that counts authored positions. Both of
    // these renderers destructure `from` — the authored index — and every
    // judgement they make is on it.
    for (const file of [
      "src/components/verification/kit/drill-deck.tsx",
      "src/components/mdx/reader/check.tsx",
    ]) {
      const src = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(src, file).toMatch(/\{\s*item[^}]*,\s*from\s*\}/);
    }
  });
});
