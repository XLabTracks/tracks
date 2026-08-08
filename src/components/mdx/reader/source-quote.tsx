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
    // Padding tightens on a phone. This figure is routinely two boxes deep —
    // a Fold holding a SourceQuote — and each ring costs the reading column
    // twice its padding. At 390 the passage was down to 244px of text.
    <figure className="not-prose border-border my-6 rounded-xl border p-4 sm:p-5">
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
      {/* The mark, not a rule down the side. A left border plus its indent
          took 18px off a column that is already three boxes deep on a phone,
          and bought nothing the mark does not say better. It is decoration:
          aria-hidden, unselectable, and it sits on its own line so it costs
          the passage no width at all. --brand-ink because it has to read as
          ink on all three Verification grounds; --primary is a fill there and
          would vanish on the dark one. */}
      <blockquote className="mt-3 leading-relaxed">
        <span
          aria-hidden="true"
          className="text-[color:var(--brand-ink,var(--primary))] -mb-5 block font-serif text-6xl leading-none select-none"
        >
          &ldquo;
        </span>
        {/* One gap rule, between siblings of any kind — the passage's own
            paragraphing is the thing being reproduced, and preflight has
            already zeroed the margins on p, ul and ol, so without this a
            quotation of more than one block renders as an unbroken wall.
            Trap: it must not be paired with a `[&>p]:m-0` reset. That
            selector is the more specific of the two, so it wins on exactly
            the elements the gap is mostly for and silently closes p+p. */}
        <div className="[&>*+*]:mt-3">{children}</div>
      </blockquote>
      <p className="text-muted-foreground mt-3 text-sm">{by}</p>
    </figure>
  );
}

/**
 * A titled box the source itself draws — a sidebar, a key, a reference panel
 * printed inside the pages being reproduced. Not an editorial aside: a
 * Callout would put the course's own ⓘ on somebody else's figure.
 *
 * The header band is the treatment `.lesson-body table` already gives a
 * thead: a --muted ground closed by a 2px --primary rule, inside a hairline
 * that runs all four sides. Painted or hairline, never half of each.
 *
 * `columns` lays the body in two, filling down then across — which is the
 * order a two-column key on a printed page reads, so a six-item list comes
 * out in the source's own arrangement rather than transposed.
 */
export function SourceBox({
  title,
  columns = false,
  children,
}: {
  title: string;
  columns?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="not-prose border-border my-4 overflow-hidden rounded-lg border">
      <p className="bg-muted text-foreground border-primary border-b-2 px-3 py-2 text-sm font-semibold">
        {title}
      </p>
      <div
        className={
          "mdx-body px-3 py-2.5 text-sm leading-relaxed [&>*+*]:mt-2 " +
          (columns ? "sm:columns-2 sm:gap-6" : "")
        }
      >
        {children}
      </div>
    </div>
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
