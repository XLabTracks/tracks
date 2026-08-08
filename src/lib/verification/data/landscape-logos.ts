/**
 * Org marks for the Verification Landscape panel. Each landscape effort names
 * an organization in its title; this maps the ones with a recognizable mark to
 * a downloaded wordmark logo (public/verification/logos/*, from Wikimedia
 * Commons, used nominatively) or, for the acronym-known policy shops and
 * agencies with no clean logo, a short text monogram.
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
  /** Full name, used as the pill's tooltip and image alt. */
  label: string;
  /** Logo filename under /verification/logos, or undefined to show `mono`. */
  file?: string;
  /** Short text shown when there is no logo file. */
  mono?: string;
}

export const ORG_MARKS: OrgMark[] = [
  { id: "openai", tokens: ["OpenAI"], label: "OpenAI", file: "openai.svg" },
  { id: "anthropic", tokens: ["Anthropic"], label: "Anthropic", file: "anthropic.svg" },
  { id: "deepmind", tokens: ["DeepMind"], label: "Google DeepMind", file: "google-deepmind.svg" },
  { id: "nvidia", tokens: ["NVIDIA"], label: "NVIDIA", file: "nvidia.svg" },
  { id: "rand", tokens: ["RAND"], label: "RAND Corporation", file: "rand.svg" },
  { id: "nist", tokens: ["NIST"], label: "NIST", file: "nist.svg" },
  { id: "cnas", tokens: ["CNAS"], label: "CNAS", mono: "CNAS" },
  { id: "cset", tokens: ["CSET"], label: "CSET, Georgetown", mono: "CSET" },
  { id: "govai", tokens: ["GovAI"], label: "GovAI", mono: "GovAI" },
  { id: "epoch", tokens: ["Epoch AI"], label: "Epoch AI", mono: "Epoch AI" },
  { id: "metr", tokens: ["METR"], label: "METR", mono: "METR" },
  { id: "apollo", tokens: ["Apollo Research"], label: "Apollo Research", mono: "Apollo" },
  { id: "flexheg", tokens: ["FlexHEG"], label: "FlexHEG", mono: "FlexHEG" },
  { id: "aria", tokens: ["ARIA"], label: "ARIA (UK)", mono: "ARIA" },
  { id: "bis", tokens: ["Bureau of Industry and Security"], label: "US Bureau of Industry and Security", mono: "BIS" },
  { id: "iaea", tokens: ["IAEA"], label: "IAEA", mono: "IAEA" },
  { id: "opcw", tokens: ["OPCW"], label: "OPCW", mono: "OPCW" },
  { id: "caisi", tokens: ["CAISI"], label: "US CAISI (NIST)", mono: "CAISI" },
  { id: "ukaisi", tokens: ["UK AI Security Institute"], label: "UK AI Security Institute", mono: "UK AISI" },
  { id: "intl-aisi", tokens: ["International Network of AI Safety"], label: "International Network of AI Safety Institutes", mono: "AISI Network" },
];

const LOGO_BASE = "/verification/logos/";

export function logoSrc(m: OrgMark): string | undefined {
  return m.file ? LOGO_BASE + m.file : undefined;
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
