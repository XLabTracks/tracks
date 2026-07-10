import { describe, expect, it } from "vitest";
import type { PaperTocEntry } from "@/lib/arxiv/types";
import { buildPaperNav } from "./paper-nav";

const TOC: PaperTocEntry[] = [
  { kind: "abstract", id: "ax-abstract", title: "Abstract", number: "", level: 2, anchor: "b-0001" },
  { kind: "section", id: "ax-sec-a", title: "Alpha", number: "1", level: 2, anchor: "b-0002" },
  { kind: "section", id: "ax-sec-a-1", title: "Alpha One", number: "1.1", level: 3, anchor: "b-0007" },
  { kind: "section", id: "ax-sec-b", title: "Beta", number: "2", level: 2, anchor: "b-0009" },
  { kind: "references", id: "ax-references", title: "References", number: "", level: 2, anchor: "b-0015" },
];

const ids = (nav: ReturnType<typeof buildPaperNav>) =>
  nav.map((n) => (n.kind === "section" ? n.id : n.anchorId));

describe("buildPaperNav", () => {
  it("maps the toc one-to-one when there are no activities", () => {
    const nav = buildPaperNav(TOC, undefined);
    expect(ids(nav)).toEqual(TOC.map((e) => e.id));
    expect(nav.every((n) => n.kind === "section")).toBe(true);
  });

  it("places section-end activities after their target's subtree, indented one level", () => {
    const nav = buildPaperNav(TOC, [
      {
        after: { sectionEnd: "ax-sec-a-1" },
        items: [{ kind: "exercise", id: "mc", title: "Multiple choice" }],
      },
    ]);
    expect(ids(nav)).toEqual([
      "ax-abstract",
      "ax-sec-a",
      "ax-sec-a-1",
      "ins-exercise-mc",
      "ax-sec-b",
      "ax-references",
    ]);
    const inserted = nav.find((n) => n.kind === "inserted-exercise")!;
    expect(inserted.level).toBe(4); // target h3 (level 3) + 1
  });

  it("matches the splitter's coincident-boundary ordering (deeper first)", () => {
    const nav = buildPaperNav(TOC, [
      { after: { sectionEnd: "ax-sec-a" }, items: [{ kind: "lesson", id: "p", title: "Parent" }] },
      { after: { sectionEnd: "ax-sec-a-1" }, items: [{ kind: "exercise", id: "c", title: "Child" }] },
    ]);
    expect(ids(nav)).toEqual([
      "ax-abstract",
      "ax-sec-a",
      "ax-sec-a-1",
      "ins-exercise-c", // child subsection's block first…
      "ins-lesson-p", // …then the parent section's
      "ax-sec-b",
      "ax-references",
    ]);
  });

  it("nests anchor-level activities under their containing section", () => {
    const nav = buildPaperNav(TOC, [
      {
        // block b-0003 lives in section Alpha (anchor b-0002 ≤ 3 < b-0007)
        after: { anchor: "b-0003", s: 1 },
        items: [{ kind: "exercise", id: "tf", title: "True / false" }],
      },
    ]);
    expect(ids(nav)).toEqual([
      "ax-abstract",
      "ax-sec-a",
      "ins-exercise-tf", // inside Alpha, before Alpha One
      "ax-sec-a-1",
      "ax-sec-b",
      "ax-references",
    ]);
    const inserted = nav.find((n) => n.kind === "inserted-exercise")!;
    expect(inserted.level).toBe(3); // containing section level 2 + 1
  });

  it("orders anchor-level activities by (anchor, s) before the section's end activities", () => {
    const nav = buildPaperNav(TOC, [
      { after: { sectionEnd: "ax-sec-a-1" }, items: [{ kind: "exercise", id: "end", title: "End" }] },
      { after: { anchor: "b-0008", s: 2 }, items: [{ kind: "exercise", id: "s2", title: "S2" }] },
      { after: { anchor: "b-0008", s: 1 }, items: [{ kind: "exercise", id: "s1", title: "S1" }] },
    ]);
    // b-0008 is inside Alpha One (b-0007 ≤ 8 < b-0009); its entries come
    // before the section-end entry in the same bucket.
    expect(ids(nav)).toEqual([
      "ax-abstract",
      "ax-sec-a",
      "ax-sec-a-1",
      "ins-exercise-s1",
      "ins-exercise-s2",
      "ins-exercise-end",
      "ax-sec-b",
      "ax-references",
    ]);
  });

  it("keeps lesson and exercise kinds distinct with their ids", () => {
    const nav = buildPaperNav(TOC, [
      {
        after: { sectionEnd: "ax-sec-b" },
        items: [
          { kind: "lesson", id: "note", title: "Reading guide" },
          { kind: "exercise", id: "uc", title: "Understanding check" },
        ],
      },
    ]);
    const lesson = nav.find((n) => n.kind === "inserted-lesson");
    const exercise = nav.find((n) => n.kind === "inserted-exercise");
    expect(lesson).toMatchObject({ lessonId: "note", anchorId: "ins-lesson-note" });
    expect(exercise).toMatchObject({ exerciseId: "uc", anchorId: "ins-exercise-uc" });
  });

  it("maps demo and sequence items to their nav kinds and anchor ids", () => {
    const nav = buildPaperNav(TOC, [
      {
        after: { sectionEnd: "ax-sec-a" },
        items: [
          { kind: "demo", id: "monitor-roc", title: "Monitor ROC" },
          {
            kind: "sequence",
            exerciseIds: ["q1", "q2"],
            title: "Quick recall",
          },
        ],
      },
    ]);
    const demo = nav.find((n) => n.kind === "inserted-demo");
    const sequence = nav.find((n) => n.kind === "inserted-sequence");
    expect(demo).toMatchObject({
      demoId: "monitor-roc",
      anchorId: "ins-demo-monitor-roc",
      title: "Monitor ROC",
    });
    expect(sequence).toMatchObject({
      anchorId: "ins-sequence-q1", // derives from the first exercise id
      title: "Quick recall",
    });
  });

  it("appends unknown-section activities at the end, like the reader does", () => {
    const nav = buildPaperNav(TOC, [
      { after: { sectionEnd: "ax-sec-gone" }, items: [{ kind: "exercise", id: "x", title: "X" }] },
    ]);
    expect(nav[nav.length - 1]).toMatchObject({ anchorId: "ins-exercise-x" });
  });
});
