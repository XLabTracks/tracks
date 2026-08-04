import { describe, expect, it } from "vitest";
import {
  citedKeysInOrder,
  formatBibEntry,
  parseBibDatabase,
  synthesizeThebibliography,
} from "./bibtex";

const SAMPLE = `
@inproceedings{greenblatt2024ai,
  title     = {AI Control: Improving Safety Despite Intentional Subversion},
  author    = {Greenblatt, Ryan and Shlegeris, Buck and Sachan, Kshitij and Roger, Fabien},
  booktitle = {Proceedings of the 41st International Conference on Machine Learning},
  pages     = {16295--16336},
  year      = {2024}
}

@article{bhatt2025ctrl,
  title   = {Ctrl-Z: Controlling AI Agents via Resampling},
  author  = {Bhatt, Aryan and Rushing, Cody and Shlegeris, Buck},
  journal = {arXiv preprint arXiv:2504.10374},
  year    = {2025}
}

@article{kutasov2025shade,
  title   = {SHADE-Arena},
  author  = {Kutasov, Jonathan and Sun, Yuqi and others},
  journal = {arXiv preprint arXiv:2506.15740},
  year    = {2025}
}
`;

describe("parseBibDatabase", () => {
  it("parses entry types, keys, and fields", () => {
    const db = parseBibDatabase(SAMPLE);
    expect([...db.keys()]).toEqual([
      "greenblatt2024ai",
      "bhatt2025ctrl",
      "kutasov2025shade",
    ]);
    const gb = db.get("greenblatt2024ai")!;
    expect(gb.type).toBe("inproceedings");
    expect(gb.fields.title).toBe(
      "AI Control: Improving Safety Despite Intentional Subversion",
    );
    expect(gb.fields.pages).toBe("16295--16336");
    expect(gb.fields.year).toBe("2024");
  });

  it("accepts quoted values and () entry delimiters", () => {
    const db = parseBibDatabase(
      `@article(k1, title = "A Quoted {Title}", year = 2020, author = "Doe, Jane")`,
    );
    const e = db.get("k1")!;
    expect(e.fields.title).toBe("A Quoted {Title}");
    expect(e.fields.year).toBe("2020");
    expect(e.fields.author).toBe("Doe, Jane");
  });

  it("keeps the first definition of a duplicated key", () => {
    const db = parseBibDatabase(
      `@article{k, title={First}, year={2020}}\n@article{k, title={Second}, year={2021}}`,
    );
    expect(db.get("k")!.fields.title).toBe("First");
  });

  it("skips @comment / @string / @preamble blocks", () => {
    const db = parseBibDatabase(
      `@comment{ this is ignored }\n@string{ j = "Journal" }\n@article{real, title={T}, year={2020}}`,
    );
    expect([...db.keys()]).toEqual(["real"]);
  });

  it("does not throw on malformed input", () => {
    expect(() => parseBibDatabase("@article{broken, title = {unterminated")).not.toThrow();
    expect(() => parseBibDatabase("garbage @ not an entry {}{}")).not.toThrow();
  });
});

describe("citedKeysInOrder", () => {
  it("returns unique keys in first-appearance order across cite variants", () => {
    const tex =
      "a \\citep{b, a} then \\citet{c} and \\cite{a} again \\citeauthor{d}";
    expect(citedKeysInOrder(tex)).toEqual(["b", "a", "c", "d"]);
  });

  it("handles pre/post notes and starred forms", () => {
    const tex = "\\citep[see][p.~3]{x} \\citep*{y}";
    expect(citedKeysInOrder(tex)).toEqual(["x", "y"]);
  });

  it("ignores citations inside comments", () => {
    const tex = "real \\cite{keep}\n% dead \\cite{drop}";
    expect(citedKeysInOrder(tex)).toEqual(["keep"]);
  });
});

