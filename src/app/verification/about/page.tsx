import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* About the Verification track — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * about's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "About the Verification track" };

const SCRIPTS = ["data/course.js", "data/skills.js", "data/chrome.js", "platform.js"];

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
              institutional and legal mechanisms that decide whether a governance
              commitment can be checked at all — and what it takes to tell a kept
              promise from a broken one.
            </p>

            <dl className="facts">
              <div><dt>Modules</dt><dd>5</dd></div>
              <div><dt>Skills</dt><dd>27</dd></div>
              <div><dt>Written outputs</dt><dd>15</dd></div>
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

          </div>
        </div>
      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
