---
title: Prove Compliance Without Handing Over the Model
track: Verification
status: draft
summary: Module 2.0's whole problem in one artifact — pick one claim a developer must prove, and specify how to prove it without disclosing weights, data, or a trusted enclave.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: advanced
deliverable: Protocol sketch for one claim, with the trust assumptions and the residual disclosure named
deliverable_type: spec
mentor: required
audience: The regulator who needs the assurance and the developer who cannot hand over the asset.
skills: [protocol reasoning, trust-assumption analysis, cryptographic literacy, feasibility assessment]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 2.1 — the hardware layer, Verification 4.1 — feasibility and layering]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §4.1.1.1](https://arxiv.org/abs/2507.15916)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), verification questions: what methods can verify compute usage without TEEs; can ZKPs demonstrate compliance without disclosing architectural details; how can TEEs be designed to limit misuse](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Section
4.1.1.1, Prerequisites: Hardware Security Features. Quoted:

> Confidential Computing: Confidential Computing is a hardware feature that,
> among other uses, can allow multiple parties to share their information
> only for specific purposes. This could enable a Verifier to run tests on a
> Prover’s models, data, and code—with the Prover knowing their information
> will not be stolen, and with the Verifier knowing their tests will be run
> faithfully and will not be viewed for the sake of manipulating test
> results.
>
> Confidential Computing (or more precisely, one of its functionalities) is
> intended to work as follows. First, multiple parties share their encrypted
> data, giving access only to a specific computer program on specific
> hardware. (They can scrutinize this program’s code in advance.) Then,
> hardware features ensure the program is executed faithfully and without
> leaks. Finally, a digital signature confirms that the test results came
> from this approved program [41, 79].

## What you produce

One claim worked through the quoted machinery and its fallbacks — trusted
hardware, a cryptographic protocol without it, and managed human access
when neither is ready: the protocol sketch, exactly who must be trusted
about what on each route, and the residual disclosure each route still
charges.
