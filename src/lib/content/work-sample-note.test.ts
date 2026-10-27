import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { DELIVERABLE_FORMAT_LABELS } from "@/lib/content/types";
import type { DeliverableFormat } from "@/lib/content/types";
import { memoGenreLabels } from "@/content/verification/memos";
import type { MemoGenre } from "@/content/verification/memos";
import {
  workSampleNoteForExercise,
  workSampleNoteForFormat,
  workSampleNoteForGenre,
  workSampleNotes,
  workSampleNotesByGenre,
} from "@/lib/content/work-sample-note";
import { memoSlots, memoSlotTasks } from "@/content/verification/memos";
import { verificationExercises } from "@/content/verification/exercises";
import { isWritingExercise } from "@/lib/content/types";

const FORMATS = Object.keys(DELIVERABLE_FORMAT_LABELS) as DeliverableFormat[];
const GENRES = Object.keys(memoGenreLabels) as MemoGenre[];

describe("work-sample notes", () => {
  it("covers every memo genre, so the desk never renders an empty line", () => {
    for (const genre of GENRES) {
      expect(workSampleNoteForGenre(genre), genre).toBeTruthy();
    }
    expect(Object.keys(workSampleNotesByGenre()).sort()).toEqual(
      [...GENRES].sort(),
    );
  });

  it("says nothing for a free response, which is not a work product", () => {
    expect(workSampleNoteForFormat("free-form")).toBeNull();
  });

  it("answers for every other deliverable format", () => {
    for (const format of FORMATS) {
      if (format === "free-form") continue;
      expect(workSampleNoteForFormat(format), format).toBeTruthy();
    }
  });

  it("gives a memo and a policy memo the same line", () => {
    expect(workSampleNoteForFormat("memo")).toBe(
      workSampleNoteForFormat("policy-memo"),
    );
  });

  it("is one or two sentences, written to be kept", () => {
    for (const [kind, note] of Object.entries(workSampleNotes)) {
      expect(note, kind).toMatch(/^[A-Z]/);
      expect(note, kind).toMatch(/\.$/);
      expect(note.length, kind).toBeLessThan(220);
    }
  });

  /**
   * The desk is plain JS and is handed these strings on `window`. It must hold
   * no copy of its own — that is the duplication this module exists to avoid.
   */
  it("is not restated inside the memo desk's script", () => {
    const desk = fs.readFileSync(
      path.join(process.cwd(), "public/verification/memo-desk.js"),
      "utf8",
    );
    expect(desk).toContain("VT_WORK_SAMPLE_NOTES");
    for (const note of Object.values(workSampleNotes)) {
      expect(desk, note.slice(0, 40)).not.toContain(note.slice(0, 40));
    }
  });

  /**
   * Verification types every exercise `free-form`, so the slot's genre is the
   * only thing that can answer there. If this stops holding, the note has
   * silently gone missing from the course's named deliverables.
   */
  it("fires for a Verification output that declares a genre", () => {
    const writing = new Map(
      verificationExercises
        .filter(isWritingExercise)
        .map((exercise) => [exercise.id, exercise]),
    );
    const typed = memoSlots
      .filter((slot) => slot.genre)
      .flatMap((slot) => memoSlotTasks(slot).map((step) => step.task))
      .map((task) => writing.get(task))
      .filter((exercise) => exercise !== undefined);

    expect(typed.length).toBeGreaterThan(0);
    for (const exercise of typed) {
      expect(exercise.format, exercise.id).toBe("free-form");
      expect(workSampleNoteForExercise(exercise), exercise.id).toBeTruthy();
    }
  });

  it("stays silent on a free response that declares nothing", () => {
    const untyped = verificationExercises
      .filter(isWritingExercise)
      .find((exercise) => workSampleNoteForExercise(exercise) === null);
    expect(untyped).toBeDefined();
  });
});
