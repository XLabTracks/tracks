/**
 * "Optional:" — the one way this course marks material that never gates
 * progress. A prefix at the front of the title, in muted weight, never a chip
 * beside it: the same rule the repo already states for option letters, and a
 * prefix cannot wrap onto its own line away from what it qualifies.
 *
 * Say it once. A label that already begins "Optional:" does not also carry
 * this, and nothing inside it repeats the word.
 */
import { cn } from "@/lib/utils";

export function OptionalPrefix({ className }: { className?: string }) {
  return (
    <span className={cn("text-muted-foreground font-normal", className)}>
      Optional:{" "}
    </span>
  );
}
