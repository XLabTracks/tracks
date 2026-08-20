"use server";

import { revalidatePath } from "next/cache";

import bank from "@/content/verification/capstone-bank.json";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export type CapstoneSignupResult = { ok: true } | { ok: false; error: string };

/** Characters a proposed idea may carry. A pitch, not the capstone itself —
 *  the DB check constraint backstops this at 8192. */
const MAX_PROPOSAL = 4_000;

function cleanProposal(value: unknown): string {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
    .trim();
}

/**
 * Records the signed-in user's capstone sign-up: a bank brief, their own
 * proposed idea, or both.
 *
 * Reachable by direct POST like every action here, so nothing is trusted:
 * the slug must name a brief the bank actually carries — the bank is code,
 * so an id it does not know is a fabrication, not a race — and the proposal
 * is cleaned and capped before it reaches the row. Signing up again edits
 * the existing row; that is what the userId unique constraint is for.
 */
export async function saveCapstoneSignup(
  briefSlug: string,
  proposal: string,
): Promise<CapstoneSignupResult> {
  const user = await requireUser();

  const slug = String(briefSlug ?? "").trim();
  if (slug && !bank.entries.some((e) => e.slug === slug)) {
    return { ok: false, error: "That brief is not in the bank." };
  }

  const idea = cleanProposal(proposal);
  if (idea.length > MAX_PROPOSAL) {
    return { ok: false, error: `A proposal is capped at ${MAX_PROPOSAL} characters.` };
  }

  if (!slug && !idea) {
    return {
      ok: false,
      error: "Choose a brief from the bank or describe your own idea — one of the two.",
    };
  }

  await getDb().verificationCapstoneSignup.upsert({
    where: { userId: user.id },
    create: { userId: user.id, briefSlug: slug || null, proposal: idea || null },
    // Signing up again after a withdrawal puts the entry back on the sheet.
    update: { briefSlug: slug || null, proposal: idea || null, status: "submitted" },
  });

  revalidatePath("/verification/capstone-signup");
  revalidatePath("/verification/capstone-signups");
  return { ok: true };
}

/** Withdraws the signed-in user's sign-up. The row stays — a withdrawal is
 *  part of the record, and signing up again while the course runs is allowed. */
export async function withdrawCapstoneSignup(): Promise<CapstoneSignupResult> {
  const user = await requireUser();
  const db = getDb();

  const existing = await db.verificationCapstoneSignup.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "There is no sign-up to withdraw." };

  await db.verificationCapstoneSignup.update({
    where: { userId: user.id },
    data: { status: "withdrawn" },
  });

  revalidatePath("/verification/capstone-signup");
  revalidatePath("/verification/capstone-signups");
  return { ok: true };
}
