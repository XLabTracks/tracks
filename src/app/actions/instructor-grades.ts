"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import { getWritingTarget } from "@/lib/content";
import { sanitizeInstructorGrade } from "@/lib/grader/instructor-grade";
import { responseHash } from "@/lib/instructor-grades";

export type InstructorGradeResult = { ok: true } | { ok: false; error: string };

const MIGRATION_MESSAGE =
  "Grading isn't set up yet — the database needs db/migrations/20261022120000_instructor_grades.sql applied.";

/**
 * The submission an instructor may grade in this classroom: the caller is an
 * instructor of it, the writer is one of its students, and the row is a
 * submitted writing exercise. Null for anything else — every check runs on
 * each call because the actions are reachable by direct POST.
 */
async function gradableSubmission(
  userId: string,
  classroomId: unknown,
  submissionId: unknown,
) {
  if (typeof classroomId !== "string" || typeof submissionId !== "string") {
    return null;
  }
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      userId: true,
      contentId: true,
      kind: true,
      status: true,
      responseJson: true,
    },
  });
  if (!submission || submission.kind !== "exercise") return null;
  if (!getWritingTarget(submission.contentId, "exercise")) return null;
  const memberships = await prisma.classroomMembership.findMany({
    where: { classroomId, userId: { in: [userId, submission.userId] } },
    select: { userId: true, role: true },
  });
  const roleOf = (id: string) => memberships.find((m) => m.userId === id)?.role;
  if (roleOf(userId) !== "instructor") return null;
  if (roleOf(submission.userId) !== "student") return null;
  return submission;
}

export async function saveInstructorGrade(
  classroomId: string,
  submissionId: string,
  input: unknown,
): Promise<InstructorGradeResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in first." };
  const values = sanitizeInstructorGrade(input);
  if (!values) {
    return {
      ok: false,
      error: "Score at least one criterion or write a comment before saving.",
    };
  }
  const submission = await gradableSubmission(user.id, classroomId, submissionId);
  if (!submission) return { ok: false, error: "This submission can't be graded here." };
  if (submission.status !== "submitted") {
    return {
      ok: false,
      error: "The student reopened this to edit it. Grade it once they resubmit.",
    };
  }

  const data = {
    criteria: values.criteria as unknown as Prisma.InputJsonValue,
    comment: values.comment,
    graderId: user.id,
    responseHash: await responseHash(submission.responseJson),
  };
  try {
    await prisma.instructorGrade.upsert({
      where: { classroomId_submissionId: { classroomId, submissionId } },
      create: { classroomId, submissionId, ...data },
      update: data,
    });
  } catch (error) {
    if (isMissingTableError(error)) return { ok: false, error: MIGRATION_MESSAGE };
    throw error;
  }
  revalidatePath(`/classrooms/${classroomId}`, "layout");
  return { ok: true };
}

export async function deleteInstructorGrade(
  classroomId: string,
  submissionId: string,
): Promise<InstructorGradeResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in first." };
  const submission = await gradableSubmission(user.id, classroomId, submissionId);
  if (!submission) return { ok: false, error: "This submission can't be graded here." };
  try {
    await prisma.instructorGrade.deleteMany({
      where: { classroomId, submissionId },
    });
  } catch (error) {
    if (isMissingTableError(error)) return { ok: false, error: MIGRATION_MESSAGE };
    throw error;
  }
  revalidatePath(`/classrooms/${classroomId}`, "layout");
  return { ok: true };
}
