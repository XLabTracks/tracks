"use client";

import { useEffect, useRef, useState } from "react";

/* A third-party player frame that cannot hold the page open.
 *
 * An <iframe src> inside the viewport delays the window `load` event until the
 * provider answers, and `loading="lazy"` does not help: it defers frames that
 * are OFF screen, and a lesson's video usually sits near the top. A learner
 * whose network blocks the provider — a school or corporate proxy, a privacy
 * extension, a region that blocks it — therefore read the whole lesson beside
 * a black rectangle while the tab span, because the reading around the frame
 * had already painted and only the embed was still outstanding.
 *
 * So the src is attached after `load` has fired and the frame is near the
 * viewport. Nothing about the layout changes — the frame, its aspect box and
 * its caption render server-side exactly as before; only the moment the
 * provider is first contacted moves, which also means a reader who never
 * scrolls to the video never contacts it at all.
 */
export function DeferredEmbed({
  src,
  title,
  allow,
  referrerPolicy,
  className,
}: {
  src: string;
  title: string;
  allow?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  className?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [live, setLive] = useState<string | null>(null);

  useEffect(() => {
    if (live) return;
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const arm = () => {
      const node = ref.current;
      if (cancelled || !node) return;
      // No IntersectionObserver (older browsers): load once the page is idle
      // rather than not at all.
      if (typeof IntersectionObserver === "undefined") {
        setLive(src);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          if (!cancelled) setLive(src);
        },
        { rootMargin: "400px" }
      );
      observer.observe(node);
    };

    if (document.readyState === "complete") {
      arm();
    } else {
      window.addEventListener("load", arm, { once: true });
    }
    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("load", arm);
    };
  }, [src, live]);

  return (
    <iframe
      ref={ref}
      src={live ?? undefined}
      title={title}
      className={className}
      allow={allow}
      referrerPolicy={referrerPolicy}
      loading="lazy"
      allowFullScreen
    />
  );
}
