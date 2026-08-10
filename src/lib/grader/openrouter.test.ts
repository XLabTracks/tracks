import { afterEach, describe, expect, it, vi } from "vitest";
import { callGrader } from "./openrouter";

function stubFetch(impl: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

const CALL = ["model/slug", "system", "user", "sk-key"] as const;

describe("callGrader", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the message content on a well-formed response", async () => {
    stubFetch(async () =>
      Response.json({ choices: [{ message: { content: "report" } }] }),
    );
    expect(await callGrader(...CALL)).toEqual({ ok: true, content: "report" });
  });

  it("never throws on a 200 with a non-JSON body", async () => {
    stubFetch(async () => new Response("<html>upstream hiccup</html>"));
    const result = await callGrader(...CALL);
    expect(result).toEqual({
      ok: false,
      error:
        "The grading service returned an unreadable response. Try again.",
    });
  });

  it("surfaces an OpenRouter 200-with-error body's message", async () => {
    stubFetch(async () =>
      Response.json({ error: { message: "Provider returned error" } }),
    );
    expect(await callGrader(...CALL)).toEqual({
      ok: false,
      error: "Grading service error: Provider returned error",
    });
  });

  it("keeps the existing error paths: status, empty body, token cutoff", async () => {
    stubFetch(async () => new Response("nope", { status: 502 }));
    expect(await callGrader(...CALL)).toEqual({
      ok: false,
      error: "Grading service error (502).",
    });

    stubFetch(async () => Response.json({ choices: [] }));
    expect((await callGrader(...CALL)).ok).toBe(false);

    stubFetch(async () =>
      Response.json({
        choices: [{ finish_reason: "length", message: { content: "" } }],
      }),
    );
    expect(await callGrader(...CALL)).toEqual({
      ok: false,
      error: "The grader ran out of tokens before finishing. Try again.",
    });

    stubFetch(async () => {
      throw new Error("network down");
    });
    expect(await callGrader(...CALL)).toEqual({
      ok: false,
      error: "Could not reach the grading service.",
    });
  });

  it("refuses to call without an api key", async () => {
    stubFetch(async () => Response.json({}));
    const result = await callGrader("model/slug", "system", "user", "");
    expect(result).toEqual({
      ok: false,
      error: "Grading is not configured on this server.",
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
