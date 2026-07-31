-- The mod-6 "Password-Locked Models walkthrough" lesson (c-plm-walkthrough)
-- was replaced by the guided paper item c-paper-plm-guided (same material,
-- restructured as a gated paper — see src/content/papers.data.ts). Progress
-- units are keyed by string content ids, so the old rows would silently stop
-- counting toward module completion. Carry each learner's row over to the new
-- id; if a learner already has a row for the new id, keep it and drop the
-- orphan. (The guided paper's five inserted lessons are new units — those
-- start fresh by design.)
--
-- Submission rows for the walkthrough's deleted c-plm-b* writing exercises
-- are deliberately NOT touched: the new item has no equivalent exercises, and
-- the rows hold learner writing (and possibly paid grader feedback) worth
-- preserving even though no UI currently surfaces them.
UPDATE "LessonProgress" lp
SET "lessonId" = 'c-paper-plm-guided'
WHERE lp."lessonId" = 'c-plm-walkthrough'
  AND NOT EXISTS (
    SELECT 1
    FROM "LessonProgress" existing
    WHERE existing."userId" = lp."userId"
      AND existing."lessonId" = 'c-paper-plm-guided'
  );

DELETE FROM "LessonProgress" WHERE "lessonId" = 'c-plm-walkthrough';
