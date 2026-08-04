import { stripTexComments } from "./transforms/tex-utils";

/**
 * Minimal BibTeX support for e-prints that ship a `.bib` database but no
 * compiled `.bbl` (common for machine-generated submissions — arXiv normally
 * requires the `.bbl`, but tools like Pandoc/Overleaf exporters sometimes emit
 * only the source database). We never run bibtex (no system TeX in this
 * toolchain); instead we parse the `.bib` and synthesize a `thebibliography`
 * environment so the existing citation machinery (transforms/citations.ts)
 * resolves \cite keys to numbered [n] links and a real References section,
 * instead of leaking raw keys like "[greenblatt2024ai]".
 *
 * The synthesized entries are a plainnat-ish approximation, not a faithful
 * reproduction of any bibliography style: labels render numerically (matching
 * how the converter already approximates every author-year citation), ordered
 * by first citation appearance, and only cited entries are emitted.
 */

export interface BibEntry {
  key: string;
  /** Lowercased entry type, e.g. "article", "inproceedings". */
  type: string;
  /** Lowercased field name → raw value (still LaTeX source). */
  fields: Record<string, string>;
}

/** Entry types that are containers, not references — skipped during parsing. */
const NON_ENTRY_TYPES = new Set(["comment", "preamble", "string"]);

const WS = /\s/;
const NAME_CHAR = /[A-Za-z0-9_:.\-]/;

/**
 * Parse a `.bib` database into entries keyed by cite key. Tolerant by design:
 * malformed entries are skipped rather than throwing, and the first definition
 * of a duplicate key wins (as bibtex resolves them).
 */
export function parseBibDatabase(source: string): Map<string, BibEntry> {
  const entries = new Map<string, BibEntry>();
  const n = source.length;
  let i = 0;

  while (i < n) {
    const at = source.indexOf("@", i);
    if (at === -1) break;
    i = at + 1;

    // Entry type: @article, @inproceedings, ...
    const typeStart = i;
    while (i < n && /[A-Za-z]/.test(source[i])) i++;
    const type = source.slice(typeStart, i).toLowerCase();
    while (i < n && WS.test(source[i])) i++;

    const open = source[i];
    if (open !== "{" && open !== "(") continue; // not an entry body
    const close = open === "{" ? "}" : ")";
    i++; // past the opener

    if (type === "" || NON_ENTRY_TYPES.has(type)) {
      // Skip the whole balanced block ({...} form); () @comment is vanishingly
      // rare and degrades to "scan to next @", which is acceptable.
      i = open === "{" ? skipBalanced(source, i) : source.indexOf(")", i) + 1 || n;
      continue;
    }

    // Cite key: up to the first comma (or close, for a key-only entry).
    const keyStart = i;
    while (i < n && source[i] !== "," && source[i] !== close) i++;
    const key = source.slice(keyStart, i).trim();

    const fields: Record<string, string> = {};
    while (i < n && source[i] !== close) {
      if (source[i] === "," || WS.test(source[i])) {
        i++;
        continue;
      }
      // Field name.
      const nameStart = i;
      while (i < n && NAME_CHAR.test(source[i])) i++;
      const name = source.slice(nameStart, i).toLowerCase();
      while (i < n && WS.test(source[i])) i++;
      if (source[i] !== "=" || name === "") {
        // Malformed — resync to the next comma or close.
        while (i < n && source[i] !== "," && source[i] !== close) i++;
        continue;
      }
      i++; // past '='
      const { value, next } = readValue(source, i, close);
      i = next;
      if (!(name in fields)) fields[name] = value;
    }
    if (source[i] === close) i++;

    if (key && !entries.has(key)) entries.set(key, { key, type, fields });
  }

  return entries;
}

