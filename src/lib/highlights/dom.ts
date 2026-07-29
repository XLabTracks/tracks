import {
  MATH_CLASSES,
  MATH_PLACEHOLDER,
  normalizeText,
} from "@/lib/papers/normalize";
import {
  findUniqueContaining,
  findUniqueMatch,
  matchesSnippet,
  sliceRangeText,
  snippetForRange,
} from "./match";
// (sentenceRangeText is consumed indirectly via sliceRangeText.)
import {
  buildOffsetMap,
  snapOffset,
  type OffsetMap,
  type SegmentPosition,
  type TextSegment,
} from "./offset-map";
import {
  HIGHLIGHT_END_OF_SENTENCE,
  HIGHLIGHT_MAX_BLOCKS,
  HIGHLIGHT_MAX_SENTENCE_SPAN,
  type HighlightSpan,
  type HighlightSpanInput,
} from "./types";

// Client-side DOM algebra for highlights: capture a live Selection into the
// sentence-anchored shape the server validates, and resolve a stored row back
// into a live Range over the rendered paper. Everything here reads the
// artifact DOM the reader rendered (data-anchor blocks, data-s sentence
// spans) and normalizes text EXACTLY like the server's block index — the
// normalization convention is imported from src/lib/papers/normalize.ts (the
// parser-free core block-index.ts builds on), so the stored snippet stays an
// exact-equality drift tripwire. Only the tree walkers differ: block-index
// walks HAST server-side, this walks the live DOM.
//
// One rendered wrinkle both capture and resolution must handle: a silent
// sentence hide (patch-section phase A1) replaces the hidden run with ONE
// EMPTY span carrying the run's last data-s. Converter-emitted sentence spans
// are never empty, so an empty span is always that placeholder — its text
// does NOT match the raw artifact the server validates against, which is why
// empty spans read as gaps here (capture clamps past edge placeholders and
// refuses ranges crossing interior ones, instead of producing a create the
// server is guaranteed to reject).

/**
 * Subtrees whose data-anchor/data-s nodes must never be targeted: the
 * sidenote rail's aria-hidden clones, and <ArxivPaper/> collapsible cards
 * (.ax-paper) — a card renders a DIFFERENT artifact inside the reader with
 * the same b-NNNN namespace and current data-conv, so treating its spans as
 * canonical would capture creates the server always rejects and let the
 * fuzzy fallback repaint a stored row onto the wrong document.
 */
const EXCLUDED = ".paper-sidenote-layer, .ax-paper";

/**
 * Normalized text of a [data-s] sentence span: math subtrees collapse to the
 * literal placeholder, then whitespace-normalize. Mirror of blockTextOf.
 */
export function normalizedSentenceText(el: Element): string {
  return normalizeText(rawTextOf(el));
}

function rawTextOf(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
  if (!(node instanceof Element)) return "";
  for (const cls of MATH_CLASSES) {
    if (node.classList.contains(cls)) return MATH_PLACEHOLDER;
  }
  let out = "";
  for (const child of node.childNodes) out += rawTextOf(child);
  return out;
}

/**
 * The block's OWN [data-s] sentence spans, keyed by 1-based sentence number —
 * nested [data-anchor] descendants are skipped (they index separately with
 * their own s counters). Mirror of collectSentences.
 */
export function collectSentenceSpans(block: Element): Map<number, Element> {
  const spans = new Map<number, Element>();
  collectInto(block, spans);
  return spans;
}

function collectInto(el: Element, out: Map<number, Element>): void {
  for (const child of el.children) {
    if (child.hasAttribute("data-anchor")) continue;
    const s = child.getAttribute("data-s");
    if (s !== null) {
      const n = Number(s);
      if (Number.isInteger(n) && n >= 1) out.set(n, child);
      continue;
    }
    collectInto(child, out);
  }
}

/**
 * Sparse per-sentence texts (index 0 = s:1), the shape match.ts consumes.
 * An EMPTY span (a silent-hide placeholder — see module header) stays a hole,
 * so any range covering it fails sentenceRangeText instead of "matching"
 * text the artifact doesn't join that way.
 */
function sentenceTexts(spans: Map<number, Element>): (string | undefined)[] {
  const out: (string | undefined)[] = [];
  for (const [s, el] of spans) {
    const text = normalizedSentenceText(el);
    if (text.length > 0) out[s - 1] = text;
  }
  return out;
}

