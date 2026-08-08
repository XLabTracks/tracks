---
title: How Much Hidden Compute Breaks the Deal?
track: Verification
status: draft
summary: How much concealed compute must a state retain before a pause agreement stops being worth signing? Three scenarios, priced for capability and strategic effect.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Scenario analysis with a sensitivity table
deliverable_type: analysis
mentor: recommended
audience: The delegation deciding how much verification is enough to sign.
skills: [scenario analysis, capability estimation, strategic reasoning]
prerequisites: [Verification 2.3 — the intelligence layer, Verification 3 — covert development, Verification 4.1 — feasibility and layering]
updated: 2026-08-06
---

## The brief

No verification regime finds everything. The question a negotiator actually
faces is not "can they hide compute?" but "does the amount they can hide
matter?" — an agreement survives concealment that is strategically
irrelevant and dies of concealment that is not. Locate the line.

- **Three concealment postures.** A small clandestine cluster; a distributed
  network of sub-threshold sites; one large secret datacenter. For each,
  estimate what it could train or run in a fixed window, and what hiding it
  costs the evader in efficiency, security and detection risk.
- **The capability translation.** Turn hidden compute into hidden
  capability honestly: what the concealed capacity yields relative to the
  frontier at signing time, and how that gap moves over the agreement's
  life.
- **The strategic effect.** When does the hidden capability change
  decisions — the evader's confidence, the detector's response, the
  agreement's collapse conditions? A breakout that arrives too late to
  matter is not a breakout.
- **The sensitivity table.** Which assumptions move the answer: detection
  probability per posture, efficiency of concealed operation, the
  capability-per-compute curve. The table is the deliverable's spine — it
  shows where the conclusion is robust and where it is hostage.

## Why it exists

Module 2.3 rates the footprints concealment leaves; Module 3 catalogues the
postures. This brief asks the question those two modules set up but do not
answer: how much leakage a regime can tolerate before the agreement it
serves loses its point. Module 4.1's layering logic needs that number — it
is the requirement the verification stack is built against.

## Scope

**In scope:** public compute-to-capability reasoning, the three postures
above, and explicit stated-assumption arithmetic.

**Out of scope:** intelligence assessments of any real state's programs,
and classified-adjacent sourcing. The scenarios are constructed, and say so.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Postures | "They could hide compute" | Three postures with size, cost and detection exposure each |
| Capability | FLOPs as the answer | FLOPs translated to capability against a moving frontier, with stated error |
| Strategy | "This would be bad" | The decision each hidden capability actually changes, and when |
| Sensitivity | One scenario, one verdict | The assumptions that flip the verdict, tabulated |

## Getting started

1. Fix the agreement first — what is paused, for how long, measured how.
   "How much hidden compute matters" has no answer without it.
2. Build the smallest posture end-to-end before starting the other two; the
   template transfers.
3. Keep a running list of every number you assumed. That list, priced,
   becomes the sensitivity table.
