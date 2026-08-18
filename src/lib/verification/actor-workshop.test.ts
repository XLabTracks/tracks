import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  diffSet,
  normalize,
  recallHits,
  sameSet,
  scorePlacements,
} from "./actor-workshop";
import type { ActorMapEntry } from "./data/actor-map";
import {
  POSTURE_KEY,
  RECALL_ALIASES,
  RING_KEY,
  RING_WHY,
  RINGS,
  ROLE_KEY,
  WORKSHOP_ACTOR_IDS,
  WORKSHOP_ACTORS,
  CORE_QUESTION,
} from "./data/actor-workshop";
import { ACTOR_POSTURES, ACTOR_ROLES } from "./data/actor-map";

const actor = (id: string, name: string): ActorMapEntry => ({
  id,
  name,
  group: "g",
  kind: "private",
  position: "",
  roles: [],
  postures: [],
});

describe("normalize", () => {
  it("drops case and punctuation and collapses gaps", () => {
    expect(normalize("  SK hynix, Samsung & Micron!  ")).toBe(
      "sk hynix samsung micron",
    );
  });
});

describe("recallHits", () => {
  const roster = [
    actor("hyperscalers", "AWS, Azure, Google Cloud, Oracle, Alibaba"),
    actor("asml", "ASML"),
    actor("deployers", "Product builders and deployers"),
  ];

  it("marks a shorter right answer as a hit through its alias", () => {
    // The whole reason aliases exist: "cloud providers" is Table 4's own
    // heading for a row the roster spells as five company names.
    const hits = recallHits(["cloud providers"], roster, {
      hyperscalers: ["cloud providers"],
    });
    expect([...hits]).toEqual(["hyperscalers"]);
  });

  it("hits on containment, so a one-word name still counts", () => {
    expect([...recallHits(["asml"], roster)]).toEqual(["asml"]);
    expect([...recallHits(["ASML, the Dutch one"], roster)]).toEqual(["asml"]);
  });

  it("hits on a shared word of four letters or more", () => {
    expect([...recallHits(["the deployers downstream"], roster)]).toEqual([
      "deployers",
    ]);
  });

  it("does not hit on short shared words", () => {
    // "and" is in "Product builders and deployers"; a three-letter word must
    // never carry a match or every line would hit every actor.
    expect([...recallHits(["and"], roster)]).toEqual([]);
  });

  it("ignores blank lines and returns nothing for an empty list", () => {
    expect(recallHits([], roster).size).toBe(0);
    expect(recallHits(["", "   "], roster).size).toBe(0);
  });

  it("counts an actor once however many lines mention it", () => {
    const hits = recallHits(["ASML", "asml again"], roster);
    expect(hits.size).toBe(1);
  });
});

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

  it("carries an alias list that names only workshop actors", () => {
    const ids = new Set<string>(WORKSHOP_ACTOR_IDS);
    for (const id of Object.keys(RECALL_ALIASES)) expect(ids.has(id)).toBe(true);
  });

  it("gives the core question exactly one right answer, each with a reason", () => {
    const right = CORE_QUESTION.options.filter((o) => o.correct);
    expect(right).toHaveLength(1);
    for (const o of CORE_QUESTION.options) expect(o.why.length).toBeGreaterThan(20);
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
