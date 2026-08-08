/**
 * Where a lesson breaks into parts.
 *
 * Pure: the reader hands over one descriptor per top-level block of the
 * rendered body and gets back the grouping. Keeping the decision out of the
 * DOM walk is what makes the two rules below testable, because both of them
 * are judgement calls that were wrong once already.
 */

export interface PartSource {
  /** Upper-case tag name, as the DOM reports it. */
  tag: string;
  /** The block's text, for measuring whether a part is worth being one. */
  text: string;
}

export interface PlannedPart {
  label: string;
  /** Index into the source array of the block whose id anchors this part. */
  headingIndex: number | null;
  /** Indices of the blocks this part shows. */
  indices: number[];
}

/**
 * Below this many characters a part is not a part — it is one thing you land
 * on and immediately press Next past.
 *
 * The number comes from measuring the course rather than from taste. The
 * smallest parts anyone writes on purpose run 464, 619, 754, 782 characters —
 * a heading and two or three sentences, or a heading and a widget with a line
 * introducing it. What the chunker was producing on its own ran 69, 114, 209
 * and 267: a bare video, a one-line "Before you begin", a two-line "Notebook
 * output". There is a clean gap between the two sets and this sits in it.
 *
 * Measured on text, deliberately, with no credit for an embedded video or
 * widget. The 69-character case IS a video — a fifteen-minute one — and it
 * still read as a broken page, because a part holding one embed and no words
 * gives a reader nothing to arrive at. Folded into its neighbour the video is
 * not lost, and nothing about it shrinks; it simply stops being a page of its
 * own.
 */
export const MIN_PART_CHARS = 400;

/** Fewer than this and the lesson is not chunked at all. */
export const MIN_PARTS = 3;

/**
 * Boundary depth is adaptive: h2 alone where a lesson has enough of them, h3
 * and then h4 folded in where it does not.
 */
function boundaryTags(items: PartSource[]): string[] {
  const count = (tags: string[]) =>
    items.filter((i) => tags.includes(i.tag)).length;
  let tags = ["H2"];
  if (count(tags) < 2) tags = ["H2", "H3"];
  if (count(tags) < 2) tags = ["H2", "H3", "H4"];
  return tags;
}

function charsOf(part: PlannedPart, items: PartSource[]): number {
  return part.indices
    .map((i) => items[i].text.replace(/\s+/g, " ").trim())
    .join(" ")
    .trim().length;
}

export function planParts(items: PartSource[]): PlannedPart[] {
  const tags = boundaryTags(items);
  const parts: PlannedPart[] = [];
  let cur: PlannedPart | null = null;

  // A boundary heading with nothing beneath it before the next heading would
  // stand as a part that reads as a lone title over blank space. Consecutive
  // headings fold into one part until body arrives, which also absorbs a stray
  // title h1 a body should not carry (the page owns the h1).
  const bodyless = (p: PlannedPart | null) =>
    !!p && p.indices.every((i) => tags.includes(items[i].tag));

  items.forEach((item, i) => {
    if (tags.includes(item.tag)) {
      if (bodyless(cur)) {
        cur!.indices.push(i);
        return;
      }
      cur = { label: item.text, headingIndex: i, indices: [i] };
      parts.push(cur);
      return;
    }
    if (!cur) {
      cur = { label: "Start", headingIndex: null, indices: [] };
      parts.push(cur);
    }
    cur.indices.push(i);
  });

  return foldSmall(parts, items);
}

/**
 * Merge away the parts too small to be one.
 *
 * Backwards by default, so a short trailing section joins the reading it
 * belongs to. The first part has nothing behind it, so it folds forwards
 * instead and its blocks open the next part — which is what puts a lesson's
 * opening video above the first real heading rather than on a page of its own.
 *
 * Repeated until nothing more merges: two tiny parts in a row (2.1 has
 * exactly that) would otherwise leave the second one standing.
 */
function foldSmall(parts: PlannedPart[], items: PartSource[]): PlannedPart[] {
  let out = parts;
  for (let pass = 0; pass < out.length + 1; pass++) {
    const at = out.findIndex((p) => charsOf(p, items) < MIN_PART_CHARS);
    if (at < 0 || out.length < 2) break;
    const next = out.slice();
    if (at === 0) {
      // Forwards: the following part keeps its own label and heading.
      next[1] = { ...next[1], indices: [...next[0].indices, ...next[1].indices] };
      next.splice(0, 1);
    } else {
      next[at - 1] = {
        ...next[at - 1],
        indices: [...next[at - 1].indices, ...next[at].indices],
      };
      next.splice(at, 1);
    }
    out = next;
  }
  return out;
}
