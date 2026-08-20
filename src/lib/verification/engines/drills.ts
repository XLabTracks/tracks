/**
 * Pure engine for the drill benches: the four step types' judgements, plus the
 * per-bench/per-deck progress arithmetic the widget renders. The widget owns UI
 * state only — everything here is a total function over content + a learner's
 * answer, so it is unit-tested rather than clicked.
 *
 * The commit rules preserved from the source page:
 *  - `multi` with a numeric `need` may only be committed on exactly that many
 *    marks; with `need: "errors"` the count is part of the judgement, so any
 *    non-empty selection commits (marking nothing is not an answer);
 *  - `number` is a tolerance band, never an exact value — being inside the band
 *    is the only thing "correct" means for a Fermi estimate;
 *  - `text` has no key. Over the cap blocks the commit: the cap IS the drill.
 */
import type {
  DrillBench,
  DrillDeck,
  DrillMultiStep,
  DrillNumberStep,
  DrillTextStep,
} from "@/lib/verification/data/drills";

/* ---------------- multi ---------------- */

/** Per-item verdict on a committed mark-the-set step. */
export type MarkVerdict = "caught" | "missed" | "false-flag" | "clean";

export interface MarkResult {
  verdict: MarkVerdict;
  /** Whether the learner marked this item. */
  marked: boolean;
}

export interface MultiScore {
  rows: MarkResult[];
  caught: number;
  missed: number;
  falseFlagged: number;
}

/** Score a committed set of marks (indices into `step.items`). */
export function scoreMulti(
  step: DrillMultiStep,
  marked: ReadonlySet<number>,
): MultiScore {
  const rows = step.items.map((item, i) => {
    const isMarked = marked.has(i);
    const verdict: MarkVerdict = item.err
      ? isMarked
        ? "caught"
        : "missed"
      : isMarked
        ? "false-flag"
        : "clean";
    return { verdict, marked: isMarked };
  });
  return {
    rows,
    caught: rows.filter((r) => r.verdict === "caught").length,
    missed: rows.filter((r) => r.verdict === "missed").length,
    falseFlagged: rows.filter((r) => r.verdict === "false-flag").length,
  };
}

/** Whether a mark-the-set step may be committed, and the hint shown until it can. */
export function multiCommitState(
  step: DrillMultiStep,
  markedCount: number,
): { ready: boolean; hint: string } {
  if (typeof step.need === "number") {
    const ready = markedCount === step.need;
    return {
      ready,
      hint: ready
        ? "ready"
        : `marked ${markedCount} — mark exactly ${step.need}`,
    };
  }
  const ready = markedCount >= 1;
  return {
    ready,
    hint: ready ? `${markedCount} marked — commit when sure` : "mark at least one",
  };
}

/* ---------------- number ---------------- */

export interface NumberResult {
  /** Parsed value, or null when the field does not hold a number. */
  value: number | null;
  /** True only for a parsed value inside the tolerance band. */
  inBand: boolean;
}

/** Judge a typed estimate against the step's tolerance band (inclusive). */
export function checkNumber(
  step: DrillNumberStep,
  raw: string,
): NumberResult {
  const value = raw.trim() === "" ? NaN : Number(raw);
  if (!Number.isFinite(value)) return { value: null, inBand: false };
  return { value, inBand: value >= step.min && value <= step.max };
}

/* ---------------- text ---------------- */

export interface TextLint {
  ready: boolean;
  chars: number;
  /** True when the hint reports a rule violation rather than readiness. */
  bad: boolean;
  hint: string;
}

/** Length rule for a written commit — under the floor or over the cap blocks it. */
export function lintText(step: DrillTextStep, raw: string): TextLint {
  const chars = raw.trim().length;
  const under = chars < step.minLen;
  const over = step.maxLen !== undefined && chars > step.maxLen;
  const hint = under
    ? `under ${step.minLen} characters — a point you can’t state isn’t one`
    : over
      ? `${chars} / ${step.maxLen} characters — the cap is the drill; cut until it fits`
      : step.maxLen !== undefined
        ? `${chars} / ${step.maxLen} characters — ready`
        : "ready";
  return { ready: !under && !over, chars, bad: under || over, hint };
}

/* ---------------- progress ---------------- */

/** Completed-step flags, keyed by bench id. A sparse array is a valid value. */
export type DrillProgress = Record<string, (boolean | undefined)[]>;

/** Steps completed in one bench. */
export function benchDone(progress: DrillProgress, bench: DrillBench): number {
  const flags = progress[bench.id] ?? [];
  return bench.steps.filter((_, i) => flags[i]).length;
}

/** Index of the first unfinished step, or `steps.length` when the bench is done. */
export function firstOpenStep(progress: DrillProgress, bench: DrillBench): number {
  const flags = progress[bench.id] ?? [];
  const i = bench.steps.findIndex((_, k) => !flags[k]);
  return i === -1 ? bench.steps.length : i;
}

export function benchComplete(progress: DrillProgress, bench: DrillBench): boolean {
  return benchDone(progress, bench) >= bench.steps.length;
}

/** The first bench with unfinished steps, skipping `exceptId`, or null. */
export function nextOpenBench(
  progress: DrillProgress,
  deck: DrillDeck,
  exceptId?: string,
): DrillBench | null {
  return (
    deck.benches.find(
      (b) => b.id !== exceptId && !benchComplete(progress, b),
    ) ?? null
  );
}

export function deckComplete(progress: DrillProgress, deck: DrillDeck): boolean {
  return deck.benches.every((b) => benchComplete(progress, b));
}

/** Mark one step done, returning a new progress map (never mutates). */
export function markStepDone(
  progress: DrillProgress,
  benchId: string,
  step: number,
): DrillProgress {
  const flags = [...(progress[benchId] ?? [])];
  flags[step] = true;
  return { ...progress, [benchId]: flags };
}

/**
 * Drop progress the stored state can no longer describe: unknown bench ids, and
 * flags past a bench's current length. Stored progress outlives content edits,
 * and a stale array would otherwise report a bench as more than complete.
 */
export function pruneProgress(
  progress: DrillProgress,
  deck: DrillDeck,
): DrillProgress {
  const out: DrillProgress = {};
  for (const bench of deck.benches) {
    const flags = progress[bench.id];
    if (Array.isArray(flags)) {
      out[bench.id] = bench.steps.map((_, i) => (flags[i] ? true : undefined));
    }
  }
  return out;
}
