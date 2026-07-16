import type { LengthClass } from "./prompts";

// Word-count thresholds for the three grader configurations. Boundaries:
// short < 100 words; medium 100–400; long > 400.
export const SHORT_MAX_WORDS = 99;
export const MEDIUM_MAX_WORDS = 400;

export function countWords(text: string): number {
  const words = text.trim().split(/\s+/u).filter(Boolean);
  return words.length;
}

export function classifyLength(text: string): LengthClass {
  const words = countWords(text);
  if (words <= SHORT_MAX_WORDS) return "short";
  if (words <= MEDIUM_MAX_WORDS) return "medium";
  return "long";
}

const DEFAULT_MODEL = "deepseek/deepseek-v4-flash";

/**
 * The OpenRouter model slug for a length class. Each class is its own model
 * instance and can be pointed elsewhere via env (OPENROUTER_MODEL_SHORT /
 * _MEDIUM / _LONG), with OPENROUTER_MODEL as the shared fallback.
 */
export function modelFor(lengthClass: LengthClass): string {
  const perClass = {
    short: process.env.OPENROUTER_MODEL_SHORT,
    medium: process.env.OPENROUTER_MODEL_MEDIUM,
    long: process.env.OPENROUTER_MODEL_LONG,
  }[lengthClass];
  return perClass || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
}
