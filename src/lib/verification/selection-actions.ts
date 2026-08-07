/**
 * What a selection can be done with.
 *
 * Three tools act on selected text — highlight it, look the term up, keep the
 * passage in the notebook — and until now each decided for itself, from its
 * own `mouseup` listener, whether it applied. That produced one bug per input
 * device: `mouseup` is a mouse event, so a phone that adjusts a selection by
 * its handles and a keyboard that extends one with Shift+Arrow both selected
 * text and were offered nothing at all. It also meant the three had to be
 * kept from stacking by hand, by placing them at different heights.
 *
 * So the decision lives here, once, as a pure function over facts about the
 * selection, and one toolbar renders the answer. The rules are the ones the
 * three scripts already carried; what is new is that they are in one place
 * and can be read without opening three files.
 */

export type SelectionActionId = "highlight" | "define" | "notebook";

/** Below this a "selection" is a stray click-drag, not a thing to act on. */
export const MIN_CHARS = 3;

/** Above this it is a passage, not a term: looking it up would be nonsense. */
export const SHORT_WORDS = 5;

export interface SelectionFacts {
  /** The selected text, already trimmed. */
  text: string;
  /** Selection is inside the reading column and not inside an editor. */
  inReading: boolean;
  /** The CSS Custom Highlight API is present. A highlighter that half-works
   *  is worse than none, so where it is missing the action is not offered. */
  highlightSupported: boolean;
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/**
 * The actions to offer, in the order they are shown. Empty means no toolbar —
 * which is the common case, because most selections are somebody dragging
 * across a line while they read.
 */
export function actionsFor(facts: SelectionFacts): SelectionActionId[] {
  const text = facts.text.trim();
  if (!facts.inReading) return [];
  if (text.length < MIN_CHARS) return [];

  const out: SelectionActionId[] = [];
  if (facts.highlightSupported) out.push("highlight");
  if (wordCount(text) <= SHORT_WORDS) out.push("define");
  out.push("notebook");
  return out;
}

export const ACTION_LABELS: Record<SelectionActionId, string> = {
  highlight: "Highlight",
  define: "Define",
  notebook: "Add to notebook",
};
