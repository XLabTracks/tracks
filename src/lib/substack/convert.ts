import type { Element, ElementContent, Root } from "hast";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { sanitize } from "hast-util-sanitize";
import { toHtml } from "hast-util-to-html";
import { visit, SKIP } from "unist-util-visit";
import { addAnchors } from "@/lib/arxiv/hast-passes";
import { paperSanitizeSchema } from "@/lib/arxiv/sanitize-schema";
import { wrapSentences } from "@/lib/arxiv/sentences";
import type { ConversionWarning, PaperTocEntry } from "@/lib/arxiv/types";
import { WarningCollector } from "@/lib/arxiv/warnings";
import {
  assetPathFor,
  buildFootnoteMarker,
  buildFootnotesSection,
  classListOf,
  cleanCaption,
  dropEmptyParagraphs,
  extractSourceToc,
  findFirst,
  hasClass,
  ImageFetchError,
  normalizeHeadings,
  stringProp,
  stripAuthorIdsAndReservedClasses,
  textOf,
  unwrapSpans,
  type FootnoteNote,
} from "@/lib/paper-source/convert-shared";
import { buildAssetUrl, type SubstackRef } from "./id";

export { ImageFetchError };

/**
 * Substack body_html → annotated artifact HTML. The output honors the exact
 * structural contract the arXiv converter established, so the whole
 * downstream stack (src/lib/papers/ edit engine, sidebar nav, snippet
 * tripwires) works on it unchanged:
 *
 *   - top-level section headings h2–h4 with converter-minted `sb-sec-…` ids
 *     (+ an optional `section#sb-footnotes` landmark) — the toc entries
 *   - `data-anchor="b-NNNN"` on every flow block, document order
 *   - `<span data-s="N">` sentence spans in p/li/blockquote
 *
 * Substack-specific work: strip subscribe/share widgets, rebuild footnotes
 * into a landmark section, download captioned images and rewrite their URLs
 * to committed static assets, and replace rich embeds with link cards. The
 * shared passes (reserved-namespace hygiene, span unwrapping, heading
 * normalization, footnote section shape, toc extraction) live in
 * src/lib/paper-source/convert-shared.ts, whose header carries the pass-
 * ordering security argument:
 *
 *   1. ALL author ids and reserved-prefix classes drop up front.
 *   2. Passes needing Substack's attribute vocabulary (data-attrs,
 *      data-component-name, cdn hrefs) run BEFORE sanitize strips it.
 *   3. Shape-dependent passes and id minting run AFTER sanitize.
 *   4. Anchors and sentence spans are stamped last, then the toc extracted.
 */

export interface SubstackConversionResult {
  html: string;
  toc: PaperTocEntry[];
  warnings: ConversionWarning[];
  /** Relative asset path → image bytes, for everything the HTML references. */
  assets: Map<string, Uint8Array>;
}

export interface ConvertPostOptions {
  ref: SubstackRef;
  /**
   * Fetch original image bytes at conversion time; `assetPath` is the
   * deterministic committed path (usable as a cache key). Return null for a
   * failed download — the converter throws ImageFetchError so the build
   * aborts without committing or negative-caching (mirrors the arXiv rule:
   * only deterministic outcomes are cached or committed).
   */
  fetchImage: (url: string, assetPath: string) => Promise<Uint8Array | null>;
}

