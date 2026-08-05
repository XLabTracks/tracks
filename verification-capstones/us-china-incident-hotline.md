---
title: Build the US–China AI Incident Hotline
track: Verification
status: draft
summary: The hotline has been proposed for years and never specified. Design it — what counts as an incident, who picks up, what is said, and why either side would believe it.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Hotline design — incident taxonomy, escalation ladder, and the credibility problem addressed
deliverable_type: spec
mentor: recommended
audience: The desk officers on both ends who would have to use it at 3am.
skills: [crisis mechanism design, institutional analysis, signalling under mistrust, precedent critique]
prerequisites: [Verification 0 — treaty anatomy, Verification 1 — actors, Verification 4.1 — feasibility and layering]
sources:
  - "[Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 7](https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance)"
updated: 2026-08-04
---

## The brief

A bilateral incident hotline is one of the few AI governance proposals with a
working historical model and near-universal endorsement. The orphan
catalogue's complaint: nobody has laid out a detailed plan for creating one.

Lay it out.

- **What counts as an incident.** The definitional core. A model that behaves
  unexpectedly in a military-adjacent system, a suspected exfiltration, a
  capability jump nobody declared, a false alarm in a monitoring system. Each
  needs a threshold, or the line rings for everything and then for nothing.
- **Who picks up.** Named institutional roles on both sides, their authority
  to speak, and what happens when the person with the technical knowledge and
  the person with the authority are not the same person — which, on this
  subject, they never are.
- **What gets said.** The message template. This is where the design lives:
  the whole point is conveying enough to defuse without conveying enough to
  compromise. Say what fields the message has and what each side is
  deliberately not required to reveal.
- **The credibility problem.** Why the receiving side believes anything sent
  over the line. This is a verification question, and it is the reason a
  hotline is not simply a phone number: a channel that can be used to lie
  convincingly is worse than no channel.
- **The precedent read.** What the nuclear-era analogues actually did, and
  where the analogy breaks — different timescales, private-sector actors on
  one side of the wire, no equivalent of a launch detection.

## Why it exists

The track's spine is verification between two parties who expect to be
cheated. A hotline is the smallest possible instance: no inspections, no
thresholds, one channel, and the entire question is whether a message across
it changes what the other side believes. Module 4's layering question in
miniature.

It is also the track's cheapest real-world artifact. Almost everything else in
verification needs hardware that does not exist yet or a treaty nobody will
sign. A hotline needs a definition, a roster and a template — which is
precisely why its absence is embarrassing.

## Scope

**In scope:** the arms-control hotline literature, public reporting on
existing bilateral military channels, and the track's actor taxonomy.

**Out of scope:** the diplomacy of proposing it, and the technical security of
the channel itself. Assume a secure channel exists; the hard part is what
travels down it.

**Do not design a general-purpose crisis mechanism.** One incident class done
to the level of a usable message template beats a taxonomy of twelve.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Incidents | "Significant AI-related events" | Thresholds per class, and a named event that deliberately does not qualify |
| Roster | "Senior officials" | Roles with authority stated, and the technical/authority split addressed |
| The message | "Both sides share information" | A template with fields, and what each side is not required to disclose |
| Credibility | Assumed | Why the receiver believes it, and what a deceptive use of the line would look like |

## Getting started

1. Write the message template first. It forces every other decision — who can
   send it, what they must know, what they are protecting.
2. Pick the incident class you find hardest to define. The easy ones do not
   need a hotline.
3. Red-team it as a deception channel in week two. If the line makes a
   convincing lie cheaper, the design has to change.
