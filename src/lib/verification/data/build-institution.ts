/**
 * 2.4.4 — Build the Institution.
 *
 * THE COURSE OWNER'S SPEC, verbatim: the scenario, the three requirements,
 * the twelve provisions in their three groups, the exactly-five rule, the
 * 80-word explanation, the three feedback tests and the optional swap. Its
 * olympiad mechanic constructs a coherent institution from a constrained menu
 * of properties.
 *
 * NO CANONICAL FIVE. Her design principle is explicit — multiple defensible
 * solutions, and the exercise must not secretly reduce to one combination.
 * That is why nothing here marks a provision "correct". Each carries what it
 * DOES (`gives`) and what it FORBIDS (`breaks`), and the engine reads a
 * selection through those, so B+C+E+I+K passes and so do the others that
 * satisfy the same three functions. Her example five is one solution and is
 * labelled as one.
 *
 * The four invalid constructions she lists are exactly the contradictions
 * encoded below:
 *
 *   employer approval while claiming an independent route      → D (and A)
 *   protection conditional on the allegation proving correct    → H
 *   reports as automatic proof of violation                     → J
 *   a route with no means of corroboration or escalation        → neither I nor K
 *
 * WHAT IS MINE: the two sample designs in the reveal and their trade-offs.
 * Her spec asks for "two different valid institutional designs" and gives one
 * example set. The second is a different route to the same three functions,
 * and both are checked by the engine's own tests, so neither can drift into
 * being invalid while sitting on the page as a model answer.
 */

/** What a provision supplies. The engine's whole vocabulary. */
export type Function_ =
  | "independent-route"
  | "identity-protection"
  | "anti-retaliation"
  | "corroboration"
  | "escalation";

/** What a provision defeats, whatever else is selected. */
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

/** Her twelve, verbatim, in her groups and her order. */
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

/** Her three requirements, verbatim. */
export const REQUIREMENTS = [
  "Information can reach an independent verifier.",
  "Legitimate reporters have meaningful protection.",
  "An allegation alone cannot establish that a treaty violation occurred.",
];

/** Her three feedback tests, verbatim in name. */
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
    label: "Epistemic discipline",
    question:
      "Does the institution distinguish an allegation from an established violation?",
  },
] as const;

export const EXPLANATION_PROMPT =
  "In 80 words or fewer, explain why the resulting institution satisfies all three requirements.";

export const SWAP_PROMPT =
  "Replace exactly one of your five provisions with another provision while keeping all three requirements satisfied. Which one goes, what takes its place, and what would have broken if you had swapped something else?";

export interface SampleDesign {
  ids: string[];
  title: string;
  tradeoff: string;
}

/**
 * Two designs that both pass. Mine, apart from the first set, which is her
 * example. `build-institution.test.ts` runs the engine over both, so a sample
 * design cannot sit here as a model answer while being invalid.
 */
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
