import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  APPLICATION_QUESTIONS,
  OPEN_COHORT,
  STATUS_WORD,
} from "@/lib/verification/application";
import { isReviewer } from "@/lib/verification/reviewers";

import { DecisionRow } from "./decision-row";
import { isMissingTableError } from "@/lib/db-missing-table";

/* The gate runs here as well as in the page. A static `metadata` export
   flushes the document head before the component can throw, which commits a
   200 and puts this page's title in front of someone who will only ever see
   the 404 body — deciding inside generateMetadata decides before anything is
   sent, so an outsider gets a real 404 and learns nothing. getCurrentUser is
   cache()-wrapped per request, so asking twice costs one query. */
export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();
  if (!isReviewer(user?.email)) notFound();
  return { title: "Applications — Verification" };
}

/**
 * The reviewer's queue for the open cohort.
 *
 * 404, not 403, for everyone else: a page that says "forbidden" tells an
 * outsider the queue exists and where. Who is a reviewer is
 * VERIFICATION_REVIEWERS, which fails closed when unset — including for the
 * person who deployed it.
 *
 * The list is deliberately one page of every application rather than a
 * paginated feed: a cohort is tens of people, and a reviewer comparing them
 * needs them side by side.
 */
export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  if (!isReviewer(user?.email)) notFound();

  let rows;
  try {
    rows = await getDb().verificationApplication.findMany({
      where: { cohort: OPEN_COHORT.id },
      orderBy: [{ status: "asc" }, { submittedAt: "asc" }],
      select: {
        id: true,
        status: true,
        note: true,
        answers: true,
        submittedAt: true,
        decidedAt: true,
        user: { select: { name: true, email: true } },
        decidedBy: { select: { name: true, email: true } },
      },
    });
  } catch (error) {
    // Only a missing relation means the migration is owed; anything else
    // is a live database failing, and must not be reported as one.
    if (!isMissingTableError(error)) {
      console.error("applications queue read failed", error);
      throw error;
    }
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-6 text-sm">
          The applications table does not exist in this environment yet. Apply{" "}
          <code className="text-xs">
            db/migrations/20260805150000_verification_applications.sql
          </code>{" "}
          with the admin role.
        </p>
      </main>
    );
  }

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {OPEN_COHORT.label} · {rows.length}{" "}
        {rows.length === 1 ? "application" : "applications"}
        {Object.keys(counts).length
          ? " · " +
            Object.entries(counts)
              .map(([s, n]) => `${n} ${STATUS_WORD[s] ?? s}`)
              .join(", ")
          : ""}
      </p>

      {rows.length === 0 ? (
        <p className="text-muted-foreground mt-8 text-sm">
          Nobody has applied to this cohort yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="border-border/80 rounded-lg border p-5">
              <DecisionRow
                id={r.id}
                status={r.status}
                note={r.note ?? ""}
                name={r.user.name}
                email={r.user.email}
                submittedAt={r.submittedAt.toISOString()}
                decidedAt={r.decidedAt?.toISOString() ?? null}
                decidedBy={r.decidedBy?.name ?? r.decidedBy?.email ?? null}
                answers={Object.fromEntries(
                  APPLICATION_QUESTIONS.map((q) => [
                    q.prompt,
                    ((r.answers ?? {}) as Record<string, string>)[q.id] ?? "",
                  ]),
                )}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
