import { afterEach, describe, expect, it, vi } from "vitest";

// The classroom actions are the only mutation path with membership-scoped
// authorization; this pins the invariants that keep a student from acting as
// an instructor and an instructor from removing a co-instructor.

// vi.mock factories are hoisted, so build the mocks with vi.hoisted.
const { prisma, getCurrentUser } = vi.hoisted(() => ({
  prisma: {
    classroomMembership: {
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    classroom: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    // Batch form: the actions pass an array of already-created promises.
    $transaction: vi.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
    $queryRaw: vi.fn(async () => []),
    $executeRaw: vi.fn(async () => 1),
  },
  getCurrentUser: vi.fn(),
}));

// Rebuild the SQL skeleton a tagged-template raw call received.
const sqlOf = (mock: { mock: { calls: unknown[][] } }, call = 0) =>
  (mock.mock.calls[call][0] as readonly string[]).join("?");

vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/auth", () => ({ getCurrentUser }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

import {
  createClassroom,
  deleteClassroom,
  joinClassroom,
  leaveClassroom,
  regenerateJoinCode,
  removeMember,
  setMemberRole,
} from "./classrooms";

afterEach(() => {
  vi.clearAllMocks();
});

describe("removeMember", () => {
  it("refuses non-instructors", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "student",
    });
    await expect(removeMember("c1", "u2")).rejects.toThrow("Forbidden");
    expect(prisma.classroomMembership.deleteMany).not.toHaveBeenCalled();
  });

  it("only ever deletes student rows (never a co-instructor)", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "instructor",
    });
    prisma.classroomMembership.deleteMany.mockResolvedValue({ count: 1 });
    await removeMember("c1", "u2");
    expect(prisma.classroomMembership.deleteMany).toHaveBeenCalledWith({
      where: { classroomId: "c1", userId: "u2", role: "student" },
    });
  });

  it("rejects signed-out callers before touching the DB", async () => {
    getCurrentUser.mockResolvedValue(null);
    await expect(removeMember("c1", "u2")).rejects.toThrow("Not signed in");
    expect(prisma.classroomMembership.findUnique).not.toHaveBeenCalled();
  });
});

describe("createClassroom", () => {
  const form = (entries: Record<string, string>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(entries)) fd.set(k, v);
    return fd;
  };

  it("stores a real trackId and nulls a bogus one", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroom.create.mockResolvedValue({ id: "c1" });

    await expect(
      createClassroom({}, form({ name: "A", trackId: "does-not-exist" }))
    ).rejects.toThrow("REDIRECT:/classrooms/c1");
    expect(prisma.classroom.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ trackId: null }),
      })
    );

    await expect(
      createClassroom({}, form({ name: "A", trackId: "verification" }))
    ).rejects.toThrow("REDIRECT:/classrooms/c1");
    expect(prisma.classroom.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ trackId: "verification" }),
      })
    );
  });

  it("requires a name", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    const result = await createClassroom({}, form({ name: "  " }));
    expect(result.error).toBeTruthy();
    expect(prisma.classroom.create).not.toHaveBeenCalled();
  });

  it("caps the name length server-side (direct POST can skip the form)", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    const result = await createClassroom({}, form({ name: "x".repeat(121) }));
    expect(result.error).toBeTruthy();
    expect(prisma.classroom.create).not.toHaveBeenCalled();
  });

  it("rejects a name that isn't storable text", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    const result = await createClassroom({}, form({ name: "bad\u0000name" }));
    expect(result.error).toBeTruthy();
    expect(prisma.classroom.create).not.toHaveBeenCalled();
  });
});

describe("joinClassroom", () => {
  const form = (code: string) => {
    const fd = new FormData();
    fd.set("code", code);
    return fd;
  };

  it("rejects an unknown code without creating a membership", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroom.findUnique.mockResolvedValue(null);
    const result = await joinClassroom({}, form("zzzzzz"));
    expect(result.error).toBeTruthy();
    expect(prisma.classroomMembership.upsert).not.toHaveBeenCalled();
  });

  // A legacy 6-char code: joins match on equality with no length check, so
  // codes issued before the move to 10 chars keep working.
  it("enrolls as a student on a valid code", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroom.findUnique.mockResolvedValue({ id: "c9" });
    prisma.classroomMembership.upsert.mockResolvedValue({});
    await expect(joinClassroom({}, form("ABC234"))).rejects.toThrow(
      "REDIRECT:/classrooms/c9"
    );
    expect(prisma.classroomMembership.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: { classroomId: "c9", userId: "u1", role: "student" },
      })
    );
  });
});

