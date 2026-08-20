"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getContentLocation } from "@/lib/content";
import { getVerificationExerciseForLesson } from "@/lib/verification/exercises";

// These actions take generic content ids: standalone lessons, papers, and
// papers' inserted lessons all persist through the same LessonProgress rows.

/** Stamp last-viewed time on content open (no-op when signed out). */
export async function recordLessonView(contentId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  // Reachable by direct POST: only ids in the content graph get rows.
  if (!getContentLocation(contentId)) return;
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: contentId } },
    create: {
      userId: user.id,
      lessonId: contentId,
      status: "in_progress",
      lastViewedAt: new Date(),
    },
    update: { lastViewedAt: new Date() },
  });
}

export async function setLessonComplete(
  contentId: string,
  completed: boolean,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  // Reachable by direct POST: only ids in the content graph get rows — plus
  // the registered Verification exercises' `v-<id>` marks. A bridged widget
  // embedded in another lesson's prose has no lesson of its own; its finish
  // persists as a private per-exercise row the widget reads back on revisit
  // (see the note atop src/lib/verification/exercises.ts). Both sets are
  // code-defined, so arbitrary ids still get no row. The progress accessors
  // walk the graph, so a non-graph mark is counted in no total.
  const location = getContentLocation(contentId);
  if (!location && !getVerificationExerciseForLesson(contentId)) {
    throw new Error("Unknown content");
  }
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: contentId } },
    create: {
      userId: user.id,
      lessonId: contentId,
      status: completed ? "completed" : "in_progress",
      completedAt: completed ? new Date() : null,
    },
    update: {
      status: completed ? "completed" : "in_progress",
      completedAt: completed ? new Date() : null,
    },
  });

  // A per-exercise mark has no location; its widget lives in a Verification
  // lesson, so that track's layout is the one whose render must refresh.
  revalidatePath(`/tracks/${location?.track.slug ?? "verification"}`, "layout");
}
