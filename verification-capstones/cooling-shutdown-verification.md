---
title: Does Switching Off the Cooling Switch Off the Training?
track: Verification
status: draft
summary: An inspector confirms the cooling is off. Under what conditions does that actually rule out a large training run — and how would an operator get around it?
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Threat model with a claim → observable → evasion → countermeasure table
deliverable_type: analysis
mentor: optional
audience: The inspectorate asked to certify that a halt is actually a halt.
skills: [threat modelling, physical-layer reasoning, evasion analysis]
prerequisites: [Verification 2.1 — the hardware layer, Verification 3 — covert development]
sources:
  - "[An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article VII](https://arxiv.org/abs/2511.10783)"
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.6](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta
(2025)](https://arxiv.org/abs/2511.10783), Appendix A, Article VII, Chip
Use Verification. Quoted:

> In cases where the CTB assesses that current verification methods cannot
> provide sufficient assurance that the AI hardware is not being used for
> prohibited activities, AI hardware must be powered off, and its
> non-operation continually verified by in-person inspectors or other
> CTB-approved verification mechanisms.

And from [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), a footnote to
Appendix A.6 on what physical observation adds:

> Inspections may also be needed to ensure that e.g., a data center or
> server rack does not have hidden power cables, nor unmetered backup
> generators. Measured power draw could be sanity checked based on
> observations or other measurements of cooling infrastructure, electrical
> infrastructure, and heat emissions.

## What you produce

The threat model behind verified non-operation: what a cooling shutdown
lets an inspector actually conclude, the claim, observable, evasion and
countermeasure table for it, and where the quoted power-off requirement
still leaks.
