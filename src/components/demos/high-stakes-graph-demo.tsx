"use client";

import { SlideStepper, type SlideStep } from "./slide-stepper";

// The high-stakes control graph (module 5, "What is High Stakes?") as a
// stepper: the axes first, then each region in turn, then the lesson's
// inverse-correlation argument along the diagonal. Geometry reproduces the
// lesson's static SVG (four 180°-rotationally-symmetric regions); captions
// restate the lesson's own prose and the graph's labels.

const STEPS: SlideStep[] = [
  {
    label: "The axes",
    caption:
      "The control graph places a deployment scenario on two axes: how incriminating each of the model's actions is, and how many actions the model needs to cause a catastrophe.",
  },
  {
    label: "High-stakes",
    caption:
      "“High stakes” is what takes the least amount of actions to produce a catastrophically threatening occurrence — the left half of the band, where only a few actions are needed.",
  },
  {
    label: "Low-stakes",
    caption:
      "The right half of the band is the low-stakes region: lots of actions are needed to cause a catastrophe, so no single action decides the outcome.",
  },
  {
    label: "The corners",
    caption:
      "The corners fall off the interesting band. Top right: many actions needed and each one highly incriminating — trivially solved with random auditing. Bottom left: a catastrophe in a few barely-incriminating actions — probably hopeless?",
  },
  {
    label: "Why the diagonal?",
    caption:
      "Incrimination and number of actions are inversely correlated: as the number of actions decreases while the catastrophe stays the same, each action's size and impact must grow — breaking more safeguards and costing more reasoning — so each action becomes more incriminable.",
  },
];

const W = 560;
const H = 400;
// Plot area.
const PX = 84;
const PY = 22;
const PW = 448;
const PH = 300;

// Region polygons in plot coordinates (scaled from the lesson's static SVG,
// which draws them in a 600 × 540 plot box).
const sx = PW / 600;
const sy = PH / 540;
const pt = (x: number, y: number) => `${PX + x * sx},${PY + y * sy}`;
const poly = (pts: [number, number][]) => pts.map(([x, y]) => pt(x, y)).join(" ");

const HIGH_STAKES = poly([
  [0, 0],
  [150, 0],
  [450, 180],
  [150, 360],
  [0, 270],
]);
const LOW_STAKES = poly([
  [450, 180],
  [600, 270],
  [600, 540],
  [450, 540],
  [150, 360],
]);
const TRIVIAL = poly([
  [150, 0],
  [600, 0],
  [600, 270],
]);
const HOPELESS = poly([
  [0, 270],
  [0, 540],
  [450, 540],
]);

export function HighStakesGraphDemo() {
  return (
    <SlideStepper steps={STEPS}>
      {(step) => {
        const hsOn = step >= 1;
        const lsOn = step >= 2;
        const cornersOn = step >= 3;
        const diagOn = step === 4;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label="The control graph: how incriminating each action is against how many actions are needed to cause a catastrophe, built up region by region — high-stakes, low-stakes, trivially solved, probably hopeless — then the inverse correlation between the axes"
          >
            <defs>
              <marker
                id="hsg-axis"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground" />
              </marker>
              <marker
                id="hsg-diag"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M0,0 L8,4 L0,8 z"
                  className="fill-amber-600 dark:fill-amber-400"
                />
              </marker>
            </defs>

            {/* Regions — faint until their step arrives. */}
            <g className="transition-opacity duration-500" opacity={hsOn ? 0.95 : 0.15}>
              <polygon
                points={HIGH_STAKES}
                className="fill-amber-500/80 stroke-background"
                strokeWidth={2}
              />
            </g>
            <g className="transition-opacity duration-500" opacity={lsOn ? 1 : 0.35}>
              <polygon
                points={LOW_STAKES}
                className="fill-muted stroke-background"
                strokeWidth={2}
              />
            </g>
            <g
              className="transition-opacity duration-500"
              opacity={cornersOn ? 1 : 0.35}
            >
              <polygon
                points={TRIVIAL}
                className="fill-muted/70 stroke-background"
                strokeWidth={2}
              />
              <polygon
                points={HOPELESS}
                className="fill-muted stroke-background"
                strokeWidth={2}
              />
            </g>

            {/* Region labels */}
            <text
              x={PX + 190 * sx}
              y={PY + 168 * sy}
              className="fill-foreground text-[15px] font-bold transition-opacity duration-500"
              opacity={hsOn ? 1 : 0}
            >
              High-stakes
            </text>
            <text
              x={PX + 430 * sx}
              y={PY + 408 * sy}
              className="fill-muted-foreground text-[13px] font-semibold transition-opacity duration-500"
              opacity={lsOn ? 1 : 0}
            >
              Low-stakes
            </text>
            <g
              className="transition-opacity duration-500"
              opacity={cornersOn ? 1 : 0}
            >
              <text
                x={PX + 505 * sx}
                y={PY + 80 * sy}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                <tspan x={PX + 505 * sx} dy={0}>
                  Trivially solved
                </tspan>
                <tspan x={PX + 505 * sx} dy={13}>
                  with random auditing
                </tspan>
              </text>
              <text
                x={PX + 100 * sx}
                y={PY + 478 * sy}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                <tspan x={PX + 100 * sx} dy={0}>
                  Probably
                </tspan>
                <tspan x={PX + 100 * sx} dy={13}>
                  hopeless?
                </tspan>
              </text>
            </g>

            {/* The inverse-correlation arrow along the band's spine. */}
            <g className="transition-opacity duration-500" opacity={diagOn ? 1 : 0}>
              <line
                x1={PX + 500 * sx}
                y1={PY + 400 * sy}
                x2={PX + 90 * sx}
                y2={PY + 125 * sy}
                className="stroke-amber-600 dark:stroke-amber-400"
                strokeWidth={2}
                strokeDasharray="6 5"
                markerEnd="url(#hsg-diag)"
              />
              <text
                x={PX + 330 * sx}
                y={PY + 210 * sy}
                textAnchor="middle"
                className="fill-amber-700 text-[10px] font-medium dark:fill-amber-400"
              >
                <tspan x={PX + 330 * sx} dy={0}>
                  fewer actions →
                </tspan>
                <tspan x={PX + 330 * sx} dy={13}>
                  bigger, more incriminating actions
                </tspan>
              </text>
            </g>

            {/* Axes */}
            <line
              x1={PX - 12}
              y1={PY + PH}
              x2={PX - 12}
              y2={PY - 4}
              className="stroke-muted-foreground"
              strokeWidth={1.75}
              markerEnd="url(#hsg-axis)"
            />
            <line
              x1={PX - 12}
              y1={PY + PH + 12}
              x2={PX + PW + 10}
              y2={PY + PH + 12}
              className="stroke-muted-foreground"
              strokeWidth={1.75}
              markerEnd="url(#hsg-axis)"
            />
            <text
              x={PX - 22}
              y={PY + PH / 2}
              transform={`rotate(-90 ${PX - 22} ${PY + PH / 2})`}
              textAnchor="middle"
              className="fill-foreground text-[12px] font-medium"
            >
              How incriminating is each action?
            </text>
            <text
              x={PX + PW / 2}
              y={PY + PH + 34}
              textAnchor="middle"
              className="fill-foreground text-[12px] font-medium"
            >
              Number of actions to cause catastrophe
            </text>
          </svg>
        );
      }}
    </SlideStepper>
  );
}
