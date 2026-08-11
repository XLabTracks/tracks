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
//
// A table is NOT a task. Eight of the outline's tables were pasted in here as
// writing-prompt prompts, cells joined by blank lines, and rendered as a
// FREE RESPONSE card holding a flat column of cell text with no grid, no
// header and an answer box under it. Tables belong in the MDX as markdown
// tables — `.lesson-body table` in globals.css already gives them the house
// treatment and its own scroll box. If a prompt has no question in it, it is
// not a prompt.

export const verificationExercises: Exercise[] = [
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
    optional: true,
  },
  {
    id: "v-task-intuitions-1",
    type: "writing-prompt",
    prompt:
      "Option A — Stress-test Plan A's verification regime\n\nRead the AI 2040 Verification Plan, especially:\n\n- Summary of the Plan\n- Concrete inference-only retrofitting proposal\n- 2029–2030: Deal Implementation\n- Third-party countries begin joining the deal\n- the later discussion of improving robustness and privacy\n\nPlan A's verification problem has two broad parts. First, the regime needs confidence that declared compute is being used in permitted ways. Second, it needs to keep undeclared or covert compute small enough that it cannot overturn the agreement.\n\nWork through the following before writing.\n\n**1. Identify the regime's load-bearing mechanism**\n\nFocus on the proposed datacenter retrofit: optical network taps, reproducible workloads, trusted recomputation servers, network restrictions, and related safeguards.\n\nChoose the part of this system that you think carries the most verification weight. Consider:\n\n- What evidence does it actually provide?\n- What kinds of cheating could it detect?\n- What kinds could still escape it?\n- If a state had years to prepare an evasion strategy, where would you expect it to attack the system?\n\nYou do not need to find a fatal vulnerability. Decide how much confidence this mechanism deserves and explain why.\n\n**2. Stress-test the timeline**\n\nLook closely at the implementation sequence in 2029: chip declarations and inspections, datacenter retrofits, and the expansion of verification coverage across the world's major compute.\n\nChoose the transition that seems hardest to accomplish on schedule.\n\nUse one relevant precedent from elsewhere in the course to assess it. You might compare the proposal with an arms-control inspection regime, a large industrial mobilization, an export-control system, or another verification effort.\n\nAsk whether the precedent changes your estimate of what could realistically be built within Plan A's timeline.\n\n**3. Assess the covert-compute margin**\n\nThe supplement estimates that some compute may remain hidden even after declarations and inspections, initially on the order of 0.5% of world AI-relevant compute.\n\nDecide how important that residual capacity is.\n\nWhat could a well-resourced state accomplish with a small covert cluster over several years? What disadvantages would such a project face? Which other mechanisms in Plan A might constrain it?\n\nIf the answer depends heavily on an empirical uncertainty — for example, how efficiently frontier capabilities can be developed on small amounts of compute — identify that uncertainty explicitly.\n\n**4. Test participation beyond the United States and China**\n\nPlan A eventually requires verification coverage well beyond its two principal signatories.\n\nChoose one important third country, semiconductor producer, cloud provider, or other actor whose cooperation matters.\n\nAssess the bargain from that actor's perspective:\n\n- What access or restrictions would the regime require?\n- What commercial, military, or sovereignty costs could participation impose?\n- What incentives or pressures might bring the actor into the agreement?\n- How damaging would nonparticipation be?\n\n**Final essay**\n\nWrite 600–800 words answering: how robust is Plan A's verification regime, and where is it most likely to fail?\n\nBuild your argument around two or three issues that you think are genuinely load-bearing. Use specific mechanisms and claims from the verification supplement, and bring in at least one relevant comparison or concept from the course.\n\nA strong essay should reach a judgment about the regime as a whole while remaining clear about uncertainty. Explain which assumption matters most to your conclusion and what evidence would make you revise it.",
    format: "free-form",
  },
  {
    id: "v-task-intuitions-4",
    type: "writing-prompt",
    prompt:
      "Option B — Compare Plan A and Plan S as verification problems\n\nRead:\n\n- the AI 2040 Verification Plan, especially the sections on datacenter retrofits and secure R&D;\n- the discussion of Plan S in AI 2040;\n- the relevant argument in the AI 2040 FAQ comparing the two plans.\n\nPlan S proposes a much stronger halt on frontier AI development. Plan A begins with a pause and inference-only retrofit, then allows some approved AI R&D inside secured and verified facilities.\n\nThe two approaches therefore create different verification problems.\n\nWork through the following before writing.\n\n**1. Define what each regime has to detect**\n\nStart with the prohibited activity under each plan.\n\nFor Plan S, ask what an inspector would need to establish in order to have confidence that frontier development had actually stopped.\n\nFor Plan A, focus first on the inference-only phase. Ask what the verifier needs to observe in order to distinguish permitted inference from prohibited training or experimentation on monitored compute.\n\nThen consider Plan A's later secure-R&D phase. What additional distinction does the regime need to police once some frontier research is permitted again?\n\nWhich of these rules creates the clearest observable boundary?\n\n**2. Build the strongest verification case for each plan**\n\nFor Plan A, identify the three mechanisms in the verification supplement that you think contribute most to detecting violations.\n\nFor Plan S, construct a plausible verification stack using mechanisms covered elsewhere in the course: compute declarations, inspections, chip tracking, power monitoring, intelligence, personnel reporting, satellite observation, or others.\n\nFor each regime, consider whether those mechanisms fail independently or share common blind spots.\n\nWhich regime gives a verifier stronger evidence of compliance?\n\n**3. Give each regime its strongest evasion strategy**\n\nChoose one serious cheating strategy for Plan A and one for Plan S. For each:\n\n- What would the violator conceal?\n- What evidence would need to be suppressed or falsified?\n- Which verification layer would have the best chance of detecting the violation?\n- How much progress might be possible before detection?\n\nCompare the resulting failure modes. Pay attention to whether permitting a large legitimate AI economy under Plan A creates useful cover for covert activity, and whether Plan S creates different incentives for hidden infrastructure or breakout.\n\n**4. Compare the political cost of verification**\n\nPlan A's verification system reaches deeply into active datacenters and commercial workloads. The supplement itself treats privacy and protection of sensitive information as important design constraints.\n\nPlan S would create a different inspection problem because frontier development is supposed to be halted altogether.\n\nCompare the information each regime might require states and firms to reveal. Consider commercial secrets, military uses, facility access, sovereignty, and the risk that verification infrastructure itself becomes an intelligence channel.\n\nWhich regime asks signatories to tolerate the more politically difficult form of monitoring?\n\n**5. Make the tradeoff explicit**\n\nBefore writing, form separate judgments about technical verifiability; resistance to evasion; political acceptability; and durability over several years.\n\nThe same plan may perform differently across these dimensions. That tension should drive your essay.\n\n**Final essay**\n\nWrite 600–800 words answering: which creates the more tractable verification regime — Plan A's managed slowdown or Plan S's frontier-AI halt?\n\nUse specific features of Plan A's verification supplement and construct the strongest reasonable verification architecture for Plan S.\n\nYour conclusion should explain why the difference matters. Identify the assumption that most strongly determines your comparison, and say what evidence or technological development could change your view.",
    format: "free-form",
  },
  {
    id: "v-task-intuitions-2",
    type: "writing-prompt",
    prompt: "Optional task — Essay: what does success look like to you?\n\nIn 500–800 words, describe your own success scenario: the end state (what the world looks like, and roughly when); the agreement that gets there (who signs, what is restricted); and what verification would need to cover for that agreement to hold.",
    format: "free-form",
    optional: true,
  },
  {
    id: "v-task-intuitions-3",
    type: "writing-prompt",
    prompt: "Optional — Explore AI 2027\n\nRead [AI 2027](https://ai-2027.com/), the same team’s earlier scenario, including both of its endings. As you read, ask the question this section trained: at which branch points would verification infrastructure have changed what the actors could credibly agree to?",
    format: "free-form",
    optional: true,
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
    prompt:
      "Optional reflection — Write a short note that you can look back on after completing the course:\n\n- Why are you interested in learning about AI verification?\n- What do you want to gain from this course?\n- Before beginning, brainstorm: what parts of AI verification intuitively seems hardest?",
    format: "free-form",
    optional: true,
  },
  {
    id: "v-task-strategic-foundations-1",
    type: "writing-prompt",
    prompt:
      "Optional written output — Actor, authority, and evidence map.\n\nChoose one element of the advanced-AI supply chain. Map (1) the actors involved, (2) the authority each one holds, and (3) the evidence that would let an outside party verify what they are doing. Draw on whichever reading pathway above is most relevant to the element you pick.",
    format: "free-form",
    optional: true,
  },
];
