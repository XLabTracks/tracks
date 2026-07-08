import type { DemoDefinition } from "./types";
import { SliderDemo, TradeoffDemo } from "@/components/demos/example-demos";
import { AuditTradeoffDemo } from "@/components/demos/audit-tradeoff-demo";
import { MonitorRocDemo } from "@/components/demos/monitor-roc-demo";
import { FrontierDemo } from "@/components/demos/frontier-demo";

// Central demo registry — the single integration point. Reference a demo by ID
// from MDX (<Demo id="…"/>), the gallery, standalone pages, or embeds.
export const demoRegistry: Record<string, DemoDefinition> = {
  "parameter-slider": {
    id: "parameter-slider",
    title: "Parameter slider",
    description: "Example demo — drag the slider and the output updates live.",
    component: SliderDemo,
    tags: ["example"],
  },
  tradeoff: {
    id: "tradeoff",
    title: "Trade-off explorer",
    description: "Example demo — balance two levers and watch the score change.",
    component: TradeoffDemo,
    tags: ["example"],
  },
  "audit-tradeoff": {
    id: "audit-tradeoff",
    title: "Upfront auditing: the audit/attack-rate tradeoff",
    description:
      "Drag the auditing proportion and watch the red team's optimal attack rate, expected backdoor attempts, and the blue team's win probability update live — reproducing Figure 3.",
    component: AuditTradeoffDemo,
    tags: ["control", "ai-control-paper"],
  },
  "monitor-roc": {
    id: "monitor-roc",
    title: "The monitor as a noisy classifier: ROC & AUC",
    description:
      "Model the trusted monitor's suspicion scores as two overlapping distributions. Drag its quality to see the ROC curve, AUC, and how many backdoors slip past a fixed 2% false-positive threshold.",
    component: MonitorRocDemo,
    tags: ["control", "ai-control-paper"],
  },
  "safety-usefulness-frontier": {
    id: "safety-usefulness-frontier",
    title: "The safety/usefulness frontier",
    description:
      "Every protocol from Table 8 plotted as safety vs usefulness. Hover a point, isolate a method family, and highlight the Pareto frontier of protocols not beaten on both axes at once.",
    component: FrontierDemo,
    tags: ["control", "ai-control-paper"],
  },
};

export function getDemo(id: string): DemoDefinition | undefined {
  return demoRegistry[id];
}

export function listDemos(): DemoDefinition[] {
  return Object.values(demoRegistry);
}
