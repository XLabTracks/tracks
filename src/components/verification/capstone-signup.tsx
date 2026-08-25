import bank from "@/content/verification/capstone-bank.json";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { isMissingTableError } from "@/lib/db-missing-table";
import { getDb } from "@/lib/db";

import { SignupForm } from "./capstone-signup-form";

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
      if (isMissingTableError(error)) tableMissing = true;
      else {
        unreachable = true;
        console.error("capstone sign-up read failed", error);
      }
    }
  }

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
      <h2 className="text-base font-semibold tracking-tight">Sign-up sheet</h2>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        Your facilitator reads this sheet — the brief you committed to, or the
        idea you proposed.
      </p>

      {tableMissing ? (
        <div className="border-muted-foreground/40 mt-4 rounded-lg border border-dashed p-4">
          <span className="eyebrow text-muted-foreground block font-medium">
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
          <span className="eyebrow text-muted-foreground block font-medium">
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
