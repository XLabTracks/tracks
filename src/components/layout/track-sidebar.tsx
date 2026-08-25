"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  Flag,
  ListTree,
  Lock,
} from "lucide-react";
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
import { OptionalPrefix } from "@/components/content/optional-tag";
import type { SidebarOutline, SidebarOutlineItem } from "@/lib/content";
import type { PaperNavItem } from "@/lib/papers/paper-nav";
import { isVerificationRoute } from "@/components/verification/site-chrome";
import { cn } from "@/lib/utils";
import { navItemClass, PaperSectionNav } from "./paper-section-nav";

export interface TrackSidebarProps {
  /** Slim server-built projection — never the full outline (Paper.edits would bloat the client payload). */
  outline: SidebarOutline;
  /** Content IDs the current user has completed — lessons, papers, and papers' inserted lessons (drives checkmarks). */
  completedContentIds?: string[];
  /** Module slugs gated by unmet prerequisites (drives lock icons). */
  lockedModuleSlugs?: string[];
  /**
   * Per-item section navigation (keyed by item id — papers and sectioned
   * lessons), nested under that item's row while it is the one being read.
   */
  itemNavs?: Record<string, PaperNavItem[]>;
}

/**
 * The item the current page shows, with its section nav — the headings that
 * nest under its row. Resolved from the slim outline projection, never from
 * content accessors: this is a client component.
 */
