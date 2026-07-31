import { describe, expect, it } from "vitest";
import { Rating, State } from "ts-fsrs";
import {
  REVIEW_GRADES,
  gradeForTapRevealRating,
  isGrade,
  scheduleReview,
} from "./fsrs";

const NOW = new Date("2026-07-23T12:00:00Z");

describe("scheduleReview", () => {
  it("enrolls a new card as its first review", () => {
    const state = scheduleReview(null, Rating.Good, NOW);
    expect(state.reps).toBe(1);
    expect(state.lapses).toBe(0);
    expect(state.due.getTime()).toBeGreaterThan(NOW.getTime());
    expect(state.lastReview?.getTime()).toBe(NOW.getTime());
  });

  it("schedules failed cards sooner than passed cards", () => {
    const failed = scheduleReview(null, Rating.Again, NOW);
    const passed = scheduleReview(null, Rating.Easy, NOW);
    expect(failed.due.getTime()).toBeLessThan(passed.due.getTime());
  });

  it("grows the interval across successive Good reviews", () => {
    let state = scheduleReview(null, Rating.Good, NOW);
    const firstInterval = state.due.getTime() - NOW.getTime();
    const secondReview = state.due;
    state = scheduleReview(state, Rating.Good, secondReview);
    expect(state.reps).toBe(2);
    expect(state.due.getTime() - secondReview.getTime()).toBeGreaterThan(
      firstInterval,
    );
  });

  it("counts a lapse when a graduated card fails", () => {
    let state = scheduleReview(null, Rating.Easy, NOW);
    expect(state.state).toBe(State.Review);
    state = scheduleReview(state, Rating.Again, state.due);
    expect(state.lapses).toBe(1);
  });
});

describe("gradeForTapRevealRating", () => {
  it("maps the in-lesson self-assessments onto FSRS grades", () => {
    expect(gradeForTapRevealRating("yes")).toBe(Rating.Good);
    expect(gradeForTapRevealRating("partial")).toBe(Rating.Hard);
    expect(gradeForTapRevealRating("no")).toBe(Rating.Again);
  });
});

describe("isGrade", () => {
  it("accepts exactly the four review grades", () => {
    for (const { grade } of REVIEW_GRADES) expect(isGrade(grade)).toBe(true);
    expect(isGrade(Rating.Manual)).toBe(false);
    expect(isGrade(5)).toBe(false);
    expect(isGrade(2.5)).toBe(false);
    expect(isGrade("3")).toBe(false);
    expect(isGrade(null)).toBe(false);
    expect(isGrade(Number.NaN)).toBe(false);
  });
});
