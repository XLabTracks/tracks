"use client";

import { useEffect, useRef } from "react";

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
