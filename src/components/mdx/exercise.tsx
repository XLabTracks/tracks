import { getExerciseById } from "@/lib/content";
import {
  isChoiceExercise,
  isWritingExercise,
  type FlowchartNode,
  type TapRevealRating,
} from "@/lib/content/types";
import {
  toPublicChoice,
  toPublicFlowchart,
  type AllocationScenarioEntry,
  type ArgueRevealConstructionEntry,
  type ArgueRevealItemEntry,
  type CommitConstructCommitEntry,
  type CommitConstructConstructEntry,
  type ControlScenarioEntry,
  type StagedQuestionEntry,
} from "@/lib/content/exercise-view";
import { writingPromptHtml } from "@/lib/content/writing-prompt-html";
import { getViewerSubmissions } from "@/lib/progress";
import {
  reopenWriting,
  saveWritingDraft,
  submitWriting,
} from "@/app/actions/submissions";
import {
  AllocationExerciseCard,
  ArgueRevealExerciseCard,
  ChoiceExerciseCard,
  CommitConstructCard,
  ControlScenariosCard,
  FlowchartExerciseCard,
  StagedQuestionsCard,
  TapRevealCard,
  UnderstandingCheckCard,
  WritingExerciseCard,
} from "./exercise-cards";
import type { WritingValues } from "@/components/exercises/writing-editor";
import { TransparencyFeedback } from "@/components/exercises/transparency-feedback";
import { feedbackToHtml } from "@/lib/grader/feedback-html";
import { parseGraderReport, parseVerdict } from "@/lib/grader/parse";
import { getGraderKeyView } from "@/lib/grader/grading-key";

// Preloaded props for TransparencyFeedback from a previously graded row, so
// a stored grade survives reloads. The report's <analysis> block never
// reaches the client raw — it's parsed into rubric-table rows here.
function storedGradeProps(
  submission: { score: number | null; feedback: string | null } | null,
) {
  if (submission == null || submission.score == null || !submission.feedback) {
    return {};
  }
  const report = parseGraderReport(submission.feedback);
  return {
    initialScore: submission.score,
    initialBand: parseVerdict(submission.feedback)?.band,
    initialFeedbackHtml: feedbackToHtml(report.visibleMarkdown),
    initialCriteria: report.criteria,
  };
}

// The grading card's key picker is an extra, and it reads the DB: a failed
// read hides the picker (grading falls back to the automatic choice) rather
// than taking the lesson down with it.
async function graderKeyView(userId: string) {
  return getGraderKeyView(userId).catch(() => null);
}

export interface ExerciseProps {
  id: string;
}

