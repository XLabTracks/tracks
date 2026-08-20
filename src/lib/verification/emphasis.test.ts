import { describe, expect, it } from "vitest";

import { splitEmphasis } from "./emphasis";

describe("splitEmphasis", () => {
  it("leaves an unmarked string as one plain run", () => {
    expect(splitEmphasis("no marks here")).toEqual([
      { text: "no marks here", strong: false },
    ]);
  });

  it("splits a marked phrase out of its sentence", () => {
    expect(
      splitEmphasis("most closely matches the **AIWI/CARMA Guide**?"),
    ).toEqual([
      { text: "most closely matches the ", strong: false },
      { text: "AIWI/CARMA Guide", strong: true },
      { text: "?", strong: false },
    ]);
  });

  it("handles several marks and a leading one", () => {
    expect(splitEmphasis("**a** and **b**")).toEqual([
      { text: "a", strong: true },
      { text: " and ", strong: false },
      { text: "b", strong: true },
    ]);
  });

  it("never loses or duplicates a character", () => {
    for (const s of [
      "plain",
      "**all of it**",
      "a **b** c **d** e",
      "§1107.1(e) is **not** §1107.1(a)",
    ])
      expect(splitEmphasis(s).map((r) => r.text).join("")).toBe(
        s.replace(/\*\*/g, ""),
      );
  });

  it("leaves an unclosed mark alone rather than eating the line", () => {
    expect(splitEmphasis("an **unclosed mark")).toEqual([
      { text: "an **unclosed mark", strong: false },
    ]);
  });

  it("does not carry state between calls", () => {
    const once = splitEmphasis("**x** y");
    expect(splitEmphasis("**x** y")).toEqual(once);
    expect(splitEmphasis("**x** y")).toEqual(once);
  });
});
