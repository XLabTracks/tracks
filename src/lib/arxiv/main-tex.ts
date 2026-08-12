/**
 * Locate the main .tex file of an extracted e-print and flatten it into a
 * single self-contained source: `\input`/`\include` spliced in, and the
 * compiled `.bbl` substituted for `\bibliography{...}` (arXiv never runs
 * bibtex — submitters must include the .bbl, so splicing it is exactly what
 * LaTeX itself does at that site). When only a `.bib` database is shipped (no
 * `.bbl`), a `thebibliography` is synthesized from it (see ./bibtex) so
 * citations still resolve instead of leaking raw keys.
 */

import { citedKeysInOrder, synthesizeThebibliography } from "./bibtex";

export interface MainTexResult {
  /** Flattened TeX source. */
  texSource: string;
  /** Path of the main file inside the archive. */
  mainFile: string;
  warnings: string[];
}

const MAX_INCLUDE_DEPTH = 10;
const PREFERRED_NAMES = new Set(["main.tex", "ms.tex", "paper.tex", "arxiv.tex"]);

// (?![a-zA-Z]) keeps \include from swallowing \includegraphics.
const INPUT_RE = /\\(input|include)(?![a-zA-Z])(?:\s*\{([^}]+)\}|\s+([^\s{}%\\]+))/g;
const BIBLIOGRAPHY_RE = /\\bibliography(?![a-zA-Z])\s*\{[^}]*\}/g;

export function resolveMainTex(
  files: Map<string, Uint8Array>,
): MainTexResult | null {
  const warnings: string[] = [];
  const mainFile = findMainTexPath(files, warnings);
  if (mainFile === null) return null;

  // Track the current include *stack* (not a global visited set): LaTeX allows
  // \input-ing the same file repeatedly (e.g. a notation table used in body and
  // appendix); only a file including an ancestor of itself is a real cycle.
  const stack = new Set<string>([mainFile]);
  let texSource = flattenFile(mainFile, files, stack, 0, warnings);
  texSource = spliceBbl(texSource, mainFile, files, warnings);
  return { texSource, mainFile, warnings };
}

export function findMainTexPath(
  files: Map<string, Uint8Array>,
  warnings: string[],
): string | null {
  const texFiles = [...files.keys()].filter((p) =>
    p.toLowerCase().endsWith(".tex"),
  );
  if (texFiles.length === 0) {
    warnings.push("no .tex files in archive");
    return null;
  }
  if (texFiles.length === 1) return texFiles[0];

  // arXiv's own declaration of the top-level file, when present.
  const declared = readReadmeToplevel(files, warnings);
  if (declared !== null) {
    if (files.has(declared)) return declared;
    warnings.push(`00README names missing toplevel file: ${declared}`);
  }

  const candidates = texFiles
    .map((path) => {
      const source = decodeTexBytes(files.get(path)!);
      if (
        !hasCommandOutsideComments(source, "\\documentclass") &&
        !hasCommandOutsideComments(source, "\\documentstyle")
      ) {
        return null;
      }
      let score = 0;
      if (hasCommandOutsideComments(source, "\\begin{document}")) score += 4;
      const basename = path.split("/").pop()!.toLowerCase();
      if (PREFERRED_NAMES.has(basename)) score += 2;
      return { path, score, depth: path.split("/").length, size: source.length };
    })
    .filter((c) => c !== null);

  if (candidates.length === 0) {
    warnings.push("no .tex file contains \\documentclass");
    return null;
  }
  candidates.sort(
    (a, b) =>
      b.score - a.score ||
      a.depth - b.depth ||
      b.size - a.size ||
      a.path.localeCompare(b.path),
  );
  return candidates[0].path;
}

function readReadmeToplevel(
  files: Map<string, Uint8Array>,
  warnings: string[],
): string | null {
  const jsonBytes = files.get("00README.json");
  if (jsonBytes) {
    try {
      const readme = JSON.parse(decodeTexBytes(jsonBytes)) as {
        sources?: Array<{ filename?: string; usage?: string }>;
      };
      const toplevel = readme.sources?.find((s) => s.usage === "toplevel");
      if (toplevel?.filename) return toplevel.filename;
    } catch {
      warnings.push("unparseable 00README.json");
    }
  }
  const legacyBytes = files.get("00README.XXX");
  if (legacyBytes) {
    for (const line of decodeTexBytes(legacyBytes).split("\n")) {
      const [file, directive] = line.trim().split(/\s+/);
      if (directive === "toplevelfile" && file) return file;
    }
  }
  return null;
}

function flattenFile(
  path: string,
  files: Map<string, Uint8Array>,
  stack: Set<string>,
  depth: number,
  warnings: string[],
): string {
  if (depth > MAX_INCLUDE_DEPTH) {
    warnings.push(`\\input nesting exceeded ${MAX_INCLUDE_DEPTH} at ${path}`);
    return "";
  }
  const source = decodeTexBytes(files.get(path)!);

  return mapCodeSegments(source, (code) =>
    code.replace(INPUT_RE, (full, cmd: string, braced?: string, bare?: string) => {
      const target = (braced ?? bare ?? "").trim();
      const resolved = resolveTexPath(target, files);
      if (resolved === null) {
        warnings.push(`unresolved \\${cmd}{${target}}`);
        return full;
      }
      if (stack.has(resolved)) {
        warnings.push(`skipped circular \\${cmd}{${target}}`);
        return "";
      }
      stack.add(resolved);
      const body = flattenFile(resolved, files, stack, depth + 1, warnings);
      stack.delete(resolved);
      return `\n${body}\n`;
    }),
  );
}

