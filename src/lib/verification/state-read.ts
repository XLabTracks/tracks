import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-missing-table";
import { memoDraftsFrom, type MemoDraft } from "./memo-drafts";

export async function getMemoDrafts(
  userId: string,
): Promise<MemoDraft[] | null> {
  try {
    const rows = await prisma.$queryRaw<{ memos: unknown }[]>`
      SELECT "data" -> 'memos' AS memos
      FROM "VerificationState"
      WHERE "userId" = ${userId}
    `;
    return memoDraftsFrom(rows[0]?.memos ?? null);
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}
