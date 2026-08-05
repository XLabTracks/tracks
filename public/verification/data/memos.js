/* Every place the Verification Track outline marks as needing a written
   output. One entry per marked slot, transcribed from
   "[WIP] Verification Track Outline-2.docx" — the briefs are the outline's
   own words, not a paraphrase and not an invention.

   `status` is the honest part of this file:
     specified   — the outline states the assignment; brief/audience/length
                   are quoted from it.
     named       — the outline names the artifact ("case briefing on actors")
                   and nothing else. Everything past the name is undrafted.
     unspecified — the outline marks the slot and leaves it blank, or the
                   module anatomy implies one the outline never wrote.

   Trap: never promote a row by filling the gap yourself. A `named` or
   `unspecified` slot is a content decision that belongs to whoever owns the
   module; the desk's job is to say so and still let a learner draft into it.
   When the upstream brief lands, quote it and move the status. */

/* The outline's own module titles, indexed by module number. The skill graph
   names the same five modules differently (Foundations, Supply chain,
   Mechanisms, Evasion, Design); these slots are the outline's, so they carry
   the outline's names. */
window.VERIFICATION_MEMO_MODULES = [
  'Why Verification?',
  'Actors',
  'Verification Infrastructure',
  'Scheming and Evasion',
  'Trust Without Trust',
];

