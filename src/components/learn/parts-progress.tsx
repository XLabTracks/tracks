import { progressText } from "@/lib/reading/lesson-parts";
import { cn } from "@/lib/utils";

/**
 * The reading's progress bar: one segment per authored page, filled up to
 * the page on screen, with the position written beside it.
 *
 * It exists for readers who lose the thread of a long page — the segments
 * make the remaining distance visible at a glance and every page turn is a
 * visible win. Two readers share it, so a lesson and a paper describe
 * position in the same words (`progressText`, tested).
 *
 * Nothing here is interactive: the pager and the sidebar move between pages,
 * and a strip of tap targets six pixels tall would fail the tap-target floor
 * every widget control is held to. The bar is a rule, and the state sits on
 * the rule and on the words, never in a ring around a number.
 */
export function PartsProgress({
  at,
  labels,
  unit = "Part",
  className,
}: {
  /** Zero-based index of the page on screen. */
  at: number;
  /** One label per page, in reading order. */
  labels: string[];
  /** "Part" for lessons, "Section" for papers. */
  unit?: string;
  className?: string;
}) {
  const total = labels.length;
  if (total < 2) return null;
  const { position, remaining } = progressText(at, total, unit);
  const label = labels[at] ?? "";
  return (
    <div
      className={cn("select-none", className)}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={at + 1}
      aria-valuetext={`${position}: ${label}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[13px]">
        <span className="min-w-0">
          <span className="font-medium">{position}</span>
          {label ? (
            <span className="text-muted-foreground"> · {label}</span>
          ) : null}
        </span>
        <span className="text-muted-foreground">{remaining}</span>
      </div>
      <div
        className="mt-2 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
        aria-hidden
      >
        {labels.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-colors duration-300",
              i <= at ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}
