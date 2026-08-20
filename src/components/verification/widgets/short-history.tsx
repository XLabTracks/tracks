"use client";

import { useRef, useState } from "react";

const shade = (pct: number) =>
  `color-mix(in oklab, var(--primary), var(--foreground) ${pct}%)`;

interface Milestone {
  year: number;
  name: string;
  lines: string[];
  x: number;
  y: number;
  pct: number;
}

const TL = {
  w: 900,
  h: 330,
  axisY: 272,
  x0: 43,
  x1: 837,
  yr0: 1940,
  yr1: 2060,
};
const tlx = (year: number) =>
  TL.x0 + ((year - TL.yr0) / (TL.yr1 - TL.yr0)) * (TL.x1 - TL.x0);

const TL_BOUNDARY = 2024;

const MILESTONES: Milestone[] = [
  {
    year: 1945,
    name: "First digital computers",
    lines: [],
    x: 14,
    y: 216,
    pct: 36,
  },
  {
    year: 1950,
    name: "Theseus:",
    lines: [
      "A small robotic mouse that could",
      "navigate a simple maze and",
      "remember its course.",
    ],
    x: 100,
    y: 56,
    pct: 48,
  },
  {
    year: 1957,
    name: "Perceptron Mark I:",
    lines: [
      "Regarded as the first artificial neural",
      "network, it could visually distinguish cards",
      "marked on the left side from those marked",
      "on the right.",
    ],
    x: 158,
    y: 128,
    pct: 24,
  },
  {
    year: 1992,
    name: "TD-Gammon:",
    lines: [
      "This software learned to play",
      "backgammon at a high level, just",
      "below the top human players.",
    ],
    x: 330,
    y: 46,
    pct: 60,
  },
  {
    year: 2012,
    name: "AlexNet:",
    lines: [
      "This was a pivotal early “deep learning”",
      "system — a neural network with many",
      "layers — that could recognize images of",
      "objects such as dogs and cars at",
      "near-human level.",
    ],
    x: 580,
    y: 78,
    pct: 12,
  },
  {
    year: TL_BOUNDARY,
    name: "Artificial intelligence with language and",
    lines: [
      "image recognition capabilities that are",
      "comparable to those of humans",
    ],
    x: 640,
    y: 196,
    pct: 0,
  },
];

const TL_ZOOMS = [1, 1.6, 2.4, 3.4];

