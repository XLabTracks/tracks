import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getClassroom } from "@/lib/classrooms";
import {
  assignmentDone,
  assignmentItemDone,
  formatDueDate,
  getAssignmentCompletion,
  getClassroomAssignments,
  isPastDue,
} from "@/lib/assignments";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StudentCell } from "@/components/classrooms/student-cell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Assignment" };

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string; aid: string }>;
}) {
  const { id, aid } = await params;
  const user = await requireUser();
  // Instructor-only, and 404 (not 403) for everyone else — same shape as the
  // student detail page, so the page's existence isn't leaked.
  const classroom = await getClassroom(id);
  if (!classroom) notFound();
  const membership = classroom.memberships.find((m) => m.userId === user.id);
  if (membership?.role !== "instructor") notFound();

  const assignments = await getClassroomAssignments(classroom.id);
  // Null means the Assignment table hasn't been migrated — nothing to show
  // here, and the classroom page carries the instructor-facing notice.
  const assignment = assignments?.find((a) => a.id === aid);
  if (!assignment) notFound();

  const students = classroom.memberships.filter((m) => m.role === "student");
  const completion = await getAssignmentCompletion(
    students.map((s) => s.userId),
    [assignment],
  );
  const emptySet = new Set<string>();
  const doneStudents = students.filter((s) =>
    assignmentDone(assignment, completion.get(s.userId) ?? emptySet),
  ).length;
  // A finished room needs no alarm — the past-due marker stays only while
  // someone is outstanding (or nobody has joined).
  const allDone = students.length > 0 && doneStudents === students.length;
  const pastDue = isPastDue(assignment.dueAt) && !allDone;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:px-6">
      <Breadcrumbs
        items={[
          { label: "Classrooms", href: "/classrooms" },
          { label: classroom.name, href: `/classrooms/${classroom.id}` },
          { label: assignment.title },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight">
        {assignment.title}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        {assignment.dueAt && (
          <Badge variant="outline">
            Due {formatDueDate(assignment.dueAt)}
            {pastDue && <span className="text-destructive"> · past due</span>}
          </Badge>
        )}
        {students.length > 0 && (
          <span className="text-muted-foreground">
            {doneStudents} of {students.length} student
            {students.length === 1 ? "" : "s"} done
          </span>
        )}
        {assignment.createdByName && (
          <span className="text-muted-foreground">
            · assigned by {assignment.createdByName}
          </span>
        )}
      </div>
      {assignment.note && (
        <p className="text-muted-foreground mt-3 text-sm whitespace-pre-line">
          {assignment.note}
        </p>
      )}
      {assignment.staleCount > 0 && (
        <p className="text-muted-foreground mt-3 text-sm">
          {assignment.staleCount} assigned item
          {assignment.staleCount === 1 ? " is" : "s are"} no longer in the
          curriculum and no longer counted.
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Assigned work
        </h2>
        <ul className="mt-3 space-y-1.5">
          {assignment.items.map((item) => {
            const itemDoneCount = students.filter((s) =>
              assignmentItemDone(item, completion.get(s.userId) ?? emptySet),
            ).length;
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <Link
                  href={item.href}
                  className="underline-offset-4 hover:underline"
                >
                  {item.title}
                </Link>
                {students.length > 0 && (
                  <span className="text-muted-foreground text-xs">
                    {itemDoneCount}/{students.length} done
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {students.length === 0 ? (
        <p className="text-muted-foreground mt-8">
          No students yet. Share the join code on the classroom page to get
          started.
        </p>
      ) : (
        <div className="border-border mt-8 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Items done</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const completed = completion.get(s.userId) ?? emptySet;
                const doneCount = assignment.items.filter((item) =>
                  assignmentItemDone(item, completed),
                ).length;
                const done = assignmentDone(assignment, completed);
                return (
                  <tr key={s.userId} className="border-border border-t">
                    <td className="px-4 py-3">
                      <StudentCell
                        href={`/classrooms/${classroom.id}/students/${s.userId}`}
                        name={s.user.name}
                        email={s.user.email}
                        imageUrl={s.user.imageUrl}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={
                            assignment.items.length
                              ? Math.round(
                                  (doneCount / assignment.items.length) * 100,
                                )
                              : 0
                          }
                          className="w-24"
                        />
                        <span className="text-muted-foreground text-xs">
                          {doneCount}/{assignment.items.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {done ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2
                            className="text-foreground size-3.5"
                            aria-hidden
                          />
                          Done
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Circle className="size-3.5 opacity-30" aria-hidden />
                          In progress
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
