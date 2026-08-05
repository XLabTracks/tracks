import type { Metadata } from "next";
import Link from "next/link";

import bank from "@/content/verification/capstone-bank.json";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Capstone — Verification" };

/*
 * The capstone sign-up sheet, learner side.
 *
 * There is deliberately no assigned task: the learner either commits to a
 * brief from the bank or proposes their own idea, and this page records
 * which. Facilitators read the sheet at /verification/capstone-signups.
 *
 * Signed out this is a page, not a redirect — someone deciding what to take
 * on should be able to read the choices before being asked to sign in.
 * getCurrentUser, not requireUser: requireUser refreshes the session inside
 * the render, and a page render may not write cookies (it surfaces as a 500
 * rather than a prompt).
 *
 * Trap: this route lives beside the course's static assets under
 * public/verification/. Nothing exists at this path there, so the app route
 * serves it — putting a file there would silently take the URL.
 */
export default async function CapstoneSignupPage() {
  const user = await getCurrentUser();

  let row: { briefSlug: string | null; proposal: string | null; status: string } | null = null;
  let tableMissing = false;

  if (user) {
    try {
      row = await getDb().verificationCapstoneSignup.findUnique({
        where: { userId: user.id },
        select: { briefSlug: true, proposal: true, status: true },
      });
    } catch {
      // The migration has not been applied in this environment. Say so, rather
      // than rendering a form whose submit fails with nothing explaining why.
      tableMissing = true;
    }
  }

  // The picker's option list: slug and title per theme, nothing else — the
  // full briefs live on the bank page, which is where choosing happens.
  const themes: { theme: string; briefs: { slug: string; title: string }[] }[] = [];
  for (const e of [...bank.entries].sort(
    (a, b) => a.theme.localeCompare(b.theme) || a.title.localeCompare(b.title),
  )) {
    const g = themes.at(-1);
    const brief = { slug: e.slug, title: e.title };
    if (g && g.theme === e.theme) g.briefs.push(brief);
    else themes.push({ theme: e.theme, briefs: [brief] });
  }

  const signedUp = row !== null && row.status !== "withdrawn";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Capstone</h1>

      <p className="mt-6 leading-relaxed">You are almost done.</p>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        The only thing left is the capstone project — one piece of work that
        shows what you have learned, applied to a problem you chose. There is
        no assigned task. Two ways to pick one:
      </p>

      <ul className="text-muted-foreground mt-4 space-y-3 leading-relaxed">
        <li>
          <b className="text-foreground font-medium">Choose from the capstone bank.</b>{" "}
          <Link
            className="underline underline-offset-4"
            href="/verification/capstone-bank"
          >
            Browse the bank
          </Link>{" "}
          — {bank.entries.length} briefs with the numbers that decide whether
          you can take one on — then come back and put your name against it.
        </li>
        <li>
          <b className="text-foreground font-medium">Or suggest your own idea.</b>{" "}
          It has to be relevant to technical AI governance and aimed at an
          AI-safety-related theme.
        </li>
      </ul>

      {tableMissing ? (
        <div className="border-muted-foreground/40 mt-8 rounded-lg border border-dashed p-5">
          <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
            not ready yet
          </span>
          <p className="mt-2 text-sm leading-relaxed">
            The sign-up table does not exist in this environment, so nothing
            can be recorded yet. It needs{" "}
            <code className="text-xs">
              db/migrations/20260805213000_verification_capstone_signups.sql
            </code>{" "}
            applied with the admin role.
          </p>
        </div>
      ) : !user ? (
        <div className="border-border/80 mt-8 space-y-3 rounded-lg border p-5">
          <p className="text-sm leading-relaxed">
            The sign-up sheet is tied to an account, so your capstone and your
            progress are the same person.
          </p>
          <Button asChild size="sm">
            <a href="/login?next=/verification/capstone-signup">Sign in to sign up</a>
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <SignupForm
            themes={themes}
            initialBrief={signedUp ? (row?.briefSlug ?? "") : ""}
            initialProposal={signedUp ? (row?.proposal ?? "") : ""}
            state={signedUp ? "submitted" : "new"}
          />
        </div>
      )}

      <p className="text-muted-foreground mt-10 text-sm">
        <Link className="underline underline-offset-4" href="/verification/landing">
          Back to the course
        </Link>
      </p>
    </main>
  );
}
