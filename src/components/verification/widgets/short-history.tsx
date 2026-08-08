"use client";

import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HISTORY_COPY as C,
  HISTORY_EVENTS as EVENTS,
  HISTORY_TAGS as TAGS,
  HISTORY_TAG_ORDER,
  HISTORY_YEAR_TICKS as YEAR_TICKS,
  HISTORY_T0 as T0,
  HISTORY_T1 as T1,
  gapLabel,
  historyFrac,
  monthsBetween,
  type HistoryTag,
} from "@/lib/verification/data/short-history";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * "A short history of acceleration" — the sixteen(-plus) milestone timeline
 * ported from the standalone deploy the playground iframed. Two things carry
 * the one idea (capability arrived faster and faster): the sticky minimap on
 * the left drops a dot at each event's TRUE position in time, so recent events
 * pile up at the bottom; and the gap label between consecutive entries shrinks
 * from years to days as you read down.
 *
 * The source page color-codes domains; here a domain is a text tag plus the
 * filter, never a hue alone, so the course palette stays maroon and the
 * encoding survives colour-blindness. Entries expand in place (accordion);
 * clicking a minimap dot opens and scrolls to its entry.
 *
 * Trap: the deploy's data holds seventeen events while its own copy says
 * "Sixteen" — we keep every authored event and derive the count word from the
 * data so the lede can never contradict what is shown.
 */

const COUNT_WORDS: Record<number, string> = {
  15: "Fifteen",
  16: "Sixteen",
  17: "Seventeen",
  18: "Eighteen",
};

const RAIL_H = 460;

function pct(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}

/** Author detail/relevance strings may carry inline <a href> links. */
function renderRich(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /<a\s+href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <a
        key={k++}
        href={m[1]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
        style={{ color: "var(--brand-ink, currentColor)" }}
      >
        {m[2]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function ShortHistory(_: VerificationWidgetProps) {
  void _;
  const [filter, setFilter] = useState<HistoryTag | "all">("all");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const countWord = COUNT_WORDS[EVENTS.length] ?? String(EVENTS.length);
  const lede = C.lede.replace(/^Sixteen/, countWord);

  const matches = (tags: HistoryTag[]) =>
    filter === "all" || tags.includes(filter);

  function toggle(id: string) {
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }
  function jumpTo(id: string) {
    setOpen((s) => new Set(s).add(id));
    rowRefs.current[id]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  return (
    <div className="not-prose my-6">
      {/* stat headlines */}
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {C.stats.map((s) => (
          <div key={s.big} className="border-border bg-card rounded-xl border p-3">
            <div
              className="text-lg font-semibold"
              style={{ color: "var(--brand-ink, currentColor)" }}
            >
              {s.big}
            </div>
            <div className="text-muted-foreground mt-1 text-xs leading-snug">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground mb-3 text-sm">{lede}</p>

      {/* domain filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {HISTORY_TAG_ORDER.map((t) => (
          <FilterChip
            key={t}
            active={filter === t}
            onClick={() => setFilter(t)}
          >
            {TAGS[t].filter}
          </FilterChip>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[3.5rem_1fr]">
        {/* minimap rail — true-time positions; sticky so it stays in view */}
        <div className="hidden lg:block">
          <div
            className="sticky top-20"
            style={{ height: RAIL_H }}
            aria-hidden
          >
            <div className="relative h-full">
              {/* the rail line */}
              <div className="bg-border absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" />
              {/* year ticks */}
              {YEAR_TICKS.map((y) => {
                const f = (y - T0) / (T1 - T0);
                return (
                  <div
                    key={y}
                    className="text-muted-foreground absolute right-0 text-[10px] tabular-nums"
                    style={{ top: pct(f), transform: "translateY(-50%)" }}
                  >
                    &rsquo;{String(y).slice(2)}
                  </div>
                );
              })}
              {/* event dots */}
              {EVENTS.map((ev) => {
                const on = matches(ev.tags);
                const isOpen = open.has(ev.id);
                return (
                  <button
                    key={ev.id}
                    type="button"
                    aria-hidden
                    tabIndex={-1}
                    title={`${ev.date} · ${ev.title}`}
                    onClick={() => on && jumpTo(ev.id)}
                    className={cn(
                      "absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors",
                      on
                        ? "border-primary bg-primary hover:bg-primary/70 cursor-pointer"
                        : "border-border bg-card",
                      isOpen && "ring-foreground size-3 ring-2",
                    )}
                    style={{ top: pct(historyFrac(ev)) }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* entries */}
        <div>
          {EVENTS.map((ev, i) => {
            const on = matches(ev.tags);
            const isOpen = open.has(ev.id);
            const gap = i > 0 ? monthsBetween(EVENTS[i - 1], ev) : null;
            return (
              <div
                key={ev.id}
                ref={(el) => {
                  rowRefs.current[ev.id] = el;
                }}
              >
                {gap !== null && (
                  <div className="text-muted-foreground flex items-center gap-2 py-1.5 pl-1 text-[11px]">
                    <span className="bg-border h-px w-4" />
                    {gapLabel(gap)}
                  </div>
                )}
                <div
                  className={cn(
                    "border-border bg-card rounded-xl border transition-opacity",
                    !on && "opacity-40",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(ev.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-3 p-3 text-left"
                  >
                    <ChevronRight
                      className={cn(
                        "text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform",
                        isOpen && "rotate-90",
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span
                          className="text-xs font-semibold tabular-nums"
                          style={{ color: "var(--brand-ink, currentColor)" }}
                        >
                          {ev.date}
                        </span>
                        {ev.tags.map((t) => (
                          <span
                            key={t}
                            className="border-border text-muted-foreground rounded border px-1.5 py-px text-[10px]"
                          >
                            {TAGS[t].label}
                          </span>
                        ))}
                      </div>
                      <h4 className="mt-1 text-sm font-semibold">{ev.title}</h4>
                      <p className="text-muted-foreground mt-0.5 text-sm">
                        {ev.summary}
                      </p>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="space-y-3 px-3 pb-3 pl-10 text-sm">
                      <p>{renderRich(ev.detail)}</p>
                      <p className="border-border border-t pt-2">
                        <span className="text-muted-foreground mr-1 text-[11px] tracking-[0.08em] uppercase">
                          Why it matters
                        </span>
                        {renderRich(ev.relevance)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors select-none",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
