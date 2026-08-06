---
title: How Much Leaks Through the Export Controls?
theme: AI Governance Policy
status: draft
summary: Everyone agrees chips get around export controls; nobody has bounded it. Build the estimate from public evidence, with the uncertainty stated and the enforcement gap named.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Bounded estimate of circumvention volume, its evidence base, and an enforcement recommendation
deliverable_type: analysis
mentor: recommended
audience: The enforcement agency deciding where to put a small number of investigators.
skills: [open-source estimation, triangulation, trade-data literacy, reasoning under adversarial reporting]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 70: extent of export control circumvention](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-04
---

## The brief

Week 4 covers export controls and their enforcement, including smuggling. The
open question underneath the whole policy is quantitative: how much gets
through? Nobody has published a defensible bound, which means the debate is
conducted entirely in anecdotes — a seizure here, a shell company there.

Build the estimate.

- **The routes.** Transshipment through third countries, shell purchasers,
  cloud access as a substitute for possession, second-hand and grey markets,
  smuggled units in small consignments, and rented capacity abroad. Each is a
  different measurement problem.
- **The evidence, triangulated.** Trade statistics and their mirror-data
  discrepancies, enforcement actions, corporate disclosures, datacentre
  buildout reporting, job postings, and public claims from the destination
  side. Every source here is either self-interested or partial; say which for
  each.
- **The bound.** A range, not a number, with the reasoning visible and the
  input that moves it most identified. State clearly what your estimate covers
  — units? capacity? capacity actually usable for frontier training? — because
  those differ by an order of magnitude and are routinely conflated.
- **The enforcement recommendation.** Given the estimate, where should a small
  investigative capacity be pointed, and what would tell you within a year
  whether it worked.

Similar card: [Compute Production Gap and Data Centers in
China](/verification/capstone-bank#compute-production-gap-china) — the
neighbouring idea in the same collection, on the manufacturing-gap side of
the same strategic question.

## Why it exists

This is the track's hardest estimation problem and its most honest one. Every
source is adversarial or incomplete, and the correct output is a range with
loud caveats rather than a headline figure. Learners who can produce that —
and resist the pull toward a citable number — have the single most transferable
skill in open-source policy analysis.

It also has a real audience. Enforcement capacity is small and allocated on
intuition; an estimate with a stated method is immediately more useful than the
anecdote it replaces, even when the range is wide.

## Scope

**In scope:** public trade data, enforcement announcements, corporate filings,
market analysis, and open reporting on datacentre construction.

**Out of scope:** classified sources, and naming specific companies as
smugglers on circumstantial evidence. Route analysis is fine; accusation is
not, and a capstone that gets that wrong is worse than one that is late.

**Also out of scope:** a point estimate. If your write-up has a single headline
number and no range, it will be quoted without its caveats — assume it will,
and write accordingly.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Routes | "Smuggling occurs" | Routes separated, each with its own measurement approach |
| Sources | Cites reporting | Each source's bias named, and at least one claim triangulated across three |
| The bound | A number | A range, with the sensitivity driver named and the unit of account stated |
| Recommendation | "Strengthen enforcement" | Where to point limited capacity, and the one-year test of whether it worked |

## Getting started

1. Fix the unit of account in the first session — units, nominal capacity, or
   frontier-usable capacity. Almost every confused analysis of this question
   changes unit halfway through.
2. Start from mirror-data discrepancies in trade statistics. It is the one
   source that is not downstream of somebody's press release.
3. Write the caveat paragraph before the estimate, and keep it at the top.
