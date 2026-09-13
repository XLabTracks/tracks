import { memoSlots, type MemoSlot } from "@/content/verification/memos";
import {
  getItemsForModule,
  getModulesForTrack,
  itemIdOf,
  itemSlugOf,
  itemTitleOf,
} from "@/lib/content";

const taskSlots: MemoSlot[] = memoSlots.filter(
  (slot): slot is MemoSlot & { task: string } => typeof slot.task === "string",
);

export const verificationTaskIds: string[] = taskSlots.map((slot) => slot.task!);

export function taskTitle(taskId: string): string {
  return taskSlots.find((slot) => slot.task === taskId)?.title ?? taskId;
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
      for (const slot of taskSlots) {
        if (slot.lesson !== stem) continue;
        tasks.push({
          id: slot.task!,
          title: slot.title,
          lessonId: id,
          lessonTitle: itemTitleOf(item),
          lessonHref: `/tracks/verification/${mod.slug}/${itemSlugOf(item)}#${slot.task}`,
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
