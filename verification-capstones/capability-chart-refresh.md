---
title: Redraw the AI-vs-Human Capability Chart
track: Technical Governance
verification_fit: "Lands on 1.1 — a pause agreement has to name a covered capability, and this is the measurement that claim would rest on."
status: ready
summary: The best-known chart of AI against human performance stops in 2023. Rebuild it at today's date and say what a threshold can honestly attach to.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Reproducible chart and dataset, a methods note, and a two-page brief on what a capability threshold can be written against
deliverable_type: notebook
mentor: optional
audience: Anyone about to cite a capability curve in a threshold argument.
skills: [benchmark literacy, data provenance, normalisation choices, trend presentation, threshold design]
sources:
  - "[Dynabench: Rethinking Benchmarking in NLP — Kiela et al. (2021), §1 and Figure 1](https://arxiv.org/abs/2104.14337)"
  - "[Test scores of AI systems on various capabilities relative to human performance — Our World in Data](https://ourworldindata.org/grapher/test-scores-ai-capabilities-relative-human-performance)"
  - "[AI Benchmarking Dashboard — Epoch AI](https://epoch.ai/data/ai-benchmarking-dashboard)"
  - "[AI Index — Stanford HAI](https://hai.stanford.edu/ai-index)"
similar: [threshold-decay-analysis, field-map-refresh, eval-to-threshold-brief]
updated: 2026-08-20
---

## The idea, as posed

From [Dynabench: Rethinking Benchmarking in NLP — Kiela et al.
(2021)](https://arxiv.org/abs/2104.14337),
whose Figure 1 the Our World in Data chart descends from. Quoted:

> While it used to take decades for machine learning models to surpass
> estimates of human performance on benchmark tasks, that milestone is now
> routinely reached within just a few years for newer datasets (see Figure
> 1).

That figure's caption states the normalisation the famous chart still
uses:

> Figure 1: Benchmark saturation over time for popular benchmarks,
> normalized with initial performance at minus one and human performance
> at zero.

And the introduction says what saturation does and does not mean:

> When the GLUE dataset was introduced, “solving GLUE” was deemed “beyond
> the capability of current transfer learning methods” Wang et al. 2018.
> However, GLUE saturated within a year and its successor, SuperGLUE,
> already has models rather than humans at the top of its leaderboard.
> These are remarkable achievements, but there is an extensive body of
> evidence indicating that these models do not in fact have the
> human-level natural language capabilities one might be lead to believe.

## What you produce

The chart rebuilt at today's date on the caption's own terms — initial
performance at minus one, human performance at zero — with a provenance
column for every row, an explicit retirement-and-succession rule for
saturated series, and the two-page brief saying what a capability
threshold can honestly attach to when benchmark saturation is not the same
thing as human-level capability.
