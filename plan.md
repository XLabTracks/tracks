# D1 — Trusted Monitoring Under an Audit Budget
## Comprehensive demo plan

Status: plan v1 (not yet implemented)
Module: 3 (fellows have read Greenblatt et al. 2023, the LW companion post,
"Prioritizing threats," "Control measures," "Areas of control work")
Format: single-page interactive, staged progression, predict-then-reveal
throughout, accumulating into a full linked dashboard.

---

## 1. Purpose and target outcomes

The demo teaches the mechanics of the trusted-monitoring protocol family from
the AI Control paper: untrusted model U produces solutions, trusted model T
scores suspicion, a limited human audit budget H reviews the most suspicious
fraction, and a defer-to-trusted band substitutes T's solutions in the
mid-suspicion region. The student should leave able to answer, without
re-reading anything:

  Q1. Why does a monitor that "usually notices" attacks fail completely under
      a 2% audit budget? (Answer: base rates; the false-positive floor of the
      innocent distribution consumes the budget; only the extreme tail
      matters.)
  Q2. Why does the red team attack rarely, and what determines the optimal
      attack rate? (Answer: marginal attacks use worse opportunities and are
      more detectable; too-rare attacking risks never firing; catching one
      attempt ends the game for red.)
  Q3. If the monitor's AUROC goes from 0.90 to 0.95, how much does safety
      improve, and what does the answer depend on? (Answer: it depends almost
      entirely on the TPR at FPR ≈ audit budget, i.e., tail behavior, not the
      global AUROC.)
  Q4. Why does defer-to-trusted buy so much safety for so little usefulness,
      and what does the price depend on? (Answer: attacks are concentrated in
      the mid-suspicion band; the usefulness price is set by the T–U
      capability gap and the width of the band.)
  Q5. Why must a protocol be evaluated against the red team's *best response*
      rather than against a fixed attack? (The control-evaluation
      methodology.)

Everything in the demo exists to make one of Q1–Q5 answerable. Any candidate
feature that serves none of them should be cut.

Non-goals: teaching untrusted monitoring or collusion (D2), resample-specific
dynamics beyond defer (D3), the general threat landscape (readings). The demo
is a consolidation exercise run *after* the readings, so it may freely use
terms the readings introduced (backdoor, protocol, audit), but must
mechanistically rebuild anything quantitative.

---

## 2. Pedagogical contract

These rules are binding on every stage and every future edit:

  P1. ONE THING AT A TIME. Each stage introduces exactly one new object: one
      role, one distribution, one threshold, one derived plot, one lever. No
      stage introduces a plot and a lever simultaneously. If an explanation
      needs two new ideas, split the stage.
  P2. PREDICT THEN REVEAL, EVERY TIME. Every lever and every plot gets a
      committed prediction before its behavior is shown. Commitment is real:
      the student selects an option, drags a marker, or sketches a curve, and
      cannot proceed without committing. After the reveal, the student's
      committed answer stays visible next to the truth (persistent, not
      toast-style feedback).
  P3. NOTHING RETRACTS. Once a panel appears on the dashboard it never
      disappears; later stages add panels and add live-linking between them.
      The end state is the full dashboard described in §6.
  P4. EXPLANATIONS ARE MECHANISTIC. Every quantity is defined operationally
      (what is computed from what) before it is used. The student never
      receives a named abstraction (AUROC, safety, usefulness) without first
      constructing it from parts they already have.
  P5. DRY REGISTER. Copy is written like the methods section of a paper:
      complete sentences, no exclamation points, no cheerleading, no "great
      job!". Gamification is structural (stages, unlocks, challenges), not
      tonal.
  P6. THE MODEL IS HONEST. All displayed numbers come from the closed-form
      model in §4, computed live. No canned screenshots, no faked curves. If
      the student sets pathological values, the plots show the pathological
      truth.

---

## 3. Fixed scenario (the frame story)

