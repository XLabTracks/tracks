import { cache } from "react";
import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import type { NoteTargetKind, NoteVisibility } from "@/lib/submission-notes";

export interface InstructorNote {
  id: string;
  targetId: string;
  targetKind: NoteTargetKind;
  body: string;
  visibility: NoteVisibility;
  authorId: string | null;
  authorName: string;
  mine: boolean;
  updatedAt: Date;
}

export interface SharedNote {
  id: string;
  body: string;
  authorName: string;
  classroomName: string;
  updatedAt: Date;
}

function displayName(
  user: { name: string | null; email: string } | null,
): string {
  return user?.name ?? user?.email ?? "A facilitator";
}

/**
 * Every annotation the room holds on one learner, grouped by the work it is
 * about. Null means the table has not been migrated — the instructor's view
 * says so rather than offering a box that cannot save.
 */
export async function getNotesForStudent(
  classroomId: string,
  studentId: string,
  viewerId: string,
): Promise<Map<string, InstructorNote[]> | null> {
  try {
    const rows = await prisma.submissionNote.findMany({
      where: { classroomId, studentId },
      select: {
        id: true,
        targetId: true,
        targetKind: true,
        body: true,
        visibility: true,
        authorId: true,
        updatedAt: true,
        author: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    const byTarget = new Map<string, InstructorNote[]>();
    for (const row of rows) {
      const note: InstructorNote = {
        id: row.id,
        targetId: row.targetId,
        targetKind: row.targetKind as NoteTargetKind,
        body: row.body,
        visibility: row.visibility as NoteVisibility,
        authorId: row.authorId,
        authorName: displayName(row.author),
        mine: row.authorId === viewerId,
        updatedAt: row.updatedAt,
      };
      const list = byTarget.get(row.targetId);
      if (list) list.push(note);
      else byTarget.set(row.targetId, [note]);
    }
    return byTarget;
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

/**
 * The feedback a learner has been given back, by the work it is about.
 *
 * cache()-keyed on the user so every `<Exercise/>` on a lesson page shares
 * one query, and it degrades to empty rather than throwing: reading a lesson
 * must not depend on this table existing, and a failed read should cost the
 * feedback card, not the lesson.
 */
export const getSharedNotes = cache(
  async (userId: string): Promise<Map<string, SharedNote[]>> => {
    const byTarget = new Map<string, SharedNote[]>();
    let rows;
    try {
      rows = await prisma.submissionNote.findMany({
        where: { studentId: userId, visibility: "shared" },
        select: {
          id: true,
          targetId: true,
          body: true,
          updatedAt: true,
          author: { select: { name: true, email: true } },
          classroom: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      });
    } catch {
      return byTarget;
    }
    for (const row of rows) {
      const note: SharedNote = {
        id: row.id,
        body: row.body,
        authorName: displayName(row.author),
        classroomName: row.classroom.name,
        updatedAt: row.updatedAt,
      };
      const list = byTarget.get(row.targetId);
      if (list) list.push(note);
      else byTarget.set(row.targetId, [note]);
    }
    return byTarget;
  },
);
