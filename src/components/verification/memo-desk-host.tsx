"use client";

import { useCallback, useRef } from "react";

import { LegacyScripts } from "@/components/verification/legacy-scripts";

/**
 * The standalone memo desk: the surface memo-desk.js builds, mounted.
 *
 * The page it lives on used to carry a hand-copied duplicate of the desk's
 * markup and never call anything, so the desk was inert — and the copy was
 * already drifting from the template memo-desk.js writes over it. The markup
 * belongs to the script; this is only the host it fills and the call that
 * fills it.
 *
 * Order matters here in a way next/script cannot promise, which is why the
 * files go through LegacyScripts: data/memos.js publishes the slot list the
 * desk reads at load, and memo-store.js must have published the store before
 * the desk asks for it. memo-store.js is on the site chrome as well — it is
 * written to publish once, so loading it in both places is a no-op.
 *
 * `hash: true` (the default) is deliberate and is what makes the "Draft it on
 * the memo desk" links land on their slot: this desk owns the URL fragment.
 * The inline desks module.js mounts inside a unit pass `hash: false`.
 */

type MemoDeskApi = {
  mount: (host: HTMLElement, opts?: { slots?: string[]; hash?: boolean }) => unknown;
};

const SCRIPTS = [
  "data/course.js",
  "data/skills.js",
  "data/memos.js",
  "data/chrome.js",
  "platform.js",
  "memo-store.js",
  "memo-desk.js",
];

export function MemoDeskHost() {
  const hostRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // mount() replaces the host's contents and installs its own listeners, so it
  // runs once per host — React's development double-mount must not build the
  // desk twice over.
  const mount = useCallback(() => {
    const host = hostRef.current;
    if (!host || mounted.current) return;
    const desk = (window as unknown as { VTMemoDesk?: MemoDeskApi }).VTMemoDesk;
    if (!desk) return;
    mounted.current = true;
    desk.mount(host);
  }, []);

  return (
    <>
      {/* The fallback is what a reader sees if the scripts never arrive, and
          it is the truth rather than a spinner that lies once loading has
          failed. mount() writes over it. */}
      <div className="desk" ref={hostRef} suppressHydrationWarning>
        <p className="desk-note">
          The desk is a JavaScript surface. If this line stays, its scripts did
          not load — a reload usually fixes it.
        </p>
      </div>
      <LegacyScripts src={SCRIPTS} onReady={mount} />
    </>
  );
}
