import { MATH_PLACEHOLDER } from "@/lib/papers/normalize";

// The bridge that makes character-precise highlights possible: raw DOM text
// diverges from artifact text (KaTeX renders MathML+HTML duplicates; the
// converter's whitespace differs from the serialized DOM's), but both sides
// share ONE normalized text-space (normalizeText + the ⟨math⟩ atom). This
// module maps offsets in that space back to raw positions in an ordered
// list of segments — the client walks a sentence span's DOM into segments,
// builds the map, and converts selection boundaries to normalized offsets
// at capture and normalized offsets to Range endpoints at resolution. Pure
// (no DOM types), so the collapse/trim arithmetic is vitest-covered; the
// thin DOM walk lives in dom.ts.

export type TextSegment =
  | { kind: "text"; text: string }
  /** An atomic math subtree — one ⟨math⟩ in normalized space. */
  | { kind: "math" };

export type SegmentPosition =
  /** Inside a text segment, at raw UTF-16 offset `offset`. */
  | { segment: number; offset: number }
  /** At a math atom's boundary (offsets never land INSIDE an atom). */
  | { segment: number; edge: "before" | "after" };

/** Where one normalized character came from. */
type CharSource =
  | { segment: number; raw: number; atom?: undefined }
  | { segment: number; atom: true };

export interface OffsetMap {
  /** The segments' normalized text (block-index convention). */
  text: string;
  /** Raw position for a normalized offset used as a range START (inclusive). */
  startPosition(offset: number): SegmentPosition | null;
  /** Raw position for a normalized offset used as a range END (exclusive). */
  endPosition(offset: number): SegmentPosition | null;
  /**
   * Inverse: the normalized offset of a raw boundary at (text segment,
   * raw UTF-16 offset) — the count of normalized chars sourced strictly
   * before it. Collapsed/dropped whitespace boundaries land on the nearest
   * following emitted char.
   */
  offsetAt(segment: number, rawOffset: number): number;
  /** The normalized [start, end) range a math atom occupies, if any. */
  atomBounds(segment: number): { start: number; end: number } | null;
}

/**
 * Build the map for one sentence span's ordered segments. Normalization
 * mirrors normalizeText exactly: whitespace runs collapse to one space
 * (attributed to the run's FIRST raw whitespace char), leading/trailing
 * whitespace is dropped, math atoms emit the literal placeholder.
 */
export function buildOffsetMap(segments: readonly TextSegment[]): OffsetMap {
  let text = "";
  const sources: CharSource[] = [];
  let pending: { segment: number; raw: number } | null = null;

  segments.forEach((segment, si) => {
    if (segment.kind === "math") {
      if (pending && text.length > 0) {
        text += " ";
        sources.push({ segment: pending.segment, raw: pending.raw });
      }
      pending = null;
      for (let i = 0; i < MATH_PLACEHOLDER.length; i++) {
        text += MATH_PLACEHOLDER[i];
        sources.push({ segment: si, atom: true });
      }
      return;
    }
    for (let i = 0; i < segment.text.length; i++) {
      const ch = segment.text[i];
      if (/\s/.test(ch)) {
        pending ??= { segment: si, raw: i };
        continue;
      }
      if (pending && text.length > 0) {
        text += " ";
        sources.push({ segment: pending.segment, raw: pending.raw });
      }
      pending = null;
      text += ch;
      sources.push({ segment: si, raw: i });
    }
  });

  const startPosition = (offset: number): SegmentPosition | null => {
    if (!Number.isInteger(offset) || offset < 0 || offset > text.length) {
      return null;
    }
    if (offset === text.length) return endPosition(offset);
    const source = sources[offset];
    // A start landing on an atom clamps to just before it — offsets never
    // address the placeholder's interior in the DOM.
    if (source.atom) return { segment: source.segment, edge: "before" };
    return { segment: source.segment, offset: source.raw };
  };

  const endPosition = (offset: number): SegmentPosition | null => {
    if (!Number.isInteger(offset) || offset < 1 || offset > text.length) {
      return null;
    }
    const source = sources[offset - 1];
    if (source.atom) return { segment: source.segment, edge: "after" };
    return { segment: source.segment, offset: source.raw + 1 };
  };

  const offsetAt = (segment: number, rawOffset: number): number => {
    let count = 0;
    for (const source of sources) {
      if (source.segment < segment) {
        count++;
        continue;
      }
      if (source.segment > segment) break;
      if (!source.atom && source.raw < rawOffset) count++;
      else break;
    }
    return count;
  };

  const atomBounds = (
    segment: number,
  ): { start: number; end: number } | null => {
    let start = -1;
    let end = -1;
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (source.segment !== segment || !source.atom) continue;
      if (start === -1) start = i;
      end = i + 1;
    }
    return start === -1 ? null : { start, end };
  };

  return { text, startPosition, endPosition, offsetAt, atomBounds };
}

/**
 * Snap a normalized offset to a user-perceived character boundary so a
 * mid-grapheme selection endpoint never bisects a surrogate pair (which
 * would make the snippet unstorable) or split a combining sequence.
 * Grapheme-accurate where Intl.Segmenter exists; code-point floor/ceil as
 * the universal fallback.
 */
export function snapOffset(
  text: string,
  offset: number,
  direction: "floor" | "ceil",
): number {
  const clamped = Math.min(Math.max(offset, 0), text.length);
  if (clamped === 0 || clamped === text.length) return clamped;
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    let previous = 0;
    for (const { index } of segmenter.segment(text)) {
      if (index === clamped) return clamped;
      if (index > clamped) {
        return direction === "floor" ? previous : index;
      }
      previous = index;
    }
    return direction === "floor" ? previous : text.length;
  }
  // Code-point fallback: don't split a surrogate pair.
  const before = text.charCodeAt(clamped - 1);
  const at = text.charCodeAt(clamped);
  if (before >= 0xd800 && before <= 0xdbff && at >= 0xdc00 && at <= 0xdfff) {
    return direction === "floor" ? clamped - 1 : clamped + 1;
  }
  return clamped;
}
