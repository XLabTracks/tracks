import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Per-user state for the standalone Verification site (public/verification/).
 *
 * Those pages are plain HTML with no server session of their own, so this is
 * how they reach the account: GET to find out whether anyone is signed in and
 * what the server holds, PUT to store. A signed-out visitor gets 401 and the
 * pages carry on with localStorage — that is a supported mode, not an error.
 *
 * Last write wins on the client's `updatedAt`. There is no merge: the document
 * is one learner's own progress and notebook, so the only realistic conflict is
 * the same person in two tabs, and the newer edit is the right answer.
 */

// Ids plus notebook text. Only sketches (PNG dataURLs) can make this big, and
// a book of them belongs in the browser, not in a row — the DB has a matching
// CHECK so an oversized document fails loudly at both ends.
const MAX_BYTES = 1_000_000;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ signedIn: false }, { status: 401 });
  }
  const row = await prisma.verificationState.findUnique({
    where: { userId: user.id },
    select: { data: true, updatedAt: true },
  });
  return NextResponse.json({
    signedIn: true,
    data: row?.data ?? null,
    updatedAt: row?.updatedAt?.getTime() ?? 0,
  });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ signedIn: false }, { status: 401 });
  }

  // Reachable by direct POST, so the body is checked before it is stored.
  const raw = await request.text();
  if (raw.length > MAX_BYTES) {
    return NextResponse.json(
      { error: "State too large", limit: MAX_BYTES },
      { status: 413 },
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "Expected an object" }, { status: 400 });
  }

  const row = await prisma.verificationState.upsert({
    where: { userId: user.id },
    create: { userId: user.id, data: data as object },
    update: { data: data as object },
    select: { updatedAt: true },
  });
  return NextResponse.json({ ok: true, updatedAt: row.updatedAt.getTime() });
}
