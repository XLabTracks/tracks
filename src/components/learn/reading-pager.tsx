import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one pager under a reading.
 *
 * On a track that reads part by part there must be exactly one: Previous and
 * Next move through the parts, and at the ends they roll into the neighbouring
 * item. Two pagers — a part pager and a separate lesson pager under it — asks
 * a reader which "Next" is the real one, and answers it differently depending
 * on where in the item they are.
 *
 * Shared because that is precisely what went wrong: the lesson reader was
 * given a unified pager and the paper reader was not, so a chunked paper
 * carried its section pager AND the page's LessonNav. One component, used by
 * both, cannot drift like that again.
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
    <div className="border-border mt-10 grid grid-cols-2 gap-3 border-t pt-6 select-none">
      {left ?? <span />}
      {right ?? <span />}
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
}: {
  dir: "prev" | "next";
  title: string;
  href?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    "border-border hover:bg-muted flex flex-col gap-1 rounded-xl border p-4 transition-colors select-none",
    dir === "next" ? "text-right" : "text-left",
  );
  const body = (
    <>
      <span
        className={cn(
          "text-muted-foreground flex items-center gap-1 text-xs",
          dir === "next" && "justify-end",
        )}
      >
        {dir === "prev" ? (
          <>
            <ArrowLeft className="size-3.5" aria-hidden /> Previous
          </>
        ) : (
          <>
            Next <ArrowRight className="size-3.5" aria-hidden />
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
