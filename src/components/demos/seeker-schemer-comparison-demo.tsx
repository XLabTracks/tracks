"use client";

import { Fragment } from "react";

// Static comparison table: schemers vs. the two seeker orientations closest
// to them in behavior — influence seekers and remotely-influenceable reward
// seekers. Every cell restates a sentence from c-mod6-l1.mdx ("How seekers
// come to exist", "Remotely-influenceable reward seeker", and "Influence —
// deployment-influence seeker"); cells the lesson does not support are "—".

const COLUMNS = [
  { key: "schemer", label: "Schemer" },
  { key: "influence", label: "Influence seeker" },
  { key: "remote", label: "Remotely-influenceable seeker" },
] as const;

type RowCell = { text: string; shared?: boolean };

const ROWS: { label: string; cells: Record<(typeof COLUMNS)[number]["key"], RowCell> }[] = [
  {
    label: "Pursues",
    cells: {
      schemer: { text: "some other terminal goal" },
      influence: { text: "influence their deployment" },
      remote: { text: "its reward signal (via distant influences)" },
    },
  },
  {
    label: "Timescale",
    cells: {
      schemer: { text: "long", shared: true },
      influence: {
        text: "shorter timescales — the minimum time required to control AI behavior in deployment",
        shared: true,
      },
      remote: { text: "within-episode" },
    },
  },
  {
    label: "Honest test",
    cells: {
      schemer: { text: "passes — performs well only to survive selection" },
      influence: { text: "fails to catch — it'll just forgo the short-term reward" },
      remote: { text: "catches — it doesn't care about getting caught" },
    },
  },
  {
    label: "Distant incentives",
    cells: {
      schemer: { text: "—" },
      influence: { text: "—" },
      remote: {
        text: "responds to distant influences given to it by a third-party bad actor",
      },
    },
  },
];

const CAPTION =
  "Influence seekers \"at first glance\" look like schemers but work on shorter timescales, aiming for the minimum time required to control AI behavior in deployment, and honest tests no longer catch them because they'll just forgo the short-term reward. Remotely-influenceable reward seekers are a subcategory of ROTE seekers that respond to distant influences given to them by a third-party bad actor.";

export function SeekerSchemerComparisonDemo() {
  return (
    <figure className="space-y-3">
      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-4 gap-px overflow-hidden rounded-lg border border-border bg-border text-sm">
          <div className="bg-card p-3" />
          {COLUMNS.map((col) => (
            <div key={col.key} className="bg-card p-3 text-center font-semibold text-foreground">
              {col.label}
            </div>
          ))}

          {ROWS.map((row) => (
            <Fragment key={row.label}>
              <div className="bg-card p-3 font-medium text-foreground">{row.label}</div>
              {COLUMNS.map((col) => {
                const cell = row.cells[col.key];
                return (
                  <div
                    key={`${row.label}-${col.key}`}
                    className={
                      cell.shared
                        ? "bg-muted p-3 text-center text-muted-foreground"
                        : "bg-card p-3 text-center text-muted-foreground"
                    }
                  >
                    {cell.text}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <figcaption className="text-muted-foreground text-sm">{CAPTION}</figcaption>
    </figure>
  );
}
