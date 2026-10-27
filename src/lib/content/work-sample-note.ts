/**
 * The line that says what a deliverable is worth outside the course.
 *
 * Course owner's ask: a learner about to write a policy memo should be told,
 * before the brief, that this is a format hiring asks for and that the draft
 * is theirs to keep. It is platform framing, not curriculum — it makes no
 * claim about the course's subject matter.
 *
 * Both surfaces read these strings: the app's writing-exercise card, and the
 * memo desk, which is still plain JS and is handed them on `window` by
 * MemoDeskHost. One copy of each sentence, in one place.
 */

import { memoGenreForTask, type MemoGenre } from "@/content/verification/memos";
import type { DeliverableFormat, WritingExercise } from "@/lib/content/types";

export type WorkSampleKind =
  | "memo"
  | "briefing"
  | "research-summary"
  | "bill-draft"
  | "essay"
  | "map"
  | "redline";

export const workSampleNotes: Record<WorkSampleKind, string> = {
  memo: "A policy memo is a standard work sample in policy hiring. Write this one well enough to keep.",
  briefing:
    "A briefing note is a standard work sample in policy and analytic hiring. Write this one well enough to keep.",
  "research-summary":
    "A research summary is a standard work sample for research and analyst roles. Write this one well enough to keep.",
  "bill-draft":
    "Drafting statutory language is routine work in legislative and regulatory roles. Write this one well enough to keep.",
  essay:
    "Written analysis of this kind is what research and analyst applications ask for as a work sample. Write this one well enough to keep.",
  map: "An annotated map of a system is a standard analytic deliverable. Write this one well enough to keep.",
  redline:
    "Marking up and redrafting a provision is routine work in treaty and regulatory roles. Write this one well enough to keep.",
};

/**
 * `free-form` is deliberately absent: a free response is an exercise, not a
 * work product, and claiming otherwise of every short answer would make the
 * line worth nothing where it is true.
 */
const FORMAT_KINDS: Partial<Record<DeliverableFormat, WorkSampleKind>> = {
  memo: "memo",
  "policy-memo": "memo",
  briefing: "briefing",
  "research-summary": "research-summary",
  "bill-draft": "bill-draft",
  essay: "essay",
};

const GENRE_KINDS: Record<MemoGenre, WorkSampleKind> = {
  memo: "memo",
  essay: "essay",
  map: "map",
  redline: "redline",
};

export function workSampleNoteForFormat(
  format: DeliverableFormat,
): string | null {
  const kind = FORMAT_KINDS[format];
  return kind ? workSampleNotes[kind] : null;
}

export function workSampleNoteForGenre(genre: MemoGenre): string {
  return workSampleNotes[GENRE_KINDS[genre]];
}

/** What MemoDeskHost publishes for the desk's plain-JS renderer. */
export function workSampleNotesByGenre(): Record<MemoGenre, string> {
  return Object.fromEntries(
    (Object.keys(GENRE_KINDS) as MemoGenre[]).map((genre) => [
      genre,
      workSampleNoteForGenre(genre),
    ]),
  ) as Record<MemoGenre, string>;
}

/**
 * The note for one writing exercise, or null for a plain free response.
 *
 * A Verification output says what it is in memos.ts, as the slot's `genre` —
 * every exercise there is typed `free-form`, so the format alone would never
 * answer. An untyped free response gets nothing on purpose: a line claiming
 * every short answer is a work sample would be worth nothing where it is true.
 *
 * Server-only: it reads the content graph.
 */
export function workSampleNoteForExercise(
  exercise: WritingExercise,
): string | null {
  const genre = memoGenreForTask(exercise.id);
  return genre
    ? workSampleNoteForGenre(genre)
    : workSampleNoteForFormat(exercise.format);
}
