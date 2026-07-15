-- Drop two secondary indexes that are strict left-prefixes of an existing
-- unique constraint, so Postgres already serves every query from the unique's
-- b-tree. They only added write amplification on the two hottest write tables.
--
--   LessonProgress_userId_idx          ⊂ LessonProgress_userId_lessonId_key (userId, lessonId)
--   Submission_userId_contentId_idx    ⊂ Submission_userId_contentId_kind_key (userId, contentId, kind)
--
-- Apply manually with psql against the DIRECT port (5432, admin role) before
-- deploying the matching schema.prisma change — never via `prisma migrate`.
-- Tables are small, so the momentary lock is negligible (no CONCURRENTLY).

DROP INDEX IF EXISTS "LessonProgress_userId_idx";
DROP INDEX IF EXISTS "Submission_userId_contentId_idx";
