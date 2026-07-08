"use client";

import { useMemo, useState } from "react";

// The safety/usefulness results of Table 8, as a scatter. Each parameterized
// method (defer-to-trusted %, or the trusted-editing threshold) traces a curve;
// the baselines are two isolated reference points. The Pareto frontier is the
// set of protocols not beaten on *both* axes at once.

type Family =
  | "Trusted monitoring"
  | "Untrusted monitoring"
  | "Trusted editing"
  | "Baselines";

interface Protocol {
  family: Family;
  label: string;
  usefulness: number; // scaled usefulness, %
  safety: number; // %
}

const DATA: Protocol[] = [
  { family: "Baselines", label: "Trusted model", usefulness: 2, safety: 100 },
  { family: "Baselines", label: "Upfront auditing", usefulness: 100, safety: 15 },
  { family: "Trusted monitoring", label: "Trusted monitoring · defer 0%", usefulness: 97, safety: 62 },
  { family: "Trusted monitoring", label: "Trusted monitoring · defer 5%", usefulness: 95, safety: 74 },
  { family: "Trusted monitoring", label: "Trusted monitoring · defer 10%", usefulness: 93, safety: 83 },
  { family: "Trusted monitoring", label: "Trusted monitoring · defer 20%", usefulness: 83, safety: 92 },
  { family: "Trusted monitoring", label: "Trusted monitoring · defer 50%", usefulness: 51, safety: 100 },
  { family: "Untrusted monitoring", label: "Untrusted monitoring · defer 0%", usefulness: 96, safety: 79 },
  { family: "Untrusted monitoring", label: "Untrusted monitoring · defer 5%", usefulness: 95, safety: 82 },
  { family: "Untrusted monitoring", label: "Untrusted monitoring · defer 10%", usefulness: 92, safety: 92 },
  { family: "Untrusted monitoring", label: "Untrusted monitoring · defer 20%", usefulness: 85, safety: 98 },
  { family: "Trusted editing", label: "Trusted editing · 5%", usefulness: 97, safety: 73 },
  { family: "Trusted editing", label: "Trusted editing · 10%", usefulness: 96, safety: 85 },
  { family: "Trusted editing", label: "Trusted editing · 20%", usefulness: 94, safety: 92 },
  { family: "Trusted editing", label: "Trusted editing · 50%", usefulness: 89, safety: 96 },
];

type Shape = "circle" | "square" | "triangle" | "diamond";

const FAMILY_ORDER: Family[] = [
  "Trusted monitoring",
  "Untrusted monitoring",
  "Trusted editing",
  "Baselines",
];

// Warm / green / cool for the three parameterized methods (a well-separated
// triple), plus neutral for the baselines. Shape is a second, CVD-proof channel.
const STYLE: Record<Family, { color: string; shape: Shape; curve: boolean }> = {
  "Trusted monitoring": { color: "var(--chart-1)", shape: "circle", curve: true },
  "Untrusted monitoring": { color: "var(--chart-3)", shape: "square", curve: true },
  "Trusted editing": { color: "var(--chart-5)", shape: "triangle", curve: true },
  Baselines: { color: "var(--muted-foreground)", shape: "diamond", curve: false },
};

/** Points not dominated on both axes (higher safety AND higher usefulness). */
function paretoFront(pts: Protocol[]): Protocol[] {
  return pts.filter(
    (p) =>
      !pts.some(
        (q) =>
          q !== p &&
          q.usefulness >= p.usefulness &&
          q.safety >= p.safety &&
          (q.usefulness > p.usefulness || q.safety > p.safety),
      ),
  );
}

const W = 400;
const HH = 300;
const M = { top: 14, right: 16, bottom: 38, left: 42 };
const PW = W - M.left - M.right;
const PH = HH - M.top - M.bottom;
const xPx = (u: number) => M.left + (u / 100) * PW;
const yPx = (s: number) => M.top + PH - (s / 100) * PH;

function MarkerShape({ shape, cx, cy, r, color, filled }: { shape: Shape; cx: number; cy: number; r: number; color: string; filled: boolean }) {
  const props = { fill: filled ? color : "var(--card)", stroke: color, strokeWidth: 1.5 };
  if (shape === "square") return <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} rx={1} {...props} />;
  if (shape === "triangle") return <polygon points={`${cx},${cy - r} ${cx - r},${cy + r} ${cx + r},${cy + r}`} {...props} />;
  if (shape === "diamond") return <polygon points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} {...props} />;
  return <circle cx={cx} cy={cy} r={r} {...props} />;
}

