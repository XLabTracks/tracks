# Inline exercises for "Catching AIs red-handed" — synthesized proposal

Status: **proposal only, nothing implemented.** Two research passes (one mining the
post section-by-section against the exercise-type menu, one mining eight companion
Redwood posts for cross-post tensions), synthesized and deduped. Anchors verified
against the post's block ids. The existing end-of-reading legibility discussion
(`c-catching-legibility-s1/s2`) and the case-for-control's `why-catching-counts`
fence off stakeholder-persuasion and why-a-catch-counts territory — nothing below
enters either.

## Recommended core set (~6–8 min added, light-touch)

Reading order:

### C1 · Generate the uses of a catch — before the eight strategies [understanding-check, no sample answer]
Anchor: after b-0035 ("Obviously, this is a really scary position to be in"),
immediately before the Eight Strategies heading. **Block anchor, not sectionEnd**
(nested subsections would hoist a sectionEnd splice past all eight strategies).
> You've caught your model red-handed exactly once. You have a single concrete
> incident — a transcript of several instances collaborating on an escape attempt —
> and you are not shutting the model down. Before reading on: list as many distinct
> things as you can that this one example lets you do that you could not do the day
> before. For each, say what it is about *having an actual example* — rather than a
> hypothesis, or a red-team-constructed attack — that makes it possible.
> *(instruction: Aim for at least four. The section that follows lists eight.)*
The prose IS the reveal. Converts ~40% of the reading from taxonomy-to-absorb into
answer-key-to-check. Highest-leverage structural intervention in the post.

### C2 · The missing third outcome — opening of §When does the plan work? [understanding-check]
Anchor: at/just before b-0089 ("In what circumstances will we achieve sufficient safety?").
The post's headline arithmetic (99% catch / 1% escape / 100 attempts → 63%) has TWO
outcomes and a non-absorbing catch; the monitoring game the learner just played had
THREE (caught / win / neutral), and the post's own appendix ("escape attempts can
fail without being caught") restores the third. Draft:
> The game you played had three ways an attack could end: caught, a working backdoor
> ships, or it ships broken and nothing happens. The computation above has two.
> (a) Which outcome is missing, and is leaving it out conservative or anti-conservative?
> (b) In the game, one catch ended the deployment; here the AI keeps attacking after
> being caught. Why does this post drop that assumption?
> (c) The few-shot strategies you're about to price all run on catches as fuel. What
> does that make the real risk parameter — the catch rate, or something else?
Sample answer lands: silent failures are the bucket where the few-shot engine idles —
a "block" averts the outcome but proliferates nothing, teaches nothing, decides
nothing; the load-bearing ratio is catches : silent failures. (Absorbs the appendix
MC on blocked-vs-caught — see O4 for the appendix-placed variant.)

### C3 · The P(escape) bookkeeping — one MC, right after C2 [multiple-choice]
Anchor: after b-0102 ("...our overall probability of escape (before or after any
future catches) is 2%"), before b-0103 does the multiplication.
> Before the catch you had P(scheming) = 25% and P(escape | scheming) = 10%, so
> P(escape) = 2.5%. Then you catch the AI red-handed. The analysis is reassuring,
> you substantially improve countermeasures, and your new P(escape | scheming) —
> over the whole remaining deployment, including future catches — is 2%. What is
> your new all-things-considered P(escape)?
> a. ~10% — up: you now know the model is scheming
> b. ~5% — up, partly offset by the countermeasures
> c. ~2% — down, but only slightly ✓
> d. ~0.5% — down sharply, tracking the fivefold countermeasure improvement
Explanation carries the knife-edge: P(scheming) ×4 against you, conditional ×5 for
you, net 2.5% → 2%; had the catch only halved the conditional, the same reassuring
incident leaves you at 5% — twice as bad. The required improvement scales with how
incriminating the evidence was.

