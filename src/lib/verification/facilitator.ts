import { getDb } from "@/lib/db";

/**
 * Who may read the facilitator material.
 *
 * Instructors, and only instructors: the session plans carry timings, the
 * answers behind every prompt, and the moves to make when a discussion goes
 * wrong. A participant reading them ahead of the session is reading the back
 * of the book — the plans are built around people arriving without them.
 *
 * A classroom with no track set spans every track, so its instructor counts
 * too; scoping to `trackId: "verification"` alone would lock out exactly the
 * person running a mixed cohort.
 *
 * Fails closed, including when the table is unreachable: a facilitator seeing
 * a 404 asks; a learner seeing the plans cannot un-read them.
 */
export async function isVerificationFacilitator(
  userId: string | undefined,
): Promise<boolean> {
  if (!userId) return false;
  try {
    const n = await getDb().classroomMembership.count({
      where: {
        userId,
        role: "instructor",
        classroom: { OR: [{ trackId: "verification" }, { trackId: null }] },
      },
    });
    return n > 0;
  } catch {
    return false;
  }
}
