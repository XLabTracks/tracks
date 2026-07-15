import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { after } from "next/server";
import { cache } from "react";

// Workers forbid sharing TCP connections across requests (a reused client
// hangs on the second request — prisma/prisma#28193), so the client is
// per-request: cache() scopes it to one request/render. Connections ARE reused
// within the request (the pg pool serves every query off a few sockets) and
// disposed at request end via after() — which runs in the same request context
// through OpenNext's waitUntil, so nothing crosses the request boundary. Real
// pooling still happens upstream in Hyperdrive (prod) / PlanetScale's PgBouncer
// (local, port 6432). max is capped low: Workers allow only 6 simultaneous
// open connections per request, and a burst of Promise.all queries must stay
// under that.
export const getDb = cache(() => {
  let connectionString: string | undefined;
  try {
    const { env } = getCloudflareContext();
    connectionString = (env as { HYPERDRIVE?: { connectionString: string } })
      .HYPERDRIVE?.connectionString;
  } catch {
    // Not on Workers (plain `next dev` without bindings, tests) — fall through.
  }
  connectionString ??= process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "No database connection: set DATABASE_URL in .env (local) or bind HYPERDRIVE (Workers).",
    );
  }
  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 5, idleTimeoutMillis: 5_000 }),
  });
  // Close the request's pool once the response is flushed. after() is a no-op
  // outside a request scope (tests, scripts) — those leak nothing meaningful
  // since the process is short-lived.
  try {
    after(() => client.$disconnect());
  } catch {
    // No request scope (e.g. build-time / test) — disposal isn't needed.
  }
  return client;
});

// Call sites import `prisma` as a value; delegate property access to the
// per-request client so they don't have to care about request scoping.
export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    const client = getDb();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
