import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { isFacilitator } from "@/lib/classrooms";
import {
  TREATY,
  WORKSPACE_TASKS,
  WORKSPACE_TOTAL,
  WORKSPACE_REQUIRED,
} from "@/lib/verification/data/treaty-workspace";

export const metadata: Metadata = { title: "Marking keys" };

/**
 * Every marking key the course holds, on one gated page.
 *
 * It exists because 1.1's workspace has two ways through. A learner working
 * alone opens the key themselves after committing an answer; a learner
 * working with a facilitator never sees it, and the facilitator scores the
 * answers with them in the room. That only works if the facilitator can read
 * the whole key in one place before the session rather than clicking through
 * the exercise pretending to be a student.
 *
 * Gated the same way as the field guide, and for the same stated reason: the
 * material carries answers, not secrets. Someone signed in without a
 * classroom is told how to qualify.
 *
 * The keys are enumerated banks, not model answers — what a strong response
 * contains, one tick per point. Facilitators should say so out loud when
 * scoring: a learner who argued something the bank does not list has not
 * necessarily missed anything, and an item marked "go and see" has no settled
 * answer in the treaty at all, which is the point of asking.
 */
export default async function FacilitatorKeysPage() {
  // getCurrentUser, not requireUser: a page render may not write cookies, and
  // requireUser's session refresh would surface as a 500 rather than a prompt.
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const allowed = await isFacilitator(user.id);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
      <p className="text-muted-foreground text-sm">Verification · facilitators</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Marking keys</h1>

      {!allowed ? (
        <div className="border-border bg-card mt-6 rounded-xl border p-5">
          <p className="text-sm">
            These are the answer banks for the course&apos;s scored exercises, so
            they are open to facilitators — instructors of at least one
            classroom. Create a classroom, or ask to be added to one, and this
            page opens.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/classrooms">Classrooms</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="border-border bg-card mt-6 rounded-xl border p-5">
            <h2 className="text-lg font-semibold">
              1.1 — Anatomy of a (Pause) Agreement
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {TREATY.title} — {TREATY.authors}. {WORKSPACE_TASKS.length} tasks,{" "}
              <strong>Total: {WORKSPACE_TOTAL} points</strong>. The learner works
              the whole treaty; no provisions are pre-selected. Tasks may be
              skipped: the unit completes at {WORKSPACE_REQUIRED} of{" "}
              {WORKSPACE_TASKS.length}.
            </p>
            <p className="text-muted-foreground mt-3 text-sm">
              In the session, learners choose &ldquo;working with a
              facilitator&rdquo; and the key stays closed on their screen. Score
              with them, out loud. Two things worth saying before you start: the
              bank is what a strong answer contains rather than the only answers
              that count, and the grid deliberately omits two functions and
              includes one row that catches text obliging nobody — a learner who
              leaves a cell empty because the treaty settles nothing there has
              answered correctly.
            </p>
          </div>

          {WORKSPACE_TASKS.map((task, n) => (
            <section key={task.id} className="border-border mt-6 rounded-xl border p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold">
                  {n + 1}. {task.title}
                </h3>
                <p className="text-muted-foreground font-mono text-xs">
                  Total: {task.points} points
                </p>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{task.prompt}</p>
              {task.caution && (
                <p className="border-primary/30 text-muted-foreground mt-2 border-l-2 pl-3 text-xs">
                  {task.caution}
                </p>
              )}

              {task.rows && (
                <ol className="mt-3 space-y-1.5">
                  {task.rows.map((r) => (
                    <li key={r.id} className="text-sm">
                      <span className="font-medium">{r.fn}</span> — {r.answer}
                      {r.pointer && (
                        <span className="text-muted-foreground font-mono text-xs">
                          {" "}
                          · {r.pointer}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              )}

              {task.key && (
                <ul className="mt-3 space-y-2">
                  {task.key.map((k, i) => (
                    <li key={i} className="text-sm">
                      <span className="text-muted-foreground font-mono text-xs">
                        {i + 1}.{" "}
                      </span>
                      {k.text}
                      {k.pointer && (
                        <span className="text-muted-foreground font-mono text-xs">
                          {" "}
                          · {k.pointer}
                        </span>
                      )}
                      {k.open && (
                        <span className="text-primary text-xs">
                          {" "}
                          · no settled answer in the text — confirm in the room
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {task.marking && (
                <div className="border-border mt-4 border-t pt-3">
                  <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
                    How to mark it
                  </p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
                    {task.marking.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          <p className="text-muted-foreground mt-8 text-sm">
            Back to the{" "}
            <Link href="/facilitator" className="underline underline-offset-4">
              facilitator field guide
            </Link>
            .
          </p>
        </>
      )}
    </main>
  );
}
