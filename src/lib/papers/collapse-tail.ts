// Wraps a paper's trailing apparatus — the References/Footnotes landmark
// sections and the flat appendix sections that follow References — in native
// <details class="ax-collapse"> blocks, closed by default, with the section
// heading as the <summary>. Same native-details idiom as the hide markers:
// no hydration surface; the chevron is CSS (arxiv-paper.css) and the only
// client help is PaperCollapse, which opens a block when a fragment link
// targets content inside it.
//
// String-level like split-paper.ts: landmark <section> elements are the
// converters' own well-formed wrappers, and appendix <h2>s are flat,
// top-level siblings in every converter's output — nothing here parses HTML.

const LANDMARK_RE =
  /<section class="(?:ax-references|ax-footnotes|lw-footnotes|sb-footnotes)"[^>]*>/g;

const H2_RE = /<h2[\s>]/g;

/**
 * End index (exclusive) of the <section> element opening at `start`.
 * Exported for apply-edits' ungated-tail split, which extracts the landmark
 * sections' exact byte ranges.
 */
export function sectionElementEnd(html: string, start: number): number | null {
  const tag = /<\/?section[\s>]/g;
  tag.lastIndex = start + 1;
  let depth = 1;
  for (let m = tag.exec(html); m; m = tag.exec(html)) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) {
      const gt = html.indexOf(">", m.index);
      // A final closer whose ">" never comes (truncated markup) must read
      // as malformed — indexOf's -1 would otherwise become end index 0 and
      // the caller's cursor/lastIndex reset would loop on the same landmark.
      return gt === -1 ? null : gt + 1;
    }
  }
  return null;
}

/** Wraps `inner` (heading-first section content) in the details markup. */
function wrapInner(inner: string): string {
  const h = /^\s*(<h2[^]*?<\/h2>)/.exec(inner);
  if (!h) return inner; // no heading to hang the toggle on — leave untouched
  const heading = h[1];
  const rest = inner.slice(h[0].length);
  return `<details class="ax-collapse"><summary>${heading}</summary>${rest}</details>`;
}

/**
 * Collapses the trailing sections of one html fragment. Landmark sections
 * (references/footnotes, any position) always collapse; flat <h2> sections
 * collapse only AFTER a references landmark (the appendix run in arXiv
 * papers). Fragments without either come back byte-identical.
 *
 * Activity/gate splices split one document into sequential html parts, so
 * the references-seen state is threaded rather than per-call: pass the
 * previous part's returned `sawReferences` as the next part's initial flag
 * and the whole document collapses as one walk — an appendix fragment after
 * a split still collapses even though its References landmark sits in an
 * earlier part.
 */
export function collapseTailSections(
  html: string,
  sawReferences = false,
): { html: string; sawReferences: boolean } {
  LANDMARK_RE.lastIndex = 0;
  const first = LANDMARK_RE.exec(html);
  if (!first && !sawReferences) return { html, sawReferences };

  let out = "";
  let cursor = 0;
  LANDMARK_RE.lastIndex = 0;
  for (let m = LANDMARK_RE.exec(html); m; m = LANDMARK_RE.exec(html)) {
    if (m.index < cursor) continue; // opener inside an already-emitted region
    const end = sectionElementEnd(html, m.index);
    if (end === null) {
      // Malformed — stop transforming, keep the rest raw.
      return { html: out + html.slice(cursor), sawReferences };
    }
    const between = html.slice(cursor, m.index);
    out += sawReferences ? collapseFlatRun(between) : between;
    const openTag = html.slice(m.index, html.indexOf(">", m.index) + 1);
    const close = html.lastIndexOf("</section", end);
    out += openTag + wrapInner(html.slice(m.index + openTag.length, close)) +
      html.slice(close, end);
    if (openTag.includes("ax-references")) sawReferences = true;
    cursor = end;
    LANDMARK_RE.lastIndex = end;
  }
  out += sawReferences ? collapseFlatRun(html.slice(cursor)) : html.slice(cursor);
  return { html: out, sawReferences };
}

/** Wraps each flat h2-headed run in `html` (an appendix stretch) in details. */
function collapseFlatRun(html: string): string {
  H2_RE.lastIndex = 0;
  const starts: number[] = [];
  for (let m = H2_RE.exec(html); m; m = H2_RE.exec(html)) starts.push(m.index);
  if (starts.length === 0) return html;
  let out = html.slice(0, starts[0]);
  for (let i = 0; i < starts.length; i++) {
    const seg = html.slice(starts[i], starts[i + 1] ?? html.length);
    out += wrapInner(seg);
  }
  return out;
}
