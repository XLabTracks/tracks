import type * as Ast from "@unified-latex/unified-latex-types";
import { attachMacroArgs } from "@unified-latex/unified-latex-util-arguments";
import { match } from "@unified-latex/unified-latex-util-match";
import { visit } from "@unified-latex/unified-latex-util-visit";
import type { TexMeta } from "../types";
import type { WarningCollector } from "../warnings";
import {
  lastArgContent,
  plainText,
  rawText,
  strippedMacroNames,
  texString,
  walkNodeArrays,
} from "./tex-utils";

/**
 * Extract \title/\author (or the ICML class's \icmltitle/\icmlauthor list)
 * into card metadata and remove the title-page machinery from the body
 * (\maketitle renders nothing — the component's header shows title/authors
 * instead, so the paper body starts at the abstract). Author blocks are
 * notoriously messy (affiliations, \thanks, \and); this is a best-effort
 * split that degrades to fewer/no names.
 */
export function extractMeta(
  tree: Ast.Root,
  warnings: WarningCollector,
): TexMeta {
  // Attach BEFORE reading: \thanks bodies must hang off their macro to be
  // droppable (inside "$^{1}\thanks{…}$" marker math they otherwise print as
  // author text), and the icml* macros are unknown to the parser.
  attachMacroArgs(tree, {
    thanks: { signature: "m" },
    icmltitle: { signature: "m" },
    icmlauthor: { signature: "m m" },
  });

  const meta: TexMeta = {};
  const icmlAuthors: string[] = [];
  let titleNodes: Ast.Node[] | undefined;
  let icmlTitleNodes: Ast.Node[] | undefined;

  visit(tree, (node) => {
    if (!match.anyMacro(node)) return;
    if (node.content === "title" && !titleNodes) {
      titleNodes = lastArgContent(node);
    }
    if (node.content === "icmltitle" && !icmlTitleNodes) {
      icmlTitleNodes = lastArgContent(node);
    }
    if (node.content === "author" && !meta.authors) {
      const authors = splitAuthors(lastArgContent(node), warnings);
      if (authors.length > 0) meta.authors = authors;
      else warnings.add("meta", "could not parse \\author block");
    }
    if (node.content === "icmlauthor") {
      // \icmlauthor{Name}{affiliation-ids} — the FIRST arg is the name; it
      // runs the same \thanks-strip + residue pipeline as \author segments.
      addAuthorParts(
        plainText(stripThanks(node.args?.[0]?.content ?? [])),
        icmlAuthors,
        warnings,
      );
    }
  });
  // \icmltitle is the displayed title; a coexisting \title is usually a
  // pdf-metadata stub, so icml wins when both are present.
  for (const argContent of [icmlTitleNodes, titleNodes]) {
    if (!argContent) continue;
    const stripped = stripThanks(argContent);
    const text = plainText(stripped);
    if (!text) continue;
    meta.title = text;
    for (const name of strippedMacroNames(stripped)) {
      if (!TITLE_SILENT_MACROS.has(name)) {
        warnings.add("meta", `title drops unexpanded macro \\${name}`);
      }
    }
    break;
  }
  if (!meta.authors && icmlAuthors.length > 0) meta.authors = icmlAuthors;

  removeTitlePageMacros(tree);
  return meta;
}

/**
 * Macros plainText may strip from a title without losing printed words:
 * pure formatting (a braced argument's text survives brace-stripping) and
 * title-page plumbing. Anything else stripped from a title likely printed
 * text — extractMeta warns so the loss is visible at authoring time.
 */
const TITLE_SILENT_MACROS = new Set([
  "textbf", "textit", "textsc", "textrm", "textsf", "texttt", "textup",
  "textmd", "textnormal", "emph", "mbox", "hbox", "protect", "relax",
  "bf", "bfseries", "it", "itshape", "sc", "scshape", "em", "rm",
  "rmfamily", "sf", "sffamily", "tt", "ttfamily", "mdseries", "normalfont",
  "boldmath", "unboldmath", "large", "Large", "LARGE", "huge", "Huge",
  "normalsize", "small", "footnotesize", "scriptsize", "tiny",
  "raggedright", "centering", "break", "newline", "linebreak",
  "nolinebreak", "ignorespaces", "vspace", "hspace", "smallskip",
  "medskip", "bigskip", "thanks", "samethanks", "footnote", "footnotemark",
]);

