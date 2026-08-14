"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { FocusReadingControl } from "@/components/learn/focus-reading";
import {
  FOCUS_DEFAULTS,
  focusClassName,
  markFocusWords,
  readFocusSettings,
  type FocusSettings,
} from "@/lib/reading/focus-reading";
import { MIN_PARTS, planParts } from "@/lib/reading/lesson-parts";
import {
  PagerCard,
  ReadingPager,
  type PagerLink,
} from "@/components/learn/reading-pager";

/* Reads a lesson one authored page at a time. The server renders the whole MDX
   body as this component's children; on mount, invisible PageBreak markers
   become boundaries and every page except the current one is hidden.

   Parts are not shown as tabs here — they nest under the lesson's row in the
   track sidebar (itemNavs → PaperSectionNav), which is the one index of the
   whole course, so a second copy on the reading's top edge said the same
   thing twice. What stays at the top is the single control the sidebar can't
   carry: the whole-lesson toggle. What stays at the bottom is one pager.

   That pager is unified: Previous/Next move part by part, and at the ends they
   roll into the neighbouring lesson — Next off the last part opens the next
   lesson at its first part, Previous off the first opens the previous lesson
   at its last (via ?p=last). So there is no separate lesson pager and no
   "part n / m" counter: the sidebar says where you are, and Next always means
   "the next thing to read". The page hands this reader the works-cited /
   complete footer so it renders above the pager, and drops its own LessonNav.

   The two ends render as big bordered cards (the LessonNav look), each
   carrying the title of what it goes to — a neighbouring part's heading, or
   the neighbouring lesson's title at the ends. They paint with border/muted
   tokens only, never --destructive: public/verification/theme.css re-points
   the palette on the Verification routes but never defines --destructive, so
   anything painted with it would ignore the high-contrast theme and stay the
   app's generic red.

   Parts are hidden, never unmounted: an embedded exercise or widget holds a
   half-answered run in memory, so the only difference between the part on
   screen and the rest is the `hidden` attribute. React never re-renders the
   static MDX output, so attributes set here stick.

   Where the breaks go is planParts (@/lib/reading/lesson-parts), pure and
   tested. The author places <PageBreak/> markers in MDX after deciding what a
   reader should complete on one screen; headings do not silently become page
   boundaries. Lessons without a marker render untouched. Two authored pages
   are enough to enable paging.

   Nothing here feeds progress. Completion stays with the Mark-complete button
   in the footer; reaching the last part completes nothing.

   Trap: a hidden part is out of find-in-page and out of print. The
   whole-lesson toggle is the way back to both (persisted per device under
   vt-reading-mode — carried over from the static course), so it stays visible
   whenever there is more than one part.

   Trap: in-page anchors — the sidebar's nested part rows, footnote links — can
   point into a hidden part, where the browser scroll would go nowhere. A
   document-level click listener reveals the owning part first, then scrolls. */

const MODE_KEY = "vt-reading-mode";

/** A neighbouring lesson the pager can roll into. */
export type PartNavLink = PagerLink;

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

/** `?p=<1-based>` deep-links a part; `?p=last` lands on the final part, which
 *  is how the pager rolls in from the next lesson pressing Previous. */
function partFromUrl(max: number): number {
  const raw = new URLSearchParams(location.search).get("p") ?? "1";
  if (raw === "last") return max;
  const n = parseInt(raw, 10);
  return Math.max(0, Math.min(max, (Number.isFinite(n) ? n : 1) - 1));
}

