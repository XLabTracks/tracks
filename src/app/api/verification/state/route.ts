import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getDb, isUniqueViolation } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import { readLimitedBody } from "@/lib/http/read-limited-body";
import {
  mergeVerificationStateDocuments,
  normalizeVerificationStateDocument,
} from "@/lib/verification/state-document";

/**
 * Per-user state for the standalone Verification site (public/verification/).
 *
 * Those pages are plain HTML with no server session of their own, so this is
 * how they reach the account: GET to find out whether anyone is signed in and
 * what the server holds, PUT (or POST — see below) to store. A signed-out
 * visitor gets 401 and the pages carry on with localStorage — that is a
 * supported mode, not an error.
 *
 * Each browser store carries its own clock. Writes merge those stores in an
 * optimistic compare-and-swap loop, so a new Field Map from one tab cannot
 * erase a newer notebook from another tab. The row is still one compact JSON
 * document and therefore needs no schema churn as stores are added.
 *
 * POST is PUT. The unload path is navigator.sendBeacon, which can only POST,
 * and that path carries the last edit before a tab closes — the one edit most
 * likely to be lost.
 */

// Ids plus learner-authored text and maps. Only sketches (PNG dataURLs) can
// make this big, and a book of them belongs in the browser, not in a row — the
// DB has a matching CHECK so an oversized document fails loudly at both ends.
const MAX_BYTES = 1_000_000;

// The merge unions two documents, so the STORED row can outgrow any single
// write. Bounded here, under the DB's 2MB CHECK with margin (pg_column_size
// measures JSONB, not this exact string), so an over-full account surfaces as
// a clear 413 the client can show — not as a CHECK violation 500 it would
// blindly retry forever.
const MAX_MERGED_BYTES = 1_500_000;

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
      data: row ? normalizeVerificationStateDocument(row.data) : null,
      updatedAt: row?.updatedAt?.getTime() ?? 0,
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ signedIn: true, ...UNAVAILABLE }, { status: 503 });
    }
    throw error;
  }
}

async function store(request: Request): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ signedIn: false }, { status: 401 });
  }

  // Reachable by direct POST, so the body is checked before it is stored.
  const body = await readLimitedBody(request, MAX_BYTES);
  if (!body.ok) {
    return NextResponse.json(
      { error: "State too large", limit: MAX_BYTES },
      { status: 413 },
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(body.text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "Expected an object" }, { status: 400 });
  }

  const incoming = normalizeVerificationStateDocument(data);
  const db = getDb();

  try {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const current = await db.verificationState.findUnique({
        where: { userId: user.id },
        select: { data: true, updatedAt: true },
      });

      if (!current) {
        try {
          const created = await db.verificationState.create({
            data: {
              userId: user.id,
              data: incoming as unknown as Prisma.InputJsonValue,
            },
            select: { updatedAt: true },
          });
          return NextResponse.json({
            ok: true,
            data: incoming,
            updatedAt: created.updatedAt.getTime(),
          });
        } catch (error) {
          if (isUniqueViolation(error)) continue;
          throw error;
        }
      }

      const merged = mergeVerificationStateDocuments(current.data, incoming);
      if (
        merged.changed &&
        new TextEncoder().encode(JSON.stringify(merged.document)).length >
          MAX_MERGED_BYTES
      ) {
        return NextResponse.json(
          {
            error: "Account state is full — export or clear some sketches",
            limit: MAX_MERGED_BYTES,
            full: true,
          },
          { status: 413 },
        );
      }
      if (!merged.changed) {
        return NextResponse.json({
          ok: true,
          data: merged.document,
          updatedAt: current.updatedAt.getTime(),
        });
      }

      const updated = await db.verificationState.updateManyAndReturn({
        where: { userId: user.id, updatedAt: current.updatedAt },
        data: { data: merged.document as unknown as Prisma.InputJsonValue },
        select: { updatedAt: true },
      });
      if (updated.length === 1) {
        return NextResponse.json({
          ok: true,
          data: merged.document,
          updatedAt: updated[0].updatedAt.getTime(),
        });
      }
    }

    return NextResponse.json(
      { ok: false, retry: true, error: "State changed while saving" },
      { status: 409 },
    );
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
