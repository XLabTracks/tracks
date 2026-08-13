"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  classifyLength,
  modelsFor,
  outputTokensFor,
  reasoningEffortFor,
} from "@/lib/grader/classify";
import { feedbackToHtml } from "@/lib/grader/feedback-html";
import { callGrader } from "@/lib/grader/openrouter";
import { parseGraderReport, type CriterionResult } from "@/lib/grader/parse";
import { systemPrompt, userPrompt } from "@/lib/grader/prompts";
import { resolveGraderKeyForRequest } from "@/lib/grader/grading-key";
import {
  billingScopeFor,
  claimGradingAttempt,
  completeGradingAttempt,
  failGradingAttempt,
} from "@/lib/grader/grading-attempts";
import { parseStructuredGrade } from "@/lib/grader/structured";
import {
  assembleArgueReveal,
  assembleWriting,
  type AssembledSample,
} from "@/lib/grader/sample";
import type {
  ArgueRevealConstructionEntry,
  ArgueRevealItemEntry,
} from "@/lib/content/exercise-view";
import { getExerciseById } from "@/lib/content";

export type GradeResult =
  | {
      ok: true;
      score: number;
      band: string;
      /** Rendered from the report minus its <analysis> block. */
      feedbackHtml: string;
      /** Parsed per-criterion results for the rubric table. */
      criteria: CriterionResult[];
    }
  | { ok: false; error: string };

// .env.example ships this literal; treat it as unset (same convention as the
// encryption-secret placeholder) so a copied env file hides the feature
// instead of sending garbage auth to OpenRouter.
const SERVER_KEY_PLACEHOLDER = "sk-or-...";

function serverOpenRouterKey(): string | undefined {
  const key = process.env.OPENROUTER_API_KEY;
  return key && key !== SERVER_KEY_PLACEHOLDER ? key : undefined;
}

function logGraderEvent(
  outcome: "succeeded" | "failed",
  attemptId: string,
  details: object,
) {
  // Operational metadata only: never add the prompt, sample, response, user
  // id, or API key to this event.
  console.info("[grader]", JSON.stringify({ outcome, attemptId, ...details }));
}

/**
 * On-demand reasoning-transparency grade for the caller's own submission
 * (reachable by direct POST — re-checks auth and re-derives everything from
 * the stored row; nothing grade-relevant is trusted from the client). The
 * submission must exist and have been submitted; the parsed total (/45) and
 * the grader's full markdown report persist on the reserved Submission
 * columns. Status deliberately remains "submitted": automated feedback must
 * not change the lifecycle used by editors and instructor views.
 */
export async function requestTransparencyGrade(
  contentId: string,
  kind: "exercise" | "assessment",
): Promise<GradeResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to get feedback." };
  if (kind !== "exercise" && kind !== "assessment") {
    return { ok: false, error: "Invalid submission." };
  }

  const submission = await prisma.submission.findUnique({
    where: { userId_contentId_kind: { userId: user.id, contentId, kind } },
  });
  if (!submission || submission.status === "draft") {
    return { ok: false, error: "Submit your response first, then grade it." };
  }

  const assembled = assembleFromSubmission(
    contentId,
    kind,
    submission.responseJson,
  );
  if (!assembled) {
    return { ok: false, error: "Nothing gradeable in this submission yet." };
  }

  // Resolve selection, membership and the selected ciphertext in one DB read;
  // plaintext key material remains in this server request only.
  const resolvedKey = await resolveGraderKeyForRequest(user.id);
  if (!resolvedKey.ok) return resolvedKey;
  const { keySource, classroomId } = resolvedKey;
  const apiKey =
    keySource === "server" ? serverOpenRouterKey() : resolvedKey.apiKey;
  if (!apiKey) {
    return {
      ok: false,
      error:
        "Grading needs an OpenRouter API key — add or select one below to enable it.",
    };
  }

  const lengthClass = classifyLength(assembled.sample);
  const models = modelsFor(lengthClass, keySource);
  const claim = await claimGradingAttempt({
    userId: user.id,
    submissionId: submission.id,
    keySource,
    billingScope: billingScopeFor(keySource, user.id, classroomId),
    requestedModel: models.join(","),
  });
  if (!claim.ok) return claim;

  const result = await callGrader(
    models,
    systemPrompt(lengthClass),
    userPrompt(assembled.sample, assembled.context),
    apiKey,
    {
      maxTokens: outputTokensFor(lengthClass),
      reasoningEffort: reasoningEffortFor(lengthClass),
    },
  );
  if (!result.ok) {
    await failGradingAttempt(claim.attemptId, result.errorCode, result.telemetry);
    logGraderEvent("failed", claim.attemptId, {
      errorCode: result.errorCode,
      ...result.telemetry,
    });
    return { ok: false, error: result.error };
  }

  const grade = parseStructuredGrade(result.content, lengthClass);
  if (!grade) {
    await failGradingAttempt(
      claim.attemptId,
      "invalid_structured_grade",
      result.telemetry,
    );
    logGraderEvent("failed", claim.attemptId, {
      errorCode: "invalid_structured_grade",
      ...result.telemetry,
    });
    return {
      ok: false,
      error: "The grader's response was malformed. Try again.",
    };
  }

  await completeGradingAttempt({
    attemptId: claim.attemptId,
    submissionId: submission.id,
    score: grade.score,
    feedback: grade.markdown,
    telemetry: result.telemetry,
  });
  logGraderEvent("succeeded", claim.attemptId, result.telemetry);

  // The canonical report (including its <analysis> block) persists above;
  // the client gets only rubric rows and analysis-stripped learner feedback.
  const report = parseGraderReport(grade.markdown);
  return {
    ok: true,
    score: grade.score,
    band: grade.band,
    feedbackHtml: feedbackToHtml(report.visibleMarkdown),
    criteria: grade.criteria,
  };
}

function assembleFromSubmission(
  contentId: string,
  kind: "exercise" | "assessment",
  responseJson: unknown,
): AssembledSample | null {
  if (!responseJson || typeof responseJson !== "object") return null;
  if (kind === "exercise") {
    const exercise = getExerciseById(contentId);
    if (exercise?.type === "argue-reveal") {
      return assembleArgueReveal(
        contentId,
        responseJson as {
          items?: Record<string, ArgueRevealItemEntry>;
          construction?: ArgueRevealConstructionEntry;
        },
      );
    }
  }
  return assembleWriting(
    contentId,
    kind,
    responseJson as Record<string, unknown>,
  );
}
