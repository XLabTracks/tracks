import type { Metadata } from "next";
import Link from "next/link";
import { CourseOverview } from "@/components/verification/course-overview";
import { LegacyScripts } from "@/components/verification/legacy-scripts";
import { NotebookLink } from "@/components/verification/notebook-link";

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
              An intermediate course on AI verification: the technical,
              institutional, and legal mechanisms that make agreements mutually
              trustable and enforceable.
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
            decide.

            THE COPY IS THE AUTHOR'S AND IS NOT TO BE EDITED — not split, not
            shortened, not lifted into a button label. It was once broken into
            a lead and a remainder with the middle sentence dropped and its
            link turned into a CTA; the words below are the original and stay
            one paragraph with the form linked inside the sentence that asks
            for it. */}
        <section className="alpha-note" data-reveal>
          <div className="wrap">
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
            <h2 data-reveal>The Skill Map</h2>
            <p className="intro" data-reveal>
              From securitization to feasibility judgments, this course builds
              on interconnected skills, not an arbitrary linear progression.
              Each module cumulatively builds on the skills learned previously.
              Your skill map is always accessible as{" "}
              <NotebookLink page="skills">
                the last page in your notebook
              </NotebookLink>
              .
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
                  <span className="on-hover">
                    click a star or a key row to pin it
                  </span>
                  <span className="on-touch">
                    tap a star or a key row to pin it
                  </span>
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
