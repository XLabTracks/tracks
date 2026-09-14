import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { extractSection } from "@/components/mdx/arxiv-paper";
import type { ConvertedPaper } from "./types";

/**
 * Every `<ArxivSection>` in a lesson must resolve against its committed
 * artifact.
 *
 * WHY THIS EXISTS. One of the eleven did not, and it shipped: 2.2's cloud
 * lesson asked for Appendix B of arXiv:2403.08501 up to `ax-references`, that
 * artifact has no id for its references section, and the component printed
 * "Section not found in the pinned paper." with a link out — on main, to
 * readers, with typecheck and the whole suite green. Nothing in the repo
 * walked these embeds, so a broken one was invisible until somebody scrolled
 * past it.
 *
 * It re-derives the embeds from the raw MDX rather than from any registry,
 * because there is no registry — the embeds are JSX in prose, and a list kept
 * beside them would be one more thing to forget. And it calls the component's
 * own `extractSection`, not a copy of it: a copy would drift and pass while
 * the page failed, which is the exact failure this test is here to prevent.
 */

const LESSONS = join(__dirname, "../../content/lessons");
const ARTIFACTS = join(__dirname, "../../content/arxiv");

function mdxFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => join(dir, f));
}

interface Embed {
  file: string;
  id: string;
  section: string;
  sectionEnd?: string;
}

function embedsIn(file: string): Embed[] {
  const src = readFileSync(file, "utf8");
  const out: Embed[] = [];
  for (const match of src.matchAll(/<ArxivSection\b([\s\S]*?)\/>/g)) {
    const attrs = match[1]!;
    const attr = (key: string) =>
      attrs.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
    const id = attr("id");
    const section = attr("section");
    if (!id || !section) continue;
    out.push({
      file: file.split("/lessons/")[1]!,
      id,
      section,
      sectionEnd: attr("sectionEnd"),
    });
  }
  return out;
}

const embeds = mdxFiles(LESSONS).flatMap(embedsIn);

const artifacts = new Map<string, { state: string; paper?: ConvertedPaper }>(
  readdirSync(ARTIFACTS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => [
      f.replace(/\.json$/, ""),
      JSON.parse(readFileSync(join(ARTIFACTS, f), "utf8")),
    ]),
);

describe("<ArxivSection> embeds", () => {
  it("finds embeds to check at all", () => {
    // A refactor that renames the component would otherwise make this suite
    // pass by having nothing to test.
    expect(embeds.length).toBeGreaterThanOrEqual(8);
  });

  it("names an artifact that is committed and built", () => {
    const bad = embeds
      .filter((e) => artifacts.get(e.id)?.state !== "ready")
      .map((e) => `${e.file} -> ${e.id} (${artifacts.get(e.id)?.state ?? "no artifact"})`);
    expect(bad).toEqual([]);
  });

  it("resolves every section against the pinned paper", () => {
    const broken: string[] = [];
    for (const e of embeds) {
      const artifact = artifacts.get(e.id);
      if (artifact?.state !== "ready" || !artifact.paper) continue;
      const html = extractSection(artifact.paper, e.section, e.sectionEnd);
      if (!html) {
        const inToc = artifact.paper.toc.some((t) => t.id === e.section);
        broken.push(
          `${e.file} -> ${e.id} section="${e.section}"` +
            (e.sectionEnd ? ` sectionEnd="${e.sectionEnd}"` : "") +
            ` (section in toc: ${inToc})`,
        );
      }
    }
    expect(broken, "these would render an error card to the reader").toEqual([]);
  });

  it("leaves no unbalanced wrapper in the slice", () => {
    // A slice that opens a div it never closes is what the reading slot gets
    // handed, and it took a passthrough wrapper for an unrecognised LaTeX
    // environment to produce one — the slot ended on a stray "UTF8gbsn",
    // which is a LaTeX argument the converter emitted as text. Counting is
    // enough here: these are converter-emitted fragments, not hand-written
    // markup, so a mismatch means a boundary landed inside an element.
    for (const e of embeds) {
      const artifact = artifacts.get(e.id);
      if (artifact?.state !== "ready" || !artifact.paper) continue;
      const html = extractSection(artifact.paper, e.section, e.sectionEnd);
      if (!html) continue;
      const open = (html.match(/<div\b/g) ?? []).length;
      const close = (html.match(/<\/div>/g) ?? []).length;
      expect(open, `${e.file} -> ${e.id} has ${open} <div> and ${close} </div>`).toBe(close);
    }
  });

  it("does not silently swallow the bibliography when a boundary is given", () => {
    // The boundary's whole job is to stop before something. If the slice runs
    // to the end of the document anyway, the boundary resolved to nothing
    // useful and the reader gets the paper's reference list inlined mid-lesson
    // — which is what the id/class fallback in boundaryOffset exists to stop.
    for (const e of embeds.filter((x) => x.sectionEnd)) {
      const artifact = artifacts.get(e.id);
      if (artifact?.state !== "ready" || !artifact.paper) continue;
      const html = extractSection(artifact.paper, e.section, e.sectionEnd)!;
      expect(
        html.includes('class="ax-references"'),
        `${e.file} -> ${e.id} still contains the reference list`,
      ).toBe(false);
    }
  });
});
