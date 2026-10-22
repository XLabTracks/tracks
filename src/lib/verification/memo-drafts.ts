import { memoSlots, type MemoSlot } from "@/content/verification/memos";

export const MEMO_FIELDS = [
  "audience",
  "from",
  "date",
  "decision",
  "falsifier",
  "title",
  "body",
] as const;

export type MemoField = (typeof MEMO_FIELDS)[number];

export interface MemoDraft {
  id: string;
  slot: MemoSlot | null;
  fields: Record<MemoField, string>;
  words: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fieldsOf(value: unknown): Record<MemoField, string> {
  const source = isRecord(value) ? value : {};
  const out = {} as Record<MemoField, string>;
  for (const field of MEMO_FIELDS) {
    const stored = source[field];
    out[field] = typeof stored === "string" ? stored.trim() : "";
  }
  return out;
}

function written(fields: Record<MemoField, string>): boolean {
  return MEMO_FIELDS.some((field) => fields[field] !== "");
}

export function countWords(text: string): number {
  return text.trim() ? (text.trim().match(/\S+/g) ?? []).length : 0;
}

export function memoDraftsFrom(memos: unknown): MemoDraft[] {
  if (!isRecord(memos)) return [];

  const drafts: MemoDraft[] = [];
  const seen = new Set<string>();

  for (const slot of memoSlots) {
    const fields = fieldsOf(memos[slot.id]);
    seen.add(slot.id);
    if (!written(fields)) continue;
    drafts.push({
      id: slot.id,
      slot,
      fields,
      words: countWords(fields.body),
    });
  }

  for (const key of Object.keys(memos)) {
    if (key.startsWith("_") || seen.has(key)) continue;
    const fields = fieldsOf(memos[key]);
    if (!written(fields)) continue;
    drafts.push({ id: key, slot: null, fields, words: countWords(fields.body) });
  }

  return drafts;
}

export function memoSlotCount(): number {
  return memoSlots.length;
}
