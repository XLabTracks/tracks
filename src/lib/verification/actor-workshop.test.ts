import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { diffSet, sameSet, scorePlacements } from "./actor-workshop";
import {
  CLOSING_KEY,
  POSTURE_KEY,
  RECALL_TARGET,
  RING_KEY,
  RING_WHY,
  RINGS,
  ROLE_KEY,
  WORKSHOP_ACTOR_IDS,
  SECOND_ORDER,
  WORKSHOP_ACTORS,
  CORE_QUESTION,
} from "./data/actor-workshop";
import { ACTOR_MAP_ENTRIES, ACTOR_POSTURES, ACTOR_ROLES } from "./data/actor-map";
import { keyTotal } from "./data/marking-keys";

describe("sameSet / diffSet", () => {
  it("is order-independent and rejects a subset", () => {
    expect(sameSet(["a", "b"], ["b", "a"])).toBe(true);
    expect(sameSet(["a"], ["a", "b"])).toBe(false);
  });

  it("names what was missed and what was extra", () => {
    expect(diffSet(["a", "c"], ["a", "b"])).toEqual({
      missed: ["b"],
      extra: ["c"],
      right: false,
    });
  });
});

describe("scorePlacements", () => {
  it("counts only exact ring matches and ignores unplaced actors", () => {
    const key = { x: "runs", y: "rules", z: "runs" } as const;
    expect(scorePlacements({ x: "runs", y: "runs" }, key, ["x", "y", "z"])).toEqual({
      right: 1,
      total: 3,
    });
  });
});

/* The data is as load-bearing as the logic: a key that names a ring which
   does not exist, or an actor the roster dropped, would render as an
   exercise nobody can finish rather than as an error. */
