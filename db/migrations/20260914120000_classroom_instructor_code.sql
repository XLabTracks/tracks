-- A classroom's co-facilitator code: a second join code that enrols the
-- holder as an instructor instead of a student.
--
-- Nullable, and null is the normal state: a room only has one while its
-- facilitator is actively inviting somebody. Postgres unique indexes ignore
-- NULLs, so every existing classroom keeps a null here without colliding.
--
-- Apply this BEFORE deploying the code that reads it: Prisma selects every
-- column of Classroom by default, so the column missing would fail every
-- classroom read, not just the invite block.
ALTER TABLE "Classroom" ADD COLUMN IF NOT EXISTS "instructorCode" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Classroom_instructorCode_key"
  ON "Classroom" ("instructorCode");
