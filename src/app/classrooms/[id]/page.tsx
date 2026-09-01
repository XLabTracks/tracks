import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getClassroom, getClassroomRoster } from "@/lib/classrooms";
import {
  assignmentDone,
  assignmentItemDone,
  formatDueDate,
  getAssignmentCompletion,
  getClassroomAssignments,
  isPastDue,
} from "@/lib/assignments";
import {
  getGuideForModule,
  getModulesForTrack,
  getTrackById,
} from "@/lib/content";
import { getTrackProgress } from "@/lib/progress";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  CopyJoinCode,
  DeleteAssignmentButton,
  DeleteClassroomButton,
  LeaveClassroomButton,
  RegenerateCodeButton,
  RemoveMemberButton,
  RoleToggleButton,
} from "@/components/classrooms/classroom-manage";
import { ClassroomKeySettings } from "@/components/classrooms/classroom-key-settings";
import { FacilitatorPanel } from "@/components/classrooms/facilitator-panel";
import { StudentCell } from "@/components/classrooms/student-cell";
import { getClassroomKeyStatus } from "@/lib/grader/grading-key";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Classroom" };

// Rendered server-side (Workers locale is UTC/en-US), so pin the format
// explicitly and label it UTC — otherwise "Last active" silently uses the
// runtime timezone and reads a day off for non-UTC instructors.
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
function fmtDate(d: Date | null): string {
  return d ? `${DATE_FMT.format(new Date(d))} UTC` : "—";
}

