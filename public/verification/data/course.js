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

        /* 2.2 is the one fully drafted unit in this module. Its prose, its ten
           checks and its twelve-item knowledge check were carried over from
           the module-2.2 build in the tracksprogramplayground repo by a
           one-shot transform over that page's data — copied, not retyped —
           and every claim in it was verified against the full texts before
           it shipped there (the row-by-row log is
           verification-module-2-2-design.md §7 in that repo).

           Four sources, four sets of reuse terms, so the unit cites them four
           ways. The two arXiv papers are CC BY 4.0: quoted freely, attributed
           in every {src} line. RAND RR-A3686-1 and the Carnegie piece are
           both all-rights-reserved, so what is reproduced from them is the
           text their publishers put on the open web — RAND's own Key
           Takeaways and Recommendations, four short passages from the
           Carnegie article — each in a {quote} card that names the work, the
           part of it, and the authors before the words themselves, and links
           out. Their body arguments stay paraphrase with page citations.

           Trap: the RAND body PDF is AES-encrypted. Its permission bits do
           allow text extraction (/P -1036 sets bit 5), so this is a locked
           door with a sign saying you may enter — but nothing beyond the
           published web text has been lifted through it, and a longer excerpt
           should be a decision someone makes on purpose rather than a side
           effect of a script that could.

           Verification log — one open row:
             claim                      | source | status
             RAND reuse/quotation terms | rand.org/pubs/permissions.html | UNCHECKED
               (HTTP 403 on fetch, 2026-08-05). Handled by reproducing only
               what RAND publishes openly on the report's own landing page.
               Recheck before excerpting from the PDF body. */

        { id: '2.2', title: 'Cloud', kind: 'interactive', mins: '~2 hours',
          goal: 'The provider sits between the customer and the machines. What can the landlord of the compute see, record, verify, and switch off — and where does that oversight run out?',
          body: [
        { sec: '2.2.1 · What the provider can see' },
        
        { h: 'Rented machines' },
        { p: 'Frontier models are mostly trained on machines their developers don’t own. A frontier training run needs thousands to tens of thousands of AI accelerators wired together — clusters that live in data centers operated by a handful of companies: Microsoft Azure, Amazon Web Services, Google Cloud, Oracle, and their peers.' },
        { p: 'That creates the structural fact this whole module rests on: between the AI developer and the chips sits a **landlord**. The developer rents; the provider owns, operates, meters, and bills.' },
        { p: 'One caution before we start: some AI firms run their own data centers. Hold that thought — it is the biggest hole in this layer, and section 2.2.3 walks straight into it.' },
        
        { h: 'Four roles' },
        { p: 'The 2024 whitepaper *Governing Through the Cloud* (Heim et al.) names four capacities in which a provider can serve a governance regime:' },
        { ul: [
          '**Record keeper** — keeps organized, high-level records of who used how much compute.',
          '**Verifier** — actively checks customer identities and workload claims.',
          '**Enforcer** — restricts or cuts compute access for rule-breakers.',
          '**Securer** — protects the models, data, and infrastructure on its machines.'
        ] },
        { p: 'Everything else in this module is one of these four, unpacked.' },
        
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, Table 1.' },
        { gap: {
          lead: 'The four roles, from the paper’s own table.',
          text: 'A provider can act as a ___ (organized records of who used how much compute), a ___ (actively checking identities and workload claims), an ___ (restricting or cutting access for rule-breakers), and a ___ (protecting the models and infrastructure on its machines).',
          blanks: ['record keeper', 'verifier', 'enforcer', 'securer'],
          bank: ['record keeper', 'verifier', 'enforcer', 'securer', 'regulator', 'auditor'],
          why: 'Record keeper, verifier, enforcer, securer. A regulator writes the rules and an auditor is hired by the customer — neither is a capacity the provider holds by virtue of owning the machines.',
          src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, Table 1.' } },
        { h: 'Record keeper and verifier' },
        { p: 'Record keeping is close to free: a provider already knows which hardware a customer reserved and for how long, because that is what the bill is computed from. Kept in order, those records give a regulator visibility — who is training at scale? — and give investigators a trail after an incident.' },
        { p: 'Verification is the active version: checking that the customer is who they claim to be (identity), and that the workload matches what they declared. Is this “inference service” actually a giant training run? A verifier doesn’t take the paperwork’s word for it.' },
        
        { h: 'Enforcer and securer' },
        { p: 'Enforcement is the sharpest role. The provider physically controls the machines, so it can gate access before a run (“prove you filed the training notification”), throttle or flag a suspicious workload pending review, or terminate the account and report it. No ships to intercept, no warehouses to raid — access is a switch the provider holds.' },
        { p: 'Security is the quiet fourth role: the same company runs the locks, guards, and firewalls around the most valuable artifacts in AI — model weights. If weights are stolen, every other control in this track is bypassed. Module 3 returns to that.' },
        
        { h: 'Why the landlord already knows' },
        { p: 'None of the four roles requires new surveillance to exist. Providers already collect account data, billing records, hardware telemetry, and security logs — for billing, capacity planning, fraud prevention, and their own legal obligations.' },
        { p: 'As the paper puts it: “At a minimum, providers have access to billing information and can access basic technical data on how their hardware is used.”' },
        { p: 'So the governance question is not “could a provider see anything?” It is: which of the things it already sees should a regime rely on — and what does each of them prove?' },
        { src: 'Quoted from Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 4.' },
        { check: {
          q: 'A provider suspends a customer’s compute access after the customer refuses to file a required training-run notification. Which role is the provider exercising?',
          options: [
            'Record keeper',
            'Securer',
            'Enforcer',
            'Verifier'
          ],
          key: 2,
          why: 'Restricting or cutting access is enforcement. Record keeping is storing usage data; verifying is checking claims against observation; securing is protecting models and infrastructure from attackers.' } },
        
        { h: 'The triangle' },
        { p: 'Draw it as a triangle. The **regulator** writes rules but cannot watch every data center. The **customer** develops AI, with every incentive to under-describe what it is doing. The **provider** sits between them — with physical control of the machines and commercial records of their use.' },
        { p: 'Governance through the cloud means the regulator recruits the middle party. The rest of this module: what the provider can actually observe (the rest of 2.2.1), the reporting-and-control machinery built on that (2.2.2), and where the whole layer runs out of reach (2.2.3).' },
        { check: {
          q: 'Why do compute providers make a useful governance surface in the first place?',
          options: [
            'Because providers can read customers’ training code and data',
            'Because providers are legally part of every government’s regulator',
            'Because AI models cannot run without a cloud connection',
            'Because frontier AI is mostly developed on machines that developers rent rather than own'
          ],
          key: 3,
          why: 'The leverage is structural: rented compute puts a third party between developer and machines. Providers by default do **not** read customer code or data (next reader), they are private companies, and self-owned offline compute exists — which is exactly the regime’s edge (2.2.3).' } },
        
        { h: 'Three layers' },
        { p: 'What does the landlord actually see? Sort everything into three layers, each with a different evidentiary job:' },
        { table: {
          head: ['Layer', 'Examples', 'What it supports'],
          rows: [
            ['Identity', 'account owner, payment relationship, affiliated accounts', 'attribution and linkage'],
            ['Resource use', 'accelerators allocated, duration, utilization, networking', 'approximate scale and structure'],
            ['Operational records', 'logs, billing entries, security alerts, job metadata', 'chronology, corroboration, anomaly detection']
          ] } },
        { p: 'Keep this table — you will use it three more times in this module. The layers also *fail* differently, which is the whole point of 2.2.3.' },
        
        { h: 'Layer one — identity' },
        { p: 'The account layer: legal names, emails, payment relationships, tax IDs, IP addresses and access times — and which accounts look related: same contact, same funding source, same devices.' },
        { p: 'Its job is **attribution**: connecting compute use to a real-world actor. Linkage — noticing that three “different customers” share one wallet — is the underrated half; the game will drill it.' },
        { p: 'The honest caveat, straight from the source: much of this data “can potentially be spoofed” — names, addresses, IPs. Identity is the layer a motivated evader attacks first. That is why 2.2.2 spends an entire scheme (KYC) hardening it.' },
        
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, Table 3 (p. 22).' },
        { h: 'Layer two — resource use' },
        { p: 'The machines layer: which hardware configuration was requested, how many accelerator-hours ran, how utilized the chips were, how much traffic moved between nodes.' },
        { p: 'Its job is **scale and structure**: enough to estimate how much compute a customer consumed — and, as the next reader shows, often enough to guess what kind of workload it was.' },
        { p: 'This layer is the hardest to fake, for a mundane reason: the provider bills from it. Hardware configuration and hours-in-use are described in the paper as “highly difficult or impossible” for customers to alter. You can lie on a form; it is much harder to lie to the meter.' },
        
        { src: 'Quoted from Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, Table 3 (p. 22).' },
        { h: 'Layer three — operational records' },
        { p: 'The diary layer: system logs, billing entries, security alerts, job metadata — each stamped in time.' },
        { p: 'Its job is **chronology and corroboration**. A customer’s story (“we ran a short fine-tune in March”) either matches the log trail or it doesn’t. Anomalies surface here first: a sudden traffic spike, an account that re-provisions hardware hours after a suspension.' },
        { p: 'By itself, a log proves little. Held against a declaration, it is a lie detector.' },
        
        { h: 'What the provider does not see' },
        { p: 'Now the line. Your code, your training data, your hyperparameters: by default the provider does not collect them. The paper is blunt — providers “cannot typically retain or inspect this information (by design).”' },
        { p: 'Everything in this module is built from **metadata around the workload**, not the workload itself. That is the layer’s privacy bargain — and its evidential ceiling: metadata supports estimates, not transcripts.' },
        { src: 'Quoted from Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, Table 3 (p. 22).' },
        { check: {
          q: 'A provider notices that a customer’s declared “small research project” actually reserved 4,000 accelerators for 90 days. Which visibility layer caught the mismatch?',
          options: [
            'None — the provider must have read the customer’s training code',
            'Resource use — allocation and duration',
            'Identity — the account owner’s name',
            'Operational records — a security alert'
          ],
          key: 1,
          why: 'Allocation size and duration are the resource-use layer. Identity says *who*; logs say *when*; and the training code itself is exactly what the provider does not read.' } },
        
        { h: 'The map, restated' },
        { p: 'Identity answers **who**. Resource use answers **how much** — and roughly what kind. Operational records answer **when**, and whether the stories match.' },
        { p: 'None of the three requires opening the customer’s files. All three are already collected in the ordinary course of business. What a governance regime adds is not new eyes — it is **obligations** about what must be recorded, verified, reported, and preserved. That machinery is section 2.2.2.' },
        
        { gap: {
          text: 'Identity answers ___. Resource use answers ___ — and roughly what kind. Operational records answer ___, and whether the stories match.',
          blanks: ['who', 'how much', 'when'],
          bank: ['who', 'how much', 'when', 'why', 'how fast'],
          why: 'Who, how much, when. Not *why*: intent is exactly what metadata cannot establish, which is why the unit ends where it does.',
          src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, pp. 20–22.' } },
        { h: 'Why type matters' },
        { p: 'Nearly every proposed compute rule triggers on **training** above a threshold. So before any threshold means anything, someone has to answer: was that workload a training run at all?' },
        { p: 'The provider has to answer without reading code. The claim from *Governing Through the Cloud*: non-confidential metadata is usually enough to estimate a workload’s **type** and **scale**. Here is what that actually rests on.' },
        
        { h: 'Signatures of a big run' },
        { p: 'A frontier training run in the mid-2020s has a recognizable body:' },
        { ul: [
          '**Massed hardware** — tens of thousands of accelerators on a high-bandwidth fabric, reserved together.',
          '**Sustained utilization** — cores near peak, around the clock, for weeks. Inference traffic rises and falls with users; training doesn’t sleep.',
          '**Parallelism patterns** — node-to-node traffic in the regular rhythms of data- and model-parallel training.',
          '**A closed loop** — little traffic to the outside internet while the run cooks.'
        ] },
        { p: 'No single signature is proof. Together they are hard to miss — and, as we’ll see, expensive to fake.' },
        
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 24.' },
        { h: 'Counting the compute' },
        { p: 'Scale is arithmetic the provider can already do: **chips × hours × utilization**. What was allocated gives an upper bound (everything at theoretical peak); measured utilization gives a tighter estimate.' },
        { p: 'A worked number: hitting 10²⁶ operations — the training-run reporting line in the 2023 US executive order — takes roughly 60,000 top-line accelerators (H100-class) running for 90 days at around 34% average utilization, per the paper’s own estimate. Runs like that do not hide in the noise of a data center.' },
        { p: 'The same arithmetic works *across* accounts — which becomes important when someone tries to buy compute in slices (2.2.3).' },
        
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 27 n. 29.' },
        { gap: {
          lead: 'The worked number from the paper. Scale is arithmetic: chips × hours × utilization.',
          text: 'Reaching 10²⁶ operations takes roughly ___ top-line (H100-class) accelerators, running for about ___ days, at around ___ average utilization.',
          blanks: ['60,000', '90', '34%'],
          bank: ['60,000', '90', '34%', '600', '9', '3.4%'],
          why: 'About 60,000 accelerators for about 90 days at roughly 34% utilization. An order of magnitude in any of the three puts you in a different world — this is why a frontier run does not hide in the noise of a data center.',
          src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 27 n. 29.' } },
        { h: 'How good is the guess?' },
        { p: 'In lab conditions, classifiers over this kind of telemetry distinguished AI workloads with about 95% accuracy. Solved, then? The paper itself says a 5% error rate “may be prohibitively high” in production — falsely reporting an innocent customer to a regulator is expensive in every currency.' },
        { p: 'And the signatures drift: new architectures, new parallelism schemes, new hardware all change what training looks like. A classifier is a snapshot, not a law of nature.' },
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, pp. 24–25.' },
        { check: {
          q: 'A workload holds accelerator cores near peak utilization, day and night, for three weeks, with almost no traffic to the outside internet. What does that pattern most suggest?',
          options: [
            'Ordinary database hosting',
            'An inference service with many users',
            'A large training run',
            'Nothing — metadata cannot distinguish workload types'
          ],
          key: 2,
          why: 'Sustained flat-out utilization in a closed loop is the training signature; inference load follows users and fluctuates. “Nothing” undersells metadata — estimation is exactly what it supports — and databases don’t pin accelerators for weeks.' } },
        
        { h: 'Estimate, not proof' },
        { p: 'So: the provider can usually tell **how big**, and often tell **what kind**. What it holds is an estimate with error bars, built from signals an adversary can study.' },
        { p: 'Keep both halves. The optimistic half powers everything in 2.2.2 — reporting thresholds, declarations, cross-checks. The humble half is 2.2.3’s whole job.' },
        { sec: '2.2.2 · Reporting, monitoring, control' },
        
        { h: 'Two hooks' },
        { p: 'Reporting regimes for cloud compute hang on two separate hooks:' },
        { p: '**Registration** — “a cluster this big exists, here.” The provider reports the existence, location, and capacity of frontier-capable infrastructure.' },
        { p: '**Declaration** — “a training run this big is happening.” The customer (or provider) reports a specific activity above a threshold.' },
        { p: 'Registration maps where frontier runs *could* happen. Declarations claim which ones *are* happening. Different questions, different thresholds — don’t let them blur.' },
        
        { h: 'The reference numbers' },
        { p: 'The 2023 US executive order (EO 14110) is the worked precedent — later rescinded, so it matters here as a *template*, not live law:' },
        { ul: [
          '**Cluster registration** — report clusters capable of ≥ 10²⁰ operations *per second*, networked at over 100 Gbit/s.',
          '**Training-run declaration** — report runs above 10²⁶ *total* operations.'
        ] },
        { p: 'One is a **rate** — how fast the cluster could compute. One is a **total** — how much a run consumed. The 60,000-accelerator example from the last reader is what 10²⁶ looks like in the flesh.' },
        
        { src: 'EO 14110 thresholds as tabulated in Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 31.' },
        { h: 'What a declaration says' },
        { p: 'A useful declaration answers three things — the same three layers from 2.2.1:' },
        { p: '**Who**: verified identity and an authorized signatory. **How much**: compute parameters — hardware, hours, locations. **What for**: purpose, model type, planned safety evaluations.' },
        { p: 'A declaration that answers only one of the three is a form, not evidence.' },
        
        { h: 'Claims, not proof' },
        { p: 'Here is the reframe the whole section hangs on: **a declaration is a claim.** Its value is not that it is true — it is that it can be checked, and that lying in it has legal consequences.' },
        { p: 'Declared 2 × 10²⁵ operations? The resource-use layer has its own opinion: chips × hours × utilization. Match → corroboration. Mismatch → an investigation with a paper trail.' },
        { p: 'That cross-check — **declared vs observed** — is the single most useful move in this module, and the game will make you do it repeatedly.' },
        { check: {
          q: 'Under the EO 14110 template, which is which?',
          options: [
            'Registration and declaration are two names for the same report',
            'Clusters register by capability rate (10²⁰ OP/s); training runs are declared by total compute (10²⁶ OP)',
            'Both use the same 10²⁶ threshold',
            'Clusters register at 10²⁶ OP; training runs are declared at 10²⁰ OP/s'
          ],
          key: 1,
          why: 'Standing infrastructure is measured by what it *could* compute per second (a rate); a run by what it *did* compute in total. Mixing the two numbers up is the most common error in this unit — and they hook different obligations.' } },
        
        { gap: {
          text: 'A declaration is a ___. Its value is not that it is true — it is that it can be ___, and that lying in it carries legal consequences.',
          blanks: ['claim', 'cross-checked'],
          bank: ['claim', 'cross-checked', 'proof', 'notarized', 'measurement'],
          why: 'A claim, whose worth is that it can be cross-checked. Treat it as proof and you have a paperwork regime — the failure mode section 2.2.3 is built around.',
          src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, pp. 30–32.' } },
        { h: 'Who gets told what' },
        { p: 'Routine records mostly stay with the provider. Regulators see reports at thresholds, or on request. One proposed design keeps it lighter still: providers report only when they have *reasonable grounds to suspect* a violation — the way banks flag suspicious transactions rather than mailing every ledger to the government.' },
        { p: 'The design trade is visibility vs intrusion, and it recurs at every level of this track. More routine reporting means more oversight — and more honest customers’ data sitting in government files. Remember this page when 2.2.3 tallies the costs.' },
        
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 32.' },
        { h: 'Renting beats buying' },
        { p: 'Export controls stop chip **shipments**. They don’t stop **logins**. An entity barred from buying accelerators can rent the same silicon by the hour — as the KYC paper puts it: “It is not necessary for these entities to own the physical chips if they are accessible digitally.”' },
        { p: 'So the cloud is either the hole in compute governance or its best checkpoint — depending entirely on whether the provider knows who it is serving.' },
        { p: 'That is the anchor problem: every record from 2.2.1 is worthless if the name on the account is a fiction.' },
        
        { src: 'Quoted from Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers* (2023) — [arXiv:2310.13625](https://arxiv.org/abs/2310.13625), CC BY 4.0, p. 4.' },
        { h: 'The scheme' },
        { p: 'The proposed compute-KYC scheme (Egan & Heim, 2023) transplants a mature template onto providers. Above a compute threshold, the provider must:' },
        { ul: [
          '**Verify the entity** — incorporation, address, directors, checked against registries.',
          '**Verify the beneficial owners** — the humans who ultimately own or control it (the US line: ≥25% ownership, or substantial control) — not just the name on the contract.',
          '**Record a statement of purpose**, and monitor usage against it.',
          '**Keep records** of above-threshold provision — and of denials.',
          '**Report matches** against high-risk profiles: sanctions lists, ties to countries of concern, funding that can’t be explained.'
        ] },
        { src: 'Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers* (2023) — [arXiv:2310.13625](https://arxiv.org/abs/2310.13625), CC BY 4.0, pp. 10–12; the 25% line at n. 66 (p. 11).' },
        { check: {
          q: 'A customer entity is owned 100% by a holding company, which is owned by another company offshore. What does beneficial-ownership verification require?',
          options: [
            'Confirming the customer’s email domain matches its website',
            'Verifying the holding company’s name and stopping there',
            'Tracing through the layers to the actual humans who own or control the customer',
            'Checking that the offshore jurisdiction has a tax treaty'
          ],
          key: 2,
          why: 'Beneficial ownership means the natural persons at the end of the chain. Layered holding companies are precisely the structure the requirement exists to see through — stopping at the first shell is the failure mode, not the rule.' } },
        
        { gap: {
          text: 'Beneficial-ownership verification means tracing through the layers to the ___ who ultimately own or control the customer. The US line is ___ ownership, or substantial control.',
          blanks: ['humans', '25%'],
          bank: ['humans', '25%', 'directors', '10%', 'creditors'],
          why: 'The natural persons at the end of the chain, at 25% ownership or substantial control. Directors can be nominees and creditors are not owners — stopping at either is the failure the requirement exists to prevent.',
          src: 'Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers* (2023) — [arXiv:2310.13625](https://arxiv.org/abs/2310.13625), CC BY 4.0, pp. 10–12 and n. 66 (p. 11).' } },
        { h: 'The sharp tool' },
        { p: 'Why bother, when export controls already exist? Because of what enforcement looks like. “Once exported, chips cannot be retracted nor their end use controlled.” A chip on the wrong continent is gone.' },
        { p: 'Cloud access is the opposite: point-in-time, metered, revocable mid-run. A violation discovered on Tuesday can lose its compute on Tuesday.' },
        { p: 'Suspension is faster, more precise, and more reversible than any action against physical hardware — which also makes it a lighter trigger to pull, and therefore a more credible threat.' },
        
        { src: 'Quoted from Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers* (2023) — [arXiv:2310.13625](https://arxiv.org/abs/2310.13625), CC BY 4.0, p. 4.' },
        { h: 'Sixty years of prior art' },
        { p: 'None of this is a new idea. Banks have run the same scheme since the 1970s under the US Bank Secrecy Act: identify customers, verify owners, monitor transactions, report suspicion.' },
        { p: 'Two lessons travel. First: rules without enforcement slept — bank compliance stayed weak for years until penalties got real.' },
        { p: 'Second — and keep this one: the moment a $10,000 reporting line existed, customers started splitting deposits into $9,900 slices. The move even has a legal name: **structuring**. Write a threshold, and you have written the evasion’s spec sheet. File that thought; it comes back with numbers on it in 2.2.3.' },
        
        { src: 'Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers* (2023) — [arXiv:2310.13625](https://arxiv.org/abs/2310.13625), CC BY 4.0, pp. 7–8.' },
        { h: 'The leak' },
        { p: 'One jurisdiction alone cannot hold this. A US-only KYC scheme pushes exactly the customers with something to hide toward providers in laxer jurisdictions — the scheme would select for evasion while burdening the honest.' },
        { p: 'So the KYC paper’s own condition: coverage must spread — allied jurisdictions adopting compatible schemes and sharing risk information — or the checkpoint becomes a detour sign.' },
        { src: 'Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers* (2023) — [arXiv:2310.13625](https://arxiv.org/abs/2310.13625), CC BY 4.0, p. 15; Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 5.' },
        { check: {
          q: 'Why does a strict KYC scheme in one country alone tend to leak?',
          options: [
            'Because KYC is technically impossible to implement',
            'Customers with something to hide simply move to providers in jurisdictions without the scheme',
            'Because compute cannot be metered per customer',
            'Because the scheme only applies to small customers'
          ],
          key: 1,
          why: 'The scheme is sound where it applies — the leak is jurisdictional migration. Per-customer metering is exactly what providers already do for billing, and thresholds target the *largest* customers, not the smallest.' } },
        
        { h: 'Where the paperwork is thin' },
        { p: 'The template has a known soft spot: **chains**. Watch one compute request travel:' },
        { p: 'A provider sells capacity to *CloudBridge Ltd*, a reseller. CloudBridge subleases to *Meridian Analytics*, a consultancy. Meridian’s compute is used by a client it declines to name.' },
        { p: 'Each hop knows one name. Nobody holds the chain. The provider’s KYC file says “CloudBridge” — true, verified, and useless.' },
        { p: 'Beneficial-ownership registries help with shell *layers*; reseller and sublease *chains* are thinner ground — the KYC proposal touches them only in passing (“investigate sublessors where relevant”). Treat multi-hop chains as a live gap in the regime you are learning — and as a red-flag pattern to hunt in the game, next.' },
        { src: 'Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers* (2023) — [arXiv:2310.13625](https://arxiv.org/abs/2310.13625), CC BY 4.0, p. 11 n. 80. The three-hop chain is an illustration, not a case from the paper.' },
        { sec: '2.2.3 · Limits and judgment' },
        
        { h: 'The failure mode, named' },
        { p: 'Suppose the regime works exactly as designed: registrations filed, declarations submitted, thresholds set. A customer files every form — and trains a dangerous model anyway. Nothing in the filing cabinet stops them. **If compliance is defined as paperwork, the regime measures paperwork.**' },
        { p: 'A 2025 RAND study modeled this as a game between a cloud provider (the monitor) and an evader, and reached a blunt finding: providers “might not be able to report and detect AI training” if they are obligated to monitor “based only on floating-point operation thresholds.”' },
        
          { quote: {
            t: 'Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance',
            url: 'https://www.rand.org/pubs/research_reports/RRA3686-1.html',
            what: 'Key Takeaways, published with the report',
            by: 'Moon, Vedula, Geneson & Bar-on · RAND Corporation, RR-A3686-1 · 2025',
            text: [
              'Cloud service providers might not be able to report and detect AI training if they are only obligated to monitor and report activity based on floating-point operation thresholds in future AI governance policy.',
              'In the future, many types of capable AI models will likely exist whose training will be hard to detect. The authors outline strategies for cloud service providers that could aid with AI training detection in cloud computing environments.'
            ] } },
        { src: 'Quoted from the published summary of Moon, Vedula, Geneson & Bar-on, *Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance*, RAND RR-A3686-1 (2025) — [rand.org](https://www.rand.org/pubs/research_reports/RRA3686-1.html).' },
        { h: 'Sequential training' },
        { p: 'The winning move is embarrassingly simple. Take BLOOM — a real, public 176-billion-parameter model, about 5.8 × 10²³ operations of training. The threshold in RAND’s setup (from the executive order’s rule for bio-sequence models): 10²³ operations per account. Trained in one piece, BLOOM crosses it.' },
        { p: 'Now split: **58 sessions of 10²² operations each**, run one after another, each handing its weights to the next, across accounts the provider cannot link. No session crosses the line. Nothing is ever recorded.' },
        { p: 'In the model, this strategy *always wins* against a threshold-only monitor. It is the $9,900 deposit — with GPUs.' },
        
        { src: 'Moon, Vedula, Geneson & Bar-on, *Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance*, RAND RR-A3686-1 (2025) — [rand.org](https://www.rand.org/pubs/research_reports/RRA3686-1.html), pp. 5–6.' },
        { gap: {
          lead: 'The RAND result, in one line.',
          text: 'BLOOM took about 5.8 × 10²³ operations. Split into ___ sessions of 10²² operations each, run across accounts the provider cannot ___, no single session crosses the 10²³ threshold and nothing is ever ___.',
          blanks: ['58', 'link', 'reported'],
          bank: ['58', 'link', 'reported', '5', 'meter', 'billed'],
          why: '58 sessions, unlinkable accounts, nothing reported. Every session is metered and billed perfectly well — the failure is aggregation, not measurement.',
          src: 'Moon, Vedula, Geneson & Bar-on, *Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance*, RAND RR-A3686-1 (2025) — [rand.org](https://www.rand.org/pubs/research_reports/RRA3686-1.html), pp. 5–6.' } },
        { h: 'The detection gap' },
        { p: 'Generalize it. Between “too small to matter” and “too big to hide” lies a band of models — roughly 10²³ to 10²⁶ operations in the RAND setup — that threshold-only monitoring simply does not see.' },
        { p: 'The band is not empty, and it is not static: as specialized models (biology, chemistry) get more capable per operation, more of what matters fits inside the gap. A threshold calibrated today describes yesterday’s models.' },
        
        { src: 'Moon, Vedula, Geneson & Bar-on, *Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance*, RAND RR-A3686-1 (2025) — [rand.org](https://www.rand.org/pubs/research_reports/RRA3686-1.html), p. 5.' },
        { h: 'What closes gaps' },
        { p: 'The counter is not better paperwork — it is **more channels**:' },
        { ul: [
          '**Cluster size** — big models resist scattering: one distributed-training experiment (DiPaCo) needed roughly 32× the compute units of the colocated baseline. Concentration is hard to avoid.',
          '**Data transfers** — the training dataset has to arrive; a fresh account pulling terabytes in is a tell.',
          '**Instruction mix** — training is dense in multiply-accumulate operations; diluting the mix costs efficiency.',
          '**Power draw** — sustained training burns power at rates little else matches (BLOOM: roughly 3,600 kWh per day).'
        ] },
        { p: 'Every evasion of these costs the evader real efficiency. That is the design goal: not “evasion impossible” but “evasion expensive and loud.”' },
        { src: 'Moon, Vedula, Geneson & Bar-on, *Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance*, RAND RR-A3686-1 (2025) — [rand.org](https://www.rand.org/pubs/research_reports/RRA3686-1.html), pp. 9–10.' },
        { check: {
          q: 'Why does splitting one training run into 58 sub-threshold chunks defeat a FLOP-threshold monitor?',
          options: [
            'Because splitting reduces the total compute the model needs',
            'The threshold is evaluated per account, no chunk crosses it, and the monitor cannot link the accounts',
            'Because each chunk becomes technically impossible to meter',
            'Because thresholds only apply to inference workloads'
          ],
          key: 1,
          why: 'The total compute is unchanged and every chunk is metered perfectly well — the failure is **aggregation**: per-account evaluation plus unlinkable accounts means no single reading ever trips the line. (And thresholds target training, not inference.)' } },
        
        { h: 'Tripwires, not judges' },
        { p: 'The lesson is not “thresholds are useless.” A tripwire that forces evaders into slower, costlier, stranger behavior is doing work — the distortion itself is a signal.' },
        { p: 'The lesson is about posture: **assume your rule is being read by the person it is aimed at.** RAND’s recommendation to policymakers is a standing habit, not a one-off fix: systematically hunt for detection gaps, and re-hunt as the technology moves.' },
        
          { quote: {
            t: 'Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance',
            url: 'https://www.rand.org/pubs/research_reports/RRA3686-1.html',
            what: 'Recommendations, published with the report',
            by: 'Moon, Vedula, Geneson & Bar-on · RAND Corporation, RR-A3686-1 · 2025',
            text: [
              'To develop effective AI governance, policymakers should support efforts to find detection gaps in compute-based monitoring schemes.',
              'Policymakers should continue to pursue both compute- and noncompute-based AI governance.',
              'Continuing research into effective thresholds for compute monitoring is required to create a robust compute-based monitoring framework that can adapt to technological progress.'
            ] } },
        { src: 'Moon, Vedula, Geneson & Bar-on, *Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance*, RAND RR-A3686-1 (2025) — [rand.org](https://www.rand.org/pubs/research_reports/RRA3686-1.html), recommendations.' },
        { h: 'Same move, new domain' },
        { p: 'You have now seen the same play twice: deposits at $9,900, and training runs at 10²² a slice. Any fixed line invites slicing; any per-account rule invites more accounts.' },
        { p: 'Which is why 2.2.2’s machinery matters as a **system** rather than as parts: identity linkage — KYC’s cross-account job — is exactly the capability that turns “58 unrelated accounts” back into “one customer.” The mechanisms cover for each other, or they don’t work at all.' },
        
        { h: 'Three exits' },
        { p: 'Everything so far assumed one thing: the compute is rented from a covered provider. There are three ways out of that assumption:' },
        { ul: [
          '**Own the machines** — build or buy your own cluster. No landlord, no records, no switch.',
          '**Rent elsewhere** — use a provider in a jurisdiction the regime doesn’t reach.',
          '**Skip the compute** — steal the trained weights and bypass the entire training-oversight edifice. That one gets its own treatment in Module 3.1.'
        ] },
        { p: 'The cloud layer’s writ runs exactly as far as rented, in-jurisdiction compute. This reader walks the edges.' },
        
        { h: 'When the landlord is the tenant' },
        { p: 'Several of the biggest AI developers are their own compute providers — or joined at the hip with one. When developer and provider are the same entity, the intermediary this module is built on disappears: nobody neutral holds the records, and “the provider verifies the customer” becomes the company verifying itself.' },
        { p: 'The candidate patches are borrowed from other layers: direct regulatory inspection of in-house facilities, whistleblower protections (module 2.4), prudential rules.' },
        { p: 'Note what happened: the cloud layer’s cheapest trick — recruiting an existing third party — stops working, and oversight gets expensive again.' },
        
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, p. 39.' },
        { h: 'Jurisdiction, in practice' },
        { p: 'The second exit is geography, and it is not hypothetical. Frontier-scale capacity is spreading across third countries; a customer barred here can contract there, and a workload can be placed where the rules aren’t. Shell entities blur *who* is renting; VPNs blur *from where*.' },
        { p: 'The policy record so far is sobering (as of mid-2026): the US AI Diffusion Rule — an attempt to govern compute access globally — was suspended before it took effect, and legislation to treat remote compute access like an export (the Remote Access Security Act) passed the House, stalled in the Senate, and has since been revived.' },
        { p: 'Controls that read cleanly on paper have struggled to survive politics.' },
        
          { quote: {
            t: 'The Geopolitical Debates Over Controlling Cloud Compute',
            url: 'https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute',
            what: 'On the cloud loophole, and on how it is worked',
            by: 'Noah Tan · Carnegie Endowment for International Peace · 5 May 2026',
            text: [
              'It is logically inconsistent to restrict the sale of physical chips while allowing their computing power to be accessed remotely.',
              'Foreign actors can distribute frontier training workloads across multiple data center clusters to obscure their total compute footprint, anonymous shell companies can obfuscate beneficial ownership, and virtual private networks can mask IP addresses.'
            ] } },
        { src: 'Tan, *The Geopolitical Debates Over Controlling Cloud Compute*, Carnegie Endowment (2026) — [carnegieendowment.org](https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute).' },
        { h: 'The bill for the controls' },
        { p: 'Fairness requires the other column. The vetting burden lands on **providers**: compliance costs up, sales lost, and thin government capacity to backstop them.' },
        { p: 'Over-broad rules push foreign customers off covered infrastructure entirely — costing revenue, relationships, and influence over the ecosystem’s standards. The customers who leave take their visibility with them.' },
        { p: 'This is the effectiveness-feasibility trade from Module 0, wearing cloud clothes: the strictest scheme on paper can be the weakest in the world, because **coverage is the thing that makes the scheme work at all**.' },
        
          { quote: {
            t: 'The Geopolitical Debates Over Controlling Cloud Compute',
            url: 'https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute',
            what: 'On who pays for the controls',
            by: 'Noah Tan · Carnegie Endowment for International Peace · 5 May 2026',
            text: [
              'The burden of vetting end users would fall largely on cloud service providers themselves, driving up costs and reducing revenue.',
              'Restrictions risk pushing countries to decrease their dependence on U.S. chips in favor of more convenient Chinese alternatives.'
            ] } },
        { src: 'Tan, *The Geopolitical Debates Over Controlling Cloud Compute*, Carnegie Endowment (2026) — [carnegieendowment.org](https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute).' },
        { h: 'Visibility vs privacy' },
        { p: 'One more honest tension. Providers generally say they do *not* monitor customer workloads — and they have the technical capability to. Every monitoring mandate in this module spends some of that promise. The costs fall on every honest customer; the benefits only materialize against the rare dishonest one.' },
        { p: 'There are designs that spend less privacy: thresholds that exempt small users, metadata-only monitoring, report-on-suspicion. But “less” is not “none,” and a regime that pretends the cost is zero will lose the argument in public. Carry the tension — it is load-bearing in the capstone.' },
          { quote: {
            t: 'The Geopolitical Debates Over Controlling Cloud Compute',
            url: 'https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute',
            what: 'On what providers say, and what they can do',
            by: 'Noah Tan · Carnegie Endowment for International Peace · 5 May 2026',
            text: [
              'Cloud providers generally say they do not monitor their users\' workloads, in part to protect customer privacy, but they have the technical capability to do so.'
            ] } },
        { src: 'Tan, *The Geopolitical Debates Over Controlling Cloud Compute*, Carnegie Endowment (2026) — [carnegieendowment.org](https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute).' },
        { check: {
          q: 'Which of these is fully outside what cloud-layer oversight can see?',
          options: [
            'A training run on a company’s own air-gapped cluster',
            'A declared run at a covered provider',
            'A customer who reserves compute at a covered provider and never uses it',
            'An undeclared run at a covered provider'
          ],
          key: 0,
          why: 'The covered provider sees declared runs, undeclared runs (as telemetry), and idle reservations alike. A self-owned, disconnected cluster has no landlord — that is exit one, and finding it belongs to the hardware and intelligence layers now.' } },
        
        { h: 'The sober summary' },
        { p: 'The cloud layer is strong exactly where compute is **rented, formal, and in-jurisdiction** — and blind where it is owned, offshore, or already stolen.' },
        { p: 'That is not a verdict against the layer. It is the reason the track has five of them: what the cloud cannot see, power grids, chip registries, and people sometimes can. Which is the next module.' },
        
        { h: 'The two questions' },
        { p: 'You are nearly at the gate. The exit skill of this module is a habit. For any piece of cloud evidence, ask:' },
        { p: '**1. What does it establish?** And what is it merely consistent with?' },
        { p: '**2. Who controls it?** Who could make it say something false — and at what cost?' },
        { p: 'Run those two questions over everything you have met: declarations, KYC files, billing records, utilization curves, logs.' },
        
        { h: 'The strength ladder' },
        { table: {
          head: ['Evidence', 'Controlled by', 'Faking it costs'],
          rows: [
            ['Hardware allocation, billing records', 'Provider', 'Nearly unfakeable by the customer — the provider bills from them'],
            ['Utilization, traffic, power patterns', 'Provider (observed)', 'Gameable — at real efficiency cost, and the distortion is itself a signal'],
            ['Declarations, stated purpose, workload labels', 'Customer', 'A form and a signature — cheapest to fake, worthless uncorroborated, legally binding once false']
          ] } },
        { p: 'The bottom row alone is a paperwork regime. The top rows alone are numbers with no name attached. The regime works when the rows are cross-checked against each other.' },
        
        { src: 'Heim et al., *Governing Through the Cloud* (2024) — [arXiv:2403.08501](https://arxiv.org/abs/2403.08501), CC BY 4.0, Table 3 (p. 22).' },
        { h: 'What it cannot establish alone' },
        { p: 'Even at full strength, cloud evidence cannot establish: **intent** — metadata shows a training run, not why; **completeness** — a clean record at provider A says nothing about provider B, or the basement cluster; or the **true principal** — KYC names the counterparty, and the chain behind it can stay dark.' },
        { p: 'Each missing piece has an owner elsewhere in the stack: hardware attestation (2.1) for what code actually ran; energy, procurement, and satellite signatures (2.3) for the compute nobody declared; insiders (2.4) for intent.' },
        { p: 'One witness. Never the whole court.' },
        
        { h: 'Five things to keep' },
        { p: 'If this module leaves five sentences in your head, make them these:' },
        { ul: [
          '**The provider is a third party in the room** — governance leverage exists because frontier compute is rented.',
          '**Metadata is enough to see scale, and often type** — without reading anyone’s code.',
          '**Identity is the anchor** — records without verified identity are not evidence about anyone.',
          '**A declaration is a claim, not proof** — its value comes from cross-checking, and from lying being costly.',
          '**Cloud oversight ends at the cloud’s edge** — owned, offshore, or stolen means another layer’s job.'
        ] },
        { check: {
          q: 'Rank these by resistance to customer fakery, strongest first.',
          options: [
            'Billing records → utilization patterns → declarations',
            'Declarations → utilization patterns → billing records',
            'All three are equally hard to fake',
            'Utilization patterns → declarations → billing records'
          ],
          key: 0,
          why: 'Billing and allocation are the provider’s own meter; utilization can be gamed, but at efficiency cost; a declaration is whatever the customer types. It is a ladder, not a tie.' } },
        
        { h: 'The gate' },
        { p: 'That is the module. Twelve questions, one at a time, pass at 9 — retake freely; the order reshuffles.' },
        { p: 'Then onward: module 2.3 asks what a verifier sees when nobody files anything at all — the intelligence layer. The power meter doesn’t take declarations.' },
          ],
          readings: [
            { t: 'Governing Through the Cloud: The Intermediary Role of Compute Providers in AI Regulation',
              a: 'Heim, Fist, Egan, Huang, Zekany, Trager, Osborne & Zilberman', y: '2024', len: 'arXiv:2403.08501',
              url: 'https://arxiv.org/abs/2403.08501', lic: 'CC BY 4.0',
              note: 'The backbone of this unit: the four provider roles, the three visibility layers, and the case that non-confidential metadata already shows a workload\'s scale and often its type. Passages are quoted here under the paper\'s CC BY 4.0 licence.' },
            { t: 'Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers',
              a: 'Egan & Heim', y: '2023', len: 'arXiv:2310.13625',
              url: 'https://arxiv.org/abs/2310.13625', lic: 'CC BY 4.0',
              note: 'The KYC machinery behind 2.2.2 — identity, beneficial ownership, suspension, and the banking lineage the scheme is borrowed from. Quoted under CC BY 4.0.' },
            { t: 'Strategies and Detection Gaps in a Game-Theoretic Model of Compute Governance',
              a: 'Moon, Vedula, Geneson & Bar-on — RAND, RR-A3686-1', y: '2025', len: '25 pages',
              url: 'https://www.rand.org/pubs/research_reports/RRA3686-1.html',
              note: 'The counterweight in 2.2.3: a monitor watching only FLOP thresholds provably loses to sequential training. The report\'s own Key Takeaways and Recommendations are reproduced in 2.2.3 with attribution; the body argument — sequential training, the detection gap, the added metrics — is paraphrased with page citations.' },
            { t: 'The Geopolitical Debates Over Controlling Cloud Compute',
              a: 'Tan — Carnegie Endowment for International Peace', y: '5 May 2026',
              url: 'https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute',
              note: 'The current-policy case: third-country data centers, the suspended AI Diffusion Rule, who carries the vetting burden, and the visibility-versus-privacy bill. Four passages are reproduced in 2.2.3 with attribution; the rest is paraphrase.' }
          ],
          exercise: 'ex-cloud-check',
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
            { stub: 'Worked examples and marking rubrics are still being assembled upstream. The briefs below and the workspace are live; there is nothing yet to compare a finished regime against.' }
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
          // The bank is data/capstone-bank.js, generated from
          // verification-capstones/*.md. `lead` is the brief this unit is
          // written around; the rest are the alternative deliverables the
          // written output above offers. A slug the bank does not carry is
          // simply not led with, so a renamed capstone degrades to the
          // ungrouped list rather than to an error.
          bank: { lead: 'minimal-verification-regime' },
          workspace: 'capstone.html' }
      ]
    }
  ]
};
