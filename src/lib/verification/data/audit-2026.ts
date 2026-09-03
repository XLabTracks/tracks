export const AUDIT_2026_KEY = "v-audit-2026:v1";

export const RETRIEVAL = {
  shavit: "retrieved 2026-08-17",
  interposers: "2026-08-05",
  vendorAdvisories: "2026-08-05",
  detector: "2026-06-17",
  proofOfLearning: "2026-08-05",
  intellect2: "verified 2026-08-17",
  efficiencyTrend: "2026-08-05",
  smuggling: "2026-08-05",
  dojCharges: "2026-08-05",
  epochDashboards: "retrieved 2026-08-05",
} as const;

export type FunctionTag =
  | "identify"
  | "attest"
  | "measure"
  | "restrict"
  | "reconstruct";

export interface FunctionOption {
  id: FunctionTag;
  label: string;
}

export const FUNCTIONS: readonly FunctionOption[] = [
  { id: "identify", label: "Identify" },
  { id: "attest", label: "Attest" },
  { id: "measure", label: "Measure and classify" },
  { id: "restrict", label: "Restrict" },
  { id: "reconstruct", label: "Reconstruct" },
];

export interface SchemeItem {
  id: string;
  text: string;
  inScheme: boolean;
  accepts: readonly FunctionTag[];
  reveal: string;
  restrictNote?: string;
}

export const SCHEME_ITEMS: readonly SchemeItem[] = [
  {
    id: "snapshots",
    text: "On-chip firmware occasionally saves snapshots of the neural network weights in device memory, hashes them with a publicly agreed function, and keeps the hash where an inspector can later retrieve it.",
    inScheme: true,
    accepts: ["measure", "attest", "reconstruct"],
    reveal:
      "Intervention one. The firmware hashes weight regions with a publicly agreed function and keeps the hash for the verifier, either in on-chip non-volatile memory writable only by the firmware, or signed with the chip's key and sent to a verifier-trusted server. Two storage variants, two different trust placements. The function tags that fit: measure and classify, attest, reconstruct. If you tagged restrict, look again at what the firmware does when it sees a violation. It does nothing. It records.",
  },
  {
    id: "license",
    text: "The chip requires a signed license file naming its allowed clock cycles, decrements as they pass, and halts when the meter reaches zero.",
    inScheme: false,
    accepts: [],
    reveal:
      "This is Petrie's offline licensing, from 2.1.4. It restricts, which is the one function Shavit's design never performs. The two families make opposite institutional demands, key custody against standing access, and mixing them up collapses a distinction the capstone needs.",
  },
  {
    id: "transcripts",
    text: "The operator retains enough information about each training run, data, hyperparameters, intermediate checkpoints, to prove to inspectors that the run produced the snapshotted weights.",
    inScheme: true,
    accepts: ["reconstruct"],
    reveal:
      "Intervention two. Snapshots alone prove that some weights existed on some chip. The transcript is what connects them to a declared run, and the audit re-derives sampled segments to check the connection. Function: reconstruct. The economics of faking a transcript are priced in the audit's third evidence card.",
    restrictNote:
      "Nothing here halts anything. The function you tagged belongs to the licensing family.",
  },
  {
    id: "zkproof",
    text: "The operator publishes a cryptographic proof that the training run satisfied the rule, verifiable by anyone, without revealing weights, data, or code.",
    inScheme: false,
    accepts: [],
    reveal:
      "Tempting, since hashes appear in the paper. But a hash commitment is not a zero-knowledge proof. Shavit's design controls what an audit sees and when; it does not prove properties of the training run cryptographically. You saw in 2.1.6 what proving training in zero knowledge currently costs, and why the paper could not have assumed it.",
  },
  {
    id: "census",
    text: "The chip supply chain is monitored so that no actor can avoid discovery by amassing a large quantity of untracked chips.",
    inScheme: true,
    accepts: ["identify"],
    reveal:
      "Intervention three, and the one that makes the other two mean anything. Monitored chips producing clean evidence say nothing if unmonitored chips exist in quantity. Function: identify. Note where this intervention physically happens: at fabs and packagers, largely outside the territory of the party being checked. It is the piece a refusing state cannot simply withhold.",
    restrictNote:
      "Nothing here halts anything. The function you tagged belongs to the licensing family.",
  },
  {
    id: "geolocate",
    text: "Trusted landmark servers challenge the chip over the network and bound its distance by response time, since a reply cannot outrun light.",
    inScheme: false,
    accepts: [],
    reveal:
      "Delay-based location proofs are the IAPS proposal from 2.1.4. Shavit's census tracks who owns which chips through the supply chain. It never establishes where a chip physically is, and the paper's own admission that legacy chips “may not be retrofittable nor even locatable” marks the difference.",
  },
];