export async function convertPostHtml(
  bodyHtml: string,
  opts: ConvertPostOptions,
): Promise<SubstackConversionResult> {
  const warnings = new WarningCollector();
  const tree = fromHtmlIsomorphic(bodyHtml, { fragment: true }) as Root;

  // Author-controlled tree: neutralize reserved namespaces, then run the
  // transforms that need Substack's own attribute vocabulary.
  stripAuthorIdsAndReservedClasses(tree);
  const images = collectImages(tree);
  const assets = await downloadImages(images, opts);
  rewriteImages(tree, images, opts.ref, warnings);
  transformEmbeds(tree, warnings);
  stripWidgets(tree, warnings);

  const clean = sanitize(tree, paperSanitizeSchema) as Root;

  // Settled tree: shape-dependent passes and id minting.
  unwrapSpans(clean);
  dropEmptyParagraphs(clean);
  normalizeHeadings(clean, "sb");
  transformFootnotes(clean);

  addAnchors(clean);
  wrapSentences(clean);
  const toc = extractSourceToc(clean, "sb");
  const html = toHtml(clean);

  // Ship only bytes the final HTML references — an image inside a dropped
  // embed/widget must not linger as an orphan committed file.
  for (const path of [...assets.keys()]) {
    if (!html.includes(buildAssetUrl(opts.ref, path))) assets.delete(path);
  }

  return { html, toc, warnings: warnings.list(), assets };
}

// --- Images ---------------------------------------------------------------

interface ImageRef {
  /** The container (or bare img) element to replace. */
  node: Element;
  kind: "container" | "img";
  /** Original full-size https URL (substackcdn wrapper decoded), or null when
   * the source is non-https/undecodable — those are dropped, never hotlinked. */
  url: string | null;
  /** What the markup said, for warning messages. */
  rawSrc: string | undefined;
  /** Committed asset path, e.g. "images/001-abc_682x481.png"; null iff url null. */
  assetPath: string | null;
  alt: string;
  /** Caption children (inline content), when the container had one. */
  caption: ElementContent[] | null;
}

/**
 * Find every image (captioned containers and bare <img>) and assign each a
 * deterministic asset path (document-order counter + sanitized basename).
 */
function collectImages(tree: Root): ImageRef[] {
  const refs: ImageRef[] = [];
  let counted = 0;
  const push = (
    node: Element,
    kind: ImageRef["kind"],
    rawSrc: string | undefined,
    url: string | null,
    alt: string,
    caption: ElementContent[] | null,
  ) => {
    refs.push({
      node,
      kind,
      url,
      rawSrc,
      assetPath: url ? assetPathFor(url, counted++) : null,
      alt,
      caption,
    });
  };

  visit(tree, "element", (node: Element) => {
    if (node.tagName === "div" && hasClass(node, "captioned-image-container")) {
      const img = findFirst(node, (el) => el.tagName === "img");
      const link = findFirst(
        node,
        (el) => el.tagName === "a" && hasClass(el, "image-link"),
      );
      const caption = findFirst(node, (el) => el.tagName === "figcaption");
      const rawSrc = stringProp(link, "href") ?? stringProp(img, "src");
      const url =
        originalImageUrl(stringProp(link, "href")) ??
        originalImageUrl(stringProp(img, "src"));
      push(
        node,
        "container",
        rawSrc,
        url,
        stringProp(img, "alt") ?? "",
        caption ? caption.children : null,
      );
      return SKIP; // never treat the inner <img> as a bare image too
    }
    if (node.tagName === "img") {
      const rawSrc = stringProp(node, "src");
      push(node, "img", rawSrc, originalImageUrl(rawSrc), stringProp(node, "alt") ?? "", null);
    }
  });
  return refs;
}

async function downloadImages(
  images: ImageRef[],
  opts: ConvertPostOptions,
): Promise<Map<string, Uint8Array>> {
  const assets = new Map<string, Uint8Array>();
  for (const image of images) {
    if (!image.url || !image.assetPath) continue; // dropped at rewrite time
    const bytes = await opts.fetchImage(image.url, image.assetPath);
    if (!bytes) throw new ImageFetchError(image.url);
    assets.set(image.assetPath, bytes);
  }
  return assets;
}

