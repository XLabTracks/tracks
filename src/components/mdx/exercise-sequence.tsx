import { getExerciseById } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth";
import { getSubmission } from "@/lib/progress";
import { isChoiceExercise, type TapRevealRating } from "@/lib/content/types";
import { toPublicChoice } from "@/lib/content/exercise-view";
import {
  ExerciseSequenceCard,
  type SequencePart,
} from "@/components/exercises/exercise-sequence";

export interface ExerciseSequenceProps {
  /** Exercise IDs, in order. `understanding-check`, `tap-reveal`, and choice
   * (`multiple-choice` / `multi-select` / `true-false`) exercises are supported. */
  ids: string[];
  label?: string;
}

// Groups several exercises into one stepped, multi-part card — shown one part
// at a time, each unlocked by completing the previous (submit / rate / grade).
// For signed-in users, prior tap-reveal ratings are loaded so already-reviewed
// parts start completed. Choice parts strip their answer key via toPublicChoice.
export async function ExerciseSequence({ ids, label }: ExerciseSequenceProps) {
  const user = await getCurrentUser();

  const parts: SequencePart[] = [];
  for (const id of ids) {
    const exercise = getExerciseById(id);
    if (!exercise) {
      // Fail soft (content.test.ts is the real gate for committed content),
      // but don't let a partial sequence pass silently in local iteration.
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[exercise-sequence] unknown exercise id skipped: ${id}`);
      }
      continue;
    }
    if (exercise.type === "understanding-check") {
      parts.push({
        kind: "understanding-check",
        id: exercise.id,
        prompt: exercise.prompt,
        sampleAnswer: exercise.sampleAnswer,
      });
    } else if (isChoiceExercise(exercise)) {
      parts.push({
        kind: "choice",
        id: exercise.id,
        prompt: exercise.prompt,
        exercise: toPublicChoice(exercise),
      });
    } else if (exercise.type === "tap-reveal") {
      const submission = user
        ? await getSubmission(user.id, exercise.id, "exercise")
        : null;
      const initialRating =
        (submission?.responseJson as { rating?: TapRevealRating } | null)
          ?.rating ?? null;
      parts.push({
        kind: "tap-reveal",
        id: exercise.id,
        prompt: exercise.prompt,
        answer: exercise.answer,
        initialRating,
      });
    } else if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[exercise-sequence] non-sequenceable type "${exercise.type}" skipped: ${id}`,
      );
    }
  }

  if (parts.length === 0) {
    return (
      <div className="not-prose border-destructive/40 bg-destructive/5 text-destructive my-6 rounded-xl border p-4 text-sm">
        No sequence-compatible exercises found for: <code>{ids.join(", ")}</code>
      </div>
    );
  }

  return <ExerciseSequenceCard label={label} parts={parts} />;
}