describe("formatBibEntry", () => {
  it("formats an inproceedings entry", () => {
    const db = parseBibDatabase(SAMPLE);
    expect(formatBibEntry(db.get("greenblatt2024ai")!)).toBe(
      "Ryan Greenblatt, Buck Shlegeris, Kshitij Sachan and Fabien Roger. " +
        "AI Control: Improving Safety Despite Intentional Subversion. " +
        "In Proceedings of the 41st International Conference on Machine Learning, " +
        "pages 16295–16336. 2024.",
    );
  });

  it("formats an article and renders 'others' as et al.", () => {
    const db = parseBibDatabase(SAMPLE);
    expect(formatBibEntry(db.get("kutasov2025shade")!)).toBe(
      "Jonathan Kutasov, Yuqi Sun, et al. SHADE-Arena. " +
        "arXiv preprint arXiv:2506.15740. 2025.",
    );
  });

  it("includes volume/number/pages for a journal article", () => {
    const db = parseBibDatabase(
      `@article{k, author={Doe, Jane}, title={T}, journal={J Foo}, volume={12}, number={3}, pages={45--67}, year={2020}}`,
    );
    expect(formatBibEntry(db.get("k")!)).toBe(
      "Jane Doe. T. J Foo 12(3):45–67. 2020.",
    );
  });

  it("escapes a bare % so it cannot open a comment", () => {
    const db = parseBibDatabase(
      `@article{k, author={Doe, J.}, title={Up 50% Yearly}, year={2020}}`,
    );
    expect(formatBibEntry(db.get("k")!)).toContain("50\\% Yearly");
  });

  it("escapes BOTH percents in %% (and leaves \\% alone)", () => {
    const db = parseBibDatabase(
      `@article{k, author={Doe, J.}, title={Gains of 50%% over a \\% baseline}, year={2020}}`,
    );
    const out = formatBibEntry(db.get("k")!);
    expect(out).toContain("50\\%\\% over a \\% baseline");
    expect(out).toContain("2020"); // nothing after the %% got comment-swallowed
  });

  it("falls back to arXiv eprint / url for venue-less @misc entries", () => {
    const db = parseBibDatabase(
      `@misc{e, author={Doe, J.}, title={T}, eprint={2301.00001}, archiveprefix={arXiv}, year={2023}}
       @online{u, author={Doe, J.}, title={Blog Post}, url={https://example.com/post}, year={2023}}`,
    );
    expect(formatBibEntry(db.get("e")!)).toContain("arXiv:2301.00001");
    expect(formatBibEntry(db.get("u")!)).toContain("https://example.com/post");
  });

  it("keeps brace-protected corporate authors intact across ' and '", () => {
    const db = parseBibDatabase(
      `@misc{k, author={{Center for AI Safety and Security} and Doe, Jane}, title={T}, year={2024}}`,
    );
    expect(formatBibEntry(db.get("k")!)).toContain(
      "{Center for AI Safety and Security} and Jane Doe",
    );
  });

  it("handles the three-part 'Last, Jr, First' name form", () => {
    const db = parseBibDatabase(
      `@article{k, author={Ford, Jr., Henry}, title={T}, journal={J}, year={1950}}`,
    );
    expect(formatBibEntry(db.get("k")!)).toContain("Henry Ford, Jr.");
  });
});

describe("synthesizeThebibliography", () => {
  it("emits only cited entries, in the given order", () => {
    const out = synthesizeThebibliography(SAMPLE, [
      "bhatt2025ctrl",
      "greenblatt2024ai",
    ])!;
    expect(out.startsWith("\\begin{thebibliography}{2}")).toBe(true);
    expect(out.trimEnd().endsWith("\\end{thebibliography}")).toBe(true);
    const firstItem = out.indexOf("\\bibitem{bhatt2025ctrl}");
    const secondItem = out.indexOf("\\bibitem{greenblatt2024ai}");
    expect(firstItem).toBeGreaterThan(-1);
    expect(secondItem).toBeGreaterThan(firstItem);
    expect(out).not.toContain("kutasov2025shade");
  });

  it("skips unknown keys rather than emitting a bibitem for them", () => {
    const out = synthesizeThebibliography(SAMPLE, ["ghost", "bhatt2025ctrl"])!;
    expect(out).not.toContain("ghost");
    expect(out).toContain("\\bibitem{bhatt2025ctrl}");
    expect(out).toContain("{1}"); // one real entry
  });

  it("returns null when no cited key matches the database", () => {
    expect(synthesizeThebibliography(SAMPLE, ["nope"])).toBeNull();
    expect(synthesizeThebibliography(SAMPLE, [])).toBeNull();
  });
});
