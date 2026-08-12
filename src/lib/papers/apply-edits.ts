import type { PaperTocEntry } from "@/lib/arxiv/types";
import {
  editTargetRef,
  isSectionEndRef,
  type PaperBlockRef,
  type PaperEdit,
  type PaperInsertionItem,
} from "@/lib/content/types";
import { anchorNum } from "./anchors";
import { collapseTailSections, sectionElementEnd } from "./collapse-tail";
import {
  applySecnumOverrides,
  planSectionInserts,
} from "./section-inserts";
import { sectionStartOffset, splitAtSectionEnds } from "./split-paper";
import {
  patchSectionHtml,
  renderBlockAddHtml,
  type InsertedSectionRender,
  type SectionPart,
} from "./patch-section";

// Applies a paper's edits in two tiers:
//   tier 1 — section-end ops (activities/adds after a toc subtree) via the
//     existing string splitter: byte-identical fast path, nothing parsed;
//   tier 2 — block/sentence ops: ONLY the sections containing them are
//     parsed, tree-patched, and re-serialized (patch-section.ts). Unedited
//     stretches are emitted as raw slices of the original html.
// A paper without edits costs exactly one html part, no parsing.

export type PaperPart =
  | { kind: "html"; html: string }
  | { kind: "activity"; items: PaperInsertionItem[] }
  | {
      kind: "gate";
      id: string;
      prompt?: string;
      cta?: string;
      written?: true;
      minChars?: number;
    };

export interface AppliedPaper {
  parts: PaperPart[];
  /**
   * The landmark sections (references/footnotes) ONLY, extracted from the
   * final html part when the paper has gates. The reader renders this
   * OUTSIDE the gate walk, so visible citations and footnote markers keep
   * live targets (and the sidenote layer has note bodies to clone) while the
   * body below a closed gate is still unmounted. Appendix sections that
   * interleave with the landmarks are body content and stay in the gated
   * parts. Unset when the paper has no gates or no trailing landmarks.
   */
  ungatedTailHtml?: string;
  /** Ops whose target didn't resolve (fail-soft; see content.test.ts for the real gate). */
  unmatchedEdits: PaperEdit[];
}

export function applyPaperEdits(
  sourceHtml: string,
  toc: PaperTocEntry[],
  edits: PaperEdit[] | undefined
): AppliedPaper {
  const all = edits ?? [];
  if (all.length === 0)
    return { parts: [{ kind: "html", html: sourceHtml }], unmatchedEdits: [] };

  // Inserted-section plan: derived numbers/levels for `op: "section"` edits and
  // the display-number shift for the paper's own later sibling subsections.
  // The ax-secnum rewrite runs on every EMITTED html piece, never on the
  // input: snippet tripwires (patch-section's resolve, mirrored by
  // content.test.ts against the raw artifact) must keep matching the
  // artifact's own heading text, so displayed numbers shift only on the way
  // out (the artifact JSON itself is untouched — numbers shift even in
  // sections that carry no block ops, since raw slices pass through too).
  const plan = planSectionInserts(toc, all);
  const withSecnums = (value: string) =>
    applySecnumOverrides(value, plan.numberOverrides);
  const insertedSections = new Map<string, InsertedSectionRender>(
    plan.sections.map((s) => [
      s.id,
      { number: s.number, level: s.level, title: s.title },
    ]),
  );

  // hide/gloss target blocks by construction; add/activity may target either.
  const sectionEndOps = all.filter((op) => isSectionEndRef(editTargetRef(op)));
  const blockOps = all.filter((op) => !isSectionEndRef(editTargetRef(op)));
  const unmatchedEdits: PaperEdit[] = [];

  // ---- Tier 1: section-end boundaries -------------------------------------
  const tier1 = splitAtSectionEnds<PaperEdit>(
    sourceHtml,
    toc,
    sectionEndOps.map((op) => {
      const ref = editTargetRef(op);
      return {
        sectionId: isSectionEndRef(ref) ? ref.sectionEnd : "",
        payload: op,
      };
    })
  );
  unmatchedEdits.push(...tier1.unmatched.map((entry) => entry.payload));

  // ---- Tier 2: map block ops to section slices -----------------------------
  // A slice runs from a locatable toc entry to the next locatable one — the
  // smallest parse region containing the target block. Ops map to the last
  // locatable+anchored entry preceding their block (preamble = key -1).
  const locatable = toc
    .map((entry, tocIndex) => ({
      tocIndex,
      anchor: entry.anchor,
      start: sectionStartOffset(sourceHtml, entry.id),
    }))
    .filter((slice) => slice.start !== -1);

  const sliceKeyForAnchor = (anchor: string): number => {
    const target = anchorNum(anchor);
    let key = -1;
    for (const slice of locatable) {
      if (!slice.anchor) continue;
      const own = anchorNum(slice.anchor);
      if (!Number.isNaN(own) && own <= target) key = slice.tocIndex;
    }
    return key;
  };

  const opsBySlice = new Map<number, PaperEdit[]>();
  for (const op of blockOps) {
    const ref = editTargetRef(op) as PaperBlockRef;
    if (Number.isNaN(anchorNum(ref.anchor))) {
      unmatchedEdits.push(op);
      continue;
    }
    const key = sliceKeyForAnchor(ref.anchor);
    const bucket = opsBySlice.get(key) ?? [];
    bucket.push(op);
    opsBySlice.set(key, bucket);
  }

  interface EditedSlice {
    start: number;
    end: number;
    ops: PaperEdit[];
  }
  const editedSlices: EditedSlice[] = [];
  if (opsBySlice.has(-1)) {
    editedSlices.push({
      start: 0,
      end: locatable[0]?.start ?? sourceHtml.length,
      ops: opsBySlice.get(-1)!,
    });
  }
  locatable.forEach((slice, i) => {
    const ops = opsBySlice.get(slice.tocIndex);
    if (!ops) return;
    editedSlices.push({
      start: slice.start,
      end: locatable[i + 1]?.start ?? sourceHtml.length,
      ops,
    });
  });
  editedSlices.sort((a, b) => a.start - b.start);

  // ---- Emit: tier-1 segments with tier-2 patches spliced in ---------------
  const parts: PaperPart[] = [];
  const emitHtml = (value: string) => {
    if (value) parts.push({ kind: "html", html: withSecnums(value) });
  };
  const emitSectionEndOp = (op: PaperEdit) => {
    if (op.op === "activity") parts.push({ kind: "activity", items: op.items });
    else if (op.op === "gate")
      parts.push({
        kind: "gate",
        id: op.id,
        prompt: op.prompt,
        cta: op.cta,
        written: op.written,
        minChars: op.minChars,
      });
    else if (op.op === "add")
      emitHtml(renderBlockAddHtml(op.markdown, op.label, op.plain));
  };

  let sliceIndex = 0;
  let abs = 0;
  tier1.segments.forEach((segment, k) => {
    const segStart = abs;
    const segEnd = segStart + segment.length;
    abs = segEnd;

    let cursor = segStart;
    while (
      sliceIndex < editedSlices.length &&
      editedSlices[sliceIndex].start < segEnd
    ) {
      const slice = editedSlices[sliceIndex];
      // Tier-1 boundaries are section starts, so slices nest inside segments;
      // clamp defensively regardless.
      const start = Math.max(slice.start, segStart);
      const end = Math.min(slice.end, segEnd);
      emitHtml(sourceHtml.slice(cursor, start));
      const patched = patchSectionHtml(
        sourceHtml.slice(start, end),
        slice.ops,
        insertedSections,
      );
      parts.push(
        ...patched.parts.map((part) =>
          part.kind === "html"
            ? { ...part, html: withSecnums(part.html) }
            : part,
        ),
      );
      unmatchedEdits.push(...patched.unmatched);
      cursor = end;
      sliceIndex++;
    }
    emitHtml(sourceHtml.slice(cursor, segEnd));

    tier1.points[k]?.payloads.forEach(emitSectionEndOp);
  });

  // ---- Merge adjacent html parts -------------------------------------------
  const merged: PaperPart[] = [];
  for (const part of parts) {
    const last = merged[merged.length - 1];
    if (part.kind === "html" && last?.kind === "html") {
      last.html += part.html;
      continue;
    }
    merged.push(part);
  }
  const ungatedTailHtml = splitUngatedTail(merged, toc);
  return { parts: merged, ungatedTailHtml, unmatchedEdits };
}

