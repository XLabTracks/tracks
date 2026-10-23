"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { requireInstructor } from "@/lib/classrooms";
import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import {
  isNoteTarget,
  isNoteTargetKind,
  isNoteVisibility,
  normalizeNoteBody,
} from "@/lib/submission-notes";

export interface NoteActionState {
  error?: string;
}

const MIGRATION_MESSAGE =
  "Annotations aren't set up yet — the database needs db/migrations/20261022120000_submission_notes.sql applied.";

// One learner's work in one room is a bounded page already; this stops a
// pathological room making the instructor's view unbounded.
const MAX_NOTES_PER_STUDENT = 500;

/**
 * Write or rewrite an instructor's annotation on one piece of a learner's
 * work. Reachable by direct POST, so everything is re-derived here: the
 * caller must be an instructor of the named classroom, the learner must be a
 * member of that same classroom, and the target must be an id of the
 * register it claims.
 */
export async function saveSubmissionNote(
  _prev: NoteActionState,
  formData: FormData,
): Promise<NoteActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in first." };

  const classroomId = String(formData.get("classroomId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  const targetId = String(formData.get("targetId") ?? "");
  const targetKind = formData.get("targetKind");
  const visibility = formData.get("visibility");
  const noteId = String(formData.get("noteId") ?? "");

  if (!isNoteTargetKind(targetKind)) return { error: "Unknown kind of work." };
  if (!isNoteVisibility(visibility)) return { error: "Unknown visibility." };
  if (!isNoteTarget(targetKind, targetId)) {
    return { error: "That piece of work is not one this course issues." };
  }
  const body = normalizeNoteBody(formData.get("body"));
  if (!body) return { error: "Write something, up to 4000 characters." };

  try {
    await requireInstructor(user.id, classroomId);
  } catch {
    return { error: "You do not teach this classroom." };
  }

  const membership = await prisma.classroomMembership.findUnique({
    where: { classroomId_userId: { classroomId, userId: studentId } },
    select: { id: true },
  });
  if (!membership) return { error: "That learner is not in this classroom." };

  try {
    if (noteId) {
      // Scoped to the author's own note: a co-instructor may read the room's
      // annotations but never edit somebody else's words, and the count
      // tells us whether the id was theirs rather than a 404 either way.
      const updated = await prisma.submissionNote.updateMany({
        where: { id: noteId, classroomId, studentId, authorId: user.id },
        data: { body, visibility },
      });
      if (updated.count === 0) return { error: "That note is not yours." };
    } else {
      const existing = await prisma.submissionNote.count({
        where: { classroomId, studentId },
      });
      if (existing >= MAX_NOTES_PER_STUDENT) {
        return { error: "This learner already has the maximum of notes." };
      }
      await prisma.submissionNote.create({
        data: {
          classroomId,
          studentId,
          authorId: user.id,
          targetId,
          targetKind,
          body,
          visibility,
        },
      });
    }
  } catch (error) {
    if (isMissingTableError(error)) return { error: MIGRATION_MESSAGE };
    throw error;
  }

  revalidatePath(`/classrooms/${classroomId}/students/${studentId}`);
  return {};
}

/** Remove an annotation. Only its author may. */
export async function deleteSubmissionNote(
  _prev: NoteActionState,
  formData: FormData,
): Promise<NoteActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in first." };

  const classroomId = String(formData.get("classroomId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  const noteId = String(formData.get("noteId") ?? "");
  if (!noteId) return { error: "Nothing to remove." };

  try {
    await requireInstructor(user.id, classroomId);
  } catch {
    return { error: "You do not teach this classroom." };
  }

  try {
    const removed = await prisma.submissionNote.deleteMany({
      where: { id: noteId, classroomId, studentId, authorId: user.id },
    });
    if (removed.count === 0) return { error: "That note is not yours." };
  } catch (error) {
    if (isMissingTableError(error)) return { error: MIGRATION_MESSAGE };
    throw error;
  }

  revalidatePath(`/classrooms/${classroomId}/students/${studentId}`);
  return {};
}
