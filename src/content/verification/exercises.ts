import type { Exercise } from "@/lib/content/types";

// The Verification track's written tasks, lifted verbatim from the author's
// outline — every prompt is the outline's own words for that task.
//
// Writing-prompt exercises rather than prose in a callout, because a task a
// learner cannot answer is not a task: this type carries the editor, the
// autosaving draft, the submit step and the review path the app already has.
// `exercises.data.ts` only spreads these in.
//
// No word bounds and no rubric: the outline states neither, and inventing a
// minimum or a marking scheme would be inventing curriculum.

export const verificationExercises: Exercise[] = [
  {
    id: "v-task-cloud-intro-1",
    type: "writing-prompt",
    prompt: "Category\n\nExamples\n\nRole\n\nHyperscalers\n\nMicrosoft Azure, AWS, Google Cloud, Oracle, Alibaba, Tencent\n\nOwn and operate frontier-scale data centers\n\nSmaller GPU clouds\n\nCoreWeave, Lambda\n\nRent out accelerator capacity at smaller scale\n\nResellers\n\nBrokers who buy hyperscaler capacity and sublease it\n\nSublease capacity bought from other providers",
    format: "free-form",
  },
  {
    id: "v-task-cloud-intro-2",
    type: "writing-prompt",
    prompt: "### The Four Roles of a Provider\n\nThe 2024 whitepaper Governing Through the Cloud (Heim et al.) names four capacities in which a provider can serve a governance regime: security, record keeping, verification, and enforcement. A verification regime needs all four — evidence, checking, consequences, and protection for the things being checked.\n\nRecord keeper — selectively collects and maintains high-level information about infrastructure usage, such as a customer's compute usage data. These records are the regime's evidence base: they link usage to real-world actors and enable post-incident attribution, turning a declaration from a bare claim into one checkable against an independent trail.\n\nVerifier — actively verifies customer identities, specific activities, and high-level properties of AI systems: compliance with reporting above training-compute thresholds, data-usage guidelines for frontier training, licenses for deployed systems. This is the checking itself — an inspector already on the premises, comparing what was declared against what actually ran.\n\nEnforcer — restricts or limits compute access for non-compliant customers or workloads, from refusing unlicensed developers to disabling a system whose activity is uncontrollable or in violation of regulations. This prospect is what makes honest declaration the cheaper strategy.\n\nSecurer — provides the physical and cybersecurity measures that protect model weights, algorithms, training data, and personal and confidential data, and helps prevent attacks on large-scale deployments. This protects the regime's integrity: a stolen copy of the weights was never declared, checked, or gated, so verification only constrains anyone if the capabilities being verified cannot simply be taken.\n\nEverything else in this module analyzes the provider as one of these four.\n\nCHECK: A provider suspends a customer's compute access after the customer refuses to file a required training-run notification. Which role is the provider exercising? (a) Enforcer (b) Verifier (c) Record keeper (d) Securer\n\nA: (a). Restricting or cutting access is enforcement. Verifying is checking claims against observation; record keeping is storing the usage data; securing is protecting models and infrastructure from attackers.",
    format: "free-form",
  },
  {
    id: "v-task-cloud-limits-1",
    type: "writing-prompt",
    prompt: "Evasion\n\nDefeats\n\nCosts the evader\n\nWhat still catches it\n\nFalse workload labels\n\nDeclaration regimes\n\nNearly free: a lie on a form\n\nTelemetry corroboration — and the lie is legally binding once filed\n\nProxies and shell companies\n\nThe KYC identity layer\n\nCheap on paper, harder at scale: frontier-size compute is sold through negotiated enterprise deals, not anonymous signups\n\nBeneficial-ownership checks, registry cross-referencing — and the sales relationship itself\n\nSequential training (one run, sliced in time across accounts)\n\nPer-account FLOP thresholds\n\nNear zero in compute (checkpoint-and-resume is standard practice); high in tradecraft — dozens of unlinkable accounts, each able to book a frontier-scale cluster, plus terabyte checkpoint handoffs between them\n\nCluster-size reporting (every slice still needs the big cluster) and data-transfer patterns (the handoffs are loud)\n\nDistributed training (one run, sharded in space across providers or sites)\n\nPer-account and per-provider thresholds; concentration signals\n\nCurrently prohibitive at frontier scale: demonstrated only around the 10B-parameter mark, with one experiment (DiPaCo) paying roughly 32× the compute of a colocated baseline — a penalty that is shrinking as labs mature low-communication methods for their own resilience\n\nSynchronization traffic between shards; each shard still needs serious hardware; cross-provider information sharing, where it exists\n\nProvider capture (complicit or state-directed)\n\nEverything upstream at once\n\nDepends on who the evader is: prohibitive for a private actor; for a state with jurisdiction over the provider, roughly the cost of a directive\n\nOnly external layers: hardware (2.1) and intelligence (2.3)",
    format: "free-form",
  },
  {
    id: "v-task-cloud-limits-2",
    type: "writing-prompt",
    prompt: "Evidence\n\nControlled by\n\nFaking it costs\n\nHardware allocation, billing records\n\nProvider\n\nNearly unfakeable by the customer: the provider bills from them\n\nUtilization, traffic, power patterns\n\nProvider (observed)\n\nGameable, at real efficiency cost; the distortion is itself a signal\n\nDeclarations, stated purpose, workload labels\n\nCustomer\n\nA form and a signature: cheapest to fake, worthless uncorroborated, legally binding once false",
    format: "free-form",
  },
  {
    id: "v-task-cloud-limits-3",
    type: "writing-prompt",
    prompt: "OPTIONAL EXERCISE SPEC — Case verdict (6 min, free response + self-score)\n\nINF Tech, revisited\n\nReturn to the case from 2.2.0. A treaty with a full cloud annex (KYC, registration, telemetry corroboration, suspension) is in force, and Indonesia has signed. Write one paragraph: which mechanisms from this module surface the INF Tech arrangement, and which of its features would still defeat the annex if Indonesia had signed nothing?\n\nModel answer (appears after submission): KYC at the Indonesian provider flags the customer; cluster registration and data-transfer patterns corroborate; suspension is available same-day. Without Indonesian accession, none of it applies: reseller opacity plus third-country jurisdiction leave the arrangement invisible to the annex. The case sits half inside, half outside the layer’s reach.\n\nSelf-score, three items: named at least two mechanisms that would surface it; named at least two structural limits; reached a verdict on what accession does and does not fix. Two of three counts as a pass.",
    format: "free-form",
  },
  {
    id: "v-task-cloud-reporting-control-1",
    type: "writing-prompt",
    prompt: "The NovaStar case\n\nThe NovaStar case puts you at a provider’s oversight desk. Play it here: [the NovaStar case](https://playground-tracks.netlify.app/cloud-verification-game.html), then return for the quiz.",
    format: "free-form",
  },
  {
    id: "v-task-cloud-what-providers-see-1",
    type: "writing-prompt",
    prompt: "EXERCISE SPEC — Fingerprint comparison (1 min)\n\nOn screen: two telemetry cards side by side. Profile A: 2,000 GPUs; utilization spiking and idling with office hours; network traffic in short bursts. Profile B: 30,000 accelerators reserved as a single block for six weeks; utilization pinned near peak day and night; traffic between nodes pulsing in a regular rhythm.\n\nPrompt: \"One of these is a frontier training run. Which one?\" Learner clicks a card to commit; reveal unlocks on click.\n\nReveal: B. Three tells, one line each — scale (30,000 accelerators reserved as one block), constancy (training doesn't sleep; inference follows users), communication pattern (the regular rhythm of parallel training). Closing line: notice the cards have no names on them — telemetry is anonymous until someone joins it to the identity layer, and whether a regulator may do that is 2.2.2's subject.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-1",
    type: "writing-prompt",
    prompt: "### Question 1. Objective and verification chain\n\nState the principal objective of Articles IV to VII and the principal objective of the low-trust verification system. Then reconstruct how the two are meant to connect:\n\nregulated activity -> captured evidence -> protected commitment or record -> challenge or evaluation -> compliance finding -> response.\n\nWhat observable result would count as successful verification?",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-2",
    type: "writing-prompt",
    prompt: "### Question 2. Necessary assumptions\n\nIdentify at least three assumptions that must be true for this combined approach to work. For each assumption:\n\n- State it precisely;\n- Explain why the design depends on it;\n- Assess how plausible it is;\n- Explain what happens if it is false.\n\nConclude by identifying the most decisive assumption and any dependencies among your assumptions.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-3",
    type: "writing-prompt",
    prompt: "### Question 3. Coverage of Articles IV to VII\n\nFor each article, classify the verification system's coverage as substantial, partial, or not provided, and justify your classification:\n\n- Article IV, restrictions on AI training;\n- Article V, consolidation and monitoring of AI chips;\n- Article VI, monitoring production, sale, and transfer of AI chips;\n- Article VII, verification and restrictions on chip use.\n\nIdentify which obligations could generate usable evidence through this system and which would still require inventories, inspections, supply-chain controls, legal authority, intelligence, or other institutions.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-4",
    type: "writing-prompt",
    prompt: "### Question 4. Technical and operational feasibility\n\nCould the proposed system operate at the scale and level of assurance the treaty requires: yes, only under stated conditions, or no?\n\nConsider network taps, commitments, sampling, challenge procedures, workload reconstruction or re-execution, physical security, redundancy, retrofitting, confidentiality, false positives and false negatives, attribution, cost, and scale. State the conditions required for your conclusion or the changes needed to make the design feasible.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-5",
    type: "writing-prompt",
    prompt: "### Question 5. Implementation problems, loopholes, and responsibility\n\nIdentify the major implementation problems and select the most serious one. Then develop at least two important loopholes or evasion pathways. For each pathway, explain:\n\n- The actor and incentive;\n- The sequence of actions;\n- The weakness that enables it;\n- Its likely impact and detectability;\n- Who is responsible for prevention, detection, investigation, and remedy;\n- Whether those defenders have the authority, information, incentive, and capacity to respond.\n\nPrioritize the pathways. Propose one mitigation for the most serious pathway and identify the new cost, risk, objection, or residual loophole created by the mitigation.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-6",
    type: "writing-prompt",
    prompt: "### Question 6. Low trust, confidentiality, incentives, and fairness\n\nExplain how the design responds to both a potentially dishonest facility operator or state and a potentially intrusive or dishonest verifier. Does it protect sensitive model, training, commercial, and national-security information while still producing credible evidence?\n\nIdentify who receives assurance, who bears monitoring or disclosure burdens, and who controls the evidence. Assess whether this distribution is justified and whether the affected actors have incentives to participate and comply.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-7",
    type: "writing-prompt",
    prompt: "### Question 7. Coherence and logic\n\nIs the combined design coherent, partly coherent, or incoherent? Reconstruct its strongest causal inference and identify its most important logical or evidentiary gaps.\n\nIn particular, test whether evidence about workloads inside a monitored facility is sufficient to establish treaty compliance concerning total compute, prohibited purpose, chip location, chip production and transfer, attribution, and enforcement.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-8",
    type: "writing-prompt",
    prompt: "### Question 8. Authors, affiliation, and standpoint\n\nIdentify the authors and institutional affiliation of both texts. Explain how the authors' technical-governance and catastrophic-risk standpoint may have shaped one specific design choice, assumption, priority, or omission.\n\nIdentify one materially relevant perspective missing from the assigned excerpts and explain how including it might change the analysis. Affiliation alone is not evidence that a claim is false.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-9",
    type: "writing-prompt",
    prompt: "### Question 9. Factual, theoretical, or technical accuracy\n\nIdentify one important claim or assumption in the excerpts that may be false, overstated, contested, or insufficiently supported. Provide its exact location, classify the issue accurately, and test it using a reliable external source or a complete technical argument.\n\nIf you find no demonstrable error, identify the strongest candidate claim, explain what evidence would be needed to verify it, and state the implication of continued uncertainty.",
    format: "free-form",
  },
  {
    id: "v-task-covert-red-blue-10",
    type: "writing-prompt",
    prompt: "### Question 10. Overall judgment and redesign\n\nDoes the low-trust verification system make Articles IV to VII meaningfully more verifiable? Recommend adopt, pilot, redesign, or reject as the next step.\n\nSupport your judgment with the system's strongest feature and most consequential unresolved weakness. Propose one concrete revision informed by a course concept, and explain the revision's second-order cost, risk, political objection, or residual loophole.",
    format: "free-form",
  },
  {
    id: "v-task-human-audits-inspections-1",
    type: "writing-prompt",
    prompt: "Mechanism\n\nTypical trigger\n\nMain purpose\n\nMain design risk\n\nIndependent audit\n\nPeriodic, milestone-based, or pre-deployment review\n\nAn outside third party verifies specified claims and evaluates systems or practices against stated standards.\n\nThe auditee controls the auditor, scope, evidence, or publication.\n\nRoutine inspection\n\nA schedule, random selection, or recurring treaty obligation\n\nConfirm declared sites, inventories, records, processes, or controls.\n\nPredictability permits staging, and the inspection may reach only declared activity.\n\nChallenge inspection\n\nA specific concern, anomaly, or formal request, usually under special and shorter-notice procedures\n\nClarify possible noncompliance at a relevant site or activity not resolved by routine measures.\n\nDelay, political misuse, excessive intrusion, or access negotiated below what the concern requires.",
    format: "free-form",
  },
  {
    id: "v-task-human-audits-inspections-2",
    type: "writing-prompt",
    prompt: "Historical Parallel: Managed Access\n\nArms-control regimes faced the same problem: inspectors need enough access to test a claim, while the inspected party may hold unrelated military, proprietary, or security-sensitive information. The IAEA Additional Protocol expressly provides for managed access to protect proliferation-sensitive, proprietary or commercially sensitive, and safety or physical-protection information while preserving the Agency’s verification objective. [3]\n\nThe Chemical Weapons Convention uses the same logic in challenge inspections. It permits measures such as removing sensitive papers, shrouding unrelated equipment, limiting particular tests, or giving only selected inspectors access. But managed access is not a unilateral veto. If full access is not provided, the inspected state must make every reasonable effort to offer alternative means that clarify the compliance concern. Site-securing and exit-monitoring procedures can also reduce the opportunity to remove evidence while access is negotiated. [2]\n\n<Callout variant=\"tip\" title=\"Task\">\n\nTRANSFER TO AI  An AI inspector might use a read-only query over raw scheduler logs, allow a vetted subset of the team to view model weights on site, inspect cryptographic commitments rather than source files, or receive an independently generated aggregate. The substitute is acceptable only if it answers the same verification question.",
    format: "free-form",
  },
  {
    id: "v-task-human-insiders-1",
    type: "writing-prompt",
    prompt: "Chain segment\n\nWho, specifically\n\nCan observe\n\nBlind to\n\nChip design and fabrication\n\nProcess or lithography engineer at a leading-edge foundry (e.g. TSMC); product engineer at a chip designer (e.g. Nvidia)\n\nWhich advanced parts are in production, at what volume, and which customers placed large orders\n\nHow the chips are ultimately used; any training workload\n\nHardware assembly and data-center build\n\nConstruction, electrical, and cooling contractors; rack and interconnect technicians\n\nThe physical envelope: facility scale, power provisioning, cooling capacity, count and type of accelerators installed\n\nWhat runs inside; the purpose of any job\n\nCompute provider and cloud operations\n\nData-center operations technician or site reliability engineer; account manager or KYC compliance officer\n\nCluster utilization, job duration, power draw, which accounts run large jobs; customer identity, billing, reseller relationships\n\nModel identity and training purpose; the content of the workload\n\nThe AI developer: technical staff\n\nResearch engineer or ML researcher on the run; infrastructure or cluster admin\n\nThe run itself and its objective, dataset, and results; cluster size, job scheduling, checkpoint and weight-access logs, total compute\n\nLittle, within their own project; this is the richest vantage on intent\n\nThe AI developer: oversight staff\n\nSafety or evaluations staff; security team; legal and compliance\n\nCapability and red-team results and what was downplayed; incident and exfiltration records; what was declared to regulators and the NDA and equity terms that bind colleagues\n\nDay-to-day technical detail outside their remit\n\nThe AI developer: leadership\n\nExecutives and senior leadership\n\nIntent: the decision to conceal or proceed, and what the board and leadership were warned about\n\nNothing relevant; the constraint here is willingness to disclose, not access\n\nSuppliers and downstream\n\nChip reseller or broker; utility or energy provider; enterprise customer or deployment partner\n\nWho acquired compute and in what volume through which intermediaries; large sustained power contracts and load; model capabilities in real use\n\nUse and purpose of the compute; training provenance of the deployed model",
    format: "free-form",
  },
  {
    id: "v-task-human-insiders-2",
    type: "writing-prompt",
    prompt: "Historical contrast: when human reporting opens—and distorts—verification\n\nIn 2002, an Iranian opposition group publicly identified previously undeclared nuclear facilities at Natanz and Arak. The disclosure did not itself prove what was occurring there, and the group had clear political interests. Its value was that it gave the IAEA a concrete location and claim to investigate. Inspection and other evidence—not the source’s reputation alone—turned the allegation into a substantiated verification concern.\n\nCurveball shows the opposite failure. Reporting from a single Iraqi defector became the foundation for claims that Iraq possessed mobile biological-weapons laboratories, even though US officials lacked direct access to him and serious questions about his reliability were not adequately resolved or communicated. Analysts treated a poorly validated source as confirmation partly because his account matched what they already expected. Postwar investigation found that the reporting was unreliable.\n\nThe lesson: human reporting is often most valuable for identifying where to look and what to test. It earns evidentiary weight only when its material claims survive corroboration through records, technical signals, inspections, or sources the original reporter does not control.",
    format: "free-form",
  },
  {
    id: "v-task-introduction-1",
    type: "writing-prompt",
    prompt: "Optional task — The strongest objection.\n\nIn a short written note, construct the strongest objection you can to the case above — and state what would change your mind, in either direction.",
    format: "free-form",
  },
  {
    id: "v-task-intuitions-1",
    type: "writing-prompt",
    prompt: "Option A — Stress-test the verification supplement.\n\nRead the verification supplement and apply the three moves to the claims below. Each claim, if it fails, is a distinct way the whole regime fails; part of your job is to name the failure mode each one guards against. You are building your own assessment, and reasonable readers of this supplement have landed in very different places.\n\n- The retrofit: network taps and recomputation servers are described as leaving minimal room for vulnerabilities. What would an adversary with years of preparation and nation-state resources try first? (Failure mode: technical defeat — the monitoring hardware itself is compromised.)\n- The schedule: declarations, mutual inspections, and the retrofit of most of the world's datacenter compute are completed in roughly a year (2029–2030). What comparable industrial or diplomatic effort has ever moved at that speed? Most nuclear arms-control agreements took the better part of a decade each. (Failure mode: the timeline race — capability milestones arrive before the regime that was supposed to govern them. If dangerously capable AI is possible by 2030, a regime that takes until 2035 to build is a plan for a different world.)\n- The trust anchor: compliance rests on recomputation servers each side must trust. Who builds them, who audits them, and what happens when one side alleges tampering? (Failure mode: dispute spiral — an unresolvable accusation collapses the regime even if no one actually cheated.)\n- The covert margin: the plan estimates roughly half a percent of compute escaping to covert projects and treats that as manageable. Is it? What can be done with that margin, and how does it compound over a decade? (Failure mode: death by leakage — the regime works as designed and loses anyway.)\n- The third countries: coverage above 99 percent requires participation well beyond the US and China, including Russia and the Gulf states. What actually brings them in? (Failure mode: the hole in the map — bilateral verification of a global technology.)\n- The vulnerable window: during the transition, both signatories have partially powered down. That is exactly when defection pays most. What in the plan deters it then? (Failure mode: breakout at the seam — the regime is weakest exactly when the incentive to break it peaks.)\n- The transparency price: which mechanisms in the plan expose commercially or militarily sensitive information, to whom, and why would the exposed party accept that? This is the Coe–Vaynman tradeoff from the arms-race explainer, now with concrete machinery attached: monitoring intrusive enough to catch cheating can expose secrets worth stealing, while monitoring loose enough to protect secrets leaves room to cheat covertly. For each mechanism, ask which side of that dial it sits on, and who would refuse it. (Failure mode: refusal at the door — the regime is verifiable in principle but no one with secrets will sign it.)\n\nOption B — Compare the verification regimes of Plan A and Plan S.\n\nPlan A is a verified slowdown: training halts, inference continues, and the whole regime hangs on being able to tell those two activities apart at datacenter scale. Plan S is shut it all down: a global moratorium on frontier development. The plan's FAQ ([ai-2040.com/supplements/faq](https://ai-2040.com/supplements/faq)) argues Plan A beats Plan S on the timeline: both regimes eventually strain and break, and when they do, Plan A has spent the intervening years making alignment progress at a higher capability level, while Plan S froze earlier and banked less. Read that argument, note that it is about urgency and prioritization rather than verification, then set it aside and reason about verification specifically.\n\nOne warning about sources: Plan S has no verification supplement. It exists in the document only as a contrast case. That asymmetry is the point of this task — for Plan S, you are reconstructing the regime it would need, not summarizing one someone else wrote. Work through:\n\n- The bright line. For each plan, state the single rule an inspector must police. For Plan S it is something like \"no frontier training runs anywhere.\" For Plan A it is \"no training on monitored compute, though inference is fine.\" Which line is easier to state? Which is easier to check, given that training and inference run on the same chips?\n- The three moves, applied to the softer assumption. Each plan's checkability rests on a load-bearing assumption — for Plan A, that the training/inference distinction is machine-detectable through taps and recomputation; for Plan S, that a total ban leaves no legitimate compute economy in which covert work can hide. Decide which assumption is softer and run it through the three moves.\n- The transparency price, paid twice. Plan A's monitoring reaches inside an active AI economy: taps and recomputation touch live commercial workloads, so the secrets at risk are current and valuable — the Coe–Vaynman tradeoff at full intensity. Plan S monitors an economy that is supposed to be dormant, which exposes less — but a state with nothing permitted has nothing to lose by cheating and no ongoing benefit that inspection lets it keep. Which price would each signatory actually pay?\n- Failure modes, compared. List two ways each regime fails and trace each to its cause. Do the two plans fail in the same ways, or does moving the bright line move the failure modes?\n- The verdict question. Which plan is technically easier to verify, and which is politically easier to sustain? If those answers differ — and decide whether they do — what does that tell you about how much \"verifiability\" should count for when choosing between postures on the ladder?",
    format: "free-form",
  },
  {
    id: "v-task-intuitions-2",
    type: "writing-prompt",
    prompt: "Optional task — Essay: what does success look like to you?\n\nIn 500–800 words, describe your own success scenario: the end state (what the world looks like, and roughly when); the agreement that gets there (who signs, what is restricted); and what verification would need to cover for that agreement to hold. Keep this essay. You will re-read it at the end of the track.",
    format: "free-form",
  },
  {
    id: "v-task-intuitions-3",
    type: "writing-prompt",
    prompt: "Optional — Explore AI 2027\n\nRead [AI 2027](https://ai-2027.com/), the same team’s earlier scenario, including both of its endings. As you read, ask the question this section trained: at which branch points would verification infrastructure have changed what the actors could credibly agree to?",
    format: "free-form",
  },
  {
    id: "v-task-scoping-actors-1",
    type: "writing-prompt",
    prompt: "Posture\n\nWhat it means\n\nA concrete face\n\nComply\n\nFollow the agreement as written.\n\nA lab that reports its large training runs accurately and on time.\n\nDefect\n\nCovertly violate for advantage.\n\nA state running a hidden cluster while its diplomats reaffirm the pause.\n\nHide\n\nObscure assets or activities from view, whether or not any rule is being broken.\n\nA firm treating its chip inventory as a trade secret.\n\nExaggerate\n\nOverstate compliance, safety, or capability.\n\nSafety-washing by a lab; capability bluffing by a state.\n\nFree-ride\n\nEnjoy the stability produced by others’ restraint without bearing its costs.\n\nA state that signs nothing and benefits anyway.",
    format: "free-form",
  },
  {
    id: "v-task-scoping-actors-2",
    type: "writing-prompt",
    prompt: "State\n\nWhat runs through it\n\nWhat that buys a verifier\n\nStanding worry\n\nUnited States\n\nChip design (NVIDIA, AMD), the largest frontier labs and cloud providers, and export-control law.\n\nIt can see and squeeze more of the chain than anyone. Its export rules are the closest thing to a working compute-control regime today.\n\nLosing its lead; verification machinery being turned on its own firms.\n\nChina\n\nThe other frontier developer. Manufacturing scale, rare earths and materials, its own designers, clouds, and labs.\n\nNo agreement is meaningful without it, and it controls inputs the rest of the chain needs.\n\nReads on-chip controls and inspections as surveillance and containment.\n\nTaiwan\n\nTSMC, which fabricates the overwhelming share of leading-edge AI chips.\n\nThe single tightest physical chokepoint in the system.\n\nBeing both the prize and the battlefield in a conflict it does not control.\n\nNetherlands\n\nASML, the world’s only maker of EUV lithography machines.\n\nOne company in one country: one of the strongest levers anywhere in the system.\n\nA small state carrying outsized geopolitical weight.\n\nJapan\n\nSemiconductor equipment (Tokyo Electron) and specialty materials.\n\nSeveral quieter chokepoints in equipment and chemistry.\n\nPressure from both sides of the US-China rivalry.\n\nSouth Korea\n\nSamsung and SK Hynix, the largest memory makers, including high-bandwidth memory (HBM).\n\nHBM is scarce and essential to frontier training: a countable, checkable input.\n\nExport exposure to China against alliance pressure from the US.",
    format: "free-form",
  },
  {
    id: "v-task-scoping-actors-3",
    type: "writing-prompt",
    prompt: "Institution\n\nJob in a verification regime\n\nIncentive to watch\n\nState Department\n\nNegotiates the agreement and runs the diplomacy around compliance disputes.\n\nWants a deal that survives politics; may trade verification strictness for signatures.\n\nCommerce Department (Bureau of Industry and Security)\n\nWrites and enforces export controls on chips: the de facto compute-governance agency today.\n\nEnforcement capacity is small relative to the job, and the rules shift with each administration.\n\nDepartment of Defense (restyled the Department of War in 2025)\n\nStrategic and military stakes in frontier AI.\n\nWants American capability unconstrained; wary of any regime that could bind its own programs.\n\nIntelligence community (CIA, NSA, and the rest)\n\nMonitoring and attribution: the “national technical means” layer that spots hidden data centers and procurement networks.\n\nWhat it knows is classified. Turning intelligence into shareable treaty evidence risks burning sources.\n\nNIST and its Center for AI Standards and Innovation (CAISI)\n\nStandards and testing. Runs pre-deployment evaluation agreements with several frontier developers.\n\nVoluntary agreements, not inspection authority; renamed and refocused as the politics changed.",
    format: "free-form",
  },
  {
    id: "v-task-scoping-actors-4",
    type: "writing-prompt",
    prompt: "Stage\n\nWho (examples)\n\nWhat they hold that a verifier needs\n\nDefault posture\n\nEquipment\n\nASML (EUV lithography); Applied Materials, Tokyo Electron.\n\nThe machines without which no leading-edge chip exists, and knowledge of every fab that buys one.\n\nComply. Few customers, total visibility, nowhere to hide.\n\nFabrication and memory\n\nTSMC, Samsung, SK Hynix, Intel.\n\nThe physical record: what was made, how many, and for whom.\n\nComply, while caught between US rules and Chinese customers.\n\nChip design\n\nNVIDIA, AMD; Huawei and other Chinese designers.\n\nThe blueprint: whether chips ship with attestation, metering, or location features at all.\n\nComply with controls while lobbying hard against them. Verification features cost money and sales.\n\nPackaging, assembly, test\n\nAdvanced-packaging lines (TSMC’s CoWoS and rivals); outsourced assembly-and-test firms.\n\nA second, quieter bottleneck. Chips pass through here and can be counted.\n\nMostly invisible in policy debates, which is itself a gap.\n\nCloud providers\n\nAWS, Microsoft Azure, Google Cloud, Oracle, Alibaba; specialists like CoreWeave.\n\nThe position between customer and machine: logs, billing, telemetry, and the power to interrupt a job.\n\nComply and hide at once. Natural monitors, reluctant police.\n\nFrontier labs\n\nOpenAI, Anthropic, Google DeepMind, Meta, xAI; DeepSeek, Alibaba, and Moonshot in China.\n\nThe most detailed private information in the system: what was trained, on what data, and what the evals showed.\n\nEvery posture potentially\n\nDeployers\n\nEveryone building products on top of models.\n\nA diffuse downstream signal of what models can actually do.\n\nFree-ride. They benefit from safety and bear none of its costs.\n\nProxies and contractors\n\nShell companies, resellers, straw buyers, intermediaries.\n\nNothing legitimate. They exist to break the link between a name and an activity.\n\nThe standing channel through which evasion flows.",
    format: "free-form",
  },
  {
    id: "v-task-scoping-actors-5",
    type: "writing-prompt",
    prompt: "Role\n\nThe question it answers\n\nExamples\n\nCapability holder\n\nWho can actually build the dangerous thing?\n\nFrontier labs; any state with a national program.\n\nChokepoint controller\n\nWho can physically stop or slow the flow?\n\nASML, TSMC, cloud providers; BIS with its export licenses.\n\nInformation holder\n\nWho already knows what verifiers need to learn?\n\nClouds (logs and billing), labs (evals), fabs (shipments), intelligence agencies.\n\nEnforcement authority\n\nWho can impose a real cost for violating?\n\nRegulators, customs services, courts, sanctioning states, a future treaty body.\n\nEvasion pathway\n\nThrough whom would a cheater route?\n\nProxies, resellers, smuggling networks, non-signatory jurisdictions, complicit contractors.\n\nVictim, free-rider, beneficiary\n\nWho bears the risk, or enjoys the stability, without a seat at the table?\n\nEveryone downstream of the frontier; small states; the public.",
    format: "free-form",
  },
  {
    id: "v-task-scoping-effective-feasible-1",
    type: "writing-prompt",
    prompt: "#### The Limited Test Ban Treaty (1963): verifiability decided what could be banned\n\nThe 1963 treaty banned nuclear tests in the atmosphere, in space, and underwater, but not underground. The reason is pure verification design. Atmospheric tests could be detected worldwide by existing means, monitoring stations picking up radioactive debris and, later, satellites and seismic arrays, without any inspection inside the other country. Underground tests could not be reliably distinguished from earthquakes at the time and would have required on-site inspection the Soviets would not grant. So the treaty covered exactly the environments that national technical means could police and left out the one they could not.",
    format: "free-form",
  },
  {
    id: "v-task-welcome-1",
    type: "writing-prompt",
    prompt: "Optional reflection — Write a short note that you can look back on after completing the course:\n\n- what you want to gain from the course;\n- which part of international AI verification currently seems hardest;\n- and which assumptions you expect the course to challenge.",
    format: "free-form",
  },
];