export default async function ClassroomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  // getClassroom already includes every membership, so the caller's role is
  // derivable — no separate membership round trip.
  const classroom = await getClassroom(id);
  if (!classroom) notFound();
  const membership = classroom.memberships.find((m) => m.userId === user.id);
  if (!membership) notFound();
  const track = classroom.trackId ? getTrackById(classroom.trackId) : null;

  const crumbs = [
    { label: "Classrooms", href: "/classrooms" },
    { label: classroom.name },
  ];

  // ---- Student view ----
  if (membership.role !== "instructor") {
    const [progress, assignments] = await Promise.all([
      track ? getTrackProgress(user.id, track.id) : null,
      // Null (table not migrated) and empty both render nothing — assignments
      // are the instructor's feature until one exists.
      getClassroomAssignments(classroom.id),
    ]);
    const myCompletion =
      assignments && assignments.length > 0
        ? ((await getAssignmentCompletion([user.id], assignments)).get(user.id) ??
          new Set<string>())
        : new Set<string>();
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-3xl font-semibold tracking-tight">
          {classroom.name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {classroom.memberships.length} members
          </Badge>
          {track && <Badge variant="outline">{track.title}</Badge>}
        </div>

        {track && progress ? (
          <div className="border-border shadow-soft mt-6 rounded-xl border p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Your progress in {track.shortTitle ?? track.title}
              </span>
              <span className="text-muted-foreground">
                {progress.completed} / {progress.total} items
              </span>
            </div>
            <Progress value={progress.percent} className="mt-2" />
            <Button asChild size="sm" className="mt-4">
              <Link href={`/tracks/${track.slug}`}>Go to track</Link>
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground mt-6 text-sm">
            This classroom spans all tracks. Head to{" "}
            <Link href="/" className="underline">
              the home page
            </Link>{" "}
            to keep learning.
          </p>
        )}

        {assignments && assignments.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Assignments</h2>
            <ul className="mt-3 space-y-3">
              {assignments.map((a) => {
                const done = assignmentDone(a, myCompletion);
                const doneCount = a.items.filter((item) =>
                  assignmentItemDone(item, myCompletion),
                ).length;
                return (
                  <li
                    key={a.id}
                    className="border-border shadow-soft rounded-xl border p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{a.title}</span>
                      {a.items.length > 0 && (
                        <span className="text-muted-foreground text-xs">
                          {done ? "Done" : `${doneCount}/${a.items.length} done`}
                        </span>
                      )}
                    </div>
                    {a.items.length === 0 ? (
                      <p className="text-muted-foreground mt-1 text-sm">
                        The assigned material is no longer in the curriculum.
                      </p>
                    ) : (
                      <>
                        {a.dueAt && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            Due {formatDueDate(a.dueAt)}
                            {isPastDue(a.dueAt) && !done && (
                              <span className="text-destructive">
                                {" "}
                                · past due
                              </span>
                            )}
                          </p>
                        )}
                        {a.note && (
                          <p className="text-muted-foreground mt-2 text-sm whitespace-pre-line">
                            {a.note}
                          </p>
                        )}
                        <ul className="mt-3 space-y-1.5">
                          {a.items.map((item) => {
                            const itemIsDone = assignmentItemDone(
                              item,
                              myCompletion,
                            );
                            return (
                              <li
                                key={item.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                {itemIsDone ? (
                                  <CheckCircle2
                                    className="text-foreground size-3.5 shrink-0"
                                    aria-hidden
                                  />
                                ) : (
                                  <Circle
                                    className="size-3.5 shrink-0 opacity-30"
                                    aria-hidden
                                  />
                                )}
                                <span className="sr-only">
                                  {itemIsDone ? "Done:" : "Not done:"}
                                </span>
                                <Link
                                  href={item.href}
                                  className="underline-offset-4 hover:underline"
                                >
                                  {item.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-8">
          <LeaveClassroomButton classroomId={classroom.id} />
        </div>
      </main>
    );
  }

  // ---- Instructor view ----
  // `track` is null-guarded above: a classroom scoped to a since-removed
  // track (stale trackId) falls back to the all-tracks roster instead of an
  // empty content-id universe rendering every row as 0/0.
  const [roster, assignments] = await Promise.all([
    getClassroomRoster(classroom.memberships, track ? classroom.trackId : null),
    // Null means the Assignment table hasn't been migrated yet — the section
    // below tells the instructor which migration is owed.
    getClassroomAssignments(classroom.id),
  ]);
  // The facilitator material is Verification's own, so it is offered on a
  // Verification classroom and on the all-tracks kind, not on a Control one.
  const showFacilitator =
    classroom.trackId === "verification" || classroom.trackId === null;
  const students = roster.filter((r) => r.role === "student");
  const instructors = roster.filter((r) => r.role === "instructor");
  // A classroom always keeps one instructor; the demote control is hidden
  // (and the action refuses) while there's only one.
  const canDemote = instructors.length > 1;
  // Null when key storage is unconfigured server-side — hide the card.
  const keyStatus = await getClassroomKeyStatus(classroom.id);
  // Per-assignment count of students who have finished everything it asks.
  const emptySet = new Set<string>();
  const assignmentDoneCounts = new Map<string, number>();
  if (assignments && assignments.length > 0 && students.length > 0) {
    const completion = await getAssignmentCompletion(
      students.map((s) => s.userId),
      assignments,
    );
    for (const a of assignments) {
      assignmentDoneCounts.set(
        a.id,
        students.filter((s) =>
          assignmentDone(a, completion.get(s.userId) ?? emptySet),
        ).length,
      );
    }
  }
  const guideModules = track
    ? getModulesForTrack(track.id).filter((m) => getGuideForModule(m.id))
    : [];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-6">
      <Breadcrumbs items={crumbs} />
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {classroom.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="default">Instructor</Badge>
            {track && <Badge variant="outline">{track.title}</Badge>}
            <span className="text-muted-foreground text-sm">
              {students.length} student{students.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Join code
          </p>
          <CopyJoinCode code={classroom.joinCode} />
          <div className="flex items-center gap-1">
            <RegenerateCodeButton classroomId={classroom.id} />
            <DeleteClassroomButton
              classroomId={classroom.id}
              name={classroom.name}
            />
          </div>
        </div>
      </div>

      {instructors.length > 0 && (
        <section className="mt-8">
          <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Instructors
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {instructors.map((row) => (
              <li
                key={row.userId}
                className="border-border flex items-center gap-2 rounded-full border py-1 pr-1 pl-2"
              >
                <Avatar className="size-6">
                  <AvatarImage src={row.imageUrl ?? undefined} alt="" />
                  <AvatarFallback className="text-4xs">
                    {(row.name ?? row.email)[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {row.name ?? row.email}
                </span>
                {row.userId === user.id && (
                  <span className="text-muted-foreground text-xs">(you)</span>
                )}
                {canDemote && (
                  <RoleToggleButton
                    classroomId={classroom.id}
                    userId={row.userId}
                    name={row.name ?? row.email}
                    role="instructor"
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {showFacilitator && <FacilitatorPanel classroomId={classroom.id} />}

      {track && guideModules.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Facilitator guides</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Session plans for running this classroom&apos;s modules as live meetings.
          </p>
          <ul className="mt-2 space-y-1">
            {guideModules.map((m) => (
              <li key={m.id}>
                <Link
                  className="text-sm underline underline-offset-4"
                  href={`/tracks/${track.slug}/${m.slug}/guide`}
                >
                  Module {m.order}: {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Assignments</h2>
          {assignments !== null && (
            <Button asChild size="sm">
              <Link href={`/classrooms/${classroom.id}/assignments/new`}>
                New assignment
              </Link>
            </Button>
          )}
        </div>
        {assignments === null ? (
          <p className="text-muted-foreground mt-2 text-sm">
            Assignments aren&apos;t set up yet — the database needs
            db/migrations/20260820120000_assignments.sql applied.
          </p>
        ) : assignments.length === 0 ? (
          <p className="text-muted-foreground mt-2 text-sm">
            No assignments yet. Assign lessons and papers with a due date, and
            completion fills in here as students work through the track.
          </p>
        ) : (
          <div className="border-border mt-3 overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Due</th>
                  <th className="px-4 py-3 text-left font-medium">Items</th>
                  <th className="px-4 py-3 text-left font-medium">Completed</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  // A finished room needs no alarm — the marker stays only
                  // while someone is outstanding (or nobody has joined).
                  const allDone =
                    students.length > 0 &&
                    (assignmentDoneCounts.get(a.id) ?? 0) === students.length;
                  return (
                  <tr key={a.id} className="border-border border-t">
                    <td className="px-4 py-3">
                      <Link
                        href={`/classrooms/${classroom.id}/assignments/${a.id}`}
                        className="font-medium hover:underline"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {a.dueAt ? (
                        <>
                          {formatDueDate(a.dueAt)}
                          {isPastDue(a.dueAt) && !allDone && (
                            <span className="text-destructive">
                              {" "}
                              · past due
                            </span>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {a.items.length}
                      {a.staleCount > 0 && (
                        <span className="text-muted-foreground">
                          {" "}
                          · {a.staleCount} removed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {students.length > 0
                        ? `${assignmentDoneCounts.get(a.id) ?? 0}/${students.length} students`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteAssignmentButton
                        classroomId={classroom.id}
                        assignmentId={a.id}
                        title={a.title}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {students.length === 0 ? (
        <p className="text-muted-foreground mt-8">
          No students yet. Share the join code above to get started.
        </p>
      ) : (
        <div className="border-border mt-8 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Progress</th>
                <th className="px-4 py-3 text-left font-medium">Assessments</th>
                <th className="px-4 py-3 text-left font-medium">Last active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {students.map((row) => (
                <tr key={row.userId} className="border-border border-t">
                  <td className="px-4 py-3">
                    <StudentCell
                      href={`/classrooms/${classroom.id}/students/${row.userId}`}
                      name={row.name}
                      email={row.email}
                      imageUrl={row.imageUrl}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={row.percent} className="w-24" />
                      <span className="text-muted-foreground text-xs">
                        {row.completed}/{row.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.assessmentsSubmitted}</td>
                  <td className="text-muted-foreground px-4 py-3">
                    {fmtDate(row.lastActive)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        aria-label="View student"
                      >
                        <Link
                          href={`/classrooms/${classroom.id}/students/${row.userId}`}
                        >
                          <ChevronRight className="size-4" aria-hidden />
                        </Link>
                      </Button>
                      <RoleToggleButton
                        classroomId={classroom.id}
                        userId={row.userId}
                        name={row.name ?? row.email}
                        role="student"
                      />
                      <RemoveMemberButton
                        classroomId={classroom.id}
                        userId={row.userId}
                        name={row.name ?? row.email}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {keyStatus && (
        <section className="border-border shadow-soft mt-8 rounded-xl border p-5">
          <h2 className="text-sm font-semibold">Grading key</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Store a classroom OpenRouter API key and members can bill their
            reasoning-transparency grading to this classroom instead of their
            own key. Only the key&apos;s last four characters are ever shown.
          </p>
          <ClassroomKeySettings
            classroomId={classroom.id}
            initialStatus={keyStatus}
          />
        </section>
      )}
    </main>
  );
}
