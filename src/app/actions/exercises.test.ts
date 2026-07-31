import { beforeEach, describe, expect, it, vi } from "vitest";

// Locks recordTapReveal's spaced-repetition enrollment: the first rating
// creates the FSRS card, a rating on a due card counts as a review, and a
// rating on a not-yet-due card leaves the schedule untouched (so re-clicking
// the buttons to correct a self-assessment doesn't inflate it).

const { prisma, getCurrentUser, getExerciseById } = vi.hoisted(() => ({
  prisma: {
    submission: { upsert: vi.fn() },
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

import { recordTapReveal } from "./exercises";

const TAP_REVEAL = { id: "tr-1", type: "tap-reveal", prompt: "p", answer: "a" };

const FUTURE = new Date(Date.now() + 60 * 60 * 1000);
const PAST = new Date(Date.now() - 60 * 60 * 1000);

function cardRow(due: Date) {
  return {
    due,
    stability: 3,
    difficulty: 5,
    elapsedDays: 0,
    scheduledDays: 3,
    learningSteps: 0,
    reps: 2,
    lapses: 0,
    state: 2,
    lastReview: PAST,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  getCurrentUser.mockResolvedValue({ id: "u1" });
  getExerciseById.mockReturnValue(TAP_REVEAL);
  prisma.reviewCard.findUnique.mockResolvedValue(null);
});

describe("recordTapReveal", () => {
  it("persists nothing when signed out", async () => {
    getCurrentUser.mockResolvedValue(null);
    await recordTapReveal("tr-1", "yes");
    expect(prisma.submission.upsert).not.toHaveBeenCalled();
    expect(prisma.reviewCard.upsert).not.toHaveBeenCalled();
  });

  it("enrolls the card in the review bank on first rating", async () => {
    await recordTapReveal("tr-1", "yes");
    expect(prisma.submission.upsert).toHaveBeenCalled();
    const { create } = prisma.reviewCard.upsert.mock.calls[0][0];
    expect(create.contentId).toBe("tr-1");
    expect(create.reps).toBe(1);
  });

  it("counts a rating on a due card as a review", async () => {
    prisma.reviewCard.findUnique.mockResolvedValue(cardRow(PAST));
    await recordTapReveal("tr-1", "partial");
    const { update } = prisma.reviewCard.upsert.mock.calls[0][0];
    expect(update.reps).toBe(3);
  });

  it("leaves the schedule untouched when the card is not yet due", async () => {
    prisma.reviewCard.findUnique.mockResolvedValue(cardRow(FUTURE));
    await recordTapReveal("tr-1", "no");
    expect(prisma.submission.upsert).toHaveBeenCalled();
    expect(prisma.reviewCard.upsert).not.toHaveBeenCalled();
  });
});
