import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";

/**
 * Per-user state for the standalone Verification site (public/verification/).
 *
 * Those pages are plain HTML with no server session of their own, so this is
 * how they reach the account: GET to find out whether anyone is signed in and
 * what the server holds, PUT (or POST — see below) to store. A signed-out
 * visitor gets 401 and the pages carry on with localStorage — that is a
 * supported mode, not an error.
 *
 * Last write wins on the client's `updatedAt`, and it is enforced HERE rather
 * than assumed of the client. There is no merge: the document is one learner's
 * own progress and notebook, so the only realistic conflict is the same person
 * in two tabs and the newer edit is the right answer — but "the newer edit"
 * has to mean the newer edit, not whichever request arrived last. A tab that
 * has been open since before a reset would otherwise put the reset progress
 * back. A stale write is refused with 409 and the row is left alone.
 *
 * POST is PUT. The unload path is navigator.sendBeacon, which can only POST,
 * and that path carries the last edit before a tab closes — the one edit most
 * likely to be lost.
 */

// Ids plus notebook text. Only sketches (PNG dataURLs) can make this big, and
// a book of them belongs in the browser, not in a row — the DB has a matching
// CHECK so an oversized document fails loudly at both ends.
const MAX_BYTES = 1_000_000;

/* db/migrations/20260805120000_verification_state.sql is applied by hand
   against prod, so the table can be absent from a deploy that carries this
   code. Signed-out is already a supported mode for every one of these pages;
   this makes "the account is not storing anything yet" behave the same way —
   the site stays on localStorage — instead of throwing a 500 into the
   console on every page load. */
const UNAVAILABLE = {
  error: "Verification state storage is not ready",
  migration: "db/migrations/20260805120000_verification_state.sql",
  unavailable: true,
} as const;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ signedIn: false }, { status: 401 });
  }
  try {
    const row = await getDb().verificationState.findUnique({
      where: { userId: user.id },
      select: { data: true, updatedAt: true },
    });
    return NextResponse.json({
      signedIn: true,
      data: row?.data ?? null,
      updatedAt: row?.updatedAt?.getTime() ?? 0,
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ signedIn: true, ...UNAVAILABLE }, { status: 503 });
    }
    throw error;
  }
}

/** The client-derived stamp inside the document, as a number. Anything else —
 *  absent, a string, a NaN — is 0, which is the stamp of a document that has
 *  never claimed a time and loses every contest but the first. */
function clientStamp(data: Record<string, unknown>): number {
  const raw = data.updatedAt;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

async function store(request: Request): Promise<NextResponse> {
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

  const incoming = clientStamp(data as Record<string, unknown>);
  const db = getDb();

  try {
    /* One statement, because the check and the write have to be the same
       operation: a read-then-upsert would let two of this learner's tabs
       interleave and land the older document. The stamp is compared inside
       the stored JSON — the row's own updatedAt is touched on every write, so
       it always looks newer than the edit it holds.

       `<=` and not `<`: a beacon and its retry carry the same stamp, and the
       second one storing again is harmless where refusing it would strand a
       last edit. The jsonb_typeof guard is there because a row written before
       the document carried a stamp, or one carrying a string, must read as
       "no stamp" rather than fail the cast and take the whole write with it. */
    const written = await db.$executeRaw`
      INSERT INTO "VerificationState" ("userId", "data", "updatedAt")
      VALUES (${user.id}, ${JSON.stringify(data)}::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT ("userId") DO UPDATE
        SET "data" = EXCLUDED."data", "updatedAt" = CURRENT_TIMESTAMP
        WHERE COALESCE(
          CASE
            WHEN jsonb_typeof("VerificationState"."data" -> 'updatedAt') = 'number'
            THEN ("VerificationState"."data" ->> 'updatedAt')::numeric
          END, 0) <= ${incoming}::numeric
    `;

    const row = await db.verificationState.findUnique({
      where: { userId: user.id },
      select: { updatedAt: true },
    });
    const updatedAt = row?.updatedAt?.getTime() ?? 0;

    if (written === 0) {
      /* The account holds a newer document than the one this tab offered.
         Refusing is the whole point of the protocol; the tab keeps its own
         copy and adopts the account's on its next load, which is where
         adopting is safe — swapping the stores out from under a learner
         mid-keystroke is not. */
      return NextResponse.json({ ok: false, stale: true, updatedAt }, { status: 409 });
    }
    return NextResponse.json({ ok: true, updatedAt });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json(UNAVAILABLE, { status: 503 });
    }
    throw error;
  }
}

export async function PUT(request: Request) {
  return store(request);
}

/** sendBeacon's only verb. Same handler — see the note at the top. */
export async function POST(request: Request) {
  return store(request);
}
