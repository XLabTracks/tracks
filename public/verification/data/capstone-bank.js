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
          "label": "A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)",
          "href": "https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 4's lesson is that a benchmark score measures the model under <em>your</em> elicitation. For agents the problem is worse in kind: the thing being measured is a model plus a scaffold plus a tool set plus an environment, and the same model swings enormously across those. A threshold attached to an agent benchmark is attached to a compound object nobody has decomposed.</p>\n<ul><li><strong>The task environment.</strong> Small, scriptable, deterministic where it can be — a file-and-shell sandbox, a mock API, a multi-step retrieval task. Success criteria that a script can check.</li><li><strong>The agent eval.</strong> Run it. Report success rate over enough episodes to have an interval rather than an anecdote.</li><li><strong>The ablation.</strong> The heart of it. Hold the model fixed and vary the scaffold: number of steps allowed, retry policy, tool set, whether the agent can see its own errors, memory across steps. Then hold the scaffold fixed and vary the model. Report both. If scaffold variation moves the score more than model variation, that is your headline finding and it is one policy readers need.</li><li><strong>The attribution note.</strong> Two pages: what your number is a property of, what it would take to make it a property of the model, and what a governance threshold should therefore be written against — a model, a model-and-scaffold pair, or a deployed system.</li><li><strong>Optional extension:</strong> two agents in the same environment. TAIG asks about networks of interacting agents separately, and even two is enough to show that the measurement problem changes shape again.</li></ul>\n<h3>Why it exists</h3>\n<p>Agent capability is where the next round of thresholds will be set, and the measurement practice is much less mature than the single-turn benchmark practice the track already teaches. Learners who have personally watched a score double because they allowed five more steps will read every agent benchmark claim differently afterwards.</p>\n<p>It also generalises the elicitation lesson into the form that matters for policy. \"Which of these numbers is a property of the model?\" is the question a regulator has to answer to write a rule, and almost nobody hands them the ablation that would let them.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> a small open model plus a cheap API model, an off-the-shelf agent framework, and a sandboxed task environment you build.</p>\n<p><strong>Out of scope:</strong> dangerous-capability agent tasks of any kind, and any environment with real credentials or network side-effects. Use a benign task — multi-step retrieval, file manipulation, a puzzle — because the methodology is the deliverable, not the capability.</p>\n<p><strong>Also out of scope:</strong> building a new agent framework. Pin an existing one and spend the time on the ablation.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Environment</td><td>Ad hoc prompts</td><td>Scriptable, deterministic where possible, with machine-checkable success</td></tr><tr><td>Ablation</td><td>One scaffold</td><td>Scaffold and model varied independently, with both effects quantified</td></tr><tr><td>Reporting</td><td>A success rate</td><td>An interval over episodes, with the episode count stated</td></tr><tr><td>Attribution</td><td>\"Agents are hard to evaluate\"</td><td>What the number is a property of, and what a threshold should attach to</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Build the environment and freeze it in week one. Teams that keep editing the task never accumulate enough episodes to have a number.</li><li>Run the step-limit ablation first. It is one line of config and it usually produces the largest effect in the whole study.</li><li>Decide the episode count from the variance you see in the first twenty runs, not from what feels tidy.</li></ol>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 2",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>\"We would coordinate on safety, but antitrust\" is one of the most-repeated lines in frontier AI, and one of the least tested. The orphan catalogue's complaint is procedural rather than legal: the proposal exists, nobody has drafted the letter, so nobody has ever been told no.</p>\n<p>Write the paperwork.</p>\n<ul><li><strong>The conduct.</strong> Precisely what the developers want to do together: agree a minimum evaluation standard, share an incident taxonomy, set a floor on pre-deployment testing. One or two things, described the way a lawyer would have to describe them — who meets, what is exchanged, what is agreed.</li><li><strong>The request letter.</strong> Addressed to the division that issues business review or advisory opinions, following the format that process actually uses. Facts, the competitive analysis, the assurance sought.</li><li><strong>The competitive analysis.</strong> Why this is not a cartel: what it does not cover (price, output, allocation, capability roadmaps), and the safeguards that keep it there.</li><li><strong>The anticipated response.</strong> Write the agency's likely reply, including its most awkward question. Then say what conduct your letter has cleared and what it explicitly has not.</li></ul>\n<h3>Why it exists</h3>\n<p>Most policy learners write documents addressed to nobody. This one has a real recipient, a real format, and a real process — and the exercise of writing to a form you did not design is most of the education. Governance work is substantially the craft of getting an existing process to do something.</p>\n<p>It also usefully deflates a talking point. Once you have written the request, you can say concretely how much of the \"antitrust problem\" is legal exposure and how much is a reason not to have the conversation.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published agency guidance and past business review letters in other industries, the standard-setting antitrust literature, and public statements by developers about why they do not coordinate.</p>\n<p><strong>Out of scope:</strong> actually submitting it, and jurisdictions beyond the one you pick. If you want the EU angle, that is a second memo.</p>\n<p><strong>You are not required to conclude that the waiver is a good idea.</strong> A strong submission may end with \"the letter is easy to write and would clear less than people think\" — that is a finding, and it is better evidenced than the talking point it replaces.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The conduct</td><td>\"Discuss safety standards\"</td><td>One or two specified activities, with what is exchanged and what is not</td></tr><tr><td>Format</td><td>A policy memo</td><td>Follows the agency's actual request format, with its required elements</td></tr><tr><td>Analysis</td><td>Asserts pro-competitive intent</td><td>Names the conduct that would still be unlawful and how the safeguards prevent it</td></tr><tr><td>Honesty</td><td>Concludes the problem is solved</td><td>States what remains uncleared, and whether that was the real blocker</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Read two real business review letters from any industry before drafting. The format teaches you what the agency wants to be told.</li><li>Narrow the conduct until it is boring. Ambitious coordination is what makes the request unanswerable.</li><li>Write the agency's hardest question in week one and let it shape the rest.</li></ol>"
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
        "Verification 2.x — the evidence layers"
      ],
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>Confidentiality versus verifiability is usually stated as a tension and left there. State it as a price list instead. For each level of confidence a verifier might want in a compliance claim, what does the operator have to disclose, and how deep does the mechanism reach into the facility?</p>\n<ul><li><strong>The mechanisms.</strong> Five, compared like for like: on-site inspections, network taps, sensor telemetry, trusted-hardware attestation, and randomized recomputation of declared work. Same compliance claim held fixed across all five.</li><li><strong>The three axes.</strong> Assurance: what confidence the mechanism can actually deliver against a motivated evader, not its brochure claim. Disclosure: which secrets it spends — weights, code, customer data, utilization patterns, facility layout. Intrusiveness: what running it does to operations, from nothing to inspectors on the floor.</li><li><strong>The dominated options.</strong> The matrix exists to expose them: mechanisms that cost more disclosure than an alternative for no more assurance. Finding two of those is worth more than scoring all five politely.</li><li><strong>The frontier.</strong> The combinations that remain when dominated options fall away — the actual menu a negotiation chooses from, and where on it the current proposals in the literature sit.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.0 introduces the tension and the cryptographic tools that promise to dissolve it; Modules 2.1–2.3 each carry mechanisms that spend secrets differently. What the track does not hand the learner is a single table where the exchange rates are visible side by side. This brief builds that table, and building it forces the honest version of every mechanism's assurance claim.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the five mechanisms as described in the public literature, one fixed compliance claim, and reasoned scoring with the reasoning shown.</p>\n<p><strong>Out of scope:</strong> inventing new cryptographic protocols, and vendor-level detail on any particular trusted-hardware product.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Comparability</td><td>Five essays</td><td>One claim, five mechanisms, three axes, same scale</td></tr><tr><td>Assurance</td><td>Brochure claims</td><td>Confidence against a motivated evader, argued per mechanism</td></tr><tr><td>Disclosure</td><td>\"Some data\"</td><td>The specific secrets spent, named per mechanism</td></tr><tr><td>The frontier</td><td>A tie</td><td>Dominated options called out, and the real menu drawn</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Fix the compliance claim first and keep it boring — \"no training runs above X in this facility\" serves better than anything clever.</li><li>Score disclosure by listing the secrets a hostile reader of the feed could extract, not the ones the mechanism nominally requests.</li><li>Look for dominance before polishing scores. The matrix's job is to collapse the menu, not to admire it.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 21, \"Implementation Details of the 'Best Practices' List\". Quoted:</p>\n<blockquote><p>Researchers from GovAI have previously surveyed leading experts from AGI labs, academia and civil society on best practices for those developing advanced AI systems. This has allowed researchers to collect a list of measures including risk assessments and evaluations that have buy-in from a wide range of actors across sectors, which should make them easier to embed into existing or forthcoming regulatory regimes. That said, the survey was focused mostly on what would be good ideas, and given the methodology, didn't go into depth as to how these approaches would be implemented in practice.</p>\n<p>Research question: How can the items identified in this survey be implemented? Methodology: policy analysis, strategy planning, stakeholder mapping, other. Further reading: \"Towards best practices in AGI safety and governance: A survey of expert opinion\".</p></blockquote>\n<h3>What you produce</h3>\n<p>The implementation depth the survey deliberately left out: for items from the surveyed list, how each would be implemented in practice, using the methodology the idea names — policy analysis, strategy planning, stakeholder mapping.</p>"
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
          "label": "Test scores of AI systems on various capabilities relative to human performance — Our World in Data",
          "href": "https://ourworldindata.org/grapher/test-scores-ai-capabilities-relative-human-performance"
        },
        {
          "label": "Dynabench: Rethinking Benchmarking in NLP — Kiela et al. (2021)",
          "href": "https://arxiv.org/abs/2104.14337"
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
      "updated": "2026-08-07",
      "html": "<h3>The brief</h3>\n<p>One chart does more work in AI-policy argument than almost any other: Our World in Data's <em>Test scores of AI systems on various capabilities relative to human performance</em>. Twelve capabilities — handwriting, speech and image recognition, reading comprehension, language understanding, predictive reasoning, code generation, complex reasoning, general knowledge, maths, nuanced language interpretation, and reading comprehension with unanswerable questions — each normalised so the system's first recorded score sits at −100 and human performance sits at zero. Lines climb, cross zero, and stop.</p>\n<p>It draws on Kiela et al.'s Dynabench data. Its span is <strong>1998–2023</strong> and Our World in Data last processed it on <strong>2 April 2024</strong>. Everything since is missing, and the missing part is the part people cite it about.</p>\n<p>Rebuild it. Three things come out:</p>\n<ul><li><strong>The dataset.</strong> A tidy, versioned table: capability, benchmark, system, date, raw score, human baseline, and a provenance column giving the source for every single row. No row without a citation.</li><li><strong>The chart.</strong> The same idea redrawn to today, reproducible from the table by a script anyone can re-run. Match the original's normalisation, or depart from it and say why in the methods note — either is a defensible answer, but only one of them can be silent.</li><li><strong>The two-page brief.</strong> What a capability threshold in an agreement could honestly be written against, given what you just found out about the measurements. This is the part a policy reader will actually use.</li></ul>\n<h3>Why it exists</h3>\n<p>The chart is a picture of benchmarks dying, and it is read as a picture of capability growing. Those are not the same claim, and the difference is load-bearing for anyone writing a rule.</p>\n<p>Three problems are waiting inside it, and finding them is most of the work:</p>\n<ul><li><strong>Saturation censors the series.</strong> A benchmark that gets beaten stops being run, so its line ends. The end of a line is a retirement, not a plateau. What an updated chart does at that moment — drop the series, splice a successor benchmark, or mark it retired — is the central methodological choice of this project, and there is no free answer.</li><li><strong>\"Human performance\" is twelve different things.</strong> Each zero line comes from a different baseline study with a different population, incentive and protocol: annotators paid per item, domain experts, a competition field. Normalising them all to zero makes them look commensurable when they are not.</li><li><strong>The floor moves too.</strong> Setting each capability's first score to −100 means the visual slope depends on when someone first bothered to measure. A capability nobody tested until late looks like it arrived fast.</li></ul>\n<p>For this course the payoff is direct. A pause agreement has to name what is covered. If the covered thing is a capability, somebody has to be able to measure it the same way twice — and a chart whose every line ends when the test gets too easy is evidence about how hard that is.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the twelve existing capability series, extended where a defensible continuation exists; a named set of post-2023 benchmarks you argue into the frame; and the provenance work to support both.</p>\n<p><strong>Out of scope:</strong> running any evaluation yourself. This is a data-provenance and presentation project, not an eval project — <em>From Eval Result to Policy Threshold</em> is the one that runs evals.</p>\n<p><strong>Also out of scope:</strong> building a new benchmark, and scraping leaderboards without provenance. A number whose source you cannot name does not go in the table, however much it would help the line.</p>\n<p><strong>Watch the scope creep here specifically:</strong> deciding which modern benchmarks belong is genuinely hard, and teams lose a week to it. Pick your candidates in the first session, write down why each one is in or out, and move on. Some will turn out to have no defensible human baseline at all — that is a finding to report, not a failure to fix.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Provenance</td><td>Numbers from leaderboards</td><td>Every row cites a source; contested rows flagged as contested</td></tr><tr><td>Human baselines</td><td>\"Human performance\" as one column</td><td>Each baseline's population, protocol and date stated, with the ones that do not exist named as missing</td></tr><tr><td>Saturation</td><td>Lines that just stop</td><td>An explicit, defended rule for retirement and succession, applied the same way to every series</td></tr><tr><td>Normalisation</td><td>The original's, copied without comment</td><td>The choice made deliberately, with what it flatters and what it hides both named</td></tr><tr><td>Reproducibility</td><td>A chart image</td><td>A script and a table that regenerate the chart from scratch</td></tr><tr><td>The brief</td><td>\"Capabilities are rising fast\"</td><td>What a threshold can attach to, what it cannot, and how fast the answer decays</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Pull the original data and reproduce the existing chart <em>before</em> changing anything. If you cannot reproduce 1998–2023, you cannot defend 2024 onward.</li><li>Take one series all the way to today before starting the second. The first one teaches you the retirement rule; doing all twelve in parallel means discovering it twelve times.</li><li>Write the provenance column as you go. Backfilling citations onto a finished table is the way this project fails.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The cloud layer is the one place in the stack where a commercial party already sits between the customer and the machines, already runs KYC for other reasons, and already has the telemetry. Module 2.2 rates it <em>very partially solved</em> — proxies, fragmented accounts, reseller chains and jurisdictional gaps eat most of the promise, and the standing warning is that self-reporting alone produces a paperwork regime.</p>\n<p>Write the reporting rules for one provider in one jurisdiction so that they are not that.</p>\n<ul><li><strong>The obligations.</strong> What the provider declares, about whom, how often, to which of the three levels — company, national regulator, intelligence — and under what penalty for misdeclaration.</li><li><strong>The checkability rating.</strong> The core of the deliverable. Per obligation: is the claim <em>self-reported only</em>, <em>cross-checkable against a second source</em>, or <em>independently observable</em>? Module 2.2 gives you the second column to work with — power draw, cooling, interconnect use, procurement, satellite-visible buildout — against the things that are easy to fake: identity, declared purpose, workload labels, logs.</li><li><strong>The evasion routes left open.</strong> Specifically proxy organisations, false reporting and sub-threshold distributed training. For each, what your rules would and would not catch.</li><li><strong>The cost.</strong> What compliance costs the provider, and what it costs the customers who are not doing anything wrong. A rule that pushes ordinary workloads offshore has made verification worse.</li><li><strong>The one rule you would keep.</strong> If the regulator could only have a single obligation, which one, and why that one buys the most.</li></ul>\n<h3>Why it exists</h3>\n<p>This is the track's central discipline applied to the layer where it is easiest to fool yourself. Cloud reporting <em>looks</em> like verification: there are forms, there are logs, there is a regulator receiving them. Module 2.2's warning is that the whole apparatus can be exactly as strong as the honesty of the party filling it in, unless some claim in it is anchored to something the party does not control.</p>\n<p>Finding that anchor — and being honest about how few of your obligations have one — is the skill. It is also the skill that transfers directly to the Module 4 capstone, where the same question gets asked of a whole regime.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one provider archetype and one jurisdiction, public reporting on cloud infrastructure and datacentre buildout, and the track's evasion taxonomy.</p>\n<p><strong>Out of scope:</strong> the international layer. You are writing a national reporting obligation, not a treaty; who else could see the reports is a Module 4 question.</p>\n<p><strong>Also out of scope:</strong> inventing telemetry. Work with what a provider plausibly has or could add cheaply. A rule requiring a capability nobody has built is a research agenda, not a regime — cite it as a successor rule and move on.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Obligations</td><td>A list of things to report</td><td>Each one tied to what a verifier would then be able to conclude</td></tr><tr><td>Checkability</td><td>Assumed</td><td>Rated per obligation, with the second source named where one exists</td></tr><tr><td>Evasion</td><td>\"Bad actors could evade\"</td><td>The three named routes, each with what your rules catch and miss</td></tr><tr><td>Cost</td><td>Ignored</td><td>Priced for the provider <em>and</em> the compliant customer, with the rule you would drop first</td></tr></tbody></table></div>\n<p>If every obligation in your spec comes out cross-checkable, you have been generous with yourself. Most reporting regimes are mostly self-reported, and saying so is the finding.</p>\n<h3>Getting started</h3>\n<ol><li>Build the fakeable / not-easily-fakeable table from Module 2.2 before drafting a single obligation. It determines which rules are worth writing.</li><li>Draft the proxy-organisation evasion first. It is the route that most cleanly defeats account-level KYC, and confronting it early stops you from writing a spec that only works against honest customers.</li><li>Ask the cost question of every obligation as you add it. The regime that survives is the short one.</li></ol>"
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
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), verification questions: what methods can verify compute usage without TEEs; can ZKPs demonstrate compliance without disclosing architectural details; how can TEEs be designed to limit misuse",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.0 sets out the layer that confirms a claim without surrendering the secret: hardware-anchored attestation, zero-knowledge proofs, secure multiparty computation — and, when none of those is ready, the institutional fallback of managed access. Pick one claim and work the whole stack against it.</p>\n<p>Choose a claim of the form <em>\"this training run used no more than X\"</em>, <em>\"this model was trained without dataset D\"</em>, or <em>\"the deployed model is the one that was evaluated\"</em>. Then:</p>\n<ul><li><strong>The three routes.</strong> Sketch how the claim could be established (a) with a trusted execution environment, (b) with a cryptographic protocol and no trusted hardware, (c) with managed access — a human inspector under confidentiality, which is what the chemical-weapons regime settled on when the cryptography did not exist.</li><li><strong>The trust assumptions.</strong> Per route, exactly who must be trusted and about what. TEEs move trust to the silicon vendor; a protocol moves it to an implementation and a setup; managed access moves it to an institution and a person. None of them removes trust, and saying where it went is the core of the deliverable.</li><li><strong>The residual disclosure.</strong> What the verifier learns beyond the claim. Every route leaks something — timing, size, the fact that a query was made — and a regime that promised zero disclosure and delivers some has a credibility problem, not a technical one.</li><li><strong>The misuse read.</strong> TAIG asks this directly: verification infrastructure built for compliance is surveillance infrastructure pointed somewhere else. Say what your route could be repurposed to do, and what constrains it.</li><li><strong>The verdict.</strong> Which route you would build now, which in five years, and what you would tell a regulator who asked for the assurance today.</li></ul>\n<h3>Why it exists</h3>\n<p>This is Module 2.0's question at full weight, and it is the hardest capstone in the Verification track — the only one marked advanced. The reason is that the tempting answers are all wrong in the same way: they relocate trust and describe that as removing it.</p>\n<p>It is also live. The claims above are exactly the ones frontier safety frameworks and draft regimes assume can be established, and the assumption is mostly unexamined.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the published literature on ZKPs for ML, TEEs on accelerators, proof-of-learning, secure multiparty computation, and arms-control managed access as the institutional comparison.</p>\n<p><strong>Out of scope:</strong> implementing anything, and novel cryptography. You are assessing feasibility and trust structure, not building a protocol. Cite the primitives; do not invent them.</p>\n<p><strong>A concrete warning.</strong> The literature here is fast-moving and full of results that hold under assumptions the governance use-case breaks — most obviously, schemes that assume an honest prover, when the whole point is that the prover is the party you are checking. Flag every such assumption where you find it.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The claim</td><td>\"Verify compliance\"</td><td>One claim, stated precisely enough to be provable or not</td></tr><tr><td>Trust</td><td>\"Trustless verification\"</td><td>Per route, who is trusted about what, stated plainly</td></tr><tr><td>Residual disclosure</td><td>Claimed to be zero</td><td>Named per route, including the metadata leaks</td></tr><tr><td>Verdict</td><td>Picks the most elegant route</td><td>Picks the one available now, and says what it costs in assurance</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the claim in one sentence and keep rewriting until it is falsifiable. Most of this literature's confusion is claims that were never pinned down.</li><li>Do the managed-access route first. It is the least glamorous and the only one that has ever actually run, and it calibrates the other two.</li><li>For every scheme you cite, find its threat model and check whether the prover is assumed honest. That single check reorders the whole assessment.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>Financial audit did not begin with fraud-proof bookkeeping; it began with a standard stating what an auditor checks, what records the client must keep, and what the opinion does and does not certify. Compute accounting has no such standard. Write the minimum viable one: what a commercial audit of an AI operator should prove about the use of every accelerator it controls.</p>\n<ul><li><strong>The claims.</strong> What the audit certifies, stated as checkable propositions — total accelerator-hours by cluster, workload attribution at an agreed granularity, no unrecorded capacity above a floor. What it deliberately does not certify goes in the same section.</li><li><strong>The records.</strong> Which logs the operator must keep for the claims to be auditable: schedulers, power, allocation, procurement. For each, the retention period and the tamper story — what stops backfilled history.</li><li><strong>The access.</strong> What the auditor may see and touch, on what notice, with what sampling rights. Access is where audit standards live or die; unlimited access is unnegotiable and useless.</li><li><strong>The failure clauses.</strong> What a missing log means, what an anomaly means, and when either escalates from a finding to a qualified opinion. An audit standard that cannot handle gaps certifies only tidy books.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.2's failure mode is the paperwork regime: self-reporting that audits nothing. The repair is not more reporting but a standard that says what checking means. Module 1's actor map supplies the missing profession — the audit firm — and this brief asks what its engagement letter would actually promise.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one operator archetype (a cloud region or a large private cluster), existing log types that real schedulers and facilities produce, and audit practice from other industries as structural reference.</p>\n<p><strong>Out of scope:</strong> new hardware mechanisms, cryptographic attestation schemes, and statutory authority. This is a standard a firm could pilot under contract today.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Claims</td><td>\"Compute was used properly\"</td><td>Propositions an auditor can check, plus the explicit not-certified list</td></tr><tr><td>Records</td><td>\"Keep logs\"</td><td>Named log types, retention periods, and a tamper story for each</td></tr><tr><td>Access</td><td>Unstated</td><td>Notice, scope and sampling rights a real operator could sign</td></tr><tr><td>Gaps</td><td>Fatal or ignored</td><td>Missing-log and anomaly clauses with defined escalation</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the not-certified list first. It is the most clarifying section and the one every draft standard forgets.</li><li>Inventory the logs a real scheduler already emits before inventing new ones — a standard built on records nobody keeps audits nobody.</li><li>Draft the missing-log clause early and test the whole standard against an operator who lost a month of history, innocently or otherwise.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Chip registries and supply-chain tracking sit in Module 2.1 as proposals. Other sectors have been doing custody accounting for decades, under adversarial pressure, with audits and penalties: nuclear material accountancy, controlled pharmaceuticals, conflict minerals, firearms, hazardous waste, precursor chemicals. Pick one and take it apart.</p>\n<ul><li><strong>The case study.</strong> How the regime actually works. What is the unit of account, who records a transfer, what triggers reconciliation, what happens when the books do not balance, and what the measured discrepancy rate is — every real regime has one, and it is the most useful number in your dossier.</li><li><strong>The failure history.</strong> How the regime has been defeated, and what it changed in response. Regimes are shaped by their scandals; the current design is unreadable without them.</li><li><strong>The transfer analysis.</strong> Feature by feature: what carries over to high-end AI accelerators and what does not. Compute has properties these regimes did not face — units that are useful individually rather than in bulk, a legitimate second-hand market, rapid obsolescence, a supply chain with a handful of upstream nodes and thousands of downstream ones, and the fact that the thing you ultimately care about is a workload, not an object.</li><li><strong>The recommendation.</strong> One mechanism worth importing, one worth explicitly rejecting, and the reason for each.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's method is to ask what each mechanism can actually prove. Custody accounting is the mechanism the compute-governance literature reaches for most casually and has studied least, and the sectors that do it have already found the failure modes — usually the boring ones, involving paperwork and reconciliation intervals rather than clever attacks.</p>\n<p>Analogical reasoning done properly is also a track-level skill: it is the same move as the treaty-clause capstone, where the disanalogies are the deliverable. An analogy whose limits you have mapped is a tool. One you have not is a way to be confidently wrong.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one custody regime, its public regulations, audit reports and academic evaluations, plus the compute supply-chain material from Module 1.</p>\n<p><strong>Out of scope:</strong> designing the compute regime itself. Your output is the input someone else's design needs. Also out of scope: surveying three regimes shallowly — one, to the point where you know its discrepancy rate, beats three summaries.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The case study</td><td>How the regime is supposed to work</td><td>How it works, including its measured discrepancy rate and reconciliation cadence</td></tr><tr><td>Failure history</td><td>Omitted</td><td>Named incidents and the design changes each produced</td></tr><tr><td>Transfer</td><td>\"Lessons apply broadly\"</td><td>Feature by feature, with the disanalogies given equal space</td></tr><tr><td>Recommendation</td><td>Everything is applicable</td><td>One import, one explicit rejection, both reasoned</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Choose the regime by how much public audit material exists, not by how apt the analogy feels. You need the discrepancy numbers.</li><li>Read the scandals before the regulations. They tell you which provisions are load-bearing.</li><li>Write the disanalogy list halfway through, and let it decide what is left worth writing up.</li></ol>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 8",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.1 tells you what the hardware layer can and cannot do today: chip identity is solved but not unbreakable, secure boot has an inverted threat model because the owner is the party you are trying to catch, and no production chip meters tamper-resistantly. The orphan catalogue says the same thing from the other end — the timing analysis exists, and <a href=\"https://arxiv.org/abs/2303.11341\">Shavit</a> even sketches an inspector headcount, but who employs those inspectors, what the penalties are, and who pays for the hardware innovations have never been costed.</p>\n<p>Do the costing.</p>\n<ul><li><strong>The regime you are pricing.</strong> One jurisdiction, one threshold, one class of facility. Declaration, on-site inspection, remote telemetry, or some mix — pick, because they cost wildly different amounts.</li><li><strong>Headcount and cadence.</strong> How many inspectors, with what skills, visiting how often, to cover how many facilities. Anchor against a real inspectorate in another domain and say where the anchor is wrong.</li><li><strong>The penalty schedule.</strong> What misdeclaration costs, scaled so that compliance is cheaper than the expected value of cheating. Show that arithmetic; it is the part everyone skips.</li><li><strong>Hardware dependencies.</strong> Which parts of your regime need capability that does not exist in shipping silicon. Separate what works today from what needs a hardware generation, and put a date on the second column.</li><li><strong>The bill.</strong> One number, with its three biggest line items and the assumption that moves it most.</li></ul>\n<h3>Why it exists</h3>\n<p>Verification proposals are usually priced in feasibility adjectives — \"challenging\", \"achievable in principle\". Budget offices do not fund adjectives. Converting a mechanism into headcount, cadence and a penalty schedule is what makes the difference between a paper and a programme, and it tends to reveal that the binding constraint is people rather than physics.</p>\n<p>It also feeds Module 4 directly. The sequencing question — what works for an MVP three-month pause versus what needs years of institution-building — cannot be answered without something like this number.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public compute-monitoring literature, published inspectorate budgets and staffing from analogous regimes, public datacentre and chip market data.</p>\n<p><strong>Out of scope:</strong> classified or proprietary cost data, and precision. This is order-of-magnitude work with the assumptions exposed; a confident single figure with no sensitivity is worse than a range.</p>\n<p><strong>Do not price the ideal regime.</strong> Price the one you would actually recommend starting with, and note what the full version would add.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Scope</td><td>\"A compute monitoring regime\"</td><td>One jurisdiction, one threshold, one facility class, stated up front</td></tr><tr><td>Staffing</td><td>A headcount</td><td>Anchored to a real inspectorate, with the disanalogy named</td></tr><tr><td>Penalties</td><td>\"Substantial fines\"</td><td>A schedule, with the compliance-versus-cheating arithmetic shown</td></tr><tr><td>Dependencies</td><td>Mechanisms listed as available</td><td>Split into shipping-today and needs-a-hardware-generation, with dates</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Find a real inspectorate's published budget and staffing in week one. It is your anchor and it will reshape the whole estimate.</li><li>Do the penalty arithmetic before the headcount. If cheating pays, the inspectors are decoration.</li><li>Keep a visible assumptions register from the first estimate. It is the part a reader will actually argue with, and that is the point.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 74, \"Compute Production Gap, Data Centers and Data Asymmetry in China\". Quoted:</p>\n<blockquote><p>For a variety of strategic questions, the question of who is leading in AI and by how much is crucial, and compute is a central input to this. Therefore, work that estimates the gap between the U.S. and China could inform the strategy of actors across sectors. Similarly, mapping and rating Chinese competitiveness in the realm of data centres could be insightful.</p>\n<p>Research questions: When would indigenous Chinese compute manufacturing capabilities equal US + allies' 2024 indigenous compute manufacturing capabilities? When would they equal US + allies' future capabilities — in what year would they equalize? What events would change your expectations significantly — e.g. the probability that China invents some \"flip the board\" chip manufacturing technology that circumvents key external supply chain bottlenecks (e.g., EUV), or changes in US regulation with respect to the compute supply chain? What are the biggest data centers in China? Are there patterns to where and how China builds state of the art data centers? (This is relevant to international monitoring &amp; verification schemes.) How capable is Chinese endogenous ability to build and operate state of the art data centers? How much aggregate compute does China have across all data centers? What are the biggest computations run in or across Chinese datacenters? How would you characterize the organization of the datacenter / HPC industries? […] Methodology: data analysis, forecasting, quantitative modelling, literature review, expert interviews.</p></blockquote>\n<h3>What you produce</h3>\n<p>The forecast and the map the research questions ask for: the equalization estimate with the events that would move it, and the datacenter landscape reading — which the idea itself notes is relevant to international monitoring and verification schemes.</p>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 8's exercise has you run a watermark detector and measure how it fares under paraphrasing. This capstone takes that measurement and turns it into the document a legislature needs, because \"AI content must be labelled\" is now in draft law in several places and the technical basis for it is thinner than the drafting implies.</p>\n<ul><li><strong>The robustness curve.</strong> Take one published scheme and measure detection as the content is put through ordinary handling: paraphrase, translate and translate back, truncate, mix with human text, re-generate a passage, apply a format conversion. Report where detection falls to chance. Include the <em>innocent</em> transformations — a lot of provenance signal dies to a copy-paste through a word processor, with no adversary involved.</li><li><strong>The three layers, separated.</strong> Output watermarking (a signal in the content), metadata provenance (a signed manifest travelling alongside), and post-hoc detection (a classifier guessing). They fail differently, and a policy that conflates them will mandate the weakest one.</li><li><strong>The two error costs.</strong> A false positive accuses a person of using AI. A false negative lets synthetic content pass. State which your measurements favour, and what threshold a regime would have to pick.</li><li><strong>The open-weights hole.</strong> A watermark a developer applies at inference is absent from a model whose weights anyone can run. Say what that does to any obligation aimed at content rather than at platforms.</li><li><strong>The options memo.</strong> Three obligations a regulator could impose — on model providers, on platforms, on distributors — ranked by what your measurements say each would actually achieve, with the one you would not impose named.</li></ul>\n<h3>Why it exists</h3>\n<p>Content provenance is the AI policy area where the gap between what the law assumes and what the technology does is widest and easiest to demonstrate. A learner who has personally watched detection collapse under a round-trip translation will never again write a sentence that treats watermarking as solved — and can show a legislator the same curve in thirty seconds.</p>\n<p>The transferable skill is the one the track exists for: producing the measurement yourself and then writing the policy document that is honest about it, rather than citing someone else's summary of either.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one published watermarking scheme with available code, a small open model or an API, and public provenance standards for the metadata layer.</p>\n<p><strong>Out of scope:</strong> designing a new watermarking scheme, and building an adversarial removal tool beyond the ordinary transformations above. The point is that ordinary handling is enough; you do not need to build an attack.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Measurement</td><td>\"Watermarks are fragile\"</td><td>A curve, with the transformation and the point where detection reaches chance</td></tr><tr><td>Layers</td><td>Treated as one thing</td><td>Three mechanisms separated, with their distinct failure modes</td></tr><tr><td>Errors</td><td>Accuracy reported</td><td>Both error costs stated, with who bears each</td></tr><tr><td>Options</td><td>\"Watermarking should be required\"</td><td>Three obligations ranked by measured achievable effect, and one rejected</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Run the innocent transformations before the adversarial ones. If a copy through a word processor kills the signal, the adversarial section is almost beside the point.</li><li>Separate the three layers on day one. Most of the public confusion in this area is layer confusion.</li><li>Write the options memo for a reader who has already been told this is solved. That framing produces a much sharper document.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>A disabled cooling system is one of the most inspectable claims a facility can make: the plant is large, loud, and hard to hide. The question is what the inspection actually proves. Under what conditions does a verified cooling shutdown rule out a large training run — and under what conditions does it merely rule out the most convenient way of running one?</p>\n<ul><li><strong>The facility.</strong> Pick one typical datacenter design and hold it fixed: its cooling plant, its racks, its power envelope. The analysis is about a concrete building, not datacenters in general.</li><li><strong>The causal chain.</strong> Write out the chain from \"cooling disabled\" to \"training impossible\": heat produced per rack at training load, what removes it, what fails when nothing does, and how fast. Every link is a claim an operator could attack.</li><li><strong>The bypasses.</strong> Work the evasions seriously: backup cooling brought online, mobile cooling units rolled in, running at partial load to stay inside the thermal envelope, and workloads moved to rooms the inspection never saw.</li><li><strong>The countermeasures.</strong> For each bypass, what an inspector would have to check to close it — and what that adds to the cost and intrusiveness of the visit.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.1 is honest that most hardware mechanisms are proposals rather than deployed capability. Cooling is the counterexample worth stress-testing: a physical system that already exists, already meters, and cannot be patched in software. If inspection of physical plant cannot carry a shutdown claim, the cheap end of the hardware layer is emptier than it looks; if it can, the conditions under which it works are worth writing down precisely.</p>\n<p>The bypass list is Module 3 practice on a single mechanism: every evasion here is a small instance of repurposed infrastructure or false reporting.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one typical facility design, public engineering knowledge about datacenter cooling and power, and thermal reasoning you can defend at the level of orders of magnitude.</p>\n<p><strong>Out of scope:</strong> any real facility's specifics, and precision thermal modelling. Where a link in the chain rests on an estimate, say so in place — the table is only as good as its honesty about which cells are firm.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The claim</td><td>\"No cooling means no training\"</td><td>A causal chain with each link stated and attackable</td></tr><tr><td>Evasions</td><td>A list of ideas</td><td>Each bypass costed: equipment, time, and what it sacrifices</td></tr><tr><td>Countermeasures</td><td>\"Inspect more\"</td><td>What check closes each bypass, and what the check costs</td></tr><tr><td>Honesty</td><td>Uniform confidence</td><td>Firm cells separated from estimated ones</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the causal chain first, before any evasion. You cannot attack a claim you have not stated.</li><li>Order the bypasses by cost to the operator, cheapest first. The cheap ones are the ones the design has to survive.</li><li>For one bypass, write the inspector's counter-check in full. It sets the template for the rest of the table.</li></ol>"
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
          "label": "Evals projects I'd like to see, and a call to apply to OP's evals RFP — cb (2025)",
          "href": "https://forum.effectivealtruism.org/posts/LTbwRuQhBRGxMyqcq/x-6"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 5 has you write mock testimony from a provided eval log: what the score justifies, what it does not, and what testing regime would change that. This capstone adds the half that actually decides whether testimony holds — someone who does not want your conclusion gets to attack it.</p>\n<p>Three documents, in order:</p>\n<ul><li><strong>The testimony.</strong> Five minutes spoken, on one eval result. The claim, the basis, the limits, the ask. Written for people who will not read a footnote.</li><li><strong>The cross-examination.</strong> Written by a partner, or by you a week later with the brief of a hostile counsel: every place the claim outruns the evidence. Elicitation. Contamination. The gap between the tested model and the deployed one. Who ran it and what they were paid. What the score would be under a different scaffold. Whether \"below threshold\" means anything if the threshold moved.</li><li><strong>The revised testimony.</strong> What you can still say once each of those has landed — plus the one sentence you had to delete, quoted, with why.</li></ul>\n<h3>Why it exists</h3>\n<p>The track already teaches that an eval score is elicitation-dependent. That lesson stays theoretical until you have written a sentence you believed, watched someone dismantle it in two questions, and had to decide whether anything survives.</p>\n<p>Testimony is also the format where governance work most often fails in public. A memo that overclaims gets a sceptical reader. Testimony that overclaims gets a transcript, and the transcript is what the other side quotes for the next three years. Learning where the line is costs nothing here.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> provided eval logs from the technical track, or any published eval result with a documented methodology. Public frontier-safety frameworks for the threshold context.</p>\n<p><strong>Out of scope:</strong> running the eval. This is the policy tier — the number is an input, and interrogating an input you did not produce is the whole skill.</p>\n<p><strong>The cross-examiner must be adversarial, not helpful.</strong> A partner who wants you to do well writes soft questions and teaches nothing. Brief them explicitly: the job is to make the witness concede.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The claim</td><td>\"The model is safe on this axis\"</td><td>A bounded claim naming the model, the elicitation, and the population it generalises to</td></tr><tr><td>Cross-examination</td><td>Three polite clarifications</td><td>Questions that force a concession, including one you had no good answer to</td></tr><tr><td>Revision</td><td>Hedged everywhere</td><td>Narrower and still useful, with the deleted sentence shown</td></tr><tr><td>The ask</td><td>\"More research is needed\"</td><td>Something the committee can actually do, sized to what the evidence supports</td></tr></tbody></table></div>\n<p>The submission that earns most credit contains a question you could not answer and says so, rather than inventing an answer after the fact.</p>\n<h3>Getting started</h3>\n<ol><li>Write the testimony before reading anything about the eval's limitations. You want your honest first draft, not a pre-hedged one — the gap between the two is the lesson.</li><li>Have the cross-examiner work from the log, not from your testimony. They should find things you did not mention.</li><li>Do the revision in one sitting, immediately after. The instinct to defend fades fast, and what you write once it has faded is closer to true.</li></ol>"
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
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can large training runs be detected while retaining developer privacy, e.g. through signatures in processor utilisation?",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.0 names the central tension: verification is inherently intrusive, and the mechanisms worth having are the ones that confirm a claim without handing over the secret. This is the cheapest version of that problem. A verifier who may not see weights, data or code — but may see how the machines behaved — wants to know whether a large training run happened.</p>\n<ul><li><strong>The signature.</strong> What distinguishes a long training run from inference at scale, from scientific computing, from rendering. Candidates: sustained utilisation over weeks rather than hours, the interconnect pattern of synchronous gradient exchange, memory-bandwidth profile, checkpoint-shaped I/O bursts at regular intervals, power draw that is flat rather than diurnal, and the restart-from-checkpoint discontinuities every real run has.</li><li><strong>What the verifier is allowed to see.</strong> Be precise, because it is the whole exercise. Aggregate utilisation? Per-node? Power at the meter? Network counters? Each level is a different privacy bargain and a different detection rate.</li><li><strong>The confusion matrix.</strong> For your best signal set: what else looks like this, and what a false accusation costs. Module 2.2 already warns that self-reporting alone is a paperwork regime — a detector with a bad false positive rate is the opposite failure, and just as useless.</li><li><strong>The spoofing cost.</strong> Per signal, what it costs the operator to look like something else: throttling to break the utilisation profile, padding with fake inference, splitting the run. Compare that cost against what the run is worth. That comparison is the finding.</li></ul>\n<h3>Why it exists</h3>\n<p>Almost every verification regime in the track eventually needs an answer to \"and what if they just do not tell us?\" The hardware and cloud layers answer it with observation, and the quality of the answer is entirely about what a signature can carry.</p>\n<p>It is also where the track's privacy strand becomes concrete. Learners easily say \"privacy-preserving verification\"; far fewer can say what a verifier would actually be shown, and less is usually enough than people assume.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published work on compute monitoring and workload characterisation, public datacentre power and utilisation reporting, and any small-scale measurement you can run yourself on a rented GPU.</p>\n<p><strong>Out of scope:</strong> building a detector at scale, and access to real cluster telemetry. This is analysis with an honest evidence base — where a claim rests on a plausible mechanism rather than a measurement, say so in place.</p>\n<p><strong>Also out of scope:</strong> designing the legal authority to collect the telemetry. Assume the verifier is entitled to what you specify, and be conservative about what you specify.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Signals</td><td>\"Unusual compute usage\"</td><td>Named observables with a mechanism, ranked by how hard each is to fake</td></tr><tr><td>Access level</td><td>Unstated</td><td>Exactly what the verifier sees, and the detection rate at each level</td></tr><tr><td>False positives</td><td>Ignored</td><td>The confusable workloads named, and the cost of accusing one</td></tr><tr><td>Spoofing</td><td>\"Evasion is possible\"</td><td>Priced per signal, against the value of the run being hidden</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the list of confusable workloads before the list of signals. It stops you designing a detector for a world with one kind of computation in it.</li><li>Pick the least intrusive access level that still works. Starting from full telemetry and cutting back never converges.</li><li>Cost the spoof for your best signal in week two. If it is cheap, that signal is decoration and you have two weeks to find a better one.</li></ol>"
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
        "Verification 2.x — the evidence layers",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>Most of the verification literature assumes time: new silicon, new institutions, new treaties. Suppose instead the decision lands now and the deadline is twelve months, with the hardware fleet as it is. What do you actually deploy? Assemble the package from what exists — physical measures on facilities, cameras, network controls, inspection teams, intelligence collection — and be exact about what it cannot see.</p>\n<ul><li><strong>The inventory.</strong> Candidate measures that need no new chips: seals and physical disconnection, camera coverage of machine rooms, network-level controls at facility boundaries, declared-facility inspections on a schedule, and the intelligence layer run against undeclared sites.</li><li><strong>The triage.</strong> For each measure: deployment time, cost, who must cooperate, and what class of violation it actually catches. Twelve months is a budget — spending it is the design decision.</li><li><strong>The sequencing.</strong> What ships in month one, what needs the full year, and which measures only work once another is in place. A roadmap, not a wish list.</li><li><strong>The residual gaps.</strong> The violations the package does not catch, stated as plainly as the ones it does. The gaps section is what makes the roadmap honest — and it is the requirements list for year two.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 4.1 asks the sequencing question directly: what works for an MVP emergency pause versus what needs years of institution-building. This brief is that question taken literally, with the evidence layers of Module 2 as the parts bin. The discipline it trains — feasibility triage under a deadline, with gaps stated rather than papered over — is the difference between a regime design and a regime sketch.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> measures deployable against existing hardware and facilities within twelve months, and honest reasoning about institutional lead times — hiring inspectors takes months too.</p>\n<p><strong>Out of scope:</strong> new hardware mechanisms, treaty negotiation timelines, and any assumption that a measure exists because a paper proposed it. If it cannot be bought, built or staffed inside the year, it belongs in the gaps section.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Inventory</td><td>Everything ever proposed</td><td>Only what deploys in twelve months, with the lead time argued</td></tr><tr><td>Triage</td><td>A feature list</td><td>Time, cost, cooperation and coverage per measure, comparable</td></tr><tr><td>Sequencing</td><td>A pile</td><td>Month-by-month, with dependencies between measures explicit</td></tr><tr><td>Gaps</td><td>A caveat sentence</td><td>The uncaught violations enumerated, feeding a year-two requirements list</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Start from the violation classes, not the measures — the package exists to catch things, and the gaps section is built from whatever the chosen measures miss.</li><li>Put an institutional lead time on every measure before comparing any two. Cameras arrive in weeks; inspectorates do not.</li><li>Write the residual-gaps section at the end of week two, not the end of the project — it will reorder your priorities while there is still time to act on it.</li></ol>"
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
        "Verification 2.x — the evidence layers",
        "Verification 4.1 — feasibility and layering",
        "TG week 3 — running evals"
      ],
      "sources": [
        {
          "label": "Request for Proposals: Improving Capability Evaluations — Coefficient Giving, formerly Open Philanthropy (2025, closed)",
          "href": "https://coefficientgiving.org/funds/navigating-transformative-ai/request-for-proposals-improving-capability-evaluations/"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Almost every frontier safety framework in existence rests on evals the developer runs on itself. Almost every verification regime being proposed would inherit that. Write the spec that closes the gap for <strong>one</strong> eval.</p>\n<p>The spec names:</p>\n<ul><li><strong>The claim.</strong> One eval, one threshold, one sentence: \"model M scores below T on eval E under elicitation X.\"</li><li><strong>The attack list.</strong> How the claim could be false while the lab tells no outright lie — weakened elicitation, a checkpoint that is not the deployed one, item leakage into training, a scaffold quietly capped, selective reporting across runs, a threshold chosen after seeing results.</li><li><strong>The observation chain.</strong> For each attack, what a third party would have to observe to rule it out. Be specific about artifacts: logs, hashes, seeds, weights access, an independent re-run, a live witnessed run, an escrowed held-out set.</li><li><strong>Residual trust.</strong> After all of it, what the third party is still simply taking the lab's word for. There is always something. Name it.</li><li><strong>Cost.</strong> What providing this chain costs the lab in engineering time, compute, and exposed IP — because a regime nobody can afford to comply with is not a regime.</li></ul>\n<h3>Why it exists</h3>\n<p>The track spends its length on verifying things between states — compute, facilities, treaties. This is the same problem shrunk to a single number, and it is the one that is live right now: regulators are already being handed self-reported eval results and have no settled way to price their credibility.</p>\n<p>It is also the cleanest exercise in the track's central discipline. Every mechanism you add has to answer \"what does the reader believe after this that they did not believe before?\" — and here you can check your answer against a concrete artifact rather than a diplomatic hypothetical.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one published eval or one you specify, existing attestation building blocks (hashing, logging, third-party re-runs, held-out sets, hardware attestation where it exists), and the track's layering framework.</p>\n<p><strong>Out of scope:</strong> inventing cryptography, and a general framework for all evals. One eval, one threshold. The general version is a paper, not a capstone.</p>\n<p><strong>Do not assume weights access.</strong> A spec that works only when the third party gets the weights has answered an easier question than the one regulators face. If you want to use it, you must price it and offer a fallback.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Attacks</td><td>\"The lab could cheat\"</td><td>Six named routes, each of which is technically consistent with an honest-sounding report</td></tr><tr><td>Chain</td><td>\"An independent auditor verifies\"</td><td>Per attack, the specific artifact, who holds it, and when it must be produced</td></tr><tr><td>Residual trust</td><td>Claimed to be zero</td><td>Stated plainly, with what it would take to shrink it further</td></tr><tr><td>Cost</td><td>Ignored</td><td>Estimated per requirement, with the one you would drop first if the lab pushed back</td></tr></tbody></table></div>\n<p>The single best test of a submission: hand it to someone and ask them to cheat past it. If they cannot find a route in ten minutes, the attack list was probably written by an optimist.</p>\n<h3>Getting started</h3>\n<ol><li>Write the attack list before the observation chain. Building the chain first produces a spec that defends against the attacks you happened to think of while designing it.</li><li>Pick an eval with a published methodology. You cannot attest to a procedure nobody has written down, and discovering that is itself a finding.</li><li>Cost every requirement as you add it, in the same table. Costing at the end always produces a chain nobody would adopt.</li></ol>"
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
          "label": "A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)",
          "href": "https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Open one of the public evals backlogs, choose a single problem, and then do the thing the backlog cannot do for you: cut it down until it fits three weeks and one or two people. Ship the cut-down version, not the ambition.</p>\n<p>You hand in three things:</p>\n<ul><li><strong>The eval spec.</strong> The capability or propensity being measured, in one sentence a non-technical reader can repeat. The item format. The scoring rule. The elicitation you commit to <em>before</em> you look at results — prompt, scaffold, sampling, number of attempts. The decision the eval is meant to inform.</li><li><strong>The pilot.</strong> Thirty items, run, scored, logged. Thirty is not a compromise; it is the number that separates \"this measures something\" from \"this measures nothing\" while leaving you time to notice.</li><li><strong>The scoping post-mortem.</strong> What you cut and why, what the pilot changed about your spec, and your answer to: <em>should anyone build the full version?</em> A defensible \"no\" is a pass.</li></ul>\n<h3>Why it exists</h3>\n<p>Every backlog in the field is a list of things nobody has had time to scope. The listed problem is the easy half. The hard half is deciding what counts as an instance of it, what the model is allowed to be given, and what result would move anyone. That is judgement, and it is the judgement evals hiring actually screens for.</p>\n<p>It also inoculates you against the failure that makes most first evals worthless: an eval built at full scale on an unexamined operationalisation, where the number at the end measures the scaffold rather than the model.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> an existing model API or open weights, a small hand-built or adapted item set, and any elicitation you can run yourself.</p>\n<p><strong>Out of scope:</strong> a new benchmark at publication scale, fine-tuning, and human-subject data collection. If your design needs a hundred hours of expert labelling, you have chosen the wrong problem — say so in the post-mortem and pick again in week one, not week three.</p>\n<p><strong>The elicitation gap is a scope boundary, not a footnote.</strong> You are measuring what the model does under <em>your</em> elicitation. Say so everywhere you state a number.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Operationalisation</td><td>\"Measures deception\"</td><td>One sentence naming the behaviour, the observable, and what would falsely trigger it</td></tr><tr><td>Pre-registration</td><td>Elicitation described after the fact</td><td>Spec written and timestamped before the run; deviations listed</td></tr><tr><td>The null</td><td>Buried or unmentioned</td><td>A flat result reported as a finding, with what it rules out</td></tr><tr><td>Scoping</td><td>Full version described as future work</td><td>An explicit build / don't-build recommendation with a reason</td></tr></tbody></table></div>\n<p>The strongest submissions contain a sentence like \"I thought this measured X; the pilot showed it measures Y, so here is the revised spec.\"</p>\n<h3>Getting started</h3>\n<ol><li>Read fifteen items off the backlog and pick the one whose <em>result</em> you can already imagine someone arguing about. Contested is scopeable; vague is not.</li><li>Write the scoring rule before writing a single item. If you cannot score it, you cannot measure it.</li><li>Hand-build five items and run them on day one. Nearly every fatal design problem is visible at five items, and it costs you an afternoon rather than a fortnight.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>\"The model scored 34% on the benchmark; the threshold is 40%; we are clear.\" That sentence appears in real documents and it hides at least four sources of variation. Work out what would have to be true for it to be sound.</p>\n<ul><li><strong>The error budget.</strong> Enumerate what moves the number: item sampling, model sampling at temperature, prompt and few-shot variation, scaffold choice, grader disagreement where a human or a model scores. Estimate each. Some will be much larger than the gap the claim depends on.</li><li><strong>The test.</strong> What comparison is actually being made — a point estimate against a fixed line, which is not a hypothesis test at all — and what it should be. Which null, which direction, and the asymmetry that matters here: in a safety threshold, a false \"below\" is much more costly than a false \"above\", and conventional practice is calibrated for the opposite.</li><li><strong>The re-analysis.</strong> Take one published claim of the form above and redo it with an interval attached. State whether the claim survives.</li><li><strong>The reporting recommendation.</strong> What an eval report should carry so that a reader can do this themselves: n, sampling parameters, per-item results, seeds, grader agreement.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 4 shows learners empirically that scores move under prompt and few-shot variation. The natural next question is what to do about it, and the field's own research agendas flag the statistical treatment as open.</p>\n<p>The transferable value is bluntly practical. Almost nobody entering governance work can look at an eval table and say what the error bar should be, and the absence is load-bearing — thresholds are written, and defended, on numbers whose uncertainty nobody has stated.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one published eval claim with enough methodological detail to re-analyse, a small open model or cheap API for your own variance measurements, and the statistics literature on benchmark evaluation.</p>\n<p><strong>Out of scope:</strong> novel statistical methodology, and a general framework for all evals. One claim, done properly, with the method written so it can be reused.</p>\n<p><strong>If the published claim lacks the detail to re-analyse, that is the finding.</strong> Report what would have been needed. It is a more useful result than a reconstructed interval built on guesses, and it makes the reporting recommendation concrete.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Error budget</td><td>\"Results vary\"</td><td>Each source estimated, with the largest identified</td></tr><tr><td>The test</td><td>Applies a t-test and moves on</td><td>Says what comparison is being made, and treats the asymmetric cost explicitly</td></tr><tr><td>Re-analysis</td><td>Recomputes the mean</td><td>An interval, and a clear statement of whether the original claim survives</td></tr><tr><td>Recommendation</td><td>\"Report more detail\"</td><td>The specific fields, justified by which one your analysis needed and lacked</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Measure one source of variation yourself in week one — prompt rephrasing is cheapest. A real number from your own run anchors the whole error budget.</li><li>Write down the decision the threshold governs before choosing a test. The cost asymmetry is the thing that makes this different from ordinary benchmarking.</li><li>Pick the published claim for its methods section, not its fame.</li></ol>"
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
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025): how can we scalably evaluate thousands of models?",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Governance treats an open-weight release as one object. The ecosystem does not: within months a popular base model has thousands of public descendants — fine-tunes, merges, quantisations, distillations, uncensored variants. Nobody is going to evaluate all of them. The question is what a monitoring body should do instead.</p>\n<ul><li><strong>The population.</strong> Characterise the real derivative set for one base model from public hub metadata: how many, of what kinds, how they cluster, how download counts distribute. This is desk work and it reshapes the problem — attention almost always concentrates in a tiny fraction.</li><li><strong>The triage.</strong> Your scheme for deciding what gets looked at. Candidate signals: reach, whether the modification targets safety behaviour, declared purpose, lineage from an already-flagged model, cheap automated probes. Ordered, with a stated budget: <em>n</em> models evaluated per month.</li><li><strong>The cheap screen.</strong> One or two probes cheap enough to run on everything — a handful of prompts, a refusal-rate measurement — that decide who gets the expensive eval. Report its false-negative rate against your deep evaluations, because a screen that misses is worse than no screen if it creates confidence.</li><li><strong>The pilot.</strong> Run the whole thing on a real population at small scale. Report cost per model at each stage and what the triage caught that a random sample would have missed.</li><li><strong>The blind spots.</strong> What this scheme structurally cannot see: private fine-tunes, models distributed outside public hubs, and derivatives whose modification is invisible to your screen.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 8 covers the irreversibility of open release and fine-tuning attacks on safeguards. Both lessons are usually taught about <em>a</em> model. The governance object is the ecosystem, and monitoring an ecosystem on a fixed budget is a different discipline — sampling, triage and cheap screens rather than depth.</p>\n<p>It is also one of the few genuinely open problems in this bank where a learner can produce a real partial answer in three weeks, because the population data is public and the pilot can be small.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public model-hub metadata, one base model's derivative population, small open models, and cheap automated probes.</p>\n<p><strong>Out of scope:</strong> evaluating dangerous capabilities in depth, and any probe that would itself produce misuse material. Use a benign behavioural proxy — refusal-rate drift on a safe prompt set is enough to demonstrate the method.</p>\n<p><strong>The budget constraint is the exercise.</strong> A triage scheme that assumes you can evaluate everything has not been designed.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Population</td><td>\"There are many derivatives\"</td><td>Counted and characterised from real metadata, with the attention distribution shown</td></tr><tr><td>Triage</td><td>A priority list</td><td>An ordered scheme with a stated monthly budget and what falls outside it</td></tr><tr><td>Screen</td><td>Described</td><td>Run, with its false-negative rate measured against the deep evaluations</td></tr><tr><td>Blind spots</td><td>Unmentioned</td><td>Named, with what the scheme's output should therefore not be taken to mean</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Pull the population metadata in week one. The shape of the distribution decides your whole design and it takes an afternoon.</li><li>Build the cheap screen before the triage. Knowing what a five-cent probe can tell you determines which signals are worth ranking on.</li><li>Compare your triage against a random sample of the same size. If it does not beat random, the signals were wrong and you have time to change them.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>An evaluation report is a claim about one artifact. A deployment is a different artifact in a different place, serving traffic through layers of serving infrastructure, quantization, and routine updates. The gap between the two is where an assurance regime quietly stops meaning anything. Design the chain that closes it.</p>\n<ul><li><strong>The identity claim.</strong> What \"the same model\" means, precisely: same weights, same quantization, same system prompt, same sampling settings, same surrounding scaffolding? Each choice changes what the chain must carry and what a violation even is.</li><li><strong>The chain.</strong> From the evaluated artifact to the serving fleet: hashes, signatures, attestation, logged deployments. Name every component the auditor must trust and what happens at each handoff.</li><li><strong>The substitutions.</strong> The attack tree: a different checkpoint behind the same endpoint, a re-quantized variant, per-route model selection, silent updates between audits, an eval-only configuration. For each, whether your chain catches it, and at what cost.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.0 frames verification as confirming a claim without handing over the secret; this is that problem at deployment scale, and it is the join on which any eval-based regime hangs. A rule that binds behaviour to an evaluation is only as strong as the argument that the evaluated thing and the deployed thing are the same thing.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one deployment architecture held fixed, standard integrity mechanisms — hashing, signing, attestation, logging — and the institutional question of who checks what, when.</p>\n<p><strong>Out of scope:</strong> designing the evaluation itself, and behavioural fingerprinting research. The chain here is about custody, not about re-testing in production.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Identity</td><td>\"Same model\"</td><td>A definition that decides the hard cases: quantization, prompts, scaffolds</td></tr><tr><td>The chain</td><td>Boxes and arrows</td><td>Every trusted component named, with what its failure forfeits</td></tr><tr><td>Attacks</td><td>A worry list</td><td>A tree with each substitution costed and mapped to the check that catches it</td></tr><tr><td>Residue</td><td>Implied completeness</td><td>The substitutions the chain does not catch, stated plainly</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the identity claim first and test it against quantization. If your definition cannot decide that case, the chain has nothing to carry.</li><li>Draw the chain with a column for \"who trusts whom here\" — the protocol is the trust structure, not the arrows.</li><li>Spend the last week on the attack tree, and keep the attacks that survive: they are the finding, not a flaw in it.</li></ol>"
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
        "Verification 2.x — the evidence layers",
        "Verification 3 — covert development",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025)",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 3 lists eight evasion scenarios and rates each on feasibility, detectability, longevity and who could fix it. One of them is different in kind: weight exfiltration does not cheat the compute regime, it makes the compute regime irrelevant. Training already happened. The artifact is a file.</p>\n<p>Write the annex a verification regime needs for the day after.</p>\n<ul><li><strong>The trigger.</strong> What observation tells the parties this has happened at all — and how long that takes. Be honest: this is often the weakest link in the whole annex, and naming the detection lag is half the deliverable.</li><li><strong>What survives.</strong> Which of Module 2's layers still tells you anything once the weights are loose. Hardware and cloud were watching <em>training</em>. Say plainly what each layer can and cannot see about a model that is now being run by someone who never signed anything.</li><li><strong>What replaces it.</strong> Ecosystem-level observation — where the file propagates, who serves it, who fine-tunes it, what shows up downstream — and what each of those costs in cooperation from parties who may not be party to the agreement.</li><li><strong>The claim you can still make.</strong> One sentence a verifier could stand behind afterwards, and the sentence they can no longer say. That contrast is the annex's point.</li><li><strong>The ex-ante clause.</strong> Working backwards: what the agreement should have required <em>before</em> this happened — custody obligations, security standards, declaration of holdings, reporting of a suspected breach — and what each would have cost the parties to accept.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's spine is the compute regime: chokepoints, thresholds, metering, attestation. It is a good spine, and Module 3 is where you learn that a good spine can be stepped around rather than broken. Weight exfiltration is the purest case, and it is the one that most exposes the difference between verifying a <em>process</em> and verifying a <em>state of the world</em>.</p>\n<p>It also connects the track to the fastest-moving open literature. The open-weight risk-management work catalogues problems across training data, training, evaluation, deployment and ecosystem monitoring — and the last of those is precisely the layer a verification regime has to fall back on here. Most of it is unsolved, which is why this capstone produces an annex with honest holes rather than a fix.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one agreement (reuse the one from your Module 4 capstone if you did it), one exfiltration scenario, Module 2's layers, and public literature on open-weight and post-release monitoring.</p>\n<p><strong>Out of scope:</strong> the security engineering of preventing exfiltration. That is a real field and a different capstone. You are picking up after it failed.</p>\n<p><strong>Also out of scope:</strong> arguing about whether open release is good. The scenario here is an unauthorised leak from a party under an agreement, which is a different question from a deliberate publication decision — the open-weight literature speaks to the second, and importing its answers unexamined is the most common way this annex goes wrong.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Detection</td><td>\"The breach would be discovered\"</td><td>A named observable, who holds it, and an honest estimate of the lag</td></tr><tr><td>Layer analysis</td><td>\"Verification becomes harder\"</td><td>Per layer, what it still sees and what it never saw, stated separately</td></tr><tr><td>Fallback</td><td>\"Monitor the ecosystem\"</td><td>Named observation points, and the cooperation each one requires from a non-party</td></tr><tr><td>The retired claim</td><td>Absent</td><td>The specific sentence the regime can no longer say, written out</td></tr></tbody></table></div>\n<p>The best annexes end up recommending something the parties would hate, and say why they should accept it anyway.</p>\n<h3>Getting started</h3>\n<ol><li>Start with the detection lag. Everything downstream is conditioned on how late you find out, and most drafts assume an implausibly fast trigger.</li><li>Do the four-layer pass as a table before writing prose. It is the fastest way to discover how much of the regime was watching training only.</li><li>Write the ex-ante clause last, then check it against the cost question. A clause the parties would never have signed is not a finding, it is a wish.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 4 covers export controls and their enforcement, including smuggling. The open question underneath the whole policy is quantitative: how much gets through? Nobody has published a defensible bound, which means the debate is conducted entirely in anecdotes — a seizure here, a shell company there.</p>\n<p>Build the estimate.</p>\n<ul><li><strong>The routes.</strong> Transshipment through third countries, shell purchasers, cloud access as a substitute for possession, second-hand and grey markets, smuggled units in small consignments, and rented capacity abroad. Each is a different measurement problem.</li><li><strong>The evidence, triangulated.</strong> Trade statistics and their mirror-data discrepancies, enforcement actions, corporate disclosures, datacentre buildout reporting, job postings, and public claims from the destination side. Every source here is either self-interested or partial; say which for each.</li><li><strong>The bound.</strong> A range, not a number, with the reasoning visible and the input that moves it most identified. State clearly what your estimate covers — units? capacity? capacity actually usable for frontier training? — because those differ by an order of magnitude and are routinely conflated.</li><li><strong>The enforcement recommendation.</strong> Given the estimate, where should a small investigative capacity be pointed, and what would tell you within a year whether it worked.</li></ul>\n<h3>Why it exists</h3>\n<p>This is the track's hardest estimation problem and its most honest one. Every source is adversarial or incomplete, and the correct output is a range with loud caveats rather than a headline figure. Learners who can produce that — and resist the pull toward a citable number — have the single most transferable skill in open-source policy analysis.</p>\n<p>It also has a real audience. Enforcement capacity is small and allocated on intuition; an estimate with a stated method is immediately more useful than the anecdote it replaces, even when the range is wide.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public trade data, enforcement announcements, corporate filings, market analysis, and open reporting on datacentre construction.</p>\n<p><strong>Out of scope:</strong> classified sources, and naming specific companies as smugglers on circumstantial evidence. Route analysis is fine; accusation is not, and a capstone that gets that wrong is worse than one that is late.</p>\n<p><strong>Also out of scope:</strong> a point estimate. If your write-up has a single headline number and no range, it will be quoted without its caveats — assume it will, and write accordingly.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Routes</td><td>\"Smuggling occurs\"</td><td>Routes separated, each with its own measurement approach</td></tr><tr><td>Sources</td><td>Cites reporting</td><td>Each source's bias named, and at least one claim triangulated across three</td></tr><tr><td>The bound</td><td>A number</td><td>A range, with the sensitivity driver named and the unit of account stated</td></tr><tr><td>Recommendation</td><td>\"Strengthen enforcement\"</td><td>Where to point limited capacity, and the one-year test of whether it worked</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Fix the unit of account in the first session — units, nominal capacity, or frontier-usable capacity. Almost every confused analysis of this question changes unit halfway through.</li><li>Start from mirror-data discrepancies in trade statistics. It is the one source that is not downstream of somebody's press release.</li><li>Write the caveat paragraph before the estimate, and keep it at the top.</li></ol>"
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
          "label": "Blueprints for AI Safety conferences (FBB #9) — The Field Building Blog (2025)",
          "href": "https://fieldbuilding.substack.com/p/blueprints-for-ai-safety-conferences"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one field-building intervention — a one-day summit, a three-day conference, a reading group series, a small organisation filling a named gap — and design it to the point of being runnable.</p>\n<p>The blueprint contains:</p>\n<ul><li><strong>The theory of change.</strong> Who changes what behaviour because this exists, and by what mechanism. One diagram plus one paragraph. If the mechanism is \"people meet and good things happen\", keep going.</li><li><strong>The counterfactual.</strong> What happens to your target people if this does not exist. This is where most field-building proposals quietly fail, because the honest answer is often \"they attend the other event\".</li><li><strong>The format.</strong> Length, size, agenda shape, who is in the room and — harder — who is deliberately not. Formats encode a theory; make yours explicit.</li><li><strong>Budget and staffing.</strong> Itemised. Venue, travel, stipends, the organiser's own time at a real rate. Name the largest line and defend it.</li><li><strong>The evaluation plan.</strong> What you measure, when, and the number that would make you not run it again. Measured <em>before</em> the event too, or you have no baseline.</li><li><strong>The failure modes.</strong> The three ways this goes wrong, including the two boring ones — nobody comes, and the wrong people come.</li></ul>\n<h3>Why it exists</h3>\n<p>The program's own existence is a field-building bet. Making learners design one closes that loop: you get to see the argument that was made about you.</p>\n<p>It also teaches evaluation under weak feedback, which is the honest condition of most governance work. Nothing here has a loss function. You have to decide in advance what evidence would count, knowing it will be thin, and then commit to being told you were wrong — the same discipline the tracks teach against thresholds and treaty regimes, applied to something you built.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> design, budget, and evaluation plan on paper. Talking to people who have run comparable things is strongly encouraged and cheap.</p>\n<p><strong>Out of scope:</strong> actually running it. If your team wants to run it, that is a separate commitment made after the blueprint is graded — do not let the capstone become logistics.</p>\n<p><strong>Also out of scope:</strong> an intervention whose target audience you cannot name individually enough to describe a typical attendee's week. Vague audiences produce unevaluable designs.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Theory of change</td><td>\"Builds the community\"</td><td>A named group, a named behaviour change, and the mechanism between them</td></tr><tr><td>Counterfactual</td><td>Unaddressed</td><td>An honest account of what those people would otherwise do, with the delta stated</td></tr><tr><td>Budget</td><td>A total</td><td>Itemised, with the largest line defended and a cheaper variant costed</td></tr><tr><td>Evaluation</td><td>\"Feedback forms\"</td><td>A pre-measure, a post-measure, and the threshold at which you would stop</td></tr></tbody></table></div>\n<p>The strongest blueprints include a section arguing the intervention should not happen, written well enough to be uncomfortable.</p>\n<h3>Getting started</h3>\n<ol><li>Write the counterfactual paragraph in the first session. It reshapes or kills most ideas immediately, which is the cheapest possible time for that.</li><li>Cost a deliberately smaller version alongside the real one. Funders ask, and the small version is often better.</li><li>Talk to one person who has run something similar before you finalise the format. Thirty minutes of that beats a week of desk research on logistics.</li></ol>"
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
          "label": "A Map to Navigate AI Governance — Caro (2022)",
          "href": "https://forum.effectivealtruism.org/posts/tmxkRFx6HyhhvHdz4/a-map-to-navigate-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>A detailed actor-and-activity map of the AI governance field exists, and it is from 2022. Pick one sub-area of it and rebuild that slice at today's date.</p>\n<p>You produce:</p>\n<ul><li><strong>The map.</strong> Actors and activities for one sub-area — compute governance, standards and assurance, international coordination, liability, or another slice you can defend as a unit. Every node carries what the actor does, not just its name.</li><li><strong>The change log.</strong> The point of the exercise. Per node: <em>new</em>, <em>unchanged</em>, <em>renamed</em>, <em>pivoted</em>, or <em>gone</em>. Every non-<em>unchanged</em> row gets a dated source.</li><li><strong>The gaps.</strong> Activities the field talks about that nobody in your map actually does. These are the map's real output — they are where a newcomer can be useful.</li><li><strong>A decay note.</strong> One paragraph: which parts of your map you expect to be wrong first, and roughly when. Write it knowing someone will check.</li></ul>\n<h3>Why it exists</h3>\n<p>Field maps are the single most useful artifact for someone entering a field and the fastest-rotting. Rebuilding one teaches three things at once: how the field is actually organised, how to source institutional claims, and — the one people learn only by doing this — how confidently a stale document reads. Nothing in the old map announces that it is old.</p>\n<p>The gaps section makes it more than an exercise. A list of activities nobody owns is directly actionable, and it feeds the orphaned-policy capstone naturally.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one sub-area, public sources, organisation websites, published research agendas, job boards and directories. Depth over coverage.</p>\n<p><strong>Out of scope:</strong> the whole field. A shallow refresh of everything is worth less than one slice done to the point where you could brief someone on it.</p>\n<p><strong>Also out of scope:</strong> interviewing people at the organisations you map. It is a reasonable thing to do and a different, longer project; two weeks of desk research is the scope here.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Nodes</td><td>Organisation names</td><td>What each one actually does, in a verb, with a dated source</td></tr><tr><td>Change log</td><td>\"Updated for 2026\"</td><td>Row-level status with evidence for every change</td></tr><tr><td>Gaps</td><td>Absent</td><td>Named activities with nobody attached, and why that is the case</td></tr><tr><td>Currency</td><td>Undated claims</td><td>Every claim carries a date, so the next person can re-check cheaply</td></tr></tbody></table></div>\n<p>The strongest submissions include at least one node where the old map was confidently wrong, with the correction sourced.</p>\n<h3>Getting started</h3>\n<ol><li>Pick the sub-area you would want to work in. You will read a great deal about it and the map is more careful when you care about the answer.</li><li>Before adding a node, find the dated evidence. A map built from memory and patched with sources later is a map with silent 2022 entries in it.</li><li>Draft the gaps section halfway through. It changes what you look for in the second half — you start reading for absence rather than presence.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 53, \"Should Parts of the Frontier AI Industry Be Treated Like Public Utilities?\", suggested by Markus Anderljung. Quoted:</p>\n<blockquote><p>I think it's reasonably likely that we'll see the following development: the AI industry will largely build on a small number of really capable foundation models. At this foundation model layer, there is a natural oligopoly due to economies of scale, learning-by-doing from training huge models, getting access to data from users interacting with the system, probably some network effects, and so on. Upon this foundation model layer, a huge number of downstream applications are built, i.e. we see concentration at the FM layer and then less concentration further down the supply chain. […]</p>\n<p>If this picture is right, that suggests that it might be right to treat frontier FMs similarly to public utilities. They'll become the bedrock of our economy. At the same time, there will be a large amount of concentration. Often, people have the intuition that the right policy is to increase competition at the FM layer, but this picture suggests that it's more about managing that concentration, and about ensuring that market power is not abused, that certain kinds of vertical integration is warded off, that the products that are offered to people and downstream businesses are safe, reliable, and high quality.</p>\n<p>Research questions: What would the implications (both positive and negative) of treating foundation models as public utilities be? What effects would this have on market concentration? Methodology: literature review, expert interviews, modelling, case studies.</p></blockquote>\n<h3>What you produce</h3>\n<p>The analysis the two research questions describe — implications of public-utility treatment argued positive and negative, and the effect on market concentration — using the methodology the idea names.</p>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one node in the compute supply chain — lithography, HBM, advanced packaging, fab capacity, the cloud tenancy layer, or the second-hand market — and write the dossier a verification analyst would want before committing to it as a monitoring point.</p>\n<p>The dossier covers:</p>\n<ul><li><strong>The node.</strong> What physically happens there, at enough resolution that a reader can tell a real bottleneck from a marketing one.</li><li><strong>The actors.</strong> Firms, states, regulators; who holds leverage over whom; where the concentration actually sits.</li><li><strong>Observability.</strong> What is visible from outside — customs data, export filings, satellite, financial disclosure, industry trackers — and at what latency.</li><li><strong>What a verifier would learn.</strong> The claim this node can support, stated as a sentence a diplomat could use.</li><li><strong>What it cannot see.</strong> The equivalent sentence for the blind spot.</li><li><strong>The ranking.</strong> Score the node against the others the track has covered on concentration, observability, substitutability and time-to-erode.</li></ul>\n<h3>Why it exists</h3>\n<p>Compute is the governable input because it is excludable, quantifiable and concentrated — but those three properties are not uniform across the chain, and they decay at different rates. A regime that monitors the wrong node buys nothing while looking rigorous. Working one node to real depth teaches the shape of that judgement better than a survey of all of them.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> open sources, the track's readings, and the interactive supply-chain map as a starting skeleton.</p>\n<p><strong>Out of scope:</strong> classified or paywalled proprietary market data; a complete industry history. Depth on one node beats breadth across six.</p>\n<h3>What good looks like</h3>\n<ul><li>Numbers carry dates and sources, and you say when a number is an estimate rather than a measurement.</li><li>The ranking table has a stated scoring rule, so a reader can disagree with your weights rather than your conclusion.</li><li>At least one claim in the dossier is one you tried and failed to verify — and it says so, in place, rather than quietly disappearing.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Start from the supply-chain map and pick the node you find least legible. Legibility is what you are building.</li><li>Find three independent sources for one central number before writing anything. If you cannot, that is your first finding.</li><li>Write the \"what it cannot see\" section before the \"what a verifier would learn\" section — it keeps the dossier honest.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 22, \"Incident Detection and Monitoring at AI Companies\", suggested by Julian Hazell. Quoted:</p>\n<blockquote><p>Different ways of monitoring deployed AI systems for risks have been suggested: technical monitoring systems (e.g., other AI models) that analyze user inputs and model outputs to detect misalignment or misuse; allow users to choose from multiple independent monitoring providers to increase trust and reduce privacy concerns; work with large corporate clients to set up their own AI monitoring teams, which are trained and validated by the AI lab but operate independently to protect client data privacy; automatically ban users when misuse is detected (with an option for human review); retain user data for long periods to facilitate more comprehensive monitoring and analysis; compensate users whose data ends up being reviewed by human monitors; implement data anonymization techniques […]; implement better watermarking techniques to help with post-hoc investigations of incidents where AI may have played a role; solicit volunteers to agree to more intensive monitoring.</p>\n<p>However, nearly all of these potential solutions involve significant tradeoffs, and additional research is needed to thoroughly assess their benefits and drawbacks. Implementing even just a few of these monitoring measures may prove challenging due to various technical, legal, and commercial considerations.</p>\n<p>Research questions: If unrestricted retention and access to user chat logs would significantly hurt AI companies' commercial viability by driving away privacy-conscious users, what might a more feasible setup look like? What are the tradeoffs? How can privacy concerns be addressed, both from a policy and technical point-of-view? More generally: what would a comprehensive monitoring framework look like in practice? Methodology: literature review, expert interviews, scenario mapping, risk analysis.</p></blockquote>\n<h3>What you produce</h3>\n<p>The assessment the idea calls for: the proposed monitoring setups with their benefits and drawbacks worked through, the privacy question addressed from both the policy and the technical side, and the sketch of what a comprehensive monitoring framework would look like in practice.</p>"
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
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), ecosystem monitoring: how can non-public incidents be reliably reported, and what technical information should be reported to make analysis meaningful",
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 6 lists incident reporting alongside model cards and structured access as transparency mechanisms. Unlike the other two it has no agreed object: aviation knows what an incident is, pharmacovigilance knows what an adverse event is, and AI does not.</p>\n<p>Build the missing definition and then check it against reality.</p>\n<ul><li><strong>The taxonomy.</strong> Classes of reportable event with thresholds. Candidates: an evaluation result that crossed an internal trigger, a safeguard bypass observed in deployment, an agent taking an action outside its authorised scope, a security event touching weights or training infrastructure, a material capability discovered after release. Each needs a threshold, or everything and nothing is an incident.</li><li><strong>Severity and timing.</strong> What must be reported within 24 hours, what within 30 days, what annually in aggregate. Fast reporting buys responsiveness and costs accuracy; say where you put the line and why.</li><li><strong>The form.</strong> The actual fields. This is the deliverable that would get used, and designing it forces every ambiguity in the taxonomy into the open.</li><li><strong>The back-test.</strong> A dozen publicly reported AI incidents from the last few years. Classify each. Report the ones your taxonomy handles badly — the ambiguous ones are the finding, not an embarrassment.</li><li><strong>The disincentive check.</strong> Reporting creates liability and headlines. Say what your design does about that: safe-harbour, aggregation, delayed publication, confidential channels. A taxonomy that ignores it collects nothing.</li></ul>\n<h3>Why it exists</h3>\n<p>Transparency mechanisms fail in a specific way: the obligation is written before the object is defined, so compliance becomes a matter of interpretation and comparison across companies becomes impossible. Watching that happen to your own taxonomy during the back-test is the lesson.</p>\n<p>The back-test is also the part that transfers. Building a classification and then honestly reporting where it breaks on real cases is what separates a usable instrument from a diagram.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public incident databases and reporting, incident-reporting regimes from aviation, medicine, cybersecurity and finance, and published lab safety frameworks.</p>\n<p><strong>Out of scope:</strong> an enforcement regime, and interviewing labs. The taxonomy and the form are enough for three weeks.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Classes</td><td>Broad categories</td><td>Thresholds per class, plus a deliberate non-example for each</td></tr><tr><td>The form</td><td>A list of topics</td><td>Fields a tired engineer could complete correctly at 2am</td></tr><tr><td>Back-test</td><td>Confirms the taxonomy works</td><td>Names the cases it handles badly and what that implies</td></tr><tr><td>Disincentives</td><td>Unaddressed</td><td>A specific mechanism, with what it costs the regulator in visibility</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Collect the twelve real incidents <em>first</em>, then build the taxonomy against them. Taxonomies built in the abstract classify nothing.</li><li>Draft the form early. Field design surfaces definitional problems that prose hides.</li><li>Borrow severity tiers from a mature regime rather than inventing them; spend your invention budget on the classes instead.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 72, \"BOTECs of Inference Compute Needs\", suggested by Markus Anderljung. Quoted:</p>\n<blockquote><p>It could be useful to have well-evidenced BOTECs to assess how much inference compute (in terms of FLOP, FLOP/s, and hardware required) is needed for various consequential AI use-cases. […] In some of these cases, it may also be interesting to conduct a BOTEC on the bang-for-buck of the use case. It's not clear these BOTECs should be widely published, but they ought to be useful for policymakers, and could inform broader strategies around risk management for hazards arising from misuse.</p>\n<p>Why might this matter? A lot of compute governance efforts focus on the compute needed for training. I think inference deserves more attention. Inference is what will lead to AI systems having a real impact in the world, and we should expect that a system's impact should at least monotonically increase with the number of inferences run on it.</p>\n<p>Research question: How much inference compute would be needed for different consequential AI use-cases? Methodology: quantitative.</p></blockquote>\n<h3>What you produce</h3>\n<p>The BOTEC the idea describes, for one use-case agreed with your mentor, with every assumption exposed and a sensitivity range rather than a point figure. Note the idea's own caution and follow it: it is not clear these BOTECs should be widely published — the deliverable is written for a policymaker, and publication is a decision, not a default.</p>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 5",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The orphan catalogue's complaint about insurance is unusually precise: researchers praised the mechanism, and the question of what the minimum amount should be was never satisfactorily answered. Nor were policy limits or deductibles. A mandate without those three numbers cannot be written into any instrument.</p>\n<p>Answer it.</p>\n<ul><li><strong>The loss model.</strong> What harms this insurance is for, and a defensible order-of-magnitude for each. Build it bottom-up from analogues you can cite — data-breach losses, product recalls, professional liability, cyber — and say where the analogy breaks.</li><li><strong>The three numbers.</strong> Minimum coverage, per-occurrence and aggregate limits, deductible. With the reasoning visible, so a reader can disagree with an input instead of the conclusion.</li><li><strong>The availability check.</strong> Would anyone write this policy? Capacity, reinsurance, and the exclusions an underwriter would insist on. A mandate nobody can satisfy is a moratorium wearing a disguise, and you should say so if that is what you find.</li><li><strong>The incentive read.</strong> What behaviour your number actually buys. Insurance governs through pricing and underwriting conditions, not through payouts; if the number is too low it is a rounding error, too high and it entrenches incumbents. Say which way you erred.</li></ul>\n<h3>Why it exists</h3>\n<p>This is the track's quantitative nerve applied to policy rather than compute. The honest answer is built on thin data, and the skill is producing a number anyway, with the uncertainty stated rather than hidden — the same discipline as a compute threshold, in a domain where nobody has done the arithmetic in public.</p>\n<p>It also teaches something specific about mechanism choice: insurance is attractive to policy people because it seems to outsource the hard judgement to a market. Working the numbers shows how much judgement stays with the regulator.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public loss data from analogous industries, insurance-market reporting, and the AI-liability literature. Order-of-magnitude reasoning is expected; precision is not.</p>\n<p><strong>Out of scope:</strong> actuarial modelling of AI-specific tail risk. Nobody can do that yet, and pretending otherwise is the failure mode here. Bound it and say so.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The model</td><td>A number with a rationale paragraph</td><td>Bottom-up from named analogues, each with its disanalogy stated</td></tr><tr><td>The numbers</td><td>One figure</td><td>All three, with the relationship between them explained</td></tr><tr><td>Availability</td><td>Assumed</td><td>Checked against real market capacity, with the exclusions named</td></tr><tr><td>Uncertainty</td><td>Point estimate</td><td>A range, the input it is most sensitive to, and what would narrow it</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Pick the harm class first. An insurance mandate covering \"AI harms\" cannot be priced; one covering a defined class can be bounded.</li><li>Find the closest priced analogue and start there, adjusting explicitly. Starting from first principles produces a number nobody can check.</li><li>Ask an underwriter's question of every figure: what would make you refuse to write this?</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>Large training runs lean on high-bandwidth interconnect between racks; serving a trained model leans on it far less. That asymmetry suggests an emergency measure with an unusually good ratio of disruption to harm: disconnect part of the inter-rack fabric, and training stops while inference keeps running. The project is to work out how much of that claim survives contact with the details.</p>\n<ul><li><strong>What remains possible.</strong> With a given fraction of links cut, which workloads still run: inference at what scale, fine-tuning at what size, training partitioned into what fragments. The boundary is the whole content of the measure.</li><li><strong>The inspection.</strong> Who checks the cables, how often, and what a check looks like — physically pulled fibre, sealed ports, counters read from switches. Each option is a different cost and a different trust assumption.</li><li><strong>The restoration paths.</strong> How an operator gets the fabric back: respliced fibre, spare switches, traffic routed over the storage network or the ordinary datacenter network at lower bandwidth. For each path, what it buys the operator and what it exposes to the inspector.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.1 treats hardware mechanisms mostly as proposals; a cable is the rare governance surface that is visible, countable, and already installed. Whether it can carry an emergency measure depends entirely on the workload boundary and the restoration paths, which is exactly the analysis this brief demands. The red-team pass is Module 3 applied at the smallest useful scale.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one reference cluster topology, public knowledge of how training and inference traffic differ, and back-of-envelope bandwidth arithmetic.</p>\n<p><strong>Out of scope:</strong> any real operator's network, and cryptographic or firmware-based controls — this brief is about physical disconnection only.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The boundary</td><td>\"Training stops\"</td><td>Which workloads survive at which cut fraction, with the arithmetic</td></tr><tr><td>Inspection</td><td>\"Cables are checked\"</td><td>A named check, its frequency, and what it costs both sides</td></tr><tr><td>Red team</td><td>An objections paragraph</td><td>Restoration paths priced: time, equipment, detectability</td></tr><tr><td>The verdict</td><td>Advocacy</td><td>A plain statement of when the measure holds and when it leaks</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the bandwidth budget first: what a training step needs, what serving needs. Every later claim divides by these numbers.</li><li>Design the check before the red team. A restoration path only matters if the check as designed would miss it.</li><li>Time-box the red team to the second week and let it win where it wins — the deliverable states the measure's limits, not its virtues.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The policy track carries interpretability deliberately as a <strong>pointer, not a week</strong>: an emerging evidence type in policy argument, listed under week 5's extensions, framed as <em>what an interp finding can and cannot support in testimony</em>. This capstone is that pointer, done properly, once.</p>\n<p>Pick one published interpretability result — hunting grounds, if you need them: <a href=\"https://arxiv.org/abs/2501.16496\">Open Problems in Mechanistic Interpretability — Sharkey et al. (2025)</a>, <a href=\"https://www.lesswrong.com/posts/KfkpgXdgRheSRWDy8/a-list-of-45-mech-interp-project-ideas-from-apollo-research\">Apollo Research's 45+ project ideas (2024)</a>, <a href=\"https://www.lesswrong.com/posts/kobJymvvcvhbjWFKe/laying-the-foundations-for-vision-and-multimodal-mechanistic\">vision and multimodal foundations — Joseph &amp; Nanda (2024)</a>, and <a href=\"https://www.lesswrong.com/posts/LbrPTJ4fmABEdEnLf/200-concrete-open-problems-in-mechanistic-interpretability\">200 Concrete Open Problems (2022 — its own update calls it out of date)</a>. Then:</p>\n<ul><li><strong>State what was actually shown.</strong> One paragraph, no jargon, at the level of precision the paper supports — which model, which layer or feature, on which distribution, established how.</li><li><strong>Collect three claims it gets cited for.</strong> Real citations where you can find them; plausible ones you construct if you cannot. Typically some version of \"we can tell whether a model is deceptive\", \"we can audit for dangerous capability\", \"we understand what the model is doing\".</li><li><strong>Rate each claim.</strong> <em>Supported</em>, <em>partially supported with a stated condition</em>, or <em>not supported</em>. For each, the specific gap — distribution, scale, causal versus correlational, whether the method has been validated against a ground truth at all.</li><li><strong>The admissibility test.</strong> For the one claim closest to being usable, write the two questions a hostile reader would ask, and whether the finding survives them.</li><li><strong>The replacement sentence.</strong> What a policy document should say instead, if it wants to lean on this result.</li></ul>\n<h3>Why it exists</h3>\n<p>Interpretability is the most-cited and least-understood evidence type in governance writing. A finding gets published about a feature in one model, and six months later it is load-bearing in a paragraph about auditing frontier systems. Nobody involved is lying; the chain of small stretches is just never audited.</p>\n<p>The skill is the track's core one — mapping a claim to the evidence that would support it — applied to a technical result you did not produce and cannot fully evaluate. That constraint is realistic. Policy researchers cite work outside their expertise constantly; the honest ones know exactly how far they can carry it.</p>\n<p>The open-problems literature is your ally here rather than your obstacle: the field's own agenda papers say plainly which methods need conceptual and practical improvement before they support strong conclusions. Quoting a field about its own limitations is the strongest move available to a non-specialist.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one published result, its own paper, and the field's open-problems literature. No coding.</p>\n<p><strong>Out of scope:</strong> evaluating whether the interpretability method is technically correct. You are not refereeing the paper. You are asking what a correct result would license.</p>\n<p><strong>Also out of scope:</strong> a survey of interpretability. One finding, three claims. The track carries this as an extension precisely because it is not a subfield tour.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The restatement</td><td>Paraphrases the abstract</td><td>Names the model, the scope, and the thing the paper explicitly did not test</td></tr><tr><td>The claims</td><td>Straw versions</td><td>Real citations, or constructions a practitioner would recognise as fair</td></tr><tr><td>The ratings</td><td>All \"not supported\"</td><td>Discriminating: at least one claim survives with a stated condition</td></tr><tr><td>Replacement</td><td>\"More caution is needed\"</td><td>A sentence a policy document could paste in and defend</td></tr></tbody></table></div>\n<p>Rating everything unsupported is as lazy as citing it uncritically. The work is in finding the narrow claim that does hold.</p>\n<h3>Getting started</h3>\n<ol><li>Pick a finding you have already seen cited in a policy context. The citation chain is half your material.</li><li>Read the paper's own limitations section first, then the field's open-problems paper. Both will hand you gaps you would not have found.</li><li>Write the replacement sentence before the ratings. It forces you to decide what you actually think, and the ratings then have something to justify.</li></ol>"
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
        "Verification 2.x — the evidence layers",
        "Verification 3 — covert development",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick one agreement — a three-month emergency pause, a compute cap, or a conditional slowdown — and specify the verification regime that would make it credible. Not the ideal regime: the <em>minimal</em> one. Every mechanism you add has to earn its place against the question \"what does the other side believe after this that they did not believe before?\"</p>\n<p>Your spec names, at minimum:</p>\n<ul><li><strong>The agreement.</strong> What exactly is prohibited, over what period, with what exemptions. One paragraph, written so a lawyer could not drive a truck through it.</li><li><strong>Covered actors.</strong> Who is in scope — labs, cloud providers, chipmakers, states — and who is deliberately left out.</li><li><strong>Thresholds.</strong> The numbers that trigger obligations, plus what happens to their selectivity over the agreement's lifetime.</li><li><strong>Reporting rules.</strong> What is declared, by whom, how often, under what penalty for misdeclaration.</li><li><strong>The verification stack.</strong> Which of the hardware, cloud, intelligence and human layers you are using, and what each one buys you.</li><li><strong>Evasion risks.</strong> The three most plausible defection routes and what, concretely, would catch each one.</li><li><strong>Evidence standards.</strong> What quantum of evidence justifies a challenge inspection, a suspension, a public accusation.</li><li><strong>Enforcement pathway.</strong> What happens after detection — the step most regimes leave as an exercise for the reader.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's central question is whether the US and China could trust an agreement to pause frontier development. Every module builds one piece of the answer; this is where the pieces have to hold each other up. A regime that verifies beautifully but has no enforcement pathway is a research paper, not a policy. A regime with teeth and no evidence standard is a casus belli generator.</p>\n<p>This is also the track's strongest portfolio artifact. It is the closest thing in the program to what a technical-governance fellowship actually asks for: a scoped design under adversarial pressure, with the failure modes named by the author rather than the reviewer.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one agreement, one adversary model, the evidence layers you already studied, and mechanisms that exist or are plausibly buildable in the agreement's window.</p>\n<p><strong>Out of scope:</strong> inventing new verification technology; a full treaty text; the diplomacy of getting to the table. If a mechanism needs a decade of hardware rollout, you may cite it as a successor regime, but it cannot be load-bearing in a three-month pause.</p>\n<p>You are reusing work, not starting from zero. The problem/solution model you seeded in Module 0, the stakeholder map from Module 1, the chokepoint ranking from Module 2, and the evasion scenarios from Module 3 are the inputs. If you find yourself re-deriving them, stop and go get them.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Minimality</td><td>Every mechanism the course mentioned, stacked</td><td>Four mechanisms, each with a stated job, and a named thing you cut</td></tr><tr><td>Adversary</td><td>\"A bad actor might cheat\"</td><td>A specific defection route with a cost, a timeline, and a detection probability</td></tr><tr><td>Evidence</td><td>\"Inspectors would investigate\"</td><td>A stated threshold: what triggers a challenge, what a challenge can conclude</td></tr><tr><td>Honesty</td><td>Confident throughout</td><td>The failure modes are in your own text, in the section where they belong</td></tr></tbody></table></div>\n<p>The single best predictor of a strong submission: your evasion annex attacks <em>your</em> regime, specifically, rather than verification in general.</p>\n<h3>Getting started</h3>\n<ol><li>Write the one-paragraph agreement first. Most drafts wobble because the thing being verified was never pinned down.</li><li>Choose the adversary before the mechanisms — a state actor willing to burn diplomatic capital and a profit-maximising lab produce different regimes.</li><li>Draft the evasion annex <em>second</em>, not last. It will delete two of your mechanisms and save you a week.</li></ol>"
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
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), operationalisation questions: what should constitute the lower bar for tracking updates to models, for example in a model registry?",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Model registries appear in nearly every governance proposal and none of them answers the administrative question that decides whether a registry works: what counts as an update worth filing?</p>\n<p>Draw the line.</p>\n<ul><li><strong>The candidate rules.</strong> Any weight change; a compute-delta threshold on the additional training; a capability-delta threshold measured by eval; a version-string change; deployment-surface change regardless of weights. Each is defensible and they produce wildly different filing volumes.</li><li><strong>The back-test.</strong> A year of real, publicly documented model updates — point releases, safety patches, quantisations, distilled variants, context window extensions, new modalities. Apply each rule. Report how many filings each produces, and which updates each rule misses that you think mattered.</li><li><strong>The two costs.</strong> A bar set too low buries the registry in filings nobody reads, which is a real failure and not a lesser one; too high and it misses the update where the capability arrived. Name a real update that lands on the wrong side of your line, in each direction.</li><li><strong>The recommendation.</strong> One rule, its expected annual volume, and the exception you would attach — usually something like a duty to file any update that changes an eval result already reported to the regulator, regardless of how small the change looks.</li></ul>\n<h3>Why it exists</h3>\n<p>This is a small question that decides whether an entire class of governance mechanism functions. It is also representative of a category of work — the administrability of a proposed instrument — that is chronically undersupplied because it is unglamorous and requires actually counting things.</p>\n<p>The back-test is the pedagogy. Learners propose a definition, apply it to a year of reality, and discover the volume it generates. Nothing else teaches the difference between a rule that reads well and a rule that runs.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public release notes, model cards and version histories for a handful of developers over one year; published registry proposals and comparable registries in other sectors.</p>\n<p><strong>Out of scope:</strong> designing the registry's data schema, its access rules, or its legal basis. One threshold question, answered with evidence.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Rules</td><td>One proposal</td><td>Four candidates, each stated precisely enough to apply mechanically</td></tr><tr><td>Back-test</td><td>Illustrative examples</td><td>A year of real updates, with a filing count per rule</td></tr><tr><td>Costs</td><td>\"Trade-offs exist\"</td><td>A named real update on the wrong side of your line, in each direction</td></tr><tr><td>Recommendation</td><td>The most rigorous rule</td><td>The one that runs, with its expected volume and a targeted exception</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Collect the year of updates before designing any rule. The distribution of what developers actually ship is the whole input.</li><li>Apply each rule mechanically, without adjusting it when the answer is awkward. The awkward answers are the finding.</li><li>Write the exception last. A clean rule plus one targeted exception beats a rule with the exception baked into its wording.</li></ol>"
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
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025)",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>You are staffing the release decision for an open-weight model at the capability frontier of what is currently released openly. Write the memo the committee reads.</p>\n<p>The memo covers:</p>\n<ul><li><strong>The decision.</strong> Release, release with conditions, or hold — stated in the first paragraph, not the last.</li><li><strong>The evidence table.</strong> Row per claim the release rests on; column for the evidence, its strength, and what would overturn it. Claims like \"the model does not meaningfully uplift a novice\" belong here with their actual support, which is usually thinner than the sentence sounds.</li><li><strong>The mitigation audit.</strong> For each safeguard — data filtering, refusal training, unlearning, staged release, licence terms — state what it does against a downstream actor who has the weights, a GPU, and a weekend. Mark each one <em>durable</em>, <em>slows an amateur</em>, or <em>theatre</em>. Nothing gets to be unmarked.</li><li><strong>The irreversibility budget.</strong> The whole point. Name what cannot be recovered if you are wrong, and what you are accepting in exchange.</li><li><strong>The monitoring plan.</strong> What you would watch after release, and the observation that would tell you the decision was wrong — while there is still anything to be done about it.</li></ul>\n<h3>Why it exists</h3>\n<p>Open release is the cleanest case in AI governance of a decision that cannot be walked back, made on evidence that is known to be incomplete. It is also where safety arguments are most often made in a form that has never survived contact with fine-tuning: safeguards evaluated on the model as shipped, not on the model as trivially modified.</p>\n<p>The literature this draws on is explicit that the science is nascent — most of the sixteen open technical problems are unsolved. That makes this a good teaching case, because you have to write a defensible decision <em>without</em> the evidence you would want, which is the actual job.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published work on open-weight risk management, unlearning, tamper-resistance, and the frontier safety frameworks the track already covered. A hypothetical model is fine — specify its capability profile explicitly and hold to it.</p>\n<p><strong>Out of scope:</strong> running the evals yourself, and litigating whether open weights are good in general. This memo is about one model and one decision. The general argument belongs in a different capstone.</p>\n<p><strong>A hard constraint on content:</strong> do not write operational uplift detail. The memo argues about evidence and reversibility; it does not need — and must not contain — a recipe for anything.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The recommendation</td><td>Emerges at the end after a survey</td><td>First paragraph, with its two strongest counter-arguments named by you</td></tr><tr><td>Mitigations</td><td>Listed as implemented</td><td>Each one marked durable / slows an amateur / theatre, with the reason</td></tr><tr><td>Evidence</td><td>\"Evals showed no significant uplift\"</td><td>The eval, the elicitation, the population it generalises to, and what it cannot see</td></tr><tr><td>Irreversibility</td><td>Acknowledged in passing</td><td>Priced: what specifically is unrecoverable, and what you accept in exchange</td></tr></tbody></table></div>\n<p>If every mitigation in your audit comes out durable, you have not attacked your own memo hard enough. Go back and assume the fine-tuner is competent, funded, and not in your jurisdiction.</p>\n<h3>Getting started</h3>\n<ol><li>Fix the model's capability profile in writing on day one. Half of all release arguments are actually arguments about a model nobody specified.</li><li>Do the mitigation audit before the evidence table. It usually deletes two rows of the table and reshapes the recommendation.</li><li>Write the monitoring plan as if the release already happened and you are three months in. It is the fastest way to find out whether your post-release story was ever real.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 71, \"OP/s Threshold Adjustments for Performance\". Quoted:</p>\n<blockquote><p>How should the OP/s threshold (e.g. in US chip export controls) be adjusted to account for performance variations across different bit-widths (in OP/s but also overall)? This is critical for accurately penalizing and incentivizing the development of AI systems. Existing metrics may disproportionately favor smaller bit-widths over larger ones. E.g., your metric for FP16 is only 2x higher than FP32, while the total performance gains might be higher. […] Reduced bit-width generally results in performance acceleration, often exceeding linear improvement. However, implementing such changes in hardware requires a couple of years. […] Recent studies primarily focus on cost and memory footprint reductions, with limited analysis on the acceleration effects. FP16 has become the default for training and FP8 might be next.</p>\n<p>Research questions: How should the OP/s threshold be adjusted to account for performance variations across different bit-widths? Do we see a reduced performance for using X 8-bit FLOP vs X 16-bit FLOP for training a X FLOP model? While reduced bit-width generally works until a certain point, few studies focus on architecture modifications to accommodate even lower bit-widths (&lt;8-bit) during training. Methodology: literature review, modeling, data analysis.</p></blockquote>\n<h3>What you produce</h3>\n<p>The note the idea's own research questions describe: what the literature and your modelling say about performance across bit-widths, and the threshold adjustment that evidence justifies.</p>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>Any realistic pause stops training and leaves serving alone — nobody switches off the deployed economy. That puts the entire agreement's weight on a definition: what is \"inference\", operationally, such that an operator cannot run a training program and call it something else? Draft the rule, then attack it.</p>\n<ul><li><strong>The operational definition.</strong> Written in terms a verifier can check — what is measured, at what boundary, with what thresholds. A definition in terms of intent is not a definition.</li><li><strong>The five edge cases, run in order.</strong> Fine-tuning (small updates to a permitted model); distillation (a student trained on the teacher's outputs); synthetic-data generation (inference now, training corpus later); long-context inference (test-time compute that substitutes for weights); and safety research (the exemption every draft wants and every evader wants more).</li><li><strong>The revisions.</strong> Each edge case either survives your rule, forces an amendment, or exposes a hole you choose to accept. Record which, and why — the revision history is the deliverable's argument.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.2 lists workload labels among the things an operator can fake, and Module 3's repurposed-infrastructure scenario is training disguised as inference or safety research. Both presume the boundary this brief drafts. If the definition cannot be written, that is a finding with consequences for every pause proposal in the literature; if it can, the edge cases say what enforcing it costs.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> workload characteristics as publicly understood, one deployment context held fixed, and definitional drafting with adversarial testing.</p>\n<p><strong>Out of scope:</strong> the hardware and telemetry that would measure the boundary — assume the measurements you specify are available, and be conservative about what you specify. Treaty language and legal drafting style are also out; this is the operational core a lawyer would later wrap.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Definition</td><td>Intent-based</td><td>Measurable terms, stated boundary, stated thresholds</td></tr><tr><td>Edge cases</td><td>Mentioned</td><td>Each run against the rule with a verdict: survives, amends, or accepted hole</td></tr><tr><td>Revisions</td><td>Silent fixes</td><td>The rule's version history, with what each edge case forced</td></tr><tr><td>Honesty</td><td>A watertight claim</td><td>The accepted holes listed, with why they were accepted</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write version one of the rule in under an hour and let it be wrong — the project's content is the revision history, not the first draft.</li><li>Take the edge cases in the listed order; each is roughly a harder version of the one before.</li><li>When an edge case defeats the rule, decide explicitly: amend, or accept the hole. Undecided holes are how definitions rot.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 6 covers licensing as one of the live regulatory-design debates. It is argued almost entirely at the level of principle — pro-licensing versus anti-licensing — and almost never at the level where licensing regimes succeed or fail, which is administrative design.</p>\n<p>Design the regime.</p>\n<ul><li><strong>The trigger.</strong> What requires authorisation. Compute above a line, a capability class, a deployment context, or a combination. Say what deliberately does not.</li><li><strong>The decision test.</strong> What the applicant must show and what the agency must find. This is the hard part, and the honest difficulty is that the evidence a regulator would want — how capable will this model be? — does not exist before the run. Say how your test handles that: conditional authorisation, a plan-based test rather than an outcome-based one, staged approval at checkpoints.</li><li><strong>Timelines and default.</strong> How long the agency has, and what happens on silence. Deemed approval and deemed refusal are completely different regimes and the choice is usually made by accident.</li><li><strong>The caseload.</strong> Estimate applications per year from your trigger, and the staff needed to decide them at the quality your test demands. A regime that generates more cases than the agency can decide converts into rubber-stamping, which is worse than no regime because it launders the decision.</li><li><strong>Appeal and review.</strong> What an applicant can challenge, and the sunset or review clause, because the trigger will be wrong within two years.</li><li><strong>The honest downside.</strong> Who this entrenches. Licensing raises fixed costs, which advantages incumbents; say by how much and whether you accept it.</li></ul>\n<h3>Why it exists</h3>\n<p>Learners arrive at licensing as a position to hold. They should leave with the understanding that a licensing regime is a queue, a test and a staffing model, and that most of the outcome is decided by those three rather than by the statute's ambition.</p>\n<p>The caseload estimate is the piece that transfers everywhere. Any proposed approval regime — for models, for deployments, for exports — lives or dies on whether the decision-maker can actually decide at volume.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> licensing and pre-approval regimes in other sectors (pharma, nuclear, aviation, financial authorisations) as design and staffing anchors, plus the published AI-licensing debate.</p>\n<p><strong>Out of scope:</strong> statutory drafting, and the constitutional question of whether a given jurisdiction may do this. Pick a jurisdiction, assume the authority exists, and design well within it.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Decision test</td><td>\"Demonstrate adequate safety\"</td><td>A test the agency could actually apply pre-training, with its evidence problem named</td></tr><tr><td>Timelines</td><td>Unstated</td><td>A clock, and an explicit choice between deemed approval and deemed refusal</td></tr><tr><td>Caseload</td><td>Ignored</td><td>Applications per year estimated, with the staffing the test implies</td></tr><tr><td>Downside</td><td>Unacknowledged</td><td>The entrenchment effect estimated, and accepted or mitigated on the record</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the decision test first and immediately ask what evidence exists <em>before</em> the run. That question reshapes every licensing design that has ever been proposed and most drafts never confront it.</li><li>Anchor the caseload on a real regulator's published throughput. It is the fastest way to find out whether your trigger is administrable.</li><li>Choose deemed approval or deemed refusal deliberately, and say why.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 1's lever taxonomy lists regulation, standards, liability, compute controls, self-governance and international agreements. Procurement is the lever that is missing from most such lists and is often the fastest available: it needs no statute, it binds through contract, and a large buyer's terms propagate to everything the vendor sells.</p>\n<p>Draft the conditions for one agency buying one category of AI system.</p>\n<ul><li><strong>The conditions.</strong> What a vendor must do to be eligible and what they must keep doing. Candidates: publish evaluation results for the deployed configuration, notify the buyer of material model updates, permit third-party testing, meet a security baseline for weights and data, provide incident reporting, accept liability terms that are not the standard limitation.</li><li><strong>Evidence per condition.</strong> What a bid must contain, and what a contracting officer — who is not an AI specialist and has a deadline — could actually evaluate. This constraint kills roughly half of any wish list, and finding out which half is the exercise.</li><li><strong>What contract form cannot carry.</strong> Some asks do not survive: anything requiring continuous judgement, anything the buyer cannot detect a breach of, anything the vendor can satisfy for the government instance while shipping something else commercially. Name them and say what instrument would be needed instead.</li><li><strong>The market read.</strong> Would anyone bid? A condition set that leaves one compliant vendor has replaced a safety problem with a competition problem. Say who drops out and whether you accept it.</li><li><strong>The propagation question.</strong> One page: which of your conditions would a vendor apply across their whole product because maintaining two versions is not worth it. That is where procurement's real leverage is, and it is not usually the strictest condition.</li></ul>\n<h3>Why it exists</h3>\n<p>Procurement is where governance actually reaches many organisations first, and it is badly under-taught relative to legislation, which is slower and rarer. Learners who understand that a purchase order is a regulatory instrument read the whole landscape differently.</p>\n<p>The pedagogy is the evidence column. Anyone can list what they wish vendors did; the discipline is writing conditions a non-specialist can score bids against, on a schedule, defensibly enough to survive a protest from the loser.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published procurement guidance and standard contract clauses, the <a href=\"https://www.nist.gov/itl/ai-risk-management-framework\">NIST framework</a> and comparable standards as incorporable references, and public information on AI vendors' terms.</p>\n<p><strong>Out of scope:</strong> the appropriations and competition law of a specific jurisdiction beyond flagging it, and a full contract. Conditions and their evidence, plus the analysis.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Conditions</td><td>A wish list</td><td>Conditions with the evidence a bid must contain for each</td></tr><tr><td>Evaluability</td><td>Assumed</td><td>Written for a non-specialist officer on a deadline, with the unevaluable asks cut</td></tr><tr><td>Limits</td><td>Unstated</td><td>The asks contract form cannot carry, named, with the alternative instrument</td></tr><tr><td>Market</td><td>Ignored</td><td>Who stops bidding, and whether the remaining field is competitive</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Read one real set of procurement conditions from any technical domain. The evidence column is a genre and it is easier to imitate than invent.</li><li>For every condition, ask how the buyer would find out it had been breached. Conditions with no answer come out.</li><li>Do the propagation analysis last — it tells you which conditions were worth the fight.</li></ol>"
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
          "label": "Open Technical Problems in Open-Weight AI Model Risk Management (2025), §4.5 model provenance and forensics: model heritage inference, and how practical and scalable proof-of-training methods are",
          "href": "https://openreview.net/forum?id=8QyGLnFkzc"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Two separate literatures are circling the same question. Proof-of-learning asks whether a party can demonstrate that a set of weights is the output of a particular training run; model-heritage inference asks whether an outside observer can tell which base model a given artifact was derived from. Module 2.1 already records the verdict on the first — fragile, and spoofed in practice.</p>\n<p>Assess what either can actually carry.</p>\n<ul><li><strong>The claims.</strong> Write out the distinct provenance claims a regime might want: <em>this is the checkpoint that was evaluated</em>; <em>this run used the declared data</em>; <em>this fine-tune descends from that base model</em>; <em>this model was not trained after the cut-off date</em>. They have very different difficulty.</li><li><strong>Method by claim.</strong> For each claim, which method could establish it, at what cost to the prover, and with what confidence. Include the boring options — hashes and signed checkpoints establish more than people expect, provided someone was recording at the time.</li><li><strong>The adversary.</strong> Per method, the spoofing route and what it costs. This is the section Module 2.1's verdict comes from; do not take the verdict on trust, find the spoofing results and read them.</li><li><strong>The recording problem.</strong> Most provenance is cheap if you were recording from the start and impossible afterwards. Say which of your claims are prospective-only, because that determines whether a regime has to mandate logging before it can ever ask the question.</li><li><strong>The recommendation.</strong> One claim a regime could rest on today, one it should not, and the logging requirement that would move a claim from the second column to the first.</li></ul>\n<h3>Why it exists</h3>\n<p>\"The deployed model is the one that was evaluated\" is an assumption underneath every eval-based governance instrument in existence, and almost nobody has asked what establishes it. That makes this a small question with a very large blast radius.</p>\n<p>It also teaches the track's most durable habit on a fresh case: separate what a mechanism proves from what people assume it proves, and price the difference.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the proof-of-learning literature and its attacks, model-heritage and fingerprinting work, watermarking of weights, and standard integrity machinery (hashing, signing, logging).</p>\n<p><strong>Out of scope:</strong> implementing a method, and inventing one. Also out of scope: content provenance — watermarking <em>outputs</em> is a different problem with its own capstone in this bank.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Claims</td><td>\"Verify model provenance\"</td><td>Four distinct claims, ranked by difficulty, with the easy ones identified</td></tr><tr><td>Methods</td><td>Surveyed</td><td>Mapped to claims, with cost to the prover and confidence delivered</td></tr><tr><td>Adversary</td><td>\"Attacks exist\"</td><td>The specific spoofing results, read, with what they did and did not break</td></tr><tr><td>Recording</td><td>Unaddressed</td><td>Which claims are prospective-only, and the logging mandate that changes that</td></tr></tbody></table></div>\n<p>The most useful finding here is usually unglamorous: a signed checkpoint and a timestamp, required in advance, beats a clever proof nobody can run.</p>\n<h3>Getting started</h3>\n<ol><li>Write the four claims first. Most confusion in this area is two people proving different things and disagreeing about the result.</li><li>Read the spoofing papers before the proposal papers. It saves a week.</li><li>Ask of each claim: could this have been made trivial by a rule that existed before the run? Those are your recommendations.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 55, \"Reconciling Impact Scores for Comprehensive AI Risk Management\". Quoted:</p>\n<blockquote><p>AI is a cross-cutting risk that can have impacts which we could seek to measure across a wide number dimensions, from economic impact to loss of human life, environmental damage to public trust. The most appropriate units of measurement are different for each of these. Therefore, it would be useful to conduct a review of different approaches used in different impact assessment fields as to how these are combined, drawing out the pros and cons of each approach, and recommending some combination of these approaches based on which are well suited to AI risk assessment scores (including coming up with what the desirable factors are that would make it well-suited). For this project, it can be assumed the user/reader has already generated the impact and likelihood data for decomposed risks, but that we're struggling to combine these into a single score for a large risk area as a whole (e.g. job displacement by AI) and justify any exchange rates/other algorithm by which this is done.</p>\n<p>Research questions: How can we create unified, rigorous and consistent impact scores for AI risk assessments across risks of all domains? Are there quantitative methods that can be taken from other fields that can address the problem of creating a single impact score that acts as a \"currency converter\" between these different impacts — and how well could they apply to AI risk assessment? Methodology: literature review, comparative approaches, expert interviews, risk management.</p></blockquote>\n<h3>What you produce</h3>\n<p>The review and recommendation the idea specifies: how other impact-assessment fields combine incompatible scores, the pros and cons of each approach, and which combination suits AI risk assessment — including the desirable factors that make a method well-suited.</p>"
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
          "label": "Projects someone should maybe do — Catherine Brewer (2025), on red lines and consensus around eval standards",
          "href": "https://docs.google.com/document/d/1MQ8CbgOy13GTWkJr09D-0fdPKydnrYYWIgSys0BwuP8/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>\"Red line\" is the most agreed-upon phrase in AI governance and one of the least specified. Everyone signs the principle; nobody has to sign a sentence. Write the sentence.</p>\n<p>Pick one candidate red line — an autonomous-replication capability, a cyber-offence threshold, a specific uplift category — and produce:</p>\n<ul><li><strong>The definition.</strong> What is prohibited, in language a lawyer cannot drive a truck through and an engineer can recognise in a test result. This is genuinely hard and it is most of the work.</li><li><strong>The triggering evidence.</strong> What measurement establishes that the line has been crossed. Which eval, run by whom, under what elicitation, at what confidence. A red line without a trigger is a press release.</li><li><strong>The consensus analysis.</strong> Three actors who would have to accept it — pick real ones, e.g. two frontier developers and one regulator, or two states — and for each: what they gain, what they would resist, and the narrower version they might sign instead.</li><li><strong>The enforcement hook.</strong> What happens on a crossing, under what existing or proposed authority. Licence condition, procurement bar, liability trigger, treaty obligation, standard incorporated by reference.</li><li><strong>The two failure modes.</strong> Where your definition is over-inclusive (catches something harmless, so nobody adopts it) and under-inclusive (misses the thing you care about, so adopting it buys nothing). Both, named, in your own text.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 3 teaches you to mark up an RSP and find every weasel word. This is the constructive inverse: try to write a clause with no weasel words and discover which of them were load-bearing. The learners who do this stop reading vagueness as laziness and start reading it as the price of getting a signature.</p>\n<p>It is also the sharpest available exercise on the gap between <em>a capability that worries people</em> and <em>a capability that can be defined, measured, and acted on</em>. The technical-governance literature keeps returning to that gap; this is the version you can hold in your hand in three weeks.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one candidate line, public frontier safety frameworks, existing standards language to borrow structure from, and published eval methodologies for the trigger.</p>\n<p><strong>Out of scope:</strong> running the eval, and drafting statutory text. You need the obligation and its hook, not a bill.</p>\n<p><strong>Do not pick a line whose measurement does not exist yet.</strong> If no published eval could plausibly trigger it, you are writing an aspiration — say so explicitly and pick again in week one, because \"we cannot yet measure this\" is a finding that takes a paragraph, not three weeks.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The definition</td><td>\"Dangerous autonomous capability\"</td><td>A sentence with an observable in it, plus what it deliberately excludes</td></tr><tr><td>Trigger</td><td>\"If evals show the model is capable\"</td><td>A named eval, an elicitation, a threshold, and who is trusted to run it</td></tr><tr><td>Consensus</td><td>\"Stakeholders would need to agree\"</td><td>Three named actors, their objection, and the narrower line each would sign</td></tr><tr><td>Failure modes</td><td>One-sided</td><td>Both directions, with a worked example of each</td></tr></tbody></table></div>\n<p>The strongest submissions end up recommending a <em>narrower</em> line than the one they started with, and can say exactly what was given up to make it signable.</p>\n<h3>Getting started</h3>\n<ol><li>Write the over-inclusive failure first. Take your draft definition and find the harmless thing it bans. That test kills more drafts than any other.</li><li>Find the trigger before polishing the language. A definition nobody can measure will be rewritten from scratch once you go looking.</li><li>Ask, for each of your three actors, what they would say in public versus what would actually stop them signing. The gap is where the negotiation is.</li></ol>"
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
        "Verification 2.x — the evidence layers",
        "Verification 3 — covert development"
      ],
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Choose a real, published verification proposal — a layered monitoring scheme, a hardware-attestation design, a reporting regime — and build the case that it fails. Then say what it would take to fix.</p>\n<p>The report contains:</p>\n<ol><li><strong>The steelman.</strong> One page reconstructing the proposal at its strongest, in the authors' own terms. You do not get to attack a version they would not recognise.</li><li><strong>The attack tree.</strong> The defection goal at the root, branching into routes, each leaf annotated with the capability it requires and the cost it imposes on the defector.</li><li><strong>Detection reasoning.</strong> For each route: which layer would notice, what the signature looks like, what the base rate of false alarms does to the analyst on the other end.</li><li><strong>The three that work.</strong> Rank the routes; defend the top three as the ones a real actor would choose, and say why the rest are theatre.</li><li><strong>The patch list.</strong> What each surviving route demands — a mechanism, a reporting rule, an institution — and what that patch costs the regime in intrusiveness, money, or political feasibility.</li></ol>\n<h3>Why it exists</h3>\n<p>Verification proposals are usually evaluated by people who want them to work. The failure mode of the field is a mechanism that looks sound at the level of the diagram and dissolves on contact with a motivated actor with a budget. The skill this builds — attacking a design you find sympathetic, in public, with the costs stated — is the one that separates an analyst from an advocate.</p>\n<p>Teams of two or three work better here than solos: one person's steelman is another person's attack surface, and the argument you have in week two is the point.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> open literature, the track's evasion taxonomy, and cost estimates you can defend within an order of magnitude.</p>\n<p><strong>Out of scope:</strong> operational detail that reads as a how-to. Name the route and the signature; you do not need to write the playbook. If a paragraph would be more useful to a defector than to a defender, cut it — the report is a defence artifact.</p>\n<h3>What good looks like</h3>\n<ul><li>The steelman is good enough that a reader who skipped the attack would come away understanding the proposal better.</li><li>Attack costs are stated with units and a source, even when rough.</li><li>The patch list is honest about the patches that make the regime politically dead. \"Fixable, but only by something no one will sign\" is a finding, not a failure.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Pick a proposal you <em>like</em>. Attacking a design you already distrust produces a weak steelman and a boring report.</li><li>Build the attack tree before reading the evasion literature again — then read it and see what you missed. The gap is diagnostic.</li><li>Agree in your team, in writing, on what counts as a successful evasion before you start scoring routes.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>In most jurisdictions a significant rule cannot proceed without an impact analysis, and that document — not the debate — is where a rule is narrowed, delayed or killed. AI advocacy almost never produces one, which means the only version in the file is the one written by whoever wants a different outcome.</p>\n<p>Write one for a real, live proposal.</p>\n<ul><li><strong>The baseline.</strong> What happens without the rule. Impact analysis is always a comparison, and a sloppy baseline is the most common way these documents mislead.</li><li><strong>Compliance costs.</strong> Who bears what: engineering time, testing, reporting, legal review, delay to market. Itemised, with a per-firm figure at two different firm sizes — the distributional point is usually the most consequential finding.</li><li><strong>Benefits.</strong> The honest hard part. Some are quantifiable (fewer incidents of a measurable kind); the ones people care most about are low-probability and high-severity, and standard practice handles those badly. Do what you can, then say clearly what you could not monetise and why leaving it at zero would be wrong.</li><li><strong>The alternatives.</strong> At least three, including doing nothing and a substantially cheaper version. Review offices ask for this and its absence is the most common reason an analysis is sent back.</li><li><strong>Break-even framing.</strong> Where the benefits resist valuation, invert it: how large would the avoided harm have to be for this rule to pay for itself? A break-even statement is often more honest and more persuasive than a fabricated expected value.</li><li><strong>The method critique.</strong> Two pages on where standard practice fails here: discounting over long horizons, fat tails, irreversibility, and benefits that accrue to people outside the jurisdiction doing the analysis.</li></ul>\n<h3>Why it exists</h3>\n<p>This is the single most under-supplied document type in AI policy and one of the most consequential. A learner who can produce a defensible impact analysis is immediately useful to a think tank, an agency or an advocacy organisation, and very few people entering the field can.</p>\n<p>It also lands squarely on week 8's lesson. Cost-benefit analysis forces your strategic premises into numbers: your timeline beliefs, your risk estimates and your discount rate all become visible line items, and disagreements that were rhetorical become arithmetic.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one live or recently finalised proposal with a public text, published impact analyses from other domains as method templates, and public cost data.</p>\n<p><strong>Out of scope:</strong> an original economic model, and precision. Ranges with stated assumptions throughout.</p>\n<p><strong>Do not write an advocacy document with a table in it.</strong> If your analysis cannot produce a number that embarrasses your own position somewhere, it is not an impact analysis.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Baseline</td><td>Implicit</td><td>Stated explicitly, with what changes without the rule</td></tr><tr><td>Costs</td><td>A total</td><td>Itemised, per firm at two sizes, with the distributional effect named</td></tr><tr><td>Benefits</td><td>A confident expected value</td><td>What was monetised, what was not, and a break-even statement for the rest</td></tr><tr><td>Alternatives</td><td>One option</td><td>Three, including do-nothing and a cheaper variant, each costed</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Read one real impact analysis from another domain before writing. The genre has conventions and reviewers read for them.</li><li>Do the compliance costs first. They are tractable, and having them anchors the much harder benefits conversation.</li><li>Write the break-even statement early. It is usually the most quotable sentence in the document and it disciplines everything above it.</li></ol>"
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
          "label": "A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)",
          "href": "https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Governance arguments run on numbers other people produced. A benchmark score that a frontier safety framework maps to a threshold. A training-compute estimate that decides which side of a regulatory line a model falls. Pick one such number and reproduce it.</p>\n<p>Deliver:</p>\n<ul><li><strong>The notebook.</strong> Runs top to bottom on free Colab plus a small open model or a cheap API call. Pinned versions, fixed seeds, stated runtime and cost.</li><li><strong>The comparison.</strong> Your number beside the published one, with the gap quantified rather than smoothed. For an eval score that means stating your elicitation in full; for a compute estimate it means showing the architecture and token assumptions you had to guess.</li><li><strong>The sensitivity check.</strong> Vary one thing the source left to the reader — prompt format, few-shot count, sampling, an assumed parameter count — and report how much the number moves. Week 4 taught you this on your own eval; here you do it to somebody else's published claim.</li><li><strong>The note.</strong> Two pages for a policy reader: what was underspecified, what the number is sensitive to, what you could not reproduce, and the sentence they should use instead if they were going to cite it.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 4 teaches that eval scores are elicitation-dependent and Weeks 1–2 teach that compute estimates are assumption-dependent. Both lessons stay abstract until you try to land on somebody else's published figure and miss.</p>\n<p>Replication is also the cheapest way into empirical governance work: you need no new idea, so all the effort goes into method, which is where the skill lives. The track's own production plan lists \"replicate a published number\" as the extension for technically strong participants — this is that extension grown into a capstone with an audience attached.</p>\n<p>A last reason, which the field keeps re-learning: numbers rot. A figure computed against one model generation, one framework version and one elicitation convention does not stay true, and nothing about the way it gets cited announces that. Your note is the thing that says so.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one published number from a benchmark, a lab system card, an eval paper, or a public compute-estimate dataset. Small open models and cheap API calls.</p>\n<p><strong>Out of scope:</strong> frontier-scale reproductions, extending the result, and picking a number because it is famous. Pick by whether the method is described concretely enough to follow — and if it is not, say so, because <em>that</em> is a finding a policy reader needs.</p>\n<p><strong>Choose something that fits in one figure or one table.</strong> Reproducing a whole paper means three weeks of setup and no findings.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Scope choice</td><td>A whole paper</td><td>One number, done properly, with its provenance traced</td></tr><tr><td>Fidelity</td><td>\"Roughly similar\"</td><td>Side-by-side figures, with the gap quantified and explained</td></tr><tr><td>Sensitivity</td><td>Not tested</td><td>One documented variation, with the effect on the number reported</td></tr><tr><td>The note</td><td>A lab diary</td><td>A replacement sentence a policy reader can actually cite</td></tr></tbody></table></div>\n<p>\"I could not reproduce it, and here is exactly where the trail goes cold\" is a strong submission — especially when the trail goes cold because the source never specified something load-bearing.</p>\n<h3>Getting started</h3>\n<ol><li>Before committing, spend ninety minutes trying to run the source's own code or rebuild its calculation. That session tells you more about feasibility than a week of reading.</li><li>Write down the three things the method leaves to you <em>before</em> you start. Those become your sensitivity checks and, usually, the note's spine.</li><li>Log every run from the first one, including the broken ones. The failed runs are the note.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>There are, publicly and for free, several hundred AI governance research ideas that nobody has picked up. They are ideas, not projects. Turn one into a project.</p>\n<p>Two pages, in the shape a <a href=\"https://coefficientgiving.org/funds/navigating-transformative-ai/request-for-proposals-improving-capability-evaluations/\">request for proposals</a> asks for:</p>\n<ul><li><strong>The question</strong>, in one sentence, answerable in the time you are asking for.</li><li><strong>Why it is not answered already.</strong> The three closest existing pieces of work and what each leaves open. This section is where most proposals are actually rejected.</li><li><strong>Method.</strong> What you would do, in enough detail that a reader can imagine the working week. Sources, interviews, datasets, analysis.</li><li><strong>Output and audience.</strong> What exists at the end, and who reads it. \"A report\" is not an audience.</li><li><strong>Budget and timeline.</strong> Real numbers. Your own time at a defensible rate, plus anything you have to buy. Milestones with dates.</li><li><strong>The falsifier.</strong> What result would tell you the project failed, and what you would do then. Proposals without this read as advocacy.</li><li><strong>Risks.</strong> Including the honest one: what makes this project not worth funding.</li></ul>\n<h3>Why it exists</h3>\n<p>This is the cheapest capstone in the bank and one of the most transferable. Everything downstream of the program — grants, fellowship applications, a first job in a policy shop — is gated on a two-page document with this exact shape. Most people write their first one under deadline, badly.</p>\n<p>It also teaches a specific discipline the track cares about: the difference between a topic and a question. An idea list gives you topics. A funder buys questions, with a stated end.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> any idea from a published agenda, or one of your own if you can point at the gap it fills. Desk research to establish what exists.</p>\n<p><strong>Out of scope:</strong> doing the research. This is the proposal, and the temptation to start answering the question is the main way this capstone overruns.</p>\n<p><strong>Two pages is the constraint, not a target.</strong> A four-page proposal that \"needed the space\" has failed the exercise. Cutting is the skill.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The question</td><td>\"Investigate compute governance\"</td><td>One sentence with a scope, a method and an end date implied in it</td></tr><tr><td>Prior work</td><td>\"Little has been written\"</td><td>Three named pieces and exactly what each leaves open</td></tr><tr><td>Budget</td><td>Omitted or round</td><td>Itemised, with your rate stated and the largest line defended</td></tr><tr><td>Falsifier</td><td>Absent</td><td>A specific result that would end the project, and what you would do next</td></tr></tbody></table></div>\n<p>The tell of a strong proposal: a reader who disagrees with your conclusion can still tell you exactly which line of the budget to cut.</p>\n<h3>Getting started</h3>\n<ol><li>Read thirty ideas before choosing one. The first idea that excites you is usually the one that is exciting because it is vague.</li><li>Do the prior-work search before writing anything else. It kills roughly half of all candidate questions, and killing one in week one is free.</li><li>Write the falsifier third, not last. If you cannot state one, the question is not yet a question.</li></ol>"
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
          "label": "Ten AI safety projects I'd like people to work on — Julian Hazell, project 7 ($10 billion AI resilience plan)",
          "href": "https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Policy windows open without warning and close fast. When one opens, whoever has a costed plan on the shelf wins, and everyone else writes one in a week and spends it badly. There is no shelf-ready AI resilience plan at scale.</p>\n<p>Write one.</p>\n<ul><li><strong>The allocation.</strong> Line items with amounts. Alignment and safety research, evaluation and audit capacity, security for model weights, government technical capacity, biosecurity and cyber defence hardening, compute for independent researchers, workforce and institutional capacity. Your split, your reasoning.</li><li><strong>Absorptive capacity.</strong> The constraint that makes this hard and that most wish-lists ignore. For each line: could the money be spent well <em>next year</em>, or does the field lack the people to absorb it? A line that needs five years of pipeline-building to use is a different instrument from one that scales tomorrow, and mixing them is how large programmes waste money visibly.</li><li><strong>Sequencing.</strong> What happens in year one, two, three. Which lines unlock others.</li><li><strong>The theory of change per line.</strong> One sentence each: what changes because this was funded. Lines that cannot pass this test come out.</li><li><strong>The cut list.</strong> Ranked. What goes first if the number becomes two billion, and what you would protect down to the last dollar. This section is the one a staffer will actually read.</li><li><strong>Scenario robustness.</strong> Run the plan across short and long timelines. Say which lines are bets on one scenario and which hold in both.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 8 teaches that timing decides which recommendations land, and that strategic premises silently drive policy disagreements. A budget makes both visible: you cannot allocate ten billion dollars without revealing your timeline beliefs, and the argument you have with your teammates about the split <em>is</em> the strategic disagreement, made numerate.</p>\n<p>Absorptive capacity is the specific lesson worth the four weeks. The instinct is to fund the most important thing; the constraint is what the field can actually convert into work this year. Learning to separate those two changes how you read every funding announcement afterwards.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public information on current funding levels, organisation sizes, and existing government programmes as cost anchors. Order-of-magnitude figures.</p>\n<p><strong>Out of scope:</strong> the politics of getting the money appropriated, and precision. This is an allocation argument, not an appropriations strategy.</p>\n<p><strong>Ten billion is the constraint, not a wish list.</strong> If your lines sum to more, you have not done the exercise; the cutting is the work.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Lines</td><td>Categories with amounts</td><td>Amounts anchored to real current spend and real organisation sizes</td></tr><tr><td>Absorptive capacity</td><td>Ignored</td><td>Per line, whether it could be spent well next year, with the bottleneck named</td></tr><tr><td>Theory of change</td><td>\"Advances safety\"</td><td>One sentence per line saying what changes, and lines cut for failing it</td></tr><tr><td>Cut list</td><td>Absent</td><td>Ranked, down to a two-billion version, with the protected core identified</td></tr></tbody></table></div>\n<p>The strongest plans allocate visibly less than they would like to the line the team cares most about, because that field cannot absorb it yet — and say so.</p>\n<h3>Getting started</h3>\n<ol><li>Find the current annual spend on two of your lines in week one. Without anchors every number is arbitrary and the plan reads as fantasy.</li><li>Do the cut list before finishing the full plan. It reveals what you actually believe, and the full plan then has to justify itself against it.</li><li>Have each team member write the split independently before comparing. Where you diverge is the strategic disagreement, and it is worth a session.</li></ol>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 10",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>A voluntary framework nobody is scored against is indistinguishable from a press release. The orphan catalogue puts it plainly: the <a href=\"https://www.nist.gov/itl/ai-risk-management-framework\">guidelines</a> are published, a rating system exists, and it is not obvious that the major developers actually comply — or even that they have promised to.</p>\n<p>Build the instrument that would tell you.</p>\n<ul><li><strong>The checklist.</strong> Decompose the framework's functions into items that are <em>externally checkable</em>. That constraint does most of the work: \"govern\" becomes something like \"publishes a named accountable role for model release decisions\". Items nobody outside the company could ever verify get dropped, and the count of what you dropped is itself a finding.</li><li><strong>The scoring rule.</strong> Written before you score anyone. What counts as evidence, what counts as partial, and what an absence means — because on public evidence, absence of documentation is not absence of practice, and your rule has to say how it treats that.</li><li><strong>The scores.</strong> Three developers, scored, with an evidence log: one row per item per company, with the URL and the date.</li><li><strong>Double-coding.</strong> Two people score an overlapping subset independently. Report the disagreement rate. A scorecard without one is an opinion with a table around it.</li><li><strong>The limits note.</strong> What this scorecard would say about a company that documents well and practises badly, and vice versa.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 3 teaches clause-level reading of voluntary commitments; week 6 covers standards bodies and what incorporation by reference does. This joins them: a voluntary standard becomes real when somebody scores against it in public, and the scoring rule is where all the contestable judgement lives.</p>\n<p>The transferable skill is rubric design under public-evidence constraints — the same skill behind index-building, comparative jurisdiction work, and any \"which of these is actually complying\" question, which is most of the job in think-tank policy research.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the published framework, developers' public documentation — model cards, system cards, safety frameworks, transparency reports — and existing third-party rating work as a comparison for your method.</p>\n<p><strong>Out of scope:</strong> interviews, non-public information, and scoring more than three companies. Depth and a defensible rule beat coverage.</p>\n<p><strong>Publish the rule with the scores, always.</strong> A score whose method is not visible cannot be argued with, which makes it useless to the person you wrote it for.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Items</td><td>Restated framework language</td><td>Externally checkable statements, with the dropped items counted</td></tr><tr><td>Rule</td><td>Applied by judgement</td><td>Written first, double-coded, disagreement rate reported</td></tr><tr><td>Evidence</td><td>\"Based on public sources\"</td><td>One row per item per company with URL and date</td></tr><tr><td>Limits</td><td>Claims to measure safety</td><td>Says clearly it measures documentation, and what that does and does not imply</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Try to score one company on five items before building the full checklist. You will discover which items are checkable, and it takes an afternoon.</li><li>Write the absence rule early and stick to it. Deciding case by case is how a scorecard becomes an argument about the companies you already liked.</li><li>Date every piece of evidence. This artifact rots faster than anything else in the bank, and a dated log is what makes it re-runnable.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 4 teaches sandbagging as an eval-methodology problem. It is also an incentive problem, and the incentive version is unsolved: when a threshold attaches a consequence to a score, the party running the eval is the party who benefits from a low one. Nobody has designed the counter-incentives.</p>\n<p>Deliver:</p>\n<ul><li><strong>The sandbagging taxonomy for your case.</strong> Deliberate under-elicitation is only one route. Also: a weak scaffold, an unrepresentative prompt set, a checkpoint that is not the deployed model, stopping the search early, running the eval five times and reporting the median. Rank them by how deniable each is — deniability is what makes a route attractive.</li><li><strong>Detection.</strong> For each route, what would reveal it. Independent re-runs, mandated elicitation floors, held-out sets, publication of full logs, comparison against an external baseline. Say honestly which routes have no detection at all.</li><li><strong>The incentive.</strong> The core deliverable. Penalty scaled to what the low score bought, plus the reporting rule that makes the penalty attachable — you cannot punish under-elicitation without a stated standard of elicitation to fall short of.</li><li><strong>The perverse-effect check.</strong> Every anti-sandbagging rule pushes somewhere. A mandated elicitation floor can become a ceiling. Aggressive penalties can stop developers running exploratory evals at all. Name the effect your design produces and say why it is worth it.</li></ul>\n<h3>Why it exists</h3>\n<p>This is where the technical and policy halves of the track have to meet. A pure methodology answer (\"elicit harder\") ignores that the elicitor chooses how hard; a pure policy answer (\"penalise sandbagging\") ignores that you cannot detect it without methodology. Learners who can hold both are exactly what technical-governance teams are hiring for.</p>\n<p>It also generalises. Self-reported measurement under a threshold with consequences is the same structure as emissions testing, drug trials and safety certification — and every one of those had to solve this, badly, before it solved it well.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published eval methodology, frontier safety frameworks and their threshold language, and analogous testing regimes in other industries.</p>\n<p><strong>Out of scope:</strong> building a sandbagging detector, and proving any specific developer has done it. This is design work about an incentive structure, not an accusation.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Taxonomy</td><td>\"Developers might underreport\"</td><td>Routes ranked by deniability, with the most deniable identified</td></tr><tr><td>Detection</td><td>\"Independent verification\"</td><td>Per route, the specific check — and the routes with none, named</td></tr><tr><td>Incentive</td><td>\"Significant penalties\"</td><td>Scaled to the benefit obtained, attached to a stated elicitation standard</td></tr><tr><td>Perverse effects</td><td>Unconsidered</td><td>The effect your rule produces, and the trade you accept</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Rank the routes by deniability first. Deliberate lying is the easy case and the least likely; the design problem is the manoeuvres that look like ordinary methodological choices.</li><li>Write the elicitation standard before the penalty. Without it there is nothing to enforce against.</li><li>Test your rule against an honest developer having a bad quarter. If it punishes them too, redesign.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>No verification regime finds everything. The question a negotiator actually faces is not \"can they hide compute?\" but \"does the amount they can hide matter?\" — an agreement survives concealment that is strategically irrelevant and dies of concealment that is not. Locate the line.</p>\n<ul><li><strong>Three concealment postures.</strong> A small clandestine cluster; a distributed network of sub-threshold sites; one large secret datacenter. For each, estimate what it could train or run in a fixed window, and what hiding it costs the evader in efficiency, security and detection risk.</li><li><strong>The capability translation.</strong> Turn hidden compute into hidden capability honestly: what the concealed capacity yields relative to the frontier at signing time, and how that gap moves over the agreement's life.</li><li><strong>The strategic effect.</strong> When does the hidden capability change decisions — the evader's confidence, the detector's response, the agreement's collapse conditions? A breakout that arrives too late to matter is not a breakout.</li><li><strong>The sensitivity table.</strong> Which assumptions move the answer: detection probability per posture, efficiency of concealed operation, the capability-per-compute curve. The table is the deliverable's spine — it shows where the conclusion is robust and where it is hostage.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.3 rates the footprints concealment leaves; Module 3 catalogues the postures. This brief asks the question those two modules set up but do not answer: how much leakage a regime can tolerate before the agreement it serves loses its point. Module 4.1's layering logic needs that number — it is the requirement the verification stack is built against.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public compute-to-capability reasoning, the three postures above, and explicit stated-assumption arithmetic.</p>\n<p><strong>Out of scope:</strong> intelligence assessments of any real state's programs, and classified-adjacent sourcing. The scenarios are constructed, and say so.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Postures</td><td>\"They could hide compute\"</td><td>Three postures with size, cost and detection exposure each</td></tr><tr><td>Capability</td><td>FLOPs as the answer</td><td>FLOPs translated to capability against a moving frontier, with stated error</td></tr><tr><td>Strategy</td><td>\"This would be bad\"</td><td>The decision each hidden capability actually changes, and when</td></tr><tr><td>Sensitivity</td><td>One scenario, one verdict</td><td>The assumptions that flip the verdict, tabulated</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Fix the agreement first — what is paused, for how long, measured how. \"How much hidden compute matters\" has no answer without it.</li><li>Build the smallest posture end-to-end before starting the other two; the template transfers.</li><li>Keep a running list of every number you assumed. That list, priced, becomes the sensitivity table.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>Every signal in the intelligence layer is individually deniable: power draw has civilian explanations, cooling capacity has customers, procurement has intermediaries, construction has cover stories. Decisions get made anyway. The project is to write the standard that says when accumulated maybes justify the costly, adversarial step of demanding an inspection.</p>\n<ul><li><strong>The packet.</strong> Construct a fictional intelligence packet about a suspected undeclared facility: energy contracts, cooling equipment orders, chip procurement traces, satellite construction imagery, each with a stated reliability and a plausible innocent explanation.</li><li><strong>The tiers.</strong> Define the ladder — anomaly, plausible evidence, confirmed violation — and the tests that move a case between tiers. The tests must be written before looking at the packet, or they will be reverse-fitted to it.</li><li><strong>The escalation ladder.</strong> What each tier licenses: a clarification request, enhanced monitoring, a challenge inspection. Include the cost of being wrong at each rung — a bounced accusation spends credibility the regime needs later.</li><li><strong>The memo.</strong> Run your own packet through your own rubric and write the decision memo the agency head would sign, dissent included if the evidence is genuinely marginal.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.3 rates each footprint on what it tells a verifier and its main caveat; what it leaves open is aggregation — how a decider combines weak signals into a defensible act. Regimes have died at exactly this joint: inspection demanded too early burns the agreement, too late makes it ornamental. The rubric is where that judgement stops being vibes.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the public characteristics of the named signal types, a constructed scenario, and institutional reasoning about escalation.</p>\n<p><strong>Out of scope:</strong> real facilities, real states, and sources beyond the public literature. The packet is fictional and labelled as such throughout.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The packet</td><td>A pile of red flags</td><td>Signals with stated reliability and the innocent explanation priced in</td></tr><tr><td>Tiers</td><td>Named but soft</td><td>Tests that decide tier transitions, written before the packet</td></tr><tr><td>Escalation</td><td>\"Then we inspect\"</td><td>Each rung's action and the cost of being wrong at it</td></tr><tr><td>The memo</td><td>A verdict</td><td>A signable decision with its uncertainty carried honestly</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the tier tests before assembling the packet — that ordering is the whole discipline of the exercise.</li><li>Give every signal in the packet its innocent explanation at creation time. A packet without alibis tests nothing.</li><li>Set the false-alarm budget explicitly: how many bounced inspections the regime survives per decade. The rubric must respect it.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 65, \"Stock and Flow Accounting Case Studies\". Quoted:</p>\n<blockquote><p>One likely building block for any maximally secure compute governance regime is stock and flow accounting of (some kinds of) compute: e.g., requiring real time accurate declaration to regulators of who possesses which uniquely numbered regulated chips, with penalties for undeclared or unauthorised transfers. To understand the optimal design and feasibility of such a regime, it would be useful to know more about historical analogies for similar regimes. An ideal analogy will have many of the following traits: the thing being tracked is a physical object; is economically important; is dual-use; the tracking regime requires registration of current ownership and any transfers; the tracking regime imposes penalties for failing to register ownership or transfer.</p>\n<p>Such case studies should include: a description of the item being tracked, and the reason governments want to track it; methods that governments use to track the items; penalties for loss or misrepresentation of custody of the item; effectiveness of the tracking regime (ideally with quantitative estimates of how much of the item is lost or illicitly transferred).</p>\n<p>Promising candidates might include: firearms, automobiles, certain pharmaceutical products, aircraft, chemical weapons and precursors, high-risk chemicals, select biodefense agents and toxins. Less promising — but still plausible — candidates may include ITAR-controlled items, real estate, financial instruments. There are already good case studies on tracking nuclear fissile material, so it is not a promising area of additional research at the moment.</p>\n<p>Research questions: What can we learn from case studies on stock-and-flow tracking? How could such a regime be designed for compute? Methodology: case studies, literature review, expert interviews.</p></blockquote>\n<h3>What you produce</h3>\n<p>Case studies on exactly the template the idea specifies — the item and why it is tracked, the tracking methods, the penalties, and the regime's measured effectiveness — for candidates from the idea's own list, plus the concluding note the second research question asks for: what this implies for a compute regime's design.</p>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 3",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The orphan catalogue notes the shape of the gap exactly: the idea has been discussed since 2019, it ought to be a fifty-state project, and while a few states have tinkered with existing tort law, no strict-liability model language is on offer for any legislature to adopt. Supply it for one.</p>\n<ul><li><strong>The bill.</strong> Scope (which systems, which harms), the standard imposed, defences preserved, damages, who may sue, effective date. Drafted in the style your chosen state actually uses — go read three of its recent tech bills before you write a line.</li><li><strong>The definition problem.</strong> Strict liability needs a defined class of defendant and a defined class of product. \"AI system\" as a statutory term is where most drafts either sweep in every spreadsheet or exclude the thing you meant. Say what you chose and show the two edge cases it decides.</li><li><strong>The variance note.</strong> Two other states with materially different tort regimes: what breaks when you port your text, and what has to change.</li><li><strong>The incidence memo.</strong> One page: who ends up bearing this. Developer, deployer, insurer, or the user through price. A liability rule that lands on the party with no control is a rule that buys nothing.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 3 has you dissect somebody else's bill clause by clause; week 6 covers liability allocation as a design choice. This is the two of them run forwards. Drafting teaches something reading cannot: that almost every ambiguity you found in the RSP markup exists because the alternative was to decide something the drafter could not get agreement on.</p>\n<p>It is also close to real entry-level policy work. Model bills are what advocacy organisations actually produce, and a good one is portable.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one state, its drafting conventions, existing products-liability and ultrahazardous-activity doctrine, and the AI-liability literature.</p>\n<p><strong>Out of scope:</strong> federal preemption analysis beyond a flag, and a fifty-state survey. One state properly, two states compared, and an honest note that the rest is a project.</p>\n<p><strong>Not a policy argument.</strong> The case for strict liability has been made elsewhere; you are being graded on whether the instrument works, including if you conclude a negligence standard with a presumption would do the job better.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The text</td><td>Principles in bill format</td><td>Operative sections with defined terms, defences and a damages provision</td></tr><tr><td>Definitions</td><td>\"Artificial intelligence system means…\" borrowed wholesale</td><td>Chosen deliberately, with two edge cases worked and decided</td></tr><tr><td>Portability</td><td>\"Other states could adapt this\"</td><td>Two named states, what breaks, what changes</td></tr><tr><td>Incidence</td><td>Unaddressed</td><td>Who bears the cost, and whether they can do anything about the risk</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Read three recent bills from your state, of any subject, for form. Drafting convention is half of whether counsel can use your text.</li><li>Decide the defendant class before the standard. Everything else follows from who you are trying to reach.</li><li>Test the definition against a deliberately silly system and a deliberately frontier one on day two. If both come out the same, redraft.</li></ol>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 11",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 6's exercise has you design a tiered API-access scheme for a hypothetical dual-use model and defend the trade-offs. This is that exercise pointed at a real gap: several companies offer structured access, nobody has said what the minimum acceptable version is, and so \"we provide researcher access\" is currently unfalsifiable.</p>\n<p>Write the floor.</p>\n<ul><li><strong>The capability list.</strong> What an external researcher must be able to <em>do</em> — not what they must be granted. Rate limits high enough to run a real eval. Logprobs or not. Fine-tuning or not. The base model or only the deployed one. Enough attempts to characterise variance rather than sample it. Publication without pre-approval, or with what kind.</li><li><strong>The tiers.</strong> Who gets what: a credentialled auditor under contract, an academic, a journalist, anyone. Each tier's entry requirement and each tier's ceiling.</li><li><strong>What the company keeps.</strong> Weights, training data, unreleased checkpoints, and the commercial information a competitor could reconstruct from usage patterns. A standard that ignores this is one no company adopts, which makes it a floor of zero.</li><li><strong>The gaming section.</strong> How a company complies with your standard in letter and defeats it in practice — a tier nobody qualifies for, an approval queue measured in months, a rate limit that technically permits the eval you cannot afford to run. Then the language that closes each.</li></ul>\n<h3>Why it exists</h3>\n<p>Almost every accountability mechanism in AI governance — third-party audit, independent evals, incident investigation, the attestation work elsewhere in this bank — assumes an outsider can get at the system. Nobody has specified what \"get at\" means, so every downstream proposal quietly inherits an undefined dependency.</p>\n<p>Week 6 gives you the design vocabulary. The addition here is that a <em>minimum</em> is a different object from a <em>scheme</em>: it has to be the version that still works when written by someone who does not want to grant it.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published access programmes, the structured-access literature, audit and researcher-access provisions in existing regulation, and what published external evaluations actually needed to run.</p>\n<p><strong>Out of scope:</strong> the enforcement instrument. Whether this arrives as a licence condition, a procurement requirement or a voluntary commitment is a policy-track question — write the standard so any of them could adopt it.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Capabilities</td><td>\"Meaningful API access\"</td><td>Named affordances with numbers, justified by what a real eval needed</td></tr><tr><td>Tiers</td><td>One level</td><td>Tiers with entry requirements and ceilings, and who falls between them</td></tr><tr><td>Company interests</td><td>Ignored or waved through</td><td>Specific: what is protected, and why that protection does not hollow out the floor</td></tr><tr><td>Gaming</td><td>Absent</td><td>Four compliance-in-letter manoeuvres, each with the closing language</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Find two published external evaluations and work out what access they needed. Your floor should be the level at which that work is possible.</li><li>Write the gaming section in week one. It is the fastest way to find out which of your requirements are load-bearing.</li><li>Ask of every requirement: could a company say yes to this and still be useless to an auditor? If yes, it is not yet a requirement.</li></ol>"
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
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can AI models be trained using a large number of small compute clusters?",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 3's eighth evasion scenario is sub-threshold fragmentation: split the run across enough small clusters, accounts or jurisdictions and no single reported quantity crosses the line. Everyone concedes it is possible in principle. The question that decides whether it matters is how expensive it is in practice.</p>\n<ul><li><strong>The technical ceiling.</strong> What decentralised and low-communication training can actually do today, at what scale, and how far behind a co-located run of the same nominal compute it lands. Bandwidth and latency are the binding constraints; say what they cost in wall-clock and in achieved quality.</li><li><strong>The overhead.</strong> The multiplier a fragmenter pays — in time, in total compute, in engineering. That number, more than any argument, determines whether the route is used.</li><li><strong>What fragments and what does not.</strong> Splitting across accounts inside one provider is a different problem from splitting across providers, and both are different from splitting across borders. Some are trivial and some are research problems. Separate them.</li><li><strong>What still shows.</strong> Aggregate procurement, power, and the fact that somebody eventually has to assemble the pieces. Fragmentation hides the run from a per-cluster threshold; it does not hide it from every layer, and naming what remains visible is the constructive half.</li><li><strong>The threshold recommendation.</strong> Which threshold designs survive: aggregate across a corporate group, count over a rolling window, attach to procurement rather than to a run, index on the model rather than the training. Pick one and say what it costs in administrability.</li></ul>\n<h3>Why it exists</h3>\n<p>Threshold-based governance is the field's dominant instrument, and this is the evasion route that attacks its arithmetic rather than its enforcement. The track teaches thresholds in Module 2 and attacks them in Module 3; this capstone is that attack carried through to a redesign, which is the part learners usually skip.</p>\n<p>The pairing with the rest of the bank is deliberate. One capstone asks how fast a threshold decays, another asks what it counts, this one asks whether it can be arithmetically avoided. Those are the three ways a compute rule fails, and a cohort that has produced all three has a genuinely complete picture.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published work on decentralised and communication-efficient training, public reporting on distributed training efforts, and the track's threshold material.</p>\n<p><strong>Out of scope:</strong> running a distributed training experiment, and any operational detail about evading a specific regime in a specific place. You are assessing feasibility and redesigning the instrument, not writing a manual.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Feasibility</td><td>\"Distributed training is possible\"</td><td>A scale ceiling with a date, and the gap to a co-located run quantified</td></tr><tr><td>Overhead</td><td>Unquantified</td><td>A multiplier, with what drives it and how fast it is shrinking</td></tr><tr><td>Fragmentation modes</td><td>Treated as one thing</td><td>Separated by boundary crossed, each with its own difficulty</td></tr><tr><td>Recommendation</td><td>\"Thresholds should be robust\"</td><td>One design, with its administrative cost and what it still misses</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Get the overhead multiplier first, even roughly. If it is 10x, this is a theoretical concern; if it is 1.5x, the threshold design has to change now.</li><li>Separate the fragmentation modes on day two. Conflating account-splitting with cross-border distributed training makes every later claim mushy.</li><li>Write the \"what still shows\" section before the recommendation. The threshold you recommend should lean on whatever survives.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>\"Log the supply chain\" is a slogan until someone says where. Each stage — lithography, advanced packaging, high-bandwidth memory, networking equipment, final assembly — differs in how many firms sit there, what a unit of output even is, how hard the records are to fake, and how long a diversion stays invisible. Rank them.</p>\n<ul><li><strong>The criteria, fixed first.</strong> Concentration (how few actors must comply), measurability (is there a countable unit — wafers, stacks, switches — or a judgement call), forgeability (what faking the records costs, and who would have to collude), and detection lag (how long between a false entry and a contradiction arriving from elsewhere in the chain).</li><li><strong>The stages, scored.</strong> Each stage against each criterion, with a sentence of reasoning per cell — the matrix is an argument, not a spreadsheet.</li><li><strong>The cross-checks.</strong> Logs earn credibility where independent records can contradict them: a stage's output is another stage's input. Say which pairs of logging points check each other and which stand alone.</li><li><strong>The recommendation.</strong> One or two stages where a logging requirement would bind soonest, and what the requirement would actually say.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 1 puts the supply chain's bottleneck structure at the center of the verifier's map; Module 2.1 lists chip registries and supply-chain tracking among the hardware layer's mechanisms. Between the two sits an unexamined choice — where records do the most work — and this brief makes the choice explicitly, with criteria that survive being argued against.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public supply-chain structure at the named stages, and reasoning about record-keeping burdens from how those industries already operate.</p>\n<p><strong>Out of scope:</strong> firm-level confidential detail, and export-control legal design. The matrix informs where a rule would attach, not how to draft it.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Criteria</td><td>Implied</td><td>Four named criteria, defined before any scoring</td></tr><tr><td>Scores</td><td>Adjectives</td><td>Cells with a stated reason each, comparable across stages</td></tr><tr><td>Cross-checks</td><td>Absent</td><td>The pairs of logs that contradict each other, mapped</td></tr><tr><td>Verdict</td><td>\"Log everything\"</td><td>One or two attachment points, with the requirement sketched</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Define the unit of output per stage before scoring anything — measurability collapses without it.</li><li>Score forgeability as a cost, not a possibility: who colludes, what it costs them, what exposure they carry.</li><li>Draw the cross-check map before writing the recommendation; a stage that nothing contradicts should make you nervous, not confident.</li></ol>"
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
          "label": "Technical AI Governance project site — Stanford",
          "href": "https://taig.stanford.edu/"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The technical AI governance agenda makes a specific claim: governance is blocked in two ways at once — decision-makers lack information, and the technical tools that would produce that information do not exist. Pick one open problem where both are true and write the dossier that would let someone decide to build the missing tool.</p>\n<p>The dossier has four parts:</p>\n<ul><li><strong>The problem, restated as a decision.</strong> Not \"we lack good watermarking\" but \"actor A cannot currently establish B, so decision C is made blind.\" Name A, B and C.</li><li><strong>The tool.</strong> What would have to exist. Inputs, outputs, who runs it, what guarantee it gives and — the part most write-ups skip — what guarantee it explicitly does not give.</li><li><strong>The adoption path.</strong> A tool nobody adopts closes nothing. Who has to use it, what makes them, and whether that is a standard, a procurement clause, a statute, or commercial self-interest.</li><li><strong>The failure analysis.</strong> How the tool gets gamed, how it degrades as models change, and what a decision-maker would wrongly conclude if they trusted a gamed output.</li></ul>\n<h3>Why it exists</h3>\n<p>The track teaches you to read a governance proposal and ask \"could anyone verify that?\" This is the constructive version of the same move. It is also the piece of work most directly shaped like technical-governance employment: somebody hands you a policy ask, and you have to say what artifact would satisfy it and what it would take to get one.</p>\n<p>The agenda-level papers are deliberately broad. Depth on one problem is worth more than a survey of twelve, and you will find that the interesting content is almost always in the adoption path — the technical part is frequently the easy part.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one open problem, one tool, published literature, and the program's own track materials.</p>\n<p><strong>Out of scope:</strong> building the tool. This is a specification and a case, not an implementation. If you find yourself writing code, you have swapped this capstone for a different one.</p>\n<p><strong>Also out of scope:</strong> picking a problem because it is fashionable. The agenda has unglamorous entries — data provenance, compute accounting, post-deployment monitoring — and those usually have shorter adoption paths, which makes them better dossiers.</p>\n<h3>What good looks like</h3>\n<ul><li>The decision statement survives being read aloud to someone outside the field. If they ask \"so what?\", the restatement failed.</li><li>The adoption path names organisations, not categories. \"Standards bodies\" is not an answer; a named body with a named workstream is.</li><li>The failure analysis includes at least one way the tool makes things <em>worse</em> — false assurance is a real cost and the dossier should price it.</li><li>Somewhere in the dossier is a paragraph arguing the opposite conclusion, written well enough that a reader could act on it.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Read the agenda's problem list once for breadth, then pick by adoption path, not by technical interest. The problems worth a dossier are the ones where you can name who would use the answer.</li><li>Write the decision statement first, and rewrite it until it has a named actor and a named blocked decision.</li><li>Interview the literature adversarially: search specifically for people saying the tool already exists. Either they are right — pick again in week one — or you have found your dossier's strongest section.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>Tamper-resistance tries to make violation impossible; tamper-evidence only promises that violation leaves a mark. The second is dramatically cheaper and available now — seals, logs, one-way counters, broken-on-open enclosures. The question is institutional, not technical: under what conditions is a mark, found later, enough?</p>\n<ul><li><strong>The variables.</strong> Whether the facility is otherwise monitored; how often anyone looks (inspection frequency sets time-to-detection); how much harm accumulates between violation and discovery; and what actually happens to a violator once the mark is found.</li><li><strong>The comparison.</strong> Monitored versus unmonitored facilities, frequent versus rare inspection, reversible versus irreversible harms — worked as cases, not abstractions. A seal on a quarterly-inspected rack means something different from the same seal in a facility no one revisits.</li><li><strong>The framework.</strong> The output is a decision rule a regime designer can apply: given detection lag, harm accumulation rate, and enforcement credibility, tamper-evidence suffices here, and only prevention will do there.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.1 notes that secure boot and similar mechanisms were designed for the wrong adversary — governance inverts the threat model, and the owner is the party being caught. Tamper-evidence sidesteps the hardest part of that inversion by dropping the demand that hardware defeat its owner, keeping only the demand that the owner cannot hide having won. Where that weaker promise suffices, regimes get cheaper and deployable sooner; knowing where is the design skill this brief trains. It feeds directly into Module 4.1's layering decisions.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> existing tamper-evidence mechanisms as a class, and the institutional arithmetic of detection lag, accumulated harm and enforcement response.</p>\n<p><strong>Out of scope:</strong> designing new seals or enclosures, and formal security proofs. The framework consumes mechanism properties; it does not certify them.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Variables</td><td>\"It depends\"</td><td>The named variables, each with its effect on the verdict</td></tr><tr><td>Cases</td><td>One setting</td><td>Monitored and unmonitored, frequent and rare inspection, worked through</td></tr><tr><td>The rule</td><td>A vibe</td><td>A decision procedure someone else could apply and reach your answer</td></tr><tr><td>Limits</td><td>Unstated</td><td>The harms too fast or too irreversible for after-the-fact discovery, named</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the time line of one violation: mark made, harm accumulating, inspection arrives, response lands. Every variable in the framework is a segment of that line.</li><li>Work the friendliest case for tamper-evidence and the most hostile one before any middle cases — the framework lives between the two ends.</li><li>State the enforcement assumption explicitly. Evidence without a credible response converts every seal into decoration.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-06",
      "html": "<h3>The brief</h3>\n<p>The easy verdict on datacenter telemetry is that it cannot reliably tell a training run from anything else, so it proves nothing. The easy verdict skips the interesting question: useful under what decision procedure? A smoke detector cannot classify fires either. The project is to take one sensor mechanism — power draw, temperature, timing side-channels, pick one — and build the full security case for it, answering the Petrie questions in order:</p>\n<ul><li><strong>Who decides.</strong> The institution that acts on the feed, and what action the feed can trigger — a follow-up question, a challenge inspection, nothing on its own.</li><li><strong>What data they see.</strong> The exact signal, at what resolution, aggregated how. Every step of aggregation is privacy bought and evidence spent.</li><li><strong>Which false positives are tolerable.</strong> The workloads that will trip the sensor innocently, roughly how often, and what a false alarm costs each side. A tolerable rate for a follow-up question is an intolerable rate for an accusation.</li><li><strong>How it can be spoofed.</strong> What it costs the operator to make the signal lie — load shaping, thermal masking, replayed data — and which spoofs the surrounding regime would catch by other means.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 2.1 rates most telemetry proposals as not deployed and easily oversold; the correct response is not to discard the layer but to state precisely what a weak signal can support. A security case is the form that statement takes: claim, evidence, decision rule, failure modes, in one document a skeptic can attack line by line. Learners who can write one for a sensor can write one for anything in the stack.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one sensor mechanism, its public measurement characteristics, and the institutional side — who reads it, what it triggers.</p>\n<p><strong>Out of scope:</strong> building or fitting detectors, and mechanisms that require new silicon. The case is for a feed that could exist this year.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The claim</td><td>\"Telemetry helps\"</td><td>The exact proposition the feed supports, and the one it does not</td></tr><tr><td>Decision rule</td><td>Unstated</td><td>Named decider, named action, named threshold</td></tr><tr><td>False positives</td><td>Waved at</td><td>The innocent workloads listed, with the cost of each alarm</td></tr><tr><td>Spoofing</td><td>\"Possible\"</td><td>Priced, per spoof, against what the spoof conceals</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Pick the sensor and write the one-sentence claim it is supposed to support. If the sentence needs \"reliably classify\", pick a weaker claim.</li><li>Answer the Petrie questions in order and do not skip the second — most telemetry cases die on what the verifier is actually allowed to see.</li><li>Draft the spoofing section as the operator's counsel would. The case is finished when that section no longer surprises you.</li></ol>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The EU AI Act's 10²⁵ FLOP threshold and the US 10²⁶ threshold are fixed numbers pointed at a moving target. Measure the movement.</p>\n<p>Produce a notebook that:</p>\n<ul><li>Reconstructs training-compute estimates for a defensible set of models from public architecture and token counts, checked against a public compute database.</li><li>Determines which historical models would have crossed each threshold, and when.</li><li>Models the decay: given published compute-efficiency trends, how many models per year cross a fixed threshold in year 1, year 3, year 5 — and what fraction of <em>frontier</em> models that represents.</li><li>States the uncertainty honestly. Compute estimates are estimates; efficiency trends are fitted to noisy data. Propagate it or say you did not.</li></ul>\n<p>Then the memo: an indexing rule that keeps the threshold selective, and the costs of that rule. Every indexing scheme trades predictability for durability, and someone has to pay.</p>\n<h3>Why it exists</h3>\n<p>Threshold-based regulation is the workhorse of compute governance and its softest joint. A threshold that captured three labs at signing captures three hundred developers five years later, or none, depending on which way the trends run. Making the decay curve concrete is more persuasive than any amount of arguing about it.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public model data, published efficiency trends, your own estimates with stated method.</p>\n<p><strong>Out of scope:</strong> proprietary training details; predicting specific future models. You are characterising a rate, not forecasting a release calendar.</p>\n<h3>What good looks like</h3>\n<ul><li>The notebook runs end to end from a clean checkout. A result nobody can reproduce is a claim, not an analysis.</li><li>Every estimate carries its method and its error bar.</li><li>The memo's indexing proposal names who loses under it. Indexing to a rolling percentile of frontier compute is easy to write and hard to administer; say so.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Reproduce three compute estimates you can check against a public database before you build anything. Calibrate on the knowns first.</li><li>Decide early what \"frontier\" means in your denominator, and hold that definition all the way through. Most confusion here is definitional.</li><li>Draft the memo's one-sentence recommendation in week 1 and let the analysis try to kill it.</li></ol>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on\">Ten AI safety projects I'd like people to work on — Julian Hazell (2025)</a>, project 3, \"Tracking sketchy AI agent behaviour 'in the wild'\". Quoted:</p>\n<blockquote><p>What: Start an organization to systematically investigate deployed AI agents for signs of misalignment, scheming, or general sketchy behaviour in the wild. This could involve a number of possible activities: (1) partnering with AI companies to analyze anonymized interaction logs for concerning behaviour patterns, (2) creating honeypot environments to see if AI agents attempt to gain unauthorized access or resources, (3) interviewing power users of AI agents (e.g., companies) to gather preliminary signals of situations where agents might be doing sketchy things, and (4) writing about case studies of deployed agents acting sycophantic, manipulative, deceptive, etc.</p>\n<p>The organization could also publish detailed case studies of confirmed incidents and maintain a public database of problematic behaviours observed in deployed systems (though only ones relevant to misalignment, and not \"AI harm\" more broadly construed).</p>\n<p>Why this matters: […] LLMs are starting to exhibit increasingly sophisticated and concerning behaviour […] We should go a step further and try hard to check if these concerns are actually manifesting in real-world deployments (and if so, in what ways and at what scale). Thoughtful, rigorous, and real-world observational evidence about misalignment would be valuable for grounding policy discussions and improving the world's situational awareness about AI risk.</p>\n<p>What the first few months could look like: Picking 1-2 workstreams to start with, speaking with people working on relevant topics (e.g., at AI companies) to understand challenges/opportunities, and learning more about how other OSINT projects work (to understand analogies and disanalogies).</p></blockquote>\n<h3>What you produce</h3>\n<p>What the post's own \"first few months\" paragraph describes, on paper: the 1–2 workstreams you would start with and why, what the conversations with people at AI companies would need to establish, the OSINT analogies and disanalogies, and the format of the case studies and public database the organization would maintain.</p>"
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
      "updated": "2026-08-06",
      "html": "<h3>The idea, as posed</h3>\n<p>From <a href=\"https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024\">A Collection of AI Governance Research Ideas — von Knebel &amp; Anderljung (2024)</a>, idea 76, \"Understanding Training vs. Inference\". Quoted:</p>\n<blockquote><p>There is a common misconception that \"you need lots of compute for training, but once a model is trained, it's over, and everyone can deploy it.\" If the misunderstanding at the bottom of this is one that's based on mixing up \"training\" and \"inference\", then clearing up the distinction between the two could be a valuable use of a researcher's time. Inference is a \"continuous process\", it's deploying a model, serving a product, providing a service, whereas training is \"a bet\", building a product, etc. Down the line, this could help inform regulatory decisions on governing both training and deployment. It's also important since if you own ML hardware you have to decide if you want to use it for training or inference. That decision became even more important over the recent months. Training a model means not serving inference for a product.</p>\n<p>Research questions: How can we draw a clear distinction between training and inference? How can this difference be communicated well, including to non-technical audiences? What are the regulatory implications of this? (potentially out of scope) Methodology: literature review, distillation, expert interviews.</p></blockquote>\n<h3>What you produce</h3>\n<p>Exactly what the idea's methodology names: a distillation. A short note that draws the distinction cleanly, communicates it to a non-technical reader, and flags the regulatory implications the idea marks as the optional extension.</p>"
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
      "sources": [],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Pick the verification articles of one real agreement — New START, the CWC, the NPT safeguards system, the Open Skies Treaty — and redraft them so they would govern frontier AI development instead. Present it as a facing-page document: your clause on the left, your commentary on the right.</p>\n<p>The commentary is where the work is. For each clause, say:</p>\n<ul><li><strong>What it does in the original.</strong> The mechanism, not the aspiration.</li><li><strong>What it would do here.</strong> The translated obligation.</li><li><strong>The disanalogy.</strong> The property of nuclear material, chemical precursors, or overflight that made the original clause work, and whether AI has an equivalent.</li><li><strong>The residue.</strong> What the clause cannot carry across, and what would have to be invented to replace it.</li></ul>\n<h3>Why it exists</h3>\n<p>Arms control is the field's most-reached-for analogy and its most abused one. Fissile material is countable, chemical precursors have signatures, overflight is observable. Model weights are copyable, training runs are deniable, and the relevant capability lives partly in tacit knowledge. Working at clause resolution — not at the level of \"AI is like nukes\" — is the fastest way to learn which parts of the analogy survive.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the verification and inspection articles. Definitions, declarations, inspection rights, challenge procedures, dispute resolution.</p>\n<p><strong>Out of scope:</strong> the whole treaty. Entry-into-force clauses and withdrawal provisions are interesting and are not this assignment.</p>\n<h3>What good looks like</h3>\n<ul><li>The redraft is operable: an inspector could act on it.</li><li>At least one clause is marked <strong>untranslatable</strong>, with a defended reason. A redraft where everything carries over cleanly has not been thought about hard enough.</li><li>The commentary names the property doing the work in each original clause. \"Verification of non-production relied on the fact that enrichment leaves a physical plant\" is the register.</li></ul>\n<h3>Getting started</h3>\n<ol><li>Read the original articles once for structure, once for mechanism.</li><li>Mark every noun that names a physical thing. Those are the clauses that will fight you.</li><li>Draft the definitions section last — you will not know what you need to define until the operative clauses exist.</li></ol>\n<blockquote><p><strong>Status: draft.</strong> This entry's rubric is not yet aligned with the Module 0 treaty-anatomy exercise. Expect the scope to tighten before it is offered to a cohort.</p></blockquote>"
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
          "label": "Open Problems in Machine Unlearning for AI Safety — Barez et al. (2025)",
          "href": "https://arxiv.org/abs/2501.04952"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Unlearning appears in governance arguments as though it were deletion. The literature is much less sure. Find out for yourself, at small scale, and report a number.</p>\n<p>You will:</p>\n<ol><li>Pick one published unlearning method and one small open model you can train on the compute you actually have.</li><li>Reproduce the method against a benchmark capability. Confirm the reported effect — the capability measures as gone.</li><li>Attack it. Fine-tune on a small quantity of related data, or probe the representation directly, and measure how much it takes to bring the capability back.</li><li>Report the <strong>relearning cost</strong>: examples, steps, and wall-clock to recover the capability to some stated fraction of baseline.</li></ol>\n<p>The deliverable is a notebook another person can run end to end, plus a two-page finding written for someone who is not going to run it.</p>\n<h3>Why it exists</h3>\n<p>This is the only capstone in the bank where you personally generate the evidence that a governance claim rests on. Everywhere else in the program you are reading other people's numbers and asking how much weight they bear. Here you make one, and discover how contingent it is on choices you made on a Tuesday afternoon.</p>\n<p>It also produces something with a real audience: \"unlearning removed the capability\" is load-bearing in open-weight release arguments, and a reproducible relearning cost is directly usable by anyone auditing one.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> a small model (roughly ≤1B parameters), one method, one capability, and a public benchmark. Modest compute — this is designed to run on a single rented GPU across a few sessions.</p>\n<p><strong>Out of scope:</strong> frontier-scale models, a new unlearning method, and any capability with real-world misuse potential. Use a benign proxy capability — a fictional entity, a synthetic fact set, or a published unlearning benchmark's own target. The point is durability, not the subject matter.</p>\n<p><strong>Ambition warning.</strong> This is the most expensive capstone in the bank and the only one that can fail on its own terms — a reproduction that does not reproduce is a real outcome, and one you should be prepared to report. Do not take it if you need a guaranteed portfolio piece by a fixed date.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Reproduction</td><td>\"Broadly matched the paper\"</td><td>Numbers beside the paper's numbers, with deviations explained</td></tr><tr><td>The attack</td><td>One fine-tuning run</td><td>A cost curve: recovery against examples, with the knee identified</td></tr><tr><td>Honesty</td><td>Failed runs dropped</td><td>The runs that did not work are in the notebook, labelled</td></tr><tr><td>Reusability</td><td>Notebook runs on your machine</td><td>Fixed seeds, pinned versions, a stated runtime and cost</td></tr></tbody></table></div>\n<p>The finding to aim for is a sentence with a number in it that someone can put in a release memo — and the caveat that keeps them from over-claiming it.</p>\n<h3>Getting started</h3>\n<ol><li>Reproduce the <em>baseline</em> first, before any unlearning. Most of a replication's pain lives in the evaluation harness, and you want to hit it in week one.</li><li>Write the relearning attack before you finish the unlearning step. If you build the defence first you will unconsciously build one your attack cannot touch.</li><li>Fix seeds and pin versions from the first commit. Retrofitting reproducibility in week four costs more than doing it in week one, every time.</li></ol>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 7",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>A bilateral incident hotline is one of the few AI governance proposals with a working historical model and published support. The orphan catalogue's complaint: nobody has laid out a detailed plan for creating one.</p>\n<p>Lay it out.</p>\n<ul><li><strong>What counts as an incident.</strong> The definitional core. A model that behaves unexpectedly in a military-adjacent system, a suspected exfiltration, a capability jump nobody declared, a false alarm in a monitoring system. Each needs a threshold, or the line rings for everything and then for nothing.</li><li><strong>Who picks up.</strong> Named institutional roles on both sides, their authority to speak, and what happens when the person with the technical knowledge and the person with the authority are not the same person — which, on this subject, they never are.</li><li><strong>What gets said.</strong> The message template. This is where the design lives: the whole point is conveying enough to defuse without conveying enough to compromise. Say what fields the message has and what each side is deliberately not required to reveal.</li><li><strong>The credibility problem.</strong> Why the receiving side believes anything sent over the line. This is a verification question, and it is the reason a hotline is not simply a phone number: a channel that can be used to lie convincingly is worse than no channel.</li><li><strong>The precedent read.</strong> What the nuclear-era analogues actually did, and where the analogy breaks — different timescales, private-sector actors on one side of the wire, no equivalent of a launch detection.</li></ul>\n<h3>Why it exists</h3>\n<p>The track's spine is verification between two parties who expect to be cheated. A hotline is the smallest possible instance: no inspections, no thresholds, one channel, and the entire question is whether a message across it changes what the other side believes. Module 4's layering question in miniature.</p>\n<p>It is also the track's cheapest real-world artifact. Almost everything else in verification needs hardware that does not exist yet or a treaty nobody will sign. A hotline needs a definition, a roster and a template — which is precisely why its absence is embarrassing.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> the arms-control hotline literature, public reporting on existing bilateral military channels, and the track's actor taxonomy.</p>\n<p><strong>Out of scope:</strong> the diplomacy of proposing it, and the technical security of the channel itself. Assume a secure channel exists; the hard part is what travels down it.</p>\n<p><strong>Do not design a general-purpose crisis mechanism.</strong> One incident class done to the level of a usable message template beats a taxonomy of twelve.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Incidents</td><td>\"Significant AI-related events\"</td><td>Thresholds per class, and a named event that deliberately does not qualify</td></tr><tr><td>Roster</td><td>\"Senior officials\"</td><td>Roles with authority stated, and the technical/authority split addressed</td></tr><tr><td>The message</td><td>\"Both sides share information\"</td><td>A template with fields, and what each side is not required to disclose</td></tr><tr><td>Credibility</td><td>Assumed</td><td>Why the receiver believes it, and what a deceptive use of the line would look like</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Write the message template first. It forces every other decision — who can send it, what they must know, what they are protecting.</li><li>Pick the incident class you find hardest to define. The easy ones do not need a hotline.</li><li>Red-team it as a deception channel in week two. If the line makes a convincing lie cheaper, the design has to change.</li></ol>"
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
        "Verification 2.3 — intelligence and the human layer",
        "Verification 3 — covert development",
        "Verification 4.1 — feasibility and layering"
      ],
      "sources": [
        {
          "label": "Open Problems in Technical AI Governance — Reuel et al. (2025), security questions: what infrastructure-level cybersecurity measures protect model weights from theft; how can models be protected from inference attacks reproducing weights",
          "href": "https://arxiv.org/abs/2407.14981"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The bank already has a capstone for the day after weights leak, and it deliberately treats prevention as somebody else's job. This is that job.</p>\n<p>Write the security baseline a verification regime would require of a covered developer — and make it auditable, because a requirement nobody can check against is a requirement that exists only in the recital.</p>\n<ul><li><strong>Threat tiers.</strong> Opportunistic outsider, motivated criminal, insider with legitimate access, state actor with a budget and patience. The baseline is different at each, and a regime that names no tier has silently picked the cheapest one.</li><li><strong>Controls by tier.</strong> What is actually required: where weights may live, key management, egress restriction, hardware-backed storage, separation of duties, insider-risk programmes, vendor and contractor scope. Keep each control to something a regulator could point at.</li><li><strong>The audit evidence.</strong> Per control, what an auditor would look at to establish it is in place — and not merely documented. This is the section that decides whether the baseline is real, and the one most security policies skip.</li><li><strong>The human layer.</strong> Module 2.3's human-layer territory (2.3.6–2.3.9). Most exfiltration paths run through people with legitimate access, and technical controls that ignore that are ignoring the main route. Say how your baseline handles the insider who is authorised.</li><li><strong>The cost.</strong> By tier, roughly, and the honest note: at the state-actor tier the baseline may exceed what any commercial developer will pay, which is a finding a regime needs before it writes the condition rather than after.</li></ul>\n<h3>Why it exists</h3>\n<p>Module 3 rates weight exfiltration as the evasion that bypasses the compute regime entirely — training already happened, and the artifact is a file. The whole verification edifice rests on the assumption that this does not happen, and that assumption is currently backed by whatever security each lab chose.</p>\n<p>It is also the point in the track where verification meets ordinary security engineering, and where learners find out how much of governance is asking \"how would you know?\" of controls somebody has already asserted.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> published security frameworks and their AI-specific adaptations, public reporting on lab security practice, and the insider-risk literature.</p>\n<p><strong>Out of scope:</strong> penetration testing, any specific organisation's actual posture, and offensive detail. You are writing a requirement and its audit procedure, not a threat report.</p>\n<p><strong>Do not write a control list and stop.</strong> Half this capstone is the audit column. A baseline whose controls cannot be evidenced is exactly the paperwork regime Module 2.2 warns about, in a different domain.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Tiers</td><td>One undifferentiated baseline</td><td>Four tiers, with the control set changing between them</td></tr><tr><td>Controls</td><td>Borrowed wholesale from a framework</td><td>Selected, with the AI-specific reason each one is here</td></tr><tr><td>Audit evidence</td><td>Absent</td><td>Per control, what an auditor inspects, and how it distinguishes real from documented</td></tr><tr><td>Cost</td><td>Ignored</td><td>Per tier, with the honest note about where it exceeds commercial willingness</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Pick the tier the regime actually cares about before writing controls. Most baselines are written for the opportunistic outsider and quoted as though they addressed the state actor.</li><li>Write the audit column beside every control as you add it. Retrofitting it deletes about a third of the list.</li><li>Do the insider path in week two. It is the hardest section and the one that reshapes the technical controls around it.</li></ol>"
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
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Week 2 has you check which historical models would have crossed each threshold and when. That exercise quietly assumes a definition of the quantity. Real rules have to state one, and the alternatives are not equivalent:</p>\n<ul><li>Training compute only, or training plus post-training, or plus inference at serving scale?</li><li>Operations at what precision — and how do you compare a number quoted in one format against hardware that does something else natively?</li><li>Peak throughput of the cluster, or operations actually performed?</li><li>Aggregated across a distributed run, and if so over what window?</li></ul>\n<p>Pick three of these definitions, and score the same set of models under each.</p>\n<ul><li><strong>The re-scoring.</strong> A notebook: one model set, three definitions, which models cross which line under which. Where the sets diverge is the finding.</li><li><strong>The gaming analysis.</strong> Per definition, the cheapest way to sit just below. Sharding a run across windows or subsidiaries, shifting work to post-training or inference, quoting a different precision. Some definitions are much cheaper to game than others, and it is not always the loose one.</li><li><strong>The measurability check.</strong> Who could actually verify a claim under each definition, from what evidence. A definition that is precise and unverifiable is worse than a coarse one somebody can check.</li><li><strong>The recommendation.</strong> One definition, with what you accept in exchange, and the review clause you would attach knowing the technology moves.</li></ul>\n<h3>Why it exists</h3>\n<p>Every compute rule in force rests on a definition that was chosen quickly and has been carrying weight ever since. Learners see thresholds discussed as <em>numbers</em> — is 10²⁵ right? — when the more consequential choice is what the number counts.</p>\n<p>It also completes the pair with the existing threshold-decay capstone. That one asks how fast a fixed number loses selectivity; this asks whether the number was measuring the intended thing in the first place. Together they are the two ways a compute rule fails.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> public compute-estimate datasets, published rules and their definitional language, hardware specifications for the precision question.</p>\n<p><strong>Out of scope:</strong> proposing a new metric. Choose among definitions that a rule could plausibly use today — a metric nobody can compute from available evidence is a research programme.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Re-scoring</td><td>Asserts the definitions differ</td><td>A table where the same models land differently, with the divergent cases named</td></tr><tr><td>Gaming</td><td>\"Definitions can be gamed\"</td><td>Per definition, the cheapest evasion and roughly what it costs</td></tr><tr><td>Measurability</td><td>Assumed</td><td>Per definition, who verifies, from what evidence, at what lag</td></tr><tr><td>Recommendation</td><td>The most precise definition</td><td>The most <em>checkable</em> one, with the trade stated and a review clause</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Build the re-scoring notebook first, on five models. The divergences tell you which definitional axis actually matters, and it may not be the one you expected.</li><li>Ask of every definition: what would a compliant lab's lawyer say this excludes? That is the gaming section, written for you.</li><li>Keep the precision question separate from the training/inference question. Tangling them is how these analyses become unreadable.</li></ol>"
    },
    {
      "slug": "whistleblower-channel-design",
      "source": "verification-capstones/whistleblower-channel-design.md",
      "title": "A Reporting Channel an Insider Would Actually Use",
      "track": "Verification",
      "status": "draft",
      "summary": "Module 2.3 says the human layer reveals what hardware and technical intelligence cannot — if evidence reaches a verifier. Design the channel, against the NDAs and equity that stop it.",
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
        "Verification 2.3 — intelligence and the human layer"
      ],
      "sources": [
        {
          "label": "A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 20: AI and whistleblowing",
          "href": "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>Module 2.3's human-layer sections (2.3.6–2.3.9) make the case and state the problem in the same breath: humans reveal what the other evidence streams cannot — what the company believed, what leadership was warned about, what was suppressed — and frontier AI adds secrecy, NDAs, equity incentives and race pressure on top. Whether that evidence reaches a verifier depends on reporting channels, anti-retaliation protection and institutional independence.</p>\n<p>Design one channel, properly.</p>\n<ul><li><strong>Reportable matter.</strong> What this channel is for. Not general wrongdoing — something like: a safety evaluation whose result was overridden, a capability finding not disclosed to a regulator, a security incident not reported. Narrow scope is what makes protection defensible.</li><li><strong>The recipient.</strong> Who receives, and what makes them independent enough to be worth the risk. Regulator, standards body, an inspector general, a designated board committee. Say what happens to a report on arrival and on what clock.</li><li><strong>The reporter's calculus.</strong> Written explicitly, because this is where channels die. What they lose: unvested equity, non-disparagement exposure, future employment in a small field where everyone knows everyone. What your design gives back: anonymity that survives a small-team context where three people knew the fact, legal-cost cover, protection that binds a company that has not agreed to it.</li><li><strong>Evidence on arrival.</strong> What a report has to contain to be actionable, and how a recipient triages between a serious disclosure and a grievance — without a standard so high that only documented cases get through.</li><li><strong>The failure mode.</strong> Channels that exist and are never used, and channels used and ignored. Say which of the two your design is more at risk of.</li></ul>\n<h3>Why it exists</h3>\n<p>The human layer is where the track's realism lives. The other evidence streams can be improved with engineering; this one runs on whether a specific person, with a mortgage and a non-disparagement clause, decides to speak. Designing for that is a different discipline from designing a telemetry rule, and learners who can do both understand why regimes fail in practice more often than in theory.</p>\n<p>It also connects directly to Module 3: in the false-reporting scenario — hidden clusters, disguised workloads, falsified logs — insider evidence does work that the hardware and intelligence layers often cannot do alone.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> existing whistleblower regimes in finance, aviation, nuclear and pharma; public reporting on AI-lab NDAs and equity arrangements; the protective-legislation literature.</p>\n<p><strong>Out of scope:</strong> drafting statutory text, and any specific company's alleged conduct. This is mechanism design; the examples are illustrations.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>Scope</td><td>\"Safety concerns\"</td><td>A defined class of reportable matter, with an example that deliberately falls outside</td></tr><tr><td>Recipient</td><td>\"An independent body\"</td><td>Named form, what independence rests on, and the clock on their response</td></tr><tr><td>The calculus</td><td>Protection listed</td><td>The reporter's actual losses priced, and what your design returns against each</td></tr><tr><td>Anonymity</td><td>Promised</td><td>Assessed honestly against a context where three people knew the fact</td></tr></tbody></table></div>\n<p>The strongest submissions admit that anonymity is usually unachievable at frontier labs and design for a reporter who will be identified.</p>\n<h3>Getting started</h3>\n<ol><li>Read one mature regime's annual report — how many disclosures, how many actioned, how many retaliation findings. Those ratios discipline the design.</li><li>Write the reporter's calculus in the first session. If your channel does not survive it, nothing downstream matters.</li><li>Pick the narrowest reportable matter you can justify. Broad channels get broad opposition and thin protection.</li></ol>"
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
          "label": "Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 1",
          "href": "https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance"
        }
      ],
      "similar": [],
      "updated": "2026-08-04",
      "html": "<h3>The brief</h3>\n<p>The proposal is six years old. It has tax brackets, a rationale, and a <a href=\"https://arxiv.org/abs/1912.11595\">conference paper</a>. What it has never had is a paragraph a lawyer could put in front of a board. The orphan catalogue is blunt about it: nobody has drafted a sample clause, and nobody has persuaded a corporation to adopt one.</p>\n<p>Produce:</p>\n<ul><li><strong>The clause.</strong> Actual operative language. Trigger, measurement, obligation, recipient, governance of the recipient, amendment and termination terms.</li><li><strong>The corporate-form memo.</strong> Pick one real developer and read its actual structure — charter, capped-profit arrangement, trust, PBC status, whatever it is. Say where your clause attaches, who has authority to adopt it, and what it would take: a board resolution, a charter amendment, a shareholder vote.</li><li><strong>The trigger problem.</strong> \"Windfall\" has to be a number attached to something measurable. Revenue? Profit as a share of global product? Say what you chose and what it does under transfer pricing, a holding company, or a spin-out.</li><li><strong>Three ways out.</strong> How a determined company escapes your clause, and the language that closes each — or the admission that it cannot be closed.</li></ul>\n<h3>Why it exists</h3>\n<p>Week 3 teaches you to read an RSP and find every weasel word and exit hatch. This asks you to write a commitment that will be read that way by someone hostile, and to price every word you soften to get it signed.</p>\n<p>It is also the clearest case in the catalogue of a proposal that stalled at exactly the drafting step. That is worth noticing: the gap between \"a good idea with a paper behind it\" and \"a document someone could sign\" is where a great deal of governance work actually dies.</p>\n<h3>Scope</h3>\n<p><strong>In scope:</strong> one company, its public corporate documents, the original proposal, and comparable clauses from other industries (charitable pledges, profit-sharing, contingent value rights).</p>\n<p><strong>Out of scope:</strong> the philosophical case for redistribution. The proposal made it; you are past that point. Also out of scope: tax treatment across jurisdictions — flag it as an open question in one paragraph and move on.</p>\n<h3>What good looks like</h3>\n<div class=\"table-scroll\"><table><thead><tr><th>Dimension</th><th>Weak</th><th>Strong</th></tr></thead><tbody><tr><td>The clause</td><td>A restated principle</td><td>Operative language with a defined trigger and a named obligation</td></tr><tr><td>Corporate form</td><td>Generic</td><td>Read against one company's real charter, with the adoption route named</td></tr><tr><td>Escape routes</td><td>\"Enforcement would be difficult\"</td><td>Three specific manoeuvres, each with the language that closes it or an admission</td></tr><tr><td>Adoptability</td><td>Maximally strong</td><td>A version you think a board might actually pass, and what it cost to get there</td></tr></tbody></table></div>\n<h3>Getting started</h3>\n<ol><li>Read the company's charter before you read the proposal again. The proposal is about design; the charter tells you what can attach to it.</li><li>Write the trigger first. Everything else is easy by comparison, and a clause with a vague trigger is the thing that has already failed once.</li><li>Draft the escape routes before polishing. They rewrite the clause.</li></ol>"
    }
  ]
};
