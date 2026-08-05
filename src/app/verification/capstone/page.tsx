import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Capstone workspace — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * capstone's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "Capstone workspace" };

const SCRIPTS = ["data/course.js", "data/skills.js", "data/exercises.js", "data/capstone-bank.js", "data/chrome.js", "platform.js", "capstone.js"];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/capstone.css" precedence="high" />
      <link rel="stylesheet" href="/verification/exercise.css" precedence="high" />
      <main className="page">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/verification/landing">Home</a> / Capstone</nav>

        <header className="ws-head">
          <div>
            <h1>Capstone workspace</h1>
            <p className="sub">Design a minimal verification regime for a three-month
              emergency pause, then break it yourself. Everything you type is saved
              in this browser as you go and exports as Markdown.</p>
            {/* Filled only when the bank sent the learner here with ?brief=<slug>.
                 The sections below are the track's own capstone template; a brief
                 from the bank is the assignment you are answering with it, not a
                 different set of fields. */}
            <div data-brief></div>
          </div>
          <div className="ws-stat card card-flat">
            <span className="eyebrow">Draft</span>
            <div className="progress-row">
              <span className="meter"><i data-bar></i></span>
              <span className="counter" data-count></span>
            </div>
            <p className="ws-words" data-words></p>
            <button className="btn" data-export>Export as Markdown</button>
          </div>
        </header>

        <section className="pinned" data-pinned aria-label="Non-negotiables"></section>

        <div className="sec-eyebrow">The design</div>
        <div className="ws" data-sections></div>

        <div className="sec-eyebrow">Red-team pass</div>
        <p className="rt-lede">Every route from 3.1, against the regime you just wrote.
          For each one, say which layer catches it &mdash; or admit it does not.</p>
        <div className="ws" data-redteam></div>

        <div className="sec-eyebrow">Before you submit</div>
        <ul className="checks" data-checks></ul>

      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
