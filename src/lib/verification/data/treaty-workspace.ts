/**
 * 1.1's workspace: the learner works the whole treaty, not a curated excerpt.
 *
 * Shape lifted from the ВсОШ обществознание second round — one text, several
 * passes, every pass scored against an enumerated bank rather than a single
 * right answer, with an explicit total per task. Three of that format's
 * properties are load-bearing here and must survive any edit:
 *
 *   1. **The key carries content; the marking notes carry procedure.** The
 *      ЦПМ papers keep these in separate documents, and for good reason: the
 *      learner self-scores here, so a bank item like "cite the clause" would
 *      have them award themselves a point for obeying an instruction. Every
 *      `key` item below is a claim about the treaty that an answer either made
 *      or did not. Everything procedural lives in `marking`, which only
 *      /facilitator/keys renders.
 *   2. **The grid is deliberately imperfect.** The olympiad hands out a table
 *      and warns it "may be superfluous or, conversely, insufficient", so a row
 *      that stays empty is a finding the learner MAKES rather than a lesson
 *      they are told. Task 1a locates; task 1b is about what 1a's grid got
 *      wrong.
 *   3. **Search is cheaper than thought.** Finding which Article carries a
 *      function is one point a row. Everything that requires a judgement is
 *      worth more, and the totals say so.
 *
 * Provisions are NOT pre-selected: finding the rule inside the document is the
 * skill, so the workspace names functions and the learner goes and finds the
 * Article.
 *
 * Article titles are the treaty's own, from the committed artifact's toc
 * (`npm run arxiv:build -- --toc 2511.10783v3`). An `open: true` item is one
 * with no settled answer in the text — the finding is the absence, and it is
 * marked rather than invented.
 */

export type TaskKind = "grid" | "written";

export interface KeyPoint {
  /** A claim about the treaty an answer either made or did not. One point. */
  text: string;
  /** Where the treaty settles it, when it settles it somewhere. */
  pointer?: string;
  /** No settled answer in the text — the finding is the absence. */
  open?: boolean;
}

export interface GridRow {
  id: string;
  /** The function, in the learner's words, not the treaty's. */
  fn: string;
  /** Row-aligned key: one row, one point, one place to look. */
  answer: string;
  pointer?: string;
  open?: boolean;
}

export interface WorkspaceTask {
  id: string;
  kind: TaskKind;
  title: string;
  prompt: string;
  /** Printed under the prompt — the olympiad's own caution, kept. */
  caution?: string;
  points: number;
  rows?: GridRow[];
  key?: KeyPoint[];
  /**
   * How to mark it. Facilitator-only: these are instructions to whoever is
   * scoring, and showing them to a self-scoring learner turns "did I see
   * this?" into "did I follow the recipe?".
   */
  marking?: string[];
}

export const TREATY = {
  paperSlug: "prevent-premature-asi-treaty",
  title: "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence",
  authors: "Scher, Abecassis, Barnett & Abeyta",
} as const;

/** Some tasks may be skipped when time is short; the unit still completes at
 *  this share of them. Four fifths, so exactly one task in five can go. */
export const REQUIRED_FRACTION = 0.8;

