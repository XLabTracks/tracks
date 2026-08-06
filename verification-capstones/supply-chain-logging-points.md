---
title: Where Should the Supply Chain Keep Logs?
track: Verification
status: draft
summary: Manufacturing logs are cheap to demand and easy to drown in. Find the point in the semiconductor chain where credible logs buy the most information for the least trust.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Ranked chokepoint matrix
deliverable_type: analysis
mentor: optional
audience: The regulator choosing where in the supply chain to demand records.
skills: [supply-chain analysis, comparative ranking, measurement design]
prerequisites: [Verification 1 — actors, Verification 2.1 — the hardware layer]
updated: 2026-08-06
---

## The brief

"Log the supply chain" is a slogan until someone says where. Each stage —
lithography, advanced packaging, high-bandwidth memory, networking
equipment, final assembly — differs in how many firms sit there, what a
unit of output even is, how hard the records are to fake, and how long a
diversion stays invisible. Rank them.

- **The criteria, fixed first.** Concentration (how few actors must
  comply), measurability (is there a countable unit — wafers, stacks,
  switches — or a judgement call), forgeability (what faking the records
  costs, and who would have to collude), and detection lag (how long
  between a false entry and a contradiction arriving from elsewhere in the
  chain).
- **The stages, scored.** Each stage against each criterion, with a
  sentence of reasoning per cell — the matrix is an argument, not a
  spreadsheet.
- **The cross-checks.** Logs earn credibility where independent records can
  contradict them: a stage's output is another stage's input. Say which
  pairs of logging points check each other and which stand alone.
- **The recommendation.** One or two stages where a logging requirement
  would bind soonest, and what the requirement would actually say.

## Why it exists

Module 1 puts the supply chain's bottleneck structure at the center of the
verifier's map; Module 2.1 lists chip registries and supply-chain tracking
among the hardware layer's mechanisms. Between the two sits an unexamined
choice — where records do the most work — and this brief makes the choice
explicitly, with criteria that survive being argued against.

## Scope

**In scope:** public supply-chain structure at the named stages, and
reasoning about record-keeping burdens from how those industries already
operate.

**Out of scope:** firm-level confidential detail, and export-control legal
design. The matrix informs where a rule would attach, not how to draft it.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Criteria | Implied | Four named criteria, defined before any scoring |
| Scores | Adjectives | Cells with a stated reason each, comparable across stages |
| Cross-checks | Absent | The pairs of logs that contradict each other, mapped |
| Verdict | "Log everything" | One or two attachment points, with the requirement sketched |

## Getting started

1. Define the unit of output per stage before scoring anything —
   measurability collapses without it.
2. Score forgeability as a cost, not a possibility: who colludes, what it
   costs them, what exposure they carry.
3. Draw the cross-check map before writing the recommendation; a stage that
   nothing contradicts should make you nervous, not confident.
