import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "@typescript-eslint/typescript-estree";
import { describe, expect, it } from "vitest";

/**
 * Touching `localStorage` THROWS — it is not a null-returning API — in a
 * browser that refuses site data for the origin (a privacy setting, a strict
 * private window, an extension). A throw inside a render or an effect goes to
 * the nearest error boundary, so an unguarded read of one remembered
 * preference replaces the page with "Something went wrong": the sidebar's
 * stored width did exactly that to the whole track layout, course and all, on
 * a page whose content needs no storage at all.
 *
 * Every other storage touch in the app already sits in a try/catch. This keeps
 * it that way, for the class rather than the one site.
 */
const ROOTS = ["src/components", "src/app", "src/lib"];
const STORAGE = /^(localStorage|sessionStorage|indexedDB)$/;

function filesUnder(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = join(root, entry.name);
    if (entry.isDirectory()) return filesUnder(file);
    return /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file) ? [file] : [];
  });
}

function unguardedIn(file: string): string[] {
  const source = readFileSync(file, "utf8");
  // Parsing every file under src takes seconds; only the handful that name a
  // storage API can offend, and a name is cheap to look for.
  if (!/localStorage|sessionStorage|indexedDB/.test(source)) return [];
  const tree = parse(source, {
    jsx: file.endsWith(".tsx"),
    loc: true,
  });
  const found: string[] = [];
  const walk = (node: unknown, guarded: boolean): void => {
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown> & { type?: string };
    if (n.type === "Identifier" && STORAGE.test(String(n.name)) && !guarded) {
      const line = (n as { loc?: { start: { line: number } } }).loc?.start.line;
      found.push(`${file}:${line}`);
    }
    // Only the try block is protected — a catch or finally that touches
    // storage throws out of the same statement.
    const inTry = n.type === "TryStatement" ? n.block : null;
    for (const value of Object.values(n)) {
      if (Array.isArray(value)) value.forEach((v) => walk(v, guarded));
      else if (value && typeof value === "object") {
        walk(value, guarded || value === inTry);
      }
    }
  };
  walk(tree, false);
  return found;
}

describe("browser storage never crashes a page", () => {
  it("every localStorage/sessionStorage access sits inside a try", () => {
    const offenders = ROOTS.flatMap(filesUnder).flatMap(unguardedIn);
    expect(offenders).toEqual([]);
  });
});
