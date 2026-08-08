/**
 * Rehype plugin (registered in next.config.ts after rehype-lesson-sections,
 * before rehype-auto-gloss so the line is still one text node): emphasises the
 * label prefixes on a lesson's section-spec line — the "Runtime: … Status: …
 * Hard idea: …" metadata that opens the draft module-2 sections.
 *
 * Each label otherwise runs straight into its value ("35 minutes Hard idea:"),
 * so the eye has no anchor and the line reads as one run-on. Wrapping each
 * label in `<span class="lesson-meta-label">` (coloured with the theme's
 * readable brand ink, in globals.css) gives every segment a start without
 * touching the transcribed words — a render rule, so the source MDX stays
 * verbatim (the same choice `titleAwareHeadings` and `rehype-auto-gloss` make
 * rather than policing the sources).
 *
 * Scope guard: only a paragraph whose single text child begins with "Runtime:"
 * is treated as a spec line — no running prose starts that way — so nothing
 * else in the course is touched. The labels are a fixed vocabulary and the
 * spec lines carry no internal colons, so a value can never be mistaken for a
 * label.
 */
const LABELS = ["Runtime", "Status", "Hard idea"];
const LABEL_RE = new RegExp(`(?:${LABELS.join("|")}):`, "g");

export default function rehypeLessonMeta() {
  return (tree) => walk(tree);
}

function walk(node) {
  const children = node.children;
  if (!Array.isArray(children)) return;
  for (const child of children) {
    if (child.type === "element" && child.tagName === "p") {
      emphasiseSpecLabels(child);
    } else {
      walk(child);
    }
  }
}

function emphasiseSpecLabels(p) {
  const kids = p.children;
  if (kids.length !== 1 || kids[0].type !== "text") return;
  const text = kids[0].value;
  if (!/^\s*Runtime:/.test(text)) return;

  const out = [];
  let cursor = 0;
  LABEL_RE.lastIndex = 0;
  for (let match; (match = LABEL_RE.exec(text)); ) {
    if (match.index > cursor) {
      out.push({ type: "text", value: text.slice(cursor, match.index) });
    }
    out.push({
      type: "element",
      tagName: "span",
      properties: { className: ["lesson-meta-label"] },
      children: [{ type: "text", value: match[0] }],
    });
    cursor = match.index + match[0].length;
  }
  if (out.length === 0) return;
  if (cursor < text.length) out.push({ type: "text", value: text.slice(cursor) });
  p.children = out;
}
