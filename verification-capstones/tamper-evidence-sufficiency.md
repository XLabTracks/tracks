---
title: When Is Tamper-Evidence Enough?
track: Verification
status: draft
summary: Tamper-proof hardware is expensive and unsolved; tamper-evident is neither. In which institutional settings is finding out afterwards actually sufficient?
team: 1-2
effort_hours: 10-14
duration: 2 weeks
difficulty: core
deliverable: Decision framework
deliverable_type: analysis
mentor: optional
audience: The regime designer deciding where prevention is worth its cost.
skills: [institutional design, inspection economics, risk analysis]
prerequisites: [Verification 2.1 — the hardware layer, Verification 4.1 — feasibility and layering]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §4.1.1.1 and §4.2.1.1](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Section
4.1.1.1, Prerequisites: Hardware Security Features. Quoted:

> The verification mechanisms we consider require a hardware security
> feature known as secure boot, which must be at least tamper-evident (i.e.,
> impractical to discreetly disable or undermine). They would further
> benefit from Confidential Computing and tamper-proofing, though these are
> not required.
>
> Secure boot: Secure boot aims to guarantee that a chip will only run with
> approved system software (i.e., firmware and operating system). System
> software can constrain a chip’s behavior throughout operation, so secure
> boot could be used to ensure that a chip will always behave in ways that
> facilitate verification. Secure boot implementations are especially
> promising for this if they: (i) are at least tamper-evident, with regards
> to both physical and digital tampering (so, unless they are also
> tamper-proof, random inspections would be needed to check for tampering);
> and (ii) include a secure private key, allowing the system software to
> digitally sign messages.

The off-chip analysis leans on the same bargain:

> Conversely, for Verifiers to be confident in the devices’ integrity, they
> could rely on measures such as Verifier-trusted supply chains, mutual
> vetting (similar to Provers’ vetting), tamper-evident enclosures (a random
> sample of which would be routinely inspected), and ideally
> tamper-proofing.

## What you produce

The decision framework the quoted design leaves implicit: under what
inspection cadence, sampling rate and response time a mark found later is
enough — and when nothing short of tamper-proofing will do.
