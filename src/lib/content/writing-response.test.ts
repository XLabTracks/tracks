import { describe, expect, it } from "vitest";
import { getExerciseById } from "./index";
import { isWritingExercise } from "./types";
import { writingResponseText, writingSections } from "./writing-response";

const FREE_FORM = "v-task-intuitions-5";

describe("writingSections", () => {
  it("gives a free-form exercise its one synthetic section", () => {
    const exercise = getExerciseById(FREE_FORM);
    expect(exercise && isWritingExercise(exercise)).toBe(true);
    expect(writingSections(FREE_FORM, "exercise")).toEqual([
      { id: "response", label: "Response" },
    ]);
  });

  it("gives nothing for an id that is not a writing deliverable", () => {
    expect(writingSections("not-an-id", "exercise")).toEqual([]);
    expect(writingSections("not-an-id", "assessment")).toEqual([]);
  });
});

describe("writingResponseText", () => {
  it("reads a free-form answer without labelling its storage key", () => {
    expect(
      writingResponseText(FREE_FORM, "exercise", { response: "  the taps  " }),
    ).toBe("the taps");
  });

  it("is empty for a missing, malformed or blank response", () => {
    expect(writingResponseText(FREE_FORM, "exercise", null)).toBe("");
    expect(writingResponseText(FREE_FORM, "exercise", "text")).toBe("");
    expect(writingResponseText(FREE_FORM, "exercise", {})).toBe("");
    expect(writingResponseText(FREE_FORM, "exercise", { response: "  " })).toBe(
      "",
    );
  });

  it("ignores keys that are not the deliverable's sections", () => {
    expect(
      writingResponseText(FREE_FORM, "exercise", {
        response: "kept",
        smuggled: "dropped",
      }),
    ).toBe("kept");
  });

  it("is empty for an id the content graph does not issue", () => {
    expect(writingResponseText("not-an-id", "exercise", { a: "b" })).toBe("");
  });
});
