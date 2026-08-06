import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  APPLICATION_QUESTIONS,
  OPEN_COHORT,
  STATUS_LINE,
  STATUS_WORD,
} from "@/lib/verification/application";

import { ApplicationForm } from "./application-form";

export const metadata: Metadata = { title: "Enroll — Verification" };

/**
 * The application to join a facilitated Verification cohort.
 *
 * Signed out this is a page, not a redirect: someone deciding whether to apply
 * should be able to read what applying involves before being asked to sign in.
 * getCurrentUser, not requireUser — requireUser refreshes the session inside
 * the render and a page render may not write cookies, which surfaces as a 500
 * rather than a prompt.
 *
 * Trap: this route is /verification/enroll while the course's own pages are
 * static files under public/verification/. Nothing exists at that path, so the
 * app route serves it — adding public/verification/enroll.html would silently
 * take the URL away from this page.
 */
export default async function EnrollPage() {
  const user = await getCurrentUser();

  let status: string | null = null;
  let answers: Record<string, string> = {};
  let tableMissing = false;

  if (user) {
    try {
      const row = await getDb().verificationApplication.findUnique({
        where: { userId_cohort: { userId: user.id, cohort: OPEN_COHORT.id } },
        select: { status: true, answers: true },
      });
      if (row) {
        status = row.status;
        answers = (row.answers ?? {}) as Record<string, string>;
      }
    } catch {
      // The migration has not been applied in this environment. Say so, rather
      // than rendering a form whose submit fails with nothing explaining why.
      tableMissing = true;
    }
  }

  const open = status === null || status === "withdrawn" || status === "submitted";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Enroll</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {OPEN_COHORT.label}
        {OPEN_COHORT.dates ? ` · ${OPEN_COHORT.dates}` : " · dates not set yet"}
      </p>

      <p className="text-muted-foreground mt-6 leading-relaxed">
        A facilitated cohort runs the course on a schedule, with a group and a
        facilitator reading your written work. The course itself is open to
        anyone — you can work through every unit on your own without applying,
        and applying does not lock any of it.
      </p>

      {tableMissing ? (
        <Notice kind="stub" label="not ready yet">
          The applications table does not exist in this environment, so nothing
          can be submitted yet. It needs{" "}
          <code className="text-xs">
            db/migrations/20260805150000_verification_applications.sql
          </code>{" "}
          applied with the admin role.
        </Notice>
      ) : !user ? (
        <div className="border-border/80 mt-8 space-y-3 rounded-lg border p-5">
          <p className="text-sm leading-relaxed">
            Applying is tied to an account, so your application and your
            progress are the same person.
          </p>
          <Button asChild size="sm">
            <a href="/login?next=/verification/enroll">Sign in to apply</a>
          </Button>
        </div>
      ) : status && status !== "withdrawn" ? (
        <Notice label={`Application ${STATUS_WORD[status] ?? status}`}>
          {STATUS_LINE[status]}
        </Notice>
      ) : null}

      {user && !tableMissing && open && (
        <div className="mt-8">
          {APPLICATION_QUESTIONS.length === 0 && (
            <Notice kind="stub" label="not drafted yet">
              The application questions are still being written. Applying now
              records that you want a place, under the name and address on your
              account — nothing else is asked, and nobody is scored on an empty
              form.
            </Notice>
          )}
          <ApplicationForm
            questions={APPLICATION_QUESTIONS}
            initial={answers}
            name={user.name ?? ""}
            email={user.email}
            state={status === "submitted" ? "submitted" : "new"}
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

/** A bordered aside. `stub` is the dashed one: it says something is missing. */
function Notice({
  kind = "note",
  label,
  children,
}: {
  kind?: "note" | "stub";
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "mt-8 rounded-lg p-5 " +
        (kind === "stub"
          ? "border-muted-foreground/40 border border-dashed"
          : "border-border/80 border")
      }
    >
      <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <p className="mt-2 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
