
import { MATRIX, DIRECT_WEIGHT, WHISTLE_FLAT, FP_PER_NOISY } from "../data/tamper-trace";
import type { RedTechId, BlueLayerId } from "../data/tamper-trace";

export interface Scenario {
  state: boolean;
  amd: boolean;
  legacy: boolean;
}

export const RED_BASE_BUDGET = 8;
export const RED_STATE_BONUS = 3;
export const BLUE_BUDGET = 9;

export const THRESH = 0.55;

export function budgets(scenario: Scenario): { rmax: number; bmax: number } {
  let rmax = RED_BASE_BUDGET;
  if (scenario.state) rmax += RED_STATE_BONUS;
  return { rmax, bmax: BLUE_BUDGET };
}

export function techChance(
  id: RedTechId,
  redSet: ReadonlySet<RedTechId>,
  blueSet: ReadonlySet<BlueLayerId>,
  scenario: Scenario,
): number {
  const m = MATRIX[id];
  if (!m) return 0;
  const amd = scenario.amd;
  const legacy = scenario.legacy;
  const maskOn = redSet.has("mask");
  let p = 0;

  if (blueSet.has(m.direct)) {
    let w = DIRECT_WEIGHT;
    if (legacy && (m.direct === "puf" || m.direct === "boot")) w *= 0.4;
    if (id === "meter" && maskOn && !blueSet.has("osint")) w *= 0.5;
    p += w;
  }

  for (const [layer, w] of Object.entries(m.tells) as [BlueLayerId, number][]) {
    if (blueSet.has(layer)) {
      let ww = w;
      if (id === "interposer" && amd && layer !== "enc") ww *= 0.4;
      p += ww;
    }
  }

  if (blueSet.has("whistle")) p += WHISTLE_FLAT;
  return Math.min(p, 0.95);
}

export function falsePositiveChance(blueSet: ReadonlySet<BlueLayerId>): number {
  let noisy = 0;
  (["pow", "recon", "whistle", "osint"] as const).forEach((l) => {
    if (blueSet.has(l)) noisy++;
  });
  return Math.min(noisy * FP_PER_NOISY, 0.4);
}

export function bandFor(p: number): [string, string] {
  if (p < 0.15) return ["Compliant", "var(--good)"];
  if (p < 0.35) return ["Likely compliant", "var(--good)"];
  if (p < 0.55) return ["Ambiguous — needs clarification", "var(--warn)"];
  if (p < 0.75) return ["Suspicious anomaly", "var(--warn)"];
  if (p < 0.9) return ["Probable non-compliance", "var(--bad)"];
  return ["Material breach", "var(--bad)"];
}
