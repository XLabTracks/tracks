
export type SelectionActionId =
  | "highlight"
  | "unhighlight"
  | "define"
  | "notebook";

export const MIN_CHARS = 3;

export const SHORT_WORDS = 5;

export interface SelectionFacts {
  text: string;
  inReading: boolean;
  highlightSupported: boolean;
  overlapsHighlight?: boolean;
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function actionsFor(facts: SelectionFacts): SelectionActionId[] {
  const text = facts.text.trim();
  if (!facts.inReading) return [];
  if (text.length < MIN_CHARS) return [];

  const out: SelectionActionId[] = [];
  if (facts.highlightSupported) {
    out.push(facts.overlapsHighlight ? "unhighlight" : "highlight");
  }
  if (wordCount(text) <= SHORT_WORDS) out.push("define");
  out.push("notebook");
  return out;
}

export const ACTION_LABELS: Record<SelectionActionId, string> = {
  highlight: "Highlight",
  unhighlight: "Remove highlight",
  define: "Define",
  notebook: "Add to notebook",
};
