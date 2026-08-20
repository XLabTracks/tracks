---
title: BOTECs of Inference Compute Needs
track: Technical Governance
status: draft
summary: How much inference compute — FLOP, FLOP/s, hardware — would consequential AI use-cases need? Build the well-evidenced BOTEC the idea asks for, for policymakers rather than publication.
team: 1
effort_hours: 10-14
duration: 2 weeks
difficulty: core
deliverable: Well-evidenced BOTEC of inference compute for one consequential use-case, with bang-for-buck where sensible
deliverable_type: notebook
mentor: optional
audience: The policymaker sizing a risk who needs the arithmetic, not a headline.
skills: [back-of-envelope estimation, sensitivity analysis, reproducibility]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 72: BOTECs of inference compute needs](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
similar: [training-vs-inference, which-compute-target]
updated: 2026-08-20
---

## The idea, as posed

From [A Collection of AI Governance Research Ideas — von Knebel &
Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024),
idea 72, "BOTECs of Inference Compute Needs", suggested by Markus
Anderljung. Quoted:

> It could be useful to have well-evidenced BOTECs to assess how much
> inference compute (in terms of FLOP, FLOP/s, and hardware required) is
> needed for various consequential AI use-cases. Such use-cases might
> involve: Authoritarian use-cases (e.g. surveillance of an entire
> population, censoring the internet), election interference (e.g. running
> 1m fake social media accounts to reduce voter turnout in a certain
> demographic), and AI-enabled online fraud (e.g. running 1m deepfake
> robocalls simultaneously aiming to get someone to transfer money into a
> bank account). In some of these cases, it may also be interesting to
> conduct a BOTEC on the bang-for-buck of the use case. It’s not clear
> these BOTECs should be widely published, but they ought to be useful for
> policymakers, and could inform broader strategies around risk management
> for hazards arising from misuse.
>
> Why might this matter? A lot of compute governance efforts focus on the
> compute needed for training. I think inference deserves more attention.
> Inference is what will lead to AI systems having a real impact in the
> world, and we should expect that a system’s impact should at least
> monotonically increase with the number of inferences run on it.

The idea's research question:

> How much inference compute would be needed for different consequential
> AI use-cases?

## What you produce

The BOTEC the idea describes, for one use-case agreed with your mentor,
with every assumption exposed and a sensitivity range rather than a point
figure. Note the idea's own caution and follow it: it is not clear these
BOTECs should be widely published — the deliverable is written for a
policymaker, and publication is a decision, not a default.
