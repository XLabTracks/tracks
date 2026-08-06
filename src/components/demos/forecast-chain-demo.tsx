"use client";

// Chained short-term forecasts, static: a long measurement horizon bar sits
// above a chain of short forecast boxes f1 -> f2 -> f3 -> f4, each covering
// a short span, linked by arrows, with the chain's combined span bracketed
// to match the long horizon. Caption restates the lesson's own sentence
// (Long-term measurements bullet, "How?" section).

export function ForecastChainDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 720 220"
        role="img"
        aria-label="A long measurement horizon bar above a chain of four short-term forecasts, f1 through f4, each linked by an arrow to the next; a bracket shows the chained forecasts' combined span matching the long horizon."
        className="w-full"
      >
        <defs>
          <marker
            id="fc-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* Long horizon bar, top */}
        <rect
          x={40}
          y={24}
          width={640}
          height={36}
          rx={6}
          className="fill-primary/10 stroke-primary"
          strokeWidth={1.5}
        />
        <text
          x={360}
          y={47}
          textAnchor="middle"
          className="fill-primary text-[12px] font-semibold"
        >
          long-term measurement horizon
        </text>

        {/* Vertical guide lines from the horizon down to the bracket */}
        <path
          d="M 40 60 L 40 150"
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <path
          d="M 680 60 L 680 150"
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {/* Chain of four short forecast boxes */}
        {[
          { x: 40, label: "f₁" },
          { x: 200, label: "f₂" },
          { x: 360, label: "f₃" },
          { x: 520, label: "f₄" },
        ].map((box, i) => (
          <g key={box.label}>
            <rect
              x={box.x}
              y={90}
              width={140}
              height={40}
              rx={6}
              className="fill-card stroke-border"
              strokeWidth={1.5}
            />
            <text
              x={box.x + 70}
              y={107}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-semibold"
            >
              {box.label}
            </text>
            <text
              x={box.x + 70}
              y={121}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              short-term forecast
            </text>
            {i < 3 && (
              <path
                d={`M ${box.x + 140} 110 L ${box.x + 160} 110`}
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                markerEnd="url(#fc-arrow)"
                fill="none"
              />
            )}
          </g>
        ))}

        {/* Bracket beneath the chain spanning its combined width */}
        <path
          d="M 40 150 L 40 160 L 680 160 L 680 150"
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          fill="none"
        />
        <text
          x={360}
          y={180}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-medium"
        >
          chained: objectives beyond immediate reward
        </text>
      </svg>
    </figure>
  );
}
