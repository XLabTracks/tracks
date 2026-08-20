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

// Hy3's free endpoint was deprecated. This current free model supports the
// structured-output and reasoning parameters the grader now requires.
const DEFAULT_MODEL = "openai/gpt-oss-120b:free";
const DEFAULT_SERVER_FALLBACK = "openrouter/free";

// Grading billed to a user's own (or a classroom's) OpenRouter key defaults
// to a paid, stronger model — their key, their spend; the server-wide key
// stays on the free tier.
const DEFAULT_USER_KEY_MODEL = "deepseek/deepseek-v4-flash-0731";

/** Whose OpenRouter key pays for the grading call. */
export type GraderKeySource = "server" | "user" | "classroom";

/**
 * The OpenRouter model slug for a length class. With the server key, each
 * class can be pointed elsewhere via env (OPENROUTER_MODEL_SHORT / _MEDIUM /
 * _LONG), with OPENROUTER_MODEL as the shared fallback. With a user- or
 * classroom-supplied key, one slug covers all classes (OPENROUTER_MODEL_USER,
 * default deepseek/deepseek-v4-flash-0731).
 */
export function modelFor(
  lengthClass: LengthClass,
  keySource: GraderKeySource = "server",
): string {
  if (keySource !== "server") {
    return process.env.OPENROUTER_MODEL_USER || DEFAULT_USER_KEY_MODEL;
  }
  const perClass = {
    short: process.env.OPENROUTER_MODEL_SHORT,
    medium: process.env.OPENROUTER_MODEL_MEDIUM,
    long: process.env.OPENROUTER_MODEL_LONG,
  }[lengthClass];
  return perClass || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
}

/** Ordered OpenRouter fallback chain. Paid-key fallbacks are opt-in so an
 * override can never create a surprise bill; the server chain stays free. */
export function modelsFor(
  lengthClass: LengthClass,
  keySource: GraderKeySource = "server",
): string[] {
  const primary = modelFor(lengthClass, keySource);
  const fallback =
    keySource === "server"
      ? process.env.OPENROUTER_MODEL_FALLBACK || DEFAULT_SERVER_FALLBACK
      : process.env.OPENROUTER_MODEL_USER_FALLBACK;
  return fallback && fallback !== primary ? [primary, fallback] : [primary];
}

export function outputTokensFor(lengthClass: LengthClass): number {
  return { short: 1_400, medium: 2_600, long: 4_200 }[lengthClass];
}

export function reasoningEffortFor(
  lengthClass: LengthClass,
): "minimal" | "low" | "medium" {
  const effort: Record<LengthClass, "minimal" | "low" | "medium"> = {
    short: "minimal",
    medium: "low",
    long: "medium",
  };
  return effort[lengthClass];
}
