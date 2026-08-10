"use client";

import { Component, type ReactNode, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <DemoErrorBoundary key={resetKey}>{children}</DemoErrorBoundary>
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
      <div className="p-4">
        <DemoErrorBoundary key={resetKey}>{children}</DemoErrorBoundary>
      </div>
    </div>
  );
}
