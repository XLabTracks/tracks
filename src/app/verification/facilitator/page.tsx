import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { isFacilitator } from "@/lib/classrooms";
import { isReviewer } from "@/lib/verification/reviewers";
import { FacilitatorGuide } from "@/components/verification/facilitator-guide";
import { FacilitatorTraining } from "@/components/verification/facilitator-training";

export const metadata: Metadata = { title: "Become a facilitator — Verification" };

/* Becoming a facilitator, and the materials one works from.
 *
 * The landing hero's "Become a facilitator" and the header's "Curriculum and
 * facilitation materials" both land here — one page serves the person deciding
 * whether to facilitate and the facilitator collecting their materials, because
 * the answer to both is the same set of links plus the field guide.
 *
 * The page itself stays public — it is how somebody decides to volunteer —
 * but the training modules and field guide are gated the way /facilitator
 * gates the same material: the plans carry session answer keys and the
 * wargame's directives, which are worth more to a facilitator than to
 * someone about to sit the session. Who qualifies is either gate the app
 * has — a classroom instructor, or the Verification reviewer list
 * (VERIFICATION_REVIEWERS, which fails closed).
 *
 * Trap: this route is /verification/facilitator beside the course's static
 * assets under public/verification/. Nothing exists at that path, so the app
 * route serves it — putting a file there would silently take the URL.
 */

/** The curriculum, from a facilitator's seat: the same pages a learner works
 *  from, listed in one place. Descriptions restate each page's own copy. */
const CURRICULUM: { label: string; href: string; desc: string }[] = [
  {
    label: "Course structure",
    href: "/tracks/verification",
    desc: "The five modules and their units, in reading order.",
  },
  {
    label: "Skill map",
    href: "/verification/map",
    desc: "The skill graph the course is organised around — which units feed which skills.",
  },
  {
    label: "Learner's guide",
    href: "/verification/guide",
    desc: "Every term the track defines, and a review prompt for each distinction worth keeping.",
  },
  {
    label: "Memo desk",
    href: "/verification/memo-desk",
    desc: "The written outputs — a memo, brief, critique or design note per module — drafted beside the page.",
  },
  {
    label: "Capstone bank",
    href: "/verification/capstone-bank",
    desc: "The capstone project briefs the course ends in.",
  },
];

export default async function FacilitatorPage() {
  const user = await getCurrentUser();
  const allowed =
    user !== null && (isReviewer(user.email) || (await isFacilitator(user.id)));

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Become a facilitator</h1>

      <p className="text-muted-foreground mt-6 max-w-2xl leading-relaxed">
        A facilitated cohort runs the course on a schedule, with a group and a
        facilitator leading the sessions and reading the group&apos;s written
        work. Everything a facilitator works from is on this page: the
        curriculum as the learners see it, and the field guide for running the
        sessions themselves.
      </p>

      <div
        id="signup"
        className="border-muted-foreground/40 mt-8 max-w-2xl scroll-mt-24 rounded-lg border border-dashed p-5"
      >
        <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
          not set up yet
        </span>
        <p className="mt-2 text-sm leading-relaxed">
          There is no facilitator application on this site yet — nobody has
          supplied a form or a contact address for volunteering. Until one
          exists, this page carries the materials, not the sign-up.
        </p>
      </div>

      <h2 id="materials" className="mt-12 text-lg font-semibold tracking-tight">
        Curriculum and facilitation materials
      </h2>

      <ul className="mt-4 max-w-2xl space-y-3">
        {CURRICULUM.map((c) => (
          <li key={c.href} className="text-sm leading-relaxed">
            <Link
              className="font-medium underline underline-offset-4"
              href={c.href}
            >
              {c.label}
            </Link>{" "}
            <span className="text-muted-foreground">— {c.desc}</span>
          </li>
        ))}
      </ul>

      {allowed ? (
        <>
          <div className="mt-12">
            <FacilitatorTraining />
          </div>

          <h3 className="mt-12 text-base font-semibold tracking-tight">
            Facilitator Field Guide
          </h3>
          <FacilitatorGuide />
        </>
      ) : (
        <div className="border-muted-foreground/40 mt-12 max-w-2xl rounded-lg border border-dashed p-5">
          <h3 className="text-base font-semibold tracking-tight">
            Training and the Field Guide open for facilitators
          </h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            The five training sessions and the field guide hold session plans
            with their answer keys and the reasoning behind each activity —
            material that is worth more to a facilitator than to someone about
            to sit the sessions. They open for classroom instructors and for
            the course&apos;s reviewer list; if you are about to run a cohort
            and see this instead of the materials, ask the course team to add
            you.
          </p>
        </div>
      )}

      <h2 className="mt-12 text-lg font-semibold tracking-tight">
        Running a cohort
      </h2>
      <ul className="mt-4 max-w-2xl space-y-3">
        <li className="text-sm leading-relaxed">
          <Link
            className="font-medium underline underline-offset-4"
            href="/verification/capstone-signups"
          >
            Capstone sign-ups
          </Link>{" "}
          <span className="text-muted-foreground">
            — who committed to which brief, and every idea learners proposed
            themselves.
          </span>
        </li>
        <li className="text-sm leading-relaxed">
          <Link
            className="font-medium underline underline-offset-4"
            href="/verification/applications"
          >
            Cohort applications
          </Link>{" "}
          <span className="text-muted-foreground">
            — the queue of people asking to join the next facilitated cohort.
          </span>
        </li>
      </ul>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
        Both pages are limited to the course&apos;s reviewer list and show a 404
        to anyone else — being signed in is not enough.
      </p>

      <p className="text-muted-foreground mt-10 text-sm">
        <Link className="underline underline-offset-4" href="/verification/landing">
          Back to the course
        </Link>
      </p>
    </main>
  );
}
