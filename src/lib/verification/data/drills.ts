/**
 * Shape of a drill deck — the per-module bench of formative olympiad-format
 * tasks (`drills-*.ts` hold the content; the widget in
 * `src/components/verification/widgets/` renders it).
 *
 * Four step types cover the whole task grammar. `pick` and `multi` carry their
 * own key; `number` is checked against a tolerance band, never an exact value;
 * `text` is a written commit with no key at all — the length rule IS the drill,
 * so nothing typed into it is graded or leaves the page.
 */

/** Small data panel rendered above the options (the read-the-panel task type). */
export interface DrillTable {
  cols: string[];
  rows: string[][];
}

interface DrillStepBase {
  /** Scenario/setup prose shown above the prompt. */
  brief?: string;
  /** The claim under judgement, set apart from the brief. */
  statement?: string;
  table?: DrillTable;
  /** The prompt itself. */
  q: string;
}

/** One prompt, one tap, reasoned reveal. */
export interface DrillPickStep extends DrillStepBase {
  type: "pick";
  opts: string[];
  /** Index into `opts`. Authored order — the renderer shuffles the display. */
  right: number;
  why: string;
  /**
   * Keeps the options in the order they are written here.
   *
   * The one reason to set it: a `why` that names an option by where it sits
   * ("the second option is the attribution reflex"). Shuffling under prose
   * like that makes the reveal wrong, which is worse than the positional bias
   * the shuffle exists to remove. `answer-order.test.ts` looks for the phrasing
   * and fails on a step that needs this and does not have it, so it cannot be
   * forgotten — and the honest fix for a NEW step is to name the option by
   * what it says and leave the shuffle on.
   */
  fixedOrder?: true;
}

/** One item of a mark-the-set step. `err` means "belongs to the marked set". */
export interface DrillMarkItem {
  t: string;
  err: boolean;
  note: string;
}

/**
 * Mark-the-set with per-item verdicts. `need` is the exact number of marks the
 * step demands, or "errors" when the count is itself part of the judgement and
 * any non-empty selection may be committed.
 */
export interface DrillMultiStep extends DrillStepBase {
  type: "multi";
  need: number | "errors";
  items: DrillMarkItem[];
  whyAll?: string;
  /** As on a pick step: set only when the prose names an item by position. */
  fixedOrder?: true;
}

/** Computed answer typed in, no options offered, checked against bounds. */
export interface DrillNumberStep extends DrillStepBase {
  type: "number";
  min: number;
  max: number;
  unit?: string;
  reveal: string;
}

/** Written commit with a minimum length and optionally a hard character cap. */
export interface DrillTextStep extends DrillStepBase {
  type: "text";
  minLen: number;
  maxLen?: number;
  reveal: string;
}

export type DrillStep =
  | DrillPickStep
  | DrillMultiStep
  | DrillNumberStep
  | DrillTextStep;

/** One bench — a short run of steps on one theme. */
export interface DrillBench {
  id: string;
  /** Short nav label. */
  label: string;
  name: string;
  kicker: string;
  time: string;
  steps: DrillStep[];
}

/** All benches belonging to one module. */
export interface DrillDeck {
  id: string;
  title: string;
  blurb: string;
  benches: DrillBench[];
}

/** Total steps across a deck's benches. */
export function deckStepCount(deck: DrillDeck): number {
  return deck.benches.reduce((n, b) => n + b.steps.length, 0);
}
