import {
  getExerciseById,
  getTrackOutline,
  itemTitleOf,
  type Track,
} from "@/lib/content";
import { isWritingExercise } from "@/lib/content/types";
import { exerciseLabel } from "@/lib/content/exercise-label";
import { writingPromptHtml } from "@/lib/content/writing-prompt-html";
import { getItemWritingExerciseIds } from "@/components/mdx/lesson-content";
import { getClassroomGrades, getStudentWrittenWork } from "@/lib/instructor-grades";
import { InstructorGradeForm } from "@/components/classrooms/instructor-grade-form";
import { Badge } from "@/components/ui/badge";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Everything a student has written for the classroom's tracks, grouped by
 * module and item, with the instructor's rubric grade beside each submitted
 * answer. Drafts are listed by status only: unsubmitted writing is the
 * student's own until they hand it in. Exercises never started are counted,
 * not listed.
 */
export async function WrittenWork({
  classroomId,
  studentId,
  trackList,
}: {
  classroomId: string;
  studentId: string;
  trackList: Track[];
}) {
  const modules = (
    await Promise.all(
      trackList.flatMap((track) =>
        getTrackOutline(track.slug)!.modules.map(async ({ module, items }) => ({
          track,
          module,
          items: await Promise.all(
            items.map(async (item) => ({
              item,
              exerciseIds: await getItemWritingExerciseIds(item),
            })),
          ),
        })),
      ),
    )
  ).map((m) => ({ ...m, items: m.items.filter((i) => i.exerciseIds.length > 0) }));

  const allIds = modules.flatMap((m) => m.items.flatMap((i) => i.exerciseIds));
  const work = await getStudentWrittenWork(studentId, allIds);
  const submittedIds = [...work.values()]
    .filter((row) => row.status === "submitted")
    .map((row) => row.submissionId);
  const grades = await getClassroomGrades(
    classroomId,
    [...work.values()].map((row) => row.submissionId),
  );
  const gradedCount = grades
    ? submittedIds.filter((id) => grades.has(id)).length
    : 0;

  return (
    <section id="written-work" className="mt-12 scroll-mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Written work</h2>
        <span className="text-muted-foreground text-sm">
          {submittedIds.length} of {allIds.length} submitted
          {grades && submittedIds.length > 0 && <> · {gradedCount} graded</>}
        </span>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Grades use the same reasoning-transparency rubric as the automated
        feedback, and the student sees yours under their answer.
      </p>
      {!grades && (
        <p className="border-border bg-muted/40 mt-3 rounded-lg border p-3 text-sm">
          Grading isn&apos;t set up yet: the database needs
          db/migrations/20261022120000_instructor_grades.sql applied. Submitted
          writing is shown below without grades until then.
        </p>
      )}

      {work.size === 0 ? (
        <p className="text-muted-foreground mt-4 text-sm">No writing yet.</p>
      ) : (
        <div className="mt-4 space-y-8">
          {modules.map(({ track, module, items }) => {
            const rows = items.flatMap(({ item, exerciseIds }) =>
              exerciseIds
                .map((id) => ({ item, exerciseId: id, row: work.get(id) }))
                .filter((entry) => entry.row != null),
            );
            if (rows.length === 0) return null;
            return (
              <div key={module.id}>
                <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {trackList.length > 1 && <>{track.shortTitle ?? track.title} · </>}
                  Module {module.order}: {module.title}
                </h3>
                <div className="mt-3 space-y-4">
                  {rows.map(({ item, exerciseId, row }) => {
                    const exercise = getExerciseById(exerciseId);
                    if (!exercise || !isWritingExercise(exercise) || !row) return null;
                    const submitted = row.status === "submitted";
                    const grade = grades?.get(row.submissionId);
                    const values = (row.responseJson ?? {}) as Record<string, string>;
                    const sections = exercise.sections ?? [
                      { id: "response", label: "Response" },
                    ];
                    return (
                      <article
                        key={exerciseId}
                        id={`written-${exerciseId}`}
                        className="border-border rounded-xl border p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-muted-foreground text-xs">
                              {itemTitleOf(item)}
                            </p>
                            <p className="mt-0.5 text-sm font-medium">
                              {exerciseLabel(exerciseId)}
                            </p>
                          </div>
                          <Badge variant={submitted ? "secondary" : "outline"}>
                            {submitted
                              ? `Submitted ${formatDate(row.updatedAt)}`
                              : "Draft, not submitted"}
                          </Badge>
                        </div>

                        <details className="mt-2">
                          <summary className="text-muted-foreground cursor-pointer text-xs">
                            Prompt
                          </summary>
                          <div
                            className="text-muted-foreground mt-2 space-y-2 text-sm leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                            dangerouslySetInnerHTML={{
                              __html: writingPromptHtml(exercise.prompt),
                            }}
                          />
                        </details>

                        {submitted && (
                          <dl className="mt-3 space-y-3 text-sm">
                            {sections.map((section) =>
                              values[section.id] ? (
                                <div key={section.id}>
                                  {sections.length > 1 && (
                                    <dt className="text-muted-foreground text-xs font-medium">
                                      {section.label}
                                    </dt>
                                  )}
                                  <dd className="leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
                                    {values[section.id]}
                                  </dd>
                                </div>
                              ) : null,
                            )}
                          </dl>
                        )}

                        {submitted && grade?.stale && (
                          <p className="text-muted-foreground mt-3 text-xs">
                            You graded an earlier version; the student has
                            since edited and resubmitted this answer.
                          </p>
                        )}
                        {submitted && grades && (
                          <InstructorGradeForm
                            key={`${row.submissionId}:${grade?.updatedAt.toISOString() ?? "new"}`}
                            classroomId={classroomId}
                            submissionId={row.submissionId}
                            initialCriteria={grade?.criteria}
                            initialComment={grade?.comment}
                            graded={grade != null}
                          />
                        )}
                        {!submitted && grade && (
                          <p className="text-muted-foreground mt-3 text-xs">
                            The student reopened this answer after you graded
                            it. You can grade it again once they resubmit.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
