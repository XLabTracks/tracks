// The parser-free core of the paper-text normalization convention: how
// artifact text is collapsed for snippet comparison, and how rendered math
// subtrees read as text. block-index.ts (HAST side — tests, authoring CLI,
// patch engine, highlight validation) and src/lib/highlights/dom.ts (live-DOM
// side — highlight capture/resolution) both build on these; keeping the
// constants and the collapse rule in one dependency-free module is what makes
// client-captured snippets exactly comparable with the server's block index
// without pulling the hast parser into the client bundle.

/** Collapse whitespace and trim; comparisons are case-sensitive startsWith. */
export function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Class names of rendered math containers — their subtrees read as the placeholder. */
export const MATH_CLASSES: ReadonlySet<string> = new Set([
  "inline-math",
  "display-math",
]);

/**
 * What a math subtree reads as: the post-KaTeX MathML+HTML duplication would
 * garble the text otherwise. Same convention as the `--blocks` output authors
 * copy snippets from.
 */
export const MATH_PLACEHOLDER = "⟨math⟩";
