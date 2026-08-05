/* The verification track content graph — 5 modules, 19 units.

   This file is the course. index/track/module pages render whatever they
   find here: adding a unit means adding one object, never a card, a nav
   entry, or a branch in the page JS. Unit ids are the progress keys and the
   rung tags in data/skills.js — renaming one orphans a learner's progress
   and silently unfills every skill it fed, so treat an id as permanent.

   Sources, all human-authored: the public Verification Track outline
   ([WIP] Verification Track Outline-2.docx, "Verification Track - Theme
   Outline" and the skill-tree ladder), and
   tracksprogramplayground/verification-track-outline.md. Nothing here is
   generated curriculum: where a section is not yet drafted upstream, the
   unit carries a `stub` block saying so rather than filler.

   Block kinds a unit body may hold:
     {p}     paragraph (**bold**, `code`, [text](href))
     {h}     sub-heading
     {ul}    bullet list (strings; a string may hold nested "· " items)
     {note}  editorial aside, gold rule
     {stub}  honest placeholder — says what is missing and who owns it */

window.COURSE = {
  id: 'verification',
  title: 'Verification',
  question: 'How could the US and China trust an international agreement to pause ASI development?',
  thesis: 'Stopping the development of models with dangerous capabilities requires multi-party agreements, and an agreement is only as strong as the confidence each party has that the others are keeping it. Verification is the set of technical, institutional, legal and diplomatic mechanisms that make an AI governance commitment credible.',
  audience: 'An intermediate course for learners between an introductory fellowship and a research program. The scaffolding fades as you go: early modules give you structure, later modules ask you to make independent judgments in an unsettled research field — because that is what the field itself requires.',
  format: [
    'Approximately ten weeks of self-paced online learning, 2–4 hours per week.',
    'In most modules you complete at least one short written output — a memo, brief, critique or design note — applying the module\'s concepts to a concrete verification problem.',
    'Parts of the course are also adapted for synchronous university groups, standalone workshops and shorter facilitated programs.'
  ],
  objectives: [
    'Translate a proposed international AI commitment into verifiable claims — the covered actors, activities, thresholds, declarations, evidence requirements, and conditions that would constitute compliance or non-compliance.',
    'Map relevant actors and verification opportunities across the AI compute supply chain, from semiconductor equipment and fabrication to cloud infrastructure, model training and deployment.',
    'Evaluate hardware, cloud, intelligence and human verification mechanisms by the claims they can test, the evidence they produce, their implementation requirements and their principal failure modes.',
    'Distinguish load-bearing verification mechanisms from less effective or less feasible ones.',
    'Analyze plausible evasion strategies and judge which combinations of monitoring, corroboration, inspection and enforcement could detect, deter or mitigate them.',
    'Produce clear, actor-aware policy analysis for a specified audience.'
  ],

  modules: [
    /* ------------------------------------------------------------ 0 */
    {
      n: 0,
      slug: 'foundations',
      title: 'Foundations',
      glyph: '✧',
      week: 'week 1',
      status: 'drafted',
      goal: 'Why do we care about verification, and why is it load-bearing for AI governance?',
      summary: 'Existential risk and the arms race, the branches an unverified agreement closes down, what seventy years of arms-control precedent does and does not transfer, and the strategic vocabulary the rest of the track runs on.',
      units: [

        { id: '0.1', title: 'Introduction', kind: 'explainer', mins: '15–20 min',
          goal: 'Establish the threat, the menu of possible responses, and the reason the nuclear parallel keeps coming up.',
          body: [
            { p: 'The track opens with the case that has to be made before any mechanism is worth designing: that frontier AI development carries risks serious enough to justify an international agreement, and that an agreement nobody can check is not an agreement.' },
            { h: 'Describing the threat' },
            { p: 'Any AI risk scenario sorts into at least one of three buckets — **misuse**, **misalignment**, **structural risk**. Being able to say which bucket a scenario sits in is the first analytic move of the course, because it determines who the actor is and therefore what a verification regime would have to watch.' },
            { p: 'Actors cheat for reasons: prestige, security, commercial advantage. Naming the motivation is what turns "someone might defect" into a threat model you can design against.' },
            { h: 'The menu of responses' },
            { ul: [
              '**Trust** — rely on declared intentions.',
              '**Punishment** — attach consequences after the fact.',
              '**Transparency** — make activity legible without constraining it.',
              '**Verification** — establish, independently, whether a commitment is being kept.'
            ] },
            { p: 'Each of the first three collapses into the fourth under pressure: punishment needs a finding to punish, transparency needs a way to tell a true declaration from a false one, and trust needs something to be trusting *about*.' },
            { h: 'Why nuclear keeps coming up' },
            { p: 'Nuclear arms control is the recurring parallel because it is the longest-running case of adversaries building machinery to check each other. It is used here as a source of patterns, not as a template — the disanalogies get their own unit at 0.3.' }
          ],
          coverage: [
            'Motivations for cheating: prestige, security, commercial advantage',
            'Misuse vs. misalignment vs. structural risk',
            'The response menu: trust, punishment, transparency, verification',
            'Nuclear as the first historical parallel'
          ],
          readings: [
            { t: 'Statement on AI Risk', a: 'CAIS', y: '2023', note: 'One sentence; read the signatory list too.' },
            { t: 'Superintelligence Strategy', a: 'Hendrycks, Schmidt & Wang', y: '2025' }
          ],
          exercise: 'ex-response-menu' },

        { id: '0.2', title: 'Building verification intuitions', kind: 'interactive', mins: '15–20 min',
          goal: 'Reach the punchline yourself: coordination plus verification is the only branch that does not close badly.',
          body: [
            { p: 'Three canonical paths run forward from today. Each is walked to its end state before the next one starts.' },
            { ul: [
              '**A · Independent restraint.** Race incentives dominate; the actor who slows down loses relative position and stops.',
              '**B · Coordination without verification.** The agreement is signed, and covert defection is undetectable — so the expectation of defection makes defection rational.',
              '**C · Coordination with verification.** The only branch where a commitment can survive the incentive to break it.'
            ] },
            { h: 'Success, defined before the machinery' },
            { p: 'A verification regime is not "good" in the abstract; it is sufficient or insufficient for a stated claim, against a stated adversary, over a stated horizon. That definition — **theory of victory** — gets written down here and is revisited in Module 4.' },
            { h: 'The clock' },
            { p: 'Detection that arrives after the thing it was watching for has already happened is not detection. **Timeliness** is a first-class design constraint from this point on: verification has to beat the branch clock, and how fast it has to be is set by the policy window you are designing for, not by what the mechanism happens to manage.' },
            { h: 'The tension, introduced' },
            { p: 'The last intuition is the one the whole of Module 2 is organised around: a verifier needs enough access to confirm compliance, and not enough to commit espionage. Both halves are hard requirements.' }
          ],
          coverage: [
            'Timelines and branches; why each branch closes badly',
            'Theory of victory: what counts as success, and as "in time"',
            'Timeliness as a derived requirement, not a mechanism property',
            'Confidentiality vs. verifiability — first pass'
          ],
          exercise: 'ex-branches' },

        { id: '0.3', title: 'History, precedents, parallels', kind: 'explainer', mins: '20–25 min',
          goal: 'Learn what arms-control regimes actually did — and be precise about which parts transfer to AI.',
          body: [
            { p: 'Seventy years of verification regimes give three main reference points, each of which failed and succeeded in a diagnosable way.' },
            { ul: [
              '**IAEA safeguards** — declared-material accountancy, and what happened when the declaration itself was the lie.',
              '**CWC** — the managed-access answer to the confidentiality problem: the institutional solution adopted because the cryptographic one did not exist.',
              '**BWC** — the cautionary case. A verification protocol that was technically imaginable and politically unacceptable.'
            ] },
            { h: 'The disanalogies' },
            { p: 'The parallels are load-bearing only where they hold. Fissile material is countable, scarce and physically distinctive; model weights are none of those things. Nuclear deterrence has no clean AI equivalent. State the disanalogy before you borrow the mechanism.' },
            { h: 'Securitization' },
            { p: 'Treating AI as a security question rather than a regulatory one is a move with costs, and it is argued honestly here: the Copenhagen School suspicion of securitization first, then the case that material existential risk warrants it.' },
            { h: 'Enforcement' },
            { p: 'A finding that leads nowhere changes nothing. Iraq in 1991 — and the Additional Protocol that followed it — is the worked case of what a regime did once it caught someone, and of how catching someone rewrote the rules for everybody.' }
          ],
          coverage: [
            'IAEA, BWC, CWC: what each regime verified and how it failed',
            'Honest disanalogies with the AI case',
            'Securitization: the case against, then the case for',
            'Enforcement: Iraq 1991 to the Additional Protocol'
          ],
          readings: [
            { t: 'Nuclear Arms Control Verification and Lessons for AI Treaties', a: 'Baker', y: '2023',
              note: 'Framing read only — Executive Summary (pp. 1–3), §1 Background, §4.4 Limitations. Baker\'s §2.3.3, §3.2.3 pp. 14–15, the §4.1 case narratives and App. E are taught as pinned excerpts in 2.3; keeping the two reads disjoint is deliberate.' }
          ],
          exercise: 'ex-precedents' },

      ]
    },

    /* ------------------------------------------------------------ 1 */
    {
      n: 1,
      slug: 'policy-and-actors',
      title: 'Policy and actors',
      glyph: '❖',
      week: 'weeks 2–3',
      status: 'drafted',
      goal: 'What exactly are we trying to verify, and who does the agreement rely upon, apply to, and constrain?',
      summary: 'A policy taken apart into the pieces a verifier can act on, the actors whose incentives decide whether it holds, and the chain of people whose claims you inherit and whose decisions you feed.',
      units: [

        { id: '1.0', title: 'What kind of policy are we trying to verify?', kind: 'explainer', mins: '15–20 min',
          goal: 'Separate the goal, the legal rule and the verification claim — three different sentences that get confused constantly.',
          body: [
            { p: 'Every policy carries three distinct statements, and a verification design that conflates them will check the wrong thing.' },
            { ul: [
              '**Goal** — the outcome the policy exists to produce.',
              '**Rule** — the legal text that binds an actor.',
              '**Claim** — the specific proposition a verifier must establish as true or false.'
            ] },
            { h: 'Thresholds are proxies' },
            { p: 'Total training FLOP is the operative threshold unit in current practice, with the EU AI Act (10^25) and the rescinded EO 14110 (10^26) as the usual reference points. Compute is a proxy for capability, and every drawn line invites the actor to optimise against the line rather than the goal — Goodhart, in treaty form. The proxy is not a mistake; pretending it is the goal is.' },
            { h: 'The menu, revisited' },
            { p: 'Self-governance, unilateral restraint, domestic regulation, transparency coordination, compute controls, a nonproliferation regime, international joint development, a coordinated halt. Each is scored on effectiveness and feasibility. The convergent argument: if you accept the securitized framing from 0.3, design toward the full pause — mechanisms strong enough for a pause support everything weaker.' },
            { h: 'Who pays' },
            { p: 'Cost is not only money. Sovereignty, confidentiality, time, human capital and political capital are all currencies a policy spends, and compliance burden and verification burden are separate ledgers carried by different actors.' }
          ],
          coverage: [
            'Goal vs. legal rule vs. verification claim',
            'Threshold types: compute, capability, hardware, prohibited activities',
            'Proxy risk and Goodhart drift',
            'Policy costs: who pays, in what currency'
          ],
          exercise: 'ex-policy-matrix' },

        { id: '1.1', title: 'Anatomy of a pause agreement', kind: 'interactive', mins: '20–25 min',
          goal: 'Take a real provision apart into actors, objects, activities and conditions — and find where it fails on its own terms.',
          body: [
            { p: 'A provision is a machine with four moving parts. Naming them is what converts legal text into something a verifier can act on.' },
            { ul: [
              '**Actors** — who is bound, who must authorise, who must be told.',
              '**Objects** — the thing the rule is about: hardware, weights, a facility, a training run.',
              '**Activities** — what is required, permitted or prohibited.',
              '**Conditions** — thresholds, timeframes, triggers and carve-outs.'
            ] },
            { h: 'Falsifiability' },
            { p: 'The question that separates a verifiable provision from a statement of intent: **what observation would show this rule was broken?** If no answer exists, the provision cannot be verified regardless of what mechanisms you attach to it.' },
            { h: 'Explicit and implicit' },
            { p: 'Agreements leave things ambiguous on purpose — ambiguity is often what makes signature possible. The exercise asks you to mark what is left open and to say whether each ambiguity is load-bearing for the deal or a hole in the regime.' },
            { p: 'The harder optional version compares two agreement models against each other and asks which of the seven recurring bones each one has: prover, verifier, declared thing, undeclared rule, access rights, confidentiality carve-out, response-to-violation clause.' }
          ],
          coverage: [
            'Decompose a provision: actors, objects, activities, conditions',
            'Falsifiability: what observation would show the rule was broken',
            'Explicit vs. implicit elements; deliberate ambiguity',
            'What the provision says happens on breach',
            'Optional: compare two agreement models'
          ],
          exercise: 'ex-anatomy',
          output: 'Short brief: state the verification claim implied by one provision, and the single observation that would falsify compliance.' },

        { id: '1.2', title: 'Actors', kind: 'interactive', mins: '25–30 min',
          goal: 'Map who holds the evidence, where the chain narrows, and what each actor is being paid to do.',
          body: [
            { h: 'Public' },
            { ul: [
              'States and international institutions — the United States and China first, then the semiconductor supply-chain states: Taiwan, the Netherlands, Japan, South Korea.',
              'Within-state institutions: national regulators, foreign and defence ministries, intelligence agencies.',
              'Candidate international verification bodies.'
            ] },
            { h: 'Private' },
            { ul: [
              'Frontier AI labs; cloud providers; chip designers; fabs and memory; equipment suppliers; packaging, inputs and deployers.',
              'Contractors, resellers, proxy organizations and shell companies — the part of the map that exists to be hard to see.'
            ] },
            { h: 'The chain is concentrated and distributed at once' },
            { p: 'Chokepoints are what make verification possible; distribution is what makes coordination necessary. Both facts are true of the same supply chain, and a regime that only notices one of them fails in a predictable direction.' },
            { h: 'Five moves' },
            { p: 'Any actor can **cooperate, defect, conceal, exaggerate or free-ride**. Roles are not fixed types: the same actor plays differently depending on the incentive structure it sits in. A. Q. Khan is the recurring archetype — dual-use legality, working the seams between jurisdictions.' }
          ],
          coverage: [
            'Public actors: states, regulators, intelligence agencies, international bodies',
            'Private actors: labs, cloud, chip designers, fabs, equipment, resellers, proxies',
            'Where the chain narrows enough for a control to attach',
            'The five moves: cooperate, defect, conceal, exaggerate, free-ride',
            'Historical parallel: Khan and the seams'
          ],
          readings: [
            { t: 'Computing Power and the Governance of AI', a: 'Sastry, Heim, Belfield et al.', y: '2024' },
            { t: 'Verification Methods for International AI Agreements', a: 'Wasil et al.', y: '2024', note: 'The taxonomy spine for Module 2 — read it here, use it there.' }
          ],
          exercise: 'ex-chokepoints',
          output: 'Case briefing on actors: given a scenario, identify the actors, tag each with role and incentive, and brief a specified audience.' },

        { id: '1.3', title: 'Upstream and downstream', kind: 'explainer', mins: '10–15 min',
          goal: 'No document is written in a vacuum. Know whose claims you inherited and who has to act on yours.',
          body: [
            { p: 'Every verification artifact — a report, an assessment, a finding — is one link in a chain of actors, and both directions have to be made explicit.' },
            { h: 'Upstream' },
            { p: 'Whose claims does this document rely on, and which of them did I verify myself rather than inherit from the actor being checked? An assessment that silently rests on the subject\'s own declaration is a declaration wearing an assessment\'s clothes.' },
            { h: 'Downstream' },
            { p: 'Who will act on this document, and what does each reader need in order to act? A finding that a decisionmaker cannot use is a finding that does not exist. This is where confidence grading starts: **confirmed, plausible, unresolved, unsupported** — and the grade has to survive being summarised.' }
          ],
          coverage: [
            'Upstream: whose claims a report inherits',
            'Downstream: who acts, and what they need in order to act',
            'How much weight one source carries',
            'Confidence grading that survives compression'
          ],
          exercise: 'ex-upstream' }
      ]
    },

    /* ------------------------------------------------------------ 2 */
    {
      n: 2,
      slug: 'evidence-streams',
      title: 'Evidence streams',
      glyph: '⚙',
      week: 'weeks 4–8',
      status: 'notes complete',
      goal: 'What technical and institutional mechanisms let a verifier check compliance — and what can each one actually prove?',
      summary: 'Four evidence layers, each analysed the same way: what claim it can test, what evidence it produces, what it costs to stand up, what can be faked, and what it systematically misses. Hardware and intelligence carry the weight; cloud and human corroborate.',
      units: [

        { id: '2.0', title: 'Confidentiality vs. verifiability', kind: 'explainer', mins: '15–20 min',
          goal: 'The verifier\'s paradox, and the five ways of sorting mechanisms that the rest of the module uses.',
          body: [
            { h: 'The paradox' },
            { p: 'Verification is inherently intrusive. The regime needs enough access to confirm compliance and not enough to enable espionage — and the two requirements are in direct tension, not in balance. Two questions get answered separately for every mechanism: **what must remain confidential**, and **what must a verifier be able to learn?**' },
            { p: 'Privacy-preserving mechanisms are the attempt to satisfy both: hardware-anchored identity and attestation, zero-knowledge proofs, secure multiparty computation. Where the cryptography does not exist yet, the institutional answer is managed access — the CWC precedent from 0.3.' },
            { h: 'Five ways to sort a portfolio' },
            { ul: [
              'By **layer** — hardware, cloud, intelligence, human.',
              'By **access required** — what the verifier must be let near.',
              'By **policy goal** — which claim the mechanism serves.',
              'By **lifecycle** — where in design, production, deployment or operation it attaches.',
              'By **adversary robustness** — what it survives when the owner is the party you are trying to catch.'
            ] },
            { p: 'No single layer covers the claim. That is the reason there is a taxonomy at all, rather than a shortlist.' },
            { h: 'Seal your ranking' },
            { note: 'You rank the mechanisms on feasibility here, before you know anything about them, and the ranking is sealed. Unit 4.0 reopens it and asks what changed and why. The point is not to be right now — it is to have something concrete to revise.' }
          ],
          coverage: [
            'The verifier\'s paradox: access vs. espionage',
            'What must stay confidential; what a verifier must learn',
            'Privacy-preserving mechanisms: attestation, ZKPs, MPC, managed access',
            'Five taxonomies: layer, access, policy goal, lifecycle, adversary robustness',
            'Sealed feasibility ranking, reopened at 4.0'
          ],
          readings: [
            { t: 'Mechanisms to Verify International Agreements on AI', a: 'Scher & Thiergart', y: '2024', note: 'Decomposition by policy goal.' }
          ],
          exercise: 'ex-mechanism-rank' },

        { id: '2.1', title: 'Hardware', kind: 'explainer', mins: '35–45 min',
          goal: 'The heaviest bucket: what silicon can make verifiable, and where each mechanism stops working.',
          body: [
            { h: '2.1.0 · What hardware can make verifiable' },
            { p: 'Three different things get confused constantly: **identifying** compute, **measuring** it, and **restricting** it. They need different mechanisms, different cooperation, and they support different treaty claims.' },
            { h: '2.1.1 · Identity and attestation' },
            { ul: [
              'Chip identity, hardware roots of trust, secure boot, remote attestation.',
              'How these could support registries and compliance reporting.',
              'Who controls keys, standards, updates and the attestation infrastructure — a governance question wearing a technical costume.',
              'Limits under physical access, supply-chain compromise and a state-level adversary.'
            ] },
            { note: 'Secure boot works against the adversary it was designed for. Governance inverts the threat model: the owner of the machine is the party you are trying to catch, and almost every consumer-security assumption is written the other way round.' },
            { h: '2.1.2 · Measuring and controlling compute' },
            { ul: [
              'Compute metering and workload measurement; FLOP vs. FLOP/s.',
              'Licensing and authorization controls; who can authorize, suspend, revoke or override.',
              'How hardware could operationalize a compute threshold.',
              'Circumvention risks and present-day feasibility — no production chip meters tamper-resistantly today. These are proposals, not deployed capability.'
            ] },
            { h: '2.1.3 · Independent verification of training claims (optional)' },
            { ul: [
              'Checkpoints, training records, probabilistic recomputation.',
              'Verification clusters and proof-of-learning — fragile, and spoofed in the literature.',
              'Cost, institutional requirements and spoofing risks.'
            ] },
            { h: '2.1.4 · Policy judgment' },
            { p: 'Every mechanism gets the same five questions: which treaty claim does it support; does it identify, monitor, restrict or independently verify; which actors must cooperate; what trust assumptions and failure modes remain; and under what political and technical conditions is deployment realistic.' }
          ],
          coverage: [
            'Identify vs. measure vs. restrict',
            'Chip identity, roots of trust, secure boot, remote attestation',
            'Key control, standards and update authority',
            'Metering, licensing and authorization controls',
            'Optional: checkpoints, proof-of-learning, probabilistic recomputation',
            'Deployment pathway, control authority, tamper resistance'
          ],
          readings: [
            { t: 'What Does It Take to Catch a Chinchilla?', a: 'Shavit', y: '2023', note: 'One worked mechanism in depth.' }
          ] },

        { id: '2.2', title: 'Cloud', kind: 'explainer', mins: '20–25 min',
          goal: 'The provider sits between the customer and the machines. What does that position see, and what can it never see?',
          body: [
            { h: '2.2.1 · What providers can observe' },
            { ul: [
              'Customer identity and account relationships.',
              'Cluster allocation, utilization and workload patterns.',
              'Logs, billing records and security incidents.'
            ] },
            { h: '2.2.2 · Reporting, monitoring, control' },
            { ul: [
              'Cluster registration and training-run declarations.',
              'KYC, beneficial ownership and reseller chains.',
              'Log preservation, suspicious-use reporting, access suspension.'
            ] },
            { note: 'The failure mode has a name: **a paperwork regime**. When the filing becomes the thing measured, an actor optimises the filing. Self-reporting with no independent cross-check is not a verification layer, however much of it there is.' },
            { h: '2.2.3 · Limits and policy judgment' },
            { ul: [
              'Proxies, fragmented accounts, false workload labels, provider capture.',
              'Self-hosted compute, non-signatory jurisdictions, stolen weights — all of which route around the layer entirely, and are picked up in 3.1.',
              'What can be faked (identity, declared purpose, workload labels, logs) against what is hard to fake (power draw, cooling, interconnect use, procurement, satellite-visible buildout).'
            ] }
          ],
          coverage: [
            'What the provider position sees; what it structurally cannot',
            'Registration, KYC, beneficial ownership, reseller chains',
            'The paperwork-regime failure mode',
            'Provider coverage, jurisdiction and account linkage'
          ],
          output: 'Essay or brief: what cloud evidence can establish on its own, and what it requires corroboration for.' },

        { id: '2.3', title: 'Intelligence', kind: 'explainer', mins: '35–45 min',
          goal: 'The second heaviest bucket, and the one the other three lean on: how undeclared development leaves footprints, and how a footprint becomes a finding.',
          body: [
            { h: '2.3.1 · Observable signatures' },
            { ul: [
              'Data-center construction, energy use, cooling infrastructure.',
              'Chip procurement, financial activity, organizational behavior.',
              'For each: what it reveals, what access reading it requires, and how it could be concealed.'
            ] },
            { h: '2.3.2 · The empirical anchor' },
            { p: 'The historical record\'s recurring shape: national intelligence identifies, the regime resolves. Tips from national collection have found undeclared facilities that routine safeguards missed — which is a different claim from "intelligence establishes non-compliance". Generating a credible lead and establishing a treaty violation are two separate acts with two separate standards.' },
            { h: '2.3.3 · From signal to assessment' },
            { ul: [
              'Alternative explanations, dual-use ambiguity, base rates.',
              'Reliability, timeliness, corroboration, confidence judgments.',
              'The progression: anomaly → verification lead → suspected non-compliance.'
            ] },
            { note: 'The detection-statistics trap: against a haystack of roughly five hundred plausible sites, an alarm rate that sounds excellent produces a caseload that is almost entirely false positives. Run the arithmetic before trusting the alarm.' },
            { h: '2.3.4 · Institutions and treaty design' },
            { ul: [
              'National agencies, international bodies, and radically unequal collection capacity.',
              'Intelligence sharing, protection of sources and methods, authentication of shared evidence.',
              'National technical means, noninterference, and no-deliberate-concealment provisions.'
            ] },
            { h: '2.3.5 · From lead to action' },
            { p: 'Compare observed activity against declarations and request clarification; task further collection, seek corroboration, or trigger an audit or challenge inspection. Choose a **proportionate** next step, and record confidence, dissent and the blind spots you did not resolve.' }
          ],
          coverage: [
            'Physical, financial and organizational signatures',
            'Intelligence identifies, the regime resolves',
            'Alternative explanations, dual-use ambiguity, base rates',
            'Sharing institutions, sources and methods, national technical means',
            'Proportionate next investigative step; recorded confidence and dissent'
          ],
          readings: [
            { t: 'Nuclear Arms Control Verification and Lessons for AI Treaties', a: 'Baker', y: '2023',
              note: 'Pinned excerpts: §2.3.3 Intelligence sharing (p. 10), §3.2.3 pp. 14–15, the §4.1 case narratives (pp. 18–19), App. E (pp. 34–35).' }
          ],
          exercise: 'ex-signals' },

        /* ---- 2.4 verification log ------------------------------------
           Unit 2.4 is the only unit in the track that rests on statute, and
           statute here moved twice inside twelve months. Every legal claim
           below is dated in the learner-facing prose for that reason: a
           reader in 2027 must be able to see what the sentence was true of.
           Checked 2026-08-05.

             claim                                                status
             SB 1047 vetoed 2024-09-29; carried third-party
               audit and anti-retaliation provisions              confirmed
             SB 53 (TFAIA) signed 2025-09-29 — anti-retaliation
               for employees and contractors, required anonymous
               internal channel, notice of rights; no audit
               mandate; OES incident reporting at 15 days,
               24 h on imminent danger                            confirmed
             RAISE signed 2025-12-19 with an annual independent
               third-party audit clause; chapter amendment
               signed 2026-03-27 removed both that clause and
               the whistleblower section; effective 2027-01-01    confirmed
             Wasil et al. (2408.16074) class whistleblowers as a
               national technical means and cite the SEC program
               under Dodd-Frank (10–30% of sanctions) as the
               incentive precedent                                confirmed
             Brundage et al. (2601.11699): four AI Assurance
               Levels, AAL-1 baseline / AAL-2 near-term           confirmed
             Anderljung et al. (2311.14711): ASPIRE = Access,
               Searching attitude, Proportionality, Independence,
               Resources, Expertise                               confirmed
             Scher et al. (2511.10783) Article X carries
               challenge inspections and whistleblower
               protections in one article                         confirmed
             FLI "Draft Articles" Annex B.1                       unchecked
               Named in the working note for this unit; four search angles
               found no such FLI document. Nothing in the unit rests on it —
               the draft-treaty text 2.4.3 cites is the Scher et al.
               Article X the track already annotates at 2.3.4. Replace this
               row if the FLI text is located.
             AI Whistleblower Protection Act (Grassley/Coons)
               still a bill, not law                              unchecked
               Introduction on 2025-05-15 is confirmed; no evidence found
               either way of floor action since. The prose says
               "introduced", never "enacted", and carries the date. */

        { id: '2.4', title: 'Human', kind: 'explainer', mins: '30–40 min',
          goal: 'People reveal what hardware, cloud and intelligence cannot: what the organization believed, and what it suppressed.',
          body: [
            { h: '2.4.0 · Introduction' },
            { p: 'Every other layer in this module reads a consequence. Power draw is a consequence of computation, a procurement record is a consequence of a purchase, a satellite image is a consequence of pouring concrete. None of them reads a decision. The human layer is the only one that reaches what an organization **knew, intended, and chose not to say** — the evaluation that was run and shelved, the threshold quietly redefined, the deployment that went ahead over an objection.' },
            { p: 'It is also the only layer whose sensor has interests of its own. A satellite cannot be fired, sued, or asked to sign a departure agreement. Nearly everything difficult about this layer follows from that one asymmetry, and the unit is ordered by it: who can see what (2.4.1), what makes speaking survivable (2.4.2), what a formal right of access adds once someone has spoken (2.4.3), and whether the institutions holding these powers have earned belief (2.4.4).' },

            { h: '2.4.1 · Insiders and human sources' },
            { p: 'Access is not one thing. Sort a potential source by what their position physically puts in front of them — not by seniority, and not by how strongly they feel — because that is what bounds the claims they can support.' },
            { ul: [
              '**Research and engineering staff** — training runs, evaluation results, what was measured and what was quietly not. The only source who can speak to a capability claim from the inside.',
              '**Safety, security and compliance staff** — the distance between the published framework and the practice. Positioned to watch a policy being rewritten around an inconvenient result.',
              '**Contractors and vendors** — construction, power, cooling, physical security. Present at the building of a facility that never gets declared, and typically bound by weaker agreements than employees.',
              '**Suppliers and logistics** — chip volumes, destinations, reseller chains. What 2.2 calls beneficial ownership, seen from the shipping side.',
              '**Executives and board members** — the decision itself, and the record of who was told what, when.'
            ] },
            { p: 'What decides whether any of them reports is rarely access. It is conviction, career, unvested equity, loyalty to colleagues, a non-disclosure agreement, immigration status tied to an employer — and a flat estimate of whether reporting will change anything, which is a fact about the regime rather than about the person. A regime that has never visibly acted on a report has already told its next source what to expect.' },
            { p: 'A source arrives with four problems attached. **Credibility** — is this person who they say they are, and were they where they say they were. **Corroboration** — does anything outside the account support it. **Access limits** — a witness can be entirely truthful and still be reporting from a position that could not have seen the thing being described. And **deception** — a planted source is a cheap way to spend an opponent\'s inspection budget, and a fabricated report that survives all the way to a challenge inspection burns the regime\'s credibility, not the fabricator\'s.' },
            { p: 'One classification is worth carrying forward because it is counter-intuitive. Wasil et al. file whistleblowers under **national technical means** — the same family as remote sensing and financial intelligence, defined by needing no permission from the party under suspicion. An insider account is the one deep-access evidence stream a verifier can obtain from a state that is cooperating with nothing. That is also precisely why a closed regime works hardest to shut it off.' },
            { note: 'Boundary with 2.3. Here the whistleblower is a **person and an institution**: what they can see, what it costs them to speak, and the machinery that receives them. The whistleblower as a **signal** belongs to 2.3, where a tip is an intelligence lead and the progression is anomaly → corroborate → recommend an inspection. This unit hands "how a tip becomes a finding" back to 2.3, and the response to it forward to 3.2, and does not repeat either.' },

            { h: '2.4.2 · Reporting and protection' },
            { p: 'A channel that is not survivable is not a channel. Three properties, and losing any one collapses the layer: the route is **confidential**, the person is **protected** from what follows, and the far end is someone **authorised to act**. A hotline into a compliance function that reports to the executive being reported on satisfies none of the three.' },
            { p: 'The design menu is not speculative. It is transposed almost part-for-part from financial regulation, where the same problem was met with the same components:' },
            { ul: [
              '**Anti-retaliation protection**, with a remedy the worker can actually reach and a burden of proof that does not require them to establish motive.',
              '**Financial reward**, because reporting ends careers. The SEC program under Dodd-Frank pays 10–30% of sanctions collected; Wasil et al. cite it as the working precedent for AI, alongside the $83m paid to three whistleblowers in the Merrill Lynch customer-funds case.',
              '**Secure and anonymous channels**, so that the act of reporting does not itself identify the reporter.',
              '**Legal support and job protection**, since the opposing party has counsel on retainer and the reporter does not.',
              '**A legal duty to report** for defined categories of knowledge, which turns silence from a safe default into an exposure.',
              '**Cross-border recognition**, without which a source employed by a multinational is protected in one jurisdiction and naked in the next.'
            ] },
            { p: 'Frontier AI adds an obstacle the financial precedent did not have to face: **equity**. Where much of compensation is unvested stock and a departure agreement can be conditioned on silence, retaliation does not require firing anyone. It is priced in advance and collected automatically — which is why non-disparagement and non-disclosure terms are a verification question here, not an employment one.' },
            { p: 'Where the law actually stands, **as of August 2026**, is unsettled and moving in both directions at once. California\'s SB 1047 carried both an audit mandate and anti-retaliation provisions, and was vetoed in September 2024. Its successor SB 53 — the Transparency in Frontier Artificial Intelligence Act, signed 29 September 2025 — kept the whistleblower half: anti-retaliation cover for employees and contractors reporting catastrophic risk, a required anonymous internal reporting channel, and notice to workers of those rights. New York\'s RAISE Act, signed 19 December 2025, went further on paper and then reversed — a chapter amendment signed 27 March 2026 struck the whistleblower section outright, before the law takes effect on 1 January 2027. Federally, the AI Whistleblower Protection Act was introduced on 15 May 2025 and is a bill.' },
            { p: 'Protection is only half the problem. Evidence that reaches a verifier unauthenticated and unpreserved is a rumour with a name attached. **Authentication** — establishing that a document is what it purports to be and that an account is first-hand. **Preservation** — a chain of custody that survives the source later being discredited, and a copy that does not live only on a machine the employer controls. **Transmission** — a route to an authorised verifier that does not also require the source to become a public figure. Each of the three is a separate way for a truthful report to stop being usable.' },

            { h: '2.4.3 · Audits and inspections' },
            { p: 'A report gives a verifier a reason to look. Audits and inspections are the machinery for looking, and they are distinct instruments with different triggers and very different politics.' },
            { ul: [
              '**Third-party audit** — recurring, scheduled, consented to, aimed at practices rather than at a specific suspicion. It tests whether a developer\'s stated safety and security procedures exist and are followed.',
              '**Routine inspection** — periodic access under a standing treaty right, at declared sites. Its real product is a baseline, which is what later makes an anomaly legible as an anomaly.',
              '**Challenge inspection** — short notice, at a site of the challenger\'s choosing, triggered by suspicion. The expensive one, and the one regimes are most reluctant to use, because a challenge that finds nothing is a political loss for the challenger.'
            ] },
            { p: 'The frontier-audit literature supplies the vocabulary this section runs on. Brundage et al. propose four **AI Assurance Levels** — AAL-1 as a baseline leading developers should already meet, AAL-2 as the near-term objective — and name what is missing before the higher levels are reachable at all: quality standards for audits, an audit-provider ecosystem large enough to supply them, incentives strong enough to drive adoption, and technical readiness that does not yet exist. Anderljung et al. give the six conditions under which external scrutiny works, as **ASPIRE**: Access, Searching attitude, Proportionality to the risks, Independence, Resources, Expertise. Both are best read as checklists to hold against a real arrangement.' },
            { p: 'Access is always negotiated, and 0.3\'s **managed access** is the frame: constrain what an inspector may see, record or remove — never what they may conclude. On-site sampling instead of removal, shrouded equipment, redaction agreed in advance, escorted routes. On the AI side the confidentiality at stake is model weights, training data and security architecture, and an inspection design that cannot protect those will simply not be agreed to.' },
            { p: 'What happens on **delay or refusal** has to be written before it is needed. Refusal is information. A regime that treats it as a procedural hiccup has decided in advance that refusing is free, and the provisions that matter are the deadline, the escalation path, and whether unexplained delay is itself a finding.' },
            { p: 'The draft-treaty text the track annotates at 2.3.4 is a worked example of the coupling: Scher et al. put challenge inspections and whistleblower protections inside a single article, Article X, on the reasoning that a right of access and a supply of reasons to exercise it are one mechanism rather than two. Read it against your own answer to who may trigger an inspection, and on what showing.' },
            { note: 'Three jobs, three bodies. **Collecting** evidence, **adjudicating** whether it amounts to non-compliance, and **recommending** what to do about it are separate functions with separate standards of proof and separate political exposure. Regimes get into trouble when one body does all three: an inspectorate that also judges is ruling on its own competence, and an inspectorate that also recommends sanctions has an interest in the finding. Look for the separation in any design you are handed — and in any you draw.' },

            { h: '2.4.4 · Institutions and policy judgment' },
            { p: 'Every claim in this unit routes through an institution, so the institution gets the scrutiny the mechanism got. **Independence** — who pays, who appoints, who can end the relationship, and whether the auditor sells other services to the audited. **Competence** — whether the auditor can evaluate what they are shown, which at the frontier means hiring from the same small pool the developers are bidding for. **Accountability** — what happens to an auditor who signs off on something that later fails. **Capture** — usually the slow kind, where an auditor economically dependent on a handful of clients drifts toward their view of what is reasonable.' },
            { p: 'The resulting failure has a name. **Safety-washing** is presenting a measure that tracks capability as if it were evidence of safety; Ren et al. document it for benchmarks, and the same move is available to any audit whose scope was set by the audited. Manheim et al. push a related argument: publishing audit standards without a standing body to maintain them makes matters worse rather than better, by proliferating inconsistent standards that each certify something different. Both point the same way — an audit regime is worth exactly what the institution deciding what an audit *is* is worth.' },
            { p: '**What this layer establishes** that no other can: intent, internal knowledge, and suppression. **What it systematically misses**: it is unrepresentative by construction. There is no sampling frame for insiders — you hear from organizations porous enough to leak, which is not the same set as organizations that are violating. Absence of reports is therefore not evidence of compliance, and a regime that reads it that way has built an incentive to tighten agreements rather than to comply.' },
            { p: 'So the layer is corroborated, never trusted alone. An insider account of an undeclared facility gets checked against the physical and financial signatures of 2.3 — construction stage, power, cooling, procurement — and commercial satellite imagery is the cheapest of those checks to obtain, which is why the FAS study sits in this unit\'s readings and not only in 2.3\'s.' },
            { p: '**Which actors must cooperate** is where the unit lands, and the honest answer is: the ones with the least reason to. An audit regime needs the audited to grant access. An inspection regime needs the host state to admit inspectors. A whistleblower regime needs the employer\'s own jurisdiction to enforce protections against the employer. None of the three is self-executing, and each is a standing invitation to quiet non-performance.' },
            { p: 'The clearest evidence of how that goes is recent and domestic. New York\'s RAISE Act was signed on 19 December 2025 requiring large developers to retain an independent third party for an annual audit of their safety and security protocols, publish a redacted summary, and file it with the state. Before the law had taken effect, a chapter amendment signed on 27 March 2026 removed the audit requirement entirely, aligning the statute with California\'s SB 53, which had declined to mandate audits in the first place. Read as of **August 2026**: no US state mandates third-party audits of frontier developers, and the one state that enacted such a mandate repealed it before it bound anybody.' },
            { note: 'That sequence is the unit\'s hardest lesson, and it is about political economy rather than about auditing. A mechanism can be technically sound, drafted, passed and signed, and still not survive to its own effective date. When you judge a human-layer mechanism, judge the coalition that would have to keep defending it after the press cycle ends — not only whether it would work.' }
          ],
          coverage: [
            'What the human layer reads that no instrument does: intent, internal knowledge, suppression',
            'Sources by access: research, safety, contractors, suppliers, executives',
            'What decides whether a source reports — including the regime\'s own track record',
            'Credibility, corroboration, access limits, deception',
            'Whistleblowers as a national technical means: deep access without the target\'s consent',
            'Survivable channels: confidential, protected, connected to someone who can act',
            'The protection menu and its Dodd-Frank precedent; equity and NDAs as pre-priced retaliation',
            'Where the law stands, and how fast it moved',
            'Authentication, preservation, transmission',
            'Audit vs. routine inspection vs. challenge inspection; AALs and ASPIRE',
            'Managed access; delay and refusal as findings',
            'Collect, adjudicate, recommend — three jobs, three bodies',
            'Independence, competence, accountability, capture; safety-washing',
            'Unrepresentative by construction; what must corroborate a human report',
            'Who must cooperate — and the RAISE audit clause as the worked case'
          ],
          readings: [
            { t: 'Frontier AI Auditing: Toward Rigorous Third-Party Assessment of Safety and Security Practices at Leading AI Companies', a: 'Brundage et al.', y: '2026',
              note: 'The audit half of 2.4.3. Read for the four AI Assurance Levels, and for the four things the authors say are missing before the higher ones are reachable. [arXiv:2601.11699](https://arxiv.org/abs/2601.11699)' },
            { t: 'Towards Publicly Accountable Frontier LLMs: Building an External Scrutiny Ecosystem under the ASPIRE Framework', a: 'Anderljung et al.', y: '2023',
              note: 'ASPIRE — Access, Searching attitude, Proportionality, Independence, Resources, Expertise — is the checklist 2.4.4 holds against institutions. [arXiv:2311.14711](https://arxiv.org/abs/2311.14711)' },
            { t: 'Tracking Hyperscale AI Data Center Growth with Satellite Imagery', a: 'Krawec, FAS', y: '2026',
              note: 'Not a human-layer mechanism — it is the corroborating stream from 2.3 that a human report gets checked against, which is why 2.4.4 sends you here. Read for what imagery settles (construction stage, power, cooling, the xAI turbine count against its permit) and for what it cannot see at all, which is anything inside the building. [fas.org](https://fas.org/publication/tracking-hyperscale/)' },
            { t: 'Verification methods for international AI agreements', a: 'Wasil, Reed, Miller & Barnett', y: '2024',
              note: 'Supporting. The whistleblower section is the source for 2.4.1\'s classification and 2.4.2\'s protection list, including the SEC/Dodd-Frank precedent — and for the limitations the same authors put on it. [arXiv:2408.16074](https://arxiv.org/abs/2408.16074)' },
            { t: 'Safetywashing: Do AI Safety Benchmarks Actually Measure Safety Progress?', a: 'Ren et al.', y: '2024',
              note: 'Supporting, for 2.4.4. The measurement failure an audit inherits whenever the audited sets the scope. [arXiv:2407.21792](https://arxiv.org/abs/2407.21792)' },
            { t: 'The Necessity of AI Audit Standards Boards', a: 'Manheim et al.', y: '2024',
              note: 'Supporting, for 2.4.4. The argument that audit standards without a standing body to maintain them are worse than none at all. [arXiv:2404.13060](https://arxiv.org/abs/2404.13060)' }
          ],
          exercise: 'ex-human-layer',
          output: 'Analytical essay: what the human layer establishes that no other layer can, and the conditions under which it is credible. Two optional alternatives sit on the [memo desk](memo-desk.html) — a brief on the SB 53 / SB 1047 / RAISE audit-requirement situation, and a shorter piece on inspection games or on timeliness and inspector commitment.' }
      ]
    },

    /* ------------------------------------------------------------ 3 */
    {
      n: 3,
      slug: 'covert-development',
      title: 'Covert development',
      glyph: '⚠',
      week: 'week 9',
      status: 'taxonomy complete',
      goal: 'How would a determined actor get around the regime you just learned — and what still fires when they do?',
      summary: 'The stack gets attacked here. A catalog of evasion routes ordered by feasibility, the Swiss-cheese model of overlapping imperfect layers, and a red-team / blue-team exercise that ends in a defensible finding.',
      units: [

        { id: '3.0', title: 'What is covert development?', kind: 'explainer', mins: '10–15 min',
          goal: 'Adversarial thinking as a discipline: break it before you trust it.',
          body: [
            { p: 'Everything up to here analysed mechanisms one at a time. From here the object of analysis is the **stack as a whole**, and the actor is assumed to know how it works.' },
            { h: 'Three different goals' },
            { ul: [
              '**Evading detection** — the activity is never seen.',
              '**Evading attribution** — the activity is seen, and cannot be pinned on anyone.',
              '**Delaying response** — the activity is seen and attributed, too late to matter.'
            ] },
            { p: 'The third is the one designers forget. Delay is an adversary goal in its own right, separate from concealment, and it is defeated by different machinery.' },
            { h: 'Red team and blue team' },
            { p: 'The red team designs an evasion strategy against a proposed regime. The blue team identifies detection opportunities, corroboration needs and response options. Both sides name the assumptions they are optimising against — the exercise is worthless if either side is allowed to assume its own conclusion.' }
          ],
          coverage: [
            'Failure modes at stack level, not mechanism level',
            'The verifier-aware actor',
            'Detection vs. attribution vs. delay',
            'Red team / blue team definitions'
          ] },

        { id: '3.1', title: 'How could a determined actor cheat?', kind: 'interactive', mins: '30–40 min',
          goal: 'The catalog, ordered by feasibility — and, for each route, which layers still see something.',
          body: [
            { p: 'Eight routes around a compute-anchored regime. Each is rated on feasibility for the evader, detectability for the verifier, longevity and harm, and who holds the authority to prevent or fix it.' },
            { ul: [
              '**Proxy organizations** — a compliant-looking entity fronting for a non-compliant one.',
              '**Smuggled hardware** — transshipment and diversion through the seams between jurisdictions.',
              '**Threshold gaming** — algorithmic efficiency and "effective compute" creep move capability without moving the measured number.',
              '**Weight exfiltration** — bypasses the compute regime entirely; the artifact was already built.',
              '**Repurposed infrastructure** — training disguised as inference, or as safety research.',
              '**False reporting** — hidden clusters, legacy hardware, disguised workloads, falsified logs.',
              '**Tampering with the machinery** — spoofed attestation, TEE attacks, inspector capture, channel flooding.',
              '**Distributed training** — sub-threshold fragmentation across sites or accounts.'
            ] },
            { h: 'Swiss cheese' },
            { p: 'No layer is sound. The design question is whether the holes line up: which layers touch each route, and what residual blind spot remains **when every layer works as designed**. And the failure that eats regimes: two layers resting on the same declaration are one layer wearing two hats.' },
            { h: 'Historical parallel' },
            { p: 'Khan again — dual-use legality, jurisdiction shopping, and a network that was individually lawful at almost every step.' }
          ],
          coverage: [
            'Eight evasion routes rated on feasibility, detectability, longevity, authority',
            'Which layers touch each route',
            'Residual blind spot when every layer works',
            'Common-mode failure: two layers, one declaration',
            'Attacks on the verification machinery itself'
          ],
          exercise: 'ex-evasion' },

        { id: '3.2', title: 'Red team / blue team', kind: 'exercise', mins: '45–60 min',
          goal: 'Run the attack, then hold the line — and write a finding you would be willing to defend.',
          body: [
            { p: 'Two formats, same content.' },
            { h: 'Asynchronous' },
            { p: 'A guided written critique of a proposed compute-verification regime, followed by a return to the evasion taxonomy from 3.1 — this time annotated with your own relative-feasibility judgments and the reasons for them.' },
            { h: 'Synchronous' },
            { ul: [
              'The red team designs an evasion strategy against the proposed regime.',
              'The blue team identifies detection opportunities, corroboration needs and response options.',
              'Both graded on findings: **confirmed, plausible, unresolved, unsupported** — and on whether the grade survives the summary.'
            ] },
            { p: 'The blue team closes by making the case to the body that votes: what was found, at what confidence, what should happen next, and at what threshold.' },
            { stub: 'The simulation design — scoring table, role packets, facilitator timing — is still being specified upstream. The written critique and the annotated taxonomy run today; the scored simulation does not.' }
          ],
          coverage: [
            'Red-team strategy against a stated regime',
            'Blue-team detection, corroboration and response',
            'Confidence grading of findings',
            'Enforcement: what happens on a confirmed finding, and at what threshold',
            'Making the case to a body that votes'
          ],
          output: 'Written critique of a compute-verification regime, with the evasion taxonomy annotated by feasibility and reasons.' }
      ]
    },

    /* ------------------------------------------------------------ 4 */
    {
      n: 4,
      slug: 'capstone',
      title: 'Trust without trust',
      glyph: '✦',
      week: 'week 10',
      status: 'framing complete',
      goal: 'Given that no single mechanism can prove compliance, how do you prioritize, layer and scaffold a regime that is actually buildable?',
      summary: 'The sealed ranking from 2.0 is reopened, feasibility is broken into four dimensions that move at different speeds, and the track ends in a defended verification-regime design of your own.',
      units: [

        { id: '4.0', title: 'Motivation', kind: 'explainer', mins: '15–20 min',
          goal: 'Why a three-month emergency pause, specifically — and what "enough" would mean for one.',
          body: [
            { p: 'The capstone scenario is deliberately small: a three-month emergency pause, not a permanent regime. Small enough to be designed inside a course, and demanding enough that every failure mode from Modules 2 and 3 shows up.' },
            { h: 'Residual risk' },
            { p: 'Start from the best single mechanism you have and ask what is still uncovered. That gap is the argument for layering — not a preference for redundancy, but the size of the hole one layer leaves.' },
            { h: 'Sufficiency' },
            { p: 'Enough for **what claim**, against **whom**, over **what horizon**. A regime sufficient for a three-month pause against a mid-capability state actor is a different object from one sufficient for indefinite constraint against the most capable adversary — and saying which you are designing is the first line of the capstone.' },
            { h: 'Reopen the ranking' },
            { note: 'Your sealed 2.0 feasibility ranking comes back here. Revise it and say what changed your mind — a revision without a reason is a coin flip, and the skill being assessed is the reason.' }
          ],
          coverage: [
            'Residual risk after the best single mechanism',
            'Sufficiency: claim, adversary, horizon',
            'Required detection speed, derived from the policy window',
            'Reopen and revise the 2.0 ranking, with reasons'
          ],
          exercise: 'ex-reopen' },

        { id: '4.1', title: 'Feasibility, prioritization, sequencing', kind: 'explainer', mins: '20–30 min',
          goal: 'Four dimensions of feasibility that move at different speeds — and how to source a landscape that keeps changing.',
          body: [
            { p: 'Every mechanism is scored on four dimensions, kept separate because they move independently.' },
            { ul: [
              '**Technical feasibility** — can it be built with what exists?',
              '**Political feasibility** — who must agree, which veto players are in the way, and when the window is open.',
              '**Verification effectiveness** — what it actually establishes, as against what it is claimed to establish.',
              '**Durability** — how long the judgment survives. Some beliefs here carry an as-of date, and saying which is part of the analysis.'
            ] },
            { h: 'Sequencing' },
            { ul: [
              'What works for an MVP three-month emergency pause, using only what exists today.',
              'What needs years of institution-building.',
              'What depends on hardware changes, diplomacy or national regulation.',
              'What is useful even if a full pause never becomes politically feasible.'
            ] },
            { h: 'Future-proofing' },
            { p: 'The technology and the geopolitics both move faster than any syllabus. What is taught here is the discernment: how to source a moving landscape, how to date your beliefs, and how to re-sort a portfolio when a new fact arrives.' }
          ],
          coverage: [
            'Technical, political, effectiveness, durability — scored separately',
            'Portfolio budget under a limited resource pool',
            'MVP vs. institution-building vs. contingent',
            'What survives if the pause never happens',
            'Sourcing a landscape that moves'
          ],
          readings: [
            { t: 'Six Layers of Verification', a: 'RAND', y: '2025', note: 'The layering argument this unit rests on.' },
            { t: 'Open Problems in Technical AI Governance', a: 'Reuel, Bucknall et al.', y: '2024' }
          ] },

        { id: '4.2', title: 'Capstone', kind: 'capstone', mins: '4–8 hrs',
          goal: 'Design a minimal verification regime for a three-month emergency pause, and defend it against a red team.',
          body: [
            { p: 'The capstone assembles what you have already written: the problem/solution model from Module 0, the stakeholder map and chokepoint ranking from Module 1, the per-layer judgments from Module 2, and the critique from Module 3.' },
            { h: 'The deliverable specifies' },
            { ul: [
              'The agreement, and the verification claim it implies.',
              'Covered actors, objects, activities, conditions, thresholds.',
              'Reporting rules and declaration requirements.',
              'The verification stack: what is load-bearing, what corroborates.',
              'Evasion risks, and which layer catches each.',
              'Evidence standards and confidence grading.',
              'The enforcement pathway, and the threshold that triggers it.',
              'How you would know the regime had failed.'
            ] },
            { h: 'Then defend it' },
            { p: 'Design by critique: start from what breaks. A regime is submitted, red-teamed, and revised — and the revision is the graded artifact, not the first draft.' },
            { p: 'The last piece is the **cold pitch**: your recommendation, to a decisionmaker who has not read your work and did not ask for it. One recommendation, delivered three ways to three audiences, where the framing moves and the claim does not.' },
            { stub: 'The capstone bank — worked examples, rubrics, and the alternative-deliverable menu — is still being assembled upstream. The workspace below is live; the exemplar bank is not yet linked.' }
          ],
          coverage: [
            'Design and defend a complete regime',
            'Scope, thresholds, covered actors',
            'The stack: load-bearing vs. corroborating',
            'The access regime you are proposing',
            'Enforcement pathway and thresholds',
            'The cold pitch'
          ],
          output: 'Verification-regime design: written treaty draft, proposal, or an alternative deliverable agreed with your facilitator.',
          workspace: 'capstone.html' }
      ]
    }
  ]
};
