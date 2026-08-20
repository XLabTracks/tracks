---
title: Spot a Training Run Without Looking Inside It
track: Verification
status: draft
summary: Could a verifier tell a large training run from utilisation signatures alone — no workload access, no code? Work out what the signature is and how cheaply it is faked.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Signature analysis with a detection-rule sketch and the spoofing cost for each signal
deliverable_type: analysis
mentor: recommended
audience: The verifier who will never be allowed to see the workload.
skills: [signature analysis, privacy-preserving verification, detection reasoning, adversarial cost modelling]
prerequisites: [Verification 2.1 — the hardware layer, Verification 2.2 — the cloud layer, Verification 3 — covert development]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1.4 and §4.2.1.2](https://arxiv.org/abs/2507.15916)"
  - "[An International Agreement to Prevent the Premature Creation of Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta (2025), Appendix A, Article V](https://arxiv.org/abs/2511.10783)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can large training runs be detected while retaining developer privacy, e.g. through signatures in processor utilisation?](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Key Findings.
Quoted:

> Verify that there are no undeclared uses of large-scale AI compute by (A)
> verifying that the use of known AI data centers is accounted for; and (B)
> verifying that no actor has hidden AI data centers or large, decentralized
> collections of AI chips that can be used for violations.

Section 4.2.1.2 names the signals such a check reads:

> Off-chip analog sensors for compute accounting (Appendix A.6): Off-chip
> sensors could log measurements such as AI chips’ power draw. The Verifier
> could then analyze these measurements with secured chips, testing for
> several signs of large, undeclared compute use: declared workloads would
> appear unnecessarily slow, AI chips would use more power than needed for
> the declared workloads, and/or the detailed physical signatures of chips
> would be different than expected. In other words, the Verifier would use
> analog measurements to verify the total number of operations or chip-hours
> done and check if approximately all of them can be “accounted for” by
> declared uses. There are various complications in implementing these
> checks.

And [An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence — Scher, Abecassis, Barnett & Abeyta
(2025)](https://arxiv.org/abs/2511.10783) states what scale is findable at
all:

> It looks feasible to verifiably consolidate the majority of AI chips. The
> very largest AI data centers, such as those with more than 100,000
> H100-equivalents, are hard to hide. They are detectable from their
> physical footprint and power draw, and many of them are publicly reported
> on. In fact, it’s probably possible for intelligence services to track and
> locate data centers as small as around 10,000 H100-equivalents. Locating
> smaller data centers would involve domestic authorities using various
> powers in cooperation with CTB inspectors.

## What you produce

The signature analysis behind the quoted subgoal: which signals —
unnecessarily slow declared workloads, excess power, unexpected physical
signatures, physical footprint — carry a workable detection rule, and the
spoofing cost of each.
