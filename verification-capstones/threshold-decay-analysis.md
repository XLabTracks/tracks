---
title: How Fast Does a Compute Threshold Decay?
track: Technical Governance
verification_fit: "Unit 1.0.1's compute-versus-capability threshold question, quantified: how fast a fixed FLOP line stops selecting the runs it was set to catch."
status: ready
summary: Quantify how quickly a fixed FLOP threshold loses selectivity under compute-efficiency trends, and propose an indexing rule that survives it.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Reproducible notebook plus a two-page threshold-design memo
deliverable_type: notebook
mentor: optional
audience: The regulator who has to pick a number and live with it for five years.
skills: [quantitative analysis, trend extrapolation, threshold design, reproducibility]
prerequisites: [TG week 1 — compute estimates, TG week 2 — compute governance]
sources: [Technical Governance Track - Work Structure and Suggestions.md §3 weeks 1-2, compute-estimator.html]
updated: 2026-08-05
---

## The brief

The EU AI Act's 10²⁵ FLOP threshold and the US 10²⁶ threshold are fixed
numbers pointed at a moving target. Measure the movement.

Produce a notebook that:

- Reconstructs training-compute estimates for a defensible set of models
  from public architecture and token counts, checked against a public
  compute database.
- Determines which historical models would have crossed each threshold,
  and when.
- Models the decay: given published compute-efficiency trends, how many
  models per year cross a fixed threshold in year 1, year 3, year 5 — and
  what fraction of *frontier* models that represents.
- States the uncertainty honestly. Compute estimates are estimates;
  efficiency trends are fitted to noisy data. Propagate it or say you did
  not.

Then the memo: an indexing rule that keeps the threshold selective, and
the costs of that rule. Every indexing scheme trades predictability for
durability, and someone has to pay.

## Why it exists

Threshold-based regulation is the workhorse of compute governance and its
softest joint. A threshold that captured three labs at signing captures
three hundred developers five years later, or none, depending on which way
the trends run. Making the decay curve concrete is more persuasive than
any amount of arguing about it.

## Scope

**In scope:** public model data, published efficiency trends, your own
estimates with stated method.

**Out of scope:** proprietary training details; predicting specific future
models. You are characterising a rate, not forecasting a release calendar.

## What good looks like

- The notebook runs end to end from a clean checkout. A result nobody can
  reproduce is a claim, not an analysis.
- Every estimate carries its method and its error bar.
- The memo's indexing proposal names who loses under it. Indexing to a
  rolling percentile of frontier compute is easy to write and hard to
  administer; say so.

## Getting started

1. Reproduce three compute estimates you can check against a public
   database before you build anything. Calibrate on the knowns first.
2. Decide early what "frontier" means in your denominator, and hold that
   definition all the way through. Most confusion here is definitional.
3. Draft the memo's one-sentence recommendation in week 1 and let the
   analysis try to kill it.
