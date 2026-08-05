---
title: A Cloud KYC Regime That Is Not Just Paperwork
track: Verification
status: draft
summary: Module 2.2 warns that self-reporting alone is a paperwork regime. Design the cloud reporting rules for one provider so that at least one claim in them is actually checkable.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Reporting-rule spec with a per-claim checkability rating and the evasion routes it leaves open
deliverable_type: spec
mentor: recommended
audience: The national regulator drafting the reporting obligation, and the provider who has to implement it.
skills: [regime design, telemetry analysis, evasion modelling, cost-of-compliance analysis]
prerequisites: [Verification 1 — actors, Verification 2.2 — the cloud layer, Verification 3 — covert development]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[Technical AI Governance project site — Stanford](https://taig.stanford.edu/)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - verification-track-outline.md §2.2
  - verification-track-outline.md §3 (evasion scenarios 1, 6, 8)
updated: 2026-08-04
---

## The brief

The cloud layer is the one place in the stack where a commercial party
already sits between the customer and the machines, already runs KYC for
other reasons, and already has the telemetry. Module 2.2 rates it *very
partially solved* — proxies, fragmented accounts, reseller chains and
jurisdictional gaps eat most of the promise, and the standing warning is that
self-reporting alone produces a paperwork regime.

Write the reporting rules for one provider in one jurisdiction so that they
are not that.

- **The obligations.** What the provider declares, about whom, how often, to
  which of the three levels — company, national regulator, intelligence — and
  under what penalty for misdeclaration.
- **The checkability rating.** The core of the deliverable. Per obligation:
  is the claim *self-reported only*, *cross-checkable against a second
  source*, or *independently observable*? Module 2.2 gives you the second
  column to work with — power draw, cooling, interconnect use, procurement,
  satellite-visible buildout — against the things that are easy to fake:
  identity, declared purpose, workload labels, logs.
- **The evasion routes left open.** Specifically proxy organisations,
  false reporting and sub-threshold distributed training. For each, what your
  rules would and would not catch.
- **The cost.** What compliance costs the provider, and what it costs the
  customers who are not doing anything wrong. A rule that pushes ordinary
  workloads offshore has made verification worse.
- **The one rule you would keep.** If the regulator could only have a single
  obligation, which one, and why that one buys the most.

## Why it exists

This is the track's central discipline applied to the layer where it is
easiest to fool yourself. Cloud reporting *looks* like verification: there are
forms, there are logs, there is a regulator receiving them. Module 2.2's
warning is that the whole apparatus can be exactly as strong as the honesty of
the party filling it in, unless some claim in it is anchored to something the
party does not control.

Finding that anchor — and being honest about how few of your obligations have
one — is the skill. It is also the skill that transfers directly to the
Module 4 capstone, where the same question gets asked of a whole regime.

## Scope

**In scope:** one provider archetype and one jurisdiction, public reporting on
cloud infrastructure and datacentre buildout, and the track's evasion
taxonomy.

**Out of scope:** the international layer. You are writing a national
reporting obligation, not a treaty; who else could see the reports is a
Module 4 question.

**Also out of scope:** inventing telemetry. Work with what a provider
plausibly has or could add cheaply. A rule requiring a capability nobody has
built is a research agenda, not a regime — cite it as a successor rule and
move on.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Obligations | A list of things to report | Each one tied to what a verifier would then be able to conclude |
| Checkability | Assumed | Rated per obligation, with the second source named where one exists |
| Evasion | "Bad actors could evade" | The three named routes, each with what your rules catch and miss |
| Cost | Ignored | Priced for the provider *and* the compliant customer, with the rule you would drop first |

If every obligation in your spec comes out cross-checkable, you have been
generous with yourself. Most reporting regimes are mostly self-reported, and
saying so is the finding.

## Getting started

1. Build the fakeable / not-easily-fakeable table from Module 2.2 before
   drafting a single obligation. It determines which rules are worth writing.
2. Draft the proxy-organisation evasion first. It is the route that most
   cleanly defeats account-level KYC, and confronting it early stops you from
   writing a spec that only works against honest customers.
3. Ask the cost question of every obligation as you add it. The regime that
   survives is the short one.
