import { describe, expect, it } from "vitest";
import { memoSlots } from "@/content/verification/memos";
import { countWords, memoDraftsFrom } from "./memo-drafts";

const first = memoSlots[0]!.id;
const second = memoSlots[1]!.id;

describe("memoDraftsFrom", () => {
  it("returns nothing for an absent or malformed store", () => {
    expect(memoDraftsFrom(null)).toEqual([]);
    expect(memoDraftsFrom(undefined)).toEqual([]);
    expect(memoDraftsFrom("not a store")).toEqual([]);
    expect(memoDraftsFrom([])).toEqual([]);
  });

  it("skips the store's own stamp and any underscore key", () => {
    expect(memoDraftsFrom({ _updatedAt: 171, _other: { body: "x" } })).toEqual(
      [],
    );
  });

  it("skips a slot whose every field is blank or whitespace", () => {
    expect(
      memoDraftsFrom({ [first]: { body: "   ", title: "", decision: "\n" } }),
    ).toEqual([]);
  });

  it("keeps a slot written in any single field", () => {
    const drafts = memoDraftsFrom({ [first]: { decision: "whether to sign" } });
    expect(drafts).toHaveLength(1);
    expect(drafts[0]!.fields.decision).toBe("whether to sign");
    expect(drafts[0]!.fields.body).toBe("");
    expect(drafts[0]!.words).toBe(0);
  });

  it("resolves a slot and counts the body's words", () => {
    const drafts = memoDraftsFrom({
      [first]: { title: "Stakeholder map", body: " one two  three\nfour " },
    });
    expect(drafts[0]!.slot?.id).toBe(first);
    expect(drafts[0]!.slot?.title).toBeTruthy();
    expect(drafts[0]!.words).toBe(4);
  });

  it("orders written slots as the outline does, not as the store does", () => {
    const drafts = memoDraftsFrom({
      [second]: { body: "second" },
      [first]: { body: "first" },
    });
    expect(drafts.map((draft) => draft.id)).toEqual([first, second]);
  });

  it("keeps writing whose slot has left the outline, after the known ones", () => {
    const drafts = memoDraftsFrom({
      "m9-retired": { body: "still theirs" },
      [first]: { body: "current" },
    });
    expect(drafts.map((draft) => draft.id)).toEqual([first, "m9-retired"]);
    expect(drafts[1]!.slot).toBeNull();
  });

  it("ignores stored fields that are not the desk's", () => {
    const drafts = memoDraftsFrom({
      [first]: { body: "kept", smuggled: "dropped" },
    });
    expect(Object.keys(drafts[0]!.fields).sort()).toEqual([
      "audience",
      "body",
      "date",
      "decision",
      "falsifier",
      "from",
      "title",
    ]);
  });

  it("tolerates a non-string field", () => {
    const drafts = memoDraftsFrom({ [first]: { body: 42, title: "kept" } });
    expect(drafts[0]!.fields.body).toBe("");
    expect(drafts[0]!.fields.title).toBe("kept");
  });
});

describe("countWords", () => {
  it("counts runs of non-space, and nothing in an empty string", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n ")).toBe(0);
    expect(countWords("one")).toBe(1);
    expect(countWords("one  two\nthree\tfour")).toBe(4);
  });
});