/**
 * A sentence span's content as ordered segments (offset-map input) plus the
 * DOM node behind each: Text nodes for text segments, the math root element
 * for atoms — the only element entries, which is what lets locateInParts
 * treat "an element entry containing the node" as "inside an atom".
 */
interface SpanParts {
  segments: TextSegment[];
  nodes: (Text | Element)[];
}

function segmentsOf(span: Element): SpanParts {
  const segments: TextSegment[] = [];
  const nodes: (Text | Element)[] = [];
  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      segments.push({ kind: "text", text: node.nodeValue ?? "" });
      nodes.push(node as Text);
      return;
    }
    if (!(node instanceof Element)) return;
    for (const cls of MATH_CLASSES) {
      if (node.classList.contains(cls)) {
        segments.push({ kind: "math" });
        nodes.push(node);
        return;
      }
    }
    for (const child of node.childNodes) walk(child);
  };
  for (const child of span.childNodes) walk(child);
  return { segments, nodes };
}

function locateInParts(
  parts: SpanParts,
  node: Node,
): { index: number; withinAtom: boolean } | null {
  for (let i = 0; i < parts.nodes.length; i++) {
    const candidate = parts.nodes[i];
    if (candidate === node) {
      return { index: i, withinAtom: parts.segments[i].kind === "math" };
    }
    if (candidate instanceof Element && candidate.contains(node)) {
      return { index: i, withinAtom: true };
    }
  }
  return null;
}

/**
 * The normalized offset of one selection boundary relative to a sentence
 * span: 0 / text-end when the boundary sits outside the span, the mapped
 * offset when inside (boundaries inside a math atom clamp to its edges;
 * unlocatable interiors fall back to the side's safe extreme — over-cover,
 * never mis-cover).
 */
function boundaryOffsetIn(
  span: Element,
  parts: SpanParts,
  map: OffsetMap,
  container: Node,
  offset: number,
  side: "start" | "end",
): number {
  const doc = span.ownerDocument ?? document;
  const spanRange = doc.createRange();
  spanRange.selectNodeContents(span);
  let cmp: number;
  try {
    cmp = spanRange.comparePoint(container, offset);
  } catch {
    cmp = side === "start" ? -1 : 1;
  }
  if (cmp < 0) return 0;
  if (cmp > 0) return map.text.length;

  let node: Node;
  let raw: number;
  if (container.nodeType === Node.TEXT_NODE) {
    node = container;
    raw = offset;
  } else {
    const leaf = descendToBoundary(container, offset, side);
    node = leaf.node;
    raw = leaf.offset;
  }
  const found = locateInParts(parts, node);
  if (!found) return side === "start" ? 0 : map.text.length;
  if (found.withinAtom) {
    const bounds = map.atomBounds(found.index);
    if (!bounds) return side === "start" ? 0 : map.text.length;
    return side === "start" ? bounds.start : bounds.end;
  }
  return map.offsetAt(found.index, raw);
}

/** One gesture's capture: per-block spans in document order + the conv pin. */
export interface CapturedSelection {
  spans: HighlightSpanInput[];
  /** data-conv of the wrapper the selection starts in. */
  convVersion: number;
}

/**
 * Capture the current selection as a create payload — one span per touched
 * block, document order — or null when nothing in it is highlightable. The
 * selection's START must sit inside a [data-s] span (so figure/table/
 * gate-chrome/activity selections never offer the toolbar) — either inside
 * an anchored block, or inside the anchor-less second half of a block that
 * a mid-paragraph activity split (the owning anchor is recovered from the
 * nearest preceding anchored block, and the server validates against the
 * unsplit artifact block). Every further anchored block the range touches
 * contributes its own span; blocks with nothing capturable (figures, math,
 * silent-hide gaps, over-long coverage) simply drop out of the group rather
 * than refusing the gesture. Per block, boundaries map into the edge
 * sentences' normalized text (offset-map), grapheme-snapped and
 * space-trimmed — a middle block's boundaries clamp to 0/end naturally. A
 * start inside the sidenote rail's clones or an <ArxivPaper/> card is
 * refused outright.
 */