describe("actor-workshop data", () => {
  it("resolves every workshop actor against the roster", () => {
    expect(WORKSHOP_ACTORS.map((a) => a.id)).toEqual([...WORKSHOP_ACTOR_IDS]);
  });

  it("gives every actor a ring, and a reason for it", () => {
    const rings = new Set(RINGS.map((r) => r.id));
    for (const id of WORKSHOP_ACTOR_IDS) {
      expect(rings.has(RING_KEY[id]), `${id} has no valid ring`).toBe(true);
      expect(RING_WHY[id], `${id} has no reason`).toBeTruthy();
    }
  });

  it("puts at least two actors on every ring", () => {
    for (const ring of RINGS) {
      const on = WORKSHOP_ACTOR_IDS.filter((id) => RING_KEY[id] === ring.id);
      expect(on.length, `${ring.id} has ${on.length}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("keys roles and postures off the roster's own vocabulary", () => {
    const roles = new Set(ACTOR_ROLES.map((r) => r.id));
    const postures = new Set(ACTOR_POSTURES.map((p) => p.id));
    for (const id of WORKSHOP_ACTOR_IDS) {
      expect(ROLE_KEY[id]?.length, `${id} has no roles`).toBeGreaterThan(0);
      for (const r of ROLE_KEY[id]!) expect(roles.has(r)).toBe(true);
      for (const p of POSTURE_KEY[id]!) expect(postures.has(p)).toBe(true);
    }
  });

  it("gives the core question exactly one right answer, each with a reason", () => {
    const right = CORE_QUESTION.options.filter((o) => o.correct);
    expect(right).toHaveLength(1);
    for (const o of CORE_QUESTION.options) expect(o.why.length).toBeGreaterThan(20);
  });
});

/* Step 2's key is the roster's own entry for the cloud provider, printed as
   the lesson prints it. If the roster gains or loses a role there, the key
   must move with it or the step marks against something the course no longer
   says. */
describe("recall target", () => {
  const cloud = ACTOR_MAP_ENTRIES.find((a) => a.id === RECALL_TARGET.actorId)!;

  it("names the actor the lesson works through", () => {
    expect(cloud).toBeTruthy();
  });

  it("keys on exactly that actor's roles and postures", () => {
    const ids = RECALL_TARGET.items.map((i) => i.id).sort();
    expect(ids).toEqual([...cloud.roles, ...cloud.postures].sort());
  });

  it("gives every item a label and a gloss", () => {
    for (const item of RECALL_TARGET.items) {
      expect(item.label.length, item.id).toBeGreaterThan(3);
      expect(item.gloss.length, item.id).toBeGreaterThan(20);
    }
  });
});

describe("second-order question", () => {
  it("has exactly one right answer and a reason on every option", () => {
    expect(SECOND_ORDER.options.filter((o) => o.correct)).toHaveLength(1);
    for (const o of SECOND_ORDER.options) expect(o.why.length).toBeGreaterThan(40);
  });

  it("asks about actors the workshop actually put on the board", () => {
    const ids = new Set<string>(WORKSHOP_ACTOR_IDS);
    for (const o of SECOND_ORDER.options) expect(ids.has(o.id), o.id).toBe(true);
  });

  it("names the inner ring as the answer, since that is what the map claims", () => {
    const right = SECOND_ORDER.options.find((o) => o.correct)!;
    expect(RING_KEY[right.id as keyof typeof RING_KEY]).toBe("runs");
  });
});

/* The closing key states two facts about the roster. Re-derive them here, so
   that editing the roster fails loudly instead of leaving a key that lies. */
describe("closing marking key", () => {
  it("still has exactly three roles for Taiwan, which is what the question says", () => {
    const taiwan = ACTOR_MAP_ENTRIES.find((a) => a.id === "taiwan")!;
    expect(taiwan.roles.length).toBeGreaterThanOrEqual(3);
    expect(new Set(taiwan.roles)).toEqual(
      new Set(["chokepoint", "information", "victim"]),
    );
  });

  it("still has exactly two actors holding capability and enforcement at once", () => {
    const both = ACTOR_MAP_ENTRIES.filter(
      (a) => a.roles.includes("capability") && a.roles.includes("enforcement"),
    ).map((a) => a.id);
    expect(both.sort()).toEqual(["china", "us"]);
  });

  it("totals the sum of its parts and says what earns nothing", () => {
    expect(keyTotal(CLOSING_KEY)).toBe(
      CLOSING_KEY.criteria.reduce((n, c) => n + c.points, 0),
    );
    expect(keyTotal(CLOSING_KEY)).toBeGreaterThan(0);
    expect(CLOSING_KEY.noCredit.length).toBeGreaterThanOrEqual(2);
  });

  it("asks for the mechanism wherever it asks for a judgement", () => {
    // The house rule from data/marking-keys.ts: a bare correct label earns
    // nothing where reasoning was the point.
    expect(CLOSING_KEY.criteria.some((c) => c.needsReasoning)).toBe(true);
  });
});

/**
 * Quote tripwire.
 *
 * The rings are ours and the sentences they are justified by are hers, so
 * every quoted fragment in the data file has to still be in 1.2 word for
 * word. This caught the defect that made it worth writing: "The machines
 * without which no leading-edge chip exists." was quoted with a full stop
 * where Table 4 has a comma and keeps going. A quote edited to fit is the
 * thing this repo's snippet tripwires exist to stop, and widget data had no
 * such guard until now.
 *
 * A trailing "..." marks a deliberate cut and is dropped before matching;
 * nothing else about a fragment may differ.
 *
 * THE CONVENTION THIS RESTS ON, so nobody trips it by accident: curly
 * quotation marks in the data file are reserved for 1.2's own words. Anything
 * quoted from somewhere else — a paper, a figure caption — is attributed
 * inline and written with straight quotes, which this test does not read. And
 * a line that puts words in a learner's mouth, like the noCredit examples,
 * carries no quotation marks at all; one of them did, and it failed here,
 * which is the check behaving correctly rather than a reason to loosen it.
 */
describe("quotes from 1.2", () => {
  const norm = (s: string) =>
    s
      .normalize("NFKC")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2014\u2013]/g, "-")
      .replace(/\u2026|\.\.\./g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const DATA = readFileSync(join(__dirname, "data/actor-workshop.ts"), "utf8");
  const LESSON = readFileSync(
    join(__dirname, "../../content/lessons/verification/scoping-actors.mdx"),
    "utf8",
  );

  const fragments = [...DATA.matchAll(/\u201c([^\u201d]{20,})\u201d/g)].map((m) => m[1]!);

  it("finds fragments to check at all", () => {
    // A refactor that drops the quotes would otherwise make this suite pass
    // by having nothing to test.
    expect(fragments.length).toBeGreaterThanOrEqual(6);
  });

  it("matches every quoted fragment against the lesson body", () => {
    const body = norm(LESSON);
    const drifted = fragments.filter((f) => !body.includes(norm(f)));
    expect(drifted, "these no longer appear in scoping-actors.mdx").toEqual([]);
  });
});
