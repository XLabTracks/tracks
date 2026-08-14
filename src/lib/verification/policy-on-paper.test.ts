import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  POLICY_COMPANIES,
  POLICY_DEMANDS,
  POLICY_QUESTIONS,
  POLICY_SOURCES,
} from "./data/policy-on-paper";

/**
 * 2.4.4's optional extension. Two things are load-bearing enough to pin.
 *
 * The anonymity: the tabs are judged blind, so nothing above the Sources
 * spoiler may name or link a company. A citation put back on a committed row
 * would name Company A while Company B was still meant to be marked, and it
 * would do it silently — the widget would look fine.
 *
 * The disclosure: every document a row was read out of has to reach that
 * spoiler. The list derives itself from the rows, and this is the test that
 * says so, so a source added to a statement can never be one nobody can check.
 */

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
    // The rows render `s.text`, `s.note` and the answer key — never `s.cite`.
    expect(src).not.toMatch(/\bs\.cite\b/);
    // The only place links are built is the derived Sources list: the key
    // and the href of one anchor, and nothing else in the file.
    expect(src.match(/cite\.href/g) ?? []).toHaveLength(2);
  });

  it("keeps the retraction as the last row of Company B, self-reported", () => {
    // The course owner's instruction: a 2024 rule presented as still in force
    // is an error, not strictness. The row that says it was withdrawn is
    // compulsory, and it is the company's own account of its own conduct.
    const b = POLICY_COMPANIES.find((c) => c.id === "b")!;
    const last = b.statements.at(-1)!;
    expect(last.id).toBe("b-retracted");
    expect(last.kind).toBe("self-report");
    expect(last.text).toMatch(/May 2024/);
  });

  it("puts the analysis questions on the page before anything is gated", () => {
    // The defect this pins: the two questions used to appear only once every
    // tab was committed, so a learner met the analysis after the marking had
    // been sealed. They belong above the tabs, and nothing about them may
    // depend on `done`.
    const src = readFileSync(WIDGET, "utf8");
    const deck = src.indexOf("<QuestionWorkspace");
    const gate = src.indexOf("{done ?");
    expect(deck).toBeGreaterThan(-1);
    expect(gate).toBeGreaterThan(-1);
    expect(deck).toBeLessThan(gate);
    expect(POLICY_QUESTIONS.every((q) => q.requirement === "required")).toBe(
      true,
    );
  });

  it("asks the demands question rather than marking them", () => {
    expect(POLICY_DEMANDS.demands).toHaveLength(4);
    expect(POLICY_DEMANDS.question).toMatch(/structurally/i);
  });
});
