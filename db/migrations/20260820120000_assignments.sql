-- Classroom assignments: an instructor's selection of module items (lessons
-- and papers) for their students, with an optional due date and note.
-- "contentIds" is an ordered JSONB array of content-graph ids — code-defined
-- string ids with no FK, the LessonProgress."lessonId" convention; the action
-- validates every id against the graph before writing. Completion is never
-- stored: it is derived at read time from the students' existing
-- LessonProgress rows, so this table carries only the instructor's ask.
--
-- Apply with the ADMIN role before deploying the code that reads it:
--   psql "<direct-5432 admin url>" -f db/migrations/20260820120000_assignments.sql
--
-- Until applied, the feature fails closed: the classroom page tells
-- instructors the migration is owed, students see no assignments section, and
-- creating an assignment reports the same instead of pretending to save.

CREATE TABLE IF NOT EXISTS "Assignment" (
  "id"          TEXT NOT NULL,
  "classroomId" TEXT NOT NULL,
  "createdById" TEXT,
  "title"       TEXT NOT NULL,
  "note"        TEXT,
  "contentIds"  JSONB NOT NULL,
  "dueAt"       TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Assignment_classroomId_fkey" FOREIGN KEY ("classroomId")
    REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  -- SET NULL, not CASCADE: the author's account leaving must not take the
  -- classroom's assignments with it.
  CONSTRAINT "Assignment_createdById_fkey" FOREIGN KEY ("createdById")
    REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  -- Backstops for the caps createAssignment enforces (title 120, note 2000,
  -- at most 100 content ids).
  CONSTRAINT "Assignment_title_check" CHECK (length("title") <= 120),
  CONSTRAINT "Assignment_note_check" CHECK ("note" IS NULL OR length("note") <= 2000),
  CONSTRAINT "Assignment_contentIds_size" CHECK (pg_column_size("contentIds") <= 16384)
);

CREATE INDEX IF NOT EXISTS "Assignment_classroomId_idx" ON "Assignment" ("classroomId");
