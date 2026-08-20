import bank from "@/content/verification/capstone-bank.json";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { isMissingTableError } from "@/lib/db-missing-table";
import { getDb } from "@/lib/db";

import { SignupForm } from "./capstone-signup-form";

/**
 * The capstone sign-up sheet: one implementation, two surfaces. Lesson 4.2
 * embeds it in prose (`<CapstoneSignup />` in the MDX map) and the standalone
 * /verification/capstone-signup page mounts the same component, so what a
 * learner signs inside the course and what they sign from the bank's link is
 * the same row.
 *
 * An async server component on purpose — it resolves the user and their
 * existing sign-up before anything crosses to the client, the
 * VerificationExercise pattern. Signed out it renders a sign-in card, not a
 * redirect: the lesson around it must stay readable. A missing table renders
 * the stub that names the migration, because a form whose submit fails with
 * nothing explaining why is worse than no form.
 */
export async function CapstoneSignup() {
  const user = await getCurrentUser();

  let row: { briefSlug: string | null; proposal: string | null; status: string } | null = null;
  let tableMissing = false;
  let unreachable = false;

  if (user) {
    try {
      row = await getDb().verificationCapstoneSignup.findUnique({
        where: { userId: user.id },
        select: { briefSlug: true, proposal: true, status: true },
      });
    } catch (error) {
      // Only "the relation does not exist" means the migration is owed.
      // Anything else is a database that is there and unhappy, and saying
      // "apply the migration" to somebody who already has would send them
      // looking in the wrong place.
      if (isMissingTableError(error)) tableMissing = true;
      else {
        unreachable = true;
        console.error("capstone sign-up read failed", error);
      }
    }
  }

  // The picker's option list: slug and title per track, nothing else — the
  // full briefs are on the bank surfaces, which is where choosing happens.
  const themes: { theme: string; briefs: { slug: string; title: string }[] }[] = [];
  for (const e of [...bank.entries].sort(
    (a, b) => a.track.localeCompare(b.track) || a.title.localeCompare(b.title),
  )) {
    const g = themes.at(-1);
    const brief = { slug: e.slug, title: e.title };
    if (g && g.theme === e.track) g.briefs.push(brief);
    else themes.push({ theme: e.track, briefs: [brief] });
  }

  const signedUp = row !== null && row.status !== "withdrawn";

  return (
    <div className="not-prose border-border bg-card shadow-soft my-6 rounded-xl border p-5">
      <h3 className="text-base font-semibold tracking-tight">Sign-up sheet</h3>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        Your facilitator reads this sheet — the brief you committed to, or the
        idea you proposed.
      </p>

      {tableMissing ? (
        <div className="border-muted-foreground/40 mt-4 rounded-lg border border-dashed p-4">
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
      ) : unreachable ? (
        <div className="border-muted-foreground/40 mt-4 rounded-lg border border-dashed p-4">
          <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
            sheet unavailable
          </span>
          <p className="mt-2 text-sm leading-relaxed">
            The sign-up table is there, but reading it failed just now, so your
            sheet cannot be shown. Nothing you saved is lost — try again in a
            moment. The reason is in the server log.
          </p>
        </div>
      ) : !user ? (
        <div className="border-border/80 mt-4 space-y-3 rounded-lg border p-4">
          <p className="text-sm leading-relaxed">
            The sheet is tied to an account, so your capstone and your progress
            are the same person.
          </p>
          <Button asChild size="sm">
            <a href="/login?next=/verification/capstone-signup">Sign in to sign up</a>
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <SignupForm
            themes={themes}
            initialBrief={signedUp ? (row?.briefSlug ?? "") : ""}
            initialProposal={signedUp ? (row?.proposal ?? "") : ""}
            state={signedUp ? "submitted" : "new"}
          />
        </div>
      )}
    </div>
  );
}
