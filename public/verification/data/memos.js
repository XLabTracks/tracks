/* GENERATED FILE - do not edit by hand.
   Source: src/content/verification/memos.ts (+ exercises.ts for task prompts,
   curriculum.ts for lesson links)
   Regenerate: npm run verification:memos

   Every place the course asks for a written output. The briefs are the
   outline's own words; `status` says how much of each one exists; a slot
   with `task` is answered in the lesson at `href`, not drafted on the desk. */
window.VERIFICATION_MEMO_MODULES = [
  "Why Verification?",
  "Actors",
  "Verification Infrastructure",
  "Scheming and Evasion",
  "Trust Without Trust"
];

window.VERIFICATION_MEMOS = [
  {
    "id": "m0-welcome-note",
    "module": 0,
    "unit": "0.0",
    "title": "A Short Note to Look Back On After the Course",
    "status": "specified",
    "task": "v-task-welcome-1",
    "optional": true,
    "brief": "- Why are you interested in learning about AI verification?\n- What do you want to gain from this course?\n- Before beginning, brainstorm: what parts of AI verification intuitively seems hardest?",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/why-verification/welcome#v-task-welcome-1"
  },
  {
    "id": "m0-strongest-objection",
    "module": 0,
    "unit": "0.1",
    "title": "The Strongest Objection",
    "status": "specified",
    "task": "v-task-introduction-1",
    "optional": true,
    "brief": "In a short written note, construct the strongest objection you can to the case above — and state what would change your mind, in either direction.",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/why-verification/introduction#v-task-introduction-1"
  },
  {
    "id": "m0-hinge-brief",
    "module": 0,
    "unit": "0.2",
    "title": "Essay A: Stress-Test Plan A",
    "status": "specified",
    "genre": "essay",
    "steps": [
      {
        "task": "v-task-intuitions-5",
        "title": "A1. Identify the Regime's Strongest Mechanism or Recommendation",
        "brief": "Choose the part of this system that you think carries the most verification weight. Focus on the proposed datacenter retrofit: optical network taps, reproducible workloads, trusted recomputation servers, network restrictions, and related safeguards. Which mechanism seems like the most important—that, if removed, would most endanger the verification regime's effectiveness? Do not use outside resources for this part of the exercise.\n\nQuestions to consider:\n\n- What types of evidence does it provide—implied, likely, or certain? Ambiguous (rough power signatures) or exact (the model weights themselves)?\n- What kinds of cheating could it detect?\n- If a state had years to prepare an evasion strategy, where would you expect it to attack the system? Where would you most expect a motivated adversary to fail?\n- What other mechanisms does this one depend on, and what downstream mechanisms rely on this one's reliability?\n\nThere is no right answer here, and you do not need to find a secret or definitive vulnerability. Decide how much confidence this mechanism deserves and explain why.",
        "words": 250,
        "wordsMin": 200,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-5"
      },
      {
        "task": "v-task-intuitions-6",
        "title": "A2. Identify the Regime's Weakest Link(s)",
        "brief": "Now that you have a good grasp on your ideas of the Verification Plan's strengths, let's turn to identifying its weak points. Identify at least one mechanism, assumption, or implementation step in Plan A that you think is especially vulnerable to failure. Explain why the weakness matters for the regime as a whole. This is arguably the most central prompt: only by red-teaming and finding vulnerabilities can a regime patch its holes.\n\nQuestions to consider:\n\n- What has to go right politically, technically, and operationally for this part of the plan to work?\n- Which assumptions seem least reliable under tight timelines, strategic competition, or uneven cooperation among states and firms?\n- If this mechanism underperforms, what other parts of the verification regime compensate for it—and where might the failure cascade?\n\nAfter you have a good idea of a weakness you want to critique, explain which weakness, why it's most jeopardizing, and some ideas (not too long) about how you would go about strengthening it.",
        "words": 250,
        "wordsMin": 200,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-6"
      },
      {
        "task": "v-task-intuitions-7",
        "title": "A3. Stress-Test the Timeline",
        "brief": "Choose the timeline milestone that seems least likely to accomplish on schedule. Then, look closely at the implementation sequence in 2029: chip declarations and inspections, datacenter retrofits, and the expansion of verification coverage across the world's major compute.\n\nIn your rationale, you might compare the proposal with an arms-control inspection regime, a large industrial mobilization, an export-control system, or another suitable verification parallel. For inspiration, you may use outside resources or click ahead to learn more about historical verification precedents in [Module 0.3](/tracks/verification/why-verification/precedents).\n\nAsk whether the precedent changes your estimate of what could realistically be built within Plan A's timeline.",
        "words": 200,
        "wordsMin": 150,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-7"
      },
      {
        "task": "v-task-intuitions-8",
        "title": "A4. Assess the Covert-Compute Margin",
        "brief": "The supplement estimates that some compute may remain hidden even after declarations and inspections, initially on the order of 0.5% of world AI-relevant compute. Your task is to decide how important that residual capacity is, and argue for whether the benign capacity threshold should be increased, decreased, or kept the same.\n\nQuestions to consider:\n\n- What could a well-resourced state accomplish with a small covert cluster over several years?\n- What disadvantages would such a project face?\n- Which other mechanisms in Plan A might constrain it?\n- Could algorithmic efficiency gaming realistically and substantively increase the capabilities of the hidden compute?\n\nIncreased, decreased, or left the same, justify your proposal for the covert-compute margin.",
        "words": 150,
        "wordsMin": 100,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-8"
      },
      {
        "task": "v-task-intuitions-9",
        "title": "A5. Final Essay",
        "brief": "Consider your strongest arguments and their strongest objections. Synthesize ideas from your earlier responses into a short essay answering: How robust is Plan A's verification regime, and where is it most likely to fail?\n\nAt the end, briefly justify the recommendation you selected above.",
        "words": 600,
        "wordsMin": 400,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-9"
      }
    ],
    "brief": "Stress-test the Plan A verification supplement — how robust is Plan A's verification regime, and where is it most likely to fail? Four prompted questions lead into the final essay, which ends on one of three recommendations: adopt largely as written, adopt only with significant amendments, or reject in favor of a different approach (400–600 words).",
    "audience": "Decision-makers asking whether the verification regime is strong enough to rely on as written.",
    "words": 600,
    "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-5"
  },
  {
    "id": "m0-plan-a-vs-s",
    "module": 0,
    "unit": "0.2",
    "title": "Essay B: Plan A vs. Plan S",
    "status": "specified",
    "genre": "essay",
    "steps": [
      {
        "task": "v-task-intuitions-10",
        "title": "B1. Which Plan Gives Verification the More Tractable Target?",
        "brief": "Identify the central restriction under Plan A and Plan S: what would inspectors actually need to establish before they could reasonably conclude that actors were complying? Then, compare: does Plan A or Plan S give verification the clearer and more tractable target?\n\nQuestions to consider:\n\n- What prohibited activity would inspectors need to identify under each plan?\n- What observable physical, computational, or organizational traces would that activity leave?\n- Could prohibited activity resemble or hide within activity that remains permitted?\n- Where might reasonable inspectors disagree about whether a violation has occurred?\n\nMake a preliminary judgment. Delineate your evidence-backed reasons from intuitions.",
        "words": 150,
        "wordsMin": 100,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-10"
      },
      {
        "task": "v-task-intuitions-11",
        "title": "B2. Which Plan Could Provide Stronger Evidence of Compliance?",
        "brief": "A clear rule is useful only if the available verification mechanisms can produce convincing evidence that actors are following it.\n\nFor Plan A, use the Verification Supplement to identify the mechanisms that provide the strongest evidence of compliance. For Plan S, consider what combination of tools from this course could provide comparable assurance—for example, compute declarations, inspections, chip accounting, power monitoring, remote sensing, intelligence, or personnel reporting.\n\nCompare the quality of evidence each regime could realistically produce.\n\nQuestions to consider:\n\n- Which compliance claims can be observed relatively directly, and which require substantial inference?\n- Would several independent verification mechanisms corroborate the same conclusion?\n- Where could multiple mechanisms share the same blind spot or unreliable assumption?\n- How much residual uncertainty would policymakers have to tolerate even when the regime appears to be working?\n\nDecide which plan could give decision-makers stronger grounds for confidence in compliance.",
        "words": 200,
        "wordsMin": 150,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-11"
      },
      {
        "task": "v-task-intuitions-12",
        "title": "B3. Which Plan Creates the Harder Monitoring Problem?",
        "brief": "Now, zoom out from individual pieces of evidence to the scale of the regime. Compare how much compute, infrastructure, activity, and geography would need to remain visible to inspectors under Plan A vs. Plan S. Pay particular attention to what kinds of AI activity remain permitted under each agreement and what that means for the monitoring burden.\n\nQuestions to consider:\n\n- Under which plan must inspectors make finer distinctions between permitted and prohibited activity?\n- How much of the relevant compute ecosystem would need reliable verification coverage?\n- Where could important activity fall outside the regime's field of view?\n- Does a broader prohibition make monitoring easier, or make gaps in coverage more consequential?\n\nRevisit your answer from Part 1. A rule that initially looked simpler may create a demanding monitoring problem once you consider how it would work across the real AI ecosystem.",
        "words": 200,
        "wordsMin": 150,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-12"
      },
      {
        "task": "v-task-intuitions-13",
        "title": "B4. Which Regime Could States Actually Cooperate On?",
        "brief": "Verification also depends on whether governments, firms, and third countries will accept the access, restrictions, and institutional arrangements necessary to produce credible evidence.\n\nIdentify the hardest cooperation problem facing Plan A and the hardest facing Plan S. Compare how difficult each would be to overcome and how much the regime depends on solving it.\n\nQuestions to consider:\n\n- Which actors have the strongest incentives to refuse participation, demand exemptions, or withdraw later?\n- What commercially or militarily sensitive access would verification require?\n- What economic, strategic, or sovereignty costs would participation impose?\n- If one plan appears technically easier to verify but politically harder to implement, how much should that affect your assessment?\n\nBy this point, you should have compared the regimes across four dimensions: clarity of the verification target, strength of the evidence, monitoring burden, and political cooperation.",
        "words": 250,
        "wordsMin": 200,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-13"
      },
      {
        "task": "v-task-intuitions-14",
        "title": "B5. Final Essay",
        "brief": "You have already analyzed the comparison from four angles. Pull together the findings that matter most, consider the strongest argument against your own position, and answer: Which creates the more robust verification regime: Plan A or Plan S?\n\nMake a recommendation. Explain which considerations carry the most weight in your judgment, where important uncertainty remains, and what evidence or development would be most likely to change your view.",
        "words": 500,
        "wordsMin": 400,
        "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-14"
      }
    ],
    "brief": "Compare Plan A (verified slowdown) and Plan S (complete shutdown) — which creates the more robust verification regime? Four prompted questions lead into the final essay, which makes a recommendation (400–500 words).",
    "audience": "Decision-makers asking whether the verification regime is strong enough to rely on as written.",
    "words": 500,
    "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-10"
  },
  {
    "id": "m0-success-scenario",
    "module": 0,
    "unit": "0.2",
    "title": "Essay: What Does Success Look Like to You?",
    "status": "specified",
    "genre": "essay",
    "task": "v-task-intuitions-2",
    "optional": true,
    "brief": "Describe your own plausible success scenario for advanced AI governance. Think several steps beyond any single verification mechanism: what does a world that has successfully managed the relevant risks actually look like, and what agreement or institutional arrangement gets us there?\n\nQuestions to consider:\n\n- What would make you call the outcome a success, and which risks or tradeoffs would remain acceptable?\n- What agreement or institutional settlement sustains that outcome, and which actors must participate for it to hold?\n- What technological and geopolitical assumptions does your scenario depend on most heavily?\n- What must verification establish with high confidence, and where can the regime tolerate residual uncertainty?\n- Which actors, jurisdictions, or incentives pose the hardest coordination problem?\n- What has to become technically, politically, or institutionally possible before this settlement can emerge?\n- Where is your scenario most fragile, and what development would most likely force you to redesign it?\n\nKeep this essay. You will return to it at the end of the track and see what, if anything, you would now change.",
    "audience": null,
    "words": 800,
    "wordsMin": 500,
    "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-2"
  },
  {
    "id": "m0-explore-ai-2027",
    "module": 0,
    "unit": "0.2",
    "title": "Explore AI 2027",
    "status": "specified",
    "task": "v-task-intuitions-3",
    "optional": true,
    "brief": "Read [AI 2027](https://ai-2027.com/), the same team’s earlier scenario, including both of its endings. As you read, ask the question this section trained: at which branch points would verification infrastructure have changed what the actors could credibly agree to?",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/why-verification/building-intuitions#v-task-intuitions-3"
  },
  {
    "id": "m1-actor-authority-evidence",
    "module": 0,
    "unit": "0.4",
    "title": "Actor–Authority–Evidence Map",
    "status": "specified",
    "genre": "map",
    "task": "v-task-strategic-foundations-1",
    "optional": true,
    "brief": "Choose one element of the advanced-AI supply chain. Map (1) the actors involved, (2) the authority each one holds, and (3) the evidence that would let an outside party verify what they are doing. Draw on whichever reading pathway above is most relevant to the element you pick.",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/why-verification/strategic-foundations#v-task-strategic-foundations-1"
  },
  {
    "id": "m1-stakeholder-map",
    "module": 1,
    "unit": "1.0",
    "title": "Stakeholder Map",
    "status": "specified",
    "genre": "map",
    "brief": "For a hypothetical pause treaty, place every relevant actor on the supply chain, annotate each with its most likely incentive class and the leverage it holds, and mark the two or three actors whose defection would collapse the regime.",
    "audience": "The drafting team for a hypothetical pause treaty.",
    "words": 800
  },
  {
    "id": "m1-case-briefing",
    "module": 1,
    "unit": "1.7",
    "title": "Case Briefing on Actors",
    "status": "named",
    "brief": null,
    "audience": null,
    "words": 600,
    "gap": "Named in the module timing table as a 15–20 minute written exercise. No brief, audience or rubric is drafted."
  },
  {
    "id": "m2-1-chip-security-act",
    "module": 2,
    "unit": "2.1",
    "title": "Break Down the Chip Security Act",
    "status": "specified",
    "task": "v-hw-claim-chip-security",
    "brief": "1. **What policy goal does the proposal seek to advance, and what obligations would it create?** Identify who would be required to do what. Support your answer with references to the source.\n\n2. **Formulate a verification claim about the location of a covered product.** Specify what would need to be established and the time covered. Identify any detail your formulation requires that the excerpt leaves unspecified.\n\n3. **Would establishing that location claim be sufficient to establish that the policy goal had been achieved?** Explain your answer with a concrete example.",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/verification-infrastructure/hardware-claim#v-hw-claim-chip-security"
  },
  {
    "id": "m2-1-hardware-brief",
    "module": 2,
    "unit": "2.1",
    "title": "Hardware Assurance Brief",
    "status": "specified",
    "brief": "A bounded hardware assurance brief. The point is not forecasting the correct future — it is making the assessment conditional on visible facts: coverage, fidelity, time to deployment, and the preferred corroborating layer.",
    "audience": "A named national delegation or joint drafting session considering a three-month U.S.–China pause.",
    "words": 1000
  },
  {
    "id": "m2-3-osint-guess",
    "module": 2,
    "unit": "2.3",
    "title": "What Signs Can We Catch With Open-Source Data?",
    "status": "specified",
    "task": "v-intel-osint-guess",
    "optional": true,
    "brief": "Can you guess what signs we can catch with open-source data, and how?",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/verification-infrastructure/intelligence-osint#v-intel-osint-guess"
  },
  {
    "id": "m2-3-osint-colossus",
    "module": 2,
    "unit": "2.3",
    "title": "Open-Source Intelligence Exercise",
    "status": "specified",
    "task": "v-intel-osint-fas",
    "brief": "Free response. From the Colossus case in the FAS report: for each of the four sources (the utility's published annotation, the permit, the civil-society flight, the October 2025 satellite image) write one line on what it established and one word on your confidence in it. Then one line on what none of them could establish. Then: which layer of 2.3 would you invoke next, and what would you need it to establish?",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/verification-infrastructure/intelligence-osint#v-intel-osint-fas"
  },
  {
    "id": "m2-3-imagery-al-kibar",
    "module": 2,
    "unit": "2.3",
    "title": "Imagery and Geospatial Intelligence Exercise",
    "status": "specified",
    "task": "v-intel-imagery-al-kibar",
    "brief": "Free response. From the introduction and the lessons of the Al Kibar report, three short answers: which signatures the skeptics expected and how the builders hid each; what imagery alone established about the building; and what settled its identity. Then one line: which signature from this section would you have needed, and could the builders have hidden it?",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/verification-infrastructure/intelligence-imagery#v-intel-imagery-al-kibar"
  },
  {
    "id": "m2-3-finint-smuggling",
    "module": 2,
    "unit": "2.3",
    "title": "Financial and Procurement Intelligence Exercise",
    "status": "specified",
    "task": "v-intel-finint-smuggling",
    "brief": "Free response. From Epoch's estimate: name the two evidence streams it is built on and what each one actually observes. Then say which of the three streams in the table above the estimate uses, and what that tells you about what is public. Finally: which one enforcement action, if it had not happened, would have removed the most evidence from the estimate?",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/verification-infrastructure/intelligence-finint#v-intel-finint-smuggling"
  },
  {
    "id": "m2-3-cyber-uses",
    "module": 2,
    "unit": "2.3",
    "title": "Signals and Cyber Intelligence Exercise",
    "status": "specified",
    "task": "v-intel-cyber-uses",
    "brief": "In bullet points, sketch how cyber could be used in the context of verification. For each use, say what would be collected, against whom, and what a finding would settle. Five to eight bullets, then compare with the sample.",
    "audience": null,
    "words": 0,
    "href": "/tracks/verification/verification-infrastructure/intelligence-cyber#v-intel-cyber-uses"
  },
  {
    "id": "m2-3-intel-overview",
    "module": 2,
    "unit": "2.3",
    "title": "What We Can See Today",
    "status": "specified",
    "genre": "memo",
    "brief": "The question: if a state were covertly training a frontier model right now, what could outside observers actually see? Write an overview a decision-maker can read in ten minutes. Cover each mechanism that exists today — overhead and thermal imagery, power and grid analysis, procurement, customs and financial tracking, open sources, human sources — with one sentence on what it establishes and one on what defeats it. Research is part of the task: find at least three public artifacts from the last two years yourself (a commercial satellite product, an enforcement action, a public tracker or filing) and cite each with a link. Open with the bottom line: the two mechanisms you would rely on most, and why. Close with the blind spot that concerns you most and the other verification layer that covers it. Do not draft treaty language: the question is what can be seen, not what should be signed.",
    "audience": "A policymaker trying to understand what we can actually track, and what we cannot.",
    "words": 900,
    "criteria": [
      "Accuracy about what each mechanism can establish",
      "Currency: public artifacts from the last two years, found and cited with links",
      "Limits stated as the papers state them: the layer reduces cheating and does not defeat it",
      "A prioritization with reasons, not a list of mechanisms",
      "Named blind spots, each with the mechanism elsewhere in the course that covers it"
    ]
  },
  {
    "id": "m3-written-output",
    "module": 3,
    "unit": "3.x",
    "title": "Written Output",
    "status": "unspecified",
    "brief": null,
    "audience": null,
    "words": 800,
    "gap": "The track’s module anatomy gives every module one written output. Module 3 is the one module for which the outline never says which."
  },
  {
    "id": "m4-0-ranking-memo",
    "module": 4,
    "unit": "4.1",
    "title": "Defended-Ranking Memo",
    "status": "specified",
    "brief": "Produce the defended-ranking memo: a recommended mechanism portfolio for one named policy goal, with residual blind spots and their owners — the artifact the 4.2 capstone receives. Defend the ranking against both your own initial guesses and the field’s published ratings.",
    "audience": "Whoever acts on the 4.2 capstone — the portfolio is handed forward, not filed.",
    "words": 900,
    "criteria": [
      "Judged against the rubric"
    ]
  },
  {
    "id": "m4-capstone",
    "module": 4,
    "unit": "4.2",
    "title": "Capstone Project",
    "status": "specified",
    "href": "/verification/capstone",
    "brief": "One piece of work that shows what you have learned, applied to a problem you chose. There is no assigned task: choose a brief from the capstone bank, or suggest your own — it has to be relevant to technical AI governance and aimed at an AI-safety-related theme. Either way, put your name on the sign-up sheet, so your facilitator knows what you are working on and can read your proposal. The workspace holds the track’s own capstone template: design a minimal verification regime for a three-month emergency pause, then break it yourself.",
    "audience": null,
    "words": 0
  }
];
