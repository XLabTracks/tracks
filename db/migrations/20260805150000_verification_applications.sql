-- Applications to join a facilitated Verification cohort.
--
-- One row per (applicant, cohort): the unique constraint is what makes
-- applying twice an edit rather than a second queue entry, and what lets a
-- later cohort be a new row without disturbing an earlier decision.
--
-- The answers are JSON on purpose. The question list lives in
-- src/lib/verification/application.ts and is validated there, so adding or
-- rewording a question is a code change and never another migration.
--
-- Apply with the ADMIN role before deploying code that reads it:
--   psql "<direct-5432 url>" -f db/migrations/20260805150000_verification_applications.sql
--
-- Until it runs, /verification/enroll shows the form and every submit fails —
-- the page says the applications table is not ready rather than pretending to
-- have saved the answers.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VerificationApplicationStatus') THEN
    CREATE TYPE "VerificationApplicationStatus" AS ENUM (
      'submitted', 'accepted', 'waitlisted', 'declined', 'withdrawn'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "VerificationApplication" (
  "id"          TEXT                            NOT NULL,
  "userId"      TEXT                            NOT NULL,
  "cohort"      TEXT                            NOT NULL,
  "answers"     JSONB                           NOT NULL,
  "status"      "VerificationApplicationStatus" NOT NULL DEFAULT 'submitted',
  "note"        TEXT,
  "submittedAt" TIMESTAMP(3)                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3)                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "decidedAt"   TIMESTAMP(3),
  "decidedById" TEXT,

  CONSTRAINT "VerificationApplication_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VerificationApplication_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  -- The decider is kept as a reference, not a copy of their name: a reviewer
  -- who leaves should not take the decision's provenance with them, so the
  -- row survives with a null decider rather than being deleted.
  CONSTRAINT "VerificationApplication_decidedById_fkey" FOREIGN KEY ("decidedById")
    REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,

  -- A backstop for the action's own per-answer caps. The answers are short
  -- written responses; anything at this size is an attack or a bug.
  CONSTRAINT "VerificationApplication_answers_size" CHECK (pg_column_size("answers") <= 65536)
);

CREATE UNIQUE INDEX IF NOT EXISTS "VerificationApplication_userId_cohort_key"
  ON "VerificationApplication" ("userId", "cohort");

CREATE INDEX IF NOT EXISTS "VerificationApplication_cohort_status_idx"
  ON "VerificationApplication" ("cohort", "status");
