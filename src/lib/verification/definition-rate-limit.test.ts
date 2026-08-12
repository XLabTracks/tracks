import { describe, expect, it } from "vitest";

import { createFixedWindowRateLimiter } from "./definition-rate-limit";

describe("definition lookup rate limiting", () => {
  it("limits each address independently and resets the window", () => {
    const check = createFixedWindowRateLimiter({ limit: 2, windowMs: 1_000, maxKeys: 10 });

    expect(check("one", 0)).toMatchObject({ allowed: true, remaining: 1 });
    expect(check("one", 10)).toMatchObject({ allowed: true, remaining: 0 });
    expect(check("one", 20)).toMatchObject({ allowed: false, retryAfterSeconds: 1 });
    expect(check("two", 20)).toMatchObject({ allowed: true, remaining: 1 });
    expect(check("one", 1_000)).toMatchObject({ allowed: true, remaining: 1 });
  });

  it("bounds the number of remembered addresses", () => {
    const check = createFixedWindowRateLimiter({ limit: 1, windowMs: 10_000, maxKeys: 2 });
    check("oldest", 0);
    check("middle", 1);
    check("newest", 2);

    // The first address was evicted, so it begins a fresh window.
    expect(check("oldest", 3).allowed).toBe(true);
  });
});
