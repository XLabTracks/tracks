"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock, PencilLine, Play } from "lucide-react";
import type { PaperNavItem } from "@/lib/papers/paper-nav";
import {
  PAPER_GATE_OPEN_EVENT,
  paperGateDomId,
  paperGateStorageKey,
} from "@/lib/papers/gate-state";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "./use-scroll-spy";

/** Row styling shared with the module items in TrackSidebar.
 *
 * The current row is marked by a filled ground AND a heavier weight, on top
 * of the aria-current every caller sets — so it survives without colour.
 *
 * Two things this must not do. It must not paint one edge: a coloured left
 * rib against a hairline everywhere else is the half-painted border the house
 * rules forbid, and it is what this row used to have. And it must not take a
 * prose underline: these rows sit inside AccordionContent, which sets
 * [&_a]:underline for the prose it normally wraps. That is a parent rule on
 * a descendant selector, so it outranks a plain `no-underline` on the anchor
 * — the `!` is what actually wins, and dropping it puts the underline back. */
export function navItemClass(active: boolean) {
  return cn(
    "flex items-start gap-2 rounded-md px-2 py-1.5 text-sm no-underline! transition-colors",
    active
      ? "bg-muted text-foreground font-semibold"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
  );
}

function anchorOf(item: PaperNavItem): string {
  return item.kind === "section" ? item.id : item.anchorId;
}

/**
 * The in-paper section tree: anchor links for every section (and inserted
 * activity), with the current section highlighted by scroll position.
 *
 * It renders inline in the sidebar's one scroll container, nested under the
 * row of the item being read — so the outline and the current item's headings
 * are a single list you scroll through, not two panes with a boundary. It
 * therefore has no height of its own and never scrolls itself; the follow
 * effect below drives the sidebar's scroller instead.
 *
 * Rows whose targets sit behind a still-closed reading gate (item.gateIds)
 * render locked — dimmed, with a lock icon — and clicking one scrolls to the
 * blocking gate's card instead of a hash that would land nowhere (the gated
 * DOM is unmounted).
 */
export function PaperSectionNav({
  items,
  pathname,
  completedContentIds,
  paperId,
  onNavigate,
}: {
  items: PaperNavItem[];
  pathname: string;
  completedContentIds: Set<string>;
  /** The paper's content id — keys the gate open state (papers only). */
  paperId?: string;
  onNavigate?: () => void;
}) {
  const activeId = useScrollSpy(items.map(anchorOf));
  const listRef = useRef<HTMLUListElement>(null);

  const gateIds = useMemo(
    () => [...new Set(items.flatMap((item) => item.gateIds ?? []))],
    [items],
  );
  const [openGates, setOpenGates] = useState<ReadonlySet<string>>(new Set());
  useEffect(() => {
    if (!paperId || gateIds.length === 0) return;
    try {
      const initiallyOpen = gateIds.filter(
        (id) =>
          window.localStorage.getItem(paperGateStorageKey(paperId, id)) ===
          "open",
      );
      // One deliberate mount-time re-render: localStorage is unreadable
      // during SSR/hydration (same idiom as PaperGate). Must also reset (not
      // just add) — in-track paper→paper navigation reuses this instance, and
      // gate ids are unscoped here, so stale ids could alias across papers.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenGates((prev) =>
        prev.size === 0 && initiallyOpen.length === 0
          ? prev
          : new Set(initiallyOpen),
      );
    } catch {
      // Storage unavailable — the open events below still unlock rows as the
      // learner taps through this visit.
    }
    const keyToId = new Map(
      gateIds.map((id) => [paperGateStorageKey(paperId, id), id]),
    );
    const onOpen = (event: Event) => {
      const key = (event as CustomEvent<{ storageKey?: string }>).detail
        ?.storageKey;
      const id = key ? keyToId.get(key) : undefined;
      if (id) {
        setOpenGates((prev) =>
          prev.has(id) ? prev : new Set(prev).add(id),
        );
      }
    };
    window.addEventListener(PAPER_GATE_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(PAPER_GATE_OPEN_EVENT, onOpen);
  }, [paperId, gateIds]);

  // Follow the reader: keep the active row in view inside whichever ancestor
  // actually scrolls (the sidebar's nav — this list has no scroll of its own).
  // Drive that element's scrollTop directly; scrollIntoView would also scroll
  // the document and fight the user's reading position.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !activeId) return;
    const row = list.querySelector<HTMLElement>(
      `[data-spy-anchor="${CSS.escape(activeId)}"]`,
    );
    if (!row) return;
    const scroller = scrollParentOf(list);
    if (!scroller) return;
    const viewRect = scroller.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    if (rowRect.top < viewRect.top || rowRect.bottom > viewRect.bottom) {
      scroller.scrollTop +=
        rowRect.top -
        viewRect.top -
        scroller.clientHeight / 2 +
        row.clientHeight / 2;
    }
  }, [activeId]);

  return (
    <ul
      ref={listRef}
      // No overflow of its own: it flows in the sidebar's scroller, so a
      // scroll box here would nest a second scrollbar inside the first.
      className="space-y-0.5 pb-1 pl-2"
    >
      {items.map((item) => {
        const anchor = anchorOf(item);
        const blockingGate = paperId
          ? item.gateIds?.find((id) => !openGates.has(id))
          : undefined;
        const content =
          item.kind === "section" ? (
            <>
              {item.number && (
                <span className="text-muted-foreground mt-px shrink-0 font-mono text-[11px]">
                  {item.number}
                </span>
              )}
              <span className="line-clamp-2">{item.title}</span>
            </>
          ) : item.kind === "inserted-lesson" ? (
            <>
              {completedContentIds.has(item.lessonId) ? (
                <CheckCircle2
                  className="text-foreground mt-0.5 size-3.5 shrink-0"
                  aria-hidden
                />
              ) : (
                <Circle
                  className="mt-0.5 size-3.5 shrink-0 opacity-30"
                  aria-hidden
                />
              )}
              <span className="line-clamp-2">{item.title}</span>
            </>
          ) : item.kind === "inserted-demo" ? (
            <>
              <Play className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span className="line-clamp-2">{item.title}</span>
            </>
          ) : (
            <>
              <PencilLine className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span className="line-clamp-2">{item.title}</span>
            </>
          );
        return (
          <li key={anchor} data-spy-anchor={anchor}>
            {blockingGate ? (
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById(paperGateDomId(blockingGate))
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  onNavigate?.();
                }}
                title="Behind a reading gate — jump to it"
                className={cn(
                  navItemClass(false),
                  "w-full py-1 text-left text-[13px] leading-snug opacity-55",
                )}
                style={{ paddingLeft: `${8 + (item.level - 2) * 12}px` }}
              >
                <Lock className="mt-0.5 size-3 shrink-0" aria-hidden />
                {content}
              </button>
            ) : (
              <Link
                href={`${pathname}#${anchor}`}
                onClick={onNavigate}
                aria-current={anchor === activeId ? "location" : undefined}
                className={cn(
                  navItemClass(anchor === activeId),
                  "py-1 text-[13px] leading-snug",
                )}
                style={{ paddingLeft: `${8 + (item.level - 2) * 12}px` }}
              >
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Nearest ancestor that actually scrolls. The sidebar's own scroller is a
 * `<nav>` several levels up (accordion content sits in between), so walking
 * the chain is the only way to find it from here — and an ancestor with
 * `overflow: auto` but no overflowing content is not it.
 */
function scrollParentOf(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
  }
  return null;
}
