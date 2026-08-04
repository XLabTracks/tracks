import { describe, expect, it } from "vitest";
import { collapseTailSections } from "./collapse-tail";

const REFS =
  '<section class="ax-references" id="ax-references"><h2 data-anchor="b-9">References</h2><ol><li id="ax-bib-1">One</li></ol></section>';
const FOOTNOTES =
  '<section class="ax-footnotes" id="ax-footnotes"><h2 data-anchor="b-12">Footnotes</h2><ol><li id="ax-fn-1">Note</li></ol></section>';

describe("collapseTailSections", () => {
  it("returns fragments without landmarks byte-identical", () => {
    const html = '<h2 id="ax-sec-intro">Intro</h2><p>Body</p>';
    expect(collapseTailSections(html)).toBe(html);
  });

  it("wraps a landmark section's content in closed details with the heading as summary", () => {
    const out = collapseTailSections(`<p>Body</p>${REFS}`);
    expect(out).toContain(
      '<section class="ax-references" id="ax-references"><details class="ax-collapse"><summary><h2 data-anchor="b-9">References</h2></summary>',
    );
    expect(out).not.toContain("<details open");
    expect(out).toContain("</details></section>");
    expect(out.startsWith("<p>Body</p>")).toBe(true);
  });

  it("collapses flat h2 sections only after a references landmark", () => {
    const appendix =
      '<h2 id="ax-sec-glossary" data-anchor="b-20">Glossary</h2><p>Terms</p><h3 id="ax-sec-sub">Sub</h3><p>More</p>';
    const out = collapseTailSections(
      `<h2 id="ax-sec-intro">Intro</h2><p>Body</p>${REFS}${appendix}${FOOTNOTES}`,
    );
    // Body section before references stays flat.
    expect(out).toContain('<h2 id="ax-sec-intro">Intro</h2><p>Body</p>');
    // The appendix run wraps as one details per h2, keeping h3 inside.
    expect(out).toContain(
      '<details class="ax-collapse"><summary><h2 id="ax-sec-glossary" data-anchor="b-20">Glossary</h2></summary><p>Terms</p><h3 id="ax-sec-sub">Sub</h3><p>More</p></details>',
    );
    // Both landmarks wrap too.
    expect(out.match(/<details class="ax-collapse">/g)?.length).toBe(3);
  });

  it("collapses a footnotes landmark without any references section", () => {
    const out = collapseTailSections(
      `<p>Post body</p><section class="lw-footnotes" id="lw-footnotes"><h2>Footnotes</h2><ol><li>n</li></ol></section>`,
    );
    expect(out.match(/<details class="ax-collapse">/g)?.length).toBe(1);
    expect(out).toContain("<summary><h2>Footnotes</h2></summary>");
  });
});
