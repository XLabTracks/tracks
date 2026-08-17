/**
 * 2.4.4 — The Standard of Proof.
 *
 * THE BRIEF IS THE OWNER'S (2026-08-15): one optional, 15-minute exercise
 * that closes all four of 2.4.4's objectives — the five institutional
 * properties, the four forms of capture, human-vs-technical evidence, and
 * the decision standard (investigate / compliance judgment / enforcement).
 * The design was agreed in-session: a 2×2 the learner is never shown —
 * evidence weight × institutional soundness — read off four dockets that
 * sit on one page, one allegation over all of them. The learner picks the
 * institution's next move per docket and defends it; the reveal names the
 * grid.
 *
 * The division of labour with the section's readings is deliberate:
 * Brundage et al. carries the institutional-property vocabulary — Access
 * and Independent Experts especially — so dockets C and D are built as
 * violations of exactly those two principles, and the marking key names
 * them. Carlson's "Defining Noncompliance" (added 2026-08-15, her call,
 * after her audit found Brundage carries no authority/accountability and
 * no decision operation) carries the real regime's version of the moves
 * menu: inspectors find, the Board judges, the Security Council enforces,
 * and a standard of proof separates a breach from a noncompliance finding.
 * The dockets are where the learner runs that operation themselves; the
 * human/technical distinction is theirs to make on the evidence lines.
 *
 * WHAT IS MINE AND PENDING HER COPY: every docket, the marking key, and
 * the closing questions. Meridian and its Delta campus are fictional and
 * deliberately unlike the module's Project Cedar case. Her mechanics
 * throughout: nothing classified for the learner before submission, the
 * move selection is never marked right or wrong, all four dockets visible
 * together, freeze on submit, reveal after.
 */

export const PROOF_ALLEGATION =
  "Meridian Compute ran a training run above the agreement’s compute ceiling at its Delta campus in the third quarter.";

/** The intro, olympiad registers: statement → demands → limit. */
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

/** The four moves, in rising order of commitment. A selection, never a quiz. */
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
  /** Who holds the docket, and on what footing. */
  institution: string;
  /** Plain lines, deliberately untagged: sorting what is human, what is
   *  technical, and what each can carry is the learner's work. */
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

/** Shown after submission, before the marking key. */
export const PROOF_SELF_CHECK_LEAD =
  "For each docket, compare your answer against two questions:";
export const PROOF_SELF_CHECK = [
  "Did the move you chose match what that docket’s evidence currently supports?",
  "Where the institution was the weak part, did your move repair the institution rather than reweigh the evidence?",
];

/** The grid, named only in the reveal. */
export const PROOF_REVEAL_GRID =
  "The four dockets were a 2×2 you were never shown: evidence weight on one axis, institutional soundness on the other. A and B varied the evidence under a sound institution; C and D varied the institution.";

export const PROOF_FINAL =
  "In no more than 50 words, state the decision standard you actually applied: what separated the dockets you would investigate from any docket you would judge or refer?";
export const PROOF_FINAL_MAX_WORDS = 50;

export const PROOF_TRANSFER =
  "Take the docket whose institution you trusted least. Name one structural change that would make its judgment defensible, and say which property it repairs: independence, competence, accountability, authority, or access.";
