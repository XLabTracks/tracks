import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { memoSlots, type MemoSlot } from "@/content/verification/memos";
import { workSampleNote } from "@/lib/content/work-sample-note";

const desk = fs.readFileSync(
  path.join(process.cwd(), "public/verification/memo-desk.js"),
  "utf8",
);

/** The desk's own rule, mirrored: see workSampleNote() in memo-desk.js. */
function showsNote(slot: MemoSlot): boolean {
  if (slot.task || slot.steps || slot.href) return false;
  if (!slot.brief) return false;
  return !slot.genre || slot.genre === "memo";
}

describe("work-sample note", () => {
  /**
   * Course owner: policy briefs and memos only, where a real brief exists.
   * If this list grows an essay or a map, the rule has drifted.
   */
  it("shows on exactly the policy memo slots written at the desk", () => {
    const shown = memoSlots.filter(showsNote).map((slot) => slot.unit);
    expect(shown).toEqual(["2.3", "4.1"]);
  });

  it("is off for an essay, a map, and anything written in a lesson", () => {
    for (const slot of memoSlots) {
      if (slot.genre === "essay" || slot.genre === "map") {
        expect(showsNote(slot), `${slot.unit} ${slot.title}`).toBe(false);
      }
      if (slot.task || slot.steps) {
        expect(showsNote(slot), `${slot.unit} ${slot.title}`).toBe(false);
      }
    }
  });

  it("is off for a slot that has no brief to write against yet", () => {
    const undrafted = memoSlots.filter(
      (slot) => !slot.brief && !slot.task && !slot.steps && !slot.href,
    );
    expect(undrafted.length).toBeGreaterThan(0);
    for (const slot of undrafted) {
      expect(showsNote(slot), `${slot.unit} ${slot.title}`).toBe(false);
    }
  });

  it("is one sentence, the owner's wording", () => {
    expect(workSampleNote).toBe(
      "Written analysis of this kind is what many entry-level policy applications ask for as a writing sample.",
    );
  });

  /**
   * The desk is plain JS and is handed the sentence on `window`. It must hold
   * no copy of its own — that is the duplication this module exists to avoid.
   */
  it("is not restated inside the memo desk's script", () => {
    expect(desk).toContain("VT_WORK_SAMPLE_NOTE");
    expect(desk).not.toContain(workSampleNote.slice(0, 40));
  });

  it("the desk gates on brief, genre and where the output is written", () => {
    const rule = desk.slice(
      desk.indexOf("function workSampleNote"),
      desk.indexOf("function renderBrief"),
    );
    expect(rule).toContain("elsewhere(s)");
    expect(rule).toContain("s.brief");
    expect(rule).toContain("'memo'");
  });
});
