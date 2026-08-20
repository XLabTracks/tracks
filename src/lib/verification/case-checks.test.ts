import { describe, expect, it } from "vitest";

import { runCaseChecks, wordCount, type CaseFields } from "./case-checks";

const BOUNDS = { min: 100, max: 180 };

const GOOD: CaseFields = {
  insider: "A scheduling engineer at a cloud provider.",
  information:
    "She saw one customer account hold twelve thousand accelerators for nineteen days, and she administers the systems that record it.",
  route:
    "She files under the provider's protected-disclosure policy to the national authority, which the policy names.",
  failure:
    "The authority can establish that the capacity was held, and it cannot establish what ran on it, because the workload records belong to the customer and no route obliges the customer to produce them.",
};

function find(fields: CaseFields, id: string) {
  return runCaseChecks(fields, BOUNDS).find((c) => c.id === id);
}

describe("case checks", () => {
  it("survives fields the editor has not stored yet", () => {
    expect(() => runCaseChecks({}, BOUNDS)).not.toThrow();
    expect(() => runCaseChecks({ insider: "x" }, BOUNDS)).not.toThrow();
    expect(runCaseChecks({ insider: "x" }, BOUNDS)[0]!.message).toContain(
      "Failure point",
    );
  });

  it("counts words the way the brief does", () => {
    expect(wordCount("  one two   three ")).toBe(3);
    expect(wordCount("")).toBe(0);
  });

  it("names the fields still empty", () => {
    const check = find({ ...GOOD, route: "  " }, "fields")!;
    expect(check.severity).toBe("bad");
    expect(check.message).toContain("Reporting route");
  });

  it("reports nothing but the empty-field row on an empty case", () => {
    const checks = runCaseChecks(
      { insider: "", information: "", route: "", failure: "" },
      BOUNDS,
    );
    expect(checks).toHaveLength(1);
    expect(checks[0]!.id).toBe("fields");
  });

  it("is harder on short than on long", () => {
    expect(find({ ...GOOD, failure: "It fails." }, "length")!.severity).toBe("bad");
    const long = { ...GOOD, information: `${GOOD.information} ${"word ".repeat(200)}` };
    expect(find(long, "length")!.severity).toBe("warn");
  });

  it("catches each excluded failure, and only when it is there", () => {
    for (const failure of [
      "The insider lied about the run.",
      "It turns out the engineer was mistaken.",
      "She is forbidden to report it to anyone outside.",
      "The verifier ignores the report.",
    ]) {
      expect(find({ ...GOOD, failure }, "excluded")!.severity, failure).toBe("warn");
    }
    expect(find(GOOD, "excluded")!.severity).toBe("ok");
  });

  it("asks the failure for a mechanism rather than a verdict", () => {
    expect(find({ ...GOOD, failure: "The report goes nowhere." }, "mechanism")!.severity).toBe("warn");
    expect(find(GOOD, "mechanism")!.severity).toBe("ok");
  });

  it("asks the information how the insider knows", () => {
    expect(
      find({ ...GOOD, information: "There was an undeclared training run." }, "how-known")!
        .severity,
    ).toBe("warn");
    expect(find(GOOD, "how-known")!.severity).toBe("ok");
  });

  it("notices a failure that could belong to any case", () => {
    expect(
      find({ ...GOOD, failure: "Nobody can prove anything, which is common." }, "consistency")!
        .severity,
    ).toBe("warn");
    expect(find(GOOD, "consistency")!.severity).toBe("ok");
  });

  it("never claims to judge the five criteria", () => {
    const ids = runCaseChecks(GOOD, BOUNDS).map((c) => c.id);
    expect(ids).not.toContain("plausible");
    expect(ids).not.toContain("permitted");
    expect(new Set(ids)).toEqual(
      new Set(["fields", "length", "excluded", "mechanism", "how-known", "consistency"]),
    );
  });
});
