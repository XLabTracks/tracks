---
title: Can You Prove This Model Came From That Run?
track: Verification
status: draft
summary: Proof-of-learning is in Module 2.1 as fragile and spoofed; model-heritage inference is an open problem next door. Assess what either can support and what a regime could rest on them.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Feasibility assessment of training-provenance claims, with the claims each method can and cannot carry
deliverable_type: dossier
mentor: recommended
audience: The regulator asked to accept "this is the model we evaluated" as established fact.
skills: [feasibility assessment, provenance reasoning, adversarial analysis, evidence standards]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 2.1 — the hardware layer]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.4](https://arxiv.org/abs/2507.15916)"
  - "[Open Technical Problems in Open-Weight AI Model Risk Management (2025), §4.5 model provenance and forensics: model heritage inference, and how practical and scalable proof-of-training methods are](https://openreview.net/forum?id=8QyGLnFkzc)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Appendix A.4,
Partial Workload Re-Execution With Constraints. Quoted:

> Background: A Verifier may wish to verify that a declared workload was
> actually run (Subgoal 1.A). For example, a Prover may make claims about
> what training code, data, and intermediate results (e.g., model weight
> checkpoints) were involved in training some model weights, and the
> Verifier may wish to verify these claims [110, 34].
>
> The Verifier can do this by verifying faithfulness, i.e., that running the
> declared workload in fact produces the claimed results, and uniqueness,
> i.e., that a faithful declaration is infeasible to produce in practice
> except by actually running the declared workload [34].
>
> The Verifier can verify faithfulness and uniqueness, respectively, via (1)
> partial workload re-execution, i.e., re-running (randomly sampled parts
> of) the Prover’s program to check if the declared results are
> approximately reproducible, and (2) constraints, i.e., checking that the
> declaration meets constraints which rule out spoofed declarations.

## What you produce

A feasibility assessment on the quoted decomposition: which
training-provenance claims faithfulness-plus-constraints can carry today,
which they cannot, and what would have to change — in the constraints, the
hardware, or the claims themselves — to close the gap.
