import { isStorableText } from "@/lib/content/exercise-view";
import {
  HIGHLIGHT_END_OF_SENTENCE,
  HIGHLIGHT_MAX_BLOCKS,
  HIGHLIGHT_MAX_NOTE_CHARS,
  HIGHLIGHT_MAX_OFFSET,
  HIGHLIGHT_MAX_SENTENCE_SPAN,
  HIGHLIGHT_MAX_SNIPPET_CHARS,
  type HighlightInput,
  type HighlightSpanInput,
} from "./types";

// createHighlight is reachable by direct POST, so the posted payload is
// untrusted end to end. This is the cheap shape gate that runs before any
// I/O; the action then verifies every span's anchor + snippet against the
// paper's block index (the expensive, authoritative check).

const BLOCK_ANCHOR_RE = /^b-\d{1,6}$/;
/** Sanity bound — no real block has this many sentence spans. */
const MAX_SENTENCE_INDEX = 10_000;

export function sanitizeHighlightInput(value: unknown): HighlightInput | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  const { spans, note, convVersion } = value as Record<string, unknown>;

  if (!Array.isArray(spans)) return null;
  if (spans.length < 1 || spans.length > HIGHLIGHT_MAX_BLOCKS) return null;
  const cleanSpans: HighlightSpanInput[] = [];
  const lastEnd = new Map<string, number>();
  for (const raw of spans) {
    const span = sanitizeSpan(raw);
    if (!span) return null;
    // One gesture touches each block at most once — except a block split by
    // a mid-paragraph activity, whose anchor-less second half captures as a
    // FURTHER span on the same anchor. Repeats must move strictly forward
    // (disjoint, ascending sentence ranges), never overlap or duplicate.
    const prev = lastEnd.get(span.blockAnchor);
    if (prev !== undefined && span.sStart <= prev) return null;
    lastEnd.set(span.blockAnchor, span.sEnd);
    cleanSpans.push(span);
  }

  let cleanNote: string | null = null;
  if (note !== undefined && note !== null) {
    const cleaned = sanitizeHighlightNote(note);
    if (cleaned === undefined) return null;
    cleanNote = cleaned;
  }

  if (!Number.isInteger(convVersion) || (convVersion as number) < 1) {
    return null;
  }

  return {
    spans: cleanSpans,
    note: cleanNote,
    convVersion: convVersion as number,
  };
}

function sanitizeSpan(value: unknown): HighlightSpanInput | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  const { blockAnchor, sStart, sEnd, startOffset, endOffset, snippet } =
    value as Record<string, unknown>;

  if (typeof blockAnchor !== "string" || !BLOCK_ANCHOR_RE.test(blockAnchor)) {
    return null;
  }
  if (!Number.isInteger(sStart) || !Number.isInteger(sEnd)) return null;
  const start = sStart as number;
  const end = sEnd as number;
  if (start < 1 || end < start || end > MAX_SENTENCE_INDEX) return null;
  if (end - start + 1 > HIGHLIGHT_MAX_SENTENCE_SPAN) return null;

  // Character offsets into the edge sentences' normalized text; shape only —
  // the action bounds them against the artifact's actual sentence lengths.
  if (!Number.isInteger(startOffset) || !Number.isInteger(endOffset)) {
    return null;
  }
  const offStart = startOffset as number;
  const offEnd = endOffset as number;
  if (offStart < 0 || offStart > HIGHLIGHT_MAX_OFFSET) return null;
  if (offEnd !== HIGHLIGHT_END_OF_SENTENCE) {
    if (offEnd < 1 || offEnd > HIGHLIGHT_MAX_OFFSET) return null;
    // Within one sentence the slice must be non-empty and forward.
    if (start === end && offEnd <= offStart) return null;
  }

  if (typeof snippet !== "string" || !isStorableText(snippet)) return null;
  if (snippet.trim().length === 0) return null;
  if (snippet.length > HIGHLIGHT_MAX_SNIPPET_CHARS) return null;

  return {
    blockAnchor,
    sStart: start,
    sEnd: end,
    startOffset: offStart,
    endOffset: offEnd,
    snippet,
  };
}

/**
 * A posted note value: null clears, a storable string within the cap saves
 * (whitespace-only collapses to null). `undefined` = reject.
 */
export function sanitizeHighlightNote(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value !== "string" || !isStorableText(value)) return undefined;
  if (value.length > HIGHLIGHT_MAX_NOTE_CHARS) return undefined;
  if (value.trim().length === 0) return null;
  return value;
}
