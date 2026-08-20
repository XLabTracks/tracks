import { describe, expect, it } from "vitest";
import { HUMAN_POLICY_LABS } from "@/lib/verification/data/human-policy-labs";
import { checkHumanPolicyDecision } from "@/lib/verification/engines/human-policy-labs";

describe("human policy decision labs", () => {
  it("defines four outcome phases for each section", () => {
    for (const lab of HUMAN_POLICY_LABS) {
      expect(lab.phases).toHaveLength(4);
      expect(new Set(lab.phases.map((phase) => phase.id)).size).toBe(4);
    }
  });

  it("gives every decision four unique choices and one valid answer", () => {
    for (const lab of HUMAN_POLICY_LABS) {
      for (const step of lab.phases.flatMap((phase) => phase.steps)) {
        expect(step.choices).toHaveLength(4);
        expect(new Set(step.choices.map((choice) => choice.id)).size).toBe(4);
        expect(step.choices.some((choice) => choice.id === step.answerId)).toBe(
          true
        );
      }
    }
  });

  it("accepts the supported statement and rejects every alternative", () => {
    for (const lab of HUMAN_POLICY_LABS) {
      for (const step of lab.phases.flatMap((phase) => phase.steps)) {
        for (const choice of step.choices) {
          expect(checkHumanPolicyDecision(lab.id, step.id, choice.id)).toBe(
            choice.id === step.answerId
          );
        }
      }
    }
  });

  it("attributes every reveal to a public source", () => {
    for (const lab of HUMAN_POLICY_LABS) {
      for (const step of lab.phases.flatMap((phase) => phase.steps)) {
        expect(step.sourceLabel.length).toBeGreaterThan(0);
        expect(step.sourceHref).toMatch(/^https:\/\//);
      }
    }
  });
});
