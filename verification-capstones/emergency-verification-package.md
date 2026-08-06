---
title: A Verification Package You Could Ship in a Year
theme: Verification
status: draft
summary: Twelve months, no new chips. Assemble the verification package that could actually be deployed, and state plainly what it still cannot see.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Prioritized implementation roadmap with residual gaps stated
deliverable_type: spec
mentor: recommended
audience: The task force told to stand up verification this year, not next.
skills: [regime design, feasibility triage, gap analysis]
prerequisites: [Verification 2.x — the four layers, Verification 4.1 — feasibility and layering]
updated: 2026-08-06
---

## The brief

Most of the verification literature assumes time: new silicon, new
institutions, new treaties. Suppose instead the decision lands now and the
deadline is twelve months, with the hardware fleet as it is. What do you
actually deploy? Assemble the package from what exists — physical measures
on facilities, cameras, network controls, inspection teams, intelligence
collection — and be exact about what it cannot see.

- **The inventory.** Candidate measures that need no new chips: seals and
  physical disconnection, camera coverage of machine rooms, network-level
  controls at facility boundaries, declared-facility inspections on a
  schedule, and the intelligence layer run against undeclared sites.
- **The triage.** For each measure: deployment time, cost, who must
  cooperate, and what class of violation it actually catches. Twelve months
  is a budget — spending it is the design decision.
- **The sequencing.** What ships in month one, what needs the full year,
  and which measures only work once another is in place. A roadmap, not a
  wish list.
- **The residual gaps.** The violations the package does not catch, stated
  as plainly as the ones it does. The gaps section is what makes the
  roadmap honest — and it is the requirements list for year two.

## Why it exists

Module 4.1 asks the sequencing question directly: what works for an MVP
emergency pause versus what needs years of institution-building. This brief
is that question taken literally, with the four layers of Module 2 as the
parts bin. The discipline it trains — feasibility triage under a deadline,
with gaps stated rather than papered over — is the difference between a
regime design and a regime sketch.

## Scope

**In scope:** measures deployable against existing hardware and facilities
within twelve months, and honest reasoning about institutional lead times —
hiring inspectors takes months too.

**Out of scope:** new hardware mechanisms, treaty negotiation timelines,
and any assumption that a measure exists because a paper proposed it. If it
cannot be bought, built or staffed inside the year, it belongs in the gaps
section.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Inventory | Everything ever proposed | Only what deploys in twelve months, with the lead time argued |
| Triage | A feature list | Time, cost, cooperation and coverage per measure, comparable |
| Sequencing | A pile | Month-by-month, with dependencies between measures explicit |
| Gaps | A caveat sentence | The uncaught violations enumerated, feeding a year-two requirements list |

## Getting started

1. Start from the violation classes, not the measures — the package exists
   to catch things, and the gaps section is built from whatever the chosen
   measures miss.
2. Put an institutional lead time on every measure before comparing any two.
   Cameras arrive in weeks; inspectorates do not.
3. Write the residual-gaps section at the end of week two, not the end of
   the project — it will reorder your priorities while there is still time
   to act on it.
