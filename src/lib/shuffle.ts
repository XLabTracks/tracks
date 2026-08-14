/**
 * Deterministic shuffling for answer options.
 *
 * The problem it solves is measured, not theoretical: across the platform's
 * question banks 86% of correct answers sat in slot A or B, and single banks
 * were far worse — one quiz ran four Bs out of five, another put the answer
 * first in all fifteen of its questions. That is a pattern a learner reads
 * instead of the question.
 *
 * These banks were written by Claude, in this repo, mostly within days of this
 * file. So this is not a general observation about how authors work: it is a
 * defect in how the exercises were built. Nobody checked what the finished
 * exercise looked like to somebody trying to solve it — which is the actual
 * lesson, and a shuffle is only half of it. The other half is that a widget
 * has to be looked at as a thing to be beaten, not just as a thing to be
 * rendered. `whistleblower-levers` is the case in point and no amount of
 * shuffling would have caught it by itself: it mapped one array over both the
 * rows and the chips, so the answer to row N was always chip N and the whole
 * matching fell to the diagonal without being read.
 *
 * Two decisions shape everything here.
 *
 * **The order is a function of the question, not of the visit.** Randomising
 * per render would be wrong three times over: it breaks SSR against hydration,
 * it moves the options under a learner who comes back to a question they
 * already answered, and it would silently break the facilitator guide, whose
 * session plans carry answer keys that a room of people reads together. Same
 * question, same order, every learner, every device, forever — but no longer
 * the order it happened to be authored in.
 *
 * **Nothing is keyed on position.** The shuffle returns each item with the
 * index it was authored at, so a caller compares against THAT and never
 * against where the option now appears. This is what lets index-keyed banks
 * (the drill benches' `right`, the reader's `<Check answer={n}/>`) shuffle
 * without their keys moving, and what lets already-stored learner picks keep
 * meaning what they meant.
 */

/** FNV-1a over the seed string. Stable across platforms and Node versions. */
function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, and good enough for shuffling four options. */
function prng(state: number): () => number {
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A permutation of `[0, n)` determined entirely by `seed`: the value at index
 * `i` is the ORIGINAL index of whatever should now be shown in position `i`.
 */
export function seededPermutation(seed: string, n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  const rand = prng(hashSeed(seed));
  // Fisher-Yates, back to front.
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** One option in display order, carrying the index it was authored at. */
export interface Shuffled<T> {
  item: T;
  /** Where this sat in the authored array. Every key compares against this. */
  from: number;
}

/**
 * Reorders `items` deterministically from `seed`.
 *
 * `pinned` names positions that must not move — an option that only makes
 * sense last ("None of the above"), or a scale whose order is the content.
 * Pinned items stay at their authored index and the rest are shuffled through
 * the positions that are left, so pinning one option does not stop the others
 * moving.
 */
export function seededShuffle<T>(
  seed: string,
  items: readonly T[],
  pinned?: (item: T, index: number) => boolean,
): Shuffled<T>[] {
  const n = items.length;
  if (n < 2) return items.map((item, from) => ({ item, from }));

  const fixed = pinned ? items.map(pinned) : [];
  const movable = Array.from({ length: n }, (_, i) => i).filter(
    (i) => !fixed[i],
  );
  if (movable.length < 2) return items.map((item, from) => ({ item, from }));

  // Shuffle the movable indices among themselves, then lay them back into the
  // slots the pinned items left free — in order, so the free slots are filled
  // left to right.
  const perm = seededPermutation(seed, movable.length);
  const reordered = perm.map((p) => movable[p]);

  const out: Shuffled<T>[] = [];
  let next = 0;
  for (let slot = 0; slot < n; slot++) {
    const from = fixed[slot] ? slot : reordered[next++];
    out.push({ item: items[from], from });
  }
  return out;
}

/**
 * True for an option that must not be moved off the end of the list.
 *
 * A backstop, not the mechanism: a call site that knows its content should say
 * so explicitly. This exists because "None of the above" reshuffled into the
 * middle is a bug that reads as a typo, and the phrasing is standard enough to
 * catch reliably.
 */
export function isTerminalOption(text: string): boolean {
  return /^\s*(none|all|any|neither|both|either)\s+of\s+(the\s+)?(above|these|them)\b/i.test(
    text,
  );
}

/**
 * True when a two-option list is a true/false or yes/no pair.
 *
 * Those have a conventional order and reversing half of them reads as an
 * error, not as variety — and there is no positional bias to fix, because with
 * two options the author had no third slot to under-use. Shuffling them buys
 * nothing and costs recognition.
 */
export function isBinaryPair(texts: readonly string[]): boolean {
  if (texts.length !== 2) return false;
  const pair = texts.map((t) => t.trim().toLowerCase().replace(/[.?!]$/, ""));
  return (
    (pair[0] === "true" && pair[1] === "false") ||
    (pair[0] === "false" && pair[1] === "true") ||
    (pair[0] === "yes" && pair[1] === "no") ||
    (pair[0] === "no" && pair[1] === "yes")
  );
}

/**
 * The shuffle every answer list should use unless it has a reason not to:
 * seeded on the question's own id, pinning terminal options, and stepping
 * aside for true/false pairs.
 */
export function shuffleAnswerOptions<T>(
  seed: string,
  items: readonly T[],
  text: (item: T) => string,
): Shuffled<T>[] {
  if (isBinaryPair(items.map(text))) {
    return items.map((item, from) => ({ item, from }));
  }
  return seededShuffle(seed, items, (item) => isTerminalOption(text(item)));
}
