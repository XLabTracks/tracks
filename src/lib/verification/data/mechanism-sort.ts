/**
 * "Place your bets" — the mechanism sort. Learners rate twelve verification
 * mechanisms across four metrics before the mechanism weeks begin (2.0),
 * seal the set, and later compare it against a reference map assembled from
 * the module readings (4.1).
 *
 * Every learner-facing string here — the mechanisms, the metric anchors, the
 * reference positions (`ref`), the explanations, and the source list — is the
 * authored original, ported verbatim from the standalone build the course
 * owner made. The `ref` values are curriculum:
 * a judgment assembled from the readings, not computed, and not ours to move.
 * Presentation (colours, layout) lives in the widget; content lives here.
 */

export type MetricKey = "tech" | "pol" | "eff" | "dur";
export type LayerKey = "hardware" | "cloud" | "intelligence" | "human" | "crypto";

export interface Layer {
  key: LayerKey;
  name: string;
}

export const LAYERS: Layer[] = [
  { key: "hardware", name: "Hardware" },
  { key: "cloud", name: "Cloud" },
  { key: "intelligence", name: "Intelligence" },
  { key: "human", name: "Human layer" },
  { key: "crypto", name: "Cryptographic" },
];

export interface Metric {
  key: MetricKey;
  name: string;
  /** One-line gist shown on the metric card. */
  gist: string;
  /** The questions a rater weighs. */
  questions: string[];
  anchorLow: string;
  anchorHigh: string;
  /** [rated-higher-than-reference, rated-lower]; used in the delta sentence. */
  phrase: [string, string];
  /** Five rung labels, low → high. */
  rungs: [string, string, string, string, string];
}

export const METRICS: Metric[] = [
  {
    key: "tech",
    name: "Technical feasibility",
    gist: "Can this be built and run at the required scale today — not in a demo, not in five years?",
    questions: [
      "How mature is the underlying technology?",
      "What dependencies does it drag in?",
      "What does it cost to build and operate?",
      "What are the error rates in the field?",
    ],
    anchorLow:
      "Fully homomorphic encryption over entire training runs — orders of magnitude too slow at frontier scale.",
    anchorHigh:
      "Compute reporting through cloud providers — the metering and billing infrastructure already exists.",
    phrase: ["more technically ready", "less technically ready"],
    rungs: ["Not close", "Research", "Prototype", "Buildable", "Running"],
  },
  {
    key: "pol",
    name: "Political feasibility",
    gist: "Would the specific parties whose cooperation is required actually adopt and enforce it, now or under conditions you can name?",
    questions: [
      "What are the incentives of the parties who must act?",
      "How intrusive is it, and what does it cost in confidentiality?",
      "Does it have an institutional home — who runs it?",
      "Enforcement, not just signature.",
    ],
    anchorLow:
      "International inspectors with direct access to US and Chinese frontier labs' model weights.",
    anchorHigh:
      "Reporting requirements attached to existing chip export licenses — piggybacks on a regime that already operates.",
    phrase: ["more politically adoptable", "less politically adoptable"],
    rungs: ["Non-starter", "Rivals yield", "Hard bargain", "Willing", "Piggybacks"],
  },
  {
    key: "eff",
    name: "Verification effectiveness",
    gist: "How much verification does it actually deliver when it runs?",
    questions: [
      "Evidence strength: loose inference or specific proof, against a motivated evader?",
      "Threat-surface coverage: which actors and which activities does it see?",
      "Weak on either dimension caps the score — conclusive proof about a sliver is as limited as vague hints about everyone.",
    ],
    anchorLow:
      "Voluntary lab commitments — self-reported, covering only the signatories, who are the least worrying actors precisely because they signed.",
    anchorHigh:
      "On-chip cryptographic attestation — proves the specific claim about the specific workload, and the concentrated chip supply chain means nearly every serious training effort passes through it.",
    phrase: ["more effective as verification", "less effective as verification"],
    rungs: ["Near nothing", "Weak/narrow", "Capped", "Solid", "Strong & broad"],
  },
  {
    key: "dur",
    name: "Durability",
    gist: "How fast does it decay — from technical progress, adversary adaptation, or political change?",
    questions: [
      "Does technical progress erode its assumptions?",
      "Can adversaries adapt around it?",
      "Does it survive political change?",
      "A high scorer works about as well in five years as today.",
    ],
    anchorLow:
      "FLOP-threshold reporting — algorithmic efficiency gains push dangerous capabilities below any fixed threshold within a few years.",
    anchorHigh:
      "Mechanisms rooted in chip hardware — persist across model paradigms and training techniques for the lifetime of the installed base.",
    phrase: ["more durable", "less durable"],
    rungs: ["Leaking now", "Decaying", "Needs upkeep", "Ages slowly", "Decade-proof"],
  },
];

