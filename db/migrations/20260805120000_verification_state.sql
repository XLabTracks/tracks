-- Per-user state for the standalone Verification site: completed unit ids and
-- the notebook, as one JSON document per user.
--
-- Deliberately not LessonProgress: that table is keyed by content-graph ids
-- and its action rejects anything else, while these unit ids ("0.1", "2.3")
-- belong to public/verification/data/course.js. Keeping them apart is also
-- what lets the course lift to another host — one row, one shape, no join.
--
-- Apply with the ADMIN role before deploying code that reads it:
--   psql "<direct-5432 url>" -f db/migrations/20260805120000_verification_state.sql

CREATE TABLE IF NOT EXISTS "VerificationState" (
  "userId"    TEXT         NOT NULL,
  "data"      JSONB        NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "VerificationState_pkey" PRIMARY KEY ("userId"),
  CONSTRAINT "VerificationState_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,

  -- A backstop for the route's own cap. The document is ids plus notebook
  -- text; only sketches (PNG dataURLs) can make it large, and a book of them
  -- should fail loudly here rather than quietly become a multi-megabyte row.
  CONSTRAINT "VerificationState_data_size" CHECK (pg_column_size("data") <= 2097152)
);
