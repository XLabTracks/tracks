/**
 * Focus reading: bold the opening letters of a word so the eye lands on the
 * word shape and the reader supplies the rest.
 *
 * The rules — which words take the treatment and how much of each — are pure
 * functions with no DOM in them, so they are tested directly. The marker
 * below is the thin part that puts them on a page.
 *
 * The guarantee the whole feature rests on: **the text content of the page
 * never changes.** Every transform wraps letters that were already there and
 * adds not one character, so find-in-page, selection, copy, and the highlight
 * anchors (which key on character offsets into normalized text, not on DOM
 * paths) all keep working. Anything that would insert or drop text is a bug,
 * not a style choice.
 *
 * `<b>` and not `<strong>`: this is a reading aid, not emphasis. `<strong>`
 * carries meaning a screen reader announces, and announcing "important" on the
 * first third of every word would be the accessibility damage this feature is
 * supposed to avoid.
 */

export type FocusMode = "off" | "light" | "standard";

export interface FocusSettings {
  mode: FocusMode;
  /** Leave the little joining words plain, so the accents mark content. */
  skipShort: boolean;
}

export const FOCUS_DEFAULTS: FocusSettings = { mode: "off", skipShort: true };

/** Words at or below this length are the ones `skipShort` leaves alone. */
export const SHORT_WORD_MAX = 3;

/**
 * How many leading characters of `word` to bold — 0 for "leave it alone".
 *
 * The exclusions are the course's, and each one is a place where bold would
 * either lie or destroy information:
 *
 *   digits          10^26 FLOP, 2026, §4.2 — a number is read whole, and a
 *                   half-bold number reads as two numbers.
 *   ALL CAPS        IAEA, FLOP, HUMINT. An abbreviation has no word shape to
 *                   complete; it is already a shape.
 *   non-letters     URLs, file paths, code identifiers, DOIs. These are
 *                   copied and typed, never skimmed.
 *
 * Anything already emphasised, and any heading, is excluded by the walker
 * rather than here: that is a property of where the word sits, not of the word.
 */
export function focusPrefixLength(word: string, settings: FocusSettings): number {
  if (settings.mode === "off") return 0;

  // Letters, and the marks that live inside a word. Anything else and the
  // token is not prose.
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'’-]*$/u.test(word)) return 0;

  const letters = [...word].filter((c) => /\p{L}/u.test(c));
  if (letters.length < 2) return 0;

  // An abbreviation, not a word: IAEA, FLOP, HUMINT, US. Mixed case is a
  // word with a capital (Mitigating, McKinsey), so only all-caps is excluded.
  if (word === word.toLocaleUpperCase() && word !== word.toLocaleLowerCase()) {
    return 0;
  }

  if (settings.skipShort && letters.length <= SHORT_WORD_MAX) return 0;

  const share = settings.mode === "light" ? 1 / 3 : 1 / 2;
  const n = Math.ceil(letters.length * share);
  // At least one letter must stay plain, or the "word shape" is the whole
  // word in bold and the effect is a heavier paragraph, not a faster one.
  return Math.min(n, letters.length - 1);
}

/**
 * Wrap every eligible word in `root` once, for BOTH strengths at once:
 *
 *     <span data-focus-word><b data-fw-a>Mit</b><b data-fw-b>ig</b>ating</span>
 *      light = the first <b>            standard = both
 *
 * Structure is written a single time and never again; switching strength or
 * turning the whole thing off is then a class on an ancestor and pure CSS.
 * That is the point, and it is not a micro-optimisation:
 *
 * The lesson body is rendered by a server component, so the client cannot
 * rewrite it as a React tree — and mutating it repeatedly is worse, because
 * the markup belongs to React. Change the structure under React twice and the
 * next render finds a tree it did not build; it recovers by discarding the
 * subtree, which on this page looks like the whole lesson disappearing on the
 * second click. One pass, done after mount, is the amount of that risk this
 * feature is allowed to take.
 *
 * Idempotent: a root already marked is left alone, so a re-run after a route
 * change costs nothing and cannot nest wrappers.
 */
export function markFocusWords(root: HTMLElement): void {
  if (root.dataset.focusMarked === "1") return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // Never add an element child to the root itself: the part-chunker reads
      // `.lesson-body`'s direct children as the lesson's blocks, and a wrapped
      // stray text node would arrive there as a block of its own.
      if (parent === root) return NodeFilter.FILTER_REJECT;
      if (parent.closest(FOCUS_SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !/\p{L}/u.test(node.nodeValue)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const texts: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) texts.push(n as Text);

  const light: FocusSettings = { mode: "light", skipShort: false };
  const standard: FocusSettings = { mode: "standard", skipShort: false };

  for (const text of texts) {
    const source = text.nodeValue ?? "";
    const pieces = source.split(/(\s+)/);
    if (!pieces.some((p) => focusPrefixLength(p, standard) > 0)) continue;

    const frag = document.createDocumentFragment();
    for (const piece of pieces) {
      const a = focusPrefixLength(piece, light);
      const bEnd = focusPrefixLength(piece, standard);
      if (a === 0 && bEnd === 0) {
        frag.appendChild(document.createTextNode(piece));
        continue;
      }
      const word = document.createElement("span");
      word.setAttribute("data-focus-word", "");
      // Short joining words are marked, not skipped: the preference toggles
      // them with a class rather than a second pass over the document.
      if (focusPrefixLength(piece, { mode: "standard", skipShort: true }) === 0) {
        word.setAttribute("data-fw-short", "");
      }
      if (a > 0) {
        const head = document.createElement("b");
        head.setAttribute("data-fw-a", "");
        head.textContent = piece.slice(0, a);
        word.appendChild(head);
      }
      if (bEnd > a) {
        const more = document.createElement("b");
        more.setAttribute("data-fw-b", "");
        more.textContent = piece.slice(a, bEnd);
        word.appendChild(more);
      }
      word.appendChild(document.createTextNode(piece.slice(Math.max(a, bEnd))));
      frag.appendChild(word);
    }
    text.parentNode?.replaceChild(frag, text);
  }

  root.dataset.focusMarked = "1";
}

/** The class that carries a setting onto an already-marked subtree. */
export function focusClassName(settings: FocusSettings): string {
  if (settings.mode === "off") return "";
  return [
    settings.mode === "light" ? "focus-light" : "focus-standard",
    settings.skipShort ? "focus-skip-short" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Subtrees the marker never enters. Read exactly, already emphasised, or
 *  structural — see the exclusion list in focusPrefixLength for the rest. */
const FOCUS_SKIP_SELECTOR = [
  "code", "pre", "kbd", "samp", "var", "math", ".katex",
  "a", "strong", "b", "em", "i", "mark", "abbr", "sup", "sub",
  ".ax-gloss", "[data-gloss]", "[data-no-focus]",
  "h1", "h2", "h3", "h4", "h5", "h6", "th",
  ".not-prose",
].join(",");

export const FOCUS_STORAGE_KEY = "vt-focus-reading";

/** Stored preference, or the default when absent or unreadable. */
export function readFocusSettings(): FocusSettings {
  try {
    const raw = localStorage.getItem(FOCUS_STORAGE_KEY);
    if (!raw) return FOCUS_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<FocusSettings>;
    const mode: FocusMode =
      parsed.mode === "light" || parsed.mode === "standard" ? parsed.mode : "off";
    return { mode, skipShort: parsed.skipShort !== false };
  } catch {
    return FOCUS_DEFAULTS;
  }
}
