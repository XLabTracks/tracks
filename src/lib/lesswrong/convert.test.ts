import { describe, expect, it } from "vitest";
import { buildBlockIndex } from "@/lib/papers/block-index";
import { convertPostHtml, ImageFetchError, type ConvertPostOptions } from "./convert";
import { parseLessWrongPostUrl } from "./id";

const ref = parseLessWrongPostUrl(
  "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/example",
)!;
const bytes = new Uint8Array([137, 80, 78, 71]);
const fetchImage: ConvertPostOptions["fetchImage"] = async () => bytes;

const convert = (html: string) => convertPostHtml(html, { ref, fetchImage });

// The legacy markdown footnote format (e.g. the 2024 AI-control post),
// whitespace-faithful to the real markup ("<p>…</p>\n</li>").
const LEGACY_FOOTNOTES =
  '<p>A claim.<sup class="footnote-ref"><a href="#fn-hmnGzWKsN432gg9j7-1" id="fnref-hmnGzWKsN432gg9j7-1">[1]</a></sup> More text follows here.</p>' +
  '<hr class="footnotes-sep">\n' +
  '<section class="footnotes"><ol class="footnotes-list">\n' +
  '<li id="fn-hmnGzWKsN432gg9j7-1" class="footnote-item"><p>The note body. Second sentence. <a href="#fnref-hmnGzWKsN432gg9j7-1" class="footnote-backref">↩︎</a></p>\n</li>\n' +
  "</ol></section>";

// The modern CkEditor footnote format (what LessWrong shows as sidenotes);
// the container IS the <ol>, matching real emissions.
const MODERN_FOOTNOTES =
  '<p><span>A modern claim</span><span class="footnote-reference" data-footnote-reference="" data-footnote-id="vco6tpg1tj" data-footnote-index="1" role="doc-noteref" id="fnrefvco6tpg1tj"><sup><a href="#fnvco6tpg1tj">[1]</a></sup></span><span> continues.</span></p>' +
  '<ol class="footnote-section footnotes" data-footnote-section="" role="doc-endnotes">' +
  '<li class="footnote-item" data-footnote-item="" data-footnote-id="vco6tpg1tj" data-footnote-index="1" role="doc-endnote" id="fnvco6tpg1tj">' +
  '<span class="footnote-back-link" data-footnote-back-link="" data-footnote-id="vco6tpg1tj"><sup><strong><a href="#fnrefvco6tpg1tj">^</a></strong></sup></span>' +
  '<div class="footnote-content" data-footnote-content=""><p><span>The modern note. </span><i><span>With italics</span></i><span>.</span></p></div></li>' +
  "</ol>";

describe("convertPostHtml — footnotes (legacy markdown format)", () => {
  it("rebuilds the lw-footnotes landmark with linked markers", async () => {
    const { html, toc } = await convert(LEGACY_FOOTNOTES);
    expect(html).toContain(
      '<sup class="lw-fnref"><a id="lw-fnref-1" href="#lw-fn-1">1</a></sup>',
    );
    expect(html).toContain('<section class="lw-footnotes" id="lw-footnotes">');
    expect(html).toMatch(/<li id="lw-fn-1" data-anchor="b-\d{4}">/);
    // The source's own backref and separators are gone.
    expect(html).not.toContain("footnote-backref");
    expect(html).not.toContain("footnotes-sep");
    expect(html).not.toContain("#fnref-hmnGzWKsN432gg9j7-1");
    const landmark = toc.find((e) => e.kind === "footnotes");
    expect(landmark).toMatchObject({ id: "lw-footnotes", title: "Footnotes" });
  });

  it("keeps note bodies sentence-addressable", async () => {
    const { html } = await convert(LEGACY_FOOTNOTES);
    const index = buildBlockIndex(html);
    const note = [...index.values()].find((b) =>
      b.text.startsWith("The note body."),
    );
    expect(note?.tag).toBe("li");
    expect(note?.sentences).toEqual([
      "The note body.",
      "Second sentence.",
      "↩",
    ]);
  });
});

