"use client";

// The basic trade case for satiation: developers give the AI money or space
// to maximize its reward, in exchange for misalignment examples / apparent
// cooperation. Caption restates the lesson's own sentence on why this is
// only reasonable when the AI is easily satiable.

const FOOTNOTE = "Only reasonable if they're easily satiable.";

export function SatiationTradeDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 640 220"
        role="img"
        aria-label="The basic trade case: developers give the AI money or space to maximize its reward, in exchange for misalignment examples and apparent cooperation."
        className="w-full"
      >
        <defs>
          <marker
            id="st-arrow-emerald"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-emerald-500" />
          </marker>
          <marker
            id="st-arrow-amber"
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

        {/* Developers node, left */}
        <rect
          x={20}
          y={78}
          width={160}
          height={50}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={100}
          y={108}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          Developers
        </text>

        {/* AI node, right */}
        <rect
          x={460}
          y={78}
          width={160}
          height={50}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={540}
          y={108}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          AI
        </text>

        {/* Top arrow: developers -> AI, money or space */}
        <path
          d="M 180 88 L 456 88"
          fill="none"
          className="stroke-emerald-500"
          strokeWidth={2}
          markerEnd="url(#st-arrow-emerald)"
        />
        <text
          x={330}
          y={72}
          textAnchor="middle"
          className="fill-emerald-700 text-[10px] font-medium dark:fill-emerald-400"
        >
          money or space to maximize their reward
        </text>

        {/* Bottom arrow: AI -> developers, misalignment examples */}
        <path
          d="M 456 118 L 180 118"
          fill="none"
          className="stroke-amber-500"
          strokeWidth={2}
          markerEnd="url(#st-arrow-amber)"
        />
        <text
          x={330}
          y={146}
          textAnchor="middle"
          className="fill-amber-700 text-[10px] font-medium dark:fill-amber-400"
        >
          <tspan x={330} dy={0}>
            misalignment examples /
          </tspan>
          <tspan x={330} dy={13}>
            apparent cooperation
          </tspan>
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-sm">{FOOTNOTE}</figcaption>
    </figure>
  );
}
