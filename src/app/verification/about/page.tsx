import type { Metadata } from "next";

import { verificationModules } from "@/content/verification/curriculum";
import { memoSlots } from "@/content/verification/memos";

/* About the Verification track — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged, and it carries no script of
 * its own — it is prose, and the chrome, the theme and the notebook belong to
 * the app now. */

export const metadata: Metadata = { title: "About the Verification track" };

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <main id="main">
        <div className="wrap">

          <div className="page-head">
            <h1>About the Verification track</h1>
            <p className="lede">
              An intermediate course on international AI verification: the technical,
              institutional, and legal mechanisms that make agreements observable and
              enforceable — and help distinguish compliance from violation.
            </p>

            {/* Counted from the sources, never typed in: the written-output
                figure was three memos stale the first time a slot moved, and a
                page that states the course's own size has to be right about it.
                Skills stay a literal — the rungs live in the static
                data/skills.js, which is outside the app's imports. */}
            <dl className="facts">
              <div><dt>Modules</dt><dd>{verificationModules.length}</dd></div>
              <div><dt>Skills</dt><dd>27</dd></div>
              <div><dt>Written outputs</dt><dd>{memoSlots.length}</dd></div>
              <div><dt>Level</dt><dd>Intermediate</dd></div>
            </dl>
          </div>

          <div className="prose">

            <h2>What it covers</h2>
            <p>
              The course runs from the question of why verification matters at all to
              the design of a regime that has to work without trust. Modules 0 and 1
              are the conceptual on-ramp: why anyone should care, and who holds the
              decisions and the evidence. Module 2 covers the verification
              infrastructure itself across the hardware, cloud, intelligence and
              human layers. Module 3 red-teams that whole stack through evasion
              scenarios. Module 4 asks how to layer imperfect mechanisms into
              something realistic, and ends in the capstone.
            </p>

            <h2>Who it is for</h2>
            <p>
              It is pitched at an intermediate level. It assumes you are willing to
              read a policy document closely and argue with it, and it does not
              assume you can build the mechanisms it describes. The material is as
              much institutional and legal as it is technical.
            </p>

            <h2>How it is organised</h2>
            <p>
              Around a graph, not a reading list. Each unit feeds specific skills,
              and the later ones only stand up once the earlier ones do — the
              constellation on the <a href="/verification/landing">front page</a> is that
              graph, and the course objectives are read straight off it so the two
              cannot drift apart.
            </p>
            <p>
              Most modules end in one short written output — a memo, brief, critique
              or design note — applied to a concrete verification problem and put
              through peer review. The <a href="/verification/memo-desk">memo desk</a> is
              where you draft them, brief beside the page.
            </p>

            <h2>Taking it</h2>
            <ul>
              <li>
                <b>Enrolled.</b> Signing in saves your progress and lets you join a
                cohort.
              </li>
              <li>
                <b>On your own.</b> No account, nothing saved, same material.
              </li>
            </ul>

            {/* XLab's own copy, reproduced as supplied. The only edit is the
                link on the lab's name, to the same URL the footer carries. */}
            <h2>About UChicago XLab</h2>
            <p>
              Founded in 2022 at the University of Chicago, the{" "}
              <a href="https://xrisk.uchicago.edu">
                Existential Risk Laboratory (XLab)
              </a>{" "}
              is an interdisciplinary research organization dedicated to the
              analysis and mitigation of risks that threaten human
              civilization&apos;s long-term survival. We focus on critically
              under-addressed areas: AI safety, biorisk, nuclear security, and
              extreme climate change, recognizing the urgent need for more
              expertise and innovative thinking in these fields. Since these
              issues don&apos;t fit neatly into pre-existing academic silos,
              XLab was created to serve as a coordinating locus for work on
              existential and global catastrophic risk on the UChicago campus,
              bringing together scholars from across the academy. We support
              direct research and provide a venue for students to build
              expertise in our focus areas.
            </p>
            <p>
              The legacy of existential risk work at the University of Chicago
              dates back to Enrico Fermi and the world&apos;s first nuclear
              chain reaction under the historic Stagg Field. The Bulletin of the
              Atomic Scientists, the creator of the well-known Doomsday Clock,
              was originally founded in 1945 by UChicago scientists from the
              Manhattan Project who were concerned about the emerging dangers.
              XLab was founded in the same spirit of concern and commitment to
              mitigating the great threats of our time.
            </p>

          </div>
        </div>
      </main>
    </>
  );
}