describe("convertPostHtml — footnotes (modern CkEditor format)", () => {
  it("rebuilds the same landmark shape the sidenote layer keys on", async () => {
    const { html, toc } = await convert(MODERN_FOOTNOTES);
    expect(html).toContain(
      '<sup class="lw-fnref"><a id="lw-fnref-1" href="#lw-fn-1">1</a></sup>',
    );
    expect(html).toContain('<section class="lw-footnotes" id="lw-footnotes">');
    expect(html).toMatch(/<li id="lw-fn-1" data-anchor="b-\d{4}">/);
    expect(html).not.toContain("footnote-back-link");
    expect(html).not.toContain("fnvco6tpg1tj");
    expect(toc.find((e) => e.kind === "footnotes")).toBeDefined();
    // Note content (spans unwrapped) is sentence-addressable.
    const index = buildBlockIndex(html);
    const note = [...index.values()].find((b) =>
      b.text.startsWith("The modern note."),
    );
    expect(note?.sentences?.[0]).toBe("The modern note.");
  });

  it("gives repeat references to one footnote a single backlink target", async () => {
    const twice =
      MODERN_FOOTNOTES.replace(
        "</p>",
        '<span class="footnote-reference" data-footnote-id="vco6tpg1tj" id="fnrefvco6tpg1tj2"><sup><a href="#fnvco6tpg1tj">[1]</a></sup></span></p>',
      );
    const { html } = await convert(twice);
    expect(html.split('id="lw-fnref-1"').length - 1).toBe(1);
    expect(html.split('href="#lw-fn-1"').length - 1).toBe(2);
  });

  it("keeps minted numbers unique when formats mix or markers lack digits", async () => {
    // A legacy "[1]" and a modern "[1]" in one post (different keys) must
    // not both mint lw-fn-1 — the second takes the next free number.
    const mixed =
      '<p>Legacy.<sup class="footnote-ref"><a href="#fn-k-1" id="fnref-k-1">[1]</a></sup></p>' +
      '<p>Modern<span class="footnote-reference" data-footnote-id="aa"><sup><a href="#fnaa">[1]</a></sup></span>.</p>' +
      '<section class="footnotes"><ol class="footnotes-list">' +
      '<li id="fn-k-1" class="footnote-item"><p>Legacy note. <a href="#fnref-k-1" class="footnote-backref">↩︎</a></p></li>' +
      "</ol></section>" +
      '<ol class="footnote-section footnotes">' +
      '<li class="footnote-item" id="fnaa"><span class="footnote-back-link"><a href="#fnrefaa">^</a></span>' +
      '<div class="footnote-content"><p>Modern note.</p></div></li></ol>';
    const { html } = await convert(mixed);
    expect(html.split('<li id="lw-fn-1"').length - 1).toBe(1);
    expect(html.split('<li id="lw-fn-2"').length - 1).toBe(1);
    expect(html).toContain('id="lw-fnref-1"');
    expect(html).toContain('id="lw-fnref-2"');
  });

  it("warns when a note without a back-link is dropped", async () => {
    const { warnings } = await convert(
      '<section class="footnotes"><ol class="footnotes-list">' +
        '<li class="footnote-item"><p>Orphaned content with no backref.</p></li>' +
        "</ol></section>",
    );
    expect(
      warnings.some(
        (w) => w.code === "footnote-dropped" && w.detail.startsWith("Orphaned"),
      ),
    ).toBe(true);
  });

  it("rewrites markers nested inside another footnote's body", async () => {
    // Legacy-format note 1 references note 2 from within its own content.
    const nested =
      '<p>Claim.<sup class="footnote-ref"><a href="#fn-k-1" id="fnref-k-1">[1]</a></sup></p>' +
      '<p>More.<sup class="footnote-ref"><a href="#fn-k-2" id="fnref-k-2">[2]</a></sup></p>' +
      '<section class="footnotes"><ol class="footnotes-list">' +
      '<li id="fn-k-1" class="footnote-item"><p>See also<sup class="footnote-ref"><a href="#fn-k-2">[2]</a></sup> below. <a href="#fnref-k-1" class="footnote-backref">↩︎</a></p></li>' +
      '<li id="fn-k-2" class="footnote-item"><p>The second note. <a href="#fnref-k-2" class="footnote-backref">↩︎</a></p></li>' +
      "</ol></section>";
    const { html } = await convert(nested);
    expect(html).not.toContain("footnote-ref");
    expect(html).not.toContain("#fn-k-2");
    // The nested reference links to lw-fn-2 but carries no duplicate id.
    expect(html.split('href="#lw-fn-2"').length - 1).toBe(2);
    expect(html.split('id="lw-fnref-2"').length - 1).toBe(1);
  });

  it("leaves sup links that only look like footnote markers alone", async () => {
    const { html } = await convert(
      '<p>See<sup><a href="#fnord">note</a></sup> here.</p>',
    );
    expect(html).not.toContain("lw-fnref");
    expect(html).not.toContain("lw-footnotes");
  });
});

