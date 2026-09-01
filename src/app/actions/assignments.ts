"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import { isStorableText } from "@/lib/content/exercise-view";
import { parseDueDate, resolveAssignmentItem } from "@/lib/assignments";
import { requireInstructor } from "@/lib/classrooms";

export interface AssignmentActionState {
  error?: string;
}

// The title renders in both roles' assignment lists; same cap story as the
// classroom name (the form mirrors it with maxLength).
const MAX_TITLE_LENGTH = 120;
const MAX_NOTE_LENGTH = 2000;
const MAX_ITEMS = 100;
// Bounds the classroom page's derived reads — it renders every assignment.
const MAX_ASSIGNMENTS = 100;

const MIGRATION_MESSAGE =
  "Assignments aren't set up yet — the database needs db/migrations/20260820120000_assignments.sql applied.";

export async function createAssignment(
  _prev: AssignmentActionState,
  formData: FormData,
): Promise<AssignmentActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };

  const classroomId = String(formData.get("classroomId") ?? "").trim();
  if (!classroomId) return { error: "Missing classroom." };
  await requireInstructor(user.id, classroomId);

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Give the assignment a title." };
  if (title.length > MAX_TITLE_LENGTH) {
    return { error: `Keep the title under ${MAX_TITLE_LENGTH} characters.` };
  }
  if (!isStorableText(title)) {
    return { error: "The title contains unsupported characters." };
  }

  const note = String(formData.get("note") ?? "").trim();
  if (note.length > MAX_NOTE_LENGTH) {
    return { error: `Keep the note under ${MAX_NOTE_LENGTH} characters.` };
  }
  if (note && !isStorableText(note)) {
    return { error: "The note contains unsupported characters." };
  }

  const dueAt = parseDueDate(String(formData.get("dueAt") ?? "").trim());
  if (dueAt === undefined) return { error: "That due date isn't valid." };

  // Reachable by direct POST: only module items in the content graph may be
  // stored (the LessonProgress convention — arbitrary ids get no row).
  const contentIds = [
    ...new Set(formData.getAll("contentIds").map((value) => String(value))),
  ];
  if (contentIds.length === 0) {
    return { error: "Pick at least one lesson or paper." };
  }
  if (contentIds.length > MAX_ITEMS) {
    return { error: `Keep an assignment under ${MAX_ITEMS} items.` };
  }
  if (contentIds.some((id) => resolveAssignmentItem(id) === null)) {
    return {
      error:
        "One of the selected items isn't in the curriculum any more. Refresh and pick again.",
    };
  }

  try {
    // Soft cap — a concurrent create may briefly overshoot by one, which is
    // fine; this bounds runaway rooms, it is not an invariant.
    const existing = await prisma.assignment.count({ where: { classroomId } });
    if (existing >= MAX_ASSIGNMENTS) {
      return {
        error: `A classroom holds at most ${MAX_ASSIGNMENTS} assignments — delete one first.`,
      };
    }
    await prisma.assignment.create({
      data: {
        classroomId,
        createdById: user.id,
        title,
        note: note || null,
        contentIds,
        dueAt,
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) return { error: MIGRATION_MESSAGE };
    throw error;
  }

  revalidatePath(`/classrooms/${classroomId}`);
  redirect(`/classrooms/${classroomId}`);
}

export async function deleteAssignment(
  classroomId: string,
  assignmentId: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await requireInstructor(user.id, classroomId);
  // Scoped to the classroom, so a forged id from another room deletes nothing.
  await prisma.assignment.deleteMany({
    where: { id: assignmentId, classroomId },
  });
  revalidatePath(`/classrooms/${classroomId}`);
}
