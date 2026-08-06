/* The 27-skill verification graph — a frozen snapshot of the authoring tree
   (verification-skill-tree, rev 1: 27 nodes, 50 edges), lifted verbatim from
   the platform's skills.data.ts.

   Trap: this is a copy on purpose. The authoring tree is editable, and a
   learner map that live-read it would silently rewrite everyone's progress
   the moment someone edited a rung. Re-snapshot deliberately, never fetch.

   A rung is [unitId, "what this unit adds"], and unit ids are the progress
   keys. `mod` indexes moduleNames, `r` is the row band inside that module,
   `lo` indexes objectives.
*/

window.SKILLS = {
  rev: 1,
  /* The graph's own module taxonomy, from the track outline. It is NOT the
     module list in curriculum.ts, which names its modules differently
     (Why / Policy scoping / Infrastructure / Covert / Capstone). Two
     taxonomies, one course — verificationUnitOfLesson is the join, and
     reconciling the names is a content decision. */
  moduleNames: [
    'Foundations',
    'Supply chain',
    'Mechanisms',
    'Evasion',
    'Design',
  ],
  compoundRung: '2.1–2.4',
  compoundUnits: ['2.1', '2.2', '2.3', '2.4'],
  objectives: [
    'Translate commitments into verifiable claims',
    'Map the compute supply chain',
    'Evaluate verification mechanisms',
    'Spot the load-bearing mechanisms',
    'Analyze evasion and response',
    'Communicate for an audience'
  ],
  nodes: [
    { id: "threat", label: "Threat modeling", mod: 0, unit: "0.1", r: 0, lo: [5],
      desc: "Model who might cheat, why, and along which path — from motivations and misuse vs. misalignment to the verifier-aware actor who evades detection, evades attribution, or delays response.",
      rungs: [
      ["0.1", "Root — motivations; misuse vs. misalignment; AI risks."],
      ["0.2", "Timelines and branches."],
      ["0.4", "Relative gains and the security dilemma: why unilateral restraint fails."],
      ["3.0", "The verifier-aware actor: evading detection vs. evading attribution vs. delaying response."]
      ] },
    { id: "options", label: "Policy options", mod: 0, unit: "0.1", r: 0, lo: [1],
      desc: "The menu of responses to the ASI problem — trust, punishment, transparency, verification — and the case that a verified pause is the convergent target among the alternatives.",
      rungs: [
      ["0.1", "Root — the menu: trust, punishment, transparency, verification."],
      ["1.0", "Pause and pause alternatives; relative feasibility."],
      ["1.1", "Pause justification."]
      ] },
    { id: "history", label: "Historical parallels", mod: 0, unit: "0.1", r: 0, lo: [1, 3],
      desc: "Draw lessons — and honest disanalogies — from nuclear, biological, and chemical arms control, with A. Q. Khan as the recurring archetype of the actor who works the seams.",
      rungs: [
      ["0.1", "Nuclear."],
      ["0.3", "IAEA, BWC, CWC; the disanalogies."],
      ["1.2", "A. Q. Khan introduced as archetype — paid off in 3.1."],
      ["2.3", "The empirical anchor: what national intelligence found that routine safeguards missed."],
      ["3.1", "Khan paid off: dual-use legality, working the seams."]
      ] },
    { id: "failure", label: "Identifying failure modes", mod: 0, unit: "0.2", r: 1, lo: [3, 5],
      desc: "For any branch, provision, mechanism, or regime: name where it fails on its own terms — before the section tells you, and before you rely on it.",
      rungs: [
      ["0.2", "Root — why each branch closes badly."],
      ["1.1", "Where a provision fails on its own terms."],
      ["2.1–2.4", "Bucket-specific, commit-first: name the break before the section does — then the residual: what this bucket leaves uncovered and what would have to corroborate it."],
      ["3.0", "Multilayered: the stack as a whole."],
      ["3.1", "Attacks on the machinery: spoofed attestation, TEE compromise, inspector capture."],
      ["3.2", "Regime level."]
      ] },
    { id: "timely", label: "Timeliness", mod: 0, unit: "0.2", r: 1, lo: [3, 5],
      desc: "Verification has to beat the branch clock: judge every layer and regime by how fast it sees a violation, and whether the finding still matters when it lands.",
      rungs: [
      ["0.2", "Root — verification has to beat the branch clock."],
      ["2.0", "How fast each layer could see a violation."],
      ["2.1–2.4", "How fast this bucket sees it."],
      ["3.0", "Delay as an adversary goal in itself."],
      ["4.0", "How fast a regime has to detect for the finding to still matter — set by whatever policy window you are designing for."]
      ] },
    { id: "securit", label: "Securitization", mod: 0, unit: "0.3", r: 1, lo: [4],
      desc: "How an issue leaves normal politics and becomes a security question — and what that window opens, and lets through, when it arrives.",
      rungs: [
      ["0.3", "Root — how an issue leaves normal politics."],
      ["4.1", "What a window opens, and what it lets through."]
      ] },
    { id: "components", label: "Policy components", mod: 1, unit: "1.0", r: 0, lo: [1],
      desc: "Decompose any policy into goal, rule, and claim — actors, objects, activities, conditions — so every later verification question has something exact to attach to.",
      rungs: [
      ["1.0", "Root — goal, rule, claim."],
      ["1.1", "Decompose a real provision: actors, objects, activities, conditions."]
      ] },
    { id: "proxy", label: "Proxy risk", mod: 1, unit: "1.0", r: 0, lo: [1, 3],
      desc: "Every line you draw — compute threshold, capability test, filing requirement — measures something adjacent to what you care about, and invites the actor to game the line itself.",
      rungs: [
      ["1.0", "Root — compute vs. capability thresholds; game the line you just drew."],
      ["2.0", "Every mechanism measures something adjacent to the claim."],
      ["2.1", "Declared workload vs. what actually ran."],
      ["2.2", "The paperwork regime: the filing becomes the thing measured."],
      ["3.1", "Threshold gaming; the seams between jurisdictions and definitions."],
      ["3.2", "Surface the assumptions each side optimizes against."],
      ["4.2", "Scope, thresholds, covered actors."]
      ] },
    { id: "costs", label: "Policy costs", mod: 1, unit: "1.0", r: 0, lo: [3, 4],
      desc: "Every policy, mechanism, and portfolio asks someone to pay — deployment, retrofit, compliance, verification. Say who, and in what currency.",
      rungs: [
      ["1.0", "Root — who pays, in what currency."],
      ["1.1", "Compliance burden vs. verification burden."],
      ["2.1", "Deployment, retrofit, who pays."],
      ["3.2", "What the scaffolded regime costs."],
      ["4.1", "Portfolio budget."],
      ["4.2", "What you are asking whom to pay."]
      ] },
    { id: "decision", label: "Public decisionmakers", mod: 1, unit: "0.4", r: 1, lo: [4, 6],
      desc: "Two-level games, win-sets, veto players: who controls the decision, who must authorize a mechanism, and who runs it once it exists.",
      rungs: [
      ["0.4", "Root — two-level games, win-sets, veto players. (The who-says-yes primer belongs here.)"],
      ["1.2", "States, regulators, intelligence agencies, international bodies: who controls the decision."],
      ["2.1–2.4", "Who must authorize it, who runs it."],
      ["2.3", "Sharing institutions, sources and methods, treaty provisions for national technical means."],
      ["4.1", "Political feasibility: veto players, who runs it, when the window is open."]
      ] },
    { id: "incentives", label: "Incentives", mod: 1, unit: "0.4", r: 1, lo: [2, 5],
      desc: "Information asymmetry and costly signaling — then, for every actor in the regime: the incentive to cooperate, defect, conceal, exaggerate, or free-ride.",
      rungs: [
      ["0.4", "Root — information asymmetry, costly signaling."],
      ["1.2", "Cooperate, defect, conceal, exaggerate, free-ride."],
      ["2.4", "Why an insider reports, or doesn't."],
      ["3.1", "The incentives behind covert development and cheating."],
      ["3.2", "Map actors to incentives."]
      ] },
    { id: "supply", label: "Supply chain", mod: 1, unit: "1.2", r: 1, lo: [2],
      desc: "Map the chain — labs, cloud providers, chip designers, fabs, equipment suppliers, resellers — who holds the evidence, and where the chain narrows enough to attach a control.",
      rungs: [
      ["1.2", "Root — labs, cloud providers, chip designers, fabs, equipment suppliers, resellers: who holds the evidence, and where the chain narrows."],
      ["2.1", "Fab, equipment, and distribution chokepoints: where a control could physically attach."],
      ["2.2", "Providers as the intermediary between customer and machines."],
      ["3.1", "Smuggling, transshipment, proxies and shells, non-signatory hosts."]
      ] },
    { id: "upstream", label: "Upstream / downstream", mod: 1, unit: "1.3", r: 2, lo: [6],
      desc: "Upstream: whose claims a report inherits. Downstream: who has to act on what you write — and how to source a landscape that moves.",
      rungs: [
      ["1.3", "Root — upstream: whose claims a report inherits; downstream: who has to act on what you write."],
      ["4.1", "Sourcing a landscape that moves."]
      ] },
    { id: "dmu", label: "Acting under uncertainty", mod: 1, unit: "1.1", r: 2, lo: [5, 6],
      desc: "Decisionmaking under uncertainty. How much weight a source can carry, what would falsify a claim, and how to grade findings and revise beliefs with reasons.",
      rungs: [
      ["1.1", "Root — falsifiability: what observation would show the rule was broken."],
      ["1.3", "How much weight one source carries."],
      ["2.3", "The heaviest rung in the track: alternative explanations, dual-use ambiguity, base rates, the confidence-rated lead, the proportionate next investigative step."],
      ["3.2", "Grade findings: confirmed, plausible, unresolved, unsupported."],
      ["4.0", "Reopen your sealed 2.0 ranking and revise it with reasons."]
      ] },
    { id: "taxonomies", label: "Mechanism taxonomies", mod: 2, unit: "2.0", r: 0, lo: [3, 4],
      desc: "Sort mechanisms by layer, access, policy goal, lifecycle, and adversary robustness. No single layer covers the claim — which is why there is a taxonomy at all.",
      rungs: [
      ["2.0", "Root — by layer, access, policy goal, lifecycle, adversary robustness. No single layer covers the claim: that is why there is a taxonomy at all."],
      ["4.1", "Re-sort the portfolio."]
      ] },
    { id: "confverif", label: "Secrecy vs. verifiability", mod: 2, unit: "0.2", r: 0, lo: [3],
      desc: "Confidentiality vs. verifiability: enough access to confirm compliance without enabling espionage. What must stay secret, what must be learnable, and how managed access splits the difference.",
      rungs: [
      ["0.2", "Root — the tension introduced."],
      ["0.3", "CWC managed access as the precedent."],
      ["2.0", "The tradeoff at mechanism level."],
      ["2.1", "What an attestation reveals, and to whom."],
      ["2.4", "Managed access, refusal, delay."],
      ["4.2", "The access regime you are proposing."]
      ] },
    { id: "hardware", label: "Hardware mechanisms", mod: 2, unit: "2.1", r: 1, lo: [2, 3],
      desc: "The heaviest bucket in the module: chip identity, roots of trust, secure boot, remote attestation, metering and workload measurement, licensing and authorization, TEEs, proof-of-learning and probabilistic recomputation.",
      rungs: [
      ["2.1", "Chip identity, roots of trust, secure boot, remote attestation, metering and workload measurement, licensing and authorization, TEEs, proof-of-learning and probabilistic recomputation."]
      ] },
    { id: "intel", label: "Intelligence sources", mod: 2, unit: "2.3", r: 1, lo: [3, 5],
      desc: "Physical, financial, and organizational signatures; collection modes; NTM; source protection. Second heaviest — and the bucket the other three lean on when their evidence runs out.",
      rungs: [
      ["2.3", "Physical, financial, and organizational signatures; collection modes; national technical means; source protection."]
      ] },
    { id: "cloud", label: "Cloud mechanisms", mod: 2, unit: "2.2", r: 2, lo: [2, 3],
      desc: "Lighter, corroborating: what the provider position sees, and the registration machinery — KYC, beneficial ownership, reporting — that makes customers legible.",
      rungs: [
      ["2.2", "What the provider position sees; KYC, beneficial ownership, reporting."]
      ] },
    { id: "human", label: "Human sources", mod: 2, unit: "2.4", r: 2, lo: [3, 5],
      desc: "Lighter, corroborating: insider access, declarations, interviews, routine audits vs. challenge inspections — and the protections that make reporting survivable.",
      rungs: [
      ["2.4", "Insider access, declarations, interviews, routine audits vs. challenge inspections, protections."]
      ] },
    { id: "redblue", label: "Red team / blue team", mod: 3, unit: "3.0", r: 0, lo: [5],
      desc: "Break it before you trust it. Red team: design the evasion. Blue team: hold the line — and let the exercise, not the designer, decide what holds.",
      rungs: [
      ["3.0", "Definitions."],
      ["3.2", "Implementation."]
      ] },
    { id: "evasion", label: "Evasion scenarios", mod: 3, unit: "3.1", r: 0, lo: [5],
      desc: "The evasion catalog, ordered by feasibility: every route a determined actor could take around the regime, each with its signatures and its best-placed detector.",
      rungs: [
      ["3.1", "The catalog, ordered by feasibility."]
      ] },
    { id: "swiss", label: "Swiss cheese", mod: 3, unit: "3.1", r: 1, lo: [4, 5],
      desc: "Which layers touch each evasion route, the residual blind spot when every layer works, and the common-mode trap: two layers resting on one declaration are one layer.",
      rungs: [
      ["3.1", "Introduced here: which layers touch each route — and the residual blind spot when every one of them works."],
      ["3.2", "Common-mode failure: two layers resting on one declaration are one layer."],
      ["4.0", "Residual risk after the best single mechanism."],
      ["4.2", "The stack: hardware and intel load-bearing, cloud and human corroborating."]
      ] },
    { id: "enforce", label: "Enforcement", mod: 3, unit: "0.3", r: 1, lo: [5],
      desc: "A finding is not an outcome. What the regime does once it catches someone — thresholds, proportionate response, and the pathway from confirmed finding to consequence.",
      rungs: [
      ["0.3", "Root — Iraq 1991 to the Additional Protocol: what a regime did once it caught someone."],
      ["0.4", "Credible commitment: why promises need consequences attached."],
      ["1.1", "What the provision says happens on breach."],
      ["3.2", "What the regime does about a confirmed finding, and at what threshold."],
      ["4.2", "Pathway and thresholds."]
      ] },
    { id: "tov", label: "Theory of victory", mod: 4, unit: "0.2", r: 0, lo: [1, 4],
      desc: "Define success before designing the machine. Aversion, in time, sufficient for what claim against whom — and how you would know your regime failed.",
      rungs: [
      ["0.2", "Root — define success: aversion, and what counts as in time."],
      ["3.2", "Define success via a blue team that holds."],
      ["4.0", "Sufficiency: enough for what claim, against whom, over what horizon."],
      ["4.2", "What your regime claims to achieve — and how you would know it failed."]
      ] },
    { id: "feasib", label: "Feasibility", mod: 4, unit: "2.0", r: 0, lo: [3, 4],
      desc: "Judge what actually works, when: what a mechanism establishes, technical readiness, cost, durability — then prioritize and sequence a portfolio, flagging every belief that carries an as-of date.",
      rungs: [
      ["2.0", "Root — mechanism intuitions: technical readiness, cost, durability. A sealed ranking, reopened at 4.0."],
      ["2.1–2.4", "What it establishes, technical readiness, deployment cost, durability — and which of these claims carries an as-of date."],
      ["3.2", "The scaffolded regime."],
      ["4.1", "Prioritization and sequencing; durability as a first-class dimension: research skills, future-proofing, discernment, which beliefs carry an as-of date."]
      ] },
    { id: "regime", label: "Regime design", mod: 4, unit: "3.2", r: 1, lo: [1, 2, 3, 4, 5, 6],
      desc: "The capstone: assemble mechanisms, access, timeliness, and enforcement into a complete verification regime — designed by initial critique, then designed and defended in full.",
      rungs: [
      ["3.2", "Design by initial critique."],
      ["4.2", "Design and defend."]
      ] }
  ],
  edges: [
    ["threat", "failure"],
    ["threat", "redblue"],
    ["threat", "evasion"],
    ["threat", "incentives"],
    ["options", "components"],
    ["options", "costs"],
    ["options", "proxy"],
    ["options", "decision"],
    ["options", "tov"],
    ["history", "securit"],
    ["history", "confverif"],
    ["history", "enforce"],
    ["history", "intel"],
    ["failure", "redblue"],
    ["failure", "swiss"],
    ["timely", "regime"],
    ["securit", "feasib"],
    ["components", "dmu"],
    ["components", "enforce"],
    ["components", "supply"],
    ["components", "taxonomies"],
    ["proxy", "redblue"],
    ["costs", "feasib"],
    ["decision", "intel"],
    ["decision", "upstream"],
    ["decision", "feasib"],
    ["incentives", "human"],
    ["incentives", "evasion"],
    ["supply", "hardware"],
    ["supply", "cloud"],
    ["supply", "evasion"],
    ["dmu", "intel"],
    ["dmu", "enforce"],
    ["upstream", "feasib"],
    ["taxonomies", "hardware"],
    ["taxonomies", "intel"],
    ["taxonomies", "cloud"],
    ["taxonomies", "human"],
    ["confverif", "regime"],
    ["hardware", "swiss"],
    ["intel", "swiss"],
    ["cloud", "swiss"],
    ["human", "swiss"],
    ["redblue", "regime"],
    ["redblue", "tov"],
    ["evasion", "swiss"],
    ["swiss", "tov"],
    ["enforce", "regime"],
    ["tov", "regime"],
    ["feasib", "regime"]
  ]
};
