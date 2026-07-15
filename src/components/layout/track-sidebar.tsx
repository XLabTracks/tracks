"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, FileText, ListTree, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ModuleItem, TrackOutline } from "@/lib/content";
import type { PaperNavItem } from "@/lib/papers/paper-nav";
import { cn } from "@/lib/utils";
import { navItemClass, PaperSectionNav } from "./paper-section-nav";

export interface TrackSidebarProps {
  outline: TrackOutline;
  /** Content IDs the current user has completed — lessons, papers, and papers' inserted lessons (drives checkmarks). */
  completedContentIds?: string[];
  /** Module slugs gated by unmet prerequisites (drives lock icons). */
  lockedModuleSlugs?: string[];
  /**
   * Per-item section navigation (keyed by item id — papers and sectioned
   * lessons), docked below the module nav on that item's page.
   */
  itemNavs?: Record<string, PaperNavItem[]>;
}

/**
 * The item the current page shows, with its section nav — drives the docked
 * "In this paper" / "In this lesson" panel. Resolved from props (the outline
 * carries the full item objects), never from content accessors: this is a
 * client component.
 */
function activeItemNavOf(
  { outline, itemNavs = {} }: TrackSidebarProps,
  pathname: string,
): { kind: ModuleItem["kind"]; nav: PaperNavItem[] } | null {
  const base = `/tracks/${outline.track.slug}`;
  for (const { module, items } of outline.modules) {
    for (const item of items) {
      if (pathname !== `${base}/${module.slug}/${itemSlug(item)}`) continue;
      const nav = itemNavs[itemKey(item)];
      return nav && nav.length > 0 ? { kind: item.kind, nav } : null;
    }
  }
  return null;
}

