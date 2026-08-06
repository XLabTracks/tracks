---
title: Incident Detection and Monitoring at AI Companies
theme: Technical Governance
status: draft
summary: Different ways of monitoring deployed AI systems for misuse and misalignment have been proposed, nearly all with significant tradeoffs. Assess them and sketch a workable framework.
team: 1-2
effort_hours: 12-16
duration: 2 weeks
difficulty: core
deliverable: Assessment of the proposed monitoring setups, their tradeoffs, and a sketch of a feasible monitoring framework
deliverable_type: analysis
mentor: optional
skills: [risk analysis, scenario mapping, privacy tradeoffs]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 22: incident detection and monitoring at AI companies](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-06
---

## The idea, as posed

From [A Collection of AI Governance Research Ideas — von Knebel &
Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024),
idea 22, "Incident Detection and Monitoring at AI Companies", suggested by
Julian Hazell. Quoted:

> Different ways of monitoring deployed AI systems for risks have been
> suggested: technical monitoring systems (e.g., other AI models) that
> analyze user inputs and model outputs to detect misalignment or misuse;
> allow users to choose from multiple independent monitoring providers to
> increase trust and reduce privacy concerns; work with large corporate
> clients to set up their own AI monitoring teams, which are trained and
> validated by the AI lab but operate independently to protect client data
> privacy; automatically ban users when misuse is detected (with an option
> for human review); retain user data for long periods to facilitate more
> comprehensive monitoring and analysis; compensate users whose data ends
> up being reviewed by human monitors; implement data anonymization
> techniques […]; implement better watermarking techniques to help with
> post-hoc investigations of incidents where AI may have played a role;
> solicit volunteers to agree to more intensive monitoring.
>
> However, nearly all of these potential solutions involve significant
> tradeoffs, and additional research is needed to thoroughly assess their
> benefits and drawbacks. Implementing even just a few of these monitoring
> measures may prove challenging due to various technical, legal, and
> commercial considerations.
>
> Research questions: If unrestricted retention and access to user chat
> logs would significantly hurt AI companies' commercial viability by
> driving away privacy-conscious users, what might a more feasible setup
> look like? What are the tradeoffs? How can privacy concerns be
> addressed, both from a policy and technical point-of-view? More
> generally: what would a comprehensive monitoring framework look like in
> practice? Methodology: literature review, expert interviews, scenario
> mapping, risk analysis.

## What you produce

The assessment the idea calls for: the proposed monitoring setups with
their benefits and drawbacks worked through, the privacy question
addressed from both the policy and the technical side, and the sketch of
what a comprehensive monitoring framework would look like in practice.

Similar cards: [An Incident Taxonomy Labs Could Report
Against](/verification/capstone-bank#incident-reporting-taxonomy) — what
counts as a reportable incident once monitoring finds one; [Tracking
Sketchy AI Agent Behaviour in the
Wild](/verification/capstone-bank#tracking-agent-behaviour) — a different
list's idea on outside-in observation of deployed agents.
