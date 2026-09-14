import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Several people quoted from one source, as a grid of speaker cards.
 *
 * `SourceQuote` puts the work first and the speaker last, which is right when
 * each passage comes from a different place. It reads badly for a signed open
 * letter: the same title and link repeat above every card, and the person who
 * actually said the words arrives last. Here the speaker is the card header
 * (face, name, role, then their words); the work itself is named and linked in
 * the lesson prose that introduces the block, which also puts it in the Works
 * cited appendix. The block's own footer carries only the portrait credit
 * (owner, 2026-08-20: no source line under the cards), at the small credit
 * size a citation takes.
 *
 * Use it only when every quote really is from one source, and make sure the
 * surrounding prose names that source. Reproduce only what a source's terms
 * allow, and record the terms in a comment above the lesson's use of this.
 *
 * Trap: this renders inside `not-prose`, so a quotation's own paragraph breaks
 * have no margin of their own; the sibling rule below is what keeps a
 * two-paragraph comment from running together.
 */
export function SignatoryQuotes({
  credit,
  creditHref,
  creditNote,
  children,
}: {
  /**
   * Portrait credit, when a card carries a photo somebody else owns. It is a
   * prop rather than an `<a>` written into the lesson because a literal anchor
   * in MDX is scanned into the Works cited appendix, and an image credit is
   * not a reading — `creditHref` avoids every shape `citedUrls` matches.
   */
  credit?: ReactNode;
  creditHref?: string;
  /** Further portrait credit that carries no link of its own. */
  creditNote?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-6">
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      {credit ? (
        <figcaption className="text-muted-foreground mt-3 text-3xs">
          {creditHref ? (
            <a
              href={creditHref}
              target="_blank"
              rel="noopener"
              className="underline underline-offset-2 hover:no-underline"
            >
              {credit}
            </a>
          ) : (
            credit
          )}
          {creditNote ? <span>. {creditNote}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * One speaker's card inside a `SignatoryQuotes` block: portrait or initials,
 * name, role, then the words.
 *
 * `photo` is optional on purpose. A card falls back to initials when no
 * freely-licensed portrait exists, which is the same choice the
 * what-do-they-say dossier makes — a face nobody can license is not worth a
 * broken permission.
 */
export function Signatory({
  name,
  role,
  photo,
  initials,
  children,
}: {
  name: string;
  role: string;
  photo?: string;
  /** Fallback when there is no portrait — the speaker's initials. */
  initials: string;
  children: ReactNode;
}) {
  return (
    <div className="border-border bg-card flex flex-col rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "bg-muted text-muted-foreground border-border flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border text-sm font-semibold",
          )}
          aria-hidden
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              draggable="false"
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            initials
          )}
        </span>
        <div className="min-w-0">
          <p className="text-foreground text-sm font-semibold">{name}</p>
          <p className="text-muted-foreground text-xs">{role}</p>
        </div>
      </div>
      <blockquote className="text-foreground/90 mt-3 text-sm leading-relaxed [&>p]:m-0 [&>p+p]:mt-3">
        {children}
      </blockquote>
    </div>
  );
}
