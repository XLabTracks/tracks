import { verificationUnitOfLesson } from "@/content/verification/curriculum";
import { getItemsForModule, getModulesForTrack } from "@/lib/content";
import { COMPOUND_RUNG, COMPOUND_UNITS, SKILL_NODES } from "./data/skills";

function lessonsByUnit(): Map<string, string[]> {
  const byUnit = new Map<string, string[]>();
  for (const [lessonId, unit] of Object.entries(verificationUnitOfLesson)) {
    const list = byUnit.get(unit) ?? [];
    list.push(lessonId);
    byUnit.set(unit, list);
  }
  return byUnit;
}

export function completedVerificationUnits(
  completedContentIds: ReadonlySet<string>,
): Set<string> {
  const done = new Set<string>();
  for (const [unit, lessons] of lessonsByUnit()) {
    if (lessons.every((id) => completedContentIds.has(id))) done.add(unit);
  }
  return done;
}

function rungFill(unitTag: string, doneUnits: ReadonlySet<string>): number {
  if (unitTag === COMPOUND_RUNG) {
    return (
      COMPOUND_UNITS.filter((u) => doneUnits.has(u)).length /
      COMPOUND_UNITS.length
    );
  }
  return doneUnits.has(unitTag) ? 1 : 0;
}

export interface SkillSummary {
  mastered: number;
  inProgress: number;
  total: number;
}

export function skillSummary(doneUnits: ReadonlySet<string>): SkillSummary {
  let mastered = 0;
  let inProgress = 0;
  for (const node of SKILL_NODES) {
    let filled = 0;
    for (const rung of node.rungs) filled += rungFill(rung, doneUnits);
    if (filled >= node.rungs.length) mastered += 1;
    else if (filled > 0) inProgress += 1;
  }
  return { mastered, inProgress, total: SKILL_NODES.length };
}

export function submittedWordCount(responses: unknown[]): number {
  let words = 0;
  for (const response of responses) {
    if (!response || typeof response !== "object" || Array.isArray(response))
      continue;
    for (const value of Object.values(response)) {
      if (typeof value !== "string") continue;
      words += value.split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}

export function completedReadingMinutes(
  trackId: string,
  completedContentIds: ReadonlySet<string>,
): number {
  let minutes = 0;
  for (const mod of getModulesForTrack(trackId)) {
    for (const item of getItemsForModule(mod.id)) {
      const { id, estimatedMinutes } =
        item.kind === "lesson" ? item.lesson : item.paper;
      if (estimatedMinutes && completedContentIds.has(id))
        minutes += estimatedMinutes;
    }
  }
  return minutes;
}
