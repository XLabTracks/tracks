import { describe, expect, it } from "vitest";
import { normalizeText } from "@/lib/papers/normalize";
import { buildOffsetMap, snapOffset } from "./offset-map";

describe("buildOffsetMap", () => {
  it("matches normalizeText on plain text", () => {
    const raw = "  First   sentence\nhere.  ";
    const map = buildOffsetMap([{ kind: "text", text: raw }]);
    expect(map.text).toBe(normalizeText(raw));
    expect(map.text).toBe("First sentence here.");
  });

  it("round-trips offsets through collapsed whitespace", () => {
    const map = buildOffsetMap([{ kind: "text", text: "  a   b  " }]);
    expect(map.text).toBe("a b");
    // "a" starts at raw index 2.
    expect(map.startPosition(0)).toEqual({ segment: 0, offset: 2 });
    // The collapsed space maps to the run's first raw whitespace char.
    expect(map.startPosition(1)).toEqual({ segment: 0, offset: 3 });
    // "b" at raw index 6; end after it = raw 7.
    expect(map.startPosition(2)).toEqual({ segment: 0, offset: 6 });
    expect(map.endPosition(3)).toEqual({ segment: 0, offset: 7 });
  });

  it("spans segment boundaries", () => {
    const map = buildOffsetMap([
      { kind: "text", text: "one " },
      { kind: "text", text: " two" },
    ]);
    expect(map.text).toBe("one two");
    // The joiner space is attributed to the FIRST run char (segment 0).
    expect(map.startPosition(3)).toEqual({ segment: 0, offset: 3 });
    expect(map.startPosition(4)).toEqual({ segment: 1, offset: 1 });
    expect(map.endPosition(7)).toEqual({ segment: 1, offset: 4 });
  });

  it("treats math as an atomic placeholder", () => {
    const map = buildOffsetMap([
      { kind: "text", text: "sum " },
      { kind: "math" },
      { kind: "text", text: " holds." },
    ]);
    expect(map.text).toBe("sum ⟨math⟩ holds.");
    // Any offset inside the placeholder clamps to the atom's edges.
    expect(map.startPosition(4)).toEqual({ segment: 1, edge: "before" });
    expect(map.startPosition(6)).toEqual({ segment: 1, edge: "before" });
    expect(map.endPosition(10)).toEqual({ segment: 1, edge: "after" });
    expect(map.endPosition(7)).toEqual({ segment: 1, edge: "after" });
    // Text on either side still maps to raw offsets.
    expect(map.startPosition(0)).toEqual({ segment: 0, offset: 0 });
    expect(map.startPosition(11)).toEqual({ segment: 2, offset: 1 });
  });

  it("drops leading/trailing whitespace entirely", () => {
    const map = buildOffsetMap([
      { kind: "text", text: "  " },
      { kind: "text", text: "core" },
      { kind: "text", text: "  " },
    ]);
    expect(map.text).toBe("core");
    expect(map.startPosition(0)).toEqual({ segment: 1, offset: 0 });
    expect(map.endPosition(4)).toEqual({ segment: 1, offset: 4 });
  });

  it("rejects out-of-bounds offsets", () => {
    const map = buildOffsetMap([{ kind: "text", text: "abc" }]);
    expect(map.startPosition(-1)).toBeNull();
    expect(map.startPosition(4)).toBeNull();
    expect(map.endPosition(0)).toBeNull();
    expect(map.endPosition(4)).toBeNull();
  });

  it("start at text end resolves like an end position", () => {
    const map = buildOffsetMap([{ kind: "text", text: "abc" }]);
    expect(map.startPosition(3)).toEqual({ segment: 0, offset: 3 });
  });

  it("offsetAt inverts positions, landing collapsed whitespace forward", () => {
    const map = buildOffsetMap([{ kind: "text", text: "  a   b" }]);
    expect(map.text).toBe("a b");
    expect(map.offsetAt(0, 0)).toBe(0); // inside dropped leading ws
    expect(map.offsetAt(0, 2)).toBe(0); // at "a"
    expect(map.offsetAt(0, 3)).toBe(1); // first ws of the run
    expect(map.offsetAt(0, 5)).toBe(2); // mid-run → next emitted char ("b")
    expect(map.offsetAt(0, 6)).toBe(2);
    expect(map.offsetAt(0, 7)).toBe(3); // past "b" = text end
  });

  it("offsetAt and atomBounds agree across math atoms", () => {
    const map = buildOffsetMap([
      { kind: "text", text: "sum " },
      { kind: "math" },
      { kind: "text", text: " holds." },
    ]);
    expect(map.atomBounds(1)).toEqual({ start: 4, end: 10 });
    expect(map.atomBounds(0)).toBeNull();
    expect(map.offsetAt(2, 1)).toBe(11); // "h" after the atom + joiner space
  });
});

describe("snapOffset", () => {
  it("returns boundary offsets unchanged", () => {
    expect(snapOffset("abc", 0, "ceil")).toBe(0);
    expect(snapOffset("abc", 2, "floor")).toBe(2);
    expect(snapOffset("abc", 3, "floor")).toBe(3);
  });

  it("never bisects a surrogate pair", () => {
    const text = "a\u{1D49C}b"; // astral char occupies offsets 1–2
    expect(snapOffset(text, 2, "floor")).toBe(1);
    expect(snapOffset(text, 2, "ceil")).toBe(3);
  });

  it("keeps combining sequences whole when Segmenter is available", () => {
    if (typeof Intl.Segmenter !== "function") return;
    const text = "éx"; // e + combining acute, then x
    expect(snapOffset(text, 1, "floor")).toBe(0);
    expect(snapOffset(text, 1, "ceil")).toBe(2);
  });

  it("clamps out-of-range offsets", () => {
    expect(snapOffset("ab", -3, "floor")).toBe(0);
    expect(snapOffset("ab", 9, "ceil")).toBe(2);
  });
});
