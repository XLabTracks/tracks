
export type Function_ =
  | "independent-route"
  | "identity-protection"
  | "anti-retaliation"
  | "corroboration"
  | "escalation";

export type Defect =
  | "employer-gate"
  | "identity-exposed"
  | "protection-conditional"
  | "allegation-is-proof"
  | "reports-inadmissible";

export interface Provision {
  id: string;
  group: "Reporting" | "Protection" | "Verification";
  text: string;
  gives?: Function_[];
  breaks?: Defect[];
}

export const PROVISIONS: Provision[] = [
  {
    id: "A",
    group: "Reporting",
    text: "Employees may report only through their direct manager.",
    breaks: ["employer-gate"],
  },
  {
    id: "B",
    group: "Reporting",
    text: "Employees may submit protected reports directly to an independent verification body.",
    gives: ["independent-route"],
  },
  {
    id: "C",
    group: "Reporting",
    text: "Anonymous reports are permitted through a secure channel.",
    gives: ["identity-protection"],
  },
  {
    id: "D",
    group: "Reporting",
    text: "External reporting requires employer approval.",
    breaks: ["employer-gate"],
  },
  {
    id: "E",
    group: "Protection",
    text: "Retaliation for qualifying reports is prohibited and subject to remedy.",
    gives: ["anti-retaliation"],
  },
  {
    id: "F",
    group: "Protection",
    text: "Reporter identity is disclosed to the employer automatically.",
    breaks: ["identity-exposed"],
  },
  {
    id: "G",
    group: "Protection",
    text: "The verifier may keep reporter identity confidential where legally permitted.",
    gives: ["identity-protection"],
  },
  {
    id: "H",
    group: "Protection",
    text: "Protection applies only if the allegation is ultimately proven correct.",
    breaks: ["protection-conditional"],
  },
  {
    id: "I",
    group: "Verification",
    text: "The verifier may seek independent corroboration after receiving a report.",
    gives: ["corroboration"],
  },
  {
    id: "J",
    group: "Verification",
    text: "A qualifying report automatically establishes a treaty violation.",
    breaks: ["allegation-is-proof"],
  },
  {
    id: "K",
    group: "Verification",
    text: "Credible reports may trigger further verification measures under defined procedures.",
    gives: ["escalation"],
  },
  {
    id: "L",
    group: "Verification",
    text: "Human reports cannot be considered unless technical telemetry already proves a violation.",
    breaks: ["reports-inadmissible"],
  },
];

export const PICK_EXACTLY = 5;
export const EXPLANATION_MAX_WORDS = 80;

export const SCENARIO =
  "You are designing the human-reporting component of a verification regime for an AI development agreement.";

export const REQUIREMENTS = [
  "Information can reach an independent verifier.",
  "Legitimate reporters have meaningful protection.",
  "Reports can trigger further verification.",
  "Corroboration is required before a violation is established.",
  "No two provisions contradict each other.",
];

export const TESTS = [
  {
    id: "reach",
    label: "Reach",
    question: "Can information get to an independent verifier?",
  },
  {
    id: "protection",
    label: "Protection",
    question:
      "Does the structure make legitimate reporting realistically usable?",
  },
  {
    id: "discipline",
    label: "Verification",
    question:
      "Can a report trigger further verification, and must it be corroborated before anything is established?",
  },
] as const;

export const COHERENCE_TEST = {
  label: "Coherence",
  question: "Do the five provisions work as one institution?",
  note: "Nothing here can judge that — it is in your eighty words, and it is the last criterion in the key below.",
} as const;

export const EXPLANATION_PROMPT =
  "In 80 words or fewer, explain why your five provisions form one workable institution.";

export const SWAP_PROMPT =
  "Replace exactly one of your five provisions with another while keeping every requirement satisfied. Which one goes, what takes its place, and what would have broken if you had swapped something else?";

export interface SampleDesign {
  ids: string[];
  title: string;
  tradeoff: string;
}

export const SAMPLE_DESIGNS: SampleDesign[] = [
  {
    ids: ["B", "C", "E", "I", "K"],
    title: "Anonymity at the front door",
    tradeoff:
      "The reporter can stay unnamed from the first contact, which is the strongest protection available to someone who has not yet decided to be a whistleblower. The cost is that an anonymous report is the hardest kind to follow up: there is nobody to go back to for the detail corroboration needs, so more weight falls on what the verifier can obtain by itself.",
  },
  {
    ids: ["B", "E", "G", "I", "K"],
    title: "Named to the verifier, hidden from the employer",
    tradeoff:
      "The verifier knows who the reporter is and can go back to them, which makes corroboration far easier and the report far more usable. The cost is that the protection is now a promise by an institution — confidentiality where legally permitted — rather than a fact about the channel, and a legal demand can undo it.",
  },
];
