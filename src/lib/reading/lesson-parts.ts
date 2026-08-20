/**
 * Where a lesson breaks into pages.
 *
 * Boundaries are authored in MDX with <PageBreak title="…"/>. Headings are
 * deliberately not boundaries: their job is to expose the document's
 * hierarchy to readers and assistive technology, and that hierarchy is often
 * finer than a useful page. The old adaptive h2/h3/h4 chunker routinely
 * separated a prompt from its evidence or produced a screen containing only
 * a heading and one sentence.
 *
 * Pure: LessonPartsReader describes the body's top-level DOM children and
 * this module returns the exact groups to show. Keeping the grouping outside
 * the DOM walk makes the authoring contract testable.
 */

export interface PartSource {
  /** Upper-case tag name, as the DOM reports it. */
  tag: string;
  /** Text content, used only to derive the first page's label. */
  text: string;
  /** The title carried by a PageBreak marker; absent on ordinary blocks. */
  breakLabel?: string;
}

export interface PlannedPart {
  label: string;
  /** Index of the first heading in the page, for its deep-link anchor. */
  headingIndex: number | null;
  /** Indices of visible blocks this page shows. Break markers are excluded. */
  indices: number[];
}

/** A manually authored two-page lesson is intentional and must page. */
export const MIN_PARTS = 2;

const HEADING = /^H[2-6]$/;

function firstHeadingIndex(
  indices: number[],
  items: PartSource[]
): number | null {
  return indices.find((index) => HEADING.test(items[index].tag)) ?? null;
}

function firstPageLabel(
  indices: number[],
  items: PartSource[],
  fallbackLabel: string
): string {
  const heading = firstHeadingIndex(indices, items);
  return heading === null
    ? fallbackLabel
    : items[heading].text.trim() || fallbackLabel;
}

export function planParts(
  items: PartSource[],
  fallbackLabel = "Start"
): PlannedPart[] {
  const pages: PlannedPart[] = [];
  let indices: number[] = [];
  let nextLabel: string | null = null;

  const flush = () => {
    if (!indices.length) return;
    const headingIndex = firstHeadingIndex(indices, items);
    pages.push({
      label: nextLabel ?? firstPageLabel(indices, items, fallbackLabel),
      headingIndex,
      indices,
    });
    indices = [];
  };

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (item.breakLabel !== undefined) {
      flush();
      nextLabel = item.breakLabel.trim() || "Continue";
      continue;
    }
    indices.push(index);
  }
  flush();

  return pages;
}