function Timeline() {
  const decades = [];
  for (let y = TL.yr0; y <= TL.yr1; y += 10) decades.push(y);

  const [zi, setZi] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  const z = TL_ZOOMS[zi]!;
  const vw = TL.w / z;
  const vh = TL.h / z;

  const clamp = (p: { x: number; y: number }) => ({
    x: Math.min(Math.max(p.x, 0), TL.w - vw),
    y: Math.min(Math.max(p.y, 0), TL.h - vh),
  });
  const move = (dx: number, dy: number) =>
    setPan((p) => clamp({ x: p.x + dx, y: p.y + dy }));
  const zoomTo = (next: number) => {
    const nz = TL_ZOOMS[next]!;
    setZi(next);
    setPan((p) => {
      const cx = p.x + vw / 2;
      const cy = p.y + vh / 2;
      const nvw = TL.w / nz;
      const nvh = TL.h / nz;
      return {
        x: Math.min(Math.max(cx - nvw / 2, 0), TL.w - nvw),
        y: Math.min(Math.max(cy - nvh / 2, 0), TL.h - nvh),
      };
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = vw / 12;
    const map: Record<string, () => void> = {
      ArrowLeft: () => move(-step, 0),
      ArrowRight: () => move(step, 0),
      ArrowUp: () => move(0, -step / 2),
      ArrowDown: () => move(0, step / 2),
      Home: () => {
        setZi(0);
        setPan({ x: 0, y: 0 });
      },
      "+": () => zoomTo(Math.min(zi + 1, TL_ZOOMS.length - 1)),
      "=": () => zoomTo(Math.min(zi + 1, TL_ZOOMS.length - 1)),
      "-": () => zoomTo(Math.max(zi - 1, 0)),
    };
    const fn = map[e.key];
    if (!fn) return;
    e.preventDefault();
    fn();
  };

  return (
    <div className="bg-card relative rounded-lg p-2">
    <svg
      viewBox={`${pan.x} ${pan.y} ${vw} ${vh}`}
      role="group"
      aria-label="A timeline of notable artificial intelligence systems, 1940 to 2060. Draggable; arrow keys pan, plus and minus zoom, Home resets."
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (z === 1) return;
        drag.current = { x: pan.x, y: pan.y, px: e.clientX, py: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const k = vw / e.currentTarget.getBoundingClientRect().width;
        setPan(
          clamp({
            x: d.x - (e.clientX - d.px) * k,
            y: d.y - (e.clientY - d.py) * k,
          }),
        );
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      className={`focus-visible:ring-ring w-full rounded focus-visible:ring-2 focus-visible:outline-none ${z === 1 ? "" : "cursor-grab touch-none active:cursor-grabbing"}`}
      style={{ fontSize: "var(--fs-xs)" }}
    >
      <title>
        A timeline of notable artificial intelligence systems, 1940–2060
      </title>
      <line
        x1={TL.x0}
        y1={TL.axisY}
        x2={tlx(TL_BOUNDARY)}
        y2={TL.axisY}
        stroke="var(--primary)"
        strokeWidth="4"
      />
      <line
        x1={tlx(TL_BOUNDARY)}
        y1={TL.axisY}
        x2={TL.x1}
        y2={TL.axisY}
        stroke="color-mix(in oklab, var(--primary), var(--background) 55%)"
        strokeWidth="4"
      />
      <circle
        cx={tlx(TL_BOUNDARY)}
        cy={TL.axisY}
        r="5.5"
        fill="var(--primary)"
      />
      {decades.map((y) => (
        <g key={y}>
          <line
            x1={tlx(y)}
            y1={TL.axisY + 6}
            x2={tlx(y)}
            y2={TL.axisY + 11}
            stroke="var(--muted-foreground)"
          />
          <text
            x={tlx(y)}
            y={TL.axisY + 28}
            textAnchor="middle"
            fill="var(--muted-foreground)"
          >
            {y}
          </text>
        </g>
      ))}
      {MILESTONES.map((m) => {
        const lineH = 16;
        const blockBottom = m.y + (m.lines.length + 1) * lineH;
        return (
          <g key={m.year}>
            <line
              x1={tlx(m.year)}
              y1={Math.min(blockBottom, TL.axisY - 10)}
              x2={tlx(m.year)}
              y2={TL.axisY - 5}
              stroke="var(--muted-foreground)"
              strokeWidth="1"
            />
            <path
              d={`M ${tlx(m.year) - 3.5} ${TL.axisY - 10} L ${tlx(m.year)} ${TL.axisY - 4} L ${tlx(m.year) + 3.5} ${TL.axisY - 10}`}
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth="1"
            />
            <text x={m.x} y={m.y + lineH} fill={shade(m.pct)} fontWeight={600}>
              {m.name}
            </text>
            {m.lines.map((l, i) => (
              <text
                key={i}
                x={m.x}
                y={m.y + (i + 2) * lineH}
                fill="var(--muted-foreground)"
              >
                {l}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => zoomTo(Math.max(zi - 1, 0))}
            disabled={zi === 0}
            aria-label="Zoom out"
            className="border-border hover:bg-muted disabled:opacity-40 rounded-md border px-2 py-1 text-3xs disabled:pointer-events-none"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => zoomTo(Math.min(zi + 1, TL_ZOOMS.length - 1))}
            disabled={zi === TL_ZOOMS.length - 1}
            aria-label="Zoom in"
            className="border-border hover:bg-muted disabled:opacity-40 rounded-md border px-2 py-1 text-3xs disabled:pointer-events-none"
          >
            +
          </button>
        </div>
        {z > 1 ? (
          <>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(-vw / 6, 0)}
                aria-label="Pan left"
                className="border-border hover:bg-muted rounded-md border px-2 py-1 text-3xs"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => move(vw / 6, 0)}
                aria-label="Pan right"
                className="border-border hover:bg-muted rounded-md border px-2 py-1 text-3xs"
              >
                →
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setZi(0);
                setPan({ x: 0, y: 0 });
              }}
              className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
            >
              Whole timeline
            </button>
          </>
        ) : null}
        <p className="text-muted-foreground ml-auto text-xs" aria-live="polite">
          {z === 1
            ? "Zoom in to read the annotations, then drag to move along."
            : `${Math.round(TL.yr0 + (pan.x / TL.w) * (TL.yr1 - TL.yr0))}–${Math.round(TL.yr0 + ((pan.x + vw) / TL.w) * (TL.yr1 - TL.yr0))}`}
        </p>
      </div>
    </div>
  );
}

interface Series {
  name: string;
  token: string;
  dash: number;
  points: [number, number][];
}

const SERIES: Series[] = [
  {
    name: "Reading comprehension",
    token: "var(--mod-0-text, #9a000c)",
    dash: 0,
    points: [
      [2016, -100],
      [2017, -8.9],
      [2018, 6.6],
      [2019, 18.1],
      [2020, 18.8],
    ],
  },
  {
    name: "Image recognition",
    token: "var(--mod-4-text, #3d75b1)",
    dash: 1,
    points: [
      [2009, -100],
      [2012, -44.2],
      [2014, -6.8],
      [2015, 0.7],
      [2016, 6.6],
      [2018, 11.7],
      [2019, 9.5],
      [2020, 16.4],
    ],
  },
  {
    name: "Language understanding",
    token: "var(--mod-3-text, #555e07)",
    dash: 2,
    points: [
      [2018, -100],
      [2019, 3.7],
      [2020, 12.0],
      [2022, 15.7],
    ],
  },
  {
    name: "Handwriting recognition",
    token: "var(--mod-1-text, #bf4f00)",
    dash: 3,
    points: [
      [1998, -100],
      [2002, -48.0],
      [2003, -26.7],
      [2006, -25.3],
      [2010, -20.0],
      [2012, -4.0],
      [2013, -1.3],
      [2018, 2.7],
    ],
  },
  {
    name: "Speech recognition",
    token: "var(--mod-2-text, #946b00)",
    dash: 4,
    points: [
      [1998, -100],
      [2011, -65.6],
      [2013, -52.7],
      [2014, -27.8],
      [2015, -8.7],
      [2016, -1.2],
      [2017, 0.4],
      [2018, 1.6],
    ],
  },
  {
    name: "Predictive reasoning",
    token: "var(--foreground, #1a1614)",
    dash: 5,
    points: [
      [2019, -100],
      [2021, -80.5],
      [2022, -30.6],
      [2023, -0.6],
    ],
  },
];

const TS = {
  w: 900,
  h: 430,
  plotX0: 64,
  plotX1: 655,
  plotY0: 30,
  plotY1: 372,
  yr0: 1998,
  yr1: 2023,
  v0: 25,
  v1: -100,
};
const tsx = (year: number) =>
  TS.plotX0 + ((year - TS.yr0) / (TS.yr1 - TS.yr0)) * (TS.plotX1 - TS.plotX0);
const tsy = (v: number) =>
  TS.plotY0 + ((TS.v0 - v) / (TS.v0 - TS.v1)) * (TS.plotY1 - TS.plotY0);

function valueAt(
  s: Series,
  year: number,
): { v: number; exact: boolean } | null {
  const pts = s.points;
  if (year < pts[0][0] || year > pts[pts.length - 1][0]) return null;
  for (let i = 0; i < pts.length; i++) {
    if (pts[i][0] === year) return { v: pts[i][1], exact: true };
    if (pts[i][0] > year) {
      const [ay, av] = pts[i - 1];
      const [by, bv] = pts[i];
      return { v: av + ((bv - av) * (year - ay)) / (by - ay), exact: false };
    }
  }
  return null;
}

function TestScores() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const gridValues = [20, 0, -20, -40, -60, -80, -100];
  const xTicks = [1998, 2005, 2010, 2015, 2020, 2023];
  const shown = SERIES.filter((s) => !hidden.has(s.name));
  const toggle = (name: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (!next.delete(name) && prev.size < SERIES.length - 1) next.add(name);
      return next;
    });
  const ordered = [...SERIES].sort(
    (a, b) =>
      (b.points[b.points.length - 1][1] ?? 0) -
      (a.points[a.points.length - 1][1] ?? 0),
  );

  const yearFromPointer = (clientX: number): number | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return null;
    const x = ((clientX - rect.left) / rect.width) * TS.w;
    if (x < TS.plotX0 - 12 || x > TS.plotX1 + 12) return null;
    const yr = Math.round(
      TS.yr0 + ((x - TS.plotX0) / (TS.plotX1 - TS.plotX0)) * (TS.yr1 - TS.yr0),
    );
    return Math.max(TS.yr0, Math.min(TS.yr1, yr));
  };

  const hoverRows =
    hoverYear === null
      ? []
      : shown.map((s) => ({ s, at: valueAt(s, hoverYear) }))
          .filter((r): r is { s: Series; at: { v: number; exact: boolean } } =>
            Boolean(r.at),
          )
          .sort((a, b) => b.at.v - a.at.v);
  const tooltipLeft =
    hoverYear === null ? 0 : (tsx(hoverYear) / TS.w) * 100;
  const tooltipFlip = hoverYear !== null && tsx(hoverYear) > (TS.plotX0 + TS.plotX1) / 2;

  return (
    <div className="bg-card relative rounded-lg p-2">
    <svg
      ref={svgRef}
      viewBox={`0 0 ${TS.w} ${TS.h}`}
      role="img"
      className="w-full"
      style={{ fontSize: "var(--fs-xs)", touchAction: "pan-y" }}
      onPointerMove={(e) => setHoverYear(yearFromPointer(e.clientX))}
      onPointerLeave={() => setHoverYear(null)}
    >
      <title>
        Test scores of AI systems on various capabilities relative to human
        performance, 1998–2023
      </title>
      {gridValues.map((v) => (
        <g key={v}>
          <line
            x1={TS.plotX0}
            y1={tsy(v)}
            x2={TS.plotX1}
            y2={tsy(v)}
            stroke={v === 0 ? "var(--muted-foreground)" : "var(--border)"}
            strokeDasharray={v === 0 ? undefined : "4 4"}
          />
          <text
            x={TS.plotX0 - 8}
            y={tsy(v) + 4}
            textAnchor="end"
            fill="var(--muted-foreground)"
          >
            {v}
          </text>
        </g>
      ))}
      <text
        x={TS.plotX0 + 8}
        y={tsy(0) - 6}
        fill="var(--muted-foreground)"
        style={{ fontSize: "var(--fs-2xs)" }}
      >
        Human performance, as the benchmark, is set to zero
      </text>
      {xTicks.map((y) => (
        <text
          key={y}
          x={tsx(y)}
          y={TS.plotY1 + 24}
          textAnchor="middle"
          fill="var(--muted-foreground)"
        >
          {y}
        </text>
      ))}
      {shown.map((s) => (
        <g key={s.name}>
          <polyline
            points={s.points.map(([y, v]) => `${tsx(y)},${tsy(v)}`).join(" ")}
            fill="none"
            stroke={s.token}
            style={{ strokeDasharray: `var(--sh-dash-${s.dash}, none)` }}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {s.points.map(([y, v]) => (
            <circle
              key={y}
              cx={tsx(y)}
              cy={tsy(v)}
              r="2.5"
              fill={s.token}
            />
          ))}
        </g>
      ))}
      {ordered.map((s, i) => {
        const [ly, lv] = s.points[s.points.length - 1];
        const labelY = 46 + i * 22;
        const off = hidden.has(s.name);
        return (
          <g
            key={s.name}
            role="switch"
            aria-checked={!off}
            aria-label={s.name}
            tabIndex={0}
            onClick={() => toggle(s.name)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              toggle(s.name);
            }}
            className="focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
          >
            <rect
              x={TS.plotX1 + 18}
              y={labelY - 13}
              width={TS.w - TS.plotX1 - 20}
              height={19}
              fill="transparent"
            />
            {off ? null : (
              <path
                d={`M ${tsx(ly) + 4} ${tsy(lv)} H ${TS.plotX1 + 14} V ${labelY - 4} H ${TS.plotX1 + 20}`}
                fill="none"
                stroke="var(--border)"
              />
            )}
            <text
              x={TS.plotX1 + 24}
              y={labelY}
              fill={off ? "var(--muted-foreground)" : s.token}
              fontWeight={600}
              style={
                off
                  ? { textDecoration: "line-through", opacity: 0.75 }
                  : undefined
              }
            >
              {s.name}
            </text>
          </g>
        );
      })}
      {hoverYear !== null && (
        <g pointerEvents="none">
          <line
            x1={tsx(hoverYear)}
            y1={TS.plotY0}
            x2={tsx(hoverYear)}
            y2={TS.plotY1}
            stroke="var(--muted-foreground)"
            strokeWidth="1"
          />
          {hoverRows.map(({ s, at }) => (
            <circle
              key={s.name}
              cx={tsx(hoverYear)}
              cy={tsy(at.v)}
              r={at.exact ? 4.5 : 3}
              fill={s.token}
              opacity={at.exact ? 1 : 0.55}
            />
          ))}
        </g>
      )}
    </svg>
    {hidden.size > 0 && (
      <button
        type="button"
        onClick={() => setHidden(new Set())}
        className="text-muted-foreground hover:text-foreground absolute right-2 bottom-1 text-xs underline-offset-4 hover:underline"
      >
        Show all six
      </button>
    )}
    {hoverYear !== null && hoverRows.length > 0 && (
      <div
        className="bg-card border-border pointer-events-none absolute z-10 rounded-lg border px-3 py-2 text-xs shadow-md"
        style={{
          left: `${tooltipLeft}%`,
          top: "10%",
          transform: tooltipFlip ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
        }}
      >
        <div className="mb-1 text-sm font-semibold">{hoverYear}</div>
        <table>
          <tbody>
            {hoverRows.map(({ s, at }) => (
              <tr key={s.name} style={{ opacity: at.exact ? 1 : 0.55 }}>
                <td className="pr-2">
                  <span
                    className="inline-block size-2.5 rounded-[3px]"
                    style={{ background: s.token }}
                  />
                </td>
                <td className="pr-4 whitespace-nowrap">{s.name}</td>
                <td className="text-right font-medium tabular-nums">
                  {at.v.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </div>
  );
}

const OWID_URL = "https://ourworldindata.org/brief-history-of-ai";

function OwidCredit({ data }: { data?: string }) {
  return (
    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
      Roser, Max. &ldquo;The Brief History of Artificial Intelligence: The
      World Has Changed Fast &mdash; What Might Be Next?&rdquo;{" "}
      <em>Our World in Data</em>, 6 Dec. 2022,{" "}
      <a
        href={OWID_URL}
        className="underline underline-offset-2"
        target="_blank"
        rel="noreferrer"
      >
        ourworldindata.org/brief-history-of-ai
      </a>
      . Licensed CC BY 4.0; chart redrawn.
      {data ? ` ${data}` : ""}
    </p>
  );
}

export function ShortHistory() {
  return (
    <div className="not-prose my-6 space-y-8">
      <figure>
        <figcaption className="mb-1 text-sm font-semibold">
          A timeline of notable artificial intelligence systems
        </figcaption>
        <Timeline />
        <OwidCredit />
      </figure>
      <figure>
        <figcaption className="mb-1 text-sm font-semibold">
          Test scores of AI systems on various capabilities relative to human
          performance
        </figcaption>
        <p className="text-muted-foreground mb-2 text-sm">
          Within each domain, the initial performance of the AI is set to
          −100. Human performance is used as a baseline, set to zero. When the
          AI’s performance crosses the zero line, it scored more points than
          humans.
        </p>
        <TestScores />
        <OwidCredit data="Underlying data from Kiela et al., 2023." />
      </figure>
    </div>
  );
}