export function captureSelection(
  root: Element,
  selection: Selection,
): CapturedSelection | null {
  if (selection.rangeCount === 0 || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);

  const start = sentencePointOf(root, range.startContainer, range.startOffset);
  if (!start) return null;

  const convAttr = start.container
    .closest("[data-conv]")
    ?.getAttribute("data-conv");
  const convVersion =
    convAttr === null || convAttr === undefined
      ? Number.NaN
      : Number.parseInt(convAttr, 10);
  if (!Number.isInteger(convVersion) || convVersion < 1) return null;

  // The containers the range touches, in document order, capped at the
  // group limit. The start container leads (it may be anchor-less, with a
  // recovered anchor); ancestors of it are skipped so nested-anchor blocks
  // don't double-capture the same text.
  const containers: { anchor: string; container: Element }[] = [
    { anchor: start.anchor, container: start.container },
  ];
  const seenAnchors = new Set<string>([start.anchor]);
  if (!start.container.contains(range.endContainer)) {
    for (const block of root.querySelectorAll("[data-anchor]")) {
      if (containers.length >= HIGHLIGHT_MAX_BLOCKS) break;
      if (block === start.container || block.contains(start.container)) continue;
      if (block.closest(EXCLUDED)) continue;
      if (!range.intersectsNode(block)) continue;
      const anchor = block.getAttribute("data-anchor");
      if (!anchor || seenAnchors.has(anchor)) continue;
      seenAnchors.add(anchor);
      containers.push({ anchor, container: block });
    }
  }

  const spans: HighlightSpanInput[] = [];
  for (const entry of containers) {
    const span = captureSpanIn(entry.container, entry.anchor, range);
    if (span) spans.push(span);
  }
  if (spans.length === 0) return null;
  return { spans, convVersion };
}

/**
 * One block's slice of the gesture: covered non-empty sentence spans,
 * boundaries mapped to character precision. Null drops the block from the
 * group (no covered prose, an interior silent-hide gap, over-long coverage,
 * or an empty slice) — never a doomed create.
 */
function captureSpanIn(
  container: Element,
  anchor: string,
  range: Range,
): HighlightSpanInput | null {
  const spans = collectSentenceSpans(container);
  let sStart = Number.POSITIVE_INFINITY;
  let sEnd = 0;
  for (const [s, el] of spans) {
    if (!range.intersectsNode(el)) continue;
    // Silent-hide placeholders clamp off the covered edge; if one sits
    // INTERIOR to the range, the gap check below refuses the block.
    if (normalizedSentenceText(el).length === 0) continue;
    if (s < sStart) sStart = s;
    if (s > sEnd) sEnd = s;
  }
  if (!Number.isFinite(sStart) || sEnd < sStart) return null;
  if (sEnd - sStart + 1 > HIGHLIGHT_MAX_SENTENCE_SPAN) return null;

  // Character precision: map the selection's boundaries into the edge
  // sentences' normalized text (offset-map), snap to grapheme boundaries so
  // a mid-astral drag never yields an unstorable snippet, and trim spaces
  // off the slice's own edges. For a middle block of a multi-paragraph
  // gesture both boundaries sit outside the block, so boundaryOffsetIn
  // clamps them to 0 / text-end and the whole covered range is taken.
  const firstSpan = spans.get(sStart);
  const lastSpan = spans.get(sEnd);
  if (!firstSpan || !lastSpan) return null;
  const firstParts = segmentsOf(firstSpan);
  const firstMap = buildOffsetMap(firstParts.segments);
  const lastParts = sEnd === sStart ? firstParts : segmentsOf(lastSpan);
  const lastMap = sEnd === sStart ? firstMap : buildOffsetMap(lastParts.segments);
  let startOffset = snapOffset(
    firstMap.text,
    boundaryOffsetIn(
      firstSpan,
      firstParts,
      firstMap,
      range.startContainer,
      range.startOffset,
      "start",
    ),
    "floor",
  );
  let endOffset = snapOffset(
    lastMap.text,
    boundaryOffsetIn(
      lastSpan,
      lastParts,
      lastMap,
      range.endContainer,
      range.endOffset,
      "end",
    ),
    "ceil",
  );
  while (firstMap.text[startOffset] === " ") startOffset++;
  while (endOffset > 0 && lastMap.text[endOffset - 1] === " ") endOffset--;
  if (startOffset >= firstMap.text.length) return null;
  const endStored =
    endOffset >= lastMap.text.length ? HIGHLIGHT_END_OF_SENTENCE : endOffset;

  // A gap inside the covered range (non-prose children between sentences, or
  // a silently hidden sentence) has no client-side text matching what the
  // server would validate against — refuse. sliceRangeText also re-validates
  // the offsets against the sentence texts (divergence → null, never a
  // doomed create).
  const rangeText = sliceRangeText(sentenceTexts(spans), {
    sStart,
    sEnd,
    startOffset,
    endOffset: endStored,
  });
  if (rangeText === null) return null;
  const snippet = snippetForRange(rangeText);
  if (snippet.length === 0) return null;

  return {
    blockAnchor: anchor,
    sStart,
    sEnd,
    startOffset,
    endOffset: endStored,
    snippet,
  };
}