function spliceBbl(
  texSource: string,
  mainFile: string,
  files: Map<string, Uint8Array>,
  warnings: string[],
): string {
  if (!mapHasMatchOutsideComments(texSource, BIBLIOGRAPHY_RE)) return texSource;

  const mainBbl = mainFile.replace(/\.tex$/i, ".bbl");
  const allBbls = [...files.keys()].filter((p) => p.toLowerCase().endsWith(".bbl"));
  const bblPath = files.has(mainBbl)
    ? mainBbl
    : allBbls.length === 1
      ? allBbls[0]
      : null;
  if (bblPath !== null) {
    const bblContent = decodeTexBytes(files.get(bblPath)!);
    return mapCodeSegments(texSource, (code) =>
      code.replace(BIBLIOGRAPHY_RE, () => `\n${bblContent}\n`),
    );
  }

  // No .bbl — machine-generated submissions sometimes ship only the .bib
  // database. Synthesize a thebibliography from it so \cite keys resolve to
  // numbered references instead of leaking raw keys.
  const synthesized = synthesizeFromBib(texSource, files);
  if (synthesized !== null) {
    warnings.push("no .bbl in archive; bibliography synthesized from .bib");
    // Replace the FIRST \bibliography with the synthesized list; drop any
    // others so multiple \bibliography commands don't duplicate the section.
    let spliced = false;
    return mapCodeSegments(texSource, (code) =>
      code.replace(BIBLIOGRAPHY_RE, () => {
        if (spliced) return "";
        spliced = true;
        return `\n${synthesized}\n`;
      }),
    );
  }

  warnings.push("\\bibliography used but no matching .bbl in archive");
  return texSource;
}

/**
 * Build a `thebibliography` from the `.bib` database(s) the source references
 * (falling back to any `.bib` in the archive), populated with the cited keys
 * in first-appearance order. Returns null when no usable `.bib`/citation pair
 * is found.
 */
function synthesizeFromBib(
  texSource: string,
  files: Map<string, Uint8Array>,
): string | null {
  const bibSources: string[] = [];
  const seen = new Set<string>();
  const addBib = (path: string | null) => {
    if (path && !seen.has(path)) {
      seen.add(path);
      bibSources.push(decodeTexBytes(files.get(path)!));
    }
  };

  for (const line of texSource.split("\n")) {
    const code = splitTexComment(line)[0];
    for (const m of code.matchAll(/\\bibliography(?![a-zA-Z])\s*\{([^}]*)\}/g)) {
      for (const base of m[1].split(",")) {
        const name = base.trim();
        if (name) addBib(resolveBibPath(name, files));
      }
    }
  }
  if (bibSources.length === 0) {
    for (const path of files.keys()) {
      if (path.toLowerCase().endsWith(".bib")) addBib(path);
    }
  }
  if (bibSources.length === 0) return null;

  const cited = citedKeysInOrder(texSource);
  if (cited.length === 0) return null;
  return synthesizeThebibliography(bibSources.join("\n"), cited);
}

/** Resolve a `\bibliography{name}` base to a `.bib` file in the archive. */
function resolveBibPath(
  name: string,
  files: Map<string, Uint8Array>,
): string | null {
  const normalized = name.replace(/^\.\//, "");
  const withExt = normalized.toLowerCase().endsWith(".bib")
    ? normalized
    : `${normalized}.bib`;
  if (files.has(withExt)) return withExt;
  if (files.has(normalized)) return normalized;
  // Fall back to matching by basename (e.g. \bibliography{refs} → bib/refs.bib).
  const wantBase = withExt.split("/").pop();
  for (const path of files.keys()) {
    if (path.split("/").pop() === wantBase) return path;
  }
  return null;
}

/** Try the name as given, then with .tex appended when it has no extension. */
function resolveTexPath(
  target: string,
  files: Map<string, Uint8Array>,
): string | null {
  const normalized = target.replace(/^\.\//, "");
  if (normalized === "") return null;
  const basename = normalized.split("/").pop()!;
  const candidates = basename.includes(".")
    ? [normalized]
    : [`${normalized}.tex`, normalized];
  for (const candidate of candidates) {
    if (files.has(candidate)) return candidate;
  }
  return null;
}

/**
 * Apply `fn` to the code (non-comment) portion of every line. TeX comments
 * run from an unescaped % to end of line; substituting inside them would
 * resurrect commented-out \input lines.
 */
function mapCodeSegments(source: string, fn: (code: string) => string): string {
  return source
    .split("\n")
    .map((line) => {
      const [code, comment] = splitTexComment(line);
      return fn(code) + comment;
    })
    .join("\n");
}

function splitTexComment(line: string): [string, string] {
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "\\") {
      i++; // skip escaped character (\% most importantly)
    } else if (line[i] === "%") {
      return [line.slice(0, i), line.slice(i)];
    }
  }
  return [line, ""];
}

function hasCommandOutsideComments(source: string, needle: string): boolean {
  return source
    .split("\n")
    .some((line) => splitTexComment(line)[0].includes(needle));
}

function mapHasMatchOutsideComments(source: string, re: RegExp): boolean {
  return source.split("\n").some((line) => {
    re.lastIndex = 0;
    return re.test(splitTexComment(line)[0]);
  });
}

export function decodeTexBytes(bytes: Uint8Array): string {
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  // U+FFFD means the bytes weren't valid UTF-8; retry as latin1, the other
  // encoding old TeX sources actually use.
  if (!utf8.includes("�")) return utf8;
  return new TextDecoder("latin1").decode(bytes);
}
