import fs from "node:fs";
import path from "node:path";
import { parse } from "@typescript-eslint/typescript-estree";
import { describe, expect, it } from "vitest";

const ROOTS = [
  "src/components/verification",
  "src/lib/verification",
  "src/content/verification",
  "src/content/lessons/verification",
];

const REQUIRED_DIRECTIVE =
  /^(?:\/\/|\/\*)\s*(?:eslint|@ts-|istanbul|c8\b|[#@]__PURE__|SPDX|copyright\b|license\b)/i;

function filesUnder(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) return filesUnder(file);
    return /\.(?:ts|tsx|mdx)$/.test(file) ? [file] : [];
  });
}

function commentsIn(file: string, source: string): string[] {
  if (file.endsWith(".mdx")) {
    return [...source.matchAll(/\{\/\*[\s\S]*?\*\/\}/g)].map(
      (match) => match[0]
    );
  }

  const syntaxTree = parse(source, {
    comment: true,
    jsx: file.endsWith(".tsx"),
  });
  return (syntaxTree.comments ?? []).map((comment) =>
    comment.type === "Line" ? `//${comment.value}` : `/*${comment.value}*/`
  );
}

describe("Verification source comment policy", () => {
  const files = ROOTS.flatMap(filesUnder);

  it("contains no Cyrillic text", () => {
    const violations = files.filter((file) =>
      /\p{Script=Cyrillic}/u.test(fs.readFileSync(file, "utf8"))
    );
    expect(violations).toEqual([]);
  });

  it("contains no unsolicited source comments", () => {
    const violations = files.flatMap((file) => {
      const source = fs.readFileSync(file, "utf8");
      return commentsIn(file, source)
        .filter((comment) => !REQUIRED_DIRECTIVE.test(comment))
        .map(
          (comment) => `${file}: ${comment.replace(/\s+/g, " ").slice(0, 120)}`
        );
    });
    expect(violations).toEqual([]);
  });
});