const TITLE_PAGE_MACROS = new Set([
  "title",
  "author",
  "date",
  "maketitle",
  "thanks",
  "samethanks",
  "footnotemark",
  "affiliation",
  "affil",
  "institute",
  "email",
  "orcid",
  "icmltitle",
  "icmltitlerunning",
  "icmlauthor",
  "icmlaffiliation",
  "icmlcorrespondingauthor",
  "icmlsetsymbol",
  "icmlkeywords",
]);

function removeTitlePageMacros(tree: Ast.Root): void {
  // Attach args so removal takes "[1]{CMU}"-style arguments along instead of
  // leaking them as literal text at the top of the paper.
  attachMacroArgs(tree, {
    thanks: { signature: "m" },
    samethanks: { signature: "o" },
    affil: { signature: "o m" },
    affiliation: { signature: "o m" },
    institute: { signature: "m" },
    email: { signature: "m" },
    orcid: { signature: "m" },
    date: { signature: "m" },
    footnotemark: { signature: "o" },
    icmltitle: { signature: "m" },
    icmltitlerunning: { signature: "m" },
    icmlauthor: { signature: "m m" },
    icmlaffiliation: { signature: "m m" },
    icmlcorrespondingauthor: { signature: "m m" },
    icmlsetsymbol: { signature: "m m" },
    icmlkeywords: { signature: "m" },
  });
  walkNodeArrays(tree, (nodes) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (match.anyMacro(node) && TITLE_PAGE_MACROS.has(node.content)) {
        nodes.splice(i, 1);
      }
    }
  });
}

/**
 * Split an author block on \and / \And / \AND. Within each segment,
 * everything after the first \\ is affiliation lines — dropped, including
 * line breaks nested inside groups or macro args (\parbox author cells glue
 * "Name \\ Affiliation" one level deep).
 */
function splitAuthors(nodes: Ast.Node[], warnings: WarningCollector): string[] {
  const segments: Ast.Node[][] = [[]];
  for (const node of nodes) {
    if (node.type === "comment") continue; // % line comments are not names
    if (match.anyMacro(node) && /^(and|And|AND)$/.test(node.content)) {
      segments.push([]);
      continue;
    }
    // "\author{A, B and C}" — top-level commas separate names too.
    if (node.type === "string" && node.content === ",") {
      segments.push([]);
      continue;
    }
    if (node.type === "string" && node.content.endsWith(",")) {
      segments[segments.length - 1].push({
        type: "string",
        content: node.content.slice(0, -1),
      });
      segments.push([]);
      continue;
    }
    segments[segments.length - 1].push(node);
  }
  const authors: string[] = [];
  for (const segment of segments) {
    // Strip \thanks BEFORE truncating: its bodies are full sentences whose
    // line breaks must not be mistaken for the affiliation separator.
    const firstLine = truncateAtLineBreak(stripThanks(segment));
    // Comma-less author runs sometimes separate names with spacing glue:
    // a run of 2+ \, ("A$^*$ \,\,\,\, B") or \quad/\qquad ("A \qquad B") —
    // both are separators.
    for (const chunk of rawText(firstLine).split(
      /(?:\\,\s*){2,}|\\q?quad(?![a-zA-Z])\s*/,
    )) {
      addAuthorParts(plainText([texString(chunk)]), authors, warnings);
    }
  }
  return authors;
}

/**
 * Truncate at the first \\ line break, descending into groups and macro
 * args ("{Name\\Affiliation}" parbox cells) — but not math, whose \\ is
 * alignment. Non-mutating; the cut drops later siblings at every level.
 */
function truncateAtLineBreak(nodes: Ast.Node[]): Ast.Node[] {
  let found = false;
  const cut = (arr: Ast.Node[]): Ast.Node[] => {
    const out: Ast.Node[] = [];
    for (const node of arr) {
      if (match.anyMacro(node) && node.content === "\\") {
        found = true;
        break;
      }
      if (node.type === "group") {
        out.push({ ...node, content: cut(node.content) });
      } else if (match.anyMacro(node) && node.args) {
        const args = node.args.map((arg) =>
          found ? arg : { ...arg, content: cut(arg.content) },
        );
        out.push({ ...node, args });
      } else {
        out.push(node);
      }
      if (found) break;
    }
    return out;
  };
  return cut(nodes);
}

