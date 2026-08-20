import { cn } from "@/lib/utils";

/**
 * The "[Optional]" marker on an item that never gates progress — a soft-filled
 * tag that rides on the title's own line, worn the same on the reading header
 * and its sidebar row.
 *
 * Filled, not outlined, and squared to the radius the reading cards use rather
 * than a stock capsule pill — a thin rounded-full outline is the shape that
 * reads as boilerplate. The word carries the meaning; the fill is only a
 * surface, so nothing here leans on hue. `compact` is the sidebar's smaller
 * cut of the same tag.
 */
export function OptionalMarker({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-muted text-foreground/80 inline-flex items-center rounded-md font-medium",
        compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className
      )}
    >
      [Optional]
    </span>
  );
}
