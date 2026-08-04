// Calibration pins for the ported trusted-monitoring control model: the paper's
// headline protocol numbers must come out within a few points, and the model's
// qualitative properties (the ones the standalone lessons teach) must hold.
import { describe, it, expect } from "vitest";
import {
  PARAMS,
  DEFAULT_LEVERS,
  type Levers,
  Phi,
  PhiInv,
  safetyVsBestResponse,
  bestResponse,
  upfrontAuditing,
  evaluateGame,
  evaluateHomogeneous,
  usefulness,
  attackRate,
  muAttack,
  pSucc,
  scoreDensity,
  tprAtFpr,
  muBase,
  aurocUnequal,
  tprAtFprUnequal,
  attackRowSweep,
  evaluateGameOnRow,
  opportunityIndexAbove,
  bestResponseValue,
} from "@/lib/control-model";

const baseLevers = (over: Partial<Levers> = {}): Levers => ({
  ...DEFAULT_LEVERS,
  red: { mode: "best", gStar: 0, sigma: 0 },
  ...over,
});

const pp = (x: number) => 100 * x;

describe("control model — calibration pins (paper headline numbers, ±4pp)", () => {
  it("upfront auditing ≈ 15% safety", () => {
    expect(pp(upfrontAuditing(0.02).safety)).toBeGreaterThan(11);
    expect(pp(upfrontAuditing(0.02).safety)).toBeLessThan(19);
  });
  it("trusted monitoring (b=2%, no defer) ≈ 62% safety", () => {
    const s = pp(safetyVsBestResponse(baseLevers({ b: 0.02, d: 0.02 })).safety);
    expect(s).toBeGreaterThan(58);
    expect(s).toBeLessThan(66);
  });
  it("defer to trusted 10% ≈ 83% safety, ≈ 92% usefulness", () => {
    const lev = baseLevers({ b: 0.02, d: 0.1 });
    const s = pp(safetyVsBestResponse(lev).safety);
    expect(s).toBeGreaterThan(79);
    expect(s).toBeLessThan(87);
    expect(pp(usefulness(lev))).toBeCloseTo(92, 5);
  });
  it("defer to trusted 20% ≈ 92% safety, ≈ 82% usefulness", () => {
    const lev = baseLevers({ b: 0.02, d: 0.2 });
    const s = pp(safetyVsBestResponse(lev).safety);
    expect(s).toBeGreaterThan(88);
    expect(s).toBeLessThan(96);
    expect(pp(usefulness(lev))).toBeCloseTo(82, 5);
  });
});

describe("control model — row-sweep search path", () => {
  // The best-response grid reads its cells off one suffix-sum pass per sigma
  // instead of re-walking the opportunity grid per cell. The two paths differ
  // only in summation order, so every cell must agree to ~machine precision.
  const G_GRID_POINT = 127.5 / PARAMS.G_BINS; // exactly a grid node: g[127]
  const gStars = [
    0, 1e-12, 0.001, 0.05, 0.2, 0.4,
    G_GRID_POINT, // the `g[i] <= gStar` boundary itself
    G_GRID_POINT - 1e-15,
    G_GRID_POINT + 1e-15,
    0.62, 0.8, 0.9, 0.98, 0.994, 0.995,
  ];
  const sigmas = [0, 0.013, 0.25, 0.5, 0.75, 0.987, 1];

  it("sweep pRedWin equals evaluateGame pRedWin within 1e-12", () => {
    let worst = 0;
    for (const b of [0.005, 0.02, 0.08]) {
      for (const bandWidth of [0, 0.08, 0.3]) {
        const lev = baseLevers({ b, d: b + bandWidth });
        for (const sigma of sigmas) {
          const sweep = attackRowSweep(lev, sigma);
          for (const gStar of gStars) {
            const direct = evaluateGame(lev, { mode: "fixed", gStar, sigma });
            const swept = evaluateGameOnRow(sweep, gStar);
            const diff = Math.abs(swept.pRedWin - direct.pRedWin);
            worst = Math.max(worst, diff);
            expect(diff).toBeLessThan(1e-12);
            // The aggregates the demos read off the result must match too.
            expect(Math.abs(swept.agg.r - direct.agg.r)).toBeLessThan(1e-12);
            expect(Math.abs(swept.agg.cBar - direct.agg.cBar)).toBeLessThan(1e-12);
            expect(Math.abs(swept.agg.wBar - direct.agg.wBar)).toBeLessThan(1e-12);
          }
        }
      }
    }
    expect(worst).toBeLessThan(1e-12);
  });

  it("gStar → suffix index reproduces the `g[i] > gStar` predicate exactly", () => {
    const n = PARAMS.G_BINS;
    for (const gStar of [...gStars, 0.5, 0.999, 1]) {
      const i0 = opportunityIndexAbove(gStar);
      let expected: number = n;
      for (let i = 0; i < n; i++) {
        if ((i + 0.5) / n > gStar) {
          expected = i;
          break;
        }
      }
      expect(i0).toBe(expected);
    }
  });

  it("bestResponseValue (grid-free) matches bestResponse's argmax exactly", () => {
    for (const b of [0.005, 0.02, 0.05, 0.08]) {
      for (const bandWidth of [0, 0.05, 0.18, 0.4]) {
        for (const q of [0.85, 0.97]) {
          const lev = baseLevers({ b, d: b + bandWidth, q });
          const full = bestResponse(lev);
          const value = bestResponseValue(lev);
          expect(value.red).toEqual(full.red);
          expect(value.result.pRedWin).toBe(full.result.pRedWin);
          expect(value.result.agg).toEqual(full.result.agg);
          // …and it really is the max of the grid the heatmap draws.
          let gridMax = 0;
          for (const row of full.grid.pRedWin) for (const p of row) gridMax = Math.max(gridMax, p);
          expect(value.result.pRedWin).toBe(gridMax);
        }
      }
    }
  });

  it("the best-response grid agrees with direct evaluateGame at its cells", () => {
    const lev = baseLevers({ b: 0.02, d: 0.02 });
    const { gStars: gs, sigmas: ss, pRedWin } = bestResponse(lev).grid;
    for (let j = 0; j < ss.length; j += 13) {
      for (let i = 0; i < gs.length; i += 17) {
        const direct = evaluateGame(lev, { mode: "fixed", gStar: gs[i], sigma: ss[j] }).pRedWin;
        expect(Math.abs(pRedWin[j][i] - direct)).toBeLessThan(1e-12);
      }
    }
  });
});

