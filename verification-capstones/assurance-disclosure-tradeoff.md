---
title: What Assurance Costs in Secrets
theme: Verification
status: draft
summary: Every verification mechanism buys confidence by spending the operator's secrets. Price the exchange rate across inspections, taps, telemetry, trusted hardware and recomputation.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Assurance × disclosure × intrusiveness matrix
deliverable_type: analysis
mentor: recommended
audience: The operator and verifier negotiating what must be shown for what assurance.
skills: [mechanism comparison, privacy analysis, trade-off mapping]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 2.x — the four layers]
updated: 2026-08-06
---

## The brief

Confidentiality versus verifiability is usually stated as a tension and left
there. State it as a price list instead. For each level of confidence a
verifier might want in a compliance claim, what does the operator have to
disclose, and how deep does the mechanism reach into the facility?

- **The mechanisms.** Five, compared like for like: on-site inspections,
  network taps, sensor telemetry, trusted-hardware attestation, and
  randomized recomputation of declared work. Same compliance claim held
  fixed across all five.
- **The three axes.** Assurance: what confidence the mechanism can actually
  deliver against a motivated evader, not its brochure claim. Disclosure:
  which secrets it spends — weights, code, customer data, utilization
  patterns, facility layout. Intrusiveness: what running it does to
  operations, from nothing to inspectors on the floor.
- **The dominated options.** The matrix exists to expose them: mechanisms
  that cost more disclosure than an alternative for no more assurance.
  Finding two of those is worth more than scoring all five politely.
- **The frontier.** The combinations that remain when dominated options
  fall away — the actual menu a negotiation chooses from, and where on it
  the current proposals in the literature sit.

## Why it exists

Module 2.0 introduces the tension and the cryptographic tools that promise
to dissolve it; Modules 2.1–2.3 each carry mechanisms that spend secrets
differently. What the track does not hand the learner is a single table
where the exchange rates are visible side by side. This brief builds that
table, and building it forces the honest version of every mechanism's
assurance claim.

## Scope

**In scope:** the five mechanisms as described in the public literature,
one fixed compliance claim, and reasoned scoring with the reasoning shown.

**Out of scope:** inventing new cryptographic protocols, and vendor-level
detail on any particular trusted-hardware product.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Comparability | Five essays | One claim, five mechanisms, three axes, same scale |
| Assurance | Brochure claims | Confidence against a motivated evader, argued per mechanism |
| Disclosure | "Some data" | The specific secrets spent, named per mechanism |
| The frontier | A tie | Dominated options called out, and the real menu drawn |

## Getting started

1. Fix the compliance claim first and keep it boring — "no training runs
   above X in this facility" serves better than anything clever.
2. Score disclosure by listing the secrets a hostile reader of the feed
   could extract, not the ones the mechanism nominally requests.
3. Look for dominance before polishing scores. The matrix's job is to
   collapse the menu, not to admire it.
