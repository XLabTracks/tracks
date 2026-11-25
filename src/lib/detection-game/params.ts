/**
 * Constants for the detection game, all taken from RAND RR-A3686-1,
 * "Strategies and Detection Gaps in a Game-Theoretic Model of Compute
 * Governance" (Moon, Vedula, Geneson, Bar-on, 2025).
 *
 * Every number here is the report's, not ours. The model computes what the
 * report computes; it does not extend it. `detection-game.test.ts` pins the
 * report's own worked example so a change that drifts from the paper fails.
 *
 * Do not turn any threshold here into a recommendation. The report is explicit
 * that its BLOOM calculation shows how an evader exploits the unit a rule
 * aggregates over — it is not a proposed limit, and the thresholds are inputs
 * the learner moves.
 */

/** BLOOM training statistics, report p. 6. */
export const BLOOM = {
  /** Number of GPUs (report table). */
  gpus: 384,
  /** Days the real run took (report table, "~118"). */
  days: 118,
  /** Training dataset size in terabytes (report table). */
  datasetTb: 1.6,
  /**
   * Per-GPU compute capacity. The table gives ~150 TFLOP/s per GPU; the
   * report's own arithmetic on p. 6 uses 1.5e14 FLOP/s, which is that figure.
   */
  flopsPerSecondPerGpu: 1.5e14,
  /**
   * Total training cost the report derives from the table: 5.8e23 FLOPs.
   * (A footnote notes Sevilla et al. report a more conservative 1.8e23; the
   * report keeps 5.8e23 and observes the order of magnitude is the same.)
   */
  totalFlops: 5.8e23,
  /** Energy over the run, report p. 10 (Luccioni, Viguier, and Ligozat). */
  kilowattHours: 433_196,
} as const;

/**
 * Thresholds from the 2023 executive order as the report applies them (p. 5),
 * for models trained primarily on biological sequence data. A threshold is
 * broken when training uses more than either of these.
 */
export const EO_2023 = {
  /** Total floating-point or integer operations. */
  totalFlops: 1e23,
  /** A group of GPUs capable of more than this many operations per second. */
  clusterFlopsPerSecond: 1e20,
} as const;

/**
 * The detection gap the report identifies (p. 5): models trained within this
 * floating-point compute range, per the historical thresholds above.
 */
export const DETECTION_GAP = { low: 1e23, high: 1e26 } as const;

/** Seconds in a day, for turning a FLOP budget into wall-clock time. */
export const SECONDS_PER_DAY = 86_400;
