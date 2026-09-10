import { CHAIN, QUESTIONS, type ChainLink } from "../data/chain-builder";

export interface ChainState {
  order: string[];
  answers: Record<string, string[]>;
  broken: string[];
}

export const EMPTY_CHAIN: ChainState = { order: [], answers: {}, broken: [] };

export function expectedOrder(): string[] {
  return CHAIN.map((link) => link.id);
}

export function remaining(order: readonly string[]): ChainLink[] {
  return CHAIN.filter((link) => !order.includes(link.id));
}

export function nextExpected(order: readonly string[]): string | null {
  return expectedOrder()[order.length] ?? null;
}

export function isRightNext(order: readonly string[], id: string): boolean {
  return nextExpected(order) === id;
}

export function orderComplete(order: readonly string[]): boolean {
  return order.length === CHAIN.length;
}

export function questionRight(id: string, picked: readonly string[]): boolean {
  const question = QUESTIONS.find((q) => q.id === id);
  if (!question) return false;
  const want = [...question.answer].sort();
  const got = [...picked].sort();
  return want.length === got.length && want.every((v, i) => v === got[i]);
}

export function vendorRootedIds(): string[] {
  return CHAIN.filter((link) => link.vendorRooted).map((link) => link.id);
}

export function breakScore(picked: readonly string[]): {
  caught: number;
  missed: number;
  falseFlagged: number;
} {
  const want = new Set(vendorRootedIds());
  const got = new Set(picked);
  let caught = 0;
  let missed = 0;
  let falseFlagged = 0;
  for (const link of CHAIN) {
    const shouldBe = want.has(link.id);
    const marked = got.has(link.id);
    if (shouldBe && marked) caught += 1;
    else if (shouldBe && !marked) missed += 1;
    else if (!shouldBe && marked) falseFlagged += 1;
  }
  return { caught, missed, falseFlagged };
}

export function pruneChain(raw: unknown): ChainState {
  const box = (typeof raw === "object" && raw !== null ? raw : {}) as Partial<ChainState>;
  const ids = new Set(CHAIN.map((link) => link.id));
  const order: string[] = [];
  for (const id of Array.isArray(box.order) ? box.order : []) {
    if (typeof id === "string" && ids.has(id) && !order.includes(id)) order.push(id);
  }
  const answers: Record<string, string[]> = {};
  for (const question of QUESTIONS) {
    const picked = box.answers?.[question.id];
    if (Array.isArray(picked)) {
      answers[question.id] = picked.filter(
        (id): id is string => typeof id === "string" && ids.has(id),
      );
    }
  }
  const broken = Array.isArray(box.broken)
    ? box.broken.filter((id): id is string => typeof id === "string" && ids.has(id))
    : [];
  return { order, answers, broken };
}
