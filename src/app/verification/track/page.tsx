import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* The track — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * track's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "The track" };

const SCRIPTS = ["data/course.js", "data/skills.js", "data/chrome.js", "platform.js", "track.js"];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/track.css" precedence="high" />
      <main className="page">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/verification/landing">Home</a> / Track</nav>

        <header className="track-head">
          <div>
            <h1>Verification</h1>
            <p className="question" data-question></p>
          </div>
          <div className="track-stat card card-flat">
            <span className="eyebrow">Your progress</span>
            <div className="progress-row">
              <span className="meter"><i data-bar></i></span>
              <span className="counter" data-count></span>
            </div>
            <p className="next" data-next></p>
          </div>
        </header>

        <div className="sec-eyebrow">Modules</div>
        <div className="modules" data-modules></div>

        <div className="sec-eyebrow">After the capstone</div>
        <div className="gate card" data-gate></div>

      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
