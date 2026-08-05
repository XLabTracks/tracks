"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";

/* Reads a lesson one part at a time. The server renders the whole MDX body as
   this component's children; on mount the body's top-level headings become
   part boundaries and every part except the current one is hidden. A strip
   above the reading carries a position meter (always with its "part n / m"
   counter — the bar is decoration for the fraction, never the reading), a
   chip per part to jump anywhere, and a whole-lesson toggle; a pager below
   moves one part at a time.

   The meter fill, the "now" label and the current chip's border are all
   `primary`, never `destructive`. Two reasons, and the second is the one that
   bites: a reading position is not an error, and public/verification/theme.css
   re-points the whole palette on the Verification routes but never defines
   --destructive — so anything painted with it is the one element on the page
   still wearing the app's generic red-600 instead of the course's maroon, and
   it stays red in the high-contrast theme where --primary is yellow.

   Parts are hidden, never unmounted: an embedded exercise or widget holds a
   half-answered run in memory, so the only difference between the part on
   screen and the rest is the `hidden` attribute. React never re-renders the
   static MDX output, so attributes set here stick.

   Boundary depth is adaptive per lesson: h2 alone where a lesson has enough
   of them, h3 and then h4 folded in where it doesn't — the transcribed
   lessons are not uniform, and a reader that only understood ## would leave
   the h4-structured ones as the walls this component exists to break up.
   Lessons that still yield fewer than three parts render untouched.

   Nothing here feeds progress. The meter reads position in the reading;
   completion stays with the Mark-complete button, and reaching the last part
   completes nothing.

   Trap: a hidden part is out of find-in-page and out of print. The
   whole-lesson toggle is the way back to both, so it must always be visible
   alongside the strip, and the preference (persisted per device under
   vt-reading-mode — carried over from the static course, so an existing
   choice survives) applies to every lesson, not one.

   Trap: in-page anchors — the sidebar's "In this lesson" rows, footnote
   links — can point into a hidden part, where the browser scroll would go
   nowhere. A document-level click listener reveals the owning part first,
   then lets the scroll happen. */

const MODE_KEY = "vt-reading-mode";

interface Part {
  label: string;
  /** The heading's DOM id, for whole-mode anchor jumps. */
  anchor: string | null;
  els: HTMLElement[];
}

function readMode(): "parts" | "whole" {
  try {
    return localStorage.getItem(MODE_KEY) === "whole" ? "whole" : "parts";
  } catch {
    return "parts";
  }
}

/**
 * One cell per part, cut out of the whole bar — track and fill together — so
 * the fill stays a single width-animated element and a bar reads as "3 of 6"
 * rather than as "somewhere past half". Cells lay out at (100% + gap)/n and
 * the trailing gap is cut back off, which keeps the last cell flush with the
 * end. Lessons run to a handful of parts; past about six, cells stop being
 * countable and this is worth dropping for a plain bar.
 */
