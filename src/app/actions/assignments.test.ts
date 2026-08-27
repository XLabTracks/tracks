// Pins the direct-POST hardening on the assignment actions: signed-out and
// non-instructor callers never reach the DB, only real module items may be
// stored (deduped, with server-derived createdById), the delete stays scoped
// to its classroom, and a missing Assignment table reports the owed migration
// instead of pretending to save.
import { afterEach, describe, expect, it, vi } from "vitest";

const { prisma, getCurrentUser, revalidatePath } = vi.hoisted(() => ({
  prisma: {
    classroomMembership: { findUnique: vi.fn() },
    assignment: {
      count: vi.fn(async () => 0),
      create: vi.fn(async () => ({})),
      deleteMany: vi.fn(async () => ({ count: 1 })),
    },
  },
  getCurrentUser: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/auth", () => ({ getCurrentUser }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

import { createAssignment, deleteAssignment } from "./assignments";
import {
  getItemsForModule,
  getModulesForTrack,
  itemIdOf,
  tracks,
} from "@/lib/content";

function realItemIds(count: number): string[] {
  const ids: string[] = [];
  for (const track of tracks) {
    for (const mod of getModulesForTrack(track.id)) {
      for (const item of getItemsForModule(mod.id)) {
        ids.push(itemIdOf(item));
        if (ids.length === count) return ids;
      }
    }
  }
  throw new Error("content graph has too few module items");
}

function form(entries: Record<string, string | string[]>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const v of Array.isArray(value) ? value : [value]) {
      fd.append(key, v);
    }
  }
  return fd;
}

const asInstructor = () => {
  getCurrentUser.mockResolvedValue({ id: "u1" });
  prisma.classroomMembership.findUnique.mockResolvedValue({
    role: "instructor",
  });
};

afterEach(() => vi.clearAllMocks());

describe("createAssignment", () => {
  it("rejects signed-out callers before touching the DB", async () => {
    getCurrentUser.mockResolvedValue(null);
    const result = await createAssignment({}, form({ classroomId: "c1" }));
    expect(result.error).toMatch(/sign in/i);
    expect(prisma.assignment.create).not.toHaveBeenCalled();
  });

  it("rejects non-instructors", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue({ role: "student" });
    await expect(
      createAssignment(
        {},
        form({ classroomId: "c1", title: "Week 1", contentIds: realItemIds(1) }),
      ),
    ).rejects.toThrow("Forbidden");
    expect(prisma.assignment.create).not.toHaveBeenCalled();
  });

  it("rejects ids outside the content graph", async () => {
    asInstructor();
    const result = await createAssignment(
      {},
      form({
        classroomId: "c1",
        title: "Week 1",
        contentIds: ["not-a-real-content-id"],
      }),
    );
    expect(result.error).toMatch(/curriculum/);
    expect(prisma.assignment.create).not.toHaveBeenCalled();
  });

  it("requires at least one item and a valid due date", async () => {
    asInstructor();
    expect(
      (await createAssignment({}, form({ classroomId: "c1", title: "W" })))
        .error,
    ).toMatch(/at least one/);
    expect(
      (
        await createAssignment(
          {},
          form({
            classroomId: "c1",
            title: "W",
            dueAt: "22-08-2026",
            contentIds: realItemIds(1),
          }),
        )
      ).error,
    ).toMatch(/due date/);
    expect(prisma.assignment.create).not.toHaveBeenCalled();
  });

  it("stores deduped ids with server-derived createdById, then redirects", async () => {
    asInstructor();
    const [id1, id2] = realItemIds(2);
    await expect(
      createAssignment(
        {},
        form({
          classroomId: "c1",
          title: "  Week 1  ",
          note: "Read before Friday",
          dueAt: "2026-08-22",
          contentIds: [id1, id2, id1],
        }),
      ),
    ).rejects.toThrow("REDIRECT:/classrooms/c1");
    expect(prisma.assignment.create).toHaveBeenCalledWith({
      data: {
        classroomId: "c1",
        createdById: "u1",
        title: "Week 1",
        note: "Read before Friday",
        contentIds: [id1, id2],
        dueAt: new Date("2026-08-22T00:00:00.000Z"),
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/classrooms/c1");
  });

  it("reports the owed migration when the table is missing", async () => {
    asInstructor();
    prisma.assignment.count.mockRejectedValueOnce(
      Object.assign(new Error("relation does not exist"), { code: "42P01" }),
    );
    const result = await createAssignment(
      {},
      form({ classroomId: "c1", title: "W", contentIds: realItemIds(1) }),
    );
    expect(result.error).toMatch(/20260820120000_assignments\.sql/);
  });
});

describe("deleteAssignment", () => {
  it("rejects signed-out callers and non-instructors before touching the row", async () => {
    getCurrentUser.mockResolvedValue(null);
    await expect(deleteAssignment("c1", "a1")).rejects.toThrow("Not signed in");
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.classroomMembership.findUnique.mockResolvedValue(null);
    await expect(deleteAssignment("c1", "a1")).rejects.toThrow("Forbidden");
    expect(prisma.assignment.deleteMany).not.toHaveBeenCalled();
  });

  it("deletes only within the caller's classroom", async () => {
    asInstructor();
    await deleteAssignment("c1", "a1");
    expect(prisma.assignment.deleteMany).toHaveBeenCalledWith({
      where: { id: "a1", classroomId: "c1" },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/classrooms/c1");
  });
});
