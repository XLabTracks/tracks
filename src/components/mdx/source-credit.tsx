import { SquareArrowOutUpRight } from "lucide-react";

/**
 * The credit block over a lesson reproduced from somebody else's document.
 *
 * Three facts, each on its own line, because they answer three different
 * questions and a single italic sentence made a reader hunt for all of them:
 * who wrote it, where it actually lives, and how much of it is here.
 *
 * The author's name links to their own page and the source link carries the
 * out-of-here mark, so it is obvious before the click which one leaves the
 * site. Both are literal `<a>`: `MdxLink` internalises known posts, and an
 * attribution must always point at the real thing.
 *
 * Trap: `not-prose` is what keeps the lesson's typography off this block.
 * Without it the links take the body's underline and the whole credit reads
 * as a paragraph of the reading rather than the label on it.
 */
export interface SourceCreditProps {
  author: string;
  /** The author's own page. Omitted, the name is plain text. */
  authorHref?: string;
  /** Where the original lives. */
  sourceHref: string;
  /** What the link is called. */
  sourceLabel?: string;
  /** How much of the original is reproduced, and under what permission. */
  state?: string;
  note?: string;
}

export function SourceCredit({
  author,
  authorHref,
  sourceHref,
  sourceLabel = "Original material",
  state,
  note,
}: SourceCreditProps) {
  return (
    <div className="not-prose my-6 text-sm">
      <p>
        By{" "}
        {authorHref ? (
          <a
            href={authorHref}
            className="text-destructive font-medium underline underline-offset-4"
          >
            {author}
          </a>
        ) : (
          <span className="font-medium">{author}</span>
        )}
      </p>

      <p className="mt-1">
        <a
          href={sourceHref}
          className="text-destructive inline-flex items-center gap-1.5 font-medium underline underline-offset-4"
        >
          {sourceLabel}
          <SquareArrowOutUpRight className="size-3.5 shrink-0" aria-hidden />
        </a>
      </p>

      {state ? (
        <p className="text-muted-foreground mt-2 font-mono text-[11px] tracking-[0.14em] uppercase">
          {state}
        </p>
      ) : null}

      {note ? (
        <p className="text-muted-foreground mt-1 leading-relaxed">{note}</p>
      ) : null}
    </div>
  );
}
