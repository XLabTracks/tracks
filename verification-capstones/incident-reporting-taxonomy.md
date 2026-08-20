---
title: An Incident Taxonomy Labs Could Report Against
track: Technical Governance
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
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), §8.1, improving incident reporting and monitoring: how non-public incidents can be reliably reported, and what technical information should be reported](https://arxiv.org/abs/2407.14981)"
similar: [incident-detection-monitoring, tracking-agent-behaviour]
updated: 2026-08-20
---

## The idea, as posed

From [Open Problems in Technical AI Governance — Reuel et al.
(2025)](https://arxiv.org/abs/2407.14981),
§8.1, Clarification of Associated Risks (Ecosystem Monitoring).
Quoted:

> Improving incident reporting and monitoring. Additionally, developing
> improved systems for monitoring and reporting previous or ongoing
> incidents could not only allow for a more targeted response to ongoing
> harms, but also facilitate the identification of early warning signals
> for potential harms (Shane 2024). AI incident databases have been
> developed by both the OECD and Partnership on AI, both of which log news
> articles detailing AI-related incidents (OECD.AI Policy Observatory
> 2024; McGregor 2020). Given that these databases rely solely on public
> sources, it is likely that only a subset of all incidents are included.
> In addition, they do not record all details about an incident such as
> model specifics or deployed guardrails, limiting the utility for
> analysis of what may have caused an incident. Open questions thus
> concern how non-public incidents can be reliably reported, as well as
> what technical information should be reported in order to facilitate
> meaningful analysis of incidents.

## What you produce

The two open questions, answered as an instrument: a taxonomy of
reportable events with thresholds, a reporting form that fixes what
technical information a report carries — model specifics and deployed
guardrails included — and a back-test against a dozen public incidents
showing the analysis the design makes possible.