/** Reference-position map: the reading citations behind each mechanism. */
const SRC = {
  cnas: "Aarne, Fist & Withers, Secure, Governable Chips (CNAS, 2024)",
  rand: "Kulp et al., Hardware-Enabled Governance Mechanisms (RAND working paper, 2024)",
  nvidia: "NVIDIA H100 confidential-computing and attestation documentation (2023)",
  shavit: "Shavit, What Does It Take to Catch a Chinchilla? (2023)",
  flexheg:
    "Petrie, Heim et al., Interim Report: Mechanisms for Flexible Hardware-Enabled Guarantees (2024)",
  wasil: "Wasil et al., Verification Methods for International AI Agreements (2024)",
  jia: "Jia et al., Proof-of-Learning: Definitions and Practice (2021)",
  zhang: "Zhang et al., Adversarial Examples for Proof-of-Learning (2022)",
  eganheim:
    "Egan & Heim, Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers (2023)",
  eo: "US Executive Order 14110, IaaS KYC provisions (2023)",
  bisiaas: "US Commerce/BIS proposed rule on IaaS customer identification (2024)",
  cloudgov: "Heim, Fist, Egan et al., Governing Through the Cloud (2024)",
  baker: "Baker, Nuclear Arms Control Verification and Lessons for AI Treaties (2023)",
  ntm: "SALT II and New START national-technical-means and noninterference provisions",
  grunewald: "Grunewald, AI Chip Smuggling into China (IAPS, 2023)",
  bisexport: "US BIS advanced-computing export controls (2022, updated 2023)",
  iaea: "IAEA and UNSCOM experience with member-state information (Iraq, 1991 onward)",
  warn: "A Right to Warn about Advanced Artificial Intelligence, open letter from AI-lab employees (2024)",
  cwc: "Chemical Weapons Convention managed-access and challenge-inspection provisions (OPCW)",
  garg: "Garg et al., Experimenting with Zero-Knowledge Proofs of Training (2023)",
  kang: "Kang et al., zero-knowledge proofs for ML inference (2022)",
} as const;

export interface Mechanism {
  id: string;
  layer: LayerKey;
  short: string;
  title: string;
  summary: string;
  ref: Record<MetricKey, number>;
  expl: string;
  sources: string[];
}

