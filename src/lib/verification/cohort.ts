import { verificationExercises } from "@/content/verification/exercises";
import { isWritingExercise } from "@/lib/content/types";
import {
  getExerciseById,
  getItemsForModule,
  getModulesForTrack,
  itemIdOf,
  itemSlugOf,
  itemTitleOf,
} from "@/lib/content";

/**
 * The Verification cohort's written work, arranged the way a facilitator reads
 * it: by module, then by task, then by who has handed it in.
 *
 * Tasks are the `v-task-*` writing prompts in src/content/verification/
 * exercises.ts. They are the only Verification work that reaches the database
 * — a Submission row per learner per task — so they are what a cohort view can
 * honestly show. Checks and gap-fills are learner work kept in localStorage on
 * purpose and are not somebody else's to read.
 *
 * Which lesson a task belongs to is derived from its id: `v-task-<lesson>-<n>`
 * where `<lesson>` is the lesson's contentRef under verification/. That is a
 * naming convention rather than a field, so cohort.test.ts pins it against the
 * MDX that actually embeds each task — a task that stops matching fails the
 * suite instead of quietly vanishing from every facilitator's view.
 */

export const TASK_PREFIX = "v-task-";

/** The task ids the Verification track issues, in declaration order. */
export const verificationTaskIds: string[] = verificationExercises
  .filter(
    (exercise) =>
      exercise.id.startsWith(TASK_PREFIX) && isWritingExercise(exercise),
  )
  .map((exercise) => exercise.id);

/**
 * The lesson contentRef stem a task id names: strip the prefix and the
 * trailing sequence number. `v-task-cloud-limits-2` -> `cloud-limits`.
 */
export function lessonStemOfTask(taskId: string): string {
  return taskId.slice(TASK_PREFIX.length).replace(/-\d+$/, "");
}

/**
 * The task's own title. The first non-empty line of the prompt is what the
 * outline called it, and what a learner will recognise — the same rule the
 * notebook's writing route uses, so the two never disagree.
 */
export function taskTitle(taskId: string): string {
  const prompt = getExerciseById(taskId)?.prompt ?? "";
  const first = prompt.split("\n").find((l) => l.trim())?.trim();
  if (!first) return taskId;
  return first.replace(/^#+\s*/, "");
}

export interface CohortTask {
  id: string;
  title: string;
  lessonId: string;
  lessonTitle: string;
  lessonHref: string;
}

export interface CohortModuleTasks {
  moduleId: string;
  moduleTitle: string;
  tasks: CohortTask[];
}

/**
 * Every Verification task, grouped by the module whose lesson embeds it and
 * ordered by the module's own item order.
 *
 * A task whose lesson is not in the graph is dropped rather than filed under a
 * guess; the test is what stops that happening silently.
 */
export function verificationTasksByModule(): CohortModuleTasks[] {
  const out: CohortModuleTasks[] = [];
  for (const mod of getModulesForTrack("verification")) {
    const tasks: CohortTask[] = [];
    for (const item of getItemsForModule(mod.id)) {
      // A module item is a tagged union; only a lesson carries the MDX body a
      // task can be embedded in, so a paper is skipped rather than matched.
      if (item.kind !== "lesson") continue;
      const id = itemIdOf(item);
      const stem = item.lesson.contentRef.replace(/^verification\//, "");
      for (const taskId of verificationTaskIds) {
        if (lessonStemOfTask(taskId) !== stem) continue;
        tasks.push({
          id: taskId,
          title: taskTitle(taskId),
          lessonId: id,
          lessonTitle: itemTitleOf(item),
          lessonHref: `/tracks/verification/${mod.slug}/${itemSlugOf(item)}`,
        });
      }
    }
    if (tasks.length) {
      out.push({
        moduleId: mod.id,
        moduleTitle: mod.title,
        tasks,
      });
    }
  }
  return out;
}
