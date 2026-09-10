import { describe, expect, it } from "vitest";

import { ROUNDS, CLOSING_FIELDS } from "../data/monitor-evader";
import {
  allCommitted,
  committedCount,
  firstOpenRound,
  isCommitted,
  matchedCount,
  pickedOption,
  prunePicks,
} from "./monitor-evader";

describe("the round data", () => {
  it("runs five rounds, each with exactly one countermeasure the team took", () => {
    expect(ROUNDS).toHaveLength(5);
    for (const round of ROUNDS) {
      expect(round.options.filter((o) => o.right)).toHaveLength(1);
      expect(round.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("ends on the unsolved white-box range", () => {
    expect(ROUNDS[4].hardened).toContain("43 to 87%");
    expect(ROUNDS[4].hardened).toContain("42.6%");
  });

  it("closes on the four bounded-claim fields", () => {
    expect(CLOSING_FIELDS.map((f) => f.id)).toEqual([
      "observation",
      "inference",
      "leap",
      "deps",
    ]);
  });
});

describe("progress through the rounds", () => {
  const first = ROUNDS[0];
  const right = first.options.find((o) => o.right)!;
  const wrong = first.options.find((o) => !o.right)!;

  it("opens on the first round and advances as rounds are committed", () => {
    expect(firstOpenRound({})).toBe(0);
    expect(firstOpenRound({ [first.id]: wrong.id })).toBe(1);
  });

  it("holds on the last round once every round is committed", () => {
    const picks = Object.fromEntries(
      ROUNDS.map((r) => [r.id, r.options[0].id]),
    );
    expect(firstOpenRound(picks)).toBe(ROUNDS.length - 1);
    expect(allCommitted(picks)).toBe(true);
  });

  it("counts commitments and matches separately", () => {
    const picks = { [first.id]: wrong.id, [ROUNDS[1].id]: ROUNDS[1].options.find((o) => o.right)!.id };
    expect(committedCount(picks)).toBe(2);
    expect(matchedCount(picks)).toBe(1);
    expect(isCommitted(picks, first.id)).toBe(true);
    expect(isCommitted(picks, ROUNDS[2].id)).toBe(false);
  });

  it("reads back the option a learner picked", () => {
    expect(pickedOption(first, { [first.id]: right.id })).toBe(right);
    expect(pickedOption(first, {})).toBeUndefined();
  });

  it("drops stored picks that no longer name an option", () => {
    expect(prunePicks({ [first.id]: "gone", [ROUNDS[1].id]: ROUNDS[1].options[0].id })).toEqual({
      [ROUNDS[1].id]: ROUNDS[1].options[0].id,
    });
  });
});
