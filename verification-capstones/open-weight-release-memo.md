---
title: The Open-Weight Release Decision
theme: Technical Governance
status: draft
summary: Write the release memo for a frontier open-weight model — what evidence would justify shipping, which mitigations survive contact with a downstream fine-tuner, and which are theatre.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Release-decision memo with an evidence table and a stated irreversibility budget
deliverable_type: memo
mentor: recommended
audience: The release committee that has to sign, knowing they cannot unship.
skills: [risk assessment, evidence standards, threat modelling, decisions under irreversibility]
sources:
  - "[Open Technical Problems in Open-Weight AI Model Risk Management (2025)](https://openreview.net/forum?id=8QyGLnFkzc)"
updated: 2026-08-04
---

## The brief

You are staffing the release decision for an open-weight model at the
capability frontier of what is currently released openly. Write the memo the
committee reads.

The memo covers:

- **The decision.** Release, release with conditions, or hold — stated in the
  first paragraph, not the last.
- **The evidence table.** Row per claim the release rests on; column for the
  evidence, its strength, and what would overturn it. Claims like "the model
  does not meaningfully uplift a novice" belong here with their actual
  support, which is usually thinner than the sentence sounds.
- **The mitigation audit.** For each safeguard — data filtering, refusal
  training, unlearning, staged release, licence terms — state what it does
  against a downstream actor who has the weights, a GPU, and a weekend. Mark
  each one *durable*, *slows an amateur*, or *theatre*. Nothing gets to be
  unmarked.
- **The irreversibility budget.** The whole point. Name what cannot be
  recovered if you are wrong, and what you are accepting in exchange.
- **The monitoring plan.** What you would watch after release, and the
  observation that would tell you the decision was wrong — while there is
  still anything to be done about it.

## Why it exists

Open release is the cleanest case in AI governance of a decision that cannot
be walked back, made on evidence that is known to be incomplete. It is also
where safety arguments are most often made in a form that has never survived
contact with fine-tuning: safeguards evaluated on the model as shipped, not
on the model as trivially modified.

The literature this draws on is explicit that the science is nascent — most
of the sixteen open technical problems are unsolved. That makes this a good
teaching case, because you have to write a defensible decision *without* the
evidence you would want, which is the actual job.

## Scope

**In scope:** published work on open-weight risk management, unlearning,
tamper-resistance, and the frontier safety frameworks the track already
covered. A hypothetical model is fine — specify its capability profile
explicitly and hold to it.

**Out of scope:** running the evals yourself, and litigating whether open
weights are good in general. This memo is about one model and one decision.
The general argument belongs in a different capstone.

**A hard constraint on content:** do not write operational uplift detail.
The memo argues about evidence and reversibility; it does not need — and must
not contain — a recipe for anything.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The recommendation | Emerges at the end after a survey | First paragraph, with its two strongest counter-arguments named by you |
| Mitigations | Listed as implemented | Each one marked durable / slows an amateur / theatre, with the reason |
| Evidence | "Evals showed no significant uplift" | The eval, the elicitation, the population it generalises to, and what it cannot see |
| Irreversibility | Acknowledged in passing | Priced: what specifically is unrecoverable, and what you accept in exchange |

If every mitigation in your audit comes out durable, you have not attacked
your own memo hard enough. Go back and assume the fine-tuner is competent,
funded, and not in your jurisdiction.

## Getting started

1. Fix the model's capability profile in writing on day one. Half of all
   release arguments are actually arguments about a model nobody specified.
2. Do the mitigation audit before the evidence table. It usually deletes two
   rows of the table and reshapes the recommendation.
3. Write the monitoring plan as if the release already happened and you are
   three months in. It is the fastest way to find out whether your
   post-release story was ever real.
