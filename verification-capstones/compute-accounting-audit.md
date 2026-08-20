---
title: A Minimum Viable Compute-Accounting Audit
track: Verification
status: draft
summary: What should a commercial AI audit prove about how each GPU was used? Claims, logs, retention, auditor access — and what happens when logs are missing.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Draft auditing standard, 2–3 pages
deliverable_type: spec
mentor: optional
audience: The audit firm that has to say what its stamp proves.
skills: [audit design, evidence standards, logging requirements]
prerequisites: [Verification 1 — actors, Verification 2.2 — the cloud layer]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.6 and Appendix B.1](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Appendix A.6,
Compute Accounting via Analog Sensors. Quoted:

> Background: In compute accounting, one verifies the amount of AI compute
> used by a Prover, and verifies that a high fraction of this compute use
> can be accounted for by declared uses. Ideally, the declared AI compute
> use would add up to 100% of the AI compute use. If a sufficiently high
> fraction of compute use can be accounted for, this implies the Prover
> cannot have done large-scale, undeclared use of AI compute, among the
> computing clusters being accounted for. Off-chip analog sensors could
> enable three partly compatible approaches to compute accounting (Table
> 13), if combined with other mechanisms (such as partial workload
> re-execution, Appendix A.4) for verifying declared uses and ensuring the
> integrity of analog sensors (Section 4.2.1.1).

Appendix B.1 states why compute, of all inputs, is the one to account for:

> AI compute is relatively specialized and large in its physical footprint,
> making it more suitable to being accounted for than other resources used
> in AI development and deployment (Table 16).

## What you produce

The auditing standard compute accounting does not yet have: what records
an operator must keep, what the auditor checks, and what an audit opinion
does and does not certify about the accounted fraction the quote defines.