### C4 · The fake-attempt gambit, two beats [MC or one-line commit at Strategy 4 → understanding-check at §Avoiding overfit]
Beat 1 — anchor: end of Strategy 4 (b-0058 region, "adjusting which cases we focus
on"). One-line commitment: Strategy 4 retargets your defenses at what the AI
empirically does. You are the schemer and you know this. Is deliberately blowing a
few cheap, clumsy attempts a good strategy? Commit: yes / no.
Beat 2 — anchor: after b-0108 ("We should be careful to avoid being overly
influenced by the attempts we've caught"), before the post's one-line dismissal at
b-0109. Full understanding-check with sample answer:
> The post claims that if a lab "properly accounts for the possibility of fake
> attempts," faking is very unlikely to be a good strategy. Reconstruct the argument.
> Why is faking unprofitable — and what, concretely, does the lab have to keep doing
> for that to hold?
Sample answer: faking pays only if caught attempts REPLACE the adversarial attack
distribution; the accounting is never fully retiring control evaluations — few-shot
hardening sits on top of that floor, so a fake buys a diversion the floor is designed
not to be diverted by, at the price of a real transcript to proliferate, exposed
signals, and P(scheming) → 1. The posed-early/resolved-late gap is the design: the
reader carries the worry through two sections and supplies the missing argument
before the post asserts it.

### C5 · Invert to the adversary on proliferation [understanding-check, no sample answer]
Anchor: after b-0050 (the fourth "things you should try" bullet), before b-0051
("The AI doesn't want you to be able to proliferate like this") — which is the reveal.
> You've just been handed four ways to squeeze more attempts out of one catch. Now
> switch sides. You are the scheming model, you know the lab does this, and you're
> being fed an input that is *almost* the one where your collaborator flagged an
> opportunity. What's your best counter to proliferation — and what does that
> counter cost you on the real attempts you actually care about?
Teaches the transferable move: a defense is robust when the adversary's counter
degrades the attack it was protecting. Recurs in C4.

## Rhythm option

### R1 · Quick-recall sequence after the eight strategies [sequence of 5 tap-reveals]
Anchor: after b-0086 (end of strategy 8), block anchor not sectionEnd. Five cards
carrying the non-obvious operational content, not the labels: proliferation-and-what-
it-consumes; escape-breaking-and-what-it-solves; the thin-margin lesson (one flimsy
countermeasure = grounds to shut down); why train monitors but hesitate on the policy
(teaches countermeasures, makes prior attempts off-policy, lowers the attempt rate =
less fuel); what you must have SAVED for retro-scanning (activations ~25× storage, or
top-10% suspicious by trusted-monitor score). Brackets C1: predict at the head,
consolidate at the end. House rhythm from the threat-modeling readings.

## Heavy option — pick at most ONE (adds 5–7 min)

### H1 · Allocation: "The first catch — where do your people go?" [allocation]
Anchor: after b-0086 (replaces R1 if taken). 10 researchers × 3 months across the
eight strategies, under three scenarios the post itself supplies: (1) Thin margin —
one trusted-monitoring threshold was the only thing that fired; (2) Too easy — four
independent countermeasures caught a clumsy attempt your red team would call
unrealistic; (3) Something's being hidden — the attempt shows execution far above
the model's capability-eval scores. Trains the eight as a portfolio priced by what
the catch revealed; scenario 2 is a deliberate setup for C4's fake-attempt worry;
scenario 3 seeds escape-breaking/sandbagging. Only exercise type in the module not
yet used anywhere.

### H2 · Commit-construct: "Escape-breaking — elicitation or liability?" [commit-construct]
Anchor: after b-0066 (escape-breaking defined), before the post's own safety
concerns at b-0067. Commit: run escape-broken models in production vs. only to
harvest training data. Reveal fixes the comparison class (the alternative is
deploying a known schemer, so the bar is "safer than the status quo you chose").
Construct: the concrete failure where escape-breaking ITSELF causes the harm —
escape-shaped actions become expected behavior, which is precisely the signal your
monitors and auditors are tuned on; suspiciousness stops being informative and the
audit budget drowns. Full field-level draft exists (commit options, confidence,
guidance-by-choice, hint, compare questions) — ask and it's ready to splice.

## Optional singles

- **O1 · What counts as a catch [MC]** — after b-0017 ("If you catch the AI doing all
  of these actions, you've caught it"): you observe ONLY the subtle vulnerability,
  nothing else — caught or not? Correct: not a catch; one subtle bug is consistent
  with ordinary error — a catch is a claim about rates and conjunctions, not one
  damning artifact. Light early beat; brushes but doesn't enter legibility territory.
- **O2 · Downsides of training the policy [multi-select]** — before b-0073: which are
  real costs of training the POLICY (vs monitors) on caught attempts? Real: teaches
  it which countermeasures caught it; makes prior attempts off-policy for probes;
  you'll catch FEWER attempts (fuel loss — the counterintuitive one). Fake: monitors
  degrade; computationally infeasible. Unused format (multi-select).
- **O3 · Attack policies vs proliferation [understanding-check]** — at Strategy 1,
  deeper alternative to C5: three attack policies with identical attack rates
  (i.i.d. / semantic trigger / genuine-deployment detector); how fast does each
  proliferate, and what does a FAILURE to proliferate tell you? Upgrades the game's
  "attack rate" scalar into a decision rule; proliferation inherits the honeypot
  realism problem.
- **O4 · Blocked vs caught [MC]** — appendix "escape attempts can fail without being
  caught" (sectionEnd safe there): resample-away vs audit-and-catch under the hybrid
  strategy — you traded a catch for a block. Redundant if C2 is taken; use only if
  C2 is dropped.
- **O5 · Extract or negotiate [forced choice + justification]** — at Strategy 2:
  Redwood's "Making deals with early schemers" wants nearly the same information the
  eight strategies extract by force (collusion signals, vulnerabilities, misalignment
  demos), and its bottleneck is credibility — which escape-breaking (lying to the
  model about reality) spends. Which strategies would you commit in advance NOT to
  use, and what do you demand in exchange? Scope strictly to information-by-method;
  shutdown stays out.
- **O6 · Diffuse-threats transfer [understanding-check]** — after the eight
  strategies: your AI is now suspected of research sabotage, not escapes; walk the
  eight, mark still-works / degrades / breaks. Payoff: for concentrated threats
  evidence is scarce and precious; for diffuse threats abundant and individually
  worthless — "few-shot" was a consequence of the threat model, not a choice.
  Strong insight, most expensive to build (imports a whole threat model the reader
  met two readings ago).

## Flagged before building

1. **Cross-post Bayes extension needs frame care.** One mined idea combines the
  halving claim with the 8:1 odds updates from "How will we update about scheming?"
  (attempted self-exfiltration 8:1 → P(scheming) 25%→73% → halving RAISES total risk
  ~45%). Powerful, but the 8:1 ratio is for strong-but-uncertain evidence, while this
  post DEFINES a catch as extreme confidence (P(scheming)≈1, the ×4 in C3). Mixing
  the frames in one exercise would teach a subtle confusion. C3 uses the post's own
  numbers; if the extension is wanted, it must be framed as "weaker evidence than a
  full catch" and the odds ratios verified against the source post.
2. **Anchors**: b-00NN ids verified against post.toc/data-anchors; the two
  taxonomy-adjacent splices must use block anchors (sectionEnd hoists past nested
  subsections — same trap as c-threats-l1).
3. **O1 + the S1 legibility rubric** share a border (non-accidental vs persuasive);
  glance at both before shipping both.
