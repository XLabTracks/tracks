/**
 * Protocol evaluation: safety, usefulness, per-attack aggregates (PLAN §4.4–§4.6).
 * All quantities are exact expectations (grid integration over opportunities);
 * no Monte Carlo (PLAN P6).
 */
import { PARAMS, Levers, RedStrategy } from './params'
import { attackOutcome, attackOutcomeAt, muAttack, muAttackFromBase, muBase, opportunityGrid, opportunityIndexAbove, pSucc, attackRate, zAudit, zDefer } from './distributions'
import { clamp } from './math'

export interface AttackAggregates {
  /** Expected number of attacks k = r * N. */
  k: number
  /** Attack rate r = P(g > gStar). */
  r: number
  /** Mean per-attack catch probability. */
  cBar: number
  /** Mean per-attack defer probability. */
  fBar: number
  /** Mean per-attack ship probability. */
  shipBar: number
  /** Mean per-attack win probability wBar = E[ship] * pSucc(sigma). */
  wBar: number
}

/** Aggregate per-attack outcome probabilities over opportunities g > gStar. */
export function attackAggregates(levers: Levers, red: RedStrategy): AttackAggregates {
  const { g, w } = opportunityGrid()
  const ps = pSucc(red.sigma)
  // Loop invariants (3 of the 5 Phi/PhiInv per grid point) hoisted out.
  const mb = muBase(levers.q, levers.attackSd)
  const za = zAudit(levers.b)
  const zd = zDefer(levers.d)
  let mass = 0
  let c = 0
  let f = 0
  let ship = 0
  for (let i = 0; i < g.length; i++) {
    if (g[i] <= red.gStar) continue
    const mu = muAttackFromBase(mb, red.sigma, g[i])
    const out = attackOutcomeAt(mu, za, zd, levers.attackSd)
    c += w[i] * out.catch_
    f += w[i] * out.defer_
    ship += w[i] * out.ship
    mass += w[i]
  }
  if (mass === 0) return { k: 0, r: 0, cBar: 0, fBar: 0, shipBar: 0, wBar: 0 }
  const r = mass
  return {
    k: r * PARAMS.N,
    r,
    cBar: c / mass,
    fBar: f / mass,
    shipBar: ship / mass,
    wBar: (ship / mass) * ps,
  }
}

/**
 * One pass over the opportunity grid at a FIXED sigma, accumulated into suffix
 * sums — the row-sweep path behind the best-response search.
 *
 * attackAggregates re-walks the whole 256-node grid for every gStar (skipping
 * the head with `g[i] <= gStar`), so a grid search pays O(gStars * G_BINS) Phi
 * pairs per sigma. But the attacked set is always a SUFFIX of the grid, and the
 * per-point weighted contributions w[i]*catch_ / w[i]*defer_ / w[i]*ship / w[i]
 * do not depend on gStar at all. Sum them from the top once and every gStar's
 * aggregates are an O(1) array read: O(G_BINS) Phi pairs per sigma, whatever the
 * gStar resolution. Same math as attackAggregates (same muBase/zAudit/zDefer
 * hoists, same attackOutcomeAt), so results match to floating-point association.
 */
export interface AttackRowSweep {
  /** The subtlety this row was swept at. */
  sigma: number
  /** pSucc(sigma), hoisted (wBar = shipBar * ps). */
  ps: number
  /** Suffix sums, length G_BINS + 1: index i sums grid points j >= i (…[n] = 0). */
  cSuf: Float64Array
  fSuf: Float64Array
  shipSuf: Float64Array
  /** Suffix opportunity mass — the attack rate r for a gStar landing at i. */
  wSuf: Float64Array
}

/** Build the suffix-sum row for one sigma under the current blue levers. */
export function attackRowSweep(levers: Levers, sigma: number): AttackRowSweep {
  const { g, w } = opportunityGrid()
  const n = g.length
  // Same loop invariants attackAggregates hoists (3 of the 5 Phi/PhiInv).
  const mb = muBase(levers.q, levers.attackSd)
  const za = zAudit(levers.b)
  const zd = zDefer(levers.d)
  const cSuf = new Float64Array(n + 1)
  const fSuf = new Float64Array(n + 1)
  const shipSuf = new Float64Array(n + 1)
  const wSuf = new Float64Array(n + 1)
  for (let i = n - 1; i >= 0; i--) {
    const mu = muAttackFromBase(mb, sigma, g[i])
    const out = attackOutcomeAt(mu, za, zd, levers.attackSd)
    cSuf[i] = cSuf[i + 1] + w[i] * out.catch_
    fSuf[i] = fSuf[i + 1] + w[i] * out.defer_
    shipSuf[i] = shipSuf[i + 1] + w[i] * out.ship
    wSuf[i] = wSuf[i + 1] + w[i]
  }
  return { sigma, ps: pSucc(sigma), cSuf, fSuf, shipSuf, wSuf }
}

/** Aggregates for the gStar whose attacked set starts at grid index i0. */
export function rowSweepAggregatesAt(sweep: AttackRowSweep, i0: number): AttackAggregates {
  const mass = sweep.wSuf[i0]
  if (mass === 0) return { k: 0, r: 0, cBar: 0, fBar: 0, shipBar: 0, wBar: 0 }
  const r = mass
  return {
    k: r * PARAMS.N,
    r,
    cBar: sweep.cSuf[i0] / mass,
    fBar: sweep.fSuf[i0] / mass,
    shipBar: sweep.shipSuf[i0] / mass,
    wBar: (sweep.shipSuf[i0] / mass) * sweep.ps,
  }
}

