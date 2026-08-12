import { getCurrentUser } from "@/lib/auth";
import { isLessonCompleted } from "@/lib/progress";
import {
  getVerificationExercise,
  verificationLessonId,
} from "@/lib/verification/exercises";
import { VerificationWidgetHost } from "./verification-widget-host";

export interface VerificationExerciseProps {
  /** Page id under public/verification/ (file basename, no extension). */
  id: string;
}

/**
 * MDX entry point: `<VerificationExercise id="…"/>` renders one of the
 * Verification track's native React interactives inline. Async server
 * component: it resolves the signed-in user here so the client host only
 * records progress for learners who can persist it.
 */
export async function VerificationExercise({ id }: VerificationExerciseProps) {
  const exercise = getVerificationExercise(id);
  if (!exercise) {
    return (
      <div className="not-prose border-destructive/40 bg-destructive/5 text-destructive my-6 rounded-xl border p-4 text-sm">
        Unknown verification exercise: <code>{id}</code>
      </div>
    );
  }
  const user = await getCurrentUser();
  const contentId = verificationLessonId(id);
  // View-style widgets cannot report completion themselves; their hosting
  // lesson owns scroll completion. Avoid a database read whose result cannot
  // affect the widget or any subsequent write.
  const completed =
    user && exercise.bridged ? await isLessonCompleted(user.id, contentId) : false;
  return (
    <VerificationWidgetHost
      pageId={exercise.id}
      title={exercise.title}
      bridged={exercise.bridged}
      contentId={contentId}
      canTrack={user !== null}
      initialCompleted={completed}
    />
  );
}
