import { describe, expect, it } from "vitest";
import { buildBlockIndex } from "@/lib/papers/block-index";
import {
  convertPostHtml,
  ImageFetchError,
  originalImageUrl,
  type ConvertPostOptions,
} from "./convert";
import { parseSubstackPostUrl } from "./id";

const ref = parseSubstackPostUrl("https://example.substack.com/p/some-post")!;
const bytes = new Uint8Array([137, 80, 78, 71]);
const fetchImage: ConvertPostOptions["fetchImage"] = async () => bytes;

const convert = (html: string) => convertPostHtml(html, { ref, fetchImage });

describe("convertPostHtml — annotation contract", () => {
  it("stamps document-order anchors and 1-based sentence spans", async () => {
    const { html } = await convert(
      "<p>First sentence. Second sentence.</p><p>Another block.</p>",
    );
    expect(html).toContain('data-anchor="b-0001"');
    expect(html).toContain('data-anchor="b-0002"');
    expect(html).toContain('<span data-s="1">First sentence.</span>');
    expect(html).toContain('<span data-s="2">Second sentence.</span>');

    // The committed HTML must round-trip through the shared block index —
    // that's what snippet tripwires, the --blocks CLI, and the render-time
    // patcher all reparse.
    const index = buildBlockIndex(html);
    expect(index.get("b-0001")?.sentences).toEqual([
      "First sentence.",
      "Second sentence.",
    ]);
    expect(index.get("b-0002")?.text).toBe("Another block.");
  });

  it("drops empty paragraphs so they don't consume anchors", async () => {
    const { html } = await convert("<p>Real.</p><p></p><p> </p><p>Also real.</p>");
    expect(html).not.toContain("<p data-anchor=\"b-0002\"></p>");
    const index = buildBlockIndex(html);
    expect([...index.values()].map((b) => b.text)).toEqual([
      "Real.",
      "Also real.",
    ]);
  });

  it("unwraps the old editor's bare span wrappers so sentences still split", async () => {
    const { html } = await convert(
      "<p><span>One sentence here. And a second one.</span></p>",
    );
    expect(html).toContain('<span data-s="1">One sentence here.</span>');
    expect(html).toContain('<span data-s="2">And a second one.</span>');
  });

  it("keeps meaningful inline elements as opaque units inside sentences", async () => {
    const { html } = await convert(
      '<p>See <a href="https://example.com">the link</a> here. Next sentence.</p>',
    );
    const index = buildBlockIndex(html);
    expect(index.get("b-0001")?.sentences).toEqual([
      "See the link here.",
      "Next sentence.",
    ]);
    expect(html).toContain('href="https://example.com"');
  });
});

describe("convertPostHtml — headings and toc", () => {
  it("normalizes body h1/h2 onto the h2/h3 ladder and mints sb-sec ids", async () => {
    const { html, toc } = await convert(
      "<h1>Top Section</h1><p>Alpha.</p><h2>Sub Section</h2><p>Beta.</p><h1>Second Top</h1><p>Gamma.</p>",
    );
    expect(toc.map((e) => ({ ...e, anchor: undefined }))).toEqual([
      { kind: "section", id: "sb-sec-top-section", title: "Top Section", number: "", level: 2, anchor: undefined },
      { kind: "section", id: "sb-sec-sub-section", title: "Sub Section", number: "", level: 3, anchor: undefined },
      { kind: "section", id: "sb-sec-second-top", title: "Second Top", number: "", level: 2, anchor: undefined },
    ]);
    // Top-level headings with double-quoted ids — what split-paper.ts slices on.
    expect(html).toContain('<h2 id="sb-sec-top-section"');
    expect(html).toContain('<h3 id="sb-sec-sub-section"');
    // Every toc entry carries its own heading's anchor.
    for (const entry of toc) expect(entry.anchor).toMatch(/^b-\d{4}$/);
  });

  it("promotes a post that only uses h3 to the h2 ladder", async () => {
    const { toc } = await convert("<h3>Only Rank</h3><p>Body.</p>");
    expect(toc).toHaveLength(1);
    expect(toc[0].level).toBe(2);
    expect(toc[0].id).toBe("sb-sec-only-rank");
  });

  it("dedupes colliding section ids", async () => {
    const { toc } = await convert(
      "<h2>Same Title</h2><p>A.</p><h2>Same Title</h2><p>B.</p>",
    );
    expect(toc.map((e) => e.id)).toEqual(["sb-sec-same-title", "sb-sec-same-title-2"]);
  });
});

