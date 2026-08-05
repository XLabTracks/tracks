import { describe, expect, it } from "vitest";
import { collapseTailSections } from "./collapse-tail";

const REFS =
  '<section class="ax-references" id="ax-references"><h2 data-anchor="b-9">References</h2><ol><li id="ax-bib-1">One</li></ol></section>';
const FOOTNOTES =
  '<section class="ax-footnotes" id="ax-footnotes"><h2 data-anchor="b-12">Footnotes</h2><ol><li id="ax-fn-1">Note</li></ol></section>';

describe("collapseTailSections", () => {
  it("returns fragments without landmarks byte-identical", () => {
    const html = '<h2 id="ax-sec-intro">Intro</h2><p>Body</p>';
    expect(collapseTailSections(html)).toEqual({ html, sawReferences: false });
  });

  it("wraps a landmark section's content in closed details with the heading as summary", () => {
    const { html: out, sawReferences } = collapseTailSections(
      `<p>Body</p>${REFS}`,
    );
    expect(out).toContain(
      '<section class="ax-references" id="ax-references"><details class="ax-collapse"><summary><h2 data-anchor="b-9">References</h2></summary>',
    );
    expect(out).not.toContain("<details open");
    expect(out).toContain("</details></section>");
    expect(out.startsWith("<p>Body</p>")).toBe(true);
    expect(sawReferences).toBe(true);
  });

  it("collapses flat h2 sections only after a references landmark", () => {
    const appendix =
      '<h2 id="ax-sec-glossary" data-anchor="b-20">Glossary</h2><p>Terms</p><h3 id="ax-sec-sub">Sub</h3><p>More</p>';
    const { html: out } = collapseTailSections(
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
    const { html: out, sawReferences } = collapseTailSections(
      `<p>Post body</p><section class="lw-footnotes" id="lw-footnotes"><h2>Footnotes</h2><ol><li>n</li></ol></section>`,
    );
    expect(out.match(/<details class="ax-collapse">/g)?.length).toBe(1);
    expect(out).toContain("<summary><h2>Footnotes</h2></summary>");
    // Footnotes alone don't start an appendix run.
    expect(sawReferences).toBe(false);
  });

  it("threads the references-seen flag across sequential parts", () => {
    // An activity spliced after References splits the document: part 1 ends
    // with the landmark, part 2 is the appendix run alone.
    const part1 = collapseTailSections(`<p>Body</p>${REFS}`);
    expect(part1.sawReferences).toBe(true);
    const appendix =
      '<h2 id="ax-sec-a">Appendix A</h2><p>Proofs</p><h2 id="ax-sec-b">Appendix B</h2><p>Tables</p>';
    // A fresh walk (no flag) leaves the flat run untouched…
    expect(collapseTailSections(appendix)).toEqual({
      html: appendix,
      sawReferences: false,
    });
    // …the threaded flag collapses it as if the document were unsplit.
    const part2 = collapseTailSections(appendix, part1.sawReferences);
    expect(part2.html).toBe(
      '<details class="ax-collapse"><summary><h2 id="ax-sec-a">Appendix A</h2></summary><p>Proofs</p></details>' +
        '<details class="ax-collapse"><summary><h2 id="ax-sec-b">Appendix B</h2></summary><p>Tables</p></details>',
    );
    expect(part2.sawReferences).toBe(true);
  });

  it("keeps malformed input raw instead of looping on it", () => {
    // A final section closer whose ">" never arrives (truncated markup):
    // sectionEnd must report malformed, not end index 0 — the latter reset
    // the scan to the same landmark forever. This test hanging (or a
    // RangeError) is the regression signal.
    const html =
      '<p>Body</p><section class="ax-references"><h2>References</h2><ol><li>One</li></ol></section ';
    expect(collapseTailSections(html)).toEqual({ html, sawReferences: false });
    // Same guard with the flag threaded in: the remainder stays raw.
    expect(collapseTailSections(html, true)).toEqual({
      html,
      sawReferences: true,
    });
  });
});
