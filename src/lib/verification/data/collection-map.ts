
export interface CollectionDiscipline {
  id: string;
  abbr: string;
  name: string;
  kind: "literal" | "technical";
  what: string;
  seen: string;
  limit: string;
}

export const COLLECTION_COPY = {
  title: "Intelligence collection disciplines",
  lede:
    "Intelligence is collected in a small number of ways, usually called the " +
    "collection disciplines or the INTs, each named for its source. They " +
    "divide into literal collection, whose sources yield " +
    "information in a form people use to communicate, and nonliteral " +
    "collection, whose sources yield images and measurements that need " +
    "technical processing before an analyst can read them. The eight " +
    "disciplines that matter for watching AI development are listed below in " +
    "that division.",
  literal: "Literal collection",
  technical: "Nonliteral collection",
  legend: "Select a discipline for its definition.",
  seenLabel: "What it collects",
  limitLabel: "Limitations",
} as const;

export const COLLECTION_DISCIPLINES: CollectionDiscipline[] = [
  {
    id: "osint",
    abbr: "OSINT",
    name: "Open-source intelligence",
    kind: "literal",
    what:
      "Publicly available information: media reporting, government and corporate filings, permits, professional and academic records, and public data.",
    seen:
      "Organizational and facility signatures — permits, filings, hiring, supplier disclosures, interconnect and power-purchase records — often before anything is built.",
    limit:
      "Six Layers classes it with the supplemental mechanisms: it rarely settles a question on its own, and it is the first stream a program sanitizes.",
  },
  {
    id: "humint",
    abbr: "HUMINT",
    name: "Human intelligence",
    kind: "literal",
    what:
      "Information collected from people, openly or clandestinely: sources inside an organization, defectors, contractors, and anyone with placement and access.",
    seen:
      "Intent and internal knowledge, which no sensor records.",
    limit:
      "Slow and unschedulable: it depends on a person choosing to talk, and cannot be tasked the way a satellite can.",
  },
  {
    id: "sigint",
    abbr: "SIGINT",
    name: "Signals intelligence",
    kind: "literal",
    what:
      "Intelligence derived from intercepted electronic transmissions: communications (COMINT) and non-communications signals (ELINT).",
    seen:
      "Organizational and operational signatures — who is in contact with whom, and sometimes what was said.",
    limit:
      "The most sources-and-methods-sensitive discipline, and therefore the hardest to share with a treaty verifier.",
  },
  {
    id: "cyber",
    abbr: "CYBER",
    name: "Cyber intelligence",
    kind: "literal",
    what:
      "Collection from computer networks and systems themselves. MIRI's Definition 17 names cyber inside national technical means.",
    seen:
      "Operational signatures — what a facility is actually running.",
    limit:
      "Its place in a treaty definition is contested: one party reads it as legalized collection, the other as a licence to hack.",
  },
  {
    id: "finint",
    abbr: "FININT",
    name: "Financial intelligence",
    kind: "literal",
    what:
      "Intelligence gathered from the analysis of monetary transactions: bank records, suspicious-activity reports, export licences, customs filings, and the procurement trail behind chips, components, and construction.",
    seen:
      "Resource-flow signatures — what was bought, from whom, and who paid. Scher and Thiergart rate it High feasibility within a year.",
    limit:
      "Dual-use purchases blur the signal, and domestic chip manufacturing erodes the customs half of the trail.",
  },
  {
    id: "imint",
    abbr: "IMINT",
    name: "Imagery intelligence",
    kind: "technical",
    what:
      "Intelligence from satellite and aerial imagery, formerly called photo intelligence: building footprint, substations, cooling plant, security perimeter.",
    seen:
      "Facility signatures, and construction while it is under way.",
    limit:
      "Unlikely to tell an AI datacenter from any other — cooling is the differentiator — and defeated by underground siting.",
  },
  {
    id: "geoint",
    abbr: "GEOINT",
    name: "Geospatial intelligence",
    kind: "technical",
    what:
      "The analysis and visual representation of activity on the earth: imagery placed in geographic and temporal context — terrain, infrastructure, transmission lines, change over time.",
    seen:
      "Resource-flow signatures: the grid connection a large site needs.",
    limit:
      "Reads the surroundings well and the activity inside poorly.",
  },
  {
    id: "masint",
    abbr: "MASINT",
    name: "Measurement and signature intelligence",
    kind: "technical",
    what:
      "Technically derived intelligence other than imagery and signals: the distinctive physical signatures of a target — thermal, acoustic, seismic, radio-frequency, materials.",
    seen:
      "Waste heat and the narrow temperature band of constant chip operation; geophysical methods are already used against underground construction.",
    limit:
      "The signature it reads is shrinking: performance per watt improves about 1.6× a year, so a fixed quantity of compute emits less each year.",
  },
];
