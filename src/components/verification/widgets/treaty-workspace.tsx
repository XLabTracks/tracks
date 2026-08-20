"use client";

import type { VerificationWidgetProps } from "../kit/types";
import { QuestionWorkspace } from "../kit/question-workspace";
import {
  TREATY,
  WORKSPACE_QUESTIONS,
  WORKSPACE_RULE,
} from "@/lib/verification/data/treaty-workspace";
import { answersOwed } from "@/lib/verification/question-workspace";

export function TreatyWorkspace({ onComplete }: VerificationWidgetProps) {
  return (
    <QuestionWorkspace
      storageKey="vt-workspace:1.1"
      rule={WORKSPACE_RULE}
      questions={WORKSPACE_QUESTIONS}
      onComplete={onComplete}
      intro={
        <div className="border-border bg-card space-y-3 rounded-xl border p-5">
          <p className="text-sm">
            Open{" "}
            <a
              href={`/tracks/verification/policy-scoping/${TREATY.paperSlug}`}
              className="text-brand-ink font-medium underline-offset-4 hover:underline"
            >
              the draft agreement
            </a>{" "}
            prepared by the {TREATY.authors}.
          </p>
          <p className="text-muted-foreground text-sm">
            Participants are not expected to read the document continuously from
            beginning to end. Instead, examine it article by article, focusing
            on the questions below.
          </p>
          <p className="text-muted-foreground text-sm">
            Read all {WORKSPACE_QUESTIONS.length} questions before beginning the
            examination of the agreement. Answer any{" "}
            {answersOwed(WORKSPACE_RULE, WORKSPACE_QUESTIONS)} of the{" "}
            {WORKSPACE_QUESTIONS.length}.
          </p>
        </div>
      }
    />
  );
}