describe("convertPostHtml — math", () => {
  const CHTML =
    '<p>For any<span class="math-tex"><span class="mjpage"><span class="mjx-chtml"><span class="mjx-math" aria-label="X \\sim P"><span class="mjx-mrow" aria-hidden="true"><span class="mjx-mi">X</span></span></span><style>.mjx-chtml {display: inline-block}</style></span></span></span> we have. Next sentence.</p>';

  it("re-renders MathJax CHTML as KaTeX from the aria-label TeX", async () => {
    const { html } = await convert(CHTML);
    expect(html).toContain('class="inline-math"');
    expect(html).toContain("katex");
    expect(html).not.toContain("mjx-chtml");
    expect(html).not.toContain("<style>");
    // Sentence addressing sees the math as one opaque unit.
    const index = buildBlockIndex(html);
    expect(index.get("b-0001")?.sentences).toEqual([
      "For any⟨math⟩ we have.",
      "Next sentence.",
    ]);
  });

  it("renders MathJax v2 script bodies and raw delimiters, display included", async () => {
    const { html } = await convert(
      '<p>Inline <span class="math-tex"><script type="math/tex">a+b</script></span> here.</p>' +
        '<span class="math-tex"><span class="mjpage mjpage__block"><span class="mjx-math" aria-label="\\sum_i x_i"></span></span></span>' +
        '<p>Raw <span class="math-tex">\\(c^2\\)</span> too.</p>',
    );
    expect(html).toContain('class="inline-math"');
    expect(html).toMatch(/<div class="display-math" data-anchor="b-\d{4}">/);
    expect(html).toContain("katex-display");
  });

  it("drops undecipherable math with a warning", async () => {
    const { html, warnings } = await convert(
      '<p>Broken <span class="math-tex"><span class="mjx-chtml">glyphs only</span></span> math.</p>',
    );
    expect(html).not.toContain("glyphs only");
    expect(warnings.some((w) => w.code === "math-dropped")).toBe(true);
  });
});

describe("convertPostHtml — spoilers, embeds, images", () => {
  it("turns spoiler blocks into native details", async () => {
    const { html } = await convert(
      '<div class="spoilers"><p>The twist. It was earth.</p></div>',
    );
    expect(html).toContain('<details class="lw-spoiler">');
    expect(html).toContain("<summary>Spoiler — click to reveal</summary>");
    // Spoiler paragraphs stay anchored and sentence-addressable.
    const index = buildBlockIndex(html);
    const spoiled = [...index.values()].find((b) =>
      b.text.startsWith("The twist."),
    );
    expect(spoiled?.sentences).toEqual(["The twist.", "It was earth."]);
  });

  it("drops iframe-widget embeds with a warning and links oembeds", async () => {
    const { html, warnings } = await convert(
      '<div class="iframe-widget" data-iframe-widget-id="4yT6nep2AJEBirRL4"></div>' +
        '<figure class="media"><div data-oembed-url="https://www.youtube.com/watch?v=abc"></div></figure>',
    );
    expect(html).not.toContain("iframe-widget");
    expect(warnings).toContainEqual({
      code: "dropped-embed",
      detail: "iframe-widget",
      count: 1,
    });
    expect(html).toContain('<figure class="lw-embed" data-anchor=');
    expect(html).toContain('href="https://www.youtube.com/watch?v=abc"');
  });

  it("downloads figure images to committed assets and keeps captions", async () => {
    const fetched: string[] = [];
    const result = await convertPostHtml(
      '<figure class="image image_resized" style="width:82.5%"><img src="https://res.cloudinary.com/lesswrong-2-0/image/upload/f_auto,q_auto/v1/mirroredImages/abc/xyz" srcset="https://res.cloudinary.com/x 424w" alt="A chart"><figcaption>The caption.</figcaption></figure>',
      {
        ref,
        fetchImage: async (url) => {
          fetched.push(url);
          return bytes;
        },
      },
    );
    expect(fetched).toEqual([
      "https://res.cloudinary.com/lesswrong-2-0/image/upload/f_auto,q_auto/v1/mirroredImages/abc/xyz",
    ]);
    expect([...result.assets.keys()]).toEqual(["images/001-xyz"]);
    expect(result.html).toContain(
      `src="/lesswrong/${ref.id}/assets/images/001-xyz"`,
    );
    expect(result.html).toContain("<figcaption>The caption.</figcaption>");
    expect(result.html).not.toContain("cloudinary");
    expect(result.html).not.toContain("srcset");
  });

  it("throws ImageFetchError (transient) when a download fails", async () => {
    await expect(
      convertPostHtml('<figure><img src="https://x.example/a.png"></figure>', {
        ref,
        fetchImage: async () => null,
      }),
    ).rejects.toThrow(ImageFetchError);
  });

  it("swaps inline images in place and drops non-https ones", async () => {
    const { html, warnings, assets } = await convert(
      '<p>Inline <img src="https://x.example/inline.png" alt="i"> image. Next.</p>' +
        '<p>Legacy <img src="http://x.example/old.png"> image.</p>',
    );
    expect(html).not.toContain("<figure");
    expect(html).toContain(`src="/lesswrong/${ref.id}/assets/images/001-inline.png"`);
    expect(html).not.toContain("http://x.example");
    expect(assets.size).toBe(1);
    expect(warnings).toContainEqual({
      code: "image-dropped",
      detail: "http://x.example/old.png",
      count: 1,
    });
  });
});