/** Index just after the `}` matching the `{` that precedes `start`. */
function skipBalanced(s: string, start: number): number {
  let depth = 1;
  let i = start;
  const n = s.length;
  while (i < n && depth > 0) {
    const c = s[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  return i;
}

/**
 * Read a field value starting at `i`: a `{...}` group, a `"..."` string, or a
 * bareword, with optional `#`-concatenation. Braces are stripped from the
 * outermost group (case-protection braces stay inside the value as transparent
 * LaTeX groups). Returns the value and the index just past it.
 */
function readValue(
  s: string,
  i: number,
  close: string,
): { value: string; next: number } {
  const n = s.length;
  const parts: string[] = [];
  for (;;) {
    while (i < n && WS.test(s[i])) i++;
    if (s[i] === "{") {
      const end = skipBalanced(s, i + 1);
      parts.push(s.slice(i + 1, end - 1));
      i = end;
    } else if (s[i] === '"') {
      let j = i + 1;
      let depth = 0;
      while (j < n) {
        const c = s[j];
        if (c === "{") depth++;
        else if (c === "}") depth--;
        else if (c === '"' && depth === 0) break;
        j++;
      }
      parts.push(s.slice(i + 1, j));
      i = j + 1;
    } else {
      let j = i;
      while (j < n && !/[,#]/.test(s[j]) && !WS.test(s[j]) && s[j] !== close) j++;
      parts.push(s.slice(i, j));
      i = j;
    }
    while (i < n && WS.test(s[i])) i++;
    if (s[i] === "#") {
      i++;
      continue;
    }
    break;
  }
  return { value: parts.join(" ").replace(/\s+/g, " ").trim(), next: i };
}

// \cite, \citep, \citet, \citeauthor, \parencite, \textcite, \autocite, … —
// at least as broad as ALL_CITE_MACROS in transforms/citations.ts, so every
// entry the citation processor will number gets synthesized.
const CITE_MACRO_RE =
  /\\(?:[cC]ite[a-zA-Z]*|[pP]arencite|[aA]utocite|footcite|smartcite|[tT]extcite)\*?\s*(?:\[[^\]]*\]\s*){0,2}\{([^}]*)\}/g;

/** Cite keys in first-appearance order across the (comment-stripped) source. */
export function citedKeysInOrder(texSource: string): string[] {
  const code = stripTexComments(texSource);
  const order: string[] = [];
  const seen = new Set<string>();
  for (const m of code.matchAll(CITE_MACRO_RE)) {
    for (const raw of m[1].split(",")) {
      const key = raw.trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        order.push(key);
      }
    }
  }
  return order;
}

/**
 * Build a `thebibliography` environment (LaTeX source, to be spliced where
 * `\bibliography{...}` sat) containing the cited entries in the given order.
 * Returns null when nothing can be emitted (no matching entries).
 */
export function synthesizeThebibliography(
  bibSource: string,
  citedKeys: string[],
): string | null {
  const db = parseBibDatabase(bibSource);
  const items: string[] = [];
  for (const key of citedKeys) {
    const entry = db.get(key);
    if (!entry) continue; // unknown key → citations.ts renders "?"
    items.push(`\\bibitem{${key}}\n${formatBibEntry(entry)}`);
  }
  if (items.length === 0) return null;
  return `\\begin{thebibliography}{${items.length}}\n${items.join(
    "\n\n",
  )}\n\\end{thebibliography}`;
}

/**
 * Render one entry as a plainnat-ish LaTeX string: "Authors. Title. Venue,
 * Year." Fields are already LaTeX source, so they pass through (accents, math,
 * and case-protection braces render correctly through the same pipeline that
 * handles a real .bbl); only a bare `%` is escaped so it can't open a comment
 * and swallow the rest of the synthesized source.
 */
export function formatBibEntry(entry: BibEntry): string {
  const f = entry.fields;
  const pieces: string[] = [];

  const people = f.author
    ? formatNames(f.author)
    : f.editor
      ? `${formatNames(f.editor)}, editors`
      : "";
  if (people) pieces.push(stripTrailingPunct(people));
  if (f.title) pieces.push(stripTrailingPunct(f.title));

  const venue = formatVenue(entry);
  if (venue) pieces.push(stripTrailingPunct(venue));
  if (f.year) pieces.push(stripTrailingPunct(f.year));

  let body = pieces.join(". ");
  if (body && !/[.!?]$/.test(body)) body += ".";
  if (!body) body = `\\texttt{${entry.key}}.`; // last resort: show the key

  return escapeBareComment(body);
}

function formatVenue(entry: BibEntry): string {
  const f = entry.fields;
  const journal = f.journal ?? f.journaltitle;
  const pages = f.pages ? normalizePages(f.pages) : "";

  if (entry.type === "article" && journal) {
    let v = stripTrailingPunct(journal);
    if (f.volume) v += ` ${f.volume}`;
    if (f.number) v += `(${f.number})`;
    if (pages) v += `:${pages}`;
    return v;
  }
  if (
    (entry.type === "inproceedings" ||
      entry.type === "incollection" ||
      entry.type === "conference") &&
    f.booktitle
  ) {
    let v = `In ${stripTrailingPunct(f.booktitle)}`;
    if (pages) v += `, pages ${pages}`;
    return v;
  }

  const host =
    f.booktitle ??
    journal ??
    f.publisher ??
    f.institution ??
    f.school ??
    f.howpublished ??
    f.note ??
    "";
  let v = host ? stripTrailingPunct(host) : "";
  if (pages) v += `${v ? ", " : ""}pages ${pages}`;
  if (v) return v;
  // @misc/@online and eprint-only entries: fall back to a locator so the
  // reference isn't reduced to "Author. Title. Year." with no way to find it.
  if (f.eprint) {
    const prefix = f.archiveprefix?.toLowerCase() === "arxiv" ? "arXiv:" : "";
    return `${prefix}${f.eprint}`;
  }
  if (f.doi) return `doi:${f.doi.replace(/^doi:/i, "")}`;
  if (f.url) return `\\texttt{${f.url}}`;
  return "";
}

/** BibTeX author/editor lists: "Last, First and First Last and others". */
function formatNames(raw: string): string {
  const names: string[] = [];
  let etal = false;
  for (const p of splitNames(raw)) {
    if (p.toLowerCase() === "others") {
      etal = true;
      continue;
    }
    names.push(flipName(p));
  }
  if (names.length === 0) return etal ? "et al." : "";
  if (etal) return `${names.join(", ")}, et al.`;
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * Split on ` and ` at brace depth 0 only — corporate names brace-protect
 * embedded "and"s ({Center for AI Safety and Security} is ONE author).
 */
function splitNames(raw: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  const sep = /^\sand\s/;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === "{") depth++;
    else if (c === "}") depth = Math.max(0, depth - 1);
    else if (depth === 0 && WS.test(c) && sep.test(raw.slice(i, i + 5))) {
      parts.push(raw.slice(start, i));
      i += 4; // past " and "
      start = i + 1;
      i--; // loop's i++ lands on the char after the separator
    }
  }
  parts.push(raw.slice(start));
  return parts.map((s) => s.trim()).filter(Boolean);
}