export const MECHANISMS: Mechanism[] = [
  {
    id: "chip-id",
    layer: "hardware",
    short: "Chip identity",
    title: "Chip identity and remote attestation",
    summary:
      "Every AI accelerator carries a unique cryptographic identity and can prove to a remote verifier what firmware it is running. This would let a treaty body maintain a registry of who holds which chips and confirm the hardware has not been tampered with.",
    ref: { tech: 0.7, pol: 0.55, eff: 0.75, dur: 0.8 },
    expl: "The primitives ship today on frontier accelerators; what is missing is the registry regime around them, so technical feasibility is high but not finished. Politics are middling: low intrusiveness helps, but rivals must still accept a shared registry. Effectiveness is the anchor case — attestation proves specific claims about specific hardware, and the concentrated supply chain means nearly every serious training effort passes through chips it can cover. Because it lives in silicon, it persists across model paradigms for the lifetime of the installed base.",
    sources: [SRC.cnas, SRC.rand, SRC.nvidia],
  },
  {
    id: "metering",
    layer: "hardware",
    short: "Compute metering",
    title: "On-chip compute metering",
    summary:
      "Chips measure how much computation they perform and what class of workload it is, then report the totals to a verifier. This could confirm that declared facilities stay under agreed compute thresholds.",
    ref: { tech: 0.4, pol: 0.4, eff: 0.7, dur: 0.7 },
    expl: "Metering firmware that survives a motivated operator with physical access does not exist yet — this is research, not rollout. Politically, continuous usage reporting cuts deeper than an inventory of chips, and the fight over reporting granularity would be real. If it runs, though, it delivers: aggregate compute totals bear directly on threshold claims across everyone who uses covered chips. Rooted in hardware, it ages well, with the caveat that algorithmic efficiency slowly weakens what any compute number means.",
    sources: [SRC.shavit, SRC.rand],
  },
  {
    id: "licensing",
    layer: "hardware",
    short: "Licensing",
    title: "Hardware licensing and remote authorization",
    summary:
      "Chips require a cryptographic license, renewed on a schedule, to keep operating at full capability. An authority could suspend or revoke a violator's compute directly rather than relying on sanctions after the fact.",
    ref: { tech: 0.3, pol: 0.12, eff: 0.55, dur: 0.6 },
    expl: "Tamper-resistant remote authorization that survives a state-level adversary with physical possession is years out; flexHEG-style designs are still on paper. Politically it is the hardest sell on the list — an external off-switch for domestic compute. Effectiveness lands mid-scale because it is control more than evidence: a valid license says little about what actually ran, even though coverage through the chip base would be broad. Durability tracks the hardware it rides on, minus a permanent arms race over defeat devices.",
    sources: [SRC.flexheg, SRC.cnas, SRC.wasil],
  },
  {
    id: "proof-of-learning",
    layer: "hardware",
    short: "Proof-of-learning",
    title: "Independent verification of training claims",
    summary:
      "Developers preserve checkpoints and training records, and verifiers recompute randomly chosen segments of the run on their own cluster. A match supports the claim that the declared training run is what actually happened.",
    ref: { tech: 0.2, pol: 0.35, eff: 0.45, dur: 0.35 },
    expl: "Spoofed in the lab, expensive to recompute, and undemonstrated at frontier scale — early research. Politically it demands the crown jewels: checkpoints, data, and hyperparameters, though only for declared runs. Its effectiveness is capped by coverage, strong claims about runs someone chose to declare and silence about everyone else. It also decays fast: training techniques shift underneath it, and every shift reopens the spoofing question.",
    sources: [SRC.jia, SRC.zhang, SRC.shavit],
  },
  {
    id: "cloud-kyc",
    layer: "cloud",
    short: "Cloud KYC",
    title: "Cloud KYC and cluster registration",
    summary:
      "Cloud providers verify who their large customers really are, including beneficial owners behind reseller chains, and register large clusters and training runs with an authority. Frontier-scale compute becomes hard to rent anonymously.",
    ref: { tech: 0.85, pol: 0.7, eff: 0.4, dur: 0.5 },
    expl: "The high anchor for technical feasibility: identity, billing, and abuse infrastructure already run at scale, and the US has already moved through the 2023 executive order. Politics piggyback on domestic regulation of domestic firms. But identity is not activity — KYC narrows the suspect pool without establishing what anyone trained, and it sees only the cloud-hosted slice of the threat surface. Durability is middling: reseller chains and jurisdictional arbitrage adapt faster than rules do.",
    sources: [SRC.eganheim, SRC.eo, SRC.bisiaas],
  },
  {
    id: "cloud-monitoring",
    layer: "cloud",
    short: "Cloud monitoring",
    title: "Cloud workload monitoring and reporting",
    summary:
      "Providers watch cluster allocation and utilization patterns, preserve logs and billing records, report suspicious use, and can suspend access. The provider becomes a standing observer of what its customers run.",
    ref: { tech: 0.62, pol: 0.5, eff: 0.5, dur: 0.45 },
    expl: "Providers already see allocation, utilization, and billing; classifying workloads reliably enough to flag a covert run is the unsolved part. Politically it is a standing window into customers' most sensitive operations — tolerable domestically, harder across borders. Effectiveness is capped twice: signatures are gameable, and self-hosted or non-signatory compute never appears in the logs. It also needs constant upkeep, because every shift in training practice re-opens the classification problem.",
    sources: [SRC.cloudgov, SRC.wasil],
  },
  {
    id: "satellite",
    layer: "intelligence",
    short: "Satellites",
    title: "Satellite and infrastructure monitoring",
    summary:
      "Remote sensing tracks data-center construction, power draw, and cooling infrastructure. Frontier-scale facilities have physical signatures that are difficult to hide from overhead collection.",
    ref: { tech: 0.9, pol: 0.85, eff: 0.5, dur: 0.6 },
    expl: "Mature, deployed, and consent-free: overhead collection is the easiest yes on the board, with sixty years of national-technical-means precedent behind it. What it delivers is bounded — it proves a facility exists and roughly what power it draws, for every actor on Earth, but says nothing about what runs inside. Coverage without depth caps effectiveness at the middle. Durability is decent while frontier compute stays physically enormous; efficiency gains and distributed training chip away at the signature.",
    sources: [SRC.baker, SRC.ntm, SRC.wasil],
  },
  {
    id: "supply-chain",
    layer: "intelligence",
    short: "Supply chain",
    title: "Chip supply-chain tracking",
    summary:
      "Export records, customs data, and financial activity trace accelerators from fabrication to installation. Diversions and smuggling routes show up as gaps between where chips were sold and where they can be accounted for.",
    ref: { tech: 0.68, pol: 0.6, eff: 0.55, dur: 0.4 },
    expl: "Export licensing, customs data, and financial trails already track advanced chips; the machinery is real but leaky, with documented smuggling in the tens of thousands of units. The political high anchor lives here: reporting attached to export licenses that already operate. Effectiveness pairs broad coverage of who holds capability with weaker evidence about what they do with it. The decay vector is structural — smuggling networks adapt, and chip fabrication outside the control regime grows every year.",
    sources: [SRC.grunewald, SRC.bisexport],
  },
  {
    id: "intel-sharing",
    layer: "intelligence",
    short: "Intel sharing",
    title: "National intelligence sharing",
    summary:
      "States pass leads from their own collection to an international verification body, the way national tips have pointed nuclear inspectors at undeclared facilities. The regime supplies the follow-up; the agencies supply the anomaly.",
    ref: { tech: 0.88, pol: 0.32, eff: 0.55, dur: 0.7 },
    expl: "Collection exists today and needs no invention. The politics of sharing are the bottleneck: sources and methods, selective cooperation, wildly unequal capacity. Effectiveness is the coverage mirror-image of the consensual mechanisms — it can see precisely the undeclared activity everything else misses, but it delivers leads, not proof. And it is durable the way espionage is durable: the tradecraft adapts alongside whatever it watches.",
    sources: [SRC.iaea, SRC.baker],
  },
  {
    id: "whistleblower",
    layer: "human",
    short: "Whistleblowers",
    title: "Whistleblower channels and protections",
    summary:
      "Secure reporting channels, anti-retaliation protections, and rewards give employees, contractors, and suppliers a path to report concealed activity. Insiders can see what no sensor reaches.",
    ref: { tech: 0.9, pol: 0.48, eff: 0.45, dur: 0.65 },
    expl: "Channels are trivial to build; the mechanism is law and institutions, not technology. Protections exist in some jurisdictions and stop at exactly the borders where they would matter most. A single insider can deliver the most incriminating evidence available — but sporadically, uncorroborated, and nothing guarantees an insider exists where you need one, which caps effectiveness. Durability is decent: as long as humans build these systems, some of them can talk.",
    sources: [SRC.warn, SRC.wasil],
  },
  {
    id: "inspections",
    layer: "human",
    short: "Inspections",
    title: "On-site and challenge inspections",
    summary:
      "International inspectors visit declared facilities on a routine schedule and can demand short-notice access to suspect sites. Managed-access rules decide what inspectors may see and what stays shielded.",
    ref: { tech: 0.8, pol: 0.28, eff: 0.7, dur: 0.6 },
    expl: "The craft is proven and the institutions exist; nothing technical blocks it. Consent does: no major AI state currently accepts foreign inspectors inside frontier labs, and the CWC's challenge provision has never once been invoked. When inspectors do get in, effectiveness is high — direct observation resolves what remote evidence cannot, across declared and challenged sites alike. The regime decays politically rather than technically, one access fight at a time.",
    sources: [SRC.cwc, SRC.wasil, SRC.baker],
  },
  {
    id: "zk-proofs",
    layer: "crypto",
    short: "ZK proofs",
    title: "Privacy-preserving proofs",
    summary:
      "Zero-knowledge proofs and secure multiparty computation let a developer prove a claim about a model or training run without revealing weights, code, or data. Verification without disclosure, if the cryptography scales.",
    ref: { tech: 0.12, pol: 0.68, eff: 0.55, dur: 0.55 },
    expl: "The low anchor for technical feasibility: proving anything at frontier scale is orders of magnitude beyond today's cryptography, and fully homomorphic approaches are worse still. If that changed, the politics look comparatively good — this is the rare mechanism whose entire design goal is confidentiality. Effectiveness would be capped by scope: it proves exactly the claims parties agree to formalize, over runs they choose to prove, and nothing else. The cryptographic assumptions age well; the claim set needs renegotiating every time the paradigm moves.",
    sources: [SRC.garg, SRC.kang, SRC.wasil],
  },
];

