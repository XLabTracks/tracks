import { beforeEach, describe, expect, it, vi } from "vitest";

// Locks the review action's direct-POST guards (real tap-reveal id, real
// grade, signed-in user) and that a review persists re-scheduled FSRS state.

const { prisma, getCurrentUser, getExerciseById } = vi.hoisted(() => ({
  prisma: {
    reviewCard: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
  getCurrentUser: vi.fn(),
  getExerciseById: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/auth", () => ({ getCurrentUser }));
vi.mock("@/lib/content", () => ({ getExerciseById }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { Rating } from "ts-fsrs";
import { reviewCard } from "./review";

const TAP_REVEAL = { id: "tr-1", type: "tap-reveal", prompt: "p", answer: "a" };

beforeEach(() => {
  vi.clearAllMocks();
  getCurrentUser.mockResolvedValue({ id: "u1" });
  getExerciseById.mockReturnValue(TAP_REVEAL);
  prisma.reviewCard.findUnique.mockResolvedValue(null);
});

describe("reviewCard", () => {
  it("rejects unknown or non-tap-reveal content ids", async () => {
    getExerciseById.mockReturnValue(undefined);
    expect(await reviewCard("nope", Rating.Good)).toBeNull();
    getExerciseById.mockReturnValue({ id: "mc", type: "multiple-choice" });
    expect(await reviewCard("mc", Rating.Good)).toBeNull();
    expect(prisma.reviewCard.upsert).not.toHaveBeenCalled();
  });

  it("rejects grades outside the four review grades", async () => {
    expect(await reviewCard("tr-1", Rating.Manual)).toBeNull();
    expect(await reviewCard("tr-1", 5)).toBeNull();
    expect(await reviewCard("tr-1", 2.5)).toBeNull();
    expect(prisma.reviewCard.upsert).not.toHaveBeenCalled();
  });

  it("is a no-op when signed out", async () => {
    getCurrentUser.mockResolvedValue(null);
    expect(await reviewCard("tr-1", Rating.Good)).toBeNull();
    expect(prisma.reviewCard.upsert).not.toHaveBeenCalled();
  });

  it("enrolls a never-seen card on first review", async () => {
    const result = await reviewCard("tr-1", Rating.Good);
    const { create } = prisma.reviewCard.upsert.mock.calls[0][0];
    expect(create.userId).toBe("u1");
    expect(create.contentId).toBe("tr-1");
    expect(create.reps).toBe(1);
    expect(result?.due).toBe(create.due.toISOString());
  });

  it("re-schedules an existing card from its stored state", async () => {
    prisma.reviewCard.findUnique.mockResolvedValue({
      due: new Date("2026-07-23T11:00:00Z"),
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 3,
      learningSteps: 0,
      reps: 2,
      lapses: 0,
      state: 2,
      lastReview: new Date("2026-07-20T11:00:00Z"),
    });
    const result = await reviewCard("tr-1", Rating.Good);
    const { update } = prisma.reviewCard.upsert.mock.calls[0][0];
    expect(update.reps).toBe(3);
    expect(update.due.getTime()).toBeGreaterThan(Date.now());
    expect(result?.due).toBe(update.due.toISOString());
  });
});
