"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { isUniqueViolation, prisma } from "@/lib/db";
import { getTrackById } from "@/lib/content";
import { isStorableText } from "@/lib/content/exercise-view";

export interface ClassroomActionState {
  error?: string;
}

// The name renders in the classroom list, page header, and every member's
// grading-key dropdown — cap it server-side like all other persisted text
// (the create form mirrors this with maxLength).
const MAX_NAME_LENGTH = 120;

// No ambiguous characters (0/O, 1/I/L).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
// Join codes gate classroom membership (which exposes the roster), so draw
// from a CSPRNG — Math.random's state is recoverable from observed codes.
// Rejection-sample so the 256-value byte space maps uniformly onto the
// 31-char alphabet. 10 chars gives a ~50-bit space, putting online
// brute-force enumeration out of reach without any request throttle.
// Codes issued at the old 6-char length keep working — joinClassroom
// matches on equality and never checks length.
function generateJoinCode(length = 10): string {
  const max = Math.floor(256 / CODE_ALPHABET.length) * CODE_ALPHABET.length;
  let code = "";
  while (code.length < length) {
    const bytes = crypto.getRandomValues(new Uint8Array(length * 2));
    for (const byte of bytes) {
      if (byte >= max) continue;
      code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
      if (code.length === length) break;
    }
  }
  return code;
}

// The retry loops below exist only to dodge a joinCode unique collision
// (isUniqueViolation); retry that, but never swallow connection/validation
// errors.

async function requireInstructor(userId: string, classroomId: string) {
  const membership = await prisma.classroomMembership.findUnique({
    where: { classroomId_userId: { classroomId, userId } },
    select: { role: true },
  });
  if (membership?.role !== "instructor") {
    throw new Error("Forbidden");
  }
}

// A classroom must always keep at least one instructor — otherwise its
// roster, join code, and stored key become permanently unreachable (nobody
// left with instructor rights). The demote and leave paths enforce this with
// an atomic guarded write (see setMemberRole / leaveClassroom).

export async function createClassroom(
  _prev: ClassroomActionState,
  formData: FormData,
): Promise<ClassroomActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Classroom name is required." };
  if (name.length > MAX_NAME_LENGTH) {
    return { error: `Keep the classroom name under ${MAX_NAME_LENGTH} characters.` };
  }
  if (!isStorableText(name)) {
    return { error: "Classroom name contains unsupported characters." };
  }
  // Only real track ids may be stored (a bogus one, reachable by direct POST,
  // would make a broken classroom the roster pages can't scope).
  const rawTrackId = String(formData.get("trackId") ?? "").trim() || null;
  const trackId = rawTrackId && getTrackById(rawTrackId) ? rawTrackId : null;

  let newId: string | undefined;
  for (let attempt = 0; attempt < 5 && !newId; attempt++) {
    try {
      const classroom = await prisma.classroom.create({
        data: {
          name,
          trackId,
          createdById: user.id,
          joinCode: generateJoinCode(),
          memberships: { create: { userId: user.id, role: "instructor" } },
        },
        select: { id: true },
      });
      newId = classroom.id;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      if (attempt === 4) return { error: "Could not create classroom. Try again." };
    }
  }

  redirect(`/classrooms/${newId}`);
}

export async function joinClassroom(
  _prev: ClassroomActionState,
  formData: FormData,
): Promise<ClassroomActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };

  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  if (!code) return { error: "Enter a join code." };

  const classroom = await prisma.classroom.findUnique({
    where: { joinCode: code },
    select: { id: true },
  });
  if (!classroom) return { error: "That join code isn't valid." };

  await prisma.classroomMembership.upsert({
    where: { classroomId_userId: { classroomId: classroom.id, userId: user.id } },
    create: { classroomId: classroom.id, userId: user.id, role: "student" },
    update: {},
  });

  redirect(`/classrooms/${classroom.id}`);
}

export async function removeMember(
  classroomId: string,
  memberUserId: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await requireInstructor(user.id, classroomId);
  // Only students can be removed (never instructors).
  await prisma.classroomMembership.deleteMany({
    where: { classroomId, userId: memberUserId, role: "student" },
  });
  revalidatePath(`/classrooms/${classroomId}`);
}

