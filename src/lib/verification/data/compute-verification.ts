/**
 * Module 3's deck: nine questions on Naci Cankaya's working paper, transcribed
 * from the course owner's text.
 *
 * There is no key and no score, as in 1.1. These ask the learner to
 * reconstruct arguments and say where the evidence stops, and a marking key
 * would turn that into agreeing with somebody's reading of the paper.
 *
 * Trap: the numbers are load-bearing. Her rule names questions by number —
 * 1, 2 and 5 required, one of 3, 4, 7 and 9, and 8 optional — so `n` is the
 * author's number and not the array index, and `requirement` is what the
 * completion rule reads. Renumbering means rewriting the rule. Question 10
 * was deleted by her, which is why the numbers stop at 9.
 *
 * Question 6 is named by neither half of that rule, so it is `optional`: it
 * is still there to answer and counts toward nothing. That is a reading of a
 * gap rather than an instruction, and it is flagged as such.
 *
 * Her Assignment paragraph and her Questions preamble disagree, and the
 * paragraph is the live one — it is what changed, while the preamble still
 * names a Question 10 that no longer exists. The widget generates its own
 * preamble from this file for that reason.
 */

import type { WorkspaceQuestion, WorkspaceRule } from "../question-workspace";

export const PAPER = {
  title: "A System Overview for Near-Term, Low-Trust AI Compute Verification",
  author: "Naci Cankaya",
  /** Where the paper is published. What the lesson links and what is cited. */
  href: "https://techgov.intelligence.org/research/a-system-overview-for-near-term-low-trust-ai-compute-verification",
  /** The file itself, for page references. */
  pdf: "https://intelligence.org/wp-content/uploads/A-system-overview-for-near-term-low-trust-AI-compute-verification.pdf",
} as const;

export const COMPUTE_RULE: WorkspaceRule = { kind: "required-plus-one-choice" };

export const COMPUTE_QUESTIONS: WorkspaceQuestion[] = [
  {
    id: "principal-problem",
    n: 1,
    title: "Identify the principal problem",
    requirement: "required",
    body: [
      {
        text: "State in one sentence the principal problem that the author seeks to solve.",
      },
    ],
  },
  {
    id: "reconstruct-approach",
    n: 2,
    title: "Reconstruct the proposed approach",
    requirement: "required",
    body: [
      {
        text: "Identify the principal propositions that constitute the author’s approach to low-trust AI compute verification.",
      },
      {
        text: "Express each proposition in your own words and support it with a page or section reference. Explain the logical relationships among the propositions: which serve as assumptions, which describe mechanisms, and which state the intended results.",
      },
    ],
  },
  {
    id: "covert-adversary",
    n: 3,
    title: "Analyse the covert-adversary argument",
    requirement: "choose-one",
    body: [
      {
        text: "The author argues that a verification system need not make every undeclared workload physically impossible.",
      },
      {
        list: [
          "Reconstruct the argument by identifying its premises and conclusion.",
          "Identify two architectural choices that depend on this argument.",
          "Determine which premise is most vulnerable and explain why its failure would be consequential.",
          "Formulate a counterargument.",
          "Assess whether the argument applies equally to a malicious prover and a malicious verifier. Justify your conclusion.",
        ],
      },
    ],
  },
  {
    id: "trusted-silicon",
    n: 4,
    title: "Examine the rejection of mutually trusted silicon",
    requirement: "choose-one",
    body: [
      {
        text: "Reconstruct the author’s argument against relying on general-purpose processors or AI accelerators that must be trusted by both parties.",
      },
      {
        list: [
          "What reasons are given for rejecting this approach?",
          "How are analog controls, unilateral trusted computing bases, redundant computation, and output cross-checking intended to address the problem?",
          "Does the proposed architecture eliminate trust, reduce it, or redistribute it?",
          "Identify one strong and one vulnerable element of the argument. Formulate a possible objection to each.",
        ],
      },
    ],
  },
  {
    id: "verification-process",
    n: 5,
    title: "Reconstruct the verification process",
    requirement: "required",
    body: [
      {
        text: "Represent schematically the complete verification process proposed in the paper, beginning with activity on monitored hardware and ending with the release of an evaluation result.",
      },
      { text: "For each transition:" },
      {
        list: [
          "identify the evidence or information transferred;",
          "identify which party or component produces, possesses, and evaluates it;",
          "state what conclusion the evidence is intended to support;",
          "identify any additional assumption required for that conclusion.",
        ],
      },
      {
        text: "Identify one transition at which the stated conclusion may not follow from the available evidence.",
      },
    ],
  },
  {
    id: "strongest-arguments",
    n: 6,
    title: "Evaluate the strongest arguments",
    requirement: "optional",
    body: [
      {
        text: "Identify three arguments in the paper that you consider particularly strong.",
      },
      { text: "For each argument:" },
      {
        list: [
          "reconstruct it independently of the author’s wording;",
          "explain why it is comparatively strong;",
          "formulate the strongest plausible counterargument.",
        ],
      },
      {
        text: "The existence of a valid counterargument does not necessarily make an argument weak.",
      },
    ],
  },
  {
    id: "vulnerable-positions",
    n: 7,
    title: "Identify vulnerable positions",
    requirement: "choose-one",
    body: [
      {
        text: "Identify at least four vulnerable positions in the author’s reasoning, including:",
      },
      {
        list: [
          "one insufficiently supported empirical claim;",
          "one questionable inference or generalisation;",
          "one consequential technical assumption;",
          "one apparent contradiction or unresolved tension.",
        ],
      },
      { text: "For each position:" },
      {
        list: [
          "provide its exact location in the paper;",
          "explain the nature of the weakness;",
          "formulate a counterargument.",
        ],
      },
      {
        text: "Where possible, use another proposition from the paper to challenge the position. If an apparent contradiction can be resolved, explain the resolution.",
      },
    ],
  },
  {
    id: "test-a-claim",
    n: 8,
    title: "Test a technically consequential claim",
    requirement: "optional",
    body: [
      {
        text: "Select one technically consequential claim that may be false, overstated, contested, or insufficiently supported.",
      },
      {
        list: [
          "Give its exact location.",
          "Classify it as an established capability, proof of concept, inference from related technology, untested proposal, or under-specified aspiration.",
          "Evaluate it using a reliable external source or a complete technical argument.",
          "State what additional evidence would confirm or disconfirm the claim.",
        ],
      },
    ],
  },
  {
    id: "new-case",
    n: 9,
    title: "Apply the architecture to a new case",
    requirement: "choose-one",
    body: [
      {
        text: "A monitored facility declares that it operates a large-scale inference service. Its network records are committed as required. Randomly selected records can be opened, and the declared computations can be replayed successfully.",
      },
      {
        text: "Using the proposed architecture, determine what this evidence establishes about:",
      },
      {
        list: [
          "whether the declared computations occurred;",
          "whether the facility accurately described their purpose;",
          "whether all relevant activity on the monitored hardware was captured;",
          "whether prohibited activity occurred elsewhere inside or outside the monitored perimeter;",
          "whether a detected anomaly can be attributed to deliberate evasion.",
        ],
      },
      { text: "Classify each conclusion as:" },
      {
        list: [
          "established;",
          "supported but not established;",
          "not established.",
        ],
      },
      {
        text: "Justify every classification with reference to the paper.",
      },
    ],
  },
];
