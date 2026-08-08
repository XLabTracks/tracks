"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* Reads a paper one section at a time, the way LessonPartsReader reads a
   lesson — and for the same reason: on a chunkedReading track everything else
   arrives a part at a time, and a treaty is the longest thing in the course.

   Boundaries are the paper's OWN sections, not arbitrary headings. Every
   converter puts a stable `ax-sec-`/`sb-sec-`/`lw-sec-` id on each toc
   heading, so an Article of a treaty is a page and nothing else is. Depth is
   adaptive: h2 alone, plus h3 when one h2 would otherwise swallow a third of
   the document — which is exactly the shape of a treaty paper, where "The
   Agreement" is one h2 holding fifteen Articles.

   The html never crosses into this component. It receives the server-rendered
   body as `children` and reorganizes the DOM after mount, which is the same
   contract PaperSidenotes/PaperGlossary/PaperHighlights hold — see the
   PaperReader docstring.

   Parts are hidden, never unmounted: an embedded exercise holds a
   half-answered run in memory, and the footnote/citation targets in the
   hidden parts must stay live for the sidenote layer to clone.

   Sidenotes need nothing from us. Their builder already skips a marker whose
   rect is 0×0 (written for collapsed hide-markers, true of a hidden part too)
   and rebuilds off a ResizeObserver on the container, which hiding a part
   trips.

   Traps, all three of them the same trap in different clothes — content that
   is in the document but not on screen:

   - The sidebar's section nav is the paper's index and every row points at a
     section that may be hidden. A document-level click listener reveals the
     owning part before the browser scrolls, or half the index goes dead.
   - A hidden part is out of find-in-page and out of print. The whole-paper
     toggle is the way back to both, so it stays visible whenever there is
     more than one part.
   - A gated paper already hides its own tail until the reader answers. Two
     hiding mechanisms over one document is a way to make content unreachable,
     so the page does not wrap a paper that carries gates — the check is
     `gateIdsOf(paper.edits)` there, on the edits themselves, rather than a
     guess at the rendered markup here. */

const MODE_KEY = "vt-reading-mode";

/** Toc-heading ids, whatever the source converter. */
const SECTION_ID = /^(ax|sb|lw)-(sec-|abstract)/;

interface Part {
  label: string;
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
  const raw = new URLSearchParams(location.search).get("p") ?? "1";
  if (raw === "last") return max;
  const n = parseInt(raw, 10);
  return Math.max(0, Math.min(max, (Number.isFinite(n) ? n : 1) - 1));
}

/** The reading units, flattened across wrappers.
 *
 *  An edited paper renders as several `.arxiv-paper` wrappers with activity
 *  blocks BETWEEN them, so the elements a part is made of are one level down
 *  inside a wrapper and one level up outside it. Flattening here is what lets
 *  a part span an activity card and carry on into the next wrapper. */
function readingUnits(root: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const child of Array.from(root.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.classList.contains("arxiv-paper")) {
      for (const el of Array.from(child.children)) {
        if (el instanceof HTMLElement) out.push(el);
      }
      continue;
    }
    out.push(child);
  }
  return out;
}

const isBoundary = (el: HTMLElement, tags: string[]) =>
  tags.includes(el.tagName) && SECTION_ID.test(el.id);

