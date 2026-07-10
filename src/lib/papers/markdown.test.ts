import { describe, expect, it } from "vitest";
import { toHtml } from "hast-util-to-html";
import { markdownBlocksToHast, markdownInlineToHast } from "./markdown";

const htmlOf = (nodes: ReturnType<typeof markdownBlocksToHast>) =>
  toHtml({ type: "root", children: nodes });

describe("markdownBlocksToHast", () => {
  it("renders CommonMark blocks", () => {
    const html = htmlOf(
      markdownBlocksToHast("A **bold** [link](https://x.test) and `code`.\n\n- one\n- two"),
    );
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain('<a href="https://x.test">link</a>');
    expect(html).toContain("<code>code</code>");
    expect(html).toContain("<li>two</li>");
  });

  it("renders inline and display math with KaTeX", () => {
    const html = htmlOf(
      markdownBlocksToHast("Inline $h_t$ and\n\n$$\nE = mc^2\n$$"),
    );
    expect(html).toContain("katex");
    expect(html).not.toContain("$h_t$");
    expect(html).toContain("katex-display");
  });

  it("never passes raw HTML through", () => {
    const html = htmlOf(markdownBlocksToHast("Try <script>alert(1)</script> this"));
    expect(html).not.toContain("<script>");
    expect(html).toContain("alert(1)"); // survives as plain text only
  });
});

describe("markdownInlineToHast", () => {
  it("unwraps a single paragraph to inline children", () => {
    const nodes = markdownInlineToHast("*An aside* with $x^2$.");
    expect(nodes).not.toBeNull();
    const html = htmlOf(nodes!);
    expect(html).toContain("<em>An aside</em>");
    expect(html).toContain("katex");
    expect(html).not.toContain("<p>");
  });

  it("rejects multi-block and non-paragraph input", () => {
    expect(markdownInlineToHast("One.\n\nTwo.")).toBeNull();
    expect(markdownInlineToHast("# Heading")).toBeNull();
    expect(markdownInlineToHast("- list item")).toBeNull();
  });
});
