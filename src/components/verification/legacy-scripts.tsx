"use client";

import { useEffect, useRef } from "react";

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
 *
 * `onReady` fires once the whole list has executed — the seam for the pages
 * whose script publishes an entry point rather than mounting itself (the memo
 * desk's VTMemoDesk.mount). It is read through a ref so passing an inline
 * function does not re-run the loader.
 */
const loaded = new Set<string>();
const loading = new Map<string, Promise<void>>();

function loadOnce(url: string): Promise<void> {
  if (loaded.has(url)) return Promise.resolve();
  const existing = loading.get(url);
  if (existing) return existing;
  const promise = new Promise<void>((resolve) => {
    const tag = document.createElement("script");
    tag.src = url;
    tag.async = false;
    tag.onload = () => {
      // Mark the script independently of the component that requested it. A
      // navigation may cancel that component after execution but before its
      // await resumes; execution still happened and must never happen twice.
      loaded.add(url);
      loading.delete(url);
      resolve();
    };
    tag.onerror = () => {
      loading.delete(url);
      resolve();
    };
    document.body.appendChild(tag);
  });
  loading.set(url, promise);
  return promise;
}

export function LegacyScripts({
  src,
  onReady,
}: {
  src: string[];
  onReady?: () => void;
}) {
  const ready = useRef(onReady);
  useEffect(() => {
    ready.current = onReady;
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // A repeat client-side visit: every script in this page's list already
      // executed in this JS session, including the page's own self-mounting
      // script — which built a DOM that React has since thrown away and, not
      // being idempotent, must not run twice. With no re-invokable entry
      // point (onReady) the only safe way to rebuild the page is a real
      // load. Once by construction: reloading resets the module registry, so
      // the fresh document takes the normal path. Pages that do publish an
      // entry point (the memo desk) skip this and re-mount below.
      if (
        !ready.current &&
        src.length > 0 &&
        src.every((file) => loaded.has(`/verification/${file}`))
      ) {
        window.location.reload();
        return;
      }
      for (const file of src) {
        const url = `/verification/${file}`;
        if (loaded.has(url)) continue;
        await loadOnce(url);
        if (cancelled) return;
      }
      if (!cancelled) ready.current?.();
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return null;
}
