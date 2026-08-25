"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Minus, Plus, X } from "lucide-react";
import { ReadingCard } from "@/components/mdx/reader/reading-card";
import { cn } from "@/lib/utils";
import {
  BUCKET_ORDER,
  BUCKETS,
  CMAP,
  COUNTRIES,
  type BucketKey,
  FLOW,
  MAP_COPY as C,
  MAP_VIEWBOX,
  ROLE_ORDER,
  ROLES,
  shortName,
  WORLD,
} from "@/lib/verification/data/interactive-map";
import type { VerificationWidgetProps } from "../kit/types";

type FilterSource = "key" | string | null;

type ViewBox = { x: number; y: number; w: number; h: number };

type State = {
  filter: BucketKey | null;
  filterSource: FilterSource;
  selected: string | null;
  vb: ViewBox;
};

const BASE: ViewBox = { ...MAP_VIEWBOX };

type Action =
  | { type: "toggleFilter"; bucket: BucketKey; source: FilterSource }
  | { type: "clearFilter" }
  | { type: "select"; id: string }
  | { type: "clearSelection" }
  | { type: "gotoCountry"; id: string }
  | { type: "setVb"; vb: ViewBox }
  | { type: "resetVb" }
  | { type: "escape" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "toggleFilter":
      if (s.filter === a.bucket && s.filterSource === (a.source ?? "key"))
        return { ...s, filter: null, filterSource: null };
      return {
        ...s,
        filter: a.bucket,
        filterSource: a.source ?? "key",
        selected: null,
      };
    case "clearFilter":
      return { ...s, filter: null, filterSource: null };
    case "select":
      return {
        ...s,
        selected: s.selected === a.id ? null : a.id,
        filter: null,
        filterSource: null,
      };
    case "clearSelection":
      return { ...s, selected: null, filter: null, filterSource: null };
    case "gotoCountry":
      return { ...s, selected: a.id, filter: null, filterSource: null };
    case "setVb":
      return { ...s, vb: a.vb };
    case "resetVb":
      return { ...s, vb: { ...BASE } };
    case "escape":
      return { ...s, selected: null, filter: null, filterSource: null };
    default:
      return s;
  }
}

const INITIAL: State = {
  filter: null,
  filterSource: null,
  selected: null,
  vb: { ...BASE },
};

function clampVB(vb: ViewBox): ViewBox {
  const w = Math.min(BASE.w, Math.max(BASE.w / 9, vb.w));
  const h = w * (BASE.h / BASE.w);
  let x = Math.min(BASE.x + BASE.w - w * 0.4, Math.max(BASE.x - w * 0.6, vb.x));
  x = Math.min(BASE.w - w * 0.35, Math.max(-w * 0.15, x));
  const y = Math.min(BASE.h - h * 0.35, Math.max(-h * 0.15, vb.y));
  return { x, y, w, h };
}

function zoomVB(
  vb: ViewBox,
  factor: number,
  px: number,
  py: number,
  rw: number,
  rh: number
): ViewBox {
  const scale = Math.min(rw / vb.w, rh / vb.h);
  const offx = (rw - vb.w * scale) / 2;
  const offy = (rh - vb.h * scale) / 2;
  const sx = vb.x + (px - offx) / scale;
  const sy = vb.y + (py - offy) / scale;
  const nw = vb.w / factor;
  return clampVB({
    x: sx - (sx - vb.x) / factor,
    y: sy - (sy - vb.y) / factor,
    w: nw,
    h: vb.h,
  });
}

