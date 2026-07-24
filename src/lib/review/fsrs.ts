// FSRS scheduling for the tap-reveal "notecard" review bank (/review tab).
// Pure wrapper over ts-fsrs: maps ReviewCard rows (camelCase columns) to the
// library's Card shape and back, and maps the in-lesson yes/partial/no
// self-assessment onto the Anki-style grades. All scheduling math stays in
// ts-fsrs; this module owns only the translation.

import {
  createEmptyCard,
  fsrs,
  Rating,
  type Card,
  type Grade,
  type State,
} from "ts-fsrs";
import type { TapRevealRating } from "@/lib/content/types";

/** FSRS scheduling state as stored on a ReviewCard row. */
export interface ReviewCardState {
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: Date | null;
}

// Default parameters (fuzz off, short-term learning steps on) — deterministic
// scheduling, and new cards resurface within the first session Anki-style.
const scheduler = fsrs();

/** The four review-tab grades, in button order. */
export const REVIEW_GRADES: { grade: Grade; label: string }[] = [
  { grade: Rating.Again, label: "Again" },
  { grade: Rating.Hard, label: "Hard" },
  { grade: Rating.Good, label: "Good" },
  { grade: Rating.Easy, label: "Easy" },
];

/**
 * In-lesson self-assessments map onto the FSRS grades; "Easy" is only
 * reachable from the review tab's four-button row.
 */
const RATING_GRADES: Record<TapRevealRating, Grade> = {
  yes: Rating.Good,
  partial: Rating.Hard,
  no: Rating.Again,
};

export function gradeForTapRevealRating(rating: TapRevealRating): Grade {
  return RATING_GRADES[rating];
}

/** Direct-POST hardening: a grade is an integer Rating other than Manual. */
export function isGrade(value: unknown): value is Grade {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= Rating.Again &&
    value <= Rating.Easy
  );
}

function toCard(state: ReviewCardState): Card {
  return {
    due: state.due,
    stability: state.stability,
    difficulty: state.difficulty,
    elapsed_days: state.elapsedDays,
    scheduled_days: state.scheduledDays,
    learning_steps: state.learningSteps,
    reps: state.reps,
    lapses: state.lapses,
    state: state.state as State,
    last_review: state.lastReview ?? undefined,
  };
}

function fromCard(card: Card): ReviewCardState {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.last_review ?? null,
  };
}

/**
 * Applies one review at `now` and returns the re-scheduled state. `null`
 * prior state means the card is new (first interaction enrolls it).
 */
export function scheduleReview(
  prior: ReviewCardState | null,
  grade: Grade,
  now: Date,
): ReviewCardState {
  const card = prior ? toCard(prior) : createEmptyCard(now);
  return fromCard(scheduler.next(card, now, grade).card);
}
