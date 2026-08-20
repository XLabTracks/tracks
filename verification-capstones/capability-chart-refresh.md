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
  - "[Test scores of AI systems on various capabilities relative to human performance — Our World in Data](https://ourworldindata.org/grapher/test-scores-ai-capabilities-relative-human-performance)"
  - "[Dynabench: Rethinking Benchmarking in NLP — Kiela et al. (2021)](https://arxiv.org/abs/2104.14337)"
  - "[AI Benchmarking Dashboard — Epoch AI](https://epoch.ai/data/ai-benchmarking-dashboard)"
  - "[AI Index — Stanford HAI](https://hai.stanford.edu/ai-index)"
similar: [threshold-decay-analysis, field-map-refresh, eval-to-threshold-brief]
updated: 2026-08-07
---

## The brief

One chart does more work in AI-policy argument than almost any other: Our World
in Data's *Test scores of AI systems on various capabilities relative to human
performance*. Twelve capabilities — handwriting, speech and image recognition,
reading comprehension, language understanding, predictive reasoning, code
generation, complex reasoning, general knowledge, maths, nuanced language
interpretation, and reading comprehension with unanswerable questions — each
normalised so the system's first recorded score sits at −100 and human
performance sits at zero. Lines climb, cross zero, and stop.

It draws on Kiela et al.'s Dynabench data. Its span is **1998–2023** and Our
World in Data last processed it on **2 April 2024**. Everything since is
missing, and the missing part is the part people cite it about.

Rebuild it. Three things come out:

- **The dataset.** A tidy, versioned table: capability, benchmark, system,
  date, raw score, human baseline, and a provenance column giving the source
  for every single row. No row without a citation.
- **The chart.** The same idea redrawn to today, reproducible from the table by
  a script anyone can re-run. Match the original's normalisation, or depart
  from it and say why in the methods note — either is a defensible answer, but
  only one of them can be silent.
- **The two-page brief.** What a capability threshold in an agreement could
  honestly be written against, given what you just found out about the
  measurements. This is the part a policy reader will actually use.

## Why it exists

The chart is a picture of benchmarks dying, and it is read as a picture of
capability growing. Those are not the same claim, and the difference is
load-bearing for anyone writing a rule.

Three problems are waiting inside it, and finding them is most of the work:

- **Saturation censors the series.** A benchmark that gets beaten stops being
  run, so its line ends. The end of a line is a retirement, not a plateau.
  What an updated chart does at that moment — drop the series, splice a
  successor benchmark, or mark it retired — is the central methodological
  choice of this project, and there is no free answer.
- **"Human performance" is twelve different things.** Each zero line comes from
  a different baseline study with a different population, incentive and
  protocol: annotators paid per item, domain experts, a competition field.
  Normalising them all to zero makes them look commensurable when they are not.
- **The floor moves too.** Setting each capability's first score to −100 means
  the visual slope depends on when someone first bothered to measure. A
  capability nobody tested until late looks like it arrived fast.

For this course the payoff is direct. A pause agreement has to name what is
covered. If the covered thing is a capability, somebody has to be able to
measure it the same way twice — and a chart whose every line ends when the test
gets too easy is evidence about how hard that is.

## Scope

**In scope:** the twelve existing capability series, extended where a defensible
continuation exists; a named set of post-2023 benchmarks you argue into the
frame; and the provenance work to support both.

**Out of scope:** running any evaluation yourself. This is a data-provenance and
presentation project, not an eval project — *From Eval Result to Policy
Threshold* is the one that runs evals.

**Also out of scope:** building a new benchmark, and scraping leaderboards
without provenance. A number whose source you cannot name does not go in the
table, however much it would help the line.

**Watch the scope creep here specifically:** deciding which modern benchmarks
belong is genuinely hard, and teams lose a week to it. Pick your candidates in
the first session, write down why each one is in or out, and move on. Some will
turn out to have no defensible human baseline at all — that is a finding to
report, not a failure to fix.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Provenance | Numbers from leaderboards | Every row cites a source; contested rows flagged as contested |
| Human baselines | "Human performance" as one column | Each baseline's population, protocol and date stated, with the ones that do not exist named as missing |
| Saturation | Lines that just stop | An explicit, defended rule for retirement and succession, applied the same way to every series |
| Normalisation | The original's, copied without comment | The choice made deliberately, with what it flatters and what it hides both named |
| Reproducibility | A chart image | A script and a table that regenerate the chart from scratch |
| The brief | "Capabilities are rising fast" | What a threshold can attach to, what it cannot, and how fast the answer decays |

## Getting started

1. Pull the original data and reproduce the existing chart *before* changing
   anything. If you cannot reproduce 1998–2023, you cannot defend 2024 onward.
2. Take one series all the way to today before starting the second. The first
   one teaches you the retirement rule; doing all twelve in parallel means
   discovering it twelve times.
3. Write the provenance column as you go. Backfilling citations onto a finished
   table is the way this project fails.
