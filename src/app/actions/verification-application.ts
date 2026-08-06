"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  APPLICATION_QUESTIONS,
  MAX_TOTAL_ANSWER_CHARS,
  OPEN_COHORT,
} from "@/lib/verification/application";
import { isReviewer } from "@/lib/verification/reviewers";

export type ApplicationResult = { ok: true } | { ok: false; error: string };

const MAX_NOTE = 2_000;

/* Statuses the applicant may still edit under. Once a reviewer has decided,
   the form closes: an accepted place should not silently revert to "submitted"
   because someone reopened the page and pressed save. */
const EDITABLE = new Set(["submitted", "withdrawn"]);

/* One-line answers must not carry newlines — they are printed in a table row
   in the reviewer list, where a line break silently reflows the whole row.
   Long answers keep theirs and lose only the control characters. */
function clean(value: unknown, multiline: boolean): string {
  const s = String(value ?? "");
  return multiline
    ? s
        .replace(/\r\n?/g, "\n")
        .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
        .trim()
    : s
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Records the signed-in user's application to the open cohort.
 *
 * Reachable by direct POST like every action here, so the submitted map is
 * rebuilt from `APPLICATION_QUESTIONS` rather than trusted: keys nobody asked
 * for are dropped instead of stored, and every answer is cleaned and capped
 * before it reaches the row. Applying twice to the same cohort edits the
 * existing application — that is what the (userId, cohort) unique constraint
 * is for.
 */
export async function submitApplication(
  answers: Record<string, string>,
): Promise<ApplicationResult> {
  const user = await requireUser();
  if (!OPEN_COHORT.open) {
    return { ok: false, error: "Applications are closed." };
  }

  const stored: Record<string, string> = {};
  let total = 0;

  for (const q of APPLICATION_QUESTIONS) {
    const value = clean(answers?.[q.id], q.kind === "long");
    if (!value) {
      if (q.required) return { ok: false, error: `“${q.prompt}” is required.` };
      continue;
    }
    if (value.length > q.max) {
      return { ok: false, error: `“${q.prompt}” is over ${q.max} characters.` };
    }
    total += value.length;
    stored[q.id] = value;
  }

  if (total > MAX_TOTAL_ANSWER_CHARS) {
    return { ok: false, error: "That is longer than an application can carry." };
  }

  const db = getDb();
  const existing = await db.verificationApplication.findUnique({
    where: { userId_cohort: { userId: user.id, cohort: OPEN_COHORT.id } },
    select: { status: true },
  });

  if (existing && !EDITABLE.has(existing.status)) {
    return { ok: false, error: "This application has already been decided." };
  }

  await db.verificationApplication.upsert({
    where: { userId_cohort: { userId: user.id, cohort: OPEN_COHORT.id } },
    create: { userId: user.id, cohort: OPEN_COHORT.id, answers: stored },
    // Re-submitting after a withdrawal puts the application back in the queue,
    // and clears the decision fields so it cannot show a stale decider.
    update: { answers: stored, status: "submitted", decidedAt: null, decidedById: null },
  });

  revalidatePath("/verification/enroll");
  return { ok: true };
}

/** Withdraws the signed-in user's application. The row stays — a withdrawal is
 *  part of the record, and re-applying while the cohort is open is allowed. */
export async function withdrawApplication(): Promise<ApplicationResult> {
  const user = await requireUser();
  const db = getDb();

  const existing = await db.verificationApplication.findUnique({
    where: { userId_cohort: { userId: user.id, cohort: OPEN_COHORT.id } },
    select: { status: true },
  });
  if (!existing) return { ok: false, error: "There is no application to withdraw." };
  if (!EDITABLE.has(existing.status)) {
    return { ok: false, error: "This application has already been decided." };
  }

  await db.verificationApplication.update({
    where: { userId_cohort: { userId: user.id, cohort: OPEN_COHORT.id } },
    data: { status: "withdrawn" },
  });

  revalidatePath("/verification/enroll");
  return { ok: true };
}

/**
 * Records a reviewer's decision on one application.
 *
 * The reviewer check is re-run here and not inherited from the page: the page
 * only decides what to render, and this is reachable by direct POST. Who counts
 * as a reviewer is VERIFICATION_REVIEWERS, which fails closed when unset.
 */
export async function decideApplication(
  applicationId: string,
  status: "accepted" | "waitlisted" | "declined",
  note: string,
): Promise<ApplicationResult> {
  const user = await requireUser();
  if (!isReviewer(user.email)) return { ok: false, error: "Not found." };
  if (!["accepted", "waitlisted", "declined"].includes(status)) {
    return { ok: false, error: "Unknown decision." };
  }

  const trimmed = clean(note, true).slice(0, MAX_NOTE);

  await getDb().verificationApplication.update({
    where: { id: applicationId },
    data: {
      status,
      note: trimmed || null,
      decidedAt: new Date(),
      decidedById: user.id,
    },
  });

  revalidatePath("/verification/applications");
  return { ok: true };
}
