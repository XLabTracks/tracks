import { describe, expect, it } from "vitest";
import {
  isNoteTarget,
  isNoteTargetKind,
  isNoteVisibility,
  normalizeNoteBody,
  NOTE_BODY_MAX,
} from "./submission-notes";

describe("isNoteTargetKind / isNoteVisibility", () => {
  it("accepts only the registers and visibilities the column stores", () => {
    expect(isNoteTargetKind("exercise")).toBe(true);
    expect(isNoteTargetKind("assessment")).toBe(true);
    expect(isNoteTargetKind("memo")).toBe(true);
    expect(isNoteTargetKind("lesson")).toBe(false);
    expect(isNoteTargetKind(null)).toBe(false);

    expect(isNoteVisibility("private_note")).toBe(true);
    expect(isNoteVisibility("shared")).toBe(true);
    expect(isNoteVisibility("private")).toBe(false);
    expect(isNoteVisibility(undefined)).toBe(false);
  });
});

describe("isNoteTarget", () => {
  it("takes a writing exercise the graph issues", () => {
    expect(isNoteTarget("exercise", "v-task-intuitions-5")).toBe(true);
  });

  it("refuses an exercise that is not writing, and an unknown id", () => {
    expect(isNoteTarget("exercise", "no-such-exercise")).toBe(false);
    expect(isNoteTarget("assessment", "no-such-assessment")).toBe(false);
  });

  it("bounds a memo slot's shape without enumerating the outline", () => {
    expect(isNoteTarget("memo", "m1-stakeholder-map")).toBe(true);
    expect(isNoteTarget("memo", "m9-retired-slot")).toBe(true);
    expect(isNoteTarget("memo", "")).toBe(false);
    expect(isNoteTarget("memo", "-leading-dash")).toBe(false);
    expect(isNoteTarget("memo", "has space")).toBe(false);
    expect(isNoteTarget("memo", "a".repeat(65))).toBe(false);
  });
});

describe("normalizeNoteBody", () => {
  it("trims and keeps a real note", () => {
    expect(normalizeNoteBody("  the evidence step is thin  ")).toBe(
      "the evidence step is thin",
    );
  });

  it("refuses empty, blank, oversized and non-string bodies", () => {
    expect(normalizeNoteBody("")).toBeNull();
    expect(normalizeNoteBody("   \n ")).toBeNull();
    expect(normalizeNoteBody("x".repeat(NOTE_BODY_MAX + 1))).toBeNull();
    expect(normalizeNoteBody(null)).toBeNull();
    expect(normalizeNoteBody(42)).toBeNull();
  });

  it("keeps a body exactly at the cap", () => {
    expect(normalizeNoteBody("x".repeat(NOTE_BODY_MAX))).toHaveLength(
      NOTE_BODY_MAX,
    );
  });

  it("refuses what a text column will not take", () => {
    expect(normalizeNoteBody("a\u0000b")).toBeNull();
    expect(normalizeNoteBody("a\ud800b")).toBeNull();
  });
});
