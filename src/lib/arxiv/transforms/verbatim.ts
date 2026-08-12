import { stripTexComments } from "./tex-utils";

/**
 * Pre-parse protection for custom listing environments.
 *
 * The PEG grammar treats only a hardcoded set of environments as verbatim
 * (verbatim, lstlisting, minted, …). A paper-defined listing environment
 * (\DeclareTCBListing{listingsbox}{O{}m!O{}}{…}, \newtcblisting,
 * \lstnewenvironment) carries raw code the parser reads as LaTeX — an odd
 * number of `$`s in a bash/python body swallows the `\end{…}` into inline
 * math, environment pairing desyncs, and everything after renders as literal
 * TeX (this truncated the Ctrl-Z paper's entire appendix). Rewriting uses to
 * plain `lstlisting` BEFORE parsing keeps their bodies verbatim; the declared
 * begin-args (listing style, title) are consumed and dropped.
 */

interface ListingEnvDef {
  name: string;
  /** Ordered begin-arg slots: optional `[…]`, mandatory `{…}`, or star. */
  slots: ("o" | "m" | "s")[];
}

/** `\begin{name}` uses of every custom listing env become `\begin{lstlisting}`. */
export function rewriteCustomListingEnvironments(texSource: string): string {
  const defs = collectListingEnvironments(texSource);
  if (defs.length === 0) return texSource;
  return rewriteUses(texSource, defs);
}

/** Exported for unit tests. */
export function collectListingEnvironments(texSource: string): ListingEnvDef[] {
  const src = stripTexComments(texSource);
  const defs = new Map<string, ListingEnvDef>();
  const declRe = /\\(DeclareTCBListing|NewTCBListing|newtcblisting|lstnewenvironment)\s*/g;
  for (let m = declRe.exec(src); m !== null; m = declRe.exec(src)) {
    const kind = m[1];
    let i = declRe.lastIndex;
    if (kind === "DeclareTCBListing" || kind === "NewTCBListing") {
      // [init options]{name}{xparse spec}{options}
      i = skipDelimited(src, i, "[", "]");
      const name = readBraceGroup(src, i);
      if (!name) continue;
      const spec = readBraceGroup(src, skipBlank(src, name.end));
      defs.set(name.content, {
        name: name.content,
        slots: parseXparseSpec(spec?.content ?? ""),
      });
    } else {
      // [init options]{name}[nargs][default]{…} — LaTeX-style arg
      // declaration: with a [default], the FIRST arg is optional and the
      // rest are mandatory. \newtcblisting documents a leading
      // [init options] group (auto counter, list inside=…); consuming it
      // when present costs nothing on the plain forms.
      i = skipDelimited(src, i, "[", "]");
      const name = readBraceGroup(src, i);
      if (!name) continue;
      i = skipBlank(src, name.end);
      const nargs = /^\[\s*(\d)\s*\]/.exec(src.slice(i));
      let slots: ("o" | "m" | "s")[] = [];
      if (nargs) {
        i = skipBlank(src, i + nargs[0].length);
        const hasDefault = src[i] === "[";
        const total = parseInt(nargs[1], 10);
        slots = [
          ...(hasDefault ? (["o"] as const) : []),
          ...Array<"m">(Math.max(0, total - (hasDefault ? 1 : 0))).fill("m"),
        ];
      }
      defs.set(name.content, { name: name.content, slots });
    }
  }
  return [...defs.values()];
}

/**
 * Environments whose bodies the PEG grammar reads verbatim (its hardcoded
 * set). Text inside them is DISPLAYED code — a listing that shows
 * `\end{listingsbox}` as example LaTeX must not get rewritten mid-body.
 */
const VERBATIM_ENVS = new Set([
  "verbatim",
  "verbatim*",
  "lstlisting",
  "minted",
  "filecontents",
  "filecontents*",
  "comment",
]);

/**
 * One sequential scan pairing begin/end in document order: custom-env uses
 * rewrite to lstlisting, and any verbatim body (built-in or custom) is
 * skipped wholesale until its matching \end — verbatim envs never nest, so
 * tracking the single open name suffices.
 */
