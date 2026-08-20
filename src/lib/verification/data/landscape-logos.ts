/**
 * Org marks for the Verification Landscape grid. Each landscape effort names an
 * organization in its title; this maps the ones with a recognizable mark to a
 * square brand icon downloaded from the org's own site (or Wikimedia Commons),
 * used nominatively, under public/verification/logos/icons/.
 *
 * Square icons, not wordmarks: they sit as logos inside the heat cells, so a
 * cell shows who works there at a glance. The one org with no mark of its own —
 * the International Network of AI Safety Institutes, a network of eleven
 * national institutes — carries no icon and simply draws nothing.
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
  /** Short display name, for the in-cell listing. */
  short: string;
  /** Square icon filename under /verification/logos/icons, if one exists. */
  icon?: string;
}

export const ORG_MARKS: OrgMark[] = [
  { id: "openai", tokens: ["OpenAI"], label: "OpenAI", short: "OpenAI", icon: "openai.svg" },
  { id: "anthropic", tokens: ["Anthropic"], label: "Anthropic", short: "Anthropic", icon: "anthropic.png" },
  { id: "deepmind", tokens: ["DeepMind"], label: "Google DeepMind", short: "DeepMind", icon: "deepmind.ico" },
  { id: "nvidia", tokens: ["NVIDIA"], label: "NVIDIA", short: "NVIDIA", icon: "nvidia.ico" },
  { id: "rand", tokens: ["RAND"], label: "RAND Corporation", short: "RAND", icon: "rand.svg" },
  { id: "nist", tokens: ["NIST"], label: "NIST", short: "NIST", icon: "nist.ico" },
  { id: "cnas", tokens: ["CNAS"], label: "CNAS", short: "CNAS", icon: "cnas.png" },
  { id: "cset", tokens: ["CSET"], label: "CSET, Georgetown", short: "CSET", icon: "cset.ico" },
  { id: "govai", tokens: ["GovAI"], label: "GovAI", short: "GovAI", icon: "govai.jpg" },
  { id: "epoch", tokens: ["Epoch AI"], label: "Epoch AI", short: "Epoch AI", icon: "epoch.svg" },
  { id: "metr", tokens: ["METR"], label: "METR", short: "METR", icon: "metr.png" },
  { id: "apollo", tokens: ["Apollo Research"], label: "Apollo Research", short: "Apollo", icon: "apollo.png" },
  { id: "flexheg", tokens: ["FlexHEG"], label: "FlexHEG", short: "FlexHEG", icon: "flexheg.ico" },
  { id: "aria", tokens: ["ARIA"], label: "ARIA (UK)", short: "ARIA", icon: "aria.png" },
  { id: "bis", tokens: ["Bureau of Industry and Security"], label: "US Bureau of Industry and Security", short: "US BIS", icon: "bis.ico" },
  { id: "iaea", tokens: ["IAEA"], label: "IAEA", short: "IAEA", icon: "iaea.ico" },
  { id: "opcw", tokens: ["OPCW"], label: "OPCW", short: "OPCW", icon: "opcw.png" },
  { id: "caisi", tokens: ["CAISI"], label: "US CAISI (NIST)", short: "CAISI", icon: "nist.ico" },
  { id: "ukaisi", tokens: ["UK AI Security Institute"], label: "UK AI Security Institute", short: "UK AISI", icon: "ukaisi.png" },
  { id: "intl-aisi", tokens: ["International Network of AI Safety"], label: "International Network of AI Safety Institutes", short: "Int’l Network" },

  /* Named by CELL_ORGS rather than by a token hit in the authored text (see
     below). Tokens are still full names, never acronyms, so that if a future
     effort string does name one of these the match is the right one. */
  { id: "fas", tokens: ["Federation of American Scientists"], label: "Federation of American Scientists", short: "FAS" },
  { id: "iea", tokens: ["International Energy Agency"], label: "International Energy Agency", short: "IEA" },
  { id: "ezkl", tokens: ["EZKL"], label: "EZKL", short: "EZKL" },
  { id: "modulus", tokens: ["Modulus Labs"], label: "Modulus Labs", short: "Modulus Labs" },
  { id: "giza", tokens: ["Giza"], label: "Giza", short: "Giza" },
  { id: "cser", tokens: ["Centre for the Study of Existential Risk"], label: "Centre for the Study of Existential Risk, Cambridge", short: "CSER" },
  { id: "fli", tokens: ["Future of Life Institute"], label: "Future of Life Institute", short: "FLI" },
  { id: "chatham", tokens: ["Chatham House"], label: "Chatham House", short: "Chatham House" },
  { id: "simon", tokens: ["Simon Institute"], label: "Simon Institute for Longterm Governance", short: "Simon Inst." },
  { id: "crfm", tokens: ["Center for Research on Foundation Models"], label: "Stanford CRFM / HAI", short: "Stanford CRFM" },
  { id: "mlcommons", tokens: ["MLCommons"], label: "MLCommons", short: "MLCommons" },
  { id: "cosic", tokens: ["COSIC"], label: "COSIC, KU Leuven", short: "COSIC" },
  { id: "cacr", tokens: ["Centre for Applied Cryptographic Research"], label: "CACR, University of Waterloo", short: "Waterloo CACR" },
];