function SidebarNav({
  outline,
  completedContentIds = [],
  lockedModuleSlugs = [],
  itemNavs = {},
  onNavigate,
}: TrackSidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const base = `/tracks/${outline.track.slug}`;
  const segments = pathname.split("/").filter(Boolean);
  const activeModuleSlug = segments[2];
  const completed = new Set(completedContentIds);
  const locked = new Set(lockedModuleSlugs);
  const activeItemNav = activeItemNavOf(
    { outline, completedContentIds, lockedModuleSlugs, itemNavs },
    pathname,
  );

  const [open, setOpen] = useState<string[]>(() =>
    activeModuleSlug
      ? [activeModuleSlug]
      : outline.modules[0]
        ? [outline.modules[0].module.slug]
        : [],
  );
  // Ensure the navigated-to module's accordion is open — adjust during render
  // when the active slug changes (React's alternative to a state-syncing effect).
  const [prevActive, setPrevActive] = useState(activeModuleSlug);
  if (activeModuleSlug !== prevActive) {
    setPrevActive(activeModuleSlug);
    if (activeModuleSlug && !open.includes(activeModuleSlug)) {
      setOpen([...open, activeModuleSlug]);
    }
  }

  // Nav ↔ section-panel split. null = automatic (panel content-sized up to
  // 55%); a user-chosen share pins the panel's height. The boundary handle
  // tracks the pointer absolutely (it sits ON the boundary), so drags don't
  // need delta math.
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    value: split,
    setValue: setSplit,
    persist: persistSplit,
  } = usePersistedDimension(SIDEBAR_SPLIT_KEY, clampSplit);
  const splitDrag = useRef<{ pointerId: number; moved: boolean } | null>(null);
  const [splitDragging, setSplitDragging] = useState(false);
  const splitFromPointer = (clientY: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return null;
    return clampSplit(((rect.bottom - clientY) / rect.height) * 100);
  };

  return (
    <div ref={rootRef} className="flex h-full flex-col">
      {/* Module navigation — scrolls on its own so the paper panel below
          keeps its share of the viewport regardless of how long this gets. */}
      <nav
        aria-label={`${outline.track.title} contents`}
        // pr-1.5 keeps classic (non-overlay) scrollbars clear of the resize
        // handle overlaying the sidebar's right edge.
        className="min-h-0 flex-1 overflow-y-auto pr-1.5"
      >
        <div className="px-3 py-4">
          <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
            {outline.track.shortTitle ?? "Track"}
          </p>
          <Link
            href={base}
            onClick={onNavigate}
            className={cn(
              "hover:bg-muted mt-1 block rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors",
              pathname === base && "bg-muted",
            )}
          >
            {outline.track.title}
          </Link>
        </div>
        <Accordion
          type="multiple"
          value={open}
          onValueChange={setOpen}
          className="px-2 pb-10"
        >
          {outline.modules.map(({ module, items }) => {
            const isLocked = locked.has(module.slug);
            const assessmentHref = `${base}/${module.slug}/assessment`;
            return (
              <AccordionItem key={module.id} value={module.slug} className="border-none">
                <AccordionTrigger className="hover:bg-muted [&[data-state=open]]:bg-muted/50 rounded-lg px-2 py-2 text-sm hover:no-underline">
                  <span className="flex items-center gap-2 text-left">
                    {isLocked && (
                      <>
                        <Lock
                          className="text-muted-foreground size-3.5 shrink-0"
                          aria-hidden
                        />
                        <span className="sr-only">Locked: </span>
                      </>
                    )}
                    <span className="line-clamp-2">
                      {module.order}. {module.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <ul className="border-border/70 ml-3 space-y-0.5 border-l pl-2">
                    {items.map((item) => (
                      <SidebarItemRow
                        key={itemKey(item)}
                        item={item}
                        href={`${base}/${module.slug}/${itemSlug(item)}`}
                        pathname={pathname}
                        completed={completed}
                        onNavigate={onNavigate}
                      />
                    ))}
                    {module.assessmentId && (
                      <li>
                        <Link
                          href={assessmentHref}
                          onClick={onNavigate}
                          className={navItemClass(pathname === assessmentHref)}
                        >
                          <FileText className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                          <span>Assessment</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </nav>

      {/* Docked section navigation for the paper or sectioned lesson being
          read: always visible on its page, with its own scroll + scroll-spy
          follow. A horizontal splitter above it adjusts its share of the
          sidebar (drag, arrow keys, double-click to reset). */}
      {activeItemNav && (
        <>
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize section panel"
            aria-valuemin={SPLIT_MIN}
            aria-valuemax={SPLIT_MAX}
            aria-valuenow={Math.round(split ?? SPLIT_AUTO)}
            tabIndex={0}
            title="Drag to resize · double-click to reset"
            onPointerDown={(e) => {
              if (e.button !== 0 || splitDrag.current) return;
              e.preventDefault();
              splitDrag.current = { pointerId: e.pointerId, moved: false };
              e.currentTarget.setPointerCapture(e.pointerId);
              setSplitDragging(true);
            }}
            onPointerMove={(e) => {
              const d = splitDrag.current;
              if (!d || e.pointerId !== d.pointerId) return;
              const next = splitFromPointer(e.clientY);
              if (next === null) return;
              d.moved = true;
              setSplit(next);
            }}
            onPointerUp={(e) => {
              const d = splitDrag.current;
              if (d?.pointerId !== e.pointerId) return;
              splitDrag.current = null;
              setSplitDragging(false);
              // A click with no movement must not convert automatic → fixed.
              if (d.moved) {
                const next = splitFromPointer(e.clientY);
                if (next !== null) persistSplit(next);
              }
            }}
            onPointerCancel={(e) => {
              if (splitDrag.current?.pointerId !== e.pointerId) return;
              splitDrag.current = null;
              setSplitDragging(false);
            }}
            onDoubleClick={() => persistSplit(null)}
            onKeyDown={(e) => {
              const step = (delta: number) =>
                persistSplit(clampSplit((split ?? SPLIT_AUTO) + delta));
              if (e.key === "ArrowUp") step(SPLIT_KEYBOARD_STEP);
              else if (e.key === "ArrowDown") step(-SPLIT_KEYBOARD_STEP);
              else if (e.key === "Home") persistSplit(SPLIT_MIN);
              else if (e.key === "End") persistSplit(SPLIT_MAX);
              else return;
              e.preventDefault();
            }}
            className={cn(
              "relative z-10 h-1.5 shrink-0 cursor-row-resize touch-none outline-none",
              "hover:bg-border focus-visible:bg-ring/50 transition-colors",
              splitDragging && "bg-ring/50",
            )}
          />
          <div
            className="border-border bg-card/60 flex shrink-0 flex-col border-t"
            style={
              split !== null ? { height: `${split}%` } : { maxHeight: "55%" }
            }
          >
            <p className="text-muted-foreground shrink-0 truncate px-4 pt-3 pb-1.5 text-xs font-medium tracking-wide uppercase">
              {activeItemNav.kind === "paper" ? "In this paper" : "In this lesson"}
            </p>
            <PaperSectionNav
              items={activeItemNav.nav}
              pathname={pathname}
              completedContentIds={completed}
              onNavigate={onNavigate}
            />
          </div>
        </>
      )}
    </div>
  );
}

function itemKey(item: ModuleItem): string {
  return item.kind === "lesson" ? item.lesson.id : item.paper.id;
}
function itemSlug(item: ModuleItem): string {
  return item.kind === "lesson" ? item.lesson.slug : item.paper.slug;
}
/**
 * An item is "done" only when all its progress units are — for a paper that
 * includes its inserted lessons, matching module/track totals. (Computed from
 * props: importing the content accessors would pull the graph client-side.)
 */
function itemDone(item: ModuleItem, completed: Set<string>): boolean {
  if (item.kind === "lesson") return completed.has(item.lesson.id);
  if (!completed.has(item.paper.id)) return false;
  return (item.paper.edits ?? []).every(
    (edit) =>
      edit.op !== "activity" ||
      edit.items.every(
        (inserted) => inserted.kind !== "lesson" || completed.has(inserted.id),
      ),
  );
}

function SidebarItemRow({
  item,
  href,
  pathname,
  completed,
  onNavigate,
}: {
  item: ModuleItem;
  href: string;
  pathname: string;
  completed: Set<string>;
  onNavigate?: () => void;
}) {
  const done = itemDone(item, completed);
  const active = pathname === href;
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={navItemClass(active)}
      >
        {done ? (
          <CheckCircle2
            className="text-foreground mt-0.5 size-3.5 shrink-0"
            aria-hidden
          />
        ) : (
          <Circle className="mt-0.5 size-3.5 shrink-0 opacity-30" aria-hidden />
        )}
        <span className="line-clamp-2">
          {item.kind === "lesson" ? item.lesson.title : item.paper.title}
          {done && <span className="sr-only"> (completed)</span>}
        </span>
        {item.kind === "paper" && (
          <FileText
            className="text-muted-foreground mt-0.5 ml-auto size-3 shrink-0"
            aria-hidden
          />
        )}
      </Link>
    </li>
  );
}

/** Resize bounds and defaults (px). The auto widths match w-72 / w-96. */
const SIDEBAR_MIN_WIDTH = 220;
const SIDEBAR_MAX_WIDTH = 520;
const SIDEBAR_AUTO_WIDTH = 288;
const SIDEBAR_AUTO_WIDTH_EXPANDED = 384;
const SIDEBAR_KEYBOARD_STEP = 16;
const SIDEBAR_WIDTH_KEY = "tracks:sidebar-width";

const clampSidebarWidth = (width: number) =>
  Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width));

/** Nav ↔ docked-section-panel split (% of sidebar height for the panel). */
const SPLIT_MIN = 15;
const SPLIT_MAX = 85;
const SPLIT_AUTO = 55; // matches the automatic max-h-[55%]
const SPLIT_KEYBOARD_STEP = 5;
const SIDEBAR_SPLIT_KEY = "tracks:sidebar-split";

const clampSplit = (split: number) =>
  Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, split));

/**
 * A user-adjustable dimension: null means automatic; a number is a
 * user-chosen value from a drag handle, persisted in localStorage. Reading
 * the stored value happens in a layout effect — SSR markup always renders
 * the automatic value, so there is no hydration mismatch, and the effect
 * re-applies before paint. `setValue` is the live (per-pointermove) setter;
 * `persist` additionally writes localStorage, once per gesture.
 */
function usePersistedDimension(key: string, clamp: (value: number) => number) {
  const [value, setValue] = useState<number | null>(null);

  useLayoutEffect(() => {
    const stored = Number(window.localStorage.getItem(key));
    if (Number.isFinite(stored) && stored > 0) {
      // One deliberate mount-time re-render, before paint: localStorage is
      // unreadable during SSR/hydration, and applying the stored value after
      // paint would flash the default on every load.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(clamp(stored));
    }
  }, [key, clamp]);

  const persist = (next: number | null) => {
    setValue(next);
    try {
      if (next === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, String(Math.round(next)));
    } catch {
      // Storage unavailable (private mode) — the value still applies this visit.
    }
  };

  return { value, setValue, persist };
}

export function TrackSidebar(props: TrackSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  // Section titles need more room than item titles — widen the bar while
  // a section panel is docked (automatic mode only; a user-chosen width wins).
  const expanded = activeItemNavOf(props, pathname) !== null;
  const {
    value: width,
    setValue: setWidth,
    persist,
  } = usePersistedDimension(SIDEBAR_WIDTH_KEY, clampSidebarWidth);
  const asideRef = useRef<HTMLElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startWidth: number;
    moved: boolean;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const autoWidth = expanded ? SIDEBAR_AUTO_WIDTH_EXPANDED : SIDEBAR_AUTO_WIDTH;
  // For keyboard steps, the settled automatic width — reading offsetWidth
  // could capture a mid-transition value. Drags read offsetWidth at grab
  // time instead so the bar never jumps under the pointer.
  const currentWidth = () => width ?? autoWidth;

  return (
    <>
      <aside
        ref={asideRef}
        style={width !== null ? { width } : undefined}
        className={cn(
          "border-border bg-card/40 sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-hidden border-r lg:block",
          // Animate only in automatic mode — a transition would lag the drag.
          width === null && "transition-[width] duration-300",
          width === null && (expanded ? "w-96" : "w-72"),
        )}
      >
        <SidebarNav {...props} />
        {/* Resize handle — the ARIA window-splitter pattern: drag, or focus
            and use arrow keys; Home/End jump to the bounds; double-click
            restores the automatic width. */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          aria-valuemin={SIDEBAR_MIN_WIDTH}
          aria-valuemax={SIDEBAR_MAX_WIDTH}
          aria-valuenow={Math.round(width ?? (expanded ? SIDEBAR_AUTO_WIDTH_EXPANDED : SIDEBAR_AUTO_WIDTH))}
          tabIndex={0}
          title="Drag to resize · double-click to reset"
          onPointerDown={(e) => {
            if (e.button !== 0 || drag.current) return; // one pointer owns a drag
            e.preventDefault();
            drag.current = {
              pointerId: e.pointerId,
              startX: e.clientX,
              startWidth: width ?? asideRef.current?.offsetWidth ?? autoWidth,
              moved: false,
            };
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || e.pointerId !== d.pointerId) return;
            d.moved = true;
            // Live-resize via state; localStorage is written once on release.
            setWidth(clampSidebarWidth(d.startWidth + e.clientX - d.startX));
          }}
          onPointerUp={(e) => {
            const d = drag.current;
            if (d?.pointerId !== e.pointerId) return;
            drag.current = null;
            setDragging(false);
            // A click with no movement must not convert automatic → fixed.
            if (d.moved) {
              persist(clampSidebarWidth(d.startWidth + e.clientX - d.startX));
            }
          }}
          onPointerCancel={(e) => {
            if (drag.current?.pointerId !== e.pointerId) return;
            drag.current = null;
            setDragging(false);
          }}
          onDoubleClick={() => persist(null)}
          onKeyDown={(e) => {
            const step = (delta: number) =>
              persist(clampSidebarWidth(currentWidth() + delta));
            if (e.key === "ArrowLeft") step(-SIDEBAR_KEYBOARD_STEP);
            else if (e.key === "ArrowRight") step(SIDEBAR_KEYBOARD_STEP);
            else if (e.key === "Home") persist(SIDEBAR_MIN_WIDTH);
            else if (e.key === "End") persist(SIDEBAR_MAX_WIDTH);
            else return;
            e.preventDefault();
          }}
          className={cn(
            "absolute inset-y-0 right-0 z-10 w-1.5 cursor-col-resize touch-none outline-none",
            "hover:bg-border focus-visible:bg-ring/50 transition-colors",
            dragging && "bg-ring/50",
          )}
        />
      </aside>

      <div className="bg-background/80 sticky top-14 z-30 border-b px-4 py-2 backdrop-blur lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ListTree className="size-4" aria-hidden /> Contents
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>{props.outline.track.title} contents</SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-hidden">
              <SidebarNav {...props} onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