export function LessonPartsReader({
  children,
  footer,
  prev,
  next,
  estimatedMinutes,
  lessonTitle,
}: {
  children: ReactNode;
  /** Works-cited + complete button, rendered above the pager and never hidden
   *  with a part (it lives outside the `.lesson-body` host). */
  footer?: ReactNode;
  prev?: PartNavLink | null;
  next?: PartNavLink | null;
  /** The lesson's authored time estimate, printed on the toolbar line
   *  ("Estimated time: 60 mins | single page view, 4 parts"). The item page
   *  suppresses its own header clock chip when this reader carries it, so
   *  the estimate appears exactly once. */
  estimatedMinutes?: number;
  /** Used as the first pager label when the body opens before any heading. */
  lessonTitle: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [at, setAt] = useState(0);
  const [mode, setMode] = useState<"parts" | "whole">("parts");
  /* Focus reading. The reader owns it because the reader owns the body, and
     it works in two halves that must stay apart:

     1. The structure is written into the body ONCE, after mount, for both
        strengths at once (markFocusWords). The lesson body comes from a
        server component, so there is no React tree here to transform — and
        mutating React's DOM more than once gets the subtree discarded on the
        next render, which looks like the lesson vanishing mid-read.
     2. The setting is then only a class on the host below, and CSS does the
        rest. Changing modes never touches the document again.

     Read after mount, like the reading mode beside it, so the server render
     is always plain text and hydration has nothing to disagree about. */
  const [focus, setFocus] = useState<FocusSettings>(FOCUS_DEFAULTS);
  useEffect(() => {
    // Deliberate mount-time re-render, like the parts derivation below: the
    // stored preference exists only on the client, and reading it during
    // render would make the server and client markup disagree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocus(readFocusSettings());
    const body = hostRef.current?.querySelector<HTMLElement>(".lesson-body");
    if (body) markFocusWords(body);
  }, []);

  /* ---------- derive parts from the rendered body ---------- */

  useEffect(() => {
    const body = hostRef.current?.querySelector(".lesson-body");
    if (!body) return;
    const els = Array.from(body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );

    // PageBreak renders a hidden sentinel. It controls presentation only and
    // never becomes one of the page's visible blocks.
    const built: Part[] = planParts(
      els.map((el) => ({
        tag: el.tagName,
        text: el.textContent ?? "",
        breakLabel: el.hasAttribute("data-lesson-page-break")
          ? el.dataset.pageTitle ?? ""
          : undefined,
      })),
      lessonTitle
    ).map((planned) => ({
      label: planned.label,
      anchor:
        planned.headingIndex === null
          ? null
          : els[planned.headingIndex].id || null,
      els: planned.indices.map((i) => els[i]),
    }));

    if (built.length < MIN_PARTS) return; // no authored break: ordinary lesson page
    // One deliberate mount-time re-render: parts exist only in the rendered DOM.
    setParts(built);
    setMode(readMode());
    setAt(partFromUrl(built.length - 1));
  }, [lessonTitle]);

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
          topRef.current?.scrollIntoView({ block: "start" });
        });
      }
    },
    [parts.length]
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
        p.els.some((el) => el === target || el.contains(target))
      );
      if (idx < 0 || idx === at) return;
      e.preventDefault();
      goTo(idx, false);
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [parts, at, mode, goTo]);

  /* ---------- chrome ---------- */

  const active = parts.length >= MIN_PARTS;
  const whole = mode === "whole";
  const paged = active && !whole;
  const last = parts.length - 1;

  // Previous: a part move mid-lesson, else the previous lesson at its last part.
  const prevIsPart = paged && at > 0;
  // Next: a part move mid-lesson, else the next lesson at its first part.
  const nextIsPart = paged && at < last;

  return (
    <div>
      {/* The toolbar renders whether or not the lesson chunks, because the two
          controls in it have different reaches: the whole-lesson toggle only
          means something once there are parts, but focus reading is a global
          preference applied to every body this reader mounts. Hiding the row
          on a short lesson would leave a reader looking at accented text with
          no way to turn it off from the page they are on. */}
      <div
        ref={topRef}
        className="mb-6 flex flex-wrap items-center gap-2 scroll-mt-20 select-none"
      >
        {(estimatedMinutes || (active && whole)) && (
          <span
            className="text-muted-foreground text-[13px]"
            aria-live="polite"
          >
            {[
              estimatedMinutes
                ? `Estimated time: ${estimatedMinutes} mins`
                : null,
              active && whole
                ? `single page view, ${parts.length} parts`
                : null,
            ]
              .filter(Boolean)
              .join(" | ")}
          </span>
        )}
        {/* The two reading controls sit together: how much of the lesson is
            on screen, and how the words on it are set. `relative` is the
            anchor the focus panel drops from. */}
        <div className="relative ml-auto flex min-w-0 flex-wrap items-center justify-end gap-1 max-sm:w-full">
          {active && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMode}
              className="text-muted-foreground h-auto min-h-11 max-w-full px-2 text-sm whitespace-normal sm:min-h-7 sm:whitespace-nowrap"
            >
              {whole ? "Read part by part" : "Read the whole lesson"}
            </Button>
          )}
          <FocusReadingControl settings={focus} onChange={setFocus} />
        </div>
      </div>

      <div ref={hostRef} className={focusClassName(focus)}>
        {children}
      </div>

      {footer}

      <ReadingPager
        left={
          prevIsPart ? (
            <PagerCard
              dir="prev"
              title={parts[at - 1].label}
              onClick={() => goTo(at - 1)}
            />
          ) : prev ? (
            <PagerCard
              dir="prev"
              title={prev.title}
              href={`${prev.href}?p=last`}
            />
          ) : null
        }
        right={
          nextIsPart ? (
            <PagerCard
              dir="next"
              title={parts[at + 1].label}
              onClick={() => goTo(at + 1)}
            />
          ) : next ? (
            <PagerCard dir="next" title={next.title} href={next.href} />
          ) : null
        }
      />
    </div>
  );
}
