import { describe, expect, it } from "vitest";
import { formatDuration } from "@/lib/content/duration";

describe("formatDuration", () => {
  it("keeps anything under an hour in minutes", () => {
    expect(formatDuration(5)).toBe("~5 min");
    expect(formatDuration(45)).toBe("~45 min");
    expect(formatDuration(59)).toBe("~59 min");
  });

  it("turns an hour and over into hours", () => {
    expect(formatDuration(60)).toBe("~1 h");
    expect(formatDuration(120)).toBe("~2 h");
    // 3.0's assignment: read the working paper, then four referenced answers.
    expect(formatDuration(180)).toBe("~3 h");
  });

  it("rounds to the nearest quarter hour", () => {
    expect(formatDuration(75)).toBe("~1¼ h");
    expect(formatDuration(90)).toBe("~1½ h");
    expect(formatDuration(105)).toBe("~1¾ h");
    expect(formatDuration(200)).toBe("~3¼ h");
  });
});
