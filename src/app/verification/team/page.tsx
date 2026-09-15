import type { Metadata } from "next";

import { TeamRoster } from "@/components/verification/team-roster";

/* Team — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The roster itself is TeamRoster, shared with the
 * About page so the two can never list different people. */

export const metadata: Metadata = { title: "Team" };

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <main id="main">
        <div className="wrap">

          <div className="page-head">
            <h1>Team</h1>
          </div>

          <section className="team">
            <TeamRoster />
          </section>

        </div>
      </main>
    </>
  );
}
