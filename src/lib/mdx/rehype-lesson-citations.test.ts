/**
 * What the citation collector counts as a citation.
 *
 * It used to walk a named list of shapes — markdown links, literal `<a>`, and
 * `<SourceQuote url>` — so a work a lesson reached through a `<ReadingCard
 * href>` was invisible to the Works cited appendix. That is not a cosmetic
 * gap: registry entries are kept honest by "something cites this", so a
 * lesson could hold a work on screen while its entry counted as an orphan and
 * was removed. Every href and url now counts, wherever it is written.
 *
 * Driven through the plugin's own transformer over a hand-built tree rather
 * than through a real MDX compile: `@mdx-js/mdx` is only a transitive
 * dependency here, and the shapes are the whole point.
 */
import { describe, expect, it } from "vitest";
// Plain .mjs — next.config.ts imports it by absolute file path at build time.
import rehypeLessonCitations from "./rehype-lesson-citations.mjs";

type Node = Record<string, unknown>;

/** A JSX element with a single string attribute, as MDX parses `x="…"`. */
function jsx(name: string, attr: string, value: string): Node {
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: [{ type: "mdxJsxAttribute", name: attr, value }],
    children: [],
  };
}

/** The URLs the plugin exported, read back out of the estree it injects. */
function collect(children: Node[]): string[] {
  const tree = { type: "root", children: [...children] };
  (rehypeLessonCitations as () => (t: unknown) => void)()(tree);
  const injected = tree.children[0] as {
    data: {
      estree: {
        body: [
          { declaration: { declarations: [{ init: { elements: { value: string }[] } }] } },
        ];
      };
    };
  };
  return injected.data.estree.body[0].declaration.declarations[0].init.elements.map(
    (e) => e.value,
  );
}

describe("rehype-lesson-citations", () => {
  it("collects a link however the author wrote it", () => {
    expect(
      collect([
        // A markdown link, compiled to an anchor element.
        { type: "element", tagName: "a", properties: { href: "https://e.test/md" }, children: [] },
        jsx("a", "href", "https://e.test/anchor"),
        jsx("SourceQuote", "url", "https://e.test/sq"),
        jsx("ReadingCard", "href", "https://e.test/card"),
        jsx("SiteQuote", "href", "https://e.test/site"),
        // The shape nobody has written yet is the one that matters.
        jsx("SomeFutureBlock", "href", "https://e.test/future"),
      ]),
    ).toEqual([
      "https://e.test/md",
      "https://e.test/anchor",
      "https://e.test/sq",
      "https://e.test/card",
      "https://e.test/site",
      "https://e.test/future",
    ]);
  });

  it("reads an attribute written as an expression", () => {
    // url={"https://…"} is an expression node, not a string — miss this and
    // every SourceQuote goes uncollected.
    expect(
      collect([
        {
          type: "mdxJsxFlowElement",
          name: "SourceQuote",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "url",
              value: { type: "mdxJsxAttributeValueExpression", value: '"https://e.test/expr"' },
            },
          ],
          children: [],
        },
      ]),
    ).toEqual(["https://e.test/expr"]);
  });

  it("takes only external links, once each, in document order", () => {
    expect(
      collect([
        jsx("ReadingCard", "href", "/tracks/verification/precedents"),
        jsx("Video", "src", "https://e.test/movie.mp4"),
        jsx("ReadingCard", "href", "https://e.test/b"),
        jsx("ReadingCard", "href", "https://e.test/a"),
        jsx("SiteQuote", "href", "https://e.test/b"),
      ]),
    ).toEqual(["https://e.test/b", "https://e.test/a"]);
  });

  it("walks nested children", () => {
    expect(
      collect([
        {
          type: "element",
          tagName: "div",
          properties: {},
          children: [jsx("ReadingCard", "href", "https://e.test/deep")],
        },
      ]),
    ).toEqual(["https://e.test/deep"]);
  });
});
