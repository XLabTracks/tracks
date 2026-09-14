"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * A demo's drawing is a fixed canvas, so on a narrow screen it scrolls rather
 * than shrinks.
 *
 * House idiom is an inline SVG with `w-full h-auto` over a viewBox of 560-720
 * units. That is right on a monitor and wrong on a phone: the SVG scales to
 * whatever column it is given, and every label scales with it. In a 324px
 * lesson column the scale is 0.45-0.58, which put `cross-episode-collusion`'s
 * labels on screen at 4.1px and its largest type at 5.4px. Nothing in the
 * demo is misconfigured — the canvas is simply being asked to be smaller than
 * its own type can survive.
 *
 * So the canvas keeps its natural width and the box scrolls, which is what
 * this repo already does for a wide table and for the actor board. Sizing is
 * read off each SVG's own viewBox: no demo has to declare anything, and on a
 * wide screen the min-width is below the available width and changes nothing.
 * Icons are left alone (a lucide glyph is a 24-unit viewBox), and a demo that
 * has already made itself scrollable is not wrapped twice.
 */
const CANVAS_MIN_VIEWBOX = 360;
const CANVAS_MAX_WIDTH = 760;
/* Mild shrink is fine and scrolling for it would be worse than the shrink:
   a 720-unit canvas in a 718px column is scale 0.997, and forcing a scrollbar
   there would be a regression, not a fix. Only step in once the canvas is
   being squeezed past this fraction of its natural width. */
const CANVAS_SHRINK_FLOOR = 0.9;

function useScrollableCanvas() {
  const ref = useRef<HTMLDivElement | null>(null);

  const fit = useCallback(() => {
    const host = ref.current;
    if (!host || !host.clientWidth) return;
    for (const node of host.querySelectorAll("svg[viewBox]")) {
      const svg = node as SVGSVGElement;
      const width = svg.viewBox?.baseVal?.width ?? 0;
      if (width < CANVAS_MIN_VIEWBOX) continue;
      if (svg.closest("[data-scrolls]") !== host) continue;
      const natural = Math.min(width, CANVAS_MAX_WIDTH);
      svg.style.minWidth =
        host.clientWidth < natural * CANVAS_SHRINK_FLOOR ? `${natural}px` : "";
    }
  }, []);

  // After every render, so a demo remounted by Reset is sized too.
  useEffect(fit);
  // And again when the column itself changes width (rotation, resize).
  useEffect(() => {
    const host = ref.current;
    if (!host || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    return () => observer.disconnect();
  }, [fit]);

  return ref;
}

class DemoErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p className="text-destructive text-sm">This demo failed to render.</p>
      );
    }
    return this.props.children;
  }
}

/**
 * The chromeless counterpart to DemoFrame, for framed={false} placements
 * (demos spliced into papers or embedded mid-prose in lessons without the
 * titled card). It keeps the two contract pieces the frame supplied — the
 * error boundary (a throwing demo degrades to one line instead of unwinding
 * to the route error page) and, for interactive demos, the remount Reset
 * (demos carry no reset logic of their own) — plus `not-prose`, which shields
 * demo internals from the lesson body's typography plugin.
 */
export function ChromelessDemo({
  showReset = true,
  children,
}: {
  /** When false, no Reset button renders (static diagrams). */
  showReset?: boolean;
  children: ReactNode;
}) {
  const [resetKey, setResetKey] = useState(0);
  const canvas = useScrollableCanvas();
  return (
    <div className="not-prose my-6">
      {showReset && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResetKey((k) => k + 1)}
            className="text-muted-foreground hover:text-foreground gap-1 text-xs"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </Button>
        </div>
      )}
      <div ref={canvas} data-scrolls className="overflow-x-auto">
        <DemoErrorBoundary key={resetKey}>{children}</DemoErrorBoundary>
      </div>
    </div>
  );
}

export interface DemoFrameProps {
  title: string;
  description?: string;
  /** When false, the header offers no Reset button (static diagrams). */
  showReset?: boolean;
  children: ReactNode;
}

export function DemoFrame({
  title,
  description,
  showReset = true,
  children,
}: DemoFrameProps) {
  const [resetKey, setResetKey] = useState(0);
  const canvas = useScrollableCanvas();
  return (
    <div className="not-prose border-border bg-card shadow-soft my-6 overflow-hidden rounded-xl border">
      <div className="border-border bg-muted/30 flex items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
        {showReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResetKey((k) => k + 1)}
            className="text-muted-foreground hover:text-foreground gap-1 text-xs"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </Button>
        )}
      </div>
      <div ref={canvas} data-scrolls className="overflow-x-auto p-4">
        <DemoErrorBoundary key={resetKey}>{children}</DemoErrorBoundary>
      </div>
    </div>
  );
}
