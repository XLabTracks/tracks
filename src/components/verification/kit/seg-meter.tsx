import { cn } from "@/lib/utils";

/**
 * The platform's segmented meter (`.meter.seg` in platform.css) in app dress:
 * one countable cell per unit, the container owning the outer radius, cells
 * square-cut and flush at the ends — never a row of dots.
 *
 * Progress is the fill and position belongs to the counter text beside it.
 * Deliberately no differently-painted "you are here" cell: a highlighted
 * current dot next to done dots was the dot strip all over again, and the
 * counter already says where you stand.
 */
export function SegMeter({
  total,
  filled,
  label,
  className,
}: {
  total: number;
  /** Whether cell i is filled. */
  filled: (i: number) => boolean;
  /** What this meter reports, for the accessibility tree. */
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("flex h-1.5 gap-0.5 overflow-hidden rounded-full", className)}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={cn("min-w-0 flex-1", filled(i) ? "bg-primary" : "bg-border")}
        />
      ))}
    </div>
  );
}
