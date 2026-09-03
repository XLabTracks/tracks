import { describe, expect, it } from "vitest";

import {
  ACCOUNT_MARKER_KEY,
  isLearnerWorkKey,
  purgeLearnerWork,
  reconcileAccountMarker,
  type KeyStorage,
} from "./device-storage";

class FakeStorage implements KeyStorage {
  private map = new Map<string, string>();
  constructor(entries: Record<string, string> = {}) {
    for (const [k, v] of Object.entries(entries)) this.map.set(k, v);
  }
  get length() {
    return this.map.size;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  keys() {
    return [...this.map.keys()].sort();
  }
}

const WORK = {
  "v-standard-of-proof:v1": "{}",
  "v-drills:intel:v1": "{}",
  "vt-workspace:1.1": "{}",
  "vt-ex:mechanism-sort": "{}",
  "vt-marks.v1": "{}",
  "vt-widget-stamps.v1": "{}",
  "vt-progress": "{}",
  "xlab-verification-memo-desk.v1": '{"m":{"body":"a very long draft"}}',
  "xlab-verification-notebook.v1": "{}",
  "distiller-v2-current": '"r1"',
  "bench:s1": "{}",
  "xlab-sec-gate": "open",
};

const PREFS = {
  "tracks-theme": "dark",
  "xlab-verification-theme": "night",
  "xlab-verification-text-scale": "large",
  "vt-reading-mode": "whole",
  "vt-focus-reading": "1",
  "tracks:sidebar-width": "320",
  "tracks:sidenotes": "on",
};

describe("device storage", () => {
  it("tells learner work from preferences", () => {
    for (const key of Object.keys(WORK)) expect(isLearnerWorkKey(key), key).toBe(true);
    for (const key of Object.keys(PREFS)) expect(isLearnerWorkKey(key), key).toBe(false);
    expect(isLearnerWorkKey(ACCOUNT_MARKER_KEY)).toBe(false);
  });

  it("purges every piece of learner work and keeps every preference", () => {
    const storage = new FakeStorage({ ...WORK, ...PREFS });
    const removed = purgeLearnerWork(storage);
    expect(removed.sort()).toEqual(Object.keys(WORK).sort());
    expect(storage.keys()).toEqual(Object.keys(PREFS).sort());
  });

  it("purges when the account signs out", () => {
    const storage = new FakeStorage({ ...WORK, [ACCOUNT_MARKER_KEY]: "user_a" });
    expect(reconcileAccountMarker(null, storage)).toEqual({ purged: true });
    expect(storage.getItem("xlab-verification-memo-desk.v1")).toBeNull();
    expect(storage.getItem(ACCOUNT_MARKER_KEY)).toBeNull();
  });

  it("purges when a different account signs in", () => {
    const storage = new FakeStorage({ ...WORK, [ACCOUNT_MARKER_KEY]: "user_a" });
    expect(reconcileAccountMarker("user_b", storage)).toEqual({ purged: true });
    expect(storage.getItem("v-standard-of-proof:v1")).toBeNull();
    expect(storage.getItem(ACCOUNT_MARKER_KEY)).toBe("user_b");
  });

  it("keeps signed-out work for the account that then signs in", () => {
    const storage = new FakeStorage({ ...WORK });
    expect(reconcileAccountMarker("user_b", storage)).toEqual({ purged: false });
    expect(storage.getItem("v-standard-of-proof:v1")).toBe("{}");
    expect(storage.getItem(ACCOUNT_MARKER_KEY)).toBe("user_b");
  });

  it("does nothing for the same account, or for a visitor who was never signed in", () => {
    const same = new FakeStorage({ ...WORK, [ACCOUNT_MARKER_KEY]: "user_a" });
    expect(reconcileAccountMarker("user_a", same)).toEqual({ purged: false });
    expect(same.getItem("vt-progress")).toBe("{}");
    const visitor = new FakeStorage({ ...WORK });
    expect(reconcileAccountMarker(null, visitor)).toEqual({ purged: false });
    expect(visitor.getItem("vt-progress")).toBe("{}");
  });
});
