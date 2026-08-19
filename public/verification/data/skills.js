/* The 31-skill verification graph, v2 — authored in this repo from the course
   owner's skill-map document (2026-08-19), which replaced the 27-node snapshot
   of the standalone authoring tree. Every rung was verified against the lesson
   that teaches it during the rewrite; the per-unit map is the document's
   "Dependencies by submodule" and the node copy is the owner's wording,
   verbatim.

   Trap: the editable authoring tree at verification-skill-tree.netlify.app
   still holds the OLD 27-node graph (rev 24 of its store). Never fetch from
   it — this file is the course's source of truth now, and re-seeding that
   site to match is a separate, deliberate act, not a build step.

   A rung is [unitId, "what this unit adds"], and unit ids are the progress
   keys. The one compound rung ("2.1–2.4") fills a quarter per evidence
   bucket. `mod` indexes moduleNames, `r` is the row band inside that module,
   `lo` indexes objectives, `bloom` is [start, end] on Bloom's taxonomy
   (carried in data; the learner UI does not print Bloom levels — that rule
   stands). `goals` is the owner's learner-facing description: [indent, text]
   pairs, indent 1 for a sub-bullet. `opt: true` marks an optional skill
   (Making the case is a capstone option, not required work).

   src/lib/verification/data/skills.ts mirrors ids + rung tags for the
   completion page, and completion-stats.test.ts fails when the two disagree.
   Edit both together, and bump rev when the graph changes shape. */

