import { describe, expect, it } from "vitest";
import { stackCommentTops } from "./comment-layout";

describe("stackCommentTops", () => {
  it("keeps non-overlapping boxes at their desired tops", () => {
    expect(
      stackCommentTops(
        [
          { top: 100, height: 40 },
          { top: 200, height: 40 },
        ],
        12,
      ),
    ).toEqual([100, 200]);
  });

  it("pushes an overlapping box below the previous one plus the gap", () => {
    expect(
      stackCommentTops(
        [
          { top: 100, height: 60 },
          { top: 120, height: 40 },
        ],
        12,
      ),
    ).toEqual([100, 172]);
  });

  it("cascades pushes through a run of crowded boxes", () => {
    expect(
      stackCommentTops(
        [
          { top: 100, height: 50 },
          { top: 100, height: 50 },
          { top: 110, height: 50 },
        ],
        10,
      ),
    ).toEqual([100, 160, 220]);
  });

  it("clamps boxes to minTop", () => {
    expect(stackCommentTops([{ top: -20, height: 30 }], 12)).toEqual([8]);
    expect(stackCommentTops([{ top: -20, height: 30 }], 12, 0)).toEqual([0]);
  });

  it("handles the empty list", () => {
    expect(stackCommentTops([], 12)).toEqual([]);
  });
});
