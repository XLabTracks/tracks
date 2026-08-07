"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MECHANISM_RANK,
  MECHANISM_RANK_REOPEN,
  RANK_ITEMS,
} from "@/lib/verification/data/rank-feasibility";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * The feasibility ranking sealed in 2.0 and reopened in 4.1, ported from the
 * retired static player's rank engine. All learner-facing copy lives in
 * `src/lib/verification/data/rank-feasibility.ts`.
 *
 * Behaviour carried over intact: keyboard-first ordering (every row has
 * up/down buttons; drag is not offered — a list this short does not need it,
 * and drag without a keyboard path is an accessibility bug), a seal with no
 * key and no score, and — on reopen — the 2.0 order shown alongside, with a
 * "moved n" chip on any row that travelled two places or more.
 *
 * State lives under the old engine's `vt-ex:<id>` localStorage keys, so a
 * ranking sealed under the static player resurfaces here. Learner work only:
 * it feeds no meter and completes nothing, so neither widget calls
 * onComplete.
 */

interface RankStore {
  order?: string[];
  notes?: string;
  sealed?: boolean;
}

const load = (key: string): RankStore => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") || {};
  } catch {
    return {};
  }
};

const save = (key: string, val: RankStore) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* private mode */
  }
};

const label = (id: string) => RANK_ITEMS.find((it) => it.id === id)?.t ?? id;
const defaultOrder = () => RANK_ITEMS.map((it) => it.id);

function RankWidget({
  copy,
  reopen,
}: {
  copy: typeof MECHANISM_RANK | typeof MECHANISM_RANK_REOPEN;
  reopen?: boolean;
}) {
  const [order, setOrder] = useState<string[]>(defaultOrder);
  const [prior, setPrior] = useState<string[] | null>(null);
  const [sealed, setSealed] = useState(false);
  const [notes, setNotes] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from the permanent keys after mount; the server render is the
  // untouched default order, so signed-out and first-visit look identical.
  // These setState calls are that deliberate one-time hydration — a lazy
  // initializer would run during SSR (no localStorage) and mismatch on
  // hydrate — so the cascading-render rule is disabled for this block alone.
  useEffect(() => {
    const own = load(copy.storageKey);
    /* eslint-disable react-hooks/set-state-in-effect */
    if (own.order && own.order.length === RANK_ITEMS.length) setOrder(own.order);
    if (own.notes) setNotes(own.notes);
    if (own.sealed) setSealed(true);
    if (reopen) {
      const p = load(MECHANISM_RANK_REOPEN.priorKey);
      if (p.order && p.order.length === RANK_ITEMS.length) setPrior(p.order);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [copy.storageKey, reopen]);

  const persist = (next: Partial<RankStore>) => {
    save(copy.storageKey, { order, notes, sealed, ...next });
  };

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = order.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    persist({ order: next, sealed: false });
    if (sealed) setSealed(false);
  };

  const onNotes = (v: string) => {
    setNotes(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persist({ notes: v }), 400);
  };

  const seal = () => {
    setSealed(true);
    persist({ sealed: true });
  };

  return (
    <section className="not-prose border-border bg-card space-y-4 rounded-xl border p-5 text-sm">
      <div>
        <h3 className="text-lg font-semibold">{copy.title}</h3>
        <p className="text-muted-foreground mt-1">{copy.lede}</p>
      </div>

      {reopen && prior ? (
        <div className="border-border rounded-lg border p-3">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase select-none">
            {MECHANISM_RANK_REOPEN.priorLabel}
          </p>
          <ol className="text-muted-foreground mt-2 list-decimal space-y-1 pl-6">
            {prior.map((id) => (
              <li key={id}>{label(id)}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <ol className="space-y-1.5">
        {order.map((id, k) => {
          const moved = prior ? Math.abs(prior.indexOf(id) - k) : 0;
          return (
            <li
              key={id}
              className="border-border bg-background flex items-center gap-3 rounded-lg border px-3 py-2"
            >
              <span className="text-muted-foreground w-5 shrink-0 text-right font-mono select-none">
                {k + 1}
              </span>
              <span className="min-w-0 flex-1">{label(id)}</span>
              {moved >= 2 ? (
                <span className="border-primary/40 text-primary shrink-0 rounded-full border px-2 py-0.5 text-xs select-none">
                  moved {moved}
                </span>
              ) : null}
              <span className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7"
                  aria-label={`Move ${label(id)} up`}
                  disabled={k === 0}
                  onClick={() => move(k, -1)}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7"
                  aria-label={`Move ${label(id)} down`}
                  disabled={k === order.length - 1}
                  onClick={() => move(k, 1)}
                >
                  ↓
                </Button>
              </span>
            </li>
          );
        })}
      </ol>

      {reopen ? (
        <div className="space-y-2">
          <p>{MECHANISM_RANK_REOPEN.prompt}</p>
          <textarea
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            rows={4}
            placeholder={MECHANISM_RANK_REOPEN.notesPlaceholder}
            className={cn(
              "border-border bg-background w-full rounded-lg border p-3 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </div>
      ) : null}

      {sealed ? (
        <div className="border-border bg-muted rounded-lg border p-3">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase select-none">
            {copy.sealedLabel}
          </p>
          <p className="mt-1">{copy.sealNote}</p>
        </div>
      ) : (
        <Button type="button" onClick={seal}>
          {copy.sealButton}
        </Button>
      )}
    </section>
  );
}

export function MechanismRank(_: VerificationWidgetProps) {
  void _;
  return <RankWidget copy={MECHANISM_RANK} />;
}

export function MechanismRankReopen(_: VerificationWidgetProps) {
  void _;
  return <RankWidget copy={MECHANISM_RANK_REOPEN} reopen />;
}
