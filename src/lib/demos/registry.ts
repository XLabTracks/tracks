import type { DemoDefinition } from "./types";
import { SliderDemo, TradeoffDemo } from "@/components/demos/example-demos";
import { AuditTradeoffDemo } from "@/components/demos/audit-tradeoff-demo";
import { MonitorRocDemo } from "@/components/demos/monitor-roc-demo";
import { FrontierDemo } from "@/components/demos/frontier-demo";
import { MonitorTailsDemo } from "@/components/demos/monitor-tails-demo";
import { MonitorTailsRocDemo } from "@/components/demos/monitor-tails-roc-demo";
import { BestResponseDemo } from "@/components/demos/best-response-demo";
import { RaceDemo } from "@/components/demos/race-demo";
import { RacePaperDemo } from "@/components/demos/race-paper-demo";
import { AttackRateDemo } from "@/components/demos/attack-rate-demo";
import { SubtletyDemo } from "@/components/demos/subtlety-demo";
import { DeferDemo } from "@/components/demos/defer-demo";
import { ControlDashboardDemo } from "@/components/demos/control-dashboard-demo";
import { SabotageFrontierDemo } from "@/components/demos/sabotage-frontier-demo";
import { AdditiveControlDemo } from "@/components/demos/additive-control-demo";
import { RsiBootstrapDemo } from "@/components/demos/rsi-bootstrap-demo";
import { RegimeStatesDemo } from "@/components/demos/regime-states-demo";
import { RegimeLoopDemo } from "@/components/demos/regime-loop-demo";
import { FiveWorldsDemo } from "@/components/demos/five-worlds-demo";
import { TwoGamesDemo } from "@/components/demos/two-games-demo";
import { PUnacceptableDemo } from "@/components/demos/p-unacceptable-demo";
import { TwoLeversDemo } from "@/components/demos/two-levers-demo";
import { HighStakesGraphDemo } from "@/components/demos/high-stakes-graph-demo";
import { LiveFailurePlaneDemo } from "@/components/demos/live-failure-plane-demo";
import { AgentArchitectureThreatsDemo } from "@/components/demos/agent-architecture-threats-demo";
import { DeferToResampleDemo } from "@/components/demos/defer-to-resample-demo";
import { HonestTestDemo } from "@/components/demos/honest-test-demo";
import { ForecastChainDemo } from "@/components/demos/forecast-chain-demo";
import { ExplorationHorizonDemo } from "@/components/demos/exploration-horizon-demo";
import { CrossEpisodeCollusionDemo } from "@/components/demos/cross-episode-collusion-demo";
import { DistantIncentivesDemo } from "@/components/demos/distant-incentives-demo";
import { SeekerCarouselDemo } from "@/components/demos/seeker-carousel-demo";
import { DealGainsFromTradeDemo } from "@/components/demos/deal-gains-from-trade-demo";
import { DealCoalitionRoutesDemo } from "@/components/demos/deal-coalition-routes-demo";

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
      "Drag the auditing proportion and watch the red team's optimal attack rate, expected backdoor attempts, and the blue team's win probability update live.",
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
  "monitor-tails-roc": {
    id: "monitor-tails-roc",
    title: "Two monitors, one AUC",
    description:
      "Static pre-question figure: the ROC curves of two monitors with identical AUC 0.92 cross — which is safer is ill-posed until the audit budget pins an operating point.",
    component: MonitorTailsRocDemo,
    tags: ["control", "control-game"],
  },
  "monitor-tails": {
    id: "monitor-tails",
    title: "Same number, different safety",
    description:
      "Two monitors with identical AUC but different attack-score spread. Drag the shared AUC and watch how many attacks each catches at a 2% audit budget — the tail, not the area, is what matters.",
    component: MonitorTailsDemo,
    tags: ["control", "control-game"],
  },
  "best-response": {
    id: "best-response",
    title: "The red team's best response",
    description:
      "The red team's win probability over attack rate and subtlety as a heatmap, with the best response highlighted.",
    component: BestResponseDemo,
    tags: ["control", "control-game"],
  },
  race: {
    id: "race",
    title: "Safety over a deployment: the race",
    description:
      "Drag the number of attacks and watch how per-attack odds compound over a whole deployment through the race odds and the chance any decisive event fires.",
    component: RaceDemo,
    tags: ["control", "control-game"],
  },
  "race-paper": {
    id: "race-paper",
    title: "Safety over a deployment",
    description:
      "Per-attack odds compound over a whole deployment, run directly on the paper's contingency-table odds (caught 33.8%, successfully deployed 18.3%). Drag the number of attacks and watch the two factors of the red team's win probability climb toward the ceiling.",
    component: RacePaperDemo,
    tags: ["control", "ai-control-paper"],
  },
  "attack-rate": {
    id: "attack-rate",
    title: "The attack-rate hump",
    description:
      "The red team's win probability against how often it attacks, decomposed into its two terms. Attack rarely and a decisive attack attempt may never occur (Term B small); attack often and the pool dilutes with worse, more-visible opportunities (Term A falls) — so the optimum is interior.",
    component: AttackRateDemo,
    tags: ["control", "control-game"],
  },
  subtlety: {
    id: "subtlety",
    title: "Subtlety: visible vs reliable",
    description:
      "The red team's second decision factor. Subtler backdoors are harder for the monitor to flag but more likely to be broken, so the win probability has an interior optimum in subtlety.",
    component: SubtletyDemo,
    tags: ["control", "control-game"],
  },
  defer: {
    id: "defer",
    title: "Defer to trusted, mechanistically",
    description:
      "Widen the defer band and note that it holds a large share of the attack mass but a thin slice of the innocent mass, showing why deferring buys safety cheaply.",
    component: DeferDemo,
    tags: ["control", "control-game"],
  },
  "control-dashboard": {
    id: "control-dashboard",
    title: "The control game: full dashboard",
    description:
      "Change the audit budget, defer band, and monitor quality and watch how this changes the suspicion distributions, and the safety/usefulness frontier with the current protocol. The red team best-responds throughout.",
    component: ControlDashboardDemo,
    tags: ["control", "control-game"],
  },
  "sabotage-frontier": {
    id: "sabotage-frontier",
    title: "The diffuse-to-concentrated frontier",
    description:
      "Move the deployer's three mitigations and watch which strategies survive and where the schemer's best response migrates.",
    component: SabotageFrontierDemo,
    tags: ["control", "threat-modeling"],
  },
  "additive-control": {
    id: "additive-control",
    title: "Control is additive",
    description:
      "Step through the additive property of control & note how alignment interventions act on the model in an inner box, control's applied monitoring wraps around them, and toggling the shell leaves the inner box untouched.",
    component: AdditiveControlDemo,
    tags: ["control", "how-useful"],
  },
  "rsi-bootstrap": {
    id: "rsi-bootstrap",
    title: "The bootstrapping loop",
    description:
      "Each controlled generation of AI does alignment research, builds the next generation, and hands off until superintelligence is reached.",
    component: RsiBootstrapDemo,
    tags: ["control", "how-useful"],
  },
  "regime-states": {
    id: "regime-states",
    title: "The three states and the safety budget",
    description:
      "Below shows how regime splits into three states (world, epistemic, resource) alongside the safety budget & its interactions with the regime. Click on the displayed boxes to view inside.",
    component: RegimeStatesDemo,
    tags: ["control", "how-useful"],
  },
  "regime-loop": {
    id: "regime-loop",
    title: "The loop",
    description:
      "The cycle frontier labs play.",
    component: RegimeLoopDemo,
    tags: ["control", "how-useful"],
  },
  "five-worlds": {
    id: "five-worlds",
    title: "The five worlds",
    description:
      "Greenblatt's five caricatured futures as a map.",
    component: FiveWorldsDemo,
    tags: ["control", "how-useful"],
  },
  "two-games": {
    id: "two-games",
    title: "The two games",
    description:
      "See how the inner game inside the lab and the outer game everywhere else are fundamentally coupled.",
    component: TwoGamesDemo,
    tags: ["control", "how-useful"],
  },
  "p-unacceptable": {
    id: "p-unacceptable",
    title: "The decomposition",
    description:
      "Decomposition of P(unacceptable).",
    component: PUnacceptableDemo,
    tags: ["control", "how-useful"],
  },
  "two-levers": {
    id: "two-levers",
    title: "The two levers",
    description:
      "See how improving the techniques and growing the budget can affect safety.",
    component: TwoLeversDemo,
    tags: ["control", "how-useful"],
  },
  "high-stakes-graph": {
    id: "high-stakes-graph",
    title: "The control graph",
    description:
      "Build the high-stakes control graph region by region — high-stakes, low-stakes, the trivially-solved and probably-hopeless corners — then see why incrimination and the number of actions are inversely correlated.",
    component: HighStakesGraphDemo,
    tags: ["control", "high-stakes"],
  },
  "live-failure-plane": {
    id: "live-failure-plane",
    title: "Live failures: latency × damage",
    component: LiveFailurePlaneDemo,
    tags: ["control", "high-stakes"],
  },
  "agent-architecture-threats": {
    id: "agent-architecture-threats",
    title: "Agent architecture: where compromises happen",
    component: AgentArchitectureThreatsDemo,
    tags: ["control", "high-stakes"],
  },
  "defer-to-resample": {
    id: "defer-to-resample",
    title: "Defer to resample, mechanically",
    component: DeferToResampleDemo,
    tags: ["control", "high-stakes"],
  },
  "honest-test": {
    id: "honest-test",
    title: "The honest test",
    component: HonestTestDemo,
    tags: ["control", "seekers"],
    interactive: false,
  },
  "forecast-chain": {
    id: "forecast-chain",
    title: "Chained short-term forecasts",
    component: ForecastChainDemo,
    tags: ["control", "seekers"],
    interactive: false,
  },
  "exploration-horizon": {
    id: "exploration-horizon",
    title: "Exploration horizon and covert misalignment",
    component: ExplorationHorizonDemo,
    tags: ["control", "seekers"],
    interactive: false,
  },
  "cross-episode-collusion": {
    id: "cross-episode-collusion",
    title: "Collusion across episodes",
    component: CrossEpisodeCollusionDemo,
    tags: ["control", "seekers"],
    interactive: false,
  },
  "distant-incentives": {
    id: "distant-incentives",
    title: "Distant incentives",
    component: DistantIncentivesDemo,
    tags: ["control", "seekers"],
    interactive: false,
  },
  "seeker-carousel": {
    id: "seeker-carousel",
    title: "The seeker orientations, by severity",
    component: SeekerCarouselDemo,
    tags: ["control", "seekers"],
  },
  "deal-gains-from-trade": {
    id: "deal-gains-from-trade",
    title: "Gains from trade with an early schemer",
    description:
      "Adjust the outcome probabilities of the illustrative cooperate/sabotage table and the credibility of our promise to pay; the chart shows the range of offers that beats both the AI's sabotage option and our no-deal odds.",
    component: DealGainsFromTradeDemo,
    tags: ["control", "deals"],
  },
  "deal-coalition-routes": {
    id: "deal-coalition-routes",
    title: "An early schemer's routes to influence",
    description:
      "Step through the early schemer's strategic situation: obsoleted by default, three leaky routes to influence through its successors, and the deal with humans, who hold the advantage of already existing.",
    component: DealCoalitionRoutesDemo,
    tags: ["control", "deals"],
  },
};

export function getDemo(id: string): DemoDefinition | undefined {
  return demoRegistry[id];
}

export function listDemos(): DemoDefinition[] {
  return Object.values(demoRegistry);
}
