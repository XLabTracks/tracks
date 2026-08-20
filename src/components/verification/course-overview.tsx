"use client";

import { ChevronRight } from "lucide-react";
import { courseOverview } from "@/content/verification/overview";
import { NotebookLink } from "@/components/verification/notebook-link";

export function CourseOverview() {
  return (
    <div className="not-prose mt-6 grid items-start gap-3 md:grid-cols-2">
      {courseOverview.map((section) => (
        <details
          key={section.id}
          id={`overview-${section.id}`}
          data-reveal
          className="border-border bg-card group overview-card rounded-xl border transition-shadow duration-200 open:shadow-soft-md"
        >
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

function numberFrom(groups: string[][], index: number): number {
  return groups.slice(0, index).reduce((n, g) => n + g.length, 0) + 1;
}
