/**
 * Bump when converter output changes shape or rendering meaningfully, so
 * cached conversions from older code are discarded (a version mismatch on
 * read forces a re-convert from the cached raw e-print). Also stamped on the
 * rendered root as data-conv so future highlight persistence can invalidate.
 *
 * v2: multicolumn/multirow tables, positional table rules, equation-number
 *     sync, appendix lettering, nested-caption recovery, citation fixes.
 * v3: PDF figures rasterized to inline PNGs (was a link placeholder).
 * v4: vertical column dividers (| in the column spec) rendered as borders.
 * v5: don't expand user redefinitions of structural commands (\label, \ref,
 *     \cite, \caption, …) — keeps cross-refs working on papers that wrap them.
 * v6: full-scan overhaul — \textsuperscript crash bypass, \def/\let/
 *     \newenvironment expansion, longtable, orphan captions, \resizebox
 *     unwrap, \ensuremath, graphicspath, width buckets, description lists,
 *     default theorems, biblatex fallback, symbol macros, and more.
 * v7: split-environment repair (begin/end across \newenvironment bodies),
 *     counter/display-macro strips, \par, multicols, group/catcode noise.
 * v8: xcolor support (\definecolor/\colorlet/\cellcolor/\rowcolor/
 *     \textcolor render real colors) and multicols → CSS columns.
 * v9: tcolorbox transcript boxes render titled + colored; minipage columns
 *     sit side by side.
 * v10: TikZ diagrams compile server-side (node-tikzjax WASM) to inline SVG
 *      with the paper's macros/colors; failures keep the placeholder.
 * v11: ordered (interleaved) xparse env args, deduped macro expansion (no
 *      double-expansion from twice-\input definition files), box footer
 *      labels.
 * v12: TikZ — named-color model, color fallbacks, in-snippet def hardening,
 *      count-verified index correlation; more diagrams compile.
 * v13: tcolorbox title chips honor coltitle (default WHITE, per tcolorbox)
 *      instead of inheriting dark body text on a dark chip.
 * v14: TikZ defs move to the TeX preamble (addToPreamble) — injected in the
 *      document body their glue widened the shipped page, so SVG viewports
 *      were ~3000pt wide and diagrams rendered as tiny slivers.
 * v15: papers precompute at authoring time (`npm run arxiv:build`) into
 *      committed artifacts; asset URLs point at static /arxiv/… paths instead
 *      of the (removed) /api/arxiv asset route.
 * v16: precomputed section TOC (`toc` on the artifact) + stamped landmark ids
 *      (ax-abstract/ax-references/ax-footnotes) — powers full-page Paper
 *      items: sidebar section navigation and end-of-section insertions.
 * v17: sentence spans (span[data-s], 1-based per block) on p/li/blockquote,
 *      and toc entries carry their heading's data-anchor — powers paper
 *      edits (hide/add/insert at block and sentence granularity).
 * v18: abstract bodies paragraph-wrapped (so the abstract is anchor- and
 *      sentence-addressable by edits) + wider abbreviation guard (Thm./Alg./
 *      Eqn./… and dotted acronyms) in sentence segmentation.
 * v19: mdframed environments render as tinted callout boxes (ax-mdframed,
 *      linecolor-aware) instead of leaking their option list as text.
 * v20: \cellcolor/\rowcolor nested inside \multirow/\multicolumn content
 *      resolve to cell backgrounds instead of leaking as literal text
 *      ("gray!15 Never happens").
 * v21: converter-fidelity fixes — \tag argument consumed (no stray group),
 *      \tabularnewline splits tabular/longtable rows, wrapfigure/SCfigure/
 *      subcaptionbox \labels bind to figures (not the section), \def keeps
 *      the LAST definition, \let/\renewcommand cycles are broken (no
 *      duplication), \multirow nested in \multicolumn unwraps, and stripped
 *      counter-manipulation (\setcounter/\numberwithin/…) now warns.
 * v22: \twocolumn[<title block>] (ICML front matter) and
 *      \printAffiliationsAndNotice stripped instead of leaking as body text.
 * v23–v25: single bump (v23/v24 never shipped) — plain \begin{tcolorbox}
 *      [options] environments peel their option list and render as
 *      ax-mdframed boxes; \newtcolorbox title chips drop unresolved-\ref
 *      parentheticals and ignore near-white frame/coltitle colors
 *      (white-on-white text).
 * v26: superscript affiliation markers ("^ *1", "^2,3") split author runs
 *      and are dropped from the rendered names.
 * v27: metadata + fidelity fixes — ICML papers extract \icmltitle/\icmlauthor
 *      into meta (Ctrl-Z rendered with no byline); author splitting drops
 *      footnote-sentence residue ("Equal contribution, …"), splits
 *      thin-space-glue name runs, and strips stray marker characters;
 *      custom listing environments (\DeclareTCBListing/\newtcblisting/
 *      \lstnewenvironment) rewrite to verbatim lstlisting pre-parse so raw
 *      code bodies can't desync environment pairing (Ctrl-Z's appendix
 *      rendered as literal TeX); direct \begin{tcolorbox}[title=…] renders
 *      the same title chip as \newtcolorbox (braced, comma-holding values
 *      included); the unresolved-\ref parenthetical cleanup only fires on
 *      known label prefixes (sec:/fig:/…), so "(ratio a:b)" survives.
 * v28: metadata robustness — author cells defuse name+affiliation glue
 *      (\parbox "Name \\ MATS" truncates at the nested line break); \\ in a
 *      title resolves to whitespace instead of eating the following word
 *      ("…Learn to \\Resist…"); dropped title macros and rejected author
 *      fragments now warn (partial losses were silent); \icmlauthor names
 *      run the \thanks-strip + residue pipeline; \icmltitle beats a
 *      coexisting pdf-stub \title; terminal periods of initials survive
 *      end-trimming ("Ann B."); lowercase-stylized ("danah boyd"),
 *      particle ("'t Hooft", "op den Akker"), and parenthetical
 *      native-script names are accepted. Plus: \newtcblisting leading
 *      init-options parse, environment rewriting is verbatim-aware, and
 *      tcolorbox title parsing is brace-aware and unified.
 * v29: PDF-figure rasterization cap raised 30→80 — figure-heavy papers
 *      (2607.18966v1 ships 41 vector PDFs) overflowed the cap and fell
 *      back to link placeholders for the excess figures, main-body
 *      figures included.
 * v30: forest environments render as nested-div HTML trees
 *      (transforms/forest.ts; unparseable diagrams keep the raw-source
 *      fallback), and committed figure overrides
 *      (src/content/arxiv-overrides/{id}/…) are merged into the files map —
 *      an `x.pdf.svg` override wins over a rasterized `x.pdf.png` sibling.
 * v31: biblatex submissions synthesize a numeric `thebibliography` from their
 *      `.bib` database instead of leaking internal citation keys when their
 *      Biber-format `.bbl` cannot be parsed.
 */
