"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readStored, writeStored } from "@/components/verification/kit/stored";

export function useStoredState<T>(
  storageKey: string,
  empty: T,
  prune: (raw: unknown) => T,
  onRestore?: (restored: T) => void,
): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(empty);
  const [hydrated, setHydrated] = useState(false);

  const atMount = useRef({ prune, onRestore, empty });

  useEffect(() => {
    const { prune: parse, onRestore: seed, empty: blank } = atMount.current;
    let restored = blank;
    try {
      const raw = readStored(storageKey);
      if (raw) restored = parse(JSON.parse(raw));
    } catch {
    }
    queueMicrotask(() => {
      setValue(restored);
      seed?.(restored);
      setHydrated(true);
    });
  }, [storageKey]);

  const persist = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          writeStored(storageKey, JSON.stringify(resolved));
        } catch {
        }
        return resolved;
      });
    },
    [storageKey],
  );

  return [value, persist, hydrated];
}
