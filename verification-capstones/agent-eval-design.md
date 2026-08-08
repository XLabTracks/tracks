---
title: Evaluate an Agent, Not a Model
track: Technical Governance
status: draft
summary: Agent capability depends on the scaffold, the tools and the environment as much as the model. Build the eval that survives that, and report what your score is actually about.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Agent eval with an ablation over scaffold and tools, plus a note on what the score attributes to what
deliverable_type: notebook
mentor: recommended
audience: The regulator who will be handed an agent benchmark score and asked to trigger on it.
skills: [agent evaluation, ablation design, attribution of capability, environment design]
sources:
  - "[A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
updated: 2026-08-04
---

## The brief

Week 4's lesson is that a benchmark score measures the model under *your*
elicitation. For agents the problem is worse in kind: the thing being measured
is a model plus a scaffold plus a tool set plus an environment, and the same
model swings enormously across those. A threshold attached to an agent
benchmark is attached to a compound object nobody has decomposed.

- **The task environment.** Small, scriptable, deterministic where it can be —
  a file-and-shell sandbox, a mock API, a multi-step retrieval task. Success
  criteria that a script can check.
- **The agent eval.** Run it. Report success rate over enough episodes to have
  an interval rather than an anecdote.
- **The ablation.** The heart of it. Hold the model fixed and vary the scaffold:
  number of steps allowed, retry policy, tool set, whether the agent can see its
  own errors, memory across steps. Then hold the scaffold fixed and vary the
  model. Report both. If scaffold variation moves the score more than model
  variation, that is your headline finding and it is one policy readers need.
- **The attribution note.** Two pages: what your number is a property of, what
  it would take to make it a property of the model, and what a governance
  threshold should therefore be written against — a model, a model-and-scaffold
  pair, or a deployed system.
- **Optional extension:** two agents in the same environment. TAIG asks about
  networks of interacting agents separately, and even two is enough to show
  that the measurement problem changes shape again.

## Why it exists

Agent capability is where the next round of thresholds will be set, and the
measurement practice is much less mature than the single-turn benchmark
practice the track already teaches. Learners who have personally watched a
score double because they allowed five more steps will read every agent
benchmark claim differently afterwards.

It also generalises the elicitation lesson into the form that matters for
policy. "Which of these numbers is a property of the model?" is the question a
regulator has to answer to write a rule, and almost nobody hands them the
ablation that would let them.

## Scope

**In scope:** a small open model plus a cheap API model, an off-the-shelf agent
framework, and a sandboxed task environment you build.

**Out of scope:** dangerous-capability agent tasks of any kind, and any
environment with real credentials or network side-effects. Use a benign task —
multi-step retrieval, file manipulation, a puzzle — because the methodology is
the deliverable, not the capability.

**Also out of scope:** building a new agent framework. Pin an existing one and
spend the time on the ablation.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Environment | Ad hoc prompts | Scriptable, deterministic where possible, with machine-checkable success |
| Ablation | One scaffold | Scaffold and model varied independently, with both effects quantified |
| Reporting | A success rate | An interval over episodes, with the episode count stated |
| Attribution | "Agents are hard to evaluate" | What the number is a property of, and what a threshold should attach to |

## Getting started

1. Build the environment and freeze it in week one. Teams that keep editing the
   task never accumulate enough episodes to have a number.
2. Run the step-limit ablation first. It is one line of config and it usually
   produces the largest effect in the whole study.
3. Decide the episode count from the variance you see in the first twenty runs,
   not from what feels tidy.