export const WORKSPACE_TASKS: WorkspaceTask[] = [
  {
    id: "locate",
    kind: "grid",
    title: "1a. Where does the agreement do each of these?",
    prompt:
      "Work the whole treaty. For each function, name the Article that carries it. One point a row.",
    caution:
      "This list may be superfluous or, conversely, insufficient. A function with no Article is an answer; so is an Article that fits no function.",
    points: 9,
    rows: [
      {
        id: "prohibit",
        fn: "Prohibits an activity outright",
        answer: "Article IV — AI Training",
        pointer: "ARTICLE IV",
      },
      {
        id: "threshold",
        fn: "Sets the line above which the rule applies",
        answer:
          "Article II — Definitions. Not the prohibition: Article IV applies thresholds that Article II defines by name.",
        pointer: "ARTICLE II",
      },
      {
        id: "consolidate",
        fn: "Puts the controlled hardware somewhere it can be counted",
        answer: "Article V — Chip Consolidation",
        pointer: "ARTICLE V",
      },
      {
        id: "production",
        fn: "Watches the hardware being made",
        answer: "Article VI — AI Chip Production Monitoring",
        pointer: "ARTICLE VI",
      },
      {
        id: "measure",
        fn: "Measures use continuously, on site",
        answer: "Article VII — Chip Use Verification",
        pointer: "ARTICLE VII",
      },
      {
        id: "research",
        fn: "Restricts research, and separately verifies that restriction",
        answer:
          "Articles VIII and IX — the restriction and its verification are two Articles, the same split as IV and VII.",
        pointer: "ARTICLE VIII / IX",
      },
      {
        id: "challenge",
        fn: "Lets one party demand a look at something undeclared",
        answer: "Article X — Information Consolidation and Challenge Inspections",
        pointer: "ARTICLE X",
      },
      {
        id: "dispute",
        fn: "Settles a disagreement about what the evidence shows",
        answer:
          "Article XI — Dispute Resolution. Consequences are elsewhere: Article XII — Protective Actions.",
        pointer: "ARTICLE XI / XII",
      },
      {
        id: "exit",
        fn: "Lets a party leave, and on what notice",
        answer: "Article XV — Withdrawal and Duration",
        pointer: "ARTICLE XV",
      },
    ],
    marking: [
      "One point a row, for the Article number. Do not award or withhold on the wording of the description.",
      "Two rows have a second half — thresholds living in Article II rather than IV, and consequences living in XII rather than XI. Award the point for the Article; note the second half aloud, because 1b turns on it.",
      "A learner who writes an Article that plausibly also carries the function has the point. This is a search task, not an interpretation task.",
    ],
  },
  {
    id: "grid-critique",
    kind: "written",
    title: "1b. What was wrong with that grid?",
    prompt:
      "The grid above is not a fair description of the treaty. Name what it left out, and name any text you met that fits none of its rows.",
    points: 6,
    key: [
      {
        text: "The grid never asks who pays for the monitoring — the equipment, the inspectors, the CTB itself.",
        open: true,
      },
      {
        text: "The grid never asks what evidence is sufficient to conclude a violation occurred, as opposed to what evidence is collected.",
        open: true,
      },
      {
        text: "Article I — Primary Purpose fits no row: it states an aim and imposes no checkable duty. A purpose clause is not a rule.",
        pointer: "ARTICLE I",
      },
      {
        text: "Article III — The Coalition fits no row either: it constitutes the body rather than obliging anyone to do or refrain from anything.",
        pointer: "ARTICLE III",
      },
      {
        text: "Articles XIII and XIV — reviews and revision — are how the agreement changes itself, which no row covers and which decides how long any answer above stays true.",
        pointer: "ARTICLE XIII / XIV",
      },
      {
        text: "A row can be right and still be answered by an Article that does not do the work — Article VII's continuous verification only reaches DECLARED sites, so the row is filled and the function is not.",
        pointer: "ARTICLE VII",
      },
    ],
    marking: [
      "This is the analytic half and is worth more than the search. Award for what they NOTICED, not for how they wrote it.",
      "Learners who filled every row without complaint have missed the task. Say so; the grid was built to be incomplete.",
      "The two `open` items have no answer in the treaty. A learner who searched and reports finding nothing has the point in full.",
    ],
  },
  {
    id: "actors",
    kind: "written",
    title: "2. Who is named, and who is actually required?",
    prompt:
      "Take any two obligations in the treaty. For each, name the actor the text names — and every actor the obligation depends on but does not name.",
    points: 6,
    key: [
      {
        text: "Article VII names the Parties (“Parties accept continuous on-site verification…”) and no one else, though nothing happens without inspectors.",
        pointer: "ARTICLE VII",
      },
      {
        text: "The same Article makes the CTB decisive without obliging it: it “determines and updates” the methods, so it sets the content of everyone else's duty.",
        pointer: "ARTICLE VII",
      },
      {
        text: "The treaty binds states, but the conduct it restrains belongs to companies — labs, chip makers, datacentre operators — which appear nowhere as duty-bearers. Each Party must reach them through its own domestic law.",
      },
      {
        text: "Because the duty falls on “each Party”, the institution that actually discharges it differs country by country, and the treaty does not say which one. The same clause means different things in different capitals.",
      },
      {
        text: "The Executive Council is a named actor with power over outcomes, so who sits on it is a substantive term and not a procedural one.",
        pointer: "ARTICLE III",
      },
      {
        text: "Whoever builds, owns and maintains the monitoring equipment is required by Article VII and named by nothing.",
        pointer: "ARTICLE VII",
        open: true,
      },
    ],
    marking: [
      "Two obligations is the floor, not the target; a learner who did one thoroughly may be worth more than one who listed six thinly.",
      "The distinction being tested is named-vs-required. An answer that lists only the named actors has answered a different, easier question.",
    ],
  },
  {
    id: "goals",
    kind: "written",
    title: "3. What is each rule for?",
    prompt:
      "A rule is a means. For three rules of your choice, state the goal the rule serves — and then say whether the rule would still serve it if a party complied with the words and not the aim.",
    points: 6,
    key: [
      {
        text: "The training prohibition's goal is not “no training” but not crossing a capability point of no return; the threshold is a proxy for something the text cannot measure directly.",
        pointer: "ARTICLE IV / II",
      },
      {
        text: "Chip consolidation's goal is to manufacture an observable: hardware in known places is countable, and capability is not.",
        pointer: "ARTICLE V",
      },
      {
        text: "Production monitoring's goal is to catch the flow rather than the stock, because a count of what exists is only as good as the record of what was made.",
        pointer: "ARTICLE VI",
      },
      {
        text: "Challenge inspection's goal is not to find the undeclared site but to make having one risky — deterrence, not detection.",
        pointer: "ARTICLE X",
      },
      {
        text: "Dispute resolution's goal is to stop an ambiguous reading from collapsing the regime; the CWC precedent in 0.3 is the same lesson.",
        pointer: "ARTICLE XI",
      },
      {
        text: "Withdrawal's goal is to make signing survivable, which is bought by making the agreement less binding — the aim and the mechanism pull against each other.",
        pointer: "ARTICLE XV",
      },
    ],
    marking: [
      "The second half of the prompt is the discriminating one. A learner who restates each rule as its own goal (“the goal of the training rule is to stop training”) has not done the task.",
      "Any three rules. Do not require these three.",
    ],
  },
  {
    id: "strong-weak",
    kind: "written",
    title: "4. The strongest and the weakest provision",
    prompt:
      "Name the provision whose compliance you could most confidently check, and the one you could least. Say what makes each so, quoting the clause.",
    points: 6,
    key: [
      {
        text: "Article VI — production monitoring — is the strong candidate: chips are made in very few places, the evidence is physical, and it is not authored by the party being checked.",
        pointer: "ARTICLE VI",
      },
      {
        text: "Article V — consolidation — is the other strong candidate, for the same reason: it converts a diffuse question into a location question.",
        pointer: "ARTICLE V",
      },
      {
        text: "Article VII is the weak candidate, and it is weak three ways at once: it reaches only DECLARED sites, its method list is open (“may include, but are not limited to”), and the CTB may change the methods.",
        pointer: "ARTICLE VII",
      },
      {
        text: "Articles VIII–IX are the other weak candidate: the restricted object is knowledge, which leaves far less trace than a chip.",
        pointer: "ARTICLE VIII / IX",
      },
      {
        text: "Article I belongs on neither list, because it obliges nobody — noticing that it is not a candidate is itself the finding.",
        pointer: "ARTICLE I",
      },
      {
        text: "The distinction that separates strong from weak here is WHO PRODUCES THE EVIDENCE, not how precisely the clause is drafted.",
      },
    ],
    marking: [
      "Award for the reason, not the pick. A defended Article VII as “strongest” beats an undefended Article VI.",
      "The generalisation in the last item is worth a point on its own even if their picks differ from these.",
    ],
  },
  {
    id: "assumption",
    kind: "written",
    title: "5. What does the agreement assume without arguing?",
    prompt:
      "Name something the treaty rests on and never defends, and say which Article stops working first if it turns out to be false.",
    points: 4,
    key: [
      {
        text: "That the physical chip is the thing worth counting — that capability tracks hardware closely enough for hardware accounting to stand in for it. If false, Articles V, VI and VII all measure the wrong object.",
        pointer: "ARTICLE V / VI / VII",
      },
      {
        text: "That training and inference are distinguishable at the point where the measurement happens. If false, Article VII cannot tell a permitted workload from a prohibited one.",
        pointer: "ARTICLE VII",
      },
      {
        text: "That a technical body can hold the method-setting power without that discretion becoming a political lever. If false, Article VII's content is decided by whoever controls the CTB.",
        pointer: "ARTICLE VII / XIII",
      },
      {
        text: "That the parties who matter are the parties who sign. If false, Article III's coalition is a hole in the map rather than a regime.",
        pointer: "ARTICLE III",
      },
    ],
    marking: [
      "Naming the consequence is half the point. An assumption stated without the Article it breaks is worth half a mark, rounded down.",
    ],
  },
  {
    id: "repair",
    kind: "written",
    title: "6. Rewrite one provision so that it can be checked",
    prompt:
      "Find a provision that cannot be verified as written. Rewrite it so that it can. Then say what your rewrite costs — in intrusiveness, in money, or in the chance a party signs at all.",
    points: 5,
    key: [
      {
        text: "Article VII is soft in three ways at once, and naming all three is the first half of the task: it reaches only DECLARED sites, its method list is open (“may include, but are not limited to”), and the CTB may change the methods later.",
        pointer: "ARTICLE VII",
      },
      {
        text: "The third agreement closes that same hole differently, and reading how is worth more than inventing a clause: it makes a named mechanism mandatory — “States Parties agree to ensure compliance … through a hardware-enabled verification mechanism … described in Annex B”, and “The Agency shall install … one or more neutral data centers” — so the method is specified rather than left to later discretion.",
        pointer: "Global Governance articles 1.4.2, 1.6.3",
      },
      {
        text: "But that drafter is just as permissive elsewhere: article 1.5.2 lets the Agency “take any of the following measures, independently or in combination”. A comparison that concludes one treaty is rigorous and the other loose has misread both.",
        pointer: "Global Governance article 1.5.2",
      },
      {
        text: "Whatever the tightening, its cost lands in the same place: continuous telemetry and on-site access expose commercially valuable information, which is why a party with a competitive AI industry resists exactly the clause that would make the rule checkable.",
      },
      {
        text: "The fix moves the problem rather than removing it. Close the method list and the argument moves to what counts as a declared site — which is where Article VII was leaking in the first place.",
        pointer: "ARTICLE VII",
      },
    ],
    marking: [
      "A repair must say what evidence is produced, by whom, how often, and who may see it. A rewrite missing any of those four has not closed the hole — but that is a marking test, so apply it yourself rather than reading it out.",
      "Article VII is the commonest target, not the required one. The undefined sufficiency of evidence, the unnamed payer of the monitoring, and the absence of a consequence attached to a specific finding are all legitimate.",
      "A learner who adapts the Global Governance drafting instead of writing their own has done the task, provided they say what it costs. Borrowing a real solution is the skill; inventing treaty language is not what is being tested.",
      "Refuse the point for a rewrite that only inserts the word “verifiable” into the existing clause.",
    ],
  },
];

export const WORKSPACE_TOTAL = WORKSPACE_TASKS.reduce((n, t) => n + t.points, 0);

/** How many of the tasks must be committed for the unit to count as done. */
export const WORKSPACE_REQUIRED = Math.ceil(
  WORKSPACE_TASKS.length * REQUIRED_FRACTION,
);