describe("convertPostHtml — footnotes", () => {
  const FOOTNOTE_POST =
    '<p>A claim<a class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" id="footnote-anchor-1" href="#footnote-1" target="_self">1</a> here.</p>' +
    '<div class="footnote" data-component-name="FootnoteToDOM">' +
    '<a id="footnote-1" href="#footnote-anchor-1" class="footnote-number" contenteditable="false" target="_self">1</a>' +
    '<div class="footnote-content"><p>The footnote body. It has two sentences.</p></div></div>';

  it("rebuilds footnotes as an sb-footnotes landmark with linked markers", async () => {
    const { html, toc } = await convert(FOOTNOTE_POST);
    expect(html).toContain(
      '<sup class="sb-fnref"><a id="sb-fnref-1" href="#sb-fn-1">1</a></sup>',
    );
    expect(html).toContain('<section class="sb-footnotes" id="sb-footnotes">');
    expect(html).toMatch(/<li id="sb-fn-1" data-anchor="b-\d{4}">/);
    expect(html).toContain('href="#sb-fnref-1"');
    const landmark = toc.find((e) => e.kind === "footnotes");
    expect(landmark).toMatchObject({ id: "sb-footnotes", title: "Footnotes", level: 2 });
    expect(landmark?.anchor).toMatch(/^b-\d{4}$/);
  });

  it("keeps footnote bodies sentence-addressable", async () => {
    const { html } = await convert(FOOTNOTE_POST);
    const index = buildBlockIndex(html);
    const noteItem = [...index.values()].find((b) =>
      b.text.startsWith("The footnote body."),
    );
    expect(noteItem?.tag).toBe("li");
    // The trailing "↩" span is the backlink — same artifact-level quirk as
    // arXiv footnotes; authors simply never target it.
    expect(noteItem?.sentences).toEqual([
      "The footnote body.",
      "It has two sentences.",
      "↩",
    ]);
  });
});

describe("convertPostHtml — images", () => {
  const CDN_ORIGINAL =
    "https://substack-post-media.s3.amazonaws.com/public/images/0689739d_682x481.png";
  const CDN_WRAPPED = `https://substackcdn.com/image/fetch/$s_!K2La!,f_auto,q_auto:good/${encodeURIComponent(CDN_ORIGINAL)}`;
  const IMAGE_POST =
    '<div class="captioned-image-container"><figure>' +
    `<a class="image-link image2 is-viewable-img" target="_blank" href="${CDN_WRAPPED}" data-component-name="Image2ToDOM">` +
    '<div class="image2-inset"><picture>' +
    `<source type="image/webp" srcset="${CDN_WRAPPED} 424w"/>` +
    `<img src="${CDN_WRAPPED}" alt="A results chart"/>` +
    '</picture><div class="image-link-expand">…</div></div></a>' +
    "<figcaption>The caption text.</figcaption></figure></div>";

  it("downloads originals and rewrites to committed static assets", async () => {
    const fetched: string[] = [];
    const result = await convertPostHtml(IMAGE_POST, {
      ref,
      fetchImage: async (url) => {
        fetched.push(url);
        return bytes;
      },
    });
    expect(fetched).toEqual([CDN_ORIGINAL]);
    const assetPath = "images/001-0689739d_682x481.png";
    expect([...result.assets.keys()]).toEqual([assetPath]);
    expect(result.assets.get(assetPath)).toBe(bytes);
    expect(result.html).toContain(
      `<img src="/substack/${ref.id}/assets/images/001-0689739d_682x481.png" alt="A results chart">`,
    );
    expect(result.html).toContain("<figcaption>The caption text.</figcaption>");
    // The CDN chrome (expand button, srcset sources) must be gone.
    expect(result.html).not.toContain("substackcdn.com");
    expect(result.html).not.toContain("image-link-expand");
    // Figures are anchored blocks — hideable and nav-addressable.
    expect(result.html).toMatch(/<figure data-anchor="b-\d{4}">/);
  });

  it("throws ImageFetchError (transient) when a download fails", async () => {
    await expect(
      convertPostHtml(IMAGE_POST, { ref, fetchImage: async () => null }),
    ).rejects.toThrow(ImageFetchError);
  });
});

