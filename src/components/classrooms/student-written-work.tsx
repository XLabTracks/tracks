import { PenLine } from "lucide-react";
import { getExerciseById } from "@/lib/content";
import { isWritingExercise, type WritingSection } from "@/lib/content/types";
import type { TrackWritingTask } from "@/components/mdx/lesson-content";
import type { ExerciseSubmissionMap } from "@/lib/progress";
import { OptionalPrefix } from "@/components/content/optional-tag";
import { Badge } from "@/components/ui/badge";

const DEFAULT_SECTIONS: WritingSection[] = [
  { id: "response", label: "Response" },
];

const STATUS_WORD = {
  draft: "Draft",
  submitted: "Submitted",
  graded: "Graded",
} as const;

/**
 * What an instructor may read of a learner's writing: the text of everything
 * they have SUBMITTED, and for anything still in draft the fact that a draft
 * exists and nothing else.
 *
 * The line is deliberate. A classroom exists so somebody can read the work,
 * which is why submitted text is here in full rather than behind a count; an
 * unsubmitted draft is a learner thinking out loud, and handing it over is
 * not what submitting means. Notebook, highlights and memo-desk drafts live
 * in a different store (VerificationState) and are not read here at all.
 */
export function StudentWrittenWork({
  tasks,
  submissions,
}: {
  tasks: TrackWritingTask[];
  submissions: ExerciseSubmissionMap;
}) {
  if (tasks.length === 0) return null;

  const lessons: { id: string; title: string; tasks: TrackWritingTask[] }[] = [];
  for (const task of tasks) {
    const last = lessons.at(-1);
    if (last?.id === task.lessonId) last.tasks.push(task);
    else
      lessons.push({
        id: task.lessonId,
        title: task.lessonTitle,
        tasks: [task],
      });
  }

  const required = tasks.filter((task) => !task.optional);
  const submitted = tasks.filter((task) => isSubmitted(submissions, task));
  const requiredSubmitted = required.filter((task) =>
    isSubmitted(submissions, task),
  );
  const extra = submitted.length - requiredSubmitted.length;

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-base font-semibold">Written work</h3>
        <span className="text-muted-foreground text-sm">
          {requiredSubmitted.length}/{required.length} required submitted
          {extra > 0 ? `, ${extra} optional` : ""}
        </span>
      </div>

      <div className="mt-3 space-y-5">
        {lessons.map((lesson) => (
          <div key={lesson.id}>
            <h4 className="text-muted-foreground text-xs font-medium uppercase">
              {lesson.title}
            </h4>
            <div className="mt-2 space-y-3">
              {lesson.tasks.map((task) => (
                <Task
                  key={task.exerciseId}
                  task={task}
                  row={submissions.get(task.exerciseId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function isSubmitted(
  submissions: ExerciseSubmissionMap,
  task: TrackWritingTask,
): boolean {
  const status = submissions.get(task.exerciseId)?.status;
  return status === "submitted" || status === "graded";
}

function Task({
  task,
  row,
}: {
  task: TrackWritingTask;
  row: ReturnType<ExerciseSubmissionMap["get"]>;
}) {
  const exercise = getExerciseById(task.exerciseId);
  const sections =
    exercise && isWritingExercise(exercise)
      ? (exercise.sections ?? DEFAULT_SECTIONS)
      : DEFAULT_SECTIONS;
  const open = row?.status === "submitted" || row?.status === "graded";
  const values = (row?.responseJson ?? {}) as Record<string, string>;

  return (
    <div className="border-border rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <p className="flex min-w-0 items-baseline gap-1.5 text-sm font-medium">
          <PenLine className="size-3.5 shrink-0 translate-y-0.5" aria-hidden />
          <span>
            {task.optional && <OptionalPrefix />}
            {firstLine(task.prompt)}
          </span>
        </p>
        <Badge variant={open ? "default" : "secondary"}>
          {row ? STATUS_WORD[row.status] : "Not started"}
        </Badge>
      </div>

      {open ? (
        <dl className="mt-3 space-y-2 text-sm">
          {sections.map((section) => {
            const value = values[section.id];
            if (!value) return null;
            return (
              <div key={section.id}>
                {sections.length > 1 && (
                  <dt className="text-muted-foreground text-xs font-medium uppercase">
                    {section.label}
                  </dt>
                )}
                <dd className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                  {value}
                </dd>
              </div>
            );
          })}
        </dl>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">
          {row
            ? "A draft is saved. Drafts stay with the learner until they submit."
            : "Nothing written yet."}
        </p>
      )}

      {open && typeof row?.score === "number" && (
        <p className="text-muted-foreground mt-3 text-xs">
          Reasoning-transparency grade: {row.score}
        </p>
      )}
    </div>
  );
}

function firstLine(prompt: string): string {
  const line =
    prompt
      .split("\n")
      .map((part) => part.trim())
      .find(Boolean) ?? "Writing task";
  const plain = line.replace(/^#+\s*/, "").replace(/[*_`]/g, "");
  return plain.length > 140 ? `${plain.slice(0, 139).trimEnd()}…` : plain;
}
