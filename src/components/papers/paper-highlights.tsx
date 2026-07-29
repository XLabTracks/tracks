"use client";

import "./paper-highlights.css";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import {
  ChevronRight,
  Highlighter,
  MessageSquarePlus,
  Pencil,
  RotateCcw,
  StickyNote,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildFuzzyIndex,
  captureSelection,
  rangeAnchorElement,
  resolveHighlight,
  type CapturedSelection,
  type FuzzyEntry,
} from "@/lib/highlights/dom";
import {
  HIGHLIGHT_MAX_NOTE_CHARS,
  type CreateHighlightResult,
  type HighlightInput,
  type HighlightRow,
} from "@/lib/highlights/types";
import { stackCommentTops } from "@/lib/highlights/comment-layout";
import {
  MARGIN_NOTES_EVENT,
  MARGIN_NOTES_LAYOUT_EVENT,
  marginNotesEnabled,
} from "./margin-notes-toggle";
// Reading-gate integration is soft by design: this branch has no gate
// feature, so TWO literals are inlined rather than imported, and BOTH must
// match the guided-paper branch when it lands:
//   1. the event name below — PAPER_GATE_OPEN_EVENT in
//      src/lib/papers/gate-state.ts (swap for the shared constant);
//   2. the localStorage VALUE "open" checked in the resolve effect — what
//      that branch's paper-gate.tsx writes via setItem(storageKey, "open")
//      (an inline literal there too; if its convention changes, change the
//      check or every gate reads permanently closed).
// Re-coupling is those two swaps plus passing `gateKeys` from the paper
// page. Until then no gate ever fires the event and `gateKeys` stays
// undefined — every miss classifies as an orphan, which is correct on an
// ungated document.
const PAPER_GATE_OPEN_EVENT = "tracks:paper-gate-open";
const GATE_OPEN_VALUE = "open";

/**
 * Select-to-highlight layer for paper items, mounted as a sibling AFTER
 * <PaperReader/> (signed-in only). Like PaperSidenotes/PaperGlossary it never
 * receives artifact HTML: it discovers the rendered `.paper-reader` root and
 * works over the stable annotation DOM (data-anchor blocks, data-s sentence
 * spans), painting via the CSS Custom Highlight API — live Ranges registered
 * under CSS.highlights, zero DOM mutation, so gloss spans, KaTeX, sidenote
 * cloning, and gate remounts all coexist untouched. A row paints only while
 * its stored snippet still matches the resolved text (src/lib/highlights/
 * match.ts); anything else is listed unpainted in the panel below the paper —
 * as an orphan ("no longer matches") once the whole document is mounted, or
 * as neutral "not revealed yet" while any reading gate is still closed
 * (gateKeys): a closed gate unmounts its content, so a resolution miss there
 * says nothing about drift, and the fuzzy re-match is skipped entirely (a
 * "unique" hit against a partial document can be a false unique). Where the
 * Highlight API is unsupported the panel alone is the surface: capture,
 * note view/edit (each row opens the note card), and delete still work,
 * there's just no inline paint.
 *
 * Noted highlights additionally render as MARGIN COMMENTS: sidenote-like
 * boxes on the paper's note rail, each with a thin elbow connector (a 45°
 * rise off the highlight, then horizontal into the box) pointing at its
 * highlight (glossary-overlay geometry + PaperSidenotes stacking — see
 * positionComments). Toggleable from the page header (MarginNotesToggle);
 * when the outside gutter lacks room the layer reserves the 18rem inset
 * rail itself (paper-comments-inset), and only a column too narrow to
 * inset hides it. Hovering a box reveals an Edit button that swaps the box
 * to an IN-PLACE editor (InlineNoteEditor — same autosave machinery as the
 * card via useNoteAutosave); keyboard/SR users edit via the panel and card,
 * which stay the canonical surfaces.
 *
 * The three actions arrive `.bind()`-ed from the page (server component) and
 * every write is optimistic: temp-id rows reconcile from createAction's
 * return (deduping when the server returns an EXISTING row's id for a
 * duplicate gesture), note saves debounce 800ms (WritingEditor idiom), and a
 * note typed while its create is still in flight parks in pendingNotesRef —
 * parent-held, so it survives the card unmounting, shown as "Pending…",
 * never "Saved" — and replays once the id reconciles. Create failures roll
 * back with an actionable toast (cap and stale-artifact get their own
 * copy), EXCEPT rows holding typed text or an open card: those stay
 * locally, marked "Not saved" with Retry/Delete, so text the UI
 * acknowledged is never destroyed. While the toolbar is open,
 * selectionchange re-captures — a save always describes the selection on
 * screen, not a stale pointerup. No router.refresh — the client copy is
 * the truth until the next full load.
 */

const HL_NAME = "tracks-hl";
const HL_NOTE_NAME = "tracks-hl-note";
/**
 * The hovered noted GROUP's ranges re-register here at higher priority:
 * ::highlight() has no :hover, so the pointermove hit-test promotes the
 * group from the faded noted paint to full strength.
 */
const HL_NOTE_ACTIVE_NAME = "tracks-hl-note-active";
const HL_FLASH_NAME = "tracks-hl-flash";

/**
 * The ::highlight() paint rules, injected at runtime as a constructable
 * stylesheet instead of shipping in paper-highlights.css: Lightning CSS
 * (Turbopack's CSS parser) doesn't recognize the pseudo-element and flags
 * the file on every compile. Only meaningful where the Custom Highlight API
 * exists, which is exactly when the sheet is adopted (supportsPaint gate) —
 * and those browsers all have adoptedStyleSheets. Colors are literal
 * translucent ambers, not theme tokens: no token maps to "marker yellow",
 * and the low alpha reads on both light and dark paper.
 */
const HIGHLIGHT_PAINT_CSS = `
::highlight(${HL_NAME}) {
  background-color: rgb(250 204 21 / 0.3);
}
::highlight(${HL_NOTE_NAME}),
::highlight(${HL_NOTE_ACTIVE_NAME}) {
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
::highlight(${HL_NOTE_NAME}) {
  background-color: rgb(250 204 21 / 0.15);
  text-decoration-color: rgb(217 119 6 / 0.4);
}
::highlight(${HL_NOTE_ACTIVE_NAME}) {
  background-color: rgb(250 204 21 / 0.32);
  text-decoration-color: rgb(217 119 6 / 0.8);
}
::highlight(${HL_FLASH_NAME}) {
  background-color: rgb(245 158 11 / 0.5);
}
`;
const TEMP_PREFIX = "temp-";
/** Half the card width (w-80) — used to clamp popover placement. */
const CARD_HALF = 160;

// Margin-note rail geometry, matching the footnote sidenote layer
// (paper-sidenotes.tsx) and the glossary margin card (glossary-overlay.tsx)
// so all three read as one system: same gutter gap, same max width, same
// 18rem inset reserve and 600px minimum text column. When the outside gutter
// lacks room the notes layer reserves the inset rail ITSELF (the
// `paper-comments-inset` class in paper-highlights.css) — it rides
// PaperSidenotes' reservation when that layer already made one, but doesn't
// depend on the paper having footnotes or the sidenotes preference being on.
// Boxes stack downward with the sidenotes' 12px gap; with no gutter and a
// column too narrow to inset, the layer hides and the highlights panel
// stays the note surface.
const COMMENT_GAP = 28;
const COMMENT_MAX_WIDTH = 300;
const COMMENT_MIN_WIDTH = 200;
const COMMENT_STACK_GAP = 12;
/** = PaperSidenotes' INSET_RESERVE (288) − its gutter gap; see glossary-overlay. */
const COMMENT_INSET_RAIL = 260;
/** The 18rem the inset rail reserves inside the column (PaperSidenotes). */
const COMMENT_INSET_RESERVE = 288;
/** Never squeeze the reading column below this to make rail room. */
const COMMENT_MIN_TEXT_WIDTH = 600;
const COMMENTS_INSET_CLASS = "paper-comments-inset";
/** Breathing room at the connector line's ends (glossary-overlay idiom). */
const LINE_INSET = 4;
/**
 * Boxes sit slightly BELOW their highlight's line top, so the connector's
 * closing segment always has somewhere to angle DOWN to: it runs right from
 * the highlight's end and dips into the box at the last stretch.
 */
