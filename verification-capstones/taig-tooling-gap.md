---
title: Close One Gap in Technical AI Governance
theme: Technical Governance
status: draft
summary: Take one open problem from the technical AI governance agenda and specify the tool that would close it — who builds it, who would have to adopt it, and what it costs to be wrong.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Gap dossier — one open problem, one specified tool, an adoption path, and a failure analysis
deliverable_type: dossier
mentor: recommended
audience: A funder deciding between building the tool and waiting for someone else to.
skills: [problem decomposition, technical specification, adoption analysis, cost estimation]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[Technical AI Governance project site — Stanford](https://taig.stanford.edu/)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-04
---

## The brief

The technical AI governance agenda makes a specific claim: governance is
blocked in two ways at once — decision-makers lack information, and the
technical tools that would produce that information do not exist. Pick one
open problem where both are true and write the dossier that would let someone
decide to build the missing tool.

The dossier has four parts:

- **The problem, restated as a decision.** Not "we lack good watermarking"
  but "actor A cannot currently establish B, so decision C is made blind."
  Name A, B and C.
- **The tool.** What would have to exist. Inputs, outputs, who runs it, what
  guarantee it gives and — the part most write-ups skip — what guarantee it
  explicitly does not give.
- **The adoption path.** A tool nobody adopts closes nothing. Who has to use
  it, what makes them, and whether that is a standard, a procurement clause, a
  statute, or commercial self-interest.
- **The failure analysis.** How the tool gets gamed, how it degrades as models
  change, and what a decision-maker would wrongly conclude if they trusted a
  gamed output.

## Why it exists

The track teaches you to read a governance proposal and ask "could anyone
verify that?" This is the constructive version of the same move. It is also
the piece of work most directly shaped like technical-governance employment:
somebody hands you a policy ask, and you have to say what artifact would
satisfy it and what it would take to get one.

The agenda-level papers are deliberately broad. Depth on one problem is worth
more than a survey of twelve, and you will find that the interesting content
is almost always in the adoption path — the technical part is frequently the
easy part.

## Scope

**In scope:** one open problem, one tool, published literature, and the
program's own track materials.

**Out of scope:** building the tool. This is a specification and a case, not
an implementation. If you find yourself writing code, you have swapped this
capstone for a different one.

**Also out of scope:** picking a problem because it is fashionable. The
agenda has unglamorous entries — data provenance, compute accounting,
post-deployment monitoring — and those usually have shorter adoption paths,
which makes them better dossiers.

## What good looks like

- The decision statement survives being read aloud to someone outside the
  field. If they ask "so what?", the restatement failed.
- The adoption path names organisations, not categories. "Standards bodies"
  is not an answer; a named body with a named workstream is.
- The failure analysis includes at least one way the tool makes things
  *worse* — false assurance is a real cost and the dossier should price it.
- Somewhere in the dossier is a paragraph arguing the opposite conclusion,
  written well enough that a reader could act on it.

## Getting started

1. Read the agenda's problem list once for breadth, then pick by adoption
   path, not by technical interest. The problems worth a dossier are the ones
   where you can name who would use the answer.
2. Write the decision statement first, and rewrite it until it has a named
   actor and a named blocked decision.
3. Interview the literature adversarially: search specifically for people
   saying the tool already exists. Either they are right — pick again in week
   one — or you have found your dossier's strongest section.
