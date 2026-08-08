import { describe, it, expect } from "vitest";
import { isMissingTableError } from "./db-missing-table";

/* The pages that read a hand-migrated table tell the reader to apply a
   migration. That sentence is only true for one error, so the predicate that
   triggers it has to be narrow: everything it lets through is a session sent
   to run SQL that is already applied. */
describe("isMissingTableError", () => {
  it("accepts the Postgres and Prisma codes for an undefined relation", () => {
    expect(isMissingTableError({ code: "42P01" })).toBe(true);
    expect(isMissingTableError({ code: "P2021" })).toBe(true);
    expect(isMissingTableError({ cause: { code: "42P01" } })).toBe(true);
    // A raw query: Prisma says P2010 and keeps the real code on meta.
    expect(
      isMissingTableError({
        code: "P2010",
        meta: { code: "42P01", message: 'relation "VerificationState" does not exist' },
      }),
    ).toBe(true);
  });

  it("rejects every other failure a live database can produce", () => {
    // Connection refused, auth failure, permission denied, a timeout, a bad
    // column after a partial migration, and the shapes with no code at all.
    for (const error of [
      { code: "ECONNREFUSED" },
      { code: "28P01" },
      { code: "42501" },
      { code: "57014" },
      { code: "42703" },
      { code: "P2022" },
      { cause: { code: "ECONNRESET" } },
      // A raw query that failed for a reason of its own.
      { code: "P2010", meta: { code: "42703", message: "column does not exist" } },
      new Error("connection terminated unexpectedly"),
      "not an error",
      null,
      undefined,
    ]) {
      expect(isMissingTableError(error), String(JSON.stringify(error))).toBe(
        false,
      );
    }
  });
});