window.SKILLS = {
  rev: 2,
  /* The graph's own module taxonomy — the owner's band names, which are the
     static site's module chrome. The app track names its modules differently
     (curriculum.ts); verificationUnitOfLesson is the join. */
  moduleNames: [
    "Foundations",
    "Policy and actors",
    "Evidence streams",
    "Covert development",
    "Capstone",
  ],
  compoundRung: "2.1–2.4",
  compoundUnits: ["2.1", "2.2", "2.3", "2.4"],
  /* Single-quoted on purpose: overview.test.ts parses these six labels out
     of this file with a quote-sensitive regex to keep them in step with the
     landing overview's outcomes list. */
  objectives: [
    'Translate commitments into verifiable claims',
    'Map the compute supply chain',
    'Evaluate verification mechanisms',
    'Spot the load-bearing mechanisms',
    'Analyze evasion and response',
    'Communicate for an audience'
  ],
  nodes: [
    /* ---- Module 0 · Foundations ---- */
    { id: "threat", label: "Threat modeling", mod: 0, unit: "0.1", r: 0, lo: [5], bloom: [2, 4],
      goals: [
        [0, "Explain why an actor would cheat: prestige, security, commercial advantage, etc."],
        [0, "Categorize any AI risk scenario into the two buckets of misuse vs. misalignment"],
        [0, "Reason through the security dilemma: why unilateral restraint fails even among actors who all want the same outcome, and why a signed agreement may also fail without a requisite verification regime"]
      ],
      rungs: [
        ["0.1", "Motivations, misuse vs. misalignment, AI risks."],
        ["0.2", "Timelines and urgency: AI 2040, Plan A vs. Plan S."],
        ["0.4", "Relative gains, security dilemma: why unilateral restraint fails."],
        ["3.0", "The covert adversary: verification need not make evasion impossible — and the malicious prover vs. the malicious verifier."]
      ] },
    { id: "options", label: "Policy options", mod: 0, unit: "0.1", r: 0, lo: [1], bloom: [1, 5],
      goals: [
        [0, "Understand the range of different possible agreement responses to the ASI problem, from transparency coordination to a full pause"],
        [0, "Evaluate and sort response buckets on relative effectiveness and feasibility"]
      ],
      rungs: [
        ["0.1", "Root — why an international, verifiable agreement: the response the course bets on."],
        ["1.0", "The eleven buckets, from transparency coordination to full pause — sorted on the feasibility × effectiveness matrix."],
        ["1.1", "The pause agreement made concrete: MIRI's draft."]
      ] },
    { id: "history", label: "Historical parallels", mod: 0, unit: "0.1", r: 0, lo: [1, 3], bloom: [1, 4],
      goals: [
        [0, "Recall key information and patterns from historical precedents including the IAEA, BWC, CWC, nuclear nonproliferation"],
        [0, "Draw analogies (verification, intelligence as the load-bearing mechanism) and disanalogies (nuclear deterrence doesn't work with AI) with such historical precedents"]
      ],
      rungs: [
        ["0.1", "Nuclear: averted nuclear war, and the decades it took to build the verification apparatus."],
        ["0.3", "IAEA safeguards; what it takes to catch a Chinchilla; Iraq and undeclared infrastructure."],
        ["1.2", "The empty institutional shelf: is there a WHO for AI, an IAEA? — what the nuclear institutions hold that AI's don't."],
        ["2.3", "Empirical anchor: what national intelligence found that routine safeguards missed."]
      ] },
    { id: "failure", label: "Identifying failure modes", mod: 0, unit: "0.2", r: 1, lo: [3, 5], bloom: [2, 5],
      goals: [
        [0, "Identify all the ways a verification mechanism or system may fail or produce an undesirable result, including pinpointing vulnerabilities, system flaws, malicious incentives"],
        [1, "Define what failure means and what it's caused by: is the flaw on the level of bad execution, flawed design, or bad actor?"],
        [1, "Identify assumptions each strategy rests on and conclusions that require corroboration to be baseline trustworthy"],
        [0, "Understand and hypothesize different types of attack: spoofed attestation, TEE compromise, inspector capture; the same move scaled up: provision → mechanism → stack → regime"]
      ],
      rungs: [
        ["0.2", "Stress-test Plan A: strongest mechanism, weakest link."],
        ["1.1", "Ambiguities, loopholes, and evasion strategies in a real provision."],
        ["2.1–2.4", "Per bucket: name where it breaks and what it leaves uncovered — the residual another stream must corroborate."],
        ["3.0", "The stack as a whole, and attacks on its machinery: vulnerable premises, the transition where the conclusion doesn't follow."]
      ] },
    { id: "timely", label: "Timeliness", mod: 0, unit: "0.2", r: 1, lo: [3, 5], bloom: [2, 5],
      goals: [
        [0, "Understand and compare how fast each evidence layer could plausibly see a violation, and how fast each individual bucket sees it"],
        [0, "Understand that delaying communication between layers of verification regime as an adversary goal in its own right, separate from concealment"],
        [0, "Derive a required ballpark for detection speed from the policy window you're designing for"]
      ],
      rungs: [
        ["0.2", "Root — verification has to beat the clock: stress-test the timeline."],
        ["2.1–2.4", "How fast this bucket sees it."],
        ["3.0", "The pipeline has a clock: from activity on monitored hardware to a released evaluation result."],
        ["4.0", "How fast a regime has to detect for the finding to still matter — timely vs. obsolete."]
      ] },
    { id: "securit", label: "Securitization", mod: 0, unit: "0.1", r: 1, lo: [4], bloom: [2, 4],
      goals: [
        [0, "Understand, justify, and defend why a particular issue leaves normal politics and becomes a security question due to material existential risk"]
      ],
      rungs: [
        ["0.1", "0.1.1 — the world keeps getting saved: securitize ASI as the risk it is, and the risks of securitizing itself."],
        ["4.1", "The window in motion: China's views on AI safety are changing — quickly."]
      ] },
    { id: "toc", label: "Theory of change", mod: 0, unit: "0.1", r: 2, lo: [1, 6], bloom: [2, 4],
      goals: [
        [0, "Explain how a given project actually contributes to a better world state: the explicit causal pathway from inputs to outputs to short-term, intermediate, and long-term outcomes"],
        [0, "Diagnose fuzzy impact: identify when \"good impact\" claims hide whether a project translates to real-world change (the SSC cancellation as the cautionary case)"],
        [0, "Justify why AI safety specifically cannot afford illegible theories of change: decision-maker skepticism and tight timelines"],
        [0, "Write down and communicate your own theory of change so collaborators, funders, and critics can engage with the reasoning and catch redundant or contradictory efforts"]
      ],
      rungs: [
        ["0.1", "0.1.2 — we need more theories of change: the SSC failure, the elements table, verification's own ToC."]
      ] },
    { id: "quant", label: "Quantitative estimation", mod: 0, unit: "0.2", r: 2, lo: [1, 3], bloom: [2, 4],
      goals: [
        [0, "Memorize total training FLOP as the operative threshold unit, including major reference thresholds from passed and drafted legislation"],
        [0, "Understand base rates and detection statistics"]
      ],
      rungs: [
        ["0.2", "The covert-compute margin: how much compute could hide."],
        ["0.3", "What it takes to catch a Chinchilla: detection statistics."],
        ["1.0", "Total training FLOP as the operative unit; the 10²⁵ and 10²⁶ reference lines."],
        ["2.3", "Base rates: what an alarm rate does across the ~500-site haystack."]
      ] },

    /* ---- Module 1 · Policy and actors ---- */
    { id: "components", label: "Policy components", mod: 1, unit: "1.0", r: 0, lo: [1], bloom: [2, 4],
      goals: [
        [0, "Decompose any written policy or treaty into its actors, objects, activities, conditions"],
        [0, "Identify the underlying goal, legal rule, and normative claims of any policy"]
      ],
      rungs: [
        ["1.0", "Root — goal, rule, claim; actors, objects, activities, conditions."],
        ["1.1", "Decompose a real provision: key verbs — shall, must, may — actors, objects, activities, conditions."]
      ] },
    { id: "proxy", label: "Proxy risk", mod: 1, unit: "1.0", r: 0, lo: [1, 3], bloom: [2, 5],
      goals: [
        [0, "Understand that every line you draw is an imperfect proxy dependent on a certain and impermanent set of assumptions, with compute vs. capability as the worked case"],
        [1, "Surface the assumption(s) each side is optimizing against"],
        [0, "Understand Goodhart's Law and the danger of epistemic drift: the proxy becomes the goal itself → tensions between jurisdictions and definitions as a proxy failure, not a legal one"],
        [1, "Parse a declared workload vs. what actually ran in a paperwork regime where the filing becomes the thing measured"],
        [0, "Identify how a motivated actor can game/circumvent the line once it exists"]
      ],
      rungs: [
        ["1.0", "Compute vs. capability thresholds; game the line you just drew."],
        ["2.0", "Every mechanism measures something adjacent to the claim."],
        ["2.1", "Declared workload vs. what actually ran."],
        ["2.2", "KYC verifies the filing, not the customer — beneficial ownership as the measured proxy."],
        ["3.0", "What the evidence establishes vs. the claim: computations occurred ≠ purpose described ≠ all activity captured."],
        ["4.2", "Scope, thresholds, covered actors."]
      ] },
    { id: "costs", label: "Policy costs", mod: 1, unit: "1.0", r: 0, lo: [3, 4], bloom: [2, 4],
      goals: [
        [0, "Identify who pays in the enforcement or circumvention of any policy, and in what currency: money, sovereignty, confidentiality, time, human capital, political capital"],
        [0, "Understand and fill out compliance burden vs. verification burden as separate ledgers"],
        [0, "Tactfully budget a limited resource portfolio to optimize for verification robustness"]
      ],
      rungs: [
        ["1.0", "Root — who pays, in what currency."],
        ["2.1", "Deployment, retrofit, who pays."],
        ["3.0", "What low-trust itself costs: redundant computation, replay, the apparatus both parties must build."],
        ["4.2", "The hard constraint: budget ceiling, inspection quota — what you are asking whom to pay."]
      ] },
    { id: "decision", label: "Public decisionmakers", mod: 1, unit: "0.4", r: 1, lo: [4, 6], bloom: [2, 4],
      goals: [
        [0, "Understand and recreate two-level games, win-sets, veto players"],
        [0, "Understand who controls a decision vs. who must authorize a mechanism vs. who runs it"],
        [0, "Understand the benefits and potential dangers of sharing institutions, knowledge, resources, methods, treaty provisions for national technical means"],
        [0, "Recall and justify the most impactful public state players in the AI race"]
      ],
      rungs: [
        ["0.4", "Root — two-level games, win-sets, veto players."],
        ["1.2", "States, regulators, intelligence agencies, international bodies; who controls the decision."],
        ["2.1–2.4", "Who must authorize it, who runs it."],
        ["2.3", "Sharing institutions, sources and methods, treaty provisions for national technical means."],
        ["4.1", "The political-feasibility metric: would the parties whose cooperation is required adopt and enforce it."]
      ] },
    { id: "incentives", label: "Incentives", mod: 1, unit: "0.4", r: 1, lo: [2, 5], bloom: [2, 4],
      goals: [
        [0, "Map every actor in a regime to the move they're being paid to make, with the five moves available to any actor: cooperate, defect, conceal, exaggerate, free-ride"],
        [1, "Why an insider may or may not report a violation"],
        [1, "Who may covertly develop, steal weights, or game thresholds, and why"],
        [0, "Understand information asymmetry and costly signaling as the underlying primitives to incentive mapping"]
      ],
      rungs: [
        ["0.4", "Root — information asymmetry, costly signaling."],
        ["1.2", "Cooperate, defect, conceal, exaggerate, free-ride."],
        ["2.4", "Why an insider reports, or doesn't."],
        ["3.0", "The low-trust assumption itself: what a malicious prover, and a malicious verifier, would each try."]
      ] },
    { id: "supply", label: "Supply chain", mod: 1, unit: "1.2", r: 1, lo: [2], bloom: [2, 4],
      goals: [
        [0, "Memorize the in-order upstream chain of equipment suppliers, fabs, chip designers, cloud providers, resellers, labs"],
        [1, "Understand and justify where the chain narrows enough for a control to attach — fab, equipment, distribution"],
        [0, "Identify weak points for exploitation or circumvention in the chain: smuggling, transshipment, proxies and shells, non-signatory hosts"]
      ],
      rungs: [
        ["1.2", "Labs, cloud providers, chip designers, fabs, equipment suppliers, resellers; who holds the evidence; where the chain narrows."],
        ["2.1", "Shavit's decomposition: supply-chain monitoring against untracked chips — declared-run verification vs. fleet completeness."],
        ["2.2", "Providers as the intermediary between customer and machines."],
        ["3.0", "The unmonitored margin: hardware outside the perimeter."]
      ] },
    { id: "upstream", label: "Upstream / downstream", mod: 1, unit: "1.3", r: 2, lo: [6], bloom: [2, 4],
      goals: [
        [0, "Identify and justify upstream actors of a given artifact: whose claims a report is silently inheriting"],
        [0, "Identify and justify downstream actors of a given artifact: who has to act on what you write, and what they need in order to act"]
      ],
      rungs: [
        ["1.3", "Root — whose claims a report inherits; who has to act on what you write."],
        ["4.1", "Sourcing a landscape that moves."]
      ] },
    { id: "dmu", label: "Acting under uncertainty", mod: 1, unit: "1.1", r: 2, lo: [5, 6], bloom: [2, 5],
      goals: [
        [0, "Understand and apply the concept of falsifiability to claims: what observation would show the rule was broken?"],
        [0, "Identify alternative explanations, dual-use ambiguity, base rates"],
        [0, "Write a confidence-rated lead and choosing a proportionate next investigative step"],
        [0, "Grade findings as: confirmed, plausible, unresolved, or unsupported"],
        [0, "Proportionately and efficiently revise a belief you already committed to with the reception of new information, justifying why"]
      ],
      rungs: [
        ["1.1", "Evidentiary thresholds: what evidence would assess compliance."],
        ["1.3", "How much weight one source carries: verified yourself vs. inherited from the actor being checked."],
        ["2.3", "Heaviest rung in the track: alternative explanations, dual-use ambiguity, base rates, confidence-rated lead, proportionate next investigative step."],
        ["3.0", "Established / supported but not established / not established — justify every classification."],
        ["4.1", "The Intuition Check: reopen your 2.0 ranking and revise it with reasons."]
      ] },
    { id: "writing", label: "Policy writing", mod: 1, unit: "1.2", r: 2, lo: [6], bloom: [3, 6],
      goals: [
        [0, "Argue the centrality of verification in audience-appropriate language, scope a policy for a particular decisionmaker and provide actionable, justifiable steps"],
        [0, "Communicate uncertainty via graded findings, resource constraints, necessary heuristics"]
      ],
      rungs: [
        ["1.2", "The report constructor: one inspection, three readers — assemble from the detail pool, each component linked to the audience that needs it."],
        ["2.3", "Write the assessment: confidence attached, next step proportionate."],
        ["4.1", "The defended-ranking memo."],
        ["4.2", "The governance artifact in a working format: treaty text, policy memo, research proposal."]
      ] },

    /* ---- Module 2 · Evidence streams ---- */
    { id: "taxonomies", label: "Mechanism taxonomies", mod: 2, unit: "2.0", r: 0, lo: [3, 4], bloom: [3, 3],
      goals: [
        [0, "Understand five categories of mechanism sorting and when each is most appropriate: layer, access, policy goal, lifecycle, adversary robustness"],
        [0, "Re-sort a portfolio given the reception of new information"]
      ],
      rungs: [
        ["2.0", "By layer, access, policy goal, lifecycle, adversary robustness; no single layer covers the claim — and the taxonomy you pick depends on your audience."]
      ] },
    { id: "confverif", label: "Confidentiality vs. verifiability", mod: 2, unit: "0.2", r: 0, lo: [3], bloom: [2, 5],
      goals: [
        [0, "Understand and justify the core tension of the verifier's paradox: you need enough access to confirm compliance without enabling espionage"],
        [0, "Understand the strengths and weaknesses of privacy-preserving verification mechanisms: hardware attestation, ZKPs, secure multiparty computation, managed access"]
      ],
      rungs: [
        ["0.2", "Intro — what evidence inspectors can collect, how much of the ecosystem must remain visible."],
        ["2.0", "The confidentiality cost inside political feasibility: intrusiveness as the price of evidence."],
        ["2.1", "What attestation and confidential computing protect — and the confidentiality dependencies a hardware role carries."],
        ["2.4", "Managed access, refusal, delay."],
        ["4.2", "The access regime you are proposing."]
      ] },
    { id: "hardware", label: "Hardware mechanisms", mod: 2, unit: "2.1", r: 1, lo: [2, 3], bloom: [2, 3],
      goals: [
        [0, "Understand the mechanisms of: chip identity, roots of trust, secure boot, remote attestation, metering and workload measurement, licensing and authorization, TEEs"],
        [0, "Understand and justify the concept of proof-of-learning and probabilistic recomputation"],
        [0, "In evasion or covert development scenarios, identify which hardware signals work vs. break"]
      ],
      rungs: [
        ["2.1", "Chip identity, roots of trust, secure boot, remote attestation, metering and workload measurement, licensing and authorization, TEEs, proof-of-learning and probabilistic recomputation."]
      ] },
    { id: "intel", label: "Intelligence sources", mod: 2, unit: "2.3", r: 1, lo: [3, 5], bloom: [2, 3],
      goals: [
        [0, "Understand physical, financial, and organizational signatures; different collection modes and national technical means; source protection, and what it costs the regime"],
        [0, "In evasion or covert development scenarios, identify which footprints (power, procurement, finance, organization) each route still leaves for collection"]
      ],
      rungs: [
        ["2.3", "Physical, financial, and organizational signatures; collection modes; NTM; source protection."]
      ] },
    { id: "cloud", label: "Cloud mechanisms", mod: 2, unit: "2.2", r: 2, lo: [2, 3], bloom: [2, 3],
      goals: [
        [0, "Understand what the provider position can see, and what it structurally cannot; the registration machinery of KYC, beneficial ownership, reporting"],
        [0, "In evasion or covert development scenarios, identify how proxies, shells, and reseller chains affect the efficacy of KYC"]
      ],
      rungs: [
        ["2.2", "What the provider position sees; KYC, beneficial ownership, reporting."]
      ] },
    { id: "human", label: "Human sources", mod: 2, unit: "2.4", r: 2, lo: [3, 5], bloom: [2, 3],
      goals: [
        [0, "Understand the mechanisms of insider access, declarations, interviews, routine audits vs. challenge inspections, and reporting protections"],
        [0, "In evasion or covert development scenarios, identify which link(s) — reporter, intermediary transmitter, verifier — are affected"]
      ],
      rungs: [
        ["2.4", "Insider access, declarations, interviews, routine audits vs. challenge inspections, protections."]
      ] },

    /* ---- Module 3 · Covert development ---- */
    { id: "evasion", label: "Evasion scenarios", mod: 3, unit: "3.0", r: 0, lo: [5], bloom: [4, 5],
      goals: [
        [0, "Understand the catalog of routes around the regime ordered by feasibility, the signature each route leaves, and its best-placed detector"],
        [0, "Evaluate the relative feasibility metrics of different verification methods and evasion strategies against each other in applied, case-based context"]
      ],
      rungs: [
        ["3.0", "Evasion against a concrete architecture: undeclared workloads, activity outside the monitored perimeter."],
        ["4.1", "The evasion bench: classify four evasion schemes, survive the statistics trap."]
      ] },
    { id: "swiss", label: "Swiss cheese", mod: 3, unit: "2.0", r: 1, lo: [4, 5], bloom: [4, 5],
      goals: [
        [0, "Understand the Swiss Cheese concept: no one layer is foolproof, so trust in the imperfect but more reliable corroboration of redundant layers"],
        [0, "Identify which layers touch which evasion route(s), as well as the biggest residual blind spot that remains even if every layer works as designed"],
        [0, "Identify and explain a common-mode failure: two layers resting on one declaration are one layer"]
      ],
      rungs: [
        ["2.0", "Introduced here: combine layers whose holes don't line up — different information, different actors, different access assumptions."],
        ["3.0", "Common-mode failure: analog controls, unilateral TCBs, redundancy, cross-checks — do the layers rest on one declaration?"],
        ["4.0", "Residual risk after the best single mechanism — which evasion routes stay viable, and which actors can afford them."],
        ["4.2", "The stack: hardware and intel load-bearing, cloud and human corroborating."]
      ] },
    { id: "enforce", label: "Enforcement", mod: 3, unit: "0.3", r: 1, lo: [5], bloom: [2, 5],
      goals: [
        [0, "Understand that a finding must be eventually translated into actionable change in order to be effective, i.e., credible commitment"],
        [0, "Trace the pathway from confirmed finding to consequence for any finding, and the threshold that triggers it"]
      ],
      rungs: [
        ["0.3", "Root — Iraq 1991 and undeclared infrastructure: what a regime did once it caught someone."],
        ["0.4", "Credible commitment: why promises need consequences attached."],
        ["1.1", "What the treaty's provisions attach to a violation."],
        ["3.0", "Where the architecture hands off: can a detected anomaly be attributed to deliberate evasion?"],
        ["4.2", "Pathway and thresholds."]
      ] },

    /* ---- Module 4 · Capstone ---- */
    { id: "tov", label: "Theory of victory", mod: 4, unit: "0.2", r: 0, lo: [1, 4], bloom: [2, 5],
      goals: [
        [0, "Define success as the first priority before designing the machine: threshold, range, continual outcome?"],
        [1, "Measure sufficiency: enough for what claim, against whom, over what horizon"],
        [1, "Define success as the lack thereof: how would you know your regime had failed?"]
      ],
      rungs: [
        ["0.2", "What a successful slowdown looks like, concretely — Plan A as a definition of success."],
        ["3.0", "What the system must achieve: detection and deterrence, not impossibility."],
        ["4.0", "Sufficiency: enough for what claim, against whom, over what horizon."],
        ["4.2", "What your regime claims to achieve — and how you would know it failed."]
      ] },
    { id: "feasib", label: "Feasibility", mod: 4, unit: "2.0", r: 0, lo: [3, 4], bloom: [3, 5],
      goals: [
        [0, "Define and evaluate any mechanism on the following four metrics of feasibility:"],
        [1, "Technical feasibility"],
        [1, "Political feasibility"],
        [1, "Verification effectiveness"],
        [1, "Durability"],
        [0, "Differentiate what a mechanism establishes in reality vs. what it's claimed to establish"]
      ],
      rungs: [
        ["2.0", "The four metrics: technical, political, effectiveness, durability; sealed ranking — reopened in 4.1."],
        ["2.1–2.4", "What it establishes vs. what it's claimed to establish; readiness, cost, durability — per bucket."],
        ["3.0", "Q8's ladder: established capability, proof of concept, inference from related tech, untested proposal, aspiration."],
        ["4.1", "The four metrics applied with discernment; which beliefs carry an as-of date."]
      ] },
    { id: "research", label: "Research", mod: 4, unit: "4.1", r: 0, lo: [3], bloom: [3, 5],
      goals: [
        [0, "Scope a project as an expected-value calculation: importance * possibility, with neglectedness as a heuristic for tractability, and a realistic version you'd still believe in"],
        [1, "Only pursue questions whose answers are action-relevant"],
        [0, "Identify the tractable sub-question inside an intractable one, and the proxy that operationalizes it"],
        [0, "Distinguish the ideal evidence you wish you had from the evidence that is easy to acquire"]
      ],
      rungs: [
        ["4.1", "4.1.1 — project selection and scoping, the thinking process, the non-thinking process."]
      ] },
    { id: "regime", label: "Regime design", mod: 4, unit: "3.0", r: 1, lo: [1, 2, 3, 4, 5, 6], bloom: [5, 6],
      goals: [
        [0, "Assemble mechanisms, access, timeliness, and enforcement into one complete regime"],
        [0, "Defend the result against a red team and revise accordingly"]
      ],
      rungs: [
        ["3.0", "Reconstruct a complete regime: assumptions, mechanisms, intended results — design by critique."],
        ["4.2", "Design and defend."]
      ] },
    { id: "mcase", label: "Making the case", mod: 4, unit: "4.2", r: 1, lo: [6], bloom: [4, 6], opt: true,
      goals: [
        [0, "Earn the next fifteen seconds from someone who has not read your work and did not ask for it"],
        [1, "Know your audience: what this person does, by when, at what cost, and what you are not asking for"],
        [1, "Locate your recommendation inside what a specific decisionmaker already wants, rather than beside it"],
        [0, "Effectively deliver one recommendation multiple ways — to a member, a committee staffer, and an appropriator"]
      ],
      rungs: [
        ["4.2", "Capstone option: the cold pitch — your own recommendation, to a decisionmaker who has not read it."]
      ] }
  ],
  edges: [
    ["threat", "failure"],
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
    ["failure", "swiss"],
    ["timely", "regime"],
    ["securit", "feasib"],
    ["toc", "tov"],
    ["toc", "research"],
    ["quant", "proxy"],
    ["quant", "dmu"],
    ["components", "dmu"],
    ["components", "enforce"],
    ["components", "supply"],
    ["components", "taxonomies"],
    ["proxy", "evasion"],
    ["costs", "feasib"],
    ["decision", "intel"],
    ["decision", "upstream"],
    ["decision", "feasib"],
    ["decision", "mcase"],
    ["incentives", "human"],
    ["incentives", "evasion"],
    ["incentives", "mcase"],
    ["supply", "hardware"],
    ["supply", "cloud"],
    ["supply", "evasion"],
    ["upstream", "feasib"],
    ["upstream", "writing"],
    ["upstream", "mcase"],
    ["dmu", "intel"],
    ["dmu", "enforce"],
    ["dmu", "writing"],
    ["dmu", "research"],
    ["dmu", "mcase"],
    ["writing", "regime"],
    ["writing", "mcase"],
    ["taxonomies", "hardware"],
    ["taxonomies", "intel"],
    ["taxonomies", "cloud"],
    ["taxonomies", "human"],
    ["confverif", "regime"],
    ["hardware", "swiss"],
    ["intel", "swiss"],
    ["cloud", "swiss"],
    ["human", "swiss"],
    ["evasion", "swiss"],
    ["swiss", "tov"],
    ["enforce", "regime"],
    ["tov", "regime"],
    ["feasib", "regime"],
    ["research", "feasib"],
    ["regime", "mcase"]
  ]
};
