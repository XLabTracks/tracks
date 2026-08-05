import { describe, expect, it } from "vitest";
import { convertLatexToHtml } from "./convert";
import { parseArxivId } from "./id";
import { readTcbOption } from "./transforms/macros";
import {
  collectListingEnvironments,
  rewriteCustomListingEnvironments,
} from "./transforms/verbatim";

const id = parseArxivId("2301.12345v1")!;

function convert(tex: string) {
  return convertLatexToHtml(tex, { id, files: new Map() });
}

describe("collectListingEnvironments", () => {
  it("collects \\newtcblisting with a leading [init options] group", () => {
    const defs = collectListingEnvironments(
      "\\newtcblisting[auto counter]{mycode}{listing only, colback=gray!5}",
    );
    expect(defs).toEqual([{ name: "mycode", slots: [] }]);
  });

  it("reads [nargs][default] slots after the init options", () => {
    const defs = collectListingEnvironments(
      "\\newtcblisting[auto counter]{mycode}[2][style]{listing only, #1 #2}",
    );
    expect(defs).toEqual([{ name: "mycode", slots: ["o", "m"] }]);
  });

  it("tolerates a leading optional on \\lstnewenvironment", () => {
    const defs = collectListingEnvironments(
      "\\lstnewenvironment[x]{code}[1][py]{\\lstset{language=#1}}{}",
    );
    expect(defs).toEqual([{ name: "code", slots: ["o"] }]);
  });

  it("still collects the plain (no leading optional) forms", () => {
    const defs = collectListingEnvironments(
      "\\newtcblisting{tcb}{listing only}\n" +
        "\\lstnewenvironment{lst}{\\lstset{}}{}\n" +
        "\\DeclareTCBListing{listingsbox}{O{}m!O{}}{listing only}",
    );
    expect(defs).toEqual([
      { name: "tcb", slots: [] },
      { name: "lst", slots: [] },
      { name: "listingsbox", slots: ["o", "m", "o"] },
    ]);
  });
});

describe("rewriteCustomListingEnvironments", () => {
  const DECL = "\\newtcblisting[auto counter]{mycode}{listing only}\n";

  it("rewrites uses of a leading-init-options declaration", () => {
    const out = rewriteCustomListingEnvironments(
      DECL + "\\begin{mycode}\necho \"$HOME\"\n\\end{mycode}",
    );
    expect(out).toContain("\\begin{lstlisting}\necho \"$HOME\"\n\\end{lstlisting}");
    expect(out).not.toContain("\\begin{mycode}");
  });

  it("leaves occurrences inside lstlisting bodies as displayed code", () => {
    const src =
      DECL +
      "\\begin{lstlisting}\nTo close: \\end{mycode} then \\begin{mycode}\n\\end{lstlisting}\n" +
      "\\begin{mycode}\nreal code\n\\end{mycode}";
    const out = rewriteCustomListingEnvironments(src);
    // The displayed tokens are untouched…
    expect(out).toContain(
      "\\begin{lstlisting}\nTo close: \\end{mycode} then \\begin{mycode}\n\\end{lstlisting}",
    );
    // …while the genuine use after the listing still rewrites.
    expect(out).toContain("\\begin{lstlisting}\nreal code\n\\end{lstlisting}");
  });

  it("skips verbatim and filecontents bodies too", () => {
    const src =
      DECL +
      "\\begin{verbatim}\n\\begin{mycode}\n\\end{verbatim}\n" +
      "\\begin{filecontents}{f.tex}\n\\end{mycode}\n\\end{filecontents}";
    expect(rewriteCustomListingEnvironments(src)).toBe(src);
  });

  it("treats a custom listing body itself as verbatim", () => {
    const src =
      DECL +
      "\\newtcblisting{othercode}{listing only}\n" +
      "\\begin{mycode}\nshows \\begin{othercode} literally\n\\end{mycode}";
    const out = rewriteCustomListingEnvironments(src);
    expect(out).toContain(
      "\\begin{lstlisting}\nshows \\begin{othercode} literally\n\\end{lstlisting}",
    );
  });

  it("ignores commented-out begins when tracking verbatim regions", () => {
    const src =
      DECL +
      "% \\begin{verbatim}\n" +
      "\\begin{mycode}\ncode\n\\end{mycode}";
    const out = rewriteCustomListingEnvironments(src);
    expect(out).toContain("\\begin{lstlisting}\ncode\n\\end{lstlisting}");
  });

  it("still consumes declared begin args on the rewritten use", () => {
    const src =
      "\\DeclareTCBListing{listingsbox}{O{}m!O{}}{listing only}\n" +
      "\\begin{listingsbox}[colback=white]{Title text}[right]\nbody\n\\end{listingsbox}";
    const out = rewriteCustomListingEnvironments(src);
    expect(out).toContain("\\begin{lstlisting}\nbody\n\\end{lstlisting}");
    expect(out).not.toContain("Title text");
  });
});

