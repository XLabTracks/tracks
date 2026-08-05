import type { Metadata } from "next";
import Link from "next/link";

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
 * Trap: this route is /verification/facilitator beside the course's static
 * assets under public/verification/. Nothing exists at that path, so the app
 * route serves it — putting a file there would silently take the URL.
 */

/** The curriculum, from a facilitator's seat: the same pages a learner works
 *  from, listed in one place. Descriptions restate each page's own copy. */
const CURRICULUM: { label: string; href: string; desc: string }[] = [
  {
    label: "Course structure",
    href: "/verification/track",
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

export default function FacilitatorPage() {
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

      <div className="mt-12">
        <FacilitatorTraining />
      </div>

      <h3 className="mt-12 text-base font-semibold tracking-tight">
        Facilitator Field Guide
      </h3>
      <FacilitatorGuide />

      <p className="text-muted-foreground mt-10 text-sm">
        <Link className="underline underline-offset-4" href="/verification/landing">
          Back to the course
        </Link>
      </p>
    </main>
  );
}
