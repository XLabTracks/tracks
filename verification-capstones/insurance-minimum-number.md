---
title: Pick the Insurance Number
theme: AI Governance Policy
status: draft
summary: Mandatory insurance for frontier developers keeps being endorsed without anyone naming a minimum. Name it — coverage, limits, deductible — and defend the arithmetic.
team: 1-2
effort_hours: 12-16
duration: 2 weeks
difficulty: stretch
deliverable: A recommended minimum with the loss model behind it and the market-availability check
deliverable_type: analysis
mentor: recommended
audience: The regulator who has to write a number into a licensing condition.
skills: [quantitative estimation, loss modelling, regulatory design, reasoning under thin data]
sources:
  - "[Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 5](https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance)"
updated: 2026-08-04
---

## The brief

The orphan catalogue's complaint about insurance is unusually precise:
researchers praised the mechanism, and the question of what the minimum amount
should be was never satisfactorily answered. Nor were policy limits or
deductibles. A mandate without those three numbers cannot be written into any
instrument.

Answer it.

- **The loss model.** What harms this insurance is for, and a defensible
  order-of-magnitude for each. Build it bottom-up from analogues you can cite —
  data-breach losses, product recalls, professional liability, cyber — and say
  where the analogy breaks.
- **The three numbers.** Minimum coverage, per-occurrence and aggregate
  limits, deductible. With the reasoning visible, so a reader can disagree with
  an input instead of the conclusion.
- **The availability check.** Would anyone write this policy? Capacity,
  reinsurance, and the exclusions an underwriter would insist on. A mandate
  nobody can satisfy is a moratorium wearing a disguise, and you should say so
  if that is what you find.
- **The incentive read.** What behaviour your number actually buys. Insurance
  governs through pricing and underwriting conditions, not through payouts;
  if the number is too low it is a rounding error, too high and it entrenches
  incumbents. Say which way you erred.

## Why it exists

This is the track's quantitative nerve applied to policy rather than compute.
The honest answer is built on thin data, and the skill is producing a number
anyway, with the uncertainty stated rather than hidden — the same discipline
as a compute threshold, in a domain where nobody has done the arithmetic in
public.

It also teaches something specific about mechanism choice: insurance is
attractive to policy people because it seems to outsource the hard judgement to
a market. Working the numbers shows how much judgement stays with the
regulator.

## Scope

**In scope:** public loss data from analogous industries, insurance-market
reporting, and the AI-liability literature. Order-of-magnitude reasoning is
expected; precision is not.

**Out of scope:** actuarial modelling of AI-specific tail risk. Nobody can do
that yet, and pretending otherwise is the failure mode here. Bound it and say
so.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The model | A number with a rationale paragraph | Bottom-up from named analogues, each with its disanalogy stated |
| The numbers | One figure | All three, with the relationship between them explained |
| Availability | Assumed | Checked against real market capacity, with the exclusions named |
| Uncertainty | Point estimate | A range, the input it is most sensitive to, and what would narrow it |

## Getting started

1. Pick the harm class first. An insurance mandate covering "AI harms" cannot
   be priced; one covering a defined class can be bounded.
2. Find the closest priced analogue and start there, adjusting explicitly.
   Starting from first principles produces a number nobody can check.
3. Ask an underwriter's question of every figure: what would make you refuse
   to write this?
