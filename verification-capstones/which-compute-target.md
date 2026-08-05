---
title: Which Compute Are We Even Regulating?
track: Technical Governance
verification_fit: "Before unit 2.1.2 can measure, classify and control use, someone must fix what counts as the compute — this is that definition, stress-tested."
status: draft
summary: Compute rules name a quantity without settling what is counted — training or inference, which operations, at what precision. Pick the definition and show what each alternative catches.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Definition recommendation with a re-scored model set under three competing definitions
deliverable_type: notebook
mentor: recommended
audience: The drafter who has to put one definition in a rule and live with it.
skills: [regulatory definition design, quantitative analysis, sensitivity analysis, technical writing]
prerequisites: [TG week 1 — compute estimates, TG week 2 — compute governance]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 78: which compute? defining the regulatory target for compute governance](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), ideas 71 and 76: OP/s threshold adjustments for performance; understanding training vs. inference](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - Technical Governance Track - Work Structure and Suggestions.md §3 weeks 1-2
  - compute-estimator.html
updated: 2026-08-05
---

## The brief

Week 2 has you check which historical models would have crossed each threshold
and when. That exercise quietly assumes a definition of the quantity. Real rules
have to state one, and the alternatives are not equivalent:

- Training compute only, or training plus post-training, or plus inference at
  serving scale?
- Operations at what precision — and how do you compare a number quoted in one
  format against hardware that does something else natively?
- Peak throughput of the cluster, or operations actually performed?
- Aggregated across a distributed run, and if so over what window?

Pick three of these definitions, and score the same set of models under each.

- **The re-scoring.** A notebook: one model set, three definitions, which
  models cross which line under which. Where the sets diverge is the finding.
- **The gaming analysis.** Per definition, the cheapest way to sit just below.
  Sharding a run across windows or subsidiaries, shifting work to post-training
  or inference, quoting a different precision. Some definitions are much
  cheaper to game than others, and it is not always the loose one.
- **The measurability check.** Who could actually verify a claim under each
  definition, from what evidence. A definition that is precise and
  unverifiable is worse than a coarse one somebody can check.
- **The recommendation.** One definition, with what you accept in exchange, and
  the review clause you would attach knowing the technology moves.

## Why it exists

Every compute rule in force rests on a definition that was chosen quickly and
has been carrying weight ever since. Learners see thresholds discussed as
*numbers* — is 10²⁵ right? — when the more consequential choice is what the
number counts.

It also completes the pair with the existing threshold-decay capstone. That one
asks how fast a fixed number loses selectivity; this asks whether the number was
measuring the intended thing in the first place. Together they are the two ways
a compute rule fails.

## Scope

**In scope:** public compute-estimate datasets, published rules and their
definitional language, hardware specifications for the precision question.

**Out of scope:** proposing a new metric. Choose among definitions that a rule
could plausibly use today — a metric nobody can compute from available evidence
is a research programme.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Re-scoring | Asserts the definitions differ | A table where the same models land differently, with the divergent cases named |
| Gaming | "Definitions can be gamed" | Per definition, the cheapest evasion and roughly what it costs |
| Measurability | Assumed | Per definition, who verifies, from what evidence, at what lag |
| Recommendation | The most precise definition | The most *checkable* one, with the trade stated and a review clause |

## Getting started

1. Build the re-scoring notebook first, on five models. The divergences tell
   you which definitional axis actually matters, and it may not be the one you
   expected.
2. Ask of every definition: what would a compliant lab's lawyer say this
   excludes? That is the gaming section, written for you.
3. Keep the precision question separate from the training/inference question.
   Tangling them is how these analyses become unreadable.
