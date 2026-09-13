import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Skill map — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The figure is the home page's skill web — the
 * same markup, drawn by the same skill-web.js — and map.js adds progress,
 * unit links and the objectives filter on top. */

export const metadata: Metadata = { title: "Skill map" };

const SCRIPTS = [
  "data/course.js",
  "data/skills.js",
  "data/chrome.js",
  "platform.js",
  "skill-web.js",
  "map.js",
];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/skill-web.css" precedence="high" />
      <link rel="stylesheet" href="/verification/map.css" precedence="high" />
      <main className="page page-wide">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/verification/landing">Home</a> / Skill map</nav>

        <header className="map-head">
          <div>
            <h1>Skill map</h1>
            <p className="sub">Thirty-one skills, and the units that advance each one.
              Every star is visible from day one; only the filling is earned.</p>
          </div>
          <div className="map-controls">
            <div className="progress-row">
              <span className="meter"><i data-bar></i></span>
              <span className="counter" data-count></span>
            </div>
          </div>
        </header>

        <div className="lo-row" data-los aria-label="Learning objectives"></div>

        <div className="mod-filters" id="modFilters"></div>

        <div className="constellation">
          <div>
            <div className="sky" id="sky"></div>
            <div className="sky-legend">
              <span>number inside a star — find it in the key below</span>
              <span>ring around a star — how much of it you hold</span>
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
      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