function rewriteUses(src: string, defs: ListingEnvDef[]): string {
  const byName = new Map(defs.map((def) => [def.name, def]));
  const tokenRe = /\\(begin|end)\s*\{([^{}]+)\}/g;
  const pieces: string[] = [];
  let pos = 0;
  let openVerbatim: string | null = null;
  for (let m = tokenRe.exec(src); m !== null; m = tokenRe.exec(src)) {
    const [, kind, name] = m;
    if (openVerbatim !== null) {
      // Inside a verbatim body only the matching \end is structural (TeX
      // scans for it literally — even a `%` doesn't hide it).
      if (kind === "end" && name === openVerbatim) {
        if (byName.has(name)) {
          pieces.push(src.slice(pos, m.index), "\\end{lstlisting}");
          pos = tokenRe.lastIndex;
        }
        openVerbatim = null;
      }
      continue;
    }
    // Outside verbatim, `%` comments ARE live: a commented-out
    // \begin{lstlisting} must not open a skip region.
    if (isCommentedOut(src, m.index)) continue;
    const def = byName.get(name);
    if (kind === "begin") {
      if (def) {
        pieces.push(src.slice(pos, m.index), "\\begin{lstlisting}");
        pos = consumeBeginArgs(src, tokenRe.lastIndex, def.slots);
        tokenRe.lastIndex = pos;
        openVerbatim = name;
      } else if (VERBATIM_ENVS.has(name)) {
        openVerbatim = name;
      }
      continue;
    }
    if (def) {
      // Stray \end without a tracked open (desynced source): still rewrite,
      // matching TeX which would fail pairing either way.
      pieces.push(src.slice(pos, m.index), "\\end{lstlisting}");
      pos = tokenRe.lastIndex;
    }
  }
  pieces.push(src.slice(pos));
  return pieces.join("");
}

/** True when an unescaped `%` precedes `index` on its line. */
function isCommentedOut(src: string, index: number): boolean {
  const lineStart = src.lastIndexOf("\n", index - 1) + 1;
  for (let i = lineStart; i < index; i++) {
    if (src[i] === "\\") i++;
    else if (src[i] === "%") return true;
  }
  return false;
}

/** Consume the declared begin args (matching TeX's own grabbing), return the
 * index where the verbatim body starts. An absent optional arg costs nothing;
 * a mandatory slot takes the next balanced group (never across a newline —
 * the code body must stay untouched if the author omitted the arg). */
function consumeBeginArgs(
  src: string,
  start: number,
  slots: ("o" | "m" | "s")[],
): number {
  let i = start;
  for (const slot of slots) {
    let j = i;
    while (src[j] === " " || src[j] === "\t") j++;
    if (slot === "s") {
      if (src[j] === "*") i = j + 1;
      continue;
    }
    if (slot === "o") {
      if (src[j] === "[") {
        const end = findBalancedClose(src, j, "[", "]");
        if (end !== -1) i = end + 1;
      }
      continue;
    }
    if (src[j] === "{") {
      const end = findBalancedClose(src, j, "{", "}");
      if (end !== -1) i = end + 1;
    }
  }
  return i;
}

/**
 * xparse argument spec → begin-arg slots. `O{default}` skips its default
 * group; modifiers (`!`, `+`) and unknown letters are ignored.
 */
function parseXparseSpec(spec: string): ("o" | "m" | "s")[] {
  const slots: ("o" | "m" | "s")[] = [];
  for (let i = 0; i < spec.length; i++) {
    const ch = spec[i];
    if (ch === "m" || ch === "v") slots.push("m");
    else if (ch === "o") slots.push("o");
    else if (ch === "s") slots.push("s");
    else if (ch === "O") {
      slots.push("o");
      const group = readBraceGroup(spec, skipBlank(spec, i + 1));
      if (group) i = group.end - 1;
    }
  }
  return slots;
}

function skipBlank(src: string, i: number): number {
  while (i < src.length && /\s/.test(src[i])) i++;
  return i;
}

/** Skip one balanced `open…close` run if present at (blank-skipped) `i`. */
function skipDelimited(
  src: string,
  i: number,
  open: string,
  close: string,
): number {
  const j = skipBlank(src, i);
  if (src[j] !== open) return i;
  const end = findBalancedClose(src, j, open, close);
  return end === -1 ? i : end + 1;
}

function readBraceGroup(
  src: string,
  i: number,
): { content: string; end: number } | null {
  const j = skipBlank(src, i);
  if (src[j] !== "{") return null;
  const end = findBalancedClose(src, j, "{", "}");
  if (end === -1) return null;
  return { content: src.slice(j + 1, end), end: end + 1 };
}

/**
 * Index of the `close` matching the `open` at `start`. Braces nest; bracket
 * args close at the first `]` outside braces (TeX's own rule — `[` does not
 * nest).
 */
function findBalancedClose(
  src: string,
  start: number,
  open: string,
  close: string,
): number {
  let braces = 0;
  for (let i = start + 1; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") {
      i++;
      continue;
    }
    if (ch === "{") braces++;
    else if (ch === "}") {
      if (open === "{" && braces === 0) return i;
      braces = Math.max(0, braces - 1);
    } else if (ch === close && braces === 0) {
      return i;
    }
  }
  return -1;
}
