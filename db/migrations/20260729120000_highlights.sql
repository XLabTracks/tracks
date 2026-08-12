-- User text highlights on paper items and linked readings, with an optional
-- note per highlight gesture. One gesture = one GROUP: a multi-paragraph
-- selection stores one row per touched block, all sharing a groupId
-- (single-block gestures are a group of one); the note lives on the group's
-- head row and deletion is by group. Anchoring is character-precise on the
-- artifact annotation contract: blockAnchor ("b-NNNN") + a data-s sentence
-- range, narrowed by offsets into the edge sentences' NORMALIZED text
-- (startOffset 0 = sentence start; endOffset -1 = "to the end of sEnd" —
-- the HIGHLIGHT_END_OF_SENTENCE sentinel, so whole-sentence rows stay one
-- canonical shape). snippet is the capped normalized slice text and the
-- render-time drift tripwire (paint only on match — rebuilds orphan
-- highlights, never misplace them); artifactKey/convVersion record what the
-- anchor was captured against. Char caps mirror the constants in
-- src/lib/highlights/types.ts; count caps live in the create action.

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "artifactKey" TEXT NOT NULL,
    "convVersion" INTEGER NOT NULL,
    "blockAnchor" TEXT NOT NULL,
    "sStart" INTEGER NOT NULL,
    "sEnd" INTEGER NOT NULL,
    "startOffset" INTEGER NOT NULL DEFAULT 0,
    "endOffset" INTEGER NOT NULL DEFAULT -1,
    "snippet" TEXT NOT NULL,
    "note" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Highlight_snippet_len" CHECK (char_length("snippet") <= 300),
    CONSTRAINT "Highlight_note_len" CHECK (char_length("note") <= 2000),
    CONSTRAINT "Highlight_sentence_range" CHECK ("sStart" >= 1 AND "sEnd" >= "sStart"),
    CONSTRAINT "Highlight_offsets" CHECK ("startOffset" >= 0 AND "endOffset" >= -1 AND "endOffset" <> 0)
);

-- CreateIndex (unique: serves userId/userId+contentId reads as a prefix and
-- blocks exact-duplicate flooding of one span; named — the seven-column
-- default identifier would exceed Postgres's 63-char limit)
CREATE UNIQUE INDEX "Highlight_user_span_key"
    ON "Highlight"("userId", "contentId", "blockAnchor", "sStart", "sEnd", "startOffset", "endOffset");

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
