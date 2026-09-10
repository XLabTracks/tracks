import type { Exercise } from "@/lib/content/types";

export const verificationExercises: Exercise[] = [
  {
    id: "v-task-introduction-1",
    type: "writing-prompt",
    prompt: "Optional: The strongest objection.\n\nIn a short written note, construct the strongest objection you can to the case above — and state what would change your mind, in either direction.",
    format: "free-form",
    optional: true,
  },
  {
    id: "v-task-intuitions-5",
    type: "writing-prompt",
    prompt:
      "Choose the part of this system that you think carries the most verification weight. Focus on the proposed datacenter retrofit: optical network taps, reproducible workloads, trusted recomputation servers, network restrictions, and related safeguards. Which mechanism seems like the most important—that, if removed, would most endanger the verification regime's effectiveness? Do not use outside resources for this part of the exercise.\n\nQuestions to consider:\n\n- What types of evidence does it provide—implied, likely, or certain? Ambiguous (rough power signatures) or exact (the model weights themselves)?\n- What kinds of cheating could it detect?\n- If a state had years to prepare an evasion strategy, where would you expect it to attack the system? Where would you most expect a motivated adversary to fail?\n- What other mechanisms does this one depend on, and what downstream mechanisms rely on this one's reliability?\n\nThere is no right answer here, and you do not need to find a secret or definitive vulnerability. Decide how much confidence this mechanism deserves and explain why.",
    format: "free-form",
    minWords: 200,
    maxWords: 250,
  },
  {
    id: "v-task-intuitions-6",
    type: "writing-prompt",
    prompt:
      "Now that you have a good grasp on your ideas of the Verification Plan's strengths, let's turn to identifying its weak points. Identify at least one mechanism, assumption, or implementation step in Plan A that you think is especially vulnerable to failure. Explain why the weakness matters for the regime as a whole. This is arguably the most central prompt: only by red-teaming and finding vulnerabilities can a regime patch its holes.\n\nQuestions to consider:\n\n- What has to go right politically, technically, and operationally for this part of the plan to work?\n- Which assumptions seem least reliable under tight timelines, strategic competition, or uneven cooperation among states and firms?\n- If this mechanism underperforms, what other parts of the verification regime compensate for it—and where might the failure cascade?\n\nAfter you have a good idea of a weakness you want to critique, explain which weakness, why it's most jeopardizing, and some ideas (not too long) about how you would go about strengthening it.",
    format: "free-form",
    minWords: 200,
    maxWords: 250,
  },
  {
    id: "v-task-intuitions-7",
    type: "writing-prompt",
    prompt:
      "Choose the timeline milestone that seems least likely to accomplish on schedule. Then, look closely at the implementation sequence in 2029: chip declarations and inspections, datacenter retrofits, and the expansion of verification coverage across the world's major compute.\n\nIn your rationale, you might compare the proposal with an arms-control inspection regime, a large industrial mobilization, an export-control system, or another suitable verification parallel. For inspiration, you may use outside resources or click ahead to learn more about historical verification precedents in [Module 0.3](/tracks/verification/why-verification/precedents).\n\nAsk whether the precedent changes your estimate of what could realistically be built within Plan A's timeline.",
    format: "free-form",
    minWords: 150,
    maxWords: 200,
  },
  {
    id: "v-task-intuitions-8",
    type: "writing-prompt",
    prompt:
      "The supplement estimates that some compute may remain hidden even after declarations and inspections, initially on the order of 0.5% of world AI-relevant compute. Your task is to decide how important that residual capacity is, and argue for whether the benign capacity threshold should be increased, decreased, or kept the same.\n\nQuestions to consider:\n\n- What could a well-resourced state accomplish with a small covert cluster over several years?\n- What disadvantages would such a project face?\n- Which other mechanisms in Plan A might constrain it?\n- Could algorithmic efficiency gaming realistically and substantively increase the capabilities of the hidden compute?\n\nIncreased, decreased, or left the same, justify your proposal for the covert-compute margin.",
    format: "free-form",
    minWords: 100,
    maxWords: 150,
  },
  {
    id: "v-task-intuitions-9",
    type: "writing-prompt",
    prompt:
      "Consider your strongest arguments and their strongest objections. Synthesize ideas from your earlier responses into a short essay answering: How robust is Plan A's verification regime, and where is it most likely to fail?\n\nAt the end, briefly justify the recommendation you selected above.",
    format: "free-form",
    minWords: 400,
    maxWords: 600,
  },
  {
    id: "v-task-intuitions-10",
    type: "writing-prompt",
    prompt:
      "Identify the central restriction under Plan A and Plan S: what would inspectors actually need to establish before they could reasonably conclude that actors were complying? Then, compare: does Plan A or Plan S give verification the clearer and more tractable target?\n\nQuestions to consider:\n\n- What prohibited activity would inspectors need to identify under each plan?\n- What observable physical, computational, or organizational traces would that activity leave?\n- Could prohibited activity resemble or hide within activity that remains permitted?\n- Where might reasonable inspectors disagree about whether a violation has occurred?\n\nMake a preliminary judgment. Delineate your evidence-backed reasons from intuitions.",
    format: "free-form",
    minWords: 100,
    maxWords: 150,
  },
  {
    id: "v-task-intuitions-11",
    type: "writing-prompt",
    prompt:
      "A clear rule is useful only if the available verification mechanisms can produce convincing evidence that actors are following it.\n\nFor Plan A, use the Verification Supplement to identify the mechanisms that provide the strongest evidence of compliance. For Plan S, consider what combination of tools from this course could provide comparable assurance—for example, compute declarations, inspections, chip accounting, power monitoring, remote sensing, intelligence, or personnel reporting.\n\nCompare the quality of evidence each regime could realistically produce.\n\nQuestions to consider:\n\n- Which compliance claims can be observed relatively directly, and which require substantial inference?\n- Would several independent verification mechanisms corroborate the same conclusion?\n- Where could multiple mechanisms share the same blind spot or unreliable assumption?\n- How much residual uncertainty would policymakers have to tolerate even when the regime appears to be working?\n\nDecide which plan could give decision-makers stronger grounds for confidence in compliance.",
    format: "free-form",
    minWords: 150,
    maxWords: 200,
  },
  {
    id: "v-task-intuitions-12",
    type: "writing-prompt",
    prompt:
      "Now, zoom out from individual pieces of evidence to the scale of the regime. Compare how much compute, infrastructure, activity, and geography would need to remain visible to inspectors under Plan A vs. Plan S. Pay particular attention to what kinds of AI activity remain permitted under each agreement and what that means for the monitoring burden.\n\nQuestions to consider:\n\n- Under which plan must inspectors make finer distinctions between permitted and prohibited activity?\n- How much of the relevant compute ecosystem would need reliable verification coverage?\n- Where could important activity fall outside the regime's field of view?\n- Does a broader prohibition make monitoring easier, or make gaps in coverage more consequential?\n\nRevisit your answer from Part 1. A rule that initially looked simpler may create a demanding monitoring problem once you consider how it would work across the real AI ecosystem.",
    format: "free-form",
    minWords: 150,
    maxWords: 200,
  },
  {
    id: "v-task-intuitions-13",
    type: "writing-prompt",
    prompt:
      "Verification also depends on whether governments, firms, and third countries will accept the access, restrictions, and institutional arrangements necessary to produce credible evidence.\n\nIdentify the hardest cooperation problem facing Plan A and the hardest facing Plan S. Compare how difficult each would be to overcome and how much the regime depends on solving it.\n\nQuestions to consider:\n\n- Which actors have the strongest incentives to refuse participation, demand exemptions, or withdraw later?\n- What commercially or militarily sensitive access would verification require?\n- What economic, strategic, or sovereignty costs would participation impose?\n- If one plan appears technically easier to verify but politically harder to implement, how much should that affect your assessment?\n\nBy this point, you should have compared the regimes across four dimensions: clarity of the verification target, strength of the evidence, monitoring burden, and political cooperation.",
    format: "free-form",
    minWords: 200,
    maxWords: 250,
  },
  {
    id: "v-task-intuitions-14",
    type: "writing-prompt",
    prompt:
      "You have already analyzed the comparison from four angles. Pull together the findings that matter most, consider the strongest argument against your own position, and answer: Which creates the more robust verification regime: Plan A or Plan S?\n\nMake a recommendation. Explain which considerations carry the most weight in your judgment, where important uncertainty remains, and what evidence or development would be most likely to change your view.",
    format: "free-form",
    minWords: 400,
    maxWords: 500,
  },
  {
    id: "v-task-intuitions-2",
    type: "writing-prompt",
    prompt:
      "Optional: Essay, what does success look like to you?\n\nDescribe your own plausible success scenario for advanced AI governance. Think several steps beyond any single verification mechanism: what does a world that has successfully managed the relevant risks actually look like, and what agreement or institutional arrangement gets us there?\n\nQuestions to consider:\n\n- What would make you call the outcome a success, and which risks or tradeoffs would remain acceptable?\n- What agreement or institutional settlement sustains that outcome, and which actors must participate for it to hold?\n- What technological and geopolitical assumptions does your scenario depend on most heavily?\n- What must verification establish with high confidence, and where can the regime tolerate residual uncertainty?\n- Which actors, jurisdictions, or incentives pose the hardest coordination problem?\n- What has to become technically, politically, or institutionally possible before this settlement can emerge?\n- Where is your scenario most fragile, and what development would most likely force you to redesign it?\n\nKeep this essay. You will return to it at the end of the track and see what, if anything, you would now change.",
    format: "free-form",
    minWords: 500,
    maxWords: 800,
    optional: true,
  },
  {
    id: "v-task-intuitions-3",
    type: "writing-prompt",
    prompt: "Optional: Explore AI 2027\n\nRead [AI 2027](https://ai-2027.com/), the same team’s earlier scenario, including both of its endings. As you read, ask the question this section trained: at which branch points would verification infrastructure have changed what the actors could credibly agree to?",
    format: "free-form",
    optional: true,
  },
  {
    id: "v-task-welcome-1",
    type: "writing-prompt",
    prompt:
      "Optional: Write a short note that you can look back on after completing the course:\n\n- Why are you interested in learning about AI verification?\n- What do you want to gain from this course?\n- Before beginning, brainstorm: what parts of AI verification intuitively seems hardest?",
    format: "free-form",
    optional: true,
  },
  {
    id: "v-task-strategic-foundations-1",
    type: "writing-prompt",
    prompt:
      "Optional: Actor, authority, and evidence map.\n\nChoose one element of the advanced-AI supply chain. Map (1) the actors involved, (2) the authority each one holds, and (3) the evidence that would let an outside party verify what they are doing. Draw on whichever reading pathway above is most relevant to the element you pick.",
    format: "free-form",
    optional: true,
  },
  {
    id: "v-intel-cyber-uses",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "In bullet points, sketch how cyber could be used in the context of verification. For each use, say what would be collected, against whom, and what a finding would settle. Five to eight bullets, then compare with the sample.",
    sampleAnswer:
      "- Collection against known high-risk targets. Signals and communications intelligence, and cyber collection, aimed at AI developers, datacenters, and chip producers, to learn whether a restricted project is running at all. That is Scher and Thiergart's row, and the second mechanism in Scher's 2026 list for covert projects, after whistleblowers.\n\n- Finding targets nobody has declared. Before anything can be monitored, someone has to identify the people and organizations likely to attempt restricted work, the way covert weapons programs were hunted. Scher 2026 puts this beside the first use and names the difference: chips are the only input with a physical footprint, and research needs few of them.\n\n- The fallback for what sensors cannot see. Nodes below the monitoring threshold are invisible to thermal and electrical means, so enforcement is left with network monitoring and in-person observation (Rahman 2026). The same paper rates monitoring internet traffic from outside as very low: the traffic is encrypted, can be shaped into any pattern, and runs below an ordinary household connection. That leaves the collection this section is about, from inside the systems rather than from their traffic, which the paper does not rate.\n\n- Access is the hard part, and it is physical. Lin sorts targets into easy, connected to the Internet, and difficult, isolated, where a vulnerability has to be planted by close access, and puts an adversary's important systems in the difficult class. So cyber collection against a covert program tends to begin with a person who can get near the system, a vendor who inserts a back door, or the equipment before it is deployed, which is where the human layer (2.4.1) begins.\n\n- A lead for the regime's own tools. What cyber collection finds cannot be shown, so it opens a file rather than closing one: a suspect site named for an inspection, a declaration to check against records. Six Layers pairs its supplemental mechanisms with inspections of suspect sites in the same sentence, and the module calls the split identify and resolve.\n\n- Legal cover, if the treaty grants it. Writing cyber into national technical means, as Definition 17 does, would extend to it the protection satellites and signals have had since SALT I: parties may collect, and may not interfere. No precedent definition went that far.\n\n- What it will not settle on its own. The sources-and-methods limit is at its strongest here: evidence from inside a rival's network is the least shareable there is, because showing what was found shows how it was reached (Baker §2.3.3 on the nuclear precedent). A cyber finding raises confidence privately and cannot be put on the table.\n\n- The cost that comes with the capability. An intrusion for verification and an intrusion preparing an attack look alike from the receiving end: Warner writes that collection campaigns can appear similar to preparations for war, and that the line between spying and attacking has always been blurry. That is why the same clause reads as protection to one capital and threat to the other.\n\n- The mirror image. Whatever the regime can do by cyber, its rivals can do to it: model weights and algorithmic secrets are the target, and Scher 2026 doubts that corporate security holds against a state actor. Verification by cyber has weights security as its precondition.",
  },
  {
    id: "v-intel-osint-guess",
    type: "writing-prompt",
    format: "free-form",
    optional: true,
    prompt:
      "Optional: Can you guess what signs we can catch with open-source data, and how?",
  },
  {
    id: "v-intel-osint-fas",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Free response. From the Colossus case in the FAS report: for each of the four sources (the utility's published annotation, the permit, the civil-society flight, the October 2025 satellite image) write one line on what it established and one word on your confidence in it. Then one line on what none of them could establish. Then: which layer of 2.3 would you invoke next, and what would you need it to establish?",
    sampleAnswer:
      "- The utility's annotation: Memphis Light Gas and Water's own annotated Google Earth image located two substations and gave their capacities, 8 MW for the existing one and 150 MW for the one to come; its May 2025 announcement stated 150 MW delivered and another 150 requested. From the third substation's size, the report inferred another ~150 MW, and the announcement showed that inference \"broadly accurate\" and \"only marginally\" so. Confidence: high for the substations and their capacities, the utility's own statement; moderate for the inferred 150 MW, an inference from the size of a third substation.\n\n- The permit: the legal limit — fifteen temporary turbines in 2024, fifteen permanent by July 2025. Without it, a turbine count is a number with nothing to compare against. Confidence: high; it is the legal document itself.\n\n- The flight: the aerial photographs commissioned by a civil-society group in March 2025 counted thirty-five turbines, more than twice the permit; not satellite imagery, the report notes, though satellite imagery could have done the same. Confidence: high for the count on that date; photographs, not an inference.\n\n- The satellite image: October 2025, twelve turbines visible, inside the allowance. Imagery showed the breach had been corrected, and would let the count be repeated. Confidence: high for the count on that date; whether the twelve were running, the image does not say.\n\n- None of them: what is inside the buildings — GPU clusters, racks, indoor chillers — or actual power consumption; the cooling-based energy figures are approximations of capacity, and the report says imagery cannot identify a hyperscale site from scratch without already knowing where to look.\n\n- Next: 2.3.3, energy and thermal. Thermal imaging or grid-operator load data would establish whether the turbines and the substations are running and at what draw; imagery counted the turbines, it did not see them run. If the draw contradicts the declared use, 2.4.3: an inspection to establish what the halls hold.",
  },
  {
    id: "v-intel-imagery-al-kibar",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Free response. From the introduction and the lessons of the Al Kibar report, three short answers: which signatures the skeptics expected and how the builders hid each; what imagery alone established about the building; and what settled its identity. Then one line: which signature from this section would you have needed, and could the builders have hidden it?",
    sampleAnswer:
      "- Expected and hidden: physical protection, a distinctive reactor shape and height, power lines, a water-cooling system, a tall stack, transport arrangements, nearby housing. Hidden by siting the reactor in a remote canyon with earthen walls, building much of it underground, and converting a Yongbyon-shaped building into a nondescript box with a false roof between 2002 and 2003, with the cooling, ventilation, and electrical systems disguised.\n\n- Imagery alone: a large building \"odd and in the middle of nowhere\", found by an intensified imagery search after a 2005 assessment pointed at the province; US analysts labelled it an \"enigma facility\" and could not ascribe it a nuclear character. In October 2007 ISIS tentatively called it a reactor from commercial imagery; the IAEA's imagery experts said that was unlikely.\n\n- What settled it: photographs of the inside and outside of the building, obtained by US intelligence in spring 2007, reportedly from Israel — human intelligence from a friendly service, which the report counts as the success. After the strike, overhead imagery of the cleanup located the core, the spent-fuel pond, and the heat exchangers.\n\n- The signature: the transformer yard and the cooling equipment, and the river water that stood in for cooling towers. The report says the cooling, ventilation, and electrical systems were disguised rather than omitted, and the reactor drew its cooling water from the river. A power line, a pumping station, or a load record can be hidden but not removed; those two features are where a search with a lead should have looked.",
  },
  {
    id: "v-intel-finint-smuggling",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Free response. From Epoch's estimate: name the two evidence streams it is built on and what each one actually observes. Then say which of the three streams in the table above the estimate uses, and what that tells you about what is public. Finally: which one enforcement action, if it had not happened, would have removed the most evidence from the estimate?",
    sampleAnswer:
      "- Diversion: public indictments and investigative reporting on chips leaving legitimate supply chains — Supermicro employees accused of diverting $2.5 billion of Nvidia servers to a pass-through entity, a Singaporean cloud provider with tens of thousands fewer chips in its Malaysian datacenters than it imported, and a table of smaller cases; allegations total about 282,000 H100-equivalents.\n\n- Resale: reporting on the grey market inside China — more than seventy distributors on one marketplace, nearly a hundred stores on another, orders of two or three hundred chips at a time and one of two thousand, contracts and photographs of chips physically present.\n\n- Which of the three streams it uses: none. No customs records, no export-licence data, no financial intelligence — those sit with governments. The public estimate rests on what enforcement has already surfaced (indictments) and what reporters found, and its largest guess is the share nobody detected: a detection rate of 10–80% with a median of 25%, plus whether alleged diversions arrived.\n\n- What that tells you: an outside observer sees the procurement trail only where a prosecutor or a journalist has already pulled it into the open. The rest is modelled, and the interval is the width of that model's uncertainty.\n\n- The one action: the Supermicro indictment. Its roughly 80,000 chips, about 141,000 H100-equivalents, are the largest single allegation on the diversion side, close to half of the ~300,000 H100-equivalents alleged in total; Megaspeed is next at about 111,000. Without it the diversion side loses its anchor and the estimate leans on the resale side alone.",
  },
  {
    id: "v-hw-dossier-claim",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Dossier row: the claim. Complete three sentences about the laboratory's evidence bundle, then answer one question.\n\n- The bundle directly supports…\n- It could support… if…\n- It does not support…\n\nThe question: of identify, measure and restrict, which job is the bundle actually doing, and which is it asserting?",
    sampleAnswer:
      "- Directly supports: that 20,000 devices carrying credentials in the vendor's identity scheme existed, answered a fresh challenge, and reported firmware matching the vendor's published reference values at the moment they were asked.\n\n- Could support, if: it could support a statement about the configuration of a cluster if the evidence fields included topology and the product and mode attested switches rather than devices one at a time; it could support a statement about quantity if a protected counter with an unbroken record were part of the bundle.\n\n- Does not support: that the counted work stayed under the threshold, that the workload was inference rather than training, that the devices were where the laboratory says they were, that no unenrolled accelerator ran the prohibited work, or that anyone has the authority to switch them off.\n\n- The job: identify, and only identify. The bundle asserts measurement and restriction by association, in the sense that a compliant-looking cluster is offered as evidence of compliant behaviour, but nothing in it measures work or constrains it.",
    minWords: 120,
    maxWords: 250,
  },
  {
    id: "v-hw-trust-chain-autopsy",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Trust-chain autopsy. Work the attestation result on this page and commit four short answers before opening the model answer.\n\n1. The exact claim the result makes, and the root or roots of trust that claim inherits.\n2. The component that performs the measurement, and who publishes the reference values it is compared against.\n3. Who can update the firmware, who can revoke a key or a reference value, who appraises the evidence, and who decides what follows from the appraisal.\n4. The strongest adversary this evidence is exposed to in a treaty setting, one failure that would take several of these links down at once, and one corroborating source that does not depend on the device's key.",
    sampleAnswer:
      "1. The claim: at the moment this nonce was answered, a device with this identifier, of this model, was running firmware and driver versions whose measurements equalled the vendor's published reference values, with secure boot on and debug off. It inherits the on-die key provisioned in manufacturing, the vendor's certificate hierarchy over that key, and the integrity of the reference measurements the comparison is made against.\n\n2. The measurement is taken by the device's own boot and firmware measurement path, and the reference values are published by the same manufacturer that made the device and provisioned its key. Measurement and standard have one owner.\n\n3. Firmware updates come from the vendor, usually through the operator, who chooses when to apply them. Revocation of a key, a certificate or a reference value is the vendor's. Appraisal can run locally or at the vendor's attestation service. The decision that follows belongs to whoever the agreement names, which in this case is nobody yet: that is the gap the section keeps returning to.\n\n4. The strongest adversary is the owner with unlimited physical access and time, which is the treaty case rather than the cloud case the design was built for. The common-mode failure is the vendor's key hierarchy: compromise or coercion there invalidates identity, measurement and any licensing built on the same root at once, however many separate mechanisms they appear to be. Independent corroboration would be evidence that does not pass through that key at all: a rack meter installed and sealed by the verifying party, a physical inspection of the enclosure, customs and foundry records for the devices themselves.",
    minWords: 200,
    maxWords: 400,
  },
  {
    id: "v-hw-dossier-accounting",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Dossier row: accounting. In three short paragraphs, using the registry extract: what the registry establishes about the laboratory's holdings, what the gap is and which stream would close it, and which question you would put to the operator first.",
    sampleAnswer:
      "- What it establishes: that 20,000 device identities are enrolled and that 19,760 of them produced device evidence inside the window. That is a reconciliation between two records the regime holds, and it is worth having, because it makes any later discrepancy visible.\n\n- The gap: 240 devices produced no evidence at all and 1,460 produced device evidence with nothing tying it to a place, so 1,700 sit outside a claim that joins identity to location. Shipping and customs records would close the first; a location anchor at Site C, or a physical count there, would close the second. Neither stream is produced by this section, and both belong to institutions outside the laboratory.\n\n- The first question: the transit records for the 240, with dates and destinations, because it is the cheapest question, it is answerable from documents the operator already holds, and an operator who cannot answer it has told you something more useful than the answer would have.",
    minWords: 100,
    maxWords: 250,
  },
  {
    id: "v-hw-dossier-measuring",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Dossier row: measurement. What did the meter record, how closely does that quantity match the legal rule, and what would the classifier have to be wired into before its output could be used against a state-backed owner?",
    sampleAnswer:
      "- What the meter recorded: 4.2 × 10^26 counted operations across 60 of the 90 days, on the devices that were enrolled and reporting. Thirty days are missing from the record, and the memory plateau across those days says the machines were not idle.\n\n- Against the rule: the rule is about unlicensed training above a threshold. The meter counts operations, without regard to whether they were training or whether they were licensed, and it counts them only where a counter was installed and running. It is evidence about one term of a three-term rule, with a hole in it.\n\n- What the classifier would need: tamper-resistant telemetry rooted in hardware rather than in the operator's software, an authenticated channel to the verifier, protected monitoring code, aggregation rules across devices and time that the operator cannot silently rewrite, and coverage of the hardware the laboratory did not enrol. The published result is a classifier evaluated on a corpus; none of those components exist in a product, and the study assumes the first two rather than providing them.",
    minWords: 120,
    maxWords: 280,
  },
  {
    id: "v-hw-dossier-authorization",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Dossier row: authorization. For the license token on this page: who issues it, what it can and cannot enforce, and what the design does when the issuer is unreachable. Then one line on which failure you would rather the treaty own.",
    sampleAnswer:
      "- Issuer: a single signing key. In the FLI text that is the Agency's; in an export-control framing it would be one government's; in a bilateral pilot it might be split across parties, which is a different design with different failure modes.\n\n- Can enforce: a quantity, as a clock-cycle allowance the device draws down, and a window, against the device's own clock. Cannot enforce: the workload condition written into the same token, because the chip has no way to test whether what it is running is training. That condition is enforced by the counter, the classifier or an inspection, or it is not enforced at all.\n\n- Unreachable issuer: the design has to choose. Fail open converts every outage into permission and rewards anyone who can cause one. Fail closed hands whoever can cut a link the power to stop lawful work, which is the instrument the treaty was trying to place under an authority in the first place.\n\n- Which failure to own: the treaty should own the false denial, because a false denial is visible, appealable and compensable, while a silent grant of permission during an outage is none of those. That is a judgement rather than a fact, and it should be argued in the text rather than left to firmware.",
    minWords: 120,
    maxWords: 280,
  },
  {
    id: "v-hw-key-custody",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Key custody, red team. Two custody designs for the key that authorises chips: a single hardware security module in one jurisdiction, and a 3-of-5 threshold split across rival states. Name the new failure each one introduces, not the one it removes. Then say which you would sign, and what you would demand alongside it.",
    sampleAnswer:
      "- Single HSM: one theft, one coercion, or one lawful order in one jurisdiction reaches every chip in the regime at once. The failure is not only compromise but leverage: whoever hosts it can be pressured, and every party knows it, which makes the mechanism hard to accept and easy to walk away from.\n\n- 3-of-5 across rivals: no single party can authorise or revoke alone, and the new failures are collusion and deadlock. Three parties who agree can act against the other two, and five parties who disagree can leave a legitimate suspension unsigned while the clock runs. Threshold custody converts a security problem into a diplomatic one, and diplomatic problems do not resolve on the timescale of a training run.\n\n- Which to sign: the threshold split, because the single-HSM failure is unbounded and the threshold failures are at least visible and negotiable. Alongside it: a written time limit on how long a request may sit unsigned, a defined emergency path with mandatory review afterwards, published logs of every signature and refusal, and a recovery procedure for a compromised share that does not require re-provisioning every chip.\n\n- Out of scope here: whether the institution holding the shares is independent enough to be trusted with them. That is 2.3.9's question, and it is not answered by cryptography.",
    minWords: 150,
    maxWords: 320,
  },
  {
    id: "v-hw-dossier-trust",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Dossier row: trust placement. For the pilot on this page, answer four things. What would the host delegation distrust, what would the visiting delegation distrust, whose cooperation is indispensable, and what is the smallest result that would justify a larger deployment?",
    sampleAnswer:
      "- Host distrusts: foreign-supplied hardware inside its electrical room, the possibility that a meter carries more capability than its design admits, and the inference a rival can draw from a facility's hourly load about work that has nothing to do with the agreement.\n\n- Visitor distrusts: that the host installed the meters where it said, that a paused meter was paused for the reason given, and that the racks being measured are the racks doing the work.\n\n- Indispensable cooperation: the site operator's, because nothing here is installed against the will of the party that owns the building. That is the standing weakness of every in-facility mechanism and the reason evidence from outside the fence keeps its value.\n\n- Smallest justifying result: a year of readings in which the two sides agree on what the record shows, no meter is paused without an accepted reason, and at least one engineered attempt to defeat a sealed meter is documented and either succeeds or fails on the record. If the parties cannot agree on the meaning of an uncontested reading at a commercial site with nothing at stake, they will not agree on a contested one under a pause.",
    minWords: 130,
    maxWords: 300,
  },
  {
    id: "v-hw-verification-budget",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Buy assurance with a verification budget. A declared training transcript arrives with a verification-compute budget worth a few percent of the original run. Allocate it across full re-running, random segment sampling, checkpoint checks, code and data commitments, physical compute totals, telemetry-timing comparison, and random chip inspection. For each thing you fund, state the cost, what it exposes commercially, where a prover would attack it, and what it buys. Then name the claim your allocation leaves untested.",
    sampleAnswer:
      "- Not funded: full re-running. It roughly doubles the cost of the original run, which the budget cannot carry, and it is the option people reach for because it sounds complete rather than because it is affordable.\n\n- Funded, most of the budget: random segment sampling against the transcript. Cost scales with the sample rather than the run; exposure is high, because segments reveal data and hyperparameters; a prover attacks it by predicting which segments will be drawn, so the draw must be unpredictable and made after the transcript is committed; it buys probabilistic evidence that the declared process produced the declared checkpoints.\n\n- Funded, small: code and data commitments taken before the run, and checkpoint hashes. Nearly free, minimal exposure, and they are what makes the sampling mean anything: sampling against a transcript the prover could rewrite afterwards tests nothing.\n\n- Funded, small: physical compute totals and telemetry-timing comparison, as a cross-check from a different stream. Cheap, low exposure, coarse. A prover attacks them by shaping the load, and the value is not the number but the disagreement it can surface with the transcript.\n\n- Funded, minimal: random chip inspection, as a deterrent rather than a measurement.\n\n- Untested: fleet completeness. Every item above is evidence about the run that was declared. None of it says a second run did not happen on hardware that never entered the regime, and no allocation of this budget can, because the budget is spent inside the declaration.\n\n- Worth stating in the allocation: a checkpoint chain is cheap evidence and not strong evidence, because the anti-spoofing guarantee behind proof-of-learning is currently broken in the general case, and the sound alternatives are priced out of a budget this size: the published zero-knowledge proof of training costs about fifteen minutes of prover time per iteration at ten million parameters, and attested evaluation in an enclave is a prototype rather than a costed path.",
    minWords: 200,
    maxWords: 400,
  },
  {
    id: "v-hw-fli-miri",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "One paragraph, saved for your brief. FLI's agreement triggers on risk and enforces through the chips; MIRI's triggers on compute and leans on consolidating and watching the hardware. Which of the two can the hardware you have just studied actually enforce, and what does the other one lean on instead?",
    sampleAnswer:
      "The hardware in this section can enforce the compute-shaped half of either scheme and neither of the risk-shaped halves. Clock-cycle authorization, a protected counter, and a device that refuses to compute without a valid token are all instruments for bounding a quantity on an enrolled chip, and FLI's Annex C is exactly that instrument attached to a rule whose trigger no chip can evaluate: the Agency's judgement about uses, risks and capabilities is made by people reading a document. MIRI's compute trigger is the one a meter could in principle test, but its verification does not rest on the chip reporting honestly; it rests on knowing where the chips are and keeping them in a small number of watched places, which is a claim about custody and counting rather than about telemetry. The practical difference is what each fails to: FLI fails to a chip whose owner has defeated it, and MIRI fails to a chip that was never counted. Both of those are covered, if at all, from outside the box.",
    minWords: 120,
    maxWords: 260,
  },
];
