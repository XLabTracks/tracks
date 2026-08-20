-- Durable grading jobs for atomic duplicate suppression, real event-based
-- rate limits, and privacy-safe OpenRouter telemetry. Apply with the admin
-- role before deploying the matching code; until it exists, grading fails
-- closed with a maintenance message rather than making unmetered LLM calls.

CREATE TABLE IF NOT EXISTS "GradingAttempt" (
  "id"               TEXT         NOT NULL,
  "userId"           TEXT         NOT NULL,
  "submissionId"     TEXT         NOT NULL,
  "keySource"        TEXT         NOT NULL,
  "billingScope"     TEXT         NOT NULL,
  "requestedModel"   TEXT         NOT NULL,
  "resolvedModel"    TEXT,
  "provider"         TEXT,
  "status"           TEXT         NOT NULL DEFAULT 'pending',
  "errorCode"        TEXT,
  "requestId"        TEXT,
  "promptTokens"     INTEGER,
  "completionTokens" INTEGER,
  "totalTokens"      INTEGER,
  "latencyMs"        INTEGER,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt"       TIMESTAMP(3),

  CONSTRAINT "GradingAttempt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GradingAttempt_status_check"
    CHECK ("status" IN ('pending', 'succeeded', 'failed')),
  CONSTRAINT "GradingAttempt_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "GradingAttempt_submissionId_fkey" FOREIGN KEY ("submissionId")
    REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "GradingAttempt_userId_keySource_createdAt_idx"
  ON "GradingAttempt"("userId", "keySource", "createdAt");
CREATE INDEX IF NOT EXISTS "GradingAttempt_billingScope_createdAt_idx"
  ON "GradingAttempt"("billingScope", "createdAt");
CREATE INDEX IF NOT EXISTS "GradingAttempt_submissionId_createdAt_idx"
  ON "GradingAttempt"("submissionId", "createdAt");

-- The application releases this slot when the request finishes. A crashed
-- Worker leaves a pending row, which the next claim expires after its bounded
-- lease before trying again.
CREATE UNIQUE INDEX IF NOT EXISTS "GradingAttempt_one_pending_per_submission"
  ON "GradingAttempt"("submissionId") WHERE "status" = 'pending';
