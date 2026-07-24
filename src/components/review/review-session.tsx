"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Rating } from "ts-fsrs";
import { cn } from "@/lib/utils";
import { reviewCard } from "@/app/actions/review";
import { REVIEW_GRADES } from "@/lib/review/fsrs";
import { Paragraphs } from "@/components/exercises/math-text";
import { Button } from "@/components/ui/button";

/** One due notecard, answer included — tap-reveal answers ship to the client by design. */
export interface ReviewQueueCard {
  contentId: string;
  prompt: string;
  answer: string;
}

const GRADE_CLASSES: Record<number, string> = {
  [Rating.Again]:
    "border-destructive/40 text-destructive hover:bg-destructive/10",
  [Rating.Hard]: "border-amber-500/40 text-amber-600 hover:bg-amber-500/10",
  [Rating.Good]:
    "border-emerald-600/40 text-emerald-600 hover:bg-emerald-600/10",
  [Rating.Easy]: "border-sky-500/40 text-sky-600 hover:bg-sky-500/10",
};

/**
 * An Anki-style review run over the due queue: prompt → show answer → grade.
 * "Again" re-queues the card at the back of the session (its next due is a
 * minute away); the other grades retire it until its new due date. Scheduling
 * persists via the reviewCard action; the queue itself is session-local.
 */
export function ReviewSession({
  initialQueue,
  aheadQueue,
  bankCount,
  nextDueLabel,
}: {
  initialQueue: ReviewQueueCard[];
  /** Not-yet-due cards (due ascending), offered as ahead practice once the due queue is empty. */
  aheadQueue: ReviewQueueCard[];
  /** Total enrolled cards, shown in the caught-up state. */
  bankCount: number;
  /** Coarse "in about …" label for the next future due, if nothing is due. */
  nextDueLabel: string | null;
}) {
  const router = useRouter();
  const [queue, setQueue] = useState(initialQueue);
  const [ahead, setAhead] = useState(aheadQueue);
  const [reviewed, setReviewed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [, startTransition] = useTransition();

  const card = queue[0];

  if (!card) {
    return (
      <div className="border-border bg-card shadow-soft mt-8 rounded-xl border p-8 text-center">
        <p className="text-lg font-medium">
          {reviewed > 0 ? "Session complete" : "All caught up"}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          {reviewed > 0
            ? `You reviewed ${reviewed} card${reviewed === 1 ? "" : "s"}.`
            : `Nothing due among your ${bankCount} card${
                bankCount === 1 ? "" : "s"
              }${nextDueLabel ? ` — next card due ${nextDueLabel}` : ""}.`}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {ahead.length > 0 && (
            <Button
              onClick={() => {
                setQueue(ahead);
                setAhead([]);
              }}
            >
              Practice ahead ({ahead.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => router.refresh()}>
            Check for due cards
          </Button>
        </div>
      </div>
    );
  }

  const rate = (grade: number) => {
    const { contentId } = card;
    setRevealed(false);
    setReviewed((n) => n + 1);
    setQueue((q) =>
      grade === Rating.Again ? [...q.slice(1), q[0]] : q.slice(1),
    );
    startTransition(async () => {
      await reviewCard(contentId, grade);
    });
  };

  return (
    <div className="mt-8">
      <p className="text-muted-foreground text-xs">
        {queue.length} card{queue.length === 1 ? "" : "s"} left
        {reviewed > 0 ? ` · ${reviewed} reviewed` : ""}
      </p>
      <div className="border-border bg-card shadow-soft mt-2 rounded-xl border p-6">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Quick recall
        </p>
        <Paragraphs text={card.prompt} className="font-medium" />
        {revealed ? (
          <>
            <div className="border-border bg-muted/40 mt-4 space-y-2 rounded-lg border p-4 text-sm leading-relaxed">
              <Paragraphs text={card.answer} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {REVIEW_GRADES.map(({ grade, label }) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => rate(grade)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    GRADE_CLASSES[grade],
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <Button className="mt-5 w-full" onClick={() => setRevealed(true)}>
            Show answer
          </Button>
        )}
      </div>
    </div>
  );
}
