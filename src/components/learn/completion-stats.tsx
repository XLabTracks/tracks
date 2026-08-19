import Link from "next/link";

/* The completion page's dashboard: what the learner actually did, in three
 * numbers — skills mastered on the skill map, words of writing submitted,
 * reading finished. It renders under the CompletionHeader for signed-in
 * learners in every state, because the numbers are real rows either way; the
 * celebrating is the header's job and stays gated on being finished.
 *
 * One hairline card, values in text tokens. No meters and no deltas: each
 * figure is a count of work done, not a target to beat, and the header
 * already says what is left when something is.
 */

export interface CompletionStatsData {
  skills: { mastered: number; inProgress: number; total: number };
  /** Words across submitted writing, and how many pieces they span. */
  words: number;
  essaysSubmitted: number;
  /** Estimated minutes of completed reading, by the course's own numbers. */
  readingMinutes: number;
}

export function CompletionStats({
  stats,
  mapHref,
}: {
  stats: CompletionStatsData;
  /** Where the skill map lives; the footer line renders only when given. */
  mapHref?: string;
}) {
  const { skills, words, essaysSubmitted, readingMinutes } = stats;

  return (
    <section className="border-border bg-card mt-4 rounded-2xl border p-6 sm:p-8">
      <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
        Your course in numbers
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-3">
        <Tile
          value={`${skills.mastered} / ${skills.total}`}
          label="Skills mastered"
          sub={
            skills.inProgress > 0
              ? `${skills.inProgress} more in progress`
              : undefined
          }
        />
        <Tile
          value={words.toLocaleString("en-US")}
          label="Words written"
          sub={`across ${essaysSubmitted} submitted ${
            essaysSubmitted === 1 ? "essay" : "essays"
          }`}
        />
        <Tile
          value={readingTime(readingMinutes)}
          label="Reading completed"
          sub="by the course's own time estimates"
        />
      </div>
      {mapHref ? (
        <p className="text-muted-foreground mt-5 text-sm">
          Rung-by-rung detail is on your{" "}
          <Link
            href={mapHref}
            className="text-foreground underline underline-offset-4"
          >
            skill map
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}

/* Value first, then the label — a reading, not a row to scan down. The
   values keep the font's proportional figures: nothing here aligns in
   columns. */
function Tile({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm">{label}</p>
      {sub ? (
        <p className="text-muted-foreground mt-0.5 text-xs">{sub}</p>
      ) : null}
    </div>
  );
}

/** "45 min" under an hour, "~7.5 hrs" under ten, "~19 hrs" beyond. */
function readingTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  const shown = hours < 10 ? Math.round(hours * 10) / 10 : Math.round(hours);
  return `~${shown} ${shown === 1 ? "hr" : "hrs"}`;
}
