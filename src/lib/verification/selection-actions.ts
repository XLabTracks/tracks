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

export type SelectionActionId =
  | "highlight"
  | "unhighlight"
  | "define"
  | "notebook";

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
  /** The selection crosses at least one highlight already on the page. */
  overlapsHighlight?: boolean;
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
  // One slot, two meanings: over an existing highlight the useful action is
  // taking it away, and offering both at once would ask the reader to work
  // out which of two nearly identical buttons they wanted. Clicking painted
  // text still raises its own Remove — that is the gesture with no selection
  // at all, which this toolbar never sees.
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
