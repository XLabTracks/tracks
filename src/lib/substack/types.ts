import type { ConversionWarning, PaperTocEntry } from "@/lib/arxiv/types";

/**
 * Bump when converter output changes shape or rendering meaningfully, so
 * cached conversions from older code are discarded (a version mismatch on
 * read forces a re-convert from the cached raw post JSON) and committed
 * artifacts read as "not-built" until rebuilt. Anchors (data-anchor),
 * sentence indices (data-s), and toc ids are stable for a cached post ×
 * converter version — the same persistence contract as the arXiv converter.
 *
 * v1: initial Substack body_html → artifact converter — heading
 *     normalization (h1…h6 → h2–h4 + sb-sec ids), footnote rebuild
 *     (sb-footnotes landmark), captioned-image download + rewrite,
 *     subscribe/share-widget stripping, embed link cards, span unwrapping,
 *     shared sanitize/anchor/sentence passes from the arXiv toolchain.
 */
export const SUBSTACK_CONVERTER_VERSION = 1;

export interface SubstackMeta {
  title?: string;
  subtitle?: string;
  authors?: string[];
  /** ISO publication date from the post JSON. */
  postDate?: string;
  /** The publication's own canonical URL (custom domains differ from the authored URL). */
  canonicalUrl?: string;
}

export interface ConvertedPost {
  html: string;
  toc: PaperTocEntry[];
  warnings: ConversionWarning[];
  meta: SubstackMeta;
  /** Asset paths (relative, e.g. "images/001-….png") referenced by the HTML. */
  assets: string[];
  converterVersion: number;
  createdAt: string;
}

/**
 * What `npm run substack:build` commits under src/content/substack/{id}.json —
 * either a rendered post or a terminal reason it can't render. Transient
 * failures are never committed; the build script exits nonzero instead.
 * Substack posts aren't version-pinned like arXiv e-prints: the committed
 * artifact IS the pin. The raw post caches in the OS temp dir, so re-runs
 * convert the same bytes while it lives; a rebuild after cache eviction —
 * or a deliberate --refresh — refetches and picks up author edits, and the
 * snippet tripwires in content.test.ts name every Paper.edit that drifted.
 */
export type SubstackArtifact =
  | { state: "ready"; post: ConvertedPost }
  | { state: "not-found" }
  | { state: "paywalled" }
  | { state: "failed" };
