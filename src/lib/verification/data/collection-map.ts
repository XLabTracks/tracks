
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
  title: "The collection map",
  lede:
    "Eight ways a watcher sees. The disciplines split into two families: those " +
    "that collect language and records, and those that collect physics. Open " +
    "each one.",
  literal: "Collects language",
  technical: "Collects physics",
  legend: "Click a discipline to read what it is.",
  seenLabel: "Picks up",
  limitLabel: "Characteristic limit",
} as const;

export const COLLECTION_DISCIPLINES: CollectionDiscipline[] = [
  {
    id: "osint",
    abbr: "OSINT",
    name: "Open-source intelligence",
    kind: "literal",
    what:
      "Anything published or otherwise available without concealment: permits, " +
      "corporate filings, hiring, supplier disclosures, interconnect queues and " +
      "power-purchase records.",
    seen: "Organizational and facility signatures, before anything is built.",
    limit:
      "Six Layers classes it with the supplemental mechanisms — it rarely " +
      "settles a question on its own.",
  },
  {
    id: "humint",
    abbr: "HUMINT",
    name: "Human intelligence",
    kind: "literal",
    what:
      "Collection from people — sources inside an organization, defectors, " +
      "contractors, and anyone with placement and access.",
    seen: "Intent and internal knowledge, which no sensor reads.",
    limit:
      "Slow, unschedulable, and dependent on a person choosing to talk; it " +
      "cannot be tasked the way a satellite can.",
  },
  {
    id: "sigint",
    abbr: "SIGINT",
    name: "Signals intelligence",
    kind: "literal",
    what:
      "Interception of communications and electronic emissions — who is talking " +
      "to whom, and sometimes what they said.",
    seen: "Organizational and operational signatures.",
    limit:
      "The most sources-and-methods-sensitive stream, which is exactly why it " +
      "is the hardest to share with a treaty verifier.",
  },
  {
    id: "cyber",
    abbr: "CYBER",
    name: "Cyber intelligence",
    kind: "literal",
    what:
      "Collection from networks and systems themselves. MIRI's Definition 17 " +
      "names it inside national technical means.",
    seen: "Operational signatures — what a facility is actually running.",
    limit:
      "Its inclusion in a treaty definition is contested: read as legalized " +
      "collection by one party and as a license to hack by the other.",
  },
  {
    id: "finint",
    abbr: "FININT",
    name: "Financial intelligence",
    kind: "literal",
    what:
      "Money as evidence: transaction records, suspicious-activity reports, " +
      "export licences, customs filings, and the procurement trail behind " +
      "chips, components and construction.",
    seen:
      "Resource-flow signatures — what was bought, from whom, and who paid. " +
      "Scher and Thiergart rate it High feasibility within a year: covert AI " +
      "projects are very expensive and leave a substantial money trail.",
    limit:
      "Dual-use purchases blur the signal, and domestic chip manufacturing " +
      "erodes the customs half of the trail.",
  },
  {
    id: "imint",
    abbr: "IMINT",
    name: "Imagery intelligence",
    kind: "technical",
    what:
      "Overhead and aerial imagery: building footprint, electrical substations, " +
      "cooling plant, security perimeter.",
    seen: "Facility signatures, and construction while it is happening.",
    limit:
      "Unlikely to separate an AI datacenter from any other datacenter — " +
      "cooling is the differentiator — and defeated by underground siting.",
  },
  {
    id: "geoint",
    abbr: "GEOINT",
    name: "Geospatial intelligence",
    kind: "technical",
    what:
      "Imagery placed in geographic and temporal context — terrain, " +
      "infrastructure, transmission lines, and change over time.",
    seen: "Resource-flow signatures: the grid connection a large site needs.",
    limit:
      "Reads the surroundings well and the activity inside poorly.",
  },
  {
    id: "masint",
    abbr: "MASINT",
    name: "Measurement and signature intelligence",
    kind: "technical",
    what:
      "The physics a facility emits — thermal, effluent, radar and geophysical " +
      "signatures. Clark's technical-collection reference is the one on this.",
    seen:
      "Waste heat and the narrow temperature band of constant chip operation; " +
      "geophysical methods are already used against underground construction.",
    limit:
      "The signature it reads is shrinking: performance-per-watt improves about " +
      "1.6x a year, so a fixed quantity of compute emits less each year.",
  },
];
