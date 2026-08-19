import { verificationUnitOfLesson } from "@/content/verification/curriculum";
import { getItemsForModule, getModulesForTrack } from "@/lib/content";
import { COMPOUND_RUNG, COMPOUND_UNITS, SKILL_NODES } from "./data/skills";

/* The numbers behind the completion page's dashboard — all derived at read
 * time from rows the page already fetches, per the house rule that a derived
 * value is never persisted. Everything here is what the learner actually did:
 * units whose every lesson is complete, writing that was submitted (a draft
 * is not a submission), and the course's own per-lesson time estimates summed
 * over the reading that was finished. Nothing is projected or padded.
 */

/** The course's units, each with every lesson the graph maps onto it. */
function lessonsByUnit(): Map<string, string[]> {
  const byUnit = new Map<string, string[]>();
  for (const [lessonId, unit] of Object.entries(verificationUnitOfLesson)) {
    const list = byUnit.get(unit) ?? [];
    list.push(lessonId);
    byUnit.set(unit, list);
  }
  return byUnit;
}

/**
 * Unit tags ("0.1", "2.3") the learner has finished: a unit is done when
 * every lesson the join maps onto it is complete. Optional lessons gate
 * their unit here on purpose — a skill rung on 0.4 is earned by reading 0.4,
 * whether or not the course requires it.
 */
export function completedVerificationUnits(
  completedContentIds: ReadonlySet<string>,
): Set<string> {
  const done = new Set<string>();
  for (const [unit, lessons] of lessonsByUnit()) {
    if (lessons.every((id) => completedContentIds.has(id))) done.add(unit);
  }
  return done;
}

/* Fraction of a rung the learner holds, 0..1 — the same arithmetic as
 * `VT.rungFill` in platform.js. Only the compound 2.1–2.4 rung is ever
 * partial: it fills a quarter per evidence bucket. */
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
  /** Nodes with every rung filled. */
  mastered: number;
  /** Nodes partly filled — some rung reached, not all. */
  inProgress: number;
  total: number;
}

/** How much of the 31-node skill graph the finished units light up. */
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

/**
 * Words across the writing the learner submitted. `responses` holds each
 * writing exercise's `Submission.responseJson` — for writing that is a flat
 * map of section ids to the learner's text (see `sanitizeWritingValues`);
 * anything else contributes nothing rather than throwing.
 */
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

/**
 * Minutes of reading finished, by the course's own per-item estimates:
 * `estimatedMinutes` summed over every completed lesson and paper in the
 * track, optional readings included — they were read. Items without an
 * estimate (the capstone brief, this page) add nothing, so the sum
 * undercounts rather than guesses.
 */
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