describe("convertPostHtml — widgets, embeds, sanitization", () => {
  it("strips subscription widgets silently", async () => {
    const { html, warnings } = await convert(
      '<p>Before.</p><div class="subscription-widget-wrap-editor" data-component-name="SubscribeWidgetToDOM"><form>…</form></div><p>After.</p>',
    );
    expect(html).not.toContain("subscription-widget");
    expect(html).not.toContain("form");
    expect(warnings).toEqual([]);
  });

  it("degrades known embeds to link cards with a warning", async () => {
    const { html, warnings } = await convert(
      `<div class="tweet" data-attrs="${'{"url":"https://twitter.com/x/status/1"}'.replace(/"/g, "&quot;")}">tweet chrome</div>`,
    );
    expect(html).toContain('<figure class="sb-embed" data-anchor="b-0001">');
    expect(html).toContain('href="https://twitter.com/x/status/1"');
    expect(warnings).toContainEqual({
      code: "embed-as-link",
      detail: "tweet",
      count: 1,
    });
  });

  it("drops unknown components with a warning", async () => {
    const { html, warnings } = await convert(
      '<p>Keep.</p><div data-component-name="AudioEmbedPlayer">player</div>',
    );
    expect(html).not.toContain("player");
    expect(warnings).toContainEqual({
      code: "unknown-component",
      detail: "AudioEmbedPlayer",
      count: 1,
    });
  });

  it("drops author ids but keeps converter-minted ones", async () => {
    const { html } = await convert(
      '<h2 id="author-id">Section</h2><p id="also-author">Body.</p>',
    );
    expect(html).not.toContain("author-id");
    expect(html).not.toContain("also-author");
    expect(html).toContain('id="sb-sec-section"');
  });

  it("sanitizes scripts, event handlers, and inline styles", async () => {
    const { html } = await convert(
      '<p style="color:red" onclick="alert(1)">Text.</p><script>alert(1)</script><iframe src="https://evil.example"></iframe>',
    );
    expect(html).not.toContain("script");
    expect(html).not.toContain("iframe");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("style=");
    expect(html).toContain('<span data-s="1">Text.</span>');
  });
});

describe("convertPostHtml — adversarial author markup", () => {
  it("strips author ids even when they use the converter's sb- prefix", async () => {
    // A smuggled nested id would hijack sectionStartOffset's string search
    // and duplicate DOM ids — the invariant is "every id is converter-minted".
    const { html, toc } = await convert(
      '<p>Intro para.</p><blockquote><h2 id="sb-sec-introduction">smuggled</h2><p>quote body.</p></blockquote><h2>Introduction</h2><p>Real body.</p>',
    );
    const occurrences = html.split('id="sb-sec-introduction"').length - 1;
    expect(occurrences).toBe(1);
    expect(toc.filter((e) => e.id === "sb-sec-introduction")).toHaveLength(1);
    // The real heading (after the blockquote) carries it, not the smuggled one.
    expect(html).toMatch(
      /<\/blockquote><h2 id="sb-sec-introduction" data-anchor="b-\d{4}">Introduction<\/h2>/,
    );
  });

  it("strips author sb-/ax- classes so landmarks and edit-UI styling can't be forged", async () => {
    const { html, toc } = await convert(
      '<section class="sb-footnotes"><p>fake footnotes.</p></section>' +
        '<p class="ax-added">styled like an editorial note.</p><p>Real.</p>',
    );
    expect(toc.find((e) => e.kind === "footnotes")).toBeUndefined();
    expect(html).not.toContain("sb-footnotes");
    expect(html).not.toContain("ax-added");
  });

  it("unwraps style-carrying spans so sentences still split", async () => {
    const { html } = await convert(
      '<p><span style="font-weight:400">First sentence. Second sentence.</span></p>',
    );
    expect(html).toContain('<span data-s="1">First sentence.</span>');
    expect(html).toContain('<span data-s="2">Second sentence.</span>');
  });

  it("drops <p><br></p> and paragraphs emptied by sanitization", async () => {
    const { html } = await convert(
      "<p>Real one.</p><p><br></p><p><script>var x=1;</script></p><p>Real two.</p>",
    );
    const index = buildBlockIndex(html);
    expect([...index.values()].map((b) => b.text)).toEqual([
      "Real one.",
      "Real two.",
    ]);
  });

  it("swaps inline images in place — never a <figure> inside a <p>", async () => {
    const { html } = await convert(
      '<p>Before text <img src="https://example.com/pic.png" alt="badge"> middle. Tail sentence here.</p>',
    );
    expect(html).not.toContain("<figure");
    // The paragraph must survive a reparse intact: sentence spans stay its
    // children (a nested figure would auto-close the <p> and orphan them).
    const index = buildBlockIndex(html);
    expect(index.get("b-0001")?.sentences).toEqual([
      "Before text middle.",
      "Tail sentence here.",
    ]);
    expect(html).toContain(`src="/substack/${ref.id}/assets/images/001-pic.png"`);
  });

  it("drops non-https images instead of hotlinking them", async () => {
    const { html, warnings, assets } = await convert(
      '<p>Text.</p><img src="http://legacy.example.com/pic.png" alt="x">',
    );
    expect(html).not.toContain("legacy.example.com");
    expect(assets.size).toBe(0);
    expect(warnings).toContainEqual({
      code: "image-dropped",
      detail: "http://legacy.example.com/pic.png",
      count: 1,
    });
  });

  it("prunes assets whose referencing element was dropped", async () => {
    // The image sits inside a tweet embed that degrades to a link card —
    // its downloaded bytes must not ship as an orphan committed file.
    const { html, assets } = await convert(
      `<div class="tweet" data-attrs="${'{"url":"https://twitter.com/x/status/1"}'.replace(/"/g, "&quot;")}"><img src="https://pbs.example.com/media.png"></div>`,
    );
    expect(html).toContain('class="sb-embed"');
    expect(assets.size).toBe(0);
  });

  it("drops images nested in figure captions instead of hotlinking", async () => {
    const CDN = "https://substack-post-media.s3.amazonaws.com/public/images/a.png";
    const { html, warnings } = await convert(
      `<div class="captioned-image-container"><figure><img src="${CDN}" alt="">` +
        `<figcaption>Caption with <img src="https://example.com/inline.png"> art</figcaption></figure></div>`,
    );
    expect(html).not.toContain("example.com/inline.png");
    expect(html).toContain("Caption with");
    expect(warnings).toContainEqual({
      code: "image-dropped",
      detail: "image nested in a figure caption",
      count: 1,
    });
  });

  it("mints section ids for headings hoisted out of sanitize-stripped wrappers", async () => {
    const { toc } = await convert(
      "<article><h2>Wrapped Section</h2><p>Body.</p></article>",
    );
    expect(toc.map((e) => e.id)).toEqual(["sb-sec-wrapped-section"]);
  });
});

