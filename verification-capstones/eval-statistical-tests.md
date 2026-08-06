---
title: What Statistical Test Does an Eval Result Need?
theme: Technical Governance
status: draft
summary: Eval scores get compared to thresholds as if they were measurements without error. Work out what test the comparison actually needs, and re-run one published claim under it.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Statistical note plus a notebook re-analysing one published eval claim with uncertainty attached
deliverable_type: notebook
mentor: recommended
audience: Anyone about to write "the model scored below the threshold" in a document with consequences.
skills: [applied statistics, eval methodology, uncertainty quantification, technical writing]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 35: what statistical tests are appropriate in evaluations of dangerous capabilities?](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-04
---

## The brief

"The model scored 34% on the benchmark; the threshold is 40%; we are clear."
That sentence appears in real documents and it hides at least four sources of
variation. Work out what would have to be true for it to be sound.

- **The error budget.** Enumerate what moves the number: item sampling, model
  sampling at temperature, prompt and few-shot variation, scaffold choice,
  grader disagreement where a human or a model scores. Estimate each. Some will
  be much larger than the gap the claim depends on.
- **The test.** What comparison is actually being made — a point estimate
  against a fixed line, which is not a hypothesis test at all — and what it
  should be. Which null, which direction, and the asymmetry that matters here:
  in a safety threshold, a false "below" is much more costly than a false
  "above", and conventional practice is calibrated for the opposite.
- **The re-analysis.** Take one published claim of the form above and redo it
  with an interval attached. State whether the claim survives.
- **The reporting recommendation.** What an eval report should carry so that a
  reader can do this themselves: n, sampling parameters, per-item results,
  seeds, grader agreement.

## Why it exists

Week 4 shows learners empirically that scores move under prompt and few-shot
variation. The natural next question is what to do about it, and the field's own
research agendas flag the statistical treatment as open.

The transferable value is bluntly practical. Almost nobody entering governance
work can look at an eval table and say what the error bar should be, and the
absence is load-bearing — thresholds are written, and defended, on numbers whose
uncertainty nobody has stated.

## Scope

**In scope:** one published eval claim with enough methodological detail to
re-analyse, a small open model or cheap API for your own variance measurements,
and the statistics literature on benchmark evaluation.

**Out of scope:** novel statistical methodology, and a general framework for all
evals. One claim, done properly, with the method written so it can be reused.

**If the published claim lacks the detail to re-analyse, that is the finding.**
Report what would have been needed. It is a more useful result than a
reconstructed interval built on guesses, and it makes the reporting
recommendation concrete.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Error budget | "Results vary" | Each source estimated, with the largest identified |
| The test | Applies a t-test and moves on | Says what comparison is being made, and treats the asymmetric cost explicitly |
| Re-analysis | Recomputes the mean | An interval, and a clear statement of whether the original claim survives |
| Recommendation | "Report more detail" | The specific fields, justified by which one your analysis needed and lacked |

## Getting started

1. Measure one source of variation yourself in week one — prompt rephrasing is
   cheapest. A real number from your own run anchors the whole error budget.
2. Write down the decision the threshold governs before choosing a test. The
   cost asymmetry is the thing that makes this different from ordinary
   benchmarking.
3. Pick the published claim for its methods section, not its fame.
