import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  memoDeskSlotsForLesson,
  memoGenreLabels,
  memoModules,
  memoSlots,
  memoTaskExercise,
} from "@/content/verification/memos";
import { verificationExercises } from "@/content/verification/exercises";
import { verificationLessons } from "@/content/verification/curriculum";
import { isWritingExercise } from "@/lib/content/types";

const LESSONS_DIR = join(__dirname, "../../content/lessons/verification");

const trackLessons = new Set(
  verificationLessons
    .map((lesson) => lesson.contentRef)
    .filter((ref) => ref.startsWith("verification/"))
    .map((ref) => ref.slice("verification/".length)),
);

function body(lesson: string): string {
  const path = join(LESSONS_DIR, `${lesson}.mdx`);
  expect(existsSync(path), `${lesson}.mdx missing`).toBe(true);
  return readFileSync(path, "utf8");
}

const deskSlots = memoSlots.filter((slot) => !slot.task && !slot.href);
const taskSlots = memoSlots.filter((slot) => slot.task);

describe("verification written outputs", () => {
  it("every slot names a lesson that exists in the track", () => {
    for (const slot of memoSlots) {
      expect(trackLessons.has(slot.lesson), `${slot.id} -> ${slot.lesson} is not a track lesson`).toBe(
        true,
      );
    }
  });

  it("every lesson that owes a desk-drafted output embeds the card once", () => {
    const owed = new Set(deskSlots.map((slot) => slot.lesson));
    for (const lesson of owed) {
      const embeds = body(lesson).split(`<MemoDesk lesson="${lesson}" />`).length - 1;
      expect(embeds, `${lesson}.mdx must embed its written output exactly once`).toBe(1);
    }
  });

  it("no lesson embeds a card it owes nothing for, or for a different lesson", () => {
    for (const name of trackLessons) {
      const path = join(LESSONS_DIR, `${name}.mdx`);
      if (!existsSync(path)) continue;
      const found = [...readFileSync(path, "utf8").matchAll(/<MemoDesk lesson="([^"]+)"/g)].map(
        (match) => match[1],
      );
      for (const ref of found) {
        expect(ref, `${name}.mdx embeds the card for ${ref}`).toBe(name);
      }
      if (found.length) {
        expect(
          memoDeskSlotsForLesson(name).length,
          `${name} embeds a card but owes no desk-drafted output`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson task names a writing exercise its lesson embeds exactly once", () => {
    for (const slot of taskSlots) {
      const exercise = memoTaskExercise(slot);
      expect(exercise, `${slot.id} names ${slot.task}, which is not a writing exercise`).toBeDefined();
      const embeds = body(slot.lesson).split(`<Exercise id="${slot.task}" />`).length - 1;
      expect(embeds, `${slot.lesson}.mdx must embed ${slot.task} exactly once`).toBe(1);
    }
  });

  it("every writing exercise the track declares has exactly one slot", () => {
    const counts = new Map<string, number>();
    for (const slot of taskSlots) counts.set(slot.task!, (counts.get(slot.task!) ?? 0) + 1);
    for (const exercise of verificationExercises.filter(isWritingExercise)) {
      expect(
        counts.get(exercise.id) ?? 0,
        `${exercise.id} is a written component with no memo-desk slot`,
      ).toBe(1);
    }
  });

  it("every writing exercise embedded in a lesson is one the track declares", () => {
    const declared = new Set(verificationExercises.map((exercise) => exercise.id));
    for (const file of readdirSync(LESSONS_DIR)) {
      if (!file.endsWith(".mdx")) continue;
      const found = readFileSync(join(LESSONS_DIR, file), "utf8").matchAll(
        /<Exercise\s+id="(v-[^"]+)"/g,
      );
      for (const [, id] of found) {
        expect(declared.has(id), `${file} embeds ${id}, which no exercise declares`).toBe(true);
      }
    }
  });

  it("a task slot is optional exactly when its exercise is", () => {
    for (const slot of taskSlots) {
      const exercise = memoTaskExercise(slot)!;
      const optional = !!exercise.optional || /^Optional:/.test(exercise.prompt);
      expect(!!slot.optional, `${slot.id} and ${slot.task} disagree on optional`).toBe(optional);
    }
  });

  it("anything short of a full brief says what is missing", () => {
    for (const slot of memoSlots) {
      if (slot.task) continue;
      if (slot.status === "specified" && slot.brief) continue;
      expect(slot.gap, `${slot.id} is "${slot.status}" and carries no gap note`).toBeTruthy();
    }
  });

  it("slot ids are unique and modules are in range", () => {
    const ids = memoSlots.map((slot) => slot.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const slot of memoSlots) {
      expect(memoModules[slot.module], `${slot.id} has module ${slot.module}`).toBeTruthy();
    }
  });

  it("every declared genre is one the desk and card know how to dress", () => {
    for (const slot of memoSlots) {
      if (!slot.genre) continue;
      expect(memoGenreLabels[slot.genre], `${slot.id} has genre ${slot.genre}`).toBeTruthy();
    }
  });
});
