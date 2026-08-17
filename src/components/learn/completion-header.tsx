import Link from "next/link";
import { Check } from "lucide-react";
import type { Track } from "@/lib/content/types";

/* The header of a track's closing page.
 *
 * Finishing is two things, and both are read from the learner's own rows: the
 * required units complete, and the required written work SUBMITTED — a draft
 * is not a submission. Reaching the last URL is neither, and a page that
 * celebrates on arrival is the fake-state chrome the house rules ban, so an
 * unfinished track gets a plain card naming exactly what is outstanding.
 *
 * The closing page is not itself a unit of work, so it is out of both counts:
 * "1 unit left" pointing at the page under your feet is a puzzle, not a
 * status.
 *
 * The finished card follows the course owner's artwork: maroon ground, a
 * white disc with the tick in it, then the two lines. Its colours are
 * theme.css tokens, never the artwork's literal hex — the same card has to
 * survive the day and high-contrast grounds, where the maroon is a different
 * value or not maroon at all.
 */

export interface CompletionState {
  /** Required units, this page excluded. Null when signed out. */
  units: { completed: number; total: number } | null;
  /** Required written tasks and how many are submitted. Null when signed out. */
  writing: { submitted: number; required: number } | null;
}

export function CompletionHeader({
  track,
  state,
}: {
  track: Track;
  state: CompletionState;
}) {
  const { units, writing } = state;

  if (!units || !writing) {
    return (
      <Shell>
        <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
          The end of the track
        </p>
        <h2 className="mt-3 text-2xl leading-snug font-semibold text-balance">
          The last page of the {track.title} track.
        </h2>
        <p className="text-muted-foreground mt-3 max-w-[64ch] text-sm">
          Sign in and your units and written work are counted here, so this
          page can tell you whether you have actually finished.
        </p>
      </Shell>
    );
  }

  const unitsLeft = units.total - units.completed;
  const writingLeft = writing.required - writing.submitted;

  if (unitsLeft <= 0 && writingLeft <= 0) {
    return (
      <section className="bg-primary text-primary-foreground shadow-soft-lg mt-6 rounded-2xl px-6 py-10 text-center sm:px-10">
        {/* The artwork's white disc with the maroon tick, said in tokens: the
            pair inverts with the ground, so high contrast gets a black disc
            and a yellow tick rather than a yellow tick on white. */}
        <span
          aria-hidden
          className="bg-primary-foreground text-primary mx-auto flex size-16 items-center justify-center rounded-full"
        >
          <Check className="size-8" strokeWidth={2.5} />
        </span>
        <p className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Congratulations!
        </p>
        <p className="mt-2 text-lg text-balance opacity-95 sm:text-xl">
          You have successfully completed the {track.title} track
        </p>
        <p className="mt-6 text-xs tracking-[0.14em] uppercase opacity-80">
          {units.total} units · {writing.required} written tasks submitted
        </p>
      </section>
    );
  }

  return (
    <Shell>
      <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
        Not finished yet
      </p>
      <h2 className="mt-3 text-2xl leading-snug font-semibold text-balance">
        The {track.title} track still has work open.
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        <Row
          done={unitsLeft <= 0}
          label={
            unitsLeft <= 0
              ? "All units read"
              : `${unitsLeft} ${unitsLeft === 1 ? "unit" : "units"} left to read`
          }
          count={`${units.completed} / ${units.total}`}
        />
        <Row
          done={writingLeft <= 0}
          label={
            writingLeft <= 0
              ? "All written tasks submitted"
              : `${writingLeft} written ${writingLeft === 1 ? "task" : "tasks"} not submitted`
          }
          count={`${writing.submitted} / ${writing.required}`}
        />
      </ul>
      <p className="text-muted-foreground mt-4 max-w-[64ch] text-sm">
        This page congratulates you when both rows are done. A draft does not
        count — a written task is finished when you submit it.{" "}
        <Link
          href={`/tracks/${track.slug}`}
          className="text-foreground underline underline-offset-4"
        >
          Pick up where you left off
        </Link>
        .
      </p>
    </Shell>
  );
}

/** The unfinished states share one plain card: hairline on all four sides. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-border bg-card mt-6 rounded-2xl border p-6 sm:p-8">
      {children}
    </section>
  );
}

/* A requirement and where the learner stands on it. The tick and the words
   both carry the state; the fraction is the reading. */
function Row({
  done,
  label,
  count,
}: {
  done: boolean;
  label: string;
  count: string;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={
          done
            ? "border-foreground text-foreground flex size-5 flex-none items-center justify-center rounded-full border"
            : "border-muted-foreground/50 flex size-5 flex-none items-center justify-center rounded-full border border-dashed"
        }
      >
        {done ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className={done ? "text-muted-foreground" : "text-foreground"}>
        {label}
      </span>
      <span className="text-muted-foreground ml-auto text-xs">
        {count}
      </span>
    </li>
  );
}
