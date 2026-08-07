import Link from "next/link";
import { Check } from "lucide-react";
import type { Track } from "@/lib/content/types";

/* The header of a track's closing page.
 *
 * It reads the learner's real completion of everything *except* this page, so
 * it can only ever congratulate somebody who finished the work. Reaching the
 * last URL is not finishing a course, and a page that celebrates on arrival is
 * the fake-state chrome the house rules ban — so an unfinished track gets an
 * honest count and the way back instead.
 *
 * Its own unit is excluded from the denominator deliberately: the learner is
 * standing on it, and "1 unit left" pointing at the page under their feet is a
 * puzzle, not a status.
 *
 * The card is painted on all four sides, never one tinted edge, and the state
 * is carried by the glyph and the words as much as by the ground — the
 * fraction beside the meter is the reading, the bar is decoration for it.
 */

export function CompletionHeader({
  track,
  progress,
}: {
  track: Track;
  /** Null when signed out: there is no progress to speak for. */
  progress: { completed: number; total: number } | null;
}) {
  const done = progress !== null && progress.completed >= progress.total;

  if (done) {
    return (
      <section className="bg-primary text-primary-foreground shadow-soft-lg mt-6 rounded-xl p-6 sm:p-8">
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase opacity-90">
          <Check className="size-4" aria-hidden />
          Track complete
        </p>
        <p className="mt-3 text-2xl leading-snug font-semibold text-balance sm:text-3xl">
          Congratulations! You have successfully completed the {track.title}{" "}
          track.
        </p>
        <p className="mt-3 text-sm opacity-90">
          All {progress.total} units done. Everything below is yours to take
          with you — your notebook, your written work and the map keep their
          state.
        </p>
      </section>
    );
  }

  if (progress === null) {
    return (
      <section className="border-border bg-card mt-6 rounded-xl border p-6 sm:p-8">
        <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
          The end of the track
        </p>
        <p className="mt-3 text-2xl leading-snug font-semibold text-balance sm:text-3xl">
          The last page of the {track.title} track.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Sign in and your progress is counted here, so this page can tell you
          whether you have actually finished.
        </p>
      </section>
    );
  }

  const left = progress.total - progress.completed;
  const percent = progress.total
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <section className="border-border bg-card mt-6 rounded-xl border p-6 sm:p-8">
      <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
        Almost there
      </p>
      <p className="mt-3 text-2xl leading-snug font-semibold text-balance sm:text-3xl">
        {left} {left === 1 ? "unit" : "units"} still open in the {track.title}{" "}
        track.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <span
          aria-hidden
          className="bg-muted h-1.5 w-40 max-w-full overflow-hidden rounded-full"
        >
          <span
            className="bg-primary block h-full rounded-full"
            style={{ width: `${percent}%` }}
          />
        </span>
        <span className="text-muted-foreground font-mono text-xs">
          {progress.completed} / {progress.total} complete
        </span>
      </div>
      <p className="text-muted-foreground mt-4 text-sm">
        This page will congratulate you when they are done.{" "}
        <Link
          href={`/tracks/${track.slug}`}
          className="text-foreground underline underline-offset-4"
        >
          Pick up where you left off
        </Link>
        .
      </p>
    </section>
  );
}
