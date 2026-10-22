// Pins the direct-POST hardening on the annotation actions: signed-out,
// non-instructor and wrong-classroom callers never reach the table, only ids
// this course issues may be annotated, a note belongs to the instructor who
// wrote it, and a missing table reports the owed migration instead of
// pretending to save.
import { afterEach, describe, expect, it, vi } from "vitest";

const { prisma, getCurrentUser, revalidatePath, requireInstructor } = vi.hoisted(
  () => ({
    prisma: {
      classroomMembership: { findUnique: vi.fn() },
      submissionNote: {
        count: vi.fn(async () => 0),
        create: vi.fn(async () => ({})),
        updateMany: vi.fn(async () => ({ count: 1 })),
        deleteMany: vi.fn(async () => ({ count: 1 })),
      },
    },
    getCurrentUser: vi.fn(),
    revalidatePath: vi.fn(),
    requireInstructor: vi.fn(async () => undefined),
  }),
);

vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/auth", () => ({ getCurrentUser }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/classrooms", () => ({ requireInstructor }));

import { deleteSubmissionNote, saveSubmissionNote } from "./submission-notes";

const TARGET = "v-task-intuitions-5";

function form(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const fields: Record<string, string> = {
    classroomId: "c1",
    studentId: "u2",
    targetId: TARGET,
    targetKind: "exercise",
    visibility: "private_note",
    body: "the evidence step is thin",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

function signedInInstructor() {
  getCurrentUser.mockResolvedValue({ id: "u1" });
  requireInstructor.mockResolvedValue(undefined);
  prisma.classroomMembership.findUnique.mockResolvedValue({ id: "m" });
}

afterEach(() => {
  vi.clearAllMocks();
  prisma.submissionNote.count.mockResolvedValue(0);
  prisma.submissionNote.updateMany.mockResolvedValue({ count: 1 });
  prisma.submissionNote.deleteMany.mockResolvedValue({ count: 1 });
});

describe("saveSubmissionNote", () => {
  it("refuses a signed-out caller before any read", async () => {
    getCurrentUser.mockResolvedValue(null);
    expect(await saveSubmissionNote({}, form())).toEqual({
      error: "Sign in first.",
    });
    expect(prisma.submissionNote.create).not.toHaveBeenCalled();
  });

  it("refuses somebody who does not teach the classroom", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    requireInstructor.mockRejectedValue(new Error("Forbidden"));
    expect(await saveSubmissionNote({}, form())).toEqual({
      error: "You do not teach this classroom.",
    });
    expect(prisma.submissionNote.create).not.toHaveBeenCalled();
  });

  it("refuses a learner who is not in that classroom", async () => {
    signedInInstructor();
    prisma.classroomMembership.findUnique.mockResolvedValue(null);
    expect(await saveSubmissionNote({}, form())).toEqual({
      error: "That learner is not in this classroom.",
    });
    expect(prisma.submissionNote.create).not.toHaveBeenCalled();
  });

  it("refuses a target the course does not issue, and a bogus register", async () => {
    signedInInstructor();
    expect(
      (await saveSubmissionNote({}, form({ targetId: "made-up" }))).error,
    ).toMatch(/not one this course issues/);
    expect(
      (await saveSubmissionNote({}, form({ targetKind: "lesson" }))).error,
    ).toMatch(/Unknown kind/);
    expect(
      (await saveSubmissionNote({}, form({ visibility: "public" }))).error,
    ).toMatch(/Unknown visibility/);
    expect(prisma.submissionNote.create).not.toHaveBeenCalled();
  });

  it("refuses an empty or oversized body", async () => {
    signedInInstructor();
    expect((await saveSubmissionNote({}, form({ body: "  " }))).error).toMatch(
      /Write something/,
    );
    expect(
      (await saveSubmissionNote({}, form({ body: "x".repeat(4001) }))).error,
    ).toMatch(/Write something/);
    expect(prisma.submissionNote.create).not.toHaveBeenCalled();
  });

  it("stores a trimmed note with the author taken from the session", async () => {
    signedInInstructor();
    expect(
      await saveSubmissionNote(
        {},
        form({ body: "  mind the leap  ", visibility: "shared" }),
      ),
    ).toEqual({});
    expect(prisma.submissionNote.create).toHaveBeenCalledWith({
      data: {
        classroomId: "c1",
        studentId: "u2",
        authorId: "u1",
        targetId: TARGET,
        targetKind: "exercise",
        body: "mind the leap",
        visibility: "shared",
      },
    });
  });

  it("takes a memo slot that is no longer in the outline", async () => {
    signedInInstructor();
    expect(
      await saveSubmissionNote(
        {},
        form({ targetKind: "memo", targetId: "m9-retired-slot" }),
      ),
    ).toEqual({});
    expect(prisma.submissionNote.create).toHaveBeenCalled();
  });

  it("edits only the caller's own note", async () => {
    signedInInstructor();
    await saveSubmissionNote({}, form({ noteId: "n1" }));
    expect(prisma.submissionNote.updateMany).toHaveBeenCalledWith({
      where: {
        id: "n1",
        classroomId: "c1",
        studentId: "u2",
        authorId: "u1",
      },
      data: { body: "the evidence step is thin", visibility: "private_note" },
    });

    prisma.submissionNote.updateMany.mockResolvedValue({ count: 0 });
    expect(await saveSubmissionNote({}, form({ noteId: "n1" }))).toEqual({
      error: "That note is not yours.",
    });
  });

  it("reports the owed migration rather than pretending to save", async () => {
    signedInInstructor();
    prisma.submissionNote.count.mockRejectedValue({ code: "42P01" });
    expect((await saveSubmissionNote({}, form())).error).toMatch(
      /20261022120000_submission_notes\.sql/,
    );
  });
});

describe("deleteSubmissionNote", () => {
  it("refuses a signed-out or non-instructor caller", async () => {
    getCurrentUser.mockResolvedValue(null);
    expect(
      (await deleteSubmissionNote({}, form({ noteId: "n1" }))).error,
    ).toMatch(/Sign in/);

    getCurrentUser.mockResolvedValue({ id: "u1" });
    requireInstructor.mockRejectedValue(new Error("Forbidden"));
    expect(
      (await deleteSubmissionNote({}, form({ noteId: "n1" }))).error,
    ).toMatch(/do not teach/);
    expect(prisma.submissionNote.deleteMany).not.toHaveBeenCalled();
  });

  it("stays scoped to the caller's own note in that classroom", async () => {
    signedInInstructor();
    expect(await deleteSubmissionNote({}, form({ noteId: "n1" }))).toEqual({});
    expect(prisma.submissionNote.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "n1",
        classroomId: "c1",
        studentId: "u2",
        authorId: "u1",
      },
    });

    prisma.submissionNote.deleteMany.mockResolvedValue({ count: 0 });
    expect(
      (await deleteSubmissionNote({}, form({ noteId: "n1" }))).error,
    ).toMatch(/not yours/);
  });
});
