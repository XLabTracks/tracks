import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The pagers under a reading, on two levels.
 *
 * Moving within an item and moving between items are different distances,
 * and the course owner wants them on different levels (2026-09-13): the
 * unified pager that rolled "Next" from the last part into the next lesson
 * put "Previous: What Is ASI?" beside "Next: 0.1.1 Why Securitizing AI…",
 * a part and a lesson dressed identically. So the part tier is PartPager —
 * a light row of two buttons that only ever move within the item — and the
 * item tier is ReadingPager's cards, which only ever leave it, labelled
 * "Previous lesson" / "Next lesson" so the two can never be confused.
 *
 * Shared by the lesson and paper readers because that is precisely what
 * went wrong once: the lesson reader was given a pager and the paper reader
 * was not, so a chunked paper carried its section pager AND the page's
 * LessonNav. One pair of components, used by both, cannot drift like that.
 */

/** A neighbouring item the pager can roll into. */
export interface PagerLink {
  href: string;
  title: string;
}

export function ReadingPager({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  if (!left && !right) return null;
  return (
    // select-none: the pager is an index of where to go next, not text anyone
    // copies. A drag that ends here otherwise smears across both cards.
    <div className="border-border mt-10 grid grid-cols-1 gap-3 border-t pt-6 select-none sm:grid-cols-2">
      {left ?? <span className="hidden sm:block" />}
      {right ?? <span className="hidden sm:block" />}
    </div>
  );
}

/**
 * One card: a Link to a neighbouring item, or a button that moves between
 * parts in place. Same look either way — its title is the thing it goes to,
 * so a reader never has to guess whether Next leaves the page.
 */
export function PagerCard({
  dir,
  title,
  href,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  title: string;
  href?: string;
  onClick?: () => void;
  /** The small word over the title: "Previous" by default; the readers say
   *  "Previous lesson" so the item tier reads apart from the part tier. */
  label?: string;
}) {
  const word = label ?? (dir === "prev" ? "Previous" : "Next");
  const cls = cn(
    "border-border hover:bg-muted flex flex-col gap-1 rounded-xl border p-4 transition-colors select-none",
    dir === "next" ? "text-right" : "text-left"
  );
  const body = (
    <>
      <span
        className={cn(
          "text-muted-foreground flex items-center gap-1 text-xs",
          dir === "next" && "justify-end"
        )}
      >
        {dir === "prev" ? (
          <>
            <ArrowLeft className="size-3.5" aria-hidden /> {word}
          </>
        ) : (
          <>
            {word} <ArrowRight className="size-3.5" aria-hidden />
          </>
        )}
      </span>
      <span className="font-medium">{title}</span>
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cn(cls, "w-full")}>
      {body}
    </button>
  );
}

/** A move within the item: the neighbouring part's label and the step. */
export interface PartStep {
  title: string;
  onClick: () => void;
}

/**
 * The part tier: two light buttons that step through an item's authored
 * pages and never leave it. Renders nothing when there is no step either
 * way, so a whole-lesson view or a single-page lesson shows only the item
 * tier. Buttons keep the 44px tap floor; the look is deliberately lighter
 * than the cards under them — that difference is the whole point.
 */
export function PartPager({
  prev,
  next,
  unit = "part",
}: {
  prev: PartStep | null;
  next: PartStep | null;
  /** "part" for lessons, "section" for papers. */
  unit?: string;
}) {
  if (!prev && !next) return null;
  const btn =
    "hover:bg-muted flex min-h-11 max-w-full flex-col justify-center gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors select-none";
  return (
    <div className="mt-8 flex flex-wrap items-stretch justify-between gap-3 select-none">
      {prev ? (
        <button type="button" onClick={prev.onClick} className={cn(btn, "text-left")}>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <ArrowLeft className="size-3.5" aria-hidden /> Previous {unit}
          </span>
          <span className="font-medium">{prev.title}</span>
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button type="button" onClick={next.onClick} className={cn(btn, "ml-auto text-right")}>
          <span className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
            Next {unit} <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="font-medium">{next.title}</span>
        </button>
      ) : null}
    </div>
  );
}