/** Replace image containers/imgs with local-asset markup, dropping the rest. */
function rewriteImages(
  tree: Root,
  images: ImageRef[],
  ref: SubstackRef,
  warnings: WarningCollector,
): void {
  const byNode = new Map(images.map((image) => [image.node, image]));
  visit(tree, "element", (node: Element, index, parent) => {
    const image = byNode.get(node);
    if (!image || index === undefined || !parent) return;
    if (!image.url || !image.assetPath) {
      // Non-https or undecodable source: drop rather than hotlink an
      // unexpected origin from the committed artifact.
      parent.children.splice(index, 1);
      warnings.add("image-dropped", image.rawSrc ?? "unknown source");
      return index;
    }
    const img: Element = {
      type: "element",
      tagName: "img",
      properties: {
        src: buildAssetUrl(ref, image.assetPath),
        alt: image.alt,
      },
      children: [],
    };
    if (image.kind === "img") {
      // Bare <img> — swap in place. It may sit in phrasing content (inside a
      // <p>), where a <figure> would be invalid HTML and get re-parented on
      // the next parse, orphaning every following sentence span.
      parent.children[index] = img;
      return SKIP;
    }
    const figure: Element = {
      type: "element",
      tagName: "figure",
      properties: {},
      children: image.caption
        ? [
            img,
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: cleanCaption(image.caption, warnings),
            },
          ]
        : [img],
    };
    parent.children[index] = figure;
    return SKIP;
  });
}

/**
 * Undo the substackcdn transform wrapper: fetch URLs carry the URL-encoded
 * original as their last path segment
 * (https://substackcdn.com/image/fetch/w_1456,…/https%3A%2F%2F…), which is
 * the full-size source. Plain https URLs pass through unchanged; anything
 * else (http, data:, protocol-relative) returns null and is dropped.
 */
