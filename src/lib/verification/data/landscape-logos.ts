export interface OrgMark {
  id: string;
  tokens: string[];
  label: string;
  short: string;
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

export function marksInText(text: string): OrgMark[] {
  const t = text.toLowerCase();
  return ORG_MARKS.filter((m) =>
    m.tokens.some((tok) => t.includes(tok.toLowerCase())),
  );
}

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
