import { getAssessmentById, getExerciseById } from "@/lib/content";
import { isWritingExercise } from "@/lib/content/types";
import { isStorableText } from "@/lib/content/exercise-view";

export const NOTE_BODY_MAX = 4000;

/** Which register `targetId` belongs to. */
export type NoteTargetKind = "exercise" | "assessment" | "memo";

/**
 * `private_note` rather than `private`, because `private` is a reserved word
 * in a Prisma enum and the two names must stay in step with the SQL type.
 */
export type NoteVisibility = "private_note" | "shared";

export const NOTE_TARGET_KINDS: NoteTargetKind[] = [
  "exercise",
  "assessment",
  "memo",
];

export const NOTE_VISIBILITIES: NoteVisibility[] = ["private_note", "shared"];

export const VISIBILITY_LABEL: Record<NoteVisibility, string> = {
  private_note: "Private",
  shared: "Sent to the learner",
};

export function isNoteTargetKind(value: unknown): value is NoteTargetKind {
  return (
    typeof value === "string" &&
    (NOTE_TARGET_KINDS as string[]).includes(value)
  );
}

export function isNoteVisibility(value: unknown): value is NoteVisibility {
  return (
    typeof value === "string" && (NOTE_VISIBILITIES as string[]).includes(value)
  );
}

/**
 * A memo-desk slot id, loosely.
 *
 * The exercise and assessment registers are closed and checked against the
 * content graph below. The memo register is not: a learner's own store may
 * still hold a slot the outline has since dropped, and their instructor must
 * be able to write about what is actually on the screen. So this bounds the
 * shape rather than enumerating — an instructor is already trusted inside
 * their own room; what the check is for is junk and unbounded keys.
 */
const MEMO_SLOT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export function isNoteTarget(kind: NoteTargetKind, targetId: string): boolean {
  if (kind === "memo") return MEMO_SLOT.test(targetId);
  if (kind === "assessment") return getAssessmentById(targetId) != null;
  const exercise = getExerciseById(targetId);
  return exercise != null && isWritingExercise(exercise);
}

/**
 * The body as it will be stored, or null when it is not storable: empty
 * after trimming, past the cap, or carrying something a Postgres text column
 * will not take. Mirrors the CHECK in the migration.
 */
export function normalizeNoteBody(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const body = raw.trim();
  if (!body || body.length > NOTE_BODY_MAX) return null;
  if (!isStorableText(body)) return null;
  return body;
}
