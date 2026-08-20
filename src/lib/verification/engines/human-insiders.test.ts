import { describe, expect, it } from "vitest";
import {
  CONNECTION_KINDS,
  CONNECTION_CARDS,
  CREDIBILITY_QUESTIONS,
  SOURCE_ACTORS,
} from "@/lib/verification/data/human-insiders";
import {
  checkConnection,
  checkCredibilityAnswer,
} from "@/lib/verification/engines/human-insiders";

describe("human insiders source map", () => {
  it("keeps every actor's answer and choices wired to real cards", () => {
    for (const actor of SOURCE_ACTORS) {
      for (const kind of CONNECTION_KINDS) {
        const ids = new Set(CONNECTION_CARDS[kind].map((card) => card.id));
        expect(ids.has(actor.correct[kind]), `${actor.id} ${kind} answer`).toBe(
          true
        );
        expect(actor.choices[kind]).toContain(actor.correct[kind]);
        expect(actor.choices[kind].every((id) => ids.has(id))).toBe(true);
      }
    }
  });

  it("accepts a bounded source chain without producing a score", () => {
    const actor = SOURCE_ACTORS[0];
    const result = checkConnection(actor.id, actor.correct);
    expect(result.complete).toBe(true);
    expect(result.correct).toEqual({
      observation: true,
      boundary: true,
      corroboration: true,
    });
    expect(result).not.toHaveProperty("score");
  });

  it("names the particular overclaim instead of rejecting the person", () => {
    const result = checkConnection("supplier-contractor", {
      observation: "decision-record",
      boundary: "contractor-no-purpose",
      corroboration: "facility-records",
    });
    expect(result.complete).toBe(false);
    expect(result.correct.observation).toBe(false);
    expect(result.correct.boundary).toBe(true);
    expect(result.messages.observation).toMatch(
      /equipment and infrastructure/i
    );
  });
});

describe("four-question credibility examination", () => {
  it("has one answer for access, incentives, consistency, and corroboration", () => {
    expect(CREDIBILITY_QUESTIONS.map((question) => question.id)).toEqual([
      "access",
      "incentives",
      "consistency",
      "corroboration",
    ]);
    for (const question of CREDIBILITY_QUESTIONS) {
      expect(checkCredibilityAnswer(question.id, question.answerId)).toBe(true);
      expect(
        question.choices.filter((choice) =>
          checkCredibilityAnswer(question.id, choice.id)
        )
      ).toHaveLength(1);
    }
  });
});
