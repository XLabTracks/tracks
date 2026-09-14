"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  actionsFor,
  ACTION_LABELS,
  type SelectionActionId,
} from "@/lib/verification/selection-actions";
import {
  bugReportHref,
  isBugReportConfigured,
} from "@/lib/verification/bug-report";

const SITE_SUFFIX = /\s+@\s+Tracks\s*$/;

function pageName(): string {
  return document.title.replace(SITE_SUFFIX, "").split("\u00b7")[0]!.trim();
}

const SETTLE_MS = 200;
const POINTER_MS = 40;
const STUCK_MS = 800;

interface Placed {
  top: number;
  left: number;
  text: string;
  actions: SelectionActionId[];
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

      const inReading =
        !!host?.closest("main") &&
        !host.closest("input,textarea,[contenteditable=true],[data-no-select-actions]") &&
        !document.documentElement.classList.contains("vt-off-course");

      const actions = actionsFor({
        text,
        inReading,
        highlightSupported: !!window.VTHighlight?.supported,
        overlapsHighlight: (window.VTHighlight?.idsInSelection?.() ?? []).length > 0,
        reportSupported: isBugReportConfigured(),
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
      if (inBar(document.activeElement)) return;
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

    const onEnd = (e: Event) => {
      if (inBar(e.target)) return;
      dragging.current = false;
      schedule(POINTER_MS);
    };

    const onCancel = () => {
      schedule(STUCK_MS);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (inBar(document.activeElement)) returnTo.current?.focus();
        return hide();
      }
      if (e.altKey && e.key === "Enter" && barRef.current) {
        e.preventDefault();
        returnTo.current = document.activeElement as HTMLElement;
        barRef.current.querySelector("button")?.focus();
        return;
      }
      if (e.key === "Shift" || e.key === "Control" || e.key === "Meta") return;
      keyboard.current = true;
    };

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
        window.VTHighlight?.removeIds?.(window.VTHighlight?.idsInSelection?.() ?? []);
      } else if (id === "notebook") {
        window.VTNotebook?.addQuote?.(place.text, pageName(), location.href);
      } else if (id === "report") {
        const href = bugReportHref({
          quote: place.text,
          page: pageName(),
          url: location.href,
        });
        if (href) window.open(href, "_blank", "noopener,noreferrer");
      } else if (id === "define") {
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