export type AssumptionId =
  | "concentration"
  | "custody"
  | "classification"
  | "soundness"
  | "census";

export interface Assumption {
  id: AssumptionId;
  name: string;
  statement: string;
}

export const ASSUMPTIONS: readonly Assumption[] = [
  {
    id: "concentration",
    name: "Concentration",
    statement:
      "A run worth catching needs hundreds or thousands of co-located accelerators for weeks or months.",
  },
  {
    id: "custody",
    name: "Custody",
    statement:
      "The chip's firmware, keys, and logs survive an owner who holds the machine and has unlimited time.",
  },
  {
    id: "classification",
    name: "Classification",
    statement:
      "A verifier can tell training from exempt work well enough to know when snapshots matter.",
  },
  {
    id: "soundness",
    name: "Soundness",
    statement:
      "Forging a transcript that matches the logged snapshots costs at least as much as training honestly.",
  },
  {
    id: "census",
    name: "Census",
    statement:
      "The count of monitored chips is complete. No pool of untracked hardware exists.",
  },
];

export type Direction = "weakens" | "strengthens" | "standing";

export interface DirectionOption {
  id: Direction;
  label: string;
}

export const DIRECTIONS: readonly DirectionOption[] = [
  { id: "weakens", label: "Weakens it" },
  { id: "strengthens", label: "Strengthens it" },
  { id: "standing", label: "Leaves it standing" },
];

export interface EvidenceHint {
  direction?: Direction;
  bearsOn?: AssumptionId;
  text: string;
}

export interface EvidenceCard {
  id: string;
  code: string;
  title: string;
  dateLine: string;
  body: string;
  source: string;
  bearsOn: AssumptionId;
  direction: Direction;
  reveal: string;
  hints: readonly EvidenceHint[];
}

