import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  verificationUnitMeta,
  verificationUnitOfLesson,
} from "@/content/verification/curriculum";
import {
  completedReadingMinutes,
  completedVerificationUnits,
  skillSummary,
  submittedWordCount,
} from "./completion-stats";
import {
  COMPOUND_RUNG,
  COMPOUND_UNITS,
  SKILL_NODES,
  SKILLS_REV,
} from "./data/skills";

/**
 * `public/verification/` is outside tsconfig and outside vitest's own glob,
 * so nothing else in the suite reads it. The static map keeps the graph as
 * `window.SKILLS` in data/skills.js; the app keeps the progress skeleton of
 * the same graph in data/skills.ts. Evaluate the static file (it is a pure
 * data assignment, no DOM) and compare, so the completion page cannot count
 * skills against a different ladder than the map draws.
 *
 * A file this cannot evaluate is a failure, not a skip: if skills.js is
 * restructured, the check must say so rather than quietly stop running.
 */
describe("skills snapshot matches the static map's graph", () => {
  const source = readFileSync(
    path.join(process.cwd(), "public/verification/data/skills.js"),
    "utf8",
  );
  const windowStub: {
    SKILLS?: {
      rev: number;
      compoundRung: string;
      compoundUnits: string[];
      nodes: { id: string; rungs: [string, string][] }[];
    };
  } = {};
  new Function("window", source)(windowStub);
  const SKILLS = windowStub.SKILLS;

  it("evaluates to the graph object", () => {
    expect(SKILLS).toBeDefined();
  });

  it("agrees on revision and the compound rung", () => {
    expect(SKILLS?.rev).toBe(SKILLS_REV);
    expect(SKILLS?.compoundRung).toBe(COMPOUND_RUNG);
    expect(SKILLS?.compoundUnits).toEqual([...COMPOUND_UNITS]);
  });

  it("agrees on every node's id and rung units, in order", () => {
    const theirs = (SKILLS?.nodes ?? []).map((n) => ({
      id: n.id,
      rungs: n.rungs.map((r) => r[0]),
    }));
    expect(theirs).toEqual(SKILL_NODES);
  });

  it("every rung names a unit the outline carries", () => {
    // The unit meta registry, not the lesson join: the outline may carry
    // units whose lessons are not drafted yet (3.1 and 3.2 today), and a
    // rung tagged onto one would be real and simply not yet completable —
    // a typo'd rung is neither.
    const units = new Set(Object.keys(verificationUnitMeta));
    for (const node of SKILL_NODES) {
      for (const rung of node.rungs) {
        if (rung === COMPOUND_RUNG) continue;
        expect(units, `${node.id} rung ${rung}`).toContain(rung);
      }
    }
  });
});

describe("completedVerificationUnits", () => {
  // 2.3 Intelligence is the many-lessons unit; 4.2 is a one-lesson unit.
  const intel = Object.entries(verificationUnitOfLesson)
    .filter(([, unit]) => unit === "2.3")
    .map(([lessonId]) => lessonId);

  it("needs every lesson of a unit, not the first", () => {
    expect(intel.length).toBeGreaterThan(1);
    const allButOne = new Set(intel.slice(1));
    expect(completedVerificationUnits(allButOne).has("2.3")).toBe(false);
    expect(completedVerificationUnits(new Set(intel)).has("2.3")).toBe(true);
  });

  it("completes a single-lesson unit from its one lesson", () => {
    const done = completedVerificationUnits(new Set(["v-capstone-project"]));
    expect(done.has("4.2")).toBe(true);
    expect(done.size).toBe(1);
  });
});

describe("skillSummary", () => {
  it("counts nothing on no units", () => {
    expect(skillSummary(new Set())).toEqual({
      mastered: 0,
      inProgress: 0,
      total: 31,
    });
  });

  it("masters every node when every outline unit is done", () => {
    const all = new Set(Object.keys(verificationUnitMeta));
    expect(skillSummary(all)).toEqual({
      mastered: 31,
      inProgress: 0,
      total: 31,
    });
  });

  it("the drafted course masters every ladder", () => {
    // The v2 graph tags rungs only on units with drafted lessons — the old
    // graph's 3.1/3.2 rungs (units with no lessons, so ladders that could
    // never fill) were retagged or cut in the rewrite. A learner who
    // finishes everything the course currently carries therefore masters
    // all 31 skills; if a rung is ever tagged onto an undrafted unit again,
    // this is the test that starts reporting the honest smaller number.
    const everyLesson = new Set(Object.keys(verificationUnitOfLesson));
    const summary = skillSummary(completedVerificationUnits(everyLesson));
    expect(summary.mastered).toBe(31);
    expect(summary.inProgress).toBe(0);
  });

  it("a partly filled ladder is in progress, not mastered", () => {
    // "hardware" is the one-rung node on 2.1, so 2.1 alone masters it while
    // longer ladders touching 2.1 only advance.
    const summary = skillSummary(new Set(["2.1"]));
    expect(summary.mastered).toBe(1);
    expect(summary.inProgress).toBeGreaterThan(0);
  });

  it("the compound rung fills by quarters and masters only complete", () => {
    // "feasib" is 2.0 + 2.1–2.4 + 3.0 + 4.1: three evidence buckets leave
    // its compound rung at 3/4, so taxonomies, hardware, intel, cloud,
    // evasion and research are mastered; the fourth bucket adds feasib
    // and human.
    const nearly = new Set(["2.0", "2.1", "2.2", "2.3", "3.0", "4.1"]);
    expect(skillSummary(nearly).mastered).toBe(6);
    expect(skillSummary(new Set([...nearly, "2.4"])).mastered).toBe(8);
  });
});

describe("submittedWordCount", () => {
  it("sums words across sections and submissions", () => {
    expect(
      submittedWordCount([
        { intro: "Three words here", body: "and  three\nmore" },
        { solo: "one" },
      ]),
    ).toBe(7);
  });

  it("ignores non-writing shapes rather than throwing", () => {
    expect(
      submittedWordCount([
        null,
        undefined,
        { selectedOptionIds: ["a", "b"] },
        { stages: { s1: { attempts: 2 } } },
        ["not", "a", "map"],
        "not an object",
      ]),
    ).toBe(0);
  });
});

describe("completedReadingMinutes", () => {
  it("sums the course's own estimates over completed items only", () => {
    const none = completedReadingMinutes("verification", new Set());
    expect(none).toBe(0);
    const one = completedReadingMinutes(
      "verification",
      new Set(["v-introduction"]),
    );
    expect(one).toBeGreaterThan(0);
    const two = completedReadingMinutes(
      "verification",
      new Set(["v-introduction", "v-prevention"]),
    );
    expect(two).toBeGreaterThan(one);
  });
});
