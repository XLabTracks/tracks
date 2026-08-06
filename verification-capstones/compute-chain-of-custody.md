---
title: Steal a Chain of Custody From Another Industry
theme: Verification
status: draft
summary: Other industries already track dangerous things through many hands. Take one working custody regime apart and report what transfers to compute — and what does not.
team: 1-2
effort_hours: 14-18
duration: 3 weeks
difficulty: core
deliverable: Case study of one custody regime plus a transfer analysis for the compute supply chain
deliverable_type: dossier
mentor: optional
audience: Whoever is designing chip tracking and does not want to reinvent forty years of practice.
skills: [analogical reasoning, regime analysis, precedent critique]
prerequisites: [Verification 1 — actors, Verification 2.1 — the hardware layer]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 66: learning from chain of custody applications in other industries](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-04
---

## The brief

Chip registries and supply-chain tracking sit in Module 2.1 as proposals. Other
sectors have been doing custody accounting for decades, under adversarial
pressure, with audits and penalties: nuclear material accountancy, controlled
pharmaceuticals, conflict minerals, firearms, hazardous waste, precursor
chemicals. Pick one and take it apart.

- **The case study.** How the regime actually works. What is the unit of
  account, who records a transfer, what triggers reconciliation, what happens
  when the books do not balance, and what the measured discrepancy rate is —
  every real regime has one, and it is the most useful number in your dossier.
- **The failure history.** How the regime has been defeated, and what it
  changed in response. Regimes are shaped by their scandals; the current design
  is unreadable without them.
- **The transfer analysis.** Feature by feature: what carries over to
  high-end AI accelerators and what does not. Compute has properties these
  regimes did not face — units that are useful individually rather than in
  bulk, a legitimate second-hand market, rapid obsolescence, a supply chain
  with a handful of upstream nodes and thousands of downstream ones, and the
  fact that the thing you ultimately care about is a workload, not an object.
- **The recommendation.** One mechanism worth importing, one worth explicitly
  rejecting, and the reason for each.

Similar card: [Stock and Flow Accounting Case
Studies](/verification/capstone-bank#stock-and-flow-accounting) — the
neighbouring idea in the same collection, on registration-and-transfer
tracking regimes.

## Why it exists

The track's method is to ask what each mechanism can actually prove. Custody
accounting is the mechanism the compute-governance literature reaches for most
casually and has studied least, and the sectors that do it have already found
the failure modes — usually the boring ones, involving paperwork and
reconciliation intervals rather than clever attacks.

Analogical reasoning done properly is also a track-level skill: it is the same
move as the treaty-clause capstone, where the disanalogies are the deliverable.
An analogy whose limits you have mapped is a tool. One you have not is a way to
be confidently wrong.

## Scope

**In scope:** one custody regime, its public regulations, audit reports and
academic evaluations, plus the compute supply-chain material from Module 1.

**Out of scope:** designing the compute regime itself. Your output is the
input someone else's design needs. Also out of scope: surveying three regimes
shallowly — one, to the point where you know its discrepancy rate, beats three
summaries.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The case study | How the regime is supposed to work | How it works, including its measured discrepancy rate and reconciliation cadence |
| Failure history | Omitted | Named incidents and the design changes each produced |
| Transfer | "Lessons apply broadly" | Feature by feature, with the disanalogies given equal space |
| Recommendation | Everything is applicable | One import, one explicit rejection, both reasoned |

## Getting started

1. Choose the regime by how much public audit material exists, not by how
   apt the analogy feels. You need the discrepancy numbers.
2. Read the scandals before the regulations. They tell you which provisions are
   load-bearing.
3. Write the disanalogy list halfway through, and let it decide what is left
   worth writing up.
