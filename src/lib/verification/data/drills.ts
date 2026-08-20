
export interface DrillTable {
  cols: string[];
  rows: string[][];
}

interface DrillStepBase {
  brief?: string;
  statement?: string;
  table?: DrillTable;
  q: string;
}

export interface DrillPickStep extends DrillStepBase {
  type: "pick";
  opts: string[];
  right: number;
  why: string;
  fixedOrder?: true;
}

export interface DrillMarkItem {
  t: string;
  err: boolean;
  note: string;
}

export interface DrillMultiStep extends DrillStepBase {
  type: "multi";
  need: number | "errors";
  items: DrillMarkItem[];
  whyAll?: string;
  fixedOrder?: true;
}

export interface DrillNumberStep extends DrillStepBase {
  type: "number";
  min: number;
  max: number;
  unit?: string;
  reveal: string;
}

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

export interface DrillBench {
  id: string;
  label: string;
  name: string;
  kicker: string;
  time: string;
  steps: DrillStep[];
}

export interface DrillDeck {
  id: string;
  title: string;
  blurb: string;
  benches: DrillBench[];
}

export function deckStepCount(deck: DrillDeck): number {
  return deck.benches.reduce((n, b) => n + b.steps.length, 0);
}
