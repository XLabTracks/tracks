import type { Metadata } from "next";
import { notFound } from "next/navigation";

import bank from "@/content/verification/capstone-bank.json";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isReviewer } from "@/lib/verification/reviewers";
import { isMissingTableError } from "@/lib/db-missing-table";

/* The gate runs here as well as in the page: a static `metadata` export
   flushes the document head before the component can throw, which commits a
   200 and puts this page's title in front of someone who will only ever see
   the 404 body. getCurrentUser is cache()-wrapped, so asking twice costs one
   query. */
export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();
  if (!isReviewer(user?.email)) notFound();
  return { title: "Capstone sign-ups — Verification" };
}

/**
 * The facilitator's copy of the capstone sign-up sheet: who committed to
 * which brief, and every idea learners proposed themselves.
 *
 * 404, not 403, for everyone else — a page that says "forbidden" tells an
 * outsider the sheet exists and where. Who may read it is
 * VERIFICATION_REVIEWERS, the same fails-closed list that gates the
 * applications queue: there is no separate facilitator identity in the app
 * yet, and a second variable meaning the same people would drift from the
 * first.
 *
 * One page, no pagination: a cohort is tens of people, and a facilitator
 * matching learners to briefs needs the whole sheet side by side.
 */
export default async function CapstoneSignupsPage() {
  const user = await getCurrentUser();
  if (!isReviewer(user?.email)) notFound();

  let rows;
  try {
    rows = await getDb().verificationCapstoneSignup.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        briefSlug: true,
        proposal: true,
        status: true,
        updatedAt: true,
        user: { select: { name: true, email: true } },
      },
    });
  } catch (error) {
    // Only a missing relation means the migration is owed; anything else
    // is a live database failing, and must not be reported as one.
    if (!isMissingTableError(error)) {
      console.error("capstone sign-up sheet read failed", error);
      throw error;
    }
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Capstone sign-ups</h1>
        <p className="text-muted-foreground mt-6 text-sm">
          The sign-up table does not exist in this environment yet. Apply{" "}
          <code className="text-xs">
            db/migrations/20260805213000_verification_capstone_signups.sql
          </code>{" "}
          with the admin role.
        </p>
      </main>
    );
  }

  const titleOf = new Map(bank.entries.map((e) => [e.slug, e.title]));
  const active = rows.filter((r) => r.status !== "withdrawn");
  const withdrawn = rows.length - active.length;
  const proposals = active.filter((r) => r.proposal).length;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Capstone sign-ups</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {active.length} on the sheet · {proposals} proposed their own idea
        {withdrawn ? ` · ${withdrawn} withdrawn` : ""}
      </p>

      {rows.length === 0 ? (
        <p className="text-muted-foreground mt-8 text-sm">
          Nobody has signed up yet. The sheet fills from{" "}
          <code className="text-xs">/verification/capstone-signup</code>.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((r) => (
            <li
              key={r.id}
              className={
                "rounded-lg border p-5 " +
                (r.status === "withdrawn"
                  ? "border-border/60 opacity-60"
                  : "border-border/80")
              }
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium">{r.user.name || r.user.email}</span>
                <span className="text-muted-foreground text-xs">{r.user.email}</span>
                {r.status === "withdrawn" ? (
                  <span className="eyebrow text-muted-foreground">
                    withdrawn
                  </span>
                ) : null}
                <span className="text-muted-foreground ml-auto text-xs">
                  {r.updatedAt.toISOString().slice(0, 10)}
                </span>
              </div>

              {r.briefSlug ? (
                <p className="mt-3 text-sm leading-relaxed">
                  <span className="text-muted-foreground">From the bank: </span>
                  <a
                    className="underline underline-offset-4"
                    href={`/verification/capstone-bank#${r.briefSlug}`}
                  >
                    {titleOf.get(r.briefSlug) ?? r.briefSlug}
                  </a>
                </p>
              ) : null}

              {r.proposal ? (
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Proposed idea:</span>
                  <p className="mt-1 leading-relaxed whitespace-pre-wrap">{r.proposal}</p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
