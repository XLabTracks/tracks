import { ArrowUpRight } from "lucide-react";

/**
 * A row of wide horizontal cards linking somewhere off-site — the "what to do
 * next" block at the end of a track.
 *
 * Each card is a whole link, so the target is the card and not a word inside
 * it. Uniform hairline on all four sides: the accent lives in the arrow and
 * the hover state, never as a painted edge.
 *
 * The destinations are named in the lesson that uses it rather than hardcoded
 * here — this is a layout, and which opportunities are worth pointing at is
 * curriculum.
 */

export interface NextStep {
  /** What it is, e.g. "MATS". */
  name: string;
  /** One line on what applying gets you. */
  detail: string;
  href: string;
  /** The bit that answers "should I bother" — a deadline, a cohort, a cost. */
  meta?: string;
}

export function NextSteps({ items }: { items: NextStep[] }) {
  return (
    <div className="not-prose my-6 flex flex-col gap-3">
      {items.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border/80 hover:bg-muted/60 hover:border-border group flex items-center gap-4 rounded-xl border px-5 py-4 no-underline transition-colors"
        >
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-foreground font-semibold">{s.name}</span>
              {s.meta ? (
                <span className="text-muted-foreground text-xs">{s.meta}</span>
              ) : null}
            </span>
            <span className="text-muted-foreground mt-1 block text-sm">
              {s.detail}
            </span>
          </span>
          <ArrowUpRight
            className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors"
            aria-hidden
          />
        </a>
      ))}
    </div>
  );
}
