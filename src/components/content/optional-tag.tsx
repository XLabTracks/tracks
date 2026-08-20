import { cn } from "@/lib/utils";

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
