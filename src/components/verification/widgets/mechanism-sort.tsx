"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  COPY,
  LAYERS,
  MECHANISM_SORT_KEY,
  MECHANISMS,
  METRICS,
  deltaText,
  gapOf,
  rungIndex,
  verdictFor,
  type LayerKey,
  type Mechanism,
  type MetricKey,
} from "@/lib/verification/data/mechanism-sort";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * "Place your bets" — the mechanism sort. Rate twelve mechanisms across four
 * metrics and seal the set (2.0); compare the sealed set against the reference
 * map (4.1). One component, a `reveal` prop switches modes. All copy and data
 * live in `src/lib/verification/data/mechanism-sort.ts`; only presentation is
 * here. Learner work only — it feeds no meter and completes nothing.
 *
 * Ratings are five named rungs per metric (value = rung centre, 0.1…0.9); the
 * reference positions stay continuous, so the gap math reads a real distance.
 * Layer hue never carries meaning alone: every dot pairs with a title, and the
 * legend maps each colour to its layer name.
 */

interface SortStore {
  values: Record<string, Partial<Record<MetricKey, number>>>;
  queue: string[];
  sealed: boolean;
  sealedAt: string | null;
}

const emptyStore = (): SortStore => ({
  values: {},
  queue: MECHANISMS.map((m) => m.id),
  sealed: false,
  sealedAt: null,
});

const load = (): SortStore => {
  try {
    const raw = JSON.parse(localStorage.getItem(MECHANISM_SORT_KEY) || "null");
    if (raw && raw.values && Array.isArray(raw.queue)) {
      return {
        values: raw.values,
        queue: raw.queue,
        sealed: !!raw.sealed,
        sealedAt: raw.sealedAt ?? null,
      };
    }
  } catch {
    /* ignore */
  }
  return emptyStore();
};

const save = (s: SortStore) => {
  try {
    localStorage.setItem(MECHANISM_SORT_KEY, JSON.stringify(s));
  } catch {
    /* private mode */
  }
};

/** Fixed palette classes per evidence layer — categorical accents, never a
 *  hue on its own (the legend and each dot's title carry the meaning). */
const LAYER_STYLE: Record<LayerKey, { dot: string; ring: string }> = {
  hardware: { dot: "bg-amber-500", ring: "border-amber-500" },
  cloud: { dot: "bg-sky-500", ring: "border-sky-500" },
  intelligence: { dot: "bg-violet-500", ring: "border-violet-500" },
  human: { dot: "bg-emerald-600", ring: "border-emerald-600" },
  crypto: { dot: "bg-rose-500", ring: "border-rose-500" },
};

const layerName = (k: LayerKey) => LAYERS.find((l) => l.key === k)?.name ?? k;
const mechById = (id: string): Mechanism =>
  MECHANISMS.find((m) => m.id === id) as Mechanism;
const rungValue = (i: number) => (i + 0.5) / 5; // rung centre, 0.1…0.9
const isComplete = (v: Partial<Record<MetricKey, number>>) =>
  METRICS.every((m) => typeof v[m.key] === "number");
const laneStagger = (id: string) =>
  ((MECHANISMS.findIndex((m) => m.id === id) % 5) - 2) * 8; // px

export function MechanismSort(_: VerificationWidgetProps) {
  void _;
  return <SortWidget reveal={false} />;
}

export function MechanismSortReveal(_: VerificationWidgetProps) {
  void _;
  return <SortWidget reveal />;
}

