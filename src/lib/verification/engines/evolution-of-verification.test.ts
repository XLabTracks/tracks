import { describe, expect, it } from "vitest";
import { runTests } from "./evolution-of-verification";

describe("evolution-of-verification engine", () => {
  const results = runTests();

  it("emits every calibration/unit check", () => {
    expect(results.length).toBeGreaterThan(0);
  });

  for (const r of runTests()) {
    it(r.name, () => {
      expect(r.pass).toBe(true);
    });
  }
});
