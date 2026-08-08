import { describe, expect, it } from "vitest";
import {
  answersOwed,
  choiceNumbers,
  isWorkspaceComplete,
  type WorkspaceQuestion,
  type WorkspaceRule,
} from "./question-workspace";
import {
  COMPUTE_QUESTIONS,
  COMPUTE_RULE,
} from "./data/compute-verification";
import {
  WORKSPACE_QUESTIONS,
  WORKSPACE_RULE,
} from "./data/treaty-workspace";

function q(
  id: string,
  requirement: WorkspaceQuestion["requirement"],
  n = 1,
): WorkspaceQuestion {
  return { id, n, title: id, requirement, body: [] };
}

const CHOICE: WorkspaceRule = { kind: "required-plus-one-choice" };

describe("the required-plus-one-choice rule", () => {
  it("wants every required answer", () => {
    const deck = [q("a", "required"), q("b", "required")];
    expect(isWorkspaceComplete(CHOICE, deck, new Set(["a"]))).toBe(false);
    expect(isWorkspaceComplete(CHOICE, deck, new Set(["a", "b"]))).toBe(true);
  });

  it("wants one of the choose-one group, and one is enough", () => {
    const deck = [q("a", "required"), q("x", "choose-one"), q("y", "choose-one")];
    expect(isWorkspaceComplete(CHOICE, deck, new Set(["a"]))).toBe(false);
    expect(isWorkspaceComplete(CHOICE, deck, new Set(["a", "y"]))).toBe(true);
  });

  it("never counts an optional question", () => {
    const deck = [q("a", "required"), q("opt", "optional")];
    expect(isWorkspaceComplete(CHOICE, deck, new Set(["opt"]))).toBe(false);
    expect(isWorkspaceComplete(CHOICE, deck, new Set(["a"]))).toBe(true);
    expect(answersOwed(CHOICE, deck)).toBe(1);
  });

  it("is not finished by a deck with nothing to answer", () => {
    expect(isWorkspaceComplete(CHOICE, [], new Set())).toBe(false);
    expect(
      isWorkspaceComplete(CHOICE, [q("opt", "optional")], new Set(["opt"])),
    ).toBe(false);
  });

  it("counts the choice as exactly one answer owed", () => {
    const deck = [
      q("a", "required"),
      q("b", "required"),
      q("x", "choose-one"),
      q("y", "choose-one"),
      q("z", "choose-one"),
    ];
    expect(answersOwed(CHOICE, deck)).toBe(3);
  });
});

describe("the any-N rule", () => {
  const deck = [
    q("a", "required"),
    q("b", "required"),
    q("c", "required"),
    q("d", "required"),
  ];
  const any3: WorkspaceRule = { kind: "any", count: 3 };

  it("takes any N, whichever they are", () => {
    expect(isWorkspaceComplete(any3, deck, new Set(["a", "b"]))).toBe(false);
    expect(isWorkspaceComplete(any3, deck, new Set(["b", "c", "d"]))).toBe(true);
    expect(answersOwed(any3, deck)).toBe(3);
  });

  it("still refuses to count an optional question toward N", () => {
    const withOpt = [...deck, q("opt", "optional", 5)];
    expect(
      isWorkspaceComplete(any3, withOpt, new Set(["a", "b", "opt"])),
    ).toBe(false);
  });
});

describe("the decks the course ships", () => {
  it("module 3 owes six: five required and one choice, with 8 optional", () => {
    expect(answersOwed(COMPUTE_RULE, COMPUTE_QUESTIONS)).toBe(6);
    const by = (r: WorkspaceQuestion["requirement"]) =>
      COMPUTE_QUESTIONS.filter((x) => x.requirement === r).map((x) => x.n);
    expect(by("required")).toEqual([1, 2, 5, 9, 10]);
    expect(by("choose-one")).toEqual([3, 4, 6, 7]);
    expect(by("optional")).toEqual([8]);
    expect(choiceNumbers(COMPUTE_QUESTIONS)).toEqual([3, 4, 6, 7]);
  });

  it("module 3 is finished by the five plus any one of the four", () => {
    const five = new Set(["principal-problem", "reconstruct-approach", "verification-process", "new-case", "expert-conclusion"]);
    expect(isWorkspaceComplete(COMPUTE_RULE, COMPUTE_QUESTIONS, five)).toBe(false);
    for (const pick of ["covert-adversary", "trusted-silicon", "strongest-arguments", "vulnerable-positions"]) {
      expect(
        isWorkspaceComplete(COMPUTE_RULE, COMPUTE_QUESTIONS, new Set([...five, pick])),
      ).toBe(true);
    }
  });

  it("1.1 takes any three of its four", () => {
    expect(answersOwed(WORKSPACE_RULE, WORKSPACE_QUESTIONS)).toBe(3);
    expect(WORKSPACE_QUESTIONS).toHaveLength(4);
  });

  it("gives every question a unique id and its own number", () => {
    for (const deck of [COMPUTE_QUESTIONS, WORKSPACE_QUESTIONS]) {
      expect(new Set(deck.map((x) => x.id)).size).toBe(deck.length);
      expect(new Set(deck.map((x) => x.n)).size).toBe(deck.length);
    }
  });
});
