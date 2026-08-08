/**
 * Pure engine for "The Distiller" Verification widget: the run's state shape,
 * the phase gate, and the delivery scoring. Ported from the standalone
 * prototype's module-globals (tracksprogramplayground `site/the-distiller.html`)
 * with every DOM and closure read threaded in as an argument, so the whole of
 * what the exercise judges is unit-testable and the component only draws.
 *
 * Two things here are load-bearing beyond their size:
 *  - `graphFaults` is the authoring guardrail (see the data file's header), run
 *    as a test rather than a console assert.
 *  - `sanitizeState` is what lets a content revision ship without breaking a
 *    returning learner's saved run: ids that no longer exist are dropped, not
 *    crashed on. Anything added to `DistillerRun` needs a matching default in
 *    `freshRun`, or a run saved before the change loads with it undefined.
 */

import type {
  DistillerActorGroup,
  DistillerBlock,
  DistillerReport,
  DistillerStakeholder,
} from "../data/context-distiller";

export const DISTILLER_PHASES = [
  "Clip",
  "Distil",
  "Upstream",
  "Downstream",
  "Thread",
] as const;
export type DistillerPhase = 1 | 2 | 3 | 4 | 5;

/** A distilled point: what a core block becomes once compressed. */
export interface DistillerSegment {
  id: string;
  text: string;
  blockId: string;
  page: number;
  sec: string;
}

export interface DistillerIndex {
  blockById: Record<string, DistillerBlock>;
  segById: Record<string, DistillerSegment>;
  stkById: Record<string, DistillerStakeholder>;
  actorById: Record<string, { id: string; label: string; why?: string }>;
}

export function indexReport(r: DistillerReport): DistillerIndex {
  const blockById: DistillerIndex["blockById"] = {};
  const segById: DistillerIndex["segById"] = {};
  const stkById: DistillerIndex["stkById"] = {};
  const actorById: DistillerIndex["actorById"] = {};
  for (const b of r.blocks) {
    blockById[b.id] = b;
    if (b.core && b.seg) {
      segById[b.seg] = {
        id: b.seg,
        text: b.distill,
        blockId: b.id,
        page: b.page,
        sec: b.sec,
      };
    }
  }
  for (const s of r.stakeholders) stkById[s.id] = s;
  for (const grp of [r.upstream, r.downstream]) {
    for (const o of [...grp.key, ...grp.distractors]) actorById[o.id] = o;
  }
  return { blockById, segById, stkById, actorById };
}

/** The block a distilled point came from — "which fact would have answered this". */
export function blockForSeg(
  segId: string,
  index: DistillerIndex,
): DistillerBlock | null {
  const s = index.segById[segId];
  return s ? (index.blockById[s.blockId] ?? null) : null;
}

/**
 * Content-graph faults for one report. Empty means the report is playable:
 * the notebook budget fits its core facts, every question names a segment some
 * core block produces, every core block answers somebody, and the downstream
 * key is exactly the reader list.
 */
export function graphFaults(r: DistillerReport): string[] {
  const faults: string[] = [];
  const segs = new Set(
    r.blocks.filter((b) => b.core && b.seg).map((b) => b.seg as string),
  );
  const core = r.blocks.filter((b) => b.core);
  if (core.length + r.meta.slack !== r.meta.cap) {
    faults.push(
      `${r.id}: core (${core.length}) + slack (${r.meta.slack}) must equal cap (${r.meta.cap})`,
    );
  }
  const answered = new Set<string>();
  for (const s of r.stakeholders) {
    const seen = new Set<string>();
    for (const q of s.questions) {
      if (!q.answers.length) faults.push(`${r.id}: question ${q.id} answers nothing`);
      for (const seg of q.answers) {
        if (!segs.has(seg)) {
          faults.push(`${r.id}: question ${q.id} names unknown segment ${seg}`);
        }
        answered.add(seg);
        seen.add(seg);
      }
    }
    for (const seg of s.knownBy) {
      if (!segs.has(seg)) faults.push(`${r.id}: ${s.id} knows unknown segment ${seg}`);
      if (seen.has(seg)) {
        faults.push(`${r.id}: ${s.id} both knows and is answered by ${seg}`);
      }
    }
  }
  for (const b of core) {
    if (!b.seg || !answered.has(b.seg)) {
      faults.push(
        `${r.id}: core block ${b.id} produces segment ${b.seg} answering no question`,
      );
    }
  }
  const stkIds = new Set(r.stakeholders.map((s) => s.id));
  for (const o of r.downstream.key) {
    if (!stkIds.has(o.id)) faults.push(`${r.id}: downstream key ${o.id} has no stakeholder`);
  }
  if (r.downstream.key.length !== r.stakeholders.length) {
    faults.push(`${r.id}: downstream key count differs from stakeholder count`);
  }
  return faults;
}

