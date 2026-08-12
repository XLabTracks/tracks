"use server";

import { getCurrentUser } from "@/lib/auth";
import { isUniqueViolation, prisma } from "@/lib/db";
import { getPaperById } from "@/lib/content";
import type { PaperSource } from "@/lib/content/types";
import { getLinkedReading, linkedReadingSource } from "@/lib/readings/registry";
import { getHighlightArtifactContext } from "@/lib/highlights/artifact";
import { matchesSnippet, sliceRangeText } from "@/lib/highlights/match";
import {
  sanitizeHighlightInput,
  sanitizeHighlightNote,
} from "@/lib/highlights/sanitize";
import {
  HIGHLIGHT_MAX_PER_ITEM,
  HIGHLIGHT_MAX_PER_USER,
  type CreateHighlightResult,
} from "@/lib/highlights/types";

// User highlights on paper items. Every action is reachable by direct POST,
// so each one re-checks auth and re-validates its payload; createHighlight
// additionally verifies the anchor + snippet against the paper's committed
// artifact — a row that doesn't match what the paper actually says is never
// stored. None of these revalidate any path: the client layer owns the
// painted state and reconciles from the return values (the writing-autosave
// idiom), so a server-driven rerender would only cost an RSC round trip.

/** Stored highlight ids are cuid/uuid-sized; anything else is a bogus POST. */
function isHighlightId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 1 && value.length <= 64;
}

/**
 * Document order over a group's spans — numeric anchor compare (lexicographic
 * anchors break at a digit-count rollover), then sentence + offset within the
 * block. Mirror of the reader's compareRowOrder (paper-highlights.tsx): the
 * group's HEAD row — the only row allowed to carry the note — is the minimum
 * under this order.
 */
function compareSpanOrder(
  a: { blockAnchor: string; sStart: number; startOffset: number },
  b: { blockAnchor: string; sStart: number; startOffset: number },
): number {
  const anchorNum = (anchor: string) => Number.parseInt(anchor.slice(2), 10) || 0;
  return (
    anchorNum(a.blockAnchor) - anchorNum(b.blockAnchor) ||
    a.sStart - b.sStart ||
    a.startOffset - b.startOffset
  );
}

/** The /readings viewer's contentId namespace (paperShell in its page). */
const READING_PREFIX = "reading-";

/**
 * Resolve a highlightable document id to its artifact source: a course
 * paper item, or a linked reading from the prebuilt registry (the /readings
 * viewer — not a content-graph item, but its artifacts are just as pinned).
 * Anything else (lessons included, for now) gets no rows.
 */
function highlightSourceOf(contentId: string): PaperSource | null {
  const paper = getPaperById(contentId);
  if (paper) return paper.source;
  if (contentId.startsWith(READING_PREFIX)) {
    const reading = getLinkedReading(contentId.slice(READING_PREFIX.length));
    if (reading) return linkedReadingSource(reading);
  }
  return null;
}

/**
 * Persists one highlight GESTURE for the signed-in user: one row per
 * posted block span, all sharing a fresh groupId (the note goes on the
 * head row — spans[0]). Returns the group and its row ids in span order —
 * or, for a single-span duplicate gesture, the EXISTING row's group (the
 * client reconciles instead of erroring) — plus the distinguishable
 * failures the client can message: `{ error: "cap" }` when a count cap is
 * reached, `{ error: "stale" }` when the posted convVersion no longer
 * matches the served artifact. Everything else (signed out, unknown
 * content, invalid payload, any span failing artifact validation) is a
 * generic null — a group persists whole or not at all.
 */
