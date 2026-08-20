---
title: What Counts as a New Model?
track: Technical Governance
status: draft
summary: A registry has to say when an update becomes a new entry. Draw the line, test it against a year of real releases, and say what each side of it costs.
team: 1-2
effort_hours: 12-16
duration: 2 weeks
difficulty: core
deliverable: Registry threshold rule, back-tested against a year of real model updates, with the cost either way
deliverable_type: spec
mentor: optional
audience: Whoever operates the registry, and the developer deciding whether this checkpoint needs filing.
skills: [definition design, back-testing a rule, regulatory administrability, technical judgement]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), §5.3.2, tracking versioning and updates: what a registry should store, and how it could be verified](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-20
---

## The idea, as posed

From [Open Problems in Technical AI Governance — Reuel et al.
(2025)](https://arxiv.org/abs/2407.14981),
§5.3.2, Verification of Dynamic Systems. Quoted:

> Motivation: Modern AI systems, such as ChatGPT, are not based on static
> models. Rather, they consist of multiple models and components, for
> example, mixture-of-experts, input filters, and output filters, that
> undergo change throughout their life cycle. This poses an oversight
> challenge due the ever-changing nature of many systems throughout their
> deployment life cycle. Having a reliable, accessible process for
> versioning could help to monitor system updates and their impacts.

The open problem it lists:

> Tracking versioning and updates. Key open questions in this context
> relate to how model versioning and post-deployment modifications should
> be kept track of, especially for models that undergo frequent updates.
> One approach could be to have registries that track models over time,
> however, it’s not clear what information should be stored in such a
> registry, nor how the information could be verified. Other approaches
> that can be useful as a starting point to verify dynamic models include
> reward reports for reinforcement learning (Gilbert et al. 2023),
> ecosystem graphs (Bommasani et al. 2023c), or instructional
> fingerprinting of foundation models (Xu et al. 2024).

## What you produce

The threshold rule the open problem needs: what counts as an update worth
filing, back-tested against a year of real model updates, with the filing
volume each candidate rule produces — a concrete answer to how versioning
and post-deployment modifications should be kept track of for models that
undergo frequent updates.
