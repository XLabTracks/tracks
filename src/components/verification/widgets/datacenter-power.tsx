"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  DCP_BIG_GRIDS,
  DCP_COUNTRIES,
  DCP_DECAY,
  DCP_FACILITIES,
  DCP_LOAD,
  DCP_META,
} from "@/lib/verification/data/datacenter-power";

const CHART_W = 720;

export function DatacenterPower() {
  const [facilityId, setFacilityId] = useState(DCP_FACILITIES[0]!.id);
  const facility =
    DCP_FACILITIES.find((f) => f.id === facilityId) ?? DCP_FACILITIES[0]!;
  const facilityGw = facility.mw / 1000;
  const maxGw = DCP_COUNTRIES[DCP_COUNTRIES.length - 1]!.gw;
  const barW = (gw: number) => Math.max(2, (gw / maxGw) * (CHART_W - 220));

  return (
    <div className="not-prose my-6 space-y-6">
      <div className="border-border bg-card rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">The energy signature, in numbers</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          A frontier campus draws like a small country. Drop a real facility
          into a lineup of national grids: each bar is a country’s average
          continuous electricity draw, and the marker is the facility you
          picked. Then look at what a watcher can and cannot read off that
          draw — the load shape — and how fast the whole signature is
          shrinking.
        </p>
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">Pick a facility</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DCP_FACILITIES.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={f.id === facilityId}
              onClick={() => setFacilityId(f.id)}
              className={cn(
                "border-border rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                f.id === facilityId
                  ? "border-primary bg-primary/10 font-medium"
                  : "hover:bg-muted",
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {facility.name}: {facility.mw} MW — {facility.note}.
        </p>

        <div className="mt-3 overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_W} ${DCP_COUNTRIES.length * 26 + 30}`}
            className="min-w-[560px]"
            role="img"
            aria-label={`Average continuous national electricity draw for twelve smaller grids, with ${facility.name} at ${facility.mw} megawatts marked against them.`}
          >
            {DCP_COUNTRIES.map((c, i) => {
              const y = i * 26 + 8;
              const outdrawn = facilityGw >= c.gw;
              return (
                <g key={c.name}>
                  <text
                    x={130}
                    y={y + 11}
                    textAnchor="end"
                    className="fill-foreground"
                    style={{ fontSize: 11 }}
                  >
                    {c.name}
                  </text>
                  <rect
                    x={140}
                    y={y}
                    width={barW(c.gw)}
                    height={14}
                    rx={3}
                    className={outdrawn ? "fill-amber-500" : "fill-muted-foreground"}
                    opacity={outdrawn ? 0.85 : 0.45}
                  />
                  <text
                    x={144 + barW(c.gw)}
                    y={y + 11}
                    className="fill-muted-foreground"
                    style={{ fontSize: 10 }}
                  >
                    {c.gw.toFixed(2)} GW
                  </text>
                </g>
              );
            })}
            <line
              x1={140 + barW(facilityGw)}
              y1={2}
              x2={140 + barW(facilityGw)}
              y2={DCP_COUNTRIES.length * 26 + 6}
              className="stroke-primary"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            <text
              x={146 + barW(facilityGw)}
              y={DCP_COUNTRIES.length * 26 + 18}
              className="fill-primary"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {facility.name} · {(facilityGw).toFixed(2)} GW
            </text>
          </svg>
        </div>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          Amber bars are grids the selected facility out-draws. Off this chart:
          Poland {DCP_BIG_GRIDS[0]!.gw} GW, France {DCP_BIG_GRIDS[1]!.gw} GW,
          Germany {DCP_BIG_GRIDS[2]!.gw} GW, United States {DCP_BIG_GRIDS[3]!.gw}{" "}
          GW — where {DCP_META.usMW / 1000 >= 10 ? "~10.1" : ""} GW of tracked AI
          datacentre draw already sits (90% of the world total). Ireland is the
          canonical visible-in-the-grid case — datacentres already take ~20% of
          national electricity; Iceland’s smelter-dominated grid is the
          comparable-load case MIRI’s Appendix D names.
        </p>
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">What the draw looks like over a day</p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          Stylised load shapes, not measured traces — the point is the shape.
          Training holds a narrow band around the clock; inference follows
          human demand. A flat line at constant temperature is the thing the
          thermal card watches for.
        </p>
        <div className="mt-3 overflow-x-auto">
          <svg
            viewBox="0 0 720 180"
            className="min-w-[560px]"
            role="img"
            aria-label="Two 24-hour load curves: training holds a flat band near full power all day; inference rises through the morning, peaks in the afternoon, and falls overnight."
          >
            <line x1={40} y1={150} x2={700} y2={150} className="stroke-border" />
            <line x1={40} y1={20} x2={40} y2={150} className="stroke-border" />
            {[0, 6, 12, 18, 23].map((h) => (
              <text
                key={h}
                x={40 + (h / 23) * 650}
                y={165}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 10 }}
              >
                {h}:00
              </text>
            ))}
            <polyline
              fill="none"
              className="stroke-amber-500"
              strokeWidth={2.5}
              points={DCP_LOAD.hours
                .map(
                  (h, i) =>
                    `${40 + (h / 23) * 650},${150 - DCP_LOAD.training[i]! * 120}`,
                )
                .join(" ")}
            />
            <polyline
              fill="none"
              className="stroke-sky-600"
              strokeWidth={2.5}
              points={DCP_LOAD.hours
                .map(
                  (h, i) =>
                    `${40 + (h / 23) * 650},${150 - DCP_LOAD.inference[i]! * 120}`,
                )
                .join(" ")}
            />
            <text x={46} y={34} className="fill-amber-500" style={{ fontSize: 11, fontWeight: 600 }}>
              training — flat, around the clock
            </text>
            <text x={46} y={96} className="fill-sky-600" style={{ fontSize: 11, fontWeight: 600 }}>
              inference — follows human demand
            </text>
          </svg>
        </div>
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">The decay clock</p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          Performance-per-watt improves about {DCP_DECAY.ratePerYear}× a year,
          so the power a fixed training workload needs shrinks annually. The
          same workload that draws {DCP_DECAY.startMW} MW in{" "}
          {DCP_DECAY.startYear}:
        </p>
        <div className="mt-3 overflow-x-auto">
          <svg
            viewBox="0 0 720 150"
            className="min-w-[560px]"
            role="img"
            aria-label={`Bars shrinking year by year: a workload drawing ${DCP_DECAY.startMW} megawatts in ${DCP_DECAY.startYear} needs under 15 megawatts six years later at a 1.6 times yearly efficiency gain.`}
          >
            {Array.from({ length: DCP_DECAY.years + 1 }, (_, i) => {
              const mw = DCP_DECAY.startMW / Math.pow(DCP_DECAY.ratePerYear, i);
              const h = (mw / DCP_DECAY.startMW) * 100;
              const x = 40 + i * 96;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={120 - h}
                    width={56}
                    height={h}
                    rx={3}
                    className="fill-primary"
                    opacity={0.85 - i * 0.08}
                  />
                  <text
                    x={x + 28}
                    y={114 - h}
                    textAnchor="middle"
                    className="fill-foreground"
                    style={{ fontSize: 10, fontWeight: 600 }}
                  >
                    {mw >= 10 ? Math.round(mw) : mw.toFixed(1)} MW
                  </text>
                  <text
                    x={x + 28}
                    y={136}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    style={{ fontSize: 10 }}
                  >
                    {DCP_DECAY.startYear + i}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          Six years in, the same run hides under 15 MW — below the ~10 MW
          haystack floor is within sight. “Below threshold” is a date, not a
          fact, and the energy signature is the module’s most perishable tool.
        </p>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">
        Facility figures:{" "}
        <a
          className="text-link underline underline-offset-4"
          href={DCP_META.live}
          target="_blank"
          rel="noreferrer"
        >
          Epoch AI, AI Data Centers
        </a>{" "}
        (open database; CSV pulled {DCP_META.pulled} — {DCP_META.facilities}{" "}
        tracked facilities, ~{(DCP_META.totalMW / 1000).toFixed(1)} GW current
        draw). Country figures: 2023 national electricity consumption
        (Ember/IEA yearbooks, approximate), converted to average continuous
        draw (TWh/yr ÷ 8.76 ≈ GW). Load shapes are stylised; the decay rate is
        the Epoch performance-per-watt trend as cited by Scher and Thiergart.
      </p>
    </div>
  );
}
