import { describe, expect, it } from "vitest";
import { parseBib, synthesizeBibliography } from "./bib";
import { resolveMainTex } from "./main-tex";

const enc = (s: string) => new TextEncoder().encode(s);

function filesFrom(entries: Record<string, string>): Map<string, Uint8Array> {
  return new Map(Object.entries(entries).map(([k, v]) => [k, enc(v)]));
}

describe("parseBib", () => {
  it("reads braced, quoted, and bare field values", () => {
    const entries = parseBib(
      `@article{key1,
         title = {A {Nested} Title},
         author = "Ada Lovelace",
         year = 1843,
       }`,
    );
    expect(entries).toHaveLength(1);
    expect(entries[0].key).toBe("key1");
    expect(entries[0].fields.title).toBe("A {Nested} Title");
    expect(entries[0].fields.author).toBe("Ada Lovelace");
    expect(entries[0].fields.year).toBe("1843");
  });

  it("skips @comment/@preamble/@string blocks and stray text", () => {
    const entries = parseBib(
      `stray prose
       @comment{ignore me {even nested} }
       @string{venue = "Somewhere"}
       @misc{only, title={Kept}, year={2020}}`,
    );
    expect(entries.map((e) => e.key)).toEqual(["only"]);
  });
});

describe("synthesizeBibliography", () => {
  it("formats authors, venue, year, and url plainnat-style", () => {
    const out = synthesizeBibliography(
      parseBib(
        `@inproceedings{b,
           author = {Lovelace, Ada and Babbage, Charles},
           title = {On Engines},
           booktitle = {Proceedings of Analytical Engines},
           year = {1843},
           url = {https://example.org/engines},
         }`,
      ),
    );
    expect(out).toContain("\\begin{thebibliography}{1}");
    expect(out).toContain("\\bibitem{b}");
    expect(out).toContain("Ada Lovelace and Charles Babbage.");
    expect(out).toContain("In Proceedings of Analytical Engines, 1843.");
    expect(out).toContain("\\url{https://example.org/engines}.");
  });

  it("derives arXiv venue and url from eprint fields", () => {
    const out = synthesizeBibliography(
      parseBib(
        `@misc{m,
           author = {One Author},
           title = {Preprint Thing},
           year = {2024},
           eprint = {2401.00001},
           archivePrefix = {arXiv},
         }`,
      ),
    );
    expect(out).toContain("arXiv preprint arXiv:2401.00001, 2024.");
    expect(out).toContain("\\url{https://arxiv.org/abs/2401.00001}.");
  });

  it("alphabetizes entries by author", () => {
    const out = synthesizeBibliography(
      parseBib(
        `@misc{z, author={Zeno Zed}, title={Last}, year={2020}}
         @misc{a, author={Abe Abel}, title={First}, year={2020}}`,
      ),
    );
    expect(out.indexOf("\\bibitem{a}")).toBeLessThan(out.indexOf("\\bibitem{z}"));
  });
});

describe("spliceBbl .bib fallback", () => {
  const bib = `@misc{solo, author={Solo Author}, title={The Only Work}, year={2021}}`;

  it("synthesizes references when the .bbl is missing but the .bib exists", () => {
    const result = resolveMainTex(
      filesFrom({
        "main.tex":
          "\\documentclass{article}\\begin{document}x \\cite{solo}\n" +
          "\\bibliography{references}\\end{document}",
        "references.bib": bib,
      }),
    );
    expect(result?.texSource).toContain("\\begin{thebibliography}{1}");
    expect(result?.texSource).toContain("\\bibitem{solo}");
    expect(result?.warnings).toContain(
      "no .bbl in archive; references synthesized from .bib",
    );
  });

  it("still prefers a real .bbl when present", () => {
    const result = resolveMainTex(
      filesFrom({
        "main.tex":
          "\\documentclass{article}\\begin{document}x\n" +
          "\\bibliography{references}\\end{document}",
        "main.bbl":
          "\\begin{thebibliography}{1}\\bibitem{real} Real Entry.\\end{thebibliography}",
        "references.bib": bib,
      }),
    );
    expect(result?.texSource).toContain("\\bibitem{real}");
    expect(result?.texSource).not.toContain("\\bibitem{solo}");
  });

  it("keeps the missing-bbl warning when there is no .bib either", () => {
    const result = resolveMainTex(
      filesFrom({
        "main.tex":
          "\\documentclass{article}\\begin{document}x\n" +
          "\\bibliography{references}\\end{document}",
      }),
    );
    expect(result?.warnings).toContain(
      "\\bibliography used but no matching .bbl in archive",
    );
  });
});