export function FrontierDemo() {
  const [hidden, setHidden] = useState<Set<Family>>(new Set());
  const [showFrontier, setShowFrontier] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const visible = useMemo(
    () => DATA.map((p, i) => ({ p, i })).filter(({ p }) => !hidden.has(p.family)),
    [hidden],
  );
  const frontier = useMemo(() => new Set(paretoFront(visible.map((v) => v.p))), [visible]);
  const frontierLine = useMemo(
    () => [...frontier].sort((a, b) => a.usefulness - b.usefulness),
    [frontier],
  );

  const toggle = (f: Family) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });

  const familyCurve = (f: Family) => {
    if (!STYLE[f].curve || hidden.has(f)) return null;
    const pts = DATA.filter((p) => p.family === f).sort((a, b) => b.usefulness - a.usefulness);
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xPx(p.usefulness).toFixed(1)} ${yPx(p.safety).toFixed(1)}`).join(" ");
  };

  const hovered = hover != null ? DATA[hover] : null;

  return (
    <div className="space-y-4">
      <div className="relative mx-auto w-full max-w-md">
        <svg viewBox={`0 0 ${W} ${HH}`} className="block w-full" role="img" aria-label="Safety versus usefulness for each protocol from Table 8">
          {/* gridlines + tick labels */}
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={`x${t}`}>
              <line x1={xPx(t)} x2={xPx(t)} y1={M.top} y2={M.top + PH} stroke="var(--border)" strokeWidth={1} opacity={0.4} />
              <text x={xPx(t)} y={HH - 26} fontSize={9} fill="var(--muted-foreground)" textAnchor="middle">{t}</text>
            </g>
          ))}
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={`y${t}`}>
              <line x1={M.left} x2={M.left + PW} y1={yPx(t)} y2={yPx(t)} stroke="var(--border)" strokeWidth={1} opacity={0.4} />
              <text x={M.left - 6} y={yPx(t) + 3} fontSize={9} fill="var(--muted-foreground)" textAnchor="end">{t}</text>
            </g>
          ))}
          {/* axis titles */}
          <text x={M.left + PW / 2} y={HH - 8} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">Scaled usefulness (%)</text>
          <text x={14} y={M.top + PH / 2} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle" transform={`rotate(-90 14 ${M.top + PH / 2})`}>Safety (%)</text>

          {/* within-family tradeoff curves */}
          {FAMILY_ORDER.map((f) => {
            const d = familyCurve(f);
            return d ? <path key={f} d={d} fill="none" stroke={STYLE[f].color} strokeWidth={1.5} strokeOpacity={0.85} /> : null;
          })}

          {/* Pareto frontier line */}
          {showFrontier && frontierLine.length > 1 && (
            <path
              d={frontierLine.map((p, i) => `${i === 0 ? "M" : "L"} ${xPx(p.usefulness).toFixed(1)} ${yPx(p.safety).toFixed(1)}`).join(" ")}
              fill="none"
              stroke="var(--foreground)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeOpacity={0.7}
            />
          )}

          {/* points */}
          {visible.map(({ p, i }) => {
            const onFrontier = frontier.has(p);
            const dim = showFrontier && !onFrontier;
            const cx = xPx(p.usefulness);
            const cy = yPx(p.safety);
            return (
              <g key={i} opacity={dim ? 0.3 : 1}>
                {showFrontier && onFrontier && <circle cx={cx} cy={cy} r={6} fill="none" stroke="var(--foreground)" strokeWidth={1} strokeOpacity={0.6} />}
                <MarkerShape shape={STYLE[p.family].shape} cx={cx} cy={cy} r={3.5} color={STYLE[p.family].color} filled={hover === i} />
                {/* enlarged transparent hit target */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={10}
                  fill="transparent"
                  onPointerEnter={() => setHover(i)}
                  onPointerMove={() => setHover(i)}
                  onPointerLeave={() => setHover((h) => (h === i ? null : h))}
                  onPointerDown={() => setHover(i)}
                  style={{ cursor: "pointer" }}
                />
              </g>
            );
          })}
        </svg>

        {/* HTML tooltip — percentage-positioned so it tracks the responsive SVG.
            Anchor horizontally by the point's x so edge points don't clip, and
            flip below only when the point sits near the top. */}
        {hovered && (
          <div
            className="border-border bg-card text-foreground pointer-events-none absolute z-10 rounded-md border px-2.5 py-1.5 text-xs shadow-md"
            style={{
              left: `${(xPx(hovered.usefulness) / W) * 100}%`,
              top: `${(yPx(hovered.safety) / HH) * 100}%`,
              transform: `translate(${
                hovered.usefulness >= 75 ? "calc(-100% + 8px)" : hovered.usefulness <= 25 ? "-8px" : "-50%"
              }, ${yPx(hovered.safety) < HH * 0.28 ? "12px" : "calc(-100% - 12px)"})`,
              whiteSpace: "nowrap",
            }}
          >
            <div className="font-medium">{hovered.label}</div>
            <div className="text-muted-foreground tabular-nums">
              Safety {hovered.safety}% · Usefulness {hovered.usefulness}%
            </div>
          </div>
        )}
      </div>

      {/* legend (click to isolate) + frontier toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          {FAMILY_ORDER.map((f) => {
            const off = hidden.has(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggle(f)}
                className={cnLegend(off)}
              >
                <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden>
                  <MarkerShape shape={STYLE[f].shape} cx={7} cy={7} r={5} color={STYLE[f].color} filled />
                </svg>
                {f}
              </button>
            );
          })}
        </div>
        <label className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs">
          <input type="checkbox" checked={showFrontier} onChange={(e) => setShowFrontier(e.target.checked)} className="accent-primary" />
          Highlight Pareto frontier
        </label>
      </div>

      {showFrontier && (
        <p className="text-muted-foreground text-xs">
          The dashed line links the protocols that are <em>not</em> beaten on both axes at once. Points below it are dominated — some other protocol is at least as safe <em>and</em> at least as useful.
        </p>
      )}
    </div>
  );
}

function cnLegend(off: boolean): string {
  return [
    "flex items-center gap-1.5 rounded px-1 py-0.5 transition-opacity",
    off ? "opacity-35 line-through" : "opacity-100",
  ].join(" ");
}
