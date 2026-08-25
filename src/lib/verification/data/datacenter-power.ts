export const DCP_META = {
  pulled: "2026-07-13",
  facilities: 72,
  totalMW: 11157,
  usMW: 10092,
  live: "https://epoch.ai/data/ai-data-centers",
};

export interface DcpFacility {
  id: string;
  name: string;
  mw: number;
  note: string;
}

export const DCP_FACILITIES: DcpFacility[] = [
  {
    id: "colossus2",
    name: "Colossus 2 (xAI)",
    mw: 946,
    note: "Memphis, TN — the largest current draw in the database",
  },
  {
    id: "carlisle",
    name: "Anthropic–Amazon New Carlisle",
    mw: 910,
    note: "Indiana campus",
  },
  {
    id: "fairwater",
    name: "Microsoft Fairwater Atlanta",
    mw: 636,
    note: "Georgia",
  },
  { id: "prometheus", name: "Meta Prometheus", mw: 631, note: "Ohio" },
  {
    id: "abilene",
    name: "OpenAI Stargate Abilene",
    mw: 421,
    note: "Texas — Oracle-built",
  },
  {
    id: "h100k",
    name: "Reference: 100k-H100 cluster",
    mw: 130,
    note: "the module's Fermi-bench unit: 100,000 × ~1.3 kW",
  },
];

export interface DcpCountry {
  name: string;
  gw: number;
  twh: number;
  dc: string;
  us?: boolean;
}

export const DCP_COUNTRIES: DcpCountry[] = [
  { name: "Malta", gw: 0.33, twh: 2.9, dc: "no tracked AI datacentres" },
  { name: "Luxembourg", gw: 0.72, twh: 6.3, dc: "no tracked AI datacentres" },
  { name: "Latvia", gw: 0.84, twh: 7.4, dc: "no tracked AI datacentres" },
  { name: "Estonia", gw: 0.94, twh: 8.2, dc: "no tracked AI datacentres" },
  { name: "Lithuania", gw: 1.47, twh: 12.9, dc: "no tracked AI datacentres" },
  { name: "Slovenia", gw: 1.54, twh: 13.5, dc: "no tracked AI datacentres" },
  { name: "Croatia", gw: 2.1, twh: 18.4, dc: "no tracked AI datacentres" },
  {
    name: "Iceland",
    gw: 2.2,
    twh: 19.5,
    dc: "grid dominated by aluminium smelters — the comparable-load case MIRI Appendix D names",
  },
  {
    name: "Ireland",
    gw: 3.8,
    twh: 33.3,
    dc: "datacentres already take ~20% of national electricity — the canonical visible-in-the-grid case",
  },
  { name: "Denmark", gw: 4.0, twh: 35.0, dc: "hyperscale cloud presence" },
  {
    name: "Portugal",
    gw: 5.7,
    twh: 50.0,
    dc: "33 MW of tracked AI capacity (Epoch)",
  },
  {
    name: "Netherlands",
    gw: 12.9,
    twh: 113,
    dc: "major cloud hub; AI buildout constrained by grid caps",
  },
];

export const DCP_BIG_GRIDS: DcpCountry[] = [
  { name: "Poland", gw: 19.2, twh: 168, dc: "no tracked AI datacentres" },
  { name: "France", gw: 52.5, twh: 460, dc: "nuclear-heavy grid; announced AI campuses" },
  { name: "Germany", gw: 58.2, twh: 510, dc: "largest EU grid" },
  {
    name: "United States",
    gw: 487,
    twh: 4270,
    dc: "~10.1 GW of tracked AI datacentre draw — 90% of the world total (Epoch)",
    us: true,
  },
];

export const DCP_LOAD = {
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ],
  training: [
    0.97, 0.98, 0.97, 0.98, 0.98, 0.97, 0.98, 0.97, 0.98, 0.98, 0.97, 0.98,
    0.98, 0.97, 0.98, 0.98, 0.97, 0.98, 0.97, 0.98, 0.98, 0.97, 0.98, 0.97,
  ],
  inference: [
    0.42, 0.36, 0.32, 0.3, 0.31, 0.35, 0.44, 0.56, 0.7, 0.82, 0.9, 0.95, 0.97,
    1.0, 0.98, 0.95, 0.93, 0.9, 0.88, 0.85, 0.78, 0.68, 0.57, 0.48,
  ],
};

export const DCP_DECAY = { startYear: 2025, startMW: 130, ratePerYear: 1.6, years: 6 };
