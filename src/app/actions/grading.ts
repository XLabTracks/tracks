"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { classifyLength, modelFor } from "@/lib/grader/classify";
import { feedbackToHtml } from "@/lib/grader/feedback-html";
import { callGrader } from "@/lib/grader/openrouter";
import { parseVerdict } from "@/lib/grader/parse";
import { systemPrompt, userPrompt } from "@/lib/grader/prompts";
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
  | { ok: true; score: number; band: string; feedbackHtml: string }
  | { ok: false; error: string };

/**
 * On-demand reasoning-transparency grade for the caller's own submission
 * (reachable by direct POST — re-checks auth and re-derives everything from
 * the stored row; nothing grade-relevant is trusted from the client). The
 * submission must exist and have been submitted; the parsed total (/45) and
 * the grader's full markdown report persist on the reserved Submission
 * columns with status "graded".
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

  const lengthClass = classifyLength(assembled.sample);
  const result = await callGrader(
    modelFor(lengthClass),
    systemPrompt(lengthClass),
    userPrompt(assembled.sample, assembled.context),
  );
  if (!result.ok) return result;

  const verdict = parseVerdict(result.content);
  if (!verdict) {
    return {
      ok: false,
      error: "The grader's response was malformed. Try again.",
    };
  }

  // Deliberately NOT flipping status to "graded": editors and instructor
  // views key off status === "submitted", and this automated grade shouldn't
  // change submission semantics. Grade presence = score + feedback set.
  await prisma.submission.update({
    where: { userId_contentId_kind: { userId: user.id, contentId, kind } },
    data: {
      score: verdict.score,
      feedback: result.content,
    },
  });

  return {
    ok: true,
    score: verdict.score,
    band: verdict.band,
    feedbackHtml: feedbackToHtml(result.content),
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