function cellMask(cells: number): CSSProperties {
  const gap = "3px";
  const step = `calc((100% + ${gap}) / ${cells})`;
  const mask = `repeating-linear-gradient(to right, #000 0 calc(${step} - ${gap}), transparent 0 ${step})`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

function partFromUrl(max: number): number {
  const n = parseInt(new URLSearchParams(location.search).get("p") ?? "1", 10);
  return Math.max(0, Math.min(max, (Number.isFinite(n) ? n : 1) - 1));
}

export function LessonPartsReader({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [at, setAt] = useState(0);
  const [mode, setMode] = useState<"parts" | "whole">("parts");

  /* ---------- derive parts from the rendered body ---------- */

  useEffect(() => {
    const body = hostRef.current?.querySelector(".lesson-body");
    if (!body) return;
    const els = Array.from(body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );

    const countOf = (tags: string[]) =>
      els.filter((el) => tags.includes(el.tagName)).length;
    let tags = ["H2"];
    if (countOf(tags) < 2) tags = ["H2", "H3"];
    if (countOf(tags) < 2) tags = ["H2", "H3", "H4"];

    const built: Part[] = [];
    let cur: Part | null = null;
    for (const el of els) {
      if (tags.includes(el.tagName)) {
        cur = { label: el.textContent ?? "", anchor: el.id || null, els: [el] };
        built.push(cur);
        continue;
      }
      if (!cur) {
        cur = { label: "Start", anchor: null, els: [] };
        built.push(cur);
      }
      cur.els.push(el);
    }

    if (built.length < 3) return; // short lesson: no chrome, nothing hidden
    // One deliberate mount-time re-render: parts exist only in the rendered
    // DOM, so they cannot be derived during render or SSR (the same trade
    // usePersistedDimension makes for localStorage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParts(built);
    setMode(readMode());
    setAt(partFromUrl(built.length - 1));
  }, []);

  /* ---------- apply visibility ---------- */

  useEffect(() => {
    if (!parts.length) return;
    parts.forEach((p, i) => {
      const hide = mode === "parts" && i !== at;
      p.els.forEach((el) => {
        el.hidden = hide;
      });
    });
    return () => {
      // Unmounting must leave the document whole (route transitions reuse DOM).
      parts.forEach((p) => p.els.forEach((el) => (el.hidden = false)));
    };
  }, [parts, at, mode]);

  /* ---------- navigation ---------- */

  const goTo = useCallback(
    (i: number, scroll = true) => {
      setAt((prev) => {
        const next = Math.max(0, Math.min(parts.length - 1, i));
        if (next === prev) return prev;
        // Part moves rewrite the URL rather than pushing: Back stays a move
        // between lessons, and a copied link opens on the part it came from.
        const url = new URL(location.href);
        if (next === 0) url.searchParams.delete("p");
        else url.searchParams.set("p", String(next + 1));
        history.replaceState(history.state, "", url);
        return next;
      });
      if (scroll) {
        requestAnimationFrame(() => {
          stripRef.current?.scrollIntoView({ block: "start" });
        });
      }
    },
    [parts.length],
  );

  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next = m === "whole" ? "parts" : "whole";
      try {
        localStorage.setItem(MODE_KEY, next);
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  /* In-page anchors may target a hidden part: reveal it, then scroll. */
  useEffect(() => {
    if (!parts.length || mode === "whole") return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const hash = href.startsWith("#")
        ? href.slice(1)
        : (() => {
            try {
              const u = new URL(href, location.href);
              return u.pathname === location.pathname ? u.hash.slice(1) : "";
            } catch {
              return "";
            }
          })();
      if (!hash) return;
      const target = document.getElementById(decodeURIComponent(hash));
      if (!target || !hostRef.current?.contains(target)) return;
      const idx = parts.findIndex((p) =>
        p.els.some((el) => el === target || el.contains(target)),
      );
      if (idx < 0 || idx === at) return;
      e.preventDefault();
      goTo(idx, false);
      requestAnimationFrame(() =>
        target.scrollIntoView({ block: "start" }),
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [parts, at, mode, goTo]);

  /* ---------- chrome ---------- */

  /* The strip is a tab bar, not a chip cloud: the parts sit on the reading's
     top edge like the tabs of a document, and the one being read is the tab
     the page hangs from — outlined on three sides, open to the text below,
     carried by weight and shape rather than a badge. The baseline the other
     tabs rest on is each tab's own bottom border (plus a flex filler), never
     a border on the scroll row — the classic -mb-px overlap would be clipped
     by the row's own overflow-x scrolling.

     Long headings truncate rather than wrap: a tab bar is one row, and it
     scrolls sideways when the lesson has more tabs than the column has width
     (the full label rides on title). The current tab keeps itself in view.

     The meter fill and the active tab's numeral are `primary`, never
     `destructive`: a reading position is not an error, and
     public/verification/theme.css re-points the palette on the Verification
     routes but never defines --destructive — anything painted with it stays
     the app's generic red and ignores the high-contrast theme. */

  const whole = mode === "whole";
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    tabRefs.current[at]?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [at, parts.length]);

  const strip = useMemo(() => {
    if (!parts.length) return null;
    return (
      <nav
        ref={stripRef}
        aria-label="Parts of this lesson"
        className="scroll-mt-20"
      >
        <div className="mb-2.5 flex items-center gap-3">
          {whole ? (
            <span className="text-muted-foreground text-[13px]" aria-live="polite">
              {parts.length} parts, all shown
            </span>
          ) : (
            <span className="flex min-w-40 flex-1 basis-52 items-center gap-2.5">
              <span
                className="bg-muted h-2 flex-1 overflow-hidden rounded-xs"
                style={cellMask(parts.length)}
                aria-hidden
              >
                <span
                  className="bg-primary block h-full transition-[width] duration-300"
                  style={{ width: `${(100 * (at + 1)) / parts.length}%` }}
                />
              </span>
              <span
                className="text-muted-foreground text-[13px] whitespace-nowrap tabular-nums"
                aria-live="polite"
              >
                part {at + 1} / {parts.length}
              </span>
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={toggleMode} className="text-muted-foreground ml-auto h-7 px-2 text-[13px]">
            {whole ? "Read part by part" : "Read the whole lesson"}
          </Button>
        </div>
        <ol className="flex items-end overflow-x-auto">
          {parts.map((p, i) => {
            const now = !whole && i === at;
            const inner = (
              <>
                <span
                  className={
                    "text-[11px] tabular-nums " +
                    (now ? "text-primary" : "text-muted-foreground/70")
                  }
                >
                  {i + 1}
                </span>
                <span className="max-w-52 truncate">{p.label}</span>
              </>
            );
            const cls =
              "flex shrink-0 items-baseline gap-1.5 rounded-t-md border px-3 py-1.5 text-[13px] leading-normal transition-colors select-none " +
              (now
                ? "border-border border-b-transparent bg-background font-medium"
                : "border-transparent border-b-border text-muted-foreground hover:bg-muted/60 hover:text-foreground");
            return (
              <li
                key={i}
                className="flex shrink-0"
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
              >
                {whole && p.anchor ? (
                  <a href={`#${p.anchor}`} className={cls} title={p.label}>
                    {inner}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={cls}
                    title={p.label}
                    aria-current={now ? "step" : undefined}
                    onClick={() => (whole ? undefined : goTo(i))}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
          {/* Carries the baseline from the last tab to the column's edge. */}
          <li aria-hidden className="border-b-border min-w-3 flex-1 self-stretch border-b" />
        </ol>
      </nav>
    );
  }, [parts, at, whole, goTo, toggleMode]);

  return (
    <div>
      {strip && <div className="mb-6">{strip}</div>}
      <div ref={hostRef}>{children}</div>
      {strip && !whole && (
        <div className="border-border mt-8 flex flex-wrap items-center gap-3 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={at === 0}
            onClick={() => goTo(at - 1)}
          >
            ← Previous part
          </Button>
          <span className="text-muted-foreground mx-auto text-[13px] tabular-nums select-none">
            part {at + 1} / {parts.length}
          </span>
          {/* The last part carries no Next: the Mark-complete button and the
              lesson pager sit right below, and that is the way out. */}
          {at < parts.length - 1 ? (
            <Button size="sm" onClick={() => goTo(at + 1)}>
              Next part →
            </Button>
          ) : (
            <span
              className="text-muted-foreground text-[13px]"
              aria-hidden
            >
              end of the lesson
            </span>
          )}
        </div>
      )}
    </div>
  );
}
