"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  actionsFor,
  ACTION_LABELS,
  type SelectionActionId,
} from "@/lib/verification/selection-actions";

/* One toolbar for everything a selection can be done with.
 *
 * It replaces three independent `mouseup` listeners — the highlighter's, the
 * lookup's and the notebook's — that each decided on their own whether to
 * appear and were kept from stacking by being placed at different heights.
 * Two things were wrong with that beyond the duplication:
 *
 *   Touch. `mouseup` is a mouse event. A phone selects by long-press and then
 *   by dragging the OS's own selection handles, which deliver no mouse event
 *   to the page at all, so adjusting a selection left the actions behind on
 *   the old one — or never raised them.
 *
 *   Keyboard. Shift+Arrow, Shift+Home, Ctrl+A produce a real selection and no
 *   pointer event of any kind. Nothing was ever offered.
 *
 * So the trigger is `selectionchange`, which fires for all three, and the
 * pointer events are demoted to what they are actually good for: knowing that
 * a drag is still in progress, so the toolbar waits for the gesture to settle
 * instead of chasing the pointer.
 *
 * The actions themselves stay where they live — the three scripts still own
 * their stores and their painting. This calls their published entry points at
 * press time, never at mount, so it cannot race their loading.
 *
 * Trap: pressing a button must not collapse the selection it is about to act
 * on. Every button cancels its own mousedown, and the teardown paths all
 * ignore events inside the toolbar. This is the same trap the three scripts
 * each carried a comment about; it is one trap now, in one place.
 */

const SETTLE_MS = 200; // selection changed, no pointer down — keyboard/touch handles
const POINTER_MS = 40; // pointer released — the gesture is over, show at once
/* A drag that never reports its end still has to recover. Nothing is offered
 * while the pointer is thought to be down, so if that belief were allowed to
 * stick the toolbar would be dead for the rest of the page's life — see the
 * drag-and-drop note on `dragging` below. This is the ceiling on being wrong. */
const STUCK_MS = 800;

interface Placed {
  /** Document coordinates, so the toolbar survives a scroll. */
  top: number;
  left: number;
  text: string;
  actions: SelectionActionId[];
  /** Whether the selection was made with the keyboard — the only case where
   *  the toolbar announces itself, since it cannot be seen to appear. */
  byKeyboard: boolean;
}

declare global {
  interface Window {
    VTHighlight?: {
      supported?: boolean;
      add?: () => void;
      idsInSelection?: () => string[];
      removeIds?: (ids: string[]) => void;
    };
    VTNotebook?: { addQuote?: (t: string, title: string, href: string) => void };
    /* The lookup card reads only these two off the rect it is handed. */
    VTVocab?: { define?: (term: string, rect: { bottom: number; left: number }) => void };
  }
}

