import rawRegistry from "@/content/linked-readings.json";

/**
 * Linked readings: substack / LessWrong posts that the course's post-sourced
 * papers link to, pre-converted at authoring time so those links can open in
 * the internal reader (`/readings/[readingId]`) instead of leaving the site.
 *
 * The registry (`src/content/linked-readings.json`) is GENERATED — run
 * `npm run readings:build` after changing papers.data.ts or rebuilding a
 * primary post artifact; never hand-edit it. Entries are one layer deep by
 * design: links inside a linked reading stay external, and linked readings
 * are not content-graph items — they carry no progress, never appear in a
 * module, and are deliberately excluded from the resource hub (which lists
 * only curated entries and the papers the curriculum itself assigns).
 */
export interface LinkedReading {
  kind: "substack" | "lesswrong";
  /** Artifact id — substack "{host}__{slug}" / lesswrong "{site}__{postId}". */
  id: string;
  /** Canonical public URL (factual, from the artifact meta). */
  url: string;
  /** Post title (factual, from the artifact meta). */
  title: string;
}

export const linkedReadings = rawRegistry.readings as LinkedReading[];

const byId = new Map(linkedReadings.map((r) => [r.id, r]));

export function getLinkedReading(id: string): LinkedReading | undefined {
  return byId.get(id);
}

export function linkedReadingHref(reading: LinkedReading): string {
  return `/readings/${reading.id}`;
}
