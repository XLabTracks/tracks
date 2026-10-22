-- Instructor grades: a classroom instructor's rubric grade on one student's
-- submitted writing. One row per (classroom, submission), so a student in two
-- classrooms can be graded by each. "criteria" is a JSONB array of
-- { id, score (0-3 or null for N/A), note } over the reasoning-transparency
-- rubric; the /45 total is derived at read time and never stored.
-- "responseHash" fingerprints the writing that was graded, so a resubmission
-- with different text shows the grade as given on an earlier version.
--
-- Apply with the ADMIN role before deploying the code that reads it:
--   psql "<direct-5432 admin url>" -f db/migrations/20261022120000_instructor_grades.sql
--
-- Until applied, the feature fails closed: the student page tells instructors
-- the migration is owed, grading reports the same instead of pretending to
-- save, and learners see no instructor feedback.

CREATE TABLE IF NOT EXISTS "InstructorGrade" (
  "id"           TEXT NOT NULL,
  "classroomId"  TEXT NOT NULL,
  "submissionId" TEXT NOT NULL,
  "graderId"     TEXT,
  "criteria"     JSONB NOT NULL,
  "comment"      TEXT,
  "responseHash" TEXT NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "InstructorGrade_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "InstructorGrade_classroomId_fkey" FOREIGN KEY ("classroomId")
    REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "InstructorGrade_submissionId_fkey" FOREIGN KEY ("submissionId")
    REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  -- SET NULL, not CASCADE: the grader's account leaving must not take the
  -- feedback they gave with it.
  CONSTRAINT "InstructorGrade_graderId_fkey" FOREIGN KEY ("graderId")
    REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  -- Backstops for the caps saveInstructorGrade enforces.
  CONSTRAINT "InstructorGrade_comment_check" CHECK ("comment" IS NULL OR length("comment") <= 4000),
  CONSTRAINT "InstructorGrade_criteria_size" CHECK (pg_column_size("criteria") <= 16384)
);

CREATE UNIQUE INDEX IF NOT EXISTS "InstructorGrade_classroomId_submissionId_key"
  ON "InstructorGrade" ("classroomId", "submissionId");
CREATE INDEX IF NOT EXISTS "InstructorGrade_submissionId_idx"
  ON "InstructorGrade" ("submissionId");
