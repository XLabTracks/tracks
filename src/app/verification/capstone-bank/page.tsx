import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Capstone bank — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * capstone-bank's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "Capstone bank" };

/* Contribute links. The bank's source of truth is verification-capstones/*.md
   in this repo, so both rows open a prefilled issue there — the same public
   repo the footer's "Report a bug" already points at. No labels in the query:
   GitHub rejects a label the opener cannot apply, which would turn a working
   link into an error page.

   The front-matter contract is _README.md beside those files; the proposal
   body asks for what the generator validates, so an issue arrives with the
   fields a brief actually needs. */
const ISSUES = "https://github.com/XLabTracks/tracks/issues/new";

const NEW_BRIEF =
  ISSUES +
  "?title=" +
  encodeURIComponent("Capstone proposal: ") +
  "&body=" +
  encodeURIComponent(
    [
      "**Title**",
      "",
      "**Track** (Verification / Cross-track / Technical Governance / AI Governance Policy)",
      "",
      "**Summary** — one line, what the learner walks out holding",
      "",
      "**Deliverable** — the artifact, and roughly how long it takes",
      "",
      "**Why it exists** — the real decision this would inform",
      "",
      "**Sources** — links a reader can open",
      "",
      "See verification-capstones/_README.md for the full front-matter contract.",
    ].join("\n"),
  );

const CORRECTION =
  ISSUES +
  "?title=" +
  encodeURIComponent("Capstone bank correction: ") +
  "&body=" +
  encodeURIComponent(
    [
      "**Which brief** — the card title, or its slug from the URL",
      "",
      "**What is wrong**",
      "",
      "**What it should say, and how you know**",
    ].join("\n"),
  );

const SCRIPTS = ["data/course.js", "data/skills.js", "data/capstone-bank.js", "data/chrome.js", "platform.js", "capstone-bank.js"];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/capstone-bank.css" precedence="high" />
      <main className="page" id="main">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/verification/landing">Home</a> / Capstone bank</nav>

        <section className="bank-head">
          <h1>Capstone bank</h1>
          <p className="sub">
            The program&rsquo;s whole capstone bank, with the numbers that decide
            whether you can take one on: how many people, how many hours, over how
            long. Open a card for the full brief.
          </p>
        </section>

        <section className="controls" aria-label="Search and filters">
          <div className="control-row">
            <label className="search">
              <span className="vh">Search capstones</span>
              <input type="search" id="search" placeholder="Search title, summary, skills…" autoComplete="off" />
            </label>
            <label className="sort">
              <span className="sort-label">Sort</span>
              <select id="sort">
                <option value="track">By track</option>
                <option value="effort">Fewest hours first</option>
                <option value="team">Smallest team first</option>
                <option value="duration">Shortest first</option>
                <option value="title">A–Z</option>
              </select>
            </label>
            <button className="btn small outline" id="moreBtn" type="button" aria-expanded="false" aria-controls="facetsExtra">More filters</button>
          </div>

          <div className="facets" id="facetsPrimary"></div>
          <div className="facets extra" id="facetsExtra" hidden></div>

          <div className="active-row" id="activeRow" hidden>
            <span className="active-label">Filtering by</span>
            <div className="active-chips" id="activeChips"></div>
            <button className="btn small outline" id="clearBtn" type="button">Clear all</button>
          </div>

          <p className="result-count" id="resultCount" role="status"></p>
        </section>

        <div className="bank-grid" id="grid"></div>

        <p className="empty" id="empty" hidden>
          Nothing matches those filters.
          <button className="link-btn" type="button" data-clear>Clear them</button>
          and start again.
        </p>

        <p className="note bank-note">
          <b>What is in here.</b> The whole program&rsquo;s bank: the Verification
          and cross-track capstones this course prepares you for, and the Technical
          Governance and AI Governance Policy capstones beside them. A governance
          brief marked <i>fits this course</i> can be taken as a Verification
          capstone — its sheet says which module it lands on. The rest keep
          prerequisites naming weeks taught on their own tracks, not here.
        </p>

        {/* The bank is generated from verification-capstones/*.md in a public
            repo, so contributing to it is opening an issue against that repo —
            a real destination, prefilled, rather than a form nobody reads. */}
        <section className="contribute" aria-labelledby="contribHead">
          <h2 id="contribHead">Contribute to this page</h2>
          <ul>
            <li>
              <a href={NEW_BRIEF} target="_blank" rel="noopener">
                <span className="g" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                </span>
                Propose a capstone
              </a>
            </li>
            <li>
              <a href={CORRECTION} target="_blank" rel="noopener">
                <span className="g" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </span>
                Suggest a correction
              </a>
            </li>
          </ul>
          <p className="out">Both open an issue on the course repository.</p>
        </section>

      </main>

      <div className="overlay" id="overlay" hidden>
        <div className="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" tabIndex={-1}>
          <button className="sheet-close" id="sheetClose" type="button" aria-label="Close">&times;</button>
          <div className="sheet-body" id="sheetBody"></div>
        </div>
      </div>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
