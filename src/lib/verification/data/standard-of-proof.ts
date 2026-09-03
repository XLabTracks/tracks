
export const PROOF_ALLEGATION =
  "Meridian Compute ran a training run above the agreement’s compute ceiling at its Delta campus in the third quarter.";

export const PROOF_INTRO =
  "One allegation, received four times. Each case below pairs the evidence an institution has in front of it with the institution that has to act on it.";
export const PROOF_TASK_LEAD =
  "For each case, choose the institution’s next step from the four options. Then justify the choice in three parts:";
export const PROOF_TASKS = [
  "what the evidence establishes, and which kind of evidence does that work;",
  "what it does not establish;",
  "whether this institution can defend the step you chose.",
];
export const PROOF_LIMIT = "Use about 60–90 words per case.";

export const PROOF_MOVES = [
  { id: "collect", label: "Record and keep collecting" },
  { id: "investigate", label: "Open a formal investigation" },
  { id: "judge", label: "Issue a compliance judgment" },
  { id: "enforce", label: "Refer for enforcement" },
] as const;
export type ProofMoveId = (typeof PROOF_MOVES)[number]["id"];

export interface ProofCase {
  id: string;
  letter: string;
  title: string;
  institution: string;
  evidence: string[];
}

export const PROOF_CASES: ProofCase[] = [
  {
    id: "lone-report",
    letter: "A",
    title: "The lone report",
    institution:
      "The treaty’s verification directorate holds the case. Its access rights, funding and staffing are not in question.",
    evidence: [
      "A former Meridian scheduling engineer reports that Delta’s main cluster ran one uninterrupted job for six weeks of the third quarter.",
      "The report came through the treaty’s protected channel and is internally consistent.",
      "Nothing else has been collected.",
    ],
  },
  {
    id: "converging",
    letter: "B",
    title: "Converging evidence",
    institution:
      "The same directorate, on the same footing.",
    evidence: [
      "The engineer’s report from case A.",
      "Customs records show Meridian imported accelerators well above its declared inventory in the second quarter.",
      "Grid-operator telemetry puts Delta’s power draw far above the level its declaration supports, for the same six weeks.",
      "Meridian declined the quarter’s scheduled managed-access visit and offered no alternative means.",
    ],
  },
  {
    id: "channelled",
    letter: "C",
    title: "A single channel",
    institution:
      "The directorate has no access rights at Delta. Everything it knows arrives through one channel: an audit Meridian commissioned itself, delivered as a summary with the underlying records withheld.",
    evidence: [
      "The commissioned audit concludes that no ceiling-relevant run took place.",
      "A facilities contractor’s tip contradicts the audit. It is uncorroborated.",
      "The directorate’s requests for the audit’s working papers have gone unanswered.",
    ],
  },
  {
    id: "compromised",
    letter: "D",
    title: "The compromised panel",
    institution:
      "The panel that must issue any judgment is funded through the industry association Meridian chairs, and two of its five members are on leave from Meridian’s suppliers.",
    evidence: [
      "Telemetry, procurement records and two independent insider reports all point the same way.",
      "Meridian has cooperated with every access request.",
    ],
  },
];

export const PROOF_SELF_CHECK_LEAD =
  "For each case, check your answer against two questions:";
export const PROOF_SELF_CHECK = [
  "Did the step you chose match what that case’s evidence currently supports?",
  "Where the institution was the weak part, did your step repair the institution rather than reweigh the evidence?",
];

export const PROOF_REVEAL_GRID =
  "The four cases form a 2×2 grid that was not shown to you: strength of evidence on one axis, soundness of the institution on the other. Cases A and B vary the evidence while the institution is sound; cases C and D vary the institution.";

export const PROOF_FINAL =
  "In no more than 50 words, state the decision rule you applied: what separated the cases you would investigate from the cases you would judge or refer?";
export const PROOF_FINAL_MAX_WORDS = 50;

export const PROOF_TRANSFER =
  "Take the case whose institution you trusted least. Name one structural change that would make its judgment defensible, and state which property the change repairs: independence, competence, accountability, authority, or access.";