window.VERIFICATION_MEMOS = [
  /* The outline asks for these on the welcome page and in 0.2, and states each
     assignment in full, so the briefs below are quoted rather than summarised.
     Where it names no length the budget is the course default of 800 words —
     the desk's own fallback, not a number the outline gave. */
  {
    id: 'm0-welcome-reflection',
    module: 0,
    unit: '0.0',
    title: 'Opening reflection',
    status: 'specified',
    optional: true,
    brief:
      'Write a short note that you can look back on after completing the course:\n' +
      '- what you want to gain from the course;\n' +
      '- which part of international AI verification currently seems hardest;\n' +
      '- and which assumptions you expect the course to challenge.',
    audience: null,
    words: 300,
    peerReviewed: false,
  },
  {
    id: 'm0-plan-a-stress-test',
    module: 0,
    unit: '0.2',
    title: 'Option A — stress-test the Plan A verification supplement',
    status: 'specified',
    brief:
      'Read the verification supplement and apply the three moves to the claims below. Each claim, if it fails, is a distinct way the whole regime fails; part of your job is to name the failure mode each one guards against. You are building your own assessment, and reasonable readers of this supplement have landed in very different places.\n\n' +
      '- **The retrofit:** network taps and recomputation servers are described as leaving minimal room for vulnerabilities. What would an adversary with years of preparation and nation-state resources try first? (Failure mode: technical defeat — the monitoring hardware itself is compromised.)\n' +
      '- **The schedule:** declarations, mutual inspections, and the retrofit of most of the world’s datacenter compute are completed in roughly a year (2029–2030). What comparable industrial or diplomatic effort has ever moved at that speed? Most nuclear arms-control agreements took the better part of a decade each. (Failure mode: the timeline race.)\n' +
      '- **The trust anchor:** compliance rests on recomputation servers each side must trust. Who builds them, who audits them, and what happens when one side alleges tampering? (Failure mode: dispute spiral.)\n' +
      '- **The covert margin:** the plan estimates roughly half a percent of compute escaping to covert projects and treats that as manageable. Is it? What can be done with that margin, and how does it compound over a decade? (Failure mode: death by leakage.)\n' +
      '- **The third countries:** coverage above 99 percent requires participation well beyond the US and China, including Russia and the Gulf states. What actually brings them in? (Failure mode: the hole in the map.)\n' +
      '- **The vulnerable window:** during the transition, both signatories have partially powered down. That is exactly when defection pays most. What in the plan deters it then? (Failure mode: breakout at the seam.)\n' +
      '- **The transparency price:** which mechanisms expose commercially or militarily sensitive information, to whom, and why would the exposed party accept that? For each mechanism, ask which side of the Coe–Vaynman dial it sits on, and who would refuse it. (Failure mode: refusal at the door.)',
    audience: null,
    words: 800,
    peerReviewed: false,
  },
  {
    id: 'm0-plan-a-vs-plan-s',
    module: 0,
    unit: '0.2',
    title: 'Option B — compare the verification regimes of Plan A and Plan S',
    status: 'specified',
    brief:
      'Plan A is a verified slowdown: training halts, inference continues, and the whole regime hangs on being able to tell those two activities apart at datacenter scale. Plan S is shut it all down: a global moratorium on frontier development. Read the FAQ’s timeline argument, note that it is about urgency and prioritization rather than verification, then set it aside and reason about verification specifically.\n\n' +
      'One warning about sources: Plan S has no verification supplement. It exists in the document only as a contrast case. That asymmetry is the point of this task — for Plan S, you are reconstructing the regime it would need, not summarizing one someone else wrote. Work through:\n\n' +
      '- **The bright line.** For each plan, state the single rule an inspector must police. Which line is easier to state? Which is easier to check, given that training and inference run on the same chips?\n' +
      '- **The three moves, applied to the softer assumption.** Decide which plan’s load-bearing assumption is softer and run it through the three moves.\n' +
      '- **The transparency price, paid twice.** Which price would each signatory actually pay?\n' +
      '- **Failure modes, compared.** List two ways each regime fails and trace each to its cause. Do the two plans fail in the same ways, or does moving the bright line move the failure modes?\n' +
      '- **The verdict question.** Which plan is technically easier to verify, and which is politically easier to sustain? If those answers differ, what does that tell you about how much “verifiability” should count for when choosing between postures on the ladder?',
    audience: null,
    words: 800,
    peerReviewed: false,
  },
  {
    id: 'm0-success-scenario',
    module: 0,
    unit: '0.2',
    title: 'Essay — what does success look like to you?',
    status: 'specified',
    optional: true,
    brief:
      'In 500–800 words, describe your own success scenario: the end state (what the world looks like, and roughly when); the agreement that gets there (who signs, what is restricted); and what verification would need to cover for that agreement to hold.\n\n' +
      'Keep this essay. You will re-read it at the end of the track.',
    audience: null,
    words: 800,
    peerReviewed: false,
  },
  {
    id: 'm0-hinge-brief',
    module: 0,
    unit: '0.2',
    title: 'Brief, or scoping memo',
    status: 'specified',
    brief:
      'Either a one-to-two page brief for a nontechnical reader arguing that verification, not treaty text, is the hinge of any anti-ASI policy, or a scoping memo recommending one policy bucket to a named decision-maker with the costs stated plainly.',
    audience: 'A nontechnical reader, or a named decision-maker.',
    words: 800,
    peerReviewed: true,
  },
  {
    id: 'm0-compliance-under-anarchy',
    module: 0,
    unit: '0.3.2',
    title: 'Compliance under anarchy',
    status: 'unspecified',
    brief: null,
    audience: null,
    words: 800,
    peerReviewed: false,
    gap: 'The outline carries a "Written output:" marker at the end of 0.3.2 and leaves it empty.',
  },
  {
    id: 'm1-stakeholder-map',
    module: 1,
    unit: '1.0',
    title: 'Stakeholder map',
    status: 'specified',
    brief:
      'For a hypothetical pause treaty, place every relevant actor on the supply chain, annotate each with its most likely incentive class and the leverage it holds, and mark the two or three actors whose defection would collapse the regime.',
    audience: 'The drafting team for a hypothetical pause treaty.',
    words: 800,
    peerReviewed: true,
  },
  {
    id: 'm1-case-briefing',
    module: 1,
    unit: '1.7',
    title: 'Case briefing on actors',
    status: 'named',
    brief: null,
    audience: null,
    words: 600,
    peerReviewed: false,
    gap: 'Named in the module timing table as a 15–20 minute written exercise. No brief, audience or rubric is drafted.',
  },
  {
    id: 'm1-actor-authority-evidence',
    module: 1,
    unit: '1.x',
    title: 'Actor–authority–evidence map',
    status: 'named',
    brief: 'Actor–authority–evidence map for any element of the supply chain.',
    audience: null,
    words: 700,
    peerReviewed: false,
    gap: 'The artifact is named; length, audience and review criteria are not drafted.',
  },
  {
    id: 'm1-optional',
    module: 1,
    unit: '1.x',
    title: 'Optional written output',
    status: 'unspecified',
    optional: true,
    brief: null,
    audience: null,
    words: 600,
    peerReviewed: false,
    gap: 'An "[Optional written output]:" marker sits after the supply-chain actor list with nothing under it.',
  },
  {
    id: 'm2-1-hardware-brief',
    module: 2,
    unit: '2.1',
    title: 'Hardware assurance brief',
    status: 'specified',
    brief:
      'A bounded hardware assurance brief. The point is not forecasting the correct future — it is making the assessment conditional on visible facts: coverage, fidelity, time to deployment, and the preferred corroborating layer.',
    audience:
      'A named national delegation or joint drafting session considering a three-month U.S.–China pause.',
    words: 1000,
    peerReviewed: false,
  },
  {
    id: 'm2-2-cloud',
    module: 2,
    unit: '2.2',
    title: 'Essay, brief or reflection',
    status: 'named',
    brief: null,
    audience: null,
    words: 800,
    peerReviewed: false,
    gap: 'The outline offers the choice of genre — essay, brief or reflection — and stops there.',
  },
  {
    id: 'm2-3-ntm-redline',
    module: 2,
    unit: '2.3',
    title: 'Red-line the NTM article',
    status: 'specified',
    brief:
      'Work from the verbatim MIRI text you annotated in 2.3.4: Definition 17 plus the noninterference and no-deliberate-concealment articles. Mark at least three gaps or ambiguities, starting from your four answers if you like, and redraft the one provision whose failure you judge most consequential. Then confront the question the historical record says drafters avoid: write the sharing clause the text lacks, or defend its absence in three sentences. Test whatever you write against 2.3.4’s rule, that states sign what is symmetric, cheap, and checkable, and finish with the both-capitals test: one paragraph on why Washington accepts your article, one on why Beijing does.',
    audience: 'The drafters of a US–China agreement, read in both capitals.',
    words: 700,
    peerReviewed: true,
    criteria: [
      'Fidelity to what signatures can actually establish',
      'Precedent-consistent language',
      'Honesty about sharing',
      'Plausibility in both capitals',
      'Named blind spots, each with the sibling mechanism that covers it',
    ],
  },
  {
    id: 'm2-4-analytical-essay',
    module: 2,
    unit: '2.4',
    title: 'Analytical essay',
    status: 'named',
    brief: null,
    audience: null,
    words: 1000,
    peerReviewed: false,
    gap: 'Named at the close of the human-layer section. No prompt, audience or rubric is drafted.',
  },
  {
    id: 'm2-4-audit-law',
    module: 2,
    unit: '2.4',
    title: 'Brief or memo on the audit-requirement situation',
    status: 'named',
    optional: true,
    brief:
      'Optional. A brief or memo on the SB-53 and SB-1047 audit-requirement situation — or, instead, an analytical essay on what the laws currently cover, compared against the crypto wars or bioweapons.',
    audience: null,
    words: 800,
    peerReviewed: false,
    gap: 'Offered as one of two alternatives in a working note; neither is scoped.',
  },
  {
    id: 'm2-4-optional',
    module: 2,
    unit: '2.4',
    title: 'Inspection games, or timeliness and inspector commitment',
    status: 'named',
    optional: true,
    brief: null,
    audience: null,
    words: 600,
    peerReviewed: false,
    gap: 'The "[Optional written output]:" marker after 2.4.4 now names two alternatives — "Inspection games" and "Timeliness and inspector commitment" — and nothing else. No prompt, audience or rubric is drafted for either.',
  },
  {
    id: 'm3-written-output',
    module: 3,
    unit: '3.x',
    title: 'Written output',
    status: 'unspecified',
    brief: null,
    audience: null,
    words: 800,
    peerReviewed: true,
    gap: 'The track’s module anatomy gives every module one written output that goes through peer review. Module 3 is the one module for which the outline never says which.',
  },
  {
    id: 'm4-0-ranking-memo',
    module: 4,
    unit: '4.0',
    title: 'Defended-ranking memo',
    status: 'specified',
    brief:
      'Produce the defended-ranking memo: a recommended mechanism portfolio for one named policy goal, with residual blind spots and their owners — the artifact 4.1 receives. Defend the ranking against both your own initial guesses and the field’s published ratings.',
    audience: 'Whoever acts on 4.1 — the portfolio is handed forward, not filed.',
    words: 900,
    peerReviewed: true,
    criteria: ['Peer review against the rubric'],
  },
  {
    id: 'm4-2-capstone',
    module: 4,
    unit: '4.2',
    title: 'Capstone governance artifact',
    status: 'specified',
    brief:
      'Produce a governance artifact in a working format — treaty text, policy memo, or research proposal — with every mechanism claim anchored to a named precedent, provision, or source. Then compare your current positions against your written checkpoints from earlier modules, and account for what changed.',
    audience: 'Set by the format you choose; name it before you start.',
    words: 1600,
    peerReviewed: true,
  },
];
