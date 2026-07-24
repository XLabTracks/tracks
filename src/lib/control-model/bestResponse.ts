/**
 * Red-team best response: grid argmax over (gStar, sigma) (PLAN §4.7).
 * ~2,400 closed-form evaluations; recomputed live on any blue-lever change.
 */
import { PARAMS, Levers, RedStrategy } from './params'
import { evaluateGame, GameResult } from './protocol'

export interface BestResponse {
  red: RedStrategy
  result: GameResult
  /** Full grid for the heatmap: pRedWin[si][gi]. */
  grid: { gStars: number[]; sigmas: number[]; pRedWin: number[][] }
}

/**
 * Memo over the levers evaluateGame reads (q, b, d, attackSd) — the search
 * supplies its own red grid, so levers.red (and uT, usefulness-only) are
 * excluded from the key; extend it if evaluateGame ever reads more levers.
 * Module scope on purpose: Worker isolates outlive requests, so SSR of the
 * demo pages hits a warm cache. Callers must not mutate the returned object.
 */
const MEMO_MAX = 200
const memo = new Map<string, BestResponse>()

export function bestResponse(levers: Levers): BestResponse {
  const key = `${levers.q}|${levers.b}|${levers.d}|${levers.attackSd}`
  const hit = memo.get(key)
  if (hit) {
    // Refresh recency: Map iterates in insertion order, oldest evicted first.
    memo.delete(key)
    memo.set(key, hit)
    return hit
  }
  const gStars: number[] = []
  const sigmas: number[] = []
  for (let i = 0; i < PARAMS.BR_GSTAR_STEPS; i++) gStars.push((i / (PARAMS.BR_GSTAR_STEPS - 1)) * 0.995)
  for (let j = 0; j < PARAMS.BR_SIGMA_STEPS; j++) sigmas.push(j / (PARAMS.BR_SIGMA_STEPS - 1))

  let best: GameResult | null = null
  let bestRed: RedStrategy = { mode: 'fixed', gStar: 0, sigma: 0 }
  const pGrid: number[][] = []
  for (let j = 0; j < sigmas.length; j++) {
    const row: number[] = []
    for (let i = 0; i < gStars.length; i++) {
      const red: RedStrategy = { mode: 'fixed', gStar: gStars[i], sigma: sigmas[j] }
      const res = evaluateGame(levers, red)
      row.push(res.pRedWin)
      if (!best || res.pRedWin > best.pRedWin) {
        best = res
        bestRed = red
      }
    }
    pGrid.push(row)
  }
  const res: BestResponse = { red: bestRed, result: best!, grid: { gStars, sigmas, pRedWin: pGrid } }
  if (memo.size >= MEMO_MAX) memo.delete(memo.keys().next().value!)
  memo.set(key, res)
  return res
}

/** Safety of the current levers against the red team's best response. */
export function safetyVsBestResponse(levers: Levers): GameResult {
  return bestResponse(levers).result
}

const fineMemo = new Map<string, { red: RedStrategy; result: GameResult }>()

const G_STEP = 0.995 / (PARAMS.BR_GSTAR_STEPS - 1)
const S_STEP = 1 / (PARAMS.BR_SIGMA_STEPS - 1)

/**
 * Per-coordinate ternary polish of an argmax seed, searching ±1 grid cell
 * around it. Deterministic; ~80 closed-form evaluations. pRedWin is a
 * staircase in gStar (the opportunity pool is a 256-node grid), so the gStar
 * polish resolves to a plateau; sigma is genuinely continuous.
 */
