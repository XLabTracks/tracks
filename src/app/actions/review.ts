"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getExerciseById } from "@/lib/content";
import { isGrade, scheduleReview } from "@/lib/review/fsrs";

export interface ReviewResult {
  /** ISO timestamp the card is next due, for the session's re-queue logic. */
  due: string;
}

/**
 * Applies one FSRS review of a tap-reveal notecard from the /review tab and
 * persists the re-scheduled state. Upserts so a card enrolled on another
 * device mid-session (or a direct POST for a never-seen card) still lands in
 * the bank rather than erroring.
 */
export async function reviewCard(
  contentId: string,
  grade: number,
): Promise<ReviewResult | null> {
  // Reachable by direct POST: only real tap-reveal ids and real grades.
  const exercise = getExerciseById(contentId);
  if (!exercise || exercise.type !== "tap-reveal") return null;
  if (!isGrade(grade)) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const where = { userId_contentId: { userId: user.id, contentId } } as const;
  // Read-modify-write on the single card row — same accepted race as
  // gradeFlowchartStage: two concurrent reviews of the same card can lose
  // one; the next review re-schedules from whichever state won.
  const existing = await prisma.reviewCard.findUnique({ where });
  const next = scheduleReview(existing, grade, new Date());
  await prisma.reviewCard.upsert({
    where,
    create: { userId: user.id, contentId, ...next },
    update: next,
  });

  revalidatePath("/review");
  return { due: next.due.toISOString() };
}
