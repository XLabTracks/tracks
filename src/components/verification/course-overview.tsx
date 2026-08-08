"use client";

import { ChevronRight } from "lucide-react";
import { courseOverview } from "@/content/verification/overview";

/**
 * The landing page's course overview: four disclosures over the author's copy
 * (`src/content/verification/overview.ts`).
 *
 * Native `<details>`, so it opens without JavaScript, is keyboard-operable for
 * free, and in-page search reaches a closed section in the browsers that
 * implement it. The only thing scripted here is the notebook control, which
 * has to be a button because the notebook is a panel mounted on the page by
 * notebook.js, not a route — there is no URL to link to.
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
          className="border-primary bg-card group rounded-xl border-2 transition-shadow duration-200 open:shadow-soft-md"
        >
          <summary className="flex cursor-pointer list-none items-start gap-3 p-4 select-none [&::-webkit-details-marker]:hidden">
            <ChevronRight
              aria-hidden
              className="text-muted-foreground mt-1 size-4 shrink-0 transition-transform duration-200 group-open:rotate-90"
            />
            <span className="text-foreground text-base font-semibold">
              {section.title}
            </span>
          </summary>

          <div className="border-primary/35 border-t px-4 pt-3.5 pb-4 pl-11">
            {section.kind === "prose" ? (
              <div className="flex flex-col gap-3.5">
                {section.paragraphs.map((p) => (
                  <p
                    key={p.label}
                    className="text-muted-foreground max-w-[68ch] text-[0.95rem] leading-relaxed"
                  >
                    <b className="text-foreground">{p.label}:</b> {p.body}
                    {p.slot === "notebook" && <NotebookLink />}
                    {p.slot === "notebook" && " to try it out!"}
                    {p.slot === "facilitator" && (
                      <a
                        href="/verification/facilitator"
                        className="text-primary underline underline-offset-2"
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
                          {section.kind === "numbered"
                            ? `${numberFrom(section.groups, gi) + ii}.`
                            : "—"}
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

function NotebookLink() {
  return (
    <button
      type="button"
      onClick={() => {
        const w = window as unknown as { VTNotebook?: { open: () => void } };
        w.VTNotebook?.open();
      }}
      className="text-primary underline underline-offset-2 select-none"
    >
      the notebook
    </button>
  );
}
