
export type ChromeLink = {
  label: string;
  href: string | null;
};

export const NAV: ChromeLink[] = [
  { label: "Curriculum", href: "/tracks/verification" },
  { label: "Skill map", href: "map" },
  { label: "For facilitators", href: "facilitator" },
  { label: "Team", href: "team" },
  { label: "About", href: "about" },
];

export const FOOT: ChromeLink[] = [
  { label: "About Us", href: "about" },
  { label: "XLab", href: "https://xrisk.uchicago.edu" },
  { label: "Join Us", href: "enroll" },
  { label: "Support us", href: null },
  { label: "Team", href: "team" },
  { label: "Contact", href: "mailto:xlab-info@uchicago.edu" },
  { label: "Report a bug", href: "https://github.com/XLabTracks/tracks/issues" },
  { label: "Privacy Policy", href: "https://privacy.uchicago.edu/privacy-policy/" },
  { label: "Accessibility", href: "accessibility" },
];

export const COPYRIGHT = "© 2026.";

export function verificationHref(href: string): string {
  if (isExternal(href) || href.startsWith("/") || /^[a-z][a-z+.-]*:/.test(href))
    return href;
  return "/verification/" + href;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
