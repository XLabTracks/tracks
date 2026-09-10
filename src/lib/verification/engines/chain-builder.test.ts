import { describe, expect, it } from "vitest";

import { CHAIN, QUESTIONS } from "../data/chain-builder";
import {
  breakScore,
  expectedOrder,
  isRightNext,
  nextExpected,
  orderComplete,
  pruneChain,
  questionRight,
  remaining,
  vendorRootedIds,
} from "./chain-builder";

describe("the authorization chain", () => {
  it("runs from the legal rule to renewal", () => {
    expect(expectedOrder()[0]).toBe("rule");
    expect(expectedOrder().at(-1)).toBe("renewal");
    expect(CHAIN).toHaveLength(9);
  });

  it("accepts only the next link in order", () => {
    expect(nextExpected([])).toBe("rule");
    expect(isRightNext([], "rule")).toBe(true);
    expect(isRightNext([], "meter")).toBe(false);
    expect(nextExpected(expectedOrder())).toBeNull();
    expect(orderComplete(expectedOrder())).toBe(true);
  });

  it("offers only the links not yet placed", () => {
    const left = remaining(["rule", "criteria"]);
    expect(left.map((l) => l.id)).not.toContain("rule");
    expect(left).toHaveLength(CHAIN.length - 2);
  });
});

describe("the six reveals", () => {
  it("grades a single-link answer", () => {
    expect(questionRight("measures", ["meter"])).toBe(true);
    expect(questionRight("measures", ["device"])).toBe(false);
    expect(questionRight("measures", ["meter", "device"])).toBe(false);
  });

  it("treats the unregistered-accelerator question as answerable only by none", () => {
    const question = QUESTIONS.find((q) => q.id === "unregistered");
    expect(question?.answer).toEqual([]);
    expect(questionRight("unregistered", [])).toBe(true);
    expect(questionRight("unregistered", ["device"])).toBe(false);
  });
});

describe("breaking the chain at the vendor root", () => {
  it("names the four links that inherit the vendor key", () => {
    expect(vendorRootedIds()).toEqual([
      "device",
      "operation",
      "meter",
      "suspension",
    ]);
  });

  it("scores a mark against them", () => {
    expect(breakScore(vendorRootedIds())).toEqual({
      caught: 4,
      missed: 0,
      falseFlagged: 0,
    });
    expect(breakScore(["rule"])).toEqual({
      caught: 0,
      missed: 4,
      falseFlagged: 1,
    });
  });
});

describe("restoring saved work", () => {
  it("drops unknown ids, duplicates and junk", () => {
    const state = pruneChain({
      order: ["rule", "rule", "nope", "criteria"],
      answers: { measures: ["meter", "ghost"], other: ["meter"] },
      broken: ["device", 7],
    });
    expect(state.order).toEqual(["rule", "criteria"]);
    expect(state.answers).toEqual({ measures: ["meter"] });
    expect(state.broken).toEqual(["device"]);
  });

  it("survives nonsense", () => {
    expect(pruneChain(null)).toEqual({ order: [], answers: {}, broken: [] });
  });
});
