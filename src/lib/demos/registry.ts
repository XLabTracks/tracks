import type { DemoDefinition } from "./types";
import { SliderDemo, TradeoffDemo } from "@/components/demos/example-demos";

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
};

export function getDemo(id: string): DemoDefinition | undefined {
  return demoRegistry[id];
}

export function listDemos(): DemoDefinition[] {
  return Object.values(demoRegistry);
}
