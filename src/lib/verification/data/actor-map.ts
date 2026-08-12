/**
 * Actor roster and lenses from tracksprogramplayground's Actor Map prototype.
 * Long-form claims remain in the lesson; the widget is a navigable index into
 * that human-authored material.
 */

export type ActorRoleId =
  | "capability"
  | "chokepoint"
  | "information"
  | "enforcement"
  | "evasion"
  | "victim";

export type ActorPostureId =
  | "comply"
  | "defect"
  | "hide"
  | "exaggerate"
  | "freeride";

export interface ActorRole {
  id: ActorRoleId;
  name: string;
  question: string;
}

export interface ActorPosture {
  id: ActorPostureId;
  name: string;
  means: string;
}

export interface ActorMapEntry {
  id: string;
  name: string;
  group: string;
  kind: "public" | "private";
  position: string;
  roles: ActorRoleId[];
  postures: ActorPostureId[];
  note?: string;
}

export const ACTOR_ROLES: ActorRole[] = [
  { id: "capability", name: "Capability holder", question: "Who can actually build the dangerous thing?" },
  { id: "chokepoint", name: "Chokepoint controller", question: "Who can physically stop or slow the flow?" },
  { id: "information", name: "Information holder", question: "Who already knows what verifiers need to learn?" },
  { id: "enforcement", name: "Enforcement authority", question: "Who can impose a real cost for violating?" },
  { id: "evasion", name: "Evasion pathway", question: "Through whom would a cheater route?" },
  { id: "victim", name: "Victim, free-rider, beneficiary", question: "Who bears the risk, or enjoys the stability, without a seat at the table?" },
];

export const ACTOR_POSTURES: ActorPosture[] = [
  { id: "comply", name: "Comply", means: "Follow the agreement as written." },
  { id: "defect", name: "Defect", means: "Covertly violate for advantage." },
  { id: "hide", name: "Hide", means: "Obscure assets or activities from view, whether or not a rule is being broken." },
  { id: "exaggerate", name: "Exaggerate", means: "Overstate compliance, safety, or capability." },
  { id: "freeride", name: "Free-ride", means: "Enjoy the stability produced by others' restraint without bearing its costs." },
];

export const ACTOR_GROUPS: Record<string, string> = {
  "public-actors": "States and rule-writers",
  "us-institutions": "Inside the United States",
  international: "International bodies",
  equipment: "Equipment",
  fabrication: "Fabrication and packaging",
  memory: "Memory",
  "design-software": "Design software",
  atp: "Assembly and test",
  accelerator: "Accelerator design",
  cloud: "Cloud and data centers",
  training: "Model training",
  distribution: "Distribution and evasion",
  deployment: "Deployment",
};