/**
 * Clean one plain-texted author run and append the names it holds. Rejected
 * non-empty fragments warn — the residue filter must never silently narrow
 * attribution.
 */
function addAuthorParts(
  text: string,
  authors: string[],
  warnings: WarningCollector,
): void {
  const raw = text
    // Leftovers from unattached optional args and spacing glue:
    // "[1]", "1.7mm".
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\b\d+(?:\.\d+)?(?:mm|cm|pt|em|ex|in)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Superscript affiliation markers ("^ *1", "^2,3", "^†") END a name —
  // marker-separated author runs carry no commas, so split on the markers
  // and drop them rather than showing raw carets in the header.
  for (const part of raw.split(/\s*\^\s*[*†‡§\d][*†‡§\d,]*\s*/)) {
    // Stray markers that lost their caret still hug the ends
    // ("Buck Shlegeris*", "Ashwin Sreevatsa *,1", "Karnofsky ^") — but a
    // terminal period stays: it closes an initial ("Ann B."), not a marker.
    const name = part
      .replace(/^[\s,;*†‡§^\d.]+/, "")
      .replace(/[\s,;*†‡§^\d]+$/, "");
    if (!name) continue;
    if (looksLikeName(name)) authors.push(name);
    else warnings.add("meta", `author-block fragment dropped: "${name}"`);
  }
}

/**
 * Lowercase words that legitimately appear inside names. Anything else
 * lowercase marks a sentence, not a name.
 */
const NAME_PARTICLES = new Set([
  "van", "von", "der", "den", "ter", "ten", "op", "de", "del", "della",
  "di", "da", "dos", "das", "do", "du", "la", "le", "bin", "ibn", "al",
  "el", "y", "e", "'t", "’t",
]);

/**
 * Residue filter for author-block splitting: footnote sentences that escape
 * \thanks ("Equal contribution, order was randomized.") must not become
 * author entries. A candidate is a name when it has no sentence punctuation
 * and every word is a capitalized name piece (initials, diacritics, hyphens
 * included) or a known lowercase particle ("van der", "de la", "'t") —
 * with narrow carve-outs for lowercase-stylized names and parentheticals.
 */
function looksLikeName(candidate: string): boolean {
  // Parenthetical asides ship with the name ("Ming Li (Li Ming in native
  // script)") but are judged only by the text outside the parens.
  const tested = candidate
    .replace(/\([^()]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (tested.length === 0 || tested.length > 60) return false;
  if (/[,;:!?&\\()]/.test(tested)) return false;
  const words = tested.split(/\s+/);
  if (
    words.every(
      (word) =>
        NAME_PARTICLES.has(word) || /^\p{Lu}[\p{L}'’.-]*$/u.test(word),
    )
  ) {
    return true;
  }
  // Lowercase-stylized names ("danah boyd"): a two-word all-lowercase pair
  // reads as a name; longer lowercase runs read as footnote-sentence residue.
  return (
    words.length === 2 &&
    words.every((word) => /^\p{Ll}[\p{Ll}'’-]+$/u.test(word))
  );
}

/**
 * Drop \thanks-family macros — anywhere in the subtree, since author blocks
 * bury them inside superscript-marker math ("$^{1}\thanks{…}$") — plus the
 * bracketed leftovers their unattached optional args leave behind ("[1]",
 * "[1.7mm]"); names never contain bracketed runs. Non-mutating.
 */
function stripThanks(nodes: Ast.Node[]): Ast.Node[] {
  const clone = structuredClone(nodes);
  const drop = (arr: Ast.Node[]) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      const node = arr[i];
      if (
        match.anyMacro(node) &&
        (node.content === "thanks" || node.content === "samethanks")
      ) {
        arr.splice(i, 1);
      } else if (
        node.type === "string" &&
        /^\[[^\]]*\]$/.test(node.content)
      ) {
        arr.splice(i, 1);
      }
    }
  };
  drop(clone);
  for (const node of clone) walkNodeArrays(node, drop);
  return clone;
}
