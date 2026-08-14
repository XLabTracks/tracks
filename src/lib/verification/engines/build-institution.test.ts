import { describe, expect, it } from "vitest";

import {
  PICK_EXACTLY,
  PROVISIONS,
  SAMPLE_DESIGNS,
} from "@/lib/verification/data/build-institution";
import { evaluateInstitution } from "./build-institution";

/**
 * The exercise's whole claim is that several designs are defensible and no
 * hidden five is the answer. That is a property of the evaluator, so it is
 * tested rather than asserted in a comment.
 *
 * The four failing cases are the course owner's own list of invalid
 * constructions, one test each.
 */
describe("build-institution", () => {
  it("passes both sample designs", () => {
    for (const design of SAMPLE_DESIGNS) {
      expect(design.ids).toHaveLength(PICK_EXACTLY);
      const { passed, results } = evaluateInstitution(design.ids);
      expect(
        passed,
        `${design.ids.join("")} — ${results
          .filter((r) => !r.passed)
          .map((r) => r.id)
          .join(", ")}`,
      ).toBe(true);
    }
  });

  it("has no single canonical answer", () => {
    // More than one selection of five passes, and they are not the same five.
    const ids = PROVISIONS.map((p) => p.id);
    const winners: string[][] = [];
    const walk = (start: number, picked: string[]) => {
      if (picked.length === PICK_EXACTLY) {
        if (evaluateInstitution(picked).passed) winners.push([...picked]);
        return;
      }
      for (let i = start; i < ids.length; i++) {
        picked.push(ids[i]!);
        walk(i + 1, picked);
        picked.pop();
      }
    };
    walk(0, []);
    expect(winners.length).toBeGreaterThan(1);
    // And the passing sets genuinely differ, rather than being one set plus
    // an inert extra card.
    const shapes = new Set(winners.map((w) => w.join("")));
    expect(shapes.size).toBe(winners.length);
  });

  it("fails employer approval alongside an independent route", () => {
    // Her first invalid construction: it looks reasonable on the cards.
    const { results } = evaluateInstitution(["B", "D", "E", "I", "K"]);
    const reach = results.find((r) => r.id === "reach")!;
    expect(reach.passed).toBe(false);
    expect(reach.notes.join(" ")).toContain("D");
  });

  it("fails protection conditional on the allegation proving correct", () => {
    const { results } = evaluateInstitution(["B", "C", "H", "I", "K"]);
    expect(results.find((r) => r.id === "protection")!.passed).toBe(false);
  });

  it("fails treating a report as automatic proof", () => {
    const { results } = evaluateInstitution(["B", "C", "E", "J", "K"]);
    expect(results.find((r) => r.id === "discipline")!.passed).toBe(false);
  });

  it("fails a route with no corroboration and no escalation", () => {
    const { results } = evaluateInstitution(["B", "C", "E", "G", "F"]);
    expect(results.find((r) => r.id === "discipline")!.passed).toBe(false);
  });

  it("says something on every test, pass or fail", () => {
    for (const ids of [
      ["B", "C", "E", "I", "K"],
      ["A", "D", "F", "H", "J"],
    ]) {
      for (const result of evaluateInstitution(ids).results) {
        expect(result.notes.length).toBeGreaterThan(0);
      }
    }
  });
});
