import type { ReactNode } from "react";

/**
 * What a section will make you able to do — the one shape every such block in
 * the course takes.
 *
 * These lists were four separate hand-built stacks of bullets: a lead
 * sentence phrased slightly differently each time, then a plain list that
 * looked like every other list on the page. A learner had no way to tell the
 * contract for the section from the prose around it, and the four drifted
 * apart because nothing held them together.
 *
 * So the lead sentence is the component's, not the author's — pass `scope`
 * ("this section", "Module 1") and the wording is fixed. The objectives stay
 * markdown, because a list of sentences is a list of sentences and props
 * would make them unreadable in the source.
 *
 * The rows are the ledger the course already uses for numbered lists
 * (app-bridge.css): hairline-ruled full-width rows with the numeral in the
 * display face in its own gutter. Deliberately not a card — a panel here
 * would be the fifth card shape on a page that already has reading cards and
 * exercises, and the card-edge rule leaves no room for a fifth. Band rules
 * top and bottom mark the block instead, which is the one thing that rule
 * explicitly allows.
 *
 * The numbers are not ranking, and nothing depends on reading them as one:
 * they are there so an objective can be pointed at ("the third one"), and so
 * the block cannot be mistaken for the running prose. Hue carries nothing.
 *
 * Trap: `not-prose` on the section is load-bearing, not tidiness. Every
 * generic list rule in app-bridge.css is written `:not(.not-prose *)`, so
 * this opts out of all of them at once; competing on specificity does not
 * work, because the four-or-more bullet form carries a :has() that outranks
 * any plain descendant selector — and it would make the block look different
 * depending on how many objectives an author happened to write.
 *
 * Trap: the styling lives in app-bridge.css, which is loaded on the
 * Verification routes only, and it reads theme.css's --display, --brand-ink
 * and --hairline. On a track without that chrome the block degrades to an
 * ordinary list rather than breaking — but it will not look like this.
 */
export function Objectives({
  scope = "this section",
  children,
}: {
  /** Goes into "By the end of ___, you will be able to:" */
  scope?: string;
  children: ReactNode;
}) {
  return (
    <section className="vt-objectives not-prose" aria-label={`Objectives for ${scope}`}>
      <p className="vt-objectives-lead">
        By the end of {scope}, you will be able to:
      </p>
      {children}
    </section>
  );
}
