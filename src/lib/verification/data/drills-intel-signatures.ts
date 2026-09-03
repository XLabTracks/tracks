import type { DrillDeck } from "./drills";

export const DRILLS_INTEL_SIGNATURES: DrillDeck = {
  id: "drills-intel-signatures",
  title: "Drill Bench: Power to Compute",
  blurb:
    "Derive the power-to-compute conversion from two basic facts, scale it to a real cluster, then classify three sites from their power draw alone. Work the numbers out yourself; reference values appear only after you commit.",
  benches: [
    {
      id: "fermi-bench",
      label: "Fermi estimate",
      name: "Fermi estimate",
      kicker:
        "Work the numbers out yourself. The reference value is shown only after you commit, as a check on your derivation, never as an input.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          brief:
            "Two basic facts: one current AI accelerator delivers ~2×10¹⁵ FLOP/s and, with its share of cooling and networking, draws ~2 kW.",
          q: "Derive the conversion: about how many FLOP/s does a site deliver per watt of power draw?",
          opts: ["~10⁹ FLOP/s per watt", "~10¹² FLOP/s per watt", "~10¹⁵ FLOP/s per watt"],
          right: 1,
          why: "2×10¹⁵ FLOP/s ÷ 2×10³ W = ~10¹² FLOP/s per watt. This is the reference value the field uses, derived rather than given.",
        },
        {
          type: "pick",
          q: "Scale it up: a site drawing about 130 MW, the scale of a 100,000-accelerator cluster. What is its compute bound, to an order of magnitude?",
          opts: ["~10¹⁷ FLOP/s", "~10²⁰ FLOP/s", "~10²³ FLOP/s"],
          right: 1,
          why: "1.3×10⁸ W × 10¹² FLOP/s per watt ≈ 10²⁰ FLOP/s. Counting the zeros is the whole method. Power bounds compute; it does not reveal what the compute is used for.",
        },
        {
          type: "pick",
          brief: "Classify each site from its power draw alone.",
          statement: "Site A: 8 MW industrial-park feed",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 0,
          why: "8 MW is a ceiling of about 10¹⁶–10¹⁷ FLOP/s, one or two orders of magnitude below frontier training scale today. Note the decay: at about 1.6× a year in efficiency gains, \"below threshold\" is a statement about a date, not a permanent fact.",
        },
        {
          type: "pick",
          statement: "Site B: 40 MW campus, declared as cloud hosting",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 1,
          why: "40 MW could be about 30,000 accelerators or an ordinary hyperscale hall. Power alone cannot separate them; this is where procurement, thermal, and declarations have to corroborate.",
        },
        {
          type: "pick",
          statement: "Site C: 300 MW with behind-the-meter gas turbines, no grid filing",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 2,
          why: "A frontier-scale ceiling and a concealment measure (off-grid generation) in one signature: the workaround is itself an anomaly. Aerial thermal imaging detected this pattern at xAI's Memphis site.",
        },
      ],
    },
  ],
};
