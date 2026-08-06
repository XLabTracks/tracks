---
title: Permit Inference, Prohibit Training
track: Verification
status: draft
summary: An agreement permits inference and prohibits training. Define permitted inference so the boundary survives fine-tuning, distillation and synthetic-data generation.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Draft rule, five edge cases, and the revisions they force
deliverable_type: spec
mentor: recommended
audience: The drafter of a pause clause that has to leave deployed services running.
skills: [definition drafting, workload analysis, adversarial testing]
prerequisites: [Verification 2.2 — the cloud layer, Verification 3 — covert development]
updated: 2026-08-06
---

## The brief

Any realistic pause stops training and leaves serving alone — nobody
switches off the deployed economy. That puts the entire agreement's weight
on a definition: what is "inference", operationally, such that an operator
cannot run a training program and call it something else? Draft the rule,
then attack it.

- **The operational definition.** Written in terms a verifier can check —
  what is measured, at what boundary, with what thresholds. A definition in
  terms of intent is not a definition.
- **The five edge cases, run in order.** Fine-tuning (small updates to a
  permitted model); distillation (a student trained on the teacher's
  outputs); synthetic-data generation (inference now, training corpus
  later); long-context inference (test-time compute that substitutes for
  weights); and safety research (the exemption every draft wants and every
  evader wants more).
- **The revisions.** Each edge case either survives your rule, forces an
  amendment, or exposes a hole you choose to accept. Record which, and
  why — the revision history is the deliverable's argument.

## Why it exists

Module 2.2 lists workload labels among the things an operator can fake, and
Module 3's repurposed-infrastructure scenario is training disguised as
inference or safety research. Both presume the boundary this brief drafts.
If the definition cannot be written, that is a finding with consequences
for every pause proposal in the literature; if it can, the edge cases say
what enforcing it costs.

## Scope

**In scope:** workload characteristics as publicly understood, one
deployment context held fixed, and definitional drafting with adversarial
testing.

**Out of scope:** the hardware and telemetry that would measure the
boundary — assume the measurements you specify are available, and be
conservative about what you specify. Treaty language and legal drafting
style are also out; this is the operational core a lawyer would later wrap.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Definition | Intent-based | Measurable terms, stated boundary, stated thresholds |
| Edge cases | Mentioned | Each run against the rule with a verdict: survives, amends, or accepted hole |
| Revisions | Silent fixes | The rule's version history, with what each edge case forced |
| Honesty | A watertight claim | The accepted holes listed, with why they were accepted |

## Getting started

1. Write version one of the rule in under an hour and let it be wrong — the
   project's content is the revision history, not the first draft.
2. Take the edge cases in the listed order; each is roughly a harder version
   of the one before.
3. When an edge case defeats the rule, decide explicitly: amend, or accept
   the hole. Undecided holes are how definitions rot.
