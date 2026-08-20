---
title: A Cloud KYC Regime That Is Not Just Paperwork
track: Verification
status: draft
summary: Module 2.2 warns that self-reporting alone is a paperwork regime. Design the cloud reporting rules for one provider so that at least one claim in them is actually checkable.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Reporting-rule spec with a per-claim checkability rating and the evasion routes it leaves open
deliverable_type: spec
mentor: recommended
audience: The national regulator drafting the reporting obligation, and the provider who has to implement it.
skills: [regime design, telemetry analysis, evasion modelling, cost-of-compliance analysis]
prerequisites: [Verification 1 — actors, Verification 2.2 — the cloud layer, Verification 3 — covert development]
sources:
  - "[Oversight for Frontier AI through a Know-Your-Customer Scheme for Compute Providers — Egan & Heim (2023)](https://arxiv.org/abs/2310.13625)"
updated: 2026-08-20
---

## The idea, as posed

From [Oversight for Frontier AI through a Know-Your-Customer Scheme for
Compute Providers — Egan & Heim (2023)](https://arxiv.org/abs/2310.13625),
the abstract. Quoted:

> KYC, a standard developed by the banking sector to identify and verify
> client identity, could provide a mechanism for greater public oversight of
> frontier AI development and close loopholes in existing export controls.

The executive summary states the two recommendations this project builds
out:

> Establish a threshold of compute for the scheme that effectively captures
> high-risk frontier model development, while minimizing imposition on
> developers not engaged in frontier AI. The threshold should be defined by
> the total amount of computational operations – a metric easily accessible
> to compute providers, as they employ chip-hours for client billing,
> convertible to total computational operations. Additionally, this
> threshold would need to be dynamic and subject to periodic reassessments
> by government, in close consultation with industry, to remain in step with
> developments in training efficiency as well as broader societal changes.
> It would also need to be supported by collaboration between compute
> providers, as well as with government, to minimize evasion risks.
>
> Set clear requirements for compute providers, including requirements for
> gathering information, implementing fraud detection, keeping records, and
> reporting to government any entities that match government-specified
> ‘high-risk’ profiles. These requirements should be technically feasible,
> resilient against efforts to evade detection and enforceable, while
> preserving privacy.

## What you produce

The reporting-rule spec the quoted requirements call for: what a provider
must gather, keep and report, each claim rated for how checkable it
actually is, and the evasion routes the rule leaves open — with the quoted
threshold's drift handled rather than assumed away.