// Server dispatcher: strips answer keys for choice types, and for writing
// exercises loads any saved draft and binds the persistence actions.
export async function Exercise({ id }: ExerciseProps) {
  const exercise = getExerciseById(id);
  if (!exercise) {
    return (
      <div className="not-prose border-destructive/40 bg-destructive/5 text-destructive my-6 rounded-xl border p-4 text-sm">
        Unknown exercise: <code>{id}</code>
      </div>
    );
  }

  if (isChoiceExercise(exercise)) {
    return <ChoiceExerciseCard exercise={toPublicChoice(exercise)} />;
  }

  if (exercise.type === "flowchart") {
    const { submissions } = await getViewerSubmissions();
    const submission = submissions.get(exercise.id) ?? null;
    const stored = (
      submission?.responseJson as {
        stages?: Record<
          string,
          { attempt: FlowchartNode[]; correct: boolean; attempts?: number }
        >;
      } | null
    )?.stages;
    // Attach the authored explanation to solved stages only (post-solve
    // content — gradeFlowchartStage returns it on a correct grade, so the
    // reload view matches the just-solved one). Solutions stay server-only.
    const initialStages = stored
      ? Object.fromEntries(
          Object.entries(stored).map(([stageId, entry]) => [
            stageId,
            entry.correct
              ? {
                  ...entry,
                  explanation: exercise.stages.find((s) => s.id === stageId)
                    ?.explanation,
                }
              : entry,
          ]),
        )
      : undefined;
    return (
      <FlowchartExerciseCard
        exercise={toPublicFlowchart(exercise)}
        initialStages={initialStages}
      />
    );
  }

  if (exercise.type === "tap-reveal") {
    const { submissions } = await getViewerSubmissions();
    const submission = submissions.get(exercise.id) ?? null;
    const initialRating =
      (submission?.responseJson as { rating?: TapRevealRating } | null)
        ?.rating ?? null;
    return <TapRevealCard exercise={exercise} initialRating={initialRating} />;
  }

  if (exercise.type === "allocation") {
    const { user, submissions } = await getViewerSubmissions();
    const submission = submissions.get(exercise.id) ?? null;
    const initialScenarios = (
      submission?.responseJson as {
        scenarios?: Record<string, AllocationScenarioEntry>;
      } | null
    )?.scenarios;
    return (
      <AllocationExerciseCard
        exercise={exercise}
        initialScenarios={initialScenarios}
        initialCompletedAt={
          submission?.status === "submitted"
            ? submission.updatedAt.toISOString()
            : undefined
        }
        persist={user != null}
      />
    );
  }

  if (exercise.type === "control-scenarios") {
    const { user, submissions } = await getViewerSubmissions();
    const submission = submissions.get(exercise.id) ?? null;
    const initialScenarios = (
      submission?.responseJson as {
        scenarios?: Record<string, ControlScenarioEntry>;
      } | null
    )?.scenarios;
    return (
      <ControlScenariosCard
        exercise={exercise}
        initialScenarios={initialScenarios}
        persist={user != null}
      />
    );
  }

  if (exercise.type === "staged-questions") {
    const { user, submissions } = await getViewerSubmissions();
    const submission = submissions.get(exercise.id) ?? null;
    const initialQuestions = (
      submission?.responseJson as {
        questions?: Record<string, StagedQuestionEntry>;
      } | null
    )?.questions;
    return (
      <StagedQuestionsCard
        exercise={exercise}
        initialQuestions={initialQuestions}
        persist={user != null}
      />
    );
  }

  if (exercise.type === "commit-construct") {
    const { user, submissions } = await getViewerSubmissions();
    const submission = submissions.get(exercise.id) ?? null;
    const responseJson = submission?.responseJson as {
      commit?: CommitConstructCommitEntry;
      construct?: CommitConstructConstructEntry;
    } | null;
    return (
      <CommitConstructCard
        exercise={exercise}
        initialCommit={responseJson?.commit}
        initialConstruct={responseJson?.construct}
        persist={user != null}
      />
    );
  }

  if (exercise.type === "argue-reveal") {
    const { user, submissions } = await getViewerSubmissions();
    const submission = submissions.get(exercise.id) ?? null;
    const responseJson = submission?.responseJson as {
      items?: Record<string, ArgueRevealItemEntry>;
      construction?: ArgueRevealConstructionEntry;
    } | null;
    return (
      <ArgueRevealExerciseCard
        exercise={exercise}
        initialItems={responseJson?.items}
        initialConstruction={responseJson?.construction}
        initialCompletedAt={
          submission?.status === "submitted"
            ? submission.updatedAt.toISOString()
            : undefined
        }
        persist={user != null}
        scoringSlot={
          user ? (
            <TransparencyFeedback
              contentId={exercise.id}
              kind="exercise"
              keyView={(await graderKeyView(user.id)) ?? undefined}
              {...storedGradeProps(submission)}
            />
          ) : undefined
        }
      />
    );
  }

  if (exercise.type === "understanding-check") {
    return (
      <UnderstandingCheckCard
        prompt={exercise.prompt}
        sampleAnswer={exercise.sampleAnswer}
      />
    );
  }

  if (isWritingExercise(exercise)) {
    const promptHtml = writingPromptHtml(exercise.prompt);
    const { user, submissions } = await getViewerSubmissions();
    if (!user) {
      return <WritingExerciseCard exercise={exercise} promptHtml={promptHtml} />;
    }
    const submission = submissions.get(exercise.id) ?? null;
    return (
      <>
        {/* Keyed on the submission's lifecycle, not its updatedAt: submit and
            reopen call router.refresh() and must remount the editor re-seeded
            from the server's row (a stale tab can't silently write old content
            over a newer one) — but autosaves also bump updatedAt, so keying on
            it would let any unrelated refresh remount a mid-edit draft and
            drop keystrokes typed since the last completed autosave. */}
        <WritingExerciseCard
          key={
            submission?.status === "submitted"
              ? `submitted:${submission.updatedAt.toISOString()}`
              : "draft"
          }
          exercise={exercise}
          promptHtml={promptHtml}
          initialValues={(submission?.responseJson as WritingValues | null) ?? undefined}
          submitted={submission?.status === "submitted"}
          onSaveDraft={saveWritingDraft.bind(null, exercise.id, "exercise", exercise.format)}
          onSubmit={submitWriting.bind(null, exercise.id, "exercise", exercise.format)}
          onReopen={reopenWriting.bind(null, exercise.id, "exercise")}
        />
        {submission?.status === "submitted" &&
          (exercise.sampleAnswer ? (
            <aside className="not-prose border-border bg-muted/40 my-6 rounded-xl border p-5">
              <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
                Sample answer
              </p>
              <div
                className="space-y-3 text-sm leading-relaxed [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{
                  __html: writingPromptHtml(exercise.sampleAnswer),
                }}
              />
            </aside>
          ) : (
            <div className="not-prose my-6">
              <TransparencyFeedback
                contentId={exercise.id}
                kind="exercise"
                keyView={(await graderKeyView(user.id)) ?? undefined}
                {...storedGradeProps(submission)}
              />
            </div>
          ))}
      </>
    );
  }

  return null;
}
