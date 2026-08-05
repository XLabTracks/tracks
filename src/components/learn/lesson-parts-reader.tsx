"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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

  const whole = mode === "whole";
  const strip = useMemo(() => {
    if (!parts.length) return null;
    return (
      <nav
        ref={stripRef}
        aria-label="Parts of this lesson"
        className="border-border scroll-mt-20 border-y py-3"
      >
        <div className="flex flex-wrap items-center gap-3">
          {whole ? (
            <span className="text-muted-foreground text-[13px]" aria-live="polite">
              {parts.length} parts, all shown
            </span>
          ) : (
            <span className="flex min-w-40 flex-1 basis-52 items-center gap-2.5">
              <span
                className="bg-muted h-1 flex-1 overflow-hidden rounded-full"
                aria-hidden
              >
                <span
                  className="bg-primary block h-full rounded-full transition-[width] duration-300"
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
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMode}
            className="ml-auto"
          >
            {whole ? "Read part by part" : "Read the whole lesson"}
          </Button>
        </div>
        <ol className="mt-3 flex flex-wrap gap-1.5">
          {parts.map((p, i) => {
            const now = !whole && i === at;
            const inner = (
              <>
                <span className="text-muted-foreground text-[11px] tabular-nums">
                  {i + 1}
                </span>
                <span>{p.label}</span>
                {now && (
                  <span className="text-primary text-[10px] font-semibold tracking-wide uppercase">
                    now
                  </span>
                )}
              </>
            );
            const cls =
              "inline-flex items-baseline gap-1.5 rounded-full border px-2.5 py-1 text-[13px] leading-normal transition-colors select-none " +
              (now
                ? "border-primary/40 bg-muted font-medium"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground");
            return (
              <li key={i}>
                {whole && p.anchor ? (
                  <a href={`#${p.anchor}`} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={cls}
                    aria-current={now ? "step" : undefined}
                    onClick={() => (whole ? undefined : goTo(i))}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
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
