/**
 * The detection game of RAND RR-A3686-1, as a pure function.
 *
 * The report's box (p. 4) defines it:
 *
 *   Players: a cloud service provider (CSP) and an evader.
 *   Rules:   the CSP chooses a set of metrics that must contain all mandatory
 *            metrics; the evader chooses a sequence of algorithms, at least one
 *            of them a training algorithm, to run on a set of accounts; after
 *            they execute, the CSP identifies the accounts that exceeded any
 *            threshold and decides which of them ran training.
 *   Outcome: the CSP wins if it finds at least one account that ran training
 *            among those that exceeded a threshold AND does not mistakenly pick
 *            an account that did not. Otherwise the evader wins.
 *
 * So the evader's whole problem is to leave no account above any threshold: if
 * nothing is reported, the CSP has nothing to pick from and loses. That is the
 * report's "sequential training" strategy, worked through for BLOOM on p. 6.
 *
 * Session size is an input, not something this module optimises, because it is
 * the trade the report names and leaves unquantified: raising the operations
 * per session "will decrease the number of accounts required for training at
 * the cost of extending the length of a session. The calculations to determine
 * this relationship are straightforward, and we omit them" (p. 6). The learner
 * moves that lever; we compute both sides of it and invent no figure the report
 * does not give.
 *
 * What this module does NOT model, because the report says it cannot be:
 * output-and-identity strategies (proof-of-learning, know-your-customer) are
 * not determined by thresholds, and the report states their winning conditions
 * "are not easily analyzed quantitatively" (p. 10). Those belong in prose.
 *
 * No React, no DOM. The widget renders what this returns.
 */

import { BLOOM, SECONDS_PER_DAY } from "./params";

/** The metrics the report lists a CSP as able to monitor (pp. 3-4, 9-10). */
export type MetricId =
  | "total-flops"
  | "cluster-size"
  | "power"
  | "data-transfer"
  | "instruction-pattern";

export interface Policy {
  /** Metrics the policy makes mandatory. */
  mandatory: MetricId[];
  /** Ceiling on an account's total floating-point operations. */
  totalFlops: number;
  /** Ceiling on the operations per second of one instance's GPU group. */
  clusterFlopsPerSecond: number;
  /** Ceiling on an account's average power draw, in kilowatts. */
  powerKilowatts: number;
}

export interface EvasionPlan {
  /** Separate training sessions the run is cut into. */
  sessions: number;
  /** Floating-point operations in one session. */
  flopsPerSession: number;
  /** Accounts needed so that no account's reported total breaks the ceiling. */
  accounts: number;
  /** Sessions one account can hold without its total breaking the ceiling. */
  sessionsPerAccount: number;
  /** GPUs in one instance. */
  gpusPerInstance: number;
  /** Operations per second one instance sustains. */
  flopsPerSecond: number;
  /** Wall-clock days for one session. */
  daysPerSession: number;
  /** Wall-clock days for the run, accounts running in parallel. */
  totalDays: number;
}

export type Outcome =
  | { evaderWins: true; plan: EvasionPlan }
  | { evaderWins: false; binding: MetricId };

/**
 * The metrics a split across accounts and sessions cannot defeat.
 *
 * Splitting divides a quantity; it does not change a ratio or make a dataset
 * smaller. The report's reasoning: with training data kept together during
 * training, "large and sudden data transfers into new accounts should capture
 * training activity" (p. 9), and the share of multiply-accumulate operations is
 * a property of the algorithm, which an evader can only dilute "at a cost to
 * training efficiency" (pp. 9-10).
 */
const UNSPLITTABLE: MetricId[] = ["data-transfer", "instruction-pattern"];

/**
 * How close to a ceiling an evader will sit. The report's threshold is broken
 * by using *more than* the figure, so sitting exactly on it is not yet a
 * breach — but an evader with no margin is one rounding away from reporting.
 */
const UNDER = 0.999;

const isOn = (policy: Policy, metric: MetricId) =>
  policy.mandatory.includes(metric);

/**
 * The evader's response to a policy at a chosen session size: the split that
 * leaves every account under every mandated threshold, or the metric that makes
 * splitting fail.
 */
export function evade(
  policy: Policy,
  flopsPerSession: number,
  totalFlops: number = BLOOM.totalFlops,
): Outcome {
  const unsplittable = UNSPLITTABLE.find((metric) => isOn(policy, metric));
  if (unsplittable) return { evaderWins: false, binding: unsplittable };

  // A GPU group's rate is capped either by the cluster-size metric or by the
  // hardware the run uses; with the metric off, the evader uses the real run's
  // group and the rate is BLOOM's.
  const fullRate = BLOOM.gpus * BLOOM.flopsPerSecondPerGpu;
  const rate = isOn(policy, "cluster-size")
    ? Math.min(fullRate, policy.clusterFlopsPerSecond * UNDER)
    : fullRate;
  const gpusPerInstance = Math.max(
    1,
    Math.floor(rate / BLOOM.flopsPerSecondPerGpu),
  );

  if (isOn(policy, "power")) {
    // Power scales with the hardware running. An account cannot train on less
    // than one instance, so one instance's draw is the floor.
    const runKilowatts = BLOOM.kilowattHours / (BLOOM.days * 24);
    const perInstanceKilowatts = runKilowatts * (gpusPerInstance / BLOOM.gpus);
    if (perInstanceKilowatts > policy.powerKilowatts) {
      return { evaderWins: false, binding: "power" };
    }
  }

  const ceiling = isOn(policy, "total-flops") ? policy.totalFlops : Infinity;
  // A session that breaks the ceiling on its own cannot be hidden by any
  // arrangement of accounts.
  if (flopsPerSession > ceiling) {
    return { evaderWins: false, binding: "total-flops" };
  }

  const sessions = Math.ceil(totalFlops / flopsPerSession);
  // An account's reading is its total, so what an account may hold is however
  // many whole sessions fit under the ceiling.
  const sessionsPerAccount =
    ceiling === Infinity
      ? sessions
      : Math.max(1, Math.floor((ceiling * UNDER) / flopsPerSession));
  const accounts = Math.ceil(sessions / sessionsPerAccount);
  const daysPerSession = flopsPerSession / rate / SECONDS_PER_DAY;

  return {
    evaderWins: true,
    plan: {
      sessions,
      flopsPerSession,
      accounts,
      sessionsPerAccount,
      gpusPerInstance,
      flopsPerSecond: rate,
      daysPerSession,
      // Accounts run in parallel; an account's sessions run one after another.
      totalDays: daysPerSession * sessionsPerAccount,
    },
  };
}
