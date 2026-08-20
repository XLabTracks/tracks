import { describe, expect, it } from "vitest";
import { distillerReports } from "../data/context-distiller";
import {
  canEnterPhase,
  capFor,
  evaluateRun,
  freshRun,
  graphFaults,
  indexReport,
  producedSegs,
  sanitizeRun,
  scoreActors,
  seenAllFlips,
  shuffleSeeded,
  summarize,
  type DistillerRun,
} from "./context-distiller";

const r1 = distillerReports[0];
const index = indexReport(r1);

function runWith(clipped: string[], extra: Partial<DistillerRun> = {}): DistillerRun {
  return { ...freshRun(7), clipped, flipped: [...clipped], ...extra };
}

describe("report data", () => {
  it("carries the four reports", () => {
    expect(distillerReports.map((r) => r.id)).toEqual(["r1", "r2", "r3", "r4"]);
  });

  it.each(distillerReports.map((r) => [r.id, r] as const))(
    "%s has a playable content graph",
    (_id, report) => {
      expect(graphFaults(report)).toEqual([]);
    },
  );

  it("marks exactly the fictional report as fictional", () => {
    expect(distillerReports.filter((r) => r.fictional).map((r) => r.id)).toEqual(["r1"]);
  });

  it("gives every real report a source to check the quotes against", () => {
    for (const r of distillerReports.filter((x) => !x.fictional)) {
      expect(r.sourceUrl, r.id).toMatch(/^https:\/\//);
    }
  });

  it("names a section that exists for every block", () => {
    for (const r of distillerReports) {
      const ids = new Set(r.sections.map((s) => s.id));
      for (const b of r.blocks) expect(ids.has(b.section), `${r.id}/${b.id}`).toBe(true);
    }
  });

  it("only reproduces r1 in full, and every reproduced passage is a real block", () => {
    expect(distillerReports.filter((r) => r.reportDoc).map((r) => r.id)).toEqual(["r1"]);
    const ids = new Set(r1.blocks.map((b) => b.id));
    for (const paras of Object.values(r1.reportDoc!)) {
      for (const p of paras) {
        if (typeof p !== "string") expect(ids.has(p.b), p.b).toBe(true);
      }
    }
  });
});

describe("graphFaults", () => {
  it("catches a budget that no longer fits the core facts", () => {
    const broken = { ...r1, meta: { ...r1.meta, slack: 5 } };
    expect(graphFaults(broken).join(" ")).toContain("must equal cap");
  });

  it("catches a core block whose point answers nobody", () => {
    const orphan = { ...r1.blocks.find((b) => b.core)!, id: "b-orphan", seg: "nowhere" };
    expect(graphFaults({ ...r1, blocks: [...r1.blocks, orphan] }).join(" ")).toContain(
      "answering no question",
    );
  });

  it("catches a reader who both knows and is told the same thing", () => {
    const s = r1.stakeholders[0];
    const broken = {
      ...r1,
      stakeholders: [
        { ...s, knownBy: [...s.knownBy, s.questions[0].answers[0]] },
        ...r1.stakeholders.slice(1),
      ],
    };
    expect(graphFaults(broken).join(" ")).toContain("both knows and is answered by");
  });
});

describe("the phase gate", () => {
  it("opens Clip always and Distil only once something is clipped", () => {
    const empty = freshRun(1);
    expect(canEnterPhase(1, empty)).toBe(true);
    expect(canEnterPhase(2, empty)).toBe(false);
    expect(canEnterPhase(2, runWith(["b-frontier"]))).toBe(true);
  });

  it("holds Upstream shut until every clipping is compressed", () => {
    const half = runWith(["b-frontier", "b-sandbox"], { flipped: ["b-frontier"] });
    expect(seenAllFlips(half)).toBe(false);
    expect(canEnterPhase(3, half)).toBe(false);
    expect(canEnterPhase(3, runWith(["b-frontier", "b-sandbox"]))).toBe(true);
  });

  it("holds each actor step shut until the one before it is committed", () => {
    const distilled = runWith(["b-frontier"]);
    expect(canEnterPhase(4, distilled)).toBe(false);
    expect(canEnterPhase(4, { ...distilled, upDone: true })).toBe(true);
    expect(canEnterPhase(5, { ...distilled, upDone: true })).toBe(false);
    expect(canEnterPhase(5, { ...distilled, upDone: true, downDone: true })).toBe(true);
  });
});

describe("distilling", () => {
  it("produces a point per core clipping, in notebook order, and none for filler", () => {
    expect(producedSegs(["b-sandbox", "d-crawler", "b-frontier"], index)).toEqual([
      "sandbox",
      "baseline",
    ]);
  });

  it("gives tight mode a smaller notebook", () => {
    const run = freshRun(1);
    expect(capFor(run, r1)).toBe(r1.meta.cap);
    expect(capFor({ ...run, mode: "tight" }, r1)).toBe(r1.meta.tightCap);
  });
});

describe("delivery", () => {
  it("counts a question answered when any of its segments reached that reader", () => {
    const staff = r1.stakeholders.find((s) => s.id === "stk-staff")!;
    const q = staff.questions[0];
    const ev = evaluateRun([[q.answers[0], "stk-staff"]], r1);
    expect(ev.answered[q.id]).toBe(true);
    expect(ev.ok).toBe(1);
    expect(ev.total).toBe(r1.stakeholders.reduce((n, s) => n + s.questions.length, 0));
  });

  it("does not credit the right point sent to the wrong reader", () => {
    const staff = r1.stakeholders.find((s) => s.id === "stk-staff")!;
    const q = staff.questions[0];
    expect(evaluateRun([[q.answers[0], "stk-cto"]], r1).answered[q.id]).toBe(false);
  });

  it("reports a point a reader already had as wasted words", () => {
    const staff = r1.stakeholders.find((s) => s.id === "stk-staff")!;
    const known = staff.knownBy[0];
    const ev = evaluateRun([[known, "stk-staff"]], r1);
    expect(ev.wasted["stk-staff"]).toEqual([known]);
    expect(ev.ok).toBe(0);
  });

  it("answers everything when every question's first segment is threaded", () => {
    const threads = r1.stakeholders.flatMap((s) =>
      s.questions.map((q): [string, string] => [q.answers[0], s.id]),
    );
    const ev = evaluateRun(threads, r1);
    expect(ev.ok).toBe(ev.total);
  });

  it("counts filler clippings in the run summary", () => {
    const run = runWith(["b-frontier", "d-crawler", "d-swebench"], {
      threads: [["baseline", "stk-staff"]],
    });
    const s = summarize(run, r1, index);
    expect(s.clips).toBe(3);
    expect(s.filler).toBe(2);
    expect(s.answered).toBe(1);
  });
});

describe("the actor steps", () => {
  it("scores picks against the key", () => {
    const key = r1.upstream.key.map((o) => o.id);
    const wrong = r1.upstream.distractors[0].id;
    expect(scoreActors(r1.upstream, [key[0], wrong])).toEqual({ ok: 1, wrong: 1 });
    expect(scoreActors(r1.upstream, key)).toEqual({ ok: key.length, wrong: 0 });
  });
});

describe("saved runs survive a content revision", () => {
  it("drops clippings, threads and picks whose ids are gone", () => {
    const saved = {
      ...freshRun(3),
      clipped: ["b-frontier", "b-deleted"],
      flipped: ["b-frontier", "b-deleted"],
      threads: [
        ["baseline", "stk-staff"],
        ["gone", "stk-staff"],
        ["baseline", "stk-deleted"],
      ],
      upSel: [r1.upstream.key[0].id, "u-deleted"],
      downSel: ["stk-deleted"],
    };
    const run = sanitizeRun(saved, index, 3)!;
    expect(run.clipped).toEqual(["b-frontier"]);
    expect(run.flipped).toEqual(["b-frontier"]);
    expect(run.threads).toEqual([["baseline", "stk-staff"]]);
    expect(run.upSel).toEqual([r1.upstream.key[0].id]);
    expect(run.downSel).toEqual([]);
  });

  it("drops a thread whose clipping was removed", () => {
    const saved = { ...freshRun(3), threads: [["baseline", "stk-staff"]] };
    expect(sanitizeRun(saved, index, 3)!.threads).toEqual([]);
  });

  it("refuses a payload that is not a v2 run", () => {
    expect(sanitizeRun(null, index, 1)).toBeNull();
    expect(sanitizeRun({ v: 1, clipped: [] }, index, 1)).toBeNull();
    expect(sanitizeRun({ v: 2 }, index, 1)).toBeNull();
  });

  it("clamps a phase outside the five", () => {
    expect(sanitizeRun({ ...freshRun(1), phase: 9 }, index, 1)!.phase).toBe(5);
    expect(sanitizeRun({ ...freshRun(1), phase: 0 }, index, 1)!.phase).toBe(1);
  });

  it("keeps the run's own shuffle seed so the pool holds its order", () => {
    expect(sanitizeRun({ ...freshRun(4242) }, index, 9)!.shuffleSeed).toBe(4242);
  });
});

describe("shuffleSeeded", () => {
  it("is a permutation, and the same one for the same seed", () => {
    const list = r1.blocks.map((b) => b.id);
    const a = shuffleSeeded(list, 12345);
    expect(shuffleSeeded(list, 12345)).toEqual(a);
    expect([...a].sort()).toEqual([...list].sort());
  });

  it("differs across seeds", () => {
    const list = r1.blocks.map((b) => b.id);
    expect(shuffleSeeded(list, 1)).not.toEqual(shuffleSeeded(list, 2));
  });
});
