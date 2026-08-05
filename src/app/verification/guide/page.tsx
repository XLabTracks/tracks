import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Learner's guide — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * guide's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "Learner's guide" };

const SCRIPTS = ["data/course.js", "data/skills.js", "data/glossary.js", "data/chrome.js", "platform.js", "guide.js"];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/guide.css" precedence="high" />
      <main className="page">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/verification/landing">Home</a> / Guide</nav>

        <header className="guide-head">
          <h1>Learner&apos;s guide</h1>
          <p className="sub">Every term the track defines, and a review prompt for each
            distinction worth keeping. Terms belong to the module that introduces
            them; later modules extend them rather than redefining them.</p>
          <div className="guide-tools">
            <input type="search" data-search placeholder="Filter terms and prompts" aria-label="Filter terms and prompts" />
            <span className="counter" data-hits></span>
          </div>
        </header>

        <div className="guide-body" data-guide></div>

      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
