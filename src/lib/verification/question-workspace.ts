/**
 * The shape a written-answer workspace takes, and the rule that decides when
 * one is finished.
 *
 * Two units use it and they finish differently, so the rule is data. 1.1 asks
 * four questions and takes any three — somebody short of time may drop one.
 * Module 3 asks ten: five are required, one must come from a named group, and
 * one is optional research that never counts. Neither rule is a special case
 * of the other, which is why this is a union rather than a threshold.
 *
 * Adding a third unit means adding a `kind` here and a branch in each function
 * below, never a count hard-coded in a widget.
 */

export type QuestionRequirement = "required" | "choose-one" | "optional";

/** A prompt is paragraphs and lists in the author's order, so it keeps it. */
export type QuestionBlock = { text: string } | { list: string[] };

export interface WorkspaceQuestion {
  /** Storage key inside the deck's localStorage document. Permanent. */
  id: string;
  /** The author's own number. Not the array index — 8 is optional and stays 8. */
  n: number;
  title: string;
  requirement: QuestionRequirement;
  body: QuestionBlock[];
}

export type WorkspaceRule =
  /** Any `count` of them, the learner's choice which. */
  | { kind: "any"; count: number }
  /** Every `required` one, plus at least one from the `choose-one` group. */
  | { kind: "required-plus-one-choice" };

function group(questions: readonly WorkspaceQuestion[], r: QuestionRequirement) {
  return questions.filter((q) => q.requirement === r);
}

export function isWorkspaceComplete(
  rule: WorkspaceRule,
  questions: readonly WorkspaceQuestion[],
  answered: ReadonlySet<string>,
): boolean {
  const counts = (qs: readonly WorkspaceQuestion[]) =>
    qs.filter((q) => answered.has(q.id)).length;
  if (rule.kind === "any") {
    // Optional questions are never part of a count, on either rule.
    const eligible = questions.filter((q) => q.requirement !== "optional");
    return rule.count > 0 && counts(eligible) >= rule.count;
  }
  const required = group(questions, "required");
  const choose = group(questions, "choose-one");
  if (required.length === 0 && choose.length === 0) return false;
  if (counts(required) < required.length) return false;
  return choose.length === 0 || counts(choose) >= 1;
}

/** How many answers finishing takes — what the counter above the deck reads. */
export function answersOwed(
  rule: WorkspaceRule,
  questions: readonly WorkspaceQuestion[],
): number {
  if (rule.kind === "any") return rule.count;
  return group(questions, "required").length + (group(questions, "choose-one").length ? 1 : 0);
}

/** "3, 4, 6 or 7" — the choose-one numbers, for the badge on each of them. */
export function choiceNumbers(questions: readonly WorkspaceQuestion[]): number[] {
  return group(questions, "choose-one").map((q) => q.n);
}
