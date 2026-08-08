"use server";

import { revalidatePath } from "next/cache";

import { forgetUserMirror, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

// A display name, not an identity. Email is the identity and WorkOS owns it;
// this is only what the app prints beside your work.
const MAX_NAME = 80;

export type SaveNameResult =
  | { ok: true; name: string }
  | { ok: false; error: string };

/**
 * Sets the signed-in user's profile name.
 *
 * Reachable by direct POST like every action here, so the value is stripped of
 * control characters, collapsed, trimmed and length-capped before it is
 * stored. `User.name` is rendered in classrooms and beside submissions, where
 * a newline or an overlong string would break the row it sits in.
 */
export async function saveProfileName(name: string): Promise<SaveNameResult> {
  const user = await requireUser();

  const clean = String(name ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return { ok: false, error: "A profile name is required." };
  if (clean.length > MAX_NAME) {
    return { ok: false, error: `Keep it under ${MAX_NAME} characters.` };
  }

  await prisma.user.update({ where: { id: user.id }, data: { name: clean } });
  /* Two things would otherwise put the old name straight back: the isolate's
     user mirror, which is why every writer of these columns has to drop its
     entry, and the sign-in mirror itself — auth.ts writes `name` from WorkOS
     only into a row that has none, precisely so this edit is the last word. */
  forgetUserMirror(user.workosUserId);
  revalidatePath("/account");
  return { ok: true, name: clean };
}
