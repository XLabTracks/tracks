---
title: Make Sandbagging Not Worth It
track: Technical Governance
status: draft
summary: A developer whose model must score below a threshold has every reason to elicit weakly. Design the regulatory incentives that make under-elicitation the expensive option.
team: 1-2
effort_hours: 14-18
duration: 3 weeks
difficulty: stretch
deliverable: Incentive design — the detection route, the penalty, and the reporting rule that makes both work
deliverable_type: spec
mentor: recommended
audience: The regulator who has to accept an eval result from a party that benefits from a low score.
skills: [incentive design, eval methodology, detection reasoning, regulatory drafting]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 38: what regulatory incentives should target evaluation sandbagging?](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-20
---

## The idea, as posed

From [A Collection of AI Governance Research Ideas — von Knebel &
Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024),
idea 38, "What Regulatory Incentives / Interventions Should Target
Evaluation Sandbagging?", suggested by Francis Rhys Ward. Quoted:

> Sandbagging is strategic underperformance on an evaluation. AI
> developers, or AI systems themselves, may have incentives to sandbag
> dangerous capability evals, to circumvent regulation. (Cf the case of
> Volkswagen) Technical work can aim to detect and mitigate AI
> sandbagging, but it's unclear what mechanisms should be used to
> dis-incentivise sandbagging, e.g., fines. In addition, it seems somewhat
> unclear which entity is legally responsible for sandbagging, for
> example, in the case in which a misaligned agent does so without the
> intent of the developers. Such cases may be cases of negligence, in
> which the developer did not undergo sufficient prior safety evaluations
> before submitting the model for external evaluation. In summary, there
> are a number of questions here which need to be clarified to inform
> policy surrounding evaluations and sandbagging.

The idea's research questions:

> How can regulators address the problem of sandbagging in evaluations?
> How can they handle the issue of liability and responsibility?
>
> What tools exist in general, and which seem most applicable to AI?
>
> What can we learn from other industries?

## What you produce

The incentive design the questions ask for: the mechanisms that
dis-incentivise sandbagging, the liability and responsibility question
answered for the case the background names — a misaligned agent
sandbagging without the developer's intent — and what the tools of other
industries transfer to AI.
