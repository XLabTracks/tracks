---
title: Cut the Interconnect, Keep the Inference
track: Verification
status: draft
summary: Disconnect part of the optical links between racks and training stops while inference survives — allegedly. Work out what remains possible and who checks the cables.
team: 1-2
effort_hours: 10-14
duration: 2 weeks
difficulty: core
deliverable: Short protocol design plus a red-team pass on it
deliverable_type: design
mentor: optional
audience: The negotiator who needs an emergency measure that does not kill civilian service.
skills: [protocol design, network reasoning, red-teaming]
prerequisites: [Verification 2.1 — the hardware layer, Verification 3 — covert development]
sources:
  - "[An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII](https://arxiv.org/abs/2511.10783)"
updated: 2026-08-20
---

## The idea, as posed

From [An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta
(2025)](https://arxiv.org/abs/2511.10783), Appendix A, Article VII, Chip
Use Verification. Quoted:

> The CTB may impose various restrictions on how chips can operate in order
> to ensure proper verification. These restrictions may include but are not
> limited to:
>
> Restrictions on the bandwidth and latency between different chips, or
> between chips and their data center network, in order to distinguish
> permitted inference from prohibited training.

The feasibility notes state the asymmetry the measure rides on:

> Various technical methods could be used to make verification easier. For
> example, using the algorithms of 2025, AI training requires much higher
> bandwidth compared to AI inference. Thus, if the chips are connected using
> low-bandwidth networking cables, they are effectively limited such that
> they can engage in inference but not training. There are various nuances
> to these and other mechanisms; we refer curious readers to previous work
> on the topic.

## What you produce

A protocol for imposing and verifying that restriction as an emergency
measure — what gets disconnected, what stays up, how non-reconnection is
checked — plus a red-team pass on how much of the quoted asymmetry
survives contact with a determined operator.
