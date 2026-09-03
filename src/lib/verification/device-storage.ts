export const ACCOUNT_MARKER_KEY = "tracks:account";
export const SYNC_ADOPTED_FLAG = "vt-sync-adopted";
export const ACCOUNT_SETTLED_EVENT = "tracks-account-settled";

const LEARNER_KEYS = new Set([
  "vt-progress",
  "vt-highlights.v1",
  "vt-field-map:v1",
  "vt-marks.v1",
  "vt-widget-stamps.v1",
  "xlab-verification-notebook.v1",
  "xlab-verification-memo-desk.v1",
]);

const LEARNER_PREFIXES = [
  "v-",
  "vt-workspace:",
  "vt-ex:",
  "distiller-v2-",
  "bench:",
  "xlab-sec-",
];

export function isLearnerWorkKey(key: string): boolean {
  if (LEARNER_KEYS.has(key)) return true;
  return LEARNER_PREFIXES.some((prefix) => key.startsWith(prefix));
}

export interface KeyStorage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function purgeLearnerWork(storage: KeyStorage): string[] {
  const doomed: string[] = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (key && isLearnerWorkKey(key)) doomed.push(key);
  }
  for (const key of doomed) storage.removeItem(key);
  return doomed;
}

export function reconcileAccountMarker(
  userId: string | null,
  storage: KeyStorage,
): { purged: boolean } {
  const marker = storage.getItem(ACCOUNT_MARKER_KEY);
  if (userId) {
    if (marker === userId) return { purged: false };
    const purged = marker !== null;
    if (purged) purgeLearnerWork(storage);
    storage.setItem(ACCOUNT_MARKER_KEY, userId);
    return { purged };
  }
  if (marker === null) return { purged: false };
  purgeLearnerWork(storage);
  storage.removeItem(ACCOUNT_MARKER_KEY);
  return { purged: true };
}

type SyncBridge = { flush?: () => Promise<unknown> | void };

function local(): KeyStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function clearAdoptedFlag(): void {
  try {
    window.sessionStorage.removeItem(SYNC_ADOPTED_FLAG);
  } catch {
  }
}

export function forgetDevice(): void {
  const storage = local();
  if (storage) {
    purgeLearnerWork(storage);
    storage.removeItem(ACCOUNT_MARKER_KEY);
  }
  clearAdoptedFlag();
}

export function settleAccountOnDevice(userId: string | null): void {
  const storage = local();
  if (storage) {
    const { purged } = reconcileAccountMarker(userId, storage);
    if (purged) {
      clearAdoptedFlag();
      window.location.reload();
      return;
    }
  }
  const w = window as unknown as { __tracksAccountSettled?: boolean };
  w.__tracksAccountSettled = true;
  window.dispatchEvent(new CustomEvent(ACCOUNT_SETTLED_EVENT));
}

export async function flushAccountSync(): Promise<void> {
  const bridge = (window as unknown as { VTSync?: SyncBridge }).VTSync;
  try {
    await bridge?.flush?.();
  } catch {
  }
}
