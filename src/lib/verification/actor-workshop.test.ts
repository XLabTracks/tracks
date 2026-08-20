import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { diffSet, edgeId, sameSet, scoreEdges, scorePlacements } from "./actor-workshop";
import {
  ABSENT_ACTORS,
  CATEGORIZE_IDS,
  CENTRE,
  CLOSING_KEY,
  EDGE_FINDING,
  EDGE_KEY,
  EDGE_NOTES,
  MAP_SLOTS,
  POSTURE_KEY,
  RECALL_TARGET,
  RING_KEY,
  RING_WHY,
  RINGS,
  ROLE_KEY,
  SUBGOALS,
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
    const absent = new Set<string>(ABSENT_ACTORS);
    for (const id of WORKSHOP_ACTOR_IDS) {
      if (!absent.has(id)) {
        expect(ROLE_KEY[id]?.length, `${id} has no roles`).toBeGreaterThan(0);
      }
      for (const r of ROLE_KEY[id]!) expect(roles.has(r)).toBe(true);
      for (const p of POSTURE_KEY[id]!) expect(postures.has(p)).toBe(true);
    }
  });

  it("never asks step 5 for an actor the roster gives no answer for", () => {
    const absent = new Set<string>(ABSENT_ACTORS);
    for (const id of CATEGORIZE_IDS) {
      expect(absent.has(id), `${id} is absent and cannot be categorized`).toBe(false);
      expect(ROLE_KEY[id]?.length, id).toBeGreaterThan(0);
      expect(POSTURE_KEY[id]?.length, id).toBeGreaterThan(0);
    }
  });

  it("gives every actor a slot on the map, and no actor two", () => {
    expect([...MAP_SLOTS].sort()).toEqual([...WORKSHOP_ACTOR_IDS].sort());
  });

  it("puts no two neighbouring slots on the same ring", () => {
    const n = MAP_SLOTS.length;
    for (let i = 0; i < n; i += 1) {
      const here = MAP_SLOTS[i]!;
      const next = MAP_SLOTS[(i + 1) % n]!;
      expect(RING_KEY[here], `${here} then ${next}`).not.toBe(RING_KEY[next]);
    }
  });

  it("gives the core question exactly one right answer, each with a reason", () => {
    const right = CORE_QUESTION.options.filter((o) => o.correct);
    expect(right).toHaveLength(1);
    for (const o of CORE_QUESTION.options) expect(o.why.length).toBeGreaterThan(20);
  });
});

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

  it("names an actor the regime asks for a declaration, which is what the map claims", () => {
    const right = SECOND_ORDER.options.find((o) => o.correct)!;
    expect(RING_KEY[right.id as keyof typeof RING_KEY]).toBe("declares");
  });
});

describe("scoreEdges", () => {
  const key = ["a>b", "c>d"];

  it("separates found, missed and invented", () => {
    expect(scoreEdges(["a>b", "e>f"], key)).toEqual({
      found: ["a>b"],
      missed: ["c>d"],
      reversed: [],
      extra: ["e>f"],
    });
  });

  it("calls a backwards edge reversed rather than invented", () => {
    const score = scoreEdges(["b>a"], key);
    expect(score.reversed).toEqual(["b>a"]);
    expect(score.extra).toEqual([]);
    expect(score.missed).toContain("a>b");
  });

  it("does not call an edge reversed when the right one was drawn too", () => {
    const score = scoreEdges(["a>b", "b>a"], key);
    expect(score.found).toEqual(["a>b"]);
    expect(score.reversed).toEqual([]);
    expect(score.extra).toEqual(["b>a"]);
  });
});

