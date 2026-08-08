"use client";

import type { VerificationWidgetProps } from "../kit/types";
import { QuestionWorkspace } from "../kit/question-workspace";
import {
  TREATY,
  WORKSPACE_QUESTIONS,
  WORKSPACE_RULE,
} from "@/lib/verification/data/treaty-workspace";
import { answersOwed } from "@/lib/verification/question-workspace";

/**
 * 1.1's four questions on the MIRI treaty.
 *
 * The counts in the preamble are read from the data rather than spelled out,
 * so a fifth question or a changed threshold cannot leave this sentence
 * claiming otherwise.
 */
export function TreatyWorkspace({ onComplete }: VerificationWidgetProps) {
  return (
    <QuestionWorkspace
      storageKey="vt-workspace:1.1"
      rule={WORKSPACE_RULE}
      questions={WORKSPACE_QUESTIONS}
      onComplete={onComplete}
      intro={
        // Which pages of the practice guide to read is the reading card in the
        // lesson body, and only there. Two places that name pages are two
        // places to keep in step.
        <div className="border-border bg-card space-y-3 rounded-xl border p-5">
          <p className="text-sm">
            Open{" "}
            <a
              href={`/tracks/verification/policy-scoping/${TREATY.paperSlug}`}
              className="text-primary font-medium underline-offset-4 hover:underline"
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
