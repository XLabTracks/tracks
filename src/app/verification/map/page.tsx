import type { Metadata } from "next";
import { getCurrentUserOrSignedOut } from "@/lib/auth";
import { getTrackCompletionSet } from "@/lib/progress";
import { completedVerificationUnits } from "@/lib/verification/completion-stats";
import { SkillMapHost } from "@/components/verification/skill-map-host";

/* Skill map — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The figure is the home page's skill web — the
 * same markup, drawn by the same skill-web.js — and map.js adds progress,
 * unit links and the panel's chips on top. The notebook carries the same
 * map in its Skill Map view, which is where the header used to send people;
 * this page stays as the full-width edition and the deep-link target
 * (?skill=, ?unit= from the completion toast). */

export const metadata: Metadata = { title: "Skill Map" };

/* The rings are filled from the learner's LessonProgress rows, mapped to the
 * outline's unit ids. The figure's own runtime keeps a device store of
 * completed units from the days of the static module player; nothing writes
 * it any more, so left to itself the map draws every ring empty. Guarded like
 * every other progress read on a reading surface: a failed query costs the
 * rings, not the page. */
async function completedUnits(): Promise<string[]> {
  const user = await getCurrentUserOrSignedOut();
  if (!user) return [];
  const completed = await getTrackCompletionSet(user.id, "verification").catch(
    () => new Set<string>(),
  );
  return [...completedVerificationUnits(completed)];
}

export default async function Page() {
  const units = await completedUnits();
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/skill-web.css" precedence="high" />
      <link rel="stylesheet" href="/verification/map.css" precedence="high" />
      <main className="page page-wide">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/verification/landing">Home</a> / Skill Map</nav>

        <header className="map-head">
          <div>
            <h1>Skill Map</h1>
            <p className="sub">Here is the skill map with your current progress. Click each
              skill to read its description, the relevant parts of the curriculum, and its
              dependencies. The ring around each skill fills as you complete the units
              that feed it.</p>
          </div>
        </header>

        <SkillMapHost units={units} />
      </main>
    </>
  );
}