export const EVIDENCE: readonly EvidenceCard[] = [
  {
    id: "physical",
    code: "E1",
    title: "The interposer years",
    dateLine: "December 2024 to October 2025",
    body: "Four published attacks used cheap memory-bus interposers against deployed trusted-computing defenses. BadRAM cost about $10 in parts. Battering RAM came in under $50. TEE.fail, at under $1,000, extracted a provisioning key, forged an Intel TDX attestation quote, and paired it with a genuine attestation borrowed from a different, real H100 in a rented cloud instance. Intel's advisory states the research does not change its position that such physical attacks are out of scope. AMD's states it does not plan mitigations. None of these attacks broke GPU silicon. All of them attacked what the silicon's guarantees are anchored to.",
    source:
      "TEE.fail, IEEE S&P 2026, disclosed 28 October 2025; Intel INTEL-2025-10-28-001; AMD-SB-3040.",
    bearsOn: "custody",
    direction: "weakens",
    reveal:
      "The scheme's on-chip spine assumes firmware, keys, and logs survive an owner with the machine and unlimited time. The interposer record prices that assumption from the wrong side: attestation keys extracted for under $1,000, and both CPU vendors stating in writing that physical attacks sit outside the defended threat model. Read the bound precisely. None of this demonstrated a break of a GPU logging path, and TEE.fail attacked the binding between attestations rather than GPU silicon. What it establishes is that the class of guarantee Shavit's firmware would need, security against the machine's owner, is one the shipping ecosystem explicitly does not offer. That was the threat-model inversion as a warning in 2.1.1. Here it is as a bill.",
    hints: [
      {
        bearsOn: "soundness",
        text: "The interposers attacked keys and memory, not training transcripts. Which assumption holds the keys?",
      },
    ],
  },
  {
    id: "detector",
    code: "E2",
    title: "A detector, with conditions",
    dateLine: "June 2026",
    body: "Rahman and Tajdari trained a classifier on GPU telemetry to distinguish training from inference and other work. Baseline accuracy 98.21 percent, plus or minus 0.84. Against evasion strategies from a family it had not seen, 95.2 percent. Against a white-box adversary holding the classifier, after five rounds of co-evolution, 43 to 87 percent. Their evaluation, in their words, “assumes the adversary cannot tamper with NVML readings or performance counter values, nor inject synthetic telemetry to spoof a workload signature.” No shipping GPU provides a telemetry path that satisfies that assumption.",
    source: "Rahman and Tajdari, arXiv 2606.19262, 17 June 2026. Preprint.",
    bearsOn: "classification",
    direction: "standing",
    reveal:
      "The assumption says a verifier can tell training from exempt work at the chip. In 2023 Shavit wrote that no straightforward way existed. In 2026 the best published method reaches 98.21 percent under lab conditions and 43 to 87 percent against a white-box adversary, while assuming a tamper-resistant telemetry path that no shipping GPU provides. That moves the problem from unsolved to unsolved-with-a-measured-shape. If you answered strengthens, you were reading the assumption as a claim about tractability, and the study is real progress in that register. The register the scheme needs is deployed capability, and there the assumption stands exactly where the author left it, now with a price tag attached.",
    hints: [
      {
        direction: "strengthens",
        bearsOn: "classification",
        text: "Who reads the counters, and who owns the machine they run on?",
      },
    ],
  },
  {
    id: "pol",
    code: "E3",
    title: "Proof-of-learning, revisited by its authors",
    dateLine: "2023, standing as of August 2026",
    body: "The 2021 proof-of-learning scheme claimed that forging a training proof requires at least as much work as the training itself. In 2023, a team substantially overlapping the original authors published spoofing attacks that require no training at all, concluding that “one cannot develop a provably robust PoL verification mechanism without further understanding of optimization in deep learning.” The closest published repair, from May 2025, targets an economically rational marketplace adversary and prices forging at 1.1 to 4 times honest proof generation. No repaired scheme is priced against a state.",
    source:
      "Jia et al., IEEE S&P 2021; Fang et al., EuroS&P 2023, arXiv 2208.03567; PoLO, arXiv 2505.12296.",
    bearsOn: "soundness",
    direction: "weakens",
    reveal:
      "The scheme's audit assumes a forged transcript costs more than honest compliance. Proof-of-learning is the nearest formal test of that kind of claim, and its own authors concluded that no provably robust mechanism can currently be built. Shavit's protocol differs in structure, samples segments rather than verifying whole proofs, and no published attack breaks it directly. The reason this still weakens the assumption: the open problem underneath both schemes is the same one, whether optimization trajectories can be faked cheaply, and the only well-studied instance broke. An audit whose soundness rests on an open problem in optimization theory is evidence a lawyer can challenge, and a rival's lawyer will.",
    hints: [],
  },
  {
    id: "distributed",
    code: "E4",
    title: "Training without the building",
    dateLine: "May 2025, plus a trend line",
    body: "Prime Intellect released INTELLECT-2, a 32-billion-parameter model trained through globally decentralized reinforcement learning across contributed hardware. Frontier pretraining remains orders of magnitude larger than anything demonstrated this way. Separately, Ho et al. estimate that the compute needed to reach a fixed language-model capability has halved roughly every 8 months, with a 95 percent confidence interval of about 5 to 14 months.",
    source:
      "INTELLECT-2, arXiv 2505.07291, 12 May 2025; Ho et al., arXiv 2403.05812, NeurIPS 2024.",
    bearsOn: "concentration",
    direction: "weakens",
    reveal:
      "Weakens at the floor, with stated bounds. A 32B-parameter model trained through globally decentralized reinforcement learning is orders of magnitude short of frontier pretraining, and demonstrations are not deployments. But Concentration is not one claim; it is a claim per rule. Against a rule set at the 2026 frontier, this card moves little. Against a fixed FLOP threshold, it compounds with the efficiency trend, compute for fixed capability halving roughly every 8 months, and the run the rule cares about needs fewer chips, less co-located, every year the threshold stays put.",
    hints: [],
  },
  {
    id: "smuggling",
    code: "E5",
    title: "The count, with its error bar",
    dateLine: "March to April 2026",
    body: "Epoch AI estimates a median 660,000 H100-equivalents smuggled cumulatively through 2025, with a 90 percent confidence interval of 290,000 to 1.6 million. The assumed detection rate dominates the uncertainty. In March 2026 the Justice Department charged three people over roughly $510 million of AI servers allegedly diverted to China inside three weeks, with audits allegedly staged past using relabelled dummy servers. Those are allegations in a charging document, not adjudicated findings.",
    source: "Epoch AI, 29 April 2026; DOJ press release, 19 March 2026.",
    bearsOn: "census",
    direction: "weakens",
    reveal:
      "The sampling arithmetic's denominator is the census. The best available estimate of chips outside it is a median of 660,000 H100-equivalents with an interval running from 290,000 to 1.6 million, and the width of that interval is itself the finding: the census error bar is six figures wide before any adversary does anything clever. The March 2026 charges, still allegations, describe audits staged past with a hair dryer and relabelled dummy servers, which is what supply-chain paperwork is worth against an owner who controls the warehouse. If you answered Custody, the confusion is worth naming: the case attacked the record of where chips are, not any chip's own defenses.",
    hints: [
      {
        bearsOn: "custody",
        text: "The case attacked a record of where chips are. Did any chip's own defenses fail?",
      },
    ],
  },
  {
    id: "frontier",
    code: "E6",
    title: "The frontier got bigger and easier to see",
    dateLine: "Retrieved August 2026",
    body: "Epoch AI puts frontier training compute growth at 5x per year since 2020. The largest tracked facility holds roughly 1.1 million H100-equivalents, and the largest single training runs now draw more than 100 megawatts, which makes them among the most observable industrial activities on earth. Grok 3, in February 2025, was the first model in Epoch's dataset estimated above 10^26 FLOP. Epoch revises these figures; the retrieval date matters.",
    source: "Epoch AI dashboards, retrieved 5 August 2026.",
    bearsOn: "concentration",
    direction: "strengthens",
    reveal:
      "Frontier training compute has grown 5x per year, the largest facility holds roughly 1.1 million H100-equivalents, and the largest runs draw over 100 megawatts. Against the runs a pause would most need to catch, Shavit's premise is stronger in 2026 than the day he wrote it: the activity got bigger, hungrier, and harder to hide. Hold this card and E4 together and you have Concentration's real status: intact at the frontier, eroding at any fixed threshold, and the two halves move on different clocks. If you marked this weakens, ask what you were pattern-matching, since the card's facts point one way and the reflex that new evidence must damage old proposals points the other.",
    hints: [
      {
        direction: "weakens",
        text: "Bigger and more visible than 2023. Against which runs does that make the premise stronger?",
      },
    ],
  },
];

