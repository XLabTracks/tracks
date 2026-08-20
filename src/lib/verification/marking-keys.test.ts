import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  COMPANIES_AB_KEY,
  CONSTRUCT_CASE_KEY,
  SAME_CLAIM_KEY,
  keyTotal,
  type MarkingKey,
} from "./data/marking-keys";

const KEYS: [string, MarkingKey][] = [
  ["construct-case", CONSTRUCT_CASE_KEY],
  ["same-claim", SAME_CLAIM_KEY],
  ["companies-ab", COMPANIES_AB_KEY],
];

describe("2.4 marking keys", () => {
  it.each(KEYS)("%s: credit is per element and adds up", (_name, key) => {
    expect(key.criteria.length).toBeGreaterThan(2);
    for (const criterion of key.criteria) {
      expect(criterion.points).toBeGreaterThan(0);
      expect(criterion.points).toBeLessThanOrEqual(2);
      expect(criterion.text.trim().length).toBeGreaterThan(0);
    }
    expect(keyTotal(key)).toBe(
      key.criteria.reduce((sum, c) => sum + c.points, 0)
    );
  });

  it.each(KEYS)("%s: says out loud what earns nothing", (_name, key) => {
    expect(key.noCredit.length).toBeGreaterThan(1);
  });

  it.each(KEYS)(
    "%s: at least one criterion a bare label cannot satisfy",
    (_name, key) => {
      expect(key.criteria.some((c) => c.needsReasoning)).toBe(true);
    }
  );

  it("the panel never sends a score anywhere", () => {
    const src = readFileSync(
      path.join(
        process.cwd(),
        "src/components/verification/kit/marking-key.tsx"
      ),
      "utf8"
    );
    expect(src).not.toMatch(/\bfetch\(|use server|navigator\.sendBeacon/);
  });
});
