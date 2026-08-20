
export const FIXED_CLAIM =
  "Project Cedar conducted a prohibited training run during the first two weeks of July.";

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

export const CLAIM_SELF_CHECK_LEAD =
  "For each case, compare your answer against two questions:";
export const CLAIM_SELF_CHECK = [
  "Did your proposed response match what the evidence currently supports?",
  "Did you avoid treating the allegation as establishing facts outside the source’s access?",
];

export const CLAIM_COMPARISON =
  "The allegation was identical in all four cases. In no more than 50 words, explain why its evidentiary significance changed.";
export const CLAIM_COMPARISON_MAX_WORDS = 50;

export const CLAIM_TRANSFER =
  "You may obtain one additional piece of evidence for one of the four cases. Which case would you investigate further, and what evidence would you seek?";
