
export const PROOF_ALLEGATION =
  "Meridian Compute ran a training run above the agreement’s compute ceiling at its Delta campus in the third quarter.";

export const PROOF_INTRO =
  "One allegation. Four dockets — the evidence in front of an institution, and the institution holding it.";
export const PROOF_TASK_LEAD =
  "For each docket, choose the institution’s next move. Then defend it:";
export const PROOF_TASKS = [
  "what the docket establishes, and what kind of evidence does that work;",
  "what it does not establish;",
  "whether this institution can defend the move you chose.",
];
export const PROOF_LIMIT = "Use about 60–90 words per docket.";

export const PROOF_MOVES = [
  { id: "collect", label: "Record and keep collecting" },
  { id: "investigate", label: "Open a formal investigation" },
  { id: "judge", label: "Issue a compliance judgment" },
  { id: "enforce", label: "Refer for enforcement" },
] as const;
export type ProofMoveId = (typeof PROOF_MOVES)[number]["id"];

export interface ProofDocket {
  id: string;
  letter: string;
  title: string;
  institution: string;
  evidence: string[];
}

export const PROOF_DOCKETS: ProofDocket[] = [
  {
    id: "lone-report",
    letter: "A",
    title: "The lone report",
    institution:
      "The treaty’s verification directorate holds the docket. Its access rights, funding and staffing are not in question.",
    evidence: [
      "A former Meridian scheduling engineer reports that Delta’s main cluster ran one uninterrupted job for six weeks of the third quarter.",
      "The report came through the treaty’s protected channel and is internally consistent.",
      "Nothing else has been collected.",
    ],
  },
  {
    id: "converging",
    letter: "B",
    title: "The converging docket",
    institution:
      "The same directorate, on the same footing.",
    evidence: [
      "The engineer’s report from docket A.",
      "Customs records show Meridian imported accelerators well above its declared inventory in the second quarter.",
      "Grid-operator telemetry puts Delta’s power draw far above the level its declaration supports, for the same six weeks.",
      "Meridian declined the quarter’s scheduled managed-access visit and offered no alternative means.",
    ],
  },
  {
    id: "channelled",
    letter: "C",
    title: "The channelled docket",
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
  "For each docket, compare your answer against two questions:";
export const PROOF_SELF_CHECK = [
  "Did the move you chose match what that docket’s evidence currently supports?",
  "Where the institution was the weak part, did your move repair the institution rather than reweigh the evidence?",
];

export const PROOF_REVEAL_GRID =
  "The four dockets were a 2×2 you were never shown: evidence weight on one axis, institutional soundness on the other. A and B varied the evidence under a sound institution; C and D varied the institution.";

export const PROOF_FINAL =
  "In no more than 50 words, state the decision standard you actually applied: what separated the dockets you would investigate from any docket you would judge or refer?";
export const PROOF_FINAL_MAX_WORDS = 50;

export const PROOF_TRANSFER =
  "Take the docket whose institution you trusted least. Name one structural change that would make its judgment defensible, and say which property it repairs: independence, competence, accountability, authority, or access.";