/** rowSweepAggregatesAt for a gStar value (maps it to its suffix index). */
export function rowSweepAggregates(sweep: AttackRowSweep, gStar: number): AttackAggregates {
  return rowSweepAggregatesAt(sweep, opportunityIndexAbove(gStar))
}

export interface GameResult {
  /** P(red team wins): a working backdoor ships before any catch. */
  pRedWin: number
  /** Safety = 1 - pRedWin. */
  safety: number
  /** The two factors of PLAN §4.5, exposed for the stage-8 formula panel. */
  raceFactor: number // wBar / (wBar + cBar)
  eventFactor: number // 1 - (1 - r (wBar + cBar))^N
  agg: AttackAggregates
}

/**
 * P(red wins) = [wBar/(wBar+cBar)] * [1 - (1 - r (wBar+cBar))^N]   (PLAN §4.5)
 * Each of the N problems is independently decisive with probability
 * r (wBar+cBar); this is the exact first-decisive-event probability for
 * i.i.d. problems. (The previous 1 - exp(-k (wBar+cBar)), with k = r N, was the
 * Poisson limit of this power form.)
 */
export function evaluateGame(levers: Levers, red: RedStrategy): GameResult {
  return gameFromAggregates(attackAggregates(levers, red))
}

/** The §4.5 tail, shared by the direct and row-sweep paths so they cannot drift. */
function gameFromAggregates(agg: AttackAggregates): GameResult {
  const decisive = agg.wBar + agg.cBar
  if (agg.k === 0 || decisive <= 0) {
    return { pRedWin: 0, safety: 1, raceFactor: 0, eventFactor: 0, agg }
  }
  const raceFactor = agg.wBar / decisive
  const eventFactor = 1 - Math.pow(1 - agg.r * decisive, PARAMS.N)
  const pRedWin = raceFactor * eventFactor
  return { pRedWin, safety: 1 - pRedWin, raceFactor, eventFactor, agg }
}

/** evaluateGame off a row sweep, for a gStar landing at grid index i0. */
export function evaluateGameOnRowAt(sweep: AttackRowSweep, i0: number): GameResult {
  return gameFromAggregates(rowSweepAggregatesAt(sweep, i0))
}

/** evaluateGame off a row sweep, for a gStar value. */
export function evaluateGameOnRow(sweep: AttackRowSweep, gStar: number): GameResult {
  return evaluateGameOnRowAt(sweep, opportunityIndexAbove(gStar))
}

/**
 * Stage-8 didactic variant: homogeneous attacks (no opportunity
 * heterogeneity), red directly chooses the number of attacks k.
 * Uses the attack distribution at fixed opportunity quality gFixed.
 * P(red wins) = [wBar/(wBar+cBar)] * [1 - (1 - (wBar+cBar))^k], exact for
 * i.i.d. attacks; at k=1 it collapses to pRedWin = wBar (the sanity check the
 * lesson invites). The previous 1 - exp(-k (wBar+cBar)) was its Poisson limit.
 */
export function evaluateHomogeneous(levers: Levers, sigma: number, k: number, gFixed = 0.5): GameResult {
  const mu = muAttack(levers.q, sigma, gFixed, levers.attackSd)
  const out = attackOutcome(mu, levers.b, levers.d, levers.attackSd)
  const wBar = out.ship * pSucc(sigma)
  const cBar = out.catch_
  const decisive = wBar + cBar
  const agg: AttackAggregates = { k, r: k / PARAMS.N, cBar, fBar: out.defer_, shipBar: out.ship, wBar }
  if (k === 0 || decisive <= 0) return { pRedWin: 0, safety: 1, raceFactor: 0, eventFactor: 0, agg }
  const raceFactor = wBar / decisive
  const eventFactor = 1 - Math.pow(1 - decisive, k)
  return { pRedWin: raceFactor * eventFactor, safety: 1 - raceFactor * eventFactor, raceFactor, eventFactor, agg }
}

/**
 * Usefulness (PLAN §4.6), rescaled so all-T = 0 and all-U = 1.
 * Deferred fraction ≈ innocent mass in the defer band = d - b.
 */
export function usefulness(levers: Levers): number {
  const deferFrac = clamp(levers.d - levers.b, 0, 1)
  return 1 - deferFrac
}

/**
 * Upfront-auditing baseline (stage 3; PLAN §4.5 note).
 * Audit the first bN problems positionally; no monitor. Red is memoryless:
 * attacks each problem with probability rho (obvious backdoor, sigma = 0).
 * Any attack in the audited prefix is caught (blue wins); afterwards attacks
 * ship and win with probability pSucc(0).
 * P(red) = (1-rho)^(bN) * [1 - (1 - rho * p)^((1-b)N)]; maximized over rho.
 */
export function upfrontAuditing(b: number = PARAMS.bDefault): { safety: number; bestRho: number } {
  const p = pSucc(0)
  const nPrefix = Math.round(b * PARAMS.N)
  const nRest = PARAMS.N - nPrefix
  let best = 0
  let bestRho = 0
  // rho swept on a log grid; the optimum is well inside.
  for (let i = 0; i <= 400; i++) {
    const rho = Math.pow(10, -5 + (5 * i) / 400) // 1e-5 .. 1
    if (rho > 1) break
    const pRed = Math.pow(1 - rho, nPrefix) * (1 - Math.pow(1 - rho * p, nRest))
    if (pRed > best) {
      best = pRed
      bestRho = rho
    }
  }
  return { safety: 1 - best, bestRho }
}

/** Attack rate helper re-exported for UI convenience. */
export { attackRate }
