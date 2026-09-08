export const VERIFICATION_STORE_NAMES = [
  "progress",
  "notebook",
  "highlights",
  "memos",
  "fieldMap",
  "widgets",
] as const;

export type VerificationStoreName = (typeof VERIFICATION_STORE_NAMES)[number];

export type VerificationStateDocument = {
  version: 2;
  progress: unknown;
  notebook: unknown;
  highlights: unknown;
  memos: unknown;
  fieldMap: unknown;
  widgets: WidgetStore | null;
  stamps: Record<VerificationStoreName, number>;
  updatedAt: number;
};

export type WidgetEntry = { value: unknown; updatedAt: number };
export type WidgetStore = Record<string, WidgetEntry>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function timestamp(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function normalizeWidgets(value: unknown): WidgetStore | null {
  if (!isRecord(value)) return null;
  const store: WidgetStore = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!isRecord(entry)) continue;
    const updatedAt = timestamp(entry.updatedAt);
    if (!updatedAt) continue;
    store[key] = { value: entry.value === undefined ? null : entry.value, updatedAt };
  }
  return store;
}

function widgetsStamp(store: WidgetStore | null): number {
  if (!store) return 0;
  let newest = 0;
  for (const entry of Object.values(store)) newest = Math.max(newest, entry.updatedAt);
  return newest;
}

function mergeWidgets(
  current: WidgetStore | null,
  incoming: WidgetStore | null,
): { store: WidgetStore | null; changed: boolean } {
  if (!incoming) return { store: current, changed: false };
  const store: WidgetStore = { ...(current ?? {}) };
  let changed = false;
  for (const [key, entry] of Object.entries(incoming)) {
    const mine = store[key];
    if (mine && mine.updatedAt >= entry.updatedAt) continue;
    store[key] = entry;
    changed = true;
  }
  return { store: changed ? store : current, changed };
}

function nestedStamp(name: VerificationStoreName, value: unknown): number {
  if (name === "widgets") return widgetsStamp(normalizeWidgets(value));
  if (!isRecord(value)) return 0;

  if (name === "memos") return timestamp(value._updatedAt);
  if (name !== "progress") return timestamp(value.updatedAt);

  let newest = timestamp(value.updatedAt);
  if (isRecord(value.units)) {
    for (const completedAt of Object.values(value.units)) {
      newest = Math.max(newest, timestamp(completedAt));
    }
  }
  return newest;
}

export function normalizeVerificationStateDocument(
  value: unknown,
): VerificationStateDocument {
  const source = isRecord(value) ? value : {};
  const suppliedStamps = isRecord(source.stamps) ? source.stamps : {};
  const legacyStamp = timestamp(source.updatedAt);
  const isCurrentVersion = source.version === 2;
  const stamps = {} as Record<VerificationStoreName, number>;

  for (const name of VERIFICATION_STORE_NAMES) {
    const store = source[name] ?? null;
    const supplied = timestamp(suppliedStamps[name]);
    const derived = nestedStamp(name, store);
    stamps[name] = Math.max(
      supplied,
      derived,
      !isCurrentVersion && store !== null && supplied === 0 && derived === 0
        ? legacyStamp
        : 0,
    );
  }

  return {
    version: 2,
    progress: source.progress ?? null,
    notebook: source.notebook ?? null,
    highlights: source.highlights ?? null,
    memos: source.memos ?? null,
    fieldMap: source.fieldMap ?? null,
    widgets: normalizeWidgets(source.widgets),
    stamps,
    updatedAt: Math.max(...Object.values(stamps), 0),
  };
}

export type VerificationStateMerge = {
  document: VerificationStateDocument;
  changed: boolean;
  acceptedStores: VerificationStoreName[];
};

export function mergeVerificationStateDocuments(
  currentValue: unknown,
  incomingValue: unknown,
): VerificationStateMerge {
  const current = normalizeVerificationStateDocument(currentValue);
  const incoming = normalizeVerificationStateDocument(incomingValue);
  const acceptedStores: VerificationStoreName[] = [];
  const document: VerificationStateDocument = {
    ...current,
    stamps: { ...current.stamps },
  };

  for (const name of VERIFICATION_STORE_NAMES) {
    if (name === "widgets") {
      const merged = mergeWidgets(current.widgets, incoming.widgets);
      if (merged.changed) {
        document.widgets = merged.store;
        document.stamps.widgets = widgetsStamp(merged.store);
        acceptedStores.push(name);
      }
      continue;
    }
    const currentStamp = current.stamps[name];
    const incomingStamp = incoming.stamps[name];
    const acceptsEqualStampedRetry = incomingStamp > 0 && incomingStamp === currentStamp;
    const fillsEmptyLegacyStore =
      incomingStamp === 0 && currentStamp === 0 && current[name] === null && incoming[name] !== null;

    if (incomingStamp > currentStamp || acceptsEqualStampedRetry || fillsEmptyLegacyStore) {
      document[name] = incoming[name];
      document.stamps[name] = incomingStamp;
      acceptedStores.push(name);
    }
  }

  document.updatedAt = Math.max(...Object.values(document.stamps), 0);
  const changed = JSON.stringify(document) !== JSON.stringify(current);
  return { document, changed, acceptedStores };
}
