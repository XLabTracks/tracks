/**
 * "Optional:" — the one way this course marks material that never gates
 * progress.
 *
 * IT USED TO BE A CHIP and it was a chip in three different dialects. A
 * soft-filled tag on the reading card and the lesson h1 and the sidebar row;
 * an outlined `<Badge>` on the module contents page; "· optional" in the memo
 * desk's eyebrow; "— optional" at the end of a card heading in 1.2.2; a bare
 * "Optional." line under two widget textareas; and, in the lesson bodies, a
 * plain `Optional:` in front of a Fold's label. Six treatments for one fact,
 * and the seventh — the one in the lesson prose — was the only one a reader
 * could not mistake for decoration.
 *
 * So the prose form won (course owner, 2026-08-20: "I like Optional: in
 * header more than chip"). It rides at the FRONT of the title, in muted
 * weight, which is the same rule CLAUDE.md already states for option letters:
 * a marker is a prefix in the sentence, never a token floating beside it. A
 * prefix cannot be read as a badge, cannot wrap onto its own line away from
 * what it qualifies, and costs the title none of its width.
 *
 * Say it once. A card whose label already begins "Optional:" does not also
 * carry this, and the exercise inside it does not repeat it either — the
 * label is the header, and the header is where it goes.
 */
import { cn } from "@/lib/utils";

export function OptionalPrefix({ className }: { className?: string }) {
  return (
    <span className={cn("text-muted-foreground font-normal", className)}>
      Optional:{" "}
    </span>
  );
}
