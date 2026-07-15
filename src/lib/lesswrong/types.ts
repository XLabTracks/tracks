import type { ConversionWarning, PaperTocEntry } from "@/lib/arxiv/types";

/**
 * Bump when converter output changes shape or rendering meaningfully, so
 * cached conversions from older code are discarded (a version mismatch on
 * read forces a re-convert from the cached raw post JSON) and committed
 * artifacts read as "not-built" until rebuilt. Anchors (data-anchor),
 * sentence indices (data-s), and toc ids are stable for a cached post ×
 * converter version — the same persistence contract as the arXiv and
 * Substack converters.
 *
 * v1: initial LessWrong/Alignment Forum html → artifact converter — both
 *     footnote formats (modern CkEditor sidenotes and legacy markdown)
 *     rebuilt as an lw-footnotes landmark, MathJax CHTML re-rendered with
 *     KaTeX from the aria-label TeX, image download + rewrite, spoiler
 *     blocks as native <details>, iframe-widget/oembed degradation, and the
 *     shared sanitize/anchor/sentence passes.
 */
export const LESSWRONG_CONVERTER_VERSION = 1;

export interface LessWrongMeta {
  title?: string;
  authors?: string[];
  /** ISO publication date from the post JSON. */
  postedAt?: string;
  /** The canonical reader URL ("https://www.lesswrong.com/posts/{id}/{slug}"). */
  canonicalUrl?: string;
}

export interface ConvertedPost {
  html: string;
  toc: PaperTocEntry[];
  warnings: ConversionWarning[];
  meta: LessWrongMeta;
  /** Asset paths (relative, e.g. "images/001-….png") referenced by the HTML. */
  assets: string[];
  converterVersion: number;
  createdAt: string;
}

/**
 * What `npm run lesswrong:build` commits under src/content/lesswrong/{id}.json —
 * either a rendered post or a terminal reason it can't render. Transient
 * failures are never committed; the build script exits nonzero instead.
 * Posts aren't version-pinned: the committed artifact is the pin (the raw
 * post caches in the OS temp dir while it lives; `--refresh` — or cache
 * eviction — refetches, and snippet tripwires in content.test.ts name every
 * Paper.edit that drifted).
 */
export type LessWrongArtifact =
  | { state: "ready"; post: ConvertedPost }
  | { state: "not-found" }
  | { state: "failed" };
