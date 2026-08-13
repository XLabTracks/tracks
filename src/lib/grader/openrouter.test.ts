import { afterEach, describe, expect, it, vi } from "vitest";
import { callGrader } from "./openrouter";

function stubFetch(
  impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

const OPTIONS = {
  maxTokens: 1_400,
  reasoningEffort: "minimal" as const,
  timeoutMs: 1_000,
};
const CALL = [["model/slug", "fallback/slug"], "system", "user", "sk-key", OPTIONS] as const;

describe("callGrader", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns content plus privacy-safe usage/provider telemetry", async () => {
    stubFetch(async () =>
      Response.json({
        id: "gen-1",
        model: "fallback/slug",
        provider: "Provider",
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        choices: [{ message: { content: '{"criteria":[]}' } }],
      }),
    );
    expect(await callGrader(...CALL)).toMatchObject({
      ok: true,
      content: '{"criteria":[]}',
      telemetry: {
        requestId: "gen-1",
        model: "fallback/slug",
        provider: "Provider",
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      },
    });
  });

  it("sends fallback models, bounded output, reasoning and strict structured output", async () => {
    stubFetch(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      expect(body).toMatchObject({
        models: ["model/slug", "fallback/slug"],
        max_tokens: 1_400,
        reasoning: { effort: "minimal", exclude: true },
        response_format: {
          type: "json_schema",
          json_schema: { strict: true },
        },
        provider: { require_parameters: true },
      });
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return Response.json({ choices: [{ message: { content: "{}" } }] });
    });
    expect((await callGrader(...CALL)).ok).toBe(true);
  });

  it("never throws on a 200 with a non-JSON body", async () => {
    stubFetch(async () => new Response("<html>upstream hiccup</html>"));
    const result = await callGrader(...CALL);
    expect(result).toMatchObject({
      ok: false,
      error: "The grading service returned an unreadable response. Try again.",
      errorCode: "invalid_json_response",
    });
  });

  it("does not expose an upstream provider message to the learner", async () => {
    stubFetch(async () =>
      Response.json({ error: { message: "secret provider detail", code: 502 } }),
    );
    const result = await callGrader(...CALL);
    expect(result).toMatchObject({
      ok: false,
      error: "The grading provider could not complete this request. Try again.",
      errorCode: "provider_502",
    });
    if (!result.ok) expect(result.error).not.toContain("secret provider detail");
  });

  it("retries a transient HTTP failure once", async () => {
    const responses = [
      new Response("nope", { status: 502 }),
      Response.json({ choices: [{ message: { content: "report" } }] }),
    ];
    stubFetch(async () => responses.shift()!);
    expect(await callGrader(...CALL)).toMatchObject({ ok: true, content: "report" });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("keeps status, empty-body, token-cutoff and network error paths", async () => {
    stubFetch(async () => new Response("nope", { status: 400 }));
    expect(await callGrader(...CALL)).toMatchObject({
      ok: false,
      error: "Grading service error (400).",
      errorCode: "http_400",
    });

    stubFetch(async () => Response.json({ choices: [] }));
    expect((await callGrader(...CALL)).ok).toBe(false);

    stubFetch(async () =>
      Response.json({
        choices: [{ finish_reason: "length", message: { content: "" } }],
      }),
    );
    expect(await callGrader(...CALL)).toMatchObject({
      ok: false,
      error: "The grader ran out of tokens before finishing. Try again.",
      errorCode: "token_limit",
    });

    stubFetch(async () => {
      throw new Error("network down");
    });
    expect(await callGrader(...CALL)).toMatchObject({
      ok: false,
      error: "Could not reach the grading service.",
      errorCode: "network_error",
    });
  });

  it("aborts a hung upstream request", async () => {
    stubFetch(async (_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError")),
        );
      }),
    );
    const result = await callGrader(
      ["model/slug"],
      "system",
      "user",
      "sk-key",
      { ...OPTIONS, timeoutMs: 5 },
    );
    expect(result).toMatchObject({ ok: false, errorCode: "timeout" });
  });

  it("refuses to call without an api key", async () => {
    stubFetch(async () => Response.json({}));
    const result = await callGrader(
      ["model/slug"],
      "system",
      "user",
      "",
      OPTIONS,
    );
    expect(result).toMatchObject({
      ok: false,
      error: "Grading is not configured on this server.",
      errorCode: "missing_api_key",
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