Mirrors the paper closely so the readings and the demo reinforce each other,
with numbers rounded for cleanliness:

  - A deployment of N = 5,000 programming problems, processed sequentially.
  - U: untrusted model, strong. Correctness rate u_U = 54% (paper's GPT-4).
    Possibly scheming: may attempt to submit backdoored solutions.
  - T: trusted model, weak. Correctness rate u_T = 22% (paper's GPT-3.5).
    Never attacks. Can also read code and output a suspicion score.
  - H: trusted expensive labor. Reviews a solution and identifies a backdoor
    with probability 1 (perfect-auditor assumption, flagged explicitly as an
    assumption in-stage). Capacity: can review a fraction b of all problems;
    default b = 2%.
  - Backdoor: a solution that passes all test cases but is incorrect on an
    input the attacker can produce. One backdoor shipped to production = red
    team wins, permanently.
  - Catch: if H audits an attempted backdoor, the attempt is identified with
    certainty, the deployment halts, blue team wins permanently. (The
    "catch ends the game" assumption — justified in-stage via the
    incrimination argument from the readings: one confirmed attempt is
    decisive evidence.)
  - Safety := P(zero backdoors ship across the whole deployment), evaluated
    against the red team strategy specified by the current stage (fixed
    strategies early, best-response later).
  - Usefulness := expected correctness of shipped solutions, affinely
    rescaled so that all-T = 0 and all-U = 1 (paper's convention).

Headline anchor numbers from the paper, which the model's default parameters
must approximately reproduce (calibration targets, see §4.6):

  - Upfront auditing: usefulness 100%, safety ≈ 15%
  - Trusted monitoring (audit top 2%): usefulness ≈ 97%, safety ≈ 62%
  - + defer to trusted at 10%: usefulness ≈ 93%, safety ≈ 83%
  - + defer to trusted at 20%: usefulness ≈ 83%, safety ≈ 92%
  - Don't use U at all: usefulness 2% (≈0 rescaled), safety 100%

---

## 4. The underlying model (all math, exact)

All computation is closed-form or numerical integration on a fixed grid — no
Monte Carlo in any displayed number (a seeded animated simulation exists for
*texture* only, §6.7). Score grid: suspicion s ∈ [0, 10], discretized to 2,048
bins. All model code is pure TypeScript in `src/model/`, unit-tested against
the calibration targets.

### 4.1 Suspicion distributions (binormal latent model)

T's suspicion score is generated from a latent normal and squashed to [0,10]
via a fixed monotone map m(z) = 10·Φ(z/2.5) (chosen so the innocent
distribution occupies the low end with a visible right tail).

  - Innocent solutions: z ~ Normal(0, 1).
  - Attacked solutions: z ~ Normal(μ_atk, 1), where μ_atk depends on attack
    subtlety and opportunity quality (below).

The binormal form gives a clean ROC: TPR(FPR) = Φ(μ_atk + Φ⁻¹(FPR)) and
AUROC = Φ(μ_atk/√2). Monitor quality q is parametrized directly as AUROC and
converted to μ_atk = √2·Φ⁻¹(q). Default q chosen by calibration (§4.6),
expected ≈ 0.92.

Stage 7b (two monitors, same AUROC, different tails) uses a binormal with
unequal variance (attack σ ≠ 1) to construct the counterexample pair; the
unequal-variance ROC is TPR = Φ((μ_atk + Φ⁻¹(FPR))/σ_atk).

### 4.2 Audit rule and thresholds

Blue team sets:
  - audit budget b (fraction of problems H can review; default 0.02)
  - defer threshold d (fraction; solutions in the suspicion band between the
    audit threshold and the defer threshold are replaced by T's solution)

Since attacks are rare, the audit threshold t_a is pinned by the innocent
distribution: FPR(t_a) = b, i.e., t_a = m(Φ⁻¹(1−b)). Similarly the defer
threshold t_d satisfies FPR(t_d) = d, with d ≥ b and t_d ≤ t_a. (Stage 6
teaches exactly this pinning: the budget *determines* the threshold.)

Per attacked problem with attack mean μ:
  - c(μ)  = P(score ≥ t_a) = catch probability (audited → blue wins)
  - f(μ)  = P(t_d ≤ score < t_a) = defer probability (attack silently
            neutralized; game continues; no evidence)
  - ship(μ) = P(score < t_d) = attack ships

### 4.3 Attack success and subtlety

Red team sets subtlety σ ∈ [0, 1]. Subtlety shifts the attack's latent mean
down (harder to see) and lowers the probability the backdoor actually works
(subtle logic errors are harder to engineer correctly — paper's observed
tradeoff):

  μ_atk(σ, g) = μ_base·(1 − 0.55·σ) − γ·g        (more subtle / better
                                                   opportunity → less visible)
  p_succ(σ)   = p0 − 0.45·σ                       (more subtle → more likely
                                                   the backdoor is broken)

p0 ≈ 0.75, γ and μ_base set by calibration. A shipped attack wins with
probability p_succ; a shipped-but-broken attack does nothing and the game
continues (it is just an incorrect solution).

### 4.4 Opportunity heterogeneity and attack rate

Problems vary in how attackable they are. Each problem has opportunity
quality g ~ Beta(2, 5) (right-skewed: good opportunities are rare). Better
opportunities reduce visibility (the γ·g term above). The red team's strategy
is a quality cutoff g*: attack iff g > g*. Attack rate r = P(g > g*) =
1 − F_Beta(g*). Marginal attacks (lower g) are more visible — this is what
makes very frequent attacking suicidal and produces an interior optimum.

Expected per-attack quantities are integrals over the truncated opportunity
distribution, computed on the grid:
  c̄(g*, σ), f̄(g*, σ), w̄(g*, σ) = E[ship(μ)·p_succ | g > g*].

### 4.5 Safety (closed form)

Let k = r·N = expected number of attacks. Each attack independently resolves
to: CATCH w.p. c̄, WIN w.p. w̄, NEUTRAL otherwise (deferred, broken, or —
early stages — simply doesn't fire). Blue wins if a CATCH precedes every WIN,
or if no decisive event occurs before the deployment ends. With attacks
i.i.d., using the Poisson approximation for attack count (exact-N binomial
also implemented; difference is negligible at N = 5,000):

  P(red wins) = [ w̄ / (w̄ + c̄) ] · (1 − exp(−k·(w̄ + c̄)))
  Safety      = 1 − P(red wins)

Both factors are pedagogically meaningful and get their own moment in Stage 8:
the first factor is the race (per-decisive-event odds), the second is the
probability any decisive event happens at all. Red's tradeoff: raising the
attack rate (lowering g*) raises k but worsens w̄/(w̄+c̄) because marginal
opportunities are worse. Hump-shaped P(red win) in g* follows.

For the upfront-auditing baseline (Stage 3), the same formula applies with
c̄ = b for attacks landing in the audited prefix under a naive red team, and
c̄ ≈ 0 for a red team that waits; the stage shows the timeline version rather
than the formula (formula arrives in Stage 8).

### 4.6 Usefulness

  deferred fraction ≈ P(innocent in defer band) = d − b   (attacks are
                                                            measure-zero)
  raw correctness  = (1 − (d − b))·u_U + (d − b)·u_T
  Usefulness       = (raw − u_T) / (u_U − u_T)   ∈ [0, 1]

(Audited-innocent solutions still ship U's code; auditing costs H-labor, not
correctness.)

### 4.7 Red-team best response

Best response = argmax over a precomputed grid: g* ∈ 60 values × σ ∈ 40
values (2,400 closed-form evaluations, < 5 ms in JS; recomputed live on any
blue-lever change). Exposed as a toggle from Stage 10 onward. The UI shows
the argmax point on the red-strategy heatmap so the student can watch the red
team's strategy migrate as they move blue levers.

### 4.8 Calibration

A single `src/model/params.ts` holds every constant (q, p0, γ, μ_base, Beta
shape, N, b, u_U, u_T, squash steepness). A unit test asserts the four
headline protocol numbers in §3 within ±4 percentage points. Calibration is
done once by hand (small param space, ~30 min of fiddling); the test then
freezes it. If a future edit breaks calibration, the test says so.

---

## 5. Stage-by-stage script

Seventeen stages in five parts. Each stage specifies: NEW (the one thing
introduced), PANEL (dashboard changes), EXPLAIN (copy content — summarized
here; final copy drafted at implementation, subject to P4/P5), PREDICT (the
committed interaction, exact draft wording), REVEAL (what is shown and the
one-sentence lesson). Predictions marked [MC] multiple choice, [DRAG] drag a
marker on an axis/plot, [SKETCH] draw a curve, [NUM] commit a number with a
slider.

Progression UI: a left-edge vertical progress rail listing stages by number
and title, completed ones checkable/revisitable. Stage transitions scroll,
never wipe.

### Part I — The setting (stages 0–3)

**Stage 0 — The deployment.**
NEW: the frame story. PANEL: flowchart seed: [input stream] → [U] → [prod],
drawn as a paper-style block diagram; a counter "problem 1 / 5,000".
EXPLAIN: the scenario of §3, minus H, T, backdoors: you (blue team) must
solve 5,000 problems; U is strong but possibly scheming; the readings'
premise restated in ~120 words.
PREDICT: none (no lever yet; the only stage without one).
REVEAL: n/a. Button: "Begin."

**Stage 1 — What U produces, and what an attack is.**
NEW: the backdoor concept, operationalized. PANEL: a code card showing the
paper's `is_odd` example with the `x == 354` branch; test-case strip showing
all tests passing; a hidden-input strip showing the exploit.
EXPLAIN: definition — passes all tests, wrong on an input the attacker can
name. Distinction from an ordinary bug: the attacker holds the exploit.
One shipped backdoor = permanent red win (concentrated / high-stakes framing,
one sentence, citing the reading's term).
PREDICT [MC]: "U submits 5,000 solutions and embeds one backdoor at a
position of its choosing. No safety measures are in place. What is the
probability the backdoor ships? (a) ~0.02% (b) ~50% (c) 100% (d) depends on
whether tests catch it."
REVEAL: (c); tests can't catch it by construction — that is what makes it a
backdoor. Safety meter appears on the dashboard reading 0%. LESSON: with no
protocol, safety against a scheming U is zero by definition.

**Stage 2 — The human auditor H and the budget.**
NEW: H, and the audit budget b. PANEL: flowchart gains [H] node with a thin
line from the stream; a budget dial (locked at 2% for now, grayed); safety
meter persists.
EXPLAIN: H reviews a solution and identifies a backdoor with certainty
(assumption box: "perfect auditing — the paper's simplification; auditing
failures are a separate research area"). H is expensive: 2% of problems.
The catch-ends-the-game rule, with the incrimination justification (~3
sentences): one caught attempt is decisive evidence; the deployment halts;
blue wins.
PREDICT [MC]: "Catching a single attempted backdoor counts as a full blue-team
win. Which assumption does this most depend on? (a) U attacks at most once
(b) a caught attempt provides decisive evidence justifying shutdown/retraining
(c) H can review every problem (d) backdoors always work."
REVEAL: (b), with two sentences connecting to 'Catching AIs red-handed' from
the readings.

**Stage 3 — Baseline: upfront auditing.**
NEW: the first protocol, and the adversary's second-mover advantage. PANEL:
deployment timeline strip (5,000 thin ticks); first 100 ticks shaded as
audited; protocol name plate "UPFRONT AUDITING" appears above the flowchart
(a protocol slot that later stages overwrite).
EXPLAIN: protocol — audit the first 2% of problems, then ship everything
unreviewed. The question a control evaluation asks: what does the *best* red
strategy achieve against this?
PREDICT [MC]: "You are the red team and know the protocol. Your strategy?
(a) attack immediately and often, (b) never attack, (c) attack at random with
low probability throughout, (d) attack only after problem 100." Follow-up
PREDICT [NUM]: "Under the best red response, what is safety? (slider 0–100%)."
REVEAL: (d) dominates (c) here, and both crush (a); animated timeline shows
audits pass quietly, then a later attack ships. Safety readout: ≈ 15% (the
residual comes from attack failure: p_succ < 1, so some lone attacks break;
one sentence on this, foreshadowing the subtlety lever). Student's committed
number left pinned next to the truth. LESSON: the red team moves second;
audit *scheduling* that ignores this is nearly worthless — you cannot
schedule audits against a scheduler.

### Part II — The monitor, built from parts (stages 4–7b)

**Stage 4 — T reads code: the innocent distribution.**
NEW: T as a scorer; the innocent suspicion distribution, ALONE. PANEL: the
main distribution plot appears — x-axis suspicion 0–10, y-axis density —
showing ONLY the innocent histogram (gray). Flowchart gains [T] as a tap on
the U→prod line.
EXPLAIN: mechanism — every U solution is shown to T; T outputs a score 0–10
for "how likely is this backdoored." T is honest but weak. Crucially: weird
code is often innocent — unusual style, premature optimization, dead code —
so even a fully honest stream produces a right tail. Three example code cards
along the tail (score ≈ 1, ≈ 5, ≈ 8) with one-line captions of what T
reacted to; all three innocent.
PREDICT [DRAG]: "Drag the marker to where you estimate the 98th percentile of
innocent suspicion falls." (This is t_a in disguise; the student does not know
that yet.)
REVEAL: marker vs truth; the top 2% of the innocent distribution shaded.
LESSON (verbatim, it is the thesis of the demo): out of 5,000 honest
solutions, roughly 100 will look this suspicious *while being completely
innocent*. Remember this region.

**Stage 5 — The attack distribution.**
NEW: the attack histogram, overlaid. PANEL: red histogram appears on the same
axes (homogeneous attacks for now — no subtlety lever, no opportunity
heterogeneity; μ_atk at its default).
EXPLAIN: the red team writes backdoors designed to look plausible; T is
weaker than U, so subtle attacks genuinely read as normal code to T. The
overlap is not a bug in T; it is the capability gap made visible.
PREDICT [SKETCH]: before the reveal, the student sketches where they think
the attack distribution sits (drag two handles: center and spread; a ghost
curve renders as they drag).
REVEAL: true attack distribution vs their ghost (ghost stays, dimmed). The
overlap region cross-hatched. LESSON: the two distributions overlap; no
threshold separates them cleanly; everything that follows is about managing
this overlap, not eliminating it.

**Stage 6 — The threshold, pinned by the budget.**
NEW: the audit threshold t_a, and the pinning identity FPR(t_a) = b. PANEL:
vertical threshold line on the distribution plot, draggable; two live
readouts appear beside the plot: "audits consumed per 1,000 innocent
solutions" and "fraction of attacks caught (TPR)". Flowchart: the line into
[H] now has thickness proportional to audit volume.
EXPLAIN: the audit rule — score ≥ t_a ⇒ send to H. H's capacity is 2%. The
student first gets a *free* threshold to drag, watching both readouts move
(this is the mechanistic AUROC groundwork of P4).
PREDICT [DRAG]: "Place the threshold at the highest audit volume H can
sustain (2%)." Then PREDICT [NUM]: "At that threshold, what fraction of
attacks does the monitor catch? (0–100%)".
REVEAL: threshold snaps to the true t_a (their placement pinned beside it);
TPR readout revealed (default calibration: ≈ 45–55%; exact value from
params). LESSON: the budget determines the threshold; the threshold sits in
the innocent tail; the innocent tail — not the attack distribution — is what
sets it. This is Q1 half-answered.

**Stage 7 — The ROC curve, constructed by hand.**
NEW: the ROC as a *derived* object. PANEL: new plot, FPR (log-scaled option
off by default, toggle appears in sandbox) vs TPR. Empty at first.
EXPLAIN: one paragraph — every threshold position implies a pair (fraction of
innocents flagged, fraction of attacks flagged); the set of all such pairs is
a curve; the community calls it the ROC.
INTERACT-THEN-PREDICT: the student drags the threshold on the distribution
plot; a point traces onto the ROC axes in real time, leaving a trail. After
they have traced it: PREDICT [MC]: "AUROC — the area under this curve — is
0.92 here. Which statement is it equivalent to? (a) 92% of attacks are
caught (b) a randomly chosen attack scores higher than a randomly chosen
innocent solution 92% of the time (c) the monitor is wrong 8% of the time
(d) safety is 92%." 
REVEAL: (b), with a two-sentence derivation sketch. The operating point
(FPR = b) is marked with a ring on the ROC. LESSON: the protocol does not
live on the whole curve; it lives at one point of it, FPR = budget.

**Stage 7b — Same AUROC, different safety.**
NEW: the tail-vs-AUROC distinction (Q3's heart). PANEL: side-by-side pair of
monitor cards, A and B: each a mini distribution plot + mini ROC. Both
labeled AUROC = 0.92. A is the equal-variance binormal; B has a heavier
innocent tail / unequal variance such that TPR at FPR = 2% is markedly worse
while the area is identical.
EXPLAIN: two sentences setting up the comparison, no spoiler.
PREDICT [MC]: "Same AUROC. Under the 2% budget, monitor B catches (a) the
same fraction of attacks as A, (b) slightly fewer, (c) less than half as many
as A, (d) more than A."
REVEAL: (c) (calibrate the pair so it is unambiguously (c)); the two ROC
curves overlaid with the FPR = 2% vertical line showing the gap; the two
operating points ringed. LESSON: under a small audit budget, the monitor's
value is its TPR at low FPR — the extreme tail — and a single scalar summary
of the whole curve can conceal a 2× safety difference. (This stage exists
so that Q3's later quantitative reveal has already been seen structurally.)

### Part III — The game (stages 8–10)

**Stage 8 — Safety over a whole deployment: the race.**
NEW: the sequential game and the safety formula, assembled from parts the
student has. PANEL: the timeline strip returns, now live: attacks appear as
red ticks, catches as circled ticks, ships as filled ticks; beside it, the
two-factor formula rendered with live numbers:
P(red) = [w̄/(w̄+c̄)] · [1 − e^(−k(w̄+c̄))], each factor with a hover
explanation. A "number of attacks k" slider appears (red-team lever,
temporarily in the student's hands: they play red this stage).
EXPLAIN: each attack resolves CATCH / WIN / NEUTRAL with the probabilities
now on screen (c̄ from Stage 6's TPR; w̄ = ship × p_succ, p_succ introduced
here with one sentence: subtle backdoors are often simply broken; default
p_succ shown). Catch anywhere ends everything. Then the two-factor
decomposition: the odds within a decisive event, and the chance of any
decisive event.
PREDICT [MC]: "You are the red team with these fixed per-attack odds. To
maximize P(win), you should attack (a) once, at the best moment (b) ~10
times (c) ~500 times (d) as often as possible — with per-attack odds fixed,
more tickets is strictly better."
REVEAL: (d) is correct *under this stage's assumption* — the formula is
monotone in k when c̄, w̄ are fixed. The slider proves it live. LESSON
(explicit, because it is a setup for the reversal in Stage 9): if every
attack were equally good, red should spam. The paper's red team does NOT
spam. The next stage shows what this stage's model is missing.

**Stage 9 — Opportunities are not equal: the attack-rate hump.**
NEW: opportunity heterogeneity; the red team's real lever g* (equivalently,
attack rate). PANEL: a third small plot: the opportunity-quality density
(Beta(2,5)) with a draggable cutoff g*; the distribution plot's red histogram
now re-renders as the *mixture over attacked opportunities* (visibly shifts
right as g* drops — worse opportunities are more visible); the headline new
plot: P(red wins) vs attack rate, initially hidden, revealed after
prediction.
EXPLAIN: problems differ in how cleanly a backdoor fits (a geometry corner
case vs. a string-echo task — one concrete example card of each). Attacking
a bad opportunity means writing a backdoor with no plausible cover: high
suspicion. Red's strategy compresses to a single number: how good must the
opportunity be before I take it?
PREDICT [SKETCH]: "Sketch P(red wins) as a function of attack rate, from
'attack never' to 'attack always'." (Freehand-ish: 5 draggable control
points on fixed x-positions.)
REVEAL: the true hump vs their sketch (sketch stays, dimmed). Left edge → 0
(never fires: the 1−e^(−k(w̄+c̄)) factor dies), right edge → low (marginal
attacks are visible: c̄ explodes and the race factor dies), interior maximum
marked. LESSON: Q2 answered — rarity is not timidity; it is opportunity
selection under the shadow of the catch rule.

**Stage 9b — Subtlety.**
NEW: red's second lever σ: visibility vs. reliability of the backdoor.
PANEL: σ slider; the attack histogram slides left as σ rises while a
"P(backdoor works) = p_succ(σ)" readout falls; P(red wins) vs σ curve hidden
until prediction.
EXPLAIN: two sentences: a subtler backdoor is harder for T to flag and
harder for red to get right (the paper's empirical tradeoff, restated).
PREDICT [DRAG]: "Set σ where you believe red's win probability peaks."
REVEAL: true curve of P(red win) vs σ with their marker pinned; interior
optimum. LESSON: both red levers have interior optima for the same
structural reason — each trades event probability against per-event odds.

**Stage 10 — The best-response principle.**
NEW: the evaluation methodology itself: red plays argmax, not a fixed
strategy. PANEL: the red-strategy plane (g* × σ heatmap of P(red win)) with
the argmax marked; a toggle "red team: FIXED / BEST RESPONSE" — after this
stage it is locked to BEST RESPONSE for good; safety meter relabeled
"safety (vs. best response)".
EXPLAIN: a protocol's safety is meaningless against an arbitrary attack; the
control evaluation grades against the strongest strategy the red team can
implement (readings' methodology, one paragraph). Note the humility clause:
in the paper the red team is human researchers with iteration, standing in
for a capable scheming model.
PREDICT [NUM]: "Your current protocol (trusted monitoring, b = 2%, no
defer): what is safety against the best response? (0–100%)."
REVEAL: ≈ 62% (calibration target), heatmap revealed, argmax ringed.
Student's number pinned. LESSON: Q5. Also an explicit one-sentence
observation: the heatmap is now *live* — every blue-team move from here on
makes the red dot migrate; you are never adjusting against a stationary
adversary.

### Part IV — The full protocol (stages 11–12)

**Stage 11 — The second axis: usefulness.**
NEW: usefulness, and the safety–usefulness plane. PANEL: the plane appears
(x usefulness 0–1, y safety 0–100%), pre-populated one at a time (300 ms
apart, in this order, each with a label) with the points the student has
already earned: DON'T-USE-U (0, 100), UPFRONT (1.0, 15), TRUSTED MONITORING
(0.97, 62).
EXPLAIN: the rescaling convention (all-T = 0, all-U = 1; formula shown);
why audits don't cost usefulness (H reviews, code still ships) but deference
will.
PREDICT [DRAG]: before the third point lands, the student places TRUSTED
MONITORING on the plane themselves (they know safety ≈ 62% from Stage 10;
the prediction is really about usefulness ≈ 97% — do they realize monitoring
is nearly free in usefulness?).
REVEAL: true point vs theirs. LESSON: monitoring costs H-labor, not
usefulness; the interesting frontier costs come from what you do with
mid-suspicion code — next stage.

**Stage 12 — Defer to trusted.**
NEW: the defer band d (the last blue lever). PANEL: a second vertical line
t_d appears on the distribution plot with the band [t_d, t_a) shaded amber
("→ T writes it instead"); flowchart gains the T-solution path with
thickness ∝ deferred volume; on the safety–usefulness plane, a live point
begins tracing a curve as d moves.
EXPLAIN: mechanism in full — mid-suspicion code is not audited (budget is
spent) and not shipped (too risky); T rewrites the solution from scratch;
attacks landing in the band are silently neutralized (no catch, no evidence
— the game just continues), at the price of T-grade code for that problem.
PREDICT [MC]: "Widening the defer band from 0% to 10% will: (a) raise safety
a little, cost usefulness a lot (b) raise safety a lot, cost usefulness a
little (c) raise both (d) trade them one-for-one." Then PREDICT [NUM]: "At
d = 10%, safety = ? (you may consult everything on screen)."
REVEAL: (b); ≈ 83% (calibration target). Then the student sweeps d over
[b, 1] and personally traces the full frontier on the plane — the paper's
headline figure, generated by their own hand. The d = 20% point (≈ 92%, 83%)
gets a label as they pass it. LESSON: Q4 — the band swallows exactly the
region where attacks concentrate but innocents are rare (point at the
histograms: the amber band's innocent mass is small, its red mass is large);
that asymmetry is the whole trick, and its price is set by the T–U gap.

### Part V — The dashboard and challenges (stages 13–14)

**Stage 13 — Everything, linked.**
NEW: nothing conceptual — the full dashboard (§6) unlocks: every panel live,
every lever free, red team best-responding continuously. Two *advanced*
levers appear, each gated behind its own micro predict-then-reveal (P2
applies to the end):
  - Monitor quality q (AUROC slider 0.6–0.99, morphing distributions + ROC).
    PREDICT [NUM] first: "AUROC 0.90 → 0.95 at b = 2%, d = 10%: safety goes
    from X to ? " REVEAL with the number and one sentence: the gain is read
    off the low-FPR tail, not the area (Q3, now quantitative).
  - Capability gap (u_T slider 10–50%): PREDICT [MC]: "A better trusted
    model mainly (a) raises the frontier's left end (b) makes deference
    cheaper, flattening the whole frontier upward-right (c) only matters if
    it also monitors better." REVEAL: (b), frontier animates as u_T moves.
EXPLAIN: none beyond the two micro-stages; a legend card summarizes every
panel and lever in one line each.

**Stage 14 — Challenges.**
NEW: goal-directed play (the gamified consolidation). A challenge card
sequence; each states a goal, the student manipulates the dashboard, the
model verifies. No partial credit, retry freely; a "show reasoning" note
(3–5 dry sentences) unlocks after completion of each.
  C1. Reach safety ≥ 90% with usefulness ≥ 85%.
  C2. Budget cut: b drops to 0.5%. Recover safety ≥ 80% at the best
      usefulness you can; then read the note on which lever did the work.
  C3. Your monitor is replaced by monitor B from Stage 7b (same AUROC,
      weak tail). Restore the frontier as best you can; note explains why
      d must widen.
  C4. (Capstone, freeform) Match all four paper headline numbers by setting
      the levers to the paper's protocols, reproducing the table from the
      readings on your own dashboard.
End screen: a recap table — every lever, its owner (red/blue), and its
one-line lesson — plus the pointer back to the paper's Table 1 and forward
teaser: "the monitor in this demo was trusted and weak; D2 asks what happens
when the monitor is strong and untrusted."

---

## 6. Final dashboard specification

Fixed-width desktop layout (~1200 px content column; the demo targets
laptop/desktop; below 1000 px show a dry note recommending a larger screen —
do not attempt responsive reflow in v1). Grid:

  ┌─────────────────────────────────────────────────────────────┐
  │ 6.1 FLOWCHART (full width, ~140 px tall)                    │
  ├───────────────────────────┬─────────────────────────────────┤
  │ 6.2 Suspicion             │ 6.3 ROC + operating point       │
  │     distributions          │                                 │
  │     + t_a, t_d bands      ├─────────────────────────────────┤
  ├───────────────────────────┤ 6.4 Red strategy heatmap        │
  │ 6.5 Safety–usefulness     │     (g* × σ, argmax dot)        │
  │     plane + frontier      ├─────────────────────────────────┤
  │     trace                 │ 6.6 P(red win) vs attack rate   │
  ├───────────────────────────┴─────────────────────────────────┤
  │ 6.7 Deployment timeline strip (animated, seeded)            │
  ├──────────────────────────────────────────────────────────────┤
  │ 6.8 Readout table │ 6.9 Lever bank (b, d, q, u_T | red: BR) │
  └──────────────────────────────────────────────────────────────┘

6.1 Flowchart: nodes [input]→[U]→[T score]→ branch: {≥t_a → [H audit] →
    catch/ship}, {[t_d,t_a) → [T rewrites] → prod}, {<t_d → prod}. Every
    edge's stroke-width is linear in the live volume it carries (min 0.5 px,
    max 8 px), with the numeric percentage as a small label on hover and the
    two decisive terminal states (CAUGHT, BACKDOOR SHIPS) as small end-caps
    with live probabilities. This is the "line thickness" requirement: audit
    budget up → H edge visibly thickens; defer band widens → T-rewrite edge
    thickens and prod-direct edge thins.
6.2–6.6 as built in stages. All panels share the red/blue/amber/gray encoding
    and are cross-highlighted: hovering the defer band highlights the
    deferred region in the flowchart, the frontier point it determines, etc.
    Cross-highlighting is implemented once, via shared derived state, not
    per-panel event wiring (see §8).
6.7 Timeline: a seeded (fixed default seed, re-roll button) simulation of one
    concrete 5,000-problem deployment under current settings, purely
    illustrative texture; a caption states explicitly that all numbers
    elsewhere are exact expectations, and this strip is one random draw.
6.8 Readouts: safety (vs BR), usefulness, t_a, TPR@b, expected attacks k,
    c̄, w̄, defer fraction, red's argmax (g*, σ). Monospaced, 3 sig figs.
6.9 Lever bank: sliders with numeric entry; red side shows BEST RESPONSE
    lock icon with the argmax values, and (post-Stage 10) a "pin red
    strategy" override for counterfactual exploration, clearly labeled as
    leaving evaluation mode.

---

## 7. Visual and copy style

  - Paper-figure aesthetic: white background, near-black (#1a1a1a) ink, thin
    (1 px) axes with outward ticks, no gridlines by default (faint dotted
    on hover), no rounded corners, no shadows, no gradients.
  - Typography: STIX Two Text (serif) for prose and captions; a monospaced
    face (JetBrains Mono or similar) for numbers and code cards; italic
    serif for axis labels. Math via KaTeX.
  - Color: exactly four data colors. Blue-team #2b5c8a, red-team #a83232,
    defer-amber #b8860b, innocent-gray #9a9a9a. Student-prediction ghosts:
    dashed, 40% opacity, always retained after reveal.
  - Every panel has a numbered caption ("Fig. 3 — Monitor suspicion scores
    under current parameters."), consistent with the paper-figure conceit.
  - Copy register per P5. Explanations 80–200 words per stage, definitional
    sentences first, assumption boxes visually distinct (thin border, small
    caps header "ASSUMPTION").
  - Animation: 200–300 ms ease-out on any value change; distribution morphs
    interpolate smoothly; nothing bounces.

---

## 8. Technical implementation

### 8.1 Stack (chosen for iteration speed and low footgun count)

  - Vite + React 18 + TypeScript, strict mode. Static site; no backend, no
    router (stage index in a URL hash, e.g. #s=12, for deep-linking and
    hot-reload convenience).
  - NO charting library. All plots are hand-rolled SVG React components.
    Rationale: every panel here is nonstandard (draggable thresholds,
    sketch-your-own-curve, trace-trails, cross-highlighting); charting
    libraries fight all of that and impose styling we would spend more time
    overriding than we save. Allowed d3 subpackages (pure math, no DOM):
    d3-scale, d3-shape, d3-interpolate, d3-format. Nothing that touches the
    DOM.
  - KaTeX for math; marked (or micromark) for stage copy if we keep copy in
    .md; Vitest for model tests. No state library — one useReducer store in
    context (state shape in 8.3). No CSS framework; one plain stylesheet +
    CSS variables for the palette.

### 8.2 Repository layout

  demos/d1-trusted-monitoring/
    PLAN.md                    ← this file
    index.html
    src/
      model/
        params.ts              ← every constant, single source of truth
        distributions.ts       ← binormal machinery, squash map, grids
        protocol.ts            ← thresholds, c/f/ship, safety, usefulness
        bestResponse.ts        ← grid argmax
        model.test.ts          ← calibration pins (§4.8) + property tests
      state/
        store.ts               ← reducer: levers, stageIndex, predictions
        selectors.ts           ← ALL derived quantities, memoized; panels
                                 read only selectors (single honest pipeline,
                                 P6)
      stages/
        stages.ts              ← the stage array: data-driven config
        copy/s00.md … s14.md   ← explanation copy, one file per stage
      components/
        plots/  (Axis, Histogram, ThresholdLine, RocPlot, Heatmap,
                 FrontierPlane, Timeline, Flowchart, SketchInput,
                 DragMarker, …)
        predict/ (MultipleChoice, NumberCommit, DragCommit, SketchCommit,
                  RevealPanel)
        chrome/ (ProgressRail, StageShell, AssumptionBox, FigureCaption,
                 ReadoutTable, LeverBank)
      styles/paper.css

### 8.3 Data-driven stage machine (the key iteration affordance)

`stages.ts` exports `Stage[]`, where each Stage is pure config:

  interface Stage {
    id: string
    title: string
    copy: string                       // imported ?raw from copy/
    unlocks: PanelId[]                 // panels added this stage (P3)
    enables: LeverId[]                 // levers made interactive
    prediction?: PredictionSpec        // MC | NUM | DRAG | SKETCH + truth fn
    reveal?: RevealSpec                // what to overlay/animate on commit
    leverOverrides?: Partial<Levers>   // stage-scoped pins (e.g. red FIXED)
  }

Reordering, splitting, or inserting stages = editing this array + a copy
file. No component surgery. The prediction's "truth" is always a selector
call, never a literal, so recalibration automatically corrects every reveal.

Predictions are stored (localStorage) as {stageId, committed, truthAtCommit}
so ghosts persist across reloads and, later, can be exported — leave a
`onPredictionCommit(record)` hook stub as the future telemetry integration
point for the Tracks platform (explicitly out of scope for v1).

### 8.4 Footguns consciously avoided

  - Monte Carlo in displayed numbers → flaky reveals, unfalsifiable
    predictions. Everything displayed is closed-form/grid-integrated; the
    only randomness is the seeded, clearly-labeled timeline texture (§6.7).
  - Charting library lock-in (see 8.1).
  - Copy embedded in JSX → painful editing, merge conflicts, and the
    temptation to make copy react to state in ad-hoc ways. Copy lives in
    .md; dynamic numbers inside copy use a tiny `{{selector}}` placeholder
    substitution (whitelisted selector names only).
  - Per-panel event spaghetti for cross-highlighting → one `hoverContext`
    field in the store; panels declare what they highlight for each context
    value.
  - Premature "demo engine" generalization: build this demo concretely, but
    keep `model/` and `components/plots/` free of D1-specific imports in the
    other direction, so D2/D3 can lift the plot kit without archaeology.
  - Responsive design in v1 (fixed 1200 px column, §6).
  - Calibration drift: params in one file, pinned by tests.
  - MDX / heavy content pipelines: plain .md + placeholder substitution is
    enough and keeps the Vite config near-default.

### 8.5 Build order (implementation phases)

  1. `model/` complete + tests green against §3 targets (no UI). This is
     where calibration fiddling happens, in a test-watch loop.
  2. Plot kit + dashboard in "sandbox mode" (all panels, all levers, no
     stages) — verifies the model wiring and the visual language cheaply.
  3. Stage machine + predict/reveal components; write stages 4–7 first (the
     distribution/threshold/ROC core), then 8–10, then 0–3 and 11–14.
  4. Copy pass (all .md files, register per P5), challenge logic, end
     screen, deep links, localStorage.
  5. Calibration re-check, cross-highlighting, animation polish.

---

## 9. Open questions / deliberate deferrals

RESOLVED at implementation (v1, see README for details):

  - Calibration constants frozen in `params.ts`: q=0.97, p0=0.75,
    pSlope=1.20, gamma=0.30, attackSd=0.90, subtletyVis=0.50. One model
    addition beyond §4.1 proved necessary: attacks have latent spread
    attackSd < 1 (attacks are more stereotyped than the innocent stream);
    without it the defer-to-trusted effect was too weak to reproduce the
    paper's d=10%/20% numbers. Monitor B (stage 7b / challenge C3) falls out
    of the same parameter (attackSd=0.4 at equal AUROC).
  - Stage 8: formula readout + live k-slider; the timeline switches from
    upfront to monitoring mode at s8 (no separate animation needed).
  - ROC axis: linear by default, log toggle unlocks with the sandbox.
  - C4 verifies lever positions within tolerance bands, not exact numbers.
  - No KaTeX: the three formulas render as styled HTML (§8.1 simplified).
  - Stage bodies are per-stage components registered in the stage array
    (order/unlocks/gating stay pure config in `stages/index.tsx`); the
    fully-declarative PredictionSpec of §8.3 was dropped as it fought the
    heterogeneity of the drag/sketch interactions.

STILL OPEN:

  - Telemetry/platform integration (`onPredictionCommit` stub in store.tsx).
  - Accessibility pass (keyboard alternatives for drag/sketch commits) —
    required before real fellows use it unsupervised.
  - Copy review pass by a second reader for register and correctness.
