/**
 * Every place the Verification course asks for a written output — the single
 * source for both surfaces. The app renders `<MemoDesk lesson="…"/>` from it
 * at the end of the lesson that owns each one; `npm run verification:memos`
 * generates `public/verification/data/memos.js`, which is what the standalone
 * memo desk reads. Never hand-edit that file.
 *
 * Briefs are the outline's own words, transcribed from
 * "[WIP] Verification Track Outline-2.docx". `status` is the honest part:
 *
 *   specified   - the outline states the assignment; brief, audience and
 *                 length are quoted from it.
 *   named       - the outline names the artifact ("case briefing on actors")
 *                 and nothing else.
 *   unspecified - the outline marks the slot and leaves it blank.
 *
 * Trap: never promote a row by writing the missing brief yourself. A `named`
 * or `unspecified` slot is a content decision for whoever owns the module;
 * the job here is to say so and still let a learner draft into it.
 *
 * `unit` is the outline's own numbering, which is not always a unit the
 * course graph has (1.7, 1.x, 3.x are the outline's, not the graph's). So
 * `lesson` names the body that carries the card outright rather than deriving
 * it — the placement of a slot the outline numbers loosely is a judgement,
 * and a judgement belongs in the data where it can be read and argued with.
 * memos.test.ts checks every one of these is embedded exactly where it says.
 */

export type MemoStatus = "specified" | "named" | "unspecified";

/**
 * The form the desk should dress a slot as. Absent means memo — the desk's
 * default instrument: the audience / decision / falsifier pins, the
 * "recommendation" title, the memo checks. A slot is marked here only when the
 * outline's own title or brief names a different form — a map is annotated
 * rows, not prose; an essay argues a thesis with no recommendation to pin; a
 * red-line marks an article's gaps and redrafts a provision. Read the genre
 * off the author's words; never invent one to tidy a slot up, and leave the
 * ambiguous ones (a bare "written output", the essay/brief/reflection choice)
 * as the memo default rather than guessing. The desk turns the memo-only pins
 * and checks off for the non-memo genres — public/verification/memo-desk.js.
 */
export type MemoGenre = "memo" | "map" | "essay" | "redline";

/** How each genre names itself on the in-lesson card. */
export const memoGenreLabels: Record<MemoGenre, string> = {
  memo: "Memo",
  map: "Map",
  essay: "Essay",
  redline: "Red-line",
};

export interface MemoSlot {
  id: string;
  /** Module number, 0-4. */
  module: number;
  /** The outline's own unit number for this output. */
  unit: string;
  title: string;
  status: MemoStatus;
  /** The form the desk dresses this as; absent = memo (the default). */
  genre?: MemoGenre;
  /** Lesson contentRef basename under src/content/lessons/verification/. */
  lesson: string;
  optional?: boolean;
  /** The outline's brief, verbatim. Null when it never wrote one. */
  brief: string | null;
  audience: string | null;
  /** Word budget the outline sets, or the module anatomy's default. */
  words: number;
  peerReviewed: boolean;
  /** What is missing, stated plainly, on anything short of `specified`. */
  gap?: string;
  /** Review criteria, where the outline lists them. */
  criteria?: string[];
}

/* The outline's module titles. The skill graph names the same five modules
   differently (Foundations, Supply chain, Mechanisms, Evasion, Design);
   these slots are the outline's, so they carry the outline's names. */
export const memoModules = [
  "Why Verification?",
  "Actors",
  "Verification Infrastructure",
  "Scheming and Evasion",
  "Trust Without Trust",
];

