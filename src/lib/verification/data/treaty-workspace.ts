/**
 * 1.1's workspace: the learner works the whole treaty, not a curated excerpt.
 *
 * Shape lifted from the ВсОШ обществознание second round — one text, several
 * passes, every pass scored by an enumerated bank rather than a single right
 * answer, and an explicit "Total: N points" per task. Two features of that
 * format are load-bearing here and must survive any edit:
 *
 *   1. The grid's rows are deliberately imperfect. The olympiad hands out a
 *      table of argument spheres and warns that it "may be superfluous or,
 *      conversely, insufficient" — so a row that stays empty is a finding the
 *      learner MAKES, not a lesson they are told. `trap: true` marks the row
 *      that catches text carrying no obligation; `missing` names what the grid
 *      leaves out on purpose.
 *   2. Nothing is machine-graded. The bank is what a strong answer contains,
 *      the learner ticks their own hits, and the score is theirs.
 *
 * Provisions are NOT pre-selected. Finding the rule inside the document is the
 * skill the unit exists to build, so the workspace names functions and the
 * learner goes and finds the Article.
 *
 * Article titles below are the treaty's own, from the committed artifact's toc
 * (`npm run arxiv:build -- --toc 2511.10783v3`). The key is a first pass built
 * from that toc plus the passages quoted in `pointer`; an `open: true` item is
 * one where the honest answer is "go and see whether the text says this at
 * all" — those are the rows the facilitator confirms in the room, and they are
 * where the author's own reading should land when it is written.
 */

export type TaskKind = "grid" | "written";

export interface KeyPoint {
  /** What a strong answer contains. One tick, one point. */
  text: string;
  /** Where in the treaty it is settled, when it is settled somewhere. */
  pointer?: string;
  /** No settled answer in the text — the finding is the absence. */
  open?: boolean;
}

export interface GridRow {
  id: string;
  /** The verification function, in the learner's words, not the treaty's. */
  fn: string;
  /** Catches text that reads like a rule and obliges nobody. */
  trap?: boolean;
}

export interface WorkspaceTask {
  id: string;
  kind: TaskKind;
  title: string;
  prompt: string;
  /** Printed under the prompt, verbatim from the olympiad's own wording. */
  caution?: string;
  points: number;
  rows?: GridRow[];
  /** Functions the grid leaves out on purpose — the learner adds them. */
  missing?: string[];
  key: KeyPoint[];
}

export const TREATY = {
  paperSlug: "prevent-premature-asi-treaty",
  title: "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence",
  authors: "Scher, Abecassis, Barnett & Abeyta",
} as const;

