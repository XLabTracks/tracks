---
title: What Would Compute Monitoring Actually Cost?
theme: Verification
status: draft
summary: The compute-monitoring literature has the mechanisms, the timing, even a first-pass inspector headcount. It has no penalties and no price. Produce the costing a budget office would need.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Costed monitoring plan — headcount, inspection cadence, penalty schedule, hardware dependencies
deliverable_type: analysis
mentor: recommended
audience: The agency that would be asked to stand this up, and the committee funding it.
skills: [cost estimation, institutional design, inspection regime design, dependency analysis]
prerequisites: [Verification 1 — actors, Verification 2.1 — the hardware layer, Verification 4.1 — feasibility and layering]
sources:
  - "[Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 8](https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance)"
updated: 2026-08-04
---

## The brief

Module 2.1 tells you what the hardware layer can and cannot do today: chip
identity is solved but not unbreakable, secure boot has an inverted threat
model because the owner is the party you are trying to catch, and no production
chip meters tamper-resistantly. The orphan catalogue says the same thing from
the other end — the timing analysis exists, and
[Shavit](https://arxiv.org/abs/2303.11341) even sketches an
inspector headcount, but who employs those inspectors, what the penalties
are, and who pays for the hardware innovations have never been costed.

Do the costing.

- **The regime you are pricing.** One jurisdiction, one threshold, one class of
  facility. Declaration, on-site inspection, remote telemetry, or some mix —
  pick, because they cost wildly different amounts.
- **Headcount and cadence.** How many inspectors, with what skills, visiting
  how often, to cover how many facilities. Anchor against a real inspectorate
  in another domain and say where the anchor is wrong.
- **The penalty schedule.** What misdeclaration costs, scaled so that
  compliance is cheaper than the expected value of cheating. Show that
  arithmetic; it is the part everyone skips.
- **Hardware dependencies.** Which parts of your regime need capability that
  does not exist in shipping silicon. Separate what works today from what
  needs a hardware generation, and put a date on the second column.
- **The bill.** One number, with its three biggest line items and the
  assumption that moves it most.

## Why it exists

Verification proposals are usually priced in feasibility adjectives —
"challenging", "achievable in principle". Budget offices do not fund
adjectives. Converting a mechanism into headcount, cadence and a penalty
schedule is what makes the difference between a paper and a programme, and it
tends to reveal that the binding constraint is people rather than physics.

It also feeds Module 4 directly. The sequencing question — what works for an
MVP three-month pause versus what needs years of institution-building — cannot
be answered without something like this number.

## Scope

**In scope:** public compute-monitoring literature, published inspectorate
budgets and staffing from analogous regimes, public datacentre and chip market
data.

**Out of scope:** classified or proprietary cost data, and precision. This is
order-of-magnitude work with the assumptions exposed; a confident single
figure with no sensitivity is worse than a range.

**Do not price the ideal regime.** Price the one you would actually recommend
starting with, and note what the full version would add.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Scope | "A compute monitoring regime" | One jurisdiction, one threshold, one facility class, stated up front |
| Staffing | A headcount | Anchored to a real inspectorate, with the disanalogy named |
| Penalties | "Substantial fines" | A schedule, with the compliance-versus-cheating arithmetic shown |
| Dependencies | Mechanisms listed as available | Split into shipping-today and needs-a-hardware-generation, with dates |

## Getting started

1. Find a real inspectorate's published budget and staffing in week one. It is
   your anchor and it will reshape the whole estimate.
2. Do the penalty arithmetic before the headcount. If cheating pays, the
   inspectors are decoration.
3. Keep a visible assumptions register from the first estimate. It is the part
   a reader will actually argue with, and that is the point.
