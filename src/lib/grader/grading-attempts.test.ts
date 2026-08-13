import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, tx, isUniqueViolation } = vi.hoisted(() => {
  const transactionClient = {
    $queryRaw: vi.fn(),
    gradingAttempt: {
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  };
  return {
    tx: transactionClient,
    isUniqueViolation: vi.fn(),
    prisma: {
      $transaction: vi.fn(),
      submission: { update: vi.fn() },
      gradingAttempt: { update: vi.fn() },
    },
  };
});

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ prisma, isUniqueViolation }));

import {
  billingScopeFor,
  claimGradingAttempt,
  completeGradingAttempt,
  failGradingAttempt,
} from "./grading-attempts";

const BASE = {
  userId: "u1",
  submissionId: "sub1",
  keySource: "server" as const,
  billingScope: "server",
  requestedModel: "model/one,model/two",
};

beforeEach(() => {
  vi.clearAllMocks();
  prisma.$transaction.mockImplementation(async (arg: unknown) => {
    if (typeof arg === "function") return arg(tx);
    return Promise.all(arg as Promise<unknown>[]);
  });
  tx.$queryRaw.mockResolvedValue([]);
  tx.gradingAttempt.updateMany.mockResolvedValue({ count: 0 });
  tx.gradingAttempt.findFirst.mockResolvedValue(null);
  tx.gradingAttempt.count.mockResolvedValue(0);
  tx.gradingAttempt.create.mockResolvedValue({ id: "ga1" });
  prisma.gradingAttempt.update.mockResolvedValue({});
  prisma.submission.update.mockResolvedValue({});
});

describe("billingScopeFor", () => {
  it("never embeds API key material", () => {
    expect(billingScopeFor("server", "u1")).toBe("server");
    expect(billingScopeFor("user", "u1")).toBe("user:u1");
    expect(billingScopeFor("classroom", "u1", "c1")).toBe("classroom:c1");
  });
});

describe("claimGradingAttempt", () => {
  it("serializes the check and creates one durable pending event", async () => {
    expect(await claimGradingAttempt(BASE)).toEqual({ ok: true, attemptId: "ga1" });
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
    expect(tx.gradingAttempt.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "u1",
        submissionId: "sub1",
        keySource: "server",
      }),
      select: { id: true },
    });
  });

  it("rejects a concurrent or just-finished attempt before the LLM call", async () => {
    tx.gradingAttempt.findFirst.mockResolvedValue({ status: "pending" });
    let result = await claimGradingAttempt(BASE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/already being generated/i);

    tx.gradingAttempt.findFirst.mockResolvedValue({ status: "succeeded" });
    result = await claimGradingAttempt(BASE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/wait 30 seconds/i);
    expect(tx.gradingAttempt.create).not.toHaveBeenCalled();
  });

  it("counts actual server grading events, not distinct submissions", async () => {
    tx.gradingAttempt.count.mockResolvedValueOnce(12);
    const result = await claimGradingAttempt(BASE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/limit/i);
    expect(tx.gradingAttempt.count).toHaveBeenCalledWith({
      where: expect.objectContaining({ userId: "u1", keySource: "server" }),
    });
  });

  it("also caps aggregate spend on the shared server key", async () => {
    tx.gradingAttempt.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(600);
    const result = await claimGradingAttempt(BASE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/shared grader is busy/i);
  });

  it("enforces both per-user and classroom-wide shared-key limits", async () => {
    tx.gradingAttempt.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(240);
    const result = await claimGradingAttempt({
      ...BASE,
      keySource: "classroom",
      billingScope: "classroom:c1",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/classroom's grading limit/i);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
  });

  it("does not hourly-cap a learner's own key, but still claims the duplicate slot", async () => {
    const result = await claimGradingAttempt({
      ...BASE,
      keySource: "user",
      billingScope: "user:u1",
    });
    expect(result.ok).toBe(true);
    expect(tx.gradingAttempt.count).not.toHaveBeenCalled();
    expect(tx.gradingAttempt.create).toHaveBeenCalled();
  });
});

describe("attempt completion", () => {
  it("closes failed jobs with telemetry", async () => {
    await failGradingAttempt("ga1", "timeout", {
      latencyMs: 50_000,
      model: "resolved/model",
      usage: { totalTokens: 12 },
    });
    expect(prisma.gradingAttempt.update).toHaveBeenCalledWith({
      where: { id: "ga1" },
      data: expect.objectContaining({
        status: "failed",
        errorCode: "timeout",
        latencyMs: 50_000,
        resolvedModel: "resolved/model",
        totalTokens: 12,
      }),
    });
  });

  it("stores the grade and closes its attempt in one transaction", async () => {
    await completeGradingAttempt({
      attemptId: "ga1",
      submissionId: "sub1",
      score: 30,
      feedback: "report",
      telemetry: { latencyMs: 400 },
    });
    expect(prisma.$transaction).toHaveBeenCalledWith([
      expect.anything(),
      expect.anything(),
    ]);
    expect(prisma.submission.update).toHaveBeenCalledWith({
      where: { id: "sub1" },
      data: { score: 30, feedback: "report" },
    });
    expect(prisma.gradingAttempt.update).toHaveBeenCalledWith({
      where: { id: "ga1" },
      data: expect.objectContaining({ status: "succeeded", latencyMs: 400 }),
    });
  });
});
