
export type CostLevel = "low" | "med" | "high";

export type PolicyKind = "transparency" | "restriction";

export interface PlotPolicy {
  id: string;
  name: string;
  kind: PolicyKind;
  baseline: number;
  verified: number;
  effect: number;
  costs: [CostLevel, CostLevel, CostLevel, CostLevel];
}

export const COST_DIMENSIONS = [
  "cost to comply",
  "cost to verify",
  "progress foregone",
  "exposure if cheated",
] as const;

export const POLICY_PLOT_COPY = {
  toggle: "verification regime in place",
  reset: "reset",
  yAxis: "risk reduction if followed",
  xAxis: "political feasibility",
  low: "low",
  high: "high",
  target: "target corner",
  transparency: "transparency measures",
  restriction: "restriction rules",
  hint: "drag points, click one to inspect",
  costLead: "cost sketch: ",
} as const;

export const PLOT_POLICIES: PlotPolicy[] = [
  {
    id: "vol",
    name: "voluntary pledges",
    kind: "transparency",
    baseline: 85,
    verified: 88,
    effect: 15,
    costs: ["low", "low", "low", "high"],
  },
  {
    id: "kyc",
    name: "reporting and KYC",
    kind: "transparency",
    baseline: 70,
    verified: 80,
    effect: 30,
    costs: ["med", "med", "low", "med"],
  },
  {
    id: "cap",
    name: "compute cap",
    kind: "restriction",
    baseline: 40,
    verified: 65,
    effect: 60,
    costs: ["med", "med", "med", "high"],
  },
  {
    id: "pause",
    name: "pause above threshold",
    kind: "restriction",
    baseline: 25,
    verified: 55,
    effect: 75,
    costs: ["high", "high", "med", "high"],
  },
  {
    id: "stop",
    name: "indefinite stop",
    kind: "restriction",
    baseline: 10,
    verified: 35,
    effect: 88,
    costs: ["high", "high", "high", "high"],
  },
];
