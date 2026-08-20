---
title: Red-Team a Verification Stack
track: Verification
status: ready
summary: Take a published verification proposal and break it — a structured evasion report with detection probabilities and the patch each route demands.
team: 2-3
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Evasion report with an attack tree and a patch list
deliverable_type: analysis
mentor: recommended
audience: The team that published the proposal you are attacking.
skills: [red-teaming, attack trees, detection reasoning, adversarial cost modelling]
prerequisites: [Verification 2.x — the four layers, Verification 3 — covert development]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix C.1](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Appendix C.1,
Methodology for Analysis. Quoted:

> 3. Assessing, red teaming, and enhancing verification mechanisms; and
> identifying open problems. For each identified mechanism, we iterated
> between assessing the mechanism and enhancing it. In the assessment stage,
> we evaluated various properties of each mechanism: what subgoals in our
> verification framework the mechanism could complete or support, its
> probability of detecting a violation quickly if done by a highly motivated
> major government, the frequency of false alarms, the confidentiality and
> security for the Prover, the setup speed in terms of time required for R&
> D and implementation, and the financial or computational cost. We focus on
> these properties because history and incentives suggest they will be
> important for the acceptability of a verification regime [120, 39, 13,
> 143]. After assessing each property and identifying challenges for it, we
> considered how the mechanism could be enhanced to address these challenges
> (e.g., through a different implementation or additional compliance tests),
> and then we repeated the assessment on the enhanced version of the
> mechanism, up to the point where further assessment or enhancement
> appeared to require a substantial research project of its own.

The abstract says why this pass is owed:

> While promising, these approaches require guardrails to protect against
> abuse and power concentration, and many of these technologies have yet to
> be built or stress-tested.

## What you produce

That same red-team pass, run against one published verification proposal
of your choosing: an evasion report with an attack tree, and the patch
list that would survive your own attack.
