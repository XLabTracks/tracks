import { describe, expect, it } from "vitest";
import { convertLatexToHtml } from "../convert";
import { parseArxivId } from "../id";
import { parseForestBody } from "./forest";

const id = parseArxivId("2301.12345v1")!;

function convert(tex: string) {
  return convertLatexToHtml(tex, { id, files: new Map() });
}

const DOC = (body: string) =>
  `\\documentclass{article}\\begin{document}\n${body}\n\\end{document}`;

// The exploration-hacking paper's taxonomy tree (2604.28182v1, Figure 2) —
// the motivating real-world instance of the handled subset.
const TAXONOMY = String.raw`
  for tree={
    draw=black!80,
    thick,
    rounded corners=2pt,
    top color=white,
    bottom color=gray!5,
    font=\small\sffamily,
    align=center,
    inner sep=6pt,
    edge={thick, -latex},
    l sep+=0.2cm,
    s sep+=0.4cm,
  }
  [ {\textbf{EXPLORATION HACKING}}
    [ {\textbf{1. Complete}\\\textbf{under-exploration}}
      [ {Reward does not\\meaningfully increase.},
        font=\footnotesize,
        bottom color=white,
        dashed,
        tier=outcome
      ]
    ]
    [ {\textbf{2. Partial}\\\textbf{under-exploration}}
      [ {\textbf{2a. Instrumental}}
        [ {Reward increases;\\converges to lower reward\\than benign baseline.},
          font=\footnotesize,
          bottom color=white,
          dashed,
          tier=outcome
        ]
      ]
      [ {\textbf{2b. Terminal}}
        [ {Reward increases;\\may converge to benign-baseline reward\\but with model preferred behavior.},
          font=\footnotesize,
          bottom color=white,
          dashed,
          tier=outcome
        ]
      ]
    ]
  ]
`;

describe("parseForestBody", () => {
  it("parses the taxonomy tree: shape, labels, and dashed leaves", () => {
    const root = parseForestBody(TAXONOMY);
    expect(root).not.toBeNull();
    expect(root!.label).toBe(String.raw`\textbf{EXPLORATION HACKING}`);
    expect(root!.dashed).toBe(false);
    expect(root!.children).toHaveLength(2);

    const [complete, partial] = root!.children;
    expect(complete.label).toContain("1. Complete");
    expect(complete.children).toHaveLength(1);
    expect(complete.children[0].dashed).toBe(true);
    expect(complete.children[0].label).toContain("Reward does not");

    expect(partial.children.map((c) => c.label)).toEqual([
      String.raw`\textbf{2a. Instrumental}`,
      String.raw`\textbf{2b. Terminal}`,
    ]);
    expect(partial.children[0].children[0].dashed).toBe(true);
  });

  it("handles bare labels with options and no preamble", () => {
    const root = parseForestBody("[root [left, dashed] [right]]");
    expect(root!.label).toBe("root");
    expect(root!.children[0]).toMatchObject({ label: "left", dashed: true });
    expect(root!.children[1]).toMatchObject({ label: "right", dashed: false });
  });

  it("returns null on unbalanced input", () => {
    expect(parseForestBody("for tree={x} [ {a} [ {b} ]")).toBeNull();
    expect(parseForestBody("no brackets here")).toBeNull();
  });
});

describe("forest environment conversion", () => {
  it("renders a forest env as a nested HTML tree without phantom anchors", () => {
    const { html } = convert(
      DOC(
        "Before.\n\n" +
          `\\begin{forest}${TAXONOMY}\\end{forest}\n\n` +
          "After.",
      ),
    );
    expect(html).toContain("ax-forest");
    expect(html).toContain("EXPLORATION HACKING");
    expect(html).toContain("ax-forest-dashed");
    // Preamble options must not leak into the rendered tree.
    expect(html).not.toContain("rounded corners");
    expect(html).not.toContain("tier=outcome");
    // Only the two paragraphs are anchored — the tree mints no blocks.
    expect(html.match(/data-anchor/g)).toHaveLength(2);
  });

  it("falls back to the source dump when the tree does not parse", () => {
    const { html, warnings } = convert(
      DOC("\\begin{forest}[ {open} [\\end{forest}"),
    );
    expect(html).toContain('class="environment forest"');
    expect(warnings.some((w) => w.code === "forest")).toBe(true);
  });
});
