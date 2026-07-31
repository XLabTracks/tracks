import {
  HIGHLIGHT_END_OF_SENTENCE,
  HIGHLIGHT_MAX_SNIPPET_CHARS,
  type HighlightAnchor,
  type HighlightSpan,
} from "./types";

// Snippet algebra shared by capture (client), create-validation (server
// action), and render-time resolution (client). All texts involved are
// already normalized per the block-index convention (whitespace collapsed,
// math as the literal "⟨math⟩"); keeping the truncation + comparison rules
// in one pure module is what lets the drift tripwire be an exact equality.

/**
 * The joined normalized text of sentences sStart..sEnd (1-based, inclusive)
 * of one block, or null when the range runs off the block or crosses a gap
 * (sentence arrays can be sparse — nested anchored blocks keep their own
 * counters, and non-prose children have no data-s at all).
 */
export function sentenceRangeText(
  sentences: readonly (string | undefined)[],
  sStart: number,
  sEnd: number,
): string | null {
  if (sEnd > sentences.length) return null;
  const parts: string[] = [];
  for (let s = sStart; s <= sEnd; s++) {
    const text = sentences[s - 1];
    if (typeof text !== "string") return null;
    parts.push(text);
  }
  return parts.join(" ");
}

/**
 * The normalized text of a character-precise span: the sentence range's
 * joined text with the first sentence sliced from startOffset and the last
 * sliced to endOffset (HIGHLIGHT_END_OF_SENTENCE = its full length). Null
 * when the range is invalid, an offset runs off its sentence, or the slice
 * is empty — the same "refuse, don't guess" posture as sentenceRangeText.
 */
export function sliceRangeText(
  sentences: readonly (string | undefined)[],
  span: Omit<HighlightSpan, "blockAnchor">,
): string | null {
  const { sStart, sEnd, startOffset, endOffset } = span;
  if (sentenceRangeText(sentences, sStart, sEnd) === null) return null;
  const first = sentences[sStart - 1] as string;
  const last = sentences[sEnd - 1] as string;
  const end = endOffset === HIGHLIGHT_END_OF_SENTENCE ? last.length : endOffset;
  if (startOffset < 0 || startOffset >= first.length) return null;
  if (end < 1 || end > last.length) return null;
  if (sStart === sEnd) {
    if (end <= startOffset) return null;
    return first.slice(startOffset, end);
  }
  const parts: string[] = [first.slice(startOffset)];
  for (let s = sStart + 1; s < sEnd; s++) parts.push(sentences[s - 1] as string);
  parts.push(last.slice(0, end));
  return parts.join(" ");
}

/** The stored snippet for a range's normalized text: capped, no dangling space. */
export function snippetForRange(rangeText: string): string {
  let capped = rangeText.slice(0, HIGHLIGHT_MAX_SNIPPET_CHARS);
  // The cap counts UTF-16 units, so it can land inside a surrogate pair and
  // leave a lone high surrogate at the tail — unstorable text the server
  // always rejects, which would make the passage permanently
  // unhighlightable. Drop it. Deterministic: the same range text bisects at
  // the same unit every time, so capture and server recompute still agree.
  const last = capped.charCodeAt(capped.length - 1);
  if (last >= 0xd800 && last <= 0xdbff) capped = capped.slice(0, -1);
  return capped.trimEnd();
}

/** Does a resolved range still carry the text the user highlighted? */
export function matchesSnippet(rangeText: string, snippet: string): boolean {
  return snippet.length > 0 && snippetForRange(rangeText) === snippet;
}

/**
 * Drift fallback: find the sentence range whose text still matches the
 * snippet after anchors renumbered (artifact rebuild). Slides a window of
 * the original sentence span over every block; only a UNIQUE match may
 * repaint — zero or several matches orphan the highlight instead. Silently
 * misplacing a note is the failure mode this exists to rule out.
 */
/**
 * Drift fallback for CHARACTER-PRECISE rows: find the snippet as a
 * substring of any block's contiguous sentence text and re-derive the full
 * span (sentence range + offsets) from the occurrence itself — sentence
 * re-segmentation after a rebuild is tolerated because the search ignores
 * the original span shape. Only a globally UNIQUE physical occurrence may
 * repaint; zero or several orphan the row instead. (Whole-sentence rows
 * keep findUniqueMatch below — window equality is the stricter, cheaper
 * test when offsets aren't in play.)
 */