export const memoSlots: MemoSlot[] = [
  {
    id: "m0-hinge-brief",
    module: 0,
    unit: "0.2",
    title: "Brief, or scoping memo",
    status: "specified",
    lesson: "intuitions",
    brief:
      "Either a one-to-two page brief for a nontechnical reader arguing that verification, not treaty text, is the hinge of any anti-ASI policy, or a scoping memo recommending one policy bucket to a named decision-maker with the costs stated plainly.",
    audience: "A nontechnical reader, or a named decision-maker.",
    words: 800,
    peerReviewed: true,
  },
  {
    id: "m0-compliance-under-anarchy",
    module: 0,
    unit: "0.3.2",
    title: "Compliance under anarchy",
    status: "unspecified",
    /* Re-parked when 0.3.1 was deleted. This was never 0.3.1's own output —
       0.3.2 is not a lesson the graph has, so the marker was parked on the
       last lesson of 0.3, and 0.3 itself is that lesson now. Deleting the
       section is not a decision to drop a written output the outline asks
       for, so it moves rather than going with it. */
    lesson: "precedents",
    brief: null,
    audience: null,
    words: 800,
    peerReviewed: false,
    gap: 'The outline carries a "Written output:" marker at the end of 0.3.2 and leaves it empty.',
  },
  {
    id: "m1-stakeholder-map",
    module: 1,
    unit: "1.0",
    title: "Stakeholder map",
    status: "specified",
    genre: "map",
    lesson: "scoping-effective-feasible",
    brief:
      "For a hypothetical pause treaty, place every relevant actor on the supply chain, annotate each with its most likely incentive class and the leverage it holds, and mark the two or three actors whose defection would collapse the regime.",
    audience: "The drafting team for a hypothetical pause treaty.",
    words: 800,
    peerReviewed: true,
  },
  {
    id: "m1-case-briefing",
    module: 1,
    unit: "1.7",
    title: "Case briefing on actors",
    status: "named",
    lesson: "scoping-upstream-downstream",
    brief: null,
    audience: null,
    words: 600,
    peerReviewed: false,
    gap: "Named in the module timing table as a 15–20 minute written exercise. No brief, audience or rubric is drafted.",
  },
  {
    id: "m1-actor-authority-evidence",
    module: 1,
    unit: "1.x",
    title: "Actor–authority–evidence map",
    status: "named",
    genre: "map",
    lesson: "scoping-upstream-downstream",
    brief: "Actor–authority–evidence map for any element of the supply chain.",
    audience: null,
    words: 700,
    peerReviewed: false,
    gap: "The artifact is named; length, audience and review criteria are not drafted.",
  },
  {
    id: "m1-optional",
    module: 1,
    unit: "1.x",
    title: "Optional written output",
    status: "unspecified",
    lesson: "scoping-upstream-downstream",
    optional: true,
    brief: null,
    audience: null,
    words: 600,
    peerReviewed: false,
    gap: 'An "[Optional written output]:" marker sits after the supply-chain actor list with nothing under it.',
  },
  {
    id: "m2-1-hardware-brief",
    module: 2,
    unit: "2.1",
    title: "Hardware assurance brief",
    status: "specified",
    lesson: "hardware-policy-studio",
    brief:
      "A bounded hardware assurance brief. The point is not forecasting the correct future — it is making the assessment conditional on visible facts: coverage, fidelity, time to deployment, and the preferred corroborating layer.",
    audience:
      "A named national delegation or joint drafting session considering a three-month U.S.–China pause.",
    words: 1000,
    peerReviewed: false,
  },
  {
    id: "m2-2-cloud",
    module: 2,
    unit: "2.2",
    title: "Essay, brief or reflection",
    status: "named",
    lesson: "cloud",
    brief: null,
    audience: null,
    words: 800,
    peerReviewed: false,
    gap: "The outline offers the choice of genre — essay, brief or reflection — and stops there.",
  },
  {
    id: "m2-3-ntm-redline",
    module: 2,
    unit: "2.3",
    title: "Red-line the NTM article",
    status: "specified",
    genre: "redline",
    lesson: "intelligence-action",
    brief:
      "Work from the verbatim MIRI text you annotated in 2.3.4: Definition 17 plus the noninterference and no-deliberate-concealment articles. Mark at least three gaps or ambiguities, starting from your four answers if you like, and redraft the one provision whose failure you judge most consequential. Then confront the question the historical record says drafters avoid: write the sharing clause the text lacks, or defend its absence in three sentences. Test whatever you write against 2.3.4’s rule, that states sign what is symmetric, cheap, and checkable, and finish with the both-capitals test: one paragraph on why Washington accepts your article, one on why Beijing does.",
    audience: "The drafters of a US–China agreement, read in both capitals.",
    words: 700,
    peerReviewed: true,
    criteria: [
      "Fidelity to what signatures can actually establish",
      "Precedent-consistent language",
      "Honesty about sharing",
      "Plausibility in both capitals",
      "Named blind spots, each with the sibling mechanism that covers it",
    ],
  },
  {
    id: "m2-4-analytical-essay",
    module: 2,
    unit: "2.4",
    title: "Analytical essay",
    status: "named",
    genre: "essay",
    lesson: "human-institutions",
    brief: null,
    audience: null,
    words: 1000,
    peerReviewed: false,
    gap: "Named at the close of the human-layer section. No prompt, audience or rubric is drafted.",
  },
  {
    id: "m2-4-audit-law",
    module: 2,
    unit: "2.4",
    title: "Brief or memo on the audit-requirement situation",
    status: "named",
    lesson: "human-institutions",
    optional: true,
    brief:
      "Optional. A brief or memo on the SB-53 and SB-1047 audit-requirement situation — or, instead, an analytical essay on what the laws currently cover, compared against the crypto wars or bioweapons.",
    audience: null,
    words: 800,
    peerReviewed: false,
    gap: "Offered as one of two alternatives in a working note; neither is scoped.",
  },
  {
    id: "m2-4-optional",
    module: 2,
    unit: "2.4",
    title: "Optional written output",
    status: "unspecified",
    lesson: "human-institutions",
    optional: true,
    brief: null,
    audience: null,
    words: 600,
    peerReviewed: false,
    gap: 'An "[Optional written output]:" marker sits after 2.4.4 with nothing under it.',
  },
  {
    id: "m3-written-output",
    module: 3,
    unit: "3.x",
    title: "Written output",
    status: "unspecified",
    lesson: "covert-system-overview",
    brief: null,
    audience: null,
    words: 800,
    peerReviewed: true,
    gap: "The track’s module anatomy gives every module one written output that goes through peer review. Module 3 is the one module for which the outline never says which.",
  },
  {
    id: "m4-0-ranking-memo",
    module: 4,
    unit: "4.0",
    title: "Defended-ranking memo",
    status: "specified",
    lesson: "capstone-feasibility",
    brief:
      "Produce the defended-ranking memo: a recommended mechanism portfolio for one named policy goal, with residual blind spots and their owners — the artifact the 4.2 capstone receives. Defend the ranking against both your own initial guesses and the field’s published ratings.",
    audience:
      "Whoever acts on the 4.2 capstone — the portfolio is handed forward, not filed.",
    words: 900,
    peerReviewed: true,
    criteria: ["Peer review against the rubric"],
  },
];

/** Every written output owed by one lesson, in outline order. */
export function memoSlotsForLesson(lesson: string): MemoSlot[] {
  return memoSlots.filter((slot) => slot.lesson === lesson);
}
