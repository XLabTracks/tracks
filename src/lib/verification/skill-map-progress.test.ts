import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const PLATFORM = path.join(process.cwd(), "public/verification/platform.js");

type ProgressApi = {
  isDone: (unit: string) => boolean;
  doneUnits: () => string[];
  setServerUnits: (units: string[]) => void;
  completeUnit: (unit: string) => unknown;
  rungFill: (unit: string) => number;
  skillProgress: (node: { rungs: [string, string][] }) => {
    done: number;
    total: number;
    frac: number;
    state: string;
  };
};

function loadPlatform(stored: Record<string, string> = {}) {
  const store = new Map(Object.entries(stored));
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  };
  const sandbox: Record<string, unknown> = {
    localStorage,
    document: { querySelector: () => null, createElement: () => null },
    setTimeout,
    Event: class {
      constructor(public type: string) {}
    },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(PLATFORM, "utf8"), sandbox);
  return { vt: sandbox.VT as ProgressApi, store, sandbox };
}

const NODE = { rungs: [["0.1", "a"], ["0.2", "b"]] as [string, string][] };

describe("the skill map's progress source", () => {
  it("counts a unit the server reports as complete", () => {
    const { vt } = loadPlatform();
    expect(vt.isDone("0.1")).toBe(false);

    vt.setServerUnits(["0.1"]);

    expect(vt.isDone("0.1")).toBe(true);
    expect(vt.rungFill("0.1")).toBe(1);
    expect(vt.skillProgress(NODE)).toMatchObject({
      done: 1,
      total: 2,
      state: "in progress",
    });
  });

  it("fills a node from server units alone, with no device store at all", () => {
    const { vt } = loadPlatform();
    vt.setServerUnits(["0.1", "0.2"]);
    expect(vt.skillProgress(NODE)).toMatchObject({ frac: 1, state: "complete" });
  });

  it("never writes the server's units to the device", () => {
    const { vt, store } = loadPlatform();
    vt.setServerUnits(["0.1", "0.2"]);
    expect(store.get("vt-progress")).toBeUndefined();
  });

  it("unions the server's units with the device store", () => {
    const { vt } = loadPlatform({
      "vt-progress": JSON.stringify({ units: { "0.3": 1 } }),
    });
    vt.setServerUnits(["0.1"]);
    expect(vt.doneUnits().sort()).toEqual(["0.1", "0.3"]);
  });

  it("replaces the previous server set rather than accumulating", () => {
    const { vt } = loadPlatform();
    vt.setServerUnits(["0.1"]);
    vt.setServerUnits(["0.2"]);
    expect(vt.isDone("0.1")).toBe(false);
    expect(vt.isDone("0.2")).toBe(true);
  });

  it("reads a seed set before the script ran", () => {
    const store = new Map<string, string>();
    const sandbox: Record<string, unknown> = {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => void store.set(key, value),
        removeItem: (key: string) => void store.delete(key),
      },
      document: { querySelector: () => null, createElement: () => null },
      setTimeout,
      Event: class {
        constructor(public type: string) {}
      },
      VT_SERVER_UNITS: ["0.4"],
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(readFileSync(PLATFORM, "utf8"), sandbox);
    expect((sandbox.VT as ProgressApi).isDone("0.4")).toBe(true);
  });

  it("leaves the device store the only thing that persists", () => {
    const { vt, store } = loadPlatform();
    vt.setServerUnits(["0.1"]);
    vt.completeUnit("0.2");
    const saved = JSON.parse(store.get("vt-progress")!);
    expect(Object.keys(saved.units)).toEqual(["0.2"]);
  });
});
