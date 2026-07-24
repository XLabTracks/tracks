import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getExerciseById } from "@/lib/content";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  ReviewSession,
  type ReviewQueueCard,
} from "@/components/review/review-session";

export const metadata: Metadata = { title: "Review" };

/** Coarse relative label — stable enough to render server-side. */
function relativeDueLabel(due: Date, now: Date): string {
  const minutes = Math.round((due.getTime() - now.getTime()) / 60_000);
  if (minutes <= 1) return "in a minute";
  if (minutes < 60) return `in about ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `in about ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}

/**
 * The spaced-repetition tab: every tap-reveal notecard the learner has rated
 * inside a lesson lands in their bank (recordTapReveal), and this page serves
 * the ones FSRS says are due. Cards whose exercise has left the content graph
 * are skipped — the row is harmless and revives if the card returns.
 */
export default async function ReviewPage() {
  const user = await getCurrentUser();

  const intro = (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Review" }]} />
      <h1 className="text-3xl font-semibold tracking-tight">Review</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Quick-recall cards you&apos;ve met in lessons come back here on a
        spaced-repetition schedule. Rate yourself honestly — the schedule
        adapts to what you remember.
      </p>
    </>
  );

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
        {intro}
        <div className="border-border bg-card shadow-soft mt-8 rounded-xl border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Sign in to build your review bank.
          </p>
          <Button asChild className="mt-5">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </main>
    );
  }

  const rows = await prisma.reviewCard.findMany({
    where: { userId: user.id },
    orderBy: { due: "asc" },
  });
  const bank = rows.flatMap((row) => {
    const exercise = getExerciseById(row.contentId);
    if (!exercise || exercise.type !== "tap-reveal") return [];
    return [{ row, exercise }];
  });

  const now = new Date();
  const toQueueCard = ({
    row,
    exercise,
  }: (typeof bank)[number]): ReviewQueueCard => ({
    contentId: row.contentId,
    prompt: exercise.prompt,
    answer: exercise.answer,
  });
  const queue = bank.filter(({ row }) => row.due <= now).map(toQueueCard);
  const ahead = bank.filter(({ row }) => row.due > now).map(toQueueCard);
  const nextFuture = bank.find(({ row }) => row.due > now);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
      {intro}
      {bank.length === 0 ? (
        <div className="border-border bg-card shadow-soft mt-8 rounded-xl border p-8 text-center">
          <p className="text-lg font-medium">No notecards yet</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Rate a quick-recall card inside a lesson and it lands here for
            spaced review.
          </p>
          <Button asChild className="mt-5">
            <Link href="/tracks">Browse tracks</Link>
          </Button>
        </div>
      ) : (
        // Keyed by request time so a router.refresh() from the session's
        // caught-up state remounts with the freshly computed queue.
        <ReviewSession
          key={now.toISOString()}
          initialQueue={queue}
          aheadQueue={ahead}
          bankCount={bank.length}
          nextDueLabel={
            nextFuture ? relativeDueLabel(nextFuture.row.due, now) : null
          }
        />
      )}
    </main>
  );
}
