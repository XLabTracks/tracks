// Server-only OpenRouter chat client for the grader. Plain fetch keeps it
// Workers-compatible; requests are bounded, retryable, structured, and return
// privacy-safe telemetry (never prompts or keys).

import { GRADER_RESPONSE_SCHEMA } from "./structured";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 50_000;
const MAX_ATTEMPTS = 2;

export interface GraderTelemetry {
  latencyMs: number;
  requestId?: string;
  provider?: string;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export type GraderCallResult =
  | { ok: true; content: string; telemetry: GraderTelemetry }
  | {
      ok: false;
      error: string;
      errorCode: string;
      telemetry: GraderTelemetry;
    };

type ChatCompletionBody = {
  id?: string;
  model?: string;
  provider?: string;
  error?: { message?: string; code?: string | number };
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  choices?: Array<{
    finish_reason?: string;
    message?: { content?: string | null };
  }>;
};

export interface GraderCallOptions {
  maxTokens: number;
  reasoningEffort: "minimal" | "low" | "medium";
  timeoutMs?: number;
}

function retryableStatus(status: number): boolean {
  return status === 408 || status === 409 || status === 429 || status >= 500;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function telemetryFrom(
  startedAt: number,
  body?: ChatCompletionBody,
  response?: Response,
): GraderTelemetry {
  const headerRequestId =
    response?.headers.get("x-request-id") ??
    response?.headers.get("x-openrouter-request-id") ??
    undefined;
  return {
    latencyMs: Date.now() - startedAt,
    requestId: body?.id ?? headerRequestId,
    provider: body?.provider,
    model: body?.model,
    usage: body?.usage
      ? {
          promptTokens: body.usage.prompt_tokens,
          completionTokens: body.usage.completion_tokens,
          totalTokens: body.usage.total_tokens,
        }
      : undefined,
  };
}

export async function callGrader(
  models: readonly string[],
  system: string,
  user: string,
  apiKey: string,
  options: GraderCallOptions,
): Promise<GraderCallResult> {
  const startedAt = Date.now();
  if (!apiKey) {
    return {
      ok: false,
      error: "Grading is not configured on this server.",
      errorCode: "missing_api_key",
      telemetry: telemetryFrom(startedAt),
    };
  }

  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  let lastResponse: Response | undefined;
  let lastBody: ChatCompletionBody | undefined;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const remainingMs = timeoutMs - (Date.now() - startedAt);
    if (remainingMs <= 0) {
      return {
        ok: false,
        error: "The grading service took too long to respond. Try again.",
        errorCode: "timeout",
        telemetry: telemetryFrom(startedAt, lastBody, lastResponse),
      };
    }
    const controller = new AbortController();
    // The timeout is a total request budget, not a fresh budget per retry.
    // One unhealthy provider therefore cannot pin a Worker for 2 × 50s.
    const timer = setTimeout(() => controller.abort(), remainingMs);
    try {
      lastResponse = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          models,
          max_tokens: options.maxTokens,
          temperature: 0.2,
          reasoning: {
            effort: options.reasoningEffort,
            exclude: true,
          },
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "reasoning_transparency_grade",
              strict: true,
              schema: GRADER_RESPONSE_SCHEMA,
            },
          },
          provider: { require_parameters: true },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
    } catch (error) {
      clearTimeout(timer);
      const aborted =
        controller.signal.aborted ||
        (error instanceof DOMException && error.name === "AbortError");
      if (!aborted && attempt + 1 < MAX_ATTEMPTS) {
        await sleep(250 * (attempt + 1));
        continue;
      }
      return {
        ok: false,
        error: aborted
          ? "The grading service took too long to respond. Try again."
          : "Could not reach the grading service.",
        errorCode: aborted ? "timeout" : "network_error",
        telemetry: telemetryFrom(startedAt),
      };
    } finally {
      clearTimeout(timer);
    }

    if (!lastResponse.ok) {
      if (retryableStatus(lastResponse.status) && attempt + 1 < MAX_ATTEMPTS) {
        await sleep(250 * (attempt + 1));
        continue;
      }
      return {
        ok: false,
        error: `Grading service error (${lastResponse.status}).`,
        errorCode: `http_${lastResponse.status}`,
        telemetry: telemetryFrom(startedAt, undefined, lastResponse),
      };
    }

    try {
      lastBody = (await lastResponse.json()) as ChatCompletionBody;
    } catch {
      return {
        ok: false,
        error: "The grading service returned an unreadable response. Try again.",
        errorCode: "invalid_json_response",
        telemetry: telemetryFrom(startedAt, undefined, lastResponse),
      };
    }
    const choice = lastBody.choices?.[0];
    const content = choice?.message?.content;
    if (content) {
      return {
        ok: true,
        content,
        telemetry: telemetryFrom(startedAt, lastBody, lastResponse),
      };
    }
    if (lastBody.error?.message) {
      return {
        ok: false,
        error: "The grading provider could not complete this request. Try again.",
        errorCode: `provider_${String(lastBody.error.code ?? "error")}`,
        telemetry: telemetryFrom(startedAt, lastBody, lastResponse),
      };
    }
    return {
      ok: false,
      error:
        choice?.finish_reason === "length"
          ? "The grader ran out of tokens before finishing. Try again."
          : "The grader returned an empty response. Try again.",
      errorCode: choice?.finish_reason === "length" ? "token_limit" : "empty_response",
      telemetry: telemetryFrom(startedAt, lastBody, lastResponse),
    };
  }

  return {
    ok: false,
    error: "Could not reach the grading service.",
    errorCode: "network_error",
    telemetry: telemetryFrom(startedAt, lastBody, lastResponse),
  };
}
