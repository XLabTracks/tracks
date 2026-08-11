"use client";

import type { VerificationWidgetProps } from "../kit/types";
import { QuestionWorkspace } from "../kit/question-workspace";
import {
  COMPUTE_QUESTIONS,
  COMPUTE_RULE,
  PAPER,
} from "@/lib/verification/data/compute-verification";
import { choiceNumbers } from "@/lib/verification/question-workspace";

/**
 * Module 3's nine questions on the Cankaya working paper.
 *
 * The preamble states the rule from the data rather than restating it, so the
 * sentence, the per-question badges and what actually completes the unit are
 * one fact. The lesson body says it once more in the author's own words; if
 * the two ever disagree, this is the one that is right.
 */
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
          {/* The required numbers run into the choice clause on one comma —
              "1, 2, 5, and any one question out of …" — so they are joined
              plainly here and only the choice group takes a conjunction. */}
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
              className="text-primary font-medium underline-offset-4 hover:underline"
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

/** "3, 4, 7 or 9" — the conjunction is the caller's; a choice reads "or". */
function list(ns: number[], conj: "and" | "or"): string {
  if (ns.length <= 1) return String(ns[0] ?? "");
  return `${ns.slice(0, -1).join(", ")} ${conj} ${ns[ns.length - 1]}`;
}
