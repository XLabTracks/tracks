import { describe, expect, it } from "vitest";
import { REPORTING_CASES } from "@/lib/verification/data/human-reporting-protection";
import { checkReportingAnswer } from "@/lib/verification/engines/human-reporting-protection";

describe("human reporting protection exercise", () => {
  it("offers one correct and four distinct distractors for every link", () => {
    for (const caseFile of REPORTING_CASES) {
      for (const step of caseFile.steps) {
        expect(step.choices).toHaveLength(5);
        expect(new Set(step.choices.map((choice) => choice.id)).size).toBe(5);
        expect(
          step.choices.filter((choice) => choice.id === step.answerId),
        ).toHaveLength(1);
      }
    }
  });

  it("accepts only the sourced statement for each link", () => {
    for (const caseFile of REPORTING_CASES) {
      for (const step of caseFile.steps) {
        expect(
          checkReportingAnswer(caseFile.id, step.id, step.answerId),
        ).toBe(true);
        for (const choice of step.choices) {
          if (choice.id === step.answerId) continue;
          expect(
            checkReportingAnswer(caseFile.id, step.id, choice.id),
          ).toBe(false);
        }
      }
    }
  });

  it("keeps every explanation attached to a public source", () => {
    for (const caseFile of REPORTING_CASES) {
      for (const step of caseFile.steps) {
        expect(step.sourceLabel.length).toBeGreaterThan(0);
        expect(step.sourceHref).toMatch(/^https:\/\//);
      }
    }
  });
});
