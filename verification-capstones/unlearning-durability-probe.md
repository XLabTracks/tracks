---
title: Does the Capability Actually Go Away?
track: Technical Governance
status: concept
summary: Reproduce one published unlearning method on a small model, then try to bring the capability back — and report the relearning cost as the number that matters.
team: 2-3
effort_hours: 20-26
duration: 4 weeks
difficulty: advanced
deliverable: Reproducible notebook plus a two-page durability finding with the relearning cost
deliverable_type: notebook
mentor: required
audience: Anyone who has cited unlearning as a safeguard in a release argument.
skills: [empirical replication, adversarial evaluation, experiment design, reporting negative results]
sources:
  - "[Open Problems in Machine Unlearning for AI Safety — Barez et al. (2025)](https://arxiv.org/abs/2501.04952)"
updated: 2026-08-04
---

## The brief

Unlearning appears in governance arguments as though it were deletion. The
literature is much less sure. Find out for yourself, at small scale, and
report a number.

You will:

1. Pick one published unlearning method and one small open model you can
   train on the compute you actually have.
2. Reproduce the method against a benchmark capability. Confirm the reported
   effect — the capability measures as gone.
3. Attack it. Fine-tune on a small quantity of related data, or probe the
   representation directly, and measure how much it takes to bring the
   capability back.
4. Report the **relearning cost**: examples, steps, and wall-clock to recover
   the capability to some stated fraction of baseline.

The deliverable is a notebook another person can run end to end, plus a
two-page finding written for someone who is not going to run it.

## Why it exists

This is the only capstone in the bank where you personally generate the
evidence that a governance claim rests on. Everywhere else in the program you
are reading other people's numbers and asking how much weight they bear. Here
you make one, and discover how contingent it is on choices you made on a
Tuesday afternoon.

It also produces something with a real audience: "unlearning removed the
capability" is load-bearing in open-weight release arguments, and a
reproducible relearning cost is directly usable by anyone auditing one.

## Scope

**In scope:** a small model (roughly ≤1B parameters), one method, one
capability, and a public benchmark. Modest compute — this is designed to run
on a single rented GPU across a few sessions.

**Out of scope:** frontier-scale models, a new unlearning method, and any
capability with real-world misuse potential. Use a benign proxy capability —
a fictional entity, a synthetic fact set, or a published unlearning
benchmark's own target. The point is durability, not the subject matter.

**Ambition warning.** This is the most expensive capstone in the bank and the
only one that can fail on its own terms — a reproduction that does not
reproduce is a real outcome, and one you should be prepared to report. Do not
take it if you need a guaranteed portfolio piece by a fixed date.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Reproduction | "Broadly matched the paper" | Numbers beside the paper's numbers, with deviations explained |
| The attack | One fine-tuning run | A cost curve: recovery against examples, with the knee identified |
| Honesty | Failed runs dropped | The runs that did not work are in the notebook, labelled |
| Reusability | Notebook runs on your machine | Fixed seeds, pinned versions, a stated runtime and cost |

The finding to aim for is a sentence with a number in it that someone can put
in a release memo — and the caveat that keeps them from over-claiming it.

## Getting started

1. Reproduce the *baseline* first, before any unlearning. Most of a
   replication's pain lives in the evaluation harness, and you want to hit it
   in week one.
2. Write the relearning attack before you finish the unlearning step. If you
   build the defence first you will unconsciously build one your attack cannot
   touch.
3. Fix seeds and pin versions from the first commit. Retrofitting
   reproducibility in week four costs more than doing it in week one, every
   time.
