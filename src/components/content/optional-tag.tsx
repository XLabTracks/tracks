import { CircleDashed } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The "Optional" marker on an item that never gates progress — worn by the
 * reading header and its sidebar row alike, so the two surfaces name it the
 * same way instead of drifting into two labels.
 *
 * The glyph is a dashed circle on purpose: the sidebar's not-done marker and
 * the reading cards are hollow circles, so a dashed one reads as "a circle you
 * are not required to fill". The word carries the meaning for everyone; the
 * dash and the hue only reinforce it, so nothing here leans on colour alone.
 */
export function OptionalTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-muted-foreground border-border inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <CircleDashed className="size-3 shrink-0" aria-hidden />
      Optional
    </span>
  );
}
