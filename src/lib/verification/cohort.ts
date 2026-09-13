import {
  memoSlots,
  memoSlotTasks,
  type MemoSlot,
  type MemoStep,
} from "@/content/verification/memos";
import {
  getItemsForModule,
  getModulesForTrack,
  itemIdOf,
  itemSlugOf,
  itemTitleOf,
} from "@/lib/content";

const taskSlots: { slot: MemoSlot; step: MemoStep }[] = memoSlots.flatMap((slot) =>
  memoSlotTasks(slot).map((step) => ({ slot, step })),
);

export const verificationTaskIds: string[] = taskSlots.map(({ step }) => step.task);

export function taskTitle(taskId: string): string {
  const hit = taskSlots.find(({ step }) => step.task === taskId);
  if (!hit) return taskId;
  return hit.slot.steps ? `${hit.slot.title} — ${hit.step.title}` : hit.step.title;
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
      for (const { slot, step } of taskSlots) {
        if (slot.lesson !== stem) continue;
        tasks.push({
          id: step.task,
          title: taskTitle(step.task),
          lessonId: id,
          lessonTitle: itemTitleOf(item),
          lessonHref: `/tracks/verification/${mod.slug}/${itemSlugOf(item)}#${step.task}`,
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
