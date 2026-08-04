# `will-ledger` — a manipulable single-account political-will ledger

**Date:** 2026-08-04 · **Branch:** `mod-2` · **Status:** design record for the
`will-ledger` demo (module 2, `c-regimes-l1` §Resource state).

## Why a new demo here

Playtester feedback (2026-07-28): "I feel like there must be some way to
interact with the three states + safety budget concept in a more tangible
way." The section has been demo-less since the political-will unification
(`2026-07-20-political-will-unification-design.md`) deleted the three-bar
`will-account` demo (`2026-07-18-will-account-model.md`) because it simulated
the pre-unification three-wills model. This demo is **not** a resurrection:
it renders the **single** political-will account of the unified prose, and
everything it animates restates a claim that survives in `c-regimes-l1.mdx`
§"Resource state: what we can spend" and §"The loop". The historical specs
stand as records; this one supersedes neither — it fills the vacated slot
with a design consistent with the unification decision.

## Shape

A deterministic ledger, not a game and not a ticking simulation: one SVG
chart of the account over a fixed 24-month stage, recomputed instantly from
six toggles. No win/lose state, no randomness, no clock. (The deleted demo's
real-time tick loop and dice are deliberately not carried over — the
playtester asked for tangibility, and instant recomputation makes every
lever's effect attributable.)

- **Spends** (per-month drains while on): buy delay · usefulness tax (run a
  monitoring protocol) · pull compute. Costs shown on the chips.
- **The world**: public buy-in (ongoing: lifts the account and halves the
  fade) · a catch at month 8 (instant spike) · policy passes at month 16
  (spends a chunk, locks the remainder as a dashed floor the account cannot
  fade below).
- **The loop, made causal:** the catch toggle is disabled unless the
  monitoring spend is on — no protocol running, no catch, no evidence spike
  (lesson §"The loop", steps 1–3).
- A dashed ghost line shows the no-lever trajectory (pure fade) for
  contrast.

## Model (illustrative magnitudes, legible shapes — no curriculum numbers)

0–100 scale, start 40, t = 0..24 months.

| Mechanic | Value | Restates |
| --- | --- | --- |
| Fade | −1.5/month | "fades without reinforcement" |
| Buy delay | −1.2/month | delay priced by the race |
| Usefulness tax | −0.7/month | the tax; enables the catch (the loop) |
| Pull compute | −0.9/month | compute spends will via internal politics |
| Public buy-in | +0.5/month and fade ×0.5 | "raises the account and slows its fading" |
| Catch (t=8) | +25 instant | "refill hardest right after something goes wrong" |
| Policy (t=16) | spend 20, floor = remainder | "converts will into a durable floor" |

Clamp to [floor, 100], floor default 0. Spends stop draining below the
floor/zero (you cannot spend what you do not have).

## Integration & verification

`src/components/demos/will-ledger-demo.tsx`, self-contained `"use client"`,
hand-rolled inline SVG, theme tokens + fixed accents (emerald = catch,
sky = policy floor), no chart libs, no reset logic (DemoFrame remounts).
Registered as `will-ledger` (tags `control`, `how-useful`); embedded in
`c-regimes-l1.mdx` after the refill list (the slot vacated by the
unification). Caption strings restate lesson prose only. Verified by
typecheck + visual pass per house rules; registry wiring exercised by the
generic registry checks.
