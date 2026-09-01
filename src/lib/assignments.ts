import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import {
  getContentLocation,
  getItemProgressContentIds,
  getItemsForModule,
  itemIdOf,
  itemTitleOf,
  type ModuleItem,
} from "@/lib/content";

/**
 * Classroom assignments: reads and the pure derivation rules.
 *
 * An Assignment row stores only the instructor's ask — an ordered list of
 * module-item content ids plus an optional due date. Everything else is
 * derived at read time: titles and hrefs come from the content graph, and
 * completion comes from the students' existing LessonProgress rows, so an
 * assignment can never disagree with the progress a track page shows. An id
 * whose item has left the content graph is skipped, not deleted (the review
 * bank's convention), and reported as `staleCount` so the instructor sees
 * that the assignment shrank rather than a silently smaller list.
 */

export interface AssignmentItemView {
  id: string;
  title: string;
  href: string;
  /** The item's progress units: itself, plus a paper's inserted lessons. */
  progressIds: string[];
}

export interface AssignmentView {
  id: string;
  title: string;
  note: string | null;
  dueAt: Date | null;
  createdAt: Date;
  createdByName: string | null;
  items: AssignmentItemView[];
  /** Stored ids that have since left the content graph. */
  staleCount: number;
}

/** The item's section head, if it is a subsection (either item kind). */
export function sectionIdOf(item: ModuleItem): string | undefined {
  return item.kind === "lesson"
    ? item.lesson.sectionItemId
    : item.paper.sectionItemId;
}

/**
 * Resolve a stored content id to a displayable module item. Returns null for
 * anything that is not a module item proper — unknown ids, and papers'
 * inserted lessons (which getContentLocation resolves but which are not
 * assignable on their own: they ride with their paper's progressIds).
 */
export function resolveAssignmentItem(
  contentId: string,
): AssignmentItemView | null {
  const location = getContentLocation(contentId);
  if (!location) return null;
  const items = getItemsForModule(location.module.id);
  const item = items.find((it) => itemIdOf(it) === contentId);
  if (!item) return null;
  // A section head answers for its subsections everywhere (the groupDone rule
  // in item-done.ts), so assigning one assigns its whole group — otherwise a
  // nine-section submodule would report done from its opening page.
  const children = items.filter((it) => sectionIdOf(it) === contentId);
  return {
    id: contentId,
    title: itemTitleOf(item),
    href: location.href,
    progressIds: [item, ...children].flatMap(getItemProgressContentIds),
  };
}

/** The Json column read back defensively: an array of strings, else empty. */
export function parseStoredContentIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string");
}

/**
 * Parse the form's YYYY-MM-DD due date into midnight UTC. Empty means no due
 * date (null); anything malformed or outside 2000–2100 is undefined so the
 * action can reject it rather than storing a surprise.
 */
export function parseDueDate(raw: string): Date | null | undefined {
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined;
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return undefined;
  // V8 rolls impossible days over instead of failing ("2026-02-30" parses to
  // March 2); only the round-trip proves the date meant what it said.
  if (date.toISOString().slice(0, 10) !== raw) return undefined;
  const year = date.getUTCFullYear();
  if (year < 2000 || year > 2100) return undefined;
  return date;
}

// Stored as midnight UTC and formatted in UTC, a due date round-trips to
// exactly the calendar day the instructor picked, so unlike the roster's
// lastActive timestamps it needs no "UTC" label.
const DUE_DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDueDate(dueAt: Date): string {
  return DUE_DATE_FMT.format(dueAt);
}

const UTC_DAY_MS = 86_400_000;

/**
 * Due dates are stored as midnight UTC of the chosen day and hold through the
 * end of that whole UTC day — past due starts the moment the next one does.
 */
export function isPastDue(dueAt: Date | null, now: Date = new Date()): boolean {
  if (!dueAt) return false;
  return now.getTime() >= dueAt.getTime() + UTC_DAY_MS;
}

export function assignmentItemDone(
  item: AssignmentItemView,
  completed: Set<string>,
): boolean {
  return item.progressIds.every((id) => completed.has(id));
}

/** Done only when every surviving item is done — never vacuously on stale ids. */
export function assignmentDone(
  assignment: AssignmentView,
  completed: Set<string>,
): boolean {
  return (
    assignment.items.length > 0 &&
    assignment.items.every((item) => assignmentItemDone(item, completed))
  );
}

interface AssignmentRow {
  id: string;
  title: string;
  note: string | null;
  contentIds: unknown;
  dueAt: Date | null;
  createdAt: Date;
  createdBy: { name: string | null; email: string } | null;
}

function toAssignmentView(row: AssignmentRow): AssignmentView {
  const ids = parseStoredContentIds(row.contentIds);
  const items = ids
    .map(resolveAssignmentItem)
    .filter((item): item is AssignmentItemView => item !== null);
  return {
    id: row.id,
    title: row.title,
    note: row.note,
    dueAt: row.dueAt,
    createdAt: row.createdAt,
    createdByName: row.createdBy
      ? (row.createdBy.name ?? row.createdBy.email)
      : null,
    items,
    staleCount: ids.length - items.length,
  };
}

/**
 * A classroom's assignments, soonest due first (undated ones last, newest
 * first). Null means the Assignment table has not been migrated yet — the
 * pages render a fail-closed notice for instructors and nothing for students
 * (db/migrations/20260820120000_assignments.sql).
 */
export async function getClassroomAssignments(
  classroomId: string,
): Promise<AssignmentView[] | null> {
  try {
    const rows = await prisma.assignment.findMany({
      where: { classroomId },
      include: { createdBy: { select: { name: true, email: true } } },
      orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
    });
    return rows.map(toAssignmentView);
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

/**
 * Each user's completed content ids, scoped to the given assignments'
 * progress units — one batched query however many students and assignments
 * (the getClassroomRoster shape). Feed the sets to assignmentItemDone /
 * assignmentDone.
 */
export async function getAssignmentCompletion(
  userIds: string[],
  assignments: AssignmentView[],
): Promise<Map<string, Set<string>>> {
  const byUser = new Map(userIds.map((id) => [id, new Set<string>()]));
  const progressIds = [
    ...new Set(
      assignments.flatMap((a) => a.items.flatMap((item) => item.progressIds)),
    ),
  ];
  if (userIds.length === 0 || progressIds.length === 0) return byUser;

  const rows = await prisma.lessonProgress.findMany({
    where: {
      userId: { in: userIds },
      lessonId: { in: progressIds },
      status: "completed",
    },
    select: { userId: true, lessonId: true },
  });
  for (const row of rows) {
    byUser.get(row.userId)?.add(row.lessonId);
  }
  return byUser;
}
