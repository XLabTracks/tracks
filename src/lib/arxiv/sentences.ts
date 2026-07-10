import type { Element, ElementContent, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Sentence addressing for paper edits: wraps each sentence of prose blocks
 * (p/li/blockquote) in <span data-s="N"> (1-based per block). Like
 * data-anchor, data-s indices are part of the persistence contract — stable
 * for a pinned arXiv version + converter version.
 *
 * Segmentation BIAS: err toward UNDER-splitting. A missed boundary merges
 * two sentences into one span (an author targets a slightly larger unit); a
 * false split severs an abbreviation mid-sentence, which silently corrupts
 * every downstream sentence index. Guards: an abbreviation list, "next
 * visible character must not be lowercase", and inline elements (citations,
 * math — raw TeX at this stage) treated as opaque units that never split.
 */

const SENTENCE_BLOCK_TAGS = new Set(["p", "li", "blockquote"]);

/** Block-level children are hard boundaries — flushed, never inside a sentence span. */
const HARD_CHILD_TAGS = new Set([
  "p",
  "div",
  "ul",
  "ol",
  "dl",
  "figure",
  "table",
  "blockquote",
  "pre",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "section",
]);

/** Lowercased tokens (terminator included) that end an abbreviation, not a sentence. */
const ABBREVIATIONS = new Set([
  "al.",
  "e.g.",
  "i.e.",
  "etc.",
  "cf.",
  "vs.",
  "resp.",
  "ca.",
  "approx.",
  "fig.",
  "figs.",
  "eq.",
  "eqs.",
  "eqn.",
  "eqns.",
  "sec.",
  "secs.",
  "sect.",
  "tab.",
  "ref.",
  "refs.",
  "thm.",
  "thms.",
  "lem.",
  "lems.",
  "cor.",
  "prop.",
  "props.",
  "alg.",
  "algs.",
  "def.",
  "defs.",
  "app.",
  "ch.",
  "chs.",
  "no.",
  "vol.",
  "pp.",
  "ed.",
  "eds.",
  "dr.",
  "prof.",
  "mr.",
  "ms.",
  "st.",
]);

/** Terminator (+ closing quotes/brackets) followed by whitespace — a split candidate. */
const BOUNDARY_RE = /([.!?…][”"’')\]]*)(\s+)/g;

export function wrapSentences(tree: Root): void {
  visit(tree, "element", (node: Element) => {
    if (!SENTENCE_BLOCK_TAGS.has(node.tagName)) return;
    node.children = segmentInline(node.children);
    // Nested prose blocks (p inside li, p inside theorem divs) were flushed
    // as hard children; the visitor reaches and wraps them on its own.
  });
}

/**
 * Wrap the sentences found in a block's direct children. Exported for unit
 * tests. All original nodes are preserved: sentence content moves inside
 * spans, inter-sentence whitespace stays between them as bare text.
 */
export function segmentInline(children: ElementContent[]): ElementContent[] {
  const out: ElementContent[] = [];
  let bucket: ElementContent[] = [];
  let n = 0;
  // The last text seen ended with a terminator (non-abbreviation) but had no
  // trailing whitespace — a boundary may materialize at the next text node
  // (e.g. "…performance." followed by a citation, then " Numerous…").
  let pendingTerminator = false;

  const flush = () => {
    if (bucket.length === 0) return;
    if (bucket.every(isWhitespaceText)) {
      out.push(...bucket);
    } else {
      n++;
      out.push({
        type: "element",
        tagName: "span",
        properties: { dataS: String(n) },
        children: bucket,
      });
    }
    bucket = [];
  };

  for (const child of children) {
    if (child.type === "element" && HARD_CHILD_TAGS.has(child.tagName)) {
      flush();
      out.push(child);
      pendingTerminator = false;
      continue;
    }
    if (child.type !== "text") {
      // Inline element (citation, math wrapper, link, em…) or comment:
      // an opaque unit inside the current sentence. Keeps pendingTerminator —
      // a sentence-final citation sits between the period and the boundary.
      bucket.push(child);
      continue;
    }

    let rest = child.value;

    // Deferred boundary from a previous node: "…terminator[, inline units,]
    // whitespace, non-lowercase" closes the previous sentence BEFORE the
    // whitespace.
    if (pendingTerminator) {
      const lead = /^\s+/.exec(rest);
      if (lead && !isLowercase(rest[lead[0].length])) {
        flush();
        out.push({ type: "text", value: lead[0] });
        rest = rest.slice(lead[0].length);
      }
      pendingTerminator = false;
    }

    // Mid-node boundaries.
    let last = 0;
    BOUNDARY_RE.lastIndex = 0;
    for (let m = BOUNDARY_RE.exec(rest); m; m = BOUNDARY_RE.exec(rest)) {
      const contentEnd = m.index + m[1].length;
      const next = rest[m.index + m[0].length];
      const prefix = rest.slice(last, contentEnd);
      if (isAbbreviationEnd(prefix) || isLowercase(next)) continue;
      bucket.push({ type: "text", value: prefix });
      flush();
      out.push({ type: "text", value: m[2] });
      last = m.index + m[0].length;
    }

    const tail = rest.slice(last);
    if (tail) bucket.push({ type: "text", value: tail });
    pendingTerminator = /[.!?…][”"’')\]]*$/.test(tail) && !isAbbreviationEnd(tail);
  }
  flush();
  return out;
}

/**
 * Does this text (ending at a "." terminator) end in an abbreviation?
 * Empty prefixes (the terminator directly follows an inline element, e.g.
 * "…<cite>[35]</cite>.") are NOT abbreviations. Only "." can abbreviate.
 */
function isAbbreviationEnd(textEndingAtTerminator: string): boolean {
  const stripped = textEndingAtTerminator.replace(/[”"’')\]]+$/, "");
  if (!stripped.endsWith(".")) return false;
  const token = /(\S+)$/.exec(stripped)?.[1];
  if (!token) return false;
  const word = token.replace(/^[([{"'“‘]+/, "");
  if (ABBREVIATIONS.has(word.toLowerCase())) return true;
  if (/^[A-Z]\.$/.test(word)) return true; // initials: "A. Vaswani"
  // Dotted acronyms: i.i.d., w.r.t., s.t., a.k.a., U.S., …
  return /^(?:[A-Za-z]\.){2,}$/.test(word);
}

function isLowercase(char: string | undefined): boolean {
  return char !== undefined && char >= "a" && char <= "z";
}

function isWhitespaceText(node: ElementContent): boolean {
  return node.type === "text" && node.value.trim() === "";
}
