
export type MemoStatus = "specified" | "named" | "unspecified";

export type MemoGenre = "memo" | "map" | "essay" | "redline";

export const memoGenreLabels: Record<MemoGenre, string> = {
  memo: "Memo",
  map: "Map",
  essay: "Essay",
  redline: "Red-line",
};

export interface MemoSlot {
  id: string;
  module: number;
  unit: string;
  title: string;
  status: MemoStatus;
  genre?: MemoGenre;
  lesson: string;
  optional?: boolean;
  brief: string | null;
  audience: string | null;
  words: number;
  peerReviewed: boolean;
  gap?: string;
  criteria?: string[];
}

export const memoSlots: MemoSlot[] = [
  {
    id: "m0-hinge-brief",
    module: 0,
    unit: "0.2",
    title: "Final essay: stress-test Plan A, or Plan A vs. Plan S",
    status: "specified",
    genre: "essay",
    lesson: "intuitions",
    brief:
      "Write one of two open-ended essay prompts, consisting of shorter, prompted questions linking into a more cohesive essay at the end. A: stress-test the Plan A verification supplement — how robust is Plan A's verification regime, and where is it most likely to fail? End on one of three recommendations: adopt largely as written, adopt only with significant amendments, or reject in favor of a different approach (400–600 words). Or B: compare Plan A (verified slowdown) and Plan S (complete shutdown) — which creates the more robust verification regime? Make a recommendation (400–500 words).",
    audience:
      "Decision-makers asking whether the verification regime is strong enough to rely on as written.",
    words: 600,
    peerReviewed: true,
  },
  {
    id: "m0-success-scenario",
    module: 0,
    unit: "0.2",
    title: "Essay: what does success look like to you?",
    status: "specified",
    genre: "essay",
    lesson: "intuitions",
    optional: true,
    brief:
      "Describe your own plausible success scenario for advanced AI governance. Think several steps beyond any single verification mechanism: what does a world that has successfully managed the relevant risks actually look like, and what agreement or institutional arrangement gets us there? Keep this essay. You will return to it at the end of the track and see what, if anything, you would now change.",
    audience: null,
    words: 800,
    peerReviewed: false,
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
    title: "[Optional] Written output",
    status: "unspecified",
    lesson: "scoping-upstream-downstream",
    optional: true,
    brief: null,
    audience: null,
    words: 600,
    peerReviewed: false,
    gap: 'A "[Optional] Written output:" marker sits after the supply-chain actor list with nothing under it.',
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
    unit: "4.1",
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

export function memoSlotsForLesson(lesson: string): MemoSlot[] {
  return memoSlots.filter((slot) => slot.lesson === lesson);
}