export function InteractiveMap(_props: VerificationWidgetProps) {
  void _props;
  const [s, dispatch] = useReducer(reducer, INITIAL);
  const [hintOpen, setHintOpen] = useState(true);
  const [tip, setTip] = useState<{
    id: string;
    x: number;
    y: number;
    rw: number;
    rh: number;
  } | null>(null);

  // The floating card is a hover instrument, so it exists only where there is
  // a hover. On touch the tap pins instead, and the detail panel under the map
  // carries strictly more than this card ever did.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const read = () => setCanHover(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  const tipRef = useRef<HTMLDivElement | null>(null);
  const [tipSize, setTipSize] = useState({ w: 256, h: 160 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  // What the pointer went down on. The click handler cannot read it off the
  // event: the drag sets pointer capture on the <svg>, and a captured pointer
  // retargets the compatibility click to the capturing element, so every
  // e.target was the <svg> itself and every click cleared the selection.
  const downIdRef = useRef<string | null>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    moved: boolean;
    pid: number;
  } | null>(null);
  const panMovedRef = useRef(false);

  const zoom = s.vb.w > 0 ? BASE.w / s.vb.w : 1;

  const dimmed = useMemo(() => {
    const set = new Set<string>();
    if (s.filter) {
      for (const c of COUNTRIES)
        if (!c.buckets.includes(s.filter)) set.add(c.id);
    }
    return set;
  }, [s.filter]);

  const [preview, setPreview] = useState<BucketKey | null>(null);
  const previewSet = useMemo(() => {
    if (s.filter || !preview) return null;
    const set = new Set<string>();
    for (const c of COUNTRIES) if (!c.buckets.includes(preview)) set.add(c.id);
    return set;
  }, [preview, s.filter]);

  const applyZoom = useCallback(
    (factor: number, px: number, py: number) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      dispatch({
        type: "setVb",
        vb: zoomVB(s.vb, factor, px, py, r.width || 1, r.height || 1),
      });
    },
    [s.vb]
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      applyZoom(
        e.deltaY < 0 ? 1.18 : 1 / 1.18,
        e.clientX - r.left,
        e.clientY - r.top
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    downIdRef.current = (e.target as Element).getAttribute?.("data-id") ?? null;
    panMovedRef.current = false;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      vx: s.vb.x,
      vy: s.vb.y,
      moved: false,
      pid: e.pointerId,
    };
    svgRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d || d.pid !== e.pointerId) return;
    const el = svgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const scale =
      Math.min((r.width || 1) / s.vb.w, (r.height || 1) / s.vb.h) || 1;
    const dx = (e.clientX - d.x) / scale;
    const dy = (e.clientY - d.y) / scale;
    if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 4)
      d.moved = true;
    dispatch({
      type: "setVb",
      vb: clampVB({ ...s.vb, x: d.vx - dx, y: d.vy - dy }),
    });
  };
  const endPan = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (d && d.pid === e.pointerId) {
      panMovedRef.current = d.moved;
      dragRef.current = null;
    }
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
    }
  };

  const zoomButton = (factor: number) => {
    const el = svgRef.current;
    const r = el?.getBoundingClientRect();
    applyZoom(factor, (r?.width ?? 2) / 2, (r?.height ?? 2) / 2);
  };

  const onCountryClick = (id: string | null) => {
    if (panMovedRef.current) {
      panMovedRef.current = false;
      return;
    }
    if (id && CMAP[id]) dispatch({ type: "select", id });
    else dispatch({ type: "clearSelection" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") dispatch({ type: "escape" });
  };

  const onSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!canHover) return;
    const target = e.target as Element;
    const st = stageRef.current;
    if (!st) return;
    const r = st.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const id = target.getAttribute?.("data-id") ?? null;
    if (id && CMAP[id])
      setTip({ id, x, y, rw: st.clientWidth, rh: st.clientHeight });
    else setTip(null);
  };

  const strokeW = Math.max(0.18, 0.55 / zoom);
  const fontSize = Math.max(3.8, 12 / zoom);
  const leaderW = Math.max(0.18, 0.5 / zoom);
  const hubR = Math.max(1.6, 3.4 / zoom);
  const hubStroke = Math.max(0.3, 0.8 / zoom);

  const tipCountry = tip ? CMAP[tip.id] : null;

  // Measured, not assumed. The height was hard-coded at 120 and the real cards
  // run 240-340, so a card raised in the lower half of the stage was placed
  // with a budget it could not keep and the stage's overflow-hidden cut the
  // sentence off mid-clause.
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setTipSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
  }, [tip?.id]);

  return (
    <div
      className="not-prose my-6"
      role="application"
      aria-label="The compute supply chain"
      onKeyDown={onKeyDown}
    >
      <div>
        <dl className="border-border mb-4 grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-2 border-b pb-4">
          {C.stats.map((st) => (
            <Fragment key={st.l}>
              <dt className="text-right text-xl font-bold tracking-tight whitespace-nowrap tabular-nums">
                {st.n}
              </dt>
              <dd className="text-muted-foreground text-xs">{st.l}</dd>
            </Fragment>
          ))}
        </dl>

        <div className="grid gap-4">
          <div className="min-w-0">
            <div
              ref={stageRef}
              className="border-border bg-muted/30 relative overflow-hidden rounded-lg border"
            >
              {hintOpen && (
                <div className="text-muted-foreground border-border bg-card absolute top-3 left-3 z-10 flex max-w-[calc(100%-5rem)] items-start gap-2 rounded-md border px-3 py-2 text-xs">
                  <span>{canHover ? C.hint : C.hintTouch}</span>
                  <button
                    type="button"
                    aria-label="Dismiss hint"
                    onClick={() => setHintOpen(false)}
                    className="text-muted-foreground hover:text-foreground -mt-0.5"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
              )}

              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => zoomButton(1.5)}
                  className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 flex size-8 items-center justify-center rounded-md border transition-colors"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => zoomButton(1 / 1.5)}
                  className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 flex size-8 items-center justify-center rounded-md border transition-colors"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Reset view"
                  onClick={() => dispatch({ type: "resetVb" })}
                  className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 flex size-8 items-center justify-center rounded-md border text-3xs font-medium transition-colors"
                >
                  Fit
                </button>
              </div>

              <svg
                ref={svgRef}
                viewBox={`${s.vb.x} ${s.vb.y} ${s.vb.w} ${s.vb.h}`}
                preserveAspectRatio="xMidYMid meet"
                aria-label="World map of the AI compute supply chain"
                className="block h-[clamp(320px,52vh,520px)] w-full touch-none cursor-grab active:cursor-grabbing"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endPan}
                onPointerCancel={endPan}
                onMouseMove={onSvgMouseMove}
                onMouseLeave={() => setTip(null)}
                onClick={(e) => {
                  const id =
                    (e.target as Element).getAttribute?.("data-id") ??
                    downIdRef.current;
                  onCountryClick(id ?? null);
                }}
              >
                <rect
                  x={-2000}
                  y={-2000}
                  width={5000}
                  height={5000}
                  fill="transparent"
                />
                <g>
                  {WORLD.map((f, fi) => {
                    const fid = f.id ?? "";
                    const c = CMAP[fid];
                    const featured = !!c && !c.hub;
                    const isDim = dimmed.has(fid);
                    const isPreview = !!previewSet?.has(fid);
                    const selected = s.selected === fid;
                    let fill = "var(--muted)";
                    let fillOpacity: number | undefined;
                    if (featured && c) {
                      fill = BUCKETS[c.primary].color;
                      fillOpacity = 0.92;
                    }
                    if (isDim) {
                      fill = "var(--muted)";
                      fillOpacity = 1;
                    }
                    return (
                      <path
                        key={f.id ?? `bg-${fi}`}
                        d={f.d}
                        data-id={f.id}
                        fill={fill}
                        fillOpacity={fillOpacity}
                        stroke={selected ? "var(--foreground)" : "var(--card)"}
                        strokeWidth={selected ? strokeW * 2.4 : strokeW}
                        strokeLinejoin="round"
                        className={cn(
                          "transition-[fill,opacity] duration-200",
                          featured && "cursor-pointer"
                        )}
                        style={{ opacity: isPreview ? 0.35 : undefined }}
                      />
                    );
                  })}
                </g>

                <g>
                  {COUNTRIES.filter((c) => c.hub).map((c) => {
                    const isDim = dimmed.has(c.id);
                    const isPreview = !!previewSet?.has(c.id);
                    return (
                      <circle
                        key={c.id}
                        cx={c.hub![0]}
                        cy={c.hub![1]}
                        r={hubR}
                        data-id={c.id}
                        fill={isDim ? "var(--muted)" : BUCKETS[c.primary].color}
                        stroke="var(--card)"
                        strokeWidth={hubStroke}
                        className="cursor-pointer transition-opacity duration-200"
                        style={{ opacity: isPreview ? 0.35 : undefined }}
                      />
                    );
                  })}
                </g>

                <g aria-hidden>
                  {COUNTRIES.map((c) => {
                    if (!c.label.leader) return null;
                    const tail =
                      c.label.anchor === "end"
                        ? c.label.x + 2
                        : c.label.anchor === "start"
                        ? c.label.x - 2
                        : c.label.x;
                    return (
                      <polyline
                        key={`l-${c.id}`}
                        points={`${c.label.leader[0]},${
                          c.label.leader[1]
                        } ${tail},${c.label.y - 3}`}
                        fill="none"
                        stroke="var(--muted-foreground)"
                        strokeWidth={leaderW}
                      />
                    );
                  })}
                  {COUNTRIES.map((c) => (
                    <text
                      key={`t-${c.id}`}
                      x={c.label.x}
                      y={c.label.y}
                      textAnchor={c.label.anchor}
                      fontSize={fontSize}
                      fill="var(--foreground)"
                      style={{
                        paintOrder: "stroke",
                        stroke: "var(--background)",
                        strokeLinejoin: "round",
                        letterSpacing: "0.04em",
                        pointerEvents: "none",
                      }}
                    >
                      {shortName(c.name)}
                    </text>
                  ))}
                </g>
              </svg>

              {tip && tipCountry && (
                <div
                  ref={tipRef}
                  role="tooltip"
                  className="border-border bg-card shadow-soft pointer-events-none absolute z-20 w-64 rounded-lg border p-3"
                  style={tipPos(tip, tipSize)}
                >
                  <p className="text-sm font-semibold">{tipCountry.name}</p>
                  <div className="mt-1.5 mb-1.5 flex flex-wrap gap-1">
                    {tipCountry.buckets.map((bk) => (
                      <BucketChip key={bk} bk={bk} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tipCountry.verif}
                  </p>
                  <p className="text-muted-foreground/80 mt-1.5 text-4xs">
                    Click to pin
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[13px] font-semibold">{C.flowTitle}</span>
                <span className="text-muted-foreground text-3xs">
                  {C.flowNote}
                </span>
              </div>
              <div className="flex flex-wrap items-stretch gap-1">
                {FLOW.map((st, i) => {
                  const active =
                    s.filter === st.bucket && s.filterSource === st.key;
                  return (
                    <Fragment key={st.key}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          dispatch({
                            type: "toggleFilter",
                            bucket: st.bucket,
                            source: st.key,
                          })
                        }
                        onMouseEnter={() => setPreview(st.bucket)}
                        onMouseLeave={() => setPreview(null)}
                        className={cn(
                          "min-w-[104px] flex-1 rounded-md border px-2.5 py-2 text-left transition-colors",
                          active
                            ? "bg-primary border-primary"
                            : "border-border bg-muted/40 hover:bg-muted"
                        )}
                      >
                        <span
                          className="mb-1.5 block h-[3px] w-4 rounded-sm"
                          style={{
                            background: active
                              ? "var(--primary-foreground)"
                              : BUCKETS[st.bucket].color,
                          }}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            "block text-3xs leading-tight font-semibold",
                            active
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {st.name}
                        </span>
                      </button>
                      {i < FLOW.length - 1 && (
                        <span
                          aria-hidden
                          className="text-muted-foreground/60 flex-none self-center text-xs"
                        >
                          ›
                        </span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
              <div className="text-muted-foreground mt-2 flex items-center justify-between px-1 text-4xs">
                <span>{C.flowGradLeft}</span>
                <span
                  aria-hidden
                  className="mx-3 h-px flex-1 self-center"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--muted-foreground),var(--border))",
                  }}
                />
                <span>{C.flowGradRight}</span>
              </div>
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-4">
            <div>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-semibold">{C.keyLabel}</span>
                <span className="text-muted-foreground text-3xs">
                  {C.keyAction}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BUCKET_ORDER.map((bk) => {
                  const b = BUCKETS[bk];
                  const n = COUNTRIES.filter((c) =>
                    c.buckets.includes(bk)
                  ).length;
                  const active = s.filter === bk && s.filterSource === "key";
                  return (
                    <button
                      key={bk}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        dispatch({
                          type: "toggleFilter",
                          bucket: bk,
                          source: "key",
                        })
                      }
                      onMouseEnter={() => setPreview(bk)}
                      onMouseLeave={() => setPreview(null)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors",
                        active
                          ? "border-foreground bg-muted"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      <span
                        className="ring-foreground/20 size-3 flex-none rounded-[3px] ring-1 ring-inset"
                        style={{ background: b.color }}
                        aria-hidden
                      />
                      <span className="text-xs font-medium">{b.name}</span>
                      <span className="text-muted-foreground text-3xs tabular-nums">
                        {n} {n === 1 ? "country" : "countries"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {C.keyNote}
              </p>
            </div>

            <ReadingCard
              id="verification-interactive-map-chip-explorer"
              href={C.chipHref}
              title={C.chipTitle}
              optional
            >
              {C.chipSub}
            </ReadingCard>

            <div className="border-border bg-muted/30 min-h-32 rounded-lg border p-3.5">
              <DetailCard state={s} dispatch={dispatch} />
            </div>

            <div className="border-border border-t pt-3">
              <p className="mb-2 text-[13px] font-semibold">{C.rolesLabel}</p>
              <div className="flex flex-wrap gap-1">
                {ROLE_ORDER.map((r) => (
                  <span
                    key={r}
                    className="border-border bg-muted/60 text-muted-foreground rounded-md border px-2 py-0.5 text-4xs"
                  >
                    {ROLES[r]}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {C.rolesNote}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * Place the hover card beside the cursor and keep it inside the stage.
 *
 * `size` is measured from the rendered card. Flip to the other side of the
 * cursor when the preferred side would overrun, then clamp: a card that is
 * taller than the room below is pinned to the top edge rather than pushed out
 * through the bottom of a box that clips.
 */
function tipPos(
  tip: { x: number; y: number; rw: number; rh: number },
  size: { w: number; h: number }
): React.CSSProperties {
  const pad = 8;
  const { rw, rh } = tip;

  let lx = tip.x + 16;
  if (rw && lx + size.w > rw - pad) lx = tip.x - size.w - 16;
  if (rw) lx = Math.min(Math.max(pad, lx), Math.max(pad, rw - size.w - pad));

  let ly = tip.y + 14;
  if (rh && ly + size.h > rh - pad) ly = tip.y - size.h - 12;
  if (rh) ly = Math.min(Math.max(pad, ly), Math.max(pad, rh - size.h - pad));

  return { left: Math.max(pad, lx), top: Math.max(pad, ly) };
}

function BucketChip({ bk }: { bk: BucketKey }) {
  const b = BUCKETS[bk];
  return (
    <span className="border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-4xs">
      <span
        className="ring-foreground/20 size-2 flex-none rounded-[2px] ring-1 ring-inset"
        style={{ background: b.color }}
        aria-hidden
      />
      {b.name}
    </span>
  );
}

function DetailCard({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  const s = state;

  if (s.filter) {
    const b = BUCKETS[s.filter];
    const members = COUNTRIES.filter((c) => c.buckets.includes(s.filter!));
    const st =
      s.filterSource && s.filterSource !== "key"
        ? FLOW.find((f) => f.key === s.filterSource)
        : null;
    return (
      <div>
        <button
          type="button"
          aria-label="Clear layer filter"
          onClick={() => dispatch({ type: "clearFilter" })}
          className="text-muted-foreground hover:text-foreground float-right -mt-1 -mr-1"
        >
          <X className="size-4" aria-hidden />
        </button>
        <p className="text-muted-foreground text-3xs font-medium">
          {st ? "Pipeline stage" : "Supply chain layer"}
        </p>
        <h4 className="mt-1 flex items-center gap-2 text-base font-semibold">
          <span
            className="ring-foreground/20 size-2.5 flex-none rounded-[2px] ring-1 ring-inset"
            style={{ background: b.color }}
            aria-hidden
          />
          {st ? st.name : b.name}
        </h4>
        <p className="mt-1.5 mb-2 text-lg font-bold tracking-tight">{b.stat}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {st ? `${st.stat} ` : ""}
          {b.why}
        </p>
        <p className="text-muted-foreground mt-2.5 text-3xs font-medium">
          {C.layerNeed}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {members.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => dispatch({ type: "gotoCountry", id: c.id })}
              className="border-border bg-card hover:border-foreground rounded-md border px-2.5 py-0.5 text-3xs transition-colors"
            >
              {shortName(c.name)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (s.selected) {
    const c = CMAP[s.selected];
    if (!c) return null;
    return (
      <div>
        <button
          type="button"
          aria-label="Close country"
          onClick={() => dispatch({ type: "clearSelection" })}
          className="text-muted-foreground hover:text-foreground float-right -mt-1 -mr-1"
        >
          <X className="size-4" aria-hidden />
        </button>
        <p className="text-muted-foreground text-3xs font-medium">Country</p>
        <h4 className="mt-1 text-base font-semibold">{c.name}</h4>
        <div className="mt-1.5 mb-2 flex flex-wrap gap-1">
          {c.buckets.map((bk) => (
            <BucketChip key={bk} bk={bk} />
          ))}
        </div>
        <ul className="flex flex-col gap-1.5">
          {c.anchors.map((a, i) => (
            <li
              key={i}
              className="text-muted-foreground relative pl-3 text-xs leading-relaxed before:absolute before:top-[7px] before:left-0 before:size-1 before:rounded-full before:bg-current before:opacity-50"
            >
              {a}
            </li>
          ))}
        </ul>
        <div className="border-border mt-2.5 border-t pt-2">
          <p className="text-muted-foreground text-3xs font-medium">
            {C.countryVerifLabel}
          </p>
          <p className="mt-1 text-sm leading-relaxed">{c.verif}</p>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {c.roles.map((r) => (
            <span
              key={r}
              className="border-border bg-muted/60 text-muted-foreground rounded-md border px-2 py-0.5 text-4xs"
            >
              {ROLES[r]}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground text-3xs font-medium">
        {C.startEyebrow}
      </p>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        {C.startBodyA}
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {C.startBodyB}
      </p>
    </div>
  );
}
