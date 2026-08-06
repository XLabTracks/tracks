/* The Verification site's header and footer links — the canonical copy.
 *
 * Two surfaces render this chrome: the static site under public/verification/
 * (plain HTML/CSS/JS) and the course pages the Next app renders under
 * /tracks/verification. They must agree, so neither owns the list: this file
 * does, and `npm run verification:chrome` generates
 * public/verification/data/chrome.js from it for the static side to read.
 *
 * Trap: edit this file, then run the generator. `-- --check` fails when the
 * two have drifted, the same guard the capstone bank uses. Never hand-edit
 * the generated file.
 *
 * Trap: hrefs here are bare route names, and `verificationHref` prefixes them
 * with /verification/. Keeping them bare is what lets the generated copy and
 * the React chrome share one list instead of two with different roots.
 */

export type ChromeLink = {
  label: string;
  /** A route name under /verification/, or an absolute URL for an off-site
   *  destination. Null means nobody has supplied one yet — it renders as
   *  plain text, never as a dead link. */
  href: string | null;
};

/** The top strip: the learner's two standing destinations — the course and
 *  their skill map — then the facilitator's entry point and the org pages.
 *  Everything else the course owns is reached from the landing body and from
 *  page to page, because a long row has to scroll on a laptop. */
export const NAV: ChromeLink[] = [
  /* Two links, not one. A single "Curriculum and facilitation materials" row
     promised the course and landed on a page whose own heading is "Become a
     facilitator" — the curriculum was a section inside it. The course is what
     most visitors are after, so it gets its own row straight to the track.

     Absolute, and pointing into the app: the course structure is the app's
     track page, which is the copy that carries progress, the sidebar and the
     reading. /verification/track is a redirect onto it. */
  { label: "Curriculum", href: "/tracks/verification" },
  { label: "Skill map", href: "map" },
  { label: "For facilitators", href: "facilitator" },
  { label: "Team", href: "team" },
  { label: "About", href: "about" },
];

/** The footer, in the order it reads. */
export const FOOT: ChromeLink[] = [
  { label: "About Us", href: "about" },
  { label: "XLab", href: "https://xrisk.uchicago.edu" },
  { label: "Join Us", href: null },
  { label: "Support us", href: null },
  { label: "Team", href: "team" },
  { label: "Contact", href: null },
  { label: "Report a bug", href: null },
  { label: "Privacy Policy", href: null },
];

export const COPYRIGHT = "© 2026.";

/** Where a chrome link points from inside the Next app. The static pages are
 *  served from /verification/, so a page at /tracks/verification/... cannot
 *  use the bare relative href. Off-site links pass through untouched. */
export function verificationHref(href: string): string {
  // An absolute path is already where it means to go — the course's own pages
  // are named relatively, but a link into the app names its full route.
  if (isExternal(href) || href.startsWith("/")) return href;
  return "/verification/" + href;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
