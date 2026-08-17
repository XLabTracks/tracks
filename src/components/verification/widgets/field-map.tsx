"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Download, Link2, MousePointer2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  EMPTY_FIELD_MAP,
  EXAMPLE_FIELD_MAP,
  FIELD_EDGE_LABELS,
  FIELD_NODE_TYPES,
  parseFieldMapDocument,
  type FieldEdge,
  type FieldMapDocument,
  type FieldNode,
  type FieldNodeType,
} from "@/lib/verification/data/field-map";
import type { VerificationWidgetProps } from "../kit/types";

const STORAGE_KEY = "vt-field-map:v1";
const SAVE_DELAY_MS = 300;

type DragState = {
  id: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  pendingX: number;
  pendingY: number;
};

function persistFieldMap(document: FieldMapDocument) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
    window.dispatchEvent(new CustomEvent("vt-field-map-change"));
  } catch {
    // Private mode can reject local storage; export remains available.
  }
}

export function FieldMap(_: VerificationWidgetProps) {
  void _;
  const [document, setDocument] = useState<FieldMapDocument>(EMPTY_FIELD_MAP);
  const [ready, setReady] = useState(false);
  const [addType, setAddType] = useState<FieldNodeType | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const documentRef = useRef(document);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = parseFieldMapDocument(JSON.parse(raw));
          if (parsed) setDocument(parsed);
        }
      } catch {
        // A corrupt or unavailable local cache must never block the builder.
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useLayoutEffect(() => {
    documentRef.current = document;
  }, [document]);

  useEffect(() => {
    if (!ready) return;
    const save = window.setTimeout(() => persistFieldMap(document), SAVE_DELAY_MS);
    return () => window.clearTimeout(save);
  }, [document, ready]);

  useEffect(() => {
    if (!ready) return;
    const flushWhenHidden = () => {
      if (window.document.visibilityState === "hidden") persistFieldMap(documentRef.current);
    };
    const flushOnPageHide = () => persistFieldMap(documentRef.current);
    window.document.addEventListener("visibilitychange", flushWhenHidden);
    window.addEventListener("pagehide", flushOnPageHide);
    window.addEventListener("vt-before-account-sync", flushOnPageHide);
    return () => {
      window.document.removeEventListener("visibilitychange", flushWhenHidden);
      window.removeEventListener("pagehide", flushOnPageHide);
      window.removeEventListener("vt-before-account-sync", flushOnPageHide);
    };
  }, [ready]);

  useEffect(
    () => () => {
      if (dragFrameRef.current !== null) cancelAnimationFrame(dragFrameRef.current);
    },
    [],
  );

  const selectedNode = document.nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = document.edges.find((edge) => edge.id === selectedEdgeId);
  const edgeGeometry = useMemo(() => {
    const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
    return document.edges
      .map((edge) => ({ edge, from: nodesById.get(edge.from), to: nodesById.get(edge.to) }))
      .filter(
        (item): item is { edge: FieldEdge; from: FieldNode; to: FieldNode } =>
          Boolean(item.from && item.to),
      );
  }, [document.edges, document.nodes]);

  function patchNode(id: string, patch: Partial<FieldNode>) {
    setDocument((current) => ({ ...current, updatedAt: Date.now(), nodes: current.nodes.map((node) => node.id === id ? { ...node, ...patch } : node) }));
  }

  function moveDraggedNode(event: React.PointerEvent<HTMLButtonElement>, finish: boolean) {
    const drag = dragRef.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!drag || drag.id !== event.currentTarget.dataset.nodeId || !rect) return;
    if (!event.currentTarget.hasPointerCapture(drag.pointerId) && !finish) return;

    drag.pendingX = clamp(drag.startX + ((event.clientX - drag.startClientX) / rect.width) * 100);
    drag.pendingY = clamp(drag.startY + ((event.clientY - drag.startClientY) / rect.height) * 100);

    const commit = () => {
      dragFrameRef.current = null;
      const pending = dragRef.current;
      if (pending) patchNode(pending.id, { x: pending.pendingX, y: pending.pendingY });
    };

    if (finish) {
      if (dragFrameRef.current !== null) cancelAnimationFrame(dragFrameRef.current);
      commit();
      dragRef.current = null;
    } else if (dragFrameRef.current === null) {
      dragFrameRef.current = requestAnimationFrame(commit);
    }
  }

  function addNode(event: React.MouseEvent<HTMLDivElement>) {
    if (!addType || event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100);
    const definition = FIELD_NODE_TYPES[addType];
    const id = uniqueId("n");
    const node: FieldNode = { id, type: addType, x, y, title: definition.prompt, description: "" };
    setDocument((current) => ({ ...current, updatedAt: Date.now(), nodes: [...current.nodes, node] }));
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    setAddType(null);
  }

  function chooseNode(id: string) {
    if (connecting) {
      if (!connectFrom) {
        setConnectFrom(id);
        return;
      }
      if (connectFrom !== id && !document.edges.some((edge) => edge.from === connectFrom && edge.to === id)) {
        const edge: FieldEdge = { id: uniqueId("e"), from: connectFrom, to: id, label: "enables" };
        setDocument((current) => ({ ...current, updatedAt: Date.now(), edges: [...current.edges, edge] }));
        setSelectedEdgeId(edge.id);
        setSelectedNodeId(null);
      }
      setConnectFrom(null);
      setConnecting(false);
      return;
    }
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }

  function removeSelection() {
    if (selectedNodeId) {
      setDocument((current) => ({ ...current, updatedAt: Date.now(), nodes: current.nodes.filter((node) => node.id !== selectedNodeId), edges: current.edges.filter((edge) => edge.from !== selectedNodeId && edge.to !== selectedNodeId) }));
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setDocument((current) => ({ ...current, updatedAt: Date.now(), edges: current.edges.filter((edge) => edge.id !== selectedEdgeId) }));
      setSelectedEdgeId(null);
    }
  }

  function exportMap() {
    const blob = new Blob([JSON.stringify(document, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = "verification-field-map.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showNotice("Map exported");
  }

  async function importMap(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 250_000) throw new Error("too large");
      const parsed = parseFieldMapDocument(JSON.parse(await file.text()));
      if (!parsed) throw new Error("invalid map");
      setDocument(() => ({ ...parsed, updatedAt: Date.now() }));
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      showNotice("Map imported");
    } catch {
      showNotice("That file is not a valid Field Map export");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2400);
  }

  return (
    <section className="not-prose border-border bg-card my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground eyebrow">Verification Track · Capstone tool</p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Field Map</h3>
            <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">Build a threat model or theory of change. Place nodes, connect the claims, then test the assumptions holding the map together.</p>
          </div>
          <span className="text-muted-foreground shrink-0 eyebrow">{document.nodes.length} nodes · {document.edges.length} links</span>
        </div>
      </header>

      <div className="border-border flex flex-wrap items-center gap-1.5 border-b p-2.5">
        <Button type="button" variant={!addType && !connecting ? "secondary" : "ghost"} size="sm" onClick={() => { setAddType(null); setConnecting(false); setConnectFrom(null); }}><MousePointer2 className="size-4" /> Select</Button>
        <Button type="button" variant={connecting ? "secondary" : "ghost"} size="sm" onClick={() => { setConnecting((value) => !value); setAddType(null); setConnectFrom(null); }}><Link2 className="size-4" /> Connect</Button>
        <span className="bg-border mx-1 hidden h-5 w-px sm:block" />
        <input ref={importRef} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importMap(event.target.files?.[0])} />
        <Button type="button" variant="ghost" size="sm" onClick={() => importRef.current?.click()}><Upload className="size-4" /> Import</Button>
        <Button type="button" variant="ghost" size="sm" onClick={exportMap}><Download className="size-4" /> Export</Button>
        <div className="ml-auto flex gap-1.5">
          <Button type="button" variant="ghost" size="sm" onClick={() => { setDocument({ ...structuredClone(EXAMPLE_FIELD_MAP), updatedAt: Date.now() }); setSelectedNodeId(null); setSelectedEdgeId(null); }}>Load example</Button>
          {(selectedNode || selectedEdge) && <Button type="button" variant="ghost" size="sm" onClick={removeSelection}><Trash2 className="size-4" /> Delete</Button>}
        </div>
      </div>

      {(addType || connecting) && <div className="border-border bg-muted/45 border-b px-4 py-2 text-xs"><span className="font-medium">{addType ? `Place ${FIELD_NODE_TYPES[addType].name}` : connectFrom ? "Now choose a target node" : "Choose a source node"}.</span> <span className="text-muted-foreground">{addType ? "Click an open point on the canvas." : "The arrow follows the direction you click."}</span></div>}

      <div className="grid xl:grid-cols-[12rem_minmax(0,1fr)_19rem]">
        <aside className="border-border border-b p-3 xl:border-r xl:border-b-0">
          <p className="text-muted-foreground px-1 text-4xs tracking-[0.12em] uppercase">Add a node</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5 xl:grid-cols-1">
            {(Object.entries(FIELD_NODE_TYPES) as [FieldNodeType, (typeof FIELD_NODE_TYPES)[FieldNodeType]][]).map(([id, definition]) => (
              <button key={id} type="button" onClick={() => { setAddType(addType === id ? null : id); setConnecting(false); setConnectFrom(null); }} aria-pressed={addType === id} className={cn("border-border hover:bg-muted rounded-md border p-2 text-left transition-colors", addType === id && "ring-ring ring-2")}>
                <span className="text-xs font-semibold" style={{ color: definition.color }}>{definition.symbol} {definition.name}</span>
                <span className="text-muted-foreground mt-0.5 hidden text-4xs leading-snug xl:block">{definition.prompt}</span>
              </button>
            ))}
          </div>
        </aside>

        <div
          ref={canvasRef}
          onClick={addNode}
          className={cn("relative min-h-[34rem] overflow-hidden bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:20px_20px]", addType && "cursor-crosshair")}
          aria-label="Field Map canvas"
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs><marker id="field-map-arrow" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 z" fill="var(--muted-foreground)" /></marker></defs>
            {edgeGeometry.map(({ edge, from, to }) => <line key={edge.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} vectorEffect="non-scaling-stroke" stroke="var(--muted-foreground)" strokeOpacity={selectedEdgeId === edge.id ? 0.95 : 0.45} strokeWidth={selectedEdgeId === edge.id ? 2 : 1.2} markerEnd="url(#field-map-arrow)" />)}
          </svg>
          {edgeGeometry.map(({ edge, from, to }) => (
            <button key={edge.id} type="button" onClick={(event) => { event.stopPropagation(); setSelectedEdgeId(edge.id); setSelectedNodeId(null); }} className={cn("border-border bg-background hover:bg-muted absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-4xs shadow-sm", selectedEdgeId === edge.id && "ring-ring ring-2")} style={{ left: `${(from.x + to.x) / 2}%`, top: `${(from.y + to.y) / 2}%` }}>{edge.label}</button>
          ))}
          {document.nodes.map((node) => {
            const definition = FIELD_NODE_TYPES[node.type];
            return (
              <button
                key={node.id}
                data-node-id={node.id}
                type="button"
                onClick={(event) => { event.stopPropagation(); chooseNode(node.id); }}
                onPointerDown={(event) => {
                  if (connecting) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  dragRef.current = {
                    id: node.id,
                    pointerId: event.pointerId,
                    startClientX: event.clientX,
                    startClientY: event.clientY,
                    startX: node.x,
                    startY: node.y,
                    pendingX: node.x,
                    pendingY: node.y,
                  };
                }}
                onPointerMove={(event) => moveDraggedNode(event, false)}
                onPointerUp={(event) => {
                  moveDraggedNode(event, true);
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onPointerCancel={(event) => moveDraggedNode(event, true)}
                className={cn("border-border bg-background absolute z-20 w-44 touch-none rounded-lg border p-3 text-left shadow-sm transition-shadow hover:shadow-md", selectedNodeId === node.id && "ring-ring ring-2", connectFrom === node.id && "ring-primary ring-2")}
                style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <span className="text-4xs font-semibold tracking-[0.08em] uppercase" style={{ color: definition.color }}>{definition.symbol} {definition.name}</span>
                <span className="mt-1.5 block text-xs font-medium leading-snug">{node.title}</span>
                {node.description && <span className="text-muted-foreground mt-1 line-clamp-2 block text-4xs leading-snug">{node.description}</span>}
              </button>
            );
          })}
          {!document.nodes.length && !addType && <div className="text-muted-foreground pointer-events-none absolute inset-0 grid place-items-center p-8 text-center"><div><p className="text-foreground font-medium">Start with the claim you need to test.</p><p className="mt-1 text-xs">Choose a node type, then place it on the canvas.</p></div></div>}
          {notice && <div role="status" className="bg-foreground text-background absolute right-3 bottom-3 z-40 rounded-md px-3 py-2 text-xs shadow-lg">{notice}</div>}
        </div>

        <aside className="border-border bg-muted/25 border-t p-4 xl:border-t-0 xl:border-l">
          {selectedNode ? (
            <div className="space-y-4">
              <div><p className="text-muted-foreground text-4xs tracking-[0.12em] uppercase">Edit node</p><p className="mt-1 font-semibold" style={{ color: FIELD_NODE_TYPES[selectedNode.type].color }}>{FIELD_NODE_TYPES[selectedNode.type].name}</p></div>
              <label className="block text-xs font-medium">Title<Input className="mt-1.5" value={selectedNode.title} maxLength={120} onChange={(event) => patchNode(selectedNode.id, { title: event.target.value })} /></label>
              <label className="block text-xs font-medium">Detail<Textarea className="mt-1.5 min-h-24" value={selectedNode.description} maxLength={600} onChange={(event) => patchNode(selectedNode.id, { description: event.target.value })} /></label>
              <p className="border-border text-muted-foreground rounded-md border border-dashed p-3 text-xs leading-relaxed">{FIELD_NODE_TYPES[selectedNode.type].description}</p>
            </div>
          ) : selectedEdge ? (
            <div>
              <p className="text-muted-foreground text-4xs tracking-[0.12em] uppercase">Edit connection</p>
              <p className="mt-2 text-xs leading-relaxed"><strong>{document.nodes.find((node) => node.id === selectedEdge.from)?.title}</strong> → <strong>{document.nodes.find((node) => node.id === selectedEdge.to)?.title}</strong></p>
              <label className="mt-4 block text-xs font-medium">Relationship<select value={selectedEdge.label} onChange={(event) => setDocument((current) => ({ ...current, updatedAt: Date.now(), edges: current.edges.map((edge) => edge.id === selectedEdge.id ? { ...edge, label: event.target.value as FieldEdge["label"] } : edge) }))} className="border-input bg-background mt-1.5 h-9 w-full rounded-md border px-3 text-sm">{FIELD_EDGE_LABELS.map((label) => <option key={label}>{label}</option>)}</select></label>
            </div>
          ) : (
            <div className="border-border text-muted-foreground rounded-lg border border-dashed p-4 text-sm leading-relaxed"><p className="text-foreground font-medium">Make the argument visible.</p><p className="mt-1">Select a node to edit it, or connect two nodes to state the relationship between them.</p></div>
          )}
        </aside>
      </div>
    </section>
  );
}

function clamp(value: number) {
  return Math.min(92, Math.max(8, value));
}

function uniqueId(prefix: "n" | "e") {
  return `${prefix}-${crypto.randomUUID().slice(0, 12)}`;
}
