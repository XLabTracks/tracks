/**
 * Is this error Postgres saying the relation does not exist?
 *
 * The Verification pages that read a hand-migrated table render a stub naming
 * the migration when it is absent. That stub used to be shown for *any* query
 * error, which made it a lie the moment anything else went wrong: a
 * connection blip, a permissions error or a schema drift all reported "apply
 * the migration", and somebody who had already applied it had no way to tell.
 *
 * Postgres says 42P01 (undefined_table); Prisma wraps the same condition as
 * P2021. Which one surfaces depends on whether the driver adapter or the
 * engine raised it, so both count — and nothing else does.
 *
 * A raw query is a third wrapping of the same fact: Prisma reports P2010
 * ("raw query failed") and keeps the Postgres code on `meta`. The state route
 * is pure ORM now (an optimistic CAS loop), but the grader's advisory-lock
 * transaction still goes through $queryRaw against a hand-migrated table, so
 * the meta branch is what lets that path degrade to its maintenance message
 * instead of 500ing as an unknown failure.
 */
export function isMissingTableError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const code = (error as { code?: unknown }).code;
  if (code === "42P01" || code === "P2021") return true;
  // Driver-adapter errors carry the Postgres code on the cause instead;
  // raw-query failures carry it on meta.
  for (const key of ["cause", "meta"] as const) {
    const nested = (error as Record<string, unknown>)[key];
    if (typeof nested === "object" && nested !== null) {
      if ((nested as { code?: unknown }).code === "42P01") return true;
    }
  }
  return false;
}
