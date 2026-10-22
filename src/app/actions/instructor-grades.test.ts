// Pins the direct-POST hardening on instructor grading: only an instructor of
// the classroom may grade, only that classroom's students' submitted writing
// exercises are gradable, the stored grade is the sanitized one with a
// server-derived grader and text fingerprint, and a missing table reports the
// owed migration instead of pretending to save.
import { afterEach, describe, expect, it, vi } from "vitest";

const { prisma, getCurrentUser, revalidatePath } = vi.hoisted(() => ({
  prisma: {
    submission: { findUnique: vi.fn() },
    classroomMembership: { findMany: vi.fn() },
    instructorGrade: {
      upsert: vi.fn(async () => ({})),
      deleteMany: vi.fn(async () => ({ count: 1 })),
    },
  },
  getCurrentUser: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/auth", () => ({ getCurrentUser }));
vi.mock("next/cache", () => ({ revalidatePath }));

import { deleteInstructorGrade, saveInstructorGrade } from "./instructor-grades";
import { exercises } from "@/content/exercises.data";
import { isWritingExercise } from "@/lib/content/types";
import { responseHash } from "@/lib/instructor-grades";

const writingId = exercises.find(isWritingExercise)!.id;
const choiceId = exercises.find((e) => e.type === "multiple-choice")!.id;
const GRADE = { criteria: [{ id: "C1", score: 2, note: "Clear." }], comment: "Nice." };

function submission(overrides: Record<string, unknown> = {}) {
  return {
    id: "s1",
    userId: "student",
    contentId: writingId,
    kind: "exercise",
    status: "submitted",
    responseJson: { response: "My answer." },
    ...overrides,
  };
}

function roles(instructor: string | null, student: string | null) {
  prisma.classroomMembership.findMany.mockResolvedValue([
    ...(instructor ? [{ userId: "teacher", role: instructor }] : []),
    ...(student ? [{ userId: "student", role: student }] : []),
  ]);
}

afterEach(() => vi.clearAllMocks());

describe("saveInstructorGrade", () => {
  it("rejects signed-out callers before touching the DB", async () => {
    getCurrentUser.mockResolvedValue(null);
    const result = await saveInstructorGrade("c1", "s1", GRADE);
    expect(result.ok).toBe(false);
    expect(prisma.submission.findUnique).not.toHaveBeenCalled();
  });

  it.each([
    ["a student of the classroom", "student", "student"],
    ["a non-member", null, "student"],
  ])("rejects %s as grader", async (_label, callerRole, studentRole) => {
    getCurrentUser.mockResolvedValue({ id: "teacher" });
    prisma.submission.findUnique.mockResolvedValue(submission());
    roles(callerRole, studentRole);
    expect((await saveInstructorGrade("c1", "s1", GRADE)).ok).toBe(false);
    expect(prisma.instructorGrade.upsert).not.toHaveBeenCalled();
  });

  it.each([
    ["a writer outside the classroom", submission(), null],
    ["a fellow instructor's writing", submission(), "instructor"],
    ["a closed exercise", submission({ contentId: choiceId }), "student"],
    ["an assessment row", submission({ kind: "assessment" }), "student"],
    ["a draft", submission({ status: "draft" }), "student"],
  ])("refuses to grade %s", async (_label, row, studentRole) => {
    getCurrentUser.mockResolvedValue({ id: "teacher" });
    prisma.submission.findUnique.mockResolvedValue(row);
    roles("instructor", studentRole);
    expect((await saveInstructorGrade("c1", "s1", GRADE)).ok).toBe(false);
    expect(prisma.instructorGrade.upsert).not.toHaveBeenCalled();
  });

  it("rejects a malformed grade before touching the DB", async () => {
    getCurrentUser.mockResolvedValue({ id: "teacher" });
    const result = await saveInstructorGrade("c1", "s1", {
      criteria: [{ id: "C1", score: 7 }],
      comment: "",
    });
    expect(result.ok).toBe(false);
    expect(prisma.submission.findUnique).not.toHaveBeenCalled();
  });

  it("stores the sanitized grade with a server-derived grader and fingerprint", async () => {
    getCurrentUser.mockResolvedValue({ id: "teacher" });
    prisma.submission.findUnique.mockResolvedValue(submission());
    roles("instructor", "student");
    expect(await saveInstructorGrade("c1", "s1", GRADE)).toEqual({ ok: true });
    const call = prisma.instructorGrade.upsert.mock.calls[0] as unknown as [
      { where: unknown; create: Record<string, unknown> },
    ];
    expect(call[0].where).toEqual({
      classroomId_submissionId: { classroomId: "c1", submissionId: "s1" },
    });
    expect(call[0].create.graderId).toBe("teacher");
    expect(call[0].create.comment).toBe("Nice.");
    expect(call[0].create.responseHash).toBe(
      await responseHash({ response: "My answer." }),
    );
    expect((call[0].create.criteria as unknown[]).length).toBe(7);
  });

  it("reports the owed migration when the table is missing", async () => {
    getCurrentUser.mockResolvedValue({ id: "teacher" });
    prisma.submission.findUnique.mockResolvedValue(submission());
    roles("instructor", "student");
    prisma.instructorGrade.upsert.mockRejectedValueOnce({ code: "P2021" });
    const result = await saveInstructorGrade("c1", "s1", GRADE);
    expect(result).toMatchObject({ ok: false });
    expect(result.ok === false && result.error).toMatch(/migrations/);
  });
});

describe("deleteInstructorGrade", () => {
  it("only deletes within the classroom, for its instructor", async () => {
    getCurrentUser.mockResolvedValue({ id: "teacher" });
    prisma.submission.findUnique.mockResolvedValue(submission());
    roles("instructor", "student");
    expect(await deleteInstructorGrade("c1", "s1")).toEqual({ ok: true });
    expect(prisma.instructorGrade.deleteMany).toHaveBeenCalledWith({
      where: { classroomId: "c1", submissionId: "s1" },
    });
  });

  it("rejects non-instructors", async () => {
    getCurrentUser.mockResolvedValue({ id: "teacher" });
    prisma.submission.findUnique.mockResolvedValue(submission());
    roles("student", "student");
    expect((await deleteInstructorGrade("c1", "s1")).ok).toBe(false);
    expect(prisma.instructorGrade.deleteMany).not.toHaveBeenCalled();
  });
});

describe("responseHash", () => {
  it("ignores key order and changes with the text", async () => {
    expect(await responseHash({ a: "1", b: "2" })).toBe(
      await responseHash({ b: "2", a: "1" }),
    );
    expect(await responseHash({ a: "1" })).not.toBe(await responseHash({ a: "2" }));
  });
});
