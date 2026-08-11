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
  {
    id: "control-scenarios",
    blurb:
      "Five deployment setups, the same question each time: assuming the untrusted model is scheming, does the setup hold the control property?",
  },
  {
    id: "why-catching-counts",
    blurb:
      "Two reasoning prompts on the game theory of control: why a catch changes the game, and where capability evaluations stop being informative.",
  },
  {
    id: "c-areas-l1-theory-of-change",
    blurb:
      "Pick one area of control work and construct an explicit causal chain from work starting today to reduced existential risk.",
  },
  {
    id: "c-areas-l1-crux",
    blurb:
      "Find the link in your theory-of-change chain you trust least, and name the observations that would raise or lower your confidence.",
  },
  {
    id: "c-plm-locking-flowcharts",
    blurb:
      "Reconstruct the password-locked model construction as three drag-and-drop flow charts: strong policy, weak policy, locked model.",
  },
  {
    id: "c-paper-deals-write-offer-memo",
    blurb:
      "Draft the terms of a deal a lab could offer a model it suspects of sabotage: task, compensation, delivery, and verification.",
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
