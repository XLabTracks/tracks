"use client";

import {
  REPORT_ACCESS_CASES,
  REPORT_ACCESS_KEY,
  REPORT_QUESTION,
  REPORT_STEM,
} from "@/lib/verification/data/report-access";
import { QuestionWorkspace } from "../kit/question-workspace";
import type { VerificationWidgetProps } from "../kit/types";

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
