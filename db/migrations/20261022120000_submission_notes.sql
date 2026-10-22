-- An instructor's annotations on a learner's work: a private read for the
-- room's own instructors, and feedback the learner is given back. Visibility
-- is per note, not per instructor, because those are two different documents
-- about the same piece of writing.
--
-- "targetId" is a string content id with no FK, the LessonProgress."lessonId"
-- convention: a writing exercise id, an assessment id, or a memo-desk slot
-- id. It deliberately does not reference Submission(id) — the memo drafts are
-- course work and have no Submission row — and "targetKind" says which
-- register the id belongs to, which the action validates before writing.
--
-- Apply with the ADMIN role before deploying the code that reads it:
--   psql "<direct-5432 admin url>" -f db/migrations/20261022120000_submission_notes.sql
--
-- Until applied, the feature fails closed: the instructor's view of a learner
-- says the migration is owed instead of offering a box that cannot save, and
-- no learner is shown feedback that does not exist.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SubmissionNoteVisibility') THEN
    CREATE TYPE "SubmissionNoteVisibility" AS ENUM ('private_note', 'shared');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "SubmissionNote" (
  "id"          TEXT NOT NULL,
  "classroomId" TEXT NOT NULL,
  "studentId"   TEXT NOT NULL,
  "authorId"    TEXT,
  "targetId"    TEXT NOT NULL,
  "targetKind"  TEXT NOT NULL,
  "body"        TEXT NOT NULL,
  "visibility"  "SubmissionNoteVisibility" NOT NULL DEFAULT 'private_note',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SubmissionNote_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SubmissionNote_classroomId_fkey" FOREIGN KEY ("classroomId")
    REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "SubmissionNote_studentId_fkey" FOREIGN KEY ("studentId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  -- SET NULL, not CASCADE: an instructor's account leaving must not delete
  -- the feedback their learners were given.
  CONSTRAINT "SubmissionNote_authorId_fkey" FOREIGN KEY ("authorId")
    REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  -- Backstops for the caps saveSubmissionNote enforces.
  CONSTRAINT "SubmissionNote_body_check" CHECK (length("body") BETWEEN 1 AND 4000),
  CONSTRAINT "SubmissionNote_targetId_check" CHECK (length("targetId") BETWEEN 1 AND 200),
  CONSTRAINT "SubmissionNote_targetKind_check"
    CHECK ("targetKind" IN ('exercise', 'assessment', 'memo'))
);

-- The instructor's view of one learner reads the whole room's notes for them.
CREATE INDEX IF NOT EXISTS "SubmissionNote_classroomId_studentId_idx"
  ON "SubmissionNote"("classroomId", "studentId");

-- A learner's own pages read only what was shared with them, across rooms.
CREATE INDEX IF NOT EXISTS "SubmissionNote_studentId_visibility_idx"
  ON "SubmissionNote"("studentId", "visibility");