export interface ChangeOption {
  id: string;
  text: string;
}

export const CHANGE_OPTIONS: readonly ChangeOption[] = [
  {
    id: "tamper-test",
    text: "A fleet-scale adversarial test of tamper-evident logging, run against a red team with physical possession, and survived.",
  },
  {
    id: "treaty-sampling",
    text: "A treaty article granting unrefusable random chip sampling enters force between rivals.",
  },
  {
    id: "soundness-proof",
    text: "A transcript-verification protocol with proven soundness bounds is published and independently attacked without success.",
  },
  {
    id: "distributed-run",
    text: "A frontier-scale training run is demonstrated across distributed, non-co-located hardware.",
  },
];

export interface RankingBlock {
  lead: string;
  body: string;
}

export const ARGUED_RANKING: readonly RankingBlock[] = [
  {
    lead: "Custody first.",
    body: "Every snapshot, every signature, every clean audit inherits it. With custody broken, the scheme does not fail loudly; it keeps producing evidence, curated by the party under suspicion, which is worse than producing none. The 2026 record prices custody as unpurchased: the guarantees on offer from shipping silicon are defended against a different adversary, and the vendors say so in writing. A collapsing weakness is one that defeats the scheme's purpose while leaving its appearance intact. That is custody, exactly.",
  },
  {
    lead: "Census second, and arguably first.",
    body: "The detection probability is arithmetic on a denominator, and the denominator's error bar is six figures wide. Ranking census first is defensible if you weight the scheme's own promise, detection anywhere on earth, since a hole in the census voids that promise without any chip being attacked. The reason this ranking holds it second: census failures degrade the guarantee's coverage, while custody failures poison the evidence itself, and a regime can partially compensate for coverage with other layers (2.3's whole job) more easily than it can compensate for evidence it cannot trust.",
  },
  {
    lead: "Soundness third.",
    body: "If transcripts can be forged at tolerable cost, audits of declared runs become theater. The scheme still detects undeclared concentrations of compute through the census and sampling, so soundness failure hollows out one product line rather than the factory. It is third rather than lower for one reason: it is the assumption furthest from being repairable on current knowledge, resting on an open problem its nearest formal relative already failed.",
  },
  {
    lead: "Classification fourth.",
    body: "If the chip cannot tell training from exempt work, the design's fallback is expensive rather than fatal: log more, audit more, and accept the confidentiality and cost burden that follows. The assumption's failure raises the price of the scheme; it does not change what clean evidence means.",
  },
  {
    lead: "Concentration fifth, and the one to watch.",
    body: "Today it holds where it matters most, at the frontier, and the audit's sixth card shows it strengthening there. Its erosion is a trend, not an attack: it decays with the efficiency curve rather than by any adversary's spending, and against a fixed threshold that decay is roughly a halving every 8 months. Rankings that put concentration first are betting that curve dominates within the policy's lifetime. Say the bet out loud and the ranking is respectable; leave it implicit and it is a mood.",
  },
  {
    lead: "On the four developments.",
    body: "Each maps to one assumption, and your choice says which failure you consider binding. The surviving fleet-scale tamper test buys custody, and it is the one no lab or vendor has attempted in public. The treaty article buys the census its access and the sampling its legitimacy. The soundness proof buys audits that survive a hostile lawyer. The frontier-scale distributed run does the opposite of the others: it does not repair the scheme, it retires the premise the scheme was built on. Choosing it means you think the right response to this paper is a successor, not a patch.",
  },
];

