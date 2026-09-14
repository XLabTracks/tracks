import { describe, expect, it } from "vitest";
import { planParts, progressText, type PartSource } from "./lesson-parts";

const block = (tag: string, text: string): PartSource => ({ tag, text });
const br = (label: string): PartSource => ({
  tag: "SPAN",
  text: "",
  breakLabel: label,
});

describe("planParts", () => {
  it("keeps every heading on one page when the author placed no break", () => {
    const parts = planParts([
      block("H2", "One"),
      block("P", "Body"),
      block("H2", "Two"),
      block("P", "More body"),
      block("H3", "Three"),
      block("P", "Last body"),
    ]);

    expect(parts).toEqual([
      {
        label: "One",
        headingIndex: 0,
        indices: [0, 1, 2, 3, 4, 5],
      },
    ]);
  });

  it("starts a new page only at an authored marker", () => {
    const parts = planParts([
      block("H2", "One"),
      block("P", "Body"),
      br("Apply the rule"),
      block("H3", "Exercise"),
      block("P", "Prompt"),
    ]);

    expect(parts).toEqual([
      { label: "One", headingIndex: 0, indices: [0, 1] },
      { label: "Apply the rule", headingIndex: 3, indices: [3, 4] },
    ]);
  });

  it("uses the supplied lesson title when the opening page has no heading", () => {
    expect(
      planParts(
        [
          block("DIV", "Opening video"),
          block("P", "Introduction"),
          br("The evidence"),
          block("H2", "Evidence"),
        ],
        "The lesson"
      )[0].label
    ).toBe("The lesson");
  });

  it("does not expose break markers as page content", () => {
    const items = [
      block("P", "A"),
      br("Second"),
      block("P", "B"),
      br("Third"),
      block("P", "C"),
    ];
    expect(planParts(items).flatMap((part) => part.indices)).toEqual([0, 2, 4]);
  });

  it("ignores empty adjacent markers instead of creating blank pages", () => {
    expect(
      planParts([
        block("P", "A"),
        br("Unused"),
        br("Actual label"),
        block("P", "B"),
      ]).map((part) => part.label)
    ).toEqual(["Start", "Actual label"]);
  });
});

describe("progressText", () => {
  it("counts from one and says how many pages remain", () => {
    expect(progressText(0, 5)).toEqual({
      position: "Part 1 of 5",
      remaining: "4 parts left",
    });
    expect(progressText(3, 5)).toEqual({
      position: "Part 4 of 5",
      remaining: "1 part left",
    });
  });

  it("names the last page instead of counting zero", () => {
    expect(progressText(4, 5).remaining).toBe("Last part");
  });

  it("takes the paper reader's unit", () => {
    expect(progressText(1, 3, "Section")).toEqual({
      position: "Section 2 of 3",
      remaining: "1 section left",
    });
  });
});
