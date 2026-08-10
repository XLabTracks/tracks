-- The example and governance tracks were removed from the content graph
-- (1434372, 2026-08-10), but the classroom creation form had offered every
-- track, so Classroom rows may still be scoped to those ids. A stale
-- trackId resolves to an empty content-id universe: the instructor roster
-- rendered every student as 0/0 with no last-active date, and the student
-- view degraded to the "spans all tracks" copy while showing no progress.
-- NULL trackId *is* the all-tracks scope, so clearing the dead ids makes
-- the data say what the UI already falls back to.
--
-- ORDERING: apply any time relative to the deploy — the paired code change
-- (classrooms/[id]/page.tsx passes null for an unresolvable trackId) only
-- reads, and this targets exactly the two retired ids rather than
-- "NOT IN (current ids)", so tracks added later can never be swept up.
-- Re-runnable: a second pass matches nothing.

BEGIN;

UPDATE "Classroom"
SET "trackId" = NULL
WHERE "trackId" IN ('example', 'governance');

COMMIT;
