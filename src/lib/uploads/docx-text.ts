/**
 * Plain text out of a WordprocessingML body.
 *
 * The target is a textarea, so the output is paragraphs and nothing else: no
 * styles, no images, no lists markers. That is why this reads `w:t` runs
 * directly instead of going through a docx-to-HTML converter and throwing the
 * HTML away.
 */

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeXmlText(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    if (body.startsWith("#x") || body.startsWith("#X")) {
      const code = Number.parseInt(body.slice(2), 16);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : "";
    }
    if (body.startsWith("#")) {
      const code = Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : "";
    }
    const named = ENTITIES[body.toLowerCase()];
    return named ?? whole;
  });
}

function tagName(tag: string): string {
  return tag.replace(/^\//, "").split(/[\s/]/, 1)[0] ?? "";
}

/**
 * Returns the document's visible text, one line per `w:p`, with a table row's
 * cells joined by tabs so a row stays one line.
 *
 * `w:instrText` holds field instruction codes (`PAGE`, `HYPERLINK "…"`) which
 * are markup rather than text, so its runs are dropped. Tracked deletions need
 * no handling: Word stores them as `w:delText`, which is not `w:t`.
 */
export function docxDocumentText(xml: string): string {
  const body = xml.match(/<w:body[\s>][\s\S]*?<\/w:body>/)?.[0] ?? xml;

  const lines: string[] = [];
  let cell = "";
  let row: string[] = [];
  let inRow = false;
  let inText = false;
  let instructionDepth = 0;

  const pushLine = () => {
    if (inRow) row.push(cell);
    else lines.push(cell);
    cell = "";
  };

  const token = /<([^>]*)>|([^<]+)/g;
  let match: RegExpExecArray | null;
  while ((match = token.exec(body)) !== null) {
    const literal = match[2];
    if (literal !== undefined) {
      if (inText && instructionDepth === 0) cell += decodeXmlText(literal);
      continue;
    }
    const tag = match[1] ?? "";
    const closing = tag.startsWith("/");
    const selfClosing = tag.endsWith("/");
    switch (tagName(tag)) {
      case "w:t":
        if (!selfClosing) inText = !closing;
        break;
      case "w:instrText":
        if (!selfClosing) instructionDepth += closing ? -1 : 1;
        break;
      case "w:tab":
        if (!closing) cell += "\t";
        break;
      case "w:br":
      case "w:cr":
        // A soft break inside a paragraph is still a line to the reader.
        if (!closing) pushLine();
        break;
      case "w:p":
        if (closing) pushLine();
        break;
      case "w:tr":
        if (closing) {
          inRow = false;
          lines.push(row.join("\t"));
          row = [];
        } else if (!selfClosing) {
          inRow = true;
          row = [];
        }
        break;
      default:
        break;
    }
  }
  if (cell) pushLine();
  if (inRow && row.length) lines.push(row.join("\t"));

  return lines.join("\n");
}
