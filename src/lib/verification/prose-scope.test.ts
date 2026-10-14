import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC = join(__dirname, "../../../public/verification");

const STANDALONE_SHEETS = ["page.css", "platform.css"];

function selectorsIn(css: string): string[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  for (const match of withoutComments.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    for (const selector of match[1].split(",")) {
      const trimmed = selector.trim();
      if (trimmed && !trimmed.startsWith("@")) out.push(trimmed);
    }
  }
  return out;
}

describe("the standalone pages' `prose` cannot reach the lesson column", () => {
  for (const sheet of STANDALONE_SHEETS) {
    it(`${sheet} scopes every .prose rule to .wrap`, () => {
      const css = readFileSync(join(PUBLIC, sheet), "utf8");
      const unscoped = selectorsIn(css).filter(
        (selector) => /(^|[\s>+~])\.prose\b/.test(selector) && !selector.includes(".wrap"),
      );
      expect(unscoped).toEqual([]);
    });
  }

  it("still gives those pages their reading measure", () => {
    const css = readFileSync(join(PUBLIC, "page.css"), "utf8");
    expect(css).toMatch(/\.wrap \.prose \{[^}]*max-width:\s*66ch/);
  });
});
