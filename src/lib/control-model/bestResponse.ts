/**
 * Red-team best response: grid argmax over (gStar, sigma) (PLAN §4.7).
 * ~11,500 closed-form evaluations; recomputed live on any blue-lever change.
 * The search costs one opportunity-grid pass per SIGMA (not per cell) — see
 * attackRowSweep — so the gStar resolution is essentially free.
 */
import { PARAMS, Levers, RedStrategy } from './params'
import { attackRowSweep, evaluateGame, evaluateGameOnRowAt, GameResult } from './protocol'
import { opportunityIndexAbove } from './distributions'

/** The argmax alone — everything a caller needs unless it draws the heatmap. */
export interface BestResponseValue {
  red: RedStrategy
  result: GameResult
}

export interface BestResponse extends BestResponseValue {
  /** Full grid for the heatmap: pRedWin[si][gi]. */
  grid: { gStars: number[]; sigmas: number[]; pRedWin: number[][] }
}

/**
 * Memo key: the levers evaluateGame reads (q, b, d, attackSd). The search
 * supplies its own red grid, so levers.red (and uT, usefulness-only) are
 * excluded; extend this if evaluateGame ever reads more levers.
 */
const leverKey = (l: Levers) => `${l.q}|${l.b}|${l.d}|${l.attackSd}`

/** The (gStar, sigma) search grid is a constant — build it once, share it. */
const GSTARS: number[] = []
const SIGMAS: number[] = []
for (let i = 0; i < PARAMS.BR_GSTAR_STEPS; i++) GSTARS.push((i / (PARAMS.BR_GSTAR_STEPS - 1)) * 0.995)
for (let j = 0; j < PARAMS.BR_SIGMA_STEPS; j++) SIGMAS.push(j / (PARAMS.BR_SIGMA_STEPS - 1))
/**
 * Each gStar's attacked opportunity set is the suffix [i0, G_BINS) of the
 * opportunity grid, and i0 doesn't depend on sigma or on the blue levers — so
 * the mapping is hoisted all the way out and every cell is an O(1) read of its
 * row's suffix sums.
 */
const G_INDEX = GSTARS.map(opportunityIndexAbove)

/**
 * The row-sweep argmax over (gStar, sigma) — the one implementation behind both
 * bestResponse (heatmap) and bestResponseValue (argmax only). Pass an array to
 * collect the pRedWin grid into; pass null to skip building it entirely, which
 * is ~11.5k numbers and 96 row arrays a caller that only wants the argmax would
 * throw away. Cell values and tie-breaking (first strict max in row-major order)
 * are identical either way.
 */
function searchArgmax(levers: Levers, into: number[][] | null): BestResponseValue {
  let best: GameResult | null = null
  let bestRed: RedStrategy = { mode: 'fixed', gStar: 0, sigma: 0 }
  for (let j = 0; j < SIGMAS.length; j++) {
    const sweep = attackRowSweep(levers, SIGMAS[j])
    const row = into ? new Array<number>(GSTARS.length) : null
    for (let i = 0; i < GSTARS.length; i++) {
      const res = evaluateGameOnRowAt(sweep, G_INDEX[i])
      if (row) row[i] = res.pRedWin
      if (!best || res.pRedWin > best.pRedWin) {
        best = res
        bestRed = { mode: 'fixed', gStar: GSTARS[i], sigma: SIGMAS[j] }
      }
    }
    if (into && row) into.push(row)
  }
  return { red: bestRed, result: best! }
}

/**
 * Full search WITH the heatmap grid. Its LRU holds ~100KB per entry, so it stays
 * small — use bestResponseValue anywhere the grid isn't drawn.
 * Module scope on purpose: Worker isolates outlive requests, so SSR of the
 * demo pages hits a warm cache. Callers must not mutate the returned object
 * (gStars/sigmas are the shared module-level arrays).
 */
const MEMO_MAX = 200
const memo = new Map<string, BestResponse>()

export function bestResponse(levers: Levers): BestResponse {
  const key = leverKey(levers)
  const hit = memo.get(key)
  if (hit) {
    // Refresh recency: Map iterates in insertion order, oldest evicted first.
    memo.delete(key)
    memo.set(key, hit)
    return hit
  }
  const pRedWin: number[][] = []
  const { red, result } = searchArgmax(levers, pRedWin)
  const res: BestResponse = { red, result, grid: { gStars: GSTARS, sigmas: SIGMAS, pRedWin } }
  if (memo.size >= MEMO_MAX) memo.delete(memo.keys().next().value!)
  memo.set(key, res)
  return res
}

/**
 * Grid-free best response: same search, same argmax, no pRedWin grid built or
 * stored. This is the one to call from charts that sweep a lever (the
 * dashboard's frontier evaluates ~21 protocols per recompute) — it skips the
 * per-point array build, and its entries are scalar-sized, so the LRU can hold
 * an order of magnitude more of them for a fraction of the memory: measured
 * ~0.7KB per entry (~1.4MB at the 2000 cap) against ~96KB per grid entry
 * (~19MB at the grid memo's 200 cap). A frontier drag pushes ~21 keys per
 * slider step, which would otherwise thrash the 200-entry grid LRU.
 */
const VALUE_MEMO_MAX = 2000
const valueMemo = new Map<string, BestResponseValue>()

export function bestResponseValue(levers: Levers): BestResponseValue {
  const key = leverKey(levers)
  const hit = valueMemo.get(key)
  if (hit) {
    valueMemo.delete(key)
    valueMemo.set(key, hit)
    return hit
  }
  const res = searchArgmax(levers, null)
  if (valueMemo.size >= VALUE_MEMO_MAX) valueMemo.delete(valueMemo.keys().next().value!)
  valueMemo.set(key, res)
  return res
}

/** Safety of the current levers against the red team's best response. */
export function safetyVsBestResponse(levers: Levers): GameResult {
  return bestResponseValue(levers).result
}

const fineMemo = new Map<string, BestResponseValue>()

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
 * Continuous polish of the grid argmax. The search grid pins the right basin
 * (the surface can be multimodal across defer regimes); polishSeed then moves
 * the argmax quasi-continuously in the blue levers. Use this where the
 * STRATEGY itself is rendered (e.g. the defer demo's attack histogram, drawn
 * at the best response) so it doesn't visibly snap between grid cells as a
 * lever drags.
 */
export function bestResponseFine(levers: Levers): BestResponseValue {
  const key = leverKey(levers)
  const hit = fineMemo.get(key)
  if (hit) {
    fineMemo.delete(key)
    fineMemo.set(key, hit)
    return hit
  }
  // Only the seed is needed, never the grid.
  const coarse = bestResponseValue(levers)
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
 * lever). Every point runs the full grid search plus continuous polish
 * (bestResponseFine). This used to warm-start each point from the previous
 * argmax with a full re-anchor only every 8th point — insurance from when a
 * full grid cost ~15ms — but the local polish tracked stale basins between
 * re-anchors and drew visible kinks at the re-anchor indices wherever the true
 * best response hops basins (e.g. the defer sweep's jump toward maximal
 * subtlety). Post row-sweep a full grid is ~1.6ms, so the sweep is now exact
 * at every point; where the best response genuinely hops basins the curves
 * show one crisp step between adjacent samples instead of a drifting kink.
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
  for (const v of values) {
    const f = bestResponseFine(makeLevers(v))
    out.push({ v, red: f.red, result: f.result })
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
