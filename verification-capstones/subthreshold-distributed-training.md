---
title: Train It in Pieces, Under Every Threshold
track: Verification
status: draft
summary: Evasion scenario 8 says a run can be fragmented below the line. Work out how far that actually goes today, what it costs, and which threshold designs survive it.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Feasibility assessment of fragmented training plus a threshold-design recommendation that survives it
deliverable_type: analysis
mentor: recommended
audience: Whoever writes the threshold, and the verifier who has to enforce it.
skills: [technical feasibility assessment, evasion modelling, threshold design, cost estimation]
prerequisites: [Verification 2.1 — the hardware layer, Verification 3 — covert development, TG week 2 — compute governance]
sources:
  - "[An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article V](https://arxiv.org/abs/2511.10783)"
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1.4](https://arxiv.org/abs/2507.15916)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can AI models be trained using a large number of small compute clusters?](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-20
---

## The idea, as posed

From [An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta
(2025)](https://arxiv.org/abs/2511.10783), Appendix A, Article V, Chip
Consolidation. Quoted:

> Unmonitored AI chips that are not part of a CCC (i.e., that have capacity
> less than 16 H100‑equivalents) may remain outside of CTB‑declared
> facilities, provided that such stockpiles are not aggregated or networked
> to meet the CCC definition, are not rotated among sites to defeat
> monitoring, and are not used for prohibited training. Parties will make
> reasonable efforts to monitor the sale and aggregation of AI chips to
> ensure that any newly created CCCs are detected and monitored and are not
> used for prohibited training.

And from [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), the
verification subgoal this evasion attacks:

> Verify that there are no undeclared uses of large-scale AI compute by (A)
> verifying that the use of known AI data centers is accounted for; and (B)
> verifying that no actor has hidden AI data centers or large, decentralized
> collections of AI chips that can be used for violations.

## What you produce

A feasibility assessment of the evasion the clause anticipates —
aggregating, networking, or rotating sub-threshold stockpiles into a
training run — and the threshold design that survives what you find.
