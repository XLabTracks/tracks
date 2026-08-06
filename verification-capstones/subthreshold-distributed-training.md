---
title: Train It in Pieces, Under Every Threshold
theme: Verification
status: draft
summary: Evasion scenario 8 says a run can be fragmented below the line. Work out how far that actually goes today, what it costs, and which threshold designs survive it.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Feasibility assessment of fragmented training plus a threshold-design recommendation that survives it
deliverable_type: analysis
mentor: recommended
audience: Whoever writes the threshold, and the verifier who has to enforce it.
skills: [technical feasibility assessment, evasion modelling, threshold design, cost estimation]
prerequisites: [Verification 2.1 — the hardware layer, Verification 3 — covert development, TG week 2 — compute governance]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can AI models be trained using a large number of small compute clusters?](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-04
---

## The brief

Module 3's eighth evasion scenario is sub-threshold fragmentation: split the run
across enough small clusters, accounts or jurisdictions and no single reported
quantity crosses the line. Everyone concedes it is possible in principle. The
question that decides whether it matters is how expensive it is in practice.

- **The technical ceiling.** What decentralised and low-communication training
  can actually do today, at what scale, and how far behind a co-located run of
  the same nominal compute it lands. Bandwidth and latency are the binding
  constraints; say what they cost in wall-clock and in achieved quality.
- **The overhead.** The multiplier a fragmenter pays — in time, in total
  compute, in engineering. That number, more than any argument, determines
  whether the route is used.
- **What fragments and what does not.** Splitting across accounts inside one
  provider is a different problem from splitting across providers, and both are
  different from splitting across borders. Some are trivial and some are
  research problems. Separate them.
- **What still shows.** Aggregate procurement, power, and the fact that
  somebody eventually has to assemble the pieces. Fragmentation hides the run
  from a per-cluster threshold; it does not hide it from every layer, and
  naming what remains visible is the constructive half.
- **The threshold recommendation.** Which threshold designs survive: aggregate
  across a corporate group, count over a rolling window, attach to procurement
  rather than to a run, index on the model rather than the training. Pick one
  and say what it costs in administrability.

## Why it exists

Threshold-based governance is the field's dominant instrument, and this is the
evasion route that attacks its arithmetic rather than its enforcement. The
track teaches thresholds in Module 2 and attacks them in Module 3; this
capstone is that attack carried through to a redesign, which is the part
learners usually skip.

The pairing with the rest of the bank is deliberate. One capstone asks how fast
a threshold decays, another asks what it counts, this one asks whether it can
be arithmetically avoided. Those are the three ways a compute rule fails, and a
cohort that has produced all three has a genuinely complete picture.

## Scope

**In scope:** published work on decentralised and communication-efficient
training, public reporting on distributed training efforts, and the track's
threshold material.

**Out of scope:** running a distributed training experiment, and any operational
detail about evading a specific regime in a specific place. You are assessing
feasibility and redesigning the instrument, not writing a manual.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Feasibility | "Distributed training is possible" | A scale ceiling with a date, and the gap to a co-located run quantified |
| Overhead | Unquantified | A multiplier, with what drives it and how fast it is shrinking |
| Fragmentation modes | Treated as one thing | Separated by boundary crossed, each with its own difficulty |
| Recommendation | "Thresholds should be robust" | One design, with its administrative cost and what it still misses |

## Getting started

1. Get the overhead multiplier first, even roughly. If it is 10x, this is a
   theoretical concern; if it is 1.5x, the threshold design has to change now.
2. Separate the fragmentation modes on day two. Conflating account-splitting
   with cross-border distributed training makes every later claim mushy.
3. Write the "what still shows" section before the recommendation. The
   threshold you recommend should lean on whatever survives.
