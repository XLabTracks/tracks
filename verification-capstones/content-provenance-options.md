---
title: What Content Provenance Can and Cannot Buy
track: Technical Governance
status: draft
summary: Measure how fast a watermark dies under ordinary handling, then write the policy-options memo that says which provenance obligations are worth imposing.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: core
deliverable: Robustness measurements plus a policy-options memo ranking provenance obligations by what they survive
deliverable_type: notebook
mentor: optional
audience: The legislator being told that watermarking solves AI-generated content.
skills: [robustness testing, measurement, policy-options analysis, communicating technical limits]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 59: what policy options exist for ensuring AI-generated content is identifiable as such?](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-20
---

## The idea, as posed

From [A Collection of AI Governance Research Ideas — von Knebel &
Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024),
idea 59, "What Policy Options Exist for Ensuring That AI-Generated
Content is Identifiable As Such?", suggested by Markus Anderljung.
Quoted:

> It seems important that at least certain AI-generated content can be
> identified as such, since we might be headed for a world where
> AI-generated content and AI-originating actions on the internet are
> indistinguishable from human-produced content and actions. That doesn’t
> intuitively seem like a good outcome given the difficulties to have a
> good overview of how AI is affecting the world or finding levers to
> improve its effects. Reasons for making AI-generated content
> identifiable include:
>
> Transparency: Knowing whether someone is interacting with AI content or
> an AI agent and knowing that a piece of content is AI-generated is
> important to judge whether it represents real events. Citizens may also
> have an interest in knowing whether they are engaging with an AI system
> or not, e.g. as this might inform decisions to seek a second opinion on
> a decision.
>
> Enforcing different rules for AI-generated content and actions:
> Companies ask people to verify that they are human to avoid abuse or
> breakdown of their services (e.g. Captcha).
>
> Incident investigation: As AI systems become more and more integrated
> into society, we’ll need better information about how and when things go
> wrong. To do so, it will be important to be able to trace specific
> incidents or real-world harms to specific AI systems or at the very
> least to the use of AI systems in the process.
>
> Macro assessments of AI adoption: Currently, there is very little
> quality public data on the adoption of AI across society. If there were
> watermarks, we could make such assessments by running a detector e.g.
> over Facebook.
>
> Possible techniques for ensuring such identification include
> watermarking, content provenance, retrieval-based detection and post-hoc
> detection.

The idea's research questions:

> What policy options are available to ensure developers take those
> actions? Possible options include:
>
> Literally mandating it, but that could be very onerous, so perhaps
> should only be done for certain systems, e.g. those with a large
> user-base.
>
> Requiring that users include identifiers on content they post, which
> might incentivise companies to put identifiers into their AI tools.
>
> Tort liability
>
> Others (?)
>
> Which of these are most promising, and what do they require from other
> actors in the value chain (e.g. developers, but also users, and
> regulators)?

## What you produce

A robustness measurement of the techniques the idea names — watermarking,
content provenance, retrieval-based detection, post-hoc detection — and
the policy-options memo the research questions ask for: which options are
available, which are most promising, and what each requires from
developers, users, and regulators.
