---
title: Minimal Verification Regime for an Emergency Pause
track: Verification
status: ready
summary: Design the smallest verification regime that could make a three-month emergency pause credible to a party that expects to be cheated.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: core
deliverable: Two-page regime spec plus a one-page evasion annex
deliverable_type: spec
mentor: recommended
audience: The negotiating team that would have to sign it, and the technical staff who would have to run it.
skills: [regime design, threat modelling, evidence standards, institutional analysis]
prerequisites: [Verification 2.x — the four layers, Verification 3 — covert development, Verification 4.1 — feasibility and layering]
sources: [verification-track-outline.md §4.2]
updated: 2026-08-04
---

## The brief

Pick one agreement — a three-month emergency pause, a compute cap, or a
conditional slowdown — and specify the verification regime that would make
it credible. Not the ideal regime: the *minimal* one. Every mechanism you
add has to earn its place against the question "what does the other side
believe after this that they did not believe before?"

Your spec names, at minimum:

- **The agreement.** What exactly is prohibited, over what period, with
  what exemptions. One paragraph, written so a lawyer could not drive a
  truck through it.
- **Covered actors.** Who is in scope — labs, cloud providers, chipmakers,
  states — and who is deliberately left out.
- **Thresholds.** The numbers that trigger obligations, plus what happens
  to their selectivity over the agreement's lifetime.
- **Reporting rules.** What is declared, by whom, how often, under what
  penalty for misdeclaration.
- **The verification stack.** Which of the hardware, cloud, intelligence
  and human layers you are using, and what each one buys you.
- **Evasion risks.** The three most plausible defection routes and what,
  concretely, would catch each one.
- **Evidence standards.** What quantum of evidence justifies a challenge
  inspection, a suspension, a public accusation.
- **Enforcement pathway.** What happens after detection — the step most
  regimes leave as an exercise for the reader.

## Why it exists

The track's central question is whether the US and China could trust an
agreement to pause frontier development. Every module builds one piece of
the answer; this is where the pieces have to hold each other up. A regime
that verifies beautifully but has no enforcement pathway is a research
paper, not a policy. A regime with teeth and no evidence standard is a
casus belli generator.

This is also the track's strongest portfolio artifact. It is the closest
thing in the program to what a technical-governance fellowship actually
asks for: a scoped design under adversarial pressure, with the failure
modes named by the author rather than the reviewer.

## Scope

**In scope:** one agreement, one adversary model, the four layers you
already studied, and mechanisms that exist or are plausibly buildable in
the agreement's window.

**Out of scope:** inventing new verification technology; a full treaty
text; the diplomacy of getting to the table. If a mechanism needs a
decade of hardware rollout, you may cite it as a successor regime, but it
cannot be load-bearing in a three-month pause.

You are reusing work, not starting from zero. The problem/solution model
you seeded in Module 0, the stakeholder map from Module 1, the chokepoint
ranking from Module 2, and the evasion scenarios from Module 3 are the
inputs. If you find yourself re-deriving them, stop and go get them.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Minimality | Every mechanism the course mentioned, stacked | Four mechanisms, each with a stated job, and a named thing you cut |
| Adversary | "A bad actor might cheat" | A specific defection route with a cost, a timeline, and a detection probability |
| Evidence | "Inspectors would investigate" | A stated threshold: what triggers a challenge, what a challenge can conclude |
| Honesty | Confident throughout | The failure modes are in your own text, in the section where they belong |

The single best predictor of a strong submission: your evasion annex
attacks *your* regime, specifically, rather than verification in general.

## Getting started

1. Write the one-paragraph agreement first. Most drafts wobble because the
   thing being verified was never pinned down.
2. Choose the adversary before the mechanisms — a state actor willing to
   burn diplomatic capital and a profit-maximising lab produce different
   regimes.
3. Draft the evasion annex *second*, not last. It will delete two of your
   mechanisms and save you a week.
