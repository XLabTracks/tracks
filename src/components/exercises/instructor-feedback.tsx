import { RubricTable } from "@/components/exercises/rubric-table";
import {
  instructorRubricRows,
  type InstructorCriterion,
} from "@/lib/grader/instructor-grade";
import { rubricTotal } from "@/lib/grader/rubric";

export interface InstructorFeedbackGrade {
  criteria: InstructorCriterion[];
  comment: string | null;
  graderName: string | null;
  classroomName?: string;
  updatedAt: Date;
  stale: boolean;
}

/**
 * An instructor's saved grade on a piece of writing, as its writer sees it:
 * the /45 total on the same rubric as the LLM feedback card, the scored
 * criteria with the instructor's notes, and the overall comment.
 */
export function InstructorFeedback({ grade }: { grade: InstructorFeedbackGrade }) {
  const total = rubricTotal(grade.criteria);
  const rows = instructorRubricRows(grade.criteria);
  const from = [grade.graderName, grade.classroomName].filter(Boolean).join(" · ");
  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">Instructor feedback</p>
        {total && (
          <p className="text-muted-foreground text-xs">
            <span className="text-foreground font-semibold tabular-nums">
              {total.score}/45
            </span>{" "}
            — {total.band}
          </p>
        )}
      </div>
      <p className="text-muted-foreground mt-0.5 text-xs">
        {from && <>{from} · </>}
        {grade.updatedAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}
      </p>
      {grade.stale && (
        <p className="text-muted-foreground mt-2 text-xs">
          Given on an earlier version of this answer.
        </p>
      )}
      {grade.comment && (
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
          {grade.comment}
        </p>
      )}
      {rows.length > 0 && (
        <div className="border-border mt-3 border-t pt-3">
          <RubricTable criteria={rows} />
        </div>
      )}
    </div>
  );
}
