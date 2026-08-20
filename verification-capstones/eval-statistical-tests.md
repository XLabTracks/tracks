---
title: What Statistical Test Does an Eval Result Need?
track: Technical Governance
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
updated: 2026-08-20
---

## The idea, as posed

From [A Collection of AI Governance Research Ideas — von Knebel &
Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024),
idea 35, "What Statistical Tests are Appropriate in Evaluations of
Dangerous Capabilities and Undesirable Model Properties?". Quoted:

> Model evaluations of dangerous capabilities – and in particular
> assessments of whether a model has reached some level of capability
> relevant to a Responsible Scaling Policy or the like – shouldn’t rely on
> normal statistical testing. Or at the very least, I expect that the way
> these tests are currently done is off. A lot of the studies we’ve seen
> to date (e.g. a recent paper from Anthropic on persuasiveness + previous
> work on biorisk from OAI) will have conclusions like “[the model]
> produces arguments that don’t statistically differ in their
> persuasiveness compared to arguments written by humans” (Anthropic) and
> “However, the obtained effect sizes were not large enough to be
> statistically significant” (OpenAI). Why is this a problem? Normal
> statistical testing asking for 95% confidence is designed to be
> conservative: not to cry wolf, to only say there’s an effect there when
> there is. But that may not be what we want in the AI case. Another issue
> is that it also incentivizes companies doing tests that are
> underpowered. E.g. the OAI study had positive uplift but didn’t find
> statistically significant results, but they only had 50 students
> participate in the study.

The idea's research questions:

> How big of a problem is this?
>
> What possible solutions exist? Some candidates:
>
> Flip the test. Make the null hypothesis that you’re disproving should be
> that there is uplift.
>
> Demand higher power, so that smaller effect sizes are more likely to
> show significant results.
>
> Do tests that are meant to test whether there’s a difference between two
> quantities, not whether one is higher than the other.

## What you produce

A statistical note and notebook on the questions' own terms: what
comparison an eval-versus-threshold claim is actually making, one
published claim re-analysed with uncertainty attached, and whether the
candidate solutions the idea lists — flipping the null, demanding higher
power, testing for difference — change the published conclusion.
