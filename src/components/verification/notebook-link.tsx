"use client";

import type { ReactNode } from "react";

/**
 * A link-styled control over the notebook. It has to be a button because the
 * notebook is a panel mounted on the page by notebook.js, not a route — there
 * is no URL to link to. `page="skills"` opens the book at its permanent last
 * page, the skill map; the default is wherever the reader last was.
 * Optional-chained on purpose: the script loads afterInteractive, so a press
 * before it lands is a no-op, never an error.
 */
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
