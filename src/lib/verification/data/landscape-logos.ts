/**
 * Org marks for the Verification Landscape grid. Each landscape effort names an
 * organization in its title; this maps the ones with a recognizable mark to a
 * square brand icon downloaded from the org's own site (or Wikimedia Commons),
 * used nominatively, under public/verification/logos/icons/.
 *
 * Square icons, not wordmarks: they sit as small logos inside the heat cells,
 * so a cell shows who works there at a glance. Orgs with no clean square mark
 * (CSET, FlexHEG, the International Network of AI Safety Institutes) carry no
 * icon and simply don't draw one — never a text stand-in.
 *
 * Detection is a case-insensitive token match against the effort's name, so the
 * curriculum strings in verification-landscape.ts are never touched — adding an
 * org is one entry here, never an edit to the authored data.
 *
 * Trap: a token is a plain substring test, so keep tokens distinctive (the full
 * agency name, not a 2-3 letter acronym that could hide inside another word).
 */
export interface OrgMark {
  id: string;
  /** Distinctive case-insensitive substrings that identify this org in a name. */
  tokens: string[];
  /** Full name, used as the icon's tooltip and alt text. */
  label: string;
  /** Square icon filename under /verification/logos/icons, if one exists. */
  icon?: string;
}

export const ORG_MARKS: OrgMark[] = [
  { id: "openai", tokens: ["OpenAI"], label: "OpenAI", icon: "openai.svg" },
  { id: "anthropic", tokens: ["Anthropic"], label: "Anthropic", icon: "anthropic.png" },
  { id: "deepmind", tokens: ["DeepMind"], label: "Google DeepMind", icon: "deepmind.ico" },
  { id: "nvidia", tokens: ["NVIDIA"], label: "NVIDIA", icon: "nvidia.ico" },
  { id: "rand", tokens: ["RAND"], label: "RAND Corporation", icon: "rand.svg" },
  { id: "nist", tokens: ["NIST"], label: "NIST", icon: "nist.ico" },
  { id: "cnas", tokens: ["CNAS"], label: "CNAS", icon: "cnas.png" },
  { id: "cset", tokens: ["CSET"], label: "CSET, Georgetown" },
  { id: "govai", tokens: ["GovAI"], label: "GovAI", icon: "govai.jpg" },
  { id: "epoch", tokens: ["Epoch AI"], label: "Epoch AI", icon: "epoch.svg" },
  { id: "metr", tokens: ["METR"], label: "METR", icon: "metr.png" },
  { id: "apollo", tokens: ["Apollo Research"], label: "Apollo Research", icon: "apollo.png" },
  { id: "flexheg", tokens: ["FlexHEG"], label: "FlexHEG" },
  { id: "aria", tokens: ["ARIA"], label: "ARIA (UK)", icon: "aria.png" },
  { id: "bis", tokens: ["Bureau of Industry and Security"], label: "US Bureau of Industry and Security", icon: "bis.ico" },
  { id: "iaea", tokens: ["IAEA"], label: "IAEA", icon: "iaea.ico" },
  { id: "opcw", tokens: ["OPCW"], label: "OPCW", icon: "opcw.png" },
  { id: "caisi", tokens: ["CAISI"], label: "US CAISI (NIST)", icon: "nist.ico" },
  { id: "ukaisi", tokens: ["UK AI Security Institute"], label: "UK AI Security Institute", icon: "ukaisi.png" },
  { id: "intl-aisi", tokens: ["International Network of AI Safety"], label: "International Network of AI Safety Institutes" },
];

const ICON_BASE = "/verification/logos/icons/";

export function iconSrc(m: OrgMark): string | undefined {
  return m.icon ? ICON_BASE + m.icon : undefined;
}

/** Org marks named anywhere in one string (0, 1, or more), in registry order. */
export function marksInText(text: string): OrgMark[] {
  const t = text.toLowerCase();
  return ORG_MARKS.filter((m) =>
    m.tokens.some((tok) => t.includes(tok.toLowerCase())),
  );
}

/** Deduped org marks across a set of effort titles, in registry order. */
export function marksForEffs(effs: readonly [string, string][]): OrgMark[] {
  const seen = new Set<string>();
  const out: OrgMark[] = [];
  for (const [name] of effs) {
    for (const m of marksInText(name)) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        out.push(m);
      }
    }
  }
  return out;
}

/**
 * Only the marks with an icon to draw, deduped by icon file — CAISI is a NIST
 * center and shares its mark, so one cell never shows the same logo twice.
 */
export function iconMarksForEffs(effs: readonly [string, string][]): OrgMark[] {
  const seen = new Set<string>();
  const out: OrgMark[] = [];
  for (const m of marksForEffs(effs)) {
    if (!m.icon || seen.has(m.icon)) continue;
    seen.add(m.icon);
    out.push(m);
  }
  return out;
}
