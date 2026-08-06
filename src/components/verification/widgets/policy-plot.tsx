"use client";

import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  COST_DIMENSIONS,
  PLOT_POLICIES,
  POLICY_PLOT_COPY as C,
  type CostLevel,
  type PlotPolicy,
} from "@/lib/verification/data/policy-plot";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * The effectiveness × feasibility plot for 1.0.2, ported from the authored
 * prototype. Five policies sit on risk-reduction (y) against political
 * feasibility (x); the toggle puts a verification regime in place and every
 * point slides right, which is the section's argument in one gesture —
 * verification buys feasibility, never effectiveness, so nothing moves
 * vertically. Points are draggable so a learner can argue with the author's
 * placement, and reset puts them back.
 *
 * House idiom: one hand-rolled SVG, no chart library. Structure reads theme
 * tokens so it follows all three Verification themes; the two policy families
 * take fixed accent classes — and a shape each, so the split survives without
 * colour.
 *
 * Trap: the SVG scales, so pointer coordinates have to come back through
 * getScreenCTM rather than being read off the event. Drag is in user units,
 * clamped to the plot frame.
 */

/* Plot frame in viewBox units. */
const X0 = 70;
const X1 = 640;
const Y0 = 340; // effect 0
const Y1 = 40; // effect 100

const fx = (feasibility: number) => X0 + feasibility * ((X1 - X0) / 100);
const fy = (effect: number) => Y0 - effect * ((Y0 - Y1) / 100);

/* Low/med/high is a quantity, so it is drawn as one: a three-segment meter
   beside the word. Deliberately no hue — a tint dark enough to read on the
   day ground fails the night and high-contrast grounds, and the level is
   already fully carried by the word. */
const LEVEL_FILL: Record<CostLevel, number> = { low: 1, med: 2, high: 3 };

export function PolicyPlot(_: VerificationWidgetProps) {
  void _;
  const [verified, setVerified] = useState(false);
  const [selected, setSelected] = useState("pause");
  const [moved, setMoved] = useState<Record<string, { x: number; y: number }>>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<string | null>(null);

  const shown = PLOT_POLICIES.find((p) => p.id === selected) ?? PLOT_POLICIES[0];

  const positionOf = (policy: PlotPolicy) =>
    moved[policy.id] ?? {
      x: fx(verified ? policy.verified : policy.baseline),
      y: fy(policy.effect),
    };

  const toUser = (event: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const ctm = svg.getScreenCTM();
    return ctm ? point.matrixTransform(ctm.inverse()) : null;
  };

  return (
    <section className="not-prose border-border bg-card rounded-xl border p-5 text-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs select-none">
          <Switch checked={verified} onCheckedChange={setVerified} />
          {C.toggle}
        </label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="ml-auto"
          onClick={() => setMoved({})}
        >
          <RotateCcw className="size-4" aria-hidden />
          {C.reset}
        </Button>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 680 400"
        className="w-full touch-none"
        role="img"
        aria-label={`${C.yAxis} against ${C.xAxis}, five policies`}
        onPointerDown={(event) => {
          const target = (event.target as Element).closest("[data-policy]");
          const id = target?.getAttribute("data-policy");
          if (!id) return;
          dragging.current = id;
          setSelected(id);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const id = dragging.current;
          if (!id) return;
          const point = toUser(event);
          if (!point) return;
          setMoved((prev) => ({
            ...prev,
            [id]: {
              x: Math.min(X1, Math.max(X0, point.x)),
              y: Math.min(Y0, Math.max(Y1, point.y)),
            },
          }));
        }}
        onPointerUp={() => {
          dragging.current = null;
        }}
        onPointerCancel={() => {
          dragging.current = null;
        }}
      >
        <defs>
          <marker
            id="pp-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M2 1L8 5L2 9"
              fill="none"
              stroke="context-stroke"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        <line x1="355" y1={Y1} x2="355" y2={Y0} className="stroke-border" strokeDasharray="4 4" />
        <line x1={X0} y1="190" x2={X1} y2="190" className="stroke-border" strokeDasharray="4 4" />
        <line
          x1={X0}
          y1={Y0}
          x2={X1}
          y2={Y0}
          className="stroke-muted-foreground"
          markerEnd="url(#pp-arrow)"
        />
        <line
          x1={X0}
          y1={Y0}
          x2={X0}
          y2={Y1}
          className="stroke-muted-foreground"
          markerEnd="url(#pp-arrow)"
        />

        <text x="64" y="26" fontSize="12" className="fill-muted-foreground">
          {C.yAxis}
        </text>
        <text x="355" y="372" textAnchor="middle" fontSize="12" className="fill-muted-foreground">
          {C.xAxis}
        </text>
        <text x="78" y="358" fontSize="12" className="fill-muted-foreground">
          {C.low}
        </text>
        <text x="632" y="358" textAnchor="end" fontSize="12" className="fill-muted-foreground">
          {C.high}
        </text>
        <text x="632" y="58" textAnchor="end" fontSize="12" className="fill-muted-foreground">
          {C.target}
        </text>

        {PLOT_POLICIES.map((policy) => {
          const { x, y } = positionOf(policy);
          const isSelected = policy.id === selected;
          return (
            <g
              key={policy.id}
              data-policy={policy.id}
              transform={`translate(${x},${y})`}
              className={cn(
                "cursor-grab active:cursor-grabbing",
                !moved[policy.id] && "transition-transform duration-500 motion-reduce:transition-none",
              )}
            >
              {/* Generous invisible hit area — a 9px dot is not a target. */}
              <circle r="18" fill="transparent" />
              {policy.kind === "transparency" ? (
                <circle
                  r="9"
                  className={cn("fill-hide", isSelected && "stroke-foreground")}
                  strokeWidth={isSelected ? 2 : 0}
                />
              ) : (
                <rect
                  x="-8"
                  y="-8"
                  width="16"
                  height="16"
                  className={cn("fill-free-ride", isSelected && "stroke-foreground")}
                  strokeWidth={isSelected ? 2 : 0}
                />
              )}
              <text y="-16" textAnchor="middle" fontSize="12" className="fill-muted-foreground">
                {policy.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend: shape and word both, so the two families never rest on hue. */}
      <div className="text-muted-foreground mt-1 mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full bg-hide" />
          {C.transparency}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 bg-free-ride" />
          {C.restriction}
        </span>
        <span className="ml-auto">{C.hint}</span>
      </div>

      <div className="border-border border-t pt-3">
        <p className="font-medium">
          {C.costLead}
          {shown.name}
        </p>
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {COST_DIMENSIONS.map((dimension, i) => (
            <div key={dimension} className="bg-muted/40 rounded-lg p-2.5">
              <p className="text-muted-foreground text-xs">{dimension}</p>
              <span className="mt-1.5 flex items-center gap-2">
                <span aria-hidden className="flex gap-0.5">
                  {[0, 1, 2].map((segment) => (
                    <span
                      key={segment}
                      className={cn(
                        "h-1.5 w-3 rounded-full",
                        segment < LEVEL_FILL[shown.costs[i]]
                          ? "bg-foreground"
                          : "bg-border",
                      )}
                    />
                  ))}
                </span>
                <span className="text-xs font-medium">{shown.costs[i]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
