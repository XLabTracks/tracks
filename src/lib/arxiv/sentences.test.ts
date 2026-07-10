import { describe, expect, it } from "vitest";
import type { Element, ElementContent, Properties } from "hast";
import { segmentInline } from "./sentences";
import { convertLatexToHtml } from "./convert";
import { parseArxivId } from "./id";

const text = (value: string): ElementContent => ({ type: "text", value });
const el = (
  tagName: string,
  properties: Properties = {},
  children: ElementContent[] = [],
): Element => ({ type: "element", tagName, properties, children });

/** Readable shape: sentence spans → "«…text…»", bare nodes → their text/tag. */
function shape(nodes: ElementContent[]): string[] {
  return nodes.map((node) => {
    if (node.type === "text") return JSON.stringify(node.value);
    if (node.type !== "element") return `<${node.type}>`;
    if (node.tagName === "span" && node.properties?.dataS !== undefined) {
      return `s${node.properties.dataS}«${textOf(node)}»`;
    }
    return `<${node.tagName}>`;
  });
}
function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

describe("segmentInline", () => {
  it("splits plain multi-sentence text, whitespace between spans", () => {
    const out = segmentInline([text("First one. Second one! Third?")]);
    expect(shape(out)).toEqual([
      's1«First one.»',
      '" "',
      's2«Second one!»',
      '" "',
      's3«Third?»',
    ]);
  });

  it("wraps single-sentence blocks (uniformity) and unterminated trailing text", () => {
    expect(shape(segmentInline([text("No terminal punctuation")]))).toEqual([
      "s1«No terminal punctuation»",
    ]);
    expect(shape(segmentInline([text("Done. trailing fragment")]))).toEqual([
      // "trailing" starts lowercase → not a boundary (under-split bias)
      "s1«Done. trailing fragment»",
    ]);
  });

  it("does not split on abbreviations", () => {
    const out = segmentInline([
      text("Vaswani et al. proposed it, e.g. in Fig. 2 and Eq. 4. Next sentence."),
    ]);
    expect(shape(out)).toEqual([
      "s1«Vaswani et al. proposed it, e.g. in Fig. 2 and Eq. 4.»",
      '" "',
      "s2«Next sentence.»",
    ]);
  });

  it("does not split on single-letter initials", () => {
    const out = segmentInline([text("Work by A. Vaswani and N. Shazeer. Follow-up came later.")]);
    expect(shape(out)).toEqual([
      "s1«Work by A. Vaswani and N. Shazeer.»",
      '" "',
      "s2«Follow-up came later.»",
    ]);
  });

  it("keeps inline elements (citations, math) opaque inside their sentence", () => {
    const cite = el("span", { className: ["ax-cite"] }, [text("[13]")]);
    const math = el("span", { className: ["inline-math"] }, [text("h_t. x")]);
    const out = segmentInline([
      text("Memory networks "),
      cite,
      text(" use states "),
      math,
      text(" heavily. Second sentence."),
    ]);
    expect(shape(out)).toEqual([
      "s1«Memory networks [13] use states h_t. x heavily.»",
      '" "',
      "s2«Second sentence.»",
    ]);
  });

  it("splits when the period directly follows a citation element", () => {
    // "…<cite>[35]</cite>. Numerous…" — empty prefix before the terminator
    const cite = el("span", { className: ["ax-cite"] }, [text("[35]")]);
    const out = segmentInline([text("Improved performance "), cite, text(". Numerous efforts followed.")]);
    expect(shape(out)).toEqual([
      "s1«Improved performance [35].»",
      '" "',
      "s2«Numerous efforts followed.»",
    ]);
  });

  it("splits when a sentence-final citation sits after the period", () => {
    // "…performance.<cite/> Numerous…" — pending terminator carries across the element
    const cite = el("span", { className: ["ax-cite"] }, [text("[35]")]);
    const out = segmentInline([text("Improved performance."), cite, text(" Numerous efforts followed.")]);
    expect(shape(out)).toEqual([
      "s1«Improved performance.[35]»",
      '" "',
      "s2«Numerous efforts followed.»",
    ]);
  });

  it("treats closing quotes/brackets as part of the sentence", () => {
    const out = segmentInline([text('They called it "attention." Later work agreed.')]);
    expect(shape(out)).toEqual([
      's1«They called it "attention."»',
      '" "',
      "s2«Later work agreed.»",
    ]);
  });

  it("flushes at hard block children and never wraps them", () => {
    const nested = el("p", { dataAnchor: "b-0044" }, [text("Inner para. Two sentences.")]);
    const out = segmentInline([text("Lead-in text. More lead."), nested, text("Tail text.")]);
    expect(shape(out)).toEqual([
      "s1«Lead-in text.»",
      '" "',
      "s2«More lead.»",
      "<p>",
      "s3«Tail text.»",
    ]);
  });

  it("passes whitespace-only content through bare", () => {
    const nested = el("p", {}, [text("X.")]);
    const out = segmentInline([text("\n  "), nested, text("\n")]);
    expect(shape(out)).toEqual(['"\\n  "', "<p>", '"\\n"']);
  });
});

describe("wrapSentences via full conversion", () => {
  const id = parseArxivId("2301.12345v1")!;
  const DOC = (body: string) =>
    `\\documentclass{article}\\begin{document}\n${body}\n\\end{document}`;

  it("stamps data-s on paragraphs and li, coexisting with KaTeX", () => {
    const { html } = convertLatexToHtml(
      DOC(
        [
          "\\section{Intro}",
          "First sentence with math $x^2$. Second sentence here.",
          "\\begin{itemize}\\item One item. Second thought.\\item Solo\\end{itemize}",
        ].join("\n"),
      ),
      { id, files: new Map() },
    );
    expect(html).toContain('data-s="1"');
    expect(html).toContain('data-s="2"');
    expect(html).toContain("katex"); // math rendered inside sentence spans
    // headings are never sentence-wrapped
    expect(html).not.toMatch(/<h2[^>]*>[^<]*<span data-s/);
  });

  it("paragraph-wraps abstract bodies so they are anchor- and sentence-addressable", () => {
    const { html } = convertLatexToHtml(
      DOC(
        "\\begin{abstract}First abstract sentence. Second one.\n\nSecond paragraph.\\end{abstract}\n\\section{Intro}\nBody.",
      ),
      { id, files: new Map() },
    );
    // both abstract paragraphs get anchors + sentence spans
    expect(html).toMatch(
      /<section class="ax-abstract"[^>]*><h2 data-anchor="b-0001">Abstract<\/h2><p data-anchor="b-0002"><span data-s="1">First abstract sentence\.<\/span>/,
    );
    expect(html).toMatch(/<p data-anchor="b-0003"><span data-s="1">Second paragraph\./);
  });

  it("does not split on theorem/equation abbreviations or dotted acronyms", () => {
    const out = segmentInline([
      text("By Thm. 2 and Eqn. 3, w.r.t. the norm, i.i.d. samples s.t. all hold. Next."),
    ]);
    expect(shape(out)).toEqual([
      "s1«By Thm. 2 and Eqn. 3, w.r.t. the norm, i.i.d. samples s.t. all hold.»",
      '" "',
      "s2«Next.»",
    ]);
  });

  it("keeps nested prose blocks independently numbered", () => {
    const { html } = convertLatexToHtml(
      DOC("\\begin{itemize}\\item Outer lead. \\par Inner paragraph. Two here.\\end{itemize}"),
      { id, files: new Map() },
    );
    // both the li and any nested p start their own s=1
    const matches = [...html.matchAll(/data-s="1"/g)];
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
