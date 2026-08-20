import type {
  DrillBench,
  DrillDeck,
  DrillMultiStep,
  DrillNumberStep,
  DrillTextStep,
} from "@/lib/verification/data/drills";

export type MarkVerdict = "caught" | "missed" | "false-flag" | "clean";

export interface MarkResult {
  verdict: MarkVerdict;
  marked: boolean;
}

export interface MultiScore {
  rows: MarkResult[];
  caught: number;
  missed: number;
  falseFlagged: number;
}

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

export interface NumberResult {
  value: number | null;
  inBand: boolean;
}

export function checkNumber(
  step: DrillNumberStep,
  raw: string,
): NumberResult {
  const value = raw.trim() === "" ? NaN : Number(raw);
  if (!Number.isFinite(value)) return { value: null, inBand: false };
  return { value, inBand: value >= step.min && value <= step.max };
}

export interface TextLint {
  ready: boolean;
  chars: number;
  bad: boolean;
  hint: string;
}

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

export type DrillProgress = Record<string, (boolean | undefined)[]>;

export function benchDone(progress: DrillProgress, bench: DrillBench): number {
  const flags = progress[bench.id] ?? [];
  return bench.steps.filter((_, i) => flags[i]).length;
}

export function firstOpenStep(progress: DrillProgress, bench: DrillBench): number {
  const flags = progress[bench.id] ?? [];
  const i = bench.steps.findIndex((_, k) => !flags[k]);
  return i === -1 ? bench.steps.length : i;
}

export function benchComplete(progress: DrillProgress, bench: DrillBench): boolean {
  return benchDone(progress, bench) >= bench.steps.length;
}

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

export function markStepDone(
  progress: DrillProgress,
  benchId: string,
  step: number,
): DrillProgress {
  const flags = [...(progress[benchId] ?? [])];
  flags[step] = true;
  return { ...progress, [benchId]: flags };
}

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
