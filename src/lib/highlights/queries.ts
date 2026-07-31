import { prisma } from "@/lib/db";
import type { HighlightRow } from "./types";

/**
 * A user's highlights on one paper item, in creation order (the client
 * layer sorts document-order views itself — blockAnchor is zero-padded but
 * lexicographic order breaks at a digit-count rollover). Minimal columns:
 * these rows ride the RSC payload of every signed-in paper view.
 */
export async function getHighlightsForItem(
  userId: string,
  contentId: string,
): Promise<HighlightRow[]> {
  return prisma.highlight.findMany({
    where: { userId, contentId },
    select: {
      id: true,
      groupId: true,
      blockAnchor: true,
      sStart: true,
      sEnd: true,
      startOffset: true,
      endOffset: true,
      snippet: true,
      note: true,
      convVersion: true,
    },
    orderBy: { createdAt: "asc" },
  });
}
