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
    steps: [
      {
        task: "v-hw-claim-chip-security",
        title: "What policy goal does the proposal seek to advance, and what obligations would it creat…",
      },
      {
        task: "v-hw-claim-chip-security-2",
        title: "Formulate a verification claim about the location of a covered product",
      },
      {
        task: "v-hw-claim-chip-security-3",
        title: "Would establishing that location claim be sufficient to establish that the policy goal…",
      },
    ],
    brief:
      "1. **What policy goal does the proposal seek to advance, and what obligations would it create?** Identify who would be required to do what. Support your answer with references to the source.\n\n2. **Formulate a verification claim about the location of a covered product.** Specify what would need to be established and the time covered. Identify any detail your formulation requires that the excerpt leaves unspecified.\n\n3. **Would establishing that location claim be sufficient to establish that the policy goal had been achieved?** Explain your answer with a concrete example.",
    audience: null,
    words: 0,
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
    id: "m2-3-debates",
    module: 2,
    unit: "2.3",
    title: "The Debates",
    status: "specified",
    lesson: "intelligence-action",
    task: "v-intel-debates",
    optional: true,
    brief: null,
    audience: null,
    words: 0,
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
  {
    id: "m2-1-attestation",
    module: 2,
    unit: "2.1",
    title: "Hardware Attestation Exercise",
    status: "specified",
    lesson: "hardware-trusted-statement",
    steps: [
      {
        task: "v-hw-trusted-statement-appraise",
        title: "Scope of the Result",
      },
      {
        task: "v-hw-trusted-statement-roles",
        title: "Roles",
      },
      {
        task: "v-hw-trusted-statement-permission",
        title: "Recognition, Identity, and Permission",
      },
      {
        task: "v-hw-trusted-statement-anomaly",
        title: "An Anomaly and a Follow-Up",
      },
    ],
    brief:
      "1. Does the Attestation Result support the operator's conclusion? State the strongest claim it does support.\n2. Identify the Attester, Verifier, Reference Value Provider, Relying Party, and regulatory-response actor.\n3. At noon NVIDIA publishes a signed reference manifest for stack G. Device identity certificates remain valid, and the regulator continues to permit stack F until Friday. Explain what each fact establishes and how the inspectorate should assess a fresh report from a GPU still running F.\n4. Separate power records show consumption above the operator's estimate for the eight declared GPUs. How should this affect the inspectorate's assessment? Propose one follow-up check and explain what it could establish.",
    audience: null,
    words: 0,
  },
  {
    id: "m2-1-accounting",
    module: 2,
    unit: "2.1",
    title: "Fleet Reconciliation Exercise",
    status: "specified",
    lesson: "hardware-accounting",
    steps: [
      {
        task: "v-hw-accounting-reconcile",
        title: "What does the packet establish about the whereabouts of the 80 registered devices?",
      },
      {
        task: "v-hw-accounting-reconcile-2",
        title: "Evaluate the operator's conclusion sentence by sentence",
      },
      {
        task: "v-hw-accounting-reconcile-3",
        title: "Choose two follow-up checks, identify the actor or record-holder from wh",
      },
      {
        task: "v-hw-accounting-reconcile-4",
        title: "Return to your location claim from 2.1.1",
      },
    ],
    brief:
      "1. What does the packet establish about the whereabouts of the 80 registered devices? Support your answer with the supplied records and calculations.\n2. Evaluate the operator's conclusion sentence by sentence. Write a replacement finding no broader than the evidence warrants.\n3. Choose two follow-up checks, identify the actor or record-holder from whom each would obtain evidence, and explain what uncertainty each could reduce.\n4. Return to your location claim from 2.1.1. Propose one change to the verification procedure and explain how it would affect your assessment of that claim.",
    audience: null,
    words: 0,
  },
  {
    id: "m2-1-measuring",
    module: 2,
    unit: "2.1",
    title: "Compute and Classification Exercise",
    status: "specified",
    lesson: "hardware-measuring-use",
    steps: [
      {
        task: "v-hw-measuring-job-j",
        title: "Calculate the range of job J’s total compute supported by the packet",
      },
      {
        task: "v-hw-measuring-job-j-2",
        title: "Evaluate the operator’s use of the classifier and authorization",
      },
      {
        task: "v-hw-measuring-job-j-3",
        title: "A separate classifier evaluation produces the results in the table above",
      },
      {
        task: "v-hw-measuring-job-j-4",
        title: "The team proposes signing classifier outputs and increasing the frequency of classifica…",
      },
    ],
    brief:
      "**1.** Calculate the range of job J’s total compute supported by the packet. Explain what that range establishes about the threshold, assuming J is a covered training run.\n\n**2.** Evaluate the operator’s use of the classifier and authorization. Identify what additional evidence would be needed to decide whether the authorization covers the actual work.\n\n**3.** A separate classifier evaluation produces the results in the table above. Calculate overall accuracy, precision, recall, and the fraction of training windows that were missed. What conclusions about job J, if any, can be drawn from these evaluation results? Justify your answer.\n\n**4.** The team proposes signing classifier outputs and increasing the frequency of classification. Recommend two further changes that would most improve the basis for a compliance decision in this case. For each, identify the uncertainty addressed and the evidence or system property needed. Then rewrite the pause verification claim from 2.1.1 so that its unit and aggregation boundary are explicit, and state separately what your procedure does with a run whose evidence cannot resolve it.",
    audience: null,
    words: 0,
  },
  {
    id: "m2-1-authorization",
    module: 2,
    unit: "2.1",
    title: "Licensing and Suspension Exercise",
    status: "specified",
    lesson: "hardware-authorization",
    steps: [
      {
        task: "v-hw-authorization-suspension",
        title: "How much further computation could the installed tokens enable after noon?",
      },
      {
        task: "v-hw-authorization-suspension-2",
        title: "What, if anything, does the rate information establish about 17:00?",
      },
      {
        task: "v-hw-authorization-suspension-3",
        title: "Suppose review later finds that the suspension was mistaken, but a separate investigati…",
      },
      {
        task: "v-hw-authorization-suspension-4",
        title: "Recommend two changes to the licensing arrangement",
      },
    ],
    brief:
      "**1. How much further computation could the installed tokens enable after noon?** Compare your answer with the permit and the director’s statement.\n\n**2. What, if anything, does the rate information establish about 17:00?** State the extra conditions needed for a deadline-based stopping claim. Rewrite the first three sentences of the announcement as a bounded, evidence-supported statement.\n\n**3. Suppose review later finds that the suspension was mistaken, but a separate investigation confirms that the issuer’s signing key was stolen.** Assess the director’s proposed remedy in light of these findings. What would be required to resume operation?\n\n**4. Recommend two changes to the licensing arrangement.** Explain how each addresses a problem revealed by the case and identify a cost or risk of implementing it. Limit your answer to 180 words.",
    audience: null,
    words: 0,
  },
  {
    id: "m2-1-architecture",
    module: 2,
    unit: "2.1",
    title: "Verification Architecture Exercise",
    status: "specified",
    lesson: "hardware-where-trust-lives",
    steps: [
      {
        task: "v-hw-trust-three-reports",
        title: "Classify components A–C using the architectural families introduced in the lesson",
      },
      {
        task: "v-hw-trust-three-reports-2",
        title: "Identify two dependencies that could undermine more than one reported assurance",
      },
      {
        task: "v-hw-trust-three-reports-3",
        title: "Recommend two changes for the pilot, in no more than 180 words",
      },
      {
        task: "v-hw-trust-three-reports-4",
        title: "Write one question each for the operator, inspectorate, and a state that distrusts V",
      },
    ],
    brief:
      "**1. Classify components A–C using the architectural families introduced in the lesson.** Justify each classification by describing where its evidence originates.\n\n**2. Identify two dependencies that could undermine more than one reported assurance.** For each, explain what could go wrong and what evidence, if any, would remain useful.\n\n**3. Recommend two changes for the pilot, in no more than 180 words.** One must improve evidence independence; the other must make the architecture more acceptable to the monitored party. Name an integration or operating cost and a residual blind spot. Do not assume you may replace every accelerator or publish raw workloads.\n\n**4. Write one question each for the operator, inspectorate, and a state that distrusts V.** Then rewrite the supplier’s conclusion in no more than two sentences. Separate what is established by the packet from what would require successful testing of the proposed changes.",
    audience: null,
    words: 0,
  },
  {
    id: "m2-1-training-claims",
    module: 2,
    unit: "2.1",
    title: "Training-Claim Audit Exercise",
    status: "specified",
    lesson: "hardware-reconstructing-run",
    steps: [
      {
        task: "v-hw-training-claims-audit",
        title: "Assess the developer’s claim using the audit results",
      },
      {
        task: "v-hw-training-claims-audit-2",
        title: "Compare the two audit budgets",
      },
      {
        task: "v-hw-training-claims-audit-3",
        title: "Recommend a next step in no more than 180 words",
      },
    ],
    brief:
      "**1. Assess the developer’s claim using the audit results.** Support your assessment with specific details from the packet.\n\n**2. Compare the two audit budgets.** Calculate replay GPU-hours and their percentage of the claimed run’s compute for 20 and 100 checks. Use the probability table to explain what the larger budget buys.\n\n**3. Recommend a next step in no more than 180 words.** Identify an implementation or confidentiality cost and rewrite the developer’s conclusion as a bounded claim. You may disagree with increasing the sample; justify the priority you choose.",
    audience: null,
    words: 0,
  },
  {
    id: "m2-1-measuring-critique",
    module: 2,
    unit: "2.1",
    title: "Optional: Reading a Research Claim",
    status: "specified",
    lesson: "hardware-measuring-use",
    task: "v-hw-measuring-paper-critique",
    optional: true,
    brief: null,
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

export function memoCardSlotsForLesson(lesson: string): MemoSlot[] {
  return memoSlotsForLesson(lesson).filter((slot) => !slot.task && !slot.steps);
}

export function memoSlotTasks(slot: MemoSlot): MemoStep[] {
  if (slot.steps) return slot.steps;
  return slot.task ? [{ task: slot.task, title: slot.title }] : [];
}

const genreByTask = new Map<string, MemoGenre>(
  memoSlots.flatMap((slot) =>
    slot.genre
      ? memoSlotTasks(slot).map(
          (step) => [step.task, slot.genre!] as [string, MemoGenre],
        )
      : [],
  ),
);

export function memoGenreForTask(task: string): MemoGenre | undefined {
  return genreByTask.get(task);
}

const writingById = new Map<string, WritingExercise>(
  verificationExercises
    .filter(isWritingExercise)
    .map((exercise) => [exercise.id, exercise]),
);

export function memoTaskExercise(task: string): WritingExercise | undefined {
  return writingById.get(task);
}
