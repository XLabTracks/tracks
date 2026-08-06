/**
 * Rehype plugin (registered in next.config.ts, after rehype-lesson-sections):
 * collects every external source a lesson body cites — markdown links,
 * literal JSX `<a href>`s, and `<SourceQuote url=…/>` attributions — and adds
 * `export const citations = ["https://…", …]` (deduped, in document order) to
 * the compiled MDX module. The item page reads it through
 * `getLessonCitations` and assembles the Works cited appendix from the
 * hand-authored registry in src/content/citations.json, so the appendix can
 * never drift from what the body actually links.
 *
 * Trap: a JSX attribute written as url={"https://…"} is an expression, not a
 * string — both shapes must be read or every SourceQuote goes uncollected.
 * citations.test.ts re-derives this list from the raw MDX text; if the two
 * ever disagree, it is this walk that missed a shape.
 *
 * Plain .mjs (not TS): the MDX loader imports it by file path at build time.
 */
export default function rehypeLessonCitations() {
  return (tree) => {
    const seen = new Set();
    const citations = [];
    const add = (url) => {
      if (typeof url !== "string" || !/^https?:\/\//.test(url)) return;
      if (seen.has(url)) return;
      seen.add(url);
      citations.push(url);
    };
    visit(tree, add);
    tree.children.unshift(esmExport("citations", citations));
  };
}

function visit(node, add) {
  if (node.type === "element" && node.tagName === "a") {
    add(node.properties?.href);
  }
  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "a"
  ) {
    add(attrValue(node, "href"));
  }
  if (node.type === "mdxJsxFlowElement" && node.name === "SourceQuote") {
    add(attrValue(node, "url"));
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, add);
  }
}

/** A JSX attribute's string value, whether written as ="…" or ={"…"}. */
function attrValue(node, name) {
  const attr = (node.attributes ?? []).find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  if (!attr) return null;
  if (typeof attr.value === "string") return attr.value;
  if (attr.value && typeof attr.value.value === "string") {
    try {
      const parsed = JSON.parse(attr.value.value);
      return typeof parsed === "string" ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

/** An `export const <name> = <json>` MDX ESM node (hand-built estree). */
function esmExport(name, value) {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ExportNamedDeclaration",
            specifiers: [],
            source: null,
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name },
                  init: valueToEstree(value),
                },
              ],
            },
          },
        ],
      },
    },
  };
}

/** JSON value → estree expression (arrays and primitives only, here). */
function valueToEstree(value) {
  if (Array.isArray(value)) {
    return { type: "ArrayExpression", elements: value.map(valueToEstree) };
  }
  return { type: "Literal", value };
}
