import { cn } from "@/lib/utils";

/**
 * The "Optional" marker on an item that never gates progress — worn by the
 * reading header and its sidebar row alike, so the two surfaces name it the
 * same way instead of drifting into two labels.
 *
 * It is an editorial kicker, not a chip: the word sits above the title with a
 * hairline rule carrying across the column, the way a magazine labels a
 * department. `compact` is the sidebar's scaled-down echo — the same word, a
 * short leading rule instead of a trailing one, sized for a nav row. The word
 * carries the meaning for everyone; the rule is structure, not colour, so
 * nothing here leans on hue.
 */
export function OptionalMarker({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <span className={cn("flex items-center gap-2", className)}>
        <span className="bg-border h-px w-4 shrink-0" aria-hidden />
        <span className="text-muted-foreground text-xs font-medium tracking-wide">
          Optional
        </span>
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="text-foreground text-sm font-semibold tracking-wide">
        Optional
      </span>
      <span className="bg-border h-px flex-1" aria-hidden />
    </div>
  );
}
