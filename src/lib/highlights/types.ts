// User text highlights on paper items (arXiv/Substack/LessWrong sources).
// Anchoring is character-precise on the artifact's stable annotation
// contract: a data-anchor block + data-s sentence range, narrowed by char
// offsets into the NORMALIZED text of the edge sentences (the block-index
// convention — whitespace collapsed, math as one "⟨math⟩" atom — the one
// text-space capture, server validation, and resolution all share). The
// stored snippet — the normalized text of the selected slice, capped — is
// the source of truth at render time, the anchor only a hint.

export const HIGHLIGHT_MAX_SNIPPET_CHARS = 300;
export const HIGHLIGHT_MAX_NOTE_CHARS = 2_000;
export const HIGHLIGHT_MAX_PER_ITEM = 200;
export const HIGHLIGHT_MAX_PER_USER = 2_000;
/** Max sentences one highlight may span (a passage, not a chapter). */
export const HIGHLIGHT_MAX_SENTENCE_SPAN = 30;
/** Sanity bound on character offsets (no real sentence is this long). */
export const HIGHLIGHT_MAX_OFFSET = 10_000;

/**
 * endOffset sentinel: "the end of sentence sEnd". Stored instead of the
 * sentence's actual length so whole-sentence rows stay canonical (one
 * composite-unique shape per full-sentence span) and existing rows read
 * unchanged. startOffset needs no sentinel — 0 IS the start.
 */
export const HIGHLIGHT_END_OF_SENTENCE = -1;

export interface HighlightAnchor {
  /** data-anchor of the containing block ("b-NNNN"). */
  blockAnchor: string;
  /** 1-based data-s of the first covered sentence. */
  sStart: number;
  /** 1-based data-s of the last covered sentence (inclusive). */
  sEnd: number;
}

/** A sentence range narrowed to character precision (partial-word spans). */
export interface HighlightSpan extends HighlightAnchor {
  /** Char offset into sentence sStart's normalized text (0 = start). */
  startOffset: number;
  /**
   * Exclusive char offset into sentence sEnd's normalized text, or
   * HIGHLIGHT_END_OF_SENTENCE for "to the end".
   */
  endOffset: number;
}

/**
 * Max paragraph spans one gesture may produce. A multi-paragraph selection
 * becomes a GROUP: one row per touched block sharing a groupId, so every
 * per-block mechanism (validation, resolution, drift) is untouched and the
 * group is purely a lifecycle layer — one note (on the HEAD row, the first
 * span in document order), one panel entry, one delete.
 */
export const HIGHLIGHT_MAX_BLOCKS = 20;

/** One block's slice of a (possibly multi-paragraph) gesture. */
export interface HighlightSpanInput extends HighlightSpan {
  /** snippetForRange() of THIS block's sliced text. */
  snippet: string;
}

/**
 * createHighlight's return contract (the client imports it from HERE, not
 * from the actions file). `{ id }` is success — or the EXISTING row's id on
 * a duplicate gesture, so the client converges instead of erroring.
 * `"cap"` = the per-item or per-user count cap is reached; `"stale"` = the
 * posted convVersion no longer matches the artifact this deploy serves
 * (re-capture against the current DOM). `null` = generic failure (signed
 * out, unknown content, invalid payload).
 */
export type CreateHighlightResult =
  | { groupId: string; ids: string[] }
  | { error: "cap" | "stale" }
  | null;

/** A create request as posted by the client (post-sanitization shape). */
export interface HighlightInput {
  /** Document-order block spans of one gesture (1..HIGHLIGHT_MAX_BLOCKS). */
  spans: HighlightSpanInput[];
  /** Stored on the group's head row only. */
  note: string | null;
  /** data-conv of the paper wrapper at capture time. */
  convVersion: number;
}

/** The row shape the paper page passes into the client layer. */
export interface HighlightRow extends HighlightSpan {
  id: string;
  /** Rows created by one gesture share this; single-block rows = group of 1. */
  groupId: string;
  snippet: string;
  note: string | null;
  convVersion: number;
}

/**
 * A classmate's shared highlight, as passed to the reader's read-only
 * "class highlights" layer. Same anchor shape as HighlightRow plus the
 * author's display name; `note` is always present (only NOTED highlights are
 * shared — an un-noted highlight has nothing to show in the margin). These
 * never enter the editable highlight state: they resolve into a separate
 * range map, paint in a distinct color, and render as read-only margin boxes.
 */
export interface ClassHighlightRow extends HighlightRow {
  /** Display name of the classmate who made the highlight. */
  author: string;
}
