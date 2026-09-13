import { describe, expect, it } from "vitest";
import {
  taskTitle,
  verificationTaskIds,
  verificationTasksByModule,
} from "@/lib/verification/cohort";
import { verificationExercises } from "@/content/verification/exercises";
import { isWritingExercise } from "@/lib/content/types";

describe("verification cohort tasks", () => {
  it("does not expose local knowledge checks as submitted cohort work", () => {
    expect(verificationTaskIds).not.toContain(
      "v-test-human-insiders-source-scope",
    );
  });

  it("lists every writing exercise the track declares, and nothing else", () => {
    const writing = verificationExercises
      .filter(isWritingExercise)
      .map((exercise) => exercise.id)
      .sort();
    expect([...verificationTaskIds].sort()).toEqual(writing);
  });

  it("groups every task under a module, losing none", () => {
    const grouped = verificationTasksByModule().flatMap((m) => m.tasks);
    expect(grouped.map((t) => t.id).sort()).toEqual(
      [...verificationTaskIds].sort(),
    );
  });

  it("links every task to the exercise on its lesson page", () => {
    for (const task of verificationTasksByModule().flatMap((m) => m.tasks)) {
      expect(task.lessonHref).toMatch(
        new RegExp(`^/tracks/verification/[a-z0-9-]+/[a-z0-9-]+#${task.id}$`),
      );
    }
  });

  it("gives every task a title that is not its id", () => {
    for (const id of verificationTaskIds) {
      const title = taskTitle(id);
      expect(title, `${id} has no slot to take a title from`).not.toBe(id);
      expect(title.length).toBeGreaterThan(0);
    }
  });
});
