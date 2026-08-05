import type { ReactNode } from "react";

/**
 * A source's own words, reproduced.
 *
 * The attribution comes **first** and the passage follows it, so the two can
 * never be read apart: nobody reaches the words without having read whose they
 * are. `what` says which part of the work this is — an abstract and a body
 * passage are not the same claim on a reader's trust — and the title links out
 * to the original.
 *
 * Reproduce only what a source's terms allow, and record the terms in a
 * comment above the lesson's use of this. Two of the sources this was built
 * for are all-rights-reserved and are reproduced on the author's instruction;
 * that is a decision someone made, not something to infer from a licence line.
 */
export function SourceQuote({
  t,
  url,
  what,
  by,
  children,
}: {
  /** The work. */
  t: string;
  url?: string;
  /** Which part of it — "Findings", "the abstract", "§3.2". */
  what?: string;
  /** Authors and year, as they should be credited. */
  by: string;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose border-border my-6 rounded-xl border p-5">
      <figcaption className="text-sm">
        <span className="font-medium">
          {url ? (
            <a href={url} target="_blank" rel="noopener" className="underline underline-offset-4">
              {t}
              <span aria-hidden="true" className="select-none"> ↗</span>
            </a>
          ) : (
            t
          )}
        </span>
        {what ? <span className="text-muted-foreground"> — {what}</span> : null}
      </figcaption>
      {/* Paragraph gaps are set between siblings, not by resetting every `p`:
          a blanket margin-0 closes the gap the passage's own paragraphing
          depends on, and two paragraphs of a quotation run together. */}
      <blockquote className="border-border mt-3 border-l-2 pl-4 leading-relaxed [&>p]:m-0 [&>p+p]:mt-3">
        {children}
      </blockquote>
      <p className="text-muted-foreground mt-3 text-sm">{by}</p>
    </figure>
  );
}

/**
 * A citation riding with the passage it belongs to, rather than sitting in a
 * bibliography nobody opens. Stays selectable — a citation is the one thing a
 * reader means to copy.
 */
export function Src({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground my-3 text-sm">{children}</p>;
}