function polishSeed(levers: Levers, g0: number, s0: number): { g: number; s: number } {
  const p = (g: number, s: number) => evaluateGame(levers, { mode: 'fixed', gStar: g, sigma: s }).pRedWin
  let g = g0
  let s = s0
  for (let round = 0; round < 2; round++) {
    let gLo = Math.max(0, g - G_STEP)
    let gHi = Math.min(0.995, g + G_STEP)
    for (let it = 0; it < 10; it++) {
      const m1 = gLo + (gHi - gLo) / 3
      const m2 = gHi - (gHi - gLo) / 3
      if (p(m1, s) < p(m2, s)) gLo = m1
      else gHi = m2
    }
    g = (gLo + gHi) / 2
    let sLo = Math.max(0, s - S_STEP)
    let sHi = Math.min(1, s + S_STEP)
    for (let it = 0; it < 10; it++) {
      const m1 = sLo + (sHi - sLo) / 3
      const m2 = sHi - (sHi - sLo) / 3
      if (p(g, m1) < p(g, m2)) sLo = m1
      else sHi = m2
    }
    s = (sLo + sHi) / 2
  }
  return { g, s }
}

/**
 * Continuous polish of the grid argmax. The 60×40 grid pins the right basin
 * (the surface can be multimodal across defer regimes); polishSeed then moves
 * the argmax quasi-continuously in the blue levers. Use this where the
 * STRATEGY itself is rendered (e.g. the defer demo's attack histogram, drawn
 * at the best response) so it doesn't visibly snap between grid cells as a
 * lever drags.
 */
export function bestResponseFine(levers: Levers): { red: RedStrategy; result: GameResult } {
  const key = `${levers.q}|${levers.b}|${levers.d}|${levers.attackSd}`
  const hit = fineMemo.get(key)
  if (hit) {
    fineMemo.delete(key)
    fineMemo.set(key, hit)
    return hit
  }
  const coarse = bestResponse(levers)
  const { g, s } = polishSeed(levers, coarse.red.gStar, coarse.red.sigma)
  const red: RedStrategy = { mode: 'fixed', gStar: g, sigma: s }
  const res = { red, result: evaluateGame(levers, red) }
  if (fineMemo.size >= MEMO_MAX) fineMemo.delete(fineMemo.keys().next().value!)
  fineMemo.set(key, res)
  return res
}

export interface SweepPoint {
  d: number
  red: RedStrategy
  result: GameResult
}

export interface SweepByPoint {
  v: number
  red: RedStrategy
  result: GameResult
}

const sweepByMemo = new Map<string, SweepByPoint[]>()

/**
 * Best response along an arbitrary lever sweep (charts whose x-axis is a blue
 * lever). Warm-start continuation: each point polishes the previous point's
 * argmax (the argmax path is continuous in the levers), with a full grid
 * re-anchor every 8th point as insurance against basin hops — so a ~40-point
 * sweep costs a few full grids plus cheap polishes instead of ~40 grids.
 * Deterministic. `cacheKey` must encode everything makeLevers closes over.
 */
export function bestResponseSweepBy(
  cacheKey: string,
  values: number[],
  makeLevers: (v: number) => Levers,
): SweepByPoint[] {
  const key = `${cacheKey}|${values.length}|${values[0]}|${values[values.length - 1]}`
  const hit = sweepByMemo.get(key)
  if (hit) return hit
  const out: SweepByPoint[] = []
  let seed: { g: number; s: number } | null = null
  for (let i = 0; i < values.length; i++) {
    const levers = makeLevers(values[i])
    if (!seed || i % 8 === 0) {
      const f = bestResponseFine(levers)
      seed = { g: f.red.gStar, s: f.red.sigma }
      out.push({ v: values[i], red: f.red, result: f.result })
    } else {
      seed = polishSeed(levers, seed.g, seed.s)
      const red: RedStrategy = { mode: 'fixed', gStar: seed.g, sigma: seed.s }
      out.push({ v: values[i], red, result: evaluateGame(levers, red) })
    }
  }
  if (sweepByMemo.size >= 20) sweepByMemo.delete(sweepByMemo.keys().next().value!)
  sweepByMemo.set(key, out)
  return out
}

/** Best response along a defer-band sweep, for charts whose x-axis is d. */
export function bestResponseSweepD(base: Levers, dValues: number[]): SweepPoint[] {
  return bestResponseSweepBy(`d|${base.q}|${base.b}|${base.attackSd}`, dValues, (d) => ({ ...base, d })).map(
    (p) => ({ d: p.v, red: p.red, result: p.result }),
  )
}
