/* Exercise definitions, read by the capstone page; a new
   exercise is a new object here plus an `exercise:` id on a unit.

   Honesty contract, and the reason several of these are ungraded:
   a scored key is only written where the source outline states the answer.
   Where the upstream outline says "reveal the answer key" but the key has
   not been drafted yet, the exercise ships as a `plot` or `grid` — the
   learner commits a position and the reveal is the course's stated
   argument, never a fabricated score. Each object carries `source`: the
   outline section it was built from. Do not add a `key` to one of these
   without a source that states it.

   Types
     mcq   one question at a time; key + why; graded
     sort  one item at a time into named buckets; key + why; graded
     rank  drag/keyboard ordering; optional key, or sealed for later recall
     grid  self-assessment matrix with a reveal prompt; never graded
     plot  two-axis placement, then written defense; never graded */

window.EXERCISES = {

  /* ---------------------------------------------------------- 0.1 */
  'ex-response-menu': {
    type: 'mcq',
    title: 'Four responses, one dependency',
    lede: 'Each response on the menu leans on verification somewhere. Find where.',
    source: 'Outline 0.1 — the response menu.',
    questions: [
      { q: 'A regime relies on punishment: defection is met with sanctions. What does the punishment branch require before it can operate at all?',
        options: [
          'A finding that a defection occurred',
          'A larger sanction than the gain from defecting',
          'Unanimous agreement on the penalty schedule',
          'An enforcement body with its own budget'
        ],
        key: 0,
        why: 'The size of the penalty and the body that levies it are second-order. Punishment cannot start without something to punish — which means a finding, which means detection.' },
      { q: 'A regime relies on transparency: every party publishes its training runs. What is the load-bearing assumption?',
        options: [
          'That parties publish on the same schedule',
          'That a true declaration can be told apart from a false one',
          'That the published data is machine-readable',
          'That publication is timely enough to act on'
        ],
        key: 1,
        why: 'Transparency moves information, it does not authenticate it. Without a way to distinguish an accurate declaration from an inaccurate one, publication is a channel for whatever the publisher wants believed.' },
      { q: 'Which of these is the reason unilateral restraint fails even among actors who all want the same outcome?',
        options: [
          'The actors disagree about what counts as dangerous',
          'Restraint is expensive to monitor internally',
          'Relative gains: the actor who slows down loses position, so nobody can afford to be first',
          'Domestic law usually forbids it'
        ],
        key: 2,
        why: 'This is the security dilemma in its arms-race form, and it is why the course treats the problem as a coordination problem rather than a persuasion problem.' }
    ]
  },

  /* ---------------------------------------------------------- 0.2 */
  'ex-branches': {
    type: 'mcq',
    title: 'Three branches',
    lede: 'Walk each path to its end state. Only one of them stays open.',
    source: 'Outline 0.2 — timelines and branches.',
    questions: [
      { q: 'Branch A — every party independently exercises restraint, with no agreement. How does this branch close?',
        options: [
          'A party defects openly and the others follow',
          'Race incentives dominate: restraint costs relative position, so it does not survive contact with competition',
          'The parties disagree about thresholds and stop talking',
          'It does not close — it is stable if the parties are sincere'
        ],
        key: 1,
        why: 'Sincerity is not the failure point. The branch closes because restraint is unilaterally costly, which makes it unstable regardless of intent.' },
      { q: 'Branch B — an agreement is signed, with no verification machinery. How does this branch close?',
        options: [
          'Covert defection is undetectable, so the expectation of defection makes defection rational',
          'The agreement is never ratified',
          'Enforcement bodies deadlock over jurisdiction',
          'Signatories reinterpret the thresholds until the text is meaningless'
        ],
        key: 0,
        why: 'The failure is not bad faith at signature. It is that a party which cannot be checked must assume it is not being checked — and must assume the same of everyone else.' },
      { q: 'You are told a detection mechanism finds violations reliably, within eighteen months. The policy window you are designing for is a three-month emergency pause. What follows?',
        options: [
          'The mechanism is adequate; eighteen months is fast for arms control',
          'The mechanism is inadequate for this claim: required detection speed is set by the policy window, not by the mechanism',
          'The mechanism is adequate if paired with a second mechanism',
          'Not enough information — it depends on the violation'
        ],
        key: 1,
        why: 'Timeliness is derived, not intrinsic. The same mechanism can be excellent for a decade-long regime and useless for a three-month one; the horizon in the claim decides.' }
    ]
  },

  /* ---------------------------------------------------------- 0.3 */
  'ex-precedents': {
    type: 'sort',
    title: 'What each precedent contributes',
    lede: 'Three arms-control regimes, three different lessons. Place each observation with the regime it comes from.',
    source: 'Outline 0.3 — history, precedents, parallels.',
    buckets: [
      { id: 'iaea', label: 'IAEA safeguards' },
      { id: 'cwc', label: 'CWC' },
      { id: 'bwc', label: 'BWC' }
    ],
    items: [
      { t: 'Accountancy of declared material — and the failure mode where the declaration itself is the lie.', key: 'iaea',
        why: 'Safeguards were built to audit what a state said it had. The hard cases are the facilities that were never declared, which is exactly where national intelligence, not routine inspection, has done the finding.' },
      { t: 'Managed access: the institutional answer to the confidentiality problem, adopted because the cryptographic one did not exist.', key: 'cwc',
        why: 'This is the precedent Module 2.0 returns to. When you cannot prove a claim without revealing a secret, you constrain what the inspector may see rather than what they may conclude.' },
      { t: 'A verification protocol that was technically imaginable and politically unacceptable.', key: 'bwc',
        why: 'The one-slide cautionary case: feasibility has a political axis that can be decisive on its own, which is why 4.1 scores it separately from technical feasibility.' },
      { t: 'What a regime did once it had actually caught someone — and how catching them rewrote the rules for everybody.', key: 'iaea',
        why: 'Iraq 1991 and the Additional Protocol that followed. Enforcement is not only the consequence for the violator; it is the ratchet that changes the baseline for every other party.' },
      { t: 'Challenge inspection with negotiated limits on what the inspector may see, record or take away.', key: 'cwc',
        why: 'The same institutional move, at the inspection level: access rights and confidentiality carve-outs written into the same clause.' }
    ]
  },

  /* ---------------------------------------------------------- 1.0 */
  'ex-policy-matrix': {
    type: 'plot',
    title: 'Policy scoping plot',
    lede: 'Place each response bucket on effectiveness against feasibility, then defend two of your placements.',
    source: 'Outline 0.2.2 / 1.0 — policy sorting activity.',
    axes: { x: 'Feasibility →', y: 'Effectiveness →' },
    items: [
      'Self-governance',
      'Unilateral restraint',
      'Domestic regulation',
      'Transparency coordination',
      'Compute controls',
      'Nonproliferation regime',
      'International joint development',
      'Coordinated halt (pause)'
    ],
    prompt: 'Pick the two placements you are least sure about. For each, name the assumption that would have to be false for you to move it.',
    reveal: {
      title: 'The course\'s position',
      body: [
        'There is no single scored key here, and the exercise is not graded — placements are defensible in more than one direction, and the reasoning is the artifact.',
        'The convergent argument the track makes: **if you accept the securitized framing from 0.3, design toward the full pause.** Mechanisms strong enough to verify a coordinated halt support every weaker commitment on the list; the reverse is not true.',
        'Keep this plot. Unit 4.1 re-scores the same portfolio on four separate feasibility dimensions, and the difference between the two passes is the point.'
      ],
      note: 'Ungraded by design: there is no per-bucket key to score you against, so the reveal gives the course\'s argument rather than a number.'
    }
  },

  /* ---------------------------------------------------------- 1.1 */
  'ex-anatomy': {
    type: 'sort',
    title: 'Anatomy of a provision',
    lede: 'Fragments from an illustrative pause provision. Each one is an actor, an object, an activity or a condition.',
    source: 'Outline 1.1 — anatomy of a policy. Fragments are illustrative, not quoted from a real agreement.',
    buckets: [
      { id: 'actor', label: 'Actor' },
      { id: 'object', label: 'Object' },
      { id: 'activity', label: 'Activity' },
      { id: 'condition', label: 'Condition' }
    ],
    items: [
      { t: '"…the designated national regulator of each Party…"', key: 'actor',
        why: 'Named body that is bound or empowered. Ask immediately: does it also authorise, or only report?' },
      { t: '"…any training run exceeding 10^25 total training FLOP…"', key: 'object',
        why: 'The thing the rule is about. Note that it is defined by a proxy measurement, which is what makes 1.0\'s threshold discussion load-bearing.' },
      { t: '"…shall declare, within thirty days of commencement…"', key: 'activity',
        why: 'What is required. The obligation is to declare — not to be accurate, unless accuracy is separately specified.' },
      { t: '"…provided that the facility is under the jurisdiction of a Party…"', key: 'condition',
        why: 'A carve-out. Every condition is a seam, and 3.1 is largely a catalog of actors working the seams.' },
      { t: '"…the operator of the computing facility…"', key: 'actor',
        why: 'Private actor bound directly rather than through its state — which changes who a verifier can approach.' },
      { t: '"…shall not transfer covered hardware to a non-Party…"', key: 'activity',
        why: 'A prohibition. Ask what observation would show it was broken: that question is falsifiability, and it is the unit\'s core move.' },
      { t: '"…for the duration of the emergency period…"', key: 'condition',
        why: 'A timeframe. Duration conditions set the clock that 0.2\'s timeliness requirement has to beat.' }
    ]
  },

  /* ---------------------------------------------------------- 1.2 */
  'ex-chokepoints': {
    type: 'rank',
    title: 'The verifiability gradient',
    lede: 'Order the supply chain from the stage where a control attaches most easily to the stage where it attaches least.',
    source: 'Outline 1.2 / 1.4 — supply-chain simulation; the gradient is stated in the outline.',
    items: [
      { id: 'euv', t: 'Lithography equipment (EUV)' },
      { id: 'fab', t: 'Leading-edge fabrication' },
      { id: 'design', t: 'Chip design' },
      { id: 'assembly', t: 'Packaging and assembly' },
      { id: 'cloud', t: 'Cloud and data-center operation' },
      { id: 'deploy', t: 'Model deployment and use' }
    ],
    key: ['euv', 'fab', 'design', 'assembly', 'cloud', 'deploy'],
    why: 'The gradient runs from concentrated and physical to diffuse and informational. Upstream stages have few suppliers, enormous capital costs and shippable objects — a control has something to attach to. Downstream, activity is copyable, distributed and mostly indistinguishable from ordinary use.',
    caveat: 'Order within a neighbouring pair is arguable; the shape of the curve is the lesson, not the exact permutation.'
  },

  /* ---------------------------------------------------------- 1.3 */
  'ex-upstream': {
    type: 'mcq',
    title: 'Inherited or established?',
    lede: 'For each line in a draft assessment, decide whether the claim was verified or inherited from the party being checked.',
    source: 'Outline 1.3 — upstream and downstream.',
    questions: [
      { q: '"The facility reported 4,200 accelerators on site as of March." Your assessment repeats this figure. What is its status?',
        options: [
          'Established — it is a specific, dated number',
          'Inherited — it is the subject\'s own declaration, restated',
          'Established, provided the report was filed on time',
          'Inherited, but reliable because filing is legally required'
        ],
        key: 1,
        why: 'A legal duty to file changes the penalty for lying; it does not make the filing an independent observation. An assessment that rests on it without saying so is a declaration wearing an assessment\'s clothes.' },
      { q: '"Commercial imagery shows cooling capacity consistent with roughly twice the declared load." What does this line let you claim?',
        options: [
          'That the declaration is false',
          'That an inconsistency exists between an independent observation and the declaration',
          'That undeclared training is occurring',
          'Nothing, until the operator responds'
        ],
        key: 1,
        why: 'An anomaly is a lead, not a finding. The progression the track uses is anomaly → verification lead → suspected non-compliance, and each arrow needs its own work.' },
      { q: 'Your brief goes to an appropriations staffer with four minutes. Which omission does the most damage?',
        options: [
          'The methodology section',
          'The list of sources consulted',
          'The confidence grade attached to the central finding',
          'The historical background'
        ],
        key: 2,
        why: 'Compression is where confidence grades die. A finding that arrives at a decisionmaker with its uncertainty stripped is worse than no finding, because it will be acted on as if it were confirmed.' }
    ]
  },

  /* ---------------------------------------------------------- 2.0 */
  /* ---------------------------------------------------------- 2.3 */
  'ex-signals': {
    type: 'mcq',
    title: 'Reading a signature',
    lede: 'What a footprint tells you, what it costs to read, and what the arithmetic does to your caseload.',
    source: 'Outline 2.2 / 2.3 — fakeable vs. hard-to-fake evidence; detection statistics.',
    questions: [
      { q: 'Which of these is hardest for an operator to falsify?',
        options: [
          'Declared workload labels',
          'Account identity and beneficial ownership',
          'Sustained power draw and cooling capacity',
          'Retained access logs'
        ],
        key: 2,
        why: 'Labels, identities and logs are all artifacts the operator produces. Power and cooling are physical consequences of the activity, observable by parties who never touch the operator\'s systems — which is why the intelligence layer carries weight the cloud layer cannot.' },
      { q: 'A screen flags 1% of sites as suspicious. It is run against roughly 500 candidate sites, of which about 2 are genuinely undeclared. Roughly what does the analyst\'s queue look like?',
        options: [
          'About 5 alerts, most of them real',
          'About 5 alerts, most of them false',
          'About 50 alerts, evenly split',
          'About 2 alerts, both real'
        ],
        key: 1,
        why: 'A 1% false-positive rate across ~500 sites is ~5 false alerts, against at most 2 true ones. A screen that sounds excellent produces a queue that is mostly noise — which is why 2.3 treats base rates as a first-class skill and not an aside.' },
      { q: 'National collection produces a credible tip about an undeclared facility. What does that establish?',
        options: [
          'Treaty non-compliance, once the tip is corroborated internally',
          'A verification lead — grounds for a proportionate next step, not a finding',
          'Nothing usable, since sources and methods cannot be disclosed',
          'A finding, if the collecting state is a party to the agreement'
        ],
        key: 1,
        why: 'Intelligence identifies; the regime resolves. Generating a credible lead and establishing a violation are separate acts with separate standards, and collapsing them is how a regime spends its legitimacy.' }
    ]
  },

  /* ---------------------------------------------------------- 3.1 */
  'ex-evasion': {
    type: 'grid',
    title: 'Swiss-cheese board',
    lede: 'For each evasion route, mark the layers that still see something. Then name the hole that remains when every layer works as designed.',
    source: 'Outline 3.1 — evasion catalog and the Swiss-cheese model.',
    cols: [
      { id: 'hw', label: 'Hardware' },
      { id: 'cloud', label: 'Cloud' },
      { id: 'intel', label: 'Intelligence' },
      { id: 'human', label: 'Human' }
    ],
    rows: [
      { id: 'proxy', t: 'Proxy organizations' },
      { id: 'smuggle', t: 'Smuggled hardware' },
      { id: 'threshold', t: 'Threshold gaming' },
      { id: 'exfil', t: 'Weight exfiltration' },
      { id: 'repurpose', t: 'Repurposed infrastructure' },
      { id: 'falsereport', t: 'False reporting' },
      { id: 'tamper', t: 'Tampering with the machinery' },
      { id: 'distributed', t: 'Distributed training' }
    ],
    prompt: 'Pick the route with your emptiest row. Write the residual blind spot: what stays invisible even if every layer you marked works perfectly?',
    reveal: {
      title: 'Two things to check against your board',
      body: [
        '**Weight exfiltration bypasses the compute layer entirely.** The artifact already exists; nothing about the training run is still available to observe. If your row has hardware and cloud firing there, ask what exactly they would be firing on.',
        '**Common-mode failure.** Two layers that both rest on the same declaration are one layer. Scan your marks for cells that only fire because the operator filed something — those are not independent evidence, however many columns they occupy.',
        'A route with an empty row is not necessarily undetectable; it may mean the detector sits outside these four layers entirely — in finance, in export records, or in a party that is not in your regime at all.'
      ],
      note: 'Ungraded by design: your board is the artifact, so the reveal gives you two things to check it against rather than a score.'
    }
  },

  /* ---------------------------------------------------------- 4.0 */
  /* ---------------------------------------------------------- 2.2 */
  /* The module gate. Twelve items over the unit's five retention claims —
     R1 the provider is a third party in the room, R2 metadata shows scale and
     often type, R3 identity is the anchor, R4 a declaration is a claim, R5 the
     layer ends at the cloud's edge — sampled 2/3/2/3/2. Distractors are the
     unit's own named misconceptions, so a wrong pick names the error.
     Keys come from the readings, not from an outline; see the source line. */
  'ex-cloud-check': {
    type: 'mcq',
    title: 'What the cloud layer establishes',
    lede: 'Twelve questions over the whole unit. One at a time, commit before the answer, retake as often as you like.',
    source: 'Module 2.2 readings — Heim et al. 2024 (CC BY 4.0); Egan & Heim 2023 (CC BY 4.0); Moon et al., RAND RR-A3686-1, 2025.',
    questions: [
    { q: 'A provider compares a customer’s declared “inference service” against observed utilization and traffic patterns, and flags the mismatch. Which intermediary role is it exercising?',
      options: [
        'Verifier',
        'Enforcer',
        'Securer',
        'Record keeper'
      ],
      key: 0,
      why: 'Actively checking claims against observation is verification. Enforcement would be restricting access; record keeping is storing the data; securing is defending models and infrastructure from attackers.' },  /* R1 */
    { q: 'What structural fact makes cloud providers useful to a compute-governance regime?',
      options: [
        'Providers can decompile and inspect customers’ model code',
        'Providers are government agencies with regulatory powers',
        'Frontier AI development mostly runs on rented machines, putting a third party between developer and hardware',
        'AI models can only run on cloud infrastructure'
      ],
      key: 2,
      why: 'The leverage is the landlord position. Providers do not read customer code by default; they are private firms; and self-owned compute exists — which is precisely the regime’s edge.' },  /* R1 */
    { q: 'Which signal belongs to the resource-use layer of provider visibility?',
      options: [
        'The customer’s declared purpose for the compute',
        'The customer’s registered business address',
        'The number of accelerators allocated and the hours they ran',
        'A timestamped security alert in the logs'
      ],
      key: 2,
      why: 'Allocation and hours are resource use. An address is identity; an alert is an operational record; a declared purpose is a customer claim — not observed telemetry at all.' },  /* R2 */
    { q: 'Accelerators held at near-constant peak utilization for three weeks, with minimal traffic to the outside internet, most plausibly indicate…',
      options: [
        'Ordinary web hosting',
        'A user-facing inference service',
        'A large training run',
        'Nothing — metadata cannot distinguish workload types'
      ],
      key: 2,
      why: 'Training is sustained and closed-loop; inference follows user demand and fluctuates. Metadata cannot *prove* — but it strongly suggests, which is the whole point of the layer.' },  /* R2 */
    { q: 'Roughly what does 10²⁶ operations of training compute look like in hardware terms?',
      options: [
        'About 100 accelerators for one day',
        'A laptop-class workload',
        'About 60,000 top-line accelerators running for about 90 days',
        'A single GPU running for a weekend'
      ],
      key: 2,
      why: 'Per Heim et al.’s estimate (H100-class chips at ~34% utilization). The teaching point: threshold-scale runs are physically enormous — hard to mistake and hard to hide inside a covered data center.' },  /* R2 */
    { q: 'KYC schemes require verifying beneficial owners. Who is a beneficial owner?',
      options: [
        'The provider’s own shareholders',
        'Any company that appears in the ownership chain',
        'The employee who signs the compute contract',
        'A human who ultimately owns ≥25% of the entity or exercises substantial control, however many layers deep'
      ],
      key: 3,
      why: 'The requirement pierces layered entities to reach natural persons — exactly what shell structures try to prevent. A signatory or an intermediate company is not the end of the chain.' },  /* R3 */
    { q: 'Why is suspending cloud access a sharper enforcement tool than chip export controls?',
      options: [
        'Cloud access is point-in-time and revocable even mid-run; exported chips cannot be recalled',
        'Because export controls do not apply to AI chips',
        'Because suspension destroys the customer’s data',
        'Because suspension requires no legal authority at all'
      ],
      key: 0,
      why: 'The asymmetry is revocability. Suspension still needs legal authority; export controls very much apply to AI chips — they just act only at the moment of shipment; and suspension does not destroy anything.' },  /* R3 */
    { q: 'Under the EO 14110 template, cluster registration and training-run declaration use…',
      options: [
        'A total for clusters and a capability rate for runs',
        'The same number for both obligations',
        'A capability rate for clusters (10²⁰ OP/s, fast interconnect) and a total for runs (10²⁶ OP)',
        'No numeric thresholds at all'
      ],
      key: 2,
      why: 'Standing infrastructure is measured by what it *could* compute per second; a specific run by what it *did* compute in total. Two hooks, two numbers.' },  /* R4 */
    { q: 'A customer runs 58 separate two-day jobs from 58 accounts, each just under the reporting threshold, passing model checkpoints from one to the next. What is the regime’s core failure here?',
      options: [
        'The provider’s meters failed to record the compute',
        'Thresholds are evaluated per account and nothing links the accounts — no single reading trips the line',
        'The threshold number was simply set too high',
        'The jobs were too small to constitute training'
      ],
      key: 1,
      why: 'Every job was metered correctly, and the total plainly exceeded the threshold — the failure is aggregation and identity linkage, not measurement, and not the particular number chosen.' },  /* R4 */
    { q: 'Which added capability would most directly catch a training run fragmented into sub-threshold slices across accounts?',
      options: [
        'A stricter statement-of-purpose requirement on each account',
        'Cross-account identity linkage plus aggregate compute accounting across the linked accounts',
        'Raising the FLOP threshold',
        'Publishing the threshold more prominently'
      ],
      key: 1,
      why: 'Fragmentation is beaten by re-aggregation: link the accounts (KYC’s cross-account job), then total the compute. Purpose statements are just more customer claims; raising the threshold widens the gap; publicity changes nothing.' },  /* R4 */
    { q: 'Which pathway is entirely outside cloud-layer oversight?',
      options: [
        'Training on a self-owned, disconnected cluster',
        'An undeclared training run at a covered provider',
        'A mislabeled workload at a covered provider',
        'A run booked through a reseller at a covered provider'
      ],
      key: 0,
      why: 'Undeclared, mislabeled, and reseller-booked runs still happen on covered machines and leave telemetry with the provider. A self-owned cluster has no provider — the hardware and intelligence layers must find it.' },  /* R5 */
    { q: 'Which item is customer-controlled — and therefore the weakest evidence without corroboration?',
      options: [
        'The provider’s billing record for the account',
        'The declared purpose on the account application',
        'Measured interconnect traffic between nodes',
        'The count of accelerators allocated to the account'
      ],
      key: 1,
      why: 'Purpose is whatever the customer types. Billing, traffic, and allocation are the provider’s own meters — the customer cannot easily rewrite them.' },  /* R5 */
    ]
  }

};
