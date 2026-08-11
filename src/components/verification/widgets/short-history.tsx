"use client";

/**
 * "A Short History of AI Acceleration" — the two Our World in Data charts
 * from Max Roser, "The brief history of artificial intelligence" (Dec. 2022,
 * CC BY 4.0, ourworldindata.org/brief-history-of-ai), redrawn as native SVG
 * on the author's instruction: the embedded originals carried OWID's own
 * multi-hue palette and a white ground, and she asked for shades of red that
 * follow the site's three themes.
 *
 * Redrawing is what makes that possible: every mark inks from
 * `color-mix(in oklab, var(--primary), var(--foreground) N%)`, so the ramp
 * re-solves per theme (darker reds on the day ground, rose tints on night)
 * while staying the brand hue. Warm shades converge for a protanope, so no
 * line is ever only a colour: each series carries its own name at the line's
 * end, in its own shade — the house categorical-colour rule.
 *
 * The data is OWID's, not ours: the test-scores series were read back out of
 * the chart's published SVG (grapher id
 * test-scores-ai-capabilities-relative-human-performance, source Kiela et
 * al. 2023), pixel coordinates converted to values against its own axis
 * (−100 at y=497.1, 0 at y=192.5); the timeline milestones and their
 * descriptions are the timeline figure's own annotations, verbatim. Never
 * edit a number here without re-deriving it from the source chart.
 *
 * Unbridged reading material: no state, no completion, `onComplete` ignored.
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

function Timeline() {
  const decades = [];
  for (let y = TL.yr0; y <= TL.yr1; y += 10) decades.push(y);
  return (
    <svg
      viewBox={`0 0 ${TL.w} ${TL.h}`}
      role="img"
      className="w-full"
      style={{ fontSize: 13 }}
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
  );
}

/* ------------------------------------------------------------- test scores */

interface Series {
  name: string;
  pct: number;
  points: [number, number][]; // [year, score]
}

// Read back out of OWID's published SVG; see the file header before editing.
const SERIES: Series[] = [
  {
    name: "Reading comprehension",
    pct: 0,
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
    pct: 24,
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
    pct: 48,
    points: [
      [2018, -100],
      [2019, 3.7],
      [2020, 12.0],
      [2022, 15.7],
    ],
  },
  {
    name: "Handwriting recognition",
    pct: 12,
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
    pct: 36,
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
    pct: 60,
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

function TestScores() {
  const gridValues = [20, 0, -20, -40, -60, -80, -100];
  const xTicks = [1998, 2005, 2010, 2015, 2020, 2023];
  // Labels stack on the right, ordered by where each line ends.
  const ordered = [...SERIES].sort(
    (a, b) =>
      (b.points[b.points.length - 1][1] ?? 0) -
      (a.points[a.points.length - 1][1] ?? 0),
  );
  return (
    <svg
      viewBox={`0 0 ${TS.w} ${TS.h}`}
      role="img"
      className="w-full"
      style={{ fontSize: 13 }}
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
        style={{ fontSize: 11.5 }}
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
      {SERIES.map((s) => (
        <g key={s.name}>
          <polyline
            points={s.points.map(([y, v]) => `${tsx(y)},${tsy(v)}`).join(" ")}
            fill="none"
            stroke={shade(s.pct)}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {s.points.map(([y, v]) => (
            <circle
              key={y}
              cx={tsx(y)}
              cy={tsy(v)}
              r="2.5"
              fill={shade(s.pct)}
            />
          ))}
        </g>
      ))}
      {ordered.map((s, i) => {
        const [ly, lv] = s.points[s.points.length - 1];
        const labelY = 46 + i * 22;
        return (
          <g key={s.name}>
            <path
              d={`M ${tsx(ly) + 4} ${tsy(lv)} H ${TS.plotX1 + 14} V ${labelY - 4} H ${TS.plotX1 + 20}`}
              fill="none"
              stroke="var(--border)"
            />
            <text
              x={TS.plotX1 + 24}
              y={labelY}
              fill={shade(s.pct)}
              fontWeight={600}
            >
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
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
