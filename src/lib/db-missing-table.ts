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
 */
export function isMissingTableError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const code = (error as { code?: unknown }).code;
  if (code === "42P01" || code === "P2021") return true;
  // Driver-adapter errors carry the Postgres code on the cause instead.
  const cause = (error as { cause?: unknown }).cause;
  return typeof cause === "object" && cause !== null
    ? (cause as { code?: unknown }).code === "42P01"
    : false;
}
