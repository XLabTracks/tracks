import { getExerciseById } from "@/lib/content";
import { getExerciseDisplayTitle, type Exercise } from "@/lib/content/types";

/**
 * The curated list behind the /exercises tab (order = display order). An
 * entry here is the only thing that puts an exercise on the tab and gives it
 * a standalone page at /exercises/<id> — exercises referenced solely by
 * lessons/papers stay embedded there.
 */
export interface FeaturedExercise {
  /** Id in `src/content/exercises.data.ts`; doubles as the URL segment. */
  id: string;
  /** One-line description for the gallery card and detail page. */
  blurb: string;
}

export const featuredExercises: FeaturedExercise[] = [
  {
    id: "control-usefulness-allocation",
    blurb:
      "Allocate a team of 10 researchers across five safety agendas, once per scenario, across four scenarios.",
  },
  {
    id: "contra-control-argue-reveal",
    blurb:
      "Respond to criticisms of AI control, then see one response defenders give. Ends by building your own argument.",
  },
];

export const exerciseDisplayTitle = getExerciseDisplayTitle;

export function getFeaturedExercise(
  id: string,
): { entry: FeaturedExercise; exercise: Exercise } | undefined {
  const entry = featuredExercises.find((f) => f.id === id);
  if (!entry) return undefined;
  const exercise = getExerciseById(entry.id);
  return exercise ? { entry, exercise } : undefined;
}