describe("readTcbOption", () => {
  it("keeps commas inside braced values", () => {
    expect(
      readTcbOption("enhanced,title={Key claim, restated},colback=red", "title"),
    ).toBe("Key claim, restated");
  });

  it("ignores keys nested inside braced values", () => {
    expect(
      readTcbOption("boxed title style={boxrule=1pt, title=x},colback=red", "title"),
    ).toBeNull();
  });

  it("reads bare values up to the next comma", () => {
    expect(readTcbOption("title=Hi there,colback=red", "title")).toBe("Hi there");
  });

  it("tolerates the wrapping brackets of a raw option group", () => {
    expect(readTcbOption("[colframe=blue, title=Hi]", "title")).toBe("Hi");
  });

  it("matches whole keys only", () => {
    expect(readTcbOption("coltitle=black", "title")).toBeNull();
    expect(readTcbOption("colback=blue!10,title=x", "colback")).toBe("blue!10");
  });
});

describe("tcolorbox titles through the full converter", () => {
  const DOC = (body: string) =>
    `\\documentclass{article}\\begin{document}\n${body}\n\\end{document}`;

  it("keeps a braced comma title whole on the \\newtcolorbox path", () => {
    const { html } = convert(
      "\\documentclass{article}" +
        "\\newtcolorbox{claimbox}[1][]{title={Key claim, restated},#1}" +
        "\\begin{document}\\begin{claimbox}Body.\\end{claimbox}\\end{document}",
    );
    expect(html).toContain(">Key claim, restated</div>");
    expect(html).toContain("Body.");
  });

  it("fabricates no chip from a nested title= on the \\newtcolorbox path", () => {
    const { html } = convert(
      "\\documentclass{article}" +
        "\\newtcolorbox{plainbox}[1][]{boxed title style={boxrule=1pt, title=x},#1}" +
        "\\begin{document}\\begin{plainbox}Plain body.\\end{plainbox}\\end{document}",
    );
    expect(html).not.toContain("ax-box-title");
    expect(html).toContain("Plain body.");
  });

  it("fabricates no chip from a nested title= on the direct tcolorbox path", () => {
    const { html } = convert(
      DOC(
        "\\begin{tcolorbox}[boxed title style={boxrule=1pt, title=x}]" +
          "Plain body.\\end{tcolorbox}",
      ),
    );
    expect(html).not.toContain("ax-box-title");
    expect(html).toContain("Plain body.");
  });

  it("keeps an odd-$ code body verbatim behind a leading-init-options \\newtcblisting", () => {
    const { html } = convert(
      "\\documentclass{article}" +
        "\\newtcblisting[auto counter]{mycode}{listing only}" +
        "\\begin{document}\nIntro.\n" +
        "\\begin{mycode}\necho \"$HOME\"\n\\end{mycode}\n" +
        "\\section{Appendix}\nAppendix body.\n\\end{document}",
    );
    // The declaration is stripped and the use is verbatim — the odd $ must
    // not desync environment pairing and swallow the appendix.
    expect(html).toContain("$HOME");
    expect(html).toContain("Appendix body.");
    expect(html).not.toContain("listing only");
    expect(html).not.toContain("auto counter");
  });
});