/* ------------------------------------------------------------------ state */

/** [segment id, stakeholder id] */
export type DistillerThread = [string, string];

export interface DistillerRun {
  v: 2;
  mode: "standard" | "tight";
  phase: DistillerPhase;
  /** upstream picks, and whether they are committed */
  upSel: string[];
  upDone: boolean;
  downSel: string[];
  downDone: boolean;
  /** ordered block ids — the notebook's own order */
  clipped: string[];
  /** clipped ids whose compression the learner has seen */
  flipped: string[];
  threads: DistillerThread[];
  delivered: boolean;
  /** per-run shuffle, so a returning learner sees the pool in the same order */
  shuffleSeed: number;
  runs: number;
  best: DistillerSummary | null;
  tightUnlocked: boolean;
}

export interface DistillerSummary {
  answered: number;
  total: number;
  wasted: number;
  clips: number;
  filler: number;
}

export function freshRun(seed: number): DistillerRun {
  return {
    v: 2,
    mode: "standard",
    phase: 1,
    upSel: [],
    upDone: false,
    downSel: [],
    downDone: false,
    clipped: [],
    flipped: [],
    threads: [],
    delivered: false,
    shuffleSeed: seed,
    runs: 0,
    best: null,
    tightUnlocked: false,
  };
}

/**
 * Coerce whatever came out of localStorage into a runnable state, dropping ids
 * the data no longer carries. Returns null when the payload is not a v2 run at
 * all, which the caller reads as "start fresh".
 */
export function sanitizeRun(
  raw: unknown,
  index: DistillerIndex,
  seed: number,
): DistillerRun | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<DistillerRun>;
  if (r.v !== 2 || !Array.isArray(r.clipped)) return null;
  const out = freshRun(typeof r.shuffleSeed === "number" ? r.shuffleSeed : seed);

  out.clipped = r.clipped.filter(
    (id): id is string => typeof id === "string" && !!index.blockById[id],
  );
  out.flipped = (Array.isArray(r.flipped) ? r.flipped : []).filter(
    (id: unknown): id is string =>
      typeof id === "string" && out.clipped.includes(id),
  );
  const live = new Set(producedSegs(out.clipped, index));
  out.threads = (Array.isArray(r.threads) ? r.threads : []).filter(
    (t: unknown): t is DistillerThread =>
      Array.isArray(t) &&
      t.length === 2 &&
      live.has(t[0]) &&
      !!index.stkById[t[1]],
  );
  const actor = (id: unknown): id is string =>
    typeof id === "string" && !!index.actorById[id];
  out.upSel = (Array.isArray(r.upSel) ? r.upSel : []).filter(actor);
  out.downSel = (Array.isArray(r.downSel) ? r.downSel : []).filter(actor);
  out.upDone = !!r.upDone;
  out.downDone = !!r.downDone;
  out.delivered = !!r.delivered;
  out.mode = r.mode === "tight" ? "tight" : "standard";
  out.runs = typeof r.runs === "number" ? r.runs : 0;
  out.best = r.best && typeof r.best === "object" ? r.best : null;
  out.tightUnlocked = !!r.tightUnlocked;
  const phase = Math.max(1, Math.min(5, Number(r.phase) || 1));
  out.phase = phase as DistillerPhase;
  return out;
}