export const ACTOR_MAP_ENTRIES: ActorMapEntry[] = [
  {
    id: "us", name: "United States", group: "public-actors", kind: "public",
    position: "Jurisdiction over chip design, the largest frontier labs and cloud providers, and export-control law.",
    roles: ["capability", "chokepoint", "information", "enforcement"], postures: ["comply", "hide"],
    note: "Its export rules are the closest thing to a working compute-control regime today; its intelligence collection is difficult to share.",
  },
  {
    id: "china", name: "China", group: "public-actors", kind: "public",
    position: "The other frontier developer: manufacturing scale, materials, designers, clouds and labs.",
    roles: ["capability", "chokepoint", "information", "enforcement"], postures: ["comply", "hide"],
    note: "Reads on-chip controls and inspection rights as surveillance and containment.",
  },
  {
    id: "taiwan", name: "Taiwan", group: "fabrication", kind: "public",
    position: "Fabrication and advanced packaging.", roles: ["chokepoint", "information", "victim"], postures: ["comply"],
    note: "Caught between US rules and Chinese customers.",
  },
  {
    id: "netherlands", name: "Netherlands", group: "equipment", kind: "public",
    position: "Equipment: ASML.", roles: ["chokepoint", "information"], postures: ["comply"],
    note: "A small state carrying outsized weight in a rivalry it did not choose.",
  },
  {
    id: "japan", name: "Japan", group: "equipment", kind: "public",
    position: "Equipment and specialty materials.", roles: ["chokepoint"], postures: ["comply"],
    note: "Under pressure from both sides of the US-China rivalry.",
  },
  {
    id: "south-korea", name: "South Korea", group: "memory", kind: "public",
    position: "Memory, including high-bandwidth memory.", roles: ["chokepoint", "information"], postures: ["comply"],
    note: "Export exposure to China against alliance pressure from the United States.",
  },
  {
    id: "eu", name: "European Union", group: "public-actors", kind: "public",
    position: "Not a silicon hub: a rule-writer.", roles: ["enforcement"], postures: ["comply"],
  },
  {
    id: "california", name: "California", group: "public-actors", kind: "public",
    position: "Subnational jurisdiction over most frontier labs by headquarters geography.",
    roles: ["enforcement", "information"], postures: ["comply"],
  },
  {
    id: "non-chip-states", name: "States with no supply-chain position", group: "public-actors", kind: "public",
    position: "No position on the compute chain.", roles: ["victim"], postures: ["freeride"],
    note: "They hold a genuine stake in whether ASI gets built and little leverage except signature and refusal.",
  },
  {
    id: "state", name: "State Department", group: "us-institutions", kind: "public",
    position: "Inside the United States.", roles: ["enforcement"], postures: ["comply"],
    note: "Negotiates the agreement and runs diplomacy around compliance disputes.",
  },
  {
    id: "bis", name: "Commerce · BIS", group: "us-institutions", kind: "public",
    position: "Inside the United States.", roles: ["enforcement", "information"], postures: ["comply"],
    note: "Writes and enforces export controls on chips.",
  },
  {
    id: "defense", name: "Department of Defense", group: "us-institutions", kind: "public",
    position: "Inside the United States.", roles: ["capability"], postures: ["hide"],
    note: "Has strategic and military stakes in frontier AI and resists constraints on American programs.",
  },
  {
    id: "ic", name: "Intelligence community", group: "us-institutions", kind: "public",
    position: "Inside the United States.", roles: ["information"], postures: ["hide"],
    note: "Collects evidence of undeclared facilities, but sharing it can expose sources and methods.",
  },
  {
    id: "caisi", name: "NIST · CAISI", group: "us-institutions", kind: "public",
    position: "Inside the United States.", roles: ["information"], postures: ["comply"],
    note: "Measures capability, but has no authority to inspect a facility or compel a disclosure.",
  },
  {
    id: "un-panel", name: "UN Scientific Panel on AI", group: "international", kind: "public",
    position: "Above the state.", roles: ["information"], postures: ["comply"],
    note: "A scientific body, explicitly not a regulator or enforcement body.",
  },
  {
    id: "dialogue", name: "Global Dialogue on AI Governance", group: "international", kind: "public",
    position: "Above the state.", roles: [], postures: [], note: "A deliberative forum, not a verifier.",
  },
  {
    id: "missing-verifier", name: "The verification body that does not exist", group: "international", kind: "public",
    position: "Above the state.", roles: [], postures: [],
    note: "No international body holds a chip registry, inspection right, or procedure for resolving an allegation of training above a threshold.",
  },
  {
    id: "asml", name: "ASML", group: "equipment", kind: "private",
    position: "Equipment, most upstream.", roles: ["chokepoint", "information"], postures: ["comply"],
    note: "Few customers, high visibility, and systems that need continuing vendor service.",
  },
  {
    id: "tsmc", name: "TSMC", group: "fabrication", kind: "private",
    position: "Fabrication and advanced packaging.", roles: ["chokepoint", "information", "evasion"], postures: ["comply", "hide"],
  },
  {
    id: "hbm", name: "SK hynix, Samsung, Micron", group: "memory", kind: "private",
    position: "High-bandwidth memory.", roles: ["chokepoint", "information"], postures: ["comply"],
  },
  {
    id: "eda", name: "Synopsys, Cadence, Siemens EDA", group: "design-software", kind: "private",
    position: "Design software, upstream of everything physical.", roles: ["chokepoint"], postures: ["comply"],
    note: "High visibility on licensing and little visibility on use.",
  },
  {
    id: "osats", name: "ASE, Amkor, SPIL", group: "atp", kind: "private",
    position: "Outsourced assembly and test.", roles: ["chokepoint"], postures: ["comply"],
    note: "A quiet bottleneck that is rarely named in policy debate.",
  },
  {
    id: "nvidia", name: "NVIDIA", group: "accelerator", kind: "private",
    position: "Accelerator design.", roles: ["chokepoint", "information", "evasion", "victim"], postures: ["comply", "hide", "exaggerate", "freeride"],
    note: "It can decide whether accelerators ship with attestation, metering, or location features.",
  },
  {
    id: "amd", name: "AMD", group: "accelerator", kind: "private",
    position: "Accelerator design.", roles: ["chokepoint", "victim"], postures: ["comply"],
  },
  {
    id: "hyperscalers", name: "AWS, Azure, Google Cloud, Oracle, Alibaba", group: "cloud", kind: "private",
    position: "Cloud and data-center operation.", roles: ["chokepoint", "information", "enforcement", "evasion"], postures: ["comply", "hide"],
    note: "They can suspend access and hold rich logs; reseller chains and mislabeled workloads also create evasion routes.",
  },
  {
    id: "neoclouds", name: "CoreWeave and specialist providers", group: "cloud", kind: "private",
    position: "Cloud and data-center operation.", roles: ["chokepoint", "information"], postures: ["comply"],
  },
  {
    id: "frontier-labs", name: "Frontier labs", group: "training", kind: "private",
    position: "Model training.", roles: ["capability", "information", "victim"], postures: ["comply", "hide", "exaggerate", "freeride"],
    note: "They hold the most detailed private information in the system: what was trained, on what data, and what evaluations showed.",
  },
  {
    id: "china-labs", name: "DeepSeek, Alibaba, Moonshot", group: "training", kind: "private",
    position: "Model training.", roles: ["capability", "information"], postures: ["comply", "hide"],
  },
  {
    id: "proxies", name: "Front companies, resellers, straw buyers", group: "distribution", kind: "private",
    position: "Distribution, across every stage.", roles: ["evasion"], postures: ["defect"],
    note: "They exist to break the link between a name and an activity.",
  },
  {
    id: "deployers", name: "Product builders and deployers", group: "deployment", kind: "private",
    position: "Deployment, most downstream.", roles: ["victim"], postures: ["freeride"],
    note: "A diffuse downstream signal of what models can do.",
  },
];
