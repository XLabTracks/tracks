import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Team — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * team's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "Team" };

const SCRIPTS = ["data/course.js", "data/skills.js", "data/chrome.js", "platform.js"];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <main id="main">
        <div className="wrap">

          <div className="page-head">
            <h1>Team</h1>
            <p className="lede">
              Who writes the curriculum, builds the interactives, and facilitates
              the cohorts.
            </p>
          </div>

          <div className="prose">

            <ul className="roster">
              {/* Flat, not name+role wrapped in a div: the card is a subgrid, so
                   every row has to be a direct child to sit in a shared track. */}
              <li className="person">
                <span className="mug" aria-hidden="true">MG</span>
                <p className="nm">Marie Veronica Gordi</p>
                <p className="rl">Role not supplied yet</p>
              </li>
              <li className="person">
                <span className="mug" aria-hidden="true">AC</span>
                <p className="nm">Ava Chen</p>
                <p className="rl">Role not supplied yet</p>
              </li>
              <li className="person">
                <span className="mug" aria-hidden="true">PS</span>
                <p className="nm">Purusha Shirvani</p>
                <p className="rl">Role not supplied yet</p>
              </li>
            </ul>

            <h2>Elsewhere</h2>
            <p>
              The work is the other introduction. The
              <a href="/verification/about">about page</a> says what the course covers and how
              it is put together, and the <a href="/verification/memo-desk">memo desk</a> shows
              what it asks people to produce.
            </p>

          </div>
        </div>
      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
