import { describe, expect, it } from "vitest";
import { blockTextOf, buildBlockIndex, normalizeText } from "./block-index";

const HTML = [
  '<h2 id="ax-sec-a" data-anchor="b-0001"><span class="ax-secnum">1</span> Alpha</h2>',
  '<p data-anchor="b-0002">',
  '<span data-s="1">First sentence with <span class="inline-math"><span class="katex">x^2 rendered</span></span> math.</span>',
  " ",
  '<span data-s="2">Second   sentence\nhere.</span>',
  "</p>",
  '<div class="ax-theorem" data-anchor="b-0003"><strong>Theorem 1:</strong>',
  '<p data-anchor="b-0004"><span data-s="1">Nested claim.</span></p>',
  "</div>",
  '<figure data-anchor="b-0005"><table data-anchor="b-0006"><tbody><tr><td>cell</td></tr></tbody></table></figure>',
].join("");

describe("buildBlockIndex", () => {
  const index = buildBlockIndex(HTML);

  it("indexes every anchored block with tag and text", () => {
    expect([...index.keys()]).toEqual([
      "b-0001",
      "b-0002",
      "b-0003",
      "b-0004",
      "b-0005",
      "b-0006",
    ]);
    expect(index.get("b-0001")).toMatchObject({ tag: "h2", text: "1 Alpha" });
  });

  it("normalizes text and collapses math to a placeholder", () => {
    expect(index.get("b-0002")!.text).toBe(
      "First sentence with ⟨math⟩ math. Second sentence here.",
    );
    expect(index.get("b-0002")!.sentences).toEqual([
      "First sentence with ⟨math⟩ math.",
      "Second sentence here.",
    ]);
  });

  it("tracks parentAnchor for nested blocks and scopes sentences per block", () => {
    expect(index.get("b-0004")).toMatchObject({
      parentAnchor: "b-0003",
      sentences: ["Nested claim."],
    });
    // The theorem's own sentence list excludes the nested paragraph's spans.
    expect(index.get("b-0003")!.sentences).toEqual([]);
    expect(index.get("b-0006")!.parentAnchor).toBe("b-0005");
  });

  it("top-level blocks have no parentAnchor", () => {
    expect(index.get("b-0002")!.parentAnchor).toBeUndefined();
  });
});

describe("normalizeText / blockTextOf", () => {
  it("collapses whitespace and trims", () => {
    expect(normalizeText("  a\n\t b  ")).toBe("a b");
  });
  it("emits the math placeholder for both math wrapper kinds", () => {
    const tree = buildBlockIndex(
      '<p data-anchor="b-0001"><span class="display-math x">E=mc^2 stuff</span> tail</p>',
    );
    expect(tree.get("b-0001")!.text).toBe("⟨math⟩ tail");
    void blockTextOf; // exported for the CLI/engine; exercised above
  });
});
