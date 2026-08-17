"use client";

import { useRef, useState } from "react";

/**
 * "A Short History of AI Acceleration" — the two Our World in Data charts
 * from Max Roser, "The brief history of artificial intelligence" (Dec. 2022,
 * CC BY 4.0, ourworldindata.org/brief-history-of-ai), redrawn as native SVG
 * on the author's instruction: the embedded originals carried OWID's own
 * multi-hue palette and a white ground, and she asked for marks that follow
 * the site's three themes.
 *
 * The TIMELINE is a sequence of events, so its names still ink from a ramp of
 * one hue — `color-mix(in oklab, var(--primary), var(--foreground) N%)` —
 * which re-solves per theme and stays the brand colour.
 *
 * The TEST-SCORES chart is a categorical scale and takes the brand module
 * hues instead; see the `token` field on Series for the measurements that
 * forced the change, and for why the plot paints its own --card ground rather
 * than inheriting whatever it is embedded in.
 *
 * No line is ever only a colour: each carries its own name at the line's end,
 * in its own hue, and in low-vision mode — where every module token is white
 * on purpose — a dash pattern carries what the hue cannot.
 *
 * The data is OWID's, not ours: the test-scores series were read back out of
 * the chart's published SVG (grapher id
 * test-scores-ai-capabilities-relative-human-performance, source Kiela et
 * al. 2023), pixel coordinates converted to values against its own axis
 * (−100 at y=497.1, 0 at y=192.5); the timeline milestones and their
 * descriptions are the timeline figure's own annotations, verbatim. Never
 * edit a number here without re-deriving it from the source chart.
 *
 * The test-scores chart answers the pointer the way the grapher does, on the
 * author's instruction: hovering shows every metric's value at that year —
 * recorded points at full strength, linear interpolations dimmed, series
 * outside their run omitted — under a vertical guide. Hover state is
 * ephemeral by design; nothing persists.
 *
 * Both figures are explorable, and neither hides its content behind a gesture:
 * the timeline drags and zooms with buttons and arrow keys as well as a
 * pointer, and the six series switch off by pressing their own names, which
 * were already the legend.
 *
 * These six are the whole of the source chart — OWID's own `selection` for
 * grapher `test-scores-ai-capabilities-relative-human-performance` names
 * exactly them. The underlying indicator (OWID 852592) carries six more
 * capabilities that the chart does not plot — code generation, complex
 * reasoning, general knowledge tests, math problem-solving, nuanced language
 * interpretation, and reading comprehension with unanswerable questions — and
 * it is flagged `nonRedistributable: true`: OWID's CSV endpoint refuses with
 * "we are not allowed to re-share". Adding them is a permissions decision for
 * the course owner, not an inference from a reachable API.
 *
 * Unbridged reading material: no completion, `onComplete` ignored.
 */

const shade = (pct: number) =>
  `color-mix(in oklab, var(--primary), var(--foreground) ${pct}%)`;

/* ---------------------------------------------------------------- timeline */

interface Milestone {
  year: number;
  name: string;
  // OWID's own annotation text, hard-wrapped for SVG tspans.
  lines: string[];
  // Label block position (top-left) and the shade of the name.
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

// The red line hands over to a tint where the chart stops recording history
// and starts pointing at it: the boundary dot on the source figure.
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

/**
 * Pan and zoom over the whole scene, not over the data.
 *
 * The milestone labels are hand-placed at absolute coordinates — the author's
 * layout, tuned so that seven blocks of prose over 120 years do not collide.
 * Recomputing a label's x from its year would throw that away, so nothing here
 * is re-laid-out: the viewBox moves instead, and the axis, the connectors and
 * the labels all travel together exactly as drawn. Zooming is the point as
 * much as dragging is — at rest the whole century is one screen wide and the
 * annotations are as small as the figure allows.
 *
 * Dragging is never the only way in. A pointer gesture is invisible to a
 * keyboard and to a screen reader, so the same two axes are on the buttons and
 * on the arrow keys, and Home returns to the full view. `touch-action: none`
 * only while zoomed in, so a touch reader can still scroll the page past a
 * figure it does not want to explore.
 */
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

