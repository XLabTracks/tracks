"use client";

import { useEffect } from "react";

/**
 * Loads a page's remaining plain-JS in a guaranteed order.
 *
 * The course's own pages (track, map, guide, memo desk, capstone bank…) used
 * to be hand-written HTML under public/verification/ with their scripts at the
 * end of <body>. They are app routes now — one application, one session, so
 * the account is present on every page instead of being probed for through an
 * API — but their behaviour is still the scripts those pages shipped. This is
 * the seam where that lives until each one becomes a component, and the list
 * shrinking to nothing is what finishing that job looks like.
 *
 * Order is the whole point and is why this is not a row of <Script> tags:
 * `data/*.js` set globals that platform.js and the page script read at
 * execution time, and next/script gives no ordering guarantee between tags of
 * the same strategy. Each file here waits for the one before it.
 *
 * Trap: these scripts read the DOM when they run, so this must be mounted
 * below the markup they look for, and they are not idempotent — a second run
 * would double every listener. Hence the load-once guard: React may mount
 * twice in development, and a client navigation back to a page it already
 * loaded must not re-run it.
 */
const loaded = new Set<string>();

export function LegacyScripts({ src }: { src: string[] }) {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      for (const file of src) {
        const url = `/verification/${file}`;
        if (loaded.has(url)) continue;
        await new Promise<void>((resolve) => {
          const tag = document.createElement("script");
          tag.src = url;
          tag.async = false;
          // Resolve on error too: one missing file must not strand the rest.
          tag.onload = tag.onerror = () => resolve();
          document.body.appendChild(tag);
        });
        if (cancelled) return;
        loaded.add(url);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return null;
}
