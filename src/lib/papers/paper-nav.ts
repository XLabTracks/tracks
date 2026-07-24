import type { PaperTocEntry } from "@/lib/arxiv/types";
import type { PaperInsertionItem } from "@/lib/content/types";
import { anchorNum, sectionIndexForAnchor } from "./anchors";
import { insertionAnchorId, subtreeEndIndex } from "./split-paper";

// Builds the sidebar's per-paper navigation model: the paper's section tree
// with entries for activity edits spliced in at the positions where the
// reader actually renders them — section-end activities at their subtree
// end (boundary math shared with split-paper.ts), block/sentence-level
// activities nested under their containing section. Hidden/added content
// gets no nav entries. Gate edits get no entries either, but every row whose
// target renders BELOW a gate carries that gate's id in `gateIds`, so the
// sidebar can lock rows whose DOM targets are unmounted until the learner
// opens the gates above them.

export type PaperNavItem = (
  | { kind: "section"; id: string; title: string; number: string; level: number }
  | { kind: "inserted-lesson"; anchorId: string; lessonId: string; title: string; level: number }
  | { kind: "inserted-exercise"; anchorId: string; exerciseId: string; title: string; level: number }
  | { kind: "inserted-demo"; anchorId: string; demoId: string; title: string; level: number }
  | { kind: "inserted-sequence"; anchorId: string; title: string; level: number }
) & {
  /**
   * Reading gates above this row, in reading order — its target is unmounted
   * (references/footnotes excepted) until every listed gate is opened.
   */
  gateIds?: string[];
};

/** An activity edit with display titles already resolved by the caller. */
export interface PaperNavActivity {
  after: { sectionEnd: string } | { anchor: string; s?: number };
  items: Array<PaperInsertionItem & { title: string }>;
  /** Position in the paper's edits array (orders same-target gates/activities). */
  editIndex?: number;
}

/** A gate edit, in the caller-resolved shape PaperNavActivity uses. */
export interface PaperNavGate {
  id: string;
  after: { sectionEnd: string } | { anchor: string; s?: number };
  /** Position in the paper's edits array (orders same-target gates/activities). */
  editIndex?: number;
}

export function buildPaperNav(
  toc: PaperTocEntry[],
  activities: PaperNavActivity[] | undefined,
  gates?: PaperNavGate[],
): PaperNavItem[] {
  // Resolve every activity AND gate to the toc index it renders before, with
  // an intra-bucket sort key. Anchor-level entries come before the same
  // bucket's section-end ones (they sit inside the section's own text);
  // section-end ordering mirrors splitAtSectionEnds (deeper targets first).
  const place = (
    after: { sectionEnd: string } | { anchor: string; s?: number },
    configIndex: number,
  ) => {
    if ("sectionEnd" in after) {
      const index = toc.findIndex((entry) => entry.id === after.sectionEnd);
      return {
        beforeIndex: index === -1 ? toc.length : subtreeEndIndex(toc, index),
        group: 1,
        sort: [index === -1 ? Number.MAX_SAFE_INTEGER : -toc[index].level, index, configIndex],
        level: index === -1 ? 2 : toc[index].level,
      };
    }
    const section = sectionIndexForAnchor(toc, after.anchor);
    return {
      // A preamble anchor (before the first toc entry) renders in the
      // preamble; place its nav entry before toc[0], matching the reader's
      // slice-key -1 (not after the first section).
      beforeIndex: section === -1 ? 0 : section + 1,
      group: 0,
      sort: [anchorNum(after.anchor), after.s ?? Number.MAX_SAFE_INTEGER, configIndex],
      level: section === -1 ? 2 : toc[section].level,
    };
  };
  const resolved = [
    ...(activities ?? []).map((activity, i) => ({
      activity,
      gateId: undefined as string | undefined,
      ...place(activity.after, activity.editIndex ?? i),
    })),
    ...(gates ?? []).map((gate, i) => ({
      activity: undefined as PaperNavActivity | undefined,
      gateId: gate.id,
      ...place(gate.after, gate.editIndex ?? i),
    })),
  ];
  resolved.sort(
    (a, b) =>
      a.beforeIndex - b.beforeIndex ||
      a.group - b.group ||
      a.sort[0] - b.sort[0] ||
      a.sort[1] - b.sort[1] ||
      a.sort[2] - b.sort[2],
  );

  // Walk in render order, accumulating the gates passed so far; every row
  // emitted after a gate marker carries the accumulated ids.
  type Marker = { gate: string } | { item: PaperNavItem };
  const markersBefore = new Map<number, Marker[]>();
  for (const { activity, gateId, beforeIndex, level } of resolved) {
    const bucket = markersBefore.get(beforeIndex) ?? [];
    if (gateId !== undefined) {
      bucket.push({ gate: gateId });
    } else {
      for (const item of activity!.items) {
        const anchorId = insertionAnchorId(item);
        const shared = { anchorId, title: item.title, level: level + 1 };
        bucket.push({
          item:
            item.kind === "lesson"
              ? { kind: "inserted-lesson", lessonId: item.id, ...shared }
              : item.kind === "demo"
                ? { kind: "inserted-demo", demoId: item.id, ...shared }
                : item.kind === "sequence"
                  ? { kind: "inserted-sequence", ...shared }
                  : { kind: "inserted-exercise", exerciseId: item.id, ...shared },
        });
      }
    }
    markersBefore.set(beforeIndex, bucket);
  }

  const nav: PaperNavItem[] = [];
  const activeGates: string[] = [];
  const emit = (item: PaperNavItem) => {
    nav.push(activeGates.length > 0 ? { ...item, gateIds: [...activeGates] } : item);
  };
  const drainBucket = (index: number) => {
    for (const marker of markersBefore.get(index) ?? []) {
      if ("gate" in marker) activeGates.push(marker.gate);
      else emit(marker.item);
    }
  };
  toc.forEach((entry, index) => {
    drainBucket(index);
    const item: PaperNavItem = {
      kind: "section",
      id: entry.id,
      title: entry.title,
      number: entry.number,
      level: entry.level,
    };
    // References/footnotes render outside the gate walk (the reader's
    // ungatedTailHtml), so their rows stay unlocked even below a gate.
    if (entry.kind === "references" || entry.kind === "footnotes") nav.push(item);
    else emit(item);
  });
  drainBucket(toc.length);
  return nav;
}
