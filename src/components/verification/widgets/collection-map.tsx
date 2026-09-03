"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  COLLECTION_COPY as C,
  COLLECTION_DISCIPLINES as DISCIPLINES,
  type CollectionDiscipline,
} from "@/lib/verification/data/collection-map";
import type { VerificationWidgetProps } from "../kit/types";

function Glyph({ id }: { id: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      {id === "osint" && (
        <g {...common}>
          <path d="M4 5h16v14H4z" />
          <path d="M7 9h6M7 12h10M7 15h8" />
        </g>
      )}
      {id === "humint" && (
        <g {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c1.4-3.6 4-5.4 7-5.4s5.6 1.8 7 5.4" />
        </g>
      )}
      {id === "sigint" && (
        <g {...common}>
          <path d="M12 14v6" />
          <circle cx="12" cy="12" r="1.6" />
          <path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" />
          <path d="M5.4 5.4a9.4 9.4 0 0 0 0 13.2M18.6 5.4a9.4 9.4 0 0 1 0 13.2" />
        </g>
      )}
      {id === "cyber" && (
        <g {...common}>
          <rect x="4.5" y="10" width="15" height="9" rx="1.6" />
          <path d="M8.5 10V7.2a3.5 3.5 0 0 1 7 0V10" />
          <path d="M12 13.5v2" />
        </g>
      )}
      {id === "finint" && (
        <g {...common}>
          <rect x="3.5" y="7" width="17" height="10" rx="1.6" />
          <circle cx="12" cy="12" r="2.2" />
          <path d="M6.5 12h.01M17.5 12h.01" />
        </g>
      )}
      {id === "imint" && (
        <g {...common}>
          <path d="M3 12s3.4-5.4 9-5.4S21 12 21 12s-3.4 5.4-9 5.4S3 12 3 12z" />
          <circle cx="12" cy="12" r="2.4" />
        </g>
      )}
      {id === "geoint" && (
        <g {...common}>
          <circle cx="12" cy="12" r="8.4" />
          <path d="M3.6 12h16.8M12 3.6c2.4 2.6 3.6 5.5 3.6 8.4s-1.2 5.8-3.6 8.4c-2.4-2.6-3.6-5.5-3.6-8.4S9.6 6.2 12 3.6z" />
        </g>
      )}
      {id === "masint" && (
        <g {...common}>
          <path d="M3.5 17c2-.2 2.6-5.6 4.6-5.6S10.4 19 12.4 19s2.4-13 4.4-13c1.6 0 2.2 6 3.7 6" />
        </g>
      )}
    </svg>
  );
}

function Tile({
  d,
  open,
  onToggle,
}: {
  d: CollectionDiscipline;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
        "select-none",
        open
          ? "border-ring bg-muted"
          : "border-border hover:bg-muted/60",
      )}
    >
      <span className="text-muted-foreground">
        <Glyph id={d.id} />
      </span>
      <span className="text-xs tracking-wide">{d.abbr}</span>
      <span className="text-muted-foreground text-xs leading-snug">{d.name}</span>
    </button>
  );
}

export function CollectionMap(_: VerificationWidgetProps) {
  void _;
  const [openId, setOpenId] = useState<string | null>(null);
  const open = DISCIPLINES.find((d) => d.id === openId) ?? null;

  const group = (kind: CollectionDiscipline["kind"], label: string) => (
    <div className="space-y-2">
      <p className="text-muted-foreground text-3xs tracking-wide uppercase">
        {label}
      </p>
      <div
        className={cn(
          "grid grid-cols-2 gap-2",
          kind === "literal" ? "sm:grid-cols-5" : "sm:grid-cols-3",
        )}
      >
        {DISCIPLINES.filter((d) => d.kind === kind).map((d) => (
          <Tile
            key={d.id}
            d={d}
            open={openId === d.id}
            onToggle={() => setOpenId(openId === d.id ? null : d.id)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section className="panel">
      <h3 className="text-lg font-semibold">{C.title}</h3>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{C.lede}</p>

      <div className="mt-5 space-y-4">
        {group("literal", C.literal)}
        {group("technical", C.technical)}
      </div>

      {open ? (
        <div className="border-border bg-background mt-5 rounded-lg border p-4">
          <p className="text-xs tracking-wide">{open.abbr}</p>
          <p className="mt-0.5 font-semibold">{open.name}</p>
          <p className="mt-2 text-sm leading-relaxed">{open.what}</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground text-3xs tracking-wide uppercase">
                {C.seenLabel}
              </dt>
              <dd className="mt-0.5 leading-relaxed">{open.seen}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-3xs tracking-wide uppercase">
                {C.limitLabel}
              </dt>
              <dd className="mt-0.5 leading-relaxed">{open.limit}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="text-muted-foreground mt-5 text-sm">{C.legend}</p>
      )}
    </section>
  );
}
