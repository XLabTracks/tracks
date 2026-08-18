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
              How can countries trust each other to keep AI governance
              commitments?
            </h1>
            <p className="lede">
              An intermediate course on international AI verification: the
              technical, institutional, and legal mechanisms that make
              agreements observable and enforceable — and help distinguish
              compliance from violation.
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

        {/* Where the course actually is, said before the skills graph rather
            than in a footer: someone deciding whether to start needs it to
            decide. The author's words, verbatim. */}
        <section className="alpha-note" data-reveal>
          <div className="wrap">
            {/* The sign, drawn rather than imported: no icon set ships a
                solid tapered exclamation, and the two shapes are shorter than
                the import would be. It inherits the band's ink, so it is white
                on the red and black on high contrast's inverted ground, and it
                stands to the height of the sentence beside it. aria-hidden —
                the paragraph already says this is an alpha notice. */}
            <svg className="alpha-sign" viewBox="0 0 20 64" aria-hidden>
              <path d="M1 0H19L16.5 44H3.5Z" fill="currentColor" />
              <circle cx="10" cy="55.5" r="8.4" fill="currentColor" />
            </svg>
            <p>
              We’re currently in the alpha testing stage and running a small
              paid cohort to calibrate and improve the course ahead of the
              official launch. The materials are open for anyone to use in the
              meantime. If you do use them, we’d really appreciate it if you
              could fill out{" "}
              <a
                href="https://forms.gle/KkWcHkKh87pygDzw9"
                target="_blank"
                rel="noopener"
              >
                this feedback form
              </a>
              . Your feedback will help us identify issues, calibrate the
              course, and make improvements before launch.
            </p>
          </div>
        </section>

        <section className="band filled">
          <div className="wrap">
            <h2 data-reveal>The skills it builds</h2>
            <p className="intro" data-reveal>
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

        {/* The six outcomes had their own band here as the short labels the
            skill map keys on. They open inside "By the end of this course"
            now, in the author's own sentences; skills.js keeps the short ones
            because that is what the map's chips are. One set of words per
            page. */}
        <section className="band">
          <div className="wrap">
            <h2 data-reveal>What this course is</h2>
            <CourseOverview />
          </div>
        </section>
      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
