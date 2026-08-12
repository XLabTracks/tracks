"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HEATWORD,
  LANDSCAPE_CELLS as CELLS,
  LANDSCAPE_COLS as COLS,
  LANDSCAPE_COPY as C,
  LANDSCAPE_ROWS as ROWS,
  type LandscapeCell,
} from "@/lib/verification/data/verification-landscape";
import { marksForCell } from "@/lib/verification/data/landscape-logos";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * The Verification Landscape field map: the kind of verification down the side,
 * the who across the top, darker = more activity. Our maroon palette (theme
 * tokens, so it follows day/night/contrast), wide cells with the intensity
 * numeral in the bottom-right corner, the hatched no-activity cell, and the
 * detail panel below the grid.
 *
 * Who works where is a plain text list in each square cell — no chips, no
 * boxes, no logos, just the names, set in the cell's own contrast — with the
 * intensity numeral in the corner as the non-colour channel.
 */
const HEAT = [
  "bg-muted",
  "bg-primary/15",
  "bg-primary/55",
  "bg-primary",
] as const;
const HATCH: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent, transparent 5px, color-mix(in srgb, var(--muted-foreground) 20%, transparent) 5px, color-mix(in srgb, var(--muted-foreground) 20%, transparent) 6px)",
};

type Sel =
  | { kind: "cell"; ri: number; ci: number }
  | { kind: "axis"; axis: "row" | "col"; i: number }
  | null;

