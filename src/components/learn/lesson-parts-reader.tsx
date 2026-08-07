"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Reads a lesson one part at a time. The server renders the whole MDX body as
   this component's children; on mount the body's top-level headings become
   part boundaries and every part except the current one is hidden.

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

   The meter/counter is gone, but the palette note it carried still holds for
   the Next button: `primary`, never `destructive`. public/verification/
   theme.css re-points the palette on the Verification routes but never
   defines --destructive, so anything painted with it stays the app's generic
   red and ignores the high-contrast theme.

   Parts are hidden, never unmounted: an embedded exercise or widget holds a
   half-answered run in memory, so the only difference between the part on
   screen and the rest is the `hidden` attribute. React never re-renders the
   static MDX output, so attributes set here stick.

   Boundary depth is adaptive per lesson: h2 alone where a lesson has enough
   of them, h3 and then h4 folded in where it doesn't. Lessons that still
   yield fewer than three parts render untouched — no toggle, no part moves,
   just the lesson-level pager so the reader still owns the way forward.

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
export interface PartNavLink {
  href: string;
  title: string;
}

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
}: {
  children: ReactNode;
  /** Works-cited + complete button, rendered above the pager and never hidden
   *  with a part (it lives outside the `.lesson-body` host). */
  footer?: ReactNode;
  prev?: PartNavLink | null;
  next?: PartNavLink | null;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
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

    if (built.length < 3) return; // short lesson: nothing hidden, lesson pager only
    // One deliberate mount-time re-render: parts exist only in the rendered DOM.
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
          topRef.current?.scrollIntoView({ block: "start" });
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
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [parts, at, mode, goTo]);

  /* ---------- chrome ---------- */

  const active = parts.length >= 3;
  const whole = mode === "whole";
  const paged = active && !whole;
  const last = parts.length - 1;

  // Previous: a part move mid-lesson, else the previous lesson at its last part.
  const prevIsPart = paged && at > 0;
  // Next: a part move mid-lesson, else the next lesson at its first part.
  const nextIsPart = paged && at < last;

  const showLeft = prevIsPart || Boolean(prev);
  const showRight = nextIsPart || Boolean(next);

  const titleClass = "block max-w-[16rem] truncate";

  return (
    <div>
      {active && (
        <div
          ref={topRef}
          className="mb-6 flex scroll-mt-20 items-center select-none"
        >
          {whole && (
            <span className="text-muted-foreground text-[13px]" aria-live="polite">
              {parts.length} parts, all shown
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className="text-muted-foreground ml-auto h-7 px-2 text-[13px]"
          >
            {whole ? "Read part by part" : "Read the whole lesson"}
          </Button>
        </div>
      )}

      <div ref={hostRef}>{children}</div>

      {footer}

      {(showLeft || showRight) && (
        // select-none: the pager is an index of where to go next, not text to
        // copy. A drag that ends here otherwise smears across it.
        <div className="border-border mt-10 flex items-center gap-3 border-t pt-6 select-none">
          {prevIsPart ? (
            <Button variant="outline" size="sm" onClick={() => goTo(at - 1)}>
              <ArrowLeft className="size-4" aria-hidden /> Previous part
            </Button>
          ) : prev ? (
            <Button asChild variant="outline" size="sm" className="h-auto py-1.5">
              <Link href={`${prev.href}?p=last`}>
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                <span className={titleClass}>{prev.title}</span>
              </Link>
            </Button>
          ) : (
            <span />
          )}

          <div className="flex-1" />

          {nextIsPart ? (
            <Button size="sm" onClick={() => goTo(at + 1)}>
              Next part <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : next ? (
            <Button asChild size="sm" className="h-auto py-1.5">
              <Link href={next.href}>
                <span className={titleClass}>{next.title}</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
            </Button>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
