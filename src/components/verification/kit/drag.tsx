"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface DragState {
  armedId: string | null;
  draggingId: string | null;
  draggingLabel: string | null;
  overZone: string | null;
}

interface DragCtx extends DragState {
  onDrop: (itemId: string, zoneId: string) => void;
  registerLabel: (id: string, label: string) => void;
  arm: (id: string) => void;
  toggleArm: (id: string) => void;
  disarm: () => void;
  beginPointerDrag: (id: string, e: PointerEvent, node: HTMLElement) => void;
  setOverZone: (zoneId: string | null) => void;
  dropOn: (zoneId: string) => void;
  announce: (msg: string) => void;
}

const Ctx = createContext<DragCtx | null>(null);

function useDragCtx(): DragCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Draggable/DropZone must be inside <DragProvider>");
  return ctx;
}

export function DragProvider({
  onDrop,
  children,
  className,
}: {
  onDrop: (itemId: string, zoneId: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const [state, setState] = useState<DragState>({
    armedId: null,
    draggingId: null,
    draggingLabel: null,
    overZone: null,
  });
  const labels = useRef<Map<string, string>>(new Map());
  const ghost = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: string;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    grabX: number;
    grabY: number;
    width: number;
    height: number;
    node: HTMLElement;
    active: boolean;
    pointerId: number;
  } | null>(null);

  const announce = useCallback((msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  }, []);

  const registerLabel = useCallback((id: string, label: string) => {
    labels.current.set(id, label);
  }, []);

  const arm = useCallback(
    (id: string) => {
      setState((s) => ({ ...s, armedId: id }));
      announce(`Picked up ${labels.current.get(id) ?? id}. Choose a target.`);
    },
    [announce],
  );
  const disarm = useCallback(() => {
    setState((s) => ({ ...s, armedId: null }));
  }, []);
  const toggleArm = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.armedId === id) return { ...s, armedId: null };
        announce(`Picked up ${labels.current.get(id) ?? id}. Choose a target.`);
        return { ...s, armedId: id };
      });
    },
    [announce],
  );

  const dropOn = useCallback(
    (zoneId: string) => {
      const id = state.draggingId ?? state.armedId;
      if (!id) return;
      onDrop(id, zoneId);
      announce(`Placed ${labels.current.get(id) ?? id}.`);
      setState({ armedId: null, draggingId: null, draggingLabel: null, overZone: null });
    },
    [state.draggingId, state.armedId, onDrop, announce],
  );

  const setOverZone = useCallback((zoneId: string | null) => {
    setState((s) => (s.overZone === zoneId ? s : { ...s, overZone: zoneId }));
  }, []);

  const beginPointerDrag = useCallback(
    (id: string, e: PointerEvent, node: HTMLElement) => {
      const rect = node.getBoundingClientRect();
      drag.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        grabX: e.clientX - rect.left,
        grabY: e.clientY - rect.top,
        width: rect.width,
        height: rect.height,
        node,
        active: false,
        pointerId: e.pointerId,
      };
    },
    [],
  );

  useEffect(() => {
    function move(e: PointerEvent) {
      const d = drag.current;
      if (!d || d.pointerId !== e.pointerId) return;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      if (!d.active) {
        const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
        if (dist < 5) return;
        d.active = true;
        const label = labels.current.get(d.id) ?? d.id;
        setState((s) => ({ ...s, draggingId: d.id, draggingLabel: label, armedId: null }));
      }
      if (ghost.current) {
        ghost.current.style.transform = `translate(${e.clientX - d.grabX}px, ${e.clientY - d.grabY}px)`;
      }
      const el = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest<HTMLElement>("[data-drop-zone]");
      setOverZone(el?.dataset.dropZone ?? null);
    }
    function up(e: PointerEvent) {
      const d = drag.current;
      if (!d || d.pointerId !== e.pointerId) return;
      if (d.active) {
        const el = document
          .elementFromPoint(e.clientX, e.clientY)
          ?.closest<HTMLElement>("[data-drop-zone]");
        if (el?.dataset.dropZone) {
          onDrop(d.id, el.dataset.dropZone);
          announce(`Placed ${labels.current.get(d.id) ?? d.id}.`);
        }
        setState({ armedId: null, draggingId: null, draggingLabel: null, overZone: null });
      }
      drag.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [onDrop, announce, setOverZone]);

  const draggingLabel = state.draggingLabel;
  const draggingId = state.draggingId;

  useEffect(() => {
    const host = ghost.current;
    const d = drag.current;
    if (!host || !d || draggingId !== d.id) return;
    const clone = d.node.cloneNode(true) as HTMLElement;
    clone.removeAttribute("data-drag-item");
    clone.removeAttribute("id");
    clone.removeAttribute("role");
    clone.removeAttribute("tabindex");
    clone.removeAttribute("aria-pressed");
    clone.setAttribute("aria-hidden", "true");
    clone.classList.remove("opacity-40");
    clone.style.opacity = "1";
    clone.style.width = `${d.width}px`;
    clone.style.height = `${d.height}px`;
    clone.style.margin = "0";
    clone.style.position = "static";
    clone.style.inset = "auto";
    clone.style.transform = "none";
    for (const el of clone.querySelectorAll("[id]")) el.removeAttribute("id");
    host.style.transform = `translate(${d.lastX - d.grabX}px, ${d.lastY - d.grabY}px)`;
    host.replaceChildren(clone);
    return () => host.replaceChildren();
  }, [draggingId]);

  return (
    <Ctx.Provider
      value={{
        ...state,
        onDrop,
        registerLabel,
        arm,
        toggleArm,
        disarm,
        beginPointerDrag,
        setOverZone,
        dropOn,
        announce,
      }}
    >
      <div className={className}>{children}</div>
      {draggingLabel != null && (
        <div
          ref={ghost}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-50 drop-shadow-xl"
        />
      )}
      <div ref={liveRef} aria-live="polite" className="sr-only" />
    </Ctx.Provider>
  );
}

export function Draggable({
  id,
  label,
  disabled = false,
  children,
  className,
  style,
  armedClassName = "ring-primary ring-2",
}: {
  id: string;
  label: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  armedClassName?: string;
}) {
  const ctx = useDragCtx();
  const moved = useRef(false);
  useEffect(() => {
    ctx.registerLabel(id, label);
  }, [ctx, id, label]);

  const armed = ctx.armedId === id;
  const dragging = ctx.draggingId === id;

  useEffect(() => {
    if (dragging) moved.current = true;
  }, [dragging]);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-pressed={armed}
      aria-label={label}
      data-drag-item={id}
      style={style}
      className={cn(
        "touch-none outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
        armed && armedClassName,
        dragging && "opacity-40",
        !disabled && "cursor-grab active:cursor-grabbing",
        className,
      )}
      onPointerDown={(e) => {
        if (disabled || e.button !== 0) return;
        moved.current = false;
        ctx.beginPointerDrag(id, e.nativeEvent, e.currentTarget);
      }}
      onClick={() => {
        if (!disabled && !ctx.draggingId && !moved.current) ctx.toggleArm(id);
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ctx.toggleArm(id);
        } else if (e.key === "Escape") {
          ctx.disarm();
        }
      }}
    >
      {children}
    </div>
  );
}

export function DropZone({
  id,
  disabled = false,
  children,
  className,
  overClassName = "ring-primary ring-2",
  armedClassName = "ring-primary/60 ring-2",
  label,
}: {
  id: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  overClassName?: string;
  armedClassName?: string;
  label?: string;
}) {
  const ctx = useDragCtx();
  const over = ctx.overZone === id && ctx.draggingId != null;
  const armable = ctx.armedId != null && !disabled;

  return (
    <div
      data-drop-zone={disabled ? undefined : id}
      role={armable ? "button" : undefined}
      tabIndex={armable ? 0 : -1}
      aria-label={label}
      className={cn(
        "outline-none",
        armable && "focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        over && overClassName,
        !over && armable && armedClassName,
        className,
      )}
      onClick={() => {
        if (!disabled && ctx.armedId) ctx.dropOn(id);
      }}
      onKeyDown={(e) => {
        if (disabled || !ctx.armedId) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ctx.dropOn(id);
        }
      }}
    >
      {children}
    </div>
  );
}

export function useArmedItem(): string | null {
  return useDragCtx().armedId;
}
