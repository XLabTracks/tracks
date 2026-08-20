---
title: When the Weights Are Already Out
track: Verification
status: draft
summary: Module 3 rates weight exfiltration as the evasion route that bypasses the compute regime entirely. Specify what a verification regime does the day after it happens.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Post-exfiltration regime annex — what is still verifiable, what is not, and what the agreement should have said
deliverable_type: spec
mentor: recommended
audience: The parties to an agreement whose central mechanism has just been routed around.
skills: [regime design, ecosystem monitoring, threat modelling, evidence standards]
prerequisites: [Verification 2.x — the four layers, Verification 3 — covert development, Verification 4.1 — feasibility and layering]
sources:
  - "[Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026), abstract and §4.5, Model Provenance and Forensics](https://arxiv.org/abs/2608.07514)"
  - "[Open Technical Problems in Open-Weight AI Model Risk Management (2025)](https://openreview.net/forum?id=8QyGLnFkzc)"
updated: 2026-08-20
---

## The idea, as posed

From [Open Technical Problems in Open-Weight AI Model Risk Management —
Casper et al. (2026)](https://arxiv.org/abs/2608.07514),
abstract. Quoted:

> However, managing their risks is also challenging because they can be
> modified arbitrarily, used without oversight, and spread irreversibly.
> Currently, there is limited research on safety tooling specific to
> open-weight models. Addressing these gaps will be key to both realizing
> their benefits and mitigating their harms. In this paper, we present 16
> open technical challenges for open-weight model safety involving
> training data, training algorithms, evaluations, deployment, and
> ecosystem monitoring.

The layer a verification regime falls back on once weights are loose is
the last of those — §4.5, Model Provenance and Forensics:

> Model provenance methods help stakeholders study the spread and uses of
> open-weight models. While not directly upstream of model releases,
> ecosystem monitoring methods are a key component of risk management
> because they help stakeholders better study the real-world uses and
> impacts of models. Model provenance and forensics in the open-weight AI
> ecosystem are key to answering questions such as “What model is this?”
> and “What modifications has it undergone since its original release?”

## What you produce

The annex those passages force: what each verification layer still sees
once the artifact has spread, the provenance and forensics observations
that partially replace it — What model is this? What modifications has it
undergone since its original release? — the claim a verifier can still
make and the sentence it must retire, and the ex-ante custody clause the
agreement should have carried.