describe("control model — properties the lessons rely on", () => {
  it("normal CDF and inverse are consistent", () => {
    for (const p of [0.01, 0.02, 0.1, 0.5, 0.9, 0.98, 0.999]) {
      expect(Phi(PhiInv(p))).toBeCloseTo(p, 5);
    }
  });
  it("score densities integrate to ~1", () => {
    for (const mu of [0, 1, 2.5]) {
      const { f } = scoreDensity(mu);
      const ds = 10 / f.length;
      let sum = 0;
      for (const fi of f) sum += fi * ds;
      expect(sum).toBeGreaterThan(0.99);
      expect(sum).toBeLessThan(1.01);
    }
  });
  it("safety increases with defer threshold", () => {
    const s0 = safetyVsBestResponse(baseLevers({ b: 0.02, d: 0.02 })).safety;
    const s10 = safetyVsBestResponse(baseLevers({ b: 0.02, d: 0.1 })).safety;
    const s30 = safetyVsBestResponse(baseLevers({ b: 0.02, d: 0.3 })).safety;
    expect(s10).toBeGreaterThan(s0);
    expect(s30).toBeGreaterThan(s10);
  });
  it("homogeneous game: P(red win) is monotone increasing in k (the race lesson)", () => {
    const lev = baseLevers({ b: 0.02, d: 0.02 });
    let prev = 0;
    for (const k of [1, 5, 20, 100, 500]) {
      const res = evaluateHomogeneous(lev, 0.4, k);
      expect(res.pRedWin).toBeGreaterThanOrEqual(prev);
      prev = res.pRedWin;
    }
  });
  it("homogeneous game: at k=1, P(red win) equals wBar exactly (the exact-form sanity check)", () => {
    // With the exact form 1 - (1 - decisive)^k, k=1 makes eventFactor = decisive,
    // so pRedWin = raceFactor * decisive = wBar. This identity is the check the
    // lesson invites; the old Poisson approximation broke it (gave ~1 - e^{-wBar-cBar}).
    for (const sigma of [0.2, 0.4, 0.6]) {
      const res = evaluateHomogeneous(baseLevers({ b: 0.02, d: 0.02 }), sigma, 1);
      expect(res.pRedWin).toBeCloseTo(res.agg.wBar, 12);
    }
  });
  it("heterogeneous game: P(red win) is hump-shaped in attack rate (the rate lesson)", () => {
    const lev = baseLevers({ b: 0.02, d: 0.02 });
    const br = bestResponse(lev);
    const sigma = br.red.sigma;
    const wins: number[] = [];
    for (const gStar of [0.98, 0.9, 0.8, 0.7, 0.6, 0.4, 0.2, 0.0]) {
      wins.push(evaluateGame(lev, { mode: "fixed", gStar, sigma }).pRedWin);
    }
    const peak = Math.max(...wins);
    const peakIdx = wins.indexOf(peak);
    expect(peakIdx).toBeGreaterThan(0);
    expect(peakIdx).toBeLessThan(wins.length - 1);
    expect(peak).toBeGreaterThan(wins[0] + 0.02);
    expect(peak).toBeGreaterThan(wins[wins.length - 1] + 0.02);
  });
  it("subtlety has an interior optimum for red (the subtlety lesson)", () => {
    const lev = baseLevers({ b: 0.02, d: 0.02 });
    const br = bestResponse(lev);
    expect(br.red.sigma).toBeGreaterThan(0.02);
    expect(br.red.sigma).toBeLessThan(0.98);
  });
  it("subtler attacks are less visible and less reliable", () => {
    expect(muAttack(PARAMS.q, 0.8, 0.5)).toBeLessThan(muAttack(PARAMS.q, 0.2, 0.5));
    expect(pSucc(0.8)).toBeLessThan(pSucc(0.2));
  });
  it("same AUROC, weaker tail: an unequal-variance monitor catches < half as many at FPR=2%", () => {
    const qTarget = 0.92;
    const muA = Math.sqrt(1 + 1) * PhiInv(qTarget);
    const sdB = 0.4;
    const muB = Math.sqrt(1 + sdB * sdB) * PhiInv(qTarget);
    expect(aurocUnequal(muA, 1)).toBeCloseTo(qTarget, 3);
    expect(aurocUnequal(muB, sdB)).toBeCloseTo(qTarget, 3);
    const tprA = tprAtFprUnequal(muA, 1, 0.02);
    const tprB = tprAtFprUnequal(muB, sdB, 0.02);
    expect(tprB).toBeLessThan(tprA * 0.5);
  });
  it("attack rate is monotone decreasing in gStar", () => {
    expect(attackRate(0.1)).toBeGreaterThan(attackRate(0.5));
    expect(attackRate(0.5)).toBeGreaterThan(attackRate(0.9));
  });
  it("baseline TPR at 2% FPR is in a teachable range", () => {
    const tpr = tprAtFpr(muBase(PARAMS.q), 0.02);
    expect(tpr).toBeGreaterThan(0.3);
    expect(tpr).toBeLessThan(0.95);
  });
});
