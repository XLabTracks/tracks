import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FacilitatorGuide } from "@/components/verification/facilitator-guide";
import { getCurrentUser } from "@/lib/auth";
import { isFacilitator } from "@/lib/classrooms";

export const metadata: Metadata = { title: "Facilitator field guide" };

/**
 * The Facilitator Field Guide — session plans, discussion prompts and the
 * facilitation craft behind the Verification track.
 *
 * Gated to instructors because the plans carry the answers: the take-sorter
 * verdicts, the wargame's secret directives, and the "what this activity is
 * really testing" defenses all read differently to someone about to sit the
 * session. Someone signed in without a classroom gets told how to qualify
 * rather than a 404 — the gate is a role check, not a secret.
 *
 * It lives in the app rather than on the static Verification site because that
 * site never gates: it holds no session, and adding one there would mean a
 * second sign-in.
 */
export default async function FacilitatorPage() {
  // getCurrentUser, not requireUser: requireUser refreshes the session inside
  // the render, and a page render may not write cookies — signed out, that
  // surfaces as a 500 rather than a sign-in prompt.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const allowed = await isFacilitator(user.id);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
      <p className="text-muted-foreground text-sm">Verification</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Facilitator field guide
      </h1>

      {allowed ? (
        <div className="mt-8">
          <FacilitatorGuide />
        </div>
      ) : (
        <div className="border-border/80 mt-8 rounded-lg border p-6">
          <h2 className="font-medium">This one is for people running a cohort</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            The field guide holds session plans with their answer keys, the
            wargame&rsquo;s secret directives, and the reasoning behind each
            activity — material that is worth more to a facilitator than to
            someone about to sit the session. It opens for instructors.
          </p>
          <p className="text-muted-foreground mt-3 text-sm">
            You become an instructor by creating a classroom, which is also how
            you get a join code, a roster and shared grading. If you are running
            a cohort, start there.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/classrooms/new">Create a classroom</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/classrooms">My classrooms</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