export type ResolvedHighlight = { range: Range } | { orphan: true };

/**
 * One fuzzy-search candidate: a set of sentence spans that must re-match (or
 * not) as a unit. Usually an anchored block's own spans; also the anchor-less
 * second half of a mid-paragraph split, which lives in a separate wrapper.
 */
export interface FuzzyEntry {
  spans: Map<number, Element>;
  sentences: (string | undefined)[];
}

/**
 * Every sentence-span container in the rendered paper, for the fuzzy
 * fallback: spans group under their closest [data-anchor] ancestor when they
 * have one, else under their anchor-less top container (a split second
 * half — its spans keep the original data-s numbering, so stored rows on
 * second-half sentences can re-match). Built once per resolve pass (see
 * resolveHighlight's getFuzzyIndex parameter) — per-row rebuilding would be
 * O(rows × document) text extraction on the main thread.
 */
export function buildFuzzyIndex(root: Element): FuzzyEntry[] {
  const owners = new Map<Element, Map<number, Element>>();
  for (const span of root.querySelectorAll("[data-s]")) {
    if (span.closest(EXCLUDED)) continue;
    const owner =
      span.closest("[data-anchor]") ?? anchorlessContainer(root, span);
    if (!owner) continue;
    const s = Number(span.getAttribute("data-s"));
    if (!Number.isInteger(s) || s < 1) continue;
    let spans = owners.get(owner);
    if (!spans) {
      spans = new Map();
      owners.set(owner, spans);
    }
    if (!spans.has(s)) spans.set(s, span);
  }
  const entries: FuzzyEntry[] = [];
  for (const spans of owners.values()) {
    entries.push({ spans, sentences: sentenceTexts(spans) });
  }
  return entries;
}

/**
 * Resolve a stored row to one live Range spanning its first→last covered
 * sentence span. The anchor is only a hint: the range paints solely when the
 * stored snippet still matches the resolved text; on any miss the fallback
 * slides the snippet over every fuzzy-index entry and repaints only a UNIQUE
 * re-match (renumbered artifact, or a sentence span pushed into a split's
 * second half), else the row is an orphan — listed, never painted.
 *
 * `getFuzzyIndex` supplies the (caller-memoized) buildFuzzyIndex result;
 * null skips the fallback entirely — the caller passes null while any
 * reading gate is still closed, because a unique match against a partial
 * document can be a FALSE unique (the true occurrence is unmounted) and
 * would paint the wrong sentence.
 */
export function resolveHighlight(
  root: Element,
  row: HighlightSpan & { snippet: string },
  getFuzzyIndex: (() => FuzzyEntry[]) | null,
): ResolvedHighlight {
  const spanLength = row.sEnd - row.sStart + 1;
  if (spanLength < 1) return { orphan: true };

  const block = canonicalBlock(root, row.blockAnchor);
  if (block) {
    const spans = collectSentenceSpans(block);
    const rangeText = sliceRangeText(sentenceTexts(spans), row);
    if (rangeText !== null && matchesSnippet(rangeText, row.snippet)) {
      const range = rangeForSpan(spans, row);
      if (range) return { range };
    }
  }

  if (!getFuzzyIndex) return { orphan: true };
  const entries = getFuzzyIndex();
  // Synthetic index keys, not anchors: each entry must match (or not) on its
  // own so a unique hit maps back to exactly one DOM element set.
  const blocksView = entries.map((entry, i) => ({
    anchor: String(i),
    sentences: entry.sentences,
  }));
  // Whole-sentence rows keep the stricter window-equality search; partial
  // rows re-derive their whole span (sentences AND offsets) from a unique
  // substring occurrence, tolerating re-segmentation.
  let matched: HighlightSpan | null;
  if (row.startOffset === 0 && row.endOffset === HIGHLIGHT_END_OF_SENTENCE) {
    const match = findUniqueMatch(blocksView, row.snippet, spanLength);
    matched = match
      ? { ...match, startOffset: 0, endOffset: HIGHLIGHT_END_OF_SENTENCE }
      : null;
  } else {
    matched = findUniqueContaining(blocksView, row.snippet);
  }
  if (!matched) return { orphan: true };
  const spans = entries[Number(matched.blockAnchor)]?.spans;
  if (!spans) return { orphan: true };
  const range = rangeForSpan(spans, matched);
  return range ? { range } : { orphan: true };
}

