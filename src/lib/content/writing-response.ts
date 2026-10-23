import { getAssessmentById, getExerciseById } from "./index";
import { isWritingExercise, type WritingSection } from "./types";

/** The single unlabelled section a free-form writing exercise stores under. */
const SOLE_SECTION: WritingSection[] = [{ id: "response", label: "Response" }];

/**
 * The sections a writing deliverable stores its text under, in authored
 * order — the one list the editor, the grader, the notebook and an
 * instructor's view of a learner all have to agree on.
 */
export function writingSections(
  contentId: string,
  kind: "exercise" | "assessment",
): WritingSection[] {
  if (kind === "assessment") {
    return getAssessmentById(contentId)?.sections ?? [];
  }
  const exercise = getExerciseById(contentId);
  if (!exercise || !isWritingExercise(exercise)) return [];
  return exercise.sections ?? SOLE_SECTION;
}

/**
 * A submission's text as the learner would read it back.
 *
 * The editor stores `{ sectionId: value }` on `responseJson` and writes no
 * flat copy, so anything wanting the prose has to join it here rather than
 * reach for `Submission.responseText` — a column reserved years ago and
 * never filled, which quietly made every surface that filtered on it show
 * an empty list.
 *
 * Sections are labelled only when there is more than one, because a
 * free-form exercise's synthetic "Response" is a storage key, not something
 * the learner ever saw.
 */
export function writingResponseText(
  contentId: string,
  kind: "exercise" | "assessment",
  responseJson: unknown,
): string {
  if (!responseJson || typeof responseJson !== "object") return "";
  const values = responseJson as Record<string, unknown>;
  const sections = writingSections(contentId, kind);
  const labelled = sections.length > 1;

  return sections
    .map((section) => {
      const value = values[section.id];
      const text = typeof value === "string" ? value.trim() : "";
      if (!text) return null;
      return labelled ? `${section.label}\n${text}` : text;
    })
    .filter(Boolean)
    .join("\n\n");
}