function activeItemNavOf(
  { outline, itemNavs = {} }: TrackSidebarProps,
  pathname: string
): {
  kind: SidebarOutlineItem["kind"];
  id: string;
  nav: PaperNavItem[];
} | null {
  const base = `/tracks/${outline.track.slug}`;
  for (const { module, items } of outline.modules) {
    for (const item of items) {
      if (pathname !== `${base}/${module.slug}/${item.slug}`) continue;
      const nav = itemNavs[item.id];
      return nav && nav.length > 0
        ? { kind: item.kind, id: item.id, nav }
        : null;
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
    pathname
  );

  const [open, setOpen] = useState<string[]>(() =>
    activeModuleSlug
      ? [activeModuleSlug]
      : outline.modules[0]
      ? [outline.modules[0].module.slug]
      : []
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

  // Subsection groups collapse Google-Docs-style; the group being read must
  // never hide its rows, so the active item's group is forced open the same
  // adjust-during-render way as the module accordion above.
  const activeSectionKey = activeItemSectionKeyOf(outline, base, pathname);
  const [openSections, setOpenSections] = useState<string[]>(() =>
    activeSectionKey !== undefined ? [activeSectionKey] : []
  );
  const [prevActiveSection, setPrevActiveSection] = useState(activeSectionKey);
  if (activeSectionKey !== prevActiveSection) {
    setPrevActiveSection(activeSectionKey);
    if (
      activeSectionKey !== undefined &&
      !openSections.includes(activeSectionKey)
    ) {
      setOpenSections([...openSections, activeSectionKey]);
    }
  }
  const toggleSection = (key: string) =>
    setOpenSections(
      openSections.includes(key)
        ? openSections.filter((k) => k !== key)
        : [...openSections, key]
    );

  return (
    <div className="flex h-full flex-col">
      {/* One scroller for the whole outline. The current item's own headings
          nest under its row rather than docking in a second pane below: the
          track's contents and the page's contents are one list you scroll
          through, so reaching the headings means scrolling past the outline. */}
      <nav
        aria-label={`${outline.track.title} contents`}
        // pr-1.5 keeps classic (non-overlay) scrollbars clear of the resize
        // handle overlaying the sidebar's right edge.
        //
        // select-none on the whole tree: these rows are an index, not the
        // reading. A drag that starts on a lesson title and ends in the body
        // otherwise leaves a selection smear across the sidebar, which is
        // always a mis-drag — nobody copies a nav row. The static course
        // applies the same rule to its rail.
        className="min-h-0 flex-1 overflow-y-auto pr-1.5 select-none"
      >
        <div className="px-3 py-4">
          {/* An eyebrow only when it says something the title below does not.
              "Verification" over "Verification", or a bare "Track", is a
              kicker filling a slot — the heading already carries it. */}
          {outline.track.shortTitle &&
            outline.track.shortTitle !== outline.track.title && (
              <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                {outline.track.shortTitle}
              </p>
            )}
          {/* Not on Verification: its header is the track's own wordmark, so a
              "Verification" row directly under "Verification @ XLab" is the
              same word twice. Every other track wears the app header, which
              says "Tracks @ XLab" and never names the track, so there the row
              is the only place the sidebar says what you are reading. */}
          {!isVerificationRoute(pathname) && (
            <Link
              href={base}
              onClick={onNavigate}
              className={cn(
                "hover:bg-muted mt-1 block rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors",
                pathname === base && "bg-muted"
              )}
            >
              {outline.track.title}
            </Link>
          )}
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
              <AccordionItem
                key={module.id}
                value={module.slug}
                className="border-none"
              >
                <AccordionTrigger className="hover:bg-muted [&[data-state=open]]:bg-muted/50 min-h-11 rounded-lg px-2 py-2 text-sm hover:no-underline lg:min-h-0">
                  <span className="flex items-center gap-2.5 text-left">
                    {isLocked && (
                      <>
                        <Lock
                          className="text-muted-foreground size-3.5 shrink-0"
                          aria-hidden
                        />
                        <span className="sr-only">Locked: </span>
                      </>
                    )}
                    {/* The module numeral is the display element here — the
                        blackest weight the variable font carries, sized past
                        the title so it reads before the words do. */}
                    <span
                      className="min-w-4 shrink-0 text-center text-xl leading-none font-black tabular-nums"
                      aria-hidden
                    >
                      {module.order}
                    </span>
                    <span className="sr-only">Module {module.order}: </span>
                    <span className="line-clamp-3">{module.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <ul className="border-border/70 ml-3 space-y-0.5 border-l pl-2">
                    {groupModuleItems(items).map((group) => (
                      <SidebarItemGroup
                        key={itemKey(group.item)}
                        group={group}
                        moduleBase={`${base}/${module.slug}`}
                        pathname={pathname}
                        completed={completed}
                        activeItemNav={activeItemNav}
                        expanded={openSections.includes(itemKey(group.item))}
                        onToggle={() => toggleSection(itemKey(group.item))}
                        onNavigate={onNavigate}
                      />
                    ))}
                    {module.assessmentId && (
                      <li>
                        <Link
                          href={assessmentHref}
                          onClick={onNavigate}
                          className={cn(
                            navItemClass(pathname === assessmentHref),
                            ITEM_ROW_CLASS
                          )}
                        >
                          <FileText className={MARKER_CLASS} aria-hidden />
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
    </div>
  );
}

function itemKey(item: SidebarOutlineItem): string {
  return item.id;
}
function itemSectionItemId(item: SidebarOutlineItem): string | undefined {
  return item.sectionItemId;
}
function itemSlug(item: SidebarOutlineItem): string {
  return item.slug;
}

/** The active item's heading nav, as resolved by activeItemNavOf. */
type ActiveItemNav = {
  kind: SidebarOutlineItem["kind"];
  id: string;
  nav: PaperNavItem[];
};

interface ItemGroup {
  item: SidebarOutlineItem;
  children: SidebarOutlineItem[];
}

/** One projected item's own progress units. */
function itemDone(item: SidebarOutlineItem, completed: Set<string>): boolean {
  if (!completed.has(item.id)) return false;
  return (item.insertedLessonIds ?? []).every((id) => completed.has(id));
}

/** A collapsed section head answers for itself and all rows behind it. */
function groupDone(group: ItemGroup, completed: Set<string>): boolean {
  return (
    itemDone(group.item, completed) &&
    group.children.every((child) => itemDone(child, completed))
  );
}

/* A top-level sidebar row with the subsection rows that declared it as their
   section (`sectionItemId`). Content rules guarantee a section head precedes
   its subsections and is itself top-level; an item pointing anywhere else
   renders as its own top-level row rather than vanishing. ItemGroup and the
   two done-rules live in @/lib/content/item-done — pure, and tested. */

function groupModuleItems(items: SidebarOutlineItem[]): ItemGroup[] {
  const groups: ItemGroup[] = [];
  const byKey = new Map<string, ItemGroup>();
  for (const item of items) {
    const sectionKey = itemSectionItemId(item);
    const section =
      sectionKey !== undefined ? byKey.get(sectionKey) : undefined;
    if (section) {
      section.children.push(item);
    } else {
      const group: ItemGroup = { item, children: [] };
      groups.push(group);
      byKey.set(itemKey(item), group);
    }
  }
  return groups;
}

/** The group (section head's key) the current page belongs to, if any — the
 *  one collapse state must never be allowed to hide. Reading a subsection
 *  names its head; reading a head names itself, so arriving on it reveals
 *  the subsections it would otherwise be hiding. */
function activeItemSectionKeyOf(
  outline: SidebarOutline,
  base: string,
  pathname: string
): string | undefined {
  for (const { module, items } of outline.modules) {
    for (const item of items) {
      if (pathname !== `${base}/${module.slug}/${itemSlug(item)}`) continue;
      const sectionKey = itemSectionItemId(item);
      if (sectionKey !== undefined) return sectionKey;
      const key = itemKey(item);
      return items.some((other) => itemSectionItemId(other) === key)
        ? key
        : undefined;
    }
  }
  return undefined;
}

/**
 * A section head with subsections renders as a Google-Docs-style sub-tab
 * group: the row itself stays a plain link, and a separate caret beside it
 * (a link must not contain a button) collapses the children. Collapsed is
 * the default; the count says what the caret is hiding.
 */
function SidebarItemGroup({
  group,
  moduleBase,
  pathname,
  completed,
  activeItemNav,
  expanded,
  onToggle,
  onNavigate,
}: {
  group: ItemGroup;
  moduleBase: string;
  pathname: string;
  completed: Set<string>;
  activeItemNav: ActiveItemNav | null;
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const { item, children } = group;
  const href = `${moduleBase}/${itemSlug(item)}`;
  const sectionNavFor = (candidate: SidebarOutlineItem) =>
    activeItemNav?.id === itemKey(candidate) ? activeItemNav : undefined;
  if (children.length === 0) {
    return (
      <li>
        <SidebarItemRow
          item={item}
          href={href}
          pathname={pathname}
          completed={completed}
          done={itemDone(item, completed)}
          onNavigate={onNavigate}
          sectionNav={sectionNavFor(item)}
        />
      </li>
    );
  }
  const title = item.sidebarGroupTitle ?? item.title;
  const linkedRows = item.sidebarGroupTitle ? [item, ...children] : children;

  // Some submodules begin immediately with a substantive numbered section.
  // `sidebarGroupTitle` lets the outline show the submodule label without
  // inventing a separate introduction route: the label is a disclosure
  // button, and the head lesson becomes the first linked row below it.
  if (item.sidebarGroupTitle) {
    const done = groupDone(group, completed);
    return (
      <li>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Hide" : "Show"} sections of ${title}`}
          onClick={onToggle}
          className={cn(
            navItemClass(false),
            ITEM_ROW_CLASS,
            "w-full text-left"
          )}
        >
          {done ? (
            <CheckCircle2
              className={cn("text-foreground", MARKER_CLASS)}
              aria-hidden
            />
          ) : (
            <Circle className={cn("opacity-30", MARKER_CLASS)} aria-hidden />
          )}
          <span className="min-w-0 flex-1 line-clamp-2">{title}</span>
          <span className="text-muted-foreground ml-auto flex shrink-0 items-center gap-0.5 text-xs tabular-nums">
            {!expanded && linkedRows.length}
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform",
                expanded && "rotate-90"
              )}
              aria-hidden
            />
          </span>
          {done && <span className="sr-only"> (completed)</span>}
        </button>
        {expanded && (
          <ul className="border-border/70 ml-4 space-y-0.5 border-l pl-2">
            {linkedRows.map((child) => (
              <li key={itemKey(child)}>
                <SidebarItemRow
                  item={child}
                  href={`${moduleBase}/${itemSlug(child)}`}
                  pathname={pathname}
                  completed={completed}
                  done={itemDone(child, completed)}
                  onNavigate={onNavigate}
                  sectionNav={sectionNavFor(child)}
                />
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <SidebarItemRow
        item={item}
        href={href}
        pathname={pathname}
        completed={completed}
        done={groupDone(group, completed)}
        onNavigate={onNavigate}
        sectionNav={sectionNavFor(item)}
        caret={
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={`${expanded ? "Hide" : "Show"} subsections of ${title}`}
            onClick={onToggle}
            className="text-muted-foreground hover:bg-muted hover:text-foreground mt-1 flex h-11 min-w-11 shrink-0 items-center justify-center gap-0.5 rounded-md px-1 text-xs tabular-nums transition-colors select-none lg:h-6 lg:min-w-6"
          >
            {!expanded && children.length}
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform",
                expanded && "rotate-90"
              )}
              aria-hidden
            />
          </button>
        }
      />
      {expanded && (
        <ul className="border-border/70 ml-4 space-y-0.5 border-l pl-2">
          {children.map((child) => (
            <li key={itemKey(child)}>
              <SidebarItemRow
                item={child}
                href={`${moduleBase}/${itemSlug(child)}`}
                pathname={pathname}
                completed={completed}
                done={itemDone(child, completed)}
                onNavigate={onNavigate}
                sectionNav={sectionNavFor(child)}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarItemRow({
  item,
  href,
  pathname,
  completed,
  onNavigate,
  sectionNav,
  caret,
  done,
}: {
  item: SidebarOutlineItem;
  href: string;
  pathname: string;
  completed: Set<string>;
  onNavigate?: () => void;
  /** Set only on the item being read — its headings nest under this row. */
  sectionNav?: ActiveItemNav;
  /** A section head's collapse toggle, laid beside the link (never inside it). */
  caret?: React.ReactNode;
  /** Whether this row may show a tick. The caller decides, because only the
   *  caller knows what the row stands for: a section head answers for its
   *  collapsed subsections, and ticking it on its own lesson alone reports an
   *  eight-section submodule as finished to somebody who read its first page. */
  done: boolean;
}) {
  const active = pathname === href;
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(navItemClass(active), ITEM_ROW_CLASS)}
    >
      {/* The closing page is not work, so it takes neither marker: an empty
          circle would read as a unit left undone forever, and a tick as one
          nobody can earn. A flag says what it is — the end of the track. */}
      {item.completion ? (
        <Flag
          className={cn("text-muted-foreground", MARKER_CLASS)}
          aria-hidden
        />
      ) : done ? (
        <CheckCircle2
          className={cn("text-foreground", MARKER_CLASS)}
          aria-hidden
        />
      ) : (
        <Circle className={cn("opacity-30", MARKER_CLASS)} aria-hidden />
      )}
      <span className="flex min-w-0 flex-col">
        {/* The marker is a prefix now, so it goes INSIDE the clamp rather than
            on a line of its own below it. That was the right call for a chip
            — a long title would have clipped it off the primary nav surface —
            and it is the wrong one for a prefix: first in the clamp is the
            one position a clamp can never eat. */}
        <span className="line-clamp-2">
          {item.optional && <OptionalPrefix />}
          {item.title}
          {done && !item.completion && (
            <span className="sr-only"> (completed)</span>
          )}
        </span>
      </span>
      {item.kind === "paper" && (
        <FileText
          className="text-muted-foreground ml-auto size-3.5 shrink-0"
          aria-hidden
        />
      )}
    </Link>
  );
  return (
    <>
      {caret ? (
        <div className="flex items-start gap-0.5">
          <div className="min-w-0 flex-1">{link}</div>
          {caret}
        </div>
      ) : (
        link
      )}
      {/* No label above these: the row they hang under names the item, so
          "In this lesson" would be the title said twice. The indent rail is
          what marks them as its parts. */}
      {sectionNav && (
        <div className="border-border/70 ml-4 border-l pl-1">
          <PaperSectionNav
            items={sectionNav.nav}
            pathname={pathname}
            completedContentIds={completed}
            // Papers only: keys the reading-gate open state that unlocks rows
            // whose targets sit behind still-closed gates.
            paperId={sectionNav.kind === "paper" ? sectionNav.id : undefined}
            onNavigate={onNavigate}
          />
        </div>
      )}
    </>
  );
}

/**
 * Item rows in the module list, sized against the completion marker rather
 * than the text.
 *
 * The marker is the thing a learner scans this list for, so it is a 1.125rem
 * disc — comfortably bigger than the 13px it reads beside — and the row
 * centres on it. `items-center` overrides `navItemClass`'s `items-start`,
 * which is right for the dense in-paper section rows it also serves but
 * leaves a two-line title hanging off a marker pinned to its first line.
 * Centring is what makes a wrapped title still read as one row.
 *
 * Keep the two together: a bigger marker with `items-start` is worse than
 * either, because the misalignment grows with the marker.
 */
const ITEM_ROW_CLASS = "items-center gap-2.5";
const MARKER_CLASS = "size-[1.125rem] shrink-0";

/** Resize bounds and default (px). The auto width matches w-96. */
const SIDEBAR_MIN_WIDTH = 220;
const SIDEBAR_MAX_WIDTH = 520;
const SIDEBAR_AUTO_WIDTH_EXPANDED = 384;
const SIDEBAR_KEYBOARD_STEP = 16;
const SIDEBAR_WIDTH_KEY = "tracks:sidebar-width";

const clampSidebarWidth = (width: number) =>
  Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width));

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

  /* One width, whether or not the current item has a section nav.
     Sizing to content made the rail snap 288px <-> 384px on every navigation
     between a lesson with headings and one without, which reflowed the
     reading column with it. The section nav is what needs the room, so the
     wider figure is the one that stays; a user drag still overrides it. */
  const autoWidth = SIDEBAR_AUTO_WIDTH_EXPANDED;
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
          width === null && "w-96"
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
          aria-valuenow={Math.round(width ?? SIDEBAR_AUTO_WIDTH_EXPANDED)}
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
            "absolute inset-y-0 right-0 z-10 w-6 cursor-col-resize touch-none outline-none",
            "after:bg-border hover:after:bg-ring/50 focus-visible:after:bg-ring/50 after:absolute after:inset-y-0 after:right-0 after:w-1.5 after:transition-colors",
            dragging && "bg-ring/50"
          )}
        />
      </aside>

      <div className="bg-background sticky top-14 z-30 border-b px-4 py-2 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-11 gap-2 text-sm">
              <ListTree className="size-4" aria-hidden /> Contents
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[calc(100vw-2rem)]! max-w-96! p-0"
          >
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
