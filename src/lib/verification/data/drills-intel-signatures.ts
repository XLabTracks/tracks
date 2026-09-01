import type { DrillDeck } from "./drills";

export const DRILLS_INTEL_SIGNATURES: DrillDeck = {
  id: "drills-intel-signatures",
  title: "Drill Bench: Power to Compute",
  blurb:
    "Derive the power-to-compute conversion from two atomic facts, scale it to a real cluster, then triage three sites on draw alone. Derive, never plug in.",
  benches: [
    {
      id: "fermi-bench",
      label: "Fermi bench",
      name: "Fermi bench",
      kicker:
        "Derive it; don't receive it. The reference value appears only as the check on your own derivation, never as an input.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          brief:
            "Two atomic facts: one current AI accelerator delivers ~2×10¹⁵ FLOP/s, and (with its share of cooling and networking) draws ~2 kW.",
          q: "Derive the conversion: about how many FLOP/s does a site deliver per watt of power draw?",
          opts: ["~10⁹ FLOP/s per watt", "~10¹² FLOP/s per watt", "~10¹⁵ FLOP/s per watt"],
          right: 1,
          why: "2×10¹⁵ FLOP/s ÷ 2×10³ W = ~10¹² FLOP/s per watt. You derived the reference value the field uses; it was never an input.",
        },
        {
          type: "pick",
          q: "Scale it: a ~130 MW site (the scale of a 100k-accelerator cluster). Order-of-magnitude compute bound?",
          opts: ["~10¹⁷ FLOP/s", "~10²⁰ FLOP/s", "~10²³ FLOP/s"],
          right: 1,
          why: "1.3×10⁸ W × 10¹² FLOP/s per watt ≈ 10²⁰ FLOP/s. Count the zeros: that is the whole method. Power bounds compute; it never reveals what the compute computes.",
        },
        {
          type: "pick",
          brief: "Triage on power draw alone: classify each site.",
          statement: "Site A · 8 MW industrial park feed",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 0,
          why: "8 MW is a ceiling of about 10¹⁶–10¹⁷ FLOP/s, an order or two below frontier training scale today. (But note the decay clock: at ~1.6×/yr efficiency gains, \"below threshold\" is a date, not a fact.)",
        },
        {
          type: "pick",
          statement: "Site B · 40 MW campus, declared as cloud hosting",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 1,
          why: "40 MW could be ~30k accelerators or an ordinary hyperscale hall. Power alone cannot separate them: this is exactly where procurement, thermal, and declarations must corroborate.",
        },
        {
          type: "pick",
          statement: "Site C · 300 MW with behind-the-meter gas turbines, no grid filing",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 2,
          why: "Frontier-scale ceiling AND the concealment move (off-grid generation) in one signature: the workaround is itself an anomaly. Aerial thermal surfaced exactly this pattern at xAI Memphis.",
        },
      ],
    },
  ],
};
