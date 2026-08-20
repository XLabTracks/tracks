import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, getCurrentUser, callGrader, gradingKey, attempts, structured, sample } =
  vi.hoisted(() => ({
    prisma: { submission: { findUnique: vi.fn() } },
    getCurrentUser: vi.fn(),
    callGrader: vi.fn(),
    gradingKey: { resolveGraderKeyForRequest: vi.fn() },
    attempts: {
      billingScopeFor: vi.fn(
        (source: string, userId: string, classroomId?: string) =>
          source === "classroom"
            ? `classroom:${classroomId}`
            : source === "user"
              ? `user:${userId}`
              : "server",
      ),
      claimGradingAttempt: vi.fn(),
      completeGradingAttempt: vi.fn(),
      failGradingAttempt: vi.fn(),
    },
    structured: { parseStructuredGrade: vi.fn() },
    sample: { assembleWriting: vi.fn(), assembleArgueReveal: vi.fn() },
  }));

vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/auth", () => ({ getCurrentUser }));
vi.mock("@/lib/grader/openrouter", () => ({ callGrader }));
vi.mock("@/lib/grader/grading-key", () => gradingKey);
vi.mock("@/lib/grader/grading-attempts", () => attempts);
vi.mock("@/lib/grader/structured", () => structured);
vi.mock("@/lib/grader/sample", () => sample);
vi.mock("@/lib/content", () => ({ getExerciseById: vi.fn() }));

import { requestTransparencyGrade } from "./grading";

const TELEMETRY = { latencyMs: 120, model: "resolved/model" };

function submittedRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "sub1",
    status: "submitted",
    feedback: null,
    responseJson: { intro: "text" },
    ...overrides,
  };
}

beforeEach(() => {
  getCurrentUser.mockResolvedValue({ id: "u1" });
  prisma.submission.findUnique.mockResolvedValue(submittedRow());
  sample.assembleWriting.mockReturnValue({
    sample: "text",
    context: { documentType: "memo", stakes: "", audience: "" },
  });
  gradingKey.resolveGraderKeyForRequest.mockResolvedValue({
    ok: true,
    keySource: "server",
    apiKey: null,
  });
  attempts.claimGradingAttempt.mockResolvedValue({ ok: true, attemptId: "ga1" });
  attempts.completeGradingAttempt.mockResolvedValue(undefined);
  attempts.failGradingAttempt.mockResolvedValue(undefined);
  callGrader.mockResolvedValue({
    ok: true,
    content: "structured-json",
    telemetry: TELEMETRY,
  });
  structured.parseStructuredGrade.mockReturnValue({
    score: 30,
    band: "Strong",
    criteria: [],
    markdown: "## Top fix\nDo it.\n\n## Verdict\n30/45 — Strong. Good.",
  });
  vi.stubEnv("OPENROUTER_API_KEY", "sk-or-real-key");
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("requestTransparencyGrade", () => {
  it("rejects when signed out before DB or LLM work", async () => {
    getCurrentUser.mockResolvedValue(null);
    expect((await requestTransparencyGrade("c1", "exercise")).ok).toBe(false);
    expect(prisma.submission.findUnique).not.toHaveBeenCalled();
    expect(callGrader).not.toHaveBeenCalled();
  });

  it("rejects drafts and missing submissions", async () => {
    prisma.submission.findUnique.mockResolvedValue(null);
    expect((await requestTransparencyGrade("c1", "exercise")).ok).toBe(false);
    prisma.submission.findUnique.mockResolvedValue(submittedRow({ status: "draft" }));
    expect((await requestTransparencyGrade("c1", "exercise")).ok).toBe(false);
    expect(callGrader).not.toHaveBeenCalled();
  });

  it("surfaces key-resolution errors without silently billing another source", async () => {
    gradingKey.resolveGraderKeyForRequest.mockResolvedValue({
      ok: false,
      error: "The selected classroom key cannot be read.",
    });
    const result = await requestTransparencyGrade("c1", "exercise");
    expect(result).toEqual({
      ok: false,
      error: "The selected classroom key cannot be read.",
    });
    expect(attempts.claimGradingAttempt).not.toHaveBeenCalled();
  });

  it("fails closed when the durable claim rejects a duplicate or rate limit", async () => {
    attempts.claimGradingAttempt.mockResolvedValue({
      ok: false,
      error: "Feedback is already being generated for this submission.",
    });
    const result = await requestTransparencyGrade("c1", "exercise");
    expect(result.ok).toBe(false);
    expect(callGrader).not.toHaveBeenCalled();
  });

  it("uses a selected classroom key and classroom billing scope", async () => {
    gradingKey.resolveGraderKeyForRequest.mockResolvedValue({
      ok: true,
      keySource: "classroom",
      classroomId: "cls1",
      apiKey: "sk-or-classroom-key",
    });
    await requestTransparencyGrade("c1", "exercise");
    expect(attempts.claimGradingAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        submissionId: "sub1",
        keySource: "classroom",
        billingScope: "classroom:cls1",
      }),
    );
    expect(callGrader.mock.calls[0][3]).toBe("sk-or-classroom-key");
  });

  it("persists a validated structured grade and closes the job atomically", async () => {
    const result = await requestTransparencyGrade("c1", "exercise");
    expect(result).toMatchObject({ ok: true, score: 30, band: "Strong" });
    expect(attempts.completeGradingAttempt).toHaveBeenCalledWith({
      attemptId: "ga1",
      submissionId: "sub1",
      score: 30,
      feedback: expect.stringContaining("30/45"),
      telemetry: TELEMETRY,
    });
  });

  it("records an upstream failure before returning it", async () => {
    callGrader.mockResolvedValue({
      ok: false,
      error: "Timed out.",
      errorCode: "timeout",
      telemetry: TELEMETRY,
    });
    const result = await requestTransparencyGrade("c1", "exercise");
    expect(result).toEqual({ ok: false, error: "Timed out." });
    expect(attempts.failGradingAttempt).toHaveBeenCalledWith(
      "ga1",
      "timeout",
      TELEMETRY,
    );
  });

  it("records malformed structured output instead of spending then discarding silently", async () => {
    structured.parseStructuredGrade.mockReturnValue(null);
    const result = await requestTransparencyGrade("c1", "exercise");
    expect(result.ok).toBe(false);
    expect(attempts.failGradingAttempt).toHaveBeenCalledWith(
      "ga1",
      "invalid_structured_grade",
      TELEMETRY,
    );
  });
});
