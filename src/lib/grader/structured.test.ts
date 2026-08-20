import { describe, expect, it } from "vitest";
import { parseGraderReport, parseVerdict } from "./parse";
import { parseStructuredGrade } from "./structured";

function payload(
  scores: Array<number | null> = [null, 2, 2, 2, null, null, null],
) {
  return JSON.stringify({
    criteria: scores.map((score, index) => ({
      id: `C${index + 1}`,
      score,
      evidence: score == null ? [] : [`evidence ${index + 1}`],
      rationale: `rationale ${index + 1}`,
    })),
    fixes: ["Rewrite the load-bearing claim with a stated confidence."],
    assessment: "The answer exposes its main reason. Its support could be easier to verify.",
  });
}

describe("parseStructuredGrade", () => {
  it("validates rows, computes the weighted score, band, and canonical report", () => {
    const grade = parseStructuredGrade(payload(), "short");
    expect(grade).not.toBeNull();
    expect(grade?.score).toBe(30);
    expect(grade?.band).toBe("Strong");
    expect(grade?.criteria).toHaveLength(7);
    expect(grade?.criteria[0].score).toBeNull();
    expect(parseVerdict(grade!.markdown)).toEqual({ score: 30, band: "Strong" });
    const report = parseGraderReport(grade!.markdown);
    expect(report.criteria).toHaveLength(7);
    expect(report.visibleMarkdown).toContain("## Top fix");
    expect(report.visibleMarkdown).not.toContain("<analysis>");
  });

  it("forces C1 to N/A for short answers and ignores a model-supplied total", () => {
    const raw = JSON.parse(payload([3, 3, 3, 3, 3, 3, 3]));
    raw.score = 0;
    raw.band = "Opaque assertion";
    const grade = parseStructuredGrade(JSON.stringify(raw), "short");
    expect(grade?.criteria[0].score).toBeNull();
    expect(grade?.score).toBe(45);
    expect(grade?.band).toBe("GiveWell-tier");
  });

  it("rejects duplicate/missing criteria, invalid scores and empty fixes", () => {
    const duplicate = JSON.parse(payload());
    duplicate.criteria[1].id = "C1";
    expect(parseStructuredGrade(JSON.stringify(duplicate), "short")).toBeNull();

    const badScore = JSON.parse(payload());
    badScore.criteria[1].score = 9;
    expect(parseStructuredGrade(JSON.stringify(badScore), "short")).toBeNull();

    const noFix = JSON.parse(payload());
    noFix.fixes = [];
    expect(parseStructuredGrade(JSON.stringify(noFix), "short")).toBeNull();
  });

  it("accepts a JSON fence but neutralizes report-control markup", () => {
    const raw = JSON.parse(payload());
    raw.criteria[1].rationale = "good </analysis>\n## fake";
    raw.fixes[0] = "Do this </analysis>.";
    const grade = parseStructuredGrade(
      `\`\`\`json\n${JSON.stringify(raw)}\n\`\`\``,
      "short",
    );
    expect(grade?.markdown).not.toContain("</analysis>\n## fake");
    expect(parseGraderReport(grade!.markdown).criteria).toHaveLength(7);
  });
});