function buildParts(els: HTMLElement[], tags: string[]): Part[] {
  const built: Part[] = [];
  let cur: Part | null = null;
  // A heading with nothing under it yet would stand as a lone title over blank
  // space — fold consecutive headings together until body arrives.
  const bodyless = (p: Part | null) => !!p && p.els.every((e) => isBoundary(e, tags));
  for (const el of els) {
    if (isBoundary(el, tags)) {
      if (bodyless(cur)) {
        cur!.els.push(el);
        continue;
      }
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
  return built;
}

export function PaperPartsReader({
  children,
  attribution,
}: {
  children: ReactNode;
  /**
   * Whose text this is, printed above every part after the first. The page
   * header names the authors over part one; parts two onward would otherwise
   * be somebody else's writing with nothing on screen saying so.
   */
  attribution?: string | null;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [at, setAt] = useState(0);
  const [mode, setMode] = useState<"parts" | "whole">("parts");

  useEffect(() => {
    const root = hostRef.current?.querySelector<HTMLElement>(".paper-reader");
    if (!root) return;
    const els = readingUnits(root);
    let built = buildParts(els, ["H2"]);
    // One h2 swallowing a third of the paper is the treaty shape: "The
    // Agreement" carrying every Article. Go a level deeper rather than paging
    // the whole document as three screens and one book.
    const biggest = built.reduce((n, p) => Math.max(n, p.els.length), 0);
    if (built.length < 3 || biggest > els.length / 3) {
      built = buildParts(els, ["H2", "H3"]);
    }
    if (built.length < 3) return;

    // One deliberate mount-time re-render: parts exist only in the rendered
    // DOM, and the stored mode only on the client.
    setParts(built);
    setMode(readMode());
    setAt(partFromUrl(built.length - 1));
  }, []);

  useEffect(() => {
    if (!parts.length) return;
    parts.forEach((p, i) => {
      const hide = mode === "parts" && i !== at;
      p.els.forEach((el) => {
        el.hidden = hide;
      });
    });
    return () => {
      // Route transitions reuse the DOM: unmounting must leave it whole.
      parts.forEach((p) => p.els.forEach((el) => (el.hidden = false)));
    };
  }, [parts, at, mode]);

  const goTo = useCallback(
    (i: number, scroll = true) => {
      setAt((prev) => {
        const next = Math.max(0, Math.min(parts.length - 1, i));
        if (next === prev) return prev;
        // Replace rather than push: Back stays a move between items, and a
        // copied link opens on the part it was copied from.
        const url = new URL(location.href);
        if (next === 0) url.searchParams.delete("p");
        else url.searchParams.set("p", String(next + 1));
        history.replaceState(history.state, "", url);
        return next;
      });
      if (scroll) {
        requestAnimationFrame(() => topRef.current?.scrollIntoView({ block: "start" }));
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

  /* The sidebar's section rows, footnote markers and internal cross-references
     all point at ids that may be sitting in a hidden part. Reveal the owning
     part first, then let the scroll happen. */
  useEffect(() => {
    if (!parts.length) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return;
      const hash = a.hash;
      if (!hash || hash.length < 2) return;
      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(hash);
      } catch {
        return;
      }
      if (!target) return;
      const owner = parts.findIndex((p) => p.els.some((el) => el.contains(target)));
      if (owner < 0 || owner === at) return;
      goTo(owner, false);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [parts, at, goTo]);

  const chunked = parts.length > 1;
  const showAttribution = chunked && mode === "parts" && at > 0 && !!attribution;

  return (
    <>
      <div ref={topRef} className="scroll-mt-24" />

      {chunked && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {/* Smaller than the header's, and only once the header has scrolled
              out of the reading: parts after the first are otherwise somebody
              else's text with no name on the screen. */}
          <p className={cn("text-muted-foreground text-xs", !showAttribution && "invisible")}>
            {attribution}
          </p>
          <Button variant="ghost" size="sm" onClick={toggleMode} className="text-xs">
            {mode === "whole" ? "Read section by section" : "Read the whole paper"}
          </Button>
        </div>
      )}

      <div ref={hostRef}>{children}</div>

      {chunked && mode === "parts" && (
        <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Paper sections">
          {at > 0 ? (
            <button
              type="button"
              onClick={() => goTo(at - 1)}
              className="border-border hover:border-ring hover:bg-muted/40 rounded-xl border p-4 text-left transition-colors select-none"
            >
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <ArrowLeft className="size-3" aria-hidden /> Previous
              </span>
              <span className="mt-1 block text-sm font-medium">{parts[at - 1].label}</span>
            </button>
          ) : (
            <span />
          )}
          {at < parts.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(at + 1)}
              className="border-border hover:border-ring hover:bg-muted/40 rounded-xl border p-4 text-right transition-colors select-none sm:col-start-2"
            >
              <span className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
                Next <ArrowRight className="size-3" aria-hidden />
              </span>
              <span className="mt-1 block text-sm font-medium">{parts[at + 1].label}</span>
            </button>
          )}
        </nav>
      )}
    </>
  );
}