export async function regenerateJoinCode(classroomId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await requireInstructor(user.id, classroomId);
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await prisma.classroom.update({
        where: { id: classroomId },
        data: { joinCode: generateJoinCode() },
      });
      break;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      if (attempt === 4) throw new Error("Could not regenerate code");
    }
  }
  revalidatePath(`/classrooms/${classroomId}`);
}

// Promote a student to co-instructor or demote an instructor back to student.
// Instructor-only, and it never lets the classroom lose its last instructor
// (an instructor could otherwise demote themselves into a locked-out room).
export async function setMemberRole(
  classroomId: string,
  memberUserId: string,
  role: "instructor" | "student",
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await requireInstructor(user.id, classroomId);
  if (role !== "instructor" && role !== "student") {
    throw new Error("Invalid role");
  }

  const target = await prisma.classroomMembership.findUnique({
    where: { classroomId_userId: { classroomId, userId: memberUserId } },
    select: { role: true },
  });
  if (!target) throw new Error("Not a member");
  if (target.role === role) return; // already there — nothing to change

  if (role === "student") {
    // Guard and demote atomically. A separate count-then-update races: two
    // concurrent demotes/leaves can each read count=2 and both commit,
    // stranding the room with zero instructors (and requireInstructor then
    // locks everyone out of the roster, key, and delete forever). Locking
    // the Classroom row first serializes every count-sensitive mutation for
    // this room, so the UPDATE's subquery sees committed truth.
    const [, demoted] = await prisma.$transaction([
      prisma.$queryRaw`SELECT "id" FROM "Classroom" WHERE "id" = ${classroomId} FOR UPDATE`,
      prisma.$executeRaw`
        UPDATE "ClassroomMembership" SET "role" = 'student'
        WHERE "classroomId" = ${classroomId} AND "userId" = ${memberUserId}
          AND "role" = 'instructor'
          AND (SELECT COUNT(*) FROM "ClassroomMembership" AS peers
               WHERE peers."classroomId" = ${classroomId}
                 AND peers."role" = 'instructor') > 1
      `,
    ]);
    if (demoted === 0) {
      throw new Error(
        "Promote another instructor before stepping this one down.",
      );
    }
  } else {
    await prisma.classroomMembership.update({
      where: { classroomId_userId: { classroomId, userId: memberUserId } },
      data: { role },
    });
  }
  revalidatePath(`/classrooms/${classroomId}`);
}

// Self-service exit for any member. An instructor may leave only once another
// instructor remains (mirrors setMemberRole's last-instructor guard); to close
// a solo classroom the instructor uses deleteClassroom instead.
export async function leaveClassroom(classroomId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const membership = await prisma.classroomMembership.findUnique({
    where: { classroomId_userId: { classroomId, userId: user.id } },
    select: { role: true },
  });
  if (!membership) redirect("/classrooms"); // not a member — nothing to leave

  if (membership.role === "instructor") {
    // Same atomicity story as setMemberRole's demote guard: lock the
    // Classroom row, then delete only while the invariant holds. The role
    // re-check inside the DELETE keeps a concurrently-demoted instructor
    // free to leave as a student.
    const [, removed] = await prisma.$transaction([
      prisma.$queryRaw`SELECT "id" FROM "Classroom" WHERE "id" = ${classroomId} FOR UPDATE`,
      prisma.$executeRaw`
        DELETE FROM "ClassroomMembership"
        WHERE "classroomId" = ${classroomId} AND "userId" = ${user.id}
          AND ("role" <> 'instructor'
            OR (SELECT COUNT(*) FROM "ClassroomMembership" AS peers
                WHERE peers."classroomId" = ${classroomId}
                  AND peers."role" = 'instructor') > 1)
      `,
    ]);
    if (removed === 0) {
      throw new Error(
        "You're the only instructor — promote another or delete the classroom instead.",
      );
    }
  } else {
    await prisma.classroomMembership.deleteMany({
      where: { classroomId, userId: user.id },
    });
  }
  redirect("/classrooms");
}

// Permanently delete a classroom. Instructor-only; the membership and stored
// API key rows cascade away with it (schema onDelete: Cascade).
export async function deleteClassroom(classroomId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await requireInstructor(user.id, classroomId);
  await prisma.classroom.delete({ where: { id: classroomId } });
  redirect("/classrooms");
}
