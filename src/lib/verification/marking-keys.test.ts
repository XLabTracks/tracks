import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  BUILD_INSTITUTION_KEY,
  CONSTRUCT_CASE_KEY,
  POLICY_CRITIQUE_KEY,
  SAME_CLAIM_KEY,
  keyTotal,
  type MarkingKey,
} from "./data/marking-keys";

/**
 * The four keys are a promise about how the exercises are marked, so the
 * promise is pinned rather than described.
 *
 * The form they share: credit per element, every key states what earns
 * nothing, and every key carries at least one criterion that a correct label
 * alone cannot satisfy. A key that lost any of those would still render — it
 * would just quietly become a checklist of vocabulary, which is the thing all
 * four exercises exist to avoid.
 */

const KEYS: [string, MarkingKey][] = [
  ["construct-case", CONSTRUCT_CASE_KEY],
  ["policy-critique", POLICY_CRITIQUE_KEY],
  ["same-claim", SAME_CLAIM_KEY],
  ["build-institution", BUILD_INSTITUTION_KEY],
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
    // The score is the learner's. If this file ever grows a fetch or a server
    // action, the marking has stopped being self-marking and the exercises'
    // "nothing here is graded" has become false.
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
