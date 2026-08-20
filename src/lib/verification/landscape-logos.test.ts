import { describe, expect, it } from "vitest";

import {
  CELL_ORGS,
  ORG_MARKS,
  marksForCell,
} from "@/lib/verification/data/landscape-logos";
import {
  LANDSCAPE_CELLS,
  LANDSCAPE_COLS,
  LANDSCAPE_ROWS,
} from "@/lib/verification/data/verification-landscape";

describe("landscape org marks", () => {
  it("every org id is unique", () => {
    const ids = ORG_MARKS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every CELL_ORGS id resolves to a registered mark", () => {
    const known = new Set(ORG_MARKS.map((m) => m.id));
    for (const [row, cols] of Object.entries(CELL_ORGS)) {
      for (const [col, ids] of Object.entries(cols)) {
        for (const id of ids) {
          expect(known.has(id), `${row}.${col} names unknown org "${id}"`).toBe(true);
        }
      }
    }
  });

  it("every CELL_ORGS row and column exists in the grid", () => {
    const rows = new Set(LANDSCAPE_ROWS.map((r) => r.key));
    const cols = new Set(LANDSCAPE_COLS.map((c) => c.key));
    for (const [row, byCol] of Object.entries(CELL_ORGS)) {
      expect(rows.has(row), `unknown row "${row}"`).toBe(true);
      for (const col of Object.keys(byCol)) {
        expect(cols.has(col), `unknown column "${row}.${col}"`).toBe(true);
      }
    }
  });

  it("keeps the cryptography × government square empty", () => {
    expect(LANDSCAPE_CELLS.crypto.gov.gap).toBe(true);
    expect(CELL_ORGS.crypto?.gov).toBeUndefined();
    expect(marksForCell("crypto", "gov", LANDSCAPE_CELLS.crypto.gov.eff)).toEqual([]);
  });

  it("unions the authored text's orgs with the cell's own, without duplicates", () => {
    const marks = marksForCell("monitor", "think", LANDSCAPE_CELLS.monitor.think.eff);
    const ids = marks.map((m) => m.id);
    expect(ids).toContain("fas");
    expect(ids).toContain("epoch");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("leaves cells with no additions exactly as the text matcher found them", () => {
    const marks = marksForCell("hw", "think", LANDSCAPE_CELLS.hw.think.eff);
    expect(marks.map((m) => m.id)).toEqual(["rand", "cnas", "flexheg"]);
  });

  it("keeps tokens long enough to be distinctive", () => {
    for (const m of ORG_MARKS) {
      for (const tok of m.tokens) {
        expect(tok.length, `${m.id} token "${tok}" is too short`).toBeGreaterThan(3);
      }
    }
  });
});
