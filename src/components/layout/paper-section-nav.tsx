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

/** Row styling shared with the module items in TrackSidebar. */
export function navItemClass(active: boolean) {
  return cn(
    "flex items-start gap-2 rounded-md border-l-2 px-2 py-1.5 text-sm transition-colors",
    active
      ? "border-destructive bg-destructive/5 text-foreground font-medium"
      : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted",
  );
}

function anchorOf(item: PaperNavItem): string {
  return item.kind === "section" ? item.id : item.anchorId;
}

/**
 * The in-paper section tree, docked as the "In this paper" panel at the
 * bottom of the sidebar: anchor links for every section (and inserted
 * activity), with the current section highlighted by scroll position.
 * Rendered as a flex child of the panel — it takes the panel's remaining
 * height and scrolls internally. Rows whose targets sit behind a
 * still-closed reading gate (item.gateIds) render locked — dimmed, with a
 * lock icon — and clicking one scrolls to the blocking gate's card instead
 * of a hash that would land nowhere (the gated DOM is unmounted).
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
      // during SSR/hydration (same idiom as PaperGate).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (initiallyOpen.length > 0) setOpenGates(new Set(initiallyOpen));
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

  // Follow the reader: long papers cap this pane's height (it scrolls on its
  // own), so keep the active row centered inside it. Scroll the pane's
  // scrollTop directly — scrollIntoView could also scroll the document and
  // fight the user's reading position.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !activeId) return;
    const row = list.querySelector<HTMLElement>(
      `[data-spy-anchor="${CSS.escape(activeId)}"]`,
    );
    if (!row) return;
    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    if (rowRect.top < listRect.top || rowRect.bottom > listRect.bottom) {
      list.scrollTop +=
        rowRect.top - listRect.top - list.clientHeight / 2 + row.clientHeight / 2;
    }
  }, [activeId]);

  return (
    <ul
      ref={listRef}
      // pr-3.5 (= px-2 + 6px) keeps classic scrollbars clear of the sidebar's
      // resize handle when this panel docks in the resizable track sidebar.
      className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain pb-3 pl-2 pr-3.5"
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
