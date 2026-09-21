import { describe, expect, it } from "vitest";
import { ARCHITECTURE_SORT } from "@/lib/verification/data/architecture-sort";
import type {
  SortBoardDef,
  SortPlacements,
} from "@/lib/verification/data/sort-board";
import {
  allPlaced,
  gradeBoard,
  isSolved,
  itemsIn,
  noteFor,
  prunePlacements,
  scoreBoard,
  scoreText,
  unplaced,
  verdictFor,
} from "./sort-board";

const board: SortBoardDef = {
  id: "t",
  storageKey: "v-t:v1",
  lead: "lead",
  trayLabel: "tray",
  reveal: "reveal",
  zones: [
    { id: "a", name: "A", blurb: "", color: "" },
    { id: "b", name: "B", blurb: "", color: "" },
    { id: "c", name: "C", blurb: "", color: "" },
  ],
  items: [
    {
      id: "one",
      label: "One",
      detail: "",
      zone: "a",
      ok: "ok-one",
      generic: "g1",
    },
    {
      id: "two",
      label: "Two",
      detail: "",
      zone: "b",
      ok: "ok-two",
      near: { c: "near-c" },
      wrong: { a: "wrong-a" },
      generic: "g2",
    },
  ],
};

const key = (): SortPlacements => ({ one: "a", two: "b" });

describe("verdictFor", () => {
  it("marks the authored zone right", () => {
    expect(verdictFor(board.items[0], "a")).toBe("right");
  });
  it("marks an authored near zone defensible", () => {
    expect(verdictFor(board.items[1], "c")).toBe("defensible");
  });
  it("marks anything else a miss", () => {
    expect(verdictFor(board.items[1], "a")).toBe("miss");
    expect(verdictFor(board.items[0], "b")).toBe("miss");
  });
});

describe("noteFor", () => {
  it("returns the authored note for each verdict", () => {
    expect(noteFor(board.items[1], "b")).toEqual({
      verdict: "right",
      msg: "ok-two",
    });
    expect(noteFor(board.items[1], "c")).toEqual({
      verdict: "defensible",
      msg: "near-c",
    });
    expect(noteFor(board.items[1], "a")).toEqual({
      verdict: "miss",
      msg: "wrong-a",
    });
  });
  it("falls back to the generic correction", () => {
    expect(noteFor(board.items[0], "b")).toEqual({
      verdict: "miss",
      msg: "g1",
    });
  });
});

describe("grading a board", () => {
  it("grades only the cards that were placed", () => {
    const graded = gradeBoard(board, { one: "a" });
    expect(Object.keys(graded)).toEqual(["one"]);
    expect(scoreBoard(board, graded)).toEqual({
      placed: 1,
      total: 2,
      right: 1,
      defensible: 0,
      miss: 0,
    });
  });
  it("counts each verdict", () => {
    const graded = gradeBoard(board, { one: "b", two: "c" });
    expect(scoreBoard(board, graded)).toEqual({
      placed: 2,
      total: 2,
      right: 0,
      defensible: 1,
      miss: 1,
    });
  });
  it("reports readiness and the solved board", () => {
    expect(allPlaced(board, { one: "a" })).toBe(false);
    expect(allPlaced(board, key())).toBe(true);
    expect(isSolved(board, key())).toBe(true);
    expect(isSolved(board, { one: "a", two: "c" })).toBe(false);
  });
  it("does not call a defensible placement solved", () => {
    expect(isSolved(board, { one: "a", two: "c" })).toBe(false);
  });
});

describe("scoreText", () => {
  it("names only the tiers that occurred", () => {
    expect(
      scoreText({ placed: 2, total: 2, right: 2, defensible: 0, miss: 0 })
    ).toBe("2 of 2 filed where the sources file them");
    expect(
      scoreText({ placed: 2, total: 2, right: 0, defensible: 1, miss: 1 })
    ).toBe(
      "0 of 2 filed where the sources file them · 1 defensible elsewhere · 1 to reconsider",
    );
  });
});

describe("restored placements", () => {
  it("drops unknown items and zones", () => {
    expect(
      prunePlacements({ one: "a", ghost: "a", two: "zzz", three: 7 }, board)
    ).toEqual({ one: "a" });
  });
  it("survives junk", () => {
    expect(prunePlacements(null, board)).toEqual({});
    expect(prunePlacements([1, 2], board)).toEqual({});
    expect(prunePlacements("nope", board)).toEqual({});
  });
});

describe("board queries", () => {
  it("splits placed from unplaced", () => {
    expect(itemsIn(board, { one: "a" }, "a").map((i) => i.id)).toEqual(["one"]);
    expect(unplaced(board, { one: "a" }).map((i) => i.id)).toEqual(["two"]);
  });
});

describe("the architecture board", () => {
  const ids = ARCHITECTURE_SORT.items.map((item) => item.id);
  const zoneIds = new Set(ARCHITECTURE_SORT.zones.map((zone) => zone.id));

  it("has unique card and column ids", () => {
    expect(new Set(ids).size).toBe(ids.length);
    expect(zoneIds.size).toBe(ARCHITECTURE_SORT.zones.length);
  });

  it("keys every card to a column that exists", () => {
    for (const item of ARCHITECTURE_SORT.items) {
      expect(zoneIds.has(item.zone), `${item.id} -> ${item.zone}`).toBe(true);
    }
  });

  it("points every defensible and corrective note at a real column", () => {
    for (const item of ARCHITECTURE_SORT.items) {
      for (const zoneId of Object.keys(item.near ?? {})) {
        expect(zoneIds.has(zoneId), `${item.id} near ${zoneId}`).toBe(true);
        expect(zoneId).not.toBe(item.zone);
      }
      for (const zoneId of Object.keys(item.wrong ?? {})) {
        expect(zoneIds.has(zoneId), `${item.id} wrong ${zoneId}`).toBe(true);
        expect(zoneId).not.toBe(item.zone);
        expect(item.near?.[zoneId]).toBeUndefined();
      }
    }
  });

  it("uses every column, so no column is a dead option", () => {
    for (const zone of ARCHITECTURE_SORT.zones) {
      expect(
        ARCHITECTURE_SORT.items.some((item) => item.zone === zone.id),
        `${zone.id} is never the answer`
      ).toBe(true);
    }
  });

  it("does not let one column hold most of the key", () => {
    const counts = ARCHITECTURE_SORT.zones.map(
      (zone) =>
        ARCHITECTURE_SORT.items.filter((item) => item.zone === zone.id).length,
    );
    expect(Math.max(...counts)).toBeLessThanOrEqual(
      Math.ceil(ARCHITECTURE_SORT.items.length / 2),
    );
  });

  it("gives every card a correction to fall back on", () => {
    for (const item of ARCHITECTURE_SORT.items) {
      expect(item.ok.length, `${item.id} ok`).toBeGreaterThan(40);
      expect(item.generic.length, `${item.id} generic`).toBeGreaterThan(20);
      expect(item.detail.length, `${item.id} detail`).toBeGreaterThan(20);
    }
  });

  it("grades its own key as solved", () => {
    const placements: SortPlacements = {};
    for (const item of ARCHITECTURE_SORT.items) placements[item.id] = item.zone;
    expect(isSolved(ARCHITECTURE_SORT, placements)).toBe(true);
    const score = scoreBoard(
      ARCHITECTURE_SORT,
      gradeBoard(ARCHITECTURE_SORT, placements),
    );
    expect(score.right).toBe(ARCHITECTURE_SORT.items.length);
  });
});