/**
 * Build the live Range for a (possibly character-precise) span over one
 * block's sentence spans. Whole-sentence edges use element boundaries (the
 * cheap, pre-offset path); partial edges map their normalized offset to an
 * exact (text node, raw offset) via the offset map, with math-atom edges
 * expressed as before/after the atom element.
 */
function rangeForSpan(
  spans: Map<number, Element>,
  span: Omit<HighlightSpan, "blockAnchor">,
): Range | null {
  const first = spans.get(span.sStart);
  const last = spans.get(span.sEnd);
  if (!first || !last) return null;
  if (
    span.startOffset === 0 &&
    span.endOffset === HIGHLIGHT_END_OF_SENTENCE
  ) {
    return rangeOver(first, last);
  }
  const range = (first.ownerDocument ?? document).createRange();
  const firstParts = segmentsOf(first);
  const firstMap = buildOffsetMap(firstParts.segments);
  if (span.startOffset === 0) {
    range.setStartBefore(first);
  } else {
    const position = firstMap.startPosition(span.startOffset);
    if (!position || !applyPosition(range, "start", firstParts, position)) {
      return null;
    }
  }
  const lastParts = span.sEnd === span.sStart ? firstParts : segmentsOf(last);
  const lastMap =
    span.sEnd === span.sStart ? firstMap : buildOffsetMap(lastParts.segments);
  if (span.endOffset === HIGHLIGHT_END_OF_SENTENCE) {
    range.setEndAfter(last);
  } else {
    const position = lastMap.endPosition(span.endOffset);
    if (!position || !applyPosition(range, "end", lastParts, position)) {
      return null;
    }
  }
  return range.collapsed ? null : range;
}

function applyPosition(
  range: Range,
  side: "start" | "end",
  parts: SpanParts,
  position: SegmentPosition,
): boolean {
  const node = parts.nodes[position.segment];
  if (!node) return false;
  if ("edge" in position) {
    if (side === "start") {
      if (position.edge === "before") range.setStartBefore(node);
      else range.setStartAfter(node);
    } else {
      if (position.edge === "before") range.setEndBefore(node);
      else range.setEndAfter(node);
    }
    return true;
  }
  if (node.nodeType !== Node.TEXT_NODE) return false;
  const text = node.nodeValue ?? "";
  const offset = Math.min(position.offset, text.length);
  if (side === "start") range.setStart(node, offset);
  else range.setEnd(node, offset);
  return true;
}

/**
 * The element a resolved range starts before (its first sentence span) — the
 * scroll target for "jump to highlight".
 */
export function rangeAnchorElement(range: Range): Element | null {
  const container = range.startContainer;
  if (container instanceof Element) {
    const child = container.childNodes[range.startOffset];
    if (child instanceof Element) return child;
    return container;
  }
  return container.parentElement;
}

function toElement(node: Node): Element | null {
  return node instanceof Element ? node : node.parentElement;
}

/**
 * The leaf position a range boundary actually points at. Firefox's
 * triple-click emits element-level boundaries — the container is the block
 * element itself with a child offset — so descend, SIDE-AWARE: a start
 * boundary lands at the first leaf of the child AT the offset (position 0);
 * an end boundary before childNodes[i] sits after childNodes[i-1], so it
 * lands at that child's LAST leaf, at its end — descending end-side to the
 * first leaf instead would map the boundary before content it covers and
 * make whole-element selections capture empty. Chrome/Safari's text-node
 * boundaries pass straight through untouched (handled by the caller).
 */
