---
title: A Minimum Viable Compute-Accounting Audit
theme: Verification
status: draft
summary: What should a commercial AI audit prove about how each GPU was used? Claims, logs, retention, auditor access — and what happens when logs are missing.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Draft auditing standard, 2–3 pages
deliverable_type: spec
mentor: optional
audience: The audit firm that has to say what its stamp proves.
skills: [audit design, evidence standards, logging requirements]
prerequisites: [Verification 1 — actors, Verification 2.2 — the cloud layer]
updated: 2026-08-06
---

## The brief

Financial audit did not begin with fraud-proof bookkeeping; it began with a
standard stating what an auditor checks, what records the client must keep,
and what the opinion does and does not certify. Compute accounting has no
such standard. Write the minimum viable one: what a commercial audit of an
AI operator should prove about the use of every accelerator it controls.

- **The claims.** What the audit certifies, stated as checkable
  propositions — total accelerator-hours by cluster, workload attribution at
  an agreed granularity, no unrecorded capacity above a floor. What it
  deliberately does not certify goes in the same section.
- **The records.** Which logs the operator must keep for the claims to be
  auditable: schedulers, power, allocation, procurement. For each, the
  retention period and the tamper story — what stops backfilled history.
- **The access.** What the auditor may see and touch, on what notice, with
  what sampling rights. Access is where audit standards live or die;
  unlimited access is unnegotiable and useless.
- **The failure clauses.** What a missing log means, what an anomaly means,
  and when either escalates from a finding to a qualified opinion. An audit
  standard that cannot handle gaps certifies only tidy books.

## Why it exists

Module 2.2's failure mode is the paperwork regime: self-reporting that
audits nothing. The repair is not more reporting but a standard that says
what checking means. Module 1's actor map supplies the missing profession —
the audit firm — and this brief asks what its engagement letter would
actually promise.

## Scope

**In scope:** one operator archetype (a cloud region or a large private
cluster), existing log types that real schedulers and facilities produce,
and audit practice from other industries as structural reference.

**Out of scope:** new hardware mechanisms, cryptographic attestation
schemes, and statutory authority. This is a standard a firm could pilot
under contract today.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Claims | "Compute was used properly" | Propositions an auditor can check, plus the explicit not-certified list |
| Records | "Keep logs" | Named log types, retention periods, and a tamper story for each |
| Access | Unstated | Notice, scope and sampling rights a real operator could sign |
| Gaps | Fatal or ignored | Missing-log and anomaly clauses with defined escalation |

## Getting started

1. Write the not-certified list first. It is the most clarifying section and
   the one every draft standard forgets.
2. Inventory the logs a real scheduler already emits before inventing new
   ones — a standard built on records nobody keeps audits nobody.
3. Draft the missing-log clause early and test the whole standard against
   an operator who lost a month of history, innocently or otherwise.
