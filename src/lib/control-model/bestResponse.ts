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
