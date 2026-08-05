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
            Every capstone idea in the bank, with the numbers that decide
            whether you can take it on: how many people, how many hours, over how
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
                <option value="theme">By theme</option>
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
          <b>What is in here.</b> Every capstone idea from the program, grouped by
          theme. The Verification and Program-wide briefs name units this course
          teaches. The Technical Governance and AI Governance Policy themes are
          additional ideas from the wider program: their briefs assume background
          this course does not teach, so they list no prerequisites here. When you
          have chosen — or would rather propose your own idea — the{" "}
          <a href="/verification/capstone-signup">sign-up sheet</a> is where you
          put your name against it.
        </p>

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
