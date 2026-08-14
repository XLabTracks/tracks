/**
 * 2.4.4 — Companies A and B. Two plausible reporting regimes, then a real
 * letter to read as evidence.
 *
 * THE COURSE OWNER'S SPEC. The two feature lists are hers, verbatim and in her
 * order; so are both questions, the transfer question, and the worked example
 * of an inference the letter supports and the two it does not. It replaces
 * Build an Institution, which she judged an artificial card puzzle beside a
 * comparison on real institutional differences.
 *
 * WHY BOTH LOOK DEFENSIBLE. Company A has a channel, a written anti-retaliation
 * policy and a compliance function. Counting safeguards gets you nowhere: A has
 * four, B has five, and the difference that matters is not the count but who
 * decides whether anything leaves. That is the point of the exercise and the
 * reason the task asks for the mechanism rather than the verdict.
 *
 * PART II IS EVIDENCE, NOT AUTHORITY. The letter is not quoted to settle
 * anything. What the learner is given is its date, its four asks, and the
 * composition of its signatories — and what they are asked is what that
 * composition licenses and what it does not. The overclaims are the spec's
 * own, verbatim.
 *
 * The signatory facts below were read off the letter's own page (linked) and
 * are stated as counts rather than names: the exercise is about what a group
 * of insiders publicly asking for something is evidence of, and individual
 * names add nothing to that and a great deal to the noise.
 */

export interface CompanyFeature {
  text: string;
  /** Which of the two questions in the reveal this feature bears on. */
  note?: string;
}

export interface Company {
  id: "a" | "b";
  label: string;
  features: CompanyFeature[];
}

/** Her two lists, verbatim. */
export const COMPANIES: Company[] = [
  {
    id: "a",
    label: "Company A",
    features: [
      { text: "Internal compliance channel." },
      { text: "Formal anti-retaliation policy." },
      { text: "Concerns normally pass through management or legal." },
      { text: "External disclosure requires authorization." },
      { text: "The company controls escalation." },
    ],
  },
  {
    id: "b",
    label: "Company B",
    features: [
      { text: "Internal reporting channel." },
      {
        text: "Protected direct route to an independent external recipient.",
      },
      { text: "Confidentiality protections." },
      { text: "Anti-retaliation protection." },
      { text: "A defined process for corroboration and escalation." },
    ],
  },
];

/** Her Part I question, verbatim. */
export const AB_QUESTION =
  "Which differences between the two systems are most consequential for whether evidence of a serious violation can reach an independent verifier? Identify two and explain the mechanism in each case.";

export const AB_WARNING =
  "Not which company has the better policy. Both have a channel and both prohibit retaliation; counting safeguards will not separate them.";

/** Two slots, because she asks for two differences. */
export const AB_SLOTS = [
  { id: "one", label: "First difference" },
  { id: "two", label: "Second difference" },
];

/**
 * What the reveal says about Part I. Ours: the spec names the operation and
 * not the answer, and there is more than one defensible pair — a reading that
 * names the mechanism is what earns the point, not hitting these two.
 */
export const AB_REVEAL = [
  "Who holds the exit. A's external disclosure needs authorization and A controls escalation, so the party a serious allegation would implicate decides whether it travels. B's route to an independent recipient does not pass through that decision. This is the difference that survives every other feature being equal.",
  "What happens after the report lands. B has a defined process for corroboration and escalation; A has a channel and a policy and no stated procedure for what follows. A report that arrives somewhere with no defined next step is a report that depends on somebody's discretion, and discretion is what the first difference already showed to be the problem.",
  "Two things that are NOT the difference: the anti-retaliation policy, which both have and which protects the reporter rather than the report; and the internal channel, which both have and which decides where a report starts, not where it can end up.",
];

/* ---------------- Part II — the letter as evidence ---------------- */

export const LETTER = {
  title: "A Right to Warn about Advanced Artificial Intelligence",
  date: "4 June 2024",
  href: "https://righttowarn.ai/",
  /** The four asks, shortened; the full text is one click away. */
  asks: [
    "No agreement forbidding risk-related criticism, and no withholding of earned payments for making it.",
    "A verifiably anonymous channel to the board, to regulators, and to an independent organization with relevant expertise.",
    "A culture that permits current and former employees to raise risk concerns publicly, so long as trade secrets are protected.",
    "No retaliation for public disclosure once the other channels have failed.",
  ],
  /** The composition, which is the actual evidence in Part II. */
  composition: [
    "Thirteen signatories in all: seven named and six anonymous.",
    "Current and former employees of more than one frontier AI company, including people who were at the time still employed at one of them.",
    "Endorsed separately by three senior researchers who do not work at any of the companies.",
  ],
};

export const LETTER_QUESTIONS = [
  {
    id: "supports",
    label:
      "What does the existence and composition of this letter provide evidence for?",
  },
  {
    id: "not-established",
    label: "What does it not establish?",
  },
];

/** Her worked example, verbatim. Shown only in the reveal. */
export const LETTER_SUPPORTED =
  "Some insiders across multiple frontier AI companies considered existing channels or protections insufficient for raising serious concerns.";

export const LETTER_OVERCLAIMS = [
  "These companies had no whistleblower protections.",
  "The substantive safety concerns raised by the signatories were therefore true.",
];

/** Ours, on why each overclaim fails — one sentence each. */
export const LETTER_OVERCLAIM_NOTES = [
  "A demand for protections is evidence that the people making it found what exists inadequate. Inadequate and absent are different findings, and the letter does not distinguish them.",
  "Who is speaking is not what they are speaking about. The letter is evidence about the state of reporting institutions; it carries nothing about whether any particular safety claim is correct.",
];

/** Her transfer question, verbatim. */
export const TRANSFER_QUESTION =
  "How does this evidence change, if at all, your assessment of the institutional features that mattered in Companies A and B?";

/**
 * Ours, in the reveal: the connection the transfer question is reaching for,
 * stated as one possible reading rather than the answer.
 */
export const TRANSFER_NOTE =
  "One reading: the letter's first and second asks are about exactly the two features that separated A from B — an agreement that can be used to prevent criticism, and a channel that reaches somebody outside. Insiders asking for those, in public, under their own names, is some evidence that those are the features that bind in practice and not only on a comparison sheet.";
