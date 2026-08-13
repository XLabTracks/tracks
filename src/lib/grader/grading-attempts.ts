import "server-only";
import { Prisma } from "@prisma/client";
import { isUniqueViolation, prisma } from "@/lib/db";
import type { GraderKeySource } from "./classify";
import type { GraderTelemetry } from "./openrouter";

const COOLDOWN_MS = 30_000;
const PENDING_LEASE_MS = 90_000;
const SERVER_USER_HOURLY_CAP = 12;
const SERVER_HOURLY_CAP = 600;
const CLASSROOM_USER_HOURLY_CAP = 24;
const CLASSROOM_HOURLY_CAP = 240;

export type GradingClaim =
  | { ok: true; attemptId: string }
  | { ok: false; error: string };

function isMissingAttemptTable(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === "P2021") return true;
  return (
    error.code === "P2010" &&
    typeof error.meta?.code === "string" &&
    error.meta.code === "42P01"
  );
}

/** A stable, non-secret scope used for shared-key rate limits and telemetry. */
export function billingScopeFor(
  keySource: GraderKeySource,
  userId: string,
  classroomId?: string,
): string {
  if (keySource === "classroom" && classroomId) return `classroom:${classroomId}`;
  if (keySource === "user") return `user:${userId}`;
  return "server";
}

/**
 * Claims the one in-flight slot for a submission and records a real grading
 * event. Advisory locks serialize rate-limit check + insert across Workers;
 * the partial unique index is a second line of defence for the same row.
 */
export async function claimGradingAttempt(input: {
  userId: string;
  submissionId: string;
  keySource: GraderKeySource;
  billingScope: string;
  requestedModel: string;
}): Promise<GradingClaim> {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - PENDING_LEASE_MS);
  const cooldownAfter = new Date(now.getTime() - COOLDOWN_MS);
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  try {
    return await prisma.$transaction(async (tx) => {
      // All callers take locks in the same lexical order. Classroom work gets
      // both a classroom-wide and a per-user lock; other sources need only the
      // per-user/scope lock. These transactions contain no network work.
      const lockNames = [
        `grader:user:${input.userId}:${input.billingScope}`,
        ...(input.keySource === "classroom" || input.keySource === "server"
          ? [`grader:scope:${input.billingScope}`]
          : []),
      ].sort();
      for (const lockName of lockNames) {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${lockName}, 0))`;
      }

      await tx.gradingAttempt.updateMany({
        where: {
          submissionId: input.submissionId,
          status: "pending",
          createdAt: { lt: staleBefore },
        },
        data: {
          status: "failed",
          errorCode: "lease_expired",
          finishedAt: now,
        },
      });

      const recentForSubmission = await tx.gradingAttempt.findFirst({
        where: {
          submissionId: input.submissionId,
          createdAt: { gte: cooldownAfter },
        },
        select: { status: true },
        orderBy: { createdAt: "desc" },
      });
      if (recentForSubmission?.status === "pending") {
        return {
          ok: false as const,
          error: "Feedback is already being generated for this submission.",
        };
      }
      if (recentForSubmission) {
        return {
          ok: false as const,
          error: "This submission was just graded — wait 30 seconds before regrading.",
        };
      }

      const userCap =
        input.keySource === "server"
          ? SERVER_USER_HOURLY_CAP
          : input.keySource === "classroom"
            ? CLASSROOM_USER_HOURLY_CAP
            : null;
      if (userCap != null) {
        const userAttempts = await tx.gradingAttempt.count({
          where: {
            userId: input.userId,
            keySource: input.keySource,
            createdAt: { gte: hourAgo },
          },
        });
        if (userAttempts >= userCap) {
          return {
            ok: false as const,
            error: "Grading limit reached for now — try again in an hour.",
          };
        }
      }
      if (input.keySource === "classroom") {
        const classroomAttempts = await tx.gradingAttempt.count({
          where: {
            billingScope: input.billingScope,
            createdAt: { gte: hourAgo },
          },
        });
        if (classroomAttempts >= CLASSROOM_HOURLY_CAP) {
          return {
            ok: false as const,
            error:
              "This classroom's grading limit has been reached — ask the instructor or try again later.",
          };
        }
      }
      if (input.keySource === "server") {
        const serverAttempts = await tx.gradingAttempt.count({
          where: {
            billingScope: "server",
            createdAt: { gte: hourAgo },
          },
        });
        if (serverAttempts >= SERVER_HOURLY_CAP) {
          return {
            ok: false as const,
            error: "The shared grader is busy — try again later or select another key.",
          };
        }
      }

      const attempt = await tx.gradingAttempt.create({
        data: {
          userId: input.userId,
          submissionId: input.submissionId,
          keySource: input.keySource,
          billingScope: input.billingScope,
          requestedModel: input.requestedModel,
        },
        select: { id: true },
      });
      return { ok: true as const, attemptId: attempt.id };
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        error: "Feedback is already being generated for this submission.",
      };
    }
    if (isMissingAttemptTable(error)) {
      return {
        ok: false,
        error:
          "Grading is temporarily unavailable while its database upgrade completes.",
      };
    }
    throw error;
  }
}

function telemetryData(telemetry?: GraderTelemetry) {
  return {
    resolvedModel: telemetry?.model,
    provider: telemetry?.provider,
    requestId: telemetry?.requestId,
    promptTokens: telemetry?.usage?.promptTokens,
    completionTokens: telemetry?.usage?.completionTokens,
    totalTokens: telemetry?.usage?.totalTokens,
    latencyMs: telemetry?.latencyMs,
  };
}

export async function failGradingAttempt(
  attemptId: string,
  errorCode: string,
  telemetry?: GraderTelemetry,
): Promise<void> {
  await prisma.gradingAttempt.update({
    where: { id: attemptId },
    data: {
      status: "failed",
      errorCode,
      finishedAt: new Date(),
      ...telemetryData(telemetry),
    },
  });
}

/** Persists the learner-visible grade and closes its job atomically. */
export async function completeGradingAttempt(input: {
  attemptId: string;
  submissionId: string;
  score: number;
  feedback: string;
  telemetry: GraderTelemetry;
}): Promise<void> {
  await prisma.$transaction([
    prisma.submission.update({
      where: { id: input.submissionId },
      data: { score: input.score, feedback: input.feedback },
    }),
    prisma.gradingAttempt.update({
      where: { id: input.attemptId },
      data: {
        status: "succeeded",
        finishedAt: new Date(),
        ...telemetryData(input.telemetry),
      },
    }),
  ]);
}
