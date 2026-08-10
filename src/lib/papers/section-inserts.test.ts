import { describe, expect, it } from "vitest";
import type { PaperTocEntry } from "@/lib/arxiv/types";
import type { PaperEdit } from "@/lib/content/types";
import { applySecnumOverrides, planSectionInserts } from "./section-inserts";

// §3 with two authored subsections, plus a §4 outside the parent that must
// never renumber. The parent of an insert is the DEEPEST toc entry whose
// anchor precedes it, so b-0011 lands directly in §3 while b-0025 lands in §3.1.
const TOC: PaperTocEntry[] = [
  { kind: "section", id: "ax-sec-3", title: "Three", number: "3", level: 2, anchor: "b-0010" },
  { kind: "section", id: "ax-sec-3-1", title: "Three One", number: "3.1", level: 3, anchor: "b-0020" },
  { kind: "section", id: "ax-sec-3-2", title: "Three Two", number: "3.2", level: 3, anchor: "b-0030" },
  { kind: "section", id: "ax-sec-4", title: "Four", number: "4", level: 2, anchor: "b-0050" },
];

const section = (id: string, anchor: string): PaperEdit => ({
  op: "section",
  after: { anchor, snippet: "irrelevant" },
  id,
  title: id,
});

describe("planSectionInserts", () => {
  it("returns an empty plan when there are no section ops", () => {
    const plan = planSectionInserts(TOC, [
      { op: "activity", after: { anchor: "b-0011", snippet: "x" }, items: [] },
    ]);
    expect(plan.sections).toEqual([]);
    expect(plan.numberOverrides.size).toBe(0);
  });

  it("derives the number and level from the section containing the anchor", () => {
    const plan = planSectionInserts(TOC, [section("ins", "b-0011")]);
    expect(plan.sections).toHaveLength(1);
    expect(plan.sections[0]).toMatchObject({
      id: "ins",
      number: "3.1",
      level: 3,
      afterNum: 11,
      parentIndex: 0,
      editIndex: 0,
    });
    // Its nav slot is the first toc entry rendering after the anchor.
    expect(TOC[plan.sections[0].beforeIndex].id).toBe("ax-sec-3-1");
  });

  it("nests one level deeper when the anchor sits inside a subsection", () => {
    // The c-paper-ai-control shape: §3.2.1 spliced into §3.2's body.
    const plan = planSectionInserts(TOC, [section("ins", "b-0025")]);
    expect(plan.sections[0]).toMatchObject({ number: "3.1.1", level: 4, parentIndex: 1 });
    // §3.1 has no existing direct children, so nothing renumbers.
    expect(plan.numberOverrides.size).toBe(0);
  });

  it("shifts only the parent's later direct siblings", () => {
    const plan = planSectionInserts(TOC, [section("ins", "b-0011")]);
    expect(Object.fromEntries(plan.numberOverrides)).toEqual({
      "ax-sec-3-1": "3.2",
      "ax-sec-3-2": "3.3",
    });
    // §4 is outside the parent subtree — it never moves.
    expect(plan.numberOverrides.has("ax-sec-4")).toBe(false);
  });

  it("numbers two inserts under one parent consecutively and stacks the shift", () => {
    const plan = planSectionInserts(TOC, [
      section("ins-a", "b-0011"),
      section("ins-b", "b-0012"),
    ]);
    expect(plan.sections.map((s) => [s.id, s.number, s.editIndex])).toEqual([
      ["ins-a", "3.1", 0],
      ["ins-b", "3.2", 1],
    ]);
    expect(plan.numberOverrides.get("ax-sec-3-1")).toBe("3.3");
    expect(plan.numberOverrides.get("ax-sec-3-2")).toBe("3.4");
  });

  it("numbers two same-anchor inserts by edits order — never duplicating", () => {
    // Both target b-0011: the afterNum tie breaks by editIndex, matching the
    // render order (patch-section phase C emits same-anchor ops in edits
    // order), so the pair numbers consecutively instead of colliding.
    const plan = planSectionInserts(TOC, [
      section("ins-a", "b-0011"),
      section("ins-b", "b-0011"),
    ]);
    expect(plan.sections.map((s) => [s.id, s.number])).toEqual([
      ["ins-a", "3.1"],
      ["ins-b", "3.2"],
    ]);
    // Existing siblings shift past BOTH inserts.
    expect(plan.numberOverrides.get("ax-sec-3-1")).toBe("3.3");
    expect(plan.numberOverrides.get("ax-sec-3-2")).toBe("3.4");
  });

  it("records each op's position in the FULL edits array", () => {
    // The nav orders a heading against same-anchor activities/gates by this
    // index, so it must count non-section edits too.
    const plan = planSectionInserts(TOC, [
      { op: "activity", after: { anchor: "b-0011", snippet: "x" }, items: [] },
      { op: "gate", after: { anchor: "b-0011", snippet: "x" }, id: "g" },
      section("ins", "b-0011"),
    ]);
    expect(plan.sections[0].editIndex).toBe(2);
  });
});

describe("applySecnumOverrides", () => {
  const html =
    '<h3 id="ax-sec-3-1"><span class="ax-secnum">3.1</span> Three One</h3>' +
    '<p data-anchor="b-0021"><span class="ax-secnum">3.1</span> decoy in body text</p>' +
    '<h3 id="ax-sec-3-2"><span class="ax-secnum">3.2</span> Three Two</h3>';

  it("rewrites only the leading secnum span of the named headings", () => {
    const out = applySecnumOverrides(
      html,
      new Map([
        ["ax-sec-3-1", "3.2"],
        ["ax-sec-3-2", "3.3"],
      ]),
    );
    expect(out).toContain('<h3 id="ax-sec-3-1"><span class="ax-secnum">3.2</span> Three One</h3>');
    expect(out).toContain('<h3 id="ax-sec-3-2"><span class="ax-secnum">3.3</span> Three Two</h3>');
    // A secnum span that does not LEAD its element is left alone.
    expect(out).toContain('<p data-anchor="b-0021"><span class="ax-secnum">3.1</span>');
  });

  it("is a no-op for unknown ids and for an empty override map", () => {
    expect(applySecnumOverrides(html, new Map())).toBe(html);
    expect(applySecnumOverrides(html, new Map([["ax-sec-nope", "9"]]))).toBe(html);
  });

  it("bumps from the original number each time, so repeat renders are stable", () => {
    const plan = planSectionInserts(TOC, [section("ins", "b-0011")]);
    const once = applySecnumOverrides(html, plan.numberOverrides);
    expect(once).not.toBe(html);
    expect(applySecnumOverrides(once, plan.numberOverrides)).toBe(once);
  });
});
