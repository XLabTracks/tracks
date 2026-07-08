"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { recordTapReveal } from "@/app/actions/exercises";
import {
  EXERCISE_TYPE_LABELS,
  type TapRevealExercise,
  type TapRevealRating,
} from "@/lib/content/types";
import { Paragraphs } from "./math-text";

// Sliding rows of the repeated phrase; alternate rows move in opposite
// directions. All variation is index-derived (never Math.random()) so the
// server and client render identical markup — random values break hydration.
const ROW_COUNT = 7;
const REPEATS_PER_HALF = 8;
const ROWS = Array.from({ length: ROW_COUNT }, (_, r) => ({
  duration: 380 + ((r * 7) % 4) * 80, // 380–620s per loop — a glacial drift
  delay: -((r * 110) % 370), // negative = start mid-loop, so rows are staggered
  reverse: r % 2 === 1,
}));

/** Per-word opacity, varied deterministically like the row/word position. */
const wordOpacity = (row: number, i: number) =>
  0.2 + ((row * 5 + i * 3) % 5) * 0.13;

const RATINGS: {
  value: TapRevealRating;
  label: string;
  selectedClassName: string;
}[] = [
  {
    value: "yes",
    label: "Got it",
    selectedClassName: "border-emerald-600 bg-emerald-600/15 text-emerald-600",
  },
  {
    value: "partial",
    label: "Partially",
    selectedClassName: "border-amber-500 bg-amber-500/15 text-amber-500",
  },
  {
    value: "no",
    label: "Didn't get it",
    selectedClassName: "border-destructive bg-destructive/15 text-destructive",
  },
];

/**
 * The reveal panel + self-assessment row, without the card chrome — reused by
 * the standalone card below and by ExerciseSequenceCard for tap-reveal parts.
 * Persists the rating itself; `onRated` lets a host track completion.
 */
export function TapRevealBody({
  exerciseId,
  answer,
  initialRating,
  onRated,
}: {
  exerciseId: string;
  answer: string;
  /** Prior self-assessment (from a submission or the host's state), if any. */
  initialRating?: TapRevealRating | null;
  onRated?: (rating: TapRevealRating) => void;
}) {
  const [revealed, setRevealed] = useState(initialRating != null);
  const [rating, setRating] = useState<TapRevealRating | null>(
    initialRating ?? null,
  );
  const [, startTransition] = useTransition();

  const rate = (value: TapRevealRating) => {
    setRating(value);
    onRated?.(value);
    startTransition(async () => {
      await recordTapReveal(exerciseId, value);
    });
  };

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="border-border bg-muted/40 hover:bg-muted/70 relative mt-4 block h-40 w-full overflow-hidden rounded-lg border transition-colors"
      >
        <div
          aria-hidden
          className="pointer-events-none flex h-full flex-col justify-evenly select-none [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        >
          {ROWS.map((row, r) => (
            <div
              key={r}
              className="flex w-max animate-[tap-reveal-slide_480s_linear_infinite] motion-reduce:[animation:none]"
              style={{
                animationDuration: `${row.duration}s`,
                animationDelay: `${row.delay}s`,
                animationDirection: row.reverse ? "reverse" : "normal",
              }}
            >
              {/* Two identical halves make the -50% slide loop seamless. */}
              {[0, 1].map((half) => (
                <span key={half} className="flex whitespace-nowrap">
                  {Array.from({ length: REPEATS_PER_HALF }, (_, i) => (
                    <span
                      key={i}
                      className="text-muted-foreground px-1.5 text-sm"
                      style={{ opacity: wordOpacity(r, i) }}
                    >
                      Click anywhere to reveal
                    </span>
                  ))}
                </span>
              ))}
            </div>
          ))}
        </div>
        <span className="sr-only">Click to reveal the answer</span>
      </button>
    );
  }

  return (
    <>
      <div className="border-border bg-muted/40 mt-4 space-y-2 rounded-lg border p-4 text-sm leading-relaxed">
        <Paragraphs text={answer} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs">Did you have it?</span>
        {RATINGS.map(({ value, label, selectedClassName }) => (
          <button
            key={value}
            type="button"
            onClick={() => rate(value)}
            aria-pressed={rating === value}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              rating === value
                ? selectedClassName
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export function TapRevealCard({
  exercise,
  initialRating,
}: {
  exercise: Pick<TapRevealExercise, "id" | "type" | "prompt" | "answer">;
  /** Prior self-assessment from the learner's submission, if any. */
  initialRating?: TapRevealRating | null;
}) {
  return (
    <aside className="not-prose border-border bg-card shadow-soft my-6 rounded-xl border p-5">
      <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
        {EXERCISE_TYPE_LABELS[exercise.type]}
      </p>
      <Paragraphs text={exercise.prompt} className="font-medium" />
      <TapRevealBody
        exerciseId={exercise.id}
        answer={exercise.answer}
        initialRating={initialRating}
      />
    </aside>
  );
}
