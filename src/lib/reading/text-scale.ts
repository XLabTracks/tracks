/**
 * A reader-controlled text scale for the Verification course.
 *
 * Palette and type size are separate preferences. An explicit Aa choice
 * follows the learner between lessons.
 */

export const TEXT_SCALE_STORAGE_KEY = "xlab-verification-text-scale";

export const TEXT_SCALE_OPTIONS = [100, 125, 150, 175, 200] as const;

export type TextScale = (typeof TEXT_SCALE_OPTIONS)[number];

export const DEFAULT_TEXT_SCALE: TextScale = 100;

export function parseTextScale(value: unknown): TextScale | null {
  const number = typeof value === "number" ? value : Number(value);
  return TEXT_SCALE_OPTIONS.includes(number as TextScale)
    ? (number as TextScale)
    : null;
}

export function isLargeTextScale(scale: TextScale): boolean {
  return scale >= 150;
}

export function readStoredTextScale(): TextScale | null {
  try {
    return parseTextScale(localStorage.getItem(TEXT_SCALE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function effectiveTextScale(): TextScale {
  const root = document.documentElement;
  return parseTextScale(root.dataset.textScale) ?? DEFAULT_TEXT_SCALE;
}

export function applyTextScale(
  scale: TextScale,
  { persist = true }: { persist?: boolean } = {}
): void {
  const root = document.documentElement;
  root.dataset.textScale = String(scale);
  root.classList.toggle("reader-enlarged", scale > DEFAULT_TEXT_SCALE);
  root.classList.toggle("reader-large", isLargeTextScale(scale));
  if (!persist) return;
  try {
    localStorage.setItem(TEXT_SCALE_STORAGE_KEY, String(scale));
  } catch {
    // Private mode: the setting still applies for this page's lifetime.
  }
}

/** Restore the stored course preference on client-side entry to Verification. */
export function restoreTextScale(): void {
  const stored = readStoredTextScale();
  if (stored) {
    applyTextScale(stored, { persist: false });
    return;
  }
  const root = document.documentElement;
  root.removeAttribute("data-text-scale");
  root.classList.remove("reader-enlarged");
  root.classList.remove("reader-large");
}

export function subscribeTextScale(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-text-scale", "class"],
  });
  return () => observer.disconnect();
}