/**
 * "Greenblatt, Ryan" → "Ryan Greenblatt"; the three-part von/jr form
 * "Ford, Jr., Henry" → "Henry Ford, Jr."; "First Last" is left as-is.
 * Commas inside braces (corporate names) never split.
 */
function flipName(p: string): string {
  const commas: number[] = [];
  let depth = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] === "{") depth++;
    else if (p[i] === "}") depth = Math.max(0, depth - 1);
    else if (p[i] === "," && depth === 0) commas.push(i);
  }
  if (commas.length === 0) return p.trim();
  if (commas.length >= 2) {
    const last = p.slice(0, commas[0]).trim();
    const jr = p.slice(commas[0] + 1, commas[1]).trim();
    const first = p.slice(commas[1] + 1).trim();
    return [first, last].filter(Boolean).join(" ") + (jr ? `, ${jr}` : "");
  }
  const last = p.slice(0, commas[0]).trim();
  const first = p.slice(commas[0] + 1).trim();
  return first ? `${first} ${last}` : last;
}

/** LaTeX renders `--`/`---` as en/em dashes; do it eagerly for page ranges. */
function normalizePages(pages: string): string {
  return pages.replace(/---/g, "—").replace(/--/g, "–").trim();
}

function stripTrailingPunct(s: string): string {
  return s.replace(/[.,;:\s]+$/, "").trim();
}

/** Escape a `%` that would otherwise start a LaTeX comment (not already `\%`). */
function escapeBareComment(s: string): string {
  // Lookbehind, not a capture-and-consume group: in "%%" the consuming form
  // eats the first % as "the char before" and leaves the second one bare.
  return s.replace(/(?<!\\)%/g, "\\%");
}
