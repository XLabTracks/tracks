// Vertical stacking for the margin-note layer (paper-highlights.tsx): each
// note box wants to sit level with its highlight's first line, but boxes may
// not overlap — later boxes get pushed down below the previous box plus a
// breathing gap. Pure so the cursor math is testable; the component supplies
// desired tops and measured heights in document order.

export interface CommentSlot {
  /** Desired top (document coordinates), aligned to the highlight. */
  top: number;
  /** Measured box height at the rail width. */
  height: number;
}

/**
 * Final tops for boxes given in document order: each at its desired top,
 * unless the previous box (plus `gap`) reaches lower — then directly below
 * it. Never above `minTop`.
 */
export function stackCommentTops(
  slots: readonly CommentSlot[],
  gap: number,
  minTop = 8,
): number[] {
  const tops: number[] = [];
  let cursor = Number.NEGATIVE_INFINITY;
  for (const slot of slots) {
    const top = Math.max(minTop, slot.top, cursor + gap);
    tops.push(top);
    cursor = top + slot.height;
  }
  return tops;
}
