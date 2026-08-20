import { cn } from "@/lib/utils";

export function SegMeter({
  total,
  filled,
  label,
  className,
}: {
  total: number;
  filled: (i: number) => boolean;
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
