import { describe, expect, it } from "vitest";
import {
  INSTRUCTOR_COMMENT_MAX,
  instructorRubricRows,
  parseStoredInstructorCriteria,
  sanitizeInstructorGrade,
} from "./instructor-grade";
import { rubricTotal } from "./rubric";

describe("sanitizeInstructorGrade", () => {
  it("fills omitted criteria as N/A, in rubric order", () => {
    const grade = sanitizeInstructorGrade({
      criteria: [
        { id: "C3", score: 2, note: " calibrated " },
        { id: "C1", score: 0 },
      ],
      comment: "",
    });
    expect(grade?.criteria.map((c) => c.id)).toEqual([
      "C1", "C2", "C3", "C4", "C5", "C6", "C7",
    ]);
    expect(grade?.criteria[0]).toEqual({ id: "C1", score: 0, note: "" });
    expect(grade?.criteria[2]).toEqual({ id: "C3", score: 2, note: "calibrated" });
    expect(grade?.criteria[1].score).toBeNull();
    expect(grade?.comment).toBeNull();
  });

  it("accepts a comment-only grade", () => {
    expect(
      sanitizeInstructorGrade({ criteria: [], comment: "  Good start. " })?.comment,
    ).toBe("Good start.");
  });

  it("rejects a grade that says nothing", () => {
    expect(sanitizeInstructorGrade({ criteria: [], comment: "   " })).toBeNull();
  });

  it.each([
    [{ criteria: [{ id: "C9", score: 1 }], comment: "" }],
    [{ criteria: [{ id: "C1", score: 4 }], comment: "" }],
    [{ criteria: [{ id: "C1", score: 1.5 }], comment: "" }],
    [{ criteria: [{ id: "C1", score: "2" }], comment: "" }],
    [{ criteria: [{ id: "C1", score: 1 }, { id: "C1", score: 2 }], comment: "" }],
    [{ criteria: [], comment: "x".repeat(INSTRUCTOR_COMMENT_MAX + 1) }],
    [{ criteria: "C1", comment: "" }],
    [null],
  ])("rejects malformed input %#", (raw) => {
    expect(sanitizeInstructorGrade(raw)).toBeNull();
  });
});

describe("totals and rows", () => {
  it("rescales the /45 total over scored criteria", () => {
    const grade = sanitizeInstructorGrade({
      criteria: [
        { id: "C1", score: 3 },
        { id: "C5", score: 0 },
      ],
      comment: "",
    })!;
    // (3×3 + 0×1) / (9 + 3) × 45
    expect(rubricTotal(grade.criteria)?.score).toBe(33.8);
  });

  it("has no total when nothing is scored", () => {
    const grade = sanitizeInstructorGrade({ criteria: [], comment: "ok" })!;
    expect(rubricTotal(grade.criteria)).toBeNull();
  });

  it("drops untouched criteria from the table rows", () => {
    const grade = sanitizeInstructorGrade({
      criteria: [{ id: "C2", score: null, note: "Not applicable here." }],
      comment: "",
    })!;
    expect(instructorRubricRows(grade.criteria)).toEqual([
      { id: "C2", score: null, evidence: null, rationale: "Not applicable here." },
    ]);
  });

  it("reads odd stored rows as all N/A instead of throwing", () => {
    expect(parseStoredInstructorCriteria("garbage").every((c) => c.score === null)).toBe(true);
  });
});
