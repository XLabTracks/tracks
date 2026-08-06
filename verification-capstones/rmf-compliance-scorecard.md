---
title: Score the Developers Against the NIST Framework
theme: AI Governance Policy
status: draft
summary: Nobody knows whether the major developers follow the NIST AI Risk Management Framework — or ever promised to. Turn it into a checklist, score them on public evidence, and publish the rule.
team: 2-3
effort_hours: 14-20
duration: 3 weeks
difficulty: core
deliverable: Compliance checklist derived from the framework, scores for three developers, and the evidence log
deliverable_type: dossier
mentor: optional
audience: The procurement officer or regulator deciding whether "we follow the RMF" means anything.
skills: [framework decomposition, rubric design, evidence sourcing, comparative scoring]
sources:
  - "[Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 10](https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance)"
  - "[Ten AI safety projects I'd like people to work on — Julian Hazell, project 5 (AI Lab Monitor)](https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on)"
  - "[NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)"
updated: 2026-08-04
---

## The brief

A voluntary framework nobody is scored against is indistinguishable from a
press release. The orphan catalogue puts it plainly: the guidelines are
published, a rating system exists, and it is not obvious that the major
developers actually comply — or even that they have promised to.

Build the instrument that would tell you.

- **The checklist.** Decompose the framework's functions into items that are
  *externally checkable*. That constraint does most of the work: "govern"
  becomes something like "publishes a named accountable role for model release
  decisions". Items nobody outside the company could ever verify get dropped,
  and the count of what you dropped is itself a finding.
- **The scoring rule.** Written before you score anyone. What counts as
  evidence, what counts as partial, and what an absence means — because on
  public evidence, absence of documentation is not absence of practice, and
  your rule has to say how it treats that.
- **The scores.** Three developers, scored, with an evidence log: one row per
  item per company, with the URL and the date.
- **Double-coding.** Two people score an overlapping subset independently.
  Report the disagreement rate. A scorecard without one is an opinion with a
  table around it.
- **The limits note.** What this scorecard would say about a company that
  documents well and practises badly, and vice versa.

## Why it exists

Week 3 teaches clause-level reading of voluntary commitments; week 6 covers
standards bodies and what incorporation by reference does. This joins them: a
voluntary standard becomes real when somebody scores against it in public, and
the scoring rule is where all the contestable judgement lives.

The transferable skill is rubric design under public-evidence constraints —
the same skill behind index-building, comparative jurisdiction work, and any
"which of these is actually complying" question, which is most of the job in
think-tank policy research.

## Scope

**In scope:** the published framework, developers' public documentation —
model cards, system cards, safety frameworks, transparency reports — and
existing third-party rating work as a comparison for your method.

**Out of scope:** interviews, non-public information, and scoring more than
three companies. Depth and a defensible rule beat coverage.

**Publish the rule with the scores, always.** A score whose method is not
visible cannot be argued with, which makes it useless to the person you wrote
it for.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Items | Restated framework language | Externally checkable statements, with the dropped items counted |
| Rule | Applied by judgement | Written first, double-coded, disagreement rate reported |
| Evidence | "Based on public sources" | One row per item per company with URL and date |
| Limits | Claims to measure safety | Says clearly it measures documentation, and what that does and does not imply |

## Getting started

1. Try to score one company on five items before building the full checklist.
   You will discover which items are checkable, and it takes an afternoon.
2. Write the absence rule early and stick to it. Deciding case by case is how
   a scorecard becomes an argument about the companies you already liked.
3. Date every piece of evidence. This artifact rots faster than anything else
   in the bank, and a dated log is what makes it re-runnable.
