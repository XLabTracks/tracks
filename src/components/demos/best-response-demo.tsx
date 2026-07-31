"use client";

import { type CSSProperties, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_LEVERS, type Levers, bestResponse, attackRate } from "@/lib/control-model";

// Stage 10: the red team plays a best response. Its strategy is two numbers —
// how selective to be about opportunities (attack rate) and how subtle to make
// each backdoor (sigma). The heatmap is P(red wins) over that strategy plane;
// the ring marks the argmax the control evaluation grades against. Moving the
// audit budget recomputes everything live, so the red team's best strategy
// visibly migrates — you are never grading against a fixed adversary.
//
// Defer is OFF for now (per Arya 2026-07-23): d is pinned to b, a zero-width
// band, and the defer slider is removed — c-game hasn't introduced deferring at
// this point. Restore the second slider when the walkthrough §3.3 docking (or a
// later c-game defer section) needs the ring-migration story.
//
// The heatmap is painted on a <canvas>, one fill per grid cell at the FULL
// search resolution (BR_GSTAR_STEPS x BR_SIGMA_STEPS). It used to be SVG rects
// subsampled 2x in each axis to keep the React tree small; the model's row-sweep
// search (one opportunity-grid pass per sigma) made the finer grid cheap enough
// to draw every cell, and a canvas draws ~11.5k of them without a React tree at
// all. The SVG on top still owns the frame, the best-response ring, and the
// axis labels.

