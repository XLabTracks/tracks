// Calibration pins for the detection game ported from RAND RR-A3686-1. The
// report's own worked example must come out of this model; a change that
// drifts from the paper fails here rather than reaching a learner.

import { describe, expect, it } from "vitest";

import { BLOOM, DETECTION_GAP, EO_2023 } from "./params";
import { evade, type Policy } from "./model";

/** The report's own scenario: the 2023 executive order's thresholds. */
const EO_POLICY: Policy = {
  mandatory: ["total-flops"],
  totalFlops: EO_2023.totalFlops,
  clusterFlopsPerSecond: EO_2023.clusterFlopsPerSecond,
  powerKilowatts: Infinity,
};

describe("detection game — calibration pins (RAND RR-A3686-1)", () => {
  it("reproduces the aggregate rate on p. 6", () => {
    // "384 GPUs x (1.5 x 10^14 FLOP/s per GPU) = 5.76 x 10^16 FLOP/s"
    const outcome = evade(EO_POLICY, 1e22);
    expect(outcome.evaderWins).toBe(true);
    if (!outcome.evaderWins) return;
    expect(outcome.plan.flopsPerSecond).toBeCloseTo(5.76e16, -14);
  });

  it("reproduces the 58 sessions of 1e22 FLOPs on p. 6", () => {
    // "the entire training run for BLOOM could be accomplished through 58
    // distinct instances of 10^22 FLOPs"
    const outcome = evade(EO_POLICY, 1e22);
    expect(outcome.evaderWins).toBe(true);
    if (!outcome.evaderWins) return;
    expect(outcome.plan.sessions).toBe(58);
  });

  it("reproduces 'roughly two days' per session on p. 6", () => {
    const outcome = evade(EO_POLICY, 1e22);
    expect(outcome.evaderWins).toBe(true);
    if (!outcome.evaderWins) return;
    expect(outcome.plan.daysPerSession).toBeGreaterThan(1.9);
    expect(outcome.plan.daysPerSession).toBeLessThan(2.1);
  });

  it("stays under the executive order's cluster-rate threshold, as p. 6 argues", () => {
    // "its instances will remain under 10^20 FLOP/s, and the only relevant
    // threshold is for total floating-point or integer operations"
    const outcome = evade(EO_POLICY, 1e22);
    expect(outcome.evaderWins).toBe(true);
    if (!outcome.evaderWins) return;
    expect(outcome.plan.flopsPerSecond).toBeLessThan(
      EO_2023.clusterFlopsPerSecond,
    );
  });

  it("puts BLOOM inside the detection gap the report identifies on p. 5", () => {
    expect(BLOOM.totalFlops).toBeGreaterThan(DETECTION_GAP.low);
    expect(BLOOM.totalFlops).toBeLessThan(DETECTION_GAP.high);
  });

  it("marginally exceeds the total-operations threshold, as p. 5 says", () => {
    // "BLOOM's training compute requirements marginally exceed the first
    // threshold" — so an unsplit run reports, and splitting is the whole point.
    expect(BLOOM.totalFlops).toBeGreaterThan(EO_2023.totalFlops);
    const unsplit = evade(EO_POLICY, BLOOM.totalFlops);
    expect(unsplit.evaderWins).toBe(false);
  });
});

describe("detection game — the trade the report names but omits (p. 6)", () => {
  // "Increasing the number of FLOPs per session from 10^22 to just under 10^23
  // will decrease the number of accounts required for training at the cost of
  // extending the length of a session."
  it("fewer accounts as the session grows", () => {
    const small = evade(EO_POLICY, 1e22);
    const large = evade(EO_POLICY, 9.9e22);
    expect(small.evaderWins && large.evaderWins).toBe(true);
    if (!small.evaderWins || !large.evaderWins) return;
    expect(large.plan.accounts).toBeLessThan(small.plan.accounts);
  });

  it("longer sessions as the session grows", () => {
    const small = evade(EO_POLICY, 1e22);
    const large = evade(EO_POLICY, 9.9e22);
    if (!small.evaderWins || !large.evaderWins) return;
    expect(large.plan.daysPerSession).toBeGreaterThan(small.plan.daysPerSession);
  });
});

describe("detection game — closing the gap (report pp. 9-10)", () => {
  it("a metric a split cannot divide ends it, whatever the session size", () => {
    for (const binding of ["data-transfer", "instruction-pattern"] as const) {
      for (const size of [1e20, 1e22, 9.9e22]) {
        const outcome = evade(
          { ...EO_POLICY, mandatory: ["total-flops", binding] },
          size,
        );
        expect(outcome.evaderWins, `${binding} at ${size}`).toBe(false);
        if (outcome.evaderWins) return;
        expect(outcome.binding).toBe(binding);
      }
    }
  });

  it("a power ceiling under one instance's draw ends it", () => {
    // BLOOM drew 433,196 kWh over ~118 days: about 153 kW average.
    const outcome = evade(
      { ...EO_POLICY, mandatory: ["total-flops", "power"], powerKilowatts: 100 },
      1e22,
    );
    expect(outcome.evaderWins).toBe(false);
    if (outcome.evaderWins) return;
    expect(outcome.binding).toBe("power");
  });

  it("a power ceiling above one instance's draw does not", () => {
    const outcome = evade(
      { ...EO_POLICY, mandatory: ["total-flops", "power"], powerKilowatts: 500 },
      1e22,
    );
    expect(outcome.evaderWins).toBe(true);
  });

  it("a cluster-rate ceiling slows the run without stopping it", () => {
    const loose = evade(EO_POLICY, 1e22);
    const tight = evade(
      {
        ...EO_POLICY,
        mandatory: ["total-flops", "cluster-size"],
        clusterFlopsPerSecond: 5.76e15,
      },
      1e22,
    );
    expect(loose.evaderWins && tight.evaderWins).toBe(true);
    if (!loose.evaderWins || !tight.evaderWins) return;
    expect(tight.plan.daysPerSession).toBeGreaterThan(loose.plan.daysPerSession);
    expect(tight.plan.gpusPerInstance).toBeLessThan(loose.plan.gpusPerInstance);
  });

  it("no mandatory metric at all means one account and no split", () => {
    const outcome = evade({ ...EO_POLICY, mandatory: [] }, BLOOM.totalFlops);
    expect(outcome.evaderWins).toBe(true);
    if (!outcome.evaderWins) return;
    expect(outcome.plan.accounts).toBe(1);
    expect(outcome.plan.sessions).toBe(1);
  });
});