export function findUniqueContaining(
  blocks: Iterable<{
    anchor: string;
    sentences: readonly (string | undefined)[];
  }>,
  snippet: string,
): HighlightSpan | null {
  // Joiner-edged snippets can't map to sentence offsets; capture never
  // produces them (slices are space-trimmed), so refuse rather than guess.
  if (
    snippet.length === 0 ||
    snippet.startsWith(" ") ||
    snippet.endsWith(" ")
  ) {
    return null;
  }
  let found: HighlightSpan | null = null;
  let foundKey: string | null = null;
  for (const block of blocks) {
    const n = block.sentences.length;
    // Contiguous runs of defined sentences (sparse holes split them —
    // nested anchored blocks keep their own counters).
    let runStart = 1;
    for (let s = 1; s <= n + 1; s++) {
      const defined =
        s <= n && typeof block.sentences[s - 1] === "string";
      if (defined) continue;
      if (runStart < s) {
        const run = block.sentences.slice(runStart - 1, s - 1) as string[];
        for (const hit of occurrencesIn(run, snippet)) {
          const span: HighlightSpan = {
            blockAnchor: block.anchor,
            sStart: runStart + hit.startSentence,
            sEnd: runStart + hit.endSentence,
            startOffset: hit.startOffset,
            endOffset: hit.endOffset,
          };
          const key = `${block.anchor}|${span.sStart}|${span.startOffset}`;
          if (foundKey !== null && foundKey !== key) return null; // ambiguous
          found = span;
          foundKey = key;
        }
      }
      runStart = s + 1;
    }
  }
  return found;
}

/** All mappable occurrences of `snippet` in a run's joined sentence text. */
function occurrencesIn(
  run: readonly string[],
  snippet: string,
): {
  startSentence: number;
  endSentence: number;
  startOffset: number;
  endOffset: number;
}[] {
  // Cumulative start of each sentence within the joined text (single-space
  // joiners between sentences, matching sentenceRangeText).
  const starts: number[] = [];
  let cursor = 0;
  for (const sentence of run) {
    starts.push(cursor);
    cursor += sentence.length + 1;
  }
  const text = run.join(" ");
  const locate = (index: number): { sentence: number; offset: number } | null => {
    let k = starts.length - 1;
    while (k > 0 && starts[k] > index) k--;
    const offset = index - starts[k];
    // A joiner position (offset === length) has no sentence home.
    if (offset >= run[k].length) return null;
    return { sentence: k, offset };
  };
  const out: ReturnType<typeof occurrencesIn> = [];
  for (
    let pos = text.indexOf(snippet);
    pos !== -1;
    pos = text.indexOf(snippet, pos + 1)
  ) {
    const start = locate(pos);
    const last = locate(pos + snippet.length - 1);
    if (!start || !last) continue; // edge on a joiner — not mappable
    const endOffset = last.offset + 1;
    out.push({
      startSentence: start.sentence,
      endSentence: last.sentence,
      startOffset: start.offset,
      endOffset:
        endOffset === run[last.sentence].length
          ? HIGHLIGHT_END_OF_SENTENCE
          : endOffset,
    });
  }
  return out;
}

export function findUniqueMatch(
  blocks: Iterable<{
    anchor: string;
    sentences: readonly (string | undefined)[];
  }>,
  snippet: string,
  spanLength: number,
): HighlightAnchor | null {
  if (snippet.length === 0 || spanLength < 1) return null;
  let found: HighlightAnchor | null = null;
  for (const block of blocks) {
    for (let s = 1; s + spanLength - 1 <= block.sentences.length; s++) {
      const rangeText = sentenceRangeText(block.sentences, s, s + spanLength - 1);
      if (rangeText === null || !matchesSnippet(rangeText, snippet)) continue;
      if (found) return null; // ambiguous — refuse to guess
      found = { blockAnchor: block.anchor, sStart: s, sEnd: s + spanLength - 1 };
    }
  }
  return found;
}
