export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

export function createFixedWindowRateLimiter(options: {
  limit: number;
  windowMs: number;
  maxKeys: number;
}) {
  const windows = new Map<string, { count: number; resetsAt: number }>();

  return function check(key: string, now = Date.now()): RateLimitResult {
    let window = windows.get(key);
    if (!window || window.resetsAt <= now) {
      if (!window && windows.size >= options.maxKeys) {
        const oldest = windows.keys().next().value as string | undefined;
        if (oldest !== undefined) windows.delete(oldest);
      }
      window = { count: 0, resetsAt: now + options.windowMs };
    } else {
      // Refresh insertion order so the bounded map evicts the least recently
      // observed address rather than a busy current one.
      windows.delete(key);
    }

    windows.set(key, window);
    const retryAfterSeconds = Math.max(1, Math.ceil((window.resetsAt - now) / 1000));
    if (window.count >= options.limit) {
      return {
        allowed: false,
        limit: options.limit,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    window.count += 1;
    return {
      allowed: true,
      limit: options.limit,
      remaining: options.limit - window.count,
      retryAfterSeconds,
    };
  };
}

// Per Worker isolate. Cloudflare remains the outer abuse boundary; this keeps
// a single hot client from multiplying one request into repeated wiki calls.
export const checkDefinitionLookupRateLimit = createFixedWindowRateLimiter({
  limit: 20,
  windowMs: 60_000,
  maxKeys: 5_000,
});
