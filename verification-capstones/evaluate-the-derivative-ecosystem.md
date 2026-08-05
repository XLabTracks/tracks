---
title: Evaluate a Thousand Models
track: Technical Governance
status: draft
summary: One open release becomes thousands of fine-tunes, merges and quantisations. Design the triage that decides which of them anyone needs to evaluate, and pilot it.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Triage scheme plus a pilot run over a real derivative population, with the cost per model
deliverable_type: notebook
mentor: recommended
audience: The monitoring body that has to watch an ecosystem, not a model.
skills: [scalable evaluation design, sampling, ecosystem monitoring, cost-aware measurement]
prerequisites: [TG week 3 — running evals, TG week 4 — why evals are hard, TG week 8 — open weights, misuse and provenance]
sources:
  - "[Open Technical Problems in Open-Weight AI Model Risk Management (2025): how can we scalably evaluate thousands of models?](https://openreview.net/forum?id=8QyGLnFkzc)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), deployment questions: how can downstream impact evaluations be scaled?](https://arxiv.org/abs/2407.14981)"
  - "[100+ Concrete Problems and Open Projects in Evals — Marius Hobbhahn (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - Technical Governance Track - Work Structure and Suggestions.md §3 week 8
updated: 2026-08-04
---

## The brief

Governance treats an open-weight release as one object. The ecosystem does not:
within months a popular base model has thousands of public descendants —
fine-tunes, merges, quantisations, distillations, uncensored variants. Nobody
is going to evaluate all of them. The question is what a monitoring body should
do instead.

- **The population.** Characterise the real derivative set for one base model
  from public hub metadata: how many, of what kinds, how they cluster, how
  download counts distribute. This is desk work and it reshapes the problem —
  attention almost always concentrates in a tiny fraction.
- **The triage.** Your scheme for deciding what gets looked at. Candidate
  signals: reach, whether the modification targets safety behaviour, declared
  purpose, lineage from an already-flagged model, cheap automated probes.
  Ordered, with a stated budget: *n* models evaluated per month.
- **The cheap screen.** One or two probes cheap enough to run on everything —
  a handful of prompts, a refusal-rate measurement — that decide who gets the
  expensive eval. Report its false-negative rate against your deep evaluations,
  because a screen that misses is worse than no screen if it creates confidence.
- **The pilot.** Run the whole thing on a real population at small scale.
  Report cost per model at each stage and what the triage caught that a random
  sample would have missed.
- **The blind spots.** What this scheme structurally cannot see: private
  fine-tunes, models distributed outside public hubs, and derivatives whose
  modification is invisible to your screen.

## Why it exists

Week 8 covers the irreversibility of open release and fine-tuning attacks on
safeguards. Both lessons are usually taught about *a* model. The governance
object is the ecosystem, and monitoring an ecosystem on a fixed budget is a
different discipline — sampling, triage and cheap screens rather than depth.

It is also one of the few genuinely open problems in this bank where a learner
can produce a real partial answer in three weeks, because the population data is
public and the pilot can be small.

## Scope

**In scope:** public model-hub metadata, one base model's derivative
population, small open models, and cheap automated probes.

**Out of scope:** evaluating dangerous capabilities in depth, and any probe
that would itself produce misuse material. Use a benign behavioural proxy —
refusal-rate drift on a safe prompt set is enough to demonstrate the method.

**The budget constraint is the exercise.** A triage scheme that assumes you can
evaluate everything has not been designed.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Population | "There are many derivatives" | Counted and characterised from real metadata, with the attention distribution shown |
| Triage | A priority list | An ordered scheme with a stated monthly budget and what falls outside it |
| Screen | Described | Run, with its false-negative rate measured against the deep evaluations |
| Blind spots | Unmentioned | Named, with what the scheme's output should therefore not be taken to mean |

## Getting started

1. Pull the population metadata in week one. The shape of the distribution
   decides your whole design and it takes an afternoon.
2. Build the cheap screen before the triage. Knowing what a five-cent probe can
   tell you determines which signals are worth ranking on.
3. Compare your triage against a random sample of the same size. If it does not
   beat random, the signals were wrong and you have time to change them.
