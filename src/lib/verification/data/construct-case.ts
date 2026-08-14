/**
 * 2.4.1 — Construct a Case.
 *
 * THE COURSE OWNER'S SPEC, verbatim: the prompt, the three conditions, the
 * four fields, the length, the post-submission checklist, and the rule that
 * the reveal shows contrasting valid examples rather than one canonical
 * answer. Its olympiad source is "Составь задачу" — construct one concrete
 * situation satisfying several conditions at once.
 *
 * The operation is construction, not recognition. There are no options, and
 * nothing here is graded: a string match cannot see whether a case holds
 * together, and the spec says plainly not to keyword-grade it.
 *
 * WHAT IS MINE AND SHOULD BE READ FIRST. The two worked examples below.
 * The spec asks for "2 contrasting valid examples, not one correct answer"
 * and does not supply them; everything else on this page is hers. They are
 * built only out of failure modes her spec already lists — the first fails on
 * corroboration, the second on a legal barrier between the authorised
 * recipient and the verifier — and they are deliberately unalike, so the pair
 * cannot read as a template. If either is wrong, it is one object here.
 *
 * The list of failure modes is NOT shown before submission. That is her
 * constraint and it is the whole difficulty of the task: naming where a
 * report dies is the work.
 */

import type { ConstructedField } from "@/components/verification/kit/constructed-response";

/** Her three conditions, verbatim. */
export const CASE_CONDITIONS = [
  "An insider’s report about a prohibited AI activity is accurate.",
  "The insider is legally permitted to report what they know.",
  "The verification regime still cannot turn the report into actionable evidence.",
];

/** Her four fields. */
export const CASE_FIELDS: readonly ConstructedField[] = [
  {
    id: "insider",
    label: "Insider",
    hint: "Who they are, and where they sit.",
    rows: 2,
  },
  {
    id: "information",
    label: "Information",
    hint: "What they know, and how they know it.",
    rows: 3,
  },
  {
    id: "route",
    label: "Reporting route",
    hint: "How the report travels, and to whom.",
    rows: 3,
  },
  {
    id: "failure",
    label: "Failure point",
    hint: "Exactly where the verification process breaks down.",
    rows: 3,
  },
];

export const CASE_WORDS = { min: 100, max: 180 };

/** Her checklist, verbatim, shown only after submission. */
export const CASE_CHECKLIST = [
  "Is the allegation actually true?",
  "Could this insider plausibly know it?",
  "Is reporting permitted?",
  "Does the verification failure arise from the institution rather than from the allegation being false?",
  "Can you identify the precise missing link between report and action?",
];

/** Her four excluded failures, verbatim. */
export const CASE_EXCLUDED = [
  "the insider lies",
  "the insider is wrong",
  "reporting is illegal",
  "the verifier ignores the report for no reason",
];

export interface WorkedCase {
  id: string;
  /** What kind of failure this one is — the contrast between the two. */
  kicker: string;
  insider: string;
  information: string;
  route: string;
  failure: string;
}

export const WORKED_CASES: WorkedCase[] = [
  {
    id: "corroboration",
    kicker: "The failure is corroboration.",
    insider:
      "A scheduling engineer at a cloud provider, working on the team that allocates accelerator capacity to enterprise customers.",
    information:
      "She saw a single customer account hold 12,000 accelerators in one region for nineteen continuous days, under a contract flagged for research use. The allocation is real and she read it off the systems she administers.",
    route:
      "She files under the provider’s protected-disclosure policy, which permits reporting suspected treaty violations to the national authority, and she does so.",
    failure:
      "The authority can establish that the capacity was held. It cannot establish what ran on it. The workload records belong to the customer, not the provider, and no route obliges the customer to produce them. The report stalls one step short of the activity it alleges.",
  },
  {
    id: "sharing-barrier",
    kicker: "The failure is who may be told.",
    insider:
      "A compliance officer at a chip vendor, responsible for export-control screening.",
    information:
      "He processed a set of shipments whose declared end use does not match the delivered configuration, and the discrepancy is in the file he signed.",
    route:
      "He reports to the national export-control agency, which is the recipient his own law names and protects.",
    failure:
      "The agency believes him and opens its own case. What it cannot do is hand the file to the international verifier: the shipment records are commercially confidential and the agency has no authority to share them across the border. The verifier is told a concern exists and is given nothing it can act on.",
  },
];
