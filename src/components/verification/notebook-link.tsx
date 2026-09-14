"use client";

import type { ReactNode } from "react";

export function NotebookLink({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {
        const w = window as unknown as { VTNotebook?: { open: () => void } };
        w.VTNotebook?.open();
      }}
      className="text-brand-ink underline underline-offset-2 select-none"
    >
      {children}
    </button>
  );
}