export function SelectionActions() {
  const [at, setAt] = useState<Placed | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const keyboard = useRef(false);
  const returnTo = useRef<HTMLElement | null>(null);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setAt(null);
  }, []);

  useEffect(() => {
    const inBar = (n: EventTarget | null) =>
      n instanceof Node && !!barRef.current?.contains(n);

    const evaluate = () => {
      const sel = document.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return setAt(null);
      const text = String(sel).trim();
      const host =
        sel.anchorNode instanceof Element
          ? sel.anchorNode
          : sel.anchorNode?.parentElement;

      // The reading column only, and never inside something being written in:
      // a selection in the writing editor belongs to the editor.
      const inReading =
        !!host?.closest("main") &&
        !host.closest("input,textarea,[contenteditable=true],[data-no-select-actions]") &&
        !document.documentElement.classList.contains("vt-off-course");

      const actions = actionsFor({
        text,
        inReading,
        highlightSupported: !!window.VTHighlight?.supported,
        overlapsHighlight: (window.VTHighlight?.idsInSelection?.() ?? []).length > 0,
      });
      if (!actions.length) return setAt(null);

      const r = sel.getRangeAt(0).getBoundingClientRect();
      if (!r.width && !r.height) return setAt(null);
      setAt({
        top: r.bottom + window.scrollY + 8,
        left: r.left + window.scrollX,
        text,
        actions,
        byKeyboard: keyboard.current,
      });
    };

    const schedule = (delay: number) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(evaluate, delay);
    };

    const onSelectionChange = () => {
      // Arrow-keying along the toolbar must not re-evaluate underneath it.
      if (inBar(document.activeElement)) return;
      // Mid-drag there is nothing to offer yet, and a toolbar that follows the
      // pointer is a toolbar you cannot press. The long delay rather than no
      // delay is the recovery path: a drag whose release never arrives still
      // resolves, one settle later, instead of leaving the tools unreachable.
      if (dragging.current) {
        setAt(null);
        return schedule(STUCK_MS);
      }
      schedule(SETTLE_MS);
    };

    const onPointerDown = (e: Event) => {
      if (inBar(e.target)) return;
      keyboard.current = false;
      dragging.current = true;
      setAt(null);
    };

    /* The gesture is over: show what the selection it left behind can do. */
    const onEnd = (e: Event) => {
      if (inBar(e.target)) return;
      dragging.current = false;
      schedule(POINTER_MS);
    };

    /* Not over — taken over. Pressing INSIDE an existing selection and moving
       starts a native drag-and-drop of that text, and the browser reports it
       as pointercancel MID-gesture, then dragend when the drop lands. Reading
       the cancel as an ending pops the toolbar up under a pointer that is
       still dragging; reading it as nothing at all would strand us if dragend
       never came. So it stays "down" and leans on the stuck timer. */
    const onCancel = () => {
      schedule(STUCK_MS);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (inBar(document.activeElement)) returnTo.current?.focus();
        return hide();
      }
      // The keyboard route in. A selection made without a pointer has no
      // pointer to reach the toolbar with, and Tab cannot get there: the
      // toolbar is portalled to the end of the document, nowhere near the
      // words it belongs to.
      if (e.altKey && e.key === "Enter" && barRef.current) {
        e.preventDefault();
        returnTo.current = document.activeElement as HTMLElement;
        barRef.current.querySelector("button")?.focus();
        return;
      }
      if (e.key === "Shift" || e.key === "Control" || e.key === "Meta") return;
      keyboard.current = true;
    };

    // touchend: iOS still resolves some selection gestures as touch events
    // with no matching pointerup on the page. dragend: the end of the text
    // drag-and-drop that pointercancel announced the start of.
    const ENDS = ["pointerup", "touchend", "dragend"] as const;

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("pointerdown", onPointerDown, true);
    for (const e of ENDS) document.addEventListener(e, onEnd, true);
    document.addEventListener("pointercancel", onCancel, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("pointerdown", onPointerDown, true);
      for (const e of ENDS) document.removeEventListener(e, onEnd, true);
      document.removeEventListener("pointercancel", onCancel, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [hide]);

  const run = useCallback(
    (id: SelectionActionId, place: Placed) => {
      if (id === "highlight") {
        window.VTHighlight?.add?.();
      } else if (id === "unhighlight") {
        // Asked again at press time rather than remembered from when the
        // toolbar was built: the selection is still live, and a stale id list
        // would delete whatever had taken those ids since.
        window.VTHighlight?.removeIds?.(window.VTHighlight?.idsInSelection?.() ?? []);
      } else if (id === "notebook") {
        window.VTNotebook?.addQuote?.(
          place.text,
          document.title.split("·")[0].trim(),
          location.href,
        );
      } else if (id === "define") {
        // The lookup card places itself against the selection and reads
        // `bottom`/`left` off what it is given, in VIEWPORT coordinates —
        // rebuilt here from the document ones, so a scroll between the
        // toolbar settling and the press does not throw the card off screen.
        window.VTVocab?.define?.(place.text, {
          bottom: place.top - 8 - window.scrollY,
          left: place.left - window.scrollX,
        });
      }
      hide();
      document.getSelection()?.removeAllRanges();
      returnTo.current?.focus();
      returnTo.current = null;
    },
    [hide],
  );

  /* Arrow keys walk the toolbar, which is what role="toolbar" promises. */
  const onBarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const btns = Array.from(
      barRef.current?.querySelectorAll("button") ?? [],
    ) as HTMLButtonElement[];
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const to =
      e.key === "ArrowRight" ? i + 1
      : e.key === "ArrowLeft" ? i - 1
      : e.key === "Home" ? 0
      : e.key === "End" ? btns.length - 1
      : -1;
    if (to < 0 && e.key !== "Home") return;
    e.preventDefault();
    btns[(to + btns.length) % btns.length]?.focus();
  };

  if (!at || typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Announced only for a selection made with the keyboard: a reader who
          cannot see the toolbar appear is exactly the one who needs telling
          it is there, and a mouse user would just get told on every drag. */}
      <div aria-live="polite" className="sr-only">
        {at.byKeyboard
          ? `${at.actions.length} actions for the selected text. Press Alt+Enter to reach them.`
          : ""}
      </div>
      <div
        ref={barRef}
        role="toolbar"
        aria-label="Actions for the selected text"
        onKeyDown={onBarKeyDown}
        style={{ top: at.top, left: Math.max(8, at.left) }}
        className="border-border bg-card shadow-soft absolute z-[55] flex max-w-[calc(100vw-1rem)] flex-wrap gap-1 rounded-lg border p-1 select-none"
      >
        {at.actions.map((id) => (
          <button
            key={id}
            type="button"
            // Cancelling mousedown is what keeps the selection alive long
            // enough for the click to act on it.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(id, at)}
            className="hover:bg-muted focus-visible:ring-ring rounded-md px-2.5 py-1 text-[13px] whitespace-nowrap focus-visible:ring-2 focus-visible:outline-none"
          >
            {ACTION_LABELS[id]}
          </button>
        ))}
      </div>
    </>,
    document.body,
  );
}