function descendToBoundary(
  node: Node,
  offset: number,
  side: "start" | "end",
): { node: Node; offset: number } {
  let current = node;
  let childIndex = offset;
  let mode = side;
  while (current instanceof Element && current.childNodes.length > 0) {
    const children = current.childNodes;
    if (mode === "end" && childIndex > 0) {
      // An END boundary before childNodes[i] sits AFTER childNodes[i-1]:
      // descend to that child's LAST leaf, at its end.
      let index = Math.min(childIndex, children.length) - 1;
      // Step back over serialization whitespace at the boundary.
      while (
        index > 0 &&
        children[index].nodeType === Node.TEXT_NODE &&
        (children[index].nodeValue ?? "").trim() === ""
      ) {
        index--;
      }
      current = children[index];
      childIndex =
        current instanceof Element
          ? current.childNodes.length
          : (current.nodeValue ?? "").length;
      continue;
    }
    let index = Math.min(childIndex, children.length - 1);
    // Step over serialization whitespace at the boundary: a triple-click's
    // element boundary can point at the formatting text node BEFORE the
    // first sentence span, and the selection visually starts at the span.
    while (
      index < children.length - 1 &&
      children[index].nodeType === Node.TEXT_NODE &&
      (children[index].nodeValue ?? "").trim() === ""
    ) {
      index++;
    }
    current = children[index];
    childIndex = 0;
    mode = "start"; // only the first hop uses the range offset
  }
  const max =
    current.nodeType === Node.TEXT_NODE ? (current.nodeValue ?? "").length : 0;
  return { node: current, offset: Math.min(childIndex, max) };
}

function sentencePointOf(
  root: Element,
  node: Node,
  offset: number,
): { anchor: string; container: Element } | null {
  const el = toElement(descendToBoundary(node, offset, "start").node);
  if (!el || !root.contains(el) || el.closest(EXCLUDED)) return null;
  const span = el.closest("[data-s]");
  if (!span) return null;
  const block = span.closest("[data-anchor]");
  if (block) {
    const anchor = block.getAttribute("data-anchor");
    return anchor ? { anchor, container: block } : null;
  }
  // Anchor-less container: the second half of a block split by a
  // mid-paragraph activity (phase B strips data-anchor/id and the half
  // renders in the NEXT wrapper). Its spans keep the original data-s
  // numbering, so the owning anchor is the nearest preceding anchored
  // block's — the split's first half — and the server validates the range
  // against the unsplit artifact block. The numbering-continuity check below
  // is what proves the pairing: a split's first half ends exactly where the
  // second half begins; any other anchor-less span (nothing in committed
  // content today) fails it and the capture is refused rather than posted
  // against a wrong anchor the server would reject.
  const container = anchorlessContainer(root, span);
  if (!container) return null;
  const anchorBlock = precedingAnchoredBlock(root, container);
  const anchor = anchorBlock?.getAttribute("data-anchor");
  if (!anchorBlock || !anchor) return null;
  const firstHalfMax = Math.max(0, ...collectSentenceSpans(anchorBlock).keys());
  const containerMin = Math.min(...collectSentenceSpans(container).keys());
  if (firstHalfMax === 0 || containerMin <= firstHalfMax) return null;
  return { anchor, container };
}

/**
 * The top ancestor of an anchor-less sentence span: walk up until the parent
 * is a paper wrapper ([data-conv]) or the reader root. Null if the walk hits
 * the document without either (a span outside any paper wrapper).
 */
function anchorlessContainer(root: Element, span: Element): Element | null {
  let current: Element = span;
  for (;;) {
    const parent = current.parentElement;
    if (!parent) return null;
    if (parent === root || parent.hasAttribute("data-conv")) return current;
    current = parent;
  }
}

/** The last [data-anchor] element in document order before `node`. */
function precedingAnchoredBlock(root: Element, node: Element): Element | null {
  let found: Element | null = null;
  for (const el of root.querySelectorAll("[data-anchor]")) {
    if (el.closest(EXCLUDED)) continue;
    // querySelectorAll is document order — keep the last one preceding node.
    if (node.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING) {
      found = el;
    }
  }
  return found;
}

function canonicalBlock(root: Element, anchor: string): Element | null {
  const candidates = root.querySelectorAll(
    `[data-anchor="${CSS.escape(anchor)}"]`,
  );
  for (const el of candidates) {
    if (!el.closest(EXCLUDED)) return el;
  }
  return null;
}

function rangeOver(first: Element, last: Element): Range {
  const range = (first.ownerDocument ?? document).createRange();
  range.setStartBefore(first);
  range.setEndAfter(last);
  return range;
}
