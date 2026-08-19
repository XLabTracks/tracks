-- Module 1 promoted the linked reading "How might we safely pass the buck
-- to AI?" to a full course paper (src/content/papers.data.ts), dropping its
-- linked-readings registry entry: the post behind
-- /readings/lesswrong__TTFsKxQThrqgWeXYJ now lives at the course item
-- c-pass-the-buck (the /readings route redirects there). Highlights key on
-- string content ids — "reading-<artifactId>" in the /readings viewer, the
-- paper id on course pages — so rows made in the old viewer would silently
-- vanish from the course page. Carry them over; both surfaces validate
-- against the same committed artifact, so artifactKey/anchors/sentence
-- offsets transfer unchanged and only contentId needs rewriting.
--
-- ORDERING: apply AFTER deploying this branch. No code depends on this
-- remap (it is pure data motion), but this remap depends on the deployed
-- /readings redirect — that is what stops new reading-side writes.
-- Migrating first would leave the old viewer live and still stranding
-- fresh rows under the dead reading-side ids. The whole file is one
-- transaction (psql -f would otherwise autocommit per statement, letting
-- rows land between the collision pass and the remap) and is re-runnable:
-- a second run is a no-op, and any late reading-side rows that do turn up
-- get remapped under the same rules on the next run.
--
-- Collisions on the user-span unique key ("Highlight_user_span_key":
-- userId, contentId, blockAnchor, sStart, sEnd, startOffset, endOffset) —
-- the learner highlighted the same span on both surfaces. One row must go,
-- but note text is never destroyed:
--   * exactly one row carries a note -> that row wins;
--   * both carry notes              -> the newer row wins (updatedAt, then
--     createdAt, then id) and the older note is appended to it, clearly
--     delimited;
--   * neither carries a note        -> the paper-side row wins (it is the
--     row the learner currently sees and edits on the only surface still
--     reachable).
-- The loser is deleted; dropping one span of a multi-span group leaves its
-- other rows intact (the panel renders whatever rows a group still has).

BEGIN;

CREATE TEMP TABLE "_remap" ("oldId" TEXT NOT NULL, "newId" TEXT NOT NULL)
    ON COMMIT DROP;
INSERT INTO "_remap" VALUES
    ('reading-lesswrong__TTFsKxQThrqgWeXYJ', 'c-pass-the-buck');

-- Pair every reading-side row with its colliding paper-side row (at most
-- one each way — the unique key holds per contentId on both sides) and
-- pick the winner per the policy above. Empty-string notes count as
-- note-less.
CREATE TEMP TABLE "_collisions" ON COMMIT DROP AS
SELECT
    w."winnerId",
    CASE WHEN w."winnerId" = r."id" THEN p."id" ELSE r."id" END AS "loserId",
    CASE WHEN w."winnerId" = r."id" THEN NULLIF(p."note", '')
         ELSE NULLIF(r."note", '') END AS "loserNote"
FROM "Highlight" r
JOIN "_remap" m ON m."oldId" = r."contentId"
JOIN "Highlight" p
    ON  p."userId" = r."userId"
    AND p."contentId" = m."newId"
    AND p."blockAnchor" = r."blockAnchor"
    AND p."sStart" = r."sStart"
    AND p."sEnd" = r."sEnd"
    AND p."startOffset" = r."startOffset"
    AND p."endOffset" = r."endOffset"
CROSS JOIN LATERAL (
    SELECT CASE
        WHEN NULLIF(r."note", '') IS NOT NULL AND NULLIF(p."note", '') IS NULL
            THEN r."id"
        WHEN NULLIF(p."note", '') IS NOT NULL AND NULLIF(r."note", '') IS NULL
            THEN p."id"
        WHEN NULLIF(r."note", '') IS NOT NULL AND NULLIF(p."note", '') IS NOT NULL
            THEN CASE
                WHEN (r."updatedAt", r."createdAt", r."id")
                   > (p."updatedAt", p."createdAt", p."id")
                THEN r."id" ELSE p."id"
            END
        ELSE p."id"
    END AS "winnerId"
) w;

-- Both-notes collisions: append the older note to the winner. Two
-- app-capped notes can together exceed the 2000-char check, so re-add it
-- NOT VALID — merged rows are grandfathered while every future write stays
-- capped (the app writes whole notes, never appends).
ALTER TABLE "Highlight" DROP CONSTRAINT IF EXISTS "Highlight_note_len";

UPDATE "Highlight" h
SET "note" = h."note"
    || E'\n\n--- earlier note on this highlight, carried over from its duplicate ---\n'
    || c."loserNote"
FROM "_collisions" c
WHERE h."id" = c."winnerId"
  AND c."loserNote" IS NOT NULL;

ALTER TABLE "Highlight"
    ADD CONSTRAINT "Highlight_note_len" CHECK (char_length("note") <= 2000) NOT VALID;

-- Drop the losing side of every collision...
DELETE FROM "Highlight" h
USING "_collisions" c
WHERE h."id" = c."loserId";

-- ...then every surviving reading-side row remaps cleanly: its span is now
-- free under the paper id.
UPDATE "Highlight" h
SET "contentId" = m."newId"
FROM "_remap" m
WHERE h."contentId" = m."oldId";

COMMIT;
