export const WIDGET_STAMPS_KEY = "vt-widget-stamps.v1";
export const WIDGET_CHANGE_EVENT = "vt-widget-change";

function stamps(): Record<string, number> {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(WIDGET_STAMPS_KEY) || "null");
    return raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, number>)
      : {};
  } catch {
    return {};
  }
}

function stamp(key: string): void {
  try {
    const next = stamps();
    next[key] = Date.now();
    localStorage.setItem(WIDGET_STAMPS_KEY, JSON.stringify(next));
  } catch {
  }
}

function announce(key: string): void {
  try {
    window.dispatchEvent(new CustomEvent(WIDGET_CHANGE_EVENT, { detail: { key } }));
  } catch {
  }
}

export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, json: string): void {
  try {
    localStorage.setItem(key, json);
  } catch {
    return;
  }
  stamp(key);
  announce(key);
}

export function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
  stamp(key);
  announce(key);
}
