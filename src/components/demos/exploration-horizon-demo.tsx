"use client";

// Exploration horizon and covert misalignment: two side-by-side panels
// sharing one SVG. Left panel shows limited exploration converging to a
// small, easily-noticed region of misalignment; right panel shows
// longer-horizon RL opening a much larger exploration space that can
// converge to a more covert form. Caption restates the lesson's own
// bracket sentence (ROTE section).

const CAPTION =
  "When given limited exploration, the model converges to simple, detectable misalignment. But when given longer-horizon RL, there is more space for exploration, which can converge to a more covert, malignant misalignment.";

export function ExplorationHorizonDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 720 320"
        role="img"
        aria-label="Two panels: limited exploration converges to a small region of simple, detectable misalignment; longer-horizon RL opens a much larger exploration space that converges to a more covert, malignant misalignment."
        className="w-full"
      >
        {/* Left panel: Limited exploration */}
        <rect
          x={20}
          y={20}
          width={320}
          height={280}
          rx={10}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={180}
          y={46}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          Limited exploration
        </text>

        {/* Outer outcome space */}
        <rect
          x={50}
          y={64}
          width={260}
          height={190}
          rx={8}
          className="fill-transparent stroke-muted-foreground"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Small shaded region within it */}
        <rect
          x={140}
          y={130}
          width={80}
          height={60}
          rx={6}
          className="fill-muted"
        />

        {/* Converging dot */}
        <circle cx={180} cy={160} r={7} className="fill-amber-500" />

        <text
          x={180}
          y={275}
          textAnchor="middle"
          className="fill-amber-700 text-[10px] font-medium dark:fill-amber-400"
        >
          simple, detectable misalignment
        </text>

        {/* Right panel: Longer-horizon RL */}
        <rect
          x={380}
          y={20}
          width={320}
          height={280}
          rx={10}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={540}
          y={46}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          Longer-horizon RL
        </text>

        {/* Outer outcome space, same size as left panel's */}
        <rect
          x={410}
          y={64}
          width={260}
          height={190}
          rx={8}
          className="fill-transparent stroke-muted-foreground"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Much larger shaded region, filling most of the space */}
        <rect
          x={420}
          y={74}
          width={240}
          height={170}
          rx={8}
          className="fill-muted"
        />

        {/* Converging dot */}
        <circle cx={540} cy={159} r={7} className="fill-red-500" />

        <text
          x={540}
          y={275}
          textAnchor="middle"
          className="fill-red-700 text-[10px] font-medium dark:fill-red-400"
        >
          more covert, malignant misalignment
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-sm">{CAPTION}</figcaption>
    </figure>
  );
}
