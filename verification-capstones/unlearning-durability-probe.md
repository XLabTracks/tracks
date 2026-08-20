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
  - "[Open Problems in Machine Unlearning for AI Safety — Barez et al. (2025), on robustness to relearning](https://arxiv.org/abs/2501.04952)"
updated: 2026-08-20
---

## The idea, as posed

From [Open Problems in Machine Unlearning for AI Safety — Barez et al.
(2025)](https://arxiv.org/abs/2501.04952),
on evaluating removal and its robustness. Quoted:

> Simple metrics that check whether models can reproduce specific training
> examples fail to capture the deeper challenges of unlearning in
> safety-critical contexts. When models undergo modifications, face
> adversarial attacks, or encounter unusual inputs, unlearned capabilities
> can unexpectedly resurface - particularly in cases where the unlearning
> relied on fine-tuning or basic parameter adjustments (Hu et al. 2024;
> Łucki et al. 2024; Deeb and Roger 2024). This happens because these
> methods typically mask rather than eliminate capabilities, leaving the
> fundamental neural patterns that enable them largely untouched (Jain et
> al. 2023). More rigorous standards are helpful in addressing these
> limitations. This includes ensuring that forgotten knowledge cannot be
> recovered, does not reappear during extended interactions, and remains
> inaccessible even in new contexts or under adversarial pressure.

And on how current methods fare against exactly that standard:

> Even when effective, unlearning can be surprisingly vulnerable to
> fine-tuning and could quickly relearn the hazardous knowledge (Lo et al.
> 2024; Lynch et al. 2024; Deeb and Roger 2024), even if fine-tuned on
> small amount of benign, unrelated data (Łucki et al. 2024; Hu et al.
> 2024). This suggests that existing techniques have a limited ability to
> thoroughly remove hazarous knowledge from LLMs. It also poses a
> significant challenge to the safety of open-source models or proprietary
> models that can be fine-tuned (Achiam et al. 2023). Some works have
> aimed to perform unlearning in a way that is more robust to
> post-deployment tampering (Deng et al. 2024; Henderson et al. 2023;
> Huang et al. 2024c; Rosati et al. 2024b; Rosati et al. 2024a; Tamirisa
> et al. 2024). However, these existing methods suffer from major
> tradeoffs with efficiency, stability, and performance on benign tasks.
> Establishing benchmarks and improving techniques for tamper-resistant
> unlearning is an ongoing challenge.

## What you produce

The probe those passages call for, run at small scale: one published
method reproduced, a deliberate attempt to recover the removed capability
— fine-tuning on a small amount of data included — and the relearning cost
reported as the number a release memo can carry, with the
tamper-resistance claim it does and does not support.
