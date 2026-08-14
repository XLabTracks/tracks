/* Learner's guide: glossary and review prompts, one section per module.

   Every definition is a restatement of a line that already exists in the
   course content — `unit` names where. Nothing here introduces a claim the
   track does not already make, and no term is defined twice: a term belongs
   to the module that introduces it, and later modules extend it in prose
   rather than re-listing it.

   Review prompts are atomic on purpose — one term or one distinction each.
   A prompt whose answer is "several things" is two prompts. */

window.GLOSSARY = {
  modules: [
    {
      n: 0,
      terms: [
        { t: 'Misuse, misalignment, structural risk', unit: '0.1',
          d: 'The three buckets any AI risk scenario sorts into. Which bucket a scenario sits in decides who the actor is, and therefore what a regime would have to watch.' },
        { t: 'The response menu', unit: '0.1',
          d: 'Trust, punishment, transparency, verification — the four available responses to the ASI problem. The first three each depend on the fourth under pressure.' },
        { t: 'Security dilemma', unit: '0.4',
          d: 'Why unilateral restraint fails even among actors who all want the same outcome: slowing down costs relative position, so nobody can afford to be first.' },
        { t: 'Theory of victory', unit: '0.2',
          d: 'The definition of success written down before the machinery is designed: sufficient for what claim, against whom, over what horizon — and how you would know it had failed.' },
        { t: 'Timeliness', unit: '0.2',
          d: 'Required detection speed, derived from the policy window rather than from what a mechanism happens to manage. Detection after the fact is not detection.' },
        { t: 'Securitization', unit: '0.3',
          d: 'The move that takes an issue out of normal politics and into security. It has costs, and the track argues the case against before the case for.' },
        { t: 'Managed access', unit: '0.3',
          d: 'The CWC precedent: constrain what an inspector may see, record or remove, rather than what they may conclude. The institutional answer where the cryptographic one does not exist.' },
        { t: 'Credible commitment', unit: '0.4',
          d: 'A promise with consequences attached — sunk cost, tied hands, or mechanical enforcement. Without one of the three, the promise carries no information.' },
        { t: 'Two-level game', unit: '0.4',
          d: 'Negotiation constrained simultaneously by the table abroad and ratification at home; win-sets and veto players are the vocabulary for the second table.' }
      ],
      review: [
        'Which of the four responses on the menu can operate without detection?',
        'A mechanism detects violations reliably within eighteen months. Name the question you have to ask before calling it adequate.',
        'State the security dilemma in one sentence, without using the word "trust".',
        'What does managed access constrain, and what does it deliberately leave alone?',
        'Give the three components of a theory of victory.'
      ]
    },
    {
      n: 1,
      terms: [
        { t: 'Goal, rule, claim', unit: '1.0',
          d: 'Three different sentences inside one policy: the outcome it exists to produce, the text that binds an actor, and the proposition a verifier must establish true or false.' },
        { t: 'Proxy risk', unit: '1.0',
          d: 'Every drawn line measures something adjacent to the thing you care about. Compute is a proxy for capability; the failure is not the proxy but treating it as the goal.' },
        { t: 'Goodhart\'s Law', unit: '1.0',
          d: 'When a measure becomes a target, it ceases to be a good measure. A lab that trains under the compute threshold on better algorithms presents a verifiable claim while undermining the goal the threshold stood in for.' },
        { t: 'Total training FLOP', unit: '1.0',
          d: 'The operative threshold unit in current practice. Reference points: the EU AI Act at 10^25 and the rescinded EO 14110 at 10^26.' },
        { t: 'Compliance burden vs. verification burden', unit: '1.0',
          d: 'Two separate ledgers carried by different actors. A regime cheap to comply with can be ruinous to verify, and the reverse.' },
        { t: 'Actors, objects, activities, conditions', unit: '1.1',
          d: 'The four moving parts of any provision. Naming them is what converts legal text into something a verifier can act on.' },
        { t: 'Falsifiability', unit: '1.1',
          d: 'What observation would show this rule was broken? A provision with no answer cannot be verified, whatever mechanisms are attached to it.' },
        { t: 'The five moves', unit: '1.2',
          d: 'Cooperate, defect, conceal, exaggerate, free-ride. Actors are not fixed types; the same actor plays differently under a different incentive structure.' },
        { t: 'Chokepoint', unit: '1.2',
          d: 'A stage where the supply chain narrows enough for a control to physically attach. Chokepoints make verification possible; distribution makes coordination necessary.' },
        { t: 'Upstream / downstream', unit: '1.3',
          d: 'Whose claims a document silently inherits, and who has to act on what it says. An assessment resting on the subject\'s own declaration is a declaration in an assessment\'s clothes.' },
        { t: 'Confidence grades', unit: '1.3',
          d: 'Confirmed, plausible, unresolved, unsupported. The grade has to survive compression — a finding that reaches a decisionmaker stripped of its grade will be acted on as confirmed.' }
      ],
      review: [
        'Separate the goal, the rule and the claim in a provision you have read this week.',
        'Name the proxy in a compute threshold, and the behaviour it invites.',
        'Which of the four provision parts usually carries the seam an evader works?',
        'A report cites the operator\'s own filing. What must the report say about it?',
        'List the four confidence grades in order of strength.'
      ]
    },
    {
      n: 2,
      terms: [
        { t: 'The verifier\'s paradox', unit: '2.0',
          d: 'Enough access to confirm compliance, and not enough to enable espionage. Both are hard requirements, and they are in tension rather than in balance.' },
        { t: 'Mechanism taxonomies', unit: '2.0',
          d: 'Five ways to sort a portfolio: by layer, by access required, by policy goal, by lifecycle stage, by adversary robustness. No single layer covers the claim, which is why there is a taxonomy at all.' },
        { t: 'Identify, measure, restrict', unit: '2.1',
          d: 'Three different things hardware can do to compute. They need different mechanisms, different cooperation, and they support different treaty claims.' },
        { t: 'Remote attestation', unit: '2.1',
          d: 'A chip proving what it is and what it is running, to a party that is not holding it. Its governance question is who controls the keys, standards and updates.' },
        { t: 'Inverted threat model', unit: '2.1',
          d: 'Consumer security assumes the owner is the party being protected. Governance assumes the owner is the party being caught — which reverses most of the assumptions built into secure boot and TEEs.' },
        { t: 'Proof-of-learning', unit: '2.1',
          d: 'Establishing that a declared training run produced a given model, via checkpoints and probabilistic recomputation. Fragile, and spoofed in the literature.' },
        { t: 'Paperwork regime', unit: '2.2',
          d: 'The cloud layer\'s characteristic failure: when the filing becomes the thing measured, the actor optimises the filing. Self-reporting without independent cross-check is not a verification layer.' },
        { t: 'Hard-to-fake evidence', unit: '2.2',
          d: 'Physical consequences of the activity — power draw, cooling, interconnect use, procurement, visible buildout — as against artifacts the operator produces: labels, identities, logs.' },
        { t: 'Intelligence identifies, the regime resolves', unit: '2.3',
          d: 'National collection has found undeclared facilities routine safeguards missed. Generating a credible lead and establishing non-compliance are separate acts with separate standards.' },
        { t: 'Base rate', unit: '2.3',
          d: 'How rare the thing you are screening for actually is. Against a large haystack, an excellent-sounding alarm rate produces a queue that is mostly false positives.' },
        { t: 'National technical means', unit: '2.3',
          d: 'A party\'s own collection capabilities, recognised by treaty — usually alongside noninterference and no-deliberate-concealment provisions.' },
        { t: 'Challenge inspection', unit: '2.4',
          d: 'A short-notice inspection triggered by suspicion rather than schedule, negotiated against managed-access limits on what the inspector may see or take.' },
        { t: 'Survivable channel', unit: '2.4',
          d: 'A reporting route an insider can actually use: confidential, protected against retaliation, and connected to someone authorised to act. Without all three, the human layer is decorative.' },
        { t: 'Access mapping', unit: '2.4',
          d: 'A source is useful for what their position let them perceive, retrieve or infer — not for their job title. Map who could see what before weighing whether to believe anyone.' },
        { t: 'Coordinated deception', unit: '2.4',
          d: 'The five ways a human report is shaped rather than false: fabricated allegation, selective truth, management staging, rehearsed cover story, and suppression.' },
        { t: 'Black-box, gray-box, deep', unit: '2.4',
          d: 'The three audit access levels. Lower levels rely on what the company exposes and cannot catch skilful deception; deeper levels can, and are harder to obtain.' },
        { t: 'Collect, adjudicate, respond', unit: '2.4',
          d: 'The verifier\'s three steps, with three different standards. Obtaining evidence, deciding whether it meets the agreement\'s standard, and choosing what happens next are separate jobs.' },
        { t: 'Cross-mechanism corroboration', unit: '2.4',
          d: 'A second account only counts if it was generated by a different process with different failure modes. Evidence is stronger when the streams do not share a source of error.' }
      ],
      review: [
        'State the verifier\'s paradox without using the word "balance".',
        'Which of the five taxonomies would you sort by if the question is "what can this survive?"',
        'Distinguish identifying compute from measuring it.',
        'Why does secure boot behave differently in a governance setting than in a consumer one?',
        'Name three pieces of evidence an operator cannot easily falsify.',
        'A screen flags 1% of 500 sites and 2 are real. Roughly how much of the queue is noise?',
        'What are the three properties a reporting channel needs before the human layer counts?',
        'Name the two human mechanisms that carry most of the historical weight.',
        'A source has a financial motive. What does that change about the weight of their report, and what does it not change?',
        'What can a black-box audit establish, and what absence claim can it never support?',
        'Name the three steps a verifier takes with evidence, and say why they should not sit in one body.',
        'Why is a second person repeating an account weaker corroboration than a power-allocation log?'
      ]
    },
    {
      n: 3,
      terms: [
        { t: 'Verifier-aware actor', unit: '3.0',
          d: 'An evader who knows how the regime works and designs against it. From Module 3 onward this is the default assumption, not the hard case.' },
        { t: 'Detection, attribution, delay', unit: '3.0',
          d: 'Three separate adversary goals: never be seen; be seen but not pinned; be seen and pinned too late to matter. The third is the one designers forget.' },
        { t: 'Threshold gaming', unit: '3.1',
          d: 'Moving capability without moving the measured number — algorithmic efficiency and "effective compute" creep against a fixed FLOP line.' },
        { t: 'Weight exfiltration', unit: '3.1',
          d: 'The route that bypasses the compute regime entirely: the artifact already exists, so there is no training run left to observe.' },
        { t: 'Swiss-cheese model', unit: '3.1',
          d: 'Overlapping imperfect layers. The design question is not whether a layer has holes but whether the holes line up — and what stays uncovered when every layer works as designed.' },
        { t: 'Common-mode failure', unit: '3.1',
          d: 'Two layers resting on the same declaration are one layer wearing two hats. The count of layers is not the count of independent evidence streams.' },
        { t: 'Inspector capture', unit: '3.1',
          d: 'An attack on the machinery rather than around it: the verifier, not the evidence, is the thing compromised.' }
      ],
      review: [
        'Which evasion route makes the compute layer irrelevant, and why?',
        'Give an example of a common-mode failure across two named layers.',
        'Distinguish evading attribution from delaying response.',
        'What does an empty row on the Swiss-cheese board actually tell you?',
        'Name the attack that targets the verifier rather than the evidence.'
      ]
    },
    {
      n: 4,
      terms: [
        { t: 'Residual risk', unit: '4.0',
          d: 'What is still uncovered after the best single mechanism. Its size is the argument for layering — not a preference for redundancy.' },
        { t: 'Sufficiency', unit: '4.0',
          d: 'Enough for what claim, against whom, over what horizon. A regime sufficient for a three-month pause is a different object from one sufficient for indefinite constraint.' },
        { t: 'The four feasibility dimensions', unit: '4.1',
          d: 'Technical, political, verification effectiveness, durability — kept separate because they move independently, and a mechanism can be strong on one and fatal on another.' },
        { t: 'Durability', unit: '4.1',
          d: 'How long a judgment survives. Some beliefs in this field carry an as-of date, and saying which is part of the analysis rather than a caveat on it.' },
        { t: 'Load-bearing vs. corroborating', unit: '4.2',
          d: 'What the regime\'s claim actually rests on, against what merely raises confidence. In this track hardware and intelligence carry; cloud and human corroborate.' },
        { t: 'The cold pitch', unit: '4.2',
          d: 'Your recommendation delivered to a decisionmaker who has not read your work and did not ask for it. The framing moves per audience; the claim and its confidence grade do not.' }
      ],
      review: [
        'State your capstone\'s sufficiency claim in one sentence: claim, adversary, horizon.',
        'Which feasibility dimension killed the BWC verification protocol?',
        'Which two layers are load-bearing in this track\'s stack, and which two corroborate?',
        'What is allowed to change between the three versions of a cold pitch, and what is not?',
        'Name one belief in your design that carries an as-of date.'
      ]
    }
  ]
};
