import type * as Ast from "@unified-latex/unified-latex-types";
import { htmlLike } from "@unified-latex/unified-latex-util-html-like";
import { parse } from "@unified-latex/unified-latex-util-parse";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import type { WarningCollector } from "../warnings";
import { stripTexComments, texString } from "./tex-utils";

/**
 * `forest` (the TikZ-based tree package) is not in the TikZJax bundle, so
 * forest diagrams can't rasterize like tikzpictures. Instead, parse the
 * package's bracket notation and render the tree as nested divs a pure-CSS
 * tree layout draws connectors for (see .ax-forest in arxiv-paper.css).
 *
 * Deliberately div/span-only markup: `li` is an anchored tag and prose
 * blocks get sentence-wrapped, so list markup here would mint phantom
 * block anchors inside the figure.
 *
 * Handled subset: a `for tree={...}`-style preamble (skipped), one root,
 * per-node labels as balanced `{...}` groups (or bare text up to the first
 * top-level comma), node options (only `dashed` is styled; the rest are
 * typography hints and are dropped). Anything that doesn't parse falls back
 * to the previous behavior: the raw source in an unknown-environment div.
 */

export interface ForestNode {
  /** Raw LaTeX of the node label (outer braces stripped). */
  label: string;
  dashed: boolean;
  children: ForestNode[];
}

/** Parse a forest environment body. Returns null when the shape surprises. */
export function parseForestBody(body: string): ForestNode | null {
  const src = stripTexComments(body);
  const start = findTopLevelBracket(src, 0);
  if (start === -1) return null;
  try {
    const [root, end] = parseNode(src, start);
    // Only whitespace may follow the root's closing bracket.
    if (src.slice(end).trim() !== "") return null;
    return root;
  } catch {
    return null;
  }
}

/** Index of the first `[` at brace depth 0 from `from`, or -1. */
function findTopLevelBracket(src: string, from: number): number {
  let depth = 0;
  for (let i = from; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") i++;
    else if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === "[" && depth === 0) return i;
  }
  return -1;
}

/** Recursive descent from an opening `[`; returns [node, indexPastClose]. */
function parseNode(src: string, at: number): [ForestNode, number] {
  if (src[at] !== "[") throw new Error("expected [");
  let i = at + 1;
  let depth = 0;
  let spec = "";
  // The node spec runs to the first child `[` or this node's `]`.
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      spec += ch + (src[i + 1] ?? "");
      i += 2;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if ((ch === "[" || ch === "]") && depth === 0) break;
    spec += ch;
    i++;
  }
  const children: ForestNode[] = [];
  while (src[i] === "[") {
    const [child, next] = parseNode(src, i);
    children.push(child);
    i = next;
    while (i < src.length && /\s/.test(src[i])) i++;
  }
  if (src[i] !== "]") throw new Error("unclosed node");
  const { label, dashed } = splitSpec(spec);
  return [{ label, dashed, children }, i + 1];
}

/** Split a node spec into its label and options at top-level commas. */
function splitSpec(spec: string): { label: string; dashed: boolean } {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < spec.length; i++) {
    const ch = spec[i];
    if (ch === "\\") {
      current += ch + (spec[i + 1] ?? "");
      i++;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  const label = stripOuterBraces(parts[0].trim());
  const dashed = parts.slice(1).some((p) => p.trim() === "dashed");
  return { label, dashed };
}

/** `{...}` → `...` when the braces span the whole string. */
function stripOuterBraces(s: string): string {
  if (!s.startsWith("{")) return s;
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\") i++;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) {
      return i === s.length - 1 ? s.slice(1, -1) : s;
    }
  }
  return s;
}

type EnvReplacement = (node: Ast.Environment) => Ast.Node;

export function buildForestReplacement(
  warnings: WarningCollector,
): EnvReplacement {
  return (node) => {
    const body = printRaw(node.content);
    const root = parseForestBody(body);
    if (root === null) {
      warnings.add("forest", "unparseable forest diagram; showing its source");
      return htmlLike({
        tag: "div",
        attributes: { className: "environment forest" },
        content: [texString(body)],
      });
    }
    warnings.add("forest", "forest diagram rendered as an HTML tree");
    return htmlLike({
      tag: "div",
      attributes: { className: "ax-forest" },
      content: [buildNode(root)],
    });
  };
}

function buildNode(node: ForestNode): Ast.Node {
  const labelClass =
    "ax-forest-label" + (node.dashed ? " ax-forest-dashed" : "");
  const content: Ast.Node[] = [
    htmlLike({
      tag: "span",
      attributes: { className: labelClass },
      content: parse(node.label).content,
    }),
  ];
  if (node.children.length > 0) {
    content.push(
      htmlLike({
        tag: "div",
        attributes: { className: "ax-forest-children" },
        content: node.children.map(buildNode),
      }),
    );
  }
  return htmlLike({
    tag: "div",
    attributes: { className: "ax-forest-node" },
    content,
  });
}
