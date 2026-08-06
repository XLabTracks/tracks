import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { loginHref } from "@/lib/login-href";
import { ProfileNameForm } from "@/app/account/profile-name-form";
import { getDb } from "@/lib/db";
import { getTrackProgress } from "@/lib/progress";
import {
  verificationTaskIds,
  verificationTasksByModule,
} from "@/lib/verification/cohort";

export const metadata: Metadata = { title: "Your account — Verification" };

/**
 * The learner's cabinet for the Verification course.
 *
 * One sign-in, one identity, one set of rows — but a cabinet per course. What
 * a learner wants to see here is what they have done in *this* course: how far
 * through it they are, which written tasks they have handed in and which are
 * still drafts, and which cohort they are in. A Control learner will want the
 * same shape over entirely different work, which is why this is a page under
 * /verification/ rather than a track filter bolted onto /account.
 *
 * The split is not cosmetic either: living under /verification/ is what gives
 * it the course's own header, footer and three themes, because AppHeader picks
 * the chrome from the pathname. A cabinet served from /account could only ever
 * wear the app's.
 *
 * Identity is still one thing. The name form and the email block below are
 * the same component and the same server action as /account's, so there is
 * one form changing one field — this page is a second door to it, not a
 * second copy, and it has to be here because on course routes the account
 * menu's only entry is this cabinet.
 */
export default async function VerificationAccountPage() {
  // getCurrentUser, not requireUser: requireUser refreshes the session inside
  // the render and a page render may not write cookies — signed out, that is a
  // 500 rather than a sign-in prompt.
  const user = await getCurrentUser();
  if (!user) redirect(loginHref("/verification/account"));

  const progress = await getTrackProgress(user.id, "verification");

  let rows: {
    contentId: string;
    status: string;
    updatedAt: Date;
    responseText: string | null;
  }[] = [];
  let cohorts: { id: string; name: string }[] = [];
  try {
    const db = getDb();
    rows = await db.submission.findMany({
      where: { userId: user.id, contentId: { in: verificationTaskIds } },
      select: {
        contentId: true,
        status: true,
        updatedAt: true,
        responseText: true,
      },
    });
    const memberships = await db.classroomMembership.findMany({
      where: { userId: user.id, classroom: { trackId: "verification" } },
      select: { classroom: { select: { id: true, name: true } } },
    });
    cohorts = memberships.map((m) => m.classroom);
  } catch {
    // The page is worth showing without the database — progress and the task
    // list still tell a learner where they are.
  }

  const byId = new Map(rows.map((r) => [r.contentId, r]));
  const written = rows.filter((r) => (r.responseText ?? "").trim().length > 0);
  const handedIn = written.filter((r) => r.status !== "draft");
  const drafts = written.filter((r) => r.status === "draft");
  const modules = verificationTasksByModule();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Your name and email — the same everywhere you sign in — and everything
        you have done in the Verification course.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Name and email</h2>
        <div className="mt-4">
          <ProfileNameForm initialName={user.name ?? ""} />
        </div>
        <div className="mt-6 space-y-1">
          <h3 className="text-sm font-semibold tracking-tight">Email</h3>
          <p className="text-sm">{user.email}</p>
          <p className="text-muted-foreground text-sm">
            This is how you sign in, and it is managed by your identity
            provider rather than here. To change it, sign in with the address
            you want to use — progress follows the account, not the browser.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Where you are</h2>
        <p className="mt-2 text-sm">
          {progress.completed} of {progress.total} items complete.
        </p>
        <p className="mt-3 text-sm">
          <Link
            className="underline underline-offset-4"
            href="/tracks/verification"
          >
            Go to the course
          </Link>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Your cohort</h2>
        {cohorts.length === 0 ? (
          <p className="text-muted-foreground mt-2 text-sm">
            You are not in a cohort. A facilitator&apos;s join code adds you to
            one; the course works the same without it.
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {cohorts.map((c) => (
              <li key={c.id} className="text-sm">
                <Link
                  className="underline underline-offset-4"
                  href={`/classrooms/${c.id}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Your writing</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {handedIn.length} handed in, {drafts.length} still a draft, of{" "}
          {verificationTaskIds.length} written tasks. A draft is yours alone
          until you submit it.
        </p>

        {modules.map((mod) => (
          <div key={mod.moduleId} className="mt-6">
            <h3 className="text-sm font-semibold tracking-tight">
              {mod.moduleTitle}
            </h3>
            <ul className="mt-2 space-y-1">
              {mod.tasks.map((task) => {
                const row = byId.get(task.id);
                const state =
                  !row || !(row.responseText ?? "").trim()
                    ? "not started"
                    : row.status === "draft"
                      ? "draft"
                      : row.status;
                return (
                  <li
                    key={task.id}
                    className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                  >
                    <Link
                      className="underline underline-offset-4"
                      href={task.lessonHref}
                    >
                      {task.title}
                    </Link>
                    <span className="text-muted-foreground font-mono text-xs">
                      {state}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          Your own writing surfaces
        </h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <Link
              className="underline underline-offset-4"
              href="/verification/memo-desk"
            >
              Memo desk
            </Link>{" "}
            <span className="text-muted-foreground">
              — the written outputs, drafted beside their briefs.
            </span>
          </li>
          <li>
            <Link
              className="underline underline-offset-4"
              href="/tracks/verification"
            >
              Course structure
            </Link>{" "}
            <span className="text-muted-foreground">
              — the modules and units, in reading order.
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
