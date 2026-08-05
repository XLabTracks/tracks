/* GENERATED FILE — do not edit by hand.
   Source: verification-capstones/*.md
   Regenerate: npm run verification:capstones
   21 capstone(s). Ordering and formatting are deterministic so
   CI can diff this file against a fresh build. */
window.CAPSTONE_BANK = {
  "count": 21,
  "entries": [
    {
      "slug": "cloud-kyc-regime",
      "source": "verification-capstones/cloud-kyc-regime.md",
      "title": "A Cloud KYC Regime That Is Not Just Paperwork",
      "track": "Verification",
      "status": "draft",
      "summary": "Module 2.2 warns that self-reporting alone is a paperwork regime. Design the cloud reporting rules for one provider so that at least one claim in them is actually checkable.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Reporting-rule spec with a per-claim checkability rating and the evasion routes it leaves open",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The national regulator drafting the reporting obligation, and the provider who has to implement it.",
      "skills": [
        "regime design",
        "telemetry analysis",
        "evasion modelling",
        "cost-of-compliance analysis"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.2 — the cloud layer",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025)",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "Technical AI Governance project site — Stanford",
          "href": "https://taig.stanford.edu/"
        },
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024)",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §2.2",
          "href": null
        },
        {
          "label": "verification-track-outline.md §3 (evasion scenarios 1, 6, 8)",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The cloud layer is the one place in the stack where a commercial party already sits between the customer and the machines, already runs KYC for other reasons, and already has the telemetry. Module 2.2 rates it <em>very partially solved</em> — proxies, fragmented accounts, reseller chains and jurisdictional gaps eat most of the promise, and the standing warning is that self-reporting alone produces a paperwork regime.</p>\n<p>Write the reporting rules for one provider in one jurisdiction so that they are not that.</p>\n<ul><li><strong>The obligations.</strong> What the provider declares, about whom, how often, to which of the three levels — company, national regulator, intelligence — and under what penalty for misdeclaration.</li><li><strong>The checkability rating.</strong> The core of the deliverable. Per obligation: is the claim <em>self-reported only</em>, <em>cross-checkable against a second source</em>, or <em>independently observable</em>? Module 2.2 gives you the second column to work with — power draw, cooling, interconnect use, procurement, satellite-visible buildout — against the things that are easy to fake: identity, declared purpose, workload labels, logs.</li><li><strong>The evasion routes left open.</strong> Specifically proxy organisations, false reporting and sub-threshold distributed training. For each, what your rules would and would not catch.</li><li><strong>The cost.</strong> What compliance costs the provider, and what it costs the customers who are not doing anything wrong. A rule that pushes ordinary workloads offshore has made verification worse.</li><li><strong>The one rule you would keep.</strong> If the regulator could only have a single obligation, which one, and why that one buys the most.</li></ul>\n<h3>Why it exists</h3>\n<p>This is the track's central discipline applied to the layer where it is easiest to fool yourself. Cloud reporting <em>looks</em> like verification: there are forms, there are logs, there is a regulator receiving them. Module 2.2's warning is that the whole apparatus can be exactly as strong as the honesty of the party filling it in, unless some claim in it is anchored to something the party does not control.</p>\n<p>Finding that anchor — and being honest about how few of your obligations have one — is the skill. It is also the skill that transfers directly to the Module 4 capstone, where the same question gets asked of a whole regime.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one provider archetype and one jurisdiction, public reporting on cloud infrastructure and datacentre buildout, and the track's evasion taxonomy.</p>\n<p><strong>Out of scope:</strong> the international layer. You are writing a national reporting obligation, not a treaty; who else could see the reports is a Module 4 question.</p>\n<p><strong>Also out of scope:</strong> inventing telemetry. Work with what a provider plausibly has or could add cheaply. A rule requiring a capability nobody has built is a research agenda, not a regime — cite it as a successor rule and move on.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Obligations</td><td>A list of things to report</td><td>Each one tied to what a verifier would then be able to conclude</td></tr><tr><td>Checkability</td><td>Assumed</td><td>Rated per obligation, with the second source named where one exists</td></tr><tr><td>Evasion</td><td>\"Bad actors could evade\"</td><td>The three named routes, each with what your rules catch and miss</td></tr><tr><td>Cost</td><td>Ignored</td><td>Priced for the provider <em>and</em> the compliant customer, with the rule you would drop first</td></tr></tbody></table></div>\n<p>If every obligation in your spec comes out cross-checkable, you have been generous with yourself. Most reporting regimes are mostly self-reported, and saying so is the finding.</p>\n<h3>Getting started</h3>\n<ol><li>Build the fakeable / not-easily-fakeable table from Module 2.2 before drafting a single obligation. It determines which rules are worth writing.</li><li>Draft the proxy-organisation evasion first. It is the route that most cleanly defeats account-level KYC, and confronting it early stops you from writing a spec that only works against honest customers.</li><li>Ask the cost question of every obligation as you add it. The regime that survives is the short one.</li></ol>"
    },
    {
      "slug": "cohort-tabletop-design",
      "source": "verification-capstones/cohort-tabletop-design.md",
      "title": "Design a Cohort Tabletop Exercise",
      "track": "Cross-track",
      "status": "ready",
      "summary": "Build a runnable three-hour tabletop for the next cohort — roles, injects, scoring, and a facilitator guide someone else can run without you.",
      "team": {
        "min": 3,
        "max": 5,
        "label": "3–5 people",
        "bucket": "Team of 4+"
      },
      "effort": {
        "min": 20,
        "max": 26,
        "label": "20–26 hrs",
        "bucket": "Over 20 hrs"
      },
      "duration": {
        "label": "4 weeks",
        "weeks": 4
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "advanced",
      "deliverable": "Facilitator pack — scenario, role cards, inject schedule, debrief guide",
      "deliverableType": "design",
      "mentor": "required",
      "audience": "A facilitator running the exercise with no contact with its designers.",
      "skills": [
        "scenario design",
        "facilitation",
        "role construction",
        "playtesting",
        "instructional design"
      ],
      "prerequisites": [
        "Any track",
        "weeks 1-7 complete"
      ],
      "sources": [
        {
          "label": "Tracks Platform - Design Document.md",
          "href": null
        },
        {
          "label": "[Public] XLab Tracks - Program Proposal.md",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Design a three-hour tabletop that teaches one governance mechanism by making a group of six to ten people live inside it. Then hand it to a facilitator who was not in the room while you built it, and watch.</p>\n<p>The pack contains:</p>\n<ul><li><strong>The scenario.</strong> A situation with a real decision under time pressure, set close enough to the present to be legible and far enough to avoid litigating today's headlines.</li><li><strong>Role cards.</strong> Each role gets private objectives, private information, and a constraint that makes the obvious move costly. Roles must be playable by someone who has done the reading and nothing more.</li><li><strong>The inject schedule.</strong> What lands at minute 20, 55, 90 — and the branch conditions for each.</li><li><strong>Scoring or judgement.</strong> How the room learns whether it did well. This can be a scoring rule or a structured facilitator verdict, but it cannot be \"we discuss how it went\".</li><li><strong>The debrief guide.</strong> The three questions that convert the experience into a transferable lesson, plus the two arguments the room will predictably have and how to use them.</li></ul>\n<h3>Why it exists</h3>\n<p>The program's bet is that scaffolding should fade until the learner is the adult in the room. Designing the exercise other people learn from is the furthest end of that fade — you cannot build a working tabletop without holding the mechanism, the actors, and the failure modes simultaneously.</p>\n<p>It is also the one capstone that produces reusable program assets. A pack that survives playtesting goes into the facilitator guide.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one mechanism, three hours, six to ten players, paper and a whiteboard. Two playtests minimum — one internal, one with players who have not seen the design.</p>\n<p><strong>Out of scope:</strong> software. If the exercise needs a custom app to run, it is out of scope for a four-week capstone and the design is doing too much.</p>\n<p>Ambition warning: this is the largest capstone in the bank and the only one that requires a team of three or more. It is not a lighter option than writing a memo.</p>\n<h3>What good looks like</h3>\n<ul><li>A facilitator with the pack and no other context runs it successfully. This is the test; everything else is preparation for it.</li><li>Playtest findings appear in the final pack as changes, with a short log of what you changed and why.</li><li>The debrief lands the mechanism, not the drama. Players should leave able to state what the mechanism does and where it breaks.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Choose the mechanism by asking what your cohort argued about most. Live disagreement is fuel.</li><li>Write one role card fully before designing the scenario. Roles constrain scenarios more than the reverse.</li><li>Playtest at half scale in week 2, with an unfinished pack. Waiting until it is polished wastes the playtest.</li></ol>"
    },
    {
      "slug": "compliance-without-disclosure",
      "source": "verification-capstones/compliance-without-disclosure.md",
      "title": "Prove Compliance Without Handing Over the Model",
      "track": "Verification",
      "status": "draft",
      "summary": "Module 2.0's whole problem in one artifact — pick one claim a developer must prove, and specify how to prove it without disclosing weights, data, or a trusted enclave.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 16,
        "max": 22,
        "label": "16–22 hrs",
        "bucket": "Over 20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "advanced",
      "deliverable": "Protocol sketch for one claim, with the trust assumptions and the residual disclosure named",
      "deliverableType": "spec",
      "mentor": "required",
      "audience": "The regulator who needs the assurance and the developer who cannot hand over the asset.",
      "skills": [
        "protocol reasoning",
        "trust-assumption analysis",
        "cryptographic literacy",
        "feasibility assessment"
      ],
      "prerequisites": [
        "Verification 2.0 — confidentiality vs verifiability",
        "Verification 2.1 — the hardware layer",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), verification questions: what methods can verify compute usage without TEEs; can ZKPs demonstrate compliance without disclosing architectural details; how can TEEs be designed to limit misuse",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 75: using compute for verifiable claims and assurances",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §2.0",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.0 sets out the layer that confirms a claim without surrendering the secret: hardware-anchored attestation, zero-knowledge proofs, secure multiparty computation — and, when none of those is ready, the institutional fallback of managed access. Pick one claim and work the whole stack against it.</p>\n<p>Choose a claim of the form <em>\"this training run used no more than X\"</em>, <em>\"this model was trained without dataset D\"</em>, or <em>\"the deployed model is the one that was evaluated\"</em>. Then:</p>\n<ul><li><strong>The three routes.</strong> Sketch how the claim could be established (a) with a trusted execution environment, (b) with a cryptographic protocol and no trusted hardware, (c) with managed access — a human inspector under confidentiality, which is what the chemical-weapons regime settled on when the cryptography did not exist.</li><li><strong>The trust assumptions.</strong> Per route, exactly who must be trusted and about what. TEEs move trust to the silicon vendor; a protocol moves it to an implementation and a setup; managed access moves it to an institution and a person. None of them removes trust, and saying where it went is the core of the deliverable.</li><li><strong>The residual disclosure.</strong> What the verifier learns beyond the claim. Every route leaks something — timing, size, the fact that a query was made — and a regime that promised zero disclosure and delivers some has a credibility problem, not a technical one.</li><li><strong>The misuse read.</strong> TAIG asks this directly: verification infrastructure built for compliance is surveillance infrastructure pointed somewhere else. Say what your route could be repurposed to do, and what constrains it.</li><li><strong>The verdict.</strong> Which route you would build now, which in five years, and what you would tell a regulator who asked for the assurance today.</li></ul>\n<h3>Why it exists</h3>\n<p>This is Module 2.0's question at full weight, and it is the hardest capstone in the Verification track — the only one marked advanced. The reason is that the tempting answers are all wrong in the same way: they relocate trust and describe that as removing it.</p>\n<p>It is also live. The claims above are exactly the ones frontier safety frameworks and draft regimes assume can be established, and the assumption is mostly unexamined.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the published literature on ZKPs for ML, TEEs on accelerators, proof-of-learning, secure multiparty computation, and arms-control managed access as the institutional comparison.</p>\n<p><strong>Out of scope:</strong> implementing anything, and novel cryptography. You are assessing feasibility and trust structure, not building a protocol. Cite the primitives; do not invent them.</p>\n<p><strong>A concrete warning.</strong> The literature here is fast-moving and full of results that hold under assumptions the governance use-case breaks — most obviously, schemes that assume an honest prover, when the whole point is that the prover is the party you are checking. Flag every such assumption where you find it.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The claim</td><td>\"Verify compliance\"</td><td>One claim, stated precisely enough to be provable or not</td></tr><tr><td>Trust</td><td>\"Trustless verification\"</td><td>Per route, who is trusted about what, stated plainly</td></tr><tr><td>Residual disclosure</td><td>Claimed to be zero</td><td>Named per route, including the metadata leaks</td></tr><tr><td>Verdict</td><td>Picks the most elegant route</td><td>Picks the one available now, and says what it costs in assurance</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the claim in one sentence and keep rewriting until it is falsifiable. Most of this literature's confusion is claims that were never pinned down.</li><li>Do the managed-access route first. It is the least glamorous and the only one that has ever actually run, and it calibrates the other two.</li><li>For every scheme you cite, find its threat model and check whether the prover is assumed honest. That single check reorders the whole assessment.</li></ol>"
    },
    {
      "slug": "compute-chain-of-custody",
      "source": "verification-capstones/compute-chain-of-custody.md",
      "title": "Steal a Chain of Custody From Another Industry",
      "track": "Verification",
      "status": "draft",
      "summary": "Other industries already track dangerous things through many hands. Take one working custody regime apart and report what transfers to compute — and what does not.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 18,
        "label": "14–18 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈5 hrs/wk",
      "difficulty": "core",
      "deliverable": "Case study of one custody regime plus a transfer analysis for the compute supply chain",
      "deliverableType": "dossier",
      "mentor": "optional",
      "audience": "Whoever is designing chip tracking and does not want to reinvent forty years of practice.",
      "skills": [
        "analogical reasoning",
        "regime analysis",
        "stock-and-flow accounting",
        "precedent critique"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.1 — the hardware layer"
      ],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), ideas 65-66: stock and flow accounting case studies; learning from chain of custody applications in other industries",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025)",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §2.1",
          "href": null
        },
        {
          "label": "supply-chain-map.html",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Chip registries and supply-chain tracking sit in Module 2.1 as proposals. Other sectors have been doing custody accounting for decades, under adversarial pressure, with audits and penalties: nuclear material accountancy, controlled pharmaceuticals, conflict minerals, firearms, hazardous waste, precursor chemicals. Pick one and take it apart.</p>\n<ul><li><strong>The case study.</strong> How the regime actually works. What is the unit of account, who records a transfer, what triggers reconciliation, what happens when the books do not balance, and what the measured discrepancy rate is — every real regime has one, and it is the most useful number in your dossier.</li><li><strong>The failure history.</strong> How the regime has been defeated, and what it changed in response. Regimes are shaped by their scandals; the current design is unreadable without them.</li><li><strong>The transfer analysis.</strong> Feature by feature: what carries over to high-end AI accelerators and what does not. Compute has properties these regimes did not face — units that are useful individually rather than in bulk, a legitimate second-hand market, rapid obsolescence, a supply chain with a handful of upstream nodes and thousands of downstream ones, and the fact that the thing you ultimately care about is a workload, not an object.</li><li><strong>The recommendation.</strong> One mechanism worth importing, one worth explicitly rejecting, and the reason for each.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's method is to ask what each mechanism can actually prove. Custody accounting is the mechanism the compute-governance literature reaches for most casually and has studied least, and the sectors that do it have already found the failure modes — usually the boring ones, involving paperwork and reconciliation intervals rather than clever attacks.</p>\n<p>Analogical reasoning done properly is also a track-level skill: it is the same move as the treaty-clause capstone, where the disanalogies are the deliverable. An analogy whose limits you have mapped is a tool. One you have not is a way to be confidently wrong.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one custody regime, its public regulations, audit reports and academic evaluations, plus the compute supply-chain material from Module 1.</p>\n<p><strong>Out of scope:</strong> designing the compute regime itself. Your output is the input someone else's design needs. Also out of scope: surveying three regimes shallowly — one, to the point where you know its discrepancy rate, beats three summaries.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The case study</td><td>How the regime is supposed to work</td><td>How it works, including its measured discrepancy rate and reconciliation cadence</td></tr><tr><td>Failure history</td><td>Omitted</td><td>Named incidents and the design changes each produced</td></tr><tr><td>Transfer</td><td>\"Lessons apply broadly\"</td><td>Feature by feature, with the disanalogies given equal space</td></tr><tr><td>Recommendation</td><td>Everything is applicable</td><td>One import, one explicit rejection, both reasoned</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Choose the regime by how much public audit material exists, not by how apt the analogy feels. You need the discrepancy numbers.</li><li>Read the scandals before the regulations. They tell you which provisions are load-bearing.</li><li>Write the disanalogy list halfway through, and let it decide what is left worth writing up.</li></ol>"
    },
    {
      "slug": "compute-monitoring-costing",
      "source": "verification-capstones/compute-monitoring-costing.md",
      "title": "What Would Compute Monitoring Actually Cost?",
      "track": "Verification",
      "status": "draft",
      "summary": "The compute-monitoring literature has the mechanisms and the timing. It has no inspectors, no penalties, and no price. Produce the costing a budget office would need.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 16,
        "max": 22,
        "label": "16–22 hrs",
        "bucket": "Over 20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Costed monitoring plan — headcount, inspection cadence, penalty schedule, hardware dependencies",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The agency that would be asked to stand this up, and the committee funding it.",
      "skills": [
        "cost estimation",
        "institutional design",
        "inspection regime design",
        "dependency analysis"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.1 — the hardware layer",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 8",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        },
        {
          "label": "What does it take to catch a Chinchilla? Verifying rules on large-scale neural network training via compute monitoring — Shavit (2023)",
          "href": "https://arxiv.org/abs/2303.11341"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025)",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §2.1",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.1 tells you what the hardware layer can and cannot do today: chip identity is solved but not unbreakable, secure boot has an inverted threat model because the owner is the party you are trying to catch, and no production chip meters tamper-resistantly. The orphan catalogue says the same thing from the other end — the timing analysis exists, and the inspectors, the penalties and the hardware innovations required have never been costed.</p>\n<p>Do the costing.</p>\n<ul><li><strong>The regime you are pricing.</strong> One jurisdiction, one threshold, one class of facility. Declaration, on-site inspection, remote telemetry, or some mix — pick, because they cost wildly different amounts.</li><li><strong>Headcount and cadence.</strong> How many inspectors, with what skills, visiting how often, to cover how many facilities. Anchor against a real inspectorate in another domain and say where the anchor is wrong.</li><li><strong>The penalty schedule.</strong> What misdeclaration costs, scaled so that compliance is cheaper than the expected value of cheating. Show that arithmetic; it is the part everyone skips.</li><li><strong>Hardware dependencies.</strong> Which parts of your regime need capability that does not exist in shipping silicon. Separate what works today from what needs a hardware generation, and put a date on the second column.</li><li><strong>The bill.</strong> One number, with its three biggest line items and the assumption that moves it most.</li></ul>\n<h3>Why it exists</h3>\n<p>Verification proposals are usually priced in feasibility adjectives — \"challenging\", \"achievable in principle\". Budget offices do not fund adjectives. Converting a mechanism into headcount, cadence and a penalty schedule is what makes the difference between a paper and a programme, and it tends to reveal that the binding constraint is people rather than physics.</p>\n<p>It also feeds Module 4 directly. The sequencing question — what works for an MVP three-month pause versus what needs years of institution-building — cannot be answered without something like this number.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public compute-monitoring literature, published inspectorate budgets and staffing from analogous regimes, public datacentre and chip market data.</p>\n<p><strong>Out of scope:</strong> classified or proprietary cost data, and precision. This is order-of-magnitude work with the assumptions exposed; a confident single figure with no sensitivity is worse than a range.</p>\n<p><strong>Do not price the ideal regime.</strong> Price the one you would actually recommend starting with, and note what the full version would add.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Scope</td><td>\"A compute monitoring regime\"</td><td>One jurisdiction, one threshold, one facility class, stated up front</td></tr><tr><td>Staffing</td><td>A headcount</td><td>Anchored to a real inspectorate, with the disanalogy named</td></tr><tr><td>Penalties</td><td>\"Substantial fines\"</td><td>A schedule, with the compliance-versus-cheating arithmetic shown</td></tr><tr><td>Dependencies</td><td>Mechanisms listed as available</td><td>Split into shipping-today and needs-a-hardware-generation, with dates</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Find a real inspectorate's published budget and staffing in week one. It is your anchor and it will reshape the whole estimate.</li><li>Do the penalty arithmetic before the headcount. If cheating pays, the inspectors are decoration.</li><li>Keep a visible assumptions register from the first estimate. It is the part a reader will actually argue with, and that is the point.</li></ol>"
    },
    {
      "slug": "curriculum-gap-audit",
      "source": "verification-capstones/curriculum-gap-audit.md",
      "title": "Audit What This Program Does Not Teach",
      "track": "Cross-track",
      "status": "draft",
      "summary": "Compare the Tracks curriculum against the four best-known open AI safety curricula, and hand back the three gaps worth closing — with what to cut to make room.",
      "team": {
        "min": 2,
        "max": 3,
        "label": "2–3 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 12,
        "max": 18,
        "label": "12–18 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈5 hrs/wk",
      "difficulty": "core",
      "deliverable": "Coverage matrix across four curricula plus a three-gap memo with trade-offs",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "The people who will write next year's version of this program.",
      "skills": [
        "curriculum analysis",
        "comparative coding",
        "learning-objective design",
        "prioritisation"
      ],
      "prerequisites": [
        "Any track",
        "weeks 1-6 complete"
      ],
      "sources": [
        {
          "label": "BlueDot Impact — AI Safety Fundamentals",
          "href": "https://bluedot.org"
        },
        {
          "label": "AI Safety, Ethics and Society — curriculum",
          "href": "https://www.aisafetybook.com/curriculum"
        },
        {
          "label": "Agent Foundations for Superintelligence-Robust Alignment",
          "href": "https://agentfoundations.study"
        },
        {
          "label": "Open curricula directory — aisafety.com",
          "href": "https://www.aisafety.com/courses"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "[Public] XLab Tracks - Program Proposal.md",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Four open curricula cover overlapping parts of this field, and each one made different choices about what to leave out. So did we. Find out what ours cost.</p>\n<p>You hand in:</p>\n<ul><li><strong>A coverage matrix.</strong> Rows are concepts, at a consistent grain — roughly \"a thing a learner could be asked to do\" rather than \"a topic\". Columns are the four curricula plus this program. Cells are <em>taught and assessed</em>, <em>mentioned</em>, or <em>absent</em>. The grain is the hard part; agree it as a team before coding anything.</li><li><strong>The coding protocol.</strong> How you decided what counts as taught. Two people code an overlapping sample independently and report where they disagreed. Disagreement rate is a finding, not an embarrassment.</li><li><strong>The three-gap memo.</strong> The three absences that matter most here, each with: who it hurts, what it would take to close, and — the part that makes this useful rather than a wish list — <strong>what you would cut to make room.</strong></li></ul>\n<h3>Why it exists</h3>\n<p>Every curriculum is a claim about what matters, and the claim is invisible from inside. Reading four of them side by side makes your own program's choices legible, including the ones nobody made deliberately.</p>\n<p>The transferable skill is comparative coding under a stated protocol: build a rubric, apply it consistently, report where it broke. That is the same move behind comparing jurisdictions, safety frameworks, or eval suites, and it is much easier to learn on curricula than on statutes.</p>\n<p>Like the tabletop capstone, this one produces a reusable program asset. A matrix with a stated protocol survives into the next cohort's planning.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published syllabi, reading lists and public course pages. The program's own materials in this repo.</p>\n<p><strong>Out of scope:</strong> enrolling in the courses, evaluating teaching quality, and ranking the curricula. You are mapping coverage, not judging delivery — the second needs data you will not have.</p>\n<p><strong>Note on availability.</strong> Some curricula are only shared on request, and one of the four is maintained by handing it to people who ask. If a syllabus is not public, say so in the matrix rather than guessing at its contents: an <code>unavailable</code> cell is honest and a fabricated one poisons the whole grid.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Grain</td><td>\"Interpretability\" as one row</td><td>Rows a learner could be assessed against, consistently sized</td></tr><tr><td>Protocol</td><td>Applied by feel</td><td>Written first, double-coded on a sample, disagreements reported</td></tr><tr><td>The gaps</td><td>A list of everything missing</td><td>Three, prioritised, each with a named cost to close</td></tr><tr><td>Trade-off</td><td>\"Add a week\"</td><td>A specific thing to cut, with an argument for why it is the cheaper loss</td></tr></tbody></table></div>\n<p>The recommendation that earns the most credit is usually the one that cuts something the team liked.</p>\n<h3>Getting started</h3>\n<ol><li>Build the row list from <em>one</em> curriculum first, then extend it with the others. Building it from all four at once produces a matrix whose rows are four different sizes.</li><li>Double-code ten rows before coding two hundred. That sample is where you find out your definition of \"taught\" was never shared.</li><li>Decide the cut before writing the gap memo. Gaps are easy and cuts are where the thinking is.</li></ol>"
    },
    {
      "slug": "detect-a-training-run",
      "source": "verification-capstones/detect-a-training-run.md",
      "title": "Spot a Training Run Without Looking Inside It",
      "track": "Verification",
      "status": "draft",
      "summary": "Could a verifier tell a large training run from utilisation signatures alone — no workload access, no code? Work out what the signature is and how cheaply it is faked.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Signature analysis with a detection-rule sketch and the spoofing cost for each signal",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The verifier who will never be allowed to see the workload.",
      "skills": [
        "signature analysis",
        "privacy-preserving verification",
        "detection reasoning",
        "adversarial cost modelling"
      ],
      "prerequisites": [
        "Verification 2.1 — the hardware layer",
        "Verification 2.2 — the cloud layer",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can large training runs be detected while retaining developer privacy, e.g. through signatures in processor utilisation?",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "What does it take to catch a Chinchilla? — Shavit (2023)",
          "href": "https://arxiv.org/abs/2303.11341"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §2.1",
          "href": null
        },
        {
          "label": "verification-track-outline.md §2.2",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.0 names the central tension: verification is inherently intrusive, and the mechanisms worth having are the ones that confirm a claim without handing over the secret. This is the cheapest version of that problem. A verifier who may not see weights, data or code — but may see how the machines behaved — wants to know whether a large training run happened.</p>\n<ul><li><strong>The signature.</strong> What distinguishes a long training run from inference at scale, from scientific computing, from rendering. Candidates: sustained utilisation over weeks rather than hours, the interconnect pattern of synchronous gradient exchange, memory-bandwidth profile, checkpoint-shaped I/O bursts at regular intervals, power draw that is flat rather than diurnal, and the restart-from-checkpoint discontinuities every real run has.</li><li><strong>What the verifier is allowed to see.</strong> Be precise, because it is the whole exercise. Aggregate utilisation? Per-node? Power at the meter? Network counters? Each level is a different privacy bargain and a different detection rate.</li><li><strong>The confusion matrix.</strong> For your best signal set: what else looks like this, and what a false accusation costs. Module 2.2 already warns that self-reporting alone is a paperwork regime — a detector with a bad false positive rate is the opposite failure, and just as useless.</li><li><strong>The spoofing cost.</strong> Per signal, what it costs the operator to look like something else: throttling to break the utilisation profile, padding with fake inference, splitting the run. Compare that cost against what the run is worth. That comparison is the finding.</li></ul>\n<h3>Why it exists</h3>\n<p>Almost every verification regime in the track eventually needs an answer to \"and what if they just do not tell us?\" The hardware and cloud layers answer it with observation, and the quality of the answer is entirely about what a signature can carry.</p>\n<p>It is also where the track's privacy strand becomes concrete. Learners easily say \"privacy-preserving verification\"; far fewer can say what a verifier would actually be shown, and less is usually enough than people assume.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published work on compute monitoring and workload characterisation, public datacentre power and utilisation reporting, and any small-scale measurement you can run yourself on a rented GPU.</p>\n<p><strong>Out of scope:</strong> building a detector at scale, and access to real cluster telemetry. This is analysis with an honest evidence base — where a claim rests on a plausible mechanism rather than a measurement, say so in place.</p>\n<p><strong>Also out of scope:</strong> designing the legal authority to collect the telemetry. Assume the verifier is entitled to what you specify, and be conservative about what you specify.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Signals</td><td>\"Unusual compute usage\"</td><td>Named observables with a mechanism, ranked by how hard each is to fake</td></tr><tr><td>Access level</td><td>Unstated</td><td>Exactly what the verifier sees, and the detection rate at each level</td></tr><tr><td>False positives</td><td>Ignored</td><td>The confusable workloads named, and the cost of accusing one</td></tr><tr><td>Spoofing</td><td>\"Evasion is possible\"</td><td>Priced per signal, against the value of the run being hidden</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the list of confusable workloads before the list of signals. It stops you designing a detector for a world with one kind of computation in it.</li><li>Pick the least intrusive access level that still works. Starting from full telemetry and cutting back never converges.</li><li>Cost the spoof for your best signal in week two. If it is cheap, that signal is decoration and you have two weeks to find a better one.</li></ol>"
    },
    {
      "slug": "eval-attestation-chain",
      "source": "verification-capstones/eval-attestation-chain.md",
      "title": "Make an Eval Result Believable to a Stranger",
      "track": "Verification",
      "status": "draft",
      "summary": "A lab says its model scored below the danger threshold. Specify what a third party would have to observe to believe that — and what it costs to provide.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Attestation spec — the observation chain, the residual trust, and the cost to the lab",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The regulator who has to accept or reject a self-reported eval result.",
      "skills": [
        "evidence standards",
        "attestation design",
        "adversarial reasoning",
        "cost-of-compliance analysis"
      ],
      "prerequisites": [
        "Verification 2.x — the four layers",
        "Verification 4.1 — feasibility and layering",
        "TG week 3 — running evals"
      ],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025)",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "Technical AI Governance project site — Stanford",
          "href": "https://taig.stanford.edu/"
        },
        {
          "label": "100+ Concrete Problems and Open Projects in Evals — Marius Hobbhahn (2025)",
          "href": "https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit"
        },
        {
          "label": "Request for Proposals: Improving Capability Evaluations — Coefficient Giving, formerly Open Philanthropy (2025, closed)",
          "href": "https://coefficientgiving.org/funds/navigating-transformative-ai/request-for-proposals-improving-capability-evaluations/"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §4.1",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Almost every frontier safety framework in existence rests on evals the developer runs on itself. Almost every verification regime being proposed would inherit that. Write the spec that closes the gap for <strong>one</strong> eval.</p>\n<p>The spec names:</p>\n<ul><li><strong>The claim.</strong> One eval, one threshold, one sentence: \"model M scores below T on eval E under elicitation X.\"</li><li><strong>The attack list.</strong> How the claim could be false while the lab tells no outright lie — weakened elicitation, a checkpoint that is not the deployed one, item leakage into training, a scaffold quietly capped, selective reporting across runs, a threshold chosen after seeing results.</li><li><strong>The observation chain.</strong> For each attack, what a third party would have to observe to rule it out. Be specific about artifacts: logs, hashes, seeds, weights access, an independent re-run, a live witnessed run, an escrowed held-out set.</li><li><strong>Residual trust.</strong> After all of it, what the third party is still simply taking the lab's word for. There is always something. Name it.</li><li><strong>Cost.</strong> What providing this chain costs the lab in engineering time, compute, and exposed IP — because a regime nobody can afford to comply with is not a regime.</li></ul>\n<h3>Why it exists</h3>\n<p>The track spends its length on verifying things between states — compute, facilities, treaties. This is the same problem shrunk to a single number, and it is the one that is live right now: regulators are already being handed self-reported eval results and have no settled way to price their credibility.</p>\n<p>It is also the cleanest exercise in the track's central discipline. Every mechanism you add has to answer \"what does the reader believe after this that they did not believe before?\" — and here you can check your answer against a concrete artifact rather than a diplomatic hypothetical.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one published eval or one you specify, existing attestation building blocks (hashing, logging, third-party re-runs, held-out sets, hardware attestation where it exists), and the track's layering framework.</p>\n<p><strong>Out of scope:</strong> inventing cryptography, and a general framework for all evals. One eval, one threshold. The general version is a paper, not a capstone.</p>\n<p><strong>Do not assume weights access.</strong> A spec that works only when the third party gets the weights has answered an easier question than the one regulators face. If you want to use it, you must price it and offer a fallback.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Attacks</td><td>\"The lab could cheat\"</td><td>Six named routes, each of which is technically consistent with an honest-sounding report</td></tr><tr><td>Chain</td><td>\"An independent auditor verifies\"</td><td>Per attack, the specific artifact, who holds it, and when it must be produced</td></tr><tr><td>Residual trust</td><td>Claimed to be zero</td><td>Stated plainly, with what it would take to shrink it further</td></tr><tr><td>Cost</td><td>Ignored</td><td>Estimated per requirement, with the one you would drop first if the lab pushed back</td></tr></tbody></table></div>\n<p>The single best test of a submission: hand it to someone and ask them to cheat past it. If they cannot find a route in ten minutes, the attack list was probably written by an optimist.</p>\n<h3>Getting started</h3>\n<ol><li>Write the attack list before the observation chain. Building the chain first produces a spec that defends against the attacks you happened to think of while designing it.</li><li>Pick an eval with a published methodology. You cannot attest to a procedure nobody has written down, and discovering that is itself a finding.</li><li>Cost every requirement as you add it, in the same table. Costing at the end always produces a chain nobody would adopt.</li></ol>"
    },
    {
      "slug": "exfiltrated-weights-regime",
      "source": "verification-capstones/exfiltrated-weights-regime.md",
      "title": "When the Weights Are Already Out",
      "track": "Verification",
      "status": "draft",
      "summary": "Module 3 rates weight exfiltration as the evasion route that bypasses the compute regime entirely. Specify what a verification regime does the day after it happens.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Post-exfiltration regime annex — what is still verifiable, what is not, and what the agreement should have said",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The parties to an agreement whose central mechanism has just been routed around.",
      "skills": [
        "regime design",
        "ecosystem monitoring",
        "threat modelling",
        "evidence standards"
      ],
      "prerequisites": [
        "Verification 2.x — the four layers",
        "Verification 3 — covert development",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025)",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        },
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management — author PDF",
          "href": "https://stephencasper.com/wp-content/uploads/2025/11/open_weight_model_safety_oct2025.pdf"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025)",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §3 (evasion scenario 4 — weight exfiltration)",
          "href": null
        },
        {
          "label": "verification-track-outline.md §4.1",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 3 lists eight evasion scenarios and rates each on feasibility, detectability, longevity and who could fix it. One of them is different in kind: weight exfiltration does not cheat the compute regime, it makes the compute regime irrelevant. Training already happened. The artifact is a file.</p>\n<p>Write the annex a verification regime needs for the day after.</p>\n<ul><li><strong>The trigger.</strong> What observation tells the parties this has happened at all — and how long that takes. Be honest: this is often the weakest link in the whole annex, and naming the detection lag is half the deliverable.</li><li><strong>What survives.</strong> Which of the four layers still tells you anything once the weights are loose. Hardware and cloud were watching <em>training</em>. Say plainly what each layer can and cannot see about a model that is now being run by someone who never signed anything.</li><li><strong>What replaces it.</strong> Ecosystem-level observation — where the file propagates, who serves it, who fine-tunes it, what shows up downstream — and what each of those costs in cooperation from parties who may not be party to the agreement.</li><li><strong>The claim you can still make.</strong> One sentence a verifier could stand behind afterwards, and the sentence they can no longer say. That contrast is the annex's point.</li><li><strong>The ex-ante clause.</strong> Working backwards: what the agreement should have required <em>before</em> this happened — custody obligations, security standards, declaration of holdings, reporting of a suspected breach — and what each would have cost the parties to accept.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's spine is the compute regime: chokepoints, thresholds, metering, attestation. It is a good spine, and Module 3 is where you learn that a good spine can be stepped around rather than broken. Weight exfiltration is the purest case, and it is the one that most exposes the difference between verifying a <em>process</em> and verifying a <em>state of the world</em>.</p>\n<p>It also connects the track to the fastest-moving open literature. The open-weight risk-management work catalogues problems across training data, training, evaluation, deployment and ecosystem monitoring — and the last of those is precisely the layer a verification regime has to fall back on here. Most of it is unsolved, which is why this capstone produces an annex with honest holes rather than a fix.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one agreement (reuse the one from your Module 4 capstone if you did it), one exfiltration scenario, the four layers, and public literature on open-weight and post-release monitoring.</p>\n<p><strong>Out of scope:</strong> the security engineering of preventing exfiltration. That is a real field and a different capstone. You are picking up after it failed.</p>\n<p><strong>Also out of scope:</strong> arguing about whether open release is good. The scenario here is an unauthorised leak from a party under an agreement, which is a different question from a deliberate publication decision — the open-weight literature covers both, and conflating them is the most common way this annex goes wrong.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Detection</td><td>\"The breach would be discovered\"</td><td>A named observable, who holds it, and an honest estimate of the lag</td></tr><tr><td>Layer analysis</td><td>\"Verification becomes harder\"</td><td>Per layer, what it still sees and what it never saw, stated separately</td></tr><tr><td>Fallback</td><td>\"Monitor the ecosystem\"</td><td>Named observation points, and the cooperation each one requires from a non-party</td></tr><tr><td>The retired claim</td><td>Absent</td><td>The specific sentence the regime can no longer say, written out</td></tr></tbody></table></div>\n<p>The best annexes end up recommending something the parties would hate, and say why they should accept it anyway.</p>\n<h3>Getting started</h3>\n<ol><li>Start with the detection lag. Everything downstream is conditioned on how late you find out, and most drafts assume an implausibly fast trigger.</li><li>Do the four-layer pass as a table before writing prose. It is the fastest way to discover how much of the regime was watching training only.</li><li>Write the ex-ante clause last, then check it against the cost question. A clause the parties would never have signed is not a finding, it is a wish.</li></ol>"
    },
    {
      "slug": "field-building-blueprint",
      "source": "verification-capstones/field-building-blueprint.md",
      "title": "Blueprint a Field-Building Intervention",
      "track": "Cross-track",
      "status": "draft",
      "summary": "Design one field-building intervention — an event, a fellowship, a small organisation — to the point where someone with the budget could run it, and say how you would know it worked.",
      "team": {
        "min": 2,
        "max": 4,
        "label": "2–4 people",
        "bucket": "Team of 4+"
      },
      "effort": {
        "min": 16,
        "max": 22,
        "label": "16–22 hrs",
        "bucket": "Over 20 hrs"
      },
      "duration": {
        "label": "4 weeks",
        "weeks": 4
      },
      "perWeek": "≈5 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Run-ready design — theory of change, format, budget, staffing, and an evaluation plan",
      "deliverableType": "design",
      "mentor": "recommended",
      "audience": "The funder who would write the cheque, and the person who would have to run it.",
      "skills": [
        "theory of change",
        "programme design",
        "budgeting",
        "evaluation design",
        "counterfactual reasoning"
      ],
      "prerequisites": [
        "Any track",
        "weeks 1-7 complete",
        "Policy week 1 — theory of change"
      ],
      "sources": [
        {
          "label": "Blueprints for AI Safety conferences (FBB #9) — The Field Building Blog (2025)",
          "href": "https://fieldbuilding.substack.com/p/blueprints-for-ai-safety-conferences"
        },
        {
          "label": "What x- or s-risk fieldbuilding organisations would you like to see? (FBB #3)",
          "href": "https://fieldbuilding.substack.com/p/what-new-x-or-s-risk-fieldbuilding"
        },
        {
          "label": "Events and training directory — aisafety.com",
          "href": "https://www.aisafety.com/events-and-training"
        },
        {
          "label": "10 EA movement building project ideas — guneyulasturker (2025)",
          "href": "https://forum.effectivealtruism.org/posts/GvsQfgw2rmXPsYFsF/10-ea-movement-building-project-ideas-for-early-career"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "[Public] XLab Tracks - Program Proposal.md",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one field-building intervention — a one-day summit, a three-day conference, a reading group series, a small organisation filling a named gap — and design it to the point of being runnable.</p>\n<p>The blueprint contains:</p>\n<ul><li><strong>The theory of change.</strong> Who changes what behaviour because this exists, and by what mechanism. One diagram plus one paragraph. If the mechanism is \"people meet and good things happen\", keep going.</li><li><strong>The counterfactual.</strong> What happens to your target people if this does not exist. This is where most field-building proposals quietly fail, because the honest answer is often \"they attend the other event\".</li><li><strong>The format.</strong> Length, size, agenda shape, who is in the room and — harder — who is deliberately not. Formats encode a theory; make yours explicit.</li><li><strong>Budget and staffing.</strong> Itemised. Venue, travel, stipends, the organiser's own time at a real rate. Name the largest line and defend it.</li><li><strong>The evaluation plan.</strong> What you measure, when, and the number that would make you not run it again. Measured <em>before</em> the event too, or you have no baseline.</li><li><strong>The failure modes.</strong> The three ways this goes wrong, including the two boring ones — nobody comes, and the wrong people come.</li></ul>\n<h3>Why it exists</h3>\n<p>The program's own existence is a field-building bet. Making learners design one closes that loop: you get to see the argument that was made about you.</p>\n<p>It also teaches evaluation under weak feedback, which is the honest condition of most governance work. Nothing here has a loss function. You have to decide in advance what evidence would count, knowing it will be thin, and then commit to being told you were wrong — the same discipline the tracks teach against thresholds and treaty regimes, applied to something you built.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> design, budget, and evaluation plan on paper. Talking to people who have run comparable things is strongly encouraged and cheap.</p>\n<p><strong>Out of scope:</strong> actually running it. If your team wants to run it, that is a separate commitment made after the blueprint is graded — do not let the capstone become logistics.</p>\n<p><strong>Also out of scope:</strong> an intervention whose target audience you cannot name individually enough to describe a typical attendee's week. Vague audiences produce unevaluable designs.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Theory of change</td><td>\"Builds the community\"</td><td>A named group, a named behaviour change, and the mechanism between them</td></tr><tr><td>Counterfactual</td><td>Unaddressed</td><td>An honest account of what those people would otherwise do, with the delta stated</td></tr><tr><td>Budget</td><td>A total</td><td>Itemised, with the largest line defended and a cheaper variant costed</td></tr><tr><td>Evaluation</td><td>\"Feedback forms\"</td><td>A pre-measure, a post-measure, and the threshold at which you would stop</td></tr></tbody></table></div>\n<p>The strongest blueprints include a section arguing the intervention should not happen, written well enough to be uncomfortable.</p>\n<h3>Getting started</h3>\n<ol><li>Write the counterfactual paragraph in the first session. It reshapes or kills most ideas immediately, which is the cheapest possible time for that.</li><li>Cost a deliberately smaller version alongside the real one. Funders ask, and the small version is often better.</li><li>Talk to one person who has run something similar before you finalise the format. Thirty minutes of that beats a week of desk research on logistics.</li></ol>"
    },
    {
      "slug": "hardware-chokepoint-dossier",
      "source": "verification-capstones/hardware-chokepoint-dossier.md",
      "title": "Hardware Chokepoint Dossier",
      "track": "Verification",
      "status": "ready",
      "summary": "Trace one node of the compute supply chain end to end and rank it as a verification chokepoint — who sees what, and who would have to agree.",
      "team": {
        "min": 1,
        "max": 1,
        "label": "1 person",
        "bucket": "Solo"
      },
      "effort": {
        "min": 10,
        "max": 14,
        "label": "10–14 hrs",
        "bucket": "Up to 14 hrs"
      },
      "duration": {
        "label": "2 weeks",
        "weeks": 2
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "core",
      "deliverable": "Six-to-eight page dossier with a chokepoint ranking table",
      "deliverableType": "dossier",
      "mentor": "optional",
      "audience": "An analyst deciding where to spend a verification budget.",
      "skills": [
        "supply chain analysis",
        "actor mapping",
        "chokepoint ranking",
        "source triangulation"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.1 — the hardware layer"
      ],
      "sources": [
        {
          "label": "verification-track-outline.md §2.1",
          "href": null
        },
        {
          "label": "supply-chain-map.html",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one node in the compute supply chain — lithography, HBM, advanced packaging, fab capacity, the cloud tenancy layer, or the second-hand market — and write the dossier a verification analyst would want before committing to it as a monitoring point.</p>\n<p>The dossier covers:</p>\n<ul><li><strong>The node.</strong> What physically happens there, at enough resolution that a reader can tell a real bottleneck from a marketing one.</li><li><strong>The actors.</strong> Firms, states, regulators; who holds leverage over whom; where the concentration actually sits.</li><li><strong>Observability.</strong> What is visible from outside — customs data, export filings, satellite, financial disclosure, industry trackers — and at what latency.</li><li><strong>What a verifier would learn.</strong> The claim this node can support, stated as a sentence a diplomat could use.</li><li><strong>What it cannot see.</strong> The equivalent sentence for the blind spot.</li><li><strong>The ranking.</strong> Score the node against the others the track has covered on concentration, observability, substitutability and time-to-erode.</li></ul>\n<h3>Why it exists</h3>\n<p>Compute is the governable input because it is excludable, quantifiable and concentrated — but those three properties are not uniform across the chain, and they decay at different rates. A regime that monitors the wrong node buys nothing while looking rigorous. Working one node to real depth teaches the shape of that judgement better than a survey of all of them.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> open sources, the track's readings, and the interactive supply-chain map as a starting skeleton.</p>\n<p><strong>Out of scope:</strong> classified or paywalled proprietary market data; a complete industry history. Depth on one node beats breadth across six.</p>\n<h3>What good looks like</h3>\n<ul><li>Numbers carry dates and sources, and you say when a number is an estimate rather than a measurement.</li><li>The ranking table has a stated scoring rule, so a reader can disagree with your weights rather than your conclusion.</li><li>At least one claim in the dossier is one you tried and failed to verify — and it says so, in place, rather than quietly disappearing.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Start from the supply-chain map and pick the node you find least legible. Legibility is what you are building.</li><li>Find three independent sources for one central number before writing anything. If you cannot, that is your first finding.</li><li>Write the \"what it cannot see\" section before the \"what a verifier would learn\" section — it keeps the dossier honest.</li></ol>"
    },
    {
      "slug": "intro-retention-probe",
      "source": "verification-capstones/intro-retention-probe.md",
      "title": "What Do Intro Graduates Actually Retain?",
      "track": "Cross-track",
      "status": "concept",
      "summary": "The program's entry assumptions rest on retention figures its own docs call directional. Measure them against this cohort and hand back what the tiered hints should absorb.",
      "team": {
        "min": 2,
        "max": 3,
        "label": "2–3 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Recall probe, results against the assumed entry profile, and a revision list for the hint tiers",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "Whoever writes week 1 of the next version of this program.",
      "skills": [
        "instrument design",
        "measurement",
        "comparing curricula",
        "reporting weak evidence honestly"
      ],
      "prerequisites": [
        "Any track",
        "weeks 1-4 complete"
      ],
      "sources": [
        {
          "label": "EA Intro Fellowship curriculum",
          "href": "https://resources.eagroups.org/intro-fellowship-curriculum"
        },
        {
          "label": "EA In-Depth Fellowship syllabi",
          "href": "https://resources.eagroups.org/post-intro-fellowship-syllabi-and-programs/in-depth-fellowship"
        },
        {
          "label": "BlueDot Impact — AI Safety Fundamentals",
          "href": "https://bluedot.org"
        },
        {
          "label": "Part-time courses related to top problems (directory)",
          "href": "https://airtable.com/app53PsYpHxJW61l3/shr6eKNhPjxj4UH4E/tblqpu7Tcy2734cji"
        },
        {
          "label": "Open curricula directory — aisafety.com",
          "href": "https://www.aisafety.com/courses"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "AI Governance Policy Track - Work Structure and Suggestions.md §1 (what intro-course graduates arrive with)",
          "href": null
        },
        {
          "label": "Technical Governance Track - Work Structure and Suggestions.md §1 (entry-knowledge note)",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Both track documents build on the same claim: intro-course graduates arrive with <strong>recognition-level</strong> familiarity — the AI triad, the risk taxonomy, ML vocabulary — and <strong>recall-level</strong> gaps that widen over the first year, so week 1 should reactivate through production rather than re-teach. Both documents also say, in as many words, that the numbers behind that claim are directional and came from a summary rather than from measurement.</p>\n<p>Measure it.</p>\n<ul><li><strong>The entry profile, restated as items.</strong> Turn the \"safe to assume\" and \"not safe to assume\" lists into a testable instrument. Recognition items (pick the correct definition) and recall items (produce the specific) covering the same concepts, so the gap between the two is visible per concept rather than asserted overall.</li><li><strong>Curriculum trace.</strong> For each item, which intro curriculum actually covers it — the EA intro and in-depth fellowships, BlueDot's course, whatever else the cohort came through. An item nothing teaches is not a retention failure.</li><li><strong>The probe.</strong> Run it with consenting members of the current cohort, plus time since their intro course. Twenty minutes maximum.</li><li><strong>The findings.</strong> Recognition versus recall per concept, and against months-since-course where you have the numbers. Report the sample size in the first line and say plainly what it cannot support.</li><li><strong>The revision list.</strong> Which week-1 assumptions hold, which do not, and what the tiered hint system has to absorb — the concrete deliverable the program can act on.</li></ul>\n<h3>Why it exists</h3>\n<p>The program's whole autonomy ramp starts from an assumption about who walks in the door. If that assumption is wrong in a specific place, week 1 either bores people or loses them, and nobody finds out until the cohort is half over.</p>\n<p>The transferable skill is measuring something the program currently believes on thin evidence and reporting the result at the confidence the sample allows. That is the same discipline the tracks teach about eval scores and compute estimates, turned on the program itself — and it is much easier to learn when the stakes are a hint tree rather than a regulation.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published intro curricula, the two track documents' entry-profile sections, and a short voluntary probe of the current cohort.</p>\n<p><strong>Out of scope:</strong> a controlled study, a claim about the field at large, and any comparison between named individuals. You will have a sample in the tens at best; a finding stated more confidently than that supports is the failure mode this capstone is most likely to hit.</p>\n<p><strong>Consent and data handling are part of the deliverable.</strong> Participation is voluntary and refusable without explanation, responses are reported in aggregate, and you collect nothing you do not need — months-since-course and which intro programme, not names, not demographics. Write the one-paragraph consent notice before you write the first item, and include it in the submission.</p>\n<p><strong>Marked concept, not ready:</strong> it depends on cohort participation, which cannot be guaranteed. If fewer than a handful respond, the instrument plus the curriculum trace plus an honest account of the response rate is the deliverable, and it should be graded as one — a validated instrument the next cohort can run is worth more than a number from five people.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Instrument</td><td>A quiz</td><td>Matched recognition/recall pairs per concept, so the gap is measured not assumed</td></tr><tr><td>Trace</td><td>Assumed coverage</td><td>Per item, the curriculum and session that teaches it — or a note that none does</td></tr><tr><td>Reporting</td><td>A percentage</td><td>The percentage, the n, and the sentence it does not support</td></tr><tr><td>Output</td><td>\"Retention is poor\"</td><td>A specific list of week-1 assumptions to change, and how</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Build the instrument straight from the two track documents' own lists. They are already itemised; your job is to make each one answerable.</li><li>Pilot on two people outside the cohort before running it. Half your items will turn out to be ambiguous, and finding that after the real run wastes the sample you cannot get twice.</li><li>Decide, in writing and in advance, what result would change week 1. Deciding after you see the data is how a probe becomes a rationalisation.</li></ol>"
    },
    {
      "slug": "minimal-verification-regime",
      "source": "verification-capstones/minimal-verification-regime.md",
      "title": "Minimal Verification Regime for an Emergency Pause",
      "track": "Verification",
      "status": "ready",
      "summary": "Design the smallest verification regime that could make a three-month emergency pause credible to a party that expects to be cheated.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "core",
      "deliverable": "Two-page regime spec plus a one-page evasion annex",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The negotiating team that would have to sign it, and the technical staff who would have to run it.",
      "skills": [
        "regime design",
        "threat modelling",
        "evidence standards",
        "institutional analysis"
      ],
      "prerequisites": [
        "Verification 2.x — the four layers",
        "Verification 3 — covert development",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "verification-track-outline.md §4.2",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one agreement — a three-month emergency pause, a compute cap, or a conditional slowdown — and specify the verification regime that would make it credible. Not the ideal regime: the <em>minimal</em> one. Every mechanism you add has to earn its place against the question \"what does the other side believe after this that they did not believe before?\"</p>\n<p>Your spec names, at minimum:</p>\n<ul><li><strong>The agreement.</strong> What exactly is prohibited, over what period, with what exemptions. One paragraph, written so a lawyer could not drive a truck through it.</li><li><strong>Covered actors.</strong> Who is in scope — labs, cloud providers, chipmakers, states — and who is deliberately left out.</li><li><strong>Thresholds.</strong> The numbers that trigger obligations, plus what happens to their selectivity over the agreement's lifetime.</li><li><strong>Reporting rules.</strong> What is declared, by whom, how often, under what penalty for misdeclaration.</li><li><strong>The verification stack.</strong> Which of the hardware, cloud, intelligence and human layers you are using, and what each one buys you.</li><li><strong>Evasion risks.</strong> The three most plausible defection routes and what, concretely, would catch each one.</li><li><strong>Evidence standards.</strong> What quantum of evidence justifies a challenge inspection, a suspension, a public accusation.</li><li><strong>Enforcement pathway.</strong> What happens after detection — the step most regimes leave as an exercise for the reader.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's central question is whether the US and China could trust an agreement to pause frontier development. Every module builds one piece of the answer; this is where the pieces have to hold each other up. A regime that verifies beautifully but has no enforcement pathway is a research paper, not a policy. A regime with teeth and no evidence standard is a casus belli generator.</p>\n<p>This is also the track's strongest portfolio artifact. It is the closest thing in the program to what a technical-governance fellowship actually asks for: a scoped design under adversarial pressure, with the failure modes named by the author rather than the reviewer.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one agreement, one adversary model, the four layers you already studied, and mechanisms that exist or are plausibly buildable in the agreement's window.</p>\n<p><strong>Out of scope:</strong> inventing new verification technology; a full treaty text; the diplomacy of getting to the table. If a mechanism needs a decade of hardware rollout, you may cite it as a successor regime, but it cannot be load-bearing in a three-month pause.</p>\n<p>You are reusing work, not starting from zero. The problem/solution model you seeded in Module 0, the stakeholder map from Module 1, the chokepoint ranking from Module 2, and the evasion scenarios from Module 3 are the inputs. If you find yourself re-deriving them, stop and go get them.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Minimality</td><td>Every mechanism the course mentioned, stacked</td><td>Four mechanisms, each with a stated job, and a named thing you cut</td></tr><tr><td>Adversary</td><td>\"A bad actor might cheat\"</td><td>A specific defection route with a cost, a timeline, and a detection probability</td></tr><tr><td>Evidence</td><td>\"Inspectors would investigate\"</td><td>A stated threshold: what triggers a challenge, what a challenge can conclude</td></tr><tr><td>Honesty</td><td>Confident throughout</td><td>The failure modes are in your own text, in the section where they belong</td></tr></tbody></table></div>\n<p>The single best predictor of a strong submission: your evasion annex attacks <em>your</em> regime, specifically, rather than verification in general.</p>\n<h3>Getting started</h3>\n<ol><li>Write the one-paragraph agreement first. Most drafts wobble because the thing being verified was never pinned down.</li><li>Choose the adversary before the mechanisms — a state actor willing to burn diplomatic capital and a profit-maximising lab produce different regimes.</li><li>Draft the evasion annex <em>second</em>, not last. It will delete two of your mechanisms and save you a week.</li></ol>"
    },
    {
      "slug": "proof-of-training-feasibility",
      "source": "verification-capstones/proof-of-training-feasibility.md",
      "title": "Can You Prove This Model Came From That Run?",
      "track": "Verification",
      "status": "draft",
      "summary": "Proof-of-learning is in Module 2.1 as fragile and spoofed; model-heritage inference is an open problem next door. Assess what either can support and what a regime could rest on them.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Feasibility assessment of training-provenance claims, with the claims each method can and cannot carry",
      "deliverableType": "dossier",
      "mentor": "recommended",
      "audience": "The regulator asked to accept \"this is the model we evaluated\" as established fact.",
      "skills": [
        "feasibility assessment",
        "provenance reasoning",
        "adversarial analysis",
        "evidence standards"
      ],
      "prerequisites": [
        "Verification 2.0 — confidentiality vs verifiability",
        "Verification 2.1 — the hardware layer"
      ],
      "sources": [
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025), §4.5 model provenance and forensics: model heritage inference, and how practical and scalable proof-of-training methods are",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), verification questions: could proof-of-learning demonstrate and verify model ownership?",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §2.1",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Two separate literatures are circling the same question. Proof-of-learning asks whether a party can demonstrate that a set of weights is the output of a particular training run; model-heritage inference asks whether an outside observer can tell which base model a given artifact was derived from. Module 2.1 already records the verdict on the first — fragile, and spoofed in practice.</p>\n<p>Assess what either can actually carry.</p>\n<ul><li><strong>The claims.</strong> Write out the distinct provenance claims a regime might want: <em>this is the checkpoint that was evaluated</em>; <em>this run used the declared data</em>; <em>this fine-tune descends from that base model</em>; <em>this model was not trained after the cut-off date</em>. They have very different difficulty.</li><li><strong>Method by claim.</strong> For each claim, which method could establish it, at what cost to the prover, and with what confidence. Include the boring options — hashes and signed checkpoints establish more than people expect, provided someone was recording at the time.</li><li><strong>The adversary.</strong> Per method, the spoofing route and what it costs. This is the section Module 2.1's verdict comes from; do not take the verdict on trust, find the spoofing results and read them.</li><li><strong>The recording problem.</strong> Most provenance is cheap if you were recording from the start and impossible afterwards. Say which of your claims are prospective-only, because that determines whether a regime has to mandate logging before it can ever ask the question.</li><li><strong>The recommendation.</strong> One claim a regime could rest on today, one it should not, and the logging requirement that would move a claim from the second column to the first.</li></ul>\n<h3>Why it exists</h3>\n<p>\"The deployed model is the one that was evaluated\" is an assumption underneath every eval-based governance instrument in existence, and almost nobody has asked what establishes it. That makes this a small question with a very large blast radius.</p>\n<p>It also teaches the track's most durable habit on a fresh case: separate what a mechanism proves from what people assume it proves, and price the difference.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the proof-of-learning literature and its attacks, model-heritage and fingerprinting work, watermarking of weights, and standard integrity machinery (hashing, signing, logging).</p>\n<p><strong>Out of scope:</strong> implementing a method, and inventing one. Also out of scope: content provenance — watermarking <em>outputs</em> is a different problem with its own capstone in this bank.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Claims</td><td>\"Verify model provenance\"</td><td>Four distinct claims, ranked by difficulty, with the easy ones identified</td></tr><tr><td>Methods</td><td>Surveyed</td><td>Mapped to claims, with cost to the prover and confidence delivered</td></tr><tr><td>Adversary</td><td>\"Attacks exist\"</td><td>The specific spoofing results, read, with what they did and did not break</td></tr><tr><td>Recording</td><td>Unaddressed</td><td>Which claims are prospective-only, and the logging mandate that changes that</td></tr></tbody></table></div>\n<p>The most useful finding here is usually unglamorous: a signed checkpoint and a timestamp, required in advance, beats a clever proof nobody can run.</p>\n<h3>Getting started</h3>\n<ol><li>Write the four claims first. Most confusion in this area is two people proving different things and disagreeing about the result.</li><li>Read the spoofing papers before the proposal papers. It saves a week.</li><li>Ask of each claim: could this have been made trivial by a rule that existed before the run? Those are your recommendations.</li></ol>"
    },
    {
      "slug": "red-team-a-verification-stack",
      "source": "verification-capstones/red-team-a-verification-stack.md",
      "title": "Red-Team a Verification Stack",
      "track": "Verification",
      "status": "ready",
      "summary": "Take a published verification proposal and break it — a structured evasion report with detection probabilities and the patch each route demands.",
      "team": {
        "min": 2,
        "max": 3,
        "label": "2–3 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 16,
        "max": 22,
        "label": "16–22 hrs",
        "bucket": "Over 20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Evasion report with an attack tree and a patch list",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The team that published the proposal you are attacking.",
      "skills": [
        "red-teaming",
        "attack trees",
        "detection reasoning",
        "adversarial cost modelling"
      ],
      "prerequisites": [
        "Verification 2.x — the four layers",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "verification-track-outline.md §3",
          "href": null
        },
        {
          "label": "verification-game.html",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Choose a real, published verification proposal — a layered monitoring scheme, a hardware-attestation design, a reporting regime — and build the case that it fails. Then say what it would take to fix.</p>\n<p>The report contains:</p>\n<ol><li><strong>The steelman.</strong> One page reconstructing the proposal at its strongest, in the authors' own terms. You do not get to attack a version they would not recognise.</li><li><strong>The attack tree.</strong> The defection goal at the root, branching into routes, each leaf annotated with the capability it requires and the cost it imposes on the defector.</li><li><strong>Detection reasoning.</strong> For each route: which layer would notice, what the signature looks like, what the base rate of false alarms does to the analyst on the other end.</li><li><strong>The three that work.</strong> Rank the routes; defend the top three as the ones a real actor would choose, and say why the rest are theatre.</li><li><strong>The patch list.</strong> What each surviving route demands — a mechanism, a reporting rule, an institution — and what that patch costs the regime in intrusiveness, money, or political feasibility.</li></ol>\n<h3>Why it exists</h3>\n<p>Verification proposals are usually evaluated by people who want them to work. The failure mode of the field is a mechanism that looks sound at the level of the diagram and dissolves on contact with a motivated actor with a budget. The skill this builds — attacking a design you find sympathetic, in public, with the costs stated — is the one that separates an analyst from an advocate.</p>\n<p>Teams of two or three work better here than solos: one person's steelman is another person's attack surface, and the argument you have in week two is the point.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> open literature, the track's evasion taxonomy, and cost estimates you can defend within an order of magnitude.</p>\n<p><strong>Out of scope:</strong> operational detail that reads as a how-to. Name the route and the signature; you do not need to write the playbook. If a paragraph would be more useful to a defector than to a defender, cut it — the report is a defence artifact.</p>\n<h3>What good looks like</h3>\n<ul><li>The steelman is good enough that a reader who skipped the attack would come away understanding the proposal better.</li><li>Attack costs are stated with units and a source, even when rough.</li><li>The patch list is honest about the patches that make the regime politically dead. \"Fixable, but only by something no one will sign\" is a finding, not a failure.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Pick a proposal you <em>like</em>. Attacking a design you already distrust produces a weak steelman and a boring report.</li><li>Build the attack tree before reading the evasion literature again — then read it and see what you missed. The gap is diagnostic.</li><li>Agree in your team, in writing, on what counts as a successful evasion before you start scoring routes.</li></ol>"
    },
    {
      "slug": "ship-to-a-live-project",
      "source": "verification-capstones/ship-to-a-live-project.md",
      "title": "Ship Something to a Live Project",
      "track": "Cross-track",
      "status": "concept",
      "summary": "Find an AI safety project that wants volunteers, agree one scoped contribution with a maintainer, ship it, and write up what the review taught you.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 12,
        "max": 18,
        "label": "12–18 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈5 hrs/wk",
      "difficulty": "core",
      "deliverable": "A merged or accepted contribution, plus a two-page note on the scoping and the review",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "The maintainer, who is the real grader, and the next volunteer they onboard.",
      "skills": [
        "scoping with a stakeholder",
        "working to someone else's standard",
        "taking review",
        "contribution hygiene"
      ],
      "prerequisites": [
        "Any track",
        "weeks 1-5 complete"
      ],
      "sources": [
        {
          "label": "AI safety projects seeking volunteers — aisafety.com",
          "href": "https://www.aisafety.com/projects"
        },
        {
          "label": "Open curricula and community directories — aisafety.com",
          "href": "https://www.aisafety.com/courses"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "Technical Governance Track - Work Structure and Suggestions.md §3 week 9 (fellowship-application craft)",
          "href": null
        },
        {
          "label": "AI Governance Policy Track - Work Structure and Suggestions.md §3 week 9",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Every other capstone in this bank is graded by the program. This one is graded by a stranger who did not agree to teach you.</p>\n<p>The sequence:</p>\n<ol><li><strong>Find a project that is asking.</strong> Public directories list initiatives seeking volunteers. Pick one whose work you can already read.</li><li><strong>Agree the scope in writing.</strong> One message to the maintainer proposing a specific contribution, with what you will deliver and by when. Get a yes before you build. This step is the capstone; the rest is execution.</li><li><strong>Ship it.</strong> A documentation fix, a dataset addition, a test suite, a translated resource, a small feature, a research summary — whatever they said yes to.</li><li><strong>Take the review.</strong> Revise until it lands or the maintainer closes it.</li><li><strong>Write the note.</strong> Two pages: how you scoped it, what the review changed, what the maintainer cared about that you did not expect, and what you would propose next.</li></ol>\n<h3>Why it exists</h3>\n<p>Program work has a soft edge: the audience is hypothetical, the deadline is internal, and a mentor is invested in your success. Real contributions have none of that. A maintainer with no time will tell you plainly that your scope was too big, your patch touched too much, or your summary missed the point — and that feedback is worth more than a graded memo.</p>\n<p>It is also the shortest path from \"did a program\" to \"has done something in the field\", which is the distinction that gets read on an application.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one contribution, agreed in advance, small enough that a busy maintainer can review it in under an hour. Small and merged beats ambitious and abandoned.</p>\n<p><strong>Out of scope:</strong> unsolicited large contributions, and anything you start before the maintainer has said yes. Also out of scope: counting your own program work as the contribution.</p>\n<p><strong>This capstone can fail for reasons that are not your fault.</strong> Maintainers go quiet. Projects stall. That risk is why it is marked <em>concept</em> rather than <em>ready</em>, and why the mitigation is structural: contact <strong>three</strong> projects in week one, not one. If nobody responds by the end of week two, the note becomes the deliverable on its own — what you proposed, to whom, and what the silence suggests about how the field onboards volunteers. That is a legitimate and genuinely useful outcome, and it should be graded as one.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Scoping</td><td>\"Asked how I could help\"</td><td>A specific proposal with a deliverable and a date, agreed before work started</td></tr><tr><td>Size</td><td>A large patch touching many things</td><td>One thing, reviewable in under an hour</td></tr><tr><td>Review</td><td>Defended the original approach</td><td>Revised, and can say what the maintainer's standard was</td></tr><tr><td>The note</td><td>A diary</td><td>A transferable account of how this project decides what it wants</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Contact three projects on day one, with three different specific proposals. Generic offers to help are the most-ignored message maintainers receive.</li><li>Read their contribution guide and their last ten merged changes before proposing anything. Proposing something they already rejected is the fastest way to be ignored.</li><li>Halve your scope before you send it. Then halve it again if the project has fewer than five active contributors.</li></ol>"
    },
    {
      "slug": "subthreshold-distributed-training",
      "source": "verification-capstones/subthreshold-distributed-training.md",
      "title": "Train It in Pieces, Under Every Threshold",
      "track": "Verification",
      "status": "draft",
      "summary": "Evasion scenario 8 says a run can be fragmented below the line. Work out how far that actually goes today, what it costs, and which threshold designs survive it.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Feasibility assessment of fragmented training plus a threshold-design recommendation that survives it",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "Whoever writes the threshold, and the verifier who has to enforce it.",
      "skills": [
        "technical feasibility assessment",
        "evasion modelling",
        "threshold design",
        "cost estimation"
      ],
      "prerequisites": [
        "Verification 2.1 — the hardware layer",
        "Verification 3 — covert development",
        "TG week 2 — compute governance"
      ],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can AI models be trained using a large number of small compute clusters?",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "What does it take to catch a Chinchilla? — Shavit (2023)",
          "href": "https://arxiv.org/abs/2303.11341"
        },
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 77: compute replacement",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §3 (evasion scenario 8 — distributed training)",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 3's eighth evasion scenario is sub-threshold fragmentation: split the run across enough small clusters, accounts or jurisdictions and no single reported quantity crosses the line. Everyone concedes it is possible in principle. The question that decides whether it matters is how expensive it is in practice.</p>\n<ul><li><strong>The technical ceiling.</strong> What decentralised and low-communication training can actually do today, at what scale, and how far behind a co-located run of the same nominal compute it lands. Bandwidth and latency are the binding constraints; say what they cost in wall-clock and in achieved quality.</li><li><strong>The overhead.</strong> The multiplier a fragmenter pays — in time, in total compute, in engineering. That number, more than any argument, determines whether the route is used.</li><li><strong>What fragments and what does not.</strong> Splitting across accounts inside one provider is a different problem from splitting across providers, and both are different from splitting across borders. Some are trivial and some are research problems. Separate them.</li><li><strong>What still shows.</strong> Aggregate procurement, power, and the fact that somebody eventually has to assemble the pieces. Fragmentation hides the run from a per-cluster threshold; it does not hide it from every layer, and naming what remains visible is the constructive half.</li><li><strong>The threshold recommendation.</strong> Which threshold designs survive: aggregate across a corporate group, count over a rolling window, attach to procurement rather than to a run, index on the model rather than the training. Pick one and say what it costs in administrability.</li></ul>\n<h3>Why it exists</h3>\n<p>Threshold-based governance is the field's dominant instrument, and this is the evasion route that attacks its arithmetic rather than its enforcement. The track teaches thresholds in Module 2 and attacks them in Module 3; this capstone is that attack carried through to a redesign, which is the part learners usually skip.</p>\n<p>The pairing with the rest of the bank is deliberate. One capstone asks how fast a threshold decays, another asks what it counts, this one asks whether it can be arithmetically avoided. Those are the three ways a compute rule fails, and a cohort that has produced all three has a genuinely complete picture.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published work on decentralised and communication-efficient training, public reporting on distributed training efforts, and the track's threshold material.</p>\n<p><strong>Out of scope:</strong> running a distributed training experiment, and any operational detail about evading a specific regime in a specific place. You are assessing feasibility and redesigning the instrument, not writing a manual.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Feasibility</td><td>\"Distributed training is possible\"</td><td>A scale ceiling with a date, and the gap to a co-located run quantified</td></tr><tr><td>Overhead</td><td>Unquantified</td><td>A multiplier, with what drives it and how fast it is shrinking</td></tr><tr><td>Fragmentation modes</td><td>Treated as one thing</td><td>Separated by boundary crossed, each with its own difficulty</td></tr><tr><td>Recommendation</td><td>\"Thresholds should be robust\"</td><td>One design, with its administrative cost and what it still misses</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Get the overhead multiplier first, even roughly. If it is 10x, this is a theoretical concern; if it is 1.5x, the threshold design has to change now.</li><li>Separate the fragmentation modes on day two. Conflating account-splitting with cross-border distributed training makes every later claim mushy.</li><li>Write the \"what still shows\" section before the recommendation. The threshold you recommend should lean on whatever survives.</li></ol>"
    },
    {
      "slug": "treaty-clause-redraft",
      "source": "verification-capstones/treaty-clause-redraft.md",
      "title": "Treaty Clause Redraft",
      "track": "Verification",
      "status": "draft",
      "summary": "Take the verification articles of a real arms-control treaty and redraft them for frontier AI — clause by clause, with the disanalogies marked.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 12,
        "max": 16,
        "label": "12–16 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "2 weeks",
        "weeks": 2
      },
      "perWeek": "≈7 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Redrafted clause set with a facing-page commentary",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "A treaty lawyer who knows arms control and not AI.",
      "skills": [
        "legal drafting",
        "clause analysis",
        "analogical reasoning",
        "precedent critique"
      ],
      "prerequisites": [
        "Verification 0 — treaty anatomy",
        "Verification 2.3 — the intelligence layer"
      ],
      "sources": [
        {
          "label": "verification-track-outline.md §0.2",
          "href": null
        },
        {
          "label": "treaty-table.html",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick the verification articles of one real agreement — New START, the CWC, the NPT safeguards system, the Open Skies Treaty — and redraft them so they would govern frontier AI development instead. Present it as a facing-page document: your clause on the left, your commentary on the right.</p>\n<p>The commentary is where the work is. For each clause, say:</p>\n<ul><li><strong>What it does in the original.</strong> The mechanism, not the aspiration.</li><li><strong>What it would do here.</strong> The translated obligation.</li><li><strong>The disanalogy.</strong> The property of nuclear material, chemical precursors, or overflight that made the original clause work, and whether AI has an equivalent.</li><li><strong>The residue.</strong> What the clause cannot carry across, and what would have to be invented to replace it.</li></ul>\n<h3>Why it exists</h3>\n<p>Arms control is the field's most-reached-for analogy and its most abused one. Fissile material is countable, chemical precursors have signatures, overflight is observable. Model weights are copyable, training runs are deniable, and the relevant capability lives partly in tacit knowledge. Working at clause resolution — not at the level of \"AI is like nukes\" — is the fastest way to learn which parts of the analogy survive.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the verification and inspection articles. Definitions, declarations, inspection rights, challenge procedures, dispute resolution.</p>\n<p><strong>Out of scope:</strong> the whole treaty. Entry-into-force clauses and withdrawal provisions are interesting and are not this assignment.</p>\n<h3>What good looks like</h3>\n<ul><li>The redraft is operable: an inspector could act on it.</li><li>At least one clause is marked <strong>untranslatable</strong>, with a defended reason. A redraft where everything carries over cleanly has not been thought about hard enough.</li><li>The commentary names the property doing the work in each original clause. \"Verification of non-production relied on the fact that enrichment leaves a physical plant\" is the register.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Read the original articles once for structure, once for mechanism.</li><li>Mark every noun that names a physical thing. Those are the clauses that will fight you.</li><li>Draft the definitions section last — you will not know what you need to define until the operative clauses exist.</li></ol>\n<blockquote><p><strong>Status: draft.</strong> This entry's rubric is not yet aligned with the Module 0 treaty-anatomy exercise. Expect the scope to tighten before it is offered to a cohort.</p></blockquote>"
    },
    {
      "slug": "us-china-incident-hotline",
      "source": "verification-capstones/us-china-incident-hotline.md",
      "title": "Build the US–China AI Incident Hotline",
      "track": "Verification",
      "status": "draft",
      "summary": "The hotline has been proposed for years and never specified. Design it — what counts as an incident, who picks up, what is said, and why either side would believe it.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Hotline design — incident taxonomy, escalation ladder, and the credibility problem addressed",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The desk officers on both ends who would have to use it at 3am.",
      "skills": [
        "crisis mechanism design",
        "institutional analysis",
        "signalling under mistrust",
        "precedent critique"
      ],
      "prerequisites": [
        "Verification 0 — treaty anatomy",
        "Verification 1 — actors",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 7",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §0.2",
          "href": null
        },
        {
          "label": "verification-track-outline.md §4.1",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>A bilateral incident hotline is one of the few AI governance proposals with a working historical model and near-universal endorsement. The orphan catalogue's complaint: nobody has laid out a detailed plan for creating one.</p>\n<p>Lay it out.</p>\n<ul><li><strong>What counts as an incident.</strong> The definitional core. A model that behaves unexpectedly in a military-adjacent system, a suspected exfiltration, a capability jump nobody declared, a false alarm in a monitoring system. Each needs a threshold, or the line rings for everything and then for nothing.</li><li><strong>Who picks up.</strong> Named institutional roles on both sides, their authority to speak, and what happens when the person with the technical knowledge and the person with the authority are not the same person — which, on this subject, they never are.</li><li><strong>What gets said.</strong> The message template. This is where the design lives: the whole point is conveying enough to defuse without conveying enough to compromise. Say what fields the message has and what each side is deliberately not required to reveal.</li><li><strong>The credibility problem.</strong> Why the receiving side believes anything sent over the line. This is a verification question, and it is the reason a hotline is not simply a phone number: a channel that can be used to lie convincingly is worse than no channel.</li><li><strong>The precedent read.</strong> What the nuclear-era analogues actually did, and where the analogy breaks — different timescales, private-sector actors on one side of the wire, no equivalent of a launch detection.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's spine is verification between two parties who expect to be cheated. A hotline is the smallest possible instance: no inspections, no thresholds, one channel, and the entire question is whether a message across it changes what the other side believes. Module 4's layering question in miniature.</p>\n<p>It is also the track's cheapest real-world artifact. Almost everything else in verification needs hardware that does not exist yet or a treaty nobody will sign. A hotline needs a definition, a roster and a template — which is precisely why its absence is embarrassing.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the arms-control hotline literature, public reporting on existing bilateral military channels, and the track's actor taxonomy.</p>\n<p><strong>Out of scope:</strong> the diplomacy of proposing it, and the technical security of the channel itself. Assume a secure channel exists; the hard part is what travels down it.</p>\n<p><strong>Do not design a general-purpose crisis mechanism.</strong> One incident class done to the level of a usable message template beats a taxonomy of twelve.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Incidents</td><td>\"Significant AI-related events\"</td><td>Thresholds per class, and a named event that deliberately does not qualify</td></tr><tr><td>Roster</td><td>\"Senior officials\"</td><td>Roles with authority stated, and the technical/authority split addressed</td></tr><tr><td>The message</td><td>\"Both sides share information\"</td><td>A template with fields, and what each side is not required to disclose</td></tr><tr><td>Credibility</td><td>Assumed</td><td>Why the receiver believes it, and what a deceptive use of the line would look like</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the message template first. It forces every other decision — who can send it, what they must know, what they are protecting.</li><li>Pick the incident class you find hardest to define. The easy ones do not need a hotline.</li><li>Red-team it as a deception channel in week two. If the line makes a convincing lie cheaper, the design has to change.</li></ol>"
    },
    {
      "slug": "weight-security-baseline",
      "source": "verification-capstones/weight-security-baseline.md",
      "title": "The Security Baseline That Would Have Stopped It",
      "track": "Verification",
      "status": "draft",
      "summary": "Weight exfiltration is the evasion route that voids the compute regime. Write the infrastructure-security baseline a regime would require in advance, and price it.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 14,
        "max": 20,
        "label": "14–20 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈6 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Security baseline by threat tier, with the audit evidence for each control and its cost",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The regulator writing a security condition, and the lab that has to pass an audit against it.",
      "skills": [
        "security requirement design",
        "threat tiering",
        "auditability analysis",
        "cost-of-compliance analysis"
      ],
      "prerequisites": [
        "Verification 2.4 — the human layer",
        "Verification 3 — covert development",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), security questions: what infrastructure-level cybersecurity measures protect model weights from theft; how can models be protected from inference attacks reproducing weights",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 39: espionage and risks from AI",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        },
        {
          "label": "Ten AI safety projects I'd like people to work on — Julian Hazell, project 1 (AI security field-building)",
          "href": "https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §3 (evasion scenario 4 — weight exfiltration)",
          "href": null
        },
        {
          "label": "verification-track-outline.md §2.4",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The bank already has a capstone for the day after weights leak, and it deliberately treats prevention as somebody else's job. This is that job.</p>\n<p>Write the security baseline a verification regime would require of a covered developer — and make it auditable, because a requirement nobody can check against is a requirement that exists only in the recital.</p>\n<ul><li><strong>Threat tiers.</strong> Opportunistic outsider, motivated criminal, insider with legitimate access, state actor with a budget and patience. The baseline is different at each, and a regime that names no tier has silently picked the cheapest one.</li><li><strong>Controls by tier.</strong> What is actually required: where weights may live, key management, egress restriction, hardware-backed storage, separation of duties, insider-risk programmes, vendor and contractor scope. Keep each control to something a regulator could point at.</li><li><strong>The audit evidence.</strong> Per control, what an auditor would look at to establish it is in place — and not merely documented. This is the section that decides whether the baseline is real, and the one most security policies skip.</li><li><strong>The human layer.</strong> Module 2.4's territory. Most exfiltration paths run through people with legitimate access, and technical controls that ignore that are ignoring the main route. Say how your baseline handles the insider who is authorised.</li><li><strong>The cost.</strong> By tier, roughly, and the honest note: at the state-actor tier the baseline may exceed what any commercial developer will pay, which is a finding a regime needs before it writes the condition rather than after.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 3 rates weight exfiltration as the evasion that bypasses the compute regime entirely — training already happened, and the artifact is a file. The whole verification edifice rests on the assumption that this does not happen, and that assumption is currently backed by whatever security each lab chose.</p>\n<p>It is also the point in the track where verification meets ordinary security engineering, and where learners find out how much of governance is asking \"how would you know?\" of controls somebody has already asserted.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published security frameworks and their AI-specific adaptations, public reporting on lab security practice, and the insider-risk literature.</p>\n<p><strong>Out of scope:</strong> penetration testing, any specific organisation's actual posture, and offensive detail. You are writing a requirement and its audit procedure, not a threat report.</p>\n<p><strong>Do not write a control list and stop.</strong> Half this capstone is the audit column. A baseline whose controls cannot be evidenced is exactly the paperwork regime Module 2.2 warns about, in a different domain.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Tiers</td><td>One undifferentiated baseline</td><td>Four tiers, with the control set changing between them</td></tr><tr><td>Controls</td><td>Borrowed wholesale from a framework</td><td>Selected, with the AI-specific reason each one is here</td></tr><tr><td>Audit evidence</td><td>Absent</td><td>Per control, what an auditor inspects, and how it distinguishes real from documented</td></tr><tr><td>Cost</td><td>Ignored</td><td>Per tier, with the honest note about where it exceeds commercial willingness</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Pick the tier the regime actually cares about before writing controls. Most baselines are written for the opportunistic outsider and quoted as though they addressed the state actor.</li><li>Write the audit column beside every control as you add it. Retrofitting it deletes about a third of the list.</li><li>Do the insider path in week two. It is the hardest section and the one that reshapes the technical controls around it.</li></ol>"
    },
    {
      "slug": "whistleblower-channel-design",
      "source": "verification-capstones/whistleblower-channel-design.md",
      "title": "A Reporting Channel an Insider Would Actually Use",
      "track": "Verification",
      "status": "draft",
      "summary": "Module 2.4 says the human layer reveals what hardware and intelligence cannot — if evidence reaches a verifier. Design the channel, against the NDAs and equity that stop it.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
      },
      "effort": {
        "min": 12,
        "max": 18,
        "label": "12–18 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "3 weeks",
        "weeks": 3
      },
      "perWeek": "≈5 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Channel design — who receives, what protects the reporter, and the evidence standard on arrival",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The regulator or oversight body that wants insider evidence and currently receives none.",
      "skills": [
        "institutional design",
        "incentive analysis",
        "evidence standards",
        "protective-regime drafting"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.4 — the human layer"
      ],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 20: AI and whistleblowing",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        },
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 22: incident detection and monitoring at AI companies",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025)",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "List of lists of project ideas in AI safety — LessWrong",
          "href": "https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety"
        },
        {
          "label": "verification-track-outline.md §2.4",
          "href": null
        }
      ],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.4 makes the case and states the problem in the same breath: humans reveal what the other three layers cannot — what the company believed, what leadership was warned about, what was suppressed — and frontier AI adds secrecy, NDAs, equity incentives and race pressure on top. Whether that evidence reaches a verifier depends on reporting channels, anti-retaliation protection and institutional independence.</p>\n<p>Design one channel, properly.</p>\n<ul><li><strong>Reportable matter.</strong> What this channel is for. Not general wrongdoing — something like: a safety evaluation whose result was overridden, a capability finding not disclosed to a regulator, a security incident not reported. Narrow scope is what makes protection defensible.</li><li><strong>The recipient.</strong> Who receives, and what makes them independent enough to be worth the risk. Regulator, standards body, an inspector general, a designated board committee. Say what happens to a report on arrival and on what clock.</li><li><strong>The reporter's calculus.</strong> Written explicitly, because this is where channels die. What they lose: unvested equity, non-disparagement exposure, future employment in a small field where everyone knows everyone. What your design gives back: anonymity that survives a small-team context where three people knew the fact, legal-cost cover, protection that binds a company that has not agreed to it.</li><li><strong>Evidence on arrival.</strong> What a report has to contain to be actionable, and how a recipient triages between a serious disclosure and a grievance — without a standard so high that only documented cases get through.</li><li><strong>The failure mode.</strong> Channels that exist and are never used, and channels used and ignored. Say which of the two your design is more at risk of.</li></ul>\n<h3>Why it exists</h3>\n<p>The human layer is where the track's realism lives. The other three layers can be improved with engineering; this one runs on whether a specific person, with a mortgage and a non-disparagement clause, decides to speak. Designing for that is a different discipline from designing a telemetry rule, and learners who can do both understand why regimes fail in practice more often than in theory.</p>\n<p>It also connects directly to Module 3: several evasion scenarios — false reporting, hidden clusters, disguised workloads — are ones where an insider is the only realistic detection route.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> existing whistleblower regimes in finance, aviation, nuclear and pharma; public reporting on AI-lab NDAs and equity arrangements; the protective-legislation literature.</p>\n<p><strong>Out of scope:</strong> drafting statutory text, and any specific company's alleged conduct. This is mechanism design; the examples are illustrations.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Scope</td><td>\"Safety concerns\"</td><td>A defined class of reportable matter, with an example that deliberately falls outside</td></tr><tr><td>Recipient</td><td>\"An independent body\"</td><td>Named form, what independence rests on, and the clock on their response</td></tr><tr><td>The calculus</td><td>Protection listed</td><td>The reporter's actual losses priced, and what your design returns against each</td></tr><tr><td>Anonymity</td><td>Promised</td><td>Assessed honestly against a context where three people knew the fact</td></tr></tbody></table></div>\n<p>The strongest submissions admit that anonymity is usually unachievable at frontier labs and design for a reporter who will be identified.</p>\n<h3>Getting started</h3>\n<ol><li>Read one mature regime's annual report — how many disclosures, how many actioned, how many retaliation findings. Those ratios discipline the design.</li><li>Write the reporter's calculus in the first session. If your channel does not survive it, nothing downstream matters.</li><li>Pick the narrowest reportable matter you can justify. Broad channels get broad opposition and thin protection.</li></ol>"
    }
  ]
};