export const CONVERTER_VERSION = 31;

export interface ConversionWarning {
  /** Stable machine code, e.g. "unknown-macro", "katex-error". */
  code: string;
  /** Human-readable specifics, e.g. the macro name. */
  detail: string;
  /** Occurrences, when the same (code, detail) repeats. */
  count: number;
}

export interface TexMeta {
  title?: string;
  authors?: string[];
  abstract?: string;
}

export type PaperTocEntryKind = "abstract" | "section" | "references" | "footnotes";

/**
 * One entry of a paper's section tree, extracted at conversion time from the
 * sanitized HAST. Flat array in document order; nesting derives from `level`.
 * Entry ids are the anchor targets used by sidebar navigation and by
 * `Paper.edits` sectionEnd refs — stable for a pinned arXiv version +
 * converter version (same contract as data-anchor).
 */
export interface PaperTocEntry {
  kind: PaperTocEntryKind;
  /** "ax-sec-…" for sections; "ax-abstract"/"ax-references"/"ax-footnotes" for landmarks. */
  id: string;
  /** Plain-text title WITHOUT the section number, e.g. "Model Architecture". */
  title: string;
  /** "3.2", "A.1", or "" for unnumbered (starred) sections and landmarks. */
  number: string;
  /** Heading depth 2–4 (h2–h4); landmark sections are 2. */
  level: number;
  /**
   * The entry's own data-anchor ("b-NNNN"; landmarks use their first anchored
   * descendant). Anchors are assigned in document order, so any block anchor
   * maps to its containing section by numeric comparison.
   */
  anchor?: string;
}

export interface ConversionResult {
  html: string;
  toc: PaperTocEntry[];
  warnings: ConversionWarning[];
  /** Tarball paths of assets actually referenced by the HTML. */
  usedAssets: string[];
  meta: TexMeta;
}

export interface ConvertedPaper {
  html: string;
  toc: PaperTocEntry[];
  warnings: ConversionWarning[];
  meta: TexMeta;
  assets: string[];
  converterVersion: number;
  createdAt: string;
}

/**
 * What `npm run arxiv:build` commits under src/content/arxiv/{id}.json —
 * either a rendered paper or a terminal reason it can't render. Transient
 * failures are never committed; the build script exits nonzero instead.
 */
export type PaperArtifact =
  | { state: "ready"; paper: ConvertedPaper }
  | { state: "pdf-only" }
  | { state: "not-found" }
  | { state: "too-large" }
  | { state: "unsupported" }
  | { state: "failed" };
