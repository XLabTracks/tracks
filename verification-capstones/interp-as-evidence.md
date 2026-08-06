---
title: What an Interp Finding Is Evidence Of
track: AI Governance Policy
status: draft
summary: Take one published interpretability result and write the evidence memo — the claim it supports, the claims it is routinely stretched to cover, and whether it would survive a hearing.
team: 1
effort_hours: 10-14
duration: 2 weeks
difficulty: core
deliverable: Two-page evidence memo rating one interp finding against three claims it gets cited for
deliverable_type: memo
mentor: optional
audience: The policy researcher about to cite an interpretability paper in an argument.
skills: [evidence standards, reading technical results as a non-specialist, claim-to-evidence mapping]
updated: 2026-08-04
---

## The brief

The policy track carries interpretability deliberately as a **pointer, not a
week**: an emerging evidence type in policy argument, listed under week 5's
extensions, framed as *what an interp finding can and cannot support in
testimony*. This capstone is that pointer, done properly, once.

Pick one published interpretability result — hunting grounds, if you need
them: [Open Problems in Mechanistic Interpretability — Sharkey et al.
(2025)](https://arxiv.org/abs/2501.16496), [Apollo Research's 45+ project
ideas (2024)](https://www.lesswrong.com/posts/KfkpgXdgRheSRWDy8/a-list-of-45-mech-interp-project-ideas-from-apollo-research),
[vision and multimodal foundations — Joseph & Nanda
(2024)](https://www.lesswrong.com/posts/kobJymvvcvhbjWFKe/laying-the-foundations-for-vision-and-multimodal-mechanistic),
and [200 Concrete Open Problems (2022 — its own update calls it out of
date)](https://www.lesswrong.com/posts/LbrPTJ4fmABEdEnLf/200-concrete-open-problems-in-mechanistic-interpretability).
Then:

- **State what was actually shown.** One paragraph, no jargon, at the level of
  precision the paper supports — which model, which layer or feature, on which
  distribution, established how.
- **Collect three claims it gets cited for.** Real citations where you can find
  them; plausible ones you construct if you cannot. Typically some version of
  "we can tell whether a model is deceptive", "we can audit for dangerous
  capability", "we understand what the model is doing".
- **Rate each claim.** *Supported*, *partially supported with a stated
  condition*, or *not supported*. For each, the specific gap — distribution,
  scale, causal versus correlational, whether the method has been validated
  against a ground truth at all.
- **The admissibility test.** For the one claim closest to being usable, write
  the two questions a hostile reader would ask, and whether the finding
  survives them.
- **The replacement sentence.** What a policy document should say instead, if
  it wants to lean on this result.

## Why it exists

Interpretability is the most-cited and least-understood evidence type in
governance writing. A finding gets published about a feature in one model, and
six months later it is load-bearing in a paragraph about auditing frontier
systems. Nobody involved is lying; the chain of small stretches is just never
audited.

The skill is the track's core one — mapping a claim to the evidence that would
support it — applied to a technical result you did not produce and cannot fully
evaluate. That constraint is realistic. Policy researchers cite work outside
their expertise constantly; the honest ones know exactly how far they can carry
it.

The open-problems literature is your ally here rather than your obstacle: the
field's own agenda papers say plainly which methods need conceptual and
practical improvement before they support strong conclusions. Quoting a field
about its own limitations is the strongest move available to a non-specialist.

## Scope

**In scope:** one published result, its own paper, and the field's open-problems
literature. No coding.

**Out of scope:** evaluating whether the interpretability method is technically
correct. You are not refereeing the paper. You are asking what a correct result
would license.

**Also out of scope:** a survey of interpretability. One finding, three claims.
The track carries this as an extension precisely because it is not a subfield
tour.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The restatement | Paraphrases the abstract | Names the model, the scope, and the thing the paper explicitly did not test |
| The claims | Straw versions | Real citations, or constructions a practitioner would recognise as fair |
| The ratings | All "not supported" | Discriminating: at least one claim survives with a stated condition |
| Replacement | "More caution is needed" | A sentence a policy document could paste in and defend |

Rating everything unsupported is as lazy as citing it uncritically. The work is
in finding the narrow claim that does hold.

## Getting started

1. Pick a finding you have already seen cited in a policy context. The citation
   chain is half your material.
2. Read the paper's own limitations section first, then the field's
   open-problems paper. Both will hand you gaps you would not have found.
3. Write the replacement sentence before the ratings. It forces you to decide
   what you actually think, and the ratings then have something to justify.
