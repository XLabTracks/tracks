import type { PaperTocEntry } from "@/lib/arxiv/types";

// data-anchor helpers. Anchors ("b-NNNN") are assigned in document order by
// the converter, so numeric comparison orders blocks and maps any block to
// its containing toc section (toc entries carry their heading's anchor).

export function anchorNum(anchor: string): number {
  const m = /^b-(\d+)$/.exec(anchor);
  return m ? Number(m[1]) : NaN;
}

/**
 * Index of the toc entry whose section contains the given block: the last
 * entry (any level) whose own anchor precedes-or-is the block's. Returns -1
 * for blocks before the first entry (preamble) or unparseable anchors.
 */
export function sectionIndexForAnchor(
  toc: PaperTocEntry[],
  anchor: string,
): number {
  const target = anchorNum(anchor);
  if (Number.isNaN(target)) return -1;
  let index = -1;
  for (let i = 0; i < toc.length; i++) {
    const own = toc[i].anchor ? anchorNum(toc[i].anchor!) : NaN;
    if (!Number.isNaN(own) && own <= target) index = i;
  }
  return index;
}
