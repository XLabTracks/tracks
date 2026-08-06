---
title: When Is Tamper-Evidence Enough?
theme: Verification
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
updated: 2026-08-06
---

## The brief

Tamper-resistance tries to make violation impossible; tamper-evidence only
promises that violation leaves a mark. The second is dramatically cheaper
and available now — seals, logs, one-way counters, broken-on-open
enclosures. The question is institutional, not technical: under what
conditions is a mark, found later, enough?

- **The variables.** Whether the facility is otherwise monitored; how often
  anyone looks (inspection frequency sets time-to-detection); how much harm
  accumulates between violation and discovery; and what actually happens to
  a violator once the mark is found.
- **The comparison.** Monitored versus unmonitored facilities, frequent
  versus rare inspection, reversible versus irreversible harms — worked as
  cases, not abstractions. A seal on a quarterly-inspected rack means
  something different from the same seal in a facility no one revisits.
- **The framework.** The output is a decision rule a regime designer can
  apply: given detection lag, harm accumulation rate, and enforcement
  credibility, tamper-evidence suffices here, and only prevention will do
  there.

## Why it exists

Module 2.1 notes that secure boot and similar mechanisms were designed for
the wrong adversary — governance inverts the threat model, and the owner is
the party being caught. Tamper-evidence sidesteps the hardest part of that
inversion by dropping the demand that hardware defeat its owner, keeping
only the demand that the owner cannot hide having won. Where that weaker
promise suffices, regimes get cheaper and deployable sooner; knowing where
is the design skill this brief trains. It feeds directly into Module 4.1's
layering decisions.

## Scope

**In scope:** existing tamper-evidence mechanisms as a class, and the
institutional arithmetic of detection lag, accumulated harm and enforcement
response.

**Out of scope:** designing new seals or enclosures, and formal security
proofs. The framework consumes mechanism properties; it does not certify
them.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Variables | "It depends" | The named variables, each with its effect on the verdict |
| Cases | One setting | Monitored and unmonitored, frequent and rare inspection, worked through |
| The rule | A vibe | A decision procedure someone else could apply and reach your answer |
| Limits | Unstated | The harms too fast or too irreversible for after-the-fact discovery, named |

## Getting started

1. Write the time line of one violation: mark made, harm accumulating,
   inspection arrives, response lands. Every variable in the framework is a
   segment of that line.
2. Work the friendliest case for tamper-evidence and the most hostile one
   before any middle cases — the framework lives between the two ends.
3. State the enforcement assumption explicitly. Evidence without a credible
   response converts every seal into decoration.
