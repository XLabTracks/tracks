// An instructor's hand grade on the reasoning-transparency rubric: the same
// criteria, 0–3 anchors and /45 total as the LLM grader, plus a note per
// criterion and an overall comment. Pure and client-safe — the grading form
// computes its live total with it, and the server action validates POSTed
// grades with it (reachable by direct POST, so nothing is trusted).

import { isStorableText } from "@/lib/content/exercise-view";
import type { CriterionResult } from "./parse";
import { RUBRIC_CRITERIA } from "./rubric";

export const INSTRUCTOR_NOTE_MAX = 1200;
export const INSTRUCTOR_COMMENT_MAX = 4000;

export interface InstructorCriterion {
  id: string;
  /** 0–3, or null for N/A (excluded and the total rescaled). */
  score: number | null;
  note: string;
}

export interface InstructorGradeValues {
  criteria: InstructorCriterion[];
  comment: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Every rubric criterion, unscored — the form's starting state. */
export function emptyInstructorCriteria(): InstructorCriterion[] {
  return RUBRIC_CRITERIA.map((c) => ({ id: c.id, score: null, note: "" }));
}

/**
 * Validates a POSTed grade. Returns one entry per rubric criterion in rubric
 * order (a criterion the payload omits is N/A), or null when the payload is
 * malformed — an unknown or repeated criterion id, a score outside 0–3, an
 * over-long or unstorable note or comment — or carries nothing at all to give
 * the student.
 */
export function sanitizeInstructorGrade(
  raw: unknown,
): InstructorGradeValues | null {
  if (!isRecord(raw) || !Array.isArray(raw.criteria)) return null;
  if (raw.criteria.length > RUBRIC_CRITERIA.length) return null;
  const byId = new Map<string, InstructorCriterion>();
  for (const value of raw.criteria) {
    if (!isRecord(value) || typeof value.id !== "string") return null;
    if (!RUBRIC_CRITERIA.some((c) => c.id === value.id)) return null;
    if (byId.has(value.id)) return null;
    const score = value.score;
    if (
      score !== null &&
      (typeof score !== "number" || !Number.isInteger(score) || score < 0 || score > 3)
    ) {
      return null;
    }
    const note = value.note ?? "";
    if (
      typeof note !== "string" ||
      note.length > INSTRUCTOR_NOTE_MAX ||
      !isStorableText(note)
    ) {
      return null;
    }
    byId.set(value.id, { id: value.id, score, note: note.trim() });
  }
  const comment = raw.comment ?? "";
  if (
    typeof comment !== "string" ||
    comment.length > INSTRUCTOR_COMMENT_MAX ||
    !isStorableText(comment)
  ) {
    return null;
  }
  const criteria = RUBRIC_CRITERIA.map(
    (c) => byId.get(c.id) ?? { id: c.id, score: null, note: "" },
  );
  const trimmed = comment.trim();
  const saysSomething =
    trimmed !== "" || criteria.some((c) => c.score !== null || c.note !== "");
  if (!saysSomething) return null;
  return { criteria, comment: trimmed === "" ? null : trimmed };
}

/**
 * The stored Json column read back defensively: whatever survives
 * validation, else every criterion N/A. Never throws on old or odd rows.
 */
export function parseStoredInstructorCriteria(
  value: unknown,
): InstructorCriterion[] {
  return (
    sanitizeInstructorGrade({ criteria: value, comment: "x" })?.criteria ??
    emptyInstructorCriteria()
  );
}

/**
 * Rows for RubricTable, which renders the LLM grader's report: the note
 * takes the rationale slot. Criteria the instructor neither scored nor
 * annotated are left out rather than shown as a wall of N/A.
 */
export function instructorRubricRows(
  criteria: InstructorCriterion[],
): CriterionResult[] {
  return criteria
    .filter((c) => c.score !== null || c.note !== "")
    .map((c) => ({ id: c.id, score: c.score, evidence: null, rationale: c.note }));
}