const COMMENT_DROP = 8;

function supportsPaint(): boolean {
  return (
    typeof Highlight !== "undefined" &&
    typeof CSS !== "undefined" &&
    "highlights" in CSS
  );
}

interface ToolbarState {
  capture: CapturedSelection;
  /** Document coordinates (glossary-overlay idiom): fixed to the text. */
  left: number;
  top: number;
}

/**
 * Toolbar state for a captured selection: centred under the selection rect,
 * clamped into the viewport, in document coordinates. Shared by the
 * pointerup open and the selectionchange recapture.
 */
function toolbarStateFor(
  capture: CapturedSelection,
  selection: Selection,
): ToolbarState | null {
  if (selection.rangeCount === 0) return null;
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const viewport = document.documentElement.clientWidth;
  const centre = Math.min(
    Math.max(rect.left + rect.width / 2, 90),
    Math.max(viewport - 90, 90),
  );
  return {
    capture,
    left: centre + window.scrollX,
    top: rect.bottom + window.scrollY + 8,
  };
}

interface CardState {
  id: string;
  /** Stable across the temp→server id reconcile, fresh per open. */
  key: number;
  left: number;
  top: number;
  autoFocus: boolean;
}

/** Why an unresolved row isn't painted — decides the panel badge. */
type HighlightMiss = "orphan" | "pending";

/** "parked" = held client-side until the owning row's create reconciles. */
type NoteSaveResult = "saved" | "parked" | "failed";

/** Document order: numeric anchor compare (lexicographic anchors break at a
 * digit-count rollover), then sentence + offset within the block. */
function compareRowOrder(
  a: { blockAnchor: string; sStart: number; startOffset: number },
  b: { blockAnchor: string; sStart: number; startOffset: number },
): number {
  const anchorNum = (anchor: string) => Number.parseInt(anchor.slice(2), 10) || 0;
  return (
    anchorNum(a.blockAnchor) - anchorNum(b.blockAnchor) ||
    a.sStart - b.sStart ||
    a.startOffset - b.startOffset
  );
}

