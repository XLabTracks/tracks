"use client";

import {
  REPORT_ACCESS_CASES,
  REPORT_ACCESS_KEY,
  REPORT_QUESTION,
  REPORT_STEM,
} from "@/lib/verification/data/report-access";
import { QuestionWorkspace } from "../kit/question-workspace";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * One report, four provenances, four boxes. The course owner's spec in full:
 * after each case there is an answer window.
 *
 * It is the house's written-answer deck and nothing else — all four cases are
 * on the page at once, because comparing them IS the exercise and revealing
 * case 3 after case 2 was answered would hide the comparison. Typing
 * autosaves; Save answer is the deliberate act, per case.
 *
 * OPTIONAL, so unbridged: no completion event, and `estimatedMinutes` for
 * 2.4.3 is unchanged. The section's finish event stays "Build the Inspection
 * Order". `onComplete` is therefore a no-op the deck's rule never reaches
 * anything with.
 */
export function ReportAccess({}: VerificationWidgetProps) {
  return (
    <QuestionWorkspace
      storageKey={REPORT_ACCESS_KEY}
      rule={{ kind: "any", count: REPORT_ACCESS_CASES.length }}
      questions={REPORT_ACCESS_CASES}
      placeholder="Say what it licenses, then say what is still missing."
      intro={
        <div className="space-y-2">
          <p className="leading-relaxed font-medium">{REPORT_STEM}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The claim is the same in all four. Only how the reporter knows it
            changes. For each: {REPORT_QUESTION.toLowerCase()}
          </p>
        </div>
      }
      onComplete={() => {}}
    />
  );
}
