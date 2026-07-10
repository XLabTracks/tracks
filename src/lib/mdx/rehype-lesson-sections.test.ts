import { describe, it, expect } from "vitest";
import rehypeLessonSections from "./rehype-lesson-sections.mjs";

// Minimal hast builders — the plugin only looks at type/tagName/properties/
// children, so plain objects stand in for real hast nodes.
type Node = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
  value?: string;
  data?: { estree?: unknown };
};

function h(tagName: string, id: string | undefined, ...texts: Node[]): Node {
  return {
    type: "element",
    tagName,
    properties: id === undefined ? {} : { id },
    children: texts,
  };
}

function text(value: string): Node {
  return { type: "text", value };
}

function run(children: Node[]): { tree: { children: Node[] }; sections: unknown } {
  const tree = { children };
  (rehypeLessonSections() as (t: unknown) => void)(tree);
  const esm = tree.children[0];
  expect(esm.type).toBe("mdxjsEsm");
  return { tree, sections: evalSectionsExport(esm) };
}

/** Decode the injected `export const sections = …` estree back to a value. */
function evalSectionsExport(node: Node): unknown {
  const program = node.data?.estree as {
    body: [{ declaration: { declarations: [{ init: unknown }] } }];
  };
  return estreeToValue(program.body[0].declaration.declarations[0].init);
}

function estreeToValue(expr: unknown): unknown {
  const e = expr as {
    type: string;
    value?: unknown;
    elements?: unknown[];
    properties?: { key: { name: string }; value: unknown }[];
  };
  if (e.type === "Literal") return e.value;
  if (e.type === "ArrayExpression") return e.elements!.map(estreeToValue);
  if (e.type === "ObjectExpression") {
    return Object.fromEntries(
      e.properties!.map((p) => [p.key.name, estreeToValue(p.value)]),
    );
  }
  throw new Error(`unexpected estree node ${e.type}`);
}

describe("rehypeLessonSections", () => {
  it("exports top-level h2/h3 headings with their slug ids, in order", () => {
    const { sections } = run([
      h("h2", "same-auroc-different-safety", text("Same AUROC, different safety")),
      { type: "element", tagName: "p", children: [text("prose")] },
      h("h3", "a-subsection", text("A subsection")),
      h("h2", "the-race", text("The "), text("race")),
    ]);
    expect(sections).toEqual([
      {
        id: "same-auroc-different-safety",
        title: "Same AUROC, different safety",
        level: 2,
      },
      { id: "a-subsection", title: "A subsection", level: 3 },
      { id: "the-race", title: "The race", level: 2 },
    ]);
  });

  it("skips other ranks, id-less and empty headings, and non-top-level nodes", () => {
    const { sections } = run([
      h("h1", "doc-title", text("Doc title")),
      h("h4", "too-deep", text("Too deep")),
      h("h2", undefined, text("No id")),
      h("h2", "empty", text("  ")),
      {
        type: "element",
        tagName: "section",
        children: [h("h2", "nested", text("Nested"))],
      },
      h("h2", "kept", text("Kept")),
    ]);
    expect(sections).toEqual([{ id: "kept", title: "Kept", level: 2 }]);
  });

  it("concatenates nested inline content for the title", () => {
    const { sections } = run([
      h("h2", "mixed", text("Before "), {
        type: "element",
        tagName: "code",
        children: [text("inline")],
      }),
    ]);
    expect(sections).toEqual([{ id: "mixed", title: "Before inline", level: 2 }]);
  });

  it("still exports (an empty list) when there are no headings", () => {
    const { tree, sections } = run([
      { type: "element", tagName: "p", children: [text("just prose")] },
    ]);
    expect(sections).toEqual([]);
    expect(tree.children).toHaveLength(2);
  });
});