export function PaperHighlights({
  initialHighlights,
  gateKeys,
  createAction,
  updateNoteAction,
  deleteAction,
}: {
  initialHighlights: HighlightRow[];
  /**
   * localStorage keys of the paper's reading gates, one per gate:
   * `tracks:paper-gate:<paperId>:<gateId>`, value "open" once opened
   * (written by the guided-paper branch's PaperGate — unwired here until
   * that branch lands; see the gate-literal note above).
   */
  gateKeys?: string[];
  createAction: (input: HighlightInput) => Promise<CreateHighlightResult>;
  updateNoteAction: (id: string, note: string) => Promise<boolean>;
  deleteAction: (id: string) => Promise<boolean>;
}) {
  const [rows, setRows] = useState<HighlightRow[]>(initialHighlights);
  const [misses, setMisses] = useState<ReadonlyMap<string, HighlightMiss>>(
    () => new Map(),
  );
  /**
   * Temp rows whose create failed while they held a typed note (or an open
   * card): kept locally instead of rolled back so the text is never
   * destroyed — the panel marks them "Not saved" with Retry/Delete.
   */
  const [failedIds, setFailedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [toolbar, setToolbar] = useState<ToolbarState | null>(null);
  const [card, setCard] = useState<CardState | null>(null);
  const [, startTransition] = useTransition();
  const rootRef = useRef<HTMLElement | null>(null);
  const resolvedRef = useRef<Map<string, Range>>(new Map());
  /** Latest rows for async continuations (reconcile-time dedupe checks). */
  const rowsRef = useRef(rows);
  /**
   * Note text typed into a card whose row id is still optimistic, keyed by
   * temp id. Parent-held so it survives the card unmounting mid-create;
   * createFromToolbar's continuation replays it against the server id.
   */
  const pendingNotesRef = useRef<Map<string, string>>(new Map());
  /**
   * Gate storage keys observed opening in THIS session via the gate-open
   * event — localStorage may be unavailable (private mode), and the gate is
   * genuinely open either way.
   */
  const sessionOpenedRef = useRef<Set<string>>(new Set());
  /**
   * Margin-note layer preference (MarginNotesToggle in the page header).
   * Preference only — geometry still hides the layer when neither the
   * outside gutter nor the sidenotes' inset rail has room. Starts FALSE,
   * not the preference's on-default: the layer body-portals at render time
   * (createPortal needs `document`), so SSR and the hydration pass must
   * render nothing — the pre-paint layout effect below syncs the real
   * preference before anything paints.
   */
  const [marginNotesOn, setMarginNotesOn] = useState(false);
  /** Margin box currently in in-place edit mode (hover → Edit). */
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  /** Mirror for positionComments (a stable callback reading refs only). */
  const editingCommentIdRef = useRef<string | null>(null);
  /** The group currently hover-promoted (text-hover or box-hover). */
  const hoveredGroupRef = useRef<string | null>(null);
  /** Ranges MOVED from the faded registry into the active one on hover. */
  const promotedRangesRef = useRef<Range[]>([]);
  /**
   * The reader's pending rAF-coalesced hover hit-test. A ref (not an
   * effect-local) so applyHoverGroup can invalidate it: when the pointer
   * crosses from the reader into a margin box, a hit-test queued from the
   * last move over the rail would otherwise fire AFTER the box promoted
   * its group and demote it with stale coordinates.
   */
  const hoverRafRef = useRef(0);
  useEffect(() => {
    editingCommentIdRef.current = editingCommentId;
  }, [editingCommentId]);
  const commentBoxRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const commentLineRefs = useRef<Map<string, SVGSVGElement>>(new Map());
  /**
   * Rows the user asked to delete (optimistically removed): a note flush
   * racing the delete POST must neither re-save nor toast an error for a
   * row that was just intentionally discarded.
   */
  const deletingIdsRef = useRef<Set<string>>(new Set());
  /** Latest card state for async continuations (create-failure keep check). */
  const cardStateRef = useRef<CardState | null>(null);
  const tempSeq = useRef(0);
  const cardSeq = useRef(0);
  const flashTimer = useRef(0);
  const [resolveTick, bumpResolveTick] = useReducer((tick) => tick + 1, 0);

  // Joined signature so effects key on content, not array identity (the
  // server component sends a fresh array every render).
  const gateSig = gateKeys?.join("\n") ?? "";

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);
  useEffect(() => {
    cardStateRef.current = card;
  }, [card]);

  // Root discovery (exactly one .paper-reader per page) — first, so the
  // mount effects below can read it.
  useEffect(() => {
    rootRef.current = document.querySelector<HTMLElement>(".paper-reader");
  }, []);

  useLayoutEffect(() => {
    // One deliberate mount-time re-render, before paint (SidenotesToggle
    // idiom): localStorage is unreadable during SSR/hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMarginNotesOn(marginNotesEnabled());
  }, []);
  useEffect(() => {
    const sync = () => setMarginNotesOn(marginNotesEnabled());
    window.addEventListener(MARGIN_NOTES_EVENT, sync);
    // Cross-tab preference changes arrive as storage events.
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(MARGIN_NOTES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /**
   * Position the margin-note boxes and their connector lines. Imperative
   * (PaperSidenotes idiom): box heights depend on the rail width, so this
   * sets width, measures, stacks (stackCommentTops), then places each box
   * level with its highlight's first line and draws a dashed line from that
   * line's end to the box — all in document coordinates on body-portal
   * nodes, so scrolling needs no work. Rail choice mirrors glossary-overlay:
   * outside gutter when ≥ COMMENT_MIN_WIDTH spare, else the sidenotes' inset
   * rail when reserved, else hidden (the panel remains the note surface).
   */
  const positionComments = useCallback(() => {
    layoutComments();
    // One-directional cross-layer contract: footnote sidenotes yield
    // downward past user-note boxes. Broadcast after EVERY pass — including
    // ones that hid or unmounted boxes — so PaperSidenotes re-stacks
    // against the settled geometry. No loop: sidenotes never move comments.
    window.dispatchEvent(new Event(MARGIN_NOTES_LAYOUT_EVENT));
    function layoutComments() {
      const boxes = commentBoxRefs.current;
      const lines = commentLineRefs.current;
    const hideAll = () => {
      for (const el of boxes.values()) el.style.visibility = "hidden";
      for (const el of lines.values()) el.style.visibility = "hidden";
    };
    const root = rootRef.current;
    if (!root) return hideAll();

    // Anchor each noted row to its resolved range's FIRST line — a multi-line
    // highlight's bounding rect spans the column, but the note should sit
    // level with where the passage starts. Alongside the rect, work out
    // whether PROSE FOLLOWS the highlight on that anchor line: a range from
    // the highlight's end to its block's end whose first client rect sits on
    // the same line means going straight right would strike through text —
    // those pointers route ABOVE the line instead. (A highlight that wraps
    // consumes its first line entirely, and one ending flush at a line break
    // has nothing after — both test false and keep the straight route.)
    const items: {
      id: string;
      rect: DOMRect;
      box: HTMLDivElement;
      /** Rightmost coverage of the highlight ON ITS FIRST LINE (viewport x). */
      lineRight: number;
      textAfter: boolean;
      blockRight: number;
    }[] = [];
    for (const row of rowsRef.current) {
      // Same membership rule as the portal: noted rows, plus the row whose
      // box is in edit mode with a just-emptied textarea.
      if (!row.note && editingCommentIdRef.current !== row.id) continue;
      const box = boxes.get(row.id);
      if (!box) continue;
      const range = resolvedRef.current.get(row.id);
      // A multi-sentence range's client rects FRAGMENT per sentence span:
      // rects[0] ends at the first sentence's end, not at the highlight's
      // actual reach on that line — the pointer must start where the FIRST
      // LINE's coverage ends, the max right edge over every fragment
      // sharing that line.
      const rects = range
        ? [...range.getClientRects()].filter(
            (r) => r.width > 0.5 && r.height > 0,
          )
        : [];
      const first = rects[0];
      if (!range || !first) {
        box.style.visibility = "hidden";
        const svg = lines.get(row.id);
        if (svg) svg.style.visibility = "hidden";
        continue;
      }
      let lineRight = first.right;
      for (const fragment of rects) {
        if (Math.abs(fragment.top - first.top) < first.height / 2) {
          lineRight = Math.max(lineRight, fragment.right);
        }
      }
      let textAfter = false;
      let blockRight = lineRight;
      const endEl =
        range.endContainer instanceof Element
          ? range.endContainer
          : range.endContainer.parentElement;
      const block = endEl?.closest("[data-anchor]");
      if (block) {
        blockRight = block.getBoundingClientRect().right;
        try {
          const after = document.createRange();
          after.selectNodeContents(block);
          after.setStart(range.endContainer, range.endOffset);
          const aRect = after.getClientRects()[0];
          textAfter = Boolean(
            aRect &&
              aRect.width > 2 &&
              Math.abs(aRect.top - first.top) < first.height / 2,
          );
        } catch {
          // Boundary outside the block (shouldn't happen) — straight route.
        }
      }
      items.push({ id: row.id, rect: first, box, lineRight, textAfter, blockRight });
    }
    if (items.length === 0) {
      // Nothing to show — release any rail this layer reserved.
      root.classList.remove(COMMENTS_INSET_CLASS);
      return hideAll();
    }

    const cRect = root.getBoundingClientRect();
    const spare = Math.min(
      COMMENT_MAX_WIDTH,
      document.documentElement.clientWidth - cRect.right - COMMENT_GAP * 2,
    );
    let left: number;
    let width: number;
    if (spare >= COMMENT_MIN_WIDTH) {
      root.classList.remove(COMMENTS_INSET_CLASS);
      left = cRect.right + COMMENT_GAP + window.scrollX;
      width = spare;
    } else if (
      root.classList.contains("paper-sidenotes-inset") ||
      root.clientWidth - COMMENT_INSET_RESERVE >= COMMENT_MIN_TEXT_WIDTH
    ) {
      // Ride the footnote layer's inset reservation when it exists; else
      // reserve the rail ourselves. Adding the class reflows the text — the
      // ResizeObserver in the effect below fires on the padding change and
      // re-runs this pass against the settled rects (one converging pass:
      // once the class is present nothing toggles, so no loop).
      root.classList.toggle(
        COMMENTS_INSET_CLASS,
        !root.classList.contains("paper-sidenotes-inset"),
      );
      left = cRect.right - COMMENT_INSET_RAIL + window.scrollX;
      width = COMMENT_INSET_RAIL;
    } else {
      root.classList.remove(COMMENTS_INSET_CLASS);
      return hideAll();
    }
    items.sort((a, b) => a.rect.top - b.rect.top);

    // Widths first, then one measuring pass — heights depend on width.
    for (const { box } of items) {
      box.style.left = `${left}px`;
      box.style.width = `${width}px`;
    }
    const tops = stackCommentTops(
      items.map(({ rect, box }) => ({
        top: rect.top + window.scrollY + COMMENT_DROP,
        height: box.offsetHeight,
      })),
      COMMENT_STACK_GAP,
    );
    for (let i = 0; i < items.length; i++) {
      const { id, rect, box, lineRight, textAfter, blockRight } = items[i];
      const top = tops[i];
      box.style.top = `${top}px`;
      box.style.visibility = "visible";
      const svg = lines.get(id);
      const line = svg?.querySelector("polyline");
      if (!svg || !line) continue;
      const x1 = lineRight + window.scrollX + LINE_INSET;
      const y1 = rect.top + rect.height / 2 + window.scrollY;
      const x2 = left - LINE_INSET;
      const y2 = top + 12;
      // Two routes, both ending in a 45° drop into the note (the dropped
      // box puts its entry below the line):
      // — Nothing on the anchor line after the highlight (it wraps past the
      //   line, or ends flush at a line break): straight RIGHT from the
      //   highlight's end at the line's own level, then down.
      // — Prose follows on the line: rise ABOVE the text into the
      //   inter-line gap first, run across up there until clear of the
      //   block, then continue and drop. Never a strikethrough.
      let points: [number, number][];
      if (!textAfter) {
        const bendX = Math.max(x2 - Math.max(Math.abs(y2 - y1), 12), x1 + 8);
        points = [
          [x1, y1],
          [bendX, y1],
          [x2, y2],
        ];
      } else {
        // The crossing route sprouts from the highlight's TOP-RIGHT corner —
        // just inside the end of the highlighted segment, at the top edge of
        // its text — kicks up into the inter-line gap, and runs from there.
        const xTop = x1 - LINE_INSET - 2;
        const yTop = rect.top + window.scrollY;
        // Default gap level — unless HIGHLIGHTED text sits on the line
        // above the run: the stroke would lie on that paint and read as
        // covered, so hug the current line instead. Checked dynamically
        // against every resolved range's rects (any highlight, any group).
        let yGap = yTop - 3;
        const runLeft = lineRight - 4;
        const runRight = blockRight;
        for (const other of resolvedRef.current.values()) {
          let covered = false;
          for (const r of other.getClientRects()) {
            if (r.width < 1 || r.height < 1) continue;
            if (
              r.bottom <= rect.top + 2 &&
              r.bottom > rect.top - 14 &&
              r.right > runLeft &&
              r.left < runRight
            ) {
              covered = true;
              break;
            }
          }
          if (covered) {
            yGap = yTop - 1;
            break;
          }
        }
        const riseX = xTop + 6;
        const exitX = Math.max(blockRight + window.scrollX + 8, riseX + 4);
        const bendX = Math.min(
          Math.max(x2 - Math.max(Math.abs(y2 - yGap), 12), exitX),
          Math.max(x2 - 4, exitX),
        );
        points = [
          [xTop, yTop],
          [Math.min(riseX, bendX - 4), yGap],
          [bendX, yGap],
          [x2, y2],
        ];
      }
      // SVG box from the path's bounds, padded so the stroke isn't clipped
      // where a segment runs along an edge.
      const pad = 2;
      const xs = points.map(([x]) => x);
      const ys = points.map(([, y]) => y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys) - pad;
      const width = Math.max(Math.max(...xs) - minX, 1);
      const height = Math.max(...ys) + pad - minY;
      svg.style.left = `${minX}px`;
      svg.style.top = `${minY}px`;
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      line.setAttribute(
        "points",
        points.map(([x, y]) => `${x - minX},${y - minY}`).join(" "),
      );
      svg.style.visibility = "visible";
    }
    }
  }, []);

  // First resolution runs a macrotask after mount: gates reopen from
  // localStorage in a mount-time LAYOUT effect whose re-render can flush our
  // passive effects first — by the time a timeout fires, reopened gates'
  // content is committed. Later re-resolves ride PAPER_GATE_OPEN_EVENT
  // (dispatched inside the gate's click handler, so its reveal and our tick
  // land in the same React batch — the effect below sees the revealed DOM).
  useEffect(() => {
    const handle = window.setTimeout(bumpResolveTick, 0);
    const onGateOpen = (event: Event) => {
      const key = (event as CustomEvent<{ storageKey?: unknown }>).detail
        ?.storageKey;
      if (typeof key === "string") sessionOpenedRef.current.add(key);
      bumpResolveTick();
    };
    window.addEventListener(PAPER_GATE_OPEN_EVENT, onGateOpen);
    return () => {
      window.clearTimeout(handle);
      window.removeEventListener(PAPER_GATE_OPEN_EVENT, onGateOpen);
    };
  }, []);

  // Resolve + paint. Live Ranges survive reflow, so there is no resize or
  // mutation handling — this re-runs only when the row set changes or gated
  // content mounts.
  useEffect(() => {
    if (resolveTick === 0) return; // the mount kick above runs the first pass
    const root = rootRef.current;
    if (!root) return;
    const gateClosed = (gateSig === "" ? [] : gateSig.split("\n")).some(
      (key) => {
        if (sessionOpenedRef.current.has(key)) return false;
        try {
          return window.localStorage.getItem(key) !== GATE_OPEN_VALUE;
        } catch {
          return true; // storage unavailable and no open observed — closed
        }
      },
    );
    // The fuzzy index is a full-document text extraction — build it at most
    // once per pass, and only if some row actually misses its anchor. While
    // any gate is closed skip the fallback entirely: the document is
    // partial, so neither drift nor a unique re-match can be trusted.
    let fuzzyIndex: FuzzyEntry[] | null = null;
    const getFuzzyIndex = gateClosed
      ? null
      : () => (fuzzyIndex ??= buildFuzzyIndex(root));
    const resolved = new Map<string, Range>();
    const nextMisses = new Map<string, HighlightMiss>();
    for (const row of rows) {
      const result = resolveHighlight(root, row, getFuzzyIndex);
      if ("range" in result) resolved.set(row.id, result.range);
      else nextMisses.set(row.id, gateClosed ? "pending" : "orphan");
    }
    resolvedRef.current = resolved;
    // Miss status only exists once the DOM has been consulted — one
    // deliberate post-resolution set, skipped when nothing changed.
    setMisses((prev) => (missesEqual(prev, nextMisses) ? prev : nextMisses));
    if (supportsPaint()) {
      const plain = new Highlight();
      const noted = new Highlight();
      // A group is "noted" when its head row carries the note — every row
      // of that gesture gets the underline cue, not just the head block.
      const notedGroups = new Set(
        rows.filter((row) => row.note).map((row) => row.groupId),
      );
      for (const row of rows) {
        const range = resolved.get(row.id);
        if (range) (notedGroups.has(row.groupId) ? noted : plain).add(range);
      }
      CSS.highlights.set(HL_NAME, plain);
      CSS.highlights.set(HL_NOTE_NAME, noted);
      // Fresh registries orphan any hover promotion built on old ranges —
      // reset the bookkeeping so the next hover re-applies cleanly instead
      // of restoring stale Range objects into the rebuilt noted set.
      CSS.highlights.delete(HL_NOTE_ACTIVE_NAME);
      hoveredGroupRef.current = null;
      promotedRangesRef.current = [];
    }
    // Same commit as the resolution it depends on: the margin boxes for
    // these rows are already in the DOM (the portal renders from `rows`),
    // so they can be measured and placed against the fresh ranges.
    positionComments();
  }, [rows, resolveTick, gateSig, positionComments]);

  // A box swapping between display and inline-edit mode changes its height —
  // restack the boxes below it in the same commit.
  useEffect(() => {
    positionComments();
  }, [editingCommentId, positionComments]);

  // Keep the margin notes tracking layout: container reflow (images, the
  // sidenote rail reserving/releasing its inset padding), viewport resizes,
  // and hide-edit reveals (change/toggle fire in capture — toggle doesn't
  // bubble). rAF-coalesced like PaperSidenotes' schedule.
  useEffect(() => {
    if (!marginNotesOn) {
      // The boxes just unmounted — one pass finds nothing to place but
      // still broadcasts the layout change, so sidenotes reclaim the space.
      positionComments();
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(positionComments);
    };
    schedule(); // the layer may have just (re)mounted — e.g. toggled back on
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    window.addEventListener("resize", schedule);
    root.addEventListener("change", schedule, true);
    root.addEventListener("toggle", schedule, true);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      root.removeEventListener("change", schedule, true);
      root.removeEventListener("toggle", schedule, true);
      // Toggled off or unmounting: release the rail this layer reserved so
      // the reading column widens back out.
      root.classList.remove(COMMENTS_INSET_CLASS);
    };
  }, [marginNotesOn, positionComments]);

  // Adopt the paint rules while mounted; unregister the painted names when
  // leaving the page.
  useEffect(() => {
    if (!supportsPaint()) return;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(HIGHLIGHT_PAINT_CSS);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    return () => {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
        (adopted) => adopted !== sheet,
      );
      window.clearTimeout(flashTimer.current);
      CSS.highlights.delete(HL_NAME);
      CSS.highlights.delete(HL_NOTE_NAME);
      CSS.highlights.delete(HL_NOTE_ACTIVE_NAME);
      CSS.highlights.delete(HL_FLASH_NAME);
    };
  }, []);

  // Selection toolbar: delegated pointerup on the reader root. The selection
  // settles after pointerup (double-click word selection, drag release), so
  // capture reads it a tick later.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let handle = 0;
    const onPointerUp = () => {
      window.clearTimeout(handle);
      handle = window.setTimeout(() => {
        const selection = document.getSelection();
        if (!selection || selection.isCollapsed) return;
        const capture = captureSelection(root, selection);
        if (!capture) return;
        setToolbar(toolbarStateFor(capture, selection));
      }, 0);
    };
    root.addEventListener("pointerup", onPointerUp);
    return () => {
      window.clearTimeout(handle);
      root.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  // Toolbar lifecycle while open. selectionchange RECAPTURES rather than
  // just dismissing: the selection can change under a live toolbar without
  // any pointerup on the reader (Shift+Arrow, Cmd+A, iOS selection-handle
  // drags), and the save must always describe the selection on screen —
  // never a stale, narrower capture. A selection that stops being
  // capturable drops the toolbar instead. Keyed on OPENNESS, not the state
  // object, so recaptures don't churn the listeners.
  const toolbarOpen = toolbar !== null;
  useEffect(() => {
    if (!toolbarOpen) return;
    const onSelectionChange = () => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed) {
        setToolbar(null);
        return;
      }
      const root = rootRef.current;
      const capture = root && captureSelection(root, selection);
      setToolbar(capture ? toolbarStateFor(capture, selection) : null);
    };
    const onScroll = () => setToolbar(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setToolbar(null);
      document.getSelection()?.removeAllRanges();
    };
    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [toolbarOpen]);

  /** Clamp a card's document-coordinate left around a viewport x. */
  const cardLeftFor = (clientX: number): number => {
    const viewport = document.documentElement.clientWidth;
    return (
      Math.min(
        Math.max(clientX - CARD_HALF, 8),
        Math.max(viewport - CARD_HALF * 2 - 8, 8),
      ) + window.scrollX
    );
  };

  // Hit-testing for the click-to-open card: map the click to a text position
  // (caretPositionFromPoint; caretRangeFromPoint on Safari) and compare it
  // against the resolved ranges. Reads only refs — safe to close over in the
  // mount-time click effect below.
  const hitTest = (x: number, y: number): string | null => {
    let node: Node | null = null;
    let offset = 0;
    if (typeof document.caretPositionFromPoint === "function") {
      const position = document.caretPositionFromPoint(x, y);
      if (position) {
        node = position.offsetNode;
        offset = position.offset;
      }
    } else if (typeof document.caretRangeFromPoint === "function") {
      const range = document.caretRangeFromPoint(x, y);
      if (range) {
        node = range.startContainer;
        offset = range.startOffset;
      }
    }
    if (!node) return null;
    for (const [id, range] of resolvedRef.current) {
      try {
        if (range.comparePoint(node, offset) === 0) return id;
      } catch {
        // Detached range or foreign node — not a hit.
      }
    }
    return null;
  };

  /**
   * Hover promotion for one GROUP, shared by both directions — the reader's
   * pointer hit-test AND the portal-rendered margin boxes' own handlers,
   * which call it directly (they sit outside the reader root's delegation,
   * and a component-scope callback over refs has no wiring to go stale).
   * Pops the group's box/line (data-pop, editing row kept) and MOVES the
   * group's ranges from the faded noted registry into the active one — the
   * sets stay DISJOINT, so nothing depends on how an engine composites or
   * orders overlapping highlights; demotion moves them back.
   */
  const applyHoverGroup = useCallback((groupId: string | null) => {
    // Any explicit application supersedes a queued hit-test (see
    // hoverRafRef). Cancelling the currently-executing callback's own id
    // is a no-op, so the rAF path may call in here freely.
    cancelAnimationFrame(hoverRafRef.current);
    if (groupId === hoveredGroupRef.current) return;
    if (hoveredGroupRef.current) {
      for (const row of rowsRef.current) {
        if (row.groupId !== hoveredGroupRef.current) continue;
        if (row.id === editingCommentIdRef.current) continue;
        commentBoxRefs.current.get(row.id)?.removeAttribute("data-pop");
        commentLineRefs.current.get(row.id)?.removeAttribute("data-pop");
      }
      if (supportsPaint()) {
        const noted = CSS.highlights.get(HL_NOTE_NAME);
        for (const range of promotedRangesRef.current) noted?.add(range);
        promotedRangesRef.current = [];
        CSS.highlights.delete(HL_NOTE_ACTIVE_NAME);
      }
    }
    hoveredGroupRef.current = groupId;
    if (!groupId) return;
    const groupRows = rowsRef.current.filter((r) => r.groupId === groupId);
    for (const row of groupRows) {
      commentBoxRefs.current.get(row.id)?.setAttribute("data-pop", "");
      commentLineRefs.current.get(row.id)?.setAttribute("data-pop", "");
    }
    if (supportsPaint() && groupRows.some((r) => r.note)) {
      const noted = CSS.highlights.get(HL_NOTE_NAME);
      const active = new Highlight();
      for (const row of groupRows) {
        const range = resolvedRef.current.get(row.id);
        if (range) {
          noted?.delete(range);
          promotedRangesRef.current.push(range);
          active.add(range);
        }
      }
      if (active.size > 0) CSS.highlights.set(HL_NOTE_ACTIVE_NAME, active);
    }
  }, []);

  // Click a painted range → note card. Only painted browsers get this — an
  // invisible hit target would be baffling. (The panel's per-row note button
  // is the equivalent path everywhere else.)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onClick = (event: MouseEvent) => {
      if (!supportsPaint()) return;
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed) return; // finishing a selection
      const target = event.target;
      if (
        target instanceof Element &&
        // `label` covers the inline-hide "···" marker (a span inside the
        // toggle's label): that click flips the checkbox and must not ALSO
        // pop the card.
        target.closest("a, button, summary, label, input, textarea, [data-gloss]")
      ) {
        return; // links, hide toggles, and gloss triggers keep their behavior
      }
      const id = hitTest(event.clientX, event.clientY);
      if (!id) return;
      // Any row of a group opens the GROUP's card — the head row owns the
      // note, so the card must anchor its state there.
      const hitRow = rowsRef.current.find((r) => r.id === id);
      const headId = hitRow
        ? [...rowsRef.current.filter((r) => r.groupId === hitRow.groupId)].sort(
            compareRowOrder,
          )[0].id
        : id;
      setCard({
        id: headId,
        key: ++cardSeq.current,
        left: cardLeftFor(event.clientX),
        top: event.clientY + window.scrollY + 12,
        autoFocus: false,
      });
    };
    root.addEventListener("click", onClick);

    // Hovering a painted highlight pops its (dimmed) margin note AND
    // promotes a noted group's faded paint to full strength: the same
    // hit-test, rAF-coalesced, group-aware, all imperative (data-pop on the
    // head row's box/line, the group's ranges re-registered under the
    // higher-priority active name) so pointer motion never renders React.
    // The row being edited in-place keeps its React-set pop — never clear
    // that one here.
    const applyHover = (hitId: string | null) => {
      const hitRow = hitId
        ? rowsRef.current.find((r) => r.id === hitId)
        : undefined;
      applyHoverGroup(hitRow?.groupId ?? null);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const { clientX, clientY } = event;
      cancelAnimationFrame(hoverRafRef.current);
      hoverRafRef.current = requestAnimationFrame(() =>
        applyHover(hitTest(clientX, clientY)),
      );
    };
    const onPointerLeave = (event: PointerEvent) => {
      cancelAnimationFrame(hoverRafRef.current);
      // Crossing into the margin-note layer is a handoff, not an exit.
      // React raises the box's onPointerEnter from the crossing's
      // `pointerout` — BEFORE this native `pointerleave` — so demoting
      // here would instantly revert the promotion the box just applied
      // (or, when the pointer comes off the group's own painted text,
      // kill a promotion the box's enter treated as already in place).
      const to = event.relatedTarget;
      if (
        to instanceof Element &&
        to.closest(".paper-comment, .paper-comment-line")
      ) {
        return;
      }
      applyHover(null);
    };
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    return () => {
      root.removeEventListener("click", onClick);
      cancelAnimationFrame(hoverRafRef.current);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [applyHoverGroup]);

  const saveNote = useCallback(
    async (id: string, note: string): Promise<NoteSaveResult> => {
      // A row being deleted must not re-save (the card's unmount flush can
      // race the delete POST) — and must not toast for an intentional
      // discard either way.
      if (deletingIdsRef.current.has(id)) return "saved";
      if (id.startsWith(TEMP_PREFIX)) {
        // The create is still in flight. Park the text with the parent —
        // the card may unmount before the id reconciles — and mirror it
        // onto the temp row so the panel preview and underline cue track.
        // "parked", not "saved": nothing has reached the server yet.
        pendingNotesRef.current.set(id, note);
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, note: note.trim() ? note : null } : row,
          ),
        );
        return "parked";
      }
      let ok = false;
      try {
        ok = await updateNoteAction(id, note);
      } catch {
        ok = false;
      }
      if (ok) {
        // The server collapses whitespace-only notes to null — mirror it so
        // the underline cue and panel preview stay truthful.
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, note: note.trim() ? note : null } : row,
          ),
        );
        return "saved";
      }
      // The delete may have won the race after this flush started, or the
      // row may be gone entirely — an error toast would blame the user for
      // their own intentional delete.
      if (
        !deletingIdsRef.current.has(id) &&
        rowsRef.current.some((row) => row.id === id)
      ) {
        toast.error("Couldn't save note. Please try again.");
      }
      return "failed";
    },
    [updateNoteAction],
  );

  /**
   * POST one optimistic temp row to createAction and reconcile. On failure
   * the row rolls back UNLESS the user has typed a note into it (parked) or
   * still has its card open — text the UI acknowledged is never destroyed;
   * the row is kept locally, marked failed ("Not saved" in the panel), with
   * Retry re-posting the same capture and Delete as the deliberate discard.
   */
  /**
   * POST one optimistic temp GROUP (one row per captured span) and
   * reconcile the ids in span order. On failure the group rolls back UNLESS
   * the user has typed a note into its head row (parked) or still has a
   * card open on any of its rows — text the UI acknowledged is never
   * destroyed; the group is kept locally, marked failed ("Not saved" in the
   * panel), with Retry re-posting the same spans and Delete as the
   * deliberate discard.
   */
  const persistGroup = (
    tempGroupId: string,
    tempIds: string[],
    input: HighlightInput,
  ) => {
    const headTempId = tempIds[0];
    startTransition(async () => {
      let result: CreateHighlightResult = null;
      try {
        result = await createAction(input);
      } catch {
        result = null;
      }
      if (!result || "error" in result) {
        // Distinguishable failures get actionable copy — "try again" would
        // be unfulfillable advice for a reached cap or a stale artifact.
        const message = !result
          ? "Couldn't save highlight. Please try again."
          : result.error === "cap"
            ? "Highlight limit reached — delete some highlights to add more."
            : "This paper has been updated — reload the page to highlight.";
        const parked = pendingNotesRef.current.get(headTempId);
        const cardId = cardStateRef.current?.id;
        const keepText =
          (parked !== undefined && parked.trim() !== "") ||
          (cardId !== undefined && tempIds.includes(cardId));
        if (keepText) {
          setFailedIds((prev) => new Set(prev).add(tempGroupId));
          toast.error(`${message} Your note is kept in the highlights list.`);
        } else {
          pendingNotesRef.current.delete(headTempId);
          setRows((prev) => prev.filter((row) => !tempIds.includes(row.id)));
          toast.error(message);
        }
        return;
      }
      const { groupId, ids } = result;
      setFailedIds((prev) => {
        if (!prev.has(tempGroupId)) return prev;
        const next = new Set(prev);
        next.delete(tempGroupId);
        return next;
      });
      // A single-span duplicate gesture makes the server return the
      // EXISTING row's group — the temp rows must be DROPPED, not renamed,
      // or two rows share one id (duplicate React keys, double panel
      // entries, a delete removing both local copies). Fresh groups rename
      // each temp row to its id in span order.
      const existing = rowsRef.current.find((row) => row.id === ids[0]);
      setRows((prev) =>
        existing
          ? prev.filter((row) => !tempIds.includes(row.id))
          : prev.map((row) => {
              const index = tempIds.indexOf(row.id);
              if (index === -1 || index >= ids.length) return row;
              return { ...row, id: ids[index], groupId };
            }),
      );
      const pending = pendingNotesRef.current.get(headTempId);
      pendingNotesRef.current.delete(headTempId);
      // Replay a note typed while the head id was temp — but never onto an
      // existing row that already carries one (a duplicate-gesture repoint
      // must not clobber it; the remounted card shows the note instead).
      const replay = pending !== undefined && !existing?.note;
      setCard((open) => {
        if (!open || !tempIds.includes(open.id)) return open;
        if (existing && !replay) {
          // Fresh key: remount the textarea with the existing row's note.
          return { ...open, id: ids[0], key: ++cardSeq.current };
        }
        const index = tempIds.indexOf(open.id);
        return { ...open, id: ids[index] ?? ids[0] };
      });
      if (replay) void saveNote(ids[0], pending);
    });
  };

  const createFromToolbar = (withNote: boolean) => {
    if (!toolbar) return;
    const { capture } = toolbar;
    const input: HighlightInput = {
      spans: capture.spans,
      convVersion: capture.convVersion,
      note: null,
    };
    const seq = ++tempSeq.current;
    const tempGroupId = `${TEMP_PREFIX}g${seq}`;
    const tempIds = capture.spans.map((_, i) => `${TEMP_PREFIX}${seq}-${i}`);
    // Optimistic: the temp rows resolve against the live DOM (their
    // snippets were just read from it), so paint is immediate; ids
    // reconcile from the action's return, or the group rolls back.
    setRows((prev) => [
      ...prev,
      ...capture.spans.map((span, i) => ({
        id: tempIds[i],
        groupId: tempGroupId,
        ...span,
        note: null,
        convVersion: capture.convVersion,
      })),
    ]);
    if (withNote) {
      setCard({
        id: tempIds[0], // the head row owns the group's note
        key: ++cardSeq.current,
        left: cardLeftFor(toolbar.left - window.scrollX),
        top: toolbar.top,
        autoFocus: true,
      });
    }
    setToolbar(null);
    document.getSelection()?.removeAllRanges();
    persistGroup(tempGroupId, tempIds, input);
  };

  /** Re-post a failed group's capture (its rows ARE the create payload). */
  const retryPersist = (tempGroupId: string) => {
    const groupRows = rowsRef.current.filter((r) => r.groupId === tempGroupId);
    if (groupRows.length === 0) return;
    setFailedIds((prev) => {
      const next = new Set(prev);
      next.delete(tempGroupId);
      return next;
    });
    persistGroup(
      tempGroupId,
      groupRows.map((r) => r.id),
      {
        spans: groupRows.map((r) => ({
          blockAnchor: r.blockAnchor,
          sStart: r.sStart,
          sEnd: r.sEnd,
          startOffset: r.startOffset,
          endOffset: r.endOffset,
          snippet: r.snippet,
        })),
        convVersion: groupRows[0].convVersion,
        note: null,
      },
    );
  };

  /** Delete a whole GROUP (one gesture) — optimistic, rolled back on failure. */
  const removeHighlight = (groupId: string) => {
    const groupRows = rows.filter((r) => r.groupId === groupId);
    if (groupRows.length === 0) return;
    const rowIds = groupRows.map((r) => r.id);
    if (groupId.startsWith(TEMP_PREFIX)) {
      // A mid-flight create still owns its temp group; only FAILED groups
      // are deletable — a purely local discard, nothing on the server.
      if (!failedIds.has(groupId)) return;
      // Registered so a closing editor's unmount flush can't re-park the
      // discarded note (temp ids are never reused).
      for (const id of rowIds) deletingIdsRef.current.add(id);
      pendingNotesRef.current.delete(rowIds[0]);
      setFailedIds((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setRows((prev) => prev.filter((r) => r.groupId !== groupId));
      setCard((open) => (open && rowIds.includes(open.id) ? null : open));
      setEditingCommentId((open) =>
        open && rowIds.includes(open) ? null : open,
      );
      return;
    }
    for (const id of rowIds) deletingIdsRef.current.add(id);
    setRows((prev) => prev.filter((r) => r.groupId !== groupId));
    setCard((open) => (open && rowIds.includes(open.id) ? null : open));
    setEditingCommentId((open) => (open && rowIds.includes(open) ? null : open));
    startTransition(async () => {
      let ok = false;
      try {
        ok = await deleteAction(groupId);
      } catch {
        ok = false;
      }
      if (!ok) {
        for (const id of rowIds) deletingIdsRef.current.delete(id);
        setRows((prev) => [
          ...prev,
          ...groupRows.filter((r) => !prev.some((p) => p.id === r.id)),
        ]);
        toast.error("Couldn't delete highlight. Please try again.");
      }
    });
  };

  const jumpTo = (id: string) => {
    const range = resolvedRef.current.get(id);
    if (!range) return;
    const target = rangeAnchorElement(range);
    if (!target) return;
    // A resolved highlight can still sit inside collapsed hide-edit chrome
    // (a <details class="ax-hidden"> block hide, or an inline hide's
    // display:none .ax-hidden-content) — reveal it first, or the scroll and
    // flash are invisible no-ops.
    for (
      let details = target.closest<HTMLDetailsElement>("details.ax-hidden");
      details;
      details =
        details.parentElement?.closest<HTMLDetailsElement>("details.ax-hidden") ??
        null
    ) {
      details.open = true;
    }
    for (
      let inline = target.closest(".ax-hidden-inline");
      inline;
      inline = inline.parentElement?.closest(".ax-hidden-inline") ?? null
    ) {
      const toggle = inline.querySelector<HTMLInputElement>(
        "input.ax-hidden-toggle",
      );
      if (toggle) toggle.checked = true;
    }
    if (target.getClientRects().length === 0) return; // still hidden somehow
    target.scrollIntoView({ block: "center", behavior: "smooth" });
    if (!supportsPaint()) return;
    CSS.highlights.set(HL_FLASH_NAME, new Highlight(range));
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(
      () => CSS.highlights.delete(HL_FLASH_NAME),
      1500,
    );
  };

  /**
   * Open the note card anchored to a panel row — the note view/edit path
   * that works without the Custom Highlight API and for keyboard users.
   */
  const openCardAtRow = (id: string, anchor: HTMLElement) => {
    // One editor per note at a time — the popover card supersedes an open
    // inline margin editor (its unmount flushes any armed save first).
    setEditingCommentId(null);
    const rect = anchor.getBoundingClientRect();
    setCard({
      id,
      key: ++cardSeq.current,
      left: cardLeftFor(rect.left + rect.width / 2),
      top: rect.bottom + window.scrollY + 8,
      autoFocus: true,
    });
  };

  const closeCard = useCallback(() => setCard(null), []);

  /**
   * Panel model: one entry per GROUP (gesture), rows within a group and
   * groups themselves in document order (queries.ts returns creation
   * order). Entry [0] is the group's head row — the note owner.
   */
  const sortedGroups = useMemo(() => {
    const byGroup = new Map<string, HighlightRow[]>();
    for (const row of rows) {
      const group = byGroup.get(row.groupId);
      if (group) group.push(row);
      else byGroup.set(row.groupId, [row]);
    }
    const groups = [...byGroup.values()].map((group) =>
      [...group].sort(compareRowOrder),
    );
    groups.sort((a, b) => compareRowOrder(a[0], b[0]));
    return groups;
  }, [rows]);

  const cardRow = card ? rows.find((row) => row.id === card.id) : undefined;

  return (
    <>
      {toolbar &&
        createPortal(
          <div
            className="absolute z-50 -translate-x-1/2"
            style={{ left: toolbar.left, top: toolbar.top }}
            // Keep the selection alive: a pointerdown on the toolbar must
            // not collapse it before the button's click fires.
            onPointerDown={(event) => event.preventDefault()}
          >
            <div className="bg-popover text-popover-foreground ring-foreground/10 animate-in fade-in-0 rounded-lg p-1 shadow-md ring-1 duration-150">
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => createFromToolbar(false)}
                >
                  <Highlighter aria-hidden /> Highlight
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => createFromToolbar(true)}
                >
                  <MessageSquarePlus aria-hidden /> Add note
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {card && cardRow && (
        <HighlightCard
          key={card.key}
          row={cardRow}
          failed={failedIds.has(cardRow.groupId)}
          left={card.left}
          top={card.top}
          autoFocus={card.autoFocus}
          onSaveNote={saveNote}
          onDelete={removeHighlight}
          onClose={closeCard}
        />
      )}

      {/* Margin-note layer: the reader's notes as sidenote-like comments,
          each with a thin elbow connector line to its highlight. Body portal
          in document coordinates (glossary-overlay idiom); positionComments()
          owns all geometry. In display mode a box is a duplicate of panel
          content whose hover-revealed Edit button stays untabbable (keyboard
          users edit via the panel/card); in edit mode it swaps to the
          in-place editor — real interactive content, which is why the layer
          is NOT aria-hidden wholesale. */}
      {marginNotesOn &&
        createPortal(
          <div className="pointer-events-none">
            {rows
              // A row being edited stays mounted even when the debounced
              // save has just mirrored an emptied textarea to note: null —
              // the editor must never unmount under the cursor.
              .filter((row) => row.note || editingCommentId === row.id)
              .map((row) => (
                <Fragment key={row.id}>
                  <div
                    ref={(el) => {
                      if (el) commentBoxRefs.current.set(row.id, el);
                      else commentBoxRefs.current.delete(row.id);
                    }}
                    className="paper-comment group bg-card border-border shadow-soft pointer-events-auto absolute z-30 rounded-lg border"
                    style={{ visibility: "hidden" }}
                    data-pop={editingCommentId === row.id ? "" : undefined}
                    // Hovering the box lights its highlight, mirroring the
                    // text→box direction (mouse only — touch never sees the
                    // faded states).
                    onPointerEnter={(event) => {
                      if (event.pointerType === "touch") return;
                      applyHoverGroup(row.groupId);
                    }}
                    onPointerLeave={(event) => {
                      if (event.pointerType === "touch") return;
                      applyHoverGroup(null);
                    }}
                  >
                    {editingCommentId === row.id ? (
                      <InlineNoteEditor
                        row={row}
                        deletable={
                          !row.id.startsWith(TEMP_PREFIX) ||
                          failedIds.has(row.groupId)
                        }
                        onSaveNote={saveNote}
                        onDelete={removeHighlight}
                        onClose={() => setEditingCommentId(null)}
                      />
                    ) : (
                      <div className="px-2.5 py-2">
                        <span
                          aria-hidden
                          className="line-clamp-6 block text-xs leading-relaxed"
                        >
                          {row.note}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit note"
                          tabIndex={-1}
                          onClick={() => {
                            // One editor per note: the inline editor
                            // supersedes an open popover card.
                            setCard(null);
                            setEditingCommentId(row.id);
                          }}
                          className="text-muted-foreground bg-card/90 absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Pencil aria-hidden />
                        </Button>
                      </div>
                    )}
                  </div>
                  <svg
                    ref={(el) => {
                      if (el) commentLineRefs.current.set(row.id, el);
                      else commentLineRefs.current.delete(row.id);
                    }}
                    aria-hidden
                    className="paper-comment-line absolute z-20"
                    style={{ visibility: "hidden" }}
                  >
                    <polyline
                      className="stroke-muted-foreground/60"
                      fill="none"
                      strokeWidth={1.5}
                      strokeLinejoin="round"
                    />
                  </svg>
                </Fragment>
              ))}
          </div>,
          document.body,
        )}

      {rows.length > 0 && (
        <details className="group border-border bg-card mt-10 rounded-xl border">
          <summary className="flex cursor-pointer items-center gap-2 px-5 py-3.5 text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
            <ChevronRight
              className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90"
              aria-hidden
            />
            Your highlights ({sortedGroups.length})
          </summary>
          <ul className="border-border divide-border divide-y border-t">
            {sortedGroups.map((group) => {
              const head = group[0];
              // The group's badge: missing only when EVERY row failed to
              // resolve — a partially-revealed group still jumps and paints.
              const firstResolved = group.find((r) => !misses.has(r.id));
              const miss = firstResolved ? undefined : misses.get(head.id);
              const temp = head.id.startsWith(TEMP_PREFIX);
              const failed = failedIds.has(head.groupId);
              return (
                <li key={head.groupId} className="flex items-start gap-2 px-5 py-3">
                  <button
                    type="button"
                    onClick={() => jumpTo((firstResolved ?? head).id)}
                    disabled={miss !== undefined}
                    className="min-w-0 flex-1 text-left disabled:cursor-default"
                  >
                    <span className="text-muted-foreground line-clamp-2 block text-sm">
                      {head.snippet}
                      {group.length > 1 && " …"}
                    </span>
                    {head.note && (
                      <span className="mt-0.5 line-clamp-1 block text-sm">
                        {head.note}
                      </span>
                    )}
                    {group.length > 1 && (
                      <span className="text-muted-foreground/80 mt-0.5 block text-xs">
                        Spans {group.length} paragraphs
                      </span>
                    )}
                    {failed && (
                      <span className="border-destructive/40 text-destructive mt-1.5 inline-block rounded-full border border-dashed px-2 py-0.5 text-xs">
                        Not saved
                      </span>
                    )}
                    {miss && (
                      <span className="border-border text-muted-foreground mt-1.5 inline-block rounded-full border border-dashed px-2 py-0.5 text-xs">
                        {miss === "orphan"
                          ? "No longer matches this paper"
                          : "In a section you haven't revealed yet"}
                      </span>
                    )}
                  </button>
                  {failed && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Retry saving highlight"
                      className="text-muted-foreground shrink-0"
                      onClick={() => retryPersist(head.groupId)}
                    >
                      <RotateCcw aria-hidden />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={head.note ? "Edit note" : "Add note"}
                    className="text-muted-foreground shrink-0"
                    disabled={temp && !failed}
                    onClick={(event) =>
                      openCardAtRow(head.id, event.currentTarget)
                    }
                  >
                    <StickyNote aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete highlight"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    disabled={temp && !failed}
                    onClick={() => removeHighlight(head.groupId)}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </>
  );
}

type NoteSaveState = "idle" | "saving" | "saved" | "pending";

/**
 * The autosaving-note state machine shared by the popover card and the
 * margin box's inline editor: WritingEditor's 800ms debounce + monotonic
 * save-id idiom, with an unmount flush — closing either editor is the
 * natural "done typing" gesture. Saves go through the parent's saveNote
 * unconditionally: while the owning row's id is still optimistic the PARENT
 * parks the text ("pending", never shown as "Saved") and replays it after
 * the create reconciles, so nothing is lost if the editor unmounts
 * mid-create. Latest id/handler live in refs so the debounced and
 * unmount-flush saves never act on stale closures (the id CHANGES when the
 * create reconciles).
 */
function useNoteAutosave(
  row: HighlightRow,
  onSaveNote: (id: string, note: string) => Promise<NoteSaveResult>,
): {
  value: string;
  setValue: (value: string) => void;
  saveState: NoteSaveState;
} {
  const [value, setValue] = useState(row.note ?? "");
  const [saveState, setSaveState] = useState<NoteSaveState>("idle");

  const idRef = useRef(row.id);
  const onSaveNoteRef = useRef(onSaveNote);
  useEffect(() => {
    idRef.current = row.id;
    onSaveNoteRef.current = onSaveNote;
  });
  /** Unsaved text awaiting a flush; null = clean. */
  const dirtyRef = useRef<string | null>(null);
  const saveSeq = useRef(0);

  const flush = useCallback(async (text: string) => {
    dirtyRef.current = null;
    const seq = ++saveSeq.current;
    const result = await onSaveNoteRef.current(idRef.current, text);
    if (seq !== saveSeq.current) return; // a newer save owns the label
    setSaveState(
      result === "saved" ? "saved" : result === "parked" ? "pending" : "idle",
    );
  }, []);

  const skipFirst = useRef(true);
  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    dirtyRef.current = value;
    setSaveState("saving");
    const handle = window.setTimeout(() => void flush(value), 800);
    return () => window.clearTimeout(handle);
  }, [value, flush]);

  // Closing flush — runs after the debounce effect's cleanup has cleared
  // the pending timer, so a dismissed editor still saves what was typed.
  useEffect(
    () => () => {
      if (dirtyRef.current !== null) void flush(dirtyRef.current);
    },
    [flush],
  );

  return { value, setValue, saveState };
}

function noteSaveLabel(saveState: NoteSaveState): string {
  return saveState === "saving"
    ? "Saving…"
    : saveState === "saved"
      ? "Saved"
      : saveState === "pending"
        ? "Pending…"
        : "";
}

/**
 * In-place editor inside a margin-note box (hover the box, hit Edit):
 * autosaving textarea via useNoteAutosave; Escape or a pointerdown outside
 * the box closes it (unmount flushes any armed save). Fixed rows so the box
 * height changes only on open/close — both re-run positionComments. Delete
 * removes the whole highlight group, exactly like the card's Delete.
 */
function InlineNoteEditor({
  row,
  deletable,
  onSaveNote,
  onDelete,
  onClose,
}: {
  row: HighlightRow;
  /** Mid-flight temp groups aren't deletable (failed ones are). */
  deletable: boolean;
  onSaveNote: (id: string, note: string) => Promise<NoteSaveResult>;
  onDelete: (groupId: string) => void;
  onClose: () => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { value, setValue, saveState } = useNoteAutosave(row, onSaveNote);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && editorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);

  return (
    <div ref={editorRef} className="p-2">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Add a note…"
        aria-label="Note"
        rows={4}
        maxLength={HIGHLIGHT_MAX_NOTE_CHARS}
        autoFocus
        className="resize-none text-xs"
      />
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs" aria-live="polite">
          {noteSaveLabel(saveState)}
        </span>
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={!deletable}
            // The unmount flush is suppressed by the parent's deletingIdsRef
            // guard — a deleted row must not re-save its note.
            onClick={() => onDelete(row.groupId)}
          >
            <Trash2 aria-hidden /> Delete
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * The note card for one highlight: snippet, autosaving textarea
 * (useNoteAutosave), Delete. Escape/outside-pointer dismiss; dismissing (or
 * unmounting) with an armed debounce flushes the save.
 */
function HighlightCard({
  row,
  failed,
  left,
  top,
  autoFocus,
  onSaveNote,
  onDelete,
  onClose,
}: {
  row: HighlightRow;
  /** The row's create failed — Delete becomes the deliberate local discard. */
  failed: boolean;
  left: number;
  top: number;
  autoFocus: boolean;
  onSaveNote: (id: string, note: string) => Promise<NoteSaveResult>;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { value, setValue, saveState } = useNoteAutosave(row, onSaveNote);
  const isTemp = row.id.startsWith(TEMP_PREFIX);

  // Dismissal: Escape, or pointerdown outside the card.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && cardRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={cardRef}
      role="dialog"
      aria-label="Highlight note"
      className="bg-popover text-popover-foreground ring-foreground/10 animate-in fade-in-0 absolute z-50 w-80 max-w-[calc(100vw-1rem)] rounded-lg p-3 shadow-md ring-1 duration-150"
      style={{ left, top }}
    >
      <p className="text-muted-foreground line-clamp-3 text-xs">{row.snippet}</p>
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Add a note…"
        aria-label="Note"
        rows={3}
        maxLength={HIGHLIGHT_MAX_NOTE_CHARS}
        // The light focus handoff for "Add note" opens; click opens leave
        // focus (and reading position) where it was.
        autoFocus={autoFocus}
        className="mt-2 resize-y text-sm"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs" aria-live="polite">
          {noteSaveLabel(saveState)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={isTemp && !failed}
          // The unmount flush is suppressed by the parent's deletingIdsRef
          // guard — a deleted row must not re-save its note. Delete takes
          // the GROUP: the card fronts the whole gesture.
          onClick={() => onDelete(row.groupId)}
        >
          <Trash2 aria-hidden /> Delete
        </Button>
      </div>
    </div>,
    document.body,
  );
}

function missesEqual(
  a: ReadonlyMap<string, HighlightMiss>,
  b: ReadonlyMap<string, HighlightMiss>,
): boolean {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) if (b.get(key) !== value) return false;
  return true;
}
