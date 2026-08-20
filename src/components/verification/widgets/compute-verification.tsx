"use client";

import type { VerificationWidgetProps } from "../kit/types";
import { QuestionWorkspace } from "../kit/question-workspace";
import {
  COMPUTE_QUESTIONS,
  COMPUTE_RULE,
  PAPER,
} from "@/lib/verification/data/compute-verification";
import { choiceNumbers } from "@/lib/verification/question-workspace";

export function ComputeVerificationQuestions({
  onComplete,
}: VerificationWidgetProps) {
  const required = COMPUTE_QUESTIONS.filter(
    (q) => q.requirement === "required",
  ).map((q) => q.n);
  const optional = COMPUTE_QUESTIONS.filter(
    (q) => q.requirement === "optional",
  ).map((q) => q.n);

  return (
    <QuestionWorkspace
      storageKey="vt-workspace:3.0"
      rule={COMPUTE_RULE}
      questions={COMPUTE_QUESTIONS}
      placeholder="Cite the page or section you are answering from."
      onComplete={onComplete}
      intro={
        <div className="border-border bg-card space-y-3 rounded-xl border p-5">
          <p className="text-sm">
            Read all {COMPUTE_QUESTIONS.length} questions before beginning.
            Answer Questions {required.join(", ")}, and any one question out of
            questions {list(choiceNumbers(COMPUTE_QUESTIONS), "or")}.{" "}
            {optional.length === 1 ? "Question" : "Questions"}{" "}
            {list(optional, "and")} {optional.length === 1 ? "is" : "are"}{" "}
            optional.
          </p>
          <p className="text-muted-foreground text-sm">
            Support each answer with page or section references to{" "}
            <a
              href={PAPER.pdf}
              target="_blank"
              rel="noopener"
              className="text-brand-ink font-medium underline-offset-4 hover:underline"
            >
              the paper
            </a>
            . Clearly distinguish the author’s claims from your own conclusions.
          </p>
        </div>
      }
    />
  );
}

function list(ns: number[], conj: "and" | "or"): string {
  if (ns.length <= 1) return String(ns[0] ?? "");
  return `${ns.slice(0, -1).join(", ")} ${conj} ${ns[ns.length - 1]}`;
}