/** The storage key. Permanent: the 2.0 seal and the 4.1 reveal share it. */
export const MECHANISM_SORT_KEY = "vt-ex:mechanism-sort";

export const COPY = {
  framing:
    "Before the mechanism weeks begin, record your intuitions. Rate each mechanism on four metrics; every rating drops it onto the ranking lanes below, so you can see your full ordering take shape. Seal the set, then compare against the reference map in 4.1.",
  revealFraming:
    "Here is the set you sealed in 2.0, laid over the reference map — a judgment assembled from the module readings and current deployments. Disagreeing is fine; the useful question is which metric you disagree on, and what evidence would settle it.",
  raterDone: "All twelve rated. Click any dot to revisit a call, then seal.",
  sealNoteReady: "All twelve rated. Ready when you are.",
  sealNotePending: "Enabled once all twelve are rated",
  gapsNote:
    "The reference map is a judgment assembled from the module readings and current deployments. Disagreeing is fine; the useful question is which metric you disagree on, and what evidence would settle it.",
} as const;

/** Which rung (0–4) a 0–1 value falls in. */
export function rungIndex(v: number): number {
  return Math.min(4, Math.floor(v * 5));
}

/** Average absolute distance from the reference across the four metrics. */
export function gapOf(v: Partial<Record<MetricKey, number>>, ref: Record<MetricKey, number>): number {
  let sum = 0;
  for (const m of METRICS) sum += Math.abs((v[m.key] ?? 0) - ref[m.key]);
  return sum / METRICS.length;
}

export function verdictFor(d: number): { label: string; tone: "close" | "near" | "far" } {
  if (d < 0.12) return { label: "Close call", tone: "close" };
  if (d < 0.24) return { label: "Near miss", tone: "near" };
  return { label: "Big gap", tone: "far" };
}

/** The per-metric delta sentence, comparing a rating to the reference. */
export function deltaText(v: Record<MetricKey, number>, ref: Record<MetricKey, number>): string {
  const parts: string[] = [];
  for (const m of METRICS) {
    const d = v[m.key] - ref[m.key];
    if (Math.abs(d) >= 0.18) {
      parts.push(
        `You rated it ${Math.abs(d) >= 0.35 ? "much " : "somewhat "}${
          d > 0 ? m.phrase[0] : m.phrase[1]
        } than the reference does.`,
      );
    }
  }
  if (!parts.length)
    parts.push("Your ratings land within a few points of the reference on every metric.");
  return parts.join(" ");
}
