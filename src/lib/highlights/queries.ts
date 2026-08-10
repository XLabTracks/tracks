import { prisma } from "@/lib/db";
import type { ClassHighlightRow, HighlightRow } from "./types";

/**
 * A user's highlights on one paper item, in creation order (the client
 * layer sorts document-order views itself — blockAnchor is zero-padded but
 * lexicographic order breaks at a digit-count rollover). Minimal columns:
 * these rows ride the RSC payload of every signed-in paper view.
 */
export async function getHighlightsForItem(
  userId: string,
  contentId: string,
): Promise<HighlightRow[]> {
  return prisma.highlight.findMany({
    where: { userId, contentId },
    select: {
      id: true,
      groupId: true,
      blockAnchor: true,
      sStart: true,
      sEnd: true,
      startOffset: true,
      endOffset: true,
      snippet: true,
      note: true,
      convVersion: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * NOTED highlights on one paper item made by the user's CLASSMATES — anyone
 * who shares at least one classroom with them (excluding the user's own).
 * "All highlights are shared" within a classroom, but only noted ones surface
 * here: an un-noted highlight has nothing to show in the margin. Each carries
 * the author's display name for attribution. Read-only — the reader paints
 * these in a distinct color and never lets them be edited or deleted.
 *
 * Only the group HEAD row carries the note, so this returns one row per
 * shared annotation (multi-paragraph highlights surface at their first
 * block). Excluded from the composite-unique read path — this is a
 * cross-user query, so it filters through the membership relation. Degrades
 * to empty for a user in no classroom (the common case): callers still get a
 * fast no-op.
 */
export async function getClassmateHighlightsForItem(
  userId: string,
  contentId: string,
): Promise<ClassHighlightRow[]> {
  const memberships = await prisma.classroomMembership.findMany({
    where: { userId },
    select: { classroomId: true },
  });
  if (memberships.length === 0) return [];
  const classroomIds = memberships.map((m) => m.classroomId);

  const rows = await prisma.highlight.findMany({
    where: {
      contentId,
      note: { not: null },
      userId: { not: userId },
      user: { memberships: { some: { classroomId: { in: classroomIds } } } },
    },
    select: {
      id: true,
      groupId: true,
      blockAnchor: true,
      sStart: true,
      sEnd: true,
      startOffset: true,
      endOffset: true,
      snippet: true,
      note: true,
      convVersion: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return rows.map(({ user, ...row }) => ({
    ...row,
    author: user?.name?.trim() || "A classmate",
  }));
}
