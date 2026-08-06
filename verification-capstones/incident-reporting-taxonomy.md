---
title: An Incident Taxonomy Labs Could Report Against
theme: Technical Governance
status: draft
summary: Incident reporting is in every governance proposal and no two people mean the same thing by "incident". Build the taxonomy and the reporting form, then test it on real cases.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Incident taxonomy, a reporting form, and a back-test against a dozen public incidents
deliverable_type: spec
mentor: optional
audience: The regulator who will receive the reports and the lab engineer who has to file one at 2am.
skills: [taxonomy design, form design, back-testing a classification, regulatory drafting]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 22: incident detection and monitoring at AI companies](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[Ten AI safety projects I'd like people to work on — Julian Hazell, project 3 (tracking sketchy AI agent behaviour)](https://www.lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), ecosystem monitoring: how can non-public incidents be reliably reported, and what technical information should be reported to make analysis meaningful](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-04
---

## The brief

Week 6 lists incident reporting alongside model cards and structured access as
transparency mechanisms. Unlike the other two it has no agreed object: aviation
knows what an incident is, pharmacovigilance knows what an adverse event is,
and AI does not.

Build the missing definition and then check it against reality.

- **The taxonomy.** Classes of reportable event with thresholds. Candidates:
  an evaluation result that crossed an internal trigger, a safeguard bypass
  observed in deployment, an agent taking an action outside its authorised
  scope, a security event touching weights or training infrastructure, a
  material capability discovered after release. Each needs a threshold, or
  everything and nothing is an incident.
- **Severity and timing.** What must be reported within 24 hours, what within
  30 days, what annually in aggregate. Fast reporting buys responsiveness and
  costs accuracy; say where you put the line and why.
- **The form.** The actual fields. This is the deliverable that would get used,
  and designing it forces every ambiguity in the taxonomy into the open.
- **The back-test.** A dozen publicly reported AI incidents from the last few
  years. Classify each. Report the ones your taxonomy handles badly — the
  ambiguous ones are the finding, not an embarrassment.
- **The disincentive check.** Reporting creates liability and headlines. Say
  what your design does about that: safe-harbour, aggregation, delayed
  publication, confidential channels. A taxonomy that ignores it collects
  nothing.

## Why it exists

Transparency mechanisms fail in a specific way: the obligation is written
before the object is defined, so compliance becomes a matter of interpretation
and comparison across companies becomes impossible. Watching that happen to
your own taxonomy during the back-test is the lesson.

The back-test is also the part that transfers. Building a classification and
then honestly reporting where it breaks on real cases is what separates a
usable instrument from a diagram.

## Scope

**In scope:** public incident databases and reporting, incident-reporting
regimes from aviation, medicine, cybersecurity and finance, and published lab
safety frameworks.

**Out of scope:** an enforcement regime, and interviewing labs. The taxonomy
and the form are enough for three weeks.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Classes | Broad categories | Thresholds per class, plus a deliberate non-example for each |
| The form | A list of topics | Fields a tired engineer could complete correctly at 2am |
| Back-test | Confirms the taxonomy works | Names the cases it handles badly and what that implies |
| Disincentives | Unaddressed | A specific mechanism, with what it costs the regulator in visibility |

## Getting started

1. Collect the twelve real incidents *first*, then build the taxonomy against
   them. Taxonomies built in the abstract classify nothing.
2. Draft the form early. Field design surfaces definitional problems that prose
   hides.
3. Borrow severity tiers from a mature regime rather than inventing them; spend
   your invention budget on the classes instead.
