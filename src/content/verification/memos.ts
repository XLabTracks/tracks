import { verificationExercises } from "@/content/verification/exercises";
import { isWritingExercise, type WritingExercise } from "@/lib/content/types";

export type MemoStatus = "specified" | "named" | "unspecified";

export type MemoGenre = "memo" | "map" | "essay" | "redline";

export const memoGenreLabels: Record<MemoGenre, string> = {
  memo: "Memo",
  map: "Map",
  essay: "Essay",
  redline: "Red-line",
};

export interface MemoStep {
  task: string;
  title: string;
}

export interface MemoSlot {
  id: string;
  module: number;
  unit: string;
  title: string;
  status: MemoStatus;
  genre?: MemoGenre;
  lesson: string;
  task?: string;
  steps?: MemoStep[];
  href?: string;
  optional?: boolean;
  brief: string | null;
  audience: string | null;
  words: number;
  gap?: string;
  criteria?: string[];
}

export const memoModules = [
  "Why Verification?",
  "Actors",
  "Verification Infrastructure",
  "Scheming and Evasion",
  "Trust Without Trust",
];

export const memoSlots: MemoSlot[] = [
  {
    id: "m0-welcome-note",
    module: 0,
    unit: "0.0",
    title: "A Short Note to Look Back On After the Course",
    status: "specified",
    lesson: "welcome",
    task: "v-task-welcome-1",
    optional: true,
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m0-strongest-objection",
    module: 0,
    unit: "0.1",
    title: "The Strongest Objection",
    status: "specified",
    lesson: "introduction",
    task: "v-task-introduction-1",
    optional: true,
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m0-hinge-brief",
    module: 0,
    unit: "0.2",
    title: "Essay A: Stress-Test Plan A",
    status: "specified",
    genre: "essay",
    lesson: "intuitions",
    steps: [
      { task: "v-task-intuitions-5", title: "A1. Identify the Regime's Strongest Mechanism or Recommendation" },
      { task: "v-task-intuitions-6", title: "A2. Identify the Regime's Weakest Link(s)" },
      { task: "v-task-intuitions-7", title: "A3. Stress-Test the Timeline" },
      { task: "v-task-intuitions-8", title: "A4. Assess the Covert-Compute Margin" },
      { task: "v-task-intuitions-9", title: "A5. Final Essay" },
    ],
    brief:
      "Stress-test the Plan A verification supplement — how robust is Plan A's verification regime, and where is it most likely to fail? Four prompted questions lead into the final essay, which ends on one of three recommendations: adopt largely as written, adopt only with significant amendments, or reject in favor of a different approach (400–600 words).",
    audience:
      "Decision-makers asking whether the verification regime is strong enough to rely on as written.",
    words: 600,
  },
  {
    id: "m0-plan-a-vs-s",
    module: 0,
    unit: "0.2",
    title: "Essay B: Plan A vs. Plan S",
    status: "specified",
    genre: "essay",
    lesson: "intuitions",
    steps: [
      { task: "v-task-intuitions-10", title: "B1. Which Plan Gives Verification the More Tractable Target?" },
      { task: "v-task-intuitions-11", title: "B2. Which Plan Could Provide Stronger Evidence of Compliance?" },
      { task: "v-task-intuitions-12", title: "B3. Which Plan Creates the Harder Monitoring Problem?" },
      { task: "v-task-intuitions-13", title: "B4. Which Regime Could States Actually Cooperate On?" },
      { task: "v-task-intuitions-14", title: "B5. Final Essay" },
    ],
    brief:
      "Compare Plan A (verified slowdown) and Plan S (complete shutdown) — which creates the more robust verification regime? Four prompted questions lead into the final essay, which makes a recommendation (400–500 words).",
    audience:
      "Decision-makers asking whether the verification regime is strong enough to rely on as written.",
    words: 500,
  },
  {
    id: "m0-success-scenario",
    module: 0,
    unit: "0.2",
    title: "Essay: What Does Success Look Like to You?",
    status: "specified",
    genre: "essay",
    lesson: "intuitions",
    task: "v-task-intuitions-2",
    optional: true,
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m0-explore-ai-2027",
    module: 0,
    unit: "0.2",
    title: "Explore AI 2027",
    status: "specified",
    lesson: "intuitions",
    task: "v-task-intuitions-3",
    optional: true,
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m1-actor-authority-evidence",
    module: 0,
    unit: "0.4",
    title: "Actor–Authority–Evidence Map",
    status: "specified",
    genre: "map",
    lesson: "strategic-foundations",
    task: "v-task-strategic-foundations-1",
    optional: true,
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m1-stakeholder-map",
    module: 1,
    unit: "1.0",
    title: "Stakeholder Map",
    status: "specified",
    genre: "map",
    lesson: "scoping-effective-feasible",
    brief:
      "For a hypothetical pause treaty, place every relevant actor on the supply chain, annotate each with its most likely incentive class and the leverage it holds, and mark the two or three actors whose defection would collapse the regime.",
    audience: "The drafting team for a hypothetical pause treaty.",
    words: 800,
  },
  {
    id: "m1-case-briefing",
    module: 1,
    unit: "1.7",
    title: "Case Briefing on Actors",
    status: "named",
    lesson: "scoping-upstream-downstream",
    brief: null,
    audience: null,
    words: 600,
    gap: "Named in the module timing table as a 15–20 minute written exercise. No brief, audience or rubric is drafted.",
  },
  {
    id: "m2-1-chip-security-act",
    module: 2,
    unit: "2.1",
    title: "Break Down the Chip Security Act",
    status: "specified",
    lesson: "hardware-claim",
    task: "v-hw-claim-chip-security",
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m2-1-hardware-brief",
    module: 2,
    unit: "2.1",
    title: "Hardware Assurance Brief",
    status: "specified",
    lesson: "hardware-policy-studio",
    brief:
      "A bounded hardware assurance brief. The point is not forecasting the correct future — it is making the assessment conditional on visible facts: coverage, fidelity, time to deployment, and the preferred corroborating layer.",
    audience:
      "A named national delegation or joint drafting session considering a three-month U.S.–China pause.",
    words: 1000,
  },
  {
    id: "m2-3-osint-guess",
    module: 2,
    unit: "2.3",
    title: "What Signs Can We Catch With Open-Source Data?",
    status: "specified",
    lesson: "intelligence-osint",
    task: "v-intel-osint-guess",
    optional: true,
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m2-3-osint-colossus",
    module: 2,
    unit: "2.3",
    title: "Open-Source Intelligence Exercise",
    status: "specified",
    lesson: "intelligence-osint",
    task: "v-intel-osint-fas",
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m2-3-imagery-al-kibar",
    module: 2,
    unit: "2.3",
    title: "Imagery and Geospatial Intelligence Exercise",
    status: "specified",
    lesson: "intelligence-imagery",
    task: "v-intel-imagery-al-kibar",
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m2-3-finint-smuggling",
    module: 2,
    unit: "2.3",
    title: "Financial and Procurement Intelligence Exercise",
    status: "specified",
    lesson: "intelligence-finint",
    task: "v-intel-finint-smuggling",
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m2-3-cyber-uses",
    module: 2,
    unit: "2.3",
    title: "Signals and Cyber Intelligence Exercise",
    status: "specified",
    lesson: "intelligence-cyber",
    task: "v-intel-cyber-uses",
    brief: null,
    audience: null,
    words: 0,
  },
  {
    id: "m2-3-intel-overview",
    module: 2,
    unit: "2.3",
    title: "What We Can See Today",
    status: "specified",
    genre: "memo",
    lesson: "intelligence-action",
    brief:
      "The question: if a state were covertly training a frontier model right now, what could outside observers actually see? Write an overview a decision-maker can read in ten minutes. Cover each mechanism that exists today — overhead and thermal imagery, power and grid analysis, procurement, customs and financial tracking, open sources, human sources — with one sentence on what it establishes and one on what defeats it. Research is part of the task: find at least three public artifacts from the last two years yourself (a commercial satellite product, an enforcement action, a public tracker or filing) and cite each with a link. Open with the bottom line: the two mechanisms you would rely on most, and why. Close with the blind spot that concerns you most and the other verification layer that covers it. Do not draft treaty language: the question is what can be seen, not what should be signed.",
    audience:
      "A policymaker trying to understand what we can actually track, and what we cannot.",
    words: 900,
    criteria: [
      "Accuracy about what each mechanism can establish",
      "Currency: public artifacts from the last two years, found and cited with links",
      "Limits stated as the papers state them: the layer reduces cheating and does not defeat it",
      "A prioritization with reasons, not a list of mechanisms",
      "Named blind spots, each with the mechanism elsewhere in the course that covers it",
    ],
  },
  {
    id: "m3-written-output",
    module: 3,
    unit: "3.x",
    title: "Written Output",
    status: "unspecified",
    lesson: "covert-system-overview",
    brief: null,
    audience: null,
    words: 800,
    gap: "The track’s module anatomy gives every module one written output. Module 3 is the one module for which the outline never says which.",
  },
  {
    id: "m4-0-ranking-memo",
    module: 4,
    unit: "4.1",
    title: "Defended-Ranking Memo",
    status: "specified",
    lesson: "capstone-feasibility",
    brief:
      "Produce the defended-ranking memo: a recommended mechanism portfolio for one named policy goal, with residual blind spots and their owners — the artifact the 4.2 capstone receives. Defend the ranking against both your own initial guesses and the field’s published ratings.",
    audience:
      "Whoever acts on the 4.2 capstone — the portfolio is handed forward, not filed.",
    words: 900,
    criteria: ["Judged against the rubric"],
  },
  {
    id: "m4-capstone",
    module: 4,
    unit: "4.2",
    title: "Capstone Project",
    status: "specified",
    lesson: "capstone-project",
    href: "/verification/capstone",
    brief:
      "One piece of work that shows what you have learned, applied to a problem you chose. There is no assigned task: choose a brief from the capstone bank, or suggest your own — it has to be relevant to technical AI governance and aimed at an AI-safety-related theme. Either way, put your name on the sign-up sheet, so your facilitator knows what you are working on and can read your proposal. The workspace holds the track’s own capstone template: design a minimal verification regime for a three-month emergency pause, then break it yourself.",
    audience: null,
    words: 0,
  },
];

export function memoSlotsForLesson(lesson: string): MemoSlot[] {
  return memoSlots.filter((slot) => slot.lesson === lesson);
}

export function memoDeskSlotsForLesson(lesson: string): MemoSlot[] {
  return memoSlotsForLesson(lesson).filter(
    (slot) => !slot.task && !slot.steps && !slot.href,
  );
}

export function memoSlotTasks(slot: MemoSlot): MemoStep[] {
  if (slot.steps) return slot.steps;
  return slot.task ? [{ task: slot.task, title: slot.title }] : [];
}

const writingById = new Map<string, WritingExercise>(
  verificationExercises
    .filter(isWritingExercise)
    .map((exercise) => [exercise.id, exercise]),
);

export function memoTaskExercise(task: string): WritingExercise | undefined {
  return writingById.get(task);
}