describe("edge key", () => {
  const ids = new Set<string>(WORKSHOP_ACTOR_IDS);

  it("joins actors that are on the board, in one direction only", () => {
    const seen = new Set<string>();
    for (const edge of EDGE_KEY) {
      expect(ids.has(edge.from), edge.from).toBe(true);
      expect(ids.has(edge.to), edge.to).toBe(true);
      expect(edge.from).not.toBe(edge.to);
      const id = edgeId(edge.from, edge.to);
      expect(seen.has(id), `${id} twice`).toBe(false);
      expect(seen.has(edgeId(edge.to, edge.from)), `${id} both ways`).toBe(false);
      seen.add(id);
    }
  });

  it("names a subgoal that exists, and leaves none of them empty", () => {
    const subgoals = new Set(SUBGOALS.map((s) => s.id));
    for (const edge of EDGE_KEY) expect(subgoals.has(edge.subgoal)).toBe(true);
    for (const s of SUBGOALS) {
      const on = EDGE_KEY.filter((e) => e.subgoal === s.id);
      expect(on.length, `${s.label} has no mechanism on this board`).toBeGreaterThan(0);
    }
  });

  it("still has the shape EDGE_FINDING describes in prose", () => {
    const per = (id: string) => EDGE_KEY.filter((e) => e.subgoal === id).length;
    expect(per("2b")).toBe(4);
    expect([per("1a"), per("1b"), per("2a")]).toEqual([1, 1, 1]);
    expect(EDGE_KEY).toHaveLength(7);
    const nvidia = EDGE_KEY.filter((e) => e.from === "nvidia");
    expect(nvidia).toHaveLength(3);
    expect(new Set(nvidia.map((e) => e.subgoal)).size).toBe(SUBGOALS.length - 1);
  });

  it("points exactly one edge at a party, and none at the United States", () => {
    const parties = ["us", "china"];
    const atParty = EDGE_KEY.filter((e) => parties.includes(e.to));
    expect(atParty.map((e) => edgeId(e.from, e.to))).toEqual(["ic>china"]);
    expect(EDGE_KEY.some((e) => e.to === "us")).toBe(false);
  });

  it("has nobody but one signatory's institutions on the verifying ring", () => {
    const verifiers = WORKSHOP_ACTOR_IDS.filter((id) => RING_KEY[id] === "verifies");
    expect([...verifiers].sort()).toEqual([
      "bis",
      "california",
      "ic",
      "missing-verifier",
    ]);
  });

  it("accounts for every actor that has no edge at all", () => {
    const touched = new Set<string>(EDGE_KEY.flatMap((e) => [e.from, e.to]));
    const alone = WORKSHOP_ACTOR_IDS.filter((id) => !touched.has(id));
    const covered = EDGE_NOTES.flatMap((n) => n.actorIds);
    expect([...alone].sort()).toEqual([...covered].sort());
    expect(alone).toHaveLength(10);
    for (const note of EDGE_NOTES) expect(note.why.length).toBeGreaterThan(80);
  });
});

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
    expect(CLOSING_KEY.criteria.some((c) => c.needsReasoning)).toBe(true);
  });
});

const norm = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2014\u2013\u2212\u2011]/g, "-")
    .replace(/\u2026|\.\.\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function bakerQuotes(): { text: string; where: string }[] {
  const out: { text: string; where: string }[] = [];
  const seen = new Set<unknown>();
  const walk = (node: unknown) => {
    if (typeof node !== "object" || node === null || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const box = node as Record<string, unknown>;
    if (typeof box.text === "string" && typeof box.where === "string") {
      out.push({ text: box.text, where: box.where });
    }
    Object.values(box).forEach(walk);
  };
  walk([CENTRE, RINGS, SUBGOALS, EDGE_KEY, EDGE_NOTES, EDGE_FINDING]);
  return out;
}

describe("quotes from Baker et al.", () => {
  const artifact = JSON.parse(
    readFileSync(
      join(__dirname, "../../content/arxiv/2507.15916v2.json"),
      "utf8",
    ),
  ) as { paper: { html: string } };

  const body = norm(
    artifact.paper.html
      .replace(/<[^>]+>/g, " ")
      .replace(/&#x([0-9A-Fa-f]+);/g, (_m, hex: string) =>
        String.fromCodePoint(parseInt(hex, 16)),
      )
      .replace(/&amp;/g, "&"),
  );

  const quotes = bakerQuotes();

  it("finds quotes to check at all", () => {
    expect(quotes.length).toBeGreaterThanOrEqual(12);
  });

  it("matches every one against the committed artifact", () => {
    const drifted = quotes
      .filter((q) => !body.includes(norm(q.text)))
      .map((q) => `${q.where}: ${q.text.slice(0, 60)}\u2026`);
    expect(drifted, "these are not in 2507.15916v2.json").toEqual([]);
  });

  it("says where each one is", () => {
    for (const q of quotes) expect(q.where.length, q.text).toBeGreaterThan(2);
  });
});

describe("quotes from 1.2", () => {
  const DATA = readFileSync(join(__dirname, "data/actor-workshop.ts"), "utf8");
  const LESSON = readFileSync(
    join(__dirname, "../../content/lessons/verification/scoping-actors.mdx"),
    "utf8",
  );

  const fromBaker = bakerQuotes().map((q) => norm(q.text));
  const fragments = [...DATA.matchAll(/\u201c([^\u201d]{20,})\u201d/g)]
    .map((m) => m[1]!)
    .filter((f) => !fromBaker.some((b) => b.includes(norm(f))));

  it("finds fragments to check at all", () => {
    expect(fragments.length).toBeGreaterThanOrEqual(6);
  });

  it("matches every quoted fragment against the lesson body", () => {
    const body = norm(LESSON);
    const drifted = fragments.filter((f) => !body.includes(norm(f)));
    expect(drifted, "these no longer appear in scoping-actors.mdx").toEqual([]);
  });
});