export async function createHighlight(
  contentId: string,
  input: unknown,
): Promise<CreateHighlightResult> {
  if (typeof contentId !== "string") return null;
  const user = await getCurrentUser();
  if (!user) return null;
  // Only ids resolving to a pinned artifact get rows: paper items and
  // linked readings share the annotation contract this whole model rides on.
  const paperSource = highlightSourceOf(contentId);
  if (!paperSource) return null;
  // Cheap shape gate before the artifact work.
  const clean = sanitizeHighlightInput(input);
  if (!clean) return null;

  // Authoritative check against the committed artifact: the anchor must
  // exist, the sentence range must be in bounds, and the posted snippet must
  // be exactly what those sentences say. A stale convVersion means the
  // client captured against an artifact this deploy no longer serves — its
  // anchors may point at different text, so reject rather than store a row
  // that would orphan (or worse, mislead) immediately.
  const context = await getHighlightArtifactContext(paperSource);
  if (!context) return null;
  if (clean.convVersion !== context.convVersion) return { error: "stale" };
  // Character-precise, per span: the posted offsets must slice a real,
  // non-empty range out of that block's sentences, and the span's snippet
  // must be exactly that slice. One bad span rejects the whole gesture.
  for (const span of clean.spans) {
    const block = context.blocks.get(span.blockAnchor);
    if (!block) return null;
    const rangeText = sliceRangeText(block.sentences, span);
    if (rangeText === null) return null;
    if (!matchesSnippet(rangeText, span.snippet)) return null;
  }

  // Both caps are plain pre-counts: N truly simultaneous POSTs each count
  // committed rows only, so a deliberate parallel flood can overshoot either
  // cap by roughly the concurrency level. That bounded overshoot is
  // acceptable for an abuse cap (nothing corrupts; the panel just lists a
  // few extra rows). A group counts one row per span.
  const [onItem, total] = await Promise.all([
    prisma.highlight.count({ where: { userId: user.id, contentId } }),
    prisma.highlight.count({ where: { userId: user.id } }),
  ]);
  if (
    onItem + clean.spans.length > HIGHLIGHT_MAX_PER_ITEM ||
    total + clean.spans.length > HIGHLIGHT_MAX_PER_USER
  ) {
    return { error: "cap" };
  }

  const groupId = crypto.randomUUID();
  // The group's note lives on the HEAD row only — the first span in DOCUMENT
  // order. The client posts document order (head = spans[0]), but the payload
  // is untrusted: recompute rather than let a shuffled direct POST park the
  // note on a non-head row the panel would never surface for editing.
  const headIndex = clean.spans.reduce(
    (best, span, i) =>
      compareSpanOrder(span, clean.spans[best]) < 0 ? i : best,
    0,
  );
  try {
    // Batch transaction: the group persists whole or not at all — a partial
    // group would paint fragments the panel calls one highlight.
    const created = await prisma.$transaction(
      clean.spans.map((span, index) =>
        prisma.highlight.create({
          data: {
            userId: user.id,
            contentId,
            groupId,
            artifactKey: context.artifactKey,
            convVersion: clean.convVersion,
            blockAnchor: span.blockAnchor,
            sStart: span.sStart,
            sEnd: span.sEnd,
            startOffset: span.startOffset,
            endOffset: span.endOffset,
            snippet: span.snippet,
            note: index === headIndex ? clean.note : null,
          },
          select: { id: true },
        }),
      ),
    );
    return { groupId, ids: created.map((row) => row.id) };
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    // A span already has a row. For a single-span duplicate gesture, hand
    // back the existing row's group so the client converges on one
    // highlight; after an artifact rebuild the coordinates can collide
    // while the STORED snippet is stale — the posted snippet was validated
    // above, so converge the row on current truth instead of resurrecting
    // stale state. Multi-span collisions (re-dragging over an existing
    // group, or overlapping one) have no single right answer — generic
    // failure, nothing persisted.
    if (clean.spans.length > 1) return null;
    const span = clean.spans[0];
    const existing = await prisma.highlight.findUnique({
      where: {
        userSpan: {
          userId: user.id,
          contentId,
          blockAnchor: span.blockAnchor,
          sStart: span.sStart,
          sEnd: span.sEnd,
          startOffset: span.startOffset,
          endOffset: span.endOffset,
        },
      },
      select: { id: true, groupId: true, snippet: true },
    });
    if (!existing) return null;
    if (existing.snippet !== span.snippet) {
      await prisma.highlight.update({
        where: { id: existing.id },
        data: {
          snippet: span.snippet,
          artifactKey: context.artifactKey,
          convVersion: clean.convVersion,
        },
      });
    }
    return { groupId: existing.groupId, ids: [existing.id] };
  }
}

/**
 * Saves (or clears, with null/whitespace) the note on the caller's own
 * highlight GROUP. Debounced-autosave target: returns whether a row was
 * written. The note lands on the group's HEAD row no matter which owned row
 * id was posted: the whole model assumes a note lives ONLY on the head (the
 * panel renders head.note; the classmate query returns one row per noted
 * group), and this action is reachable by direct POST with any of the row
 * ids createHighlight returns — a non-head write would surface to classmates
 * as an annotation the owner's own panel never shows.
 */
export async function updateHighlightNote(
  highlightId: string,
  note: unknown,
): Promise<boolean> {
  if (!isHighlightId(highlightId)) return false;
  const user = await getCurrentUser();
  if (!user) return false;
  const clean = sanitizeHighlightNote(note);
  if (clean === undefined) return false;
  // Ownership lives in the predicate — a guessed id belonging to another
  // user matches zero rows instead of leaking or clobbering anything.
  const target = await prisma.highlight.findFirst({
    where: { id: highlightId, userId: user.id },
    select: { groupId: true },
  });
  if (!target) return false;
  const rows = await prisma.highlight.findMany({
    where: { groupId: target.groupId, userId: user.id },
    select: { id: true, blockAnchor: true, sStart: true, startOffset: true },
  });
  const head = [...rows].sort(compareSpanOrder)[0];
  if (!head) return false;
  const updated = await prisma.highlight.updateMany({
    where: { id: head.id, userId: user.id },
    data: { note: clean },
  });
  return updated.count > 0;
}

/**
 * Deletes the caller's own highlight GROUP — every row of the gesture
 * (ownership in the predicate).
 */
export async function deleteHighlight(groupId: string): Promise<boolean> {
  if (!isHighlightId(groupId)) return false;
  const user = await getCurrentUser();
  if (!user) return false;
  const deleted = await prisma.highlight.deleteMany({
    where: { groupId, userId: user.id },
  });
  return deleted.count > 0;
}
