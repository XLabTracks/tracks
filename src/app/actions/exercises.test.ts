import { beforeEach, describe, expect, it, vi } from "vitest";

// Locks recordTapReveal's spaced-repetition enrollment: the first rating
// creates the FSRS card, a rating on a due card counts as a review, and a
// rating on a not-yet-due card leaves the schedule untouched (so re-clicking
// the buttons to correct a self-assessment doesn't inflate it). Also locks
// gradeFlowchartStage's persistence: stale stage entries are pruned (so the
// score can't exceed 1 after authoring drift) and per-stage miss counts
// accumulate across sessions (they restore the "Show solution" gate).

const { prisma, getCurrentUser, getExerciseById } = vi.hoisted(() => ({
  prisma: {
    submission: { findUnique: vi.fn(), upsert: vi.fn() },
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

import { gradeFlowchartStage, recordTapReveal } from "./exercises";

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

// Minimal real definition: sanitize/grade run unmocked against it.
const FLOWCHART = {
  id: "fc-1",
  type: "flowchart",
  prompt: "p",
  palette: [
    { id: "b-step", kind: "step", label: "Step" },
    { id: "b-done", kind: "terminal", label: "Done" },
  ],
  stages: [
    {
      id: "s1",
      title: "S1",
      description: "d",
      solution: [{ blockId: "b-done" }],
      explanation: "why",
    },
    {
      id: "s2",
      title: "S2",
      description: "d",
      solution: [{ blockId: "b-step" }, { blockId: "b-done" }],
    },
  ],
};

describe("gradeFlowchartStage", () => {
  beforeEach(() => {
    getExerciseById.mockReturnValue(FLOWCHART);
    prisma.submission.findUnique.mockResolvedValue(null);
  });

  it("prunes entries whose stage left the exercise, so the score can't exceed 1", async () => {
    prisma.submission.findUnique.mockResolvedValue({
      responseJson: {
        stages: {
          "s-old": { attempt: [{ blockId: "b-done" }], correct: true },
          s1: { attempt: [{ blockId: "b-done" }], correct: true, attempts: 0 },
        },
      },
    });
    const result = await gradeFlowchartStage("fc-1", "s2", [
      { blockId: "b-step" },
      { blockId: "b-done" },
    ]);
    expect(result.correct).toBe(true);
    const { update } = prisma.submission.upsert.mock.calls[0][0];
    expect(Object.keys(update.responseJson.stages).sort()).toEqual(["s1", "s2"]);
    expect(update.score).toBe(1);
  });

  it("accumulates the per-stage miss count across grades", async () => {
    prisma.submission.findUnique.mockResolvedValue({
      responseJson: {
        stages: {
          s1: { attempt: [{ blockId: "b-step" }], correct: false, attempts: 1 },
        },
      },
    });
    const result = await gradeFlowchartStage("fc-1", "s1", [
      { blockId: "b-step" },
    ]);
    expect(result.correct).toBe(false);
    const { update } = prisma.submission.upsert.mock.calls[0][0];
    expect(update.responseJson.stages.s1.attempts).toBe(2);
  });

  it("keeps the accumulated miss count on a correct grade", async () => {
    prisma.submission.findUnique.mockResolvedValue({
      responseJson: {
        stages: {
          s1: { attempt: [{ blockId: "b-step" }], correct: false, attempts: 2 },
        },
      },
    });
    const result = await gradeFlowchartStage("fc-1", "s1", [
      { blockId: "b-done" },
    ]);
    expect(result).toEqual({ correct: true, explanation: "why" });
    const { update } = prisma.submission.upsert.mock.calls[0][0];
    expect(update.responseJson.stages.s1).toEqual({
      attempt: [{ blockId: "b-done" }],
      correct: true,
      attempts: 2,
    });
  });
});
