---
title: Where Did the Compute Go?
track: Technical Governance
verification_fit: "Threshold design in unit 1.0.1 assumes training is the thing worth watching; this estimates how much of the compute picture that assumption covers."
status: draft
summary: Compute governance assumes training is the thing worth watching. Estimate the training-versus-inference split for one deployed model and say what it does to threshold design.
team: 1
effort_hours: 10-14
duration: 2 weeks
difficulty: core
deliverable: Reproducible estimate of a training/inference compute split, with the threshold implication
deliverable_type: notebook
mentor: optional
audience: The regulator whose rule counts one of the two and ignores the other.
skills: [back-of-envelope estimation, sensitivity analysis, reproducibility, technical writing]
prerequisites: [TG week 1 — compute estimates, TG week 2 — compute governance]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 72: BOTECs of inference compute needs](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 76: understanding training vs. inference](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - Technical Governance Track - Work Structure and Suggestions.md §3 weeks 1-2
  - compute-estimator.html
updated: 2026-08-05
---

## The brief

Week 1 has you reproduce training-compute estimates. This is the other half of
the ledger, and the shorter capstone in the bank: for one deployed model,
estimate lifetime inference compute and compare it to the training figure.

- **The training estimate.** Reproduce it from architecture and token counts,
  checked against a public dataset. You already know how; this is the anchor.
- **The inference estimate.** Build it bottom-up. Cost per token from
  parameter count and the arithmetic of a forward pass; tokens per request;
  requests per day from whatever usage evidence exists — disclosed user counts,
  app-store estimates, API pricing and revenue, third-party traffic analysis.
  Say which of these you are leaning on and how much you trust it.
- **The sensitivity.** Which input dominates. Usually one assumption carries
  the whole estimate; find it and vary it across a defensible range rather than
  quoting a point.
- **The reasoning-model wrinkle.** Models that spend heavily at inference time
  change this ratio by a large factor. Include one such model in the comparison
  if you can, and say what it does to the picture.
- **The threshold implication.** One page. If lifetime inference exceeds
  training by a large multiple, a regime that counts only training compute is
  measuring a shrinking share of the activity. Say what follows: a second
  threshold, a different unit, or an argument that training is still the right
  control point — that conclusion is available and defensible, but it has to be
  argued rather than assumed.

## Why it exists

Compute governance rests on training compute because it is excludable,
quantifiable and concentrated. The quiet assumption underneath is that training
is where the compute is. That assumption is checkable, and checking it is a
two-week exercise that changes how a learner reads every threshold proposal
afterwards.

It is deliberately one of the cheapest capstones here. The skill is
back-of-envelope estimation under thin data with the assumptions exposed — the
most reusable quantitative habit the track teaches.

## Scope

**In scope:** public model specifications, published compute datasets, public
usage and revenue reporting, and standard forward-pass arithmetic.

**Out of scope:** proprietary usage data, and precision. An order of magnitude
with a visible assumption register is the deliverable; a confident figure with
no sensitivity is a worse answer.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Estimates | Two numbers | Two numbers with their derivations, both reproducible from the notebook |
| Sensitivity | A single figure | The dominant assumption identified and varied across a defensible range |
| Evidence | "Estimates suggest" | Each input sourced and dated, with your confidence in it stated |
| Implication | "Inference matters too" | A specific consequence for threshold design, argued either way |

## Getting started

1. Do the forward-pass arithmetic first — it is the one part with no
   uncertainty in it, and it tells you what the usage number has to carry.
2. Find three independent sources for the usage figure before writing anything.
   If you cannot, the range widens and you say so.
3. Write the assumption register as you go, in the notebook. It is the artifact
   a reader will actually use.
