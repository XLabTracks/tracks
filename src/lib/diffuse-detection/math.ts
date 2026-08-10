// Closed-form model of the detection race behind "Notes on handling
// non-concentrated failures" (c-lowstakes-l2): a scheming model needs C bad
// actions to reach catastrophe; the deployer asynchronously reviews actions
// and each bad action independently gets noticed with probability q (audit
// fraction × chance the review notices anything); a decisive response fires
// at the K-th noticed bad action (K encodes how legible each incident is —
// illegible evidence needs more incidents before a costly response is
// justifiable). Detection wins the race if the K-th notice lands among the
// first C−1 bad actions, i.e. before the C-th executes.
//
// Two structural facts the demo leans on, both provable from this model:
//  - The schemer's pace cancels. Acting more slowly delays detection and
//    catastrophe by the same factor, so the race outcome depends only on
//    (C, q, K) — this is why "how concentrated the failure is" and "how much
//    signal each incident gives" are the load-bearing quantities, not speed.
//  - Expected damage before detection is K/q, independent of C: auditing
//    strength and evidence legibility set the damage bill, not the threat.

export interface RaceParams {
  /** Bad actions needed for catastrophe (small = concentrated failure). */
  catastropheActions: number;
  /** P(a given bad action is reviewed AND the review notices it). */
  noticeChance: number;
  /** Noticed incidents needed before a decisive response fires. */
  evidenceThreshold: number;
}

/**
 * P(decisive response before catastrophe) = P(Binomial(C−1, q) ≥ K).
 * Summed as the K complementary lower-tail terms in log space — K is small
 * (evidence thresholds are tens at most) while C can be 10^5+.
 */
export function detectionWinProbability({
  catastropheActions,
  noticeChance,
  evidenceThreshold,
}: RaceParams): number {
  const n = Math.floor(catastropheActions) - 1;
  const q = noticeChance;
  const k = Math.floor(evidenceThreshold);
  if (k <= 0) return 1;
  if (n < k || q <= 0) return 0;
  if (q >= 1) return 1;

  // lower tail: P(X ≤ k−1) with X ~ Bin(n, q)
  let tail = 0;
  let lnChoose = 0; // ln C(n, 0)
  for (let i = 0; i < k; i++) {
    if (i > 0) lnChoose += Math.log(n - i + 1) - Math.log(i);
    tail += Math.exp(lnChoose + i * Math.log(q) + (n - i) * Math.log(1 - q));
  }
  return Math.min(1, Math.max(0, 1 - tail));
}

/**
 * Expected bad actions executed by the time the K-th is noticed (negative
 * binomial mean). Independent of C and of the schemer's pace.
 */
export function expectedDamageAtDetection(
  noticeChance: number,
  evidenceThreshold: number,
): number {
  if (noticeChance <= 0) return Infinity;
  return evidenceThreshold / noticeChance;
}

export type RaceRegime = "caught-in-time" | "detected-too-late" | "effectively-never";

/** pWin ≥ this counts as the countermeasures reliably winning the race. */
export const CAUGHT_IN_TIME_CUTOFF = 0.9;

/**
 * The post's three qualitative regimes. `badActionBudget` is how many bad
 * actions the schemer could plausibly take across the whole deployment: when
 * even that budget doesn't reach the expected detection point, the signal is
 * so weak that detection effectively never arrives (the post's clearly-low-
 * stakes failure); between the cutoffs, detection would come, but after
 * catastrophe (stakes as a quantitative matter of bits).
 */
export function classifyRegime(
  params: RaceParams,
  badActionBudget: number,
): RaceRegime {
  if (detectionWinProbability(params) >= CAUGHT_IN_TIME_CUTOFF) {
    return "caught-in-time";
  }
  const damage = expectedDamageAtDetection(
    params.noticeChance,
    params.evidenceThreshold,
  );
  return damage <= badActionBudget ? "detected-too-late" : "effectively-never";
}
