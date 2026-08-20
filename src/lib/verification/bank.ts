/**
 * The words and glyphs a capstone brief is printed with.
 *
 * Two surfaces print briefs from the same generated bank — the filterable
 * catalogue (`capstone-bank.html`, via `VT.bank` in
 * `public/verification/platform.js`) and `<CapstoneBank/>` inside unit 4.2.
 * They must say the same thing about the same state, so this is the app's
 * copy and `bank.test.ts` fails the build when platform.js drifts from it.
 *
 * Every entry is a word first. The glyph rides along for scanning; it never
 * carries the state on its own, and neither does colour.
 */
export const STATUS_GLYPH: Record<string, string> = {
  ready: "●",
  draft: "◐",
  concept: "○",
};

export const STATUS_WORD: Record<string, string> = {
  ready: "ready to run",
  draft: "draft",
  concept: "concept",
};

export const DIFF_GLYPH: Record<string, string> = {
  core: "●",
  stretch: "◆",
  advanced: "▲",
};
