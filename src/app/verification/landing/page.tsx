import type { Metadata } from "next";
import Link from "next/link";
import { CourseOverview } from "@/components/verification/course-overview";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Verification — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * landing's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "Verification" };

const SCRIPTS = [
  "data/course.js",
  "data/skills.js",
  "data/chrome.js",
  "platform.js",
  "landing.js",
];

export default function Page() {
  return (
    <>
      <link
        rel="stylesheet"
        href="/verification/platform.css"
        precedence="high"
      />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link
        rel="stylesheet"
        href="/verification/landing.css"
        precedence="high"
      />
      <main id="main">
        <section className="hero">
          <div className="wrap">
            <h1>
              How could the US and China trust an agreement to pause ASI
              development?
            </h1>
            <p className="lede">
              An intermediate course on international AI verification: the
              technical, institutional and legal mechanisms that decide whether
              a governance commitment can be checked at all — and what it takes
              to tell a kept promise from a broken one.
            </p>

            <div className="ways">
              <a className="btn" href="/verification/enroll">
                Enroll
              </a>
              <Link className="btn outline" href="/tracks/verification">
                Start on your own
              </Link>
              <Link className="btn outline" href="/verification/facilitator">
                Become a facilitator
              </Link>
            </div>
          </div>
        </section>

        {/* The six outcomes used to sit here as the short labels the skill map
            keys on. They now open in "By the end of this course" below, in the
            author's own sentences; skills.js keeps the short ones because that
            is what the map's chips are. One set of words per page. */}
        <section className="band filled">
          <div className="wrap">
            <h2>What this course is</h2>
            <p className="intro">
              Four sections, each one a question a prospective learner asks
              before they start. Open whichever you came for.
            </p>
            <CourseOverview />
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <h2>The skills it builds</h2>
            <p className="intro">
              The course is organised around a graph, not a reading list. Each
              unit feeds specific skills, and the later ones only stand up once
              the earlier ones do.
            </p>

            <div className="mod-filters" id="modFilters"></div>

            <div className="constellation">
              <div>
                <div className="sky" id="sky"></div>
                <div className="sky-legend">
                  <span>number inside a star — find it in the key below</span>
                  <span>solid beam — fed from inside the module</span>
                  <span>dashed line — fed from another module</span>
                  <span>
                    arm from the hub — the module&apos;s own shape, not a
                    dependency
                  </span>
                  <span>click a star or a key row to pin it</span>
                </div>
                <ol className="sky-key" id="skyKey"></ol>
              </div>
              <div className="sky-panel" id="skyPanel"></div>
            </div>

            <p className="after-sky">
              <a className="btn outline" href="/verification/map">
                Open the skill map
              </a>
            </p>
          </div>
        </section>
      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
