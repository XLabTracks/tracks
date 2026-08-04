import type { PaperTocEntry } from "@/lib/arxiv/types";
import type { PaperInsertionItem } from "@/lib/content/types";
import { anchorNum, sectionIndexForAnchor } from "./anchors";
import type { InsertedSection, SectionInsertPlan } from "./section-inserts";
import { insertionAnchorId, subtreeEndIndex } from "./split-paper";

// Builds the sidebar's per-paper navigation model: the paper's section tree
// with entries for activity edits spliced in at the positions where the
// reader actually renders them — section-end activities at their subtree
// end (boundary math shared with split-paper.ts), block/sentence-level
// activities nested under their containing section. Hidden/added content
// gets no nav entries. Inserted `op: "section"` subsections get a real
// section entry (nested under their parent, in document order), and the
// paper's own later sibling subsections show their shifted display numbers
// (see section-inserts.ts) — ids/anchors stay verbatim. Gate edits get no
// entries, but every row whose target renders BELOW a gate carries that
// gate's id in `gateIds`, so the sidebar can lock rows whose DOM targets are
// unmounted until the learner opens the gates above them.

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
  plan?: SectionInsertPlan,
): PaperNavItem[] {
  const sections = plan?.sections ?? [];
  const numberOverrides = plan?.numberOverrides;

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
  // Merge activities/gates with inserted-section entries into one
  // document-ordered stream. An inserted heading is a block-level op like a
  // block-targeted activity or gate, so it carries the same key shape: the
  // edits index (key[3]) decides the order of everything sharing an anchor,
  // exactly as patch-section's phase C emits them. Sentence-targeted entries
  // (key[2] = the sentence index) still precede it — phase B splits the
  // paragraph before phase C appends anything after the block.
  type Contribution =
    | {
        beforeIndex: number;
        key: [number, number, number, number];
        activity: PaperNavActivity | undefined;
        gateId: string | undefined;
        level: number;
      }
    | {
        beforeIndex: number;
        key: [number, number, number, number];
        section: InsertedSection;
      };
  const contributions: Contribution[] = [
    ...resolved.map((r) => ({
      beforeIndex: r.beforeIndex,
      key: [r.group, r.sort[0], r.sort[1], r.sort[2]] as [
        number,
        number,
        number,
        number,
      ],
      activity: r.activity,
      gateId: r.gateId,
      level: r.level,
    })),
    ...sections.map((section) => ({
      beforeIndex: section.beforeIndex,
      key: [
        0,
        section.afterNum,
        Number.MAX_SAFE_INTEGER,
        section.editIndex,
      ] as [number, number, number, number],
      section,
    })),
  ];
  contributions.sort(
    (a, b) =>
      a.beforeIndex - b.beforeIndex ||
      a.key[0] - b.key[0] ||
      a.key[1] - b.key[1] ||
      a.key[2] - b.key[2] ||
      a.key[3] - b.key[3],
  );

  // Walk in render order, accumulating the gates passed so far; every row
  // emitted after a gate marker carries the accumulated ids. `openSection`
  // tracks the inserted heading an anchor-level entry renders INSIDE — the
  // most recent one in this bucket — so its rows nest one level deeper.
  // Section-end entries never nest: they render at the parent's subtree end,
  // past the inserted subsection's content.
  type Marker = { gate: string } | { item: PaperNavItem };
  const markersBefore = new Map<number, Marker[]>();
  let openBucket = -1;
  let openSection: InsertedSection | undefined;
  for (const contribution of contributions) {
    if (contribution.beforeIndex !== openBucket) {
      openBucket = contribution.beforeIndex;
      openSection = undefined;
    }
    const bucket = markersBefore.get(contribution.beforeIndex) ?? [];
    if ("section" in contribution) {
      const s = contribution.section;
      openSection = s;
      bucket.push({
        item: {
          kind: "section",
          id: s.id,
          title: s.title,
          number: s.number,
          level: s.level,
        },
      });
    } else if (contribution.gateId !== undefined) {
      bucket.push({ gate: contribution.gateId });
    } else {
      const { activity, level } = contribution;
      const parent = "anchor" in activity!.after ? openSection : undefined;
      const itemLevel = (parent ? parent.level : level) + 1;
      for (const item of activity!.items) {
        const anchorId = insertionAnchorId(item);
        const shared = { anchorId, title: item.title, level: itemLevel };
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
    markersBefore.set(contribution.beforeIndex, bucket);
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
      number: numberOverrides?.get(entry.id) ?? entry.number,
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
