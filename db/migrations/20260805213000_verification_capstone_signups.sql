-- Capstone sign-ups: which brief a learner committed to, or the idea they
-- proposed instead — the sheet facilitators read.
--
-- One row per user: the unique constraint is what makes signing up twice an
-- edit rather than a second entry. briefSlug is a capstone-bank slug, a
-- content id with no FK into the content graph — the bank is code, and the
-- action validates the slug against it on write.
--
-- Apply with the ADMIN role before deploying code that reads it:
--   psql "<direct-5432 url>" -f db/migrations/20260805213000_verification_capstone_signups.sql
--
-- Until it runs, /verification/capstone-signup says the table is not ready
-- rather than pretending to have saved anything.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VerificationCapstoneStatus') THEN
    CREATE TYPE "VerificationCapstoneStatus" AS ENUM ('submitted', 'withdrawn');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "VerificationCapstoneSignup" (
  "id"        TEXT                         NOT NULL,
  "userId"    TEXT                         NOT NULL,
  "briefSlug" TEXT,
  "proposal"  TEXT,
  "status"    "VerificationCapstoneStatus" NOT NULL DEFAULT 'submitted',
  "createdAt" TIMESTAMP(3)                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3)                 NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "VerificationCapstoneSignup_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VerificationCapstoneSignup_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,

  -- A backstop for the action's own cap. A proposal is a short pitch;
  -- anything at this size is an attack or a bug.
  CONSTRAINT "VerificationCapstoneSignup_proposal_size" CHECK (length("proposal") <= 8192)
);

CREATE UNIQUE INDEX IF NOT EXISTS "VerificationCapstoneSignup_userId_key"
  ON "VerificationCapstoneSignup" ("userId");
