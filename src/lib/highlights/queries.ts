import { prisma } from "@/lib/db";
import {
  HIGHLIGHT_CLASS_MAX_ROWS,
  HIGHLIGHT_CLASS_NOTE_PREVIEW_CHARS,
  type ClassHighlightRow,
  type HighlightRow,
} from "./types";

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
 *
 * Bounded regardless of class size — the per-author caps alone scale
 * linearly with membership: at most HIGHLIGHT_CLASS_MAX_ROWS rows (the
 * newest annotations win), each note truncated to its shared-view preview
 * (HIGHLIGHT_CLASS_NOTE_PREVIEW_CHARS).
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
    // Newest first so the row cap keeps the most recent annotations…
    orderBy: { createdAt: "desc" },
    take: HIGHLIGHT_CLASS_MAX_ROWS,
  });
  // …then back to creation order, the contract the reader's layers expect.
  rows.reverse();

  return rows.map(({ user, note, ...row }) => ({
    ...row,
    note: notePreview(note),
    author: user?.name?.trim() || "A classmate",
  }));
}

/**
 * Truncate a classmate note to the shared-view preview length, code-point
 * safe (never splits a surrogate pair). Purely a payload bound on the
 * read-only shared view — the owner's own rows are never truncated.
 */
function notePreview(note: string | null): string | null {
  if (note === null || note.length <= HIGHLIGHT_CLASS_NOTE_PREVIEW_CHARS) {
    return note;
  }
  const points = [...note];
  if (points.length <= HIGHLIGHT_CLASS_NOTE_PREVIEW_CHARS) return note;
  return points.slice(0, HIGHLIGHT_CLASS_NOTE_PREVIEW_CHARS).join("") + "…";
}
