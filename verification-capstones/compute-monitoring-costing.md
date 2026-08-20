---
title: What Would Compute Monitoring Actually Cost?
track: Verification
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
  - "[Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver (2025), orphan 8: compute monitoring](https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance)"
  - "[What does it take to catch a Chinchilla? Verifying Rules on Large-Scale Neural Network Training via Compute Monitoring — Shavit (2023), §3.2](https://arxiv.org/abs/2303.11341)"
updated: 2026-08-20
---

## The idea, as posed

From [Orphaned Policies (Post 5 of 7 on AI Governance) — Mass_Driver
(2025)](https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance),
the "Compute Monitoring" entry (orphan 8). Quoted:

> There has been much discussion of how the government could attempt to
> track large clusters of computing power with the goal of knowing who is
> doing large-scale training runs so that the government could intervene
> in an emergency. Yonadav Shavit’s 2023 paper “What Does It Take to Catch
> a Chinchilla?” provides a useful amount of detail about how often
> inspections would need to take place, but there is still much work to be
> done in terms of figuring out who would do these inspections, what the
> penalties would be for noncompliance, and how the hardware innovations
> required would be paid for.

Two paragraphs later, the entry names the numbers still missing:

> There are many details that remain to be worked out in terms of what
> specific hardware features could and should be placed on chips to make
> them easier for the government to monitor. Should advanced AI chips have
> GPS locators? Should they include proof-of-work features that allow
> others to identify what types of computations they were used on and
> roughly how many of those computations were performed? Should chips have
> a ‘kill switch’ that allows them to be remotely deactivated, or, more
> aggressively, a dead man’s switch that automatically deactivates them if
> they do not receive the correct password at periodic intervals?
>
> How much would it cost to develop each of these features, and how
> quickly could they be developed and manufactured? There are several
> academic papers that discuss these features in the abstract, but I am
> not aware of any that provide concrete estimates of time and cost. You
> can help by doing research that narrows down the range of plausible
> estimates.

The paper the entry leans on poses the inspection arithmetic itself — from
[What does it take to catch a Chinchilla? — Shavit
(2023)](https://arxiv.org/abs/2303.11341), §3.2 and its footnoted
estimate:

> Yet, for training runs at the scale of 10^{25} FLOPs or greater,
> monitoring could be done with a bureaucracy similar in size to the IAEA.
>
> We want to estimate the number of inspectors needed to catch a
> Chinchilla-280B-sized training run, with 10^{25} FLOPs, given several
> more years of hardware progress and global production.
>
> Given C=10^{7} worldwide chips (>5\times global stocks as of 2022), each
> of which can output a=3\cdot 10^{15}\cdot 86400 FLOPs per day (3\times
> more FLOP/s than the NVIDIA H100), detecting a Chinchilla-280B-sized run
> within T=30 days of its completion anywhere on earth with 90%
> probability would require roughly 232,000 worldwide chip samples per
> year.
>
> A single inspector might be expected to verify at least 1000 chips a
> year, especially if those chips are brought to a central location (see
> Section 3.1).
>
> This would require \approx 232 inspectors, slightly smaller than the 280
> active IAEA inspectors as of 2021.

## What you produce

The costing the entry says is missing: who employs the inspectors, the
penalty schedule for noncompliance, who pays for the hardware features,
and the narrowed range of time-and-cost estimates the last quoted
paragraph asks for — built on the inspection arithmetic Shavit's estimate
begins.