const W = 300;
const H = 240;
const M = { top: 12, right: 14, bottom: 30, left: 34 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

// The canvas is absolutely positioned over the SVG's plot area. The SVG has a
// viewBox and width:100% with no height, so it always lays out at exactly the
// W:H aspect ratio — which makes the plot rectangle a fixed FRACTION of the
// wrapper, expressible in percentages that hold at every container width.
// (The SVG must be `block`: an inline SVG adds baseline descender space below
// itself, which would make the wrapper taller than the viewBox and shift these.)
const PLOT_BOX: CSSProperties = {
  left: `${(M.left / W) * 100}%`,
  top: `${(M.top / H) * 100}%`,
  width: `${(PW / W) * 100}%`,
  height: `${(PH / H) * 100}%`,
};

export function BestResponseDemo() {
  const [b, setB] = useState(0.02);

  // The slider tracks urgently; the heatmap's best-response search (~3ms)
  // recomputes against the deferred value so drags stay smooth.
  const bSlow = useDeferredValue(b);

  const levers: Levers = useMemo(
    () => ({ ...DEFAULT_LEVERS, b: bSlow, d: bSlow, red: { mode: "best", gStar: 0, sigma: 0 } }),
    [bSlow],
  );

  const br = useMemo(() => bestResponse(levers), [levers]);

  // Fixed color scale, anchored at the slider's MINIMUM budget (the red team's
  // best case). Normalizing each frame to its own max — as this used to —
  // pinned the brightest cell at full intensity for every b, so dragging the
  // budget only reshuffled the shape while the overall heat looked constant.
  // Against a fixed scale, raising the budget visibly drains color out of the
  // whole plane, which is the point of the lever.
  const scaleMax = useMemo(() => {
    const bMin = 0.005; // keep in sync with the slider's min (5 / 1000)
    const worst = bestResponse({
      ...DEFAULT_LEVERS,
      b: bMin,
      d: bMin,
      red: { mode: "best", gStar: 0, sigma: 0 },
    });
    return Math.max(1e-9, worst.result.pRedWin);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Paint imperatively: no per-cell React node, no SSR output (so no hydration
  // mismatch from raw floats), and the backing store is sized in DEVICE pixels
  // so cells stay crisp on retina displays.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { gStars, sigmas, pRedWin } = br.grid;

    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = window.devicePixelRatio || 1;
      const bw = Math.max(1, Math.round(rect.width * dpr));
      const bh = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== bw) canvas.width = bw;
      if (canvas.height !== bh) canvas.height = bh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, bw, bh);
      // `color: var(--primary)` on the element, read back resolved — canvas
      // fillStyle can't take a CSS variable, and this survives token changes.
      ctx.fillStyle = getComputedStyle(canvas).color;

      const nCols = gStars.length;
      const nRows = sigmas.length;
      const cw = bw / nCols;
      const ch = bh / nRows;
      for (let j = 0; j < nRows; j++) {
        // sigma grows upward, so row j sits ch above row j-1 from the bottom.
        const yT = Math.round(bh - (j + 1) * ch);
        const yB = Math.round(bh - j * ch);
        const row = pRedWin[j];
        for (let i = 0; i < nCols; i++) {
          // Gamma 0.7 lifts the mid-range so the map keeps visible structure
          // once large budgets have drained it, without giving up the
          // budget-to-budget contrast the fixed scale exists for.
          const a = Math.min(1, Math.pow(row[i] / scaleMax, 0.7) * 0.95);
          if (a <= 0.002) continue; // below one 8-bit alpha step — invisible
          const xL = Math.round(i * cw);
          const xR = Math.round((i + 1) * cw);
          ctx.globalAlpha = a;
          // Integer edges shared between neighbours: exact tiling, no seams.
          ctx.fillRect(xL, yT, Math.max(1, xR - xL), Math.max(1, yB - yT));
        }
      }
      ctx.globalAlpha = 1;
    };

    paint();
    // Repaint on resize so the backing store matches the new CSS size (the
    // canvas is percentage-sized, so it would otherwise stretch and blur).
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [br, scaleMax]);

  // Round every rendered number: transcendental math (Math.exp/log in the model)
  // is not bit-identical between the server's V8 and the browser's V8, and raw
  // floats in SVG attributes would otherwise trip a hydration mismatch. (The
  // heatmap cells are exempt — they never render on the server.)
  const r1 = (x: number) => Number(x.toFixed(1));
  const clampX = (x: number) => Math.min(M.left + PW - 4, Math.max(M.left + 4, x));
  const clampY = (y: number) => Math.min(M.top + PH - 4, Math.max(M.top + 4, y));

  const safety = 1 - br.result.pRedWin;
  const rate = attackRate(br.red.gStar);
  const lastGStar = br.grid.gStars[br.grid.gStars.length - 1] || 1;
  const ringX = r1(clampX(M.left + (br.red.gStar / lastGStar) * PW));
  const ringY = r1(clampY(M.top + PH - br.red.sigma * PH));

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Audit budget (b)</span>
          <span className="font-medium tabular-nums">{(b * 100).toFixed(1)}%</span>
        </label>
        <input
          type="range"
          min={5}
          max={80}
          step={1}
          value={b * 1000}
          onChange={(e) => setB(Number(e.target.value) / 1000)}
          className="accent-primary w-full"
          aria-label="Audit budget"
        />
      </div>

      <div className="mx-auto w-full max-w-sm">
        <p className="text-muted-foreground mb-1 text-center text-xs font-medium">
          Red team win probability over its strategy
        </p>
        <div className="relative">
          {/* heatmap — decorative; the SVG below carries the figure's label */}
          <canvas
            ref={canvasRef}
            className="text-primary absolute"
            style={PLOT_BOX}
            aria-hidden="true"
          />
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="relative block w-full"
            role="img"
            aria-label="Red-team best-response heatmap"
          >
            {/* frame */}
            <rect x={M.left} y={M.top} width={PW} height={PH} fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.6} />
            {/* best-response marker (clamped just inside the frame so it stays
                fully visible at the corners). White reads against the dark
                heatmap, but the scale is fixed across budgets, so at high
                budgets the plane bleaches toward white and a bare white ring
                disappears — hence the dark casing painted underneath, wider on
                both sides of the white stroke. */}
            <circle cx={ringX} cy={ringY} r={4.5} fill="none" stroke="var(--foreground)" strokeWidth={3.5} strokeOpacity={0.7} />
            <circle cx={ringX} cy={ringY} r={4.5} fill="none" stroke="#fff" strokeWidth={2} />
            {/* axis labels */}
            <text x={M.left} y={H - 16} fontSize={8} fill="var(--muted-foreground)">
              attack often
            </text>
            <text x={W - M.right} y={H - 16} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
              attack rarely
            </text>
            <text x={M.left + PW / 2} y={H - 5} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">
              opportunity cutoff g* &rarr;
            </text>
            <text
              x={11}
              y={M.top + PH / 2}
              fontSize={8}
              fill="var(--muted-foreground)"
              textAnchor="middle"
              transform={`rotate(-90 11 ${M.top + PH / 2})`}
            >
              subtlety &rarr;
            </text>
          </svg>
        </div>
        <p className="text-muted-foreground mt-1 text-center text-xs">
          Darker = higher red win, on a scale fixed across budgets — raising the budget visibly bleaches the plane. The ring is the red team&rsquo;s best response.
        </p>
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Safety (vs best response)</p>
          <p className="font-semibold tabular-nums">{(safety * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Red attacks</p>
          <p className="font-semibold tabular-nums">{(rate * 100).toFixed(1)}% of problems</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Best subtlety</p>
          <p className="font-semibold tabular-nums">{br.red.sigma.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
