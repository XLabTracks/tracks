import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  lessonStemOfTask,
  taskTitle,
  verificationTaskIds,
  verificationTasksByModule,
} from "@/lib/verification/cohort";

/* Which lesson a task belongs to is read off its id rather than stored on it,
   so the convention has to be pinned against the MDX that actually embeds each
   task. Without this, renaming a task or moving it to another lesson would drop
   it out of every facilitator's cohort view and out of nothing else — nothing
   would fail, and the work would simply stop being listed. */

const LESSONS = join(process.cwd(), "src/content/lessons/verification");

/** taskId -> the lesson file whose body carries `<Exercise id="…"/>`. */
function embeddedIn(): Map<string, string> {
  const out = new Map<string, string>();
  for (const file of readdirSync(LESSONS)) {
    if (!file.endsWith(".mdx")) continue;
    const body = readFileSync(join(LESSONS, file), "utf8");
    for (const m of body.matchAll(/<Exercise\s+id="(v-task-[^"]+)"/g)) {
      out.set(m[1], file.replace(/\.mdx$/, ""));
    }
  }
  return out;
}

describe("verification cohort tasks", () => {
  it("does not expose local knowledge checks as submitted cohort work", () => {
    expect(verificationTaskIds).not.toContain(
      "v-test-human-insiders-source-scope",
    );
  });

  it("every task is embedded in a lesson, and its id names that lesson", () => {
    const embedded = embeddedIn();
    for (const id of verificationTaskIds) {
      const file = embedded.get(id);
      expect(file, `${id} is defined but no lesson embeds it`).toBeDefined();
      expect(
        lessonStemOfTask(id),
        `${id} is embedded in ${file}.mdx — the id has to name that lesson, ` +
          `or the cohort view cannot place the task`,
      ).toBe(file);
    }
  });

  it("every embedded task is a declared exercise", () => {
    const declared = new Set(verificationTaskIds);
    for (const [id, file] of embeddedIn()) {
      expect(
        declared.has(id),
        `${file}.mdx embeds ${id}, which no exercise declares`,
      ).toBe(true);
    }
  });

  it("groups every task under a module, losing none", () => {
    const grouped = verificationTasksByModule().flatMap((m) => m.tasks);
    expect(grouped.map((t) => t.id).sort()).toEqual(
      [...verificationTaskIds].sort(),
    );
  });

  it("gives every task a title that is not its id", () => {
    for (const id of verificationTaskIds) {
      const title = taskTitle(id);
      expect(title, `${id} has no prompt to take a title from`).not.toBe(id);
      expect(title.length).toBeGreaterThan(0);
    }
  });
});
