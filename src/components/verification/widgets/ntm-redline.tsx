"use client";

import type { VerificationWidgetProps } from "../kit/types";
import { QuestionWorkspace } from "../kit/question-workspace";
import {
  NTM_REDLINE_QUESTIONS,
  NTM_REDLINE_RULE,
} from "@/lib/verification/data/ntm-redline";

export function NtmRedline({ onComplete }: VerificationWidgetProps) {
  return (
    <QuestionWorkspace
      storageKey="v-ntm-redline:v1"
      rule={NTM_REDLINE_RULE}
      questions={NTM_REDLINE_QUESTIONS}
      placeholder="Quote the words you are marking up."
      onComplete={onComplete}
      intro={
        <div className="border-border bg-card space-y-3 rounded-xl border p-5">
          <p className="text-sm">
            Go through the verbatim text above with a pencil, as a lawyer
            preparing for negotiations would. Answer the four required questions; the
            fifth is a shorter, optional one.
          </p>
          <p className="text-muted-foreground text-sm">
            Your four answers are the starting material for the written output
            in 2.3.5: the red-line memo works from exactly this text.
          </p>
        </div>
      }
    />
  );
}