function SortWidget({ reveal }: { reveal: boolean }) {
  const [store, setStore] = useState<SortStore>(emptyStore);
  const [selected, setSelected] = useState<string | null>(null);

  // Mount-time hydration from localStorage; server render is the empty store,
  // so first paint matches signed-out. One deliberate setState in the effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStore(load());
  }, []);

  const commit = (next: SortStore) => {
    setStore(next);
    save(next);
  };

  const ratedCount = MECHANISMS.length - store.queue.length;
  const current = !store.sealed && store.queue.length > 0 ? store.queue[0] : null;

  const setRung = (metric: MetricKey, i: number) => {
    if (!current) return;
    const v = { ...(store.values[current] ?? {}), [metric]: rungValue(i) };
    commit({ ...store, values: { ...store.values, [current]: v } });
  };

  const place = () => {
    if (!current || !isComplete(store.values[current] ?? {})) return;
    commit({ ...store, queue: store.queue.filter((q) => q !== current) });
  };

  const skip = () => {
    if (!current || store.queue.length < 2) return;
    commit({ ...store, queue: [...store.queue.slice(1), current] });
  };

  const revisit = (id: string) => {
    if (store.sealed) return;
    setSelected(null);
    commit({
      ...store,
      queue: store.queue.includes(id) ? store.queue : [id, ...store.queue],
    });
  };

  const seal = () => {
    if (store.queue.length !== 0) return;
    const sealedAt = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    commit({ ...store, sealed: true, sealedAt });
  };

  const placedIds = MECHANISMS.filter((m) => !store.queue.includes(m.id)).map(
    (m) => m.id,
  );

  // ---- reveal mode, but nothing sealed yet: a supported empty state ----
  if (reveal && !store.sealed) {
    return (
      <Shell title="Reference map">
        <p className="text-muted-foreground">
          {COPY.revealFraming}
        </p>
        <div className="border-border bg-muted rounded-lg border p-3">
          You have not sealed a set yet. Go to{" "}
          <span className="font-medium">2.0 — Place your bets</span>, rate the
          twelve mechanisms and seal them, then come back here to see where your
          intuitions held.
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={reveal ? "Reference map" : "Place your bets"}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted-foreground">
          {reveal ? COPY.revealFraming : COPY.framing}
        </p>
        <span className="text-muted-foreground shrink-0 font-mono text-[11px] tracking-[0.12em] uppercase select-none">
          {reveal ? "Comparing" : store.sealed ? "Sealed" : `${ratedCount} / 12`}
        </span>
      </div>

      {!reveal && <MetricGuide />}

      {/* Rater — one card at a time, 2.0 only, until all placed */}
      {current && (
        <Rater
          key={current}
          mech={mechById(current)}
          values={store.values[current] ?? {}}
          index={ratedCount + 1}
          canSkip={store.queue.length > 1}
          onRung={setRung}
          onPlace={place}
          onSkip={skip}
        />
      )}
      {!reveal && !current && !store.sealed && (
        <p className="text-muted-foreground border-border rounded-lg border border-dashed p-3">
          {COPY.raterDone}
        </p>
      )}

      {/* Lanes */}
      {placedIds.length > 0 && (
        <Lanes
          reveal={reveal}
          placedIds={placedIds}
          values={store.values}
          selected={selected}
          onSelect={setSelected}
        />
      )}

      <Legend />

      {/* Selected-mechanism detail */}
      {selected && (
        <Detail
          mech={mechById(selected)}
          values={store.values[selected] ?? {}}
          reveal={reveal}
          sealed={store.sealed}
          onRevisit={() => revisit(selected)}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Reveal: gaps ranked by disagreement */}
      {reveal && <Gaps values={store.values} selected={selected} onSelect={setSelected} />}

      {/* Seal (2.0 only) */}
      {!reveal &&
        (store.sealed ? (
          <div className="border-border bg-muted rounded-lg border p-3">
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase select-none">
              Sealed {store.sealedAt}
            </p>
            <p className="mt-1">
              No key, and no score. This set exists to be revised — 4.1 lays it
              over the reference map and asks which metric you disagree on.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Button type="button" onClick={seal} disabled={store.queue.length !== 0}>
              Seal my ratings
            </Button>
            <p className="text-muted-foreground text-xs select-none">
              {store.queue.length === 0 ? COPY.sealNoteReady : COPY.sealNotePending}
            </p>
          </div>
        ))}
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="not-prose border-border bg-card space-y-4 rounded-xl border p-5 text-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function MetricGuide() {
  return (
    <details className="border-border rounded-lg border">
      <summary className="text-muted-foreground cursor-pointer px-3 py-2 text-xs font-medium tracking-[0.1em] uppercase select-none">
        How the four metrics are defined
      </summary>
      <div className="grid gap-3 p-3 pt-0 sm:grid-cols-2">
        {METRICS.map((m) => (
          <div key={m.key} className="border-border rounded-lg border p-3">
            <p className="font-medium">{m.name}</p>
            <p className="text-muted-foreground mt-1">{m.gist}</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>
                <span className="text-muted-foreground font-mono">Low</span>{" "}
                {m.anchorLow}
              </p>
              <p>
                <span className="text-muted-foreground font-mono">High</span>{" "}
                {m.anchorHigh}
              </p>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

function Rater({
  mech,
  values,
  index,
  canSkip,
  onRung,
  onPlace,
  onSkip,
}: {
  mech: Mechanism;
  values: Partial<Record<MetricKey, number>>;
  index: number;
  canSkip: boolean;
  onRung: (m: MetricKey, i: number) => void;
  onPlace: () => void;
  onSkip: () => void;
}) {
  const complete = isComplete(values);
  return (
    <div className="border-border bg-background rounded-lg border p-4">
      <div className="flex items-center gap-2 text-xs">
        <span className={cn("size-2.5 rounded-full", LAYER_STYLE[mech.layer].dot)} aria-hidden />
        <span className="text-muted-foreground">
          {layerName(mech.layer)} · card {index} of {MECHANISMS.length}
        </span>
        <span className="flex-1" />
        {canSkip && (
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={onSkip}>
            Skip for now
          </Button>
        )}
      </div>
      <h4 className="mt-2 text-base font-semibold">{mech.title}</h4>
      <p className="text-muted-foreground mt-1">{mech.summary}</p>

      <div className="mt-4 space-y-3">
        {METRICS.map((metric) => {
          const val = values[metric.key];
          const sel = typeof val === "number" ? rungIndex(val) : -1;
          return (
            <div key={metric.key}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{metric.name}</span>
                <span className="text-muted-foreground text-xs">
                  {sel >= 0 ? metric.rungs[sel] : "rate all four to place this card"}
                </span>
              </div>
              <div
                role="radiogroup"
                aria-label={metric.name}
                className="mt-1.5 grid grid-cols-5 gap-1"
              >
                {metric.rungs.map((rung, i) => (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={sel === i}
                    onClick={() => onRung(metric.key, i)}
                    className={cn(
                      "rounded-md border px-1 py-1.5 text-center text-[11px] leading-tight transition-colors select-none",
                      sel === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-ring",
                    )}
                  >
                    {rung}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="button" onClick={onPlace} disabled={!complete}>
          Place on the lanes
        </Button>
        <span className="text-muted-foreground text-xs">
          {complete ? "All four set." : "Rate all four metrics to place this card."}
        </span>
      </div>
    </div>
  );
}

function Lanes({
  reveal,
  placedIds,
  values,
  selected,
  onSelect,
}: {
  reveal: boolean;
  placedIds: string[];
  values: Record<string, Partial<Record<MetricKey, number>>>;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase select-none">
        Your ranking, metric by metric
      </p>
      {METRICS.map((metric) => (
        <div key={metric.key}>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium">{metric.name}</span>
            <span className="text-muted-foreground">
              {metric.rungs[0]} → {metric.rungs[4]}
            </span>
          </div>
          <div className="border-border relative mt-1 h-14 rounded-md border">
            {/* centre rail */}
            <div className="bg-border absolute inset-x-3 top-1/2 h-px -translate-y-1/2" aria-hidden />
            {placedIds.map((id) => {
              const m = mechById(id);
              const v = values[id]?.[metric.key];
              if (typeof v !== "number") return null;
              const dim = reveal && selected != null && selected !== id;
              const off = laneStagger(id);
              const style = LAYER_STYLE[m.layer];
              return (
                <div key={id}>
                  {reveal && (
                    <>
                      {/* link from your value to the reference */}
                      <span
                        aria-hidden
                        className={cn("absolute h-0.5 rounded-full", style.dot, dim && "opacity-25")}
                        style={{
                          left: `${Math.min(v, m.ref[metric.key]) * 100}%`,
                          width: `${Math.abs(v - m.ref[metric.key]) * 100}%`,
                          top: `calc(50% + ${off}px)`,
                        }}
                      />
                      {/* reference ring */}
                      <button
                        type="button"
                        aria-label={`${m.title} — reference`}
                        onClick={() => onSelect(id)}
                        className={cn(
                          "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-card",
                          style.ring,
                          dim && "opacity-25",
                        )}
                        style={{ left: `${m.ref[metric.key] * 100}%`, top: `calc(50% + ${off}px)` }}
                      />
                    </>
                  )}
                  {/* your call */}
                  <button
                    type="button"
                    aria-label={`${m.title} — ${Math.round(v * 100)}`}
                    title={`${m.title} — ${Math.round(v * 100)}`}
                    onClick={() => onSelect(id)}
                    className={cn(
                      "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                      style.dot,
                      dim && "opacity-25",
                      selected === id && "ring-foreground ring-2 ring-offset-1",
                    )}
                    style={{ left: `${v * 100}%`, top: `calc(50% + ${off}px)` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs select-none">
      {LAYERS.map((l) => (
        <span key={l.key} className="inline-flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", LAYER_STYLE[l.key].dot)} aria-hidden />
          {l.name}
        </span>
      ))}
    </div>
  );
}

function Detail({
  mech,
  values,
  reveal,
  sealed,
  onRevisit,
  onClose,
}: {
  mech: Mechanism;
  values: Partial<Record<MetricKey, number>>;
  reveal: boolean;
  sealed: boolean;
  onRevisit: () => void;
  onClose: () => void;
}) {
  const complete = isComplete(values);
  const v = values as Record<MetricKey, number>;
  const verdict = reveal && complete ? verdictFor(gapOf(v, mech.ref)) : null;
  return (
    <div className="border-border bg-background space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          {verdict && (
            <span className="text-muted-foreground font-mono text-[11px] tracking-[0.13em] uppercase select-none">
              {verdict.label} · gap {Math.round(gapOf(v, mech.ref) * 100)}
            </span>
          )}
          <h4 className="font-semibold">{mech.title}</h4>
        </div>
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-2">
        {METRICS.map((metric) => {
          const you = values[metric.key];
          if (typeof you !== "number") return null;
          const rv = mech.ref[metric.key];
          const style = LAYER_STYLE[mech.layer];
          return (
            <div key={metric.key}>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium">{metric.name}</span>
                <span className="text-muted-foreground">
                  {reveal ? (
                    <>
                      you <strong className="text-foreground">{Math.round(you * 100)}</strong> · ref{" "}
                      <strong className="text-foreground">{Math.round(rv * 100)}</strong>
                    </>
                  ) : (
                    <>
                      <strong className="text-foreground">{Math.round(you * 100)}</strong> ·{" "}
                      {metric.rungs[rungIndex(you)]}
                    </>
                  )}
                </span>
              </div>
              <div className="border-border relative mt-1 h-4 rounded bg-muted">
                {reveal && (
                  <>
                    <span
                      aria-hidden
                      className={cn("absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full", style.dot)}
                      style={{
                        left: `${Math.min(you, rv) * 100}%`,
                        width: `${Math.abs(you - rv) * 100}%`,
                      }}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-card",
                        style.ring,
                      )}
                      style={{ left: `${rv * 100}%` }}
                    />
                  </>
                )}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                    style.dot,
                  )}
                  style={{ left: `${you * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {reveal && complete ? (
        <>
          <p className="text-muted-foreground">{deltaText(v, mech.ref)}</p>
          <p>{mech.expl}</p>
          <div>
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase select-none">
              Sources
            </p>
            <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-xs">
              {mech.sources.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <p className="text-muted-foreground">{mech.summary}</p>
          {!sealed && (
            <Button type="button" variant="outline" size="sm" onClick={onRevisit}>
              Revisit this card
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function Gaps({
  values,
  selected,
  onSelect,
}: {
  values: Record<string, Partial<Record<MetricKey, number>>>;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const ranked = useMemo(
    () =>
      MECHANISMS.slice()
        .filter((m) => isComplete(values[m.id] ?? {}))
        .map((m) => ({ m, d: gapOf(values[m.id] as Record<MetricKey, number>, m.ref) }))
        .sort((a, b) => b.d - a.d),
    [values],
  );
  if (!ranked.length) return null;
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase select-none">
        Your calls, ranked by gap
      </p>
      <p className="text-muted-foreground text-xs">{COPY.gapsNote}</p>
      <ul className="space-y-1">
        {ranked.map(({ m, d }) => {
          const verdict = verdictFor(d);
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                className={cn(
                  "border-border flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-left transition-colors select-none",
                  selected === m.id ? "bg-muted" : "hover:bg-muted/60",
                )}
              >
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", LAYER_STYLE[m.layer].dot)}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{m.short}</span>
                <span className="text-muted-foreground shrink-0 font-mono text-[11px] tracking-[0.1em] uppercase">
                  {verdict.label} · {Math.round(d * 100)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
