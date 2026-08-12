import { describe, expect, it } from "vitest";

import { readLimitedBody } from "./read-limited-body";

describe("readLimitedBody", () => {
  it("reads a body within the byte limit", async () => {
    await expect(
      readLimitedBody(new Request("https://example.test", { method: "POST", body: "hello" }), 5),
    ).resolves.toEqual({ ok: true, text: "hello", bytes: 5 });
  });

  it("counts UTF-8 bytes rather than JavaScript characters", async () => {
    const result = await readLimitedBody(
      new Request("https://example.test", { method: "POST", body: "🙂" }),
      3,
    );
    expect(result.ok).toBe(false);
    expect(result.bytes).toBe(4);
  });

  it("rejects an oversized declared body before reading it", async () => {
    const request = new Request("https://example.test", {
      method: "POST",
      headers: { "Content-Length": "99" },
      body: "small",
    });
    await expect(readLimitedBody(request, 10)).resolves.toEqual({ ok: false, bytes: 99 });
  });
});
