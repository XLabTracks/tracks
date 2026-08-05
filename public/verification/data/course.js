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
           The unit's prose is the author's, transcribed. This block records
           what was checked under it, because 2.4 leans on statute and on
           historical cases harder than any other unit in the track, and the
           statute moved twice inside twelve months. Checked 2026-08-05.

             claim                                                status
             Al Kibar: overhead imagery showed no cooling tower
               or power lines; ground-level photographs from
               inside showed a Yongbyon-type reactor under
               construction; Israel struck 2007-09-06; IAEA
               later found man-made uranium particles          corrected
               The draft said a worker inside the building took the
               photographs. Sources describe ground-level photographs
               obtained and shared by Israeli intelligence; none attributes
               them to a site worker. The clause now says what the images
               were, not who took them — the point of the anecdote is
               untouched. Restore the original if you have a source.
             Vanunu: Dimona technician, disclosed to the British
               press 1986, imprisoned 18 years                 confirmed
             Pasechnik defected to Britain 1989 and described
               Biopreparat as ~10x the assumed size; Alibekov
               defected to the US in 1992 and confirmed scale  confirmed
             NCRI publicly identified Natanz and Arak,
               2002-08-14                                     confirmed
               Historians dispute whether NCRI *discovered* Natanz — the
               prose says "publicly identified", which is the careful claim
               and is what the sources support. Left as written.
             Aluminium tubes: 81 mm; CIA/DIA read them as
               centrifuge rotors, DOE and State/INR as
               conventional rockets; ISG tied them to the
               Nasser-81 rocket                               confirmed
             UNMOVIC/IAEA held 14 private interviews of the 54
               requested, Jan–Mar 2003 under UNSCR 1441        confirmed
               Added to the author's paragraph, which asserts the point the
               number makes. Drop the figure if you would rather the unit
               carried no statistic here.
             ERA §211: NRC investigates and enforces, but only
               the DOL can order a personal remedy             confirmed
             SEC program pays 10–30% of sanctions collected;
               anonymous applicants must file through counsel  confirmed
             SB 53 signed 2025-09-29 — incident reporting to
               OES, anti-retaliation, anonymous internal
               process for large frontier developers           confirmed
             FLI Draft Articles Annex B.1: near-term
               verification, Agency measures a–e including
               personnel interviews (a) and on-site inspections
               (e), and ¶2 obliging States Parties to implement
               whistleblower programs domestically             confirmed
               Resolved from the Treaty Builder at
               global-governance.ai/treaty (FLI, 2025). Annex B.1 is the
               near-term half of Annex B; B.2 is the hardware-enabled
               long-term mechanism. The domestic-implementation point in
               2.4.4 is the Annex's own commentary.
             RAISE signed 2025-12-19 with an annual independent
               third-party audit clause; chapter amendment
               2026-03-27 removed that clause and the
               whistleblower section; effective 2027-01-01     confirmed
             Sources [1]–[7] in the author's draft              unchecked
               The numbered reference list was not supplied, and the
               numbering is not self-consistent ([4] and [5] each carry two
               unrelated citations). The markers are kept verbatim and the
               readings list is unnumbered until the list arrives. */

        { id: '2.4', title: 'Human', kind: 'explainer', mins: '45–60 min',
          goal: 'People reveal what hardware, cloud and intelligence cannot: what the organization believed, and what it suppressed.',
          body: [
            { h: '2.4.0 · Introduction' },
            { p: 'In 2007, analysts studying satellite images of a building in the Syrian desert couldn\'t find anything incriminating. There were no telltale cooling towers or power lines indicative of a nuclear reactor. But ground-level photographs taken inside the building showed what was impossible for overhead imagery to see: a North Korean-design reactor under construction, with North Korean workers on site. Israel struck it that September, and the IAEA later found traces of man-made uranium.' },
            { p: 'This case exemplifies the power of the human layer: one person with the right access can reveal what billions of dollars of instruments cannot. It is the only sensor that reports what people knew and intended, not just what their machines did, and it is the easiest layer to reach for: no chip mandate, no provider cooperation, no new hardware.' },
            { p: 'Simultaneously, it is also the least dependable layer of verification you will study. It depends on human choices at every step: whether someone comes forward, whether they are right, whether anyone believes them, and whether they can be protected afterward. Human motivations can be unpredictable black boxes. People can reveal the most unreachable secrets of covert development, but also lie and misrepresent for myriad possible reasons. Still, the historical precedence and ease of implementation of the human layer renders it nonetheless important to understand in the context of any verification regime.' },
            { p: 'Two mechanisms in particular carry most historical weight: **whistleblower protections** and **personnel interviews**.' },
            { fold: { t: 'Whistleblowers: defecting insiders', body: [
              { p: 'Mordechai Vanunu, a technician at Israel\'s Dimona site, exposed an undeclared nuclear-weapons program to the British press in 1986; with no protected channel to use, he went to journalists, and Israel imprisoned him for eighteen years.' },
              { p: 'The Soviet Union\'s biological-weapons program, run in violation of the 1972 Biological Weapons Convention, stayed hidden until two of its own scientists walked out: Vladimir Pasechnik defected to Britain in 1989 and described a program roughly ten times larger than Western agencies had assumed, and Kanatjan Alibekov confirmed the scale after defecting to the United States in 1992. No sensor had caught what those two insiders reported from memory.' }
            ] } },
            { fold: { t: 'Systematic questioning: worker interviews', body: [
              { p: 'The second mechanism is the interview, inspectors questioning the people who did the work. Through the 1990s, UNSCOM and IAEA inspectors interviewed Iraqi weapons scientists, and the fight over how those interviews ran, whether a scientist could speak without a government minder present and whether interviews could happen outside the country, became central to the whole effort. An interview is only as good as the conditions around it.' }
            ] } },
            { p: 'Bring this to AI: an employee may see a safety gate overridden. A data-center contractor may see an undeclared cluster activated. A supplier may see a purchase pattern inconsistent with a declaration. An auditor may compare those observations with records and interviews.' },
            { p: 'But a single uncorroborated source can be mistaken or can lie, and a confident wrong accusation in a treaty setting becomes an escalation risk. Human evidence earns its weight only when it survives corroboration from evidence streams the source does not control.' },
            { p: 'The section works through the layer in four parts:' },
            { ul: [
              'After **2.4.1**, you can say what different human sources observe and what shapes whether they report it.',
              'After **2.4.2**, you can read a proposed reporting channel and judge whether a scared, NDA-bound insider would actually use it.',
              'After **2.4.3**, you can separate collecting evidence from adjudicating compliance, and read an audit or inspection regime for what its access actually permits.',
              'After **2.4.4**, you can state what human mechanisms establish, what they systematically miss, and critically assess for yourself the relative credibility, feasibility, and development prioritization of the human layer.'
            ] },
            { check: {
              q: 'Which is the best reason to combine human and technical mechanisms?',
              options: [
                'Humans are always more accurate.',
                'Each mechanism has different blind spots.',
                'Technical evidence cannot be preserved.'
              ],
              key: 1,
              why: 'Verification is stronger when independent sources fail differently.' } },

            { h: '2.4.1 · Insiders and human sources' },
            { p: 'A person is useful for verification because of what they could directly perceive, retrieve, or infer — not because they are called an employee, contractor, executive, or expert. A cloud technician and a research engineer sit at very different perspectives on an undeclared training run, and they can support very different claims about it. Before weighing whether to believe anyone, map who has access to what.' },
            { sh: 'The roster: who can see what?' },
            { table: {
              cols: ['Chain segment', 'Who, specifically', 'Can observe', 'Blind to'],
              rows: [
                ['Chip design and fabrication',
                 'Process or lithography engineer at a leading-edge foundry (e.g. TSMC); product engineer at a chip designer (e.g. Nvidia)',
                 'Which advanced parts are in production, at what volume, and which customers placed large orders',
                 'How the chips are ultimately used; any training workload'],
                ['Hardware assembly and data-center build',
                 'Construction, electrical, and cooling contractors; rack and interconnect technicians',
                 'The physical envelope: facility scale, power provisioning, cooling capacity, count and type of accelerators installed',
                 'What runs inside; the purpose of any job'],
                ['Compute provider and cloud operations',
                 'Data-center operations technician or site reliability engineer; account manager or KYC compliance officer',
                 'Cluster utilization, job duration, power draw, which accounts run large jobs; customer identity, billing, reseller relationships',
                 'Model identity and training purpose; the content of the workload'],
                ['The AI developer: technical staff',
                 'Research engineer or ML researcher on the run; infrastructure or cluster admin',
                 'The run itself and its objective, dataset, and results; cluster size, job scheduling, checkpoint and weight-access logs, total compute',
                 'Little, within their own project; this is the richest vantage on intent'],
                ['The AI developer: oversight staff',
                 'Safety or evaluations staff; security team; legal and compliance',
                 'Capability and red-team results and what was downplayed; incident and exfiltration records; what was declared to regulators and the NDA and equity terms that bind colleagues',
                 'Day-to-day technical detail outside their remit'],
                ['The AI developer: leadership',
                 'Executives and senior leadership',
                 'Intent: the decision to conceal or proceed, and what the board and leadership were warned about',
                 'Nothing relevant; the constraint here is willingness to disclose, not access'],
                ['Suppliers and downstream',
                 'Chip reseller or broker; utility or energy provider; enterprise customer or deployment partner',
                 'Who acquired compute and in what volume through which intermediaries; large sustained power contracts and load; model capabilities in real use',
                 'Use and purpose of the compute; training provenance of the deployed model']
              ] } },
            { p: 'An engineer might establish that a run occurred; a procurement employee might establish that specific hardware was acquired; a manager might establish that the activity was intentional; and a legal officer might establish that decision-makers understood the agreement. But when each actor makes a claim, how do you gauge whether to believe them?' },
            { sh: 'Assessing credibility' },
            { p: 'Credibility is not a personality judgment. It is a structured assessment of the source, the statement, and the surrounding evidence. Below are a few key areas to consider when assessing a human report.' },
            { p: '**Incentives and possible bias.** What could the source gain or lose? Motive affects weight, but a bad motive does not make a true claim false.' },
            { p: 'Reporting can threaten employment, immigration status, professional networks, equity compensation, security clearance, or personal relationships. A person may also fear harming a project they believe is socially valuable. Other incentives point toward reporting: moral concern, professional duties, legal obligations, organizational loyalty understood as correcting problems, financial rewards, or confidence that the report will produce a fair investigation. Whistleblower programs work best when they combine practical access with protection, anonymity or confidentiality options, advice, adequate staffing, and — in some settings — rewards. [5][16]' },
            { p: '**Corroboration and consistency.** Do independent records, people, technical signals, or physical observations support the material parts of the account? Does the account remain coherent across retellings, while allowing ordinary uncertainty at the edges?' },
            { p: 'A human source rarely proves a violation on their own. Investigators should ask whether the account is supported by evidence created independently of the source — for example, access logs, procurement records, internal messages, cloud or facility telemetry, physical observations, or testimony from people with different roles and incentives. The strongest corroboration confirms the material facts: what happened, where, when, who was involved, and whether the activity could have occurred as described. Investigators should also test whether the account remains coherent across interviews and against known timelines. Minor variation is normal, especially about peripheral details or events recalled under stress; perfectly identical retellings can even suggest rehearsal. What matters is whether the central claims remain stable and whether apparent inconsistencies can be explained, investigated, or resolved through independent evidence.' },
            { p: '**Access.** Was the source positioned to observe the claimed event, record, conversation, or system?' },
            { p: 'Frontier AI development is often compartmentalized. A person may know the model, the hardware, the evaluation, or the deployment — but not all four. Contractors may be deliberately given narrow access. Executives may know formal decisions but not informal implementation. This makes source mapping and cross-interviews more important than searching for a single omniscient witness. Personnel interviews are therefore useful but imperfect. They can reveal inconsistencies and hidden context, yet their effectiveness depends on who is interviewed, whether supervisors can script or monitor answers, and whether personnel can speak safely. The presence of an interview right is not enough; the verifier needs a method for selecting interviewees and conducting at least some interviews without management present. [4]' },
            { p: 'But assessing credibility goes beyond the individual report. There exist many possibilities for coordinated deception:' },
            { ul: [
              '**Fabricated allegation** — a source invents a violation for retaliation, money, or strategic advantage.',
              '**Selective truth** — accurate facts are presented without context that changes their compliance meaning.',
              '**Management staging** — the organization selects cooperative staff, curated records, and a clean facility path.',
              '**Coordinated cover story** — several sources repeat a rehearsed account.',
              '**Suppression** — an organization blocks communications, removes access, or uses legal and employment pressure to prevent reporting.'
            ] },
            { note: 'Boundary with 2.3. Here the whistleblower is a **person and an institution**: what they can see, what it costs them to speak, and the machinery that receives them. The whistleblower as a **signal** belongs to 2.3, where a tip is an intelligence lead and the progression is anomaly → corroborate → recommend an inspection. This unit hands "how a tip becomes a finding" back to 2.3, and the response to it forward to 3.2.' },
            { check: {
              q: 'A contractor seeking a financial reward reports that a company expanded a computing cluster and provides a project code that also appears in an independently obtained power-allocation log. The contractor cannot identify what workload ran on the cluster. Which assessment is most accurate?',
              options: [
                'The report proves that an unauthorized training run occurred.',
                'The financial reward makes the contractor presumptively unreliable.',
                'The report establishes evidence of infrastructure activity, and the matching project code strengthens its credibility through corroboration, but it does not prove what workload ran.',
                'The report should be disregarded because the contractor lacked access to the workload.'
              ],
              key: 2,
              why: 'The contractor\'s incentive should be considered, but credibility depends more on access, specificity, and independent corroboration. The evidence supports the cluster expansion, not a conclusion about the workload.' } },
            { sh: 'Historical contrast: when human reporting opens — and distorts — verification' },
            { p: 'In 2002, an Iranian opposition group publicly identified previously undeclared nuclear facilities at Natanz and Arak. The disclosure did not itself prove what was occurring there, and the group had clear political interests. Its value was that it gave the IAEA a concrete location and claim to investigate. Inspection and other evidence — not the source\'s reputation alone — turned the allegation into a substantiated verification concern.' },
            { p: 'Curveball shows the opposite failure. Reporting from a single Iraqi defector became the foundation for claims that Iraq possessed mobile biological-weapons laboratories, even though US officials lacked direct access to him and serious questions about his reliability were not adequately resolved or communicated. Analysts treated a poorly validated source as confirmation partly because his account matched what they already expected. Postwar investigation found that the reporting was unreliable.' },
            { p: 'The lesson: human reporting is often most valuable for identifying where to look and what to test. It earns evidentiary weight only when its material claims survive corroboration through records, technical signals, inspections, or sources the original reporter does not control.' },

            { h: '2.4.2 · Reporting and protection' },
            { p: 'This submodule explains how a person\'s observation becomes a safe, usable report. It covers three questions: Where can someone report? What makes reporting less costly than silence? And how should the recipient preserve, assess, and transmit the report?' },
            { p: 'An engineer who suspects an undeclared training run faces near-certain personal risks — lost employment, unvested equity, litigation, blacklisting, or immigration consequences — against a public benefit that is uncertain and difficult to prove. An NDA may appear to prohibit disclosure. Colleagues may regard the reporter as disloyal. The engineer may also possess only one piece of the activity, not enough to establish a violation alone.' },
            { p: 'Under those conditions, silence may be rational. Protection against these consequences, therefore, is a mandatory leg of the reporting channel that determines whether useful information enters the verification system at all.' },
            { p: 'A credible system should provide:' },
            { ul: [
              '**More than one route.** Reporters may need an internal channel, an independent external channel, and direct access to a regulator or treaty verifier. Requiring internal reporting first can expose the source or allow evidence to disappear.',
              '**Clear identity options.** An anonymous report does not reveal the reporter\'s identity to the recipient. A confidential report does reveal it, but restricts who may access or disclose it. The system should explain the limits of either promise.',
              '**Secure, two-way communication.** The recipient must be able to ask follow-up questions and provide preservation instructions without forcing the reporter to reveal more personal information than necessary.',
              '**Independent routing.** A report concerning senior leadership must bypass that leadership.',
              '**Clear scope and triage.** The channel should state who may report, what concerns qualify, who receives them, and which allegations require urgent escalation.'
            ] },
            { p: 'Security includes metadata. For example, a technically encrypted submission may still expose a reporter through a work device, access log, writing style, unusual document history, or the small number of people who knew a particular fact.' },
            { p: 'Here are four buckets of protections and motivations to incentivize reporting.' },
            { sh: '1 · Anti-retaliation protection' },
            { p: 'The system should prohibit firing, demotion, compensation changes, threats, blacklisting, legal intimidation, and subtler retaliation such as removing responsibilities or excluding the reporter from relevant work. A meaningful regime also provides remedies, including reinstatement, compensation, attorney\'s fees, or temporary relief before a lengthy case is resolved.' },
            { p: 'The nuclear sector provides a precedent. Section 211 of the U.S. Energy Reorganization Act prohibits covered nuclear employers and contractors from discriminating against workers for protected safety activity. The NRC can investigate allegations and take enforcement action, while the [Department of Labor](https://www.nrc.gov/about-nrc/regulatory/enforcement/sanctions) can provide personal remedies to affected employees.' },
            { sh: '2 · Financial rewards' },
            { p: 'Rewards can offset the costs of reporting, but they should depend on useful original information rather than the drama of the allegation. The [SEC whistleblower program](https://www.sec.gov/enforcement-litigation/whistleblower-program/whistleblower-frequently-asked-questions) offers eligible reporters between 10 and 30 percent of monetary sanctions collected in qualifying enforcement actions. It also prohibits retaliation and actions that impede direct contact with the SEC. Anonymous award applicants must report through an attorney, allowing the SEC to authenticate the person without publicly exposing them.' },
            { p: 'A financial motive does not make a source presumptively unreliable. It is one incentive to record; access, specificity, consistency, and corroboration still determine evidentiary weight.' },
            { sh: '3 · Mandatory reporting' },
            { p: 'A legal duty can require specified organizations or roles to report known incidents, making silence a violation rather than a neutral choice. California\'s [SB 53](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB53), enacted in 2025, requires covered frontier developers to report defined critical safety incidents to the state. It separately protects covered employees who report qualifying dangers or violations and requires large frontier developers to provide an anonymous internal process with status updates.' },
            { p: 'Mandatory reporting still needs enforcement and a capable recipient. A reporting duty sent to an office without authority, expertise, or resources becomes paperwork rather than verification.' },
            { sh: '4 · Professional and organizational duties' },
            { p: 'Professional codes, employment responsibilities, licensing rules, and internal governance can make escalation the expected action for safety officers, auditors, security personnel, and executives. These duties are weaker when managers reward the absence of reported problems rather than the early discovery of them. A credible organization treats well-founded escalation as competent risk management, not disloyalty.' },
            { sh: 'Historical parallel: Vanunu and the absence of a protected route' },
            { p: 'Mordechai Vanunu disclosed information about Israel\'s nuclear program to a newspaper in 1986. He was abducted and returned to Israel, convicted of treason and espionage, and imprisoned for 18 years. Whatever one\'s judgment of the disclosure, the case illustrates the stakes facing an insider who has no authorized, protected route: report publicly at catastrophic personal cost, or remain silent. Future insiders observe what happens to earlier ones.' },
            { sh: 'Interview protection' },
            { p: 'Reporting channels are not the only way investigators obtain human evidence. Auditors and inspectors also interview employees, scientists, contractors, and managers; but an interview conducted with a supervisor or government minder in the room may produce coached answers rather than evidence.' },
            { p: 'This problem was central during the Iraq inspections. UNMOVIC and the IAEA sought authority to interview relevant personnel privately and, when necessary, outside Iraq. Inspectors understood that formal access to a scientist was not enough; the conditions had to allow the person to speak without immediate surveillance or retaliation. Resolution 1441 granted that authority explicitly, and it still did not deliver: between January and March 2003 inspectors obtained **14 private interviews out of 54 requested**, with most of the rest refused unless an Iraqi official was present.' },
            { p: 'The next section develops interviews as part of inspection practice. The point here is simpler: like whistleblowers, an interview depends partly on the protection surrounding the person answering.' },
            { sh: 'Turning a report into usable evidence' },
            { p: 'Once a report arrives, the recipient\'s job is to preserve it, assess it, and transmit it without overstating what it establishes.' },
            { ol: [
              '**Receive and acknowledge.** Record when and how the report arrived, its claimed urgency, and the reporter\'s identity preference. Do not promise absolute confidentiality if the process cannot guarantee it.',
              '**Check conflicts and triage.** Route around anyone implicated in the allegation. Separate immediate safety or evidence-destruction risks from ordinary compliance concerns.',
              '**Preserve the original material.** Retain the original submission, attachments, and available metadata. Assign a case identifier and record who views, copies, or transfers each item. Do not overwrite the original with cleaned or reformatted versions.',
              '**Authenticate.** Test whether the source is who they claim to be, whether they plausibly had the stated access, and whether submitted records are what they appear to be. Authentication establishes provenance; it does not establish that the allegation is true.',
              '**Investigate and corroborate.** Seek independent records, technical signals, additional sources, and alternative explanations. Keep the source\'s statements separate from investigator observations and analytical inferences.',
              '**Transmit a scoped package.** The authorized verifier should receive the allegation, the source-access assessment, the preservation record, known corroboration, known contradictions, unresolved questions, handling restrictions, and the recommended next step. The source\'s identity should be transmitted only when necessary and authorized.'
            ] },
            { p: 'This is where the human layer joins the technical layers. A person may identify the suspicious activity, while cloud records, hardware logs, procurement data, or facility measurements test the account.' },
            { check: {
              q: 'An anonymous engineer submits records alleging an undeclared training run. The allegation concerns senior leadership, and the engineer requests a financial reward. What should the reporting office do first?',
              options: [
                'Publish the allegation so that leadership cannot suppress it.',
                'Reject it because anonymity and a financial motive make it unreliable.',
                'Preserve the original submission, route it around implicated leaders, authenticate the source\'s access, and seek independent corroboration before transmitting a scoped package to the verifier.',
                'Require the engineer to report internally before the external office may review it.'
              ],
              key: 2,
              why: 'Protection allows the report to enter the system; preservation, authentication, and corroboration determine whether it should produce further action.' } },
            { p: 'A sufficiently supported report may lead to an inspection recommendation. Section 2.4.3 asks what inspectors are then entitled to access, how they protect sensitive information, and what happens when access is delayed or refused.' },

            { h: '2.4.3 · Audits and inspections' },
            { p: 'Whistleblowers and defectors arrive on their own schedule. Audits and inspections are the mechanisms that let a verifier go and look on purpose, with a regular and predictable timeline. Here are the three main types and how they differ.' },
            { table: {
              cols: ['Mechanism', 'Typical trigger', 'Main purpose', 'Main design risk'],
              rows: [
                ['Independent audit',
                 'Periodic, milestone-based, or pre-deployment review',
                 'An outside third party verifies specified claims and evaluates systems or practices against stated standards.',
                 'The auditee controls the auditor, scope, evidence, or publication.'],
                ['Routine inspection',
                 'A schedule, random selection, or recurring treaty obligation',
                 'Confirm declared sites, inventories, records, processes, or controls.',
                 'Predictability permits staging, and the inspection may reach only declared activity.'],
                ['Challenge inspection',
                 'A specific concern, anomaly, or formal request, usually under special and shorter-notice procedures',
                 'Clarify possible noncompliance at a relevant site or activity not resolved by routine measures.',
                 'Delay, political misuse, excessive intrusion, or access negotiated below what the concern requires.']
              ] } },
            { p: 'In each category of inspection, the verifier undergoes three main steps: obtain, evaluate, and respond to evidence.' },
            { table: {
              cols: ['Step', 'The question it answers', 'Typical output'],
              rows: [
                ['Evidence collection',
                 'What did the team obtain, observe, preserve, and fail to access?',
                 'Records, extracts, interview notes, photographs, test results, and documented access limits.'],
                ['Adjudication',
                 'Do the established facts satisfy the agreement\'s legal or technical standard?',
                 'A compliance finding, a finding of no violation, or reasoned uncertainty.'],
                ['Recommendation or response',
                 'What should happen next, given confidence, severity, urgency, and authority?',
                 'Corrective action, further monitoring, another inspection, referral, or a sanction recommendation.']
              ] } },
            { p: 'Moreover, quite logically, the level of access an inspector has determines the strength and workability of findings.' },
            { ul: [
              '**Black-box** (least) — the auditor sends inputs and observes outputs. Supports claims about how the model behaved under the conditions tested, and nothing beyond them.',
              '**Gray-box** — black-box plus selected internals, tools, records, or privileged interfaces. Widens the set of explanations the auditor can test, but the scope still depends on what the company chooses to expose.',
              '**Deep** (most) — gray-box plus model internals, training process, compute accounting, incident reports, decision logs, governance records, and staff interviews. Supports organizational and historical claims when the records are complete and the auditor can test for deception. [1]'
            ] },
            { p: 'Lower levels are more feasible to glean results from, as they rely more on company-provided information, but cannot catch skillful deception. A black-box audit may establish that a deployed model refused a defined set of dangerous requests, but it cannot establish that no undeclared training run occurred. Higher levels are less technically and organizationally feasible, but they can better spear through fabrications and noise to uncover deception. [1] A deep audit can meaningfully test a claim of illicit training run through raw allocation records, training artifacts, project-code mappings, and interviews — but only if the organization allows that level of inspection while trusting information security.' },
            { sh: 'Access rights, written out' },
            { p: 'A usable mandate answers seven questions before a dispute begins:' },
            { ul: [
              '**Who may examine the evidence?** Name the audit or inspection body, required expertise, conflict rules, security requirements, and any process for objecting to an individual inspector.',
              '**What and where are in scope?** Specify models, code, evaluations, compute records, governance decisions, facilities, affiliates, cloud regions, colocation sites, and contractor-controlled systems.',
              '**When may access occur?** Define routine timing, random selection, milestone triggers, challenge thresholds, notice periods, inspection duration, and event-triggered re-review.',
              '**What may the team do?** Cover document review, system access, testing, observation, sampling, copying, log export, reconciliation, and private staff interviews.',
              '**Who must cooperate and preserve evidence?** Extend duties to relevant developers, affiliates, cloud and data-center operators, suppliers, contractors, and public authorities; prohibit deletion or alteration after notice.',
              '**How will sensitive information be protected?** Use vetted personnel, secure rooms, read-only systems, redaction, aggregation, limited retention, purpose restrictions, and sanctions for misuse.',
              '**What follows delay or refusal?** Set deadlines, alternative-access procedures, escalation routes, reporting consequences, and any authorized adverse inference, penalty, suspension, or referral.'
            ] },
            { p: 'A delay may reflect a real safety, privilege, localization, or security problem — or a concealment tactic. Refusal can support a finding that the access obligation was breached. It may also justify an adverse inference if the agreement says so. It does not, by itself, prove that the concealed activity occurred.' },
            { sh: 'Historical parallel: managed access' },
            { p: 'Arms-control regimes faced the same problem: inspectors need enough access to test a claim, while the inspected party may hold unrelated military, proprietary, or security-sensitive information. The IAEA Additional Protocol expressly provides for managed access to protect proliferation-sensitive, proprietary or commercially sensitive, and safety or physical-protection information while preserving the Agency\'s verification objective. [3]' },
            { p: 'The Chemical Weapons Convention uses the same logic in challenge inspections. It permits measures such as removing sensitive papers, shrouding unrelated equipment, limiting particular tests, or giving only selected inspectors access. But managed access is not a unilateral veto. If full access is not provided, the inspected state must make every reasonable effort to offer alternative means that clarify the compliance concern. Site-securing and exit-monitoring procedures can also reduce the opportunity to remove evidence while access is negotiated. [2]' },
            { note: '**Transfer to AI.** An AI inspector might use a read-only query over raw scheduler logs, allow a vetted subset of the team to view model weights on site, inspect cryptographic commitments rather than source files, or receive an independently generated aggregate. The substitute is acceptable only if it answers the same verification question.' },
            { fold: { t: 'The same two mechanisms, in treaty language', body: [
              { p: 'The Future of Life Institute\'s [Draft Articles](https://global-governance.ai/treaty/) put the near-term verification measures in **Annex B.1** — the transparent-but-less-private half of Annex B, against the hardware-enabled long-term mechanism in B.2. Two of its five Agency measures are this unit\'s:' },
              { ul: [
                '**(a)** "Interview personnel of advanced AI providers or AI hardware manufacturers, with interviews having a narrow scope defined by the Conference."',
                '**(e)** "On-site inspections of advanced AI providers\' facilities, data centers or hardware manufacturing facilities. These inspections will be carried out in strict compliance with protocols developed by the Agency and approved by the Conference."'
              ] },
              { p: 'Read (a) against 2.4.1\'s point about interview conditions: the treaty grants the right and hands the *scope* to a political body. That is the drafting choice on which the mechanism turns.' }
            ] } },
            { p: 'An accurate audit can still mislead readers when they forget its limits. It is a conclusion about the systems, entities, claims, evidence, and time period actually examined. A developer may curate the visible surface, a riskier internal deployment may sit outside scope, or later changes may invalidate the result. The frontier-auditing literature therefore recommends stating assumptions and validity conditions, combining periodic deep reviews with event-triggered review, and deprecating conclusions when material conditions change. [1]' },
            { check: {
              q: 'A developer gives an independent auditor black-box API access to its deployed model and a curated management summary. It refuses raw compute-allocation logs and staff interviews, then asks the auditor to certify that no undeclared above-threshold training occurred. What is the best response?',
              options: [
                'Certify the claim because the auditor is an independent third party.',
                'Reject the entire audit because black-box evidence is never useful.',
                'Report what the black-box testing actually supports, state that the training-history claim is outside the available evidence, and request scoped deep or managed access to the relevant records and personnel.',
                'Declare the developer noncompliant and impose a sanction immediately.'
              ],
              key: 2,
              why: 'The audit may support claims about tested model behavior, but it cannot support an absence claim about hidden training from that access alone. The auditor should document the limitation; the authorized adjudicative body — not the auditor acting alone — decides the consequence of continued refusal.' } },

            { h: '2.4.4 · Institutions and policy judgment' },
            { p: 'In this section, you will learn how to gauge whether the institution running the human layer is trustworthy in the first place. You will test independence, competence, accountability, authority, and cooperation; identify what human mechanisms systematically miss; and decide what corroboration and political conditions are required before a human claim becomes decision-worthy.' },
            { p: 'A skilled auditor cannot compensate for a verifier that lacks authority, stable funding, access, or political support. Use four tests to gauge a verifier\'s reliability.' },
            { table: {
              cols: ['Test', 'Question to ask', 'Typical failure'],
              rows: [
                ['Independence',
                 'Can the verifier reach an unfavorable conclusion without losing funding, access, appointment, or future work?',
                 'Auditor shopping, repeat-business pressure, political direction, or revolving-door incentives.'],
                ['Competence',
                 'Does the team have the technical, investigative, legal, security, organizational, and diplomatic expertise required by the claim?',
                 'A technically impressive review that misses governance, evidence, supply-chain, or jurisdictional problems.'],
                ['Accountability',
                 'Can methods, conflicts, quality controls, complaints, appeals, and mistakes be reviewed without exposing protected information?',
                 'Opaque methodology, no route to challenge factual errors, or no one able to audit the auditors.'],
                ['Authority and cooperation',
                 'Can the institution obtain evidence from every relevant actor, and can an authorized body act on its findings?',
                 'A credible report with no power to compel access, preserve evidence, or trigger a legitimate response.']
              ] } },
            { p: 'An auditor selected and paid by the auditee may still fear losing repeat work or future access. A government inspector may face budget or political pressure. An international body may depend on state consent, voting rules, or major-power support.' },
            { p: 'Useful safeguards include conflict disclosure, restrictions on consulting and direct financial interests, cooling-off periods, auditor rotation, standardized engagement terms, protected budgets, regulator-administered selection or funding, peer review, and publication of scope and limitations. The Frontier AI Auditing paper also warns against material revenue dependence on one client and calls for oversight of auditors themselves. [1]' },
            { p: 'Competence is equally institutional. No single reviewer is likely to master model evaluation, compute accounting, data-center operations, cybersecurity, corporate governance, interviews, evidence preservation, labor protection, and treaty law. A credible body builds multidisciplinary teams and knows when to use specialist subcontractors or consortia. [1]' },
            { sh: 'Capture can enter through the evidence, the culture, or the standard' },
            { ul: [
              '**Financial capture** — favorable findings protect fees, access, or future work.',
              '**Informational capture** — the auditee chooses the records, interviewees, systems, and questions, controlling the evidentiary frame.',
              '**Cultural or political capture** — the verifier adopts the regulated party\'s assumptions, or findings are narrowed, delayed, or suppressed.',
              '**Standards and capacity failure** — vague or obsolete standards become easy to pass, while understaffing turns nominally deep review into shallow triage.'
            ] },
            { p: 'This is why a standards document is not enough. Manheim and coauthors argue for an AI Audit Standards Board that owns revision, governance, and feedback as technology changes; the broader point is that standards need an institution that can update them and learn from failure. [4]' },
            { note: '**Power-concentration warning.** Personnel-based verification can itself be abused. Interview technologies, reporting systems, and access powers need due process, purpose limits, confidentiality, review, and political legitimacy — especially when one state or institution controls both verification and response. [7]' },
            { sh: 'Historical caution: two different Iraq failures' },
            { p: 'Curveball was a **source-validation** failure. Reporting from the Iraqi defector became central to claims about mobile biological-weapons laboratories even though U.S. analysts lacked direct access to him, reliability warnings existed, and imagery contradicted part of his account. The official postwar commission concluded that analysts were too attached to a source whose story fit their expectations. [5]' },
            { p: 'The aluminum tubes were an **adjudication** failure. The tubes existed, but agencies disagreed about what they meant: CIA and DIA favored a centrifuge interpretation, while the Department of Energy and the State Department\'s Bureau of Intelligence and Research judged conventional rocket use more likely. Postwar investigation found no evidence of an aluminum-rotor centrifuge program and tied the procurement to 81 mm rockets. [5][6]' },
            { p: 'Do not describe these as independent corroboration of one claim: they concerned different alleged programs. Read together, they show two ways institutions can fail — poor source validation and overconfident interpretation of ambiguous technical evidence.' },
            { sh: 'What the human layer can establish, and what it systematically misses' },
            { p: 'Human mechanisms are strongest on questions that live in people\'s heads and in the informal life of an organization: intent, decision rationale, verbal or off-the-record instructions, whether staff were aware of warnings, whether circumvention was deliberate, and how a written policy actually worked in practice. Interviews and document review are also well suited to checking an organization\'s self-presentation against itself. An auditor can ask whether the records produced fit the workflow staff describe, whether accounts from different people conflict, and whether the organization staged a site, obstructed access, or disclosed selectively.' },
            { p: 'The weaknesses are structural rather than a matter of doing interviews better. Human mechanisms see the periods they sample and go blind between them, so continuous activity is out of reach. Conduct kept inside a small, loyal group may leave no witness willing to talk. Activity beyond the treaty\'s legal reach produces no one an inspector can compel. And technical facts, such as what a training run actually consumed or what a system actually does, require independent access to the systems themselves. Human testimony also fails as standalone proof in a predictable set of cases: when every available source shares the same incentives, when accounts converge because they were coordinated rather than because they are true, and when nothing can be checked against records, physical observation, or a technical signal.' },
            { p: 'The human layer is therefore most valuable for targeting, context, and corroboration. It tells other mechanisms where to look, suggests what an ambiguous technical signal may mean, and identifies which records or sites are worth the cost of inspecting. Treaty designers should rarely rely on it for continuous coverage or treat it as self-authenticating proof.' },
            { sh: 'Corroboration should cross mechanisms' },
            { p: 'A second person repeating the same account is useful only if the second account is genuinely independent. Stronger corroboration comes from evidence generated through a different process with different incentives and failure modes:' },
            { ul: [
              '**Human + system records** — an engineer\'s account compared with raw allocation, access, version-control, checkpoint, or incident logs.',
              '**Human + supply chain** — a project claim compared with chip delivery, cloud billing, power, cooling, networking, or maintenance records.',
              '**Human + physical or remote observation** — a report compared with an inspection, facility inventory, permits, construction imagery, or visible infrastructure changes.',
              '**Governance audit + independent technical evaluation** — decision records compared with separate testing of the model or system.'
            ] },
            { p: 'In short: evidence is stronger when the streams do not share the same source of error.' },
            { sh: 'Who must cooperate — and under what conditions?' },
            { p: 'The human layer reaches only the actors and jurisdictions that can be induced or compelled to cooperate. Depending on the agreement, that may include developers and affiliates; cloud and colocation providers; chip, power, and networking suppliers; auditors and evaluators; employees and contractors; national regulators and courts; and states that must admit international inspectors.' },
            { p: 'A credible regime therefore needs more than good technical design:' },
            { ul: [
              'A legal mandate that covers the relevant entities, records, sites, contractors, and cross-border activity.',
              'Participation incentives or credible consequences strong enough that access is not purely voluntary.',
              'Protection for commercial and national-security information without a blanket confidentiality exemption.',
              'Protected contact with personnel, enforceable anti-retaliation rules, preservation duties, and penalties for obstruction.',
              'Reasoned review and due process so that inspection is not experienced as arbitrary punishment.',
              'Graduated, credible responses and a process for updating thresholds, methods, standards, and expertise as technology changes.'
            ] },
            { p: 'Where the suspected violator controls the domestic regulator, court, employer, and security services, internal channels may go quiet. The regime then depends more heavily on external intelligence, cross-border evidence, protected exit routes, and political pressure. That is a coverage limit, not a procedural detail.' },
            { note: 'The drafting problem, stated by a draft. Annex B.1 of the FLI Draft Articles obliges States Parties to "implement whistleblower programs within their jurisdictions", and its commentary concedes the reason it has to: unlike the Agency\'s own measures, whistleblower programs "would need to be implemented domestically, without direct oversight by the Agency". A treaty can require the protection and cannot run it. The party that must build the channel is the party the channel exists to catch.' },
            { p: 'The statutory record shows how that goes even inside one cooperative jurisdiction. New York\'s RAISE Act was signed on 19 December 2025 requiring large developers to retain an independent third party for an annual audit of their safety and security protocols, publish a redacted summary, and file it with the state. Before the law had taken effect, a chapter amendment signed on 27 March 2026 removed the audit requirement entirely — and the whistleblower section with it — aligning the statute with California\'s SB 53, which had declined to mandate audits in the first place. As of **August 2026**, no US state mandates third-party audits of frontier developers, and the one that enacted such a mandate repealed it before it bound anybody. A mechanism can be technically sound, drafted, passed and signed, and still not survive to its own effective date.' },
            { sh: 'Final judgment exercise' },
            { p: 'A regulator receives four items:' },
            { ol: [
              'an engineer\'s detailed allegation of an undeclared training run;',
              'cloud telemetry showing unusual temporary capacity but not the workload;',
              'supplier records showing an urgent delivery to an unlisted colocation site; and',
              'an inspection report stating that the developer withheld raw allocation logs, offering aggregates produced by its own compliance team instead.'
            ] },
            { check: {
              label: 'final judgment',
              q: 'Which verdict is best supported now?',
              options: [
                'Violation proven: the human source and two technical indicators are enough.',
                'No violation: none of the items independently proves the workload or compute threshold.',
                'Insufficient evidence for a final violation finding, but enough corroborated concern to preserve evidence, require managed access to the raw logs and project-code mapping, and refer continued refusal to the authorized adjudicator.',
                'Automatic sanction: refusing raw logs proves the undeclared run occurred.'
              ],
              key: 2,
              why: 'The evidence supports a serious, targeted concern and justifies further compulsory examination. It does not yet establish the workload, threshold crossing, or legal classification. Continued refusal may establish a separate access breach and may support an adverse inference if the agreement authorizes one. The institution should preserve the record, state the uncertainty, and use the pre-agreed adjudication process rather than convert suspicion into certainty.' } },
            { note: '**Module takeaway — the human layer\'s honest role.** People can expose intent, identify hidden activity, test whether formal controls work, and direct technical mechanisms toward the right records and sites. Their evidence becomes credible only when reporting is protected, access is real, institutions resist capture, and material claims survive corroboration from streams the source or auditee does not control.' },
            { stub: 'The numbered markers [1]–[7] in this unit are the author\'s. The reference list they point to has not been supplied, and the numbering is not yet self-consistent, so the markers are left verbatim and the Readings below are unnumbered. Whoever owns the module supplies the list.' }
          ],
          coverage: [
            'The human layer as the only sensor that reports intent, not just machine activity',
            'Whistleblower protections and personnel interviews as the two load-bearing mechanisms',
            'The access roster: who along the chain can observe what, and what each is blind to',
            'Credibility as structure, not personality: incentives, corroboration, access',
            'Five shapes of coordinated deception',
            'Reporting channels: routes, identity options, two-way contact, independent routing, triage',
            'Metadata as part of channel security',
            'Four protection buckets: anti-retaliation, rewards, mandatory reporting, professional duty',
            'Interview conditions — the right of access is not the same as the ability to speak',
            'Six steps from report to scoped package: receive, triage, preserve, authenticate, corroborate, transmit',
            'Audit vs. routine inspection vs. challenge inspection; collect, adjudicate, respond',
            'Black-box, gray-box, and deep access, and the claims each can support',
            'The seven questions a usable access mandate answers before a dispute',
            'Managed access, and what delay or refusal does and does not establish',
            'Independence, competence, accountability, authority; four routes to capture',
            'What the layer establishes, what it structurally misses, and cross-mechanism corroboration',
            'Who must cooperate — including the party that must build the channel that catches it'
          ],
          readings: [
            { t: 'Frontier AI Auditing: Toward Rigorous Third-Party Assessment of Safety and Security Practices at Leading AI Companies', a: 'Brundage et al.', y: '2026',
              note: 'The audit half of 2.4.3 and the auditor-oversight argument in 2.4.4. Read for the four AI Assurance Levels and for the four things the authors say are missing before the higher ones are reachable. [arXiv:2601.11699](https://arxiv.org/abs/2601.11699)' },
            { t: 'Towards Publicly Accountable Frontier LLMs: Building an External Scrutiny Ecosystem under the ASPIRE Framework', a: 'Anderljung et al.', y: '2023',
              note: 'ASPIRE — Access, Searching attitude, Proportionality to the risks, Independence, Resources, Expertise — is the checklist to hold against the four institution tests in 2.4.4. [arXiv:2311.14711](https://arxiv.org/abs/2311.14711)' },
            { t: 'Tracking Hyperscale AI Data Center Growth with Satellite Imagery', a: 'Krawec, FAS', y: '2026',
              note: 'Not a human-layer mechanism — it is one of the independent streams 2.4.4 asks a human report to be corroborated against. Read for what imagery settles (construction stage, power, cooling, the xAI turbine count against its permit) and for what it cannot see at all, which is anything inside the building. [fas.org](https://fas.org/publication/tracking-hyperscale/)' },
            { t: 'Draft Articles for an international AI agreement — Annex B.1', a: 'Future of Life Institute', y: '2025',
              note: 'The unit\'s two mechanisms in treaty language: measure (a) personnel interviews, measure (e) on-site inspections, and the paragraph 2 obligation on States Parties to run whistleblower programs domestically. Build one in the [Treaty Builder](https://global-governance.ai/treaty/) and read the commentary beside the clauses.' },
            { t: 'Verification methods for international AI agreements', a: 'Wasil, Reed, Miller & Barnett', y: '2024',
              note: 'Supporting. Classes whistleblowers as a national technical means — deep access needing no permission from the party under suspicion — and lists the protections in 2.4.2 with their SEC/Dodd-Frank precedent, alongside the limitations the same authors put on them. [arXiv:2408.16074](https://arxiv.org/abs/2408.16074)' },
            { t: 'Safetywashing: Do AI Safety Benchmarks Actually Measure Safety Progress?', a: 'Ren et al.', y: '2024',
              note: 'Supporting, for 2.4.4. The measurement failure an audit inherits whenever the audited sets the scope. [arXiv:2407.21792](https://arxiv.org/abs/2407.21792)' },
            { t: 'The Necessity of AI Audit Standards Boards', a: 'Manheim et al.', y: '2024',
              note: 'Supporting, and the source for the standards-board argument in 2.4.4. [arXiv:2404.13060](https://arxiv.org/abs/2404.13060)' }
          ],
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
