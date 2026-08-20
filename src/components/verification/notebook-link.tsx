"use client";

import type { ReactNode } from "react";

export function NotebookLink({
  page,
  children,
}: {
  page?: "skills";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const w = window as unknown as {
          VTNotebook?: { open: () => void; openSkills?: () => void };
        };
        const nb = w.VTNotebook;
        if (!nb) return;
        if (page === "skills" && nb.openSkills) nb.openSkills();
        else nb.open();
      }}
      className="text-brand-ink underline underline-offset-2 select-none"
    >
      {children}
    </button>
  );
}
