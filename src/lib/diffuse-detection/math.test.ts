import { describe, expect, it } from "vitest";
import {
  classifyRegime,
  detectionWinProbability,
  expectedDamageAtDetection,
} from "./math";

describe("detectionWinProbability", () => {
  it("matches hand-computed values", () => {
    // K=1: P = 1 − (1−q)^(C−1)
    expect(
      detectionWinProbability({
        catastropheActions: 100,
        noticeChance: 0.1,
        evidenceThreshold: 1,
      }),
    ).toBeCloseTo(1 - Math.pow(0.9, 99), 10);
    // C=2, K=1: exactly q
    expect(
      detectionWinProbability({
        catastropheActions: 2,
        noticeChance: 0.3,
        evidenceThreshold: 1,
      }),
    ).toBeCloseTo(0.3, 12);
    // C=3, K=2: q² (both of the first two must be noticed)
    expect(
      detectionWinProbability({
        catastropheActions: 3,
        noticeChance: 0.25,
        evidenceThreshold: 2,
      }),
    ).toBeCloseTo(0.0625, 12);
  });

  it("handles boundaries: immediate catastrophe, certain and zero notice", () => {
    // C=1: catastrophe is the first bad action — nothing can be noticed first.
    expect(
      detectionWinProbability({
        catastropheActions: 1,
        noticeChance: 0.9,
        evidenceThreshold: 1,
      }),
    ).toBe(0);
    expect(
      detectionWinProbability({
        catastropheActions: 50,
        noticeChance: 0,
        evidenceThreshold: 1,
      }),
    ).toBe(0);
    expect(
      detectionWinProbability({
        catastropheActions: 50,
        noticeChance: 1,
        evidenceThreshold: 1,
      }),
    ).toBe(1);
  });

  it("agrees with Monte Carlo on an interior case", () => {
    const params = {
      catastropheActions: 40,
      noticeChance: 0.12,
      evidenceThreshold: 3,
    };
    let wins = 0;
    const trials = 200_000;
    for (let t = 0; t < trials; t++) {
      let noticed = 0;
      for (let action = 1; action < params.catastropheActions; action++) {
        if (Math.random() < params.noticeChance) noticed++;
        if (noticed >= params.evidenceThreshold) {
          wins++;
          break;
        }
      }
    }
    const mc = wins / trials;
    expect(detectionWinProbability(params)).toBeCloseTo(mc, 2);
  });

  it("is monotone: up in C and q, down in K", () => {
    const base = {
      catastropheActions: 500,
      noticeChance: 0.02,
      evidenceThreshold: 5,
    };
    const p = detectionWinProbability(base);
    expect(
      detectionWinProbability({ ...base, catastropheActions: 2000 }),
    ).toBeGreaterThan(p);
    expect(
      detectionWinProbability({ ...base, noticeChance: 0.05 }),
    ).toBeGreaterThan(p);
    expect(
      detectionWinProbability({ ...base, evidenceThreshold: 10 }),
    ).toBeLessThan(p);
  });

  it("stays stable at large C with small K", () => {
    const p = detectionWinProbability({
      catastropheActions: 100_000,
      noticeChance: 0.0001,
      evidenceThreshold: 5,
    });
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
    expect(Number.isFinite(p)).toBe(true);
  });
});

describe("expectedDamageAtDetection", () => {
  it("is K/q, and infinite with no signal", () => {
    expect(expectedDamageAtDetection(0.02, 4)).toBeCloseTo(200, 10);
    expect(expectedDamageAtDetection(0, 1)).toBe(Infinity);
  });
});

describe("classifyRegime", () => {
  it("labels the post's three regimes", () => {
    // Strong signal, very diffuse threat: caught in time.
    expect(
      classifyRegime(
        { catastropheActions: 10_000, noticeChance: 0.05, evidenceThreshold: 3 },
        1_000_000,
      ),
    ).toBe("caught-in-time");
    // Concentrated threat, decent signal: detection would come, but after
    // catastrophe.
    expect(
      classifyRegime(
        { catastropheActions: 5, noticeChance: 0.05, evidenceThreshold: 3 },
        1_000_000,
      ),
    ).toBe("detected-too-late");
    // Signal so weak the deployment ends first.
    expect(
      classifyRegime(
        { catastropheActions: 5, noticeChance: 0.000001, evidenceThreshold: 5 },
        100_000,
      ),
    ).toBe("effectively-never");
  });
});
