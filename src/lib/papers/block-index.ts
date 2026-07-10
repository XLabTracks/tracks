import type { Element, ElementContent, Root, RootContent } from "hast";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";

// Single source of truth for "what text does a PaperBlockRef point at" —
// shared by the content integrity tests, the `--blocks` authoring CLI, and
// the render-time patch engine, so snippet normalization can never diverge.

export interface BlockInfo {
  anchor: string;
  tag: string;
  /** Nearest anchored ancestor (nested blocks: p in theorem, table in figure). */
  parentAnchor?: string;
  /** Normalized full text; math renders as the literal "⟨math⟩". */
  text: string;
  /** Normalized text per sentence span (index 0 = s:1). Empty for non-prose blocks. */
  sentences: string[];
}

/** Collapse whitespace and trim; comparisons are case-sensitive startsWith. */
export function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

const MATH_CLASSES = new Set(["inline-math", "display-math"]);
const MATH_PLACEHOLDER = "⟨math⟩";

/**
 * Plain text of a node with rendered math collapsed to a placeholder — the
 * post-KaTeX MathML+HTML duplication would garble the text otherwise. Same
 * convention as the `--blocks` output authors copy snippets from.
 */
export function blockTextOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type !== "element") return "";
  if (classListOf(node).some((cls) => MATH_CLASSES.has(cls))) {
    return MATH_PLACEHOLDER;
  }
  return node.children.map(blockTextOf).join("");
}

export function buildBlockIndex(html: string): Map<string, BlockInfo> {
  const tree = fromHtmlIsomorphic(html, { fragment: true }) as Root;
  const index = new Map<string, BlockInfo>();

  const walk = (
    nodes: Array<RootContent | ElementContent>,
    parentAnchor: string | undefined,
  ): void => {
    for (const node of nodes) {
      if (node.type !== "element") continue;
      const anchor = anchorProp(node);
      if (anchor) {
        const sentences: string[] = [];
        collectSentences(node, sentences);
        index.set(anchor, {
          anchor,
          tag: node.tagName,
          parentAnchor,
          text: normalizeText(blockTextOf(node)),
          sentences,
        });
        walk(node.children, anchor);
      } else {
        walk(node.children, parentAnchor);
      }
    }
  };
  walk(tree.children, undefined);
  return index;
}

/**
 * The block's OWN sentence spans (skipping nested anchored blocks — those
 * index separately with their own s counters).
 */
function collectSentences(node: Element, out: string[]): void {
  for (const child of node.children) {
    if (child.type !== "element") continue;
    if (anchorProp(child)) continue;
    const s = child.properties?.dataS;
    if (typeof s === "string") {
      out[Number(s) - 1] = normalizeText(blockTextOf(child));
      continue;
    }
    collectSentences(child, out);
  }
}

function anchorProp(node: Element): string | undefined {
  const anchor = node.properties?.dataAnchor;
  return typeof anchor === "string" ? anchor : undefined;
}

function classListOf(node: Element): string[] {
  const className = node.properties?.className;
  if (Array.isArray(className)) return className.map(String);
  if (typeof className === "string") return className.split(/\s+/);
  return [];
}
