import { Prisma, PrismaClient } from "@prisma/client";
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
  // connectionTimeoutMillis is not optional here: node-postgres defaults it to
  // 0, meaning wait forever. An origin that drops packets rather than refusing
  // them — a paused branch, a Hyperdrive hiccup — then parks the request until
  // the platform kills it, and the reader sees a page that never finishes
  // rather than one that degrades. Bounded, it surfaces as a failed read, which
  // every DB call site here is already written to absorb.
  const client = new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      max: 5,
      idleTimeoutMillis: 5_000,
      // Generous next to a healthy connect (Hyperdrive answers in
      // milliseconds) and short enough that an outage costs a reader seconds
      // rather than the whole request: this bound IS the worst-case delay
      // before a page degrades to its signed-out rendering.
      connectionTimeoutMillis: 5_000,
    }),
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

/**
 * A unique-constraint violation: the row a create raced on already exists.
 * Prisma surfaces it as P2002 — including on the driver-adapter path this
 * app always uses (adapter-pg maps Postgres 23505 to P2002). Callers that
 * race on a unique key catch this and converge on the existing row (or
 * retry with a fresh value); anything else must propagate — swallowing a
 * connection/validation error would report "saved" while nothing persisted.
 */
export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

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
