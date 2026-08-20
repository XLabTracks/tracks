---
title: A Security Case for One Sensor
track: Verification
status: draft
summary: Power, temperature and timing telemetry cannot classify workloads reliably. Build the security case for using one sensor feed anyway.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: A verification security case for one telemetry mechanism
deliverable_type: analysis
mentor: optional
audience: The verifier deciding whether a sensor feed is worth installing.
skills: [security cases, telemetry analysis, adversarial reasoning]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 2.1 — the hardware layer]
sources:
  - "[An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII](https://arxiv.org/abs/2511.10783)"
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.6](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta
(2025)](https://arxiv.org/abs/2511.10783), the precedent discussion for
Article VII, Chip Use Verification. Quoted:

> Analogous perimeter monitoring of data centers can provide some clues
> about operations from power draw, thermal emissions, and network
> bandwidth. But reasonable assurance that restricted AI operations are not
> occurring would likely require some combination of the elements we listed
> under paragraph 1, which includes tamper-proof cameras, on-chip
> hardware-enabled mechanisms, and in-person inspectors.

And from [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Appendix A.6,
on why the signal is hard to read:

> A core problem here is that there is no simple way to deduce an AI chip’s
> rate of computation, even with analog measurements. An AI chip’s
> utilization can vary from below 1% to around 90% depending on workload
> types, hardware, and implementations [169, 62]. Utilization also has a
> complex relationship to analog measurements, in part because of the
> distinction between “model FLOP utilization (MFU)” (which only counts
> unique operations) and “hardware FLOP utilization (HFU)” (which also
> counts recomputed operations).

## What you produce

A verification security case for one perimeter signal — power draw,
thermal emissions, or network bandwidth — stated the way the quotes
require: what the clue supports, under what decision procedure, rather
than the classifier it cannot be.