describe("setMemberRole", () => {
  it("refuses non-instructors", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "student",
    });
    await expect(setMemberRole("c1", "u2", "instructor")).rejects.toThrow(
      "Forbidden"
    );
    expect(prisma.classroomMembership.update).not.toHaveBeenCalled();
  });

  it("promotes a student to instructor", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique
      .mockResolvedValueOnce({ role: "instructor" }) // caller (requireInstructor)
      .mockResolvedValueOnce({ role: "student" }); // target
    prisma.classroomMembership.update.mockResolvedValue({});
    await setMemberRole("c1", "u2", "instructor");
    expect(prisma.classroomMembership.update).toHaveBeenCalledWith({
      where: { classroomId_userId: { classroomId: "c1", userId: "u2" } },
      data: { role: "instructor" },
    });
  });

  it("refuses to demote the last instructor (guarded UPDATE matches 0 rows)", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique
      .mockResolvedValueOnce({ role: "instructor" }) // caller
      .mockResolvedValueOnce({ role: "instructor" }); // target
    prisma.$executeRaw.mockResolvedValueOnce(0); // count subquery failed the guard
    await expect(setMemberRole("c1", "u1", "student")).rejects.toThrow(
      /only instructor|another instructor/i
    );
    expect(prisma.classroomMembership.update).not.toHaveBeenCalled();
  });

  it("demotes atomically: locks the classroom row and embeds the count guard in the UPDATE", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique
      .mockResolvedValueOnce({ role: "instructor" }) // caller
      .mockResolvedValueOnce({ role: "instructor" }); // target
    await setMemberRole("c1", "u2", "student"); // $executeRaw default: 1 row
    // Guard and mutation must share one transaction — the old separate
    // count-then-update let two concurrent demotes strand the room.
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(sqlOf(prisma.$queryRaw)).toContain("FOR UPDATE");
    const update = sqlOf(prisma.$executeRaw);
    expect(update).toContain('UPDATE "ClassroomMembership"');
    expect(update).toContain("SELECT COUNT(*)");
    expect(prisma.classroomMembership.update).not.toHaveBeenCalled();
  });
});

describe("leaveClassroom", () => {
  it("rejects signed-out callers", async () => {
    getCurrentUser.mockResolvedValue(null);
    await expect(leaveClassroom("c1")).rejects.toThrow("Not signed in");
    expect(prisma.classroomMembership.deleteMany).not.toHaveBeenCalled();
  });

  it("lets a student leave", async () => {
    getCurrentUser.mockResolvedValue({ id: "u2" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "student",
    });
    prisma.classroomMembership.deleteMany.mockResolvedValue({ count: 1 });
    await expect(leaveClassroom("c1")).rejects.toThrow("REDIRECT:/classrooms");
    expect(prisma.classroomMembership.deleteMany).toHaveBeenCalledWith({
      where: { classroomId: "c1", userId: "u2" },
    });
  });

  it("refuses to let the last instructor leave (guarded DELETE matches 0 rows)", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "instructor",
    });
    prisma.$executeRaw.mockResolvedValueOnce(0); // count subquery failed the guard
    await expect(leaveClassroom("c1")).rejects.toThrow(/only instructor/i);
    expect(prisma.classroomMembership.deleteMany).not.toHaveBeenCalled();
  });

  it("lets an instructor leave atomically when a co-instructor remains", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "instructor",
    });
    await expect(leaveClassroom("c1")).rejects.toThrow("REDIRECT:/classrooms"); // $executeRaw default: 1 row
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(sqlOf(prisma.$queryRaw)).toContain("FOR UPDATE");
    const del = sqlOf(prisma.$executeRaw);
    expect(del).toContain('DELETE FROM "ClassroomMembership"');
    expect(del).toContain("SELECT COUNT(*)");
  });
});

describe("deleteClassroom", () => {
  it("refuses non-instructors", async () => {
    getCurrentUser.mockResolvedValue({ id: "u2" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "student",
    });
    await expect(deleteClassroom("c1")).rejects.toThrow("Forbidden");
    expect(prisma.classroom.delete).not.toHaveBeenCalled();
  });

  it("deletes and redirects for an instructor", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "instructor",
    });
    prisma.classroom.delete.mockResolvedValue({});
    await expect(deleteClassroom("c1")).rejects.toThrow("REDIRECT:/classrooms");
    expect(prisma.classroom.delete).toHaveBeenCalledWith({
      where: { id: "c1" },
    });
  });
});

describe("regenerateJoinCode", () => {
  it("requires instructor role", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "student",
    });
    await expect(regenerateJoinCode("c1")).rejects.toThrow("Forbidden");
    expect(prisma.classroom.update).not.toHaveBeenCalled();
  });

  it("generates 10-char codes from the unambiguous alphabet", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({
      role: "instructor",
    });
    prisma.classroom.update.mockResolvedValue({});
    await regenerateJoinCode("c1");
    const code = prisma.classroom.update.mock.calls[0][0].data
      .joinCode as string;
    // 10 chars of the 31-char alphabet is a ~50-bit space — the whole
    // defense against online join-code enumeration (no request throttle).
    expect(code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{10}$/);
  });
});
