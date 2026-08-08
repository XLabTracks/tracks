import { describe, it, expect } from "vitest";
import { planParts, MIN_PART_CHARS, type PartSource } from "./lesson-parts";

const h = (text: string, tag = "H2"): PartSource => ({ tag, text });
const p = (chars: number): PartSource => ({ tag: "P", text: "w".repeat(chars) });
const big = () => p(MIN_PART_CHARS * 2);

const labels = (items: PartSource[]) => planParts(items).map((x) => x.label);
const sizes = (items: PartSource[]) =>
  planParts(items).map((x) => x.indices.length);

describe("planParts", () => {
  it("opens a part at every top-level heading", () => {
    expect(labels([h("One"), big(), h("Two"), big(), h("Three"), big()])).toEqual([
      "One",
      "Two",
      "Three",
    ]);
  });

  it("calls the blocks before the first heading Start", () => {
    expect(labels([big(), h("One"), big(), h("Two"), big()])[0]).toBe("Start");
  });

  it("drops to h3, then h4, when there are not enough h2s", () => {
    const byH3 = [h("A", "H3"), big(), h("B", "H3"), big(), h("C", "H3"), big()];
    expect(labels(byH3)).toEqual(["A", "B", "C"]);
    const byH4 = [h("A", "H4"), big(), h("B", "H4"), big(), h("C", "H4"), big()];
    expect(labels(byH4)).toEqual(["A", "B", "C"]);
  });

  it("folds consecutive headings together rather than leaving a lone title", () => {
    const parts = planParts([h("One"), h("Two"), big(), h("Three"), big(), h("Four"), big()]);
    // "One" has no body before "Two", so the two headings share a part.
    expect(parts[0].indices).toEqual([0, 1, 2]);
    expect(parts.map((x) => x.label)).toEqual(["One", "Three", "Four"]);
  });

  /* The defect this file exists for: a part you land on and immediately press
     Next past. Measured off the course — the smallest deliberate parts run
     464+ characters, what the chunker produced by itself ran 69 to 267. */
  describe("a part too small to be one", () => {
    it("folds a short trailing section back into the reading it belongs to", () => {
      const items = [h("One"), big(), h("Two"), big(), h("Notebook output"), p(40)];
      expect(labels(items)).toEqual(["One", "Two"]);
      expect(sizes(items)).toEqual([2, 4]);
    });

    it("folds a bare opening embed forward, under the first real heading", () => {
      // 0.1: the lesson opens on a video and nothing else.
      const items = [p(60), h("The Danger of ASI"), big(), h("What is ASI?"), big()];
      expect(labels(items)).toEqual(["The Danger of ASI", "What is ASI?"]);
      expect(planParts(items)[0].indices).toEqual([0, 1, 2]);
    });

    it("keeps folding while anything is still too small", () => {
      // 2.1: "Notebook output" and "Diagnostic hints" are both tiny and adjacent.
      const items = [
        h("Core"), big(),
        h("Connection"), p(430),
        h("Notebook output"), p(150),
        h("Diagnostic hints"), p(200),
      ];
      expect(labels(items)).toEqual(["Core", "Connection"]);
    });

    it("leaves the smallest parts anyone writes on purpose alone", () => {
      for (const chars of [464, 619, 754, 782, 901]) {
        const items = [h("One"), big(), h("Two"), p(chars), h("Three"), big()];
        expect(labels(items), `${chars} chars`).toEqual(["One", "Two", "Three"]);
      }
    });

    it("never drops a block: every index survives the fold, in order", () => {
      const items = [
        p(60), h("A"), big(), h("tiny"), p(20), h("B"), big(), h("also tiny"), p(10),
      ];
      const seen = planParts(items).flatMap((x) => x.indices);
      expect(seen).toEqual(items.map((_, i) => i));
    });

    it("does not loop forever when every part is small", () => {
      const items = [h("A"), p(10), h("B"), p(10), h("C"), p(10)];
      const parts = planParts(items);
      expect(parts).toHaveLength(1);
      expect(parts[0].indices).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it("leaves a lesson of one part alone rather than folding it away", () => {
      expect(planParts([p(10)])).toHaveLength(1);
    });
  });
});
