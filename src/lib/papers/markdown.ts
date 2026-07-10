import type { ElementContent } from "hast";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import katex from "katex";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mathFromMarkdown } from "mdast-util-math";
import { toHast, type Handler } from "mdast-util-to-hast";
import { math } from "micromark-extension-math";

/**
 * Renders the small authored markdown strings in Paper.edits (editorial
 * adds). Authored repo content — same trust tier as lesson MDX, so no
 * sanitize pass; `allowDangerousHtml` stays off, so raw HTML in the markdown
 * renders as escaped text. Supports CommonMark plus $…$ / $$…$$ math,
 * rendered with vanilla KaTeX (no paper macro table — editorial notes don't
 * inherit the paper's \newcommands).
 */

function katexHandler(displayMode: boolean): Handler {
  return (_state, node: { value: string }) => {
    const rendered = katex.renderToString(node.value, {
      displayMode,
      throwOnError: false,
      trust: false,
      maxExpand: 1000,
    });
    return fromHtmlIsomorphic(rendered, { fragment: true })
      .children as ReturnType<Handler>;
  };
}

function render(md: string): ElementContent[] {
  const mdast = fromMarkdown(md, {
    extensions: [math()],
    mdastExtensions: [mathFromMarkdown()],
  });
  const hast = toHast(mdast, {
    handlers: {
      inlineMath: katexHandler(false),
      math: katexHandler(true),
    },
  });
  const children = hast.type === "root" ? hast.children : [hast];
  return children as ElementContent[];
}

/** Block-level markdown → HAST children (paragraphs, lists, code, math…). */
export function markdownBlocksToHast(md: string): ElementContent[] {
  return render(md);
}

/**
 * Inline-level markdown (sentence-targeted adds) → the children of its
 * single paragraph. Returns null when the input isn't a single paragraph
 * (block constructs are illegal inline — validated by content.test.ts; this
 * is the render-time fail-soft).
 */
export function markdownInlineToHast(md: string): ElementContent[] | null {
  const blocks = render(md).filter(
    (node) => !(node.type === "text" && node.value.trim() === ""),
  );
  if (blocks.length !== 1) return null;
  const only = blocks[0];
  if (only.type !== "element" || only.tagName !== "p") return null;
  return only.children;
}