/** Notebook capacity for the run's mode. */
export function capFor(run: DistillerRun, report: DistillerReport): number {
  return run.mode === "tight"
    ? (report.meta.tightCap ?? report.meta.cap)
    : report.meta.cap;
}

/** Core segments the learner actually distilled, in notebook order. */
export function producedSegs(
  clipped: string[],
  index: DistillerIndex,
): string[] {
  return clipped
    .map((id) => index.blockById[id])
    .filter((b): b is DistillerBlock => !!b && b.core && !!b.seg)
    .map((b) => b.seg as string);
}

export function seenAllFlips(run: DistillerRun): boolean {
  return run.clipped.every((id) => run.flipped.includes(id));
}

/**
 * The phase gate. Distilling needs something clipped; tracing the actors needs
 * every clipping compressed (the silence of what you skipped is the lesson, and
 * it is only visible once the post is built).
 */
export function canEnterPhase(p: DistillerPhase, run: DistillerRun): boolean {
  if (p === 1) return true;
  if (p === 2) return run.clipped.length > 0;
  if (p === 3) return run.clipped.length > 0 && seenAllFlips(run);
  if (p === 4) return run.upDone;
  return run.upDone && run.downDone;
}

export const PHASE_GATE_MESSAGE: Record<number, string> = {
  2: "Clip something first.",
  3: "Distil your clippings first.",
  4: "Commit your upstream picks first.",
  5: "Confirm the readers first.",
};

/* -------------------------------------------------------------- judgement */

export interface DistillerVerdict {
  /** question id -> answered */
  answered: Record<string, boolean>;
  /** stakeholder id -> segments they already knew but were threaded anyway */
  wasted: Record<string, string[]>;
  total: number;
  ok: number;
}

export function evaluateRun(
  threads: DistillerThread[],
  report: DistillerReport,
): DistillerVerdict {
  const threadedTo: Record<string, Set<string>> = {};
  for (const [seg, stk] of threads) {
    (threadedTo[stk] ??= new Set()).add(seg);
  }
  const answered: Record<string, boolean> = {};
  const wasted: Record<string, string[]> = {};
  let total = 0;
  let ok = 0;
  for (const s of report.stakeholders) {
    const have = threadedTo[s.id] ?? new Set<string>();
    for (const q of s.questions) {
      total++;
      const isOk = q.answers.some((seg) => have.has(seg));
      answered[q.id] = isOk;
      if (isOk) ok++;
    }
    wasted[s.id] = [...have].filter((seg) => s.knownBy.includes(seg));
  }
  return { answered, wasted, total, ok };
}

/** Picks against the key, for the two actor steps. */
export function scoreActors(
  grp: DistillerActorGroup,
  sel: string[],
): { ok: number; wrong: number } {
  const keyIds = new Set(grp.key.map((o) => o.id));
  let ok = 0;
  let wrong = 0;
  for (const id of sel) {
    if (keyIds.has(id)) ok++;
    else wrong++;
  }
  return { ok, wrong };
}

export function summarize(
  run: DistillerRun,
  report: DistillerReport,
  index: DistillerIndex,
): DistillerSummary {
  const ev = evaluateRun(run.threads, report);
  return {
    answered: ev.ok,
    total: ev.total,
    wasted: Object.values(ev.wasted).reduce((n, w) => n + w.length, 0),
    clips: run.clipped.length,
    filler: run.clipped.filter((id) => !index.blockById[id]?.core).length,
  };
}

/* ----------------------------------------------------------------- shuffle */

/**
 * mulberry32 — a deterministic shuffle seeded per run, so the excerpt pool
 * holds its order across re-renders and reloads. Never seed it from the render
 * pass: the seed belongs to the run and is persisted with it.
 */
export function shuffleSeeded<T>(list: readonly T[], seed: number): T[] {
  const a = list.slice();
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
