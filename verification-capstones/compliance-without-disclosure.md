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
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), verification questions: what methods can verify compute usage without TEEs; can ZKPs demonstrate compliance without disclosing architectural details; how can TEEs be designed to limit misuse](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-04
---

## The brief

Module 2.0 sets out the layer that confirms a claim without surrendering the
secret: hardware-anchored attestation, zero-knowledge proofs, secure multiparty
computation — and, when none of those is ready, the institutional fallback of
managed access. Pick one claim and work the whole stack against it.

Choose a claim of the form *"this training run used no more than X"*, *"this
model was trained without dataset D"*, or *"the deployed model is the one that
was evaluated"*. Then:

- **The three routes.** Sketch how the claim could be established (a) with a
  trusted execution environment, (b) with a cryptographic protocol and no
  trusted hardware, (c) with managed access — a human inspector under
  confidentiality, which is what the chemical-weapons regime settled on when
  the cryptography did not exist.
- **The trust assumptions.** Per route, exactly who must be trusted and about
  what. TEEs move trust to the silicon vendor; a protocol moves it to an
  implementation and a setup; managed access moves it to an institution and a
  person. None of them removes trust, and saying where it went is the core of
  the deliverable.
- **The residual disclosure.** What the verifier learns beyond the claim.
  Every route leaks something — timing, size, the fact that a query was made —
  and a regime that promised zero disclosure and delivers some has a credibility
  problem, not a technical one.
- **The misuse read.** TAIG asks this directly: verification infrastructure
  built for compliance is surveillance infrastructure pointed somewhere else.
  Say what your route could be repurposed to do, and what constrains it.
- **The verdict.** Which route you would build now, which in five years, and
  what you would tell a regulator who asked for the assurance today.

## Why it exists

This is Module 2.0's question at full weight, and it is the hardest capstone in
the Verification track — the only one marked advanced. The reason is that the
tempting answers are all wrong in the same way: they relocate trust and describe
that as removing it.

It is also live. The claims above are exactly the ones frontier safety
frameworks and draft regimes assume can be established, and the assumption is
mostly unexamined.

## Scope

**In scope:** the published literature on ZKPs for ML, TEEs on accelerators,
proof-of-learning, secure multiparty computation, and arms-control managed
access as the institutional comparison.

**Out of scope:** implementing anything, and novel cryptography. You are
assessing feasibility and trust structure, not building a protocol. Cite the
primitives; do not invent them.

**A concrete warning.** The literature here is fast-moving and full of results
that hold under assumptions the governance use-case breaks — most obviously,
schemes that assume an honest prover, when the whole point is that the prover is
the party you are checking. Flag every such assumption where you find it.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The claim | "Verify compliance" | One claim, stated precisely enough to be provable or not |
| Trust | "Trustless verification" | Per route, who is trusted about what, stated plainly |
| Residual disclosure | Claimed to be zero | Named per route, including the metadata leaks |
| Verdict | Picks the most elegant route | Picks the one available now, and says what it costs in assurance |

## Getting started

1. Write the claim in one sentence and keep rewriting until it is falsifiable.
   Most of this literature's confusion is claims that were never pinned down.
2. Do the managed-access route first. It is the least glamorous and the only
   one that has ever actually run, and it calibrates the other two.
3. For every scheme you cite, find its threat model and check whether the
   prover is assumed honest. That single check reorders the whole assessment.
