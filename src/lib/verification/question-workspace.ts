
export type QuestionRequirement = "required" | "choose-one" | "optional";

export type QuestionBlock = { text: string } | { list: string[] };

export interface WorkspaceQuestion {
  id: string;
  n: number;
  title: string;
  requirement: QuestionRequirement;
  body: QuestionBlock[];
}

export type WorkspaceRule =
  | { kind: "any"; count: number }
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
    const eligible = questions.filter((q) => q.requirement !== "optional");
    return rule.count > 0 && counts(eligible) >= rule.count;
  }
  const required = group(questions, "required");
  const choose = group(questions, "choose-one");
  if (required.length === 0 && choose.length === 0) return false;
  if (counts(required) < required.length) return false;
  return choose.length === 0 || counts(choose) >= 1;
}

export function answersOwed(
  rule: WorkspaceRule,
  questions: readonly WorkspaceQuestion[],
): number {
  if (rule.kind === "any") return rule.count;
  return group(questions, "required").length + (group(questions, "choose-one").length ? 1 : 0);
}

export function choiceNumbers(questions: readonly WorkspaceQuestion[]): number[] {
  return group(questions, "choose-one").map((q) => q.n);
}