/**
 * Who works in a cell, where the authored effort text does not happen to name
 * them.
 *
 * The token matcher above can only find an org that the curriculum sentence
 * already spells out, so a cell whose efforts read "Hardware-security research"
 * or "Remote sensing of compute" showed no one at all — true of most of the
 * grid. These are the same kind of illustrative example the authored `eff`
 * entries carry, held here rather than there so `verification-landscape.ts`
 * stays exactly as authored.
 *
 * VERIFICATION LOG. Every entry below was checked against a named public source
 * in Aug 2026; the rows this does NOT cover are listed as `unchecked` and are
 * deliberately left blank rather than guessed at.
 *
 *   confirmed  monitor×think   FAS "Tracking Hyperscale AI Data Center Growth
 *                              with Satellite Imagery"; Epoch AI Frontier Data
 *                              Centers Hub (Nov 2025), satellite + permit data.
 *   confirmed  monitor×gov     IEA satellite-based tracking of "AI factories"
 *                              (capacity more than tripled in 18 months).
 *   confirmed  crypto×industry EZKL (ONNX→Halo2 zk-SNARK toolchain), Modulus
 *                              Labs, Giza — the three most-cited zkML toolchains.
 *   confirmed  inst×think      FLI "IAEA and CERN for AI" grant programme;
 *                              Chatham House "A 'CERN for AI'" (2024); Simon
 *                              Institute "CERN for AI: One Analogy, Many Visions".
 *   confirmed  inst×acad       CSER Cambridge — Belfield's paired proposal for
 *                              an International AI Agency plus a CERN for AI.
 *   confirmed  evals×acad      Stanford CRFM/HAI (HELM); MLCommons AI Safety
 *                              working group, built on HELM.
 *   partial    crypto×acad     COSIC (KU Leuven) and Waterloo CACR are confirmed
 *                              as leading academic ZKP groups; NOT verified as
 *                              working on AI-governance verification specifically.
 *
 *   unchecked  hw×acad         Searching found no flagship lab — the literature
 *                              describes this work as something that *could* be
 *                              outsourced to academic hardware-security labs,
 *                              which matches the cell's own "thin but real"
 *                              text. Left blank on purpose, not by omission.
 *   unchecked  crypto×think, compute×acad, compute×industry, monitor×acad,
 *              monitor×industry, evals×industry — not yet researched.
 *
 *   n/a        crypto×gov      Stays empty BY DESIGN. `gap: true`, and the
 *                              widget's own footer is built on it: "the
 *                              cryptographic ones ... sit mostly in academic
 *                              papers with no public-sector home." Filling this
 *                              square would delete the map's punchline.
 */
export const CELL_ORGS: Record<string, Record<string, string[]>> = {
  crypto: {
    acad: ["cosic", "cacr"],
    industry: ["ezkl", "modulus", "giza"],
  },
  monitor: {
    think: ["fas", "epoch"],
    gov: ["iea"],
  },
  inst: {
    acad: ["cser"],
    think: ["fli", "chatham", "simon"],
  },
  evals: {
    acad: ["crfm", "mlcommons"],
  },
};

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
 * Everyone the grid should show in one cell: the orgs the authored effort text
 * names, plus the ones CELL_ORGS names for it. Registry order throughout, so a
 * cell's list does not reshuffle when an entry is added above it.
 */
export function marksForCell(
  rowKey: string,
  colKey: string,
  effs: readonly [string, string][],
): OrgMark[] {
  const extra = CELL_ORGS[rowKey]?.[colKey] ?? [];
  if (!extra.length) return marksForEffs(effs);
  const ids = new Set([...marksForEffs(effs).map((m) => m.id), ...extra]);
  return ORG_MARKS.filter((m) => ids.has(m.id));
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
