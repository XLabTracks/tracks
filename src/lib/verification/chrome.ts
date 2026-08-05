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
 * Trap: hrefs here are relative to public/verification/ because that is where
 * the static pages live. The React chrome prefixes them (see verificationHref)
 * rather than keeping a second list with absolute paths.
 */

export type ChromeLink = {
  label: string;
  /** Relative to public/verification/, or an absolute URL for an off-site
   *  destination. Null means nobody has supplied one yet — it renders as
   *  plain text, never as a dead link. */
  href: string | null;
};

/** The top strip. Course destinations are reached from the landing body and
 *  from each other, not from here — seven links made a row that had to
 *  scroll on a laptop. */
export const NAV: ChromeLink[] = [
  { label: "Team", href: "team.html" },
  { label: "About", href: "about.html" },
];

/** The footer, in the order it reads. */
export const FOOT: ChromeLink[] = [
  { label: "About Us", href: "about.html" },
  { label: "XLab", href: "https://xrisk.uchicago.edu" },
  { label: "Join Us", href: null },
  { label: "Support us", href: null },
  { label: "Team", href: "team.html" },
  { label: "Contact", href: null },
  { label: "Report a bug", href: null },
  { label: "Privacy Policy", href: null },
];

export const COPYRIGHT = "© 2026.";

/** Where a chrome link points from inside the Next app. The static pages are
 *  served from /verification/, so a page at /tracks/verification/... cannot
 *  use the bare relative href. Off-site links pass through untouched. */
export function verificationHref(href: string): string {
  return isExternal(href) ? href : "/verification/" + href;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
