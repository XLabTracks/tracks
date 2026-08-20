"use client";

import { ChevronRight } from "lucide-react";
import { courseOverview } from "@/content/verification/overview";
import { NotebookLink } from "@/components/verification/notebook-link";

/**
 * The landing page's course overview: four disclosures over the author's copy
 * (`src/content/verification/overview.ts`).
 *
 * Native `<details>`, so it opens without JavaScript, is keyboard-operable for
 * free, and in-page search reaches a closed section in the browsers that
 * implement it. The only thing scripted here is the notebook control
 * (`NotebookLink`, shared with the landing copy above this band).
 *
 * Trap: this renders inside landing's `section.band > .wrap`, so it inherits
 * that band's frame and heading scale. Do not give it a second card border of
 * its own; the disclosures are the only edges here.
 */
export function CourseOverview() {
  return (
    /* Two columns, and `items-start` is the whole reason they work: a grid
       cell stretches to its row by default, so an open card would drag its
       closed neighbour to the same height and leave it half empty. */
    <div className="not-prose mt-6 grid items-start gap-3 md:grid-cols-2">
      {/* Independent, not an accordion: these are read side by side — which is
          now literal — so opening one must not close the other. No shared
          `name`. */}
      {courseOverview.map((section) => (
        <details
          key={section.id}
          id={`overview-${section.id}`}
          data-reveal
          className="border-border bg-card group overview-card rounded-xl border transition-shadow duration-200 open:shadow-soft-md"
        >
          {/* The chevron closes the row rather than opening it: the title is
              what the eye lands on, and a marker in front of it pushes every
              title off the card's own left edge for a glyph that says the same
              thing from either end. `ml-auto` puts it at the end of the line,
              so the rows share one right rail whatever their titles measure.
              No disc behind it — a ring around a glyph is what this design
              system does not do, and the chevron carries the affordance
              already. */}
          <summary className="flex cursor-pointer list-none items-start gap-3 p-4 select-none [&::-webkit-details-marker]:hidden">
            <span className="text-foreground text-base font-semibold">
              {section.title}
            </span>
            <ChevronRight
              aria-hidden
              className="text-brand-ink mt-1 ml-auto size-4 shrink-0 transition-transform duration-200 group-open:rotate-90"
            />
          </summary>

          <div className="border-border border-t px-4 pt-3.5 pb-4">
            {section.kind === "prose" ? (
              <div className="flex flex-col gap-3.5">
                {section.paragraphs.map((p) => (
                  <p
                    key={p.label}
                    className="text-muted-foreground max-w-[68ch] text-[0.95rem] leading-relaxed"
                  >
                    <b className="text-foreground">{p.label}:</b> {p.body}
                    {p.slot === "notebook" && (
                      <NotebookLink>the notebook</NotebookLink>
                    )}
                    {p.slot === "notebook" && " to try it out!"}
                    {p.slot === "facilitator" && (
                      <a
                        href="/verification/facilitator"
                        className="text-brand-ink underline underline-offset-2"
                      >
                        we have a facilitation resources module
                      </a>
                    )}
                    {p.slot === "facilitator" && "."}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {section.groups.map((group, gi) => (
                  <ol
                    key={gi}
                    // Safari drops list semantics from a list with no marker,
                    // so the role is restated rather than inferred.
                    role="list"
                    start={numberFrom(section.groups, gi)}
                    className="flex list-none flex-col gap-2.5"
                  >
                    {group.map((item, ii) => (
                      <li
                        key={ii}
                        className="text-muted-foreground flex max-w-[72ch] gap-3 text-[0.95rem] leading-relaxed"
                      >
                        <span
                          aria-hidden
                          className="text-muted-foreground/70 mt-px shrink-0 font-semibold tabular-nums"
                        >
                          {`${numberFrom(section.groups, gi) + ii}.`}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                ))}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

/** Numbering runs across the groups, not restarting inside each one. */
function numberFrom(groups: string[][], index: number): number {
  return groups.slice(0, index).reduce((n, g) => n + g.length, 0) + 1;
}
