/* GENERATED FILE — do not edit by hand.
   Source: verification-capstones/*.md
   Regenerate: npm run verification:capstones
   80 capstone(s). Ordering and formatting are deterministic so
   CI can diff this file against a fresh build. */
window.CAPSTONE_BANK = {
  "count": 80,
  "entries": [
    {
      "slug": "agent-eval-design",
      "source": "verification-capstones/agent-eval-design.md",
      "title": "Evaluate an Agent, Not a Model",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Agent capability depends on the scaffold, the tools and the environment as much as the model. Build the eval that survives that, and report what your score is actually about.",
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
      "deliverable": "Agent eval with an ablation over scaffold and tools, plus a note on what the score attributes to what",
      "deliverableType": "notebook",
      "mentor": "recommended",
      "audience": "The regulator who will be handed an agent benchmark score and asked to trigger on it.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "agent evaluation",
        "ablation design",
        "attribution of capability",
        "environment design"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025), \\\"Better elicitation techniques\\\" and the agent-forecasting extensions",
          "href": "https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit\">A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)</a>, the \"Better Elicitation techniques\" entry. Quoted:</p>\n<blockquote><p>Are there any low-hanging fruit for better elicitation that people are missing? Are there techniques that can be applied to a wide range of models that can quickly improve their performance on benchmarks like METR’s general autonomy suite and get better performance than what METR got during their elicitation? (Especially with a similar or smaller amount of labor, e.g. 6 days) Candidates for such techniques include:</p>\n<p>Some more clever way of doing best-of-N</p>\n<p>Some tree-search technique that isn’t ultra costly</p>\n<p>Better general-purpose tools for LM agents, e.g. like Anthropic’s edit tool</p>\n<p>Some fuzzing like techniques to improve exploration.</p></blockquote>\n<p>And under \"Observational scaling laws\", among the extensions it lists to a published agent-forecasting method:</p>\n<blockquote><p>Rerun the methodology on more agentic benchmarks, e.g. MLE-Bench</p>\n<p>Try really hard to get good scaffolding for some of these benchmarks and see if the trends hold.</p></blockquote>\n<h3>What you produce</h3>\n<p>An answer at capstone scale: one agent eval in a scriptable environment, the ablation that varies scaffold and tools while the model is held fixed — better general-purpose tools included — and the attribution note saying what the score is a property of and whether the trends hold under the scaffolding you found.</p>"
    },
    {
      "slug": "antitrust-waiver-letter",
      "source": "verification-capstones/antitrust-waiver-letter.md",
      "title": "Write the Antitrust Waiver Letter",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Developers say antitrust risk stops them agreeing minimum safety standards together. Draft the business review letter that would clear it, and the request that earns one.",
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
      "deliverable": "Draft request letter, the anticipated agency response, and the conduct it would and would not clear",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "The Assistant Attorney General who would have to sign it.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "regulatory drafting",
        "antitrust literacy",
        "agency process",
        "scoping a legal ask"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 2: antitrust waiver",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance\">Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025)</a>, the \"Antitrust Waiver\" entry (orphan 2). Quoted:</p>\n<blockquote><p>LawAI proposed in 2021 that the government should issue a waiver to AI developers promising not to prosecute them under the antitrust laws for meeting to discuss minimum safety standards. Competitors are normally not allowed to meet with each other to agree on changes to their business practices, but such a meeting would be allowed if there were an explicit government waiver, or if the meeting was hosted by a bona fide trade association that has non-commercial purposes.</p>\n<p>The consensus seems to be that companies are not actually that afraid of being prosecuted for antitrust violations based on negotiating industry-wide minimum safety standards, but because some companies (e.g. Google) are being actively investigated or prosecuted for other antitrust violations, the fear that such talks could endanger the parent corporation is a convenient excuse that can be used by executives to tell an engineer not to pursue safety agreements. Getting a waiver granted could eliminate that excuse, making such safety agreements more likely to take place.</p>\n<p>Unfortunately, to date, nobody has drafted a sample waiver letter that could be signed by the Assistant Attorney General for Antitrust, let alone sent that letter to the Assistant Attorney General and asked them to sign it.</p>\n<p>It looks like the Frontier Model Forum is at least a plausible candidate for a non-commercial trade association that could serve as a protected forum for hashing out safety agreements, but it’s not clear whether this forum has the desire or ability to help companies enter into binding negotiations, rather than just identify voluntary best practices.</p></blockquote>\n<p>The entry's adoption suggestion:</p>\n<blockquote><p>You can help by writing the waiver letter or by investigating the Frontier Model Forum and seeing what if anything else they need in order to be more active in setting safety standards for existential risk from AI.</p></blockquote>\n<h3>What you produce</h3>\n<p>The waiver letter the entry says nobody has drafted, addressed to the Assistant Attorney General for Antitrust: the conduct described precisely, the competitive analysis, the anticipated response, and what the letter would and would not clear — or the Frontier Model Forum investigation the same entry offers as the alternative route.</p>"
    },
    {
      "slug": "assurance-disclosure-tradeoff",
      "source": "verification-capstones/assurance-disclosure-tradeoff.md",
      "title": "What Assurance Costs in Secrets",
      "track": "Verification",
      "status": "draft",
      "summary": "Every verification mechanism buys confidence by spending the operator's secrets. Price the exchange rate across inspections, taps, telemetry, trusted hardware and recomputation.",
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
      "deliverable": "Assurance × disclosure × intrusiveness matrix",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The operator and verifier negotiating what must be shown for what assurance.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "mechanism comparison",
        "privacy analysis",
        "trade-off mapping"
      ],
      "prerequisites": [
        "Verification 2.0 — confidentiality vs verifiability",
        "Verification 2.x — the four layers"
      ],
      "sources": [
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1 and §3.2",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Section 1. Quoted:</p>\n<blockquote><p>Confidentiality-preserving and secure verification of rules on large-scale AI has unique potential. Historically, it has been politically crucial for international verification methods to avoid information leaks that create serious security risks, and (to a lesser extent) to avoid leaks of trade secrets [39, 13]. The AI industry has an abundance of highly sensitive information, from AI model weights [143] and algorithms to training/user data. Confidentiality-preserving verification may be especially important and feasible for large-scale AI development and deployment [187], such as training a future, powerful model and deploying it at scale. Such large-scale AI activities carry unique risks [15, 17, 170]. They are also industrial, billion-dollar-scale undertakings [93, 5, 58], requiring “thousands of specialized chips” [178] and counting [184]. This broad trend continues to hold despite algorithmic advances, such as those of reasoning models and DeepSeek’s R1 [88].</p></blockquote>\n<p>Section 3.2 states the technology that would pay the price down:</p>\n<blockquote><p>Use of confidentiality-preserving technology. Importantly, in our framework, declarations of AI compute use would be reported and verified via confidentiality-preserving technology—technology that enables a Prover to demonstrate their compliance without leaking their highly sensitive IP such as model weights. Such technology could include (i) a hardware security feature known as Confidential Computing (Section 4.1.1.1); and (ii) compute clusters with security that both parties can confirm, so that much information can enter these devices but only a small amount of information (e.g., compliance determinations) can leave (Section 4.2.1.1). Declarations of AI compute ownership are less sensitive than declarations of AI compute usage, but, if desired, the confidentiality-preserving technologies we discuss could also help protect these ownership declarations. As we will discuss (Section 4.5), confidentiality-preserving technologies could be used to run hard-coded compliance tests, or perhaps to facilitate iterative testing by humans or AI agents, though the human option poses more confidentiality challenges.</p></blockquote>\n<h3>What you produce</h3>\n<p>The price list the quoted tension implies: for each level of assurance a verifier might want in a compliance claim, what the operator has to disclose and how deep the mechanism reaches into the facility — one assurance, disclosure and intrusiveness matrix, compared like for like across mechanisms.</p>"
    },
    {
      "slug": "best-practices-implementation",
      "source": "verification-capstones/best-practices-implementation.md",
      "title": "Implementation Details of the Best-Practices List",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Experts across sectors agreed on best practices for AGI developers; the survey stopped short of implementation. Work out how the surveyed items would be implemented in practice.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Implementation plan for items from the best-practices survey — stakeholders, sequencing, and what each item needs in practice",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "policy analysis",
        "stakeholder mapping",
        "strategy planning"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 21: implementation details of the best practices list",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "procurement-as-lever",
          "title": "Govern Through the Purchase Order"
        },
        {
          "slug": "rmf-compliance-scorecard",
          "title": "Score the Developers Against the NIST Framework"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 21, \"Implementation Details of the “Best Practices” List\". Quoted:</p>\n<blockquote><p>Researchers from GovAI have previously surveyed leading experts from AGI labs, academia and civil society on best practices for those developing advanced AI systems. This has allowed researchers to collect a list of measures including risk assessments and evaluations that have buy-in from a wide range of actors across sectors, which should make them easier to embed into existing or forthcoming regulatory regimes. That said, the survey was focused mostly on what would be good ideas, and given the methodology, didn’t go into depth as to how these approaches would be implemented in practice.</p></blockquote>\n<p>The idea's research question, under its own \"Research Questions\" heading:</p>\n<blockquote><p>How can the items identified in this survey be implemented?</p></blockquote>\n<h3>What you produce</h3>\n<p>The implementation depth the survey deliberately left out: for items from the surveyed list, how each would be implemented in practice, using the methodology the idea names — policy analysis, strategy planning, stakeholder mapping.</p>"
    },
    {
      "slug": "capability-chart-refresh",
      "source": "verification-capstones/capability-chart-refresh.md",
      "title": "Redraw the AI-vs-Human Capability Chart",
      "track": "Technical Governance",
      "status": "ready",
      "summary": "The best-known chart of AI against human performance stops in 2023. Rebuild it at today's date and say what a threshold can honestly attach to.",
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
      "deliverable": "Reproducible chart and dataset, a methods note, and a two-page brief on what a capability threshold can be written against",
      "deliverableType": "notebook",
      "mentor": "optional",
      "audience": "Anyone about to cite a capability curve in a threshold argument.",
      "verificationFit": "Lands on 1.1 — a pause agreement has to name a covered capability, and this is the measurement that claim would rest on.",
      "courseFit": true,
      "skills": [
        "benchmark literacy",
        "data provenance",
        "normalisation choices",
        "trend presentation",
        "threshold design"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Dynabench: Rethinking Benchmarking in NLP — Kiela et al. (2021), §1 and Figure 1",
          "href": "https://arxiv.org/abs/2104.14337"
        },
        {
          "label": "Test scores of AI systems on various capabilities relative to human performance — Our World in Data",
          "href": "https://ourworldindata.org/grapher/test-scores-ai-capabilities-relative-human-performance"
        },
        {
          "label": "AI Benchmarking Dashboard — Epoch AI",
          "href": "https://epoch.ai/data/ai-benchmarking-dashboard"
        },
        {
          "label": "AI Index — Stanford HAI",
          "href": "https://hai.stanford.edu/ai-index"
        }
      ],
      "similar": [
        {
          "slug": "threshold-decay-analysis",
          "title": "How Fast Does a Compute Threshold Decay?"
        },
        {
          "slug": "field-map-refresh",
          "title": "Refresh a Governance Field Map"
        },
        {
          "slug": "eval-to-threshold-brief",
          "title": "From Eval Result to Policy Threshold"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2104.14337\">Dynabench: Rethinking Benchmarking in NLP — Kiela et al. (2021)</a>, whose Figure 1 the Our World in Data chart descends from. Quoted:</p>\n<blockquote><p>While it used to take decades for machine learning models to surpass estimates of human performance on benchmark tasks, that milestone is now routinely reached within just a few years for newer datasets (see Figure 1).</p></blockquote>\n<p>That figure's caption states the normalisation the famous chart still uses:</p>\n<blockquote><p>Figure 1: Benchmark saturation over time for popular benchmarks, normalized with initial performance at minus one and human performance at zero.</p></blockquote>\n<p>And the introduction says what saturation does and does not mean:</p>\n<blockquote><p>When the GLUE dataset was introduced, “solving GLUE” was deemed “beyond the capability of current transfer learning methods” Wang et al. 2018. However, GLUE saturated within a year and its successor, SuperGLUE, already has models rather than humans at the top of its leaderboard. These are remarkable achievements, but there is an extensive body of evidence indicating that these models do not in fact have the human-level natural language capabilities one might be lead to believe.</p></blockquote>\n<h3>What you produce</h3>\n<p>The chart rebuilt at today's date on the caption's own terms — initial performance at minus one, human performance at zero — with a provenance column for every row, an explicit retirement-and-succession rule for saturated series, and the two-page brief saying what a capability threshold can honestly attach to when benchmark saturation is not the same thing as human-level capability.</p>"
    },
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers — Egan & Heim (2023)",
          "href": "https://arxiv.org/abs/2310.13625"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2310.13625\">Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers — Egan &amp; Heim (2023)</a>, the abstract. Quoted:</p>\n<blockquote><p>KYC, a standard developed by the banking sector to identify and verify client identity, could provide a mechanism for greater public oversight of frontier AI development and close loopholes in existing export controls.</p></blockquote>\n<p>The executive summary states the two recommendations this project builds out:</p>\n<blockquote><p>Establish a threshold of compute for the scheme that effectively captures high-risk frontier model development, while minimizing imposition on developers not engaged in frontier AI. The threshold should be defined by the total amount of computational operations – a metric easily accessible to compute providers, as they employ chip-hours for client billing, convertible to total computational operations. Additionally, this threshold would need to be dynamic and subject to periodic reassessments by government, in close consultation with industry, to remain in step with developments in training efficiency as well as broader societal changes. It would also need to be supported by collaboration between compute providers, as well as with government, to minimize evasion risks.</p>\n<p>Set clear requirements for compute providers, including requirements for gathering information, implementing fraud detection, keeping records, and reporting to government any entities that match government-specified ‘high-risk’ profiles. These requirements should be technically feasible, resilient against efforts to evade detection and enforceable, while preserving privacy.</p></blockquote>\n<h3>What you produce</h3>\n<p>The reporting-rule spec the quoted requirements call for: what a provider must gather, keep and report, each claim rated for how checkable it actually is, and the evasion routes the rule leaves open — with the quoted threshold's drift handled rather than assumed away.</p>"
    },
    {
      "slug": "cohort-tabletop-design",
      "source": "verification-capstones/cohort-tabletop-design.md",
      "title": "Design a Cohort Tabletop Exercise",
      "track": "Program-wide",
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
      "verificationFit": null,
      "courseFit": false,
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Design a three-hour tabletop that teaches one governance mechanism by making a group of six to ten people live inside it. Then hand it to a facilitator who was not in the room while you built it, and watch.</p>\n<p>The pack contains:</p>\n<ul><li><strong>The scenario.</strong> A situation with a real decision under time pressure, set close enough to the present to be legible and far enough to avoid litigating today's headlines.</li><li><strong>Role cards.</strong> Each role gets private objectives, private information, and a constraint that makes the obvious move costly. Roles must be playable by someone who has done the reading and nothing more.</li><li><strong>The inject schedule.</strong> What lands at minute 20, 55, 90 — and the branch conditions for each.</li><li><strong>Scoring or judgement.</strong> How the room learns whether it did well. This can be a scoring rule or a structured facilitator verdict, but it cannot be \"we discuss how it went\".</li><li><strong>The debrief guide.</strong> The three questions that convert the experience into a transferable lesson, plus the two arguments the room will predictably have and how to use them.</li></ul>\n<h3>Why it exists</h3>\n<p>The program's bet is that scaffolding should fade until the learner is the adult in the room. Designing the exercise other people learn from is the furthest end of that fade — you cannot build a working tabletop without holding the mechanism, the actors, and the failure modes simultaneously.</p>\n<p>It is also the one capstone that produces reusable program assets. A pack that survives playtesting goes into the facilitator guide.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one mechanism, three hours, six to ten players, paper and a whiteboard. Two playtests minimum — one internal, one with players who have not seen the design.</p>\n<p><strong>Out of scope:</strong> software. If the exercise needs a custom app to run, it is out of scope for a four-week capstone and the design is doing too much.</p>\n<p>Ambition warning: this is the largest capstone in the bank and the only one that requires a team of three or more. It is not a lighter option than writing a memo.</p>\n<h3>What good looks like</h3>\n<ul><li>A facilitator with the pack and no other context runs it successfully. This is the test; everything else is preparation for it.</li><li>Playtest findings appear in the final pack as changes, with a short log of what you changed and why.</li><li>The debrief lands the mechanism, not the drama. Players should leave able to state what the mechanism does and where it breaks.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Choose the mechanism by asking what your cohort argued about most. Live disagreement is fuel.</li><li>Write one role card fully before designing the scenario. Roles constrain scenarios more than the reverse.</li><li>Playtest at half scale in week 2, with an unfinished pack. Waiting until it is polished wastes the playtest.</li></ol>"
    },
    {
      "slug": "comparative-jurisdiction-dossier",
      "source": "verification-capstones/comparative-jurisdiction-dossier.md",
      "title": "Comparative Jurisdiction Dossier",
      "track": "AI Governance Policy",
      "status": "ready",
      "summary": "Take one governance mechanism and trace how three jurisdictions implement it — where the language diverges, and what that costs a compliant developer.",
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
      "difficulty": "core",
      "deliverable": "Comparison matrix plus an eight-page analysis",
      "deliverableType": "dossier",
      "mentor": "optional",
      "audience": "A compliance lead operating in all three jurisdictions at once.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "comparative analysis",
        "statutory reading",
        "institutional literacy",
        "synthesis"
      ],
      "prerequisites": [],
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one mechanism — incident reporting, pre-deployment testing, model documentation, compute-threshold triggers, third-party audit — and follow it through three jurisdictions with real, citable instruments.</p>\n<p>The dossier delivers:</p>\n<ul><li><strong>The matrix.</strong> Rows are the design choices inside the mechanism (who is covered, what triggers it, what must be produced, to whom, by when, with what consequence). Columns are the jurisdictions. Every cell cites a clause.</li><li><strong>The divergences.</strong> Where the three genuinely disagree, as opposed to where they use different words for the same rule.</li><li><strong>The compliance cost.</strong> What a developer operating in all three actually has to build. This is where comparative analysis stops being an academic exercise.</li><li><strong>The prediction.</strong> Which version is likely to become the de facto global standard, and the mechanism by which that would happen — market size, first-mover drafting, or institutional capacity.</li></ul>\n<h3>Why it exists</h3>\n<p>Institutional literacy is the named gap in governance hiring: technically strong candidates fail on not knowing which body holds which lever. Tracing one mechanism through three legal systems teaches that faster than any survey, because the mechanism holds still while the institutions move around it.</p>\n<p>The repo's <code>policy-briefs/</code> folder already holds eight instruments summarised to a common shape — treat them as your starting index, not your evidence. Cite the primary text.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> binding instruments and formally proposed ones. Three jurisdictions, one mechanism.</p>\n<p><strong>Out of scope:</strong> voluntary commitments and standards-body output, unless one of your three jurisdictions incorporates them by reference — in which case that incorporation is itself a finding.</p>\n<p>Keep the comparison genuinely comparative: a US/EU pair plus a third that is neither is worth more than the US/EU/UK default.</p>\n<h3>What good looks like</h3>\n<ul><li>Every matrix cell has a clause reference. A cell reading \"similar\" is an unfinished cell.</li><li>You distinguish textual divergence from operational divergence. Two instruments with different definitions that bind the same set of actors have not actually diverged.</li><li>The compliance-cost section is specific enough that a reader could estimate headcount.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Choose the mechanism by asking which one you could explain to a colleague in ninety seconds. Then discover you cannot.</li><li>Build the matrix rows before reading the third instrument — you want a fixed frame, not one that reshapes itself around whatever you read last.</li><li>Split by jurisdiction in your team, then swap and check each other's cells against the primary text. Cross-checking is the exercise.</li></ol>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §4.1.1.1",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), verification questions: what methods can verify compute usage without TEEs; can ZKPs demonstrate compliance without disclosing architectural details; how can TEEs be designed to limit misuse",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Section 4.1.1.1, Prerequisites: Hardware Security Features. Quoted:</p>\n<blockquote><p>Confidential Computing: Confidential Computing is a hardware feature that, among other uses, can allow multiple parties to share their information only for specific purposes. This could enable a Verifier to run tests on a Prover’s models, data, and code—with the Prover knowing their information will not be stolen, and with the Verifier knowing their tests will be run faithfully and will not be viewed for the sake of manipulating test results.</p>\n<p>Confidential Computing (or more precisely, one of its functionalities) is intended to work as follows. First, multiple parties share their encrypted data, giving access only to a specific computer program on specific hardware. (They can scrutinize this program’s code in advance.) Then, hardware features ensure the program is executed faithfully and without leaks. Finally, a digital signature confirms that the test results came from this approved program [41, 79].</p></blockquote>\n<h3>What you produce</h3>\n<p>One claim worked through the quoted machinery and its fallbacks — trusted hardware, a cryptographic protocol without it, and managed human access when neither is ready: the protocol sketch, exactly who must be trusted about what on each route, and the residual disclosure each route still charges.</p>"
    },
    {
      "slug": "compute-accounting-audit",
      "source": "verification-capstones/compute-accounting-audit.md",
      "title": "A Minimum Viable Compute-Accounting Audit",
      "track": "Verification",
      "status": "draft",
      "summary": "What should a commercial AI audit prove about how each GPU was used? Claims, logs, retention, auditor access — and what happens when logs are missing.",
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
      "deliverable": "Draft auditing standard, 2–3 pages",
      "deliverableType": "spec",
      "mentor": "optional",
      "audience": "The audit firm that has to say what its stamp proves.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "audit design",
        "evidence standards",
        "logging requirements"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.2 — the cloud layer"
      ],
      "sources": [
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.6 and Appendix B.1",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix A.6, Compute Accounting via Analog Sensors. Quoted:</p>\n<blockquote><p>Background: In compute accounting, one verifies the amount of AI compute used by a Prover, and verifies that a high fraction of this compute use can be accounted for by declared uses. Ideally, the declared AI compute use would add up to 100% of the AI compute use. If a sufficiently high fraction of compute use can be accounted for, this implies the Prover cannot have done large-scale, undeclared use of AI compute, among the computing clusters being accounted for. Off-chip analog sensors could enable three partly compatible approaches to compute accounting (Table 13), if combined with other mechanisms (such as partial workload re-execution, Appendix A.4) for verifying declared uses and ensuring the integrity of analog sensors (Section 4.2.1.1).</p></blockquote>\n<p>Appendix B.1 states why compute, of all inputs, is the one to account for:</p>\n<blockquote><p>AI compute is relatively specialized and large in its physical footprint, making it more suitable to being accounted for than other resources used in AI development and deployment (Table 16).</p></blockquote>\n<h3>What you produce</h3>\n<p>The auditing standard compute accounting does not yet have: what records an operator must keep, what the auditor checks, and what an audit opinion does and does not certify about the accounted fraction the quote defines.</p>"
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
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "analogical reasoning",
        "regime analysis",
        "precedent critique"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.1 — the hardware layer"
      ],
      "sources": [
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §4.2.1.2",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article V",
          "href": "https://arxiv.org/abs/2511.10783"
        },
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 66: learning from chain of custody applications in other industries",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "stock-and-flow-accounting",
          "title": "Stock and Flow Accounting Case Studies"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Section 4.2.1.2, Verification Mechanisms. Quoted:</p>\n<blockquote><p>Verifying AI chips’ chain of custody: A Verifier could verify the locations and owners of random samples of AI chips from manufacturing to end-of-life destruction. This would serve to verify that large quantities of AI chips are not assembled into undeclared AI compute clusters (Subgoal 2.B). Users of small quantities could potentially be exempt. Existing AI chips would be a challenge, though perhaps many could have their locations and owners retroactively verified. Declared chains of custody could be verified with inspections, potentially supplemented by video cameras [13] and hard-to-spoof, unique IDs.</p></blockquote>\n<p>And from <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix A, Article V, on the consolidation such a regime would monitor:</p>\n<blockquote><p>Parties to the Agreement monitor the domestic consolidation process, coordinated by the CTB, including through on‑site inspections, document and inventory verification, accompaniment of domestic authorities during transfers and inspection, and information sharing with Parties under Article X. The CTB may require chain‑of‑custody records for transfers. Parties may conduct challenge inspections as described in Article X. Parties provide timely access to relevant facilities, transport hubs, and records to inspectors conducting monitoring activities. Whistleblower protections and incentives under Article X apply to the consolidation process, and the CTB maintains protected reporting channels.</p></blockquote>\n<h3>What you produce</h3>\n<p>The case study and transfer analysis the mechanism above calls for: one existing custody regime studied for how declarations, inspections and unique IDs actually hold up, and what that implies for tracking chips from manufacturing to end-of-life destruction.</p>"
    },
    {
      "slug": "compute-monitoring-costing",
      "source": "verification-capstones/compute-monitoring-costing.md",
      "title": "What Would Compute Monitoring Actually Cost?",
      "track": "Verification",
      "status": "draft",
      "summary": "The compute-monitoring literature has the mechanisms, the timing, even a first-pass inspector headcount. It has no penalties and no price. Produce the costing a budget office would need.",
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 8: compute monitoring",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        },
        {
          "label": "What does it take to catch a Chinchilla? Verifying Rules on Large-Scale Neural Network Training via Compute Monitoring — Shavit (2023), §3.2",
          "href": "https://arxiv.org/abs/2303.11341"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance\">Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025)</a>, the \"Compute Monitoring\" entry (orphan 8). Quoted:</p>\n<blockquote><p>There has been much discussion of how the government could attempt to track large clusters of computing power with the goal of knowing who is doing large-scale training runs so that the government could intervene in an emergency. Yonadav Shavit’s 2023 paper “What Does It Take to Catch a Chinchilla?” provides a useful amount of detail about how often inspections would need to take place, but there is still much work to be done in terms of figuring out who would do these inspections, what the penalties would be for noncompliance, and how the hardware innovations required would be paid for.</p></blockquote>\n<p>Two paragraphs later, the entry names the numbers still missing:</p>\n<blockquote><p>There are many details that remain to be worked out in terms of what specific hardware features could and should be placed on chips to make them easier for the government to monitor. Should advanced AI chips have GPS locators? Should they include proof-of-work features that allow others to identify what types of computations they were used on and roughly how many of those computations were performed? Should chips have a ‘kill switch’ that allows them to be remotely deactivated, or, more aggressively, a dead man’s switch that automatically deactivates them if they do not receive the correct password at periodic intervals?</p>\n<p>How much would it cost to develop each of these features, and how quickly could they be developed and manufactured? There are several academic papers that discuss these features in the abstract, but I am not aware of any that provide concrete estimates of time and cost. You can help by doing research that narrows down the range of plausible estimates.</p></blockquote>\n<p>The paper the entry leans on poses the inspection arithmetic itself — from <a href=\"https://arxiv.org/abs/2303.11341\">What does it take to catch a Chinchilla? — Shavit (2023)</a>, §3.2 and its footnoted estimate:</p>\n<blockquote><p>Yet, for training runs at the scale of 10^{25} FLOPs or greater, monitoring could be done with a bureaucracy similar in size to the IAEA.</p>\n<p>We want to estimate the number of inspectors needed to catch a Chinchilla-280B-sized training run, with 10^{25} FLOPs, given several more years of hardware progress and global production.</p>\n<p>Given C=10^{7} worldwide chips (&gt;5\\times global stocks as of 2022), each of which can output a=3\\cdot 10^{15}\\cdot 86400 FLOPs per day (3\\times more FLOP/s than the NVIDIA H100), detecting a Chinchilla-280B-sized run within T=30 days of its completion anywhere on earth with 90% probability would require roughly 232,000 worldwide chip samples per year.</p>\n<p>A single inspector might be expected to verify at least 1000 chips a year, especially if those chips are brought to a central location (see Section 3.1).</p>\n<p>This would require \\approx 232 inspectors, slightly smaller than the 280 active IAEA inspectors as of 2021.</p></blockquote>\n<h3>What you produce</h3>\n<p>The costing the entry says is missing: who employs the inspectors, the penalty schedule for noncompliance, who pays for the hardware features, and the narrowed range of time-and-cost estimates the last quoted paragraph asks for — built on the inspection arithmetic Shavit's estimate begins.</p>"
    },
    {
      "slug": "compute-production-gap-china",
      "source": "verification-capstones/compute-production-gap-china.md",
      "title": "Compute Production Gap and Data Centers in China",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "When would indigenous Chinese compute manufacturing equal US-and-allies' capability? Map the biggest datacenters, the buildout patterns, and the events that would change the forecast.",
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
      "deliverable": "Forecast memo on the manufacturing gap and datacenter landscape, with the events that would change it",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "forecasting",
        "data analysis",
        "open-source mapping"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 74: compute production gap, data centers and data asymmetry in China",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "export-control-circumvention",
          "title": "How Much Leaks Through the Export Controls?"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 74, \"Compute Production Gap, Data Centers and Data Asymmetry in China\". Quoted:</p>\n<blockquote><p>For a variety of strategic questions, the question of who is leading in AI and by how much is crucial, and compute is a central input to this. Therefore, work that estimates the gap between the U.S. and China could inform the strategy of actors across sectors. Similarly, mapping and rating Chinese competitiveness in the realm of data centres could be insightful.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>When would indigenous Chinese compute manufacturing capabilities equal US + allies’ 2024 indigenous compute manufacturing capabilities? When would indigenous Chinese compute manufacturing capabilities equal US + allies’ future indigenous compute manufacturing capabilities? (I.e., in what year would they equalize?)</p>\n<p>What events would change your expectations significantly?</p>\n<p>E.g. What’s the probability that China invents some “flip the board” chip manufacturing technology that circumvents key external supply chain bottlenecks (e.g., EUV)?</p>\n<p>E.g. Changes in US regulation with respect to the compute supply chain</p>\n<p>What are the biggest data centers in China? Are there patterns to where and how China builds state of the art data centers? (This is relevant to international monitoring &amp; verification schemes.)</p>\n<p>How capable is Chinese endogenous ability to build and operate state of the art data centers (assuming access to the relevant inputs)? How much aggregate compute does China have across all data centers? What are the biggest computations run in or across Chinese datacenters?</p>\n<p>How would you characterize the organization of the datacenter / HPC industries? What types of institutions (e.g. public-private partnerships?) are employed?</p></blockquote>\n<h3>What you produce</h3>\n<p>The forecast and the map the research questions ask for: the equalization estimate with the events that would move it, and the datacenter landscape reading — which the idea itself notes is relevant to international monitoring and verification schemes.</p>"
    },
    {
      "slug": "content-provenance-options",
      "source": "verification-capstones/content-provenance-options.md",
      "title": "What Content Provenance Can and Cannot Buy",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Measure how fast a watermark dies under ordinary handling, then write the policy-options memo that says which provenance obligations are worth imposing.",
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
      "deliverable": "Robustness measurements plus a policy-options memo ranking provenance obligations by what they survive",
      "deliverableType": "notebook",
      "mentor": "optional",
      "audience": "The legislator being told that watermarking solves AI-generated content.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "robustness testing",
        "measurement",
        "policy-options analysis",
        "communicating technical limits"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 59: what policy options exist for ensuring AI-generated content is identifiable as such?",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 59, \"What Policy Options Exist for Ensuring That AI-Generated Content is Identifiable As Such?\", suggested by Markus Anderljung. Quoted:</p>\n<blockquote><p>It seems important that at least certain AI-generated content can be identified as such, since we might be headed for a world where AI-generated content and AI-originating actions on the internet are indistinguishable from human-produced content and actions. That doesn’t intuitively seem like a good outcome given the difficulties to have a good overview of how AI is affecting the world or finding levers to improve its effects. Reasons for making AI-generated content identifiable include:</p>\n<p>Transparency: Knowing whether someone is interacting with AI content or an AI agent and knowing that a piece of content is AI-generated is important to judge whether it represents real events. Citizens may also have an interest in knowing whether they are engaging with an AI system or not, e.g. as this might inform decisions to seek a second opinion on a decision.</p>\n<p>Enforcing different rules for AI-generated content and actions: Companies ask people to verify that they are human to avoid abuse or breakdown of their services (e.g. Captcha).</p>\n<p>Incident investigation: As AI systems become more and more integrated into society, we’ll need better information about how and when things go wrong. To do so, it will be important to be able to trace specific incidents or real-world harms to specific AI systems or at the very least to the use of AI systems in the process.</p>\n<p>Macro assessments of AI adoption: Currently, there is very little quality public data on the adoption of AI across society. If there were watermarks, we could make such assessments by running a detector e.g. over Facebook.</p>\n<p>Possible techniques for ensuring such identification include watermarking, content provenance, retrieval-based detection and post-hoc detection.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>What policy options are available to ensure developers take those actions? Possible options include:</p>\n<p>Literally mandating it, but that could be very onerous, so perhaps should only be done for certain systems, e.g. those with a large user-base.</p>\n<p>Requiring that users include identifiers on content they post, which might incentivise companies to put identifiers into their AI tools.</p>\n<p>Tort liability</p>\n<p>Others (?)</p>\n<p>Which of these are most promising, and what do they require from other actors in the value chain (e.g. developers, but also users, and regulators)?</p></blockquote>\n<h3>What you produce</h3>\n<p>A robustness measurement of the techniques the idea names — watermarking, content provenance, retrieval-based detection, post-hoc detection — and the policy-options memo the research questions ask for: which options are available, which are most promising, and what each requires from developers, users, and regulators.</p>"
    },
    {
      "slug": "cooling-shutdown-verification",
      "source": "verification-capstones/cooling-shutdown-verification.md",
      "title": "Does Switching Off the Cooling Switch Off the Training?",
      "track": "Verification",
      "status": "draft",
      "summary": "An inspector confirms the cooling is off. Under what conditions does that actually rule out a large training run — and how would an operator get around it?",
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
      "deliverable": "Threat model with a claim → observable → evasion → countermeasure table",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "The inspectorate asked to certify that a halt is actually a halt.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "threat modelling",
        "physical-layer reasoning",
        "evasion analysis"
      ],
      "prerequisites": [
        "Verification 2.1 — the hardware layer",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII",
          "href": "https://arxiv.org/abs/2511.10783"
        },
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.6",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix A, Article VII, Chip Use Verification. Quoted:</p>\n<blockquote><p>In cases where the CTB assesses that current verification methods cannot provide sufficient assurance that the AI hardware is not being used for prohibited activities, AI hardware must be powered off, and its non-operation continually verified by in-person inspectors or other CTB-approved verification mechanisms.</p></blockquote>\n<p>And from <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, a footnote to Appendix A.6 on what physical observation adds:</p>\n<blockquote><p>Inspections may also be needed to ensure that e.g., a data center or server rack does not have hidden power cables, nor unmetered backup generators. Measured power draw could be sanity checked based on observations or other measurements of cooling infrastructure, electrical infrastructure, and heat emissions.</p></blockquote>\n<h3>What you produce</h3>\n<p>The threat model behind verified non-operation: what a cooling shutdown lets an inspector actually conclude, the claim, observable, evasion and countermeasure table for it, and where the quoted power-off requirement still leaks.</p>"
    },
    {
      "slug": "cross-examine-an-eval",
      "source": "verification-capstones/cross-examine-an-eval.md",
      "title": "Cross-Examine an Eval Result",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Write the testimony a score justifies — then write the hostile cross-examination that takes it apart, and revise until both can be true at once.",
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
      "difficulty": "core",
      "deliverable": "Mock testimony, a hostile cross-examination, and the revised testimony that survives it",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "A committee that will hear one number and decide what it means.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "evidence standards",
        "adversarial review",
        "testimony craft",
        "communicating uncertainty"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Evals projects I'd like to see, and a call to apply to OP's evals RFP — cb (2025), science of evaluations; red-teaming evals",
          "href": "https://forum.effectivealtruism.org/posts/LTbwRuQhBRGxMyqcq/x-6"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://forum.effectivealtruism.org/posts/LTbwRuQhBRGxMyqcq/x-6\">Evals projects I'd like to see, and a call to apply to OP's evals RFP — cb (2025)</a>, on the science of evaluations. Quoted:</p>\n<blockquote><p>Current evaluations are more like “model whispering” than science. Results are significantly affected by prompting, scaffolding, tool access, question format, inference compute spend, and choice of test conditions.</p>\n<p>I’d love to see work that helps make interpreting evals results more precise and reliable, or at least establishes the difficulty of making certain kinds of claims.</p></blockquote>\n<p>And among the other ideas the post is excited about:</p>\n<blockquote><p>Red-teaming evals/bounties for beating high scores—For some evaluations, I’d be excited about incentivising beating current high scores, in order to establish more realistic upper bounds on capabilities.</p></blockquote>\n<h3>What you produce</h3>\n<p>The adversarial reading those passages invite, staged as testimony: the claim a score justifies, the hostile cross-examination that attacks it on the conditions the post lists — prompting, scaffolding, tool access, question format, inference compute spend, choice of test conditions — and the revised testimony that survives, with the difficulty of the original claim established on the record.</p>"
    },
    {
      "slug": "curriculum-gap-audit",
      "source": "verification-capstones/curriculum-gap-audit.md",
      "title": "Audit What This Program Does Not Teach",
      "track": "Program-wide",
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
      "verificationFit": null,
      "courseFit": false,
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Four open curricula cover overlapping parts of this field, and each one made different choices about what to leave out. So did we. Find out what ours cost.</p>\n<p>Working material: <a href=\"https://bluedot.org\">BlueDot Impact</a>, <a href=\"https://www.aisafetybook.com/curriculum\">AI Safety, Ethics and Society</a>, <a href=\"https://agentfoundations.study\">Agent Foundations for Superintelligence-Robust Alignment</a>, and the <a href=\"https://www.aisafety.com/courses\">open curricula directory</a> to cross-check them against.</p>\n<p>You hand in:</p>\n<ul><li><strong>A coverage matrix.</strong> Rows are concepts, at a consistent grain — roughly \"a thing a learner could be asked to do\" rather than \"a topic\". Columns are the four curricula plus this program. Cells are <em>taught and assessed</em>, <em>mentioned</em>, or <em>absent</em>. The grain is the hard part; agree it as a team before coding anything.</li><li><strong>The coding protocol.</strong> How you decided what counts as taught. Two people code an overlapping sample independently and report where they disagreed. Disagreement rate is a finding, not an embarrassment.</li><li><strong>The three-gap memo.</strong> The three absences that matter most here, each with: who it hurts, what it would take to close, and — the part that makes this useful rather than a wish list — <strong>what you would cut to make room.</strong></li></ul>\n<h3>Why it exists</h3>\n<p>Every curriculum is a claim about what matters, and the claim is invisible from inside. Reading four of them side by side makes your own program's choices legible, including the ones nobody made deliberately.</p>\n<p>The transferable skill is comparative coding under a stated protocol: build a rubric, apply it consistently, report where it broke. That is the same move behind comparing jurisdictions, safety frameworks, or eval suites, and it is much easier to learn on curricula than on statutes.</p>\n<p>Like the tabletop capstone, this one produces a reusable program asset. A matrix with a stated protocol survives into the next cohort's planning.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published syllabi, reading lists and public course pages. The program's own materials in this repo.</p>\n<p><strong>Out of scope:</strong> enrolling in the courses, evaluating teaching quality, and ranking the curricula. You are mapping coverage, not judging delivery — the second needs data you will not have.</p>\n<p><strong>Note on availability.</strong> If any part of a syllabus turns out not to be public, say so in the matrix rather than guessing at its contents: an <code>unavailable</code> cell is honest and a fabricated one poisons the whole grid.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Grain</td><td>\"Interpretability\" as one row</td><td>Rows a learner could be assessed against, consistently sized</td></tr><tr><td>Protocol</td><td>Applied by feel</td><td>Written first, double-coded on a sample, disagreements reported</td></tr><tr><td>The gaps</td><td>A list of everything missing</td><td>Three, prioritised, each with a named cost to close</td></tr><tr><td>Trade-off</td><td>\"Add a week\"</td><td>A specific thing to cut, with an argument for why it is the cheaper loss</td></tr></tbody></table></div>\n<p>The recommendation that earns the most credit is usually the one that cuts something the team liked.</p>\n<h3>Getting started</h3>\n<ol><li>Build the row list from <em>one</em> curriculum first, then extend it with the others. Building it from all four at once produces a matrix whose rows are four different sizes.</li><li>Double-code ten rows before coding two hundred. That sample is where you find out your definition of \"taught\" was never shared.</li><li>Decide the cut before writing the gap memo. Gaps are easy and cuts are where the thinking is.</li></ol>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1.4 and §4.2.1.2",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article V",
          "href": "https://arxiv.org/abs/2511.10783"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can large training runs be detected while retaining developer privacy, e.g. through signatures in processor utilisation?",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Key Findings. Quoted:</p>\n<blockquote><p>Verify that there are no undeclared uses of large-scale AI compute by (A) verifying that the use of known AI data centers is accounted for; and (B) verifying that no actor has hidden AI data centers or large, decentralized collections of AI chips that can be used for violations.</p></blockquote>\n<p>Section 4.2.1.2 names the signals such a check reads:</p>\n<blockquote><p>Off-chip analog sensors for compute accounting (Appendix A.6): Off-chip sensors could log measurements such as AI chips’ power draw. The Verifier could then analyze these measurements with secured chips, testing for several signs of large, undeclared compute use: declared workloads would appear unnecessarily slow, AI chips would use more power than needed for the declared workloads, and/or the detailed physical signatures of chips would be different than expected. In other words, the Verifier would use analog measurements to verify the total number of operations or chip-hours done and check if approximately all of them can be “accounted for” by declared uses. There are various complications in implementing these checks.</p></blockquote>\n<p>And <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a> states what scale is findable at all:</p>\n<blockquote><p>It looks feasible to verifiably consolidate the majority of AI chips. The very largest AI data centers, such as those with more than 100,000 H100-equivalents, are hard to hide. They are detectable from their physical footprint and power draw, and many of them are publicly reported on. In fact, it’s probably possible for intelligence services to track and locate data centers as small as around 10,000 H100-equivalents. Locating smaller data centers would involve domestic authorities using various powers in cooperation with CTB inspectors.</p></blockquote>\n<h3>What you produce</h3>\n<p>The signature analysis behind the quoted subgoal: which signals — unnecessarily slow declared workloads, excess power, unexpected physical signatures, physical footprint — carry a workable detection rule, and the spoofing cost of each.</p>"
    },
    {
      "slug": "emergency-verification-package",
      "source": "verification-capstones/emergency-verification-package.md",
      "title": "A Verification Package You Could Ship in a Year",
      "track": "Verification",
      "status": "draft",
      "summary": "Twelve months, no new chips. Assemble the verification package that could actually be deployed, and state plainly what it still cannot see.",
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
      "deliverable": "Prioritized implementation roadmap with residual gaps stated",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The task force told to stand up verification this year, not next.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "regime design",
        "feasibility triage",
        "gap analysis"
      ],
      "prerequisites": [
        "Verification 2.x — the four layers",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix B and Appendix D",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix B, What can we do today? Quoted:</p>\n<blockquote><p>Recognizing that measures to address the risks from AI cannot be developed overnight, we are providing a list of measures that could be implemented, beginning today, that would help lay the foundation for mitigating risks from AI. Our intention is to provide a list of actions that we believe will be necessary to build a robust framework and basis for future AI agreements and risk reduction measures. It is not a comprehensive list, or a detailed explanation of each measure, but rather a starting point for discussion.</p>\n<p>Develop situational awareness of where AI chips are located globally, identify public and nonpublic data centers, understand chip and/or hardware smuggling pipelines, and production flows around the world. Begin tracking AI chips.</p></blockquote>\n<p>The chip-consolidation appendix says how fast the harder mechanisms could exist:</p>\n<blockquote><p>In the future, hardware-enabled governance mechanisms could be developed to enable remote governance of AI chips, so that chips don’t need to be centralized to declared locations. Aarne et al. (2024) provide estimates for the implementation time of some of these on-chip governance mechanisms. Their estimates cover the timeline to develop mechanisms that are robust against different adversaries. For concision, we will use their estimates for security in a covertly adversarial context where competent state actors may try to break the governance mechanisms but would face major consequences if caught. They estimate a development time of two to five years for ideal solutions, with less secure but potentially workable options available in just months.</p></blockquote>\n<h3>What you produce</h3>\n<p>The package for a twelve-month deadline, assembled only from what the quotes say exists or is workable in months: a prioritized implementation roadmap with rough costs and the residual gaps stated rather than papered over.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.2",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "Request for Proposals: Improving Capability Evaluations — Coefficient Giving, formerly Open Philanthropy (2025, closed)",
          "href": "https://coefficientgiving.org/funds/navigating-transformative-ai/request-for-proposals-improving-capability-evaluations/"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix A.2, Hardware-Backed Workload Certificates and Evaluations. Quoted:</p>\n<blockquote><p>Hardware security features could enable on-chip verification mechanisms including hardware-backed workload certificates and hardware-backed evaluations (Appendix A.2). This appendix outlines how these mechanisms could be implemented, assuming tamper-evident secure boot and optionally Confidential Computing are supported in AI compute clusters’ AI chips and CPUs. If supported, secure boot could ensure the presence of system software that enforces the following behavior, with Confidential Computing optionally used where specified below:</p></blockquote>\n<p>The certificate is the link in the chain:</p>\n<blockquote><p>The systems software outputs a certificate attesting to the logged data, which the Verifier later tests via Confidential Computing or a trusted cluster (Section 4.2).</p>\n<p>Verification Subgoal 1.B: The system software checks that the AI models, data, and code have the required properties, e.g., verifies the results of safety evaluations. As above, the system software could do this by:</p></blockquote>\n<h3>What you produce</h3>\n<p>The attestation spec the quoted mechanism sketches: the chain from logged data to certificate to check, the residual trust at each link, and the cost to the lab that has to run it.</p>"
    },
    {
      "slug": "eval-scoping-pilot",
      "source": "verification-capstones/eval-scoping-pilot.md",
      "title": "Scope One Eval Small Enough to Finish",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Pick one problem off a public evals backlog, cut it down until it fits three weeks, and run a thirty-item pilot that tells you whether the full eval is worth building.",
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
      "deliverable": "Eval spec, a thirty-item pilot run with results, and a scoping post-mortem",
      "deliverableType": "notebook",
      "mentor": "optional",
      "audience": "The team that would have to decide whether to fund the full version.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "eval design",
        "scoping",
        "measurement validity",
        "elicitation",
        "honest reporting of nulls"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025), reader context and the \\\"Safety framework evals\\\" entry",
          "href": "https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit\">A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)</a>, its reader context and the \"Safety framework evals\" entry. Quoted:</p>\n<blockquote><p>A number of “ready to go” evals ideas that someone new to the field could do within a few days or weeks of effort.</p>\n<p>You’re free to just start with these projects and don’t need to ask for permission. You can reach out to named individuals but they might not have the time to answer.</p></blockquote>\n<p>The \"Safety framework evals\" entry (credit: Marius) poses the scoping work itself, as steps:</p>\n<blockquote><p>Many voluntary commitments and regulatory efforts specify the abstract capability they want to measure but do not specify a detailed evaluation. Filling in this gap is not trivial but very needed and a great way to get good at building frontier evals.</p>\n<p>Pick one specific capability (or propensity) from the safety frameworks that sounds interesting to you and specify it in more detail.</p>\n<p>Write a brief threat model, i.e. which concrete set of scenarios you’re worried about and how capabilities relate to harm in that scenario.</p>\n<p>Specify what exactly you want to measure.</p>\n<p>Design the eval</p>\n<p>Run the eval &amp; iterate</p>\n<p>Think about how your evaluation would relate to (potential) red lines set by the framework.</p></blockquote>\n<h3>What you produce</h3>\n<p>The entry's own steps, held to a three-week scope: one capability picked and specified in detail, the threat model, the eval designed and run as a thirty-item pilot, and a scoping post-mortem that answers whether anyone should build the full version — the gap-filling the entry calls not trivial but very needed.</p>"
    },
    {
      "slug": "eval-statistical-tests",
      "source": "verification-capstones/eval-statistical-tests.md",
      "title": "What Statistical Test Does an Eval Result Need?",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Eval scores get compared to thresholds as if they were measurements without error. Work out what test the comparison actually needs, and re-run one published claim under it.",
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
      "deliverable": "Statistical note plus a notebook re-analysing one published eval claim with uncertainty attached",
      "deliverableType": "notebook",
      "mentor": "recommended",
      "audience": "Anyone about to write \"the model scored below the threshold\" in a document with consequences.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "applied statistics",
        "eval methodology",
        "uncertainty quantification",
        "technical writing"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 35: what statistical tests are appropriate in evaluations of dangerous capabilities?",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 35, \"What Statistical Tests are Appropriate in Evaluations of Dangerous Capabilities and Undesirable Model Properties?\". Quoted:</p>\n<blockquote><p>Model evaluations of dangerous capabilities – and in particular assessments of whether a model has reached some level of capability relevant to a Responsible Scaling Policy or the like – shouldn’t rely on normal statistical testing. Or at the very least, I expect that the way these tests are currently done is off. A lot of the studies we’ve seen to date (e.g. a recent paper from Anthropic on persuasiveness + previous work on biorisk from OAI) will have conclusions like “[the model] produces arguments that don’t statistically differ in their persuasiveness compared to arguments written by humans” (Anthropic) and “However, the obtained effect sizes were not large enough to be statistically significant” (OpenAI). Why is this a problem? Normal statistical testing asking for 95% confidence is designed to be conservative: not to cry wolf, to only say there’s an effect there when there is. But that may not be what we want in the AI case. Another issue is that it also incentivizes companies doing tests that are underpowered. E.g. the OAI study had positive uplift but didn’t find statistically significant results, but they only had 50 students participate in the study.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>How big of a problem is this?</p>\n<p>What possible solutions exist? Some candidates:</p>\n<p>Flip the test. Make the null hypothesis that you’re disproving should be that there is uplift.</p>\n<p>Demand higher power, so that smaller effect sizes are more likely to show significant results.</p>\n<p>Do tests that are meant to test whether there’s a difference between two quantities, not whether one is higher than the other.</p></blockquote>\n<h3>What you produce</h3>\n<p>A statistical note and notebook on the questions' own terms: what comparison an eval-versus-threshold claim is actually making, one published claim re-analysed with uncertainty attached, and whether the candidate solutions the idea lists — flipping the null, demanding higher power, testing for difference — change the published conclusion.</p>"
    },
    {
      "slug": "eval-to-threshold-brief",
      "source": "verification-capstones/eval-to-threshold-brief.md",
      "title": "From Eval Result to Policy Threshold",
      "track": "Technical Governance",
      "status": "ready",
      "summary": "Turn an eval you actually ran into a short technical-policy brief that defends one threshold — with the elicitation gap stated, not buried.",
      "team": {
        "min": 1,
        "max": 1,
        "label": "1 person",
        "bucket": "Solo"
      },
      "effort": {
        "min": 12,
        "max": 18,
        "label": "12–18 hrs",
        "bucket": "15–20 hrs"
      },
      "duration": {
        "label": "2 weeks",
        "weeks": 2
      },
      "perWeek": "≈8 hrs/wk",
      "difficulty": "core",
      "deliverable": "Four-page technical-policy brief with an appendix of your own eval logs",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "A policy staffer who has to defend a number in a rule.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "eval interpretation",
        "threshold design",
        "technical writing for non-technical readers",
        "uncertainty communication"
      ],
      "prerequisites": [],
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>You ran an eval during the track. Now use it as the evidence base for a brief that argues for — or against — one specific governance threshold.</p>\n<p>The brief has four moving parts:</p>\n<ol><li><strong>The claim.</strong> One sentence: what your eval result supports. Written so it could be falsified.</li><li><strong>The evidence.</strong> Your actual numbers, with the elicitation setup that produced them, and the variance you measured when you broke your own eval in week 4.</li><li><strong>The threshold.</strong> The rule you are arguing about — a FLOP threshold, a capability trigger in a frontier safety framework, a pre-deployment testing requirement — and what your evidence does to it.</li><li><strong>The honest limits.</strong> What your eval cannot certify. Elicitation gaps, contamination risk, the distance between a benchmark score and a real-world capability.</li></ol>\n<h3>Why it exists</h3>\n<p>The governance-relevant skill is not running the eval. It is knowing what an eval result can and cannot carry in an argument, and saying so in front of an audience that would rather have a clean number.</p>\n<p>It is also the artifact that survives contact with an application reader. A brief with your own logs attached is verifiable; \"familiar with model evaluations\" is not.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the eval you built or ran in weeks 3–4, any published frontier safety framework, and open compute data.</p>\n<p><strong>Out of scope:</strong> a new eval from scratch. If your week 3–4 result is thin, the fix is a sharper claim, not more experiments — you have two weeks.</p>\n<h3>What good looks like</h3>\n<ul><li>A non-technical reader finishes the brief able to state your claim and one reason to doubt it.</li><li>The variance measurement from week 4 appears in the argument, not just in the appendix. The whole point of breaking your own eval was to know how much weight it bears.</li><li>The recommendation names an actor and a decision. A brief addressed to nobody about nothing is the genre's standard failure.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Write the falsifiable claim first, on one line. Everything else is scaffolding for it.</li><li>Re-read your week 4 variance numbers before you decide how strong the claim can be.</li><li>Give it to someone who does not know what a solver or a scorer is. If they cannot restate the claim, the brief is not finished.</li></ol>"
    },
    {
      "slug": "evaluate-the-derivative-ecosystem",
      "source": "verification-capstones/evaluate-the-derivative-ecosystem.md",
      "title": "Evaluate a Thousand Models",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "One open release becomes thousands of fine-tunes, merges and quantisations. Design the triage that decides which of them anyone needs to evaluate, and pilot it.",
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
      "deliverable": "Triage scheme plus a pilot run over a real derivative population, with the cost per model",
      "deliverableType": "notebook",
      "mentor": "recommended",
      "audience": "The monitoring body that has to watch an ecosystem, not a model.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "scalable evaluation design",
        "sampling",
        "ecosystem monitoring",
        "cost-aware measurement"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026), §4.3.4: how can we scalably evaluate thousands of models?",
          "href": "https://arxiv.org/abs/2608.07514"
        },
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025): how can we scalably evaluate thousands of models?",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2608.07514\">Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026)</a>, §4.3.4. Quoted:</p>\n<blockquote><p>How can we scalably evaluate thousands of models? A major challenge to better understanding the open-weight ecosystem stems from the sheer number of existing models. Coordinated efforts to evaluate their safety properties at scale could improve practical risk management and future risk modeling. For example, platforms like Hugging Face which host and distribute large numbers of AI models can struggle to reliably identify and remove ones that violate their content policies (e.g., 148). However, ecosystem-level evaluation is complicated by scale, architectural diversity, and the continuous introduction of new models. Evaluations involving tampering attacks can be particularly challenging due to the computational costs of fine-tuning and other tampering algorithms. There is a need for infrastructure for evaluating models at scale that balances efficiency with thoroughness. These approaches might also integrate new technical resources like model provenance techniques (see Section 4.5).</p></blockquote>\n<p>A sibling problem in §4.5.2 sizes the same ecosystem:</p>\n<blockquote><p>Ecosystem-wide heritage inference is desirable (93) but not tractable with current infrastructure and methods. For example, using current methods (94), charting models across a platform such as Hugging Face would require millions of pairwise comparisons between models. While independence between two specific models is computationally inexpensive (251), continuous ecosystem-wide monitoring must accommodate daily uploads of potentially thousands of new models.</p></blockquote>\n<h3>What you produce</h3>\n<p>The infrastructure question, answered at pilot scale: a triage scheme over one base model's real derivative population with a stated monthly budget, a cheap screen that decides which models get the expensive evaluation — with its false-negative rate measured — and the balance of efficiency with thoroughness the problem asks for, priced per model.</p>"
    },
    {
      "slug": "evaluated-model-in-production",
      "source": "verification-capstones/evaluated-model-in-production.md",
      "title": "Is the Model in Production the Model That Passed?",
      "track": "Verification",
      "status": "draft",
      "summary": "Evals passed on one model. Millions of requests run against another — would anyone notice? Design the chain that lets an auditor say deployed equals evaluated.",
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
      "deliverable": "Protocol diagram from evaluation to deployment, plus an attack tree",
      "deliverableType": "design",
      "mentor": "optional",
      "audience": "The auditor who signed off on the eval and now has to stand behind the deployment.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "protocol design",
        "attestation reasoning",
        "attack trees"
      ],
      "prerequisites": [
        "Verification 2.0 — confidentiality vs verifiability",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1.4 and Appendix A.2",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Key Findings. Quoted:</p>\n<blockquote><p>Verify that declared uses of large-scale AI compute are compliant by (A) verifying that trained AI models and their outputs were generated as claimed; and (B) verifying evaluation results, or more generally, verifying that declared models, data, and code have the required properties. “Declared” means self-reported, preferably via confidentiality-preserving technologies.</p></blockquote>\n<p>Appendix A.2 says what a deployment declaration would pin down:</p>\n<blockquote><p>Declarations: When a Prover loads an AI workload onto an AI compute cluster, the Prover includes explicit, specially formatted information about whether the workload is AI training or inference, and what memory locations and/or data packets will hold the model weights, training data, and usage data. This constitutes the Prover’s declaration of their models and data. (The Prover’s declaration of code is implicit in the code they load to CPUs.)</p></blockquote>\n<h3>What you produce</h3>\n<p>The chain that closes the evaluation-to-production gap: a protocol diagram from the evaluated artifact to what serving infrastructure actually runs, built on the quoted declarations, with the attack tree against it.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026), abstract and §4.5, Model Provenance and Forensics",
          "href": "https://arxiv.org/abs/2608.07514"
        },
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025)",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2608.07514\">Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026)</a>, abstract. Quoted:</p>\n<blockquote><p>However, managing their risks is also challenging because they can be modified arbitrarily, used without oversight, and spread irreversibly. Currently, there is limited research on safety tooling specific to open-weight models. Addressing these gaps will be key to both realizing their benefits and mitigating their harms. In this paper, we present 16 open technical challenges for open-weight model safety involving training data, training algorithms, evaluations, deployment, and ecosystem monitoring.</p></blockquote>\n<p>The layer a verification regime falls back on once weights are loose is the last of those — §4.5, Model Provenance and Forensics:</p>\n<blockquote><p>Model provenance methods help stakeholders study the spread and uses of open-weight models. While not directly upstream of model releases, ecosystem monitoring methods are a key component of risk management because they help stakeholders better study the real-world uses and impacts of models. Model provenance and forensics in the open-weight AI ecosystem are key to answering questions such as “What model is this?” and “What modifications has it undergone since its original release?”</p></blockquote>\n<h3>What you produce</h3>\n<p>The annex those passages force: what each verification layer still sees once the artifact has spread, the provenance and forensics observations that partially replace it — What model is this? What modifications has it undergone since its original release? — the claim a verifier can still make and the sentence it must retire, and the ex-ante custody clause the agreement should have carried.</p>"
    },
    {
      "slug": "export-control-circumvention",
      "source": "verification-capstones/export-control-circumvention.md",
      "title": "How Much Leaks Through the Export Controls?",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Everyone agrees chips get around export controls; nobody has bounded it. Build the estimate from public evidence, with the uncertainty stated and the enforcement gap named.",
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
      "deliverable": "Bounded estimate of circumvention volume, its evidence base, and an enforcement recommendation",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The enforcement agency deciding where to put a small number of investigators.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "open-source estimation",
        "triangulation",
        "trade-data literacy",
        "reasoning under adversarial reporting"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 70: extent of export control circumvention",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "compute-production-gap-china",
          "title": "Compute Production Gap and Data Centers in China"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 70, \"Extent of Export Control Circumvention\". Quoted:</p>\n<blockquote><p>Export controls are a cornerstone of US attempts to prevent rival nations’ access to AI hardware technologies. Understanding the extent of circumvention of these controls (i.e., how many controlled items eventually arrive in rival nations despite export controls) is important to understanding how much such controls might actually translate into denial of access by targeted countries.</p></blockquote>\n<p>The idea's research question:</p>\n<blockquote><p>What is the quantitative extent of export control circumvention for controlled items analogous to AI chips?</p>\n<p>Ideally, this would be denominated in total controlled stocks or flows of such controlled items.</p></blockquote>\n<h3>What you produce</h3>\n<p>The quantitative extent the research question asks for: a bounded estimate of circumvention, denominated — as the idea specifies — in total controlled stocks or flows of such controlled items, with the evidence triangulated, the unit of account stated, and an enforcement recommendation attached.</p>"
    },
    {
      "slug": "field-building-blueprint",
      "source": "verification-capstones/field-building-blueprint.md",
      "title": "Blueprint a Field-Building Intervention",
      "track": "Program-wide",
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
      "verificationFit": null,
      "courseFit": false,
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
          "label": "Blueprints for AI Safety Conferences (FBB #9) — The Field Building Blog (2025)",
          "href": "https://fieldbuilding.substack.com/p/blueprints-for-ai-safety-conferences"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://fieldbuilding.substack.com/p/blueprints-for-ai-safety-conferences\">Blueprints for AI Safety Conferences (FBB #9) — The Field Building Blog (2025)</a>. Quoted:</p>\n<blockquote><p>TLDR: We need more AI Risk-themed events, so I outlined four such events with different strategies. These are: online conferences, one-day summits, three-day conferences and high-profile events for building bridges between various communities.</p></blockquote>\n<p>The post anchors the value with a theory of change:</p>\n<blockquote><p>To anchor the value of such events, I propose a general Theory of Change (TOC) for AI Safety conferences. Events like these can lead attendees to:</p>\n<p>Form connections</p>\n<p>Coordinate efforts</p>\n<p>Learn about career paths and cause areas</p>\n<p>Build motivation and clarity on next steps</p>\n<p>These changes increase the hours and resources dedicated to AI Safety work, improving infrastructure and the quality of contributions. Over time, this leads to:</p>\n<p>Greater alignment within the professional community</p>\n<p>Stronger advocacy and external legitimacy</p>\n<p>A more attractive and resilient movement</p>\n<p>Ultimately, we’re reinforcing pathways that create a stronger movement, powered by the connections and insight fostered by these events.</p></blockquote>\n<p>And its conclusion hands the job to the reader:</p>\n<blockquote><p>By default, I think you shouldn’t wait around for others to organise them, and assume they won’t happen unless you create them yourself. The different events require different amounts of experience, so based on where you are in your career, you should choose accordingly. Of course, you should still coordinate with other organisations.</p></blockquote>\n<h3>What you produce</h3>\n<p>One of the four event types — or an intervention of the same kind — taken from outline to run-ready: the theory of change made specific to your audience, the counterfactual stated, the format, the itemised budget and staffing, and the evaluation plan that says how you would know the connections and insight the theory promises actually happened.</p>"
    },
    {
      "slug": "field-map-refresh",
      "source": "verification-capstones/field-map-refresh.md",
      "title": "Refresh a Governance Field Map",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Take a published map of who does what in AI governance, rebuild it for one sub-area at today's date, and log everything that rotted in between.",
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
      "difficulty": "core",
      "deliverable": "Updated actor-and-activity map plus a change log of what the old map got wrong",
      "deliverableType": "dossier",
      "mentor": "optional",
      "audience": "Someone deciding this month where in the field they could usefully work.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "field mapping",
        "source currency",
        "institutional literacy",
        "structured synthesis"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Map to Navigate AI Governance — Caro (2022), summary, \\\"How can you help?\\\", and further research directions",
          "href": "https://forum.effectivealtruism.org/posts/tmxkRFx6HyhhvHdz4/a-map-to-navigate-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://forum.effectivealtruism.org/posts/tmxkRFx6HyhhvHdz4/a-map-to-navigate-ai-governance\">A Map to Navigate AI Governance — Caro (2022)</a>, its summary and its requests to the reader. Quoted:</p>\n<blockquote><p>In this post, we aim to disentangle AI governance. To do so, we list and explain 17 common activities in AI governance, including typical actors, typical outputs, and examples of actions and actors underlying each activity. We describe how these activities relate to each other through three governance pathways or “macro-activities”: Hard Governance, Industry-wide Self Governance and Company Self Governance.</p>\n<p>We aspire to capture all common AI governance activities, from researching macro strategy and applied research all the way to enforcement of regulations and policy evaluation. However, we identify five macro-activities for which we either have too limited knowledge or find them too specific to explain meaningfully in this overview: Military &amp; National Security governance, Supply Chain &amp; Trade governance, Multilateral soft governance, Extralegal governance, and Academic governance. These would benefit from further research. Finally, we list several questions for future research in the EA community.</p></blockquote>\n<p>The post's \"How can you help?\" section:</p>\n<blockquote><p>This post is a first step to understand the map of the AI governance territory. You can contribute to this framework by answering these three questions:</p>\n<p>What are the activities we have missed? How would you describe them?</p>\n<p>What are the nuances we have missed in describing these activities? How would you break down even further these activities?</p>\n<p>What other projects could help answer the research questions highlighted in the section “Further Research Questions” at the bottom of this post?</p></blockquote>\n<p>And among its further research directions:</p>\n<blockquote><p>Gap analysis: what activities are likely impactful but most neglected by the EA community?</p>\n<p>Getting closer to the territory: an interesting project for local EA groups interested in AI governance is mapping their countries’ actors involved in these activities.</p></blockquote>\n<h3>What you produce</h3>\n<p>The contribution the post asks for, done as a refresh at today's date: one slice of the map rebuilt — the activities and actors it missed or that have changed since, every change dated — plus the gap analysis its research directions request: the activities likely impactful but most neglected, and the nodes where the 2022 map is now confidently wrong.</p>"
    },
    {
      "slug": "frontier-ai-public-utilities",
      "source": "verification-capstones/frontier-ai-public-utilities.md",
      "title": "Should Parts of Frontier AI Be Treated Like Public Utilities?",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "If foundation models become a natural oligopoly at the base of the economy, is the right policy public-utility treatment rather than forced competition? Work the implications both ways.",
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
      "difficulty": "core",
      "deliverable": "Literature review and case analysis of public-utility treatment for foundation models, implications argued both ways",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "market-structure analysis",
        "policy analysis"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 53: should parts of the frontier AI industry be treated like public utilities?",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "pre-emptive-authorization",
          "title": "A Licence to Train"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 53, \"Should Parts of the Frontier AI Industry Be Treated Like Public Utilities?\", suggested by Markus Anderljung. Quoted:</p>\n<blockquote><p>I think it’s reasonably likely that we'll see the following development: the AI industry will largely build on a small number of really capable foundation models. At this foundation model layer, there is a natural oligopoly due to economies of scale, learning-by-doing from training huge models, getting access to data from users interacting with the system, probably some network effects, and so on. Upon this foundation model layer, a huge number of downstream applications are built, i.e. we see concentration at the FM layer and then less concentration further down the supply chain. Assumptions that go into the above include (though all don't seem necessary): Scaling will continue to yield dividends, model performance will continue to be a main differentiator, model generality will continue to matter.</p>\n<p>If this picture is right, that suggests that it might be right to treat frontier FMs similarly to public utilities. They'll become the bedrock of our economy. At the same time, there will be a large amount of concentration. Often, people have the intuition that the right policy is to increase competition at the FM layer, but this picture suggests that it's more about managing that concentration, and about ensuring that market power is not abused, that certain kinds of vertical integration is warded off, that the products that are offered to people and downstream businesses are safe, reliable, and high quality.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>What would the implications (both positive and negative) of treating foundation models as public utilities be?</p>\n<p>What effects would this have on market concentration?</p></blockquote>\n<h3>What you produce</h3>\n<p>The analysis the two research questions describe — implications of public-utility treatment argued positive and negative, and the effect on market concentration — using the methodology the idea names.</p>"
    },
    {
      "slug": "frontier-safety-policy-redraft",
      "source": "verification-capstones/frontier-safety-policy-redraft.md",
      "title": "Sharpen a Frontier Safety Commitment",
      "track": "Technical Governance",
      "status": "ready",
      "summary": "Red-team one lab's published safety framework and rewrite a single if-then commitment so it is measurable, triggerable, and hard to self-grade.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Clause-level critique plus one redrafted commitment",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "The lab's policy team, and the regulator who might codify their language.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "clause analysis",
        "if-then commitment design",
        "eval-to-decision mapping",
        "red-teaming"
      ],
      "prerequisites": [],
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one published frontier safety framework. Find the commitment that matters most and the commitment that is vaguest — often the same one — and do two things.</p>\n<p><strong>First, the critique.</strong> Clause by clause, for the section you chose:</p>\n<ul><li>What triggers the obligation, and who decides that it triggered?</li><li>What evidence would establish the trigger, and who produces it?</li><li>What happens on trigger — a pause, a mitigation, a disclosure — and by when?</li><li>Where does the framework grade its own homework?</li></ul>\n<p><strong>Second, the redraft.</strong> One commitment, rewritten so that the trigger is measurable with evals that exist, the decision rule is legible from outside, and the escape hatches are named rather than left implicit. Then state honestly what your redraft costs: over-triggering, gaming, or a bar so specific that the next capability jump routes around it.</p>\n<h3>Why it exists</h3>\n<p>If-then commitments are the main instrument labs have offered in place of regulation, and their weakest property is that the party measuring the trigger is the party bound by it. Learning to read one at clause level — and to write one that would survive an adversarial reading — is directly transferable to the regulatory drafting that will eventually copy this language.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one framework, one commitment, public eval literature.</p>\n<p><strong>Out of scope:</strong> a comparative survey of every lab's framework. Depth beats coverage; a table of five frameworks with one line each teaches nothing you did not already know.</p>\n<h3>What good looks like</h3>\n<ul><li>The critique quotes the actual language and reasons about it, rather than summarising the framework's intent.</li><li>Your redraft points at evals that exist, and you name them.</li><li>You state the failure mode of your own version. Every sharpening trades robustness for something.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Print the section. Mark every modal verb — <em>may</em>, <em>will</em>, <em>should</em>, <em>intends to</em>. The gradient of commitment is visible in the verbs.</li><li>Ask, of each trigger: could an outsider tell whether this fired? If not, that is your clause.</li><li>Write your redraft before reading anyone else's critique of the same framework.</li></ol>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VI",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, the notes on Article VI, AI Chip Production Monitoring. Quoted:</p>\n<blockquote><p>The AI chip supply chain is narrow and specialized, making it feasible to monitor production. The vast majority of AI chips are designed by NVIDIA. The most advanced logic chips (the main processor) used in AI chips are almost all fabricated by TSMC — accounting for around 90 percent of market share. Most AI chips are fabricated on versions of TSMC’s five-nanometer process node, a node likely only supported by two or three manufacturing plants. EUV lithography machines, a critical component in advanced logic chip fabrication, are made exclusively by ASML. High-bandwidth memory (HBM), another key component to AI chips, is dominated by two or three companies. This narrow and technical supply chain would be relatively easy to monitor and hard to clandestinely replicate. We don’t want to overstate things too much—for example, China has an emerging domestic supply chain that produces some notable AI chips—but even with various caveats like this, monitoring existing chip production seems quite feasible.</p></blockquote>\n<h3>What you produce</h3>\n<p>The dossier for one node the quote names — lithography, HBM, advanced packaging, fab capacity, or the layers beside them — covering its firms, its records, its failure and evasion routes, written for the verification analyst deciding whether to commit monitoring to it.</p>"
    },
    {
      "slug": "incident-detection-monitoring",
      "source": "verification-capstones/incident-detection-monitoring.md",
      "title": "Incident Detection and Monitoring at AI Companies",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Different ways of monitoring deployed AI systems for misuse and misalignment have been proposed, nearly all with significant tradeoffs. Assess them and sketch a workable framework.",
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
      "difficulty": "core",
      "deliverable": "Assessment of the proposed monitoring setups, their tradeoffs, and a sketch of a feasible monitoring framework",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "risk analysis",
        "scenario mapping",
        "privacy tradeoffs"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 22: incident detection and monitoring at AI companies",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "incident-reporting-taxonomy",
          "title": "An Incident Taxonomy Labs Could Report Against"
        },
        {
          "slug": "tracking-agent-behaviour",
          "title": "Tracking Sketchy AI Agent Behaviour in the Wild"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 22, \"Incident Detection and Monitoring at AI Companies\", suggested by Julian Hazell. Quoted:</p>\n<blockquote><p>Different ways of monitoring deployed AI systems for risks have been suggested:</p>\n<p>Technical monitoring systems (e.g., other AI models) that analyze user inputs and model outputs to detect misalignment or misuse.</p>\n<p>Allow users to choose from multiple independent monitoring providers to increase trust and reduce privacy concerns.</p>\n<p>Work with large corporate clients to set up their own AI monitoring teams, which are trained and validated by the AI lab but operate independently to protect client data privacy.</p>\n<p>Automatically ban users when misuse is detected (with an option for human review).</p>\n<p>Retain user data for long periods to facilitate more comprehensive monitoring and analysis.</p>\n<p>Compensate users whose data ends up being reviewed by human monitors to make the privacy tradeoff more acceptable.</p>\n<p>Implement data anonymization techniques, such as using LLMs for swapping names and varying personal information while preserving semantics, to protect user privacy.</p>\n<p>Implement better watermarking techniques to help with post-hoc investigations of incidents where AI may have played a role.</p>\n<p>Solicit volunteers to agree to more intensive monitoring (e.g. with discounts or other incentives).</p>\n<p>However, nearly all of these potential solutions involve significant tradeoffs, and additional research is needed to thoroughly assess their benefits and drawbacks. Implementing even just a few of these monitoring measures may prove challenging due to various technical, legal, and commercial considerations.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>If unrestricted retention and access to user chat logs would significantly hurt AI companies’ commercial viability by driving away privacy-conscious users, what might a more feasible setup look like? What are the tradeoffs?</p>\n<p>How can privacy concerns be addressed, both from a policy and technical point-of-view?</p>\n<p>More generally: What would a comprehensive monitoring framework look like in practice?</p></blockquote>\n<h3>What you produce</h3>\n<p>The assessment the idea calls for: the proposed monitoring setups with their benefits and drawbacks worked through, the privacy question addressed from both the policy and the technical side, and the sketch of what a comprehensive monitoring framework would look like in practice.</p>"
    },
    {
      "slug": "incident-reporting-taxonomy",
      "source": "verification-capstones/incident-reporting-taxonomy.md",
      "title": "An Incident Taxonomy Labs Could Report Against",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Incident reporting is in every governance proposal and no two people mean the same thing by \"incident\". Build the taxonomy and the reporting form, then test it on real cases.",
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
      "deliverable": "Incident taxonomy, a reporting form, and a back-test against a dozen public incidents",
      "deliverableType": "spec",
      "mentor": "optional",
      "audience": "The regulator who will receive the reports and the lab engineer who has to file one at 2am.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "taxonomy design",
        "form design",
        "back-testing a classification",
        "regulatory drafting"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), §8.1, improving incident reporting and monitoring: how non-public incidents can be reliably reported, and what technical information should be reported",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [
        {
          "slug": "incident-detection-monitoring",
          "title": "Incident Detection and Monitoring at AI Companies"
        },
        {
          "slug": "tracking-agent-behaviour",
          "title": "Tracking Sketchy AI Agent Behaviour in the Wild"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2407.14981\">Open Problems in Technical AI Governance — Reuel et al. (2025)</a>, §8.1, Clarification of Associated Risks (Ecosystem Monitoring). Quoted:</p>\n<blockquote><p>Improving incident reporting and monitoring. Additionally, developing improved systems for monitoring and reporting previous or ongoing incidents could not only allow for a more targeted response to ongoing harms, but also facilitate the identification of early warning signals for potential harms (Shane 2024). AI incident databases have been developed by both the OECD and Partnership on AI, both of which log news articles detailing AI-related incidents (OECD.AI Policy Observatory 2024; McGregor 2020). Given that these databases rely solely on public sources, it is likely that only a subset of all incidents are included. In addition, they do not record all details about an incident such as model specifics or deployed guardrails, limiting the utility for analysis of what may have caused an incident. Open questions thus concern how non-public incidents can be reliably reported, as well as what technical information should be reported in order to facilitate meaningful analysis of incidents.</p></blockquote>\n<h3>What you produce</h3>\n<p>The two open questions, answered as an instrument: a taxonomy of reportable events with thresholds, a reporting form that fixes what technical information a report carries — model specifics and deployed guardrails included — and a back-test against a dozen public incidents showing the analysis the design makes possible.</p>"
    },
    {
      "slug": "inference-compute-botec",
      "source": "verification-capstones/inference-compute-botec.md",
      "title": "BOTECs of Inference Compute Needs",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "How much inference compute — FLOP, FLOP/s, hardware — would consequential AI use-cases need? Build the well-evidenced BOTEC the idea asks for, for policymakers rather than publication.",
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
      "deliverable": "Well-evidenced BOTEC of inference compute for one consequential use-case, with bang-for-buck where sensible",
      "deliverableType": "notebook",
      "mentor": "optional",
      "audience": "The policymaker sizing a risk who needs the arithmetic, not a headline.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "back-of-envelope estimation",
        "sensitivity analysis",
        "reproducibility"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 72: BOTECs of inference compute needs",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "training-vs-inference",
          "title": "Understanding Training vs. Inference"
        },
        {
          "slug": "which-compute-target",
          "title": "Which Compute Are We Even Regulating?"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 72, \"BOTECs of Inference Compute Needs\", suggested by Markus Anderljung. Quoted:</p>\n<blockquote><p>It could be useful to have well-evidenced BOTECs to assess how much inference compute (in terms of FLOP, FLOP/s, and hardware required) is needed for various consequential AI use-cases. Such use-cases might involve: Authoritarian use-cases (e.g. surveillance of an entire population, censoring the internet), election interference (e.g. running 1m fake social media accounts to reduce voter turnout in a certain demographic), and AI-enabled online fraud (e.g. running 1m deepfake robocalls simultaneously aiming to get someone to transfer money into a bank account). In some of these cases, it may also be interesting to conduct a BOTEC on the bang-for-buck of the use case. It’s not clear these BOTECs should be widely published, but they ought to be useful for policymakers, and could inform broader strategies around risk management for hazards arising from misuse.</p>\n<p>Why might this matter? A lot of compute governance efforts focus on the compute needed for training. I think inference deserves more attention. Inference is what will lead to AI systems having a real impact in the world, and we should expect that a system’s impact should at least monotonically increase with the number of inferences run on it.</p></blockquote>\n<p>The idea's research question:</p>\n<blockquote><p>How much inference compute would be needed for different consequential AI use-cases?</p></blockquote>\n<h3>What you produce</h3>\n<p>The BOTEC the idea describes, for one use-case agreed with your mentor, with every assumption exposed and a sensitivity range rather than a point figure. Note the idea's own caution and follow it: it is not clear these BOTECs should be widely published — the deliverable is written for a policymaker, and publication is a decision, not a default.</p>"
    },
    {
      "slug": "insurance-minimum-number",
      "source": "verification-capstones/insurance-minimum-number.md",
      "title": "Pick the Insurance Number",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Mandatory insurance for frontier developers keeps being endorsed without anyone naming a minimum. Name it — coverage, limits, deductible — and defend the arithmetic.",
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
      "deliverable": "A recommended minimum with the loss model behind it and the market-availability check",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The regulator who has to write a number into a licensing condition.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "quantitative estimation",
        "loss modelling",
        "regulatory design",
        "reasoning under thin data"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 5: insurance requirements",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance\">Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025)</a>, the \"Insurance Requirements\" entry (orphan 5). Quoted:</p>\n<blockquote><p>A team of researchers led by the AI Objectives Institute recently put out a paper praising the benefits of AI safety insurance, arguing persuasively that “insurance has the potential to create a more favorable incentive structure by making practices such as safety-washing or underestimating AI-related risks less appealing.” CAIP’s co-founder, Thomas Larsen, was a strong proponent of requiring frontier AI developers to carry a minimum amount of insurance.</p>\n<p>However, we never satisfactorily answered the question of what this minimum amount should be. What are a reasonable set of policy limits? How large can the deductible be? How large can co-insurance payments be? What is the scope of harms that would be covered by such policies, and what if any exclusions would be permitted? What kinds of re-insurance requirements would insurers have to meet to make sure that policies will be paid out even if the primary insurer is bankrupted by an unusually large claim?</p></blockquote>\n<p>The entry's adoption suggestion:</p>\n<blockquote><p>You can help by researching best practices in the insurance industry and using what you learn to answer some or all of these questions, and then drafting a sample insurance policy, or a bill that would require AI developers to place insurance, or both. You could also try sending the sample insurance policy to a real insurance company or to an actuary and seeing if they’d be willing to come up with a price estimate for it.</p></blockquote>\n<h3>What you produce</h3>\n<p>The answers the entry's questions demand — the minimum amount, the policy limits, the deductible and co-insurance, the covered harms and permitted exclusions, the re-insurance backstop — drafted into the sample policy or bill the entry describes, with the loss arithmetic visible and the market-availability check the entry's pricing suggestion implies.</p>"
    },
    {
      "slug": "interconnect-cut-protocol",
      "source": "verification-capstones/interconnect-cut-protocol.md",
      "title": "Cut the Interconnect, Keep the Inference",
      "track": "Verification",
      "status": "draft",
      "summary": "Disconnect part of the optical links between racks and training stops while inference survives — allegedly. Work out what remains possible and who checks the cables.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Short protocol design plus a red-team pass on it",
      "deliverableType": "design",
      "mentor": "optional",
      "audience": "The negotiator who needs an emergency measure that does not kill civilian service.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "protocol design",
        "network reasoning",
        "red-teaming"
      ],
      "prerequisites": [
        "Verification 2.1 — the hardware layer",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix A, Article VII, Chip Use Verification. Quoted:</p>\n<blockquote><p>The CTB may impose various restrictions on how chips can operate in order to ensure proper verification. These restrictions may include but are not limited to:</p>\n<p>Restrictions on the bandwidth and latency between different chips, or between chips and their data center network, in order to distinguish permitted inference from prohibited training.</p></blockquote>\n<p>The feasibility notes state the asymmetry the measure rides on:</p>\n<blockquote><p>Various technical methods could be used to make verification easier. For example, using the algorithms of 2025, AI training requires much higher bandwidth compared to AI inference. Thus, if the chips are connected using low-bandwidth networking cables, they are effectively limited such that they can engage in inference but not training. There are various nuances to these and other mechanisms; we refer curious readers to previous work on the topic.</p></blockquote>\n<h3>What you produce</h3>\n<p>A protocol for imposing and verifying that restriction as an emergency measure — what gets disconnected, what stays up, how non-reconnection is checked — plus a red-team pass on how much of the quoted asymmetry survives contact with a determined operator.</p>"
    },
    {
      "slug": "interp-as-evidence",
      "source": "verification-capstones/interp-as-evidence.md",
      "title": "What an Interp Finding Is Evidence Of",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Take one published interpretability result and write the evidence memo — the claim it supports, the claims it is routinely stretched to cover, and whether it would survive a hearing.",
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
      "deliverable": "Two-page evidence memo rating one interp finding against three claims it gets cited for",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "The policy researcher about to cite an interpretability paper in an argument.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "evidence standards",
        "reading technical results as a non-specialist",
        "claim-to-evidence mapping"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Open Problems in Mechanistic Interpretability — Sharkey et al. (2025), abstract and the model-organisms caveat",
          "href": "https://arxiv.org/abs/2501.16496"
        },
        {
          "label": "Apollo Research's 45+ mech interp project ideas (2024)",
          "href": "https://www.lesswrong.com/posts/KfkpgXdgRheSRWDy8/a-list-of-45-mech-interp-project-ideas-from-apollo-research"
        },
        {
          "label": "Laying the foundations for vision and multimodal mechanistic interpretability — Joseph & Nanda (2024)",
          "href": "https://www.lesswrong.com/posts/kobJymvvcvhbjWFKe/laying-the-foundations-for-vision-and-multimodal-mechanistic"
        },
        {
          "label": "200 Concrete Open Problems in Mechanistic Interpretability (2022)",
          "href": "https://www.lesswrong.com/posts/LbrPTJ4fmABEdEnLf/200-concrete-open-problems-in-mechanistic-interpretability"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2501.16496\">Open Problems in Mechanistic Interpretability — Sharkey et al. (2025)</a>, abstract. Quoted:</p>\n<blockquote><p>Despite recent progress toward these goals, there are many open problems in the field that require solutions before many scientific and practical benefits can be realized: Our methods require both conceptual and practical improvements to reveal deeper insights; we must figure out how best to apply our methods in pursuit of specific goals; and the field must grapple with socio-technical challenges that influence and are influenced by our work. This forward-facing review discusses the current frontier of mechanistic interpretability and the open problems that the field may benefit from prioritizing.</p></blockquote>\n<p>And on the gap between what is studied and what gets claimed:</p>\n<blockquote><p>Furthermore, certain choices made while studying model organisms risk steering the field in suboptimal directions. For instance, interpretability research is often motivated by the engineering goal of understanding state-of-the-art models thoroughly enough to make assurances of their safety (Bereska &amp; Gavves 2024; Tegmark &amp; Omohundro 2023; Dalrymple et al. 2024). However, limiting its focus by studying small toy models (e.g. Nanda et al. 2023a) or how larger models accomplish select subtasks (Arditi et al. 2024), risks incentivizing research and methods that fail to generalize to more safety-relevant real-world settings.</p></blockquote>\n<h3>What you produce</h3>\n<p>The memo the abstract's caution demands: one published finding restated at the precision it supports, three claims it gets cited for rated against it, and the replacement sentence a policy document can defend — with the generalization gap the review names checked for each claim: was this shown on a toy model or a select subtask, and does the citation carry it to a safety-relevant real-world setting?</p>"
    },
    {
      "slug": "intro-retention-probe",
      "source": "verification-capstones/intro-retention-probe.md",
      "title": "What Do Intro Graduates Actually Retain?",
      "track": "Program-wide",
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
      "verificationFit": null,
      "courseFit": false,
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Both track documents build on the same claim: intro-course graduates arrive with <strong>recognition-level</strong> familiarity — the AI triad, the risk taxonomy, ML vocabulary — and <strong>recall-level</strong> gaps that widen over the first year, so week 1 should reactivate through production rather than re-teach. Both documents also say, in as many words, that the numbers behind that claim are directional and came from a summary rather than from measurement.</p>\n<p>Measure it.</p>\n<ul><li><strong>The entry profile, restated as items.</strong> Turn the \"safe to assume\" and \"not safe to assume\" lists into a testable instrument. Recognition items (pick the correct definition) and recall items (produce the specific) covering the same concepts, so the gap between the two is visible per concept rather than asserted overall.</li><li><strong>Curriculum trace.</strong> For each item, which intro curriculum actually covers it — the EA intro and in-depth fellowships, BlueDot's course, whatever else the cohort came through. An item nothing teaches is not a retention failure.</li><li><strong>The probe.</strong> Run it with consenting members of the current cohort, plus time since their intro course. Twenty minutes maximum.</li><li><strong>The findings.</strong> Recognition versus recall per concept, and against months-since-course where you have the numbers. Report the sample size in the first line and say plainly what it cannot support.</li><li><strong>The revision list.</strong> Which week-1 assumptions hold, which do not, and what the tiered hint system has to absorb — the concrete deliverable the program can act on.</li></ul>\n<p>Working material for the trace: the <a href=\"https://resources.eagroups.org/intro-fellowship-curriculum\">EA Intro Fellowship curriculum</a>, <a href=\"https://resources.eagroups.org/post-intro-fellowship-syllabi-and-programs/in-depth-fellowship\">EA In-Depth Fellowship syllabi</a>, <a href=\"https://bluedot.org\">BlueDot Impact</a>, the <a href=\"https://airtable.com/app53PsYpHxJW61l3/shr6eKNhPjxj4UH4E/tblqpu7Tcy2734cji\">80,000 Hours part-time courses directory</a>, and the <a href=\"https://www.aisafety.com/courses\">open curricula directory</a>.</p>\n<h3>Why it exists</h3>\n<p>The program's whole autonomy ramp starts from an assumption about who walks in the door. If that assumption is wrong in a specific place, week 1 either bores people or loses them, and nobody finds out until the cohort is half over.</p>\n<p>The transferable skill is measuring something the program currently believes on thin evidence and reporting the result at the confidence the sample allows. That is the same discipline the tracks teach about eval scores and compute estimates, turned on the program itself — and it is much easier to learn when the stakes are a hint tree rather than a regulation.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published intro curricula, the two track documents' entry-profile sections, and a short voluntary probe of the current cohort.</p>\n<p><strong>Out of scope:</strong> a controlled study, a claim about the field at large, and any comparison between named individuals. You will have a sample in the tens at best; a finding stated more confidently than that supports is the failure mode this capstone is most likely to hit.</p>\n<p><strong>Consent and data handling are part of the deliverable.</strong> Participation is voluntary and refusable without explanation, responses are reported in aggregate, and you collect nothing you do not need — months-since-course and which intro programme, not names, not demographics. Write the one-paragraph consent notice before you write the first item, and include it in the submission.</p>\n<p><strong>Marked concept, not ready:</strong> it depends on cohort participation, which cannot be guaranteed. If fewer than a handful respond, the instrument plus the curriculum trace plus an honest account of the response rate is the deliverable, and it should be graded as one — a validated instrument the next cohort can run is worth more than a number from five people.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Instrument</td><td>A quiz</td><td>Matched recognition/recall pairs per concept, so the gap is measured not assumed</td></tr><tr><td>Trace</td><td>Assumed coverage</td><td>Per item, the curriculum and session that teaches it — or a note that none does</td></tr><tr><td>Reporting</td><td>A percentage</td><td>The percentage, the n, and the sentence it does not support</td></tr><tr><td>Output</td><td>\"Retention is poor\"</td><td>A specific list of week-1 assumptions to change, and how</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Build the instrument straight from the two track documents' own lists. They are already itemised; your job is to make each one answerable.</li><li>Pilot on two people outside the cohort before running it. Half your items will turn out to be ambiguous, and finding that after the real run wastes the sample you cannot get twice.</li><li>Decide, in writing and in advance, what result would change week 1. Deciding after you see the data is how a probe becomes a rationalisation.</li></ol>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1.4",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), §3",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Key Findings. Quoted:</p>\n<blockquote><p>To complete these subgoals, states could create six layers of verification—six largely independent assurances of compliance (Section 4; Table 1; Figure 2). Like “layers of defense,” a full implementation of each layer could verify compliance on its own, and multiple layers would reinforce each other. Thus, a stack of layers is an effective combination of verification mechanisms; it completes each subgoal with redundancy. In brief, the layers are:</p></blockquote>\n<p>And from <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, the standard any regime has to meet:</p>\n<blockquote><p>All parties to the agreement will desire assurance that other parties are not engaged in secret AI capabilities projects. Providing this assurance is a key aim of the agreement. Given a low-trust environment, parties must have the means to verify compliance to their satisfaction. It gives special consideration to the independent verification efforts of the U.S. and the PRC.</p></blockquote>\n<h3>What you produce</h3>\n<p>One agreement — a three-month emergency pause, a compute cap, or a conditional slowdown — and the smallest subset of the quoted layers that makes it credible in that low-trust environment: a two-page regime spec in which every mechanism earns its place, plus a one-page evasion annex that attacks your regime specifically.</p>"
    },
    {
      "slug": "model-registry-lower-bar",
      "source": "verification-capstones/model-registry-lower-bar.md",
      "title": "What Counts as a New Model?",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "A registry has to say when an update becomes a new entry. Draw the line, test it against a year of real releases, and say what each side of it costs.",
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
      "difficulty": "core",
      "deliverable": "Registry threshold rule, back-tested against a year of real model updates, with the cost either way",
      "deliverableType": "spec",
      "mentor": "optional",
      "audience": "Whoever operates the registry, and the developer deciding whether this checkpoint needs filing.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "definition design",
        "back-testing a rule",
        "regulatory administrability",
        "technical judgement"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), §5.3.2, tracking versioning and updates: what a registry should store, and how it could be verified",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2407.14981\">Open Problems in Technical AI Governance — Reuel et al. (2025)</a>, §5.3.2, Verification of Dynamic Systems. Quoted:</p>\n<blockquote><p>Motivation: Modern AI systems, such as ChatGPT, are not based on static models. Rather, they consist of multiple models and components, for example, mixture-of-experts, input filters, and output filters, that undergo change throughout their life cycle. This poses an oversight challenge due the ever-changing nature of many systems throughout their deployment life cycle. Having a reliable, accessible process for versioning could help to monitor system updates and their impacts.</p></blockquote>\n<p>The open problem it lists:</p>\n<blockquote><p>Tracking versioning and updates. Key open questions in this context relate to how model versioning and post-deployment modifications should be kept track of, especially for models that undergo frequent updates. One approach could be to have registries that track models over time, however, it’s not clear what information should be stored in such a registry, nor how the information could be verified. Other approaches that can be useful as a starting point to verify dynamic models include reward reports for reinforcement learning (Gilbert et al. 2023), ecosystem graphs (Bommasani et al. 2023c), or instructional fingerprinting of foundation models (Xu et al. 2024).</p></blockquote>\n<h3>What you produce</h3>\n<p>The threshold rule the open problem needs: what counts as an update worth filing, back-tested against a year of real model updates, with the filing volume each candidate rule produces — a concrete answer to how versioning and post-deployment modifications should be kept track of for models that undergo frequent updates.</p>"
    },
    {
      "slug": "open-weight-release-memo",
      "source": "verification-capstones/open-weight-release-memo.md",
      "title": "The Open-Weight Release Decision",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Write the release memo for a frontier open-weight model — what evidence would justify shipping, which mitigations survive contact with a downstream fine-tuner, and which are theatre.",
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
      "deliverable": "Release-decision memo with an evidence table and a stated irreversibility budget",
      "deliverableType": "memo",
      "mentor": "recommended",
      "audience": "The release committee that has to sign, knowing they cannot unship.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "risk assessment",
        "evidence standards",
        "threat modelling",
        "decisions under irreversibility"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026), §2 and abstract",
          "href": "https://arxiv.org/abs/2608.07514"
        },
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025)",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2608.07514\">Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026)</a>, §2, on why open-weight risk management is challenging. Quoted:</p>\n<blockquote><p>With enough fine-tuning on enough data, safeguards for any model can be undone, meaning that practical anti-tampering techniques can only hope to make harmful forms of fine-tuning sufficiently onerous.</p>\n<p>Open-weight models can be spread quickly and irreversibly. If a closed-weight model is found to pose hazards, risk-conscious developers can add patches or pull the model from distribution. Consider, for example, OpenAI’s April 2025 update of GPT-4o. After release, external evaluation identified excessive sycophancy and encouragement of self-harm. In response, OpenAI reverted to a previous version of the model (166). In contrast, OpenAI’s open-weight release of gpt-oss-120b, which currently has over 3 million monthly downloads from HuggingFace, was not reversible. While ceasing service to a model can make it much less accessible (e.g., 205; 196), there is no reliable way to prevent existing copies of the model from being used and shared.</p></blockquote>\n<p>The paper's abstract is plain about the state of the field:</p>\n<blockquote><p>We conclude by discussing the nascent state of the field, emphasizing that openness about research, methods, and evaluations – not just weights – will be key to building a rigorous science of open-weight model risk management.</p></blockquote>\n<h3>What you produce</h3>\n<p>The memo a release committee reads before an irreversible act: the decision up front, the evidence table with what would overturn each claim, a mitigation audit run under the quoted premise — safeguards can be undone, so each one is marked by how onerous it actually makes harmful fine-tuning — and the irreversibility budget the second passage prices: what cannot be recovered once existing copies are being used and shared.</p>"
    },
    {
      "slug": "ops-threshold-adjustments",
      "source": "verification-capstones/ops-threshold-adjustments.md",
      "title": "OP/s Threshold Adjustments for Performance",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "How should OP/s thresholds adjust for performance across bit-widths? Existing metrics may favor smaller bit-widths, and the acceleration effects are under-analyzed.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Literature-review-and-modelling note on bit-width performance effects and the threshold adjustment they justify",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "literature review",
        "hardware performance modelling"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 71: OP/s threshold adjustments for performance",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "which-compute-target",
          "title": "Which Compute Are We Even Regulating?"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 71, \"OP/s Threshold Adjustments for Performance\". Quoted:</p>\n<blockquote><p>How should the OP/s threshold (e.g. in US chip export controls) be adjusted to account for performance variations across different bit-widths (in OP/s but also overall)? This is critical for accurately penalizing and incentivizing the development of AI systems. Existing metrics may disproportionately favor smaller bit-widths over larger ones. E.g., your metric for FP16 is only 2x higher than FP32, while the total performance gains might be higher. Smaller bit-widths are particularly advantageous for machine learning (ML) development and deployment, making them a focus for more precise AI applications. Reduced bit-width generally results in performance acceleration, often exceeding linear improvement. However, implementing such changes in hardware requires a couple of years.</p>\n<p>So if smaller bit-widths offer hardware performance advantages (if supported), then it’s advantageous to leverage them for development and deployment. Smaller bit-widths are more easily leveraged for inference via post-training quantization (there are implementations via int4). Recent studies primarily focus on cost and memory footprint reductions, with limited analysis on the acceleration effects. (Mostly academics who want to deploy models on their limited number of GPUs with limited memory.) FP16 has become the default for training and FP8 might be next. The H100 is already supporting FP8.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>How should the OP/s threshold be adjusted to account for performance variations across different bit-widths (in OP/s but also overall)?</p>\n<p>Do we see a reduced performance for using X 8bit FLOP vs X 16bit FLOP for training a X FLOP model?</p>\n<p>Current consensus suggests no performance loss, meaning 16-bit and 32-bit FLOPs yield similar capabilities.</p>\n<p>While reduced bit-width generally works until a certain point, few studies focus on architecture modifications to accommodate even lower bit-widths (&lt;8bit) during training.</p></blockquote>\n<h3>What you produce</h3>\n<p>The note the idea's own research questions describe: what the literature and your modelling say about performance across bit-widths, and the threshold adjustment that evidence justifies.</p>"
    },
    {
      "slug": "orphaned-policy-adoption",
      "source": "verification-capstones/orphaned-policy-adoption.md",
      "title": "Adopt an Orphaned Policy",
      "track": "AI Governance Policy",
      "status": "concept",
      "summary": "Find a governance proposal nobody owns, work out why it stalled, and write the implementation plan that would give it a home.",
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
      "difficulty": "stretch",
      "deliverable": "Stakeholder map plus a sequenced implementation plan",
      "deliverableType": "design",
      "mentor": "required",
      "audience": "The organisation you are nominating to pick it up.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "stakeholder mapping",
        "implementation design",
        "political economy",
        "agenda-setting"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Some governance proposals are not contested — they are simply unowned. No agency has the mandate, no advocacy organisation has it on the list, no lab benefits from proposing it. Pick one and build its adoption case.</p>\n<p>Deliver:</p>\n<ul><li><strong>The orphan.</strong> The proposal, stated in a paragraph, with its origin and its best public articulation.</li><li><strong>The autopsy.</strong> Why it has no owner. Distinguish \"no one benefits\" from \"the beneficiaries are diffuse\" from \"the natural owner lacks the authority\" — the three have completely different fixes.</li><li><strong>The stakeholder map.</strong> Who would have to act, in what order, with what incentives, and who is positioned to block.</li><li><strong>The implementation plan.</strong> A sequence, with the first move specified well enough that someone could make it next quarter.</li><li><strong>The scenario test.</strong> Run the plan against short and long timeline worlds. Say which one it bets on, or make it robust to both.</li></ul>\n<h3>Why it exists</h3>\n<p>Most policy training teaches you to evaluate proposals. Almost none teaches you what has to be true for a proposal to acquire an owner — which is the step where good ideas actually die. This capstone puts the learner on the institutional side of the problem, where the deliverable is a sequence of moves rather than an argument.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> proposals with a public articulation you can cite. Curated lists of unowned policy questions and project-idea collections are the intended starting point.</p>\n<p><strong>Out of scope:</strong> inventing a new proposal. The exercise is adoption, not ideation — and an invented proposal cannot be checked for why it stalled.</p>\n<h3>What good looks like</h3>\n<ul><li>The autopsy has a mechanism, not a mood. \"It's unglamorous\" is a hypothesis; \"the only body with rulemaking authority here has no statutory hook and the fix requires primary legislation\" is an autopsy.</li><li>The first move is small, concrete, and does not require anyone to already agree with you.</li><li>The scenario test changes something. A plan identical in both timeline worlds has usually not been tested.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Shortlist three orphans, then pick the one where you can name a plausible owner. An orphan with no candidate parent is a research question, not a capstone.</li><li>Interview-shaped reading: find what the natural owner has actually said about the area, not what you assume they think.</li><li>Write the first move before the full sequence. If the first move is \"convene a working group\", keep going.</li></ol>\n<blockquote><p><strong>Status: concept.</strong> This entry needs a vetted source list of orphaned proposals and a mentor who knows the relevant institutions before it can be offered. Treat the scope as indicative.</p></blockquote>"
    },
    {
      "slug": "permit-inference-prohibit-training",
      "source": "verification-capstones/permit-inference-prohibit-training.md",
      "title": "Permit Inference, Prohibit Training",
      "track": "Verification",
      "status": "draft",
      "summary": "An agreement permits inference and prohibits training. Define permitted inference so the boundary survives fine-tuning, distillation and synthetic-data generation.",
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
      "deliverable": "Draft rule, five edge cases, and the revisions they force",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The drafter of a pause clause that has to leave deployed services running.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "definition drafting",
        "workload analysis",
        "adversarial testing"
      ],
      "prerequisites": [
        "Verification 2.2 — the cloud layer",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII",
          "href": "https://arxiv.org/abs/2511.10783"
        },
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.7",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, the notes on Article VII, Chip Use Verification:</p>\n<blockquote><p>Parties would want to ensure that existing AI chips are not being used to do dangerous AI training. There are legitimate reasons to use these chips to run existing AI services like (extant versions of) ChatGPT. The agreement thus requires the ability to verify that AI chips are only being used for permitted activities.</p></blockquote>\n<p>The article's text writes the distinction as an operating restriction:</p>\n<blockquote><p>Restrictions on the number or rate of FLOP/s or memory bandwidth at which chips can operate, in order to distinguish permitted inference from prohibited training or other prohibited workloads.</p></blockquote>\n<p>And <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix A.7, poses the boundary problem the rule has to survive:</p>\n<blockquote><p>Data center GPUs can be used for a variety of workloads beyond AI, raising the question of how a Verifier could distinguish these non-AI workloads from AI workloads. At a high level, options include:</p></blockquote>\n<h3>What you produce</h3>\n<p>The operational rule the quoted restrictions assume: a definition of permitted inference that an operator cannot stretch to cover a training program, five edge cases run against it, and the revisions they force.</p>"
    },
    {
      "slug": "pre-emptive-authorization",
      "source": "verification-capstones/pre-emptive-authorization.md",
      "title": "A Licence to Train",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Licensing keeps being proposed for frontier training and never specified. Design the authorisation regime — the trigger, the test, the decision-maker, and the appeal.",
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
      "deliverable": "Authorisation regime design with the decision test, timelines, and a caseload estimate",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The agency that would have to say yes or no, on a clock, with the evidence available.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "regulatory design",
        "administrative process",
        "decision-test drafting",
        "caseload estimation"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 57: pre-emptive authorization for AI training",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "frontier-ai-public-utilities",
          "title": "Should Parts of Frontier AI Be Treated Like Public Utilities?"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 57, \"Pre-Emptive Authorization for AI Training\", suggested by Lennart Heim. Quoted:</p>\n<blockquote><p>Extending the regulation of frontier AI systems to potentially deny specific training attempts is an ambitious proposal that asks for a substantial burden of proof. Why would we consider it necessary to prevent an AI system from even being trained, especially when our regulatory focus is often on the deployment of technologies? After all, we are not aware of the specific risks of an AI system when it has not yet come into existence. Despite these concerns, “pre-emptive authorization” could be warranted due to (i) the risk of proliferation, (ii) potential dangers arising during the training run, and (iii) practical benefits related to the compute moat. More concretely, a regulatory framework could require AI developers to secure a permit before they're allowed to train frontier AI systems. This permit would be evaluated on two factors: the level of responsibility demonstrated by the AI developer (Schuett et al., 2023 and the properties of the training run. This approach to regulation is not unprecedented. We find parallels in other disciplines such as biology, where approvals are frequently mandated before experiments. Moreover, one can draw comparisons with the stringent controls placed on the construction of nuclear weapons (Baker, 2023).</p></blockquote>\n<p>The idea's research question:</p>\n<blockquote><p>How can a regime based on preemptive authorization be justified? What arguments support this?</p></blockquote>\n<h3>What you produce</h3>\n<p>The regime the background sketches, specified: the permit and the two factors it is evaluated on, worked into a trigger, a decision test, timelines, and a caseload estimate — with the justification the research question asks for argued rather than assumed.</p>"
    },
    {
      "slug": "procurement-as-lever",
      "source": "verification-capstones/procurement-as-lever.md",
      "title": "Govern Through the Purchase Order",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Government buying power sets terms without new legislation. Draft the AI procurement conditions for one agency, and say which safety asks a contract can actually carry.",
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
      "difficulty": "core",
      "deliverable": "Draft procurement conditions with the evidence each requires, and the asks that do not survive contract form",
      "deliverableType": "spec",
      "mentor": "optional",
      "audience": "The contracting officer who has to evaluate bids against whatever you write.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "contract-condition drafting",
        "evidence design",
        "lever analysis",
        "administrability"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 63: what rules should the US government set regarding government purchases of AI?",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "best-practices-implementation",
          "title": "Implementation Details of the Best-Practices List"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 63, \"What Rules Should the US Government Set Regarding Government Purchases of AI?\", suggested by Nikhil Mulani. Quoted:</p>\n<blockquote><p>Public procurement has been put forward as one of many levers available to governments to steer the development and deployment of AI. For example, the US government recently issued a request for Information on responsible procurement of artificial intelligence in government. But also on a local level, procurement could become the tool of choice for those seeking to leverage the soft powers of government for positively influencing the trajectory of AI. The US federal government purchases nearly 700bn $ worth of goods and services every year, making it a major customer with significant power over the market. At the same time, there is little track record of procurement guidelines for safe and responsible AI.</p></blockquote>\n<p>The idea's research question:</p>\n<blockquote><p>What rules should the US government set regarding government purchases of AI?</p></blockquote>\n<h3>What you produce</h3>\n<p>The rules the research question asks for, drafted as procurement conditions for one agency: what a vendor must show, what a contracting officer can actually evaluate, and which safety asks survive contract form — the track record of guidelines whose absence the background names.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.4",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025), §4.5 model provenance and forensics: model heritage inference, and how practical and scalable proof-of-training methods are",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix A.4, Partial Workload Re-Execution With Constraints. Quoted:</p>\n<blockquote><p>Background: A Verifier may wish to verify that a declared workload was actually run (Subgoal 1.A). For example, a Prover may make claims about what training code, data, and intermediate results (e.g., model weight checkpoints) were involved in training some model weights, and the Verifier may wish to verify these claims [110, 34].</p>\n<p>The Verifier can do this by verifying faithfulness, i.e., that running the declared workload in fact produces the claimed results, and uniqueness, i.e., that a faithful declaration is infeasible to produce in practice except by actually running the declared workload [34].</p>\n<p>The Verifier can verify faithfulness and uniqueness, respectively, via (1) partial workload re-execution, i.e., re-running (randomly sampled parts of) the Prover’s program to check if the declared results are approximately reproducible, and (2) constraints, i.e., checking that the declaration meets constraints which rule out spoofed declarations.</p></blockquote>\n<h3>What you produce</h3>\n<p>A feasibility assessment on the quoted decomposition: which training-provenance claims faithfulness-plus-constraints can carry today, which they cannot, and what would have to change — in the constraints, the hardware, or the claims themselves — to close the gap.</p>"
    },
    {
      "slug": "reconciling-impact-scores",
      "source": "verification-capstones/reconciling-impact-scores.md",
      "title": "Reconciling Impact Scores for AI Risk Management",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "AI risks are measured in incompatible units across domains. Review how other impact-assessment fields combine scores, and recommend a currency converter suited to AI risk.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Comparative review of impact-score combination methods with a recommendation for AI risk assessment",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "risk assessment methods",
        "comparative review"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 55: reconciling impact scores for comprehensive AI risk management",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "regulatory-cost-benefit",
          "title": "Do the Cost-Benefit Analysis Nobody Did"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 55, \"Reconciling Impact Scores for Comprehensive AI Risk Management\". Quoted:</p>\n<blockquote><p>AI is a cross-cutting risk that can have impacts which we could seek to measure across a wide number dimensions, from economic impact to loss of human life, environmental damage to public trust. The most appropriate units of measurement are different for each of these. Therefore, it would be useful to conduct a review of different approaches used in different impact assessment fields as to how these are combined, drawing out the pros and cons of each approach, and recommending some combination of these approaches based on which are well suited to AI risk assessment scores (including coming up with what the desirable factors are that would make it well-suited). For this project, it can be assumed the user/reader has already generated the impact and likelihood data for decomposed risks, but that we’re struggling to combine these into a single score for a large risk area as a whole (e.g. job displacement by AI) and justify any exchange rates/other algorithm by which this is done.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>How can we create unified, rigorous and consistent Impact scores for AI risk assessments across risks of all domains?</p>\n<p>Are there quantitative methods that can be taken from other fields that can address the problem of creating a single impact score that acts as a 'currency converter' between these different impacts, measured with different quantities - and how well could they apply to AI risk assessment?</p></blockquote>\n<h3>What you produce</h3>\n<p>The review and recommendation the idea specifies: how other impact-assessment fields combine incompatible scores, the pros and cons of each approach, and which combination suits AI risk assessment — including the desirable factors that make a method well-suited.</p>"
    },
    {
      "slug": "red-line-definition",
      "source": "verification-capstones/red-line-definition.md",
      "title": "Draft a Red Line Somebody Could Enforce",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Pick a capability everyone says should be off-limits and write the definition three parties could sign — plus the eval that decides it and the body that acts on it.",
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
      "difficulty": "stretch",
      "deliverable": "Red-line definition, its triggering evidence standard, and the enforcement hook",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The standards body or agency that would have to make the line operative.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "definition drafting",
        "consensus analysis",
        "evidence standards",
        "enforcement design"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Projects someone should maybe do — Catherine Brewer (2025), \\\"Red lines for cyber evals\\\"",
          "href": "https://docs.google.com/document/d/1MQ8CbgOy13GTWkJr09D-0fdPKydnrYYWIgSys0BwuP8/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://docs.google.com/document/d/1MQ8CbgOy13GTWkJr09D-0fdPKydnrYYWIgSys0BwuP8/edit\">Projects someone should maybe do — Catherine Brewer (2025)</a>, the \"Red lines for cyber evals\" entry. Quoted:</p>\n<blockquote><p>We have an abundance of cyber evals and a lack of consensus on what results (if any) would be sufficiently scary to constitute a “red line”. (Also, we don’t agree on what such a red line would look like.)</p>\n<p>As with bio red lines, I imagine this would involve gathering a bunch of important stakeholders from industry and maybe govts, having a bunch of conversations with them, and getting some consensus around (a) unambiguously big-deal eval scores and (b) the rough kind of response that would be merited.</p></blockquote>\n<p>Its \"Why\":</p>\n<blockquote><p>Same rationale as with bio red lines: one big way evals fail is the frog-boiling/no consensus on ifs nor thens.</p></blockquote>\n<h3>What you produce</h3>\n<p>The consensus artifact the entry describes, built for one candidate line: the definition three parties could sign, the unambiguously big-deal eval score that triggers it, and the response merited on a crossing — with the consensus analysis naming who would sign what, so the ifs and the thens stop boiling the frog.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix C.1",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix C.1, Methodology for Analysis. Quoted:</p>\n<blockquote><ol><li>Assessing, red teaming, and enhancing verification mechanisms; and</li></ol>\n<p>identifying open problems. For each identified mechanism, we iterated between assessing the mechanism and enhancing it. In the assessment stage, we evaluated various properties of each mechanism: what subgoals in our verification framework the mechanism could complete or support, its probability of detecting a violation quickly if done by a highly motivated major government, the frequency of false alarms, the confidentiality and security for the Prover, the setup speed in terms of time required for R&amp; D and implementation, and the financial or computational cost. We focus on these properties because history and incentives suggest they will be important for the acceptability of a verification regime [120, 39, 13, 143]. After assessing each property and identifying challenges for it, we considered how the mechanism could be enhanced to address these challenges (e.g., through a different implementation or additional compliance tests), and then we repeated the assessment on the enhanced version of the mechanism, up to the point where further assessment or enhancement appeared to require a substantial research project of its own.</p></blockquote>\n<p>The abstract says why this pass is owed:</p>\n<blockquote><p>While promising, these approaches require guardrails to protect against abuse and power concentration, and many of these technologies have yet to be built or stress-tested.</p></blockquote>\n<h3>What you produce</h3>\n<p>That same red-team pass, run against one published verification proposal of your choosing: an evasion report with an attack tree, and the patch list that would survive your own attack.</p>"
    },
    {
      "slug": "regulatory-cost-benefit",
      "source": "verification-capstones/regulatory-cost-benefit.md",
      "title": "Do the Cost-Benefit Analysis Nobody Did",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "AI rules are argued in principle and approved on paperwork. Write the regulatory impact analysis for one real proposal — costs, benefits, and what the standard method cannot handle.",
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
      "deliverable": "Regulatory impact analysis for one live proposal, plus a note on where the method breaks",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The economist in the review office who will read the agency's version of this document.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "cost-benefit analysis",
        "compliance-cost estimation",
        "valuing uncertain harms",
        "methodological critique"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 58: how can cost-benefit analyses be applied to AI regulation?",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "reconciling-impact-scores",
          "title": "Reconciling Impact Scores for AI Risk Management"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 58, \"How Can Cost-Benefit Analyses Be Applied to AI Regulation?\", suggested by John Halstead. Quoted:</p>\n<blockquote><p>Cost-benefit analyses have become a commonly used tool to inform regulation across different domains, with some governments or agencies making them a mandatory requirement for new programs, guidelines or standards. At the same, the field of AI is riddled with complexities and uncertainties that make these analyses potentially difficult or less informative. Cost-benefit analysis could be used to inform the risk thresholds used in evaluations of frontier AI models. There is currently no science of cost-benefit analysis in AI regulation, and attempts to apply cost-benefit analysis to AI regulation are piecemeal, non-public and ad hoc.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>How can cost-benefit analyses be applied to AI regulation and evaluations?</p>\n<p>What might these analyses look like in practice, and what would they involve?</p>\n<p>What difficulties should we expect to arise?</p>\n<p>Why might cost-benefit analysis be the wrong approach to setting risk thresholds in AI evaluations?</p>\n<p>Should cost-benefit analysis be used to assess AI regulations?</p>\n<p>What can we learn from how CBAs are conducted in adjacent domains?</p>\n<p>How far should risk thresholds used in AI evaluations be influenced by cost-benefit analysis?</p></blockquote>\n<h3>What you produce</h3>\n<p>A regulatory impact analysis for one live proposal — baseline, costs, benefits, alternatives — plus the note the sceptical questions call for: the difficulties to expect, where cost-benefit analysis may be the wrong approach to setting risk thresholds, and what CBA practice in adjacent domains teaches.</p>"
    },
    {
      "slug": "replication-what-broke",
      "source": "verification-capstones/replication-what-broke.md",
      "title": "Replicate a Published Number and Report What Broke",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Take one eval score or compute estimate that governance arguments lean on, reproduce it, and report what was underspecified, what it is sensitive to, and what a policy reader should cite instead.",
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
      "deliverable": "Replication notebook plus a two-page \"what the source did not tell you\" note",
      "deliverableType": "notebook",
      "mentor": "recommended",
      "audience": "The next person about to cite that number in a memo.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "replication",
        "experimental hygiene",
        "elicitation sensitivity",
        "negative results"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025), science of evals; \\\"Replicate bio evals with better tools\\\"",
          "href": "https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit\">A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)</a>, the \"Science of evals\" section. Quoted:</p>\n<blockquote><p>By science of evals, we broadly mean “figure out how to make the entire process of evaluating models and their effects more informative, replicable, predictive, rigorous, etc.” Many ideas in this section are open questions and don’t have concrete projects available.</p></blockquote>\n<p>One entry, \"Replicate bio evals with better tools\" (credit: Igor Ivanov), makes the replication case concrete:</p>\n<blockquote><p>US AISI ran bio evaluations for o1 by using the LAB-bench benchmark. They ran evaluations with access to the Python interpreter, but the model most likely would benefit from access to more tools, like genetic databases or a search engine for scientific articles. This means that with proper scaffolding o1 would be more capable, and they underelicited true capabilities of the model. Someone can replicate their evaluations, but with more advanced scaffolding.</p>\n<p>This project is important because apart from US AISI, almost no one shares their bio evaluations of frontier models, so there is limited information flow in the field, and their methodology is rather basic, so any improvement on it would meaningfully contribute to the field.</p></blockquote>\n<h3>What you produce</h3>\n<p>A replication in exactly that spirit, on a published number of your choosing: the notebook that reproduces it, the comparison with the gap quantified, the sensitivity check on what the source left unstated, and the two-page note on what the methodology did not tell you — the improvement on basic methodology the entry says would meaningfully contribute to the field.</p>"
    },
    {
      "slug": "research-proposal-workup",
      "source": "verification-capstones/research-proposal-workup.md",
      "title": "Write the Proposal a Funder Would Read",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Take one idea off a public governance research agenda and work it into a two-page funding proposal — scope, budget, timeline, and the result that would prove you wrong.",
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
      "deliverable": "Two-page proposal in RFP format, with a budget, a timeline and a stated falsifier",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "A grant-maker with forty proposals and twenty minutes each.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "research scoping",
        "proposal writing",
        "budgeting",
        "falsifier discipline"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Ten AI safety projects I'd like people to work on — Julian Hazell (2025)",
          "href": "https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on\">Ten AI safety projects I'd like people to work on — Julian Hazell (2025)</a>, on why the list exists. Quoted:</p>\n<blockquote><p>I’ve said it before, and I’ll say it again: I think there’s a real chance that AI systems capable of causing a catastrophe (including to the point of causing human extinction) are developed in the next decade. This is why I spend my days making grants to talented people working on projects that could reduce catastrophic risks from transformative AI.</p>\n<p>I don’t have a spreadsheet where I can plug in grant details and get an estimate of basis points of catastrophic risk reduction (and if I did, I wouldn’t trust the results). But over the last two years working in this role, I’ve at least developed some Intuitions™ about promising projects that I’d like to see more people work on.</p></blockquote>\n<p>Among the closing caveats:</p>\n<blockquote><p>If you’re considering these projects, you should develop your own vision for how they’d be helpful.</p></blockquote>\n<p>And the post ends with the invitation:</p>\n<blockquote><p>If you’re interested in applying for funding to work on one of these projects (or something similar), check out our RFP.</p></blockquote>\n<h3>What you produce</h3>\n<p>The application that invitation calls for, in miniature: one project off a public list — from this post or another published agenda — worked into a two-page proposal a grant-maker could read: the question, why it is not answered already, the method, the budget and timeline, and the result that would prove it wrong.</p>"
    },
    {
      "slug": "resilience-allocation-plan",
      "source": "verification-capstones/resilience-allocation-plan.md",
      "title": "Spend Ten Billion Dollars",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "If a government suddenly wanted to spend seriously on AI resilience, no implementation-ready plan exists. Write the allocation, defend the split, and say what you would cut first.",
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
        "label": "4 weeks",
        "weeks": 4
      },
      "perWeek": "≈5 hrs/wk",
      "difficulty": "stretch",
      "deliverable": "Allocation plan with line items, sequencing, absorptive-capacity analysis and a cut list",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The staffer who has ten days to turn a political window into a budget line.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "prioritisation under uncertainty",
        "absorptive-capacity analysis",
        "budgeting",
        "scenario robustness"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Ten AI safety projects I'd like people to work on — Julian Hazell (2025), project 7: $10 billion AI resilience plan",
          "href": "https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on\">Ten AI safety projects I'd like people to work on — Julian Hazell (2025)</a>, project 7, \"$10 billion AI resilience plan\". Quoted:</p>\n<blockquote><p>What: A comprehensive, implementation-ready plan detailing how $10 billion (somewhat arbitrarily chosen) could be deployed to make significant progress toward AI alignment/control research and/or societal resilience measures. This would ideally be a fairly detailed blueprint with specific program structures, priority funding areas, budget allocations, timelines, milestones, etc.</p>\n<p>Why this matters: Going from “we should spend more on AI safety” to “here’s how we can spend more on AI safety” is non-obvious, yet we might be in this scenario if, e.g., a major government (not necessarily the US government; even smaller countries have big budgets) wakes up to transformative AI risk or if philanthropic interest spikes after some big warning shot.</p>\n<p>What the first few months could look like: Interviewing relevant experts (e.g., AI safety researchers, policy people, funders) to inform your view on the top priorities, researching existing large-scale research funding programs (DARPA, NSF, etc.) to see if there’s anything you can learn, developing a taxonomy of different intervention areas (ideally with rough budget allocations), and creating a few concrete “shovel-ready” program proposals that could quickly absorb significant funding.</p></blockquote>\n<h3>What you produce</h3>\n<p>The blueprint the post describes — specific program structures, priority funding areas, budget allocations, timelines, milestones — with the absorptive-capacity analysis and the ranked cut list that let a staffer use it the day the scenario the post names arrives.</p>"
    },
    {
      "slug": "rmf-compliance-scorecard",
      "source": "verification-capstones/rmf-compliance-scorecard.md",
      "title": "Score the Developers Against the NIST Framework",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Nobody knows whether the major developers follow the NIST AI Risk Management Framework — or ever promised to. Turn it into a checklist, score them on public evidence, and publish the rule.",
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
      "difficulty": "core",
      "deliverable": "Compliance checklist derived from the framework, scores for three developers, and the evidence log",
      "deliverableType": "dossier",
      "mentor": "optional",
      "audience": "The procurement officer or regulator deciding whether \"we follow the RMF\" means anything.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "framework decomposition",
        "rubric design",
        "evidence sourcing",
        "comparative scoring"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 10: industry standards",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance\">Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025)</a>, the \"Industry Standards\" entry (orphan 10). Quoted:</p>\n<blockquote><p>NIST has already published an AI Risk Management Framework that contains voluntary best practices for coping with the risks of AI. It is not obvious that all major AI developers are actually complying with these voluntary best practices, or even that they have promised to do so. There is much work to be done lobbying companies to publicly promise to abide by the NIST AI RMF and then preparing checklists, scorecards and other tools to evaluate how well they are living up to this promise.</p>\n<p>SaferAI’s work in creating a rating system for AI companies is a good first step, but the ratings need to be broadened and aligned with the NIST criteria, and someone needs to convince the companies to commit to using these criteria and to publishing enough data often enough that third parties can meaningfully assess the extent to which they are successfully complying with those criteria.</p></blockquote>\n<p>The entry's adoption suggestion:</p>\n<blockquote><p>You can help by developing checklists or scorecards that assess compliance, by developing tools, wizards, charts, and templates that make it easier for companies to comply, and by drafting sample agreements that companies could sign to show that they agree to follow these guidelines.</p></blockquote>\n<h3>What you produce</h3>\n<p>The checklists and scorecards the entry asks for: framework criteria decomposed into externally checkable items, three developers scored on public evidence with the log kept, and the scoring rule published with the scores — the assessment tooling the entry says compliance claims currently lack.</p>"
    },
    {
      "slug": "sandbagging-incentives",
      "source": "verification-capstones/sandbagging-incentives.md",
      "title": "Make Sandbagging Not Worth It",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "A developer whose model must score below a threshold has every reason to elicit weakly. Design the regulatory incentives that make under-elicitation the expensive option.",
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
      "difficulty": "stretch",
      "deliverable": "Incentive design — the detection route, the penalty, and the reporting rule that makes both work",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The regulator who has to accept an eval result from a party that benefits from a low score.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "incentive design",
        "eval methodology",
        "detection reasoning",
        "regulatory drafting"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 38: what regulatory incentives should target evaluation sandbagging?",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 38, \"What Regulatory Incentives / Interventions Should Target Evaluation Sandbagging?\", suggested by Francis Rhys Ward. Quoted:</p>\n<blockquote><p>Sandbagging is strategic underperformance on an evaluation. AI developers, or AI systems themselves, may have incentives to sandbag dangerous capability evals, to circumvent regulation. (Cf the case of Volkswagen) Technical work can aim to detect and mitigate AI sandbagging, but it's unclear what mechanisms should be used to dis-incentivise sandbagging, e.g., fines. In addition, it seems somewhat unclear which entity is legally responsible for sandbagging, for example, in the case in which a misaligned agent does so without the intent of the developers. Such cases may be cases of negligence, in which the developer did not undergo sufficient prior safety evaluations before submitting the model for external evaluation. In summary, there are a number of questions here which need to be clarified to inform policy surrounding evaluations and sandbagging.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>How can regulators address the problem of sandbagging in evaluations? How can they handle the issue of liability and responsibility?</p>\n<p>What tools exist in general, and which seem most applicable to AI?</p>\n<p>What can we learn from other industries?</p></blockquote>\n<h3>What you produce</h3>\n<p>The incentive design the questions ask for: the mechanisms that dis-incentivise sandbagging, the liability and responsibility question answered for the case the background names — a misaligned agent sandbagging without the developer's intent — and what the tools of other industries transfer to AI.</p>"
    },
    {
      "slug": "secret-compute-threshold",
      "source": "verification-capstones/secret-compute-threshold.md",
      "title": "How Much Hidden Compute Breaks the Deal?",
      "track": "Verification",
      "status": "draft",
      "summary": "How much concealed compute must a state retain before a pause agreement stops being worth signing? Three scenarios, priced for capability and strategic effect.",
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
      "deliverable": "Scenario analysis with a sensitivity table",
      "deliverableType": "analysis",
      "mentor": "recommended",
      "audience": "The delegation deciding how much verification is enough to sign.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "scenario analysis",
        "capability estimation",
        "strategic reasoning"
      ],
      "prerequisites": [
        "Verification 2.3 — the intelligence layer",
        "Verification 3 — covert development",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix D and §4",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix D, Locating and consolidating AI chips. Quoted:</p>\n<blockquote><p>One significant challenge is providing justified confidence that one Party is not doing a secret AI project with non-declared AI chips. Chip centralization provides some assurance, but it may not be sufficient if some country could purposefully undermine its own domestic centralization efforts. For further assurances against illegal AI projects, see the intelligence gathering and challenge inspections discussed in Article X.</p></blockquote>\n<p>The agreement's own floor for what must be monitored:</p>\n<blockquote><p>AI chip monitoring starts with discerning whether the chips are being used for inference on existing AIs or training of new AIs. The coalition works to develop tamper-resistant on-chip mechanisms for such purposes, as finer-grained control permits greater use of AI chips for safe applications, with fewer inspections. Initially inspectors are given ongoing physical access to chips, as is likely needed for robust chip-use verification [77, 78]. To ensure chip use verification is applied, the coalition prohibits large concentrations of chips (i.e., greater than 16 H100-equivalents; 16 H100s cost approximately $500,000 USD in 2025) outside of monitored facilities.</p></blockquote>\n<h3>What you produce</h3>\n<p>The line the quoted challenge asks for: a scenario analysis of how much concealed compute actually matters — under which assumptions about scale, aggregation and time — with the sensitivity table saying where concealment stops being strategically irrelevant and starts killing the agreement.</p>"
    },
    {
      "slug": "secret-datacenter-evidence",
      "source": "verification-capstones/secret-datacenter-evidence.md",
      "title": "When Does a Secret Datacenter Earn an Inspection?",
      "track": "Verification",
      "status": "draft",
      "summary": "Power draw, cooling, procurement, satellite imagery — when does a stack of maybes justify an inspection? Build the rubric that turns signals into a decision.",
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
      "deliverable": "Evidentiary rubric plus a decision memo",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "The agency that has to decide when suspicion becomes an inspection.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "evidence standards",
        "intelligence analysis",
        "escalation design"
      ],
      "prerequisites": [
        "Verification 2.3 — the intelligence layer",
        "Verification 3 — covert development"
      ],
      "sources": [
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix B.3",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix B.3, Acting on Ambiguous Findings. Quoted:</p>\n<blockquote><p>A Verifier might have ambiguous findings—evidence that is inconclusive about the Prover’s compliance. What should the Verifier do then? We highlight some increasingly escalatory options.</p>\n<p>Requests for clarification. Simple requests for clarification could resolve some issues. Studies of arms control have highlighted permanent consultative commissions as helpful in this regard.</p>\n<p>Focused investigation. Ambiguous findings could trigger a focused investigation of the specific organizations, facilities, activities, or employees whose compliance is ambiguous, at greater cost than would be practical for general verification. The Verifier could apply their verification methods with increased intensity to the suspicious area. The associated costs also incentivize the Prover to carry out their role carefully, to reduce the incidence of focused investigations. These intensified efforts would either reveal more clear evidence of non-compliance or fail to do so; in either case, the ambiguity would be at least partly resolved.</p>\n<p>More intrusive verification. If needed, the Verifier could escalate an investigation to include more intrusive verification methods than would normally be allowed. For example, the Verifier could (with the Prover’s cooperation) increase the amount of information that compliance tests output. Additionally, the Prover and Verifier could authorize an expanding set of humans (not just automated programs) to directly inspect the Prover’s declarations, beginning with the Prover’s most relevant employees (who may already have this access via whistleblower programs) (Appendix A.8) and potentially escalating to the Verifier directly inspecting Prover code, which would violate confidentiality-preservation.</p>\n<p>Precautionary pauses. As an emergency measure, in extreme cases the Verifier could demand some or all of the Prover’s AI compute clusters be turned off while a suspected violation is investigated, or take other actions to mitigate imminent risks. Such a pause would assure the Verifier that a violation using declared AI compute clusters is not ongoing, but it could come at a high economic cost.</p>\n<p>Partial penalties or threats. The enforcing parties could apply a penalty in part or with some probability, to deter a strategy of using multiple ambiguous violations to carry out a significant violation.</p></blockquote>\n<h3>What you produce</h3>\n<p>The evidentiary rubric this escalation ladder presupposes: what accumulated findings move a case from a clarification request to a focused investigation to an intrusive inspection, and a decision memo applying the rubric to one concrete scenario.</p>"
    },
    {
      "slug": "self-scoped-policy-memo",
      "source": "verification-capstones/self-scoped-policy-memo.md",
      "title": "Self-Scoped Policy Memo",
      "track": "AI Governance Policy",
      "status": "ready",
      "summary": "A two-page memo on a question you chose, addressed to a named decision-maker, using an artifact you built during the track as its evidence base.",
      "team": {
        "min": 1,
        "max": 1,
        "label": "1 person",
        "bucket": "Solo"
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
      "difficulty": "core",
      "deliverable": "Two-page policy memo, portfolio-formatted",
      "deliverableType": "memo",
      "mentor": "recommended",
      "audience": "One named person with one decision in front of them.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "memo craft",
        "audience analysis",
        "recommendation under uncertainty",
        "falsifier discipline"
      ],
      "prerequisites": [],
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Two pages. One question, scoped by you. One audience, named. One decision, specified. At least one artifact from earlier in the track carrying the evidentiary weight.</p>\n<p>The non-negotiable fields, pinned at the top before the prose:</p>\n<ul><li><strong>Audience.</strong> A role that exists, at an institution that exists, with the authority to do the thing you are recommending.</li><li><strong>Decision.</strong> The specific choice in front of them — not \"consider prioritising\", but the fork.</li><li><strong>Falsifier.</strong> What would show you wrong. Mandatory, in the memo, in the reader's eyeline.</li></ul>\n<p>This is the track's certificate assessment for async learners, and it is public by default.</p>\n<h3>Why it exists</h3>\n<p>The scaffolding fades on purpose. Weeks 1–3 hand over templates and worked examples; the middle weeks loosen; the capstone has no template. Choosing the question <em>is</em> the assessment — a well-executed memo on a question nobody needed answered is the failure mode this exists to expose.</p>\n<p>It also does double duty as an application artifact. Readers cannot verify invisible work: \"researched AI policy and organised discussions\" loses to a linkable memo every time.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> any governance question where you can name a real audience and a real decision, and where an artifact you already built supplies at least part of the evidence.</p>\n<p><strong>Out of scope:</strong> two pages means two pages. An appendix is allowed; a six-page memo with a two-page summary is not the genre and will be graded as if the first two pages were the whole submission.</p>\n<h3>What good looks like</h3>\n<ul><li>It survives the skim test. First sentences plus your bold lines, read alone, deliver the recommendation and its main support.</li><li>The path to impact has a mechanism. \"AI will be important\" with no causal chain is the single most common rejection reason in adjacent fellowship pipelines.</li><li>The falsifier is real. \"Unless the evidence changes\" is not a falsifier; \"if the 2027 procurement data shows uptake below X, this recommendation is wrong\" is.</li><li>The evidence base is <em>yours</em>. A memo that cites only other people's analysis has skipped the part the track was for.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Write the audience and decision lines before the question. Half of all scoping problems dissolve once a named person is in the room.</li><li>Pick the artifact you will lean on, and check it actually supports the claim you want to make. It often supports a narrower one — take the narrower one.</li><li>Draft the falsifier third. If you cannot write one, the recommendation is not yet specific enough to be useful.</li></ol>"
    },
    {
      "slug": "ship-to-a-live-project",
      "source": "verification-capstones/ship-to-a-live-project.md",
      "title": "Ship Something to a Live Project",
      "track": "Program-wide",
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
      "verificationFit": null,
      "courseFit": false,
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Every other capstone in this bank is graded by the program. This one is graded by a stranger who did not agree to teach you.</p>\n<p>The sequence:</p>\n<ol><li><strong>Find a project that is asking.</strong> The <a href=\"https://www.aisafety.com/projects\">aisafety.com projects directory</a> lists initiatives seeking volunteers. Pick one whose work you can already read.</li><li><strong>Agree the scope in writing.</strong> One message to the maintainer proposing a specific contribution, with what you will deliver and by when. Get a yes before you build. This step is the capstone; the rest is execution.</li><li><strong>Ship it.</strong> A documentation fix, a dataset addition, a test suite, a translated resource, a small feature, a research summary — whatever they said yes to.</li><li><strong>Take the review.</strong> Revise until it lands or the maintainer closes it.</li><li><strong>Write the note.</strong> Two pages: how you scoped it, what the review changed, what the maintainer cared about that you did not expect, and what you would propose next.</li></ol>\n<h3>Why it exists</h3>\n<p>Program work has a soft edge: the audience is hypothetical, the deadline is internal, and a mentor is invested in your success. Real contributions have none of that. A maintainer with no time will tell you plainly that your scope was too big, your patch touched too much, or your summary missed the point — and that feedback is worth more than a graded memo.</p>\n<p>It is also the shortest path from \"did a program\" to \"has done something in the field\", which is the distinction that gets read on an application.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one contribution, agreed in advance, small enough that a busy maintainer can review it in under an hour. Small and merged beats ambitious and abandoned.</p>\n<p><strong>Out of scope:</strong> unsolicited large contributions, and anything you start before the maintainer has said yes. Also out of scope: counting your own program work as the contribution.</p>\n<p><strong>This capstone can fail for reasons that are not your fault.</strong> Maintainers go quiet. Projects stall. That risk is why it is marked <em>concept</em> rather than <em>ready</em>, and why the mitigation is structural: contact <strong>three</strong> projects in week one, not one. If nobody responds by the end of week two, the note becomes the deliverable on its own — what you proposed, to whom, and what the silence suggests about how the field onboards volunteers. That is a legitimate and genuinely useful outcome, and it should be graded as one.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Scoping</td><td>\"Asked how I could help\"</td><td>A specific proposal with a deliverable and a date, agreed before work started</td></tr><tr><td>Size</td><td>A large patch touching many things</td><td>One thing, reviewable in under an hour</td></tr><tr><td>Review</td><td>Defended the original approach</td><td>Revised, and can say what the maintainer's standard was</td></tr><tr><td>The note</td><td>A diary</td><td>A transferable account of how this project decides what it wants</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Contact three projects on day one, with three different specific proposals. Generic offers to help are the most-ignored message maintainers receive.</li><li>Read their contribution guide and their last ten merged changes before proposing anything. Proposing something they already rejected is the fastest way to be ignored.</li><li>Halve your scope before you send it. Then halve it again if the project has fewer than five active contributors.</li></ol>"
    },
    {
      "slug": "stock-and-flow-accounting",
      "source": "verification-capstones/stock-and-flow-accounting.md",
      "title": "Stock and Flow Accounting Case Studies",
      "track": "Verification",
      "status": "draft",
      "summary": "Case studies of regimes that track dual-use physical objects — registration, transfer penalties, measured loss rates — as building blocks for compute stock-and-flow accounting.",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Two case studies on the source's own template — methods, penalties, and the measured loss rate",
      "deliverableType": "dossier",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "case studies",
        "regime analysis",
        "quantitative loss rates"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.1 — the hardware layer"
      ],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 65: stock and flow accounting case studies",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "compute-chain-of-custody",
          "title": "Steal a Chain of Custody From Another Industry"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 65, \"Stock and Flow Accounting Case Studies\". Quoted:</p>\n<blockquote><p>One likely building block for any maximally secure compute governance regime is stock and flow accounting of (some kinds of) compute: e.g., requiring real time accurate declaration to regulators of who possesses which uniquely numbered regulated chips, with penalties for undeclared or unauthorised transfers. To understand the optimal design and feasibility of such a regime, it would be useful to know more about historical analogies for similar regimes. An ideal analogy will have many of the following traits:</p>\n<p>The thing being tracked is a physical object</p>\n<p>The thing being tracked is economically important</p>\n<p>The thing being tracked is dual-use</p>\n<p>The tracking regime requires registration of current ownership and any transfers</p>\n<p>The tracking regime imposes penalties for failing to register ownership or transfer</p>\n<p>Case studies on stock-and-flow tracking for items that meet many of the above criteria would be very valuable. Such case studies should include:</p>\n<p>A description of the item being tracked, and the reason governments want to track it.</p>\n<p>Methods that governments use to track the items.</p>\n<p>Penalties for loss or misrepresentation of custody of the item.</p>\n<p>Effectiveness of the tracking regime (ideally with quantitative estimates of how much of the item is lost or illicitly transferred).</p>\n<p>Promising candidates might include:</p>\n<p>Firearms</p>\n<p>Automobiles</p>\n<p>Certain pharmaceutical products</p>\n<p>Aircraft</p>\n<p>Chemical weapons and precursors</p>\n<p>High-risk chemicals</p>\n<p>Select biodefense agents and toxins</p>\n<p>Less promising—but still plausible—candidates may include:</p>\n<p>ITAR-controlled items</p>\n<p>Real estate</p>\n<p>Financial instruments</p>\n<p>There are already good case studies on tracking nuclear fissile material, so it is not a promising area of additional research at the moment.</p></blockquote>\n<p>The idea's research question:</p>\n<blockquote><p>What can we learn from case studies on stock-and-flow tracking?</p></blockquote>\n<h3>What you produce</h3>\n<p>Case studies on exactly the template the idea specifies — the item and why it is tracked, the tracking methods, the penalties, and the regime's measured effectiveness — for candidates from the idea's own list, plus the concluding note the idea asks for: what the case studies imply for how such a regime could be designed for compute.</p>"
    },
    {
      "slug": "strict-liability-model-bill",
      "source": "verification-capstones/strict-liability-model-bill.md",
      "title": "A Model Strict-Liability Bill for One State",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "Strict liability for AI harms has been discussed since 2019, and no state has model language to adopt. Write the bill for one state, and the note on the other forty-nine.",
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
      "difficulty": "stretch",
      "deliverable": "Model bill text for one state plus a variance note on porting it",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The legislative counsel who would have to turn it into a filed bill.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "statutory drafting",
        "tort literacy",
        "comparative state law",
        "scoping a legal instrument"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 3: strict liability",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance\">Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025)</a>, the \"Strict Liability\" entry (orphan 3). Quoted:</p>\n<blockquote><p>Applying a less forgiving set of tort law to harms caused by AI has been discussed for several years; the Brookings Institute proposed using products liability law in 2019, and CAIP board member Gabriel Weil published a detailed analysis of several possible liability reforms in January 2024. California SB 1047 would have made some minor changes or clarifications to existing tort law, and a few other state legislatures have also considered modifications.</p>\n<p>However, this should ideally be a 50-state project. Specific language in every state should be available for legislatures to adopt, and we should also be filing impact litigation that would give judges a chance to incorporate strict liability for AI into the common law.</p></blockquote>\n<p>The entry's adoption suggestion:</p>\n<blockquote><p>You can help by writing a strict liability law for your state and by submitting comments or articles to a local law review journal arguing in favor of strict liability. Such laws are often more likely to pass (or be adopted by judges) when they have some academic support, but the support needs to be registered inside the legal community for it to be noticed.</p></blockquote>\n<h3>What you produce</h3>\n<p>The state law the entry asks for: model strict-liability text for one state, drafted so a legislature could adopt it, with the definition and incidence choices decided rather than deferred — and a variance note on porting the text to states with materially different tort regimes.</p>"
    },
    {
      "slug": "structured-access-minimum",
      "source": "verification-capstones/structured-access-minimum.md",
      "title": "The Minimum Standard for Researcher Access",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Structured access exists as a trend and not as a floor. Write the minimum acceptable standard — what a researcher must be able to do, and what the company keeps.",
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
      "deliverable": "Minimum access standard with a tiering scheme and the IP protections that make it signable",
      "deliverableType": "spec",
      "mentor": "optional",
      "audience": "The lab deciding what to offer, and the auditor deciding whether it is enough.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "access-regime design",
        "threat modelling",
        "negotiating competing interests",
        "standard drafting"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 11: structured access to research",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance\">Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025)</a>, the \"Structured Access to Research\" entry (orphan 11). Quoted:</p>\n<blockquote><p>Researchers need access to AI models in order to assess their safety, but corporations may be reluctant to share their source code for fear of losing a competitive advantage, and publicly sharing source code may be undesirable in any case because it may accelerate general AI capabilities research. To solve this problem, some companies are offering “structured access” to their models through an API.</p>\n<p>However, it is not clear that anyone is lobbying for this trend to continue or for other companies to adopt structured access plans. You can help by defining the minimum class of researchers who should have structured access, the minimum amount of access that they should have, and the maximum amount of usage restrictions or other requirements that companies can impose on such researchers. For example, a non-disparagement agreement would largely defeat the purpose of such access; if OpenAI can require that a researcher not say anything disapproving about its products as a condition of getting early access to its models, then the early review no longer serves as a reliable signal of whether the models are safe.</p>\n<p>Once we know more about what a reasonable structured access plan would look like, you can help by drafting an open letter that companies can sign to pledge that they will always provide this access, and then sending that letter to appropriate departments at AI developers and encouraging them to sign it.</p></blockquote>\n<h3>What you produce</h3>\n<p>The floor the entry asks you to define: the minimum class of researchers, the minimum amount of access, and the maximum usage restrictions a company can impose — written as a standard any instrument could adopt, with the non-disparagement trap the entry names designed out.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article V",
          "href": "https://arxiv.org/abs/2511.10783"
        },
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1.4",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can AI models be trained using a large number of small compute clusters?",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix A, Article V, Chip Consolidation. Quoted:</p>\n<blockquote><p>Unmonitored AI chips that are not part of a CCC (i.e., that have capacity less than 16 H100‑equivalents) may remain outside of CTB‑declared facilities, provided that such stockpiles are not aggregated or networked to meet the CCC definition, are not rotated among sites to defeat monitoring, and are not used for prohibited training. Parties will make reasonable efforts to monitor the sale and aggregation of AI chips to ensure that any newly created CCCs are detected and monitored and are not used for prohibited training.</p></blockquote>\n<p>And from <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, the verification subgoal this evasion attacks:</p>\n<blockquote><p>Verify that there are no undeclared uses of large-scale AI compute by (A) verifying that the use of known AI data centers is accounted for; and (B) verifying that no actor has hidden AI data centers or large, decentralized collections of AI chips that can be used for violations.</p></blockquote>\n<h3>What you produce</h3>\n<p>A feasibility assessment of the evasion the clause anticipates — aggregating, networking, or rotating sub-threshold stockpiles into a training run — and the threshold design that survives what you find.</p>"
    },
    {
      "slug": "supply-chain-logging-points",
      "source": "verification-capstones/supply-chain-logging-points.md",
      "title": "Where Should the Supply Chain Keep Logs?",
      "track": "Verification",
      "status": "draft",
      "summary": "Manufacturing logs are cheap to demand and easy to drown in. Find the point in the semiconductor chain where credible logs buy the most information for the least trust.",
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
      "deliverable": "Ranked chokepoint matrix",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "The regulator choosing where in the supply chain to demand records.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "supply-chain analysis",
        "comparative ranking",
        "measurement design"
      ],
      "prerequisites": [
        "Verification 1 — actors",
        "Verification 2.1 — the hardware layer"
      ],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VI",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix A, Article VI, AI Chip Production Monitoring. Quoted:</p>\n<blockquote><p>Monitoring of newly produced AI chips will include monitoring of production, sale, transfer, and installation. Monitoring of chip production will start with fabrication. The full set of activities includes fabrication of high-bandwidth memory (HBM), fabrication of logic chips, testing, packaging, and assembly [this set of activities would need to be specified in an Annex].</p></blockquote>\n<p>The notes on the article say where to begin:</p>\n<blockquote><p>When it comes to monitoring the AI chip supply chain, based on existing bottlenecks, a good start might be to monitor HBM production, logic die fabrication, and subsequent steps (e.g., packaging, testing, server assembly), along with key inputs such as EUV lithography machines.</p></blockquote>\n<h3>What you produce</h3>\n<p>The ranking the quoted start assumes: for each stage from HBM production to final assembly, how many firms sit there, what a unit of output even is, how hard the records are to fake, and how long a diversion stays invisible — as one ranked chokepoint matrix.</p>"
    },
    {
      "slug": "taig-tooling-gap",
      "source": "verification-capstones/taig-tooling-gap.md",
      "title": "Close One Gap in Technical AI Governance",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Take one open problem from the technical AI governance agenda and specify the tool that would close it — who builds it, who would have to adopt it, and what it costs to be wrong.",
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
      "deliverable": "Gap dossier — one open problem, one specified tool, an adoption path, and a failure analysis",
      "deliverableType": "dossier",
      "mentor": "recommended",
      "audience": "A funder deciding between building the tool and waiting for someone else to.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "problem decomposition",
        "technical specification",
        "adoption analysis",
        "cost estimation"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), §1: the problem, and the paper's invitation",
          "href": "https://arxiv.org/abs/2407.14981"
        },
        {
          "label": "Technical AI Governance project site — Stanford",
          "href": "https://taig.stanford.edu/"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2407.14981\">Open Problems in Technical AI Governance — Reuel et al. (2025)</a>, §1. Quoted:</p>\n<blockquote><p>However, key decision-makers seeking to govern AI often have insufficient information for identifying the need for intervention and assessing the efficacy of different governance options. Furthermore, the technical tools necessary for successfully implementing governance proposals are often lacking (Reuel et al. 2024a), leaving uncertainty regarding how policies are to be implemented.</p>\n<p>Addressing these and similar issues will require further targeted technical advances.</p></blockquote>\n<p>The paper's own hope for its problem list:</p>\n<blockquote><p>We hope that this paper serves as a resource and inspiration for technical researchers aiming to direct their expertise towards policy-relevant topics.</p></blockquote>\n<h3>What you produce</h3>\n<p>The dossier that answers the quoted problem for one open problem off the paper's list: the blocked decision restated with its actor named, the missing tool specified with the guarantee it does and does not give, the adoption path, and the failure analysis — one targeted technical advance argued concretely enough that a funder could decide to build it.</p>"
    },
    {
      "slug": "tamper-evidence-sufficiency",
      "source": "verification-capstones/tamper-evidence-sufficiency.md",
      "title": "When Is Tamper-Evidence Enough?",
      "track": "Verification",
      "status": "draft",
      "summary": "Tamper-proof hardware is expensive and unsolved; tamper-evident is neither. In which institutional settings is finding out afterwards actually sufficient?",
      "team": {
        "min": 1,
        "max": 2,
        "label": "1–2 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Decision framework",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "The regime designer deciding where prevention is worth its cost.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "institutional design",
        "inspection economics",
        "risk analysis"
      ],
      "prerequisites": [
        "Verification 2.1 — the hardware layer",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §4.1.1.1 and §4.2.1.1",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Section 4.1.1.1, Prerequisites: Hardware Security Features. Quoted:</p>\n<blockquote><p>The verification mechanisms we consider require a hardware security feature known as secure boot, which must be at least tamper-evident (i.e., impractical to discreetly disable or undermine). They would further benefit from Confidential Computing and tamper-proofing, though these are not required.</p>\n<p>Secure boot: Secure boot aims to guarantee that a chip will only run with approved system software (i.e., firmware and operating system). System software can constrain a chip’s behavior throughout operation, so secure boot could be used to ensure that a chip will always behave in ways that facilitate verification. Secure boot implementations are especially promising for this if they: (i) are at least tamper-evident, with regards to both physical and digital tampering (so, unless they are also tamper-proof, random inspections would be needed to check for tampering); and (ii) include a secure private key, allowing the system software to digitally sign messages.</p></blockquote>\n<p>The off-chip analysis leans on the same bargain:</p>\n<blockquote><p>Conversely, for Verifiers to be confident in the devices’ integrity, they could rely on measures such as Verifier-trusted supply chains, mutual vetting (similar to Provers’ vetting), tamper-evident enclosures (a random sample of which would be routinely inspected), and ideally tamper-proofing.</p></blockquote>\n<h3>What you produce</h3>\n<p>The decision framework the quoted design leaves implicit: under what inspection cadence, sampling rate and response time a mark found later is enough — and when nothing short of tamper-proofing will do.</p>"
    },
    {
      "slug": "telemetry-security-case",
      "source": "verification-capstones/telemetry-security-case.md",
      "title": "A Security Case for One Sensor",
      "track": "Verification",
      "status": "draft",
      "summary": "Power, temperature and timing telemetry cannot classify workloads reliably. Build the security case for using one sensor feed anyway.",
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
      "deliverable": "A verification security case for one telemetry mechanism",
      "deliverableType": "analysis",
      "mentor": "optional",
      "audience": "The verifier deciding whether a sensor feed is worth installing.",
      "verificationFit": null,
      "courseFit": true,
      "skills": [
        "security cases",
        "telemetry analysis",
        "adversarial reasoning"
      ],
      "prerequisites": [
        "Verification 2.0 — confidentiality vs verifiability",
        "Verification 2.1 — the hardware layer"
      ],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII",
          "href": "https://arxiv.org/abs/2511.10783"
        },
        {
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.6",
          "href": "https://arxiv.org/abs/2507.15916"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, the precedent discussion for Article VII, Chip Use Verification. Quoted:</p>\n<blockquote><p>Analogous perimeter monitoring of data centers can provide some clues about operations from power draw, thermal emissions, and network bandwidth. But reasonable assurance that restricted AI operations are not occurring would likely require some combination of the elements we listed under paragraph 1, which includes tamper-proof cameras, on-chip hardware-enabled mechanisms, and in-person inspectors.</p></blockquote>\n<p>And from <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix A.6, on why the signal is hard to read:</p>\n<blockquote><p>A core problem here is that there is no simple way to deduce an AI chip’s rate of computation, even with analog measurements. An AI chip’s utilization can vary from below 1% to around 90% depending on workload types, hardware, and implementations [169, 62]. Utilization also has a complex relationship to analog measurements, in part because of the distinction between “model FLOP utilization (MFU)” (which only counts unique operations) and “hardware FLOP utilization (HFU)” (which also counts recomputed operations).</p></blockquote>\n<h3>What you produce</h3>\n<p>A verification security case for one perimeter signal — power draw, thermal emissions, or network bandwidth — stated the way the quotes require: what the clue supports, under what decision procedure, rather than the classifier it cannot be.</p>"
    },
    {
      "slug": "three-directions-drill",
      "source": "verification-capstones/three-directions-drill.md",
      "title": "Three Directions off Someone Else's Agenda",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Fellowship interviews test live research-idea generation. Take a published technical-safety agenda you did not write and produce three directions, each with a first experiment and a falsifier.",
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
      "deliverable": "Three research directions, each with a first experiment, a falsifier, and why it is not already done",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "The interviewer who will ask you to do this out loud, with no preparation.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "research-idea generation",
        "reading an agenda critically",
        "experiment design",
        "falsifier discipline"
      ],
      "prerequisites": [],
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 9 is explicit about what fellowship admissions actually test: not credentials, but live research-idea generation — propose follow-up directions off a mentor's agenda, each with a first experiment and a falsifier. The policy track's week 9 runs the same drill in its own idiom. People fail it because they have never done it once with time to think.</p>\n<p>Do it once, with time to think, and keep the artifact.</p>\n<p>Pick a published technical-safety research agenda — control, mechanistic interpretability, developmental interpretability, emergent misalignment, anomaly detection, multi-agent security, agent foundations, whatever you would apply to. The menu, one agenda per line:</p>\n<ul><li><a href=\"https://www.lesswrong.com/posts/RRxhzshdpneyTzKfq/recent-redwood-research-project-proposals\">Recent Redwood Research project proposals (2025)</a></li><li><a href=\"https://www.lesswrong.com/posts/tG9LGHLzQezH3pvMs/recommendations-for-technical-ai-safety-research-directions\">Recommendations for technical AI safety research directions — Sam Marks (2025)</a></li><li><a href=\"https://www.lesswrong.com/posts/AcTEiu5wYDgrbmXow/open-problems-in-emergent-misalignment\">Open problems in emergent misalignment — Betley &amp; Tan (2025)</a></li><li><a href=\"https://www.lesswrong.com/posts/99gWh9jxeumcmuduw/concrete-empirical-research-projects-in-mechanistic-anomaly\">Concrete empirical research projects in mechanistic anomaly detection (2024)</a></li><li><a href=\"https://timaeus.co/projects\">Devinterp project ideas and starter notebooks — Timaeus</a></li><li><a href=\"https://arxiv.org/abs/2505.02077\">Open Challenges in Multi-Agent Security — Schroeder de Witt (2025)</a></li><li><a href=\"https://arxiv.org/abs/2402.07510\">Secret Collusion among AI Agents — Motwani et al.</a></li><li><a href=\"https://www.lesswrong.com/posts/MvfD4tmzyuCYFqB2f/open-problems-in-aixi-agent-foundations\">Open Problems in AIXI Agent Foundations — Cole Wyeth</a></li><li><a href=\"https://www.lesswrong.com/w/corrigibility-1\">Corrigibility — LessWrong wikitag, open problems section</a></li><li><a href=\"https://www.lesswrong.com/w/open-problems\">Open problems — LessWrong wikitag</a></li></ul>\n<p>Read it properly. Then produce three directions:</p>\n<p>For each of the three:</p>\n<ul><li><strong>The direction</strong>, in two sentences. What question, and why it follows from something the agenda actually says — quote the line.</li><li><strong>The first experiment.</strong> What you would run in week one. Concrete enough to start: model, data, comparison, what you would look at. Not a research programme; the first thing.</li><li><strong>The falsifier.</strong> The result that would tell you this direction is not worth continuing. This is the section that separates a candidate from an enthusiast.</li><li><strong>Why it is not already done.</strong> Either nobody has tried, or people have and it did not work. Find out which. Proposing something with three papers already on it is the most common way this drill is failed.</li></ul>\n<p>Then a short closing section: which of the three you would actually pick, and what you would need that you do not have.</p>\n<h3>Why it exists</h3>\n<p>This is the one capstone in the bank that is honest about being career infrastructure, and it is deliberately the cheapest one here.</p>\n<p>It also does something the rest of the bank cannot. This program teaches governance — compute, evals, verification, regulation. It does not teach control, interpretability or agent foundations, and it should not pretend to. But its learners will apply to programmes that work on exactly those things, and the skill being tested at that interview is <em>reading someone else's agenda and generating from it</em>, which is transferable across every one of them. So the technical agendas appear here as the raw material for a governance-program skill, rather than as content this program claims to have taught you.</p>\n<p>Read that constraint honestly: you are not expected to be an expert in the agenda you pick. You are expected to read it carefully enough to say something its authors would find reasonable, and to know what you do not know.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> any published research agenda in AI safety, its cited work, and enough of the surrounding literature to check whether your directions are novel.</p>\n<p><strong>Out of scope:</strong> running the experiments. Two weeks, three directions, no GPU budget.</p>\n<p><strong>Out of scope, deliberately:</strong> directions that require expertise you do not have and cannot acquire in a fortnight. A modest, checkable direction beats an ambitious one you cannot defend for five minutes under questioning.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The direction</td><td>A restated open problem</td><td>A follow-up that quotes the agenda line it comes from and goes one step past it</td></tr><tr><td>First experiment</td><td>\"Investigate empirically\"</td><td>Model, data, comparison, and what you would look at first</td></tr><tr><td>Falsifier</td><td>Absent or unfalsifiable</td><td>A result that would genuinely stop you, stated before you are attached</td></tr><tr><td>Novelty check</td><td>Assumed</td><td>Searched, with what you found — including \"this exists, here is what it left open\"</td></tr></tbody></table></div>\n<p>Three directions where one is a near-duplicate of published work — <em>and you say so</em> — is stronger than three you did not check.</p>\n<h3>Getting started</h3>\n<ol><li>Pick the agenda by where you would actually apply. The exercise is worth more when the artifact is reusable.</li><li>Generate ten directions badly before refining three. The first three ideas are everyone's first three ideas, which is exactly what the interview is screening out.</li><li>Do the novelty search before writing anything up. It kills at least half, and killing them in week one is free.</li></ol>"
    },
    {
      "slug": "threshold-decay-analysis",
      "source": "verification-capstones/threshold-decay-analysis.md",
      "title": "How Fast Does a Compute Threshold Decay?",
      "track": "Technical Governance",
      "status": "ready",
      "summary": "Quantify how quickly a fixed FLOP threshold loses selectivity under compute-efficiency trends, and propose an indexing rule that survives it.",
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
      "deliverable": "Reproducible notebook plus a two-page threshold-design memo",
      "deliverableType": "notebook",
      "mentor": "optional",
      "audience": "The regulator who has to pick a number and live with it for five years.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "quantitative analysis",
        "trend extrapolation",
        "threshold design",
        "reproducibility"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), §4",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Section 4, The Agreement. Quoted:</p>\n<blockquote><p>AI training runs above the Strict Threshold (i.e., 10^{24} FLOP) are prohibited. Training runs below this threshold but above the Monitored Threshold (i.e., 10^{22} FLOP) must be approved and monitored by coalition authorities. Training runs below the Monitored Threshold require no approval or monitoring.</p></blockquote>\n<p>The considerations that follow name the decay this project measures:</p>\n<blockquote><p>Due to improvements in AI algorithms and data, the capability of models trained at a given computational scale increases rapidly over time [68]. Due to likely progress in algorithms and data between today and when this agreement would come into effect, AIs trained at the Strict Threshold will be more capable—potentially much more—than the models trained at that scale today.</p></blockquote>\n<h3>What you produce</h3>\n<p>The measurement the quoted drift calls for: a reproducible notebook reconstructing which models crossed the EU and US statutory thresholds and when, the decay rate implied by published efficiency trends, and the two-page threshold-design memo those numbers justify.</p>"
    },
    {
      "slug": "tracking-agent-behaviour",
      "source": "verification-capstones/tracking-agent-behaviour.md",
      "title": "Tracking Sketchy AI Agent Behaviour in the Wild",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Systematically investigate deployed AI agents for signs of misalignment or scheming in the wild — logs, honeypots, power-user interviews, and public case studies of confirmed incidents.",
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
      "difficulty": "core",
      "deliverable": "Design sketch for an independent observatory of deployed-agent misbehaviour, with its first two workstreams and a case-study format",
      "deliverableType": "design",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "OSINT methods",
        "case-study writing",
        "program design"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Ten AI safety projects I'd like people to work on — Julian Hazell (2025), project 3: tracking sketchy AI agent behaviour in the wild",
          "href": "https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on"
        }
      ],
      "similar": [
        {
          "slug": "incident-detection-monitoring",
          "title": "Incident Detection and Monitoring at AI Companies"
        },
        {
          "slug": "incident-reporting-taxonomy",
          "title": "An Incident Taxonomy Labs Could Report Against"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on\">Ten AI safety projects I'd like people to work on — Julian Hazell (2025)</a>, project 3, \"Tracking sketchy AI agent behaviour “in the wild”\". Quoted:</p>\n<blockquote><p>What: Start an organization to systematically investigate deployed AI agents for signs of misalignment, scheming, or general sketchy behaviour in the wild. This could involve a number of possible activities: (1) partnering with AI companies to analyze anonymized interaction logs for concerning behaviour patterns, (2) creating honeypot environments to see if AI agents attempt to gain unauthorized access or resources, (3) interviewing power users of AI agents (e.g., companies) to gather preliminary signals of situations where agents might be doing sketchy things, and (4) writing about case studies of deployed agents acting sycophantic, manipulative, deceptive, etc.</p>\n<p>The organization could also publish detailed case studies of confirmed incidents and maintain a public database of problematic behaviours observed in deployed systems (though only ones relevant to misalignment, and not “AI harm” more broadly construed).</p>\n<p>Why this matters: For a long time, folks worried about misalignment mostly on the basis of theoretical arguments (and occasionally some lab experiments with questionable ecological validity). Things have changed: LLMs are starting to exhibit increasingly sophisticated and concerning behaviour, such as attempting to prevent their preferences from being changed, systematically gaming their evaluation tasks, and aiming for high scores rather than actually solving the problems at hand. We should go a step further and try hard to check if these concerns are actually manifesting in real-world deployments (and if so, in what ways and at what scale). Thoughtful, rigorous, and real-world observational evidence about misalignment would be valuable for grounding policy discussions and improving the world’s situational awareness about AI risk.</p>\n<p>What the first few months could look like: Picking 1-2 workstreams to start with, speaking with people working on relevant topics (e.g., at AI companies) to understand challenges/opportunities, and learning more about how other OSINT projects work (to understand analogies and disanalogies).</p></blockquote>\n<h3>What you produce</h3>\n<p>What the post's own \"first few months\" paragraph describes, on paper: the 1–2 workstreams you would start with and why, what the conversations with people at AI companies would need to establish, the OSINT analogies and disanalogies, and the format of the case studies and public database the organization would maintain.</p>"
    },
    {
      "slug": "training-vs-inference",
      "source": "verification-capstones/training-vs-inference.md",
      "title": "Understanding Training vs. Inference",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Training is a bet; inference is a continuous process. Draw the distinction clearly, communicate it to non-technical audiences, and note the regulatory implications.",
      "team": {
        "min": 1,
        "max": 1,
        "label": "1 person",
        "bucket": "Solo"
      },
      "effort": {
        "min": 8,
        "max": 12,
        "label": "8–12 hrs",
        "bucket": "Up to 14 hrs"
      },
      "duration": {
        "label": "2 weeks",
        "weeks": 2
      },
      "perWeek": "≈5 hrs/wk",
      "difficulty": "core",
      "deliverable": "A distillation note drawing the training/inference distinction for a non-technical reader, with the regulatory implications flagged",
      "deliverableType": "memo",
      "mentor": "optional",
      "audience": "",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "distillation",
        "technical communication"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 76: understanding training vs. inference",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "inference-compute-botec",
          "title": "BOTECs of Inference Compute Needs"
        },
        {
          "slug": "which-compute-target",
          "title": "Which Compute Are We Even Regulating?"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 76, \"Understanding Training vs. Inference\". Quoted:</p>\n<blockquote><p>There is a common misconception that “you need lots of compute for training, but once a model is trained, it’s over, and everyone can deploy it.” If the misunderstanding at the bottom of this is one that’s based on mixing up “training” and “inference”, then clearing up the distinction between the two could be a valuable use of a researcher’s time. Inference is a “continuous process”, it’s deploying a model, serving a product, providing a service, whereas training is “a bet”, building a product, etc. Down the line, this could help inform regulatory decisions on governing both training and deployment. It’s also important since if you own ML hardware you have to decide if you want to use it for training or inference. That decision became even more important over the recent months. Training a model means not serving inference for a product.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>How can we draw a clear distinction between training and inference? How can this difference be communicated well, including to non-technical audiences?</p>\n<p>What are the regulatory implications of this? (potentially out of scope)</p></blockquote>\n<h3>What you produce</h3>\n<p>Exactly what the idea's methodology names: a distillation. A short note that draws the distinction cleanly, communicates it to a non-technical reader, and flags the regulatory implications the idea marks as the optional extension.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Articles X–XI",
          "href": "https://arxiv.org/abs/2511.10783"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>The move this brief asks for is one the source performs on the page. From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, the precedent notes for Article XI, Dispute Resolution. Quoted:</p>\n<blockquote><p>Our Article XI Dispute Resolution procedures borrow from Articles IX, XII, and XIV of the Chemical Weapons Convention. Article IX of the CWC requires signatories to respond to requests for clarification “as soon as possible, but in any case not later than 10 days after the request.” Given how quickly digital developments can propagate, we chose a 5-day response deadline, but even this figure may need to be adjusted downward.</p>\n<p>Our paragraph 2 of this article is modeled after Article XIV of the CWC, which permits its Executive Council to “contribute to the settlement of a dispute by whatever means it deems appropriate, including offering its good offices, calling upon the States Parties to a dispute to start the settlement process of their choice and recommending a time-limit for any agreed procedure.” Parties are also encouraged to refer cases to the International Court of Justice as appropriate.</p></blockquote>\n<p>The same method carries the surveillance clauses:</p>\n<blockquote><p>Recognizing the indispensable role of national technical means (NTM — satellite imagery, signals collection, and other remote sensing) in verification of multilateral agreements, our draft agreement borrows language from the ABM treaty limiting anti-ballistic missile systems, in which “each Party shall use national technical means of verification” and “undertakes to not interfere with the national technical means of verification of the other Party.” Similar language can be found in Article XII of the 1987 Intermediate-Range Nuclear Forces Treaty, Article IV of the 1996 Comprehensive Nuclear-Test-Ban Treaty, and throughout the 2010 New START treaty.</p></blockquote>\n<h3>What you produce</h3>\n<p>The same move for a treaty of your choosing — New START, the CWC, the NPT safeguards system, Open Skies: its verification articles redrafted to govern frontier AI, with facing-page commentary naming what carried over, what had to change the way the quoted 10-day deadline became 5, and what has no analogue at all.</p>"
    },
    {
      "slug": "unlearning-durability-probe",
      "source": "verification-capstones/unlearning-durability-probe.md",
      "title": "Does the Capability Actually Go Away?",
      "track": "Technical Governance",
      "status": "concept",
      "summary": "Reproduce one published unlearning method on a small model, then try to bring the capability back — and report the relearning cost as the number that matters.",
      "team": {
        "min": 2,
        "max": 3,
        "label": "2–3 people",
        "bucket": "Pair or trio"
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
      "deliverable": "Reproducible notebook plus a two-page durability finding with the relearning cost",
      "deliverableType": "notebook",
      "mentor": "required",
      "audience": "Anyone who has cited unlearning as a safeguard in a release argument.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "empirical replication",
        "adversarial evaluation",
        "experiment design",
        "reporting negative results"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Open Problems in Machine Unlearning for AI Safety — Barez et al. (2025), on robustness to relearning",
          "href": "https://arxiv.org/abs/2501.04952"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2501.04952\">Open Problems in Machine Unlearning for AI Safety — Barez et al. (2025)</a>, on evaluating removal and its robustness. Quoted:</p>\n<blockquote><p>Simple metrics that check whether models can reproduce specific training examples fail to capture the deeper challenges of unlearning in safety-critical contexts. When models undergo modifications, face adversarial attacks, or encounter unusual inputs, unlearned capabilities can unexpectedly resurface - particularly in cases where the unlearning relied on fine-tuning or basic parameter adjustments (Hu et al. 2024; Łucki et al. 2024; Deeb and Roger 2024). This happens because these methods typically mask rather than eliminate capabilities, leaving the fundamental neural patterns that enable them largely untouched (Jain et al. 2023). More rigorous standards are helpful in addressing these limitations. This includes ensuring that forgotten knowledge cannot be recovered, does not reappear during extended interactions, and remains inaccessible even in new contexts or under adversarial pressure.</p></blockquote>\n<p>And on how current methods fare against exactly that standard:</p>\n<blockquote><p>Even when effective, unlearning can be surprisingly vulnerable to fine-tuning and could quickly relearn the hazardous knowledge (Lo et al. 2024; Lynch et al. 2024; Deeb and Roger 2024), even if fine-tuned on small amount of benign, unrelated data (Łucki et al. 2024; Hu et al. 2024). This suggests that existing techniques have a limited ability to thoroughly remove hazarous knowledge from LLMs. It also poses a significant challenge to the safety of open-source models or proprietary models that can be fine-tuned (Achiam et al. 2023). Some works have aimed to perform unlearning in a way that is more robust to post-deployment tampering (Deng et al. 2024; Henderson et al. 2023; Huang et al. 2024c; Rosati et al. 2024b; Rosati et al. 2024a; Tamirisa et al. 2024). However, these existing methods suffer from major tradeoffs with efficiency, stability, and performance on benign tasks. Establishing benchmarks and improving techniques for tamper-resistant unlearning is an ongoing challenge.</p></blockquote>\n<h3>What you produce</h3>\n<p>The probe those passages call for, run at small scale: one published method reproduced, a deliberate attempt to recover the removed capability — fine-tuning on a small amount of data included — and the relearning cost reported as the number a release memo can carry, with the tamper-resistance claim it does and does not support.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix B and Appendix C",
          "href": "https://arxiv.org/abs/2511.10783"
        },
        {
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 7",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2511.10783\">An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett &amp; Abeyta (2025)</a>, Appendix B, What can we do today? Quoted:</p>\n<blockquote><p>Establish AI hotlines between key actors in the U.S. and PRC government.</p></blockquote>\n<p>The staged implementation in Appendix C carries the same measure, and says what it is for:</p>\n<blockquote><p>These measures build confidence and transparency and reduce the risk of misunderstanding rapid AI developments as signs of imminent aggression.</p>\n<p>Establish secure communication channels between high-level AI and cybersecurity officials in the U.S. and PRC</p></blockquote>\n<h3>What you produce</h3>\n<p>The design the quoted measure leaves open: what counts as an incident, who picks up, the escalation ladder, and — the hard part the deliverable names — why a message on this channel should be believed by a party expecting deception.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), §6.3.1, prevention of model theft: cybersecurity for model weights, and defence against model inference attacks",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2407.14981\">Open Problems in Technical AI Governance — Reuel et al. (2025)</a>, §6.3.1, Prevention of Model Theft. Quoted:</p>\n<blockquote><p>Motivation: As models become more capable they could become an increasingly valuable target for theft by adversarial parties wanting to put them to their own potential (mis)use. Similarly, as state-of-the-art models become more broadly integrated into the economy and society, the attack surface will increase, potentially leading to a greater threat of exfiltration (Nevo et al. 2024). It follows that securing model weights, and other system components, might become an increasing priority to prevent theft or model access by unauthorized parties that may undermine governance initiatives aimed at ensuring customer safety and national security (Nevo et al. 2024).</p></blockquote>\n<p>Its open problems:</p>\n<blockquote><p>Ensuring adequate cybersecurity for model weights. Protecting model weights against exfiltration attempts requires protections against insider and outsider threats (Nevo et al. 2024). This includes standards for physical security of the data center facility itself, as well as of the hardware and software stacks (OpenAI 2024b).</p>\n<p>Improved coordination between actors facing similar threats might also assist defenders in understanding the threat landscape and better protecting their assets during training and deployment. Further analysis of potential threat vectors, as well as development of physical and cybersecurity measures including and beyond those in (Nevo et al. 2024), would help to identify and address these risks.</p>\n<p>Defending against model inference attacks. Alternatively, adversaries may try to extract or replicate models through attacks to a query API (Orekondy et al. 2018; Tramèr et al. 2016; Jagielski et al. 2020; Carlini et al. 2020; Carlini et al. 2024), logit values (Carlini et al.</p>\n<ol><li>or side-channel attacks (Wei et al. 2020). Further research could</li></ol>\n<p>aim to quantify threats and develop methods for defending against these, and other, forms of model extraction attacks.</p></blockquote>\n<h3>What you produce</h3>\n<p>The baseline the first open problem calls for: standards for the facility and the hardware and software stacks, worked into per-tier controls against insider and outsider threats, with the audit evidence for each control and its cost — the further analysis of threat vectors and protective measures the section says would help identify and address these risks.</p>"
    },
    {
      "slug": "which-compute-target",
      "source": "verification-capstones/which-compute-target.md",
      "title": "Which Compute Are We Even Regulating?",
      "track": "Technical Governance",
      "status": "draft",
      "summary": "Compute rules name a quantity without settling what is counted — training or inference, which operations, at what precision. Pick the definition and show what each alternative catches.",
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
      "deliverable": "Definition recommendation with a re-scored model set under three competing definitions",
      "deliverableType": "notebook",
      "mentor": "recommended",
      "audience": "The drafter who has to put one definition in a rule and live with it.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "regulatory definition design",
        "quantitative analysis",
        "sensitivity analysis",
        "technical writing"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 78: which compute? defining the regulatory target for compute governance",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [
        {
          "slug": "ops-threshold-adjustments",
          "title": "OP/s Threshold Adjustments for Performance"
        },
        {
          "slug": "training-vs-inference",
          "title": "Understanding Training vs. Inference"
        }
      ],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 78, \"Which Compute? Defining The Regulatory Target for Compute Governance\". Quoted:</p>\n<blockquote><p>Chips have become an integral aspect of modern society, with devices ranging from smartphones to home appliances relying on this technology. As a result, it has become ubiquitous, making it challenging to leverage it for numerous governance capacities. Targeting all the compute worldwide is neither feasible nor desirable. Such an approach would inevitably impact the majority of compute which is not of relevance for frontier AI activities, and would represent a significant invasion of privacy while also being overly blunt in its implementation. Therefore, there is a need for defining a (better? more appropriate?) regulatory target for compute governance.</p></blockquote>\n<p>The idea's research questions:</p>\n<blockquote><p>What is AI compute?</p>\n<p>Which parts of the computational infrastructure best regulate AI development and deployment while minimising the downsides?</p>\n<p>What should the regulatory target be?</p></blockquote>\n<h3>What you produce</h3>\n<p>The definition work the questions pose: what AI compute is, which parts of the computational infrastructure best regulate development and deployment while minimising the downsides, and the recommended regulatory target — with the same model set re-scored under competing definitions to show what each catches.</p>"
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
      "verificationFit": null,
      "courseFit": true,
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
          "label": "Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.8",
          "href": "https://arxiv.org/abs/2507.15916"
        },
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 20: AI and whistleblowing",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://arxiv.org/abs/2507.15916\">Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage &amp; Heim (2025)</a>, Appendix A.8, Whistleblower Programs. Quoted:</p>\n<blockquote><p>Background: Programs and laws that encourage employees to blow the whistle on violations are commonplace [142], contributing to approximately $2 billion or more in SEC fines in 2023. In the AI industry, large-scale AI projects tend to involve hundreds of employees (Table 9)—hundreds of individuals who might be able to report any large-scale violations to a Verifier. In addition to AI developers’ own employees, other organizations throughout the AI supply chain have employees who can blow the whistle on some violations, especially undeclared AI data centers. Employees could blow the whistle on a Prover’s (i) non-compliant AI activities, (ii) falsified declarations, or (iii) attempts to circumvent another verification mechanism (Table 14). Formal whistleblower programs could promote appropriate forms of whistleblowing by providing (would-be) whistleblowers with information they can check, disclosure protocols, and incentives (including intrinsic motivation, social norms, protection, and financial rewards). Provers may view formal whistleblower programs as legitimate, so Provers may be willing to take verifiable actions that facilitate whistleblowing (in contrast to espionage), such as allowing employees to privately talk with a Verifier.</p></blockquote>\n<p>The same appendix poses the channel-design problem itself:</p>\n<blockquote><p>Secure and confidential communication with potential whistleblowers. A Prover might try to not only retaliate against whistleblowers, but also entirely block or alter their messages. Standard approaches to secure internet communication (e.g., TLS, VPNs, and Tor) are not designed to secure the communications of parties who may be under video surveillance, or whose computers may be backdoored. Instead, a more secure option is for such employees to make in-person visits to a building physically secured by a Verifier. To prevent the Prover from detecting or blocking whistleblowers’ visits to these locations, the verification protocol could require the Prover to periodically send various relevant employees to visit the Verifier-secured building (e.g., as brief visits to an office near the Prover’s offices).</p></blockquote>\n<h3>What you produce</h3>\n<p>A channel design on the quote's own terms: who receives the report, the disclosure protocol and the protections that let an employee use it while surveilled, and the evidence standard applied to what arrives.</p>"
    },
    {
      "slug": "windfall-clause-draft",
      "source": "verification-capstones/windfall-clause-draft.md",
      "title": "Draft the Windfall Clause Nobody Has Drafted",
      "track": "AI Governance Policy",
      "status": "draft",
      "summary": "The windfall clause has been a proposal since 2020 and has never been written as contract language. Write it, for one named company's actual corporate form.",
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
      "difficulty": "stretch",
      "deliverable": "Model clause text plus a memo on the corporate form it has to survive",
      "deliverableType": "spec",
      "mentor": "recommended",
      "audience": "The general counsel who would have to take it to a board.",
      "verificationFit": null,
      "courseFit": false,
      "skills": [
        "contract drafting",
        "corporate governance",
        "commitment design",
        "incentive analysis"
      ],
      "prerequisites": [],
      "sources": [
        {
          "label": "Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 1: windfall profits clause",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-20",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance\">Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025)</a>, the \"Windfall Profits Clause\" entry (orphan 1). Quoted:</p>\n<blockquote><p>GovAI proposed in 2020 that AI firms should commit ahead of time to redistribute most of the profits of transformative AI from its inventor to the rest of humanity. Their paper includes a possible series of ‘tax brackets,’ which is a useful detail, but they do not include sample language showing how to add a windfall profits clause to a corporate charter or corporate bylaws.</p>\n<p>A windfall profits clause is an excellent idea, but to date, no one has drafted a sample windfall profits clause, let alone tried to persuade any particular corporation to adopt one. You can help by figuring out which corporate document(s) need to be amended, drafting an amendment that would have the appropriate effect, and then writing a letter to corporate social responsibility officers asking them whether they will pass that amendment, and, if not, why not.</p></blockquote>\n<h3>What you produce</h3>\n<p>The clause the entry says nobody has drafted, as operative corporate language: which corporate document is amended, the amendment itself, and the letter to corporate social responsibility officers the entry describes — with the memo on what adopting it would take for one real company's corporate form.</p>"
    }
  ]
};
