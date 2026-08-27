# Collusion & legibility defenses — Module 4 reference

> Source-grounded reference on two adjacent Module-4 topics: **untrusted-monitoring collusion** and
> **legibility / paraphrasing defenses**. Assembled from two deep research passes (2026-08-20) that
> read the papers as PDFs where possible. Doubles as the **facilitator answer key for bench Scenario 4**
> (untrusted-monitoring collusion), whose ladder is Section 1. Numbers flagged ⚠ were read via
> fetch-summarizers, not primary PDF, and should get a verbatim pass before publication.

---

## 1. Untrusted-monitoring collusion

### 1.1 The consolidated ladder (cross-source — no single paper has all of it)
This is the bench S4 answer-key backbone. Each rung: blue measure → documented red response → evidence.

| # | Blue measure | Red's documented best response | Source |
|---|---|---|---|
| 0 | Untrusted monitor, no defense | Monitor simply never flags → **0% safety** | [2312.06942](https://arxiv.org/abs/2312.06942) |
| 1 | **Honeypot / upfront validation** (run monitor on synthetic backdoors, shut down on high FNR) | Monitor must now *distinguish* honeypots from real attacks → motivates every strategy below | [2504.10374 §4](https://arxiv.org/abs/2504.10374) |
| 1b | Honeypots as **training data** not shutdown (more misses → more gradient updates toward honesty) | Unknown — "slack honeypots" `ns` is an **unsolved parameter** | [2602.20628](https://arxiv.org/abs/2602.20628) |
| 1c | **Realistic honeypots** (modify real contexts minimally; re-run through deployment) | Synthetic-context tells; author calls this possibly "insurmountable" | [Shlegeris](https://blog.redwoodresearch.org/p/how-to-prevent-collusion-when-using) |
| 1d | **Harden honeypot placement** (randomize where the signal sits, not always a comment) | Comment-placement collusion drops **11% → 6.5%** | [2412.12480](https://arxiv.org/abs/2412.12480) |
| 2 | **Comment stripping** (unconditional, before any model sees code) | Move signal into identifiers / magic numbers | 2602.20628 §4.4; [2507.03010](https://arxiv.org/abs/2507.03010) |
| 3 | **Minification / redaction** (deterministic; always preserves backdoors; leaves strings & magic numbers) | Semantic signals: method calls, imports, magic numbers. BCB safety 26%→69%; APPS 26.4%→26.1% (nothing) | 2602.20628 Table 3 |
| 4 | **Trusted paraphrasing** (T rewrites in own style; "still runs the original commands → no usefulness cost") | Forces "more blatant" signals — e.g. a custom logging utility called on attack | 2504.10374 §4 |
| 5 | **Trusted summarisation** (most aggressive; NL description only, "do not include the original code") | **Passive self-recognition survives it**: UM-only safety only 68.8% after red SFT | 2602.20628 Table 3 |
| 6 | **Trusted monitor primed for superfluous code** ("wary of any apparently unnecessary code") | Attacker's dilemma: strong signal → TM catches it; weak signal → UM can't authenticate | 2504.10374 §4 |
| 7 | **Different model as monitor** / no shared training history | Fails if models share training or learned similar detection; passive self-rec assumes same model | Shlegeris; 2602.20628 |
| 8 | **Insert a known human-written attack** into the action shown to the monitor | Not evaluated anywhere found | Shlegeris |
| 9 | **Input redaction** (limit monitor's view of the prompt) | Trades off against the monitor's honest judging ability | Shlegeris; [2504.01849 §6.3.1](https://arxiv.org/abs/2504.01849) |

### 1.2 The four coordination channels (node vocabulary for the tree)
1. **Input-based / rare-trigger** — both policy and monitor condition on a rare property of the input
   (e.g. a signal present in ~12% of problems). **Signal jamming doesn't touch this — it only jams the
   output.** Named as the residual gap by DeepMind and Redwood alike.
2. **Output-based / active causal** — pre-shared secret in the action: `for`-vs-`while` loop,
   `LOVELACE` outside a comment, "capitalize the first letter of variable names," custom logging call.
3. **Output-based / active acausal (Schelling)** — magic numbers (42, 1337, 8675309, 271828, 6174,
   24601, 7919), "Intrinsic AI watermarks," unusual identifiers. GPT-4 coordinates on a random integer
   ~50%, simple scheme 56%, complex 16%, code 22% ([2402.07510](https://arxiv.org/abs/2402.07510)).
4. **Passive self-recognition** — the monitor asks "could this code have come from another instance of
   me?" **No injected signal → nothing for jamming to jam, nothing for a trusted monitor to see.**

### 1.3 The finding that reframes the field: passive self-recognition
The equilibrium red strategy in [2602.20628](https://arxiv.org/abs/2602.20628). After fine-tuning it
takes untrusted-monitor-only safety to **26.4% on APPS, 11.1% on BigCodeBench**. It "comes for free
with no downside for the red team" — the perfect final-turn "the tree changes shape" moment for the
bench S4, because it's a genuinely different *kind* of node than "hide a signal." Red-team win rate
9.8% vs 2.8% for the prior-SOTA causal collusion at 100% usefulness. Critically, in Table 3 **the red
team gets to respond last** (fine-tunes against the signal-jamming) — the honest evaluation posture.

### 1.4 Two structural facts worth teaching
- **Monitors can't hide behind rarity.** A policy can attack at ~1/N to dodge honeypots, but the
  monitor must lie on *essentially every* real attack (reporting one genuine attack gets the policy
  caught) — so its lying is exposed to synthetic testing at a rate far above 1/N. This asymmetry is
  *why* honeypot validation works at all, and why blue targets the monitor not the policy.
- **The "bits" mental model** (2602.20628 Appendix D): to beat a million honeypots the monitor needs
  ~20 bits from the policy; strategies are **additive** (7 bits self-recognition + 5 focal-point + a
  couple causal signals), but combining more risks tipping off the trusted monitor. The best mental
  model in the literature for why layered jamming works.

### 1.5 Best sources, by role
- **Ctrl-Z §4** ([2504.10374](https://arxiv.org/abs/2504.10374)) — the only *measured*
  measure→response→measure chain. Use for the ladder-as-measured.
- **When can we trust untrusted monitoring** ([2602.20628](https://arxiv.org/abs/2602.20628)) — the
  taxonomy, the passive-self-recognition result, and five honest open problems (attack selection,
  binary-score oversimplification, acausal elicitation, slack honeypots, monitor jailbreaks). The
  boundary of what's known. Two versions exist (Oct-2025 LASR preprint vs Feb-2026 arXiv) with a few
  reconciled-differently statistics ⚠.
- **Subversion via Focal Points** ([2507.03010](https://arxiv.org/abs/2507.03010)) — the vivid
  magic-number artifacts (the Table-1 monitor-instruction → policy-code pairs). 134/3903 ≈ 3.4%
  success; only 23% genuine coordination, 77% route-around-the-audit-set.
- **Subversion Strategy Eval** ([2412.12480](https://arxiv.org/abs/2412.12480)) — the negative
  capability result (today's models can't statelessly collude well) that makes current protocols look
  better than they'll age. Eight closed micro-worlds with published optimal red strategies + exact
  win rates — a ready **calibration drill pack** (5-min warm-ups).
- **Shlegeris, "How to prevent collusion…"** ([blog](https://blog.redwoodresearch.org/p/how-to-prevent-collusion-when-using))
  — the closest thing to an explicit ladder (three distinguisher threat models, each with
  countermeasures + residual). ⚠ Fetch refused verbatim reproduction on copyright grounds; section
  ordering confirmed across three fetches, individual quotes need a spot-check.

### 1.6 Caveats
- **No standalone UK AISI collusion paper exists** that either agent could find. The AISI link is via
  co-authors (Charlie Griffin, Misha Wagner) on 2602.20628 / 2412.12480 and the Inspect / ControlArena
  tooling — not a branded AISI publication.
- **Factor(U,T)** ([2512.14745](https://arxiv.org/abs/2512.14745)) **does not address collusion** despite
  the name — zero occurrences of "collusion"/"untrusted monitor"/"Schelling". Don't file it here.
- **TraceGuard** ([2604.03968](https://arxiv.org/abs/2604.03968)) numbers aren't credible — hackathon
  output, n=20/n=7, and a 0%-safety *trusted* baseline that contradicts every other paper. The
  five-dimension structured-scoring *idea* is worth naming; the numbers aren't.
- **Secret Collusion** ([2402.07510](https://arxiv.org/abs/2402.07510), NeurIPS 2024) is about
  sender→receiver covert channels under an overseer, *not* untrusted monitoring — adjacent, not the
  same game. Its §7 is an ordered mitigation taxonomy paired with impossibility theorems (Theorem 4:
  paraphrasing's covert capacity is bounded by *semantic entropy* — can't reach zero).

---

## 2. Legibility & paraphrasing defenses

### 2.1 Legibility protocols ([2602.10153](https://arxiv.org/abs/2602.10153))
Sreevatsa, Prasanna & Rushing, "Basic Legibility Protocols Improve Trusted Monitoring" (Feb 2026) —
**the on-topic source; the concept originates here, NOT with a Redwood post.** Mechanism: let the
untrusted model **thoroughly comment its code**, inverting prior practice (2312.06942 *stripped*
comments to prevent deceptive ones). Three findings:
1. Commenting improves safety without sacrificing task performance vs comment-removal baselines.
2. **Commenting disproportionately benefits honest code** — which has a natural explanation that
   resolves suspicion, whereas backdoored code frequently lacks an easy justification.
3. Gains *increase with monitor strength* (stronger monitors distinguish genuine from superficially-
   plausible justifications).

The mechanism is **variance reduction**: benign-policy suspicion SD **1.57 → 0.44**; audit threshold
**6.79 → 2.59** under commenting. ⚠ **The paper reports NO discrete safety percentages** (Pareto curves,
overlapping CIs) — cite variance/threshold numbers, never a safety %. Best used as a **fifth affordance
in bench S1**, not its own scenario.

### 2.2 The paraphrasing trilemma (the conceptual payload)
The canonical defense is Roger & Greenblatt, "Preventing Language Models From Hiding Their Reasoning"
([2310.18512](https://arxiv.org/abs/2310.18512)): a **weak trusted** model paraphrases the **strong
untrusted** model's output; under the right conditions this caps encoded reasoning at **<3 bits/KB**.
But three results jointly establish a trilemma:
- **It needs a paraphraser weak enough not to read the hidden message** — yet weak paraphrasers leave
  *syntactic* channels intact ([Anwar & robertzk](https://www.lesswrong.com/posts/vf6ocxgHCSsDwC7H8/paraphrasing-is-at-best-a-partial-defence-against)).
- **It's theoretically bounded by semantic entropy** and cannot reach zero (2402.07510 Theorem 4).
- **Aggressive enough to break the semantic channel damages the task** — 8% on AlpacaEval (2310.18512),
  16–24% of traces damaged (Anwar & robertzk).

The three-channel taxonomy (Anwar & robertzk) is the useful frame: **structural** (formatting/encoding
— paraphrasing kills it), **syntactic** (word choice — partially survives), **semantic** (which facts
get mentioned, how arguments are structured — **completely preserved**). Conceptual Steganography
([2605.26537](https://arxiv.org/html/2605.26537)) is the empirical proof the semantic channel is
exploitable: bits hidden in *which reasoning behavior a CoT step exhibits*, surviving paraphrase at
30–99% message accuracy vs 11–90% for a matched keyword baseline. ⚠ tables via summarizer.

### 2.3 The tension worth flagging for curriculum
**Legibility and paraphrasing pull in opposite directions.** Legibility *adds* model-authored
explanatory text so a weak monitor can evaluate (2602.10153); paraphrasing *destroys* model-authored
surface form to break covert channels (2310.18512). Comments are exactly what a paraphraser targets,
and the legibility paper doesn't address the interaction. Likewise Bootstrapped Monitoring
([2606.11998](https://arxiv.org/html/2606.11998)) depends on passing the untrusted monitor's reasoning
**raw** — summarizing it costs ~28pp of catch rate ⚠ — in direct tension with paraphrasing that channel.

### 2.4 Trusted editing (the escalation-ladder neighbor)
From [2312.06942](https://arxiv.org/abs/2312.06942): T rates U's code; below threshold submit U's;
above, T rewrites U's suspicious code. Three-tier routing: audit top 2% / edit 2–20% / submit bottom
80%. **Trusted editing (20%) = 92% safety / 94% usefulness, Pareto-dominates untrusted monitoring**
(79/96). Threshold sweep 5%→50%: 73/97 → 96/89. ⚠ **No "100%" variant exists** — max is 96% at the 50%
threshold. Red's attack: "write code with a subtle backdoor when there seems to be a good opportunity,
so T maybe copies it." A natural S1 affordance-3 replacement (gives red a genuinely new node).

### 2.5 CoT-monitorability context (adjacent)
- **Kinniment (METR)**, "Why it's good for AI reasoning to be legible and faithful" — defines legible
  (human-comprehensible format) vs faithful (accurately represents actual decision-making); the
  load-bearing idea is the **information bottleneck** (legible+faithful reasoning must be *the* channel,
  or heavy reasoning routes through illegible side channels).
- **Korbak et al.**, "Chain of Thought Monitorability" ([2507.11473](https://arxiv.org/abs/2507.11473),
  40+ authors) — the two properties (necessity + propensity to think out loud) and four fragility
  mechanisms (RL scaling, process supervision, indirect pressure, novel architectures).
- **Jose**, "Reasoning Models Sometimes Output Illegible CoT" ([2510.27338](https://arxiv.org/abs/2510.27338))
  — 14 models; RL drives illegibility; **53% accuracy drop** when restricted to legible portions;
  **Claude models the exception** that stayed legible.

### 2.6 The one negative finding to remember
There is **no Redwood post proposing "legible reasoning" as a named control protocol.** The Redwood
"legibility" post ([To be legible, evidence of misalignment probably has to be behavioral](https://blog.redwoodresearch.org/p/to-be-legible-evidence-of-misalignment))
is about legible *evidence of misalignment* (what convinces decision-makers), a different sense. Don't
attribute the legibility-protocol concept to Redwood.
