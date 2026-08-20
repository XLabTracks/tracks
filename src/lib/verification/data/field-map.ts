export type FieldNodeType =
  | "goal"
  | "risk"
  | "leverage"
  | "bottleneck"
  | "resource"
  | "actor"
  | "milestone"
  | "assumption";

export interface FieldNode {
  id: string;
  type: FieldNodeType;
  x: number;
  y: number;
  title: string;
  description: string;
}

export interface FieldEdge {
  id: string;
  from: string;
  to: string;
  label: FieldEdgeLabel;
}

export interface FieldMapDocument {
  version: 1;
  nodes: FieldNode[];
  edges: FieldEdge[];
  updatedAt: number;
}

export type FieldEdgeLabel = (typeof FIELD_EDGE_LABELS)[number];

export const FIELD_NODE_TYPES: Record<
  FieldNodeType,
  { name: string; symbol: string; prompt: string; description: string; color: string }
> = {
  goal: { name: "Goal", symbol: "✦", prompt: "What does success look like?", description: "Describe the end-state you want to reach.", color: "var(--mod-4-text, #3d75b1)" },
  risk: { name: "Risk", symbol: "⚠", prompt: "What could go wrong?", description: "A threat, failure mode, or adverse scenario.", color: "var(--mod-0-text, #9a000c)" },
  leverage: { name: "Leverage", symbol: "↗", prompt: "Where is the high-impact lever?", description: "A point of outsized influence on the outcome.", color: "var(--mod-1-text, #bf4f00)" },
  bottleneck: { name: "Bottleneck", symbol: "⧖", prompt: "What's blocking progress?", description: "A constraint, chokepoint, or rate-limiter.", color: "var(--mod-3-text, #555e07)" },
  resource: { name: "Resource", symbol: "◇", prompt: "What do you have to work with?", description: "Funding, talent, data, political capital, and other inputs.", color: "var(--mod-2-text, #946b00)" },
  actor: { name: "Actor", symbol: "●", prompt: "Who has agency here?", description: "A person, organization, or institution that can act.", color: "var(--mod-4-text, #3d75b1)" },
  milestone: { name: "Milestone", symbol: "▸", prompt: "What marks a waypoint?", description: "A measurable checkpoint on the path to the goal.", color: "var(--mod-3-text, #555e07)" },
  assumption: { name: "Assumption", symbol: "?", prompt: "What are you taking for granted?", description: "A belief that, if wrong, changes the picture.", color: "var(--muted-foreground)" },
};

export const FIELD_EDGE_LABELS = [
  "causes",
  "enables",
  "blocks",
  "depends on",
  "mitigates",
  "amplifies",
] as const;

export const EMPTY_FIELD_MAP: FieldMapDocument = { version: 1, nodes: [], edges: [], updatedAt: 0 };

const EXAMPLE_NODES: FieldNode[] = [
  { id: "n1", type: "goal", x: 78, y: 48, title: "Reduce misinformation spread by 40%", description: "Primary outcome goal for the intervention" },
  { id: "n2", type: "risk", x: 52, y: 25, title: "Platform algorithm amplifies outrage", description: "Engagement-optimized feeds boost inflammatory content" },
  { id: "n3", type: "risk", x: 52, y: 72, title: "Low media literacy", description: "A second path into the outcome" },
  { id: "n4", type: "leverage", x: 26, y: 35, title: "Mandatory algorithmic transparency", description: "Require platforms to disclose ranking signals" },
  { id: "n5", type: "bottleneck", x: 52, y: 48, title: "Regulatory capture", description: "Incumbents lobby to weaken oversight" },
  { id: "n6", type: "actor", x: 26, y: 67, title: "Civil-society watchdog coalition", description: "NGOs, journalists, and academic fact-checkers" },
];

export const EXAMPLE_FIELD_MAP: FieldMapDocument = {
  version: 1,
  updatedAt: 0,
  nodes: EXAMPLE_NODES,
  edges: [
    { id: "e1", from: "n2", to: "n1", label: "blocks" },
    { id: "e2", from: "n3", to: "n1", label: "blocks" },
    { id: "e3", from: "n4", to: "n2", label: "mitigates" },
    { id: "e4", from: "n5", to: "n4", label: "blocks" },
    { id: "e5", from: "n6", to: "n5", label: "mitigates" },
  ],
};

const NODE_TYPES = new Set(Object.keys(FIELD_NODE_TYPES));
const EDGE_LABELS = new Set<string>(FIELD_EDGE_LABELS);
const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;

export function parseFieldMapDocument(value: unknown): FieldMapDocument | null {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.nodes) || !Array.isArray(value.edges)) return null;
  if (value.nodes.length > 120 || value.edges.length > 240) return null;

  const nodes: FieldNode[] = [];
  const nodeIds = new Set<string>();
  for (const item of value.nodes) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || !SAFE_ID.test(item.id) || nodeIds.has(item.id)) return null;
    if (typeof item.type !== "string" || !NODE_TYPES.has(item.type)) return null;
    if (!finitePercent(item.x) || !finitePercent(item.y)) return null;
    if (typeof item.title !== "string" || typeof item.description !== "string") return null;
    if (item.title.length > 120 || item.description.length > 600) return null;
    nodeIds.add(item.id);
    nodes.push({ id: item.id, type: item.type as FieldNodeType, x: item.x, y: item.y, title: item.title, description: item.description });
  }

  const edges: FieldEdge[] = [];
  const edgeIds = new Set<string>();
  for (const item of value.edges) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || !SAFE_ID.test(item.id) || edgeIds.has(item.id)) return null;
    if (typeof item.from !== "string" || typeof item.to !== "string" || !nodeIds.has(item.from) || !nodeIds.has(item.to) || item.from === item.to) return null;
    if (typeof item.label !== "string" || !EDGE_LABELS.has(item.label)) return null;
    edgeIds.add(item.id);
    edges.push({ id: item.id, from: item.from, to: item.to, label: item.label as FieldEdgeLabel });
  }
  const updatedAt = typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt) && value.updatedAt > 0
    ? value.updatedAt
    : 0;
  return { version: 1, nodes, edges, updatedAt };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finitePercent(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 4 && value <= 96;
}
