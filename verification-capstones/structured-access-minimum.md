---
title: The Minimum Standard for Researcher Access
theme: Technical Governance
status: draft
summary: Structured access exists as a trend and not as a floor. Write the minimum acceptable standard — what a researcher must be able to do, and what the company keeps.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Minimum access standard with a tiering scheme and the IP protections that make it signable
deliverable_type: spec
mentor: optional
audience: The lab deciding what to offer, and the auditor deciding whether it is enough.
skills: [access-regime design, threat modelling, negotiating competing interests, standard drafting]
sources:
  - "[Orphaned Policies (post 5 of 7 on AI governance) — Mass_Driver, orphan 11](https://www.lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance)"
updated: 2026-08-04
---

## The brief

Week 6's exercise has you design a tiered API-access scheme for a hypothetical
dual-use model and defend the trade-offs. This is that exercise pointed at a
real gap: several companies offer structured access, nobody has said what the
minimum acceptable version is, and so "we provide researcher access" is
currently unfalsifiable.

Write the floor.

- **The capability list.** What an external researcher must be able to *do* —
  not what they must be granted. Rate limits high enough to run a real eval.
  Logprobs or not. Fine-tuning or not. The base model or only the deployed
  one. Enough attempts to characterise variance rather than sample it.
  Publication without pre-approval, or with what kind.
- **The tiers.** Who gets what: a credentialled auditor under contract, an
  academic, a journalist, anyone. Each tier's entry requirement and each
  tier's ceiling.
- **What the company keeps.** Weights, training data, unreleased checkpoints,
  and the commercial information a competitor could reconstruct from usage
  patterns. A standard that ignores this is one no company adopts, which makes
  it a floor of zero.
- **The gaming section.** How a company complies with your standard in letter
  and defeats it in practice — a tier nobody qualifies for, an approval queue
  measured in months, a rate limit that technically permits the eval you
  cannot afford to run. Then the language that closes each.

## Why it exists

Almost every accountability mechanism in AI governance — third-party audit,
independent evals, incident investigation, the attestation work elsewhere in
this bank — assumes an outsider can get at the system. Nobody has specified
what "get at" means, so every downstream proposal quietly inherits an
undefined dependency.

Week 6 gives you the design vocabulary. The addition here is that a *minimum*
is a different object from a *scheme*: it has to be the version that still
works when written by someone who does not want to grant it.

## Scope

**In scope:** published access programmes, the structured-access literature,
audit and researcher-access provisions in existing regulation, and what
published external evaluations actually needed to run.

**Out of scope:** the enforcement instrument. Whether this arrives as a
licence condition, a procurement requirement or a voluntary commitment is a
policy-track question — write the standard so any of them could adopt it.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Capabilities | "Meaningful API access" | Named affordances with numbers, justified by what a real eval needed |
| Tiers | One level | Tiers with entry requirements and ceilings, and who falls between them |
| Company interests | Ignored or waved through | Specific: what is protected, and why that protection does not hollow out the floor |
| Gaming | Absent | Four compliance-in-letter manoeuvres, each with the closing language |

## Getting started

1. Find two published external evaluations and work out what access they
   needed. Your floor should be the level at which that work is possible.
2. Write the gaming section in week one. It is the fastest way to find out
   which of your requirements are load-bearing.
3. Ask of every requirement: could a company say yes to this and still be
   useless to an auditor? If yes, it is not yet a requirement.
