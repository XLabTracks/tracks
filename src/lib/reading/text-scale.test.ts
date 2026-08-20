import { describe, expect, it } from "vitest";
import {
  isLargeTextScale,
  parseTextScale,
  TEXT_SCALE_OPTIONS,
} from "./text-scale";

describe("text scale preference", () => {
  it("accepts only the sizes exposed by the Aa control", () => {
    for (const scale of TEXT_SCALE_OPTIONS) {
      expect(parseTextScale(String(scale))).toBe(scale);
    }
    expect(parseTextScale("137")).toBeNull();
    expect(parseTextScale("large")).toBeNull();
    expect(parseTextScale(null)).toBeNull();
  });

  it("marks the sizes that need the low-density reflow", () => {
    expect(isLargeTextScale(125)).toBe(false);
    expect(isLargeTextScale(150)).toBe(true);
    expect(isLargeTextScale(200)).toBe(true);
  });
});