describe("convertPostHtml — lists and blockquotes", () => {
  it("anchors list items and their nested paragraphs (Substack's li>p shape)", async () => {
    const { html } = await convert(
      "<ul><li><p>First item sentence. Second one.</p></li><li><p>Second item.</p></li></ul>",
    );
    const index = buildBlockIndex(html);
    const tags = [...index.values()].map((b) => b.tag);
    expect(tags).toEqual(["li", "p", "li", "p"]);
    const firstP = [...index.values()].find((b) => b.tag === "p");
    expect(firstP?.sentences).toEqual(["First item sentence.", "Second one."]);
    // Nested blocks record their parent so hide-overlap checks work.
    expect(firstP?.parentAnchor).toBe([...index.values()][0].anchor);
  });

  it("keeps footnote markers working inside blockquotes", async () => {
    const { html } = await convert(
      '<blockquote><p>Quoted claim<a class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" id="footnote-anchor-1" href="#footnote-1">1</a>.</p></blockquote>' +
        '<div class="footnote" data-component-name="FootnoteToDOM"><a id="footnote-1" href="#footnote-anchor-1" class="footnote-number">1</a>' +
        '<div class="footnote-content"><p>The note.</p></div></div>',
    );
    expect(html).toContain('<blockquote data-anchor=');
    expect(html).toContain('<a id="sb-fnref-1" href="#sb-fn-1">1</a>');
    expect(html).toMatch(/<li id="sb-fn-1" data-anchor="b-\d{4}">/);
  });
});

describe("originalImageUrl", () => {
  it("decodes substackcdn fetch wrappers to the original", () => {
    expect(
      originalImageUrl(
        "https://substackcdn.com/image/fetch/w_1456,c_limit/https%3A%2F%2Fbucket.s3.amazonaws.com%2Fpublic%2Fimages%2Fa.png",
      ),
    ).toBe("https://bucket.s3.amazonaws.com/public/images/a.png");
  });

  it("passes plain https URLs through", () => {
    expect(originalImageUrl("https://example.com/x.png")).toBe(
      "https://example.com/x.png",
    );
  });

  it("rejects non-https sources", () => {
    expect(originalImageUrl("http://example.com/x.png")).toBeNull();
    expect(originalImageUrl("data:image/png;base64,AAAA")).toBeNull();
    expect(originalImageUrl(undefined)).toBeNull();
  });
});
