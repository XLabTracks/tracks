/**
 * 2.4.3 — Four Sources (formerly "Same Claim, Different Circumstances").
 *
 * THE COURSE OWNER'S SPEC, verbatim, as revised in her 2026-08-15 delivery
 * ("Optional Exercise: Four Sources"): the fixed allegation, the four cases
 * with her case titles, the two-part task, ONE free-response box per case
 * ("Do not split the answer into fields — the student should structure the
 * analysis themselves"), the post-submission self-check pair, the 50-word
 * final question, and the optional transfer question.
 *
 * What her revision removed is as binding as what it added:
 *  - the "Actions available to the body" line is gone — "do not provide a
 *    list of possible actions or evidentiary classifications before the
 *    student answers";
 *  - the three labelled fields per case are gone, one analysis box each;
 *  - the not-a-ranking instruction and the four-distinction reveal are gone.
 *    The reveal is now the self-check pair plus the case-specific marking
 *    key (marking-keys.ts, SAME_CLAIM_KEY).
 *
 * The four are on the page together, which is her constraint and the point:
 * the controlled variation is only visible when you can see all four at
 * once. The allegation is displayed once, above the cases, and stays visible
 * while the student works — that placement is in the spec.
 */

export const FIXED_CLAIM =
  "Project Cedar conducted a prohibited training run during the first two weeks of July.";

/** Her intro, verbatim. */
export const CLAIM_INTRO =
  "The same allegation was received in four different circumstances.";
export const CLAIM_TASK_LEAD = "For each case, state:";
export const CLAIM_TASKS = [
  "what the verification body should do next;",
  "what the available evidence does not yet establish.",
];
export const CLAIM_JUSTIFY = "Briefly justify your answer.";

export interface ClaimVariant {
  id: string;
  letter: string;
  label: string;
  body: string;
}

/** Her four cases, verbatim and in her order (titles hers, 2026-08-15). */
export const CLAIM_VARIANTS: ClaimVariant[] = [
  {
    id: "participant",
    letter: "A",
    label: "Direct participant",
    body: "The source was an ML engineer assigned to Project Cedar and personally monitored the training dashboard during the run.",
  },
  {
    id: "second-hand",
    letter: "B",
    label: "Second-hand source",
    body: "The source worked in the same laboratory but was not assigned to Project Cedar. Two Cedar researchers separately told them that the project was conducting a prohibited run.",
  },
  {
    id: "inference",
    letter: "C",
    label: "Circumstantial observer",
    body: "The source worked in facilities operations. During the relevant period, they observed sustained high power draw, restricted access to one cluster, emergency cooling work, and unusually intense network traffic.",
  },
  {
    id: "documentary",
    letter: "D",
    label: "Documentary source",
    body: "The source worked in compliance and saw an internal document describing Project Cedar as a training run above the agreement’s prohibited compute threshold.",
  },
];

/** Her post-submission self-check, verbatim. */
export const CLAIM_SELF_CHECK_LEAD =
  "For each case, compare your answer against two questions:";
export const CLAIM_SELF_CHECK = [
  "Did your proposed response match what the evidence currently supports?",
  "Did you avoid treating the allegation as establishing facts outside the source’s access?",
];

/** Her final question, verbatim — shown only after the four are submitted. */
export const CLAIM_COMPARISON =
  "The allegation was identical in all four cases. In no more than 50 words, explain why its evidentiary significance changed.";
export const CLAIM_COMPARISON_MAX_WORDS = 50;

/** Her optional transfer question, verbatim. */
export const CLAIM_TRANSFER =
  "You may obtain one additional piece of evidence for one of the four cases. Which case would you investigate further, and what evidence would you seek?";
