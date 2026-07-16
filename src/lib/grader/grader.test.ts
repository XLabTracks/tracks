import { describe, expect, it } from "vitest";
import { classifyLength, countWords, modelFor } from "./classify";
import { parseVerdict } from "./parse";
import { systemPrompt, userPrompt } from "./prompts";
import { assembleArgueReveal, assembleWriting } from "./sample";
import { feedbackToHtml } from "./feedback-html";

describe("classifyLength", () => {
  it("classifies by word count with the documented boundaries", () => {
    expect(classifyLength("one two three")).toBe("short");
    expect(classifyLength(Array(99).fill("w").join(" "))).toBe("short");
    expect(classifyLength(Array(100).fill("w").join(" "))).toBe("medium");
    expect(classifyLength(Array(400).fill("w").join(" "))).toBe("medium");
    expect(classifyLength(Array(401).fill("w").join(" "))).toBe("long");
  });

  it("counts words across whitespace runs and trims", () => {
    expect(countWords("  a\n b\t\tc  ")).toBe(3);
    expect(countWords("")).toBe(0);
  });

  it("resolves a model for every class", () => {
    for (const cls of ["short", "medium", "long"] as const) {
      expect(modelFor(cls)).toBeTruthy();
    }
  });
});

describe("systemPrompt", () => {
  it("appends the adaptation only for short and medium", () => {
    expect(systemPrompt("long")).not.toContain("ADAPTATION");
    expect(systemPrompt("short")).toContain("ADAPTATION — SHORT SAMPLE");
    expect(systemPrompt("medium")).toContain("ADAPTATION — MEDIUM SAMPLE");
    // All three share the verbatim rubric core.
    for (const cls of ["short", "medium", "long"] as const) {
      expect(systemPrompt(cls)).toContain("C4. IDENTIFICATION OF KIND OF SUPPORT");
      expect(systemPrompt(cls)).toContain("## Verdict");
    }
  });

  it("fills the user template slots", () => {
    const prompt = userPrompt("SAMPLE TEXT", {
      documentType: "memo",
      stakes: "test",
      audience: "testers",
    });
    expect(prompt).toContain("Document type: memo");
    expect(prompt).toContain("<<<\nSAMPLE TEXT\n>>>");
  });
});

describe("parseVerdict", () => {
  it("reads the verdict section", () => {
    const md = "## Verdict\n31/45 — Strong. Reader can update.\n\n## Scores\n…";
    expect(parseVerdict(md)).toEqual({ score: 31, band: "Strong" });
  });

  it("handles rescaled fractional totals and missing bands", () => {
    expect(parseVerdict("## Verdict\n22.5/45")?.score).toBe(22.5);
    expect(parseVerdict("total: 40/45 overall")?.score).toBe(40);
  });

  it("rejects out-of-range and absent verdicts", () => {
    expect(parseVerdict("## Verdict\n99/45 — impossible")).toBeNull();
    expect(parseVerdict("no score anywhere")).toBeNull();
  });
});

describe("assembleWriting", () => {
  it("assembles a single-section writing exercise without labels", () => {
    // c-threats-l1-reprioritize is a writing-prompt exercise in the graph.
    const result = assembleWriting("c-threats-l1-reprioritize", "exercise", {
      response: "My answer.",
    });
    expect(result?.sample).toBe("My answer.");
    expect(result?.context.documentType).toContain("writing exercise");
  });

  it("returns null for empty values or unknown content", () => {
    expect(
      assembleWriting("c-threats-l1-reprioritize", "exercise", {}),
    ).toBeNull();
    expect(assembleWriting("nope", "exercise", { response: "x" })).toBeNull();
  });

  it("labels assessment sections", () => {
    const result = assembleWriting("ex-assessment", "assessment", {});
    // Whatever the example assessment's ids are, empty values → null.
    expect(result).toBeNull();
  });
});

describe("assembleArgueReveal", () => {
  it("includes responses with their critiques as context, plus construction", () => {
    const result = assembleArgueReveal("contra-control-argue-reveal", {
      items: {
        "moral-hazard": {
          rounds: [
            { chips: [], response: "Because incentives.", toolboxOpened: false },
          ],
          rating: "fully",
          note: "",
        },
      },
      construction: {
        attackSurface: "catch-legibility",
        argument: "My argument.",
        bestResponse: "Best response.",
        residual: "Residual.",
      },
    });
    expect(result?.sample).toContain("Because incentives.");
    expect(result?.sample).toContain("the critic argued");
    expect(result?.sample).toContain("My argument.");
  });

  it("returns null when nothing is written", () => {
    expect(assembleArgueReveal("contra-control-argue-reveal", {})).toBeNull();
  });
});

describe("feedbackToHtml", () => {
  it("renders GFM tables and strips dangerous HTML", () => {
    const html = feedbackToHtml(
      "## Scores\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n<script>alert(1)</script>",
    );
    expect(html).toContain("<table>");
    expect(html).not.toContain("<script>");
  });
});
