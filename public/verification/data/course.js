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

        { id: '0.4', title: 'Strategic foundations', kind: 'primer', mins: '20–30 min', optional: true,
          goal: 'The game-theory and IR vocabulary the rest of the track assumes. Optional if you already have it.',
          body: [
            { p: 'Two optional primers, roughly ten to fifteen minutes each. They exist so that later modules can use the vocabulary without stopping to define it.' },
            { h: 'Game theory' },
            { ul: [
              'Cooperation without an enforcer; noise, and why a noisy channel makes defection look like accident.',
              'Credible commitment: sunk cost, tied hands, mechanically enforced — why a promise needs consequences attached to it.',
              'Compliance without courts: reputation, reciprocity, retaliation — each of which requires **detection** first.',
              'Strategic inspection: randomized inspection games, and the nonzero equilibrium violation rate that follows.',
              'Two-level games: ratification constraints, win-sets, veto players, and the difference between voluntary and involuntary defection.'
            ] },
            { h: 'International relations' },
            { ul: [
              'Baseline vocabulary; realist and liberal-institutionalist lenses, both of which are reused in the treaty-anatomy exercise at 1.1.',
              'Information asymmetry and costly signaling — the primitives behind every incentive map in Module 1.',
              'Relative gains and the security dilemma: why unilateral restraint fails even among actors who all want the same outcome.'
            ] }
          ],
          coverage: [
            'Two-level games, win-sets, veto players',
            'Information asymmetry and costly signaling',
            'Credible commitment and why promises need consequences',
            'Relative gains and the security dilemma'
          ],
          readings: [
            { t: 'The Evolution of Trust', a: 'ncase', y: '', note: 'Playable; the noise section is the one that matters here.' }
          ] }
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
            { p: 'A policy becomes enforceable when it is translated into claims about things in the world that evidence can reach. Those claims are built from four ingredients: **actors** (states, companies, cloud providers, researchers), **objects** (chips, clusters, models, weights, facilities), **activities** (acquisition, training, research, deployment, transfer) and **conditions** (thresholds, locations, purposes, exceptions, time periods).' },
            { p: 'Assemble them and you get something checkable, where "don\'t build dangerous AI" was not. Inspectors can still disagree about whether the claim is true. They can no longer disagree about what it says.' },
            { h: 'Three layers, kept separate' },
            { ul: [
              '**Goal** — what the policy exists to achieve: prevent premature ASI.',
              '**Rule** — the obligation actually written into the treaty.',
              '**Claim** — the proposition evidence must test.'
            ] },
            { p: 'Each layer is narrower than the one above it. The NPT shows what the gaps cost: for decades the claim the IAEA could actually test was "declared material at declared facilities matches the declaration", and Iraq ran an undeclared program alongside inspections that passed. The Additional Protocol widened the claim. Neither the rule nor the goal had changed.' },
            { h: 'Thresholds are proxies' },
            { p: 'Total training FLOP is the operative threshold unit in current practice, with the EU AI Act (10^25) and the rescinded EO 14110 (10^26) as the usual reference points. Capability measures the thing we fear and we measure it badly; compute measures roughly the wrong thing precisely. Because a treaty trigger has to be checkable by a rival who does not trust you, this track uses compute — the same move the Limited Test Ban Treaty made in 1963, banning exactly the environments national technical means could police.' },
            { h: 'The menu, revisited' },
            { p: 'There is no "the treaty" — there is a menu, and the options differ at the rule layer, so each generates different verification claims. Eleven buckets, from self-governance through transparency and compute controls to a coordinated halt, each carrying the closest historical precedent we have for it: what carries over, and where it breaks. The convergent argument: if you accept the securitized framing from 0.3, design toward the full pause — mechanisms strong enough for a pause support everything weaker.' },
            { h: 'Who pays' },
            { p: 'Cost is not only money. Sovereignty, confidentiality, time, human capital and political capital are all currencies a policy spends, and compliance burden and verification burden are separate ledgers carried by different actors. A policy that is effective but unfeasible is bad; a policy that is feasible but ineffective is also bad.' }
          ],
          coverage: [
            'Goal vs. legal rule vs. verification claim',
            'The four ingredients of a checkable claim: actors, objects, activities, conditions',
            'Threshold types: compute, capability, hardware, prohibited activities',
            'Proxy risk and Goodhart drift',
            'The eleven policy buckets and their historical precedents',
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
            { p: 'The harder optional version compares three agreements against each other — the MIRI pause agreement, a global compute-cap treaty, and the INF Treaty — and asks which of the seven recurring bones each one has: prover, verifier, declared thing, undeclared rule, access rights, confidentiality carve-out, response-to-violation clause.' }
          ],
          coverage: [
            'Decompose a provision: actors, objects, activities, conditions',
            'Falsifiability: what observation would show the rule was broken',
            'Explicit vs. implicit elements; deliberate ambiguity',
            'What the provision says happens on breach',
            'Optional: compare three agreement models'
          ],
          exercise: 'ex-anatomy',
          output: 'Short brief: state the verification claim implied by one provision, and the single observation that would falsify compliance.' },

        { id: '1.2', title: 'Actors', kind: 'interactive', mins: '25–30 min',
          goal: 'Map who holds the evidence, where the chain narrows, and what each actor is being paid to do.',
          body: [
            { p: 'Suppose the US and China sign an agreement tomorrow: no training runs above some compute threshold for three months. Who, exactly, has to change their behaviour on Wednesday morning? Not the people who signed. Governments do not train frontier models, own the data centers, fabricate the chips or operate the clouds.' },
            { h: 'Posture: the incentive vocabulary' },
            { p: 'Any actor can **comply, defect, hide, exaggerate or free-ride**. These are postures, not personality types — the same actor can comply on one obligation, hide on another and free-ride on a third in the same quarter. The question is never "is this actor good", it is "what does this actor do under this rule, at this moment, given what it costs".' },
            { h: 'Public' },
            { ul: [
              'States and international institutions — the United States and China first, then the semiconductor supply-chain states: Taiwan, the Netherlands, Japan, South Korea. The EU matters as a rule-writer rather than a silicon hub.',
              'Below the state: subnational regulation arrives earlier than federal. California SB 53 bound the leading labs to incident reporting and whistleblower protection before any international mechanism existed.',
              'Inside the state: "the United States wants X" hides five institutions with different jobs — State, Commerce/BIS, Defense, the intelligence community, NIST/CAISI. When a proposal says "the US will verify", ask which building.',
              'Above the state: the shelf marked "AI verification body" is empty. No agency holds a chip registry; no inspector has challenge-inspection rights at a data center.'
            ] },
            { h: 'Private' },
            { ul: [
              'Frontier AI labs; cloud providers; chip designers; fabs and memory; equipment suppliers; packaging, inputs and deployers.',
              'Contractors, resellers, proxy organizations and shell companies — the part of the map that exists to be hard to see.'
            ] },
            { h: 'The chain is concentrated and distributed at once' },
            { p: 'One EUV maker, a handful of leading-edge fabs, a few consequential chip designers, five or six hyperscale clouds, a few dozen labs that matter, millions of deployers. Chokepoints are what make verification possible; distribution is what makes coordination necessary. Both facts are true of the same supply chain, and a regime that only notices one of them fails in a predictable direction.' },
            { h: 'Role: the second lens' },
            { p: 'Public versus private says what an actor **is**, not what it **does** to you when you are verifying. Six functional roles cut across the first lens: capability holder, chokepoint controller, information holder, enforcement authority, evasion pathway, and victim/free-rider/beneficiary. Almost every important actor holds several at once — a cloud provider is all of the first four, and which one dominates depends on what the regime asks of it and what compliance costs.' },
            { p: 'Three questions, in order, for any actor you meet for the rest of the course: where does it sit on the chain (position), what can it do inside a regime (role), what does it want right now (posture).' }
          ],
          coverage: [
            'Public actors: states, subnational regulators, within-state institutions, international bodies',
            'Private actors: labs, cloud, chip designers, fabs, equipment, resellers, proxies',
            'Where the chain narrows enough for a control to attach',
            'The five postures: comply, defect, hide, exaggerate, free-ride',
            'The six functional roles, and why one actor holds several'
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
            { p: 'Every verification artifact — a report, an assessment, a finding — is one link in a chain of actors, and both directions have to be made explicit. The worked case is an IAEA team at Fordow in January 2023, because that inspectorate has been doing this at treaty scale for decades.' },
            { h: 'Upstream' },
            { p: 'Whose claims does this document rely on, and which of them did I verify myself rather than inherit from the actor being checked? An assessment that silently rests on the subject\'s own declaration is a declaration wearing an assessment\'s clothes. At Fordow, Iran\'s declaration and the operator\'s records agreed with each other — two sources from the same side, which is one actor being consistent with itself. The stream that could check them was the Agency\'s own: swipe samples, its seals and cameras, satellite imagery.' },
            { h: 'Downstream' },
            { p: 'Who will act on this document, and what does each reader need in order to act? A finding that a decisionmaker cannot use is a finding that does not exist — and a finding written only as a determination gives outside analysts nothing to check. The Board needs a judgement against the safeguards standard; independent analysts need the discrepancy itself, dated and specific, so they can point their own collection at it. Effective verification writing does both. This is where confidence grading starts: **confirmed, plausible, unresolved, unsupported** — and the grade has to survive being summarised.' },
            { p: 'The structure carries over to compute. A future report on a training run rests on the same three layers: the lab\'s declaration, the cloud provider\'s utilization logs, and the physical streams that are harder to fake — on-chip attestation, chip location tracking, measured power draw. The questions an inspector asks of a swipe sample are the questions you will ask of a power meter.' }
          ],
          coverage: [
            'Upstream: whose claims a report inherits, and which it verified itself',
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

        { id: '2.4', title: 'Human', kind: 'explainer', mins: '20–25 min',
          goal: 'People reveal what hardware, cloud and intelligence cannot: what the organization believed, and what it suppressed.',
          body: [
            { h: '2.4.1 · Insiders and human sources' },
            { ul: [
              'Whistleblowers, employees, contractors, suppliers — anyone with access to concealed activity.',
              'What each kind of source can observe, and what incentives decide whether they report it.',
              'Credibility, corroboration, access limits, and the risk of deception or retaliation.'
            ] },
            { h: '2.4.2 · Reporting and protection' },
            { p: 'A channel that is not survivable is not a channel. Secure and confidential reporting, anti-retaliation protections, rewards, legal duties and organizational incentives determine whether evidence ever reaches a verifier — and how it is authenticated, preserved and transmitted once it does.' },
            { h: '2.4.3 · Audits and inspections' },
            { ul: [
              'Independent auditors, routine inspections, challenge inspections.',
              'Inspection rights, managed access, protection of sensitive information, and what happens on delay or refusal.',
              'Collecting evidence, adjudicating compliance and recommending action are three different jobs — regimes get into trouble when one body does all three.'
            ] },
            { h: '2.4.4 · Institutions and policy judgment' },
            { p: 'Independence, competence, accountability and the possibility of capture. Frontier AI makes this layer harder than its arms-control predecessors: secrecy norms, NDAs, equity incentives and race pressure all push against disclosure.' }
          ],
          coverage: [
            'Insider access and what shapes reporting',
            'Survivable channels, protections, authentication and preservation',
            'Routine vs. challenge inspections; managed access, delay, refusal',
            'Independence, competence, accountability, capture'
          ],
          output: 'Analytical essay: what the human layer establishes that no other layer can, and the conditions under which it is credible.' }
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