export const COPY = {
  h1: "The 2026 audit",
  subtitle: "One 2023 proposal, held against what happened next.",
  rebuildHeading: "The machine, from your reading",
  rebuildIntro: [
    "Six mechanisms are listed below. Three are in Shavit's paper. Three belong to other proposals you met earlier in this module.",
    "Sort them. Then, for each of the three you keep, tag the function it performs, using the five functions from 2.1.0.",
    "Work from your annotations. The paper is one tab away, and using it is allowed.",
  ],
  rebuildContinueLocked: "Sort all six to continue",
  rebuildContinue: "Check the machine",
  inScheme: "In the paper",
  notInScheme: "Not in the paper",
  functionLabel: "Which function does it perform?",
  neverDoesTitle: "What the machine never does.",
  neverDoes:
    "Nothing in this design restricts. No license, no off-switch. It produces evidence and hands the response to institutions, which means its hard institutional problem is standing access rather than key custody. Petrie's designs from 2.1.4 made the opposite trade. Keep the difference; the capstone will ask you to choose.",
  softEscape:
    "Sorting first is what makes the audit work. You can move on without it if you would rather.",
  auditHeading: "Three years of evidence",
  auditIntro: [
    "Six things happened after March 2023. Take them in any order.",
    "For each, commit two judgments before the reveal: which assumption it bears on most, and whether it weakens that assumption, strengthens it, or leaves it standing.",
    "The register keeps your record. It is your evidence file for the verdict.",
  ],
  bearsOnLabel: "Bears on",
  commit: "Commit and reveal",
  auditContinueLocked: "Reveal all six to continue",
  auditContinue: "Deliver the verdict",
  registerTitle: "The assumption register",
  registerSubtitle: "Five things the paper needs to be true at the same time.",
  allWeakensNudge:
    "Your record shows six weakenings. One of the six argues the other way. Reread the frontier card before you rank.",
  verdictHeading: "The verdict",
  verdictIntro: [
    "Rank the five assumptions by how much the scheme's promise depends on each one holding, most load-bearing first. Your audit record is on the right.",
    "Then pick the single development below that would most change your assessment, and write one sentence saying why.",
    "There is a defensible order and it is not the only one. The reveal argues. It does not grade.",
  ],
  rankingLabel: "Most load-bearing first",
  moveUp: "Move up",
  moveDown: "Move down",
  changeLabel: "What would most change your assessment?",
  freeTextLabel: "One sentence on why",
  verdictContinue: "See the argued ranking",
  revealHeading: "The argued ranking",
  yourRecord: "Your record",
  hint: "Hint",
  reset: "Reset",
  saved: "Saved to your notebook.",
  footer: "XLab · Verification Track · Interactive Materials",
  durableLesson:
    "The paper's most-quoted number prices the inspectorate. Its least-quoted sentences price the assumptions the inspectorate stands on. Read proposals in the second register.",
  handoff:
    "Module 3 runs this same audit from the other chair. You have been pricing an honest design against a cheater. Next you play the cheater.",
} as const;