/**
 * With gates present, everything after a gate part mounts only once the gate
 * opens — which would trap the paper's references/footnotes landmarks behind
 * the LAST gate, leaving the visible pre-gate text with dead citation links
 * and no sidenotes. Extract the landmark <section> elements THEMSELVES from
 * the final html part so the reader can render them outside the gate walk.
 * Only the landmarks move: the flat appendix sections that follow References
 * in arXiv output are body content the gates sequence — they stay in the
 * gated walk, matching the sidebar's lock model (paper-nav.ts locks their
 * rows via gateIds). Because the References landmark leaves the walk, the
 * appendix stretch it introduced would never collapse in the reader's
 * collapseTailSections pass (no references opener left in the parts), so the
 * split collapses that remainder here. (Landmarks are trailing by converter
 * construction; an activity placed after them keeps the final part non-html
 * and skips the split — fail-soft, gating stands.)
 */
function splitUngatedTail(
  parts: PaperPart[],
  toc: PaperTocEntry[]
): string | undefined {
  if (!parts.some((part) => part.kind === "gate")) return undefined;
  const last = parts[parts.length - 1];
  if (!last || last.kind !== "html") return undefined;
  const ranges = toc
    .filter(
      (entry) => entry.kind === "references" || entry.kind === "footnotes"
    )
    .flatMap((entry) => {
      const start = sectionStartOffset(last.html, entry.id);
      if (start === -1) return [];
      const end = sectionElementEnd(last.html, start);
      // Malformed wrapper — leave the entry in the gated walk (fail-soft).
      return end === null ? [] : [{ start, end, kind: entry.kind }];
    })
    .sort((a, b) => a.start - b.start);
  if (ranges.length === 0) return undefined;
  const tail = ranges.map((range) => last.html.slice(range.start, range.end)).join("");
  // Stitch the non-landmark remainder back together; stretches after the
  // References landmark (the appendix run) collapse now — see above.
  let remaining = "";
  let cursor = 0;
  let sawReferences = false;
  for (const range of ranges) {
    const piece = last.html.slice(cursor, range.start);
    remaining += sawReferences ? collapseTailSections(piece, true).html : piece;
    if (range.kind === "references") sawReferences = true;
    cursor = range.end;
  }
  const after = last.html.slice(cursor);
  remaining += sawReferences ? collapseTailSections(after, true).html : after;
  if (remaining === "") parts.pop();
  else last.html = remaining;
  return tail;
}

export type { SectionPart };