  // Clamp so the view can never leave the drawing — panning into blank space
  // reads as a broken figure rather than as a choice.
  const clamp = (p: { x: number; y: number }) => ({
    x: Math.min(Math.max(p.x, 0), TL.w - vw),
    y: Math.min(Math.max(p.y, 0), TL.h - vh),
  });
  const move = (dx: number, dy: number) =>
    setPan((p) => clamp({ x: p.x + dx, y: p.y + dy }));
  const zoomTo = (next: number) => {
    const nz = TL_ZOOMS[next]!;
    setZi(next);
    // Keep the centre of the view where it was, so zooming does not teleport.
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
        // Pointer pixels to user units: the rendered box is TL.w wide at z = 1.
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
      {/* axis: the recorded past in full primary, what lies past the boundary
          dot as a tint of the same hue — never a second colour */}
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
            {/* connector from label block down to the event's axis point */}
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
      {/* The controls carry the whole interaction on their own, which is the
          test: a figure whose only way in is a drag gesture is a figure a
          keyboard and a screen reader cannot read. The zoom state is also the
          hint — at 1x there is nothing to drag and the buttons say so. */}
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

/* ------------------------------------------------------------- test scores */

interface Series {
  name: string;
  /**
   * The categorical hue, as a brand module token.
   *
   * This chart used to ink all six lines from the same red ramp — the author
   * asked for shades of red, and shades of red is what it got. Measured, two
   * adjacent shades differed by a contrast ratio of 1.06 to 1.09, which is to
   * say not at all: six series, one colour, and no way to tell which line was
   * reading comprehension. On the night ground the top of the ramp also read
   * at 2.3:1 and 2.9:1 against its own background, under even the 3:1 floor
   * for a non-text mark.
   *
   * A categorical scale takes the brand's module hues through their -text
   * variants, which are built to carry as type on every theme's ground: 4.6
   * to 17.2 in day, 5.2 to 16.7 at night. The token colours the line, its
   * points, its swatch in the tooltip AND its name at the end of the line, so
   * the hue always sits on a word — nothing here is encoded by colour alone.
   * The hex mirrors theme.css's day value for the rare render with no theme.
   *
   * Six series, five module hues: the sixth is the page ink. That is the
   * honest end of the palette rather than a sixth colour invented for it.
   */
  token: string;
  /** Slot in the dash cycle; see --sh-dash-* in app-bridge.css. */
  dash: number;
  points: [number, number][]; // [year, score]
}

// Read back out of OWID's published SVG; see the file header before editing.
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

/** A series' value at a year: the recorded point when there is one, a linear
 *  interpolation between neighbours when the year falls inside the series'
 *  run, nothing outside it — the grapher's own hover rules, and the tooltip
 *  keeps its distinction (interpolated rows render dimmed). */
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

/**
 * Six lines crossing in the same corner is a lot to read at once, so the
 * reader can put some of them away.
 *
 * The names at the ends of the lines were already the legend — they name the
 * line and carry its colour — so they are what became the switches, rather
 * than a second legend appearing somewhere else to say the same thing twice.
 * A hidden series leaves the plot, the label column and the hover readout
 * together; nothing is dimmed-but-present, because a ghost line is still a
 * line to read past.
 *
 * Selection is component state and deliberately not persisted: it is a way of
 * looking at the figure, not work the learner did.
 */
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
      // Never let the last one go: an empty chart is not a view of anything,
      // and the way back is not obvious once the axes are all that is left.
      if (!next.delete(name) && prev.size < SERIES.length - 1) next.add(name);
      return next;
    });
  // Labels stack on the right, ordered by where each line ends. All six keep
  // their row whether shown or not — a switch that disappears when you use it
  // cannot be switched back.
  const ordered = [...SERIES].sort(
    (a, b) =>
      (b.points[b.points.length - 1][1] ?? 0) -
      (a.points[a.points.length - 1][1] ?? 0),
  );

  // Pointer x → nearest year, in viewBox space (the svg scales responsively,
  // so client px are mapped through the rendered width).
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
  // The tooltip flips sides at the plot's midpoint so it never leaves the
  // chart. Positioned in % of the container, which is the svg's own box.
  const tooltipLeft =
    hoverYear === null ? 0 : (tsx(hoverYear) / TS.w) * 100;
  const tooltipFlip = hoverYear !== null && tsx(hoverYear) > (TS.plotX0 + TS.plotX1) / 2;

  return (
    /* The chart carries its own opaque ground, and it is not decoration.
       The module -text tokens are each calibrated to clear 4.5:1 against
       their theme's own surface; drop the chart onto anything else and that
       calibration is void. This one sits inside the optional Fold, whose 8%
       maroon wash is a real signal and stays — but it darkened the ground
       from #fbfaf9 to #f1e6e5, which took three of the six series down to
       3.93, 3.94 and 3.97. Painting --card behind the plot puts every series
       back on the surface its colour was solved for, wherever the chart is
       embedded. */
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
      {/* Upper-left is empty on this data — every series is still deep
          below zero at these years — so the note sits there instead of over
          the converging line ends at the right. */}
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
            {/* A hit area, because a line of text is a thin target and this
                is now something you press. */}
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

/* ------------------------------------------------------------------ widget */

const OWID_URL = "https://ourworldindata.org/brief-history-of-ai";

export function ShortHistory() {
  return (
    <div className="not-prose my-6 space-y-8">
      <figure>
        <figcaption className="mb-1 text-sm font-semibold">
          A timeline of notable artificial intelligence systems
        </figcaption>
        <Timeline />
        <p className="text-muted-foreground mt-1 text-xs">
          Redrawn from{" "}
          <a
            href={OWID_URL}
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Our World in Data
          </a>{" "}
          (CC BY 4.0).
        </p>
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
        <p className="text-muted-foreground mt-1 text-xs">
          Data: Kiela et al. (2023). Redrawn from{" "}
          <a
            href={OWID_URL}
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Our World in Data
          </a>{" "}
          (CC BY 4.0).
        </p>
      </figure>
    </div>
  );
}
