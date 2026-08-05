import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getClassroom } from "@/lib/classrooms";
import { getDb } from "@/lib/db";
import {
  verificationTaskIds,
  verificationTasksByModule,
  TASK_PREFIX,
} from "@/lib/verification/cohort";

export const metadata: Metadata = { title: "Cohort — Verification" };

/**
 * The facilitator's cabinet for one Verification cohort: who is in it, and
 * every written task they have handed in, by module and then by task.
 *
 * It lives under /verification/ rather than beside the generic classroom page
 * because that is what decides the chrome. AppHeader picks the course header
 * from the pathname alone — it sits in the root layout, above any page that
 * could tell it which track a classroom belongs to — so a cohort page served
 * from /classrooms/ would wear the app's header while every other page of this
 * course wears the course's. The prefix is the whole mechanism.
 *
 * Instructors of this classroom only, and 404 rather than 403 for anyone else:
 * this is other people's written work, and "forbidden" would confirm whose.
 *
 * Only `v-task-*` writing prompts appear. They are the sole Verification work
 * that reaches the database; checks and gap-fills stay in the learner's own
 * browser by design and are not a facilitator's to read.
 */
export default async function CohortPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const classroom = await getClassroom(id);
  if (!classroom || classroom.trackId !== "verification") notFound();

  const me = classroom.memberships.find((m) => m.userId === user.id);
  if (!me || me.role !== "instructor") notFound();

  const members = classroom.memberships.filter((m) => m.role === "student");
  const memberIds = members.map((m) => m.userId);
  const nameOf = new Map(
    classroom.memberships.map((m) => [
      m.userId,
      m.user.name?.trim() || m.user.email,
    ]),
  );

  // One query for the whole cohort rather than one per task: the rows are a
  // handful per learner, and the grouping is cheaper in memory than in round
  // trips.
  const rows = memberIds.length
    ? await getDb().submission.findMany({
        where: {
          userId: { in: memberIds },
          contentId: { in: verificationTaskIds },
        },
        select: {
          userId: true,
          contentId: true,
          status: true,
          responseText: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  // A draft is not a hand-in. It is somebody still writing, and listing it
  // beside submitted work would misreport where the cohort is.
  const submitted = rows.filter(
    (r) => r.status !== "draft" && (r.responseText ?? "").trim().length > 0,
  );
  const byTask = new Map<string, typeof submitted>();
  for (const r of submitted) {
    const list = byTask.get(r.contentId) ?? [];
    list.push(r);
    byTask.set(r.contentId, list);
  }

  const modules = verificationTasksByModule();
  const totalTasks = modules.reduce((n, m) => n + m.tasks.length, 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
      <nav className="text-muted-foreground text-sm" aria-label="Breadcrumb">
        <Link className="underline underline-offset-4" href="/classrooms">
          Classrooms
        </Link>{" "}
        /{" "}
        <Link
          className="underline underline-offset-4"
          href={`/classrooms/${classroom.id}`}
        >
          {classroom.name}
        </Link>{" "}
        / Cohort
      </nav>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        {classroom.name}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        {members.length} {members.length === 1 ? "person" : "people"} ·{" "}
        {submitted.length} of {members.length * totalTasks} task
        {members.length * totalTasks === 1 ? "" : "s"} handed in
      </p>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        Who is in your cohort
      </h2>
      {members.length === 0 ? (
        <p className="text-muted-foreground mt-3 text-sm">
          Nobody has joined yet. The join code is on the{" "}
          <Link
            className="underline underline-offset-4"
            href={`/classrooms/${classroom.id}`}
          >
            classroom page
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {members.map((m) => {
            const done = submitted.filter((r) => r.userId === m.userId).length;
            return (
              <li
                key={m.userId}
                className="border-border flex items-baseline justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <span className="text-sm">{nameOf.get(m.userId)}</span>
                <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                  {done} / {totalTasks}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        Tasks handed in
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Every written task the track sets, by module. Drafts are not listed —
        somebody still writing has not handed anything in.
      </p>

      {modules.map((mod) => (
        <section key={mod.moduleId} className="mt-8">
          <h3 className="text-base font-semibold tracking-tight">
            {mod.moduleTitle}
          </h3>
          <ul className="mt-3 space-y-3">
            {mod.tasks.map((task) => {
              const hands = byTask.get(task.id) ?? [];
              return (
                <li
                  key={task.id}
                  className="border-border rounded-lg border p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{task.title}</p>
                    <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {hands.length} / {members.length}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    <Link
                      className="underline underline-offset-4"
                      href={task.lessonHref}
                    >
                      {task.lessonTitle}
                    </Link>
                  </p>
                  {hands.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {hands.map((r) => (
                        <li key={r.userId} className="text-sm">
                          <Link
                            className="font-medium underline underline-offset-4"
                            href={`/classrooms/${classroom.id}/students/${r.userId}`}
                          >
                            {nameOf.get(r.userId)}
                          </Link>
                          <span className="text-muted-foreground">
                            {" "}
                            — {r.status}
                          </span>
                          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">
                            {(r.responseText ?? "").trim()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {modules.length === 0 && (
        <p className="text-muted-foreground mt-3 text-sm">
          The track sets no written tasks yet — nothing with a{" "}
          <code>{TASK_PREFIX}</code> id is placed in a lesson.
        </p>
      )}
    </main>
  );
}