describe("convertPostHtml — contract and adversarial markup", () => {
  it("stamps anchors, sentence spans, and normalizes body h1s onto the toc ladder", async () => {
    const { html, toc } = await convert(
      "<h1>The control property</h1><p>First sentence. Second sentence.</p><h2>Nested rank</h2><p>Body.</p>",
    );
    expect(toc.map((e) => ({ id: e.id, level: e.level }))).toEqual([
      { id: "lw-sec-the-control-property", level: 2 },
      { id: "lw-sec-nested-rank", level: 3 },
    ]);
    const index = buildBlockIndex(html);
    expect(index.get("b-0002")?.sentences).toEqual([
      "First sentence.",
      "Second sentence.",
    ]);
  });

  it("strips author ids/reserved classes so landmarks can't be forged", async () => {
    const { html, toc } = await convert(
      '<section class="lw-footnotes"><p>fake.</p></section>' +
        '<blockquote><h2 id="lw-sec-real">smuggled</h2></blockquote>' +
        '<p class="ax-added">styled like an editorial note.</p><h2>Real</h2><p>Body.</p>',
    );
    expect(toc.find((e) => e.kind === "footnotes")).toBeUndefined();
    expect(html).not.toContain("lw-footnotes");
    expect(html).not.toContain("ax-added");
    // The smuggled nested id was stripped; the real heading owns the id.
    expect(html.split('id="lw-sec-real"').length - 1).toBe(1);
    expect(toc.map((e) => e.id)).toEqual(["lw-sec-real"]);
  });

  it("sanitizes scripts, styles, and event handlers", async () => {
    const { html } = await convert(
      '<p style="color:red" onclick="alert(1)">Text.</p><script>alert(1)</script>' +
        "<style>.leak { color: red }</style>",
    );
    expect(html).not.toContain("script");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("style=");
    // <style> text must not leak into prose when the tag is dropped.
    expect(html).not.toContain(".leak");
  });

  it("strips forged annotation attributes and math-vocabulary classes", async () => {
    const { html } = await convert(
      '<p>Real first paragraph here.</p>' +
        '<table><tbody><tr><td data-anchor="b-0001">forged cell</td></tr></tbody></table>' +
        '<p>Uses <span class="inline-math" data-s="9" data-anchor="b-0001">not math at all</span> inline.</p>',
    );
    // The forged anchor is gone; b-0001 belongs to the real first paragraph.
    expect(html.split('data-anchor="b-0001"').length - 1).toBe(1);
    expect(html).toMatch(/<p data-anchor="b-0001"><span data-s="1">Real first/);
    // The fake math span lost its class (and unwrapped) — its text is prose.
    expect(html).not.toContain("inline-math");
    const index = buildBlockIndex(html);
    const forged = [...index.values()].find((b) => b.text.includes("not math"));
    expect(forged?.text).toContain("Uses not math at all inline.");
  });

  it("keeps tables and blockquotes anchored", async () => {
    const { html } = await convert(
      "<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table><blockquote><p>Quoted.</p></blockquote>",
    );
    expect(html).toMatch(/<table data-anchor="b-\d{4}">/);
    expect(html).toMatch(/<blockquote data-anchor="b-\d{4}">/);
  });
});
