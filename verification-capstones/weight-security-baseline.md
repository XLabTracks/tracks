---
title: The Security Baseline That Would Have Stopped It
track: Verification
status: draft
summary: Weight exfiltration is the evasion route that voids the compute regime. Write the infrastructure-security baseline a regime would require in advance, and price it.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Security baseline by threat tier, with the audit evidence for each control and its cost
deliverable_type: spec
mentor: recommended
audience: The regulator writing a security condition, and the lab that has to pass an audit against it.
skills: [security requirement design, threat tiering, auditability analysis, cost-of-compliance analysis]
prerequisites: [Verification 2.3 — intelligence and the human layer, Verification 3 — covert development, Verification 4.1 — feasibility and layering]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), security questions: what infrastructure-level cybersecurity measures protect model weights from theft; how can models be protected from inference attacks reproducing weights](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-04
---

## The brief

The bank already has a capstone for the day after weights leak, and it
deliberately treats prevention as somebody else's job. This is that job.

Write the security baseline a verification regime would require of a covered
developer — and make it auditable, because a requirement nobody can check
against is a requirement that exists only in the recital.

- **Threat tiers.** Opportunistic outsider, motivated criminal, insider with
  legitimate access, state actor with a budget and patience. The baseline is
  different at each, and a regime that names no tier has silently picked the
  cheapest one.
- **Controls by tier.** What is actually required: where weights may live,
  key management, egress restriction, hardware-backed storage, separation of
  duties, insider-risk programmes, vendor and contractor scope. Keep each
  control to something a regulator could point at.
- **The audit evidence.** Per control, what an auditor would look at to
  establish it is in place — and not merely documented. This is the section
  that decides whether the baseline is real, and the one most security policies
  skip.
- **The human layer.** Module 2.3's human-layer territory (2.3.6–2.3.9). Most exfiltration paths run
  through people with legitimate access, and technical controls that ignore
  that are ignoring the main route. Say how your baseline handles the insider
  who is authorised.
- **The cost.** By tier, roughly, and the honest note: at the state-actor tier
  the baseline may exceed what any commercial developer will pay, which is a
  finding a regime needs before it writes the condition rather than after.

## Why it exists

Module 3 rates weight exfiltration as the evasion that bypasses the compute
regime entirely — training already happened, and the artifact is a file. The
whole verification edifice rests on the assumption that this does not happen,
and that assumption is currently backed by whatever security each lab chose.

It is also the point in the track where verification meets ordinary security
engineering, and where learners find out how much of governance is asking "how
would you know?" of controls somebody has already asserted.

## Scope

**In scope:** published security frameworks and their AI-specific adaptations,
public reporting on lab security practice, and the insider-risk literature.

**Out of scope:** penetration testing, any specific organisation's actual
posture, and offensive detail. You are writing a requirement and its audit
procedure, not a threat report.

**Do not write a control list and stop.** Half this capstone is the audit
column. A baseline whose controls cannot be evidenced is exactly the paperwork
regime Module 2.2 warns about, in a different domain.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Tiers | One undifferentiated baseline | Four tiers, with the control set changing between them |
| Controls | Borrowed wholesale from a framework | Selected, with the AI-specific reason each one is here |
| Audit evidence | Absent | Per control, what an auditor inspects, and how it distinguishes real from documented |
| Cost | Ignored | Per tier, with the honest note about where it exceeds commercial willingness |

## Getting started

1. Pick the tier the regime actually cares about before writing controls. Most
   baselines are written for the opportunistic outsider and quoted as though
   they addressed the state actor.
2. Write the audit column beside every control as you add it. Retrofitting it
   deletes about a third of the list.
3. Do the insider path in week two. It is the hardest section and the one that
   reshapes the technical controls around it.
