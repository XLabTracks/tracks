import type { Prisma, SubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import {
  parseStoredInstructorCriteria,
  type InstructorCriterion,
} from "@/lib/grader/instructor-grade";

/**
 * An instructor's grade as the pages read it. `stale` means the writing has
 * changed since it was graded (the student reopened and edited it), so the
 * grade describes an earlier version.
 */
export interface InstructorGradeView {
  criteria: InstructorCriterion[];
  comment: string | null;
  graderName: string | null;
  updatedAt: Date;
  stale: boolean;
}

export interface WrittenWorkRow {
  submissionId: string;
  exerciseId: string;
  status: SubmissionStatus;
  responseJson: Prisma.JsonValue;
  updatedAt: Date;
}

/**
 * A student's writing submissions for the given exercises, keyed by
 * exercise id. Drafts are included so the page can say one is in progress;
 * the page shows only submitted text.
 */
export async function getStudentWrittenWork(
  studentId: string,
  exerciseIds: string[],
): Promise<Map<string, WrittenWorkRow>> {
  if (exerciseIds.length === 0) return new Map();
  const rows = await prisma.submission.findMany({
    where: { userId: studentId, kind: "exercise", contentId: { in: exerciseIds } },
    select: {
      id: true,
      contentId: true,
      status: true,
      responseJson: true,
      updatedAt: true,
    },
  });
  return new Map(
    rows.map((row) => [
      row.contentId,
      {
        submissionId: row.id,
        exerciseId: row.contentId,
        status: row.status,
        responseJson: row.responseJson,
        updatedAt: row.updatedAt,
      },
    ]),
  );
}

/**
 * A fingerprint of a writing submission's text: SHA-256 over its section
 * values in key order. Compared rather than timestamps because the LLM
 * grader writes to the same row without changing a word.
 */
export async function responseHash(
  responseJson: Prisma.JsonValue,
): Promise<string> {
  const values =
    responseJson && typeof responseJson === "object" && !Array.isArray(responseJson)
      ? responseJson
      : {};
  const canonical = JSON.stringify(
    Object.keys(values)
      .sort()
      .map((key) => [key, values[key]]),
  );
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

type GradeRow = {
  criteria: Prisma.JsonValue;
  comment: string | null;
  responseHash: string;
  updatedAt: Date;
  grader: { name: string | null; email: string } | null;
  submission: { responseJson: Prisma.JsonValue };
};

const GRADE_SELECT = {
  criteria: true,
  comment: true,
  responseHash: true,
  updatedAt: true,
  grader: { select: { name: true, email: true } },
  submission: { select: { responseJson: true } },
} as const;

async function toView(row: GradeRow): Promise<InstructorGradeView> {
  return {
    criteria: parseStoredInstructorCriteria(row.criteria),
    comment: row.comment,
    graderName: row.grader ? (row.grader.name ?? row.grader.email) : null,
    updatedAt: row.updatedAt,
    stale: (await responseHash(row.submission.responseJson)) !== row.responseHash,
  };
}

/**
 * This classroom's grades on the given submissions, keyed by submission id.
 * Null means the InstructorGrade table has not been migrated yet
 * (db/migrations/20261022120000_instructor_grades.sql).
 */
export async function getClassroomGrades(
  classroomId: string,
  submissionIds: string[],
): Promise<Map<string, InstructorGradeView> | null> {
  try {
    if (submissionIds.length === 0) {
      await prisma.instructorGrade.findFirst({ select: { id: true } });
      return new Map();
    }
    const rows = await prisma.instructorGrade.findMany({
      where: { classroomId, submissionId: { in: submissionIds } },
      select: { ...GRADE_SELECT, submissionId: true },
    });
    return new Map(
      await Promise.all(
        rows.map(async (row) => [row.submissionId, await toView(row)] as const),
      ),
    );
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

export interface LearnerGradeView extends InstructorGradeView {
  classroomName: string;
}

/**
 * Every instructor grade on one of the viewer's own submissions, one per
 * classroom that graded it. Empty while the table is unmigrated: a learner
 * is never shown an error for feedback that cannot exist yet.
 */
export async function getGradesForSubmission(
  submissionId: string,
): Promise<LearnerGradeView[]> {
  try {
    const rows = await prisma.instructorGrade.findMany({
      where: { submissionId },
      select: { ...GRADE_SELECT, classroom: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return Promise.all(
      rows.map(async (row) => ({
        ...(await toView(row)),
        classroomName: row.classroom.name,
      })),
    );
  } catch (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

export interface WrittenWorkCount {
  submitted: number;
  graded: number;
}

/**
 * Per student, how many of the given writing exercises they have submitted
 * and how many of those this classroom has graded — two batched queries
 * however many students. `graded` stays 0 while the table is unmigrated.
 */
export async function getWrittenWorkCounts(
  classroomId: string,
  userIds: string[],
  exerciseIds: string[],
): Promise<Map<string, WrittenWorkCount>> {
  const counts = new Map(
    userIds.map((id) => [id, { submitted: 0, graded: 0 }]),
  );
  if (userIds.length === 0 || exerciseIds.length === 0) return counts;
  const submissions = await prisma.submission.findMany({
    where: {
      userId: { in: userIds },
      kind: "exercise",
      status: "submitted",
      contentId: { in: exerciseIds },
    },
    select: { id: true, userId: true },
  });
  for (const row of submissions) {
    const count = counts.get(row.userId);
    if (count) count.submitted += 1;
  }
  let graded: { submissionId: string }[] = [];
  try {
    graded = await prisma.instructorGrade.findMany({
      where: { classroomId, submissionId: { in: submissions.map((s) => s.id) } },
      select: { submissionId: true },
    });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
  }
  const ownerOf = new Map(submissions.map((s) => [s.id, s.userId]));
  for (const row of graded) {
    const count = counts.get(ownerOf.get(row.submissionId) ?? "");
    if (count) count.graded += 1;
  }
  return counts;
}