export const WORKSPACE_TASKS: WorkspaceTask[] = [
  {
    id: "grid",
    kind: "grid",
    title: "What does the agreement actually do?",
    prompt:
      "Work through the whole treaty. For each function below, name the Article that carries it, who is obliged, and what evidence would show the obligation was met. Leave a cell empty if the treaty does not settle it.",
    caution:
      "This list may be superfluous or, conversely, insufficient. Be attentive: a function with no Article, and an Article that fits no function, are both answers.",
    points: 12,
    rows: [
      { id: "prohibit", fn: "Prohibits an activity outright" },
      { id: "threshold", fn: "Sets the line above which a rule applies" },
      { id: "declare", fn: "Requires a party to declare something" },
      { id: "admit", fn: "Requires a party to admit inspectors or equipment" },
      { id: "measure", fn: "Measures or monitors continuously" },
      { id: "challenge", fn: "Lets one party demand a look at something undeclared" },
      { id: "dispute", fn: "Settles a disagreement about what the evidence shows" },
      { id: "consequence", fn: "Says what follows from a violation" },
      { id: "exit", fn: "Lets a party leave, and on what notice" },
      {
        id: "hortatory",
        fn: "Reads like a rule but obliges nobody",
        trap: true,
      },
    ],
    missing: [
      "Who pays for the monitoring equipment",
      "What counts as evidence sufficient to conclude a violation occurred",
    ],
    key: [
      {
        text: "Prohibition and the training rule sit in Article IV — AI Training.",
        pointer: "ARTICLE IV — AI Training",
      },
      {
        text: "The thresholds are NOT in the prohibition. They are defined terms in Article II, and Article IV applies them by name — the rule lives in its definitions.",
        pointer: "ARTICLE II — Definitions",
      },
      {
        text: "Continuous measurement is Article VII — Chip Use Verification; production monitoring is Article VI.",
        pointer: "ARTICLE VII / ARTICLE VI",
      },
      {
        text: "Article VII gives the method-setting power to the CTB, not to the treaty text: “The methods used for verification will be determined and updated by the CTB.”",
        pointer: "ARTICLE VII",
      },
      {
        text: "Article VII’s list of methods is open — “may include, but are not limited to” — so no single method is actually required by the treaty.",
        pointer: "ARTICLE VII",
      },
      {
        text: "Article VII’s verification attaches to DECLARED sites, which makes the declaration duty load-bearing for everything measured.",
        pointer: "ARTICLE VII",
      },
      {
        text: "Challenge inspection is Article X — Information Consolidation and Challenge Inspections; it is the CWC parallel from 0.3.",
        pointer: "ARTICLE X",
      },
      {
        text: "Disagreement about evidence goes to Article XI — Dispute Resolution; consequences are Article XII — Protective Actions. Note they are two different Articles.",
        pointer: "ARTICLE XI / ARTICLE XII",
      },
      {
        text: "Exit is Article XV — Withdrawal and Duration. Read the notice period before deciding how binding the rest is.",
        pointer: "ARTICLE XV",
      },
      {
        text: "Research restriction has its own verification Article (IX) separate from the restriction itself (VIII) — the same split as IV/VII.",
        pointer: "ARTICLE VIII / ARTICLE IX",
      },
      {
        text: "Article I — Primary Purpose states an aim and imposes no checkable duty; it belongs in the trap row. A purpose clause is not a rule.",
        pointer: "ARTICLE I",
      },
      {
        text: "Who pays for monitoring, and what evidence is sufficient to conclude a violation, are the two the grid leaves out — go and see whether the treaty settles either.",
        open: true,
      },
    ],
  },
  {
    id: "strong-weak",
    kind: "written",
    title: "The strongest and the weakest provision",
    prompt:
      "Name the provision whose compliance you could most confidently check, and the one you could least. Justify each with the text.",
    points: 4,
    key: [
      { text: "The strong candidate is a provision whose evidence is continuous, physical and produced at a chokepoint rather than reported by the party being checked." },
      { text: "The weak candidate is a provision whose evidence depends on the checked party's own declaration, or on a method the treaty leaves to be chosen later." },
      { text: "The justification cites the clause, not the topic — a claim about Article VII that quotes nothing from it scores nothing." },
      { text: "Naming why the weak one is weak in terms of WHO produces the evidence is worth more than calling it vague." },
    ],
  },
  {
    id: "shared-premise",
    kind: "written",
    title: "What does the agreement assume without arguing?",
    prompt:
      "Every regime rests on something its own text never defends. Name one such assumption in this treaty and say what would happen to the regime if it turned out to be false.",
    points: 3,
    key: [
      { text: "That the physical chip is the thing worth counting — that capability tracks hardware closely enough for hardware accounting to stand in for it." },
      { text: "That a technical body can be trusted to set and revise the methods without that discretion becoming a lever." },
      { text: "That training and inference are distinguishable in practice at the point where the measurement happens." },
      { text: "A strong answer names the consequence, not just the assumption: which Article stops working first if it fails." },
    ],
  },
  {
    id: "repair",
    kind: "written",
    title: "Rewrite one provision so it can be checked",
    prompt:
      "Find a provision that cannot be verified as written. Rewrite it so that it can. Then say what your rewrite costs — in intrusiveness, in money, or in the chance a party signs it at all.",
    points: 5,
    key: [
      { text: "The rewrite names the evidence, not just the duty: what is produced, by whom, how often, and who may see it." },
      { text: "It closes whichever hole was identified — an open method list, an undefined threshold, an unnamed verifier, an unstated consequence." },
      { text: "The cost is stated in the treaty's own currency: more access means more exposure of things a party will not want exposed." },
      { text: "The strongest answers notice that the fix moves the problem rather than removing it — the confidentiality bargain from 2.0 is where it lands." },
      { text: "A rewrite that would plainly be refused by one of the two named parties is a finding, provided the answer says so." },
    ],
  },
];

export const WORKSPACE_TOTAL = WORKSPACE_TASKS.reduce((n, t) => n + t.points, 0);
