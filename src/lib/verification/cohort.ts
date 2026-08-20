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

export const TASK_PREFIX = "v-task-";

export const verificationTaskIds: string[] = verificationExercises
  .filter(
    (exercise) =>
      exercise.id.startsWith(TASK_PREFIX) && isWritingExercise(exercise),
  )
  .map((exercise) => exercise.id);

export function lessonStemOfTask(taskId: string): string {
  return taskId.slice(TASK_PREFIX.length).replace(/-\d+$/, "");
}

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

export function verificationTasksByModule(): CohortModuleTasks[] {
  const out: CohortModuleTasks[] = [];
  for (const mod of getModulesForTrack("verification")) {
    const tasks: CohortTask[] = [];
    for (const item of getItemsForModule(mod.id)) {
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
