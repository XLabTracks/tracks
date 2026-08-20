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

/* Contribute links. Both are Google Forms (or whatever the course owner
   supplies) — not repo issues: the people this card is for are learners and
   facilitators, not contributors with a GitHub account.

   Null until a URL exists, and a null row renders as plain text rather than
   as a dead link — the same rule the footer's chrome links follow. Filling
   one in is this one line; do not invent a destination to make the card look
   finished. */
const FORMS: { propose: string | null; correction: string | null } = {
  propose: null,
  correction: null,
};

const SCRIPTS = ["data/course.js", "data/skills.js", "data/capstone-bank.js", "data/chrome.js", "platform.js", "capstone-bank.js"];

/** One contribute row. With a URL it is a link; without one it is the same
 *  row rendered as plain text, dimmed, and not focusable — a control that
 *  cannot do anything must not look like one that can. */
function ContribRow({
  href,
  label,
  glyph,
}: {
  href: string | null;
  label: string;
  glyph: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="g" aria-hidden="true">
        {glyph}
      </span>
      {label}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener">
      {inner}
    </a>
  ) : (
    <span className="pending">{inner}</span>
  );
}

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

        {/* Contributing is a form the course owner hosts, not a repo issue —
            see FORMS above. A row with no URL yet is plain text carrying the
            reason, never a link that goes nowhere. */}
        <section className="contribute" aria-labelledby="contribHead">
          <h2 id="contribHead">Contribute to this page</h2>
          <ul>
            <li>
              <ContribRow
                href={FORMS.propose}
                label="Propose a capstone"
                glyph={<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>}
              />
            </li>
            <li>
              <ContribRow
                href={FORMS.correction}
                label="Suggest a correction"
                glyph={
                  <svg viewBox="0 0 24 24">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                }
              />
            </li>
          </ul>
          {FORMS.propose || FORMS.correction ? null : (
            <p className="out">
              The forms are not set up yet — these open once the course supplies
              them.
            </p>
          )}
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
