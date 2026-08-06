---
title: Scope One Eval Small Enough to Finish
track: Technical Governance
status: draft
summary: Pick one problem off a public evals backlog, cut it down until it fits three weeks, and run a thirty-item pilot that tells you whether the full eval is worth building.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: core
deliverable: Eval spec, a thirty-item pilot run with results, and a scoping post-mortem
deliverable_type: notebook
mentor: optional
audience: The team that would have to decide whether to fund the full version.
skills: [eval design, scoping, measurement validity, elicitation, honest reporting of nulls]
sources:
  - "[A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
updated: 2026-08-04
---

## The brief

Open one of the public evals backlogs, choose a single problem, and then do
the thing the backlog cannot do for you: cut it down until it fits three
weeks and one or two people. Ship the cut-down version, not the ambition.

You hand in three things:

- **The eval spec.** The capability or propensity being measured, in one
  sentence a non-technical reader can repeat. The item format. The scoring
  rule. The elicitation you commit to *before* you look at results — prompt,
  scaffold, sampling, number of attempts. The decision the eval is meant to
  inform.
- **The pilot.** Thirty items, run, scored, logged. Thirty is not a
  compromise; it is the number that separates "this measures something" from
  "this measures nothing" while leaving you time to notice.
- **The scoping post-mortem.** What you cut and why, what the pilot changed
  about your spec, and your answer to: *should anyone build the full
  version?* A defensible "no" is a pass.

## Why it exists

Every backlog in the field is a list of things nobody has had time to scope.
The listed problem is the easy half. The hard half is deciding what counts as
an instance of it, what the model is allowed to be given, and what result
would move anyone. That is judgement, and it is the judgement evals hiring
actually screens for.

It also inoculates you against the failure that makes most first evals
worthless: an eval built at full scale on an unexamined operationalisation,
where the number at the end measures the scaffold rather than the model.

## Scope

**In scope:** an existing model API or open weights, a small hand-built or
adapted item set, and any elicitation you can run yourself.

**Out of scope:** a new benchmark at publication scale, fine-tuning, and
human-subject data collection. If your design needs a hundred hours of expert
labelling, you have chosen the wrong problem — say so in the post-mortem and
pick again in week one, not week three.

**The elicitation gap is a scope boundary, not a footnote.** You are
measuring what the model does under *your* elicitation. Say so everywhere you
state a number.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Operationalisation | "Measures deception" | One sentence naming the behaviour, the observable, and what would falsely trigger it |
| Pre-registration | Elicitation described after the fact | Spec written and timestamped before the run; deviations listed |
| The null | Buried or unmentioned | A flat result reported as a finding, with what it rules out |
| Scoping | Full version described as future work | An explicit build / don't-build recommendation with a reason |

The strongest submissions contain a sentence like "I thought this measured X;
the pilot showed it measures Y, so here is the revised spec."

## Getting started

1. Read fifteen items off the backlog and pick the one whose *result* you can
   already imagine someone arguing about. Contested is scopeable; vague is not.
2. Write the scoring rule before writing a single item. If you cannot score it,
   you cannot measure it.
3. Hand-build five items and run them on day one. Nearly every fatal design
   problem is visible at five items, and it costs you an afternoon rather than
   a fortnight.