export function originalImageUrl(src: string | undefined): string | null {
  if (!src || !/^https:\/\//i.test(src)) return null;
  const lastSegment = src.slice(src.lastIndexOf("/") + 1);
  if (/^https?%3a/i.test(lastSegment)) {
    try {
      const decoded = decodeURIComponent(lastSegment);
      return /^https:\/\//i.test(decoded) ? decoded : null;
    } catch {
      return null;
    }
  }
  return src;
}

// --- Footnotes --------------------------------------------------------------

/**
 * Rebuild Substack footnotes as a landmark section. Inline markers
 * (a.footnote-anchor) become sup-wrapped links with converter-minted ids;
 * the trailing div.footnote blocks are removed and re-emitted through the
 * shared section builder. Runs post-sanitize (correlation is by class +
 * fragment href — author ids were dropped up front).
 */
function transformFootnotes(tree: Root): void {
  const notes: FootnoteNote[] = [];
  const seenMarkers = new Set<string>();

  visit(tree, "element", (node: Element, index, parent) => {
    if (index === undefined || !parent) return;

    if (node.tagName === "a" && hasClass(node, "footnote-anchor")) {
      const number = footnoteNumberOf(node) ?? textOf(node).trim();
      if (!number || !/^\d+$/.test(number)) return;
      // Only the first marker for a number carries the backlink target id.
      parent.children[index] = buildFootnoteMarker(number, "sb", {
        withId: !seenMarkers.has(number),
      });
      seenMarkers.add(number);
      return SKIP;
    }

    if (node.tagName === "div" && hasClass(node, "footnote")) {
      const marker = findFirst(node, (el) => hasClass(el, "footnote-number"));
      const content = findFirst(node, (el) => hasClass(el, "footnote-content"));
      const number =
        (marker && footnoteNumberOf(marker)) ??
        (marker ? textOf(marker).trim() : "");
      if (number && /^\d+$/.test(number) && content) {
        notes.push({ number, content: content.children });
        parent.children.splice(index, 1);
        return index;
      }
    }
  });

  if (notes.length === 0) return;
  tree.children.push(buildFootnotesSection(notes, "sb"));
}

/** Fragment href "#footnote-12" / "#footnote-anchor-12" → "12". */
function footnoteNumberOf(node: Element): string | null {
  const href = stringProp(node, "href");
  const m = href ? /footnote(?:-anchor)?-(\d+)$/.exec(href) : null;
  return m ? m[1] : null;
}

// --- Embeds & widgets -------------------------------------------------------

/** Rich embeds we can degrade to a link card, keyed by wrapper class. */
const EMBED_CLASSES = new Set([
  "tweet",
  "youtube-wrap",
  "spotify-wrap",
  "apple-podcast-container",
  "embedded-post-wrap",
  "embedded-publication-wrap",
  "bandcamp-wrap",
  "vimeo-wrap",
]);

/**
 * Replace rich embeds (tweets, videos, embedded posts…) with a link card —
 * a <figure class="sb-embed"> so the fallback is still an anchored,
 * hideable block. The embed URL comes from the widget's data-attrs JSON.
 */
function transformEmbeds(tree: Root, warnings: WarningCollector): void {
  visit(tree, "element", (node: Element, index, parent) => {
    if (index === undefined || !parent) return;
    const embedClass = classListOf(node).find((c) => EMBED_CLASSES.has(c));
    if (!embedClass) return;

    const url = embedUrlOf(node, embedClass);
    if (!url) {
      parent.children.splice(index, 1);
      warnings.add("dropped-embed", embedClass);
      return index;
    }
    warnings.add("embed-as-link", embedClass);
    parent.children[index] = {
      type: "element",
      tagName: "figure",
      properties: { className: ["sb-embed"] },
      children: [
        {
          type: "element",
          tagName: "a",
          properties: { href: url },
          children: [{ type: "text", value: `Embedded content: ${url}` }],
        },
      ],
    };
    return SKIP;
  });
}

function embedUrlOf(node: Element, embedClass: string): string | null {
  const attrs = dataAttrsOf(node);
  const direct = attrs?.url ?? attrs?.href ?? attrs?.canonical_url;
  if (typeof direct === "string" && /^https?:\/\//.test(direct)) return direct;
  if (embedClass === "youtube-wrap" && typeof attrs?.videoId === "string") {
    const id = attrs.videoId;
    if (/^[\w-]+$/.test(id)) return `https://www.youtube.com/watch?v=${id}`;
  }
  return null;
}

function dataAttrsOf(node: Element): Record<string, unknown> | null {
  const raw = stringProp(node, "dataAttrs");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Widget wrappers stripped without a trace (pure site chrome). */
const SILENT_WIDGET_CLASSES = new Set([
  "subscription-widget-wrap",
  "subscription-widget-wrap-editor",
  "button-wrapper",
  "install-substack-app-banner",
  "digest-post-embed",
  "subscribe-widget",
]);

/**
 * Components other passes are responsible for: images are rewritten before
 * this pass runs, and footnotes are rebuilt (by class + href, which survive
 * sanitize) after it.
 */
const HANDLED_COMPONENTS = new Set([
  "FootnoteAnchorToDOM",
  "FootnoteToDOM",
  "Image2ToDOM",
]);

/**
 * Strip Substack chrome. Known chrome (subscribe/share widgets) goes
 * silently; anything else still carrying a data-component-name after the
 * image/embed transforms — except the footnote markup a later pass owns —
 * is an unhandled widget: drop it with a warning so the build surfaces what
 * the post lost.
 */
function stripWidgets(tree: Root, warnings: WarningCollector): void {
  visit(tree, "element", (node: Element, index, parent) => {
    if (index === undefined || !parent) return;
    if (classListOf(node).some((c) => SILENT_WIDGET_CLASSES.has(c))) {
      parent.children.splice(index, 1);
      return index;
    }
    const component = stringProp(node, "dataComponentName");
    if (component && !HANDLED_COMPONENTS.has(component)) {
      parent.children.splice(index, 1);
      warnings.add("unknown-component", component);
      return index;
    }
  });
}
