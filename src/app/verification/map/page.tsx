import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Skill map — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * map's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "Skill map" };

const SCRIPTS = ["data/course.js", "data/skills.js", "data/chrome.js", "platform.js", "map.js"];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/map.css" precedence="high" />
      <main className="page page-wide">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/verification/landing">Home</a> / Skill map</nav>

        <header className="map-head">
          <div>
            <h1>Skill map</h1>
            <p className="sub">Thirty-one skills, and the units that advance each one.
              Every node is visible from day one; only the filling is earned.</p>
          </div>
          <div className="map-controls">
            <div className="progress-row">
              <span className="meter"><i data-bar></i></span>
              <span className="counter" data-count></span>
            </div>
          </div>
        </header>

        <div className="lo-row" data-los aria-label="Learning objectives"></div>

        <div className="map-body">
          <div className="map-canvas" data-canvas>
            <svg data-edges aria-hidden="true"></svg>
            <div data-bands></div>
          </div>
          <aside className="node-card" data-card aria-live="polite"></aside>
        </div>

      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
