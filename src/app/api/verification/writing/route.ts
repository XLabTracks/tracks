import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getExerciseById } from "@/lib/content";
import { isWritingExercise } from "@/lib/content/types";
import { prisma } from "@/lib/db";

/**
 * The signed-in learner's answers to the Verification track's written tasks,
 * for the notebook to show beside their own notes.
 *
 * Read-only, and served rather than copied. A task answer's home is the
 * `Submission` row the lesson editor writes; the notebook shows it because a
 * learner thinking about their own writing should not have to remember which
 * lesson it was in. Storing a second copy in the notebook document would make
 * two things true at once and let them disagree.
 *
 * Scoped to the Verification track's own writing exercises — every `v-*` id
 * `src/content/verification/exercises.ts` issues that is a writing type,
 * which is the set the memo desk lists as lesson tasks. A learner's
 * Control-track writing is not part of this course and has no business being
 * listed here; nor are the track's knowledge checks.
 */

const PREFIX = "v-";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ signedIn: false, items: [] }, { status: 401 });
  }

  const rows = await prisma.submission.findMany({
    where: { userId: user.id, contentId: { startsWith: PREFIX } },
    select: {
      contentId: true,
      responseText: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const items = rows
    .filter((r) => (r.responseText ?? "").trim().length > 0)
    .filter((r) => {
      const exercise = getExerciseById(r.contentId);
      return !!exercise && isWritingExercise(exercise);
    })
    .map((r) => {
      const exercise = getExerciseById(r.contentId);
      // The prompt's first line is the task's own title in the outline, which
      // is what a learner will recognise it by.
      const prompt = exercise?.prompt ?? "";
      const title = prompt.split("\n").find((l) => l.trim())?.trim() ?? r.contentId;
      return {
        id: r.contentId,
        title,
        text: r.responseText ?? "",
        status: r.status,
        updatedAt: r.updatedAt.getTime(),
      };
    });

  return NextResponse.json({ signedIn: true, items });
}
