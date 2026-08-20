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
sources:
  - "[An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII](https://arxiv.org/abs/2511.10783)"
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.7](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta
(2025)](https://arxiv.org/abs/2511.10783), the notes on Article VII, Chip
Use Verification:

> Parties would want to ensure that existing AI chips are not being used to
> do dangerous AI training. There are legitimate reasons to use these chips
> to run existing AI services like (extant versions of) ChatGPT. The
> agreement thus requires the ability to verify that AI chips are only being
> used for permitted activities.

The article's text writes the distinction as an operating restriction:

> Restrictions on the number or rate of FLOP/s or memory bandwidth at which
> chips can operate, in order to distinguish permitted inference from
> prohibited training or other prohibited workloads.

And [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Appendix A.7,
poses the boundary problem the rule has to survive:

> Data center GPUs can be used for a variety of workloads beyond AI, raising
> the question of how a Verifier could distinguish these non-AI workloads
> from AI workloads. At a high level, options include:

## What you produce

The operational rule the quoted restrictions assume: a definition of
permitted inference that an operator cannot stretch to cover a training
program, five edge cases run against it, and the revisions they force.
