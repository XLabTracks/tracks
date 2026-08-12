import { describe, expect, it } from "vitest";
import type { PaperTocEntry } from "@/lib/arxiv/types";
import type { PaperEdit } from "@/lib/content/types";
import { buildPaperNav } from "./paper-nav";
import { planSectionInserts } from "./section-inserts";

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

  it("tags rows below a section-end gate with its id; landmarks stay unlocked", () => {
    const nav = buildPaperNav(TOC, undefined, [
      { id: "g1", after: { sectionEnd: "ax-sec-a" } },
    ]);
    const byId = (id: string) => nav.find((n) => n.kind === "section" && n.id === id)!;
    expect(byId("ax-abstract").gateIds).toBeUndefined();
    expect(byId("ax-sec-a").gateIds).toBeUndefined();
    expect(byId("ax-sec-a-1").gateIds).toBeUndefined(); // inside the gated-AFTER subtree
    expect(byId("ax-sec-b").gateIds).toEqual(["g1"]);
    // References render outside the gate walk (ungatedTailHtml) — never locked.
    expect(byId("ax-references").gateIds).toBeUndefined();
  });

  it("an anchor gate locks later same-bucket activities but not its own section", () => {
    const nav = buildPaperNav(
      TOC,
      [
        // b-0012 sits after the gate's b-0010 inside section 2 — the reader
        // renders it below the gate, so its row locks.
        { after: { anchor: "b-0012" }, items: [{ kind: "exercise", id: "x", title: "X" }], editIndex: 1 },
      ],
      [{ id: "g2", after: { anchor: "b-0010" }, editIndex: 0 }],
    );
    expect(
      nav.find((n) => n.kind === "section" && n.id === "ax-sec-b")!.gateIds,
    ).toBeUndefined();
    expect(nav.find((n) => n.kind === "inserted-exercise")!.gateIds).toEqual(["g2"]);
  });

  it("gates accumulate in reading order on the rows below them", () => {
    const nav = buildPaperNav(TOC, undefined, [
      { id: "early", after: { sectionEnd: "ax-sec-a-1" }, editIndex: 0 },
      { id: "late", after: { anchor: "b-0010" }, editIndex: 1 },
    ]);
    const secB = nav.find((n) => n.kind === "section" && n.id === "ax-sec-b")!;
    expect(secB.gateIds).toEqual(["early"]);
    // Nothing after b-0010 except references (unlocked), so "late" never tags
    // a section row — but earlier gates still accumulate on ax-sec-b.
    expect(
      nav.find((n) => n.kind === "section" && n.id === "ax-references")!.gateIds,
    ).toBeUndefined();
  });
});

// `op: "section"` splices a numbered subsection into the paper; buildPaperNav
// takes the resolved plan as its 4th argument. The renderer (patch-section
// phase C) emits everything sharing an anchor in edits-array order, so these
// pin that the nav agrees with the page.
describe("buildPaperNav with inserted sections", () => {
  const sectionRow = (nav: ReturnType<typeof buildPaperNav>, id: string) => {
    const row = nav.find((n) => n.kind === "section" && n.id === id);
    if (row?.kind !== "section") throw new Error(`no section row for ${id}`);
    return row;
  };

  const SECTION_OP: PaperEdit = {
    op: "section",
    after: { anchor: "b-0004", snippet: "irrelevant" },
    id: "xlab-sec-inserted",
    title: "Inserted",
  };
  const ACTIVITY_OP: PaperEdit = {
    op: "activity",
    after: { anchor: "b-0004", snippet: "irrelevant" },
    items: [{ kind: "exercise", id: "x" }],
  };
  const navFor = (edits: PaperEdit[], gates?: Parameters<typeof buildPaperNav>[2]) => {
    const activities = edits.flatMap((edit, editIndex) =>
      edit.op === "activity"
        ? [{
            after: { anchor: "b-0004" },
            editIndex,
            items: edit.items.map((item) => ({ ...item, title: "X" })),
          }]
        : [],
    );
    return buildPaperNav(TOC, activities, gates, planSectionInserts(TOC, edits));
  };

  it("places the heading in document order, numbered and levelled from its parent", () => {
    const nav = navFor([SECTION_OP]);
    expect(ids(nav)).toEqual([
      "ax-abstract",
      "ax-sec-a",
      "xlab-sec-inserted",
      "ax-sec-a-1",
      "ax-sec-b",
      "ax-references",
    ]);
    expect(sectionRow(nav, "xlab-sec-inserted")).toMatchObject({
      number: "1.1",
      level: 3,
      title: "Inserted",
    });
  });

  it("shifts the displayed number of the parent's later sibling subsections", () => {
    const nav = navFor([SECTION_OP]);
    // Alpha One was 1.1; the insert pushes it to 1.2 — id and anchor unchanged.
    expect(sectionRow(nav, "ax-sec-a-1").number).toBe("1.2");
    // Nothing outside the parent renumbers.
    expect(sectionRow(nav, "ax-sec-b").number).toBe("2");
  });

  it("nests activities authored after the heading one level deeper", () => {
    const nav = navFor([SECTION_OP, ACTIVITY_OP]);
    expect(ids(nav).slice(1, 4)).toEqual(["ax-sec-a", "xlab-sec-inserted", "ins-exercise-x"]);
    expect(nav.find((n) => n.kind === "inserted-exercise")!.level).toBe(4);
  });

  it("keeps a same-anchor activity authored BEFORE the heading above it, unnested", () => {
    // The c-paper-ai-control §3.3 shape: a recall card anchored to the
    // section's last block, then the 3.3.1 heading after it. patch-section
    // renders card-then-heading, so the nav must not hoist the heading.
    const nav = navFor([ACTIVITY_OP, SECTION_OP]);
    expect(ids(nav).slice(1, 4)).toEqual(["ax-sec-a", "ins-exercise-x", "xlab-sec-inserted"]);
    // It belongs to Alpha's own body (level 2), not to the inserted subsection.
    expect(nav.find((n) => n.kind === "inserted-exercise")!.level).toBe(3);
  });

  it("locks an inserted heading that renders below a gate, including a same-anchor one", () => {
    const above = navFor([SECTION_OP], [{ id: "g", after: { sectionEnd: "ax-abstract" }, editIndex: 0 }]);
    expect(sectionRow(above, "xlab-sec-inserted").gateIds).toEqual(["g"]);

    // Gate authored first on the SAME anchor: the heading renders behind it,
    // so its row must lock too (an unlocked row would link to a hash that is
    // not in the DOM while the gate is closed).
    const sameAnchor = buildPaperNav(
      TOC,
      undefined,
      [{ id: "g", after: { anchor: "b-0004" }, editIndex: 0 }],
      planSectionInserts(TOC, [
        { op: "gate", after: { anchor: "b-0004", snippet: "irrelevant" }, id: "g" },
        SECTION_OP,
      ]),
    );
    expect(sectionRow(sameAnchor, "xlab-sec-inserted").gateIds).toEqual(["g"]);
  });
});