export function VerificationLandscape(_: VerificationWidgetProps) {
  void _;
  const [sel, setSel] = useState<Sel>(null);

  return (
    <div className="not-prose bg-card border-border my-6 rounded-xl border p-4 sm:p-5">
      {/* legend */}
      <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-3 text-[11px] tracking-[0.04em] uppercase">
        <span>{C.lessActivity}</span>
        <span className="flex gap-[3px]">
          {HEAT.map((h, i) => (
            <span
              key={i}
              className={cn("h-4 w-7 rounded-[2px]", h)}
              style={i === 0 ? HATCH : undefined}
            />
          ))}
        </span>
        <span>{C.moreActivity}</span>
      </div>

      {/* grid */}
      <div className="-mx-1 overflow-x-auto px-1 py-1">
        <div
          role="grid"
          className="grid min-w-[460px] gap-[5px]"
          style={{
            gridTemplateColumns: `minmax(96px, 1.15fr) repeat(${COLS.length}, minmax(64px, 1fr))`,
          }}
        >
          <div aria-hidden />
          {COLS.map((c, ci) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSel({ kind: "axis", axis: "col", i: ci })}
              className="text-primary rounded px-1 py-1 text-center text-[11px] leading-tight font-semibold tracking-[0.06em] uppercase hover:underline"
            >
              {c.name}
            </button>
          ))}

          {ROWS.map((r, ri) => (
            <div key={r.key} className="contents">
              <button
                type="button"
                onClick={() => setSel({ kind: "axis", axis: "row", i: ri })}
                className="text-foreground self-center rounded py-1 pr-2 text-left text-xs font-semibold hover:underline"
              >
                {r.name}
              </button>
              {COLS.map((c, ci) => {
                const d = CELLS[r.key][c.key];
                const active =
                  sel?.kind === "cell" && sel.ri === ri && sel.ci === ci;
                const orgs = marksForCell(r.key, c.key, d.eff);
                const onDark = d.i >= 2;
                return (
                  <button
                    key={c.key}
                    type="button"
                    aria-label={`${r.name}, ${c.name}, activity ${d.i} of 3${orgs.length ? ", " + orgs.map((m) => m.label).join(", ") : ""}`}
                    aria-pressed={active}
                    onClick={() => setSel({ kind: "cell", ri, ci })}
                    style={d.i === 0 ? HATCH : undefined}
                    className={cn(
                      "relative flex aspect-square flex-col items-start justify-start gap-0.5 overflow-hidden rounded-[3px] p-1.5 text-left outline-none transition-transform hover:z-10 hover:scale-[1.03] focus-visible:z-10 focus-visible:scale-[1.03]",
                      HEAT[d.i],
                      active &&
                        "outline-foreground shadow-soft-md outline-[3px] -outline-offset-[3px]",
                    )}
                  >
                    {orgs.map((m) => (
                      <span
                        key={m.id}
                        className={cn(
                          "text-[11px] leading-[1.15] font-medium",
                          onDark ? "text-primary-foreground" : "text-foreground",
                        )}
                      >
                        {m.short}
                      </span>
                    ))}
                    <span
                      className={cn(
                        "pointer-events-none absolute right-1.5 bottom-1 text-[11px] leading-none",
                        onDark
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      {d.i}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* detail panel — below the grid, full width */}
      <div
        key={
          sel === null
            ? "none"
            : sel.kind === "cell"
              ? `c-${sel.ri}-${sel.ci}`
              : `a-${sel.axis}-${sel.i}`
        }
        /* Outlined on all four sides, in one colour. It used to be a hairline
           on three with a 3px primary edge on top — the half-painted card the
           house rule names, and it read as an unfinished component rather than
           as emphasis. The panel is the thing the grid is talking to, so it
           gets the outline; the accent inside is the eyebrow. */
        className="border-primary bg-background motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 mt-5 min-h-24 border p-4 sm:p-5"
      >
        {sel === null ? (
          <p className="text-muted-foreground text-sm italic">{C.prompt}</p>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setSel(null)}
              aria-label="Close detail"
              className="text-muted-foreground hover:text-foreground absolute -top-1 -right-1 rounded p-1"
            >
              <X className="size-4" aria-hidden />
            </button>
            {sel.kind === "axis" ? (
              <AxisDetail axis={sel.axis} i={sel.i} />
            ) : (
              <CellDetail
                cell={CELLS[ROWS[sel.ri].key][COLS[sel.ci].key]}
                rowName={ROWS[sel.ri].name}
                colName={COLS[sel.ci].name}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CellDetail({
  cell,
  rowName,
  colName,
}: {
  cell: LandscapeCell;
  rowName: string;
  colName: string;
}) {
  return (
    <div className="text-sm">
      <p className="text-primary text-[11px] tracking-[0.12em] uppercase">
        {rowName} × {colName}
      </p>
      <h4 className="mt-1 text-base font-semibold">
        {cell.gap && <span className="text-defect">Open gap. </span>}
        {rowName} here is{" "}
        <em className="not-italic">{HEATWORD[cell.i].toLowerCase()}</em>.
      </h4>
      <p className="text-muted-foreground mt-0.5 text-xs">
        Activity {cell.i} / 3 · {HEATWORD[cell.i]}
      </p>
      <p className="mt-2">{cell.state}</p>
      {cell.eff.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {cell.eff.map(([name, body], i) => (
            <li key={i}>
              <span className="font-medium">{name}</span>. {body}
            </li>
          ))}
        </ul>
      )}
      <p className="border-border mt-3 border-t pt-2">
        <span className="text-muted-foreground mr-1 text-[11px] tracking-[0.1em] uppercase">
          {C.howConnects}
        </span>
        {cell.connect}
      </p>
    </div>
  );
}

function AxisDetail({ axis, i }: { axis: "row" | "col"; i: number }) {
  const o = axis === "row" ? ROWS[i] : COLS[i];
  return (
    <div className="text-sm">
      <p className="text-primary text-[11px] tracking-[0.12em] uppercase">
        {axis === "row" ? C.rowAxisTag : C.colAxisTag}
      </p>
      <h4 className="mt-1 text-base font-semibold">{o.name}</h4>
      <p className="mt-2">{o.desc}</p>
      <p className="text-muted-foreground mt-2 text-xs">
        {C.axisHint.replace("{kind}", axis)}
      </p>
    </div>
  );
}
