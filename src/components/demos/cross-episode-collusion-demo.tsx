"use client";

// Cross-episode collusion: three episode boxes left-to-right, each holding
// one instance node, with a curved dashed message arrow from each instance
// to the next episode's instance. A bracket underneath spans all three,
// labeled with the lesson's own timescale claim. Caption restates the
// lesson's own bracket sentence (ROTE section, collusion risk vector).

const CAPTION =
  "Another risk vector is collusion across episodes, which can effectively lengthen the timescale and allow for disempowerment as well.";

const EPISODES = [
  { x: 40, label: "Episode 1" },
  { x: 280, label: "Episode 2" },
  { x: 520, label: "Episode 3" },
];

export function CrossEpisodeCollusionDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 720 320"
        role="img"
        aria-label="Three episode boxes in sequence, each with an instance node; a dashed message arrow runs from each instance to the next episode's instance, with a bracket underneath spanning all three labeled 'effectively lengthens the timescale'."
        className="w-full"
      >
        <defs>
          <marker
            id="cec-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-amber-500" />
          </marker>
        </defs>

        {EPISODES.map((episode) => (
          <g key={episode.label}>
            <rect
              x={episode.x}
              y={30}
              width={160}
              height={140}
              rx={10}
              className="fill-card stroke-border"
              strokeWidth={1.5}
            />
            <text
              x={episode.x + 80}
              y={56}
              textAnchor="middle"
              className="fill-foreground text-[12px] font-semibold"
            >
              {episode.label}
            </text>
            <rect
              x={episode.x + 40}
              y={80}
              width={80}
              height={50}
              rx={8}
              className="fill-muted stroke-border"
              strokeWidth={1.5}
            />
            <text
              x={episode.x + 80}
              y={110}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-medium"
            >
              Instance
            </text>
          </g>
        ))}

        {/* Message arrow: Episode 1 instance -> Episode 2 instance */}
        <path
          d="M 200 105 C 235 60, 245 60, 280 105"
          fill="none"
          className="stroke-amber-500"
          strokeWidth={2}
          strokeDasharray="5 4"
          markerEnd="url(#cec-arrow)"
        />
        <text
          x={240}
          y={58}
          textAnchor="middle"
          className="fill-amber-700 text-[9px] font-medium dark:fill-amber-400"
        >
          message
        </text>

        {/* Message arrow: Episode 2 instance -> Episode 3 instance */}
        <path
          d="M 440 105 C 475 60, 485 60, 520 105"
          fill="none"
          className="stroke-amber-500"
          strokeWidth={2}
          strokeDasharray="5 4"
          markerEnd="url(#cec-arrow)"
        />
        <text
          x={480}
          y={58}
          textAnchor="middle"
          className="fill-amber-700 text-[9px] font-medium dark:fill-amber-400"
        >
          message
        </text>

        {/* Bracket spanning all three episodes */}
        <path
          d="M 40 200 L 40 215 L 680 215 L 680 200"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth={1.5}
        />
        <text
          x={360}
          y={240}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-medium"
        >
          effectively lengthens the timescale
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-sm">{CAPTION}</figcaption>
    </figure>
  );
}
