---
title: Govern Through the Purchase Order
theme: AI Governance Policy
status: draft
summary: Government buying power sets terms without new legislation. Draft the AI procurement conditions for one agency, and say which safety asks a contract can actually carry.
team: 1-2
effort_hours: 12-16
duration: 2 weeks
difficulty: core
deliverable: Draft procurement conditions with the evidence each requires, and the asks that do not survive contract form
deliverable_type: spec
mentor: optional
audience: The contracting officer who has to evaluate bids against whatever you write.
skills: [contract-condition drafting, evidence design, lever analysis, administrability]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 63: what rules should the US government set regarding government purchases of AI?](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 21: implementation details of the best practices list](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)"
updated: 2026-08-04
---

## The brief

Week 1's lever taxonomy lists regulation, standards, liability, compute
controls, self-governance and international agreements. Procurement is the
lever that is missing from most such lists and is often the fastest available:
it needs no statute, it binds through contract, and a large buyer's terms
propagate to everything the vendor sells.

Draft the conditions for one agency buying one category of AI system.

- **The conditions.** What a vendor must do to be eligible and what they must
  keep doing. Candidates: publish evaluation results for the deployed
  configuration, notify the buyer of material model updates, permit third-party
  testing, meet a security baseline for weights and data, provide incident
  reporting, accept liability terms that are not the standard limitation.
- **Evidence per condition.** What a bid must contain, and what a contracting
  officer — who is not an AI specialist and has a deadline — could actually
  evaluate. This constraint kills roughly half of any wish list, and finding
  out which half is the exercise.
- **What contract form cannot carry.** Some asks do not survive: anything
  requiring continuous judgement, anything the buyer cannot detect a breach of,
  anything the vendor can satisfy for the government instance while shipping
  something else commercially. Name them and say what instrument would be
  needed instead.
- **The market read.** Would anyone bid? A condition set that leaves one
  compliant vendor has replaced a safety problem with a competition problem.
  Say who drops out and whether you accept it.
- **The propagation question.** One page: which of your conditions would a
  vendor apply across their whole product because maintaining two versions is
  not worth it. That is where procurement's real leverage is, and it is not
  usually the strictest condition.

## Why it exists

Procurement is where governance actually reaches many organisations first, and
it is badly under-taught relative to legislation, which is slower and rarer.
Learners who understand that a purchase order is a regulatory instrument read
the whole landscape differently.

The pedagogy is the evidence column. Anyone can list what they wish vendors
did; the discipline is writing conditions a non-specialist can score bids
against, on a schedule, defensibly enough to survive a protest from the loser.

## Scope

**In scope:** published procurement guidance and standard contract clauses, the
NIST framework and comparable standards as incorporable references, and public
information on AI vendors' terms.

**Out of scope:** the appropriations and competition law of a specific
jurisdiction beyond flagging it, and a full contract. Conditions and their
evidence, plus the analysis.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Conditions | A wish list | Conditions with the evidence a bid must contain for each |
| Evaluability | Assumed | Written for a non-specialist officer on a deadline, with the unevaluable asks cut |
| Limits | Unstated | The asks contract form cannot carry, named, with the alternative instrument |
| Market | Ignored | Who stops bidding, and whether the remaining field is competitive |

## Getting started

1. Read one real set of procurement conditions from any technical domain. The
   evidence column is a genre and it is easier to imitate than invent.
2. For every condition, ask how the buyer would find out it had been breached.
   Conditions with no answer come out.
3. Do the propagation analysis last — it tells you which conditions were worth
   the fight.
