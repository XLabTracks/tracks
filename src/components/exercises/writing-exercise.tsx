"use client";

import { WritingEditor, type WritingValues } from "./writing-editor";
import { DELIVERABLE_FORMAT_LABELS, type WritingExercise } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export interface WritingExerciseCardProps {
  exercise: WritingExercise;
  /** Server-rendered markdown of `exercise.prompt` (see writing-prompt-html.ts). */
  promptHtml?: string;
  /**
   * The line about what this format is worth outside the course, resolved
   * server-side (see work-sample-note.ts) so the content graph stays out of
   * the client bundle.
   */
  workSample?: string | null;
  initialValues?: WritingValues;
  submitted?: boolean;
  onSaveDraft?: (values: WritingValues) => Promise<void> | void;
  onSubmit?: (values: WritingValues) => Promise<void> | void;
  onReopen?: () => Promise<void> | void;
}

export function WritingExerciseCard({
  exercise,
  promptHtml,
  workSample,
  initialValues,
  submitted,
  onSaveDraft,
  onSubmit,
  onReopen,
}: WritingExerciseCardProps) {
  const sections = exercise.sections ?? [
    { id: "response", label: "Your response", placeholder: "Write your answer…" },
  ];
  return (
    <aside
      id={exercise.id}
      className="not-prose border-border bg-card shadow-soft my-6 scroll-mt-24 rounded-xl border p-5"
    >
      <p
        className={cn(
          "text-muted-foreground text-xs font-medium tracking-wide uppercase",
          workSample ? "mb-1" : "mb-1.5",
        )}
      >
        {DELIVERABLE_FORMAT_LABELS[exercise.format]}
      </p>
      {workSample && (
        <p className="text-muted-foreground mb-3 text-xs leading-relaxed italic">
          {workSample}
        </p>
      )}
      {promptHtml ? (
        <div
          className="space-y-3 leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: promptHtml }}
        />
      ) : (
        <p>{exercise.prompt}</p>
      )}
      <div className="mt-4">
        <WritingEditor
          sections={sections}
          rubric={exercise.rubric}
          minWords={exercise.minWords}
          maxWords={exercise.maxWords}
          initialValues={initialValues}
          submitted={submitted}
          onSaveDraft={onSaveDraft}
          onSubmit={onSubmit}
          onReopen={onReopen}
        />
      </div>
    </aside>
  );
}
