/**
 * Rehype plugin (registered in next.config.ts, AFTER rehype-slug): collects a
 * lesson body's top-level section headings (##/###) and adds
 * `export const sections = [{ id, title, level }, …]` to the compiled MDX
 * module. The ids are read from the headings rehype-slug just processed — the
 * exact anchors the page renders — so the sidebar's "In this lesson" nav can
 * never drift from the document (no authored section list to keep in sync).
 *
 * Plain .mjs (not TS): the MDX loader imports it by file path at build time.
 */
export default function rehypeLessonSections() {
  return (tree) => {
    const sections = [];
    for (const node of tree.children) {
      if (node.type !== "element") continue;
      const level =
        node.tagName === "h2" ? 2 : node.tagName === "h3" ? 3 : null;
      if (level === null) continue;
      const id = node.properties?.id;
      const title = toText(node).trim();
      if (typeof id !== "string" || id === "" || title === "") continue;
      sections.push({ id, title, level });
    }
    tree.children.unshift(esmExport("sections", sections));
  };
}

/** Concatenated text content of a hast node (KaTeX math contributes raw TeX). */
function toText(node) {
  if (node.type === "text") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(toText).join("");
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

/** JSON value → estree expression (arrays, plain objects, primitives only). */
function valueToEstree(value) {
  if (Array.isArray(value)) {
    return { type: "ArrayExpression", elements: value.map(valueToEstree) };
  }
  if (value !== null && typeof value === "object") {
    return {
      type: "ObjectExpression",
      properties: Object.entries(value).map(([key, entry]) => ({
        type: "Property",
        kind: "init",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: key },
        value: valueToEstree(entry),
      })),
    };
  }
  return { type: "Literal", value };
}
