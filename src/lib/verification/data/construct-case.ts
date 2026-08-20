
import type { ConstructedField } from "@/components/verification/kit/constructed-response";

export const CASE_CONDITIONS = [
  "An insider’s report about a prohibited AI activity is accurate.",
  "The insider is legally permitted to report what they know.",
  "The verification regime cannot turn the report into actionable evidence.",
];

export const CASE_FIELDS: readonly ConstructedField[] = [
  {
    id: "insider",
    label: "Insider",
    rows: 2,
  },
  {
    id: "information",
    label: "Information",
    rows: 3,
  },
  {
    id: "route",
    label: "Reporting route",
    rows: 3,
  },
  {
    id: "failure",
    label: "Failure point",
    rows: 3,
  },
];

export const CASE_WORDS = { min: 100, max: 180 };

export const CASE_CHECKLIST = [
  "Is the allegation actually true?",
  "Could this insider plausibly know it?",
  "Is reporting permitted?",
  "Does the verification failure arise from the institution rather than from the allegation being false?",
  "Can you identify the precise missing link between report and action?",
];

export const CASE_EXCLUDED = [
  "the insider lies",
  "the insider is wrong",
  "reporting is illegal",
  "the verifier ignores the report for no reason",
];

export const CASE_FAILURE_MODES = [
  "evidence cannot be independently corroborated",
  "the authorized recipient cannot legally share the information with the verifier",
  "the report identifies a suspicious activity but not the facility or account involved",
  "relevant records are unavailable or outside the verifier’s mandate",
  "the reporting channel strips information needed for follow-up",
];

export interface WorkedCase {
  id: string;
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
