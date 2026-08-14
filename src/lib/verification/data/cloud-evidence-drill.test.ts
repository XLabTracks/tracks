import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  CLOUD_AVAILABLE_DATA,
  CLOUD_CASE_OPTIONS,
  CLOUD_CONCEPT_ROWS,
  CLOUD_CONCEPTS,
  CLOUD_INFERENCE_OPTIONS,
  CLOUD_MATCH_CONCLUSIONS,
  CLOUD_MATCH_ROWS,
  CLOUD_ODD_ITEMS,
  CLOUD_PIPELINE_GAPS,
  CLOUD_PIPELINE_OPTIONS,
  CLOUD_SEQUENCE,
  CLOUD_SEQUENCE_START,
  CLOUD_TASKS,
  CLOUD_TRUE_FALSE,
} from "./cloud-evidence-drill";

const unique = (items: readonly string[]) =>
  new Set(items).size === items.length;

describe("cloud evidence problem set", () => {
  it("contains the nine requested mechanics in a thirty-minute block", () => {
    expect(CLOUD_TASKS).toHaveLength(9);
    expect(
      CLOUD_TASKS.reduce(
        (total, task) => total + Number.parseInt(task.time, 10),
        0
      )
    ).toBe(30);
  });

  it("has six true-or-false claims with both verdicts represented", () => {
    expect(CLOUD_TRUE_FALSE).toHaveLength(6);
    expect(CLOUD_TRUE_FALSE.some((item) => item.answer)).toBe(true);
    expect(CLOUD_TRUE_FALSE.some((item) => !item.answer)).toBe(true);
  });

  it("keeps the odd-one-out as a two-part classification", () => {
    expect(CLOUD_ODD_ITEMS).toHaveLength(4);
    expect(CLOUD_ODD_ITEMS.some((item) => item.id === "owner")).toBe(true);
  });

  it("gives select-all tasks both supported and unsupported conclusions", () => {
    for (const set of [CLOUD_AVAILABLE_DATA, CLOUD_CASE_OPTIONS]) {
      expect(set.some((item) => item.answer)).toBe(true);
      expect(set.some((item) => !item.answer)).toBe(true);
    }
  });

  it("uses every matching conclusion exactly once", () => {
    const answers = CLOUD_MATCH_ROWS.map((row) => row.answerId);
    expect(unique(answers)).toBe(true);
    expect(new Set(answers)).toEqual(
      new Set(CLOUD_MATCH_CONCLUSIONS.map((item) => item.id))
    );
  });

  it("has three unused but valid-looking terms in the gap exercise", () => {
    const answers = CLOUD_PIPELINE_GAPS.map((gap) => gap.answer);
    expect(unique(answers)).toBe(true);
    expect(
      answers.every((answer) => CLOUD_PIPELINE_OPTIONS.includes(answer))
    ).toBe(true);
    expect(CLOUD_PIPELINE_OPTIONS.length - CLOUD_PIPELINE_GAPS.length).toBe(3);
  });

  it("starts the sequence as a complete shuffled permutation", () => {
    expect(CLOUD_SEQUENCE_START).not.toEqual(
      CLOUD_SEQUENCE.map((item) => item.id)
    );
    expect(new Set(CLOUD_SEQUENCE_START)).toEqual(
      new Set(CLOUD_SEQUENCE.map((item) => item.id))
    );
    expect(CLOUD_SEQUENCE.map((item) => item.id)).toEqual([
      "monitor",
      "approach",
      "kyc",
      "purpose",
      "continue",
      "respond",
    ]);
  });

  it("uses each concept exactly once", () => {
    const answers = CLOUD_CONCEPT_ROWS.map((row) => row.answer);
    expect(unique(answers)).toBe(true);
    expect(new Set(answers)).toEqual(new Set(CLOUD_CONCEPTS));
  });

  it("contains one designated investigation response in the final problem", () => {
    expect(
      CLOUD_INFERENCE_OPTIONS.filter((item) => item.id === "investigate")
    ).toHaveLength(1);
    expect(unique(CLOUD_INFERENCE_OPTIONS.map((item) => item.id))).toBe(true);
  });

  it("keeps all learner-facing copy in English", () => {
    const dataSource = readFileSync(
      join(__dirname, "cloud-evidence-drill.ts"),
      "utf8"
    );
    const widgetSource = readFileSync(
      join(
        __dirname,
        "../../../components/verification/widgets/cloud-evidence-drill.tsx"
      ),
      "utf8"
    );
    expect(dataSource + widgetSource).not.toMatch(
      /[\u0400-\u04ff\u3400-\u9fff]/u
    );
  });
});
