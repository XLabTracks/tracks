import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  POLICY_COMPANIES,
  POLICY_DEMANDS,
  POLICY_QUESTIONS,
  POLICY_SOURCES,
} from "./data/policy-on-paper";

const WIDGET = path.join(
  process.cwd(),
  "src/components/verification/widgets/policy-on-paper.tsx",
);

describe("policy-on-paper", () => {
  it("reveals every row's source in the Sources block", () => {
    for (const company of POLICY_COMPANIES) {
      const listed = new Set(
        POLICY_SOURCES.find((s) => s.id === company.id)!.cites.map(
          (c) => c.href,
        ),
      );
      for (const s of company.statements) {
        expect(listed, `${company.id} · ${s.id}`).toContain(s.cite.href);
      }
    }
  });

  it("names every tab in the Sources block, the demands included", () => {
    expect(POLICY_SOURCES.map((s) => s.id)).toEqual([
      ...POLICY_COMPANIES.map((c) => c.id),
      POLICY_DEMANDS.id,
    ]);
    for (const row of POLICY_SOURCES) {
      expect(row.realName.length).toBeGreaterThan(0);
      expect(row.cites.length).toBeGreaterThan(0);
      for (const cite of row.cites) {
        expect(cite.href).toMatch(/^https:\/\//);
      }
    }
  });

  it("keeps the citations out of the marking surface", () => {
    const src = readFileSync(WIDGET, "utf8");
    expect(src).not.toMatch(/\bs\.cite\b/);
    expect(src.match(/cite\.href/g) ?? []).toHaveLength(2);
  });

  it("keeps the retraction as the last row of Company B, self-reported", () => {
    const b = POLICY_COMPANIES.find((c) => c.id === "b")!;
    const last = b.statements.at(-1)!;
    expect(last.id).toBe("b-retracted");
    expect(last.kind).toBe("self-report");
    expect(last.text).toMatch(/May 2024/);
  });

  it("gates nothing on having finished", () => {
    const src = readFileSync(WIDGET, "utf8");
    expect(src).not.toContain("{done ?");
    expect(src).toContain("<QuestionWorkspace");
    expect(src).toContain("<Spoiler");
    expect(POLICY_QUESTIONS.every((q) => q.requirement === "required")).toBe(
      true,
    );
  });

  it("asks the demands question rather than marking them", () => {
    expect(POLICY_DEMANDS.demands).toHaveLength(4);
    expect(POLICY_DEMANDS.question).toMatch(/structurally/i);
  });
});
