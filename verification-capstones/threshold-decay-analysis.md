---
title: How Fast Does a Compute Threshold Decay?
track: Technical Governance
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
sources:
  - "[An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), §4](https://arxiv.org/abs/2511.10783)"
updated: 2026-08-20
---

## The idea, as posed

From [An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta
(2025)](https://arxiv.org/abs/2511.10783), Section 4, The Agreement.
Quoted:

> AI training runs above the Strict Threshold (i.e., 10^{24} FLOP) are
> prohibited. Training runs below this threshold but above the Monitored
> Threshold (i.e., 10^{22} FLOP) must be approved and monitored by coalition
> authorities. Training runs below the Monitored Threshold require no
> approval or monitoring.

The considerations that follow name the decay this project measures:

> Due to improvements in AI algorithms and data, the capability of models
> trained at a given computational scale increases rapidly over time [68].
> Due to likely progress in algorithms and data between today and when this
> agreement would come into effect, AIs trained at the Strict Threshold will
> be more capable—potentially much more—than the models trained at that
> scale today.

## What you produce

The measurement the quoted drift calls for: a reproducible notebook
reconstructing which models crossed the EU and US statutory thresholds and
when, the decay rate implied by published efficiency trends, and the
two-page threshold-design memo those numbers justify.
