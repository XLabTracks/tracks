import { afterEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";
import type { HighlightArtifactContext } from "@/lib/highlights/artifact";
import {
  HIGHLIGHT_MAX_PER_ITEM,
  HIGHLIGHT_MAX_PER_USER,
} from "@/lib/highlights/types";

// Locks the direct-POST hardening: createHighlight persists nothing that
// disagrees with the paper's committed artifact (anchor, bounds, snippet,
// converter version), caps hold and return their discriminant, and
// note/delete scope to the caller's own rows via the predicate.
// @prisma/client is deliberately NOT mocked — the mocked isUniqueViolation
// mirrors the real db.ts helper's instanceof + P2002 check.

const {
  prisma,
  getCurrentUser,
  getPaperById,
  getLinkedReading,
  linkedReadingSource,
  getHighlightArtifactContext,
} = vi.hoisted(() => ({
    prisma: {
      highlight: {
        count: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
        deleteMany: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    getCurrentUser: vi.fn(),
    getPaperById: vi.fn(),
    getLinkedReading: vi.fn(),
    linkedReadingSource: vi.fn(),
    getHighlightArtifactContext: vi.fn(),
  }));

vi.mock("@/lib/db", () => ({
  prisma,
  isUniqueViolation: (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002",
}));
vi.mock("@/lib/auth", () => ({ getCurrentUser }));
vi.mock("@/lib/content", () => ({ getPaperById }));
vi.mock("@/lib/readings/registry", () => ({
  getLinkedReading,
  linkedReadingSource,
}));
vi.mock("@/lib/highlights/artifact", () => ({ getHighlightArtifactContext }));

import {
  createHighlight,
  deleteHighlight,
  updateHighlightNote,
} from "./highlights";

afterEach(() => vi.clearAllMocks());

const context: HighlightArtifactContext = {
  artifactKey: "2301.12345v2",
  convVersion: 21,
  blocks: new Map([
    [
      "b-0042",
      {
        anchor: "b-0042",
        tag: "p",
        text: "First sentence. Second sentence. Third sentence.",
        sentences: ["First sentence.", "Second sentence.", "Third sentence."],
      },
    ],
  ]),
};

const span = {
  blockAnchor: "b-0042",
  sStart: 1,
  sEnd: 2,
  startOffset: 0,
  endOffset: -1,
  snippet: "First sentence. Second sentence.",
};

const input = {
  spans: [span],
  note: null,
  convVersion: 21,
};

/** The valid payload with its single span partially overridden. */
const withSpan = (patch: object) => ({ ...input, spans: [{ ...span, ...patch }] });

/** Happy-path mocks: signed in, paper resolves, artifact context resolves. */
function arm(): void {
  getCurrentUser.mockResolvedValue({ id: "u1" });
  // The action resolves the id to the paper's SOURCE (highlightSourceOf).
  getPaperById.mockReturnValue({
    id: "p1",
    source: { kind: "arxiv", arxivId: "2301.12345v2" },
  });
  getHighlightArtifactContext.mockResolvedValue(context);
  prisma.highlight.count.mockResolvedValue(0);
  prisma.highlight.create.mockResolvedValue({ id: "h-new" });
  prisma.$transaction.mockImplementation((ops: Promise<unknown>[]) =>
    Promise.all(ops),
  );
}

describe("createHighlight", () => {
  it("returns null when signed out (no reads, no writes)", async () => {
    getCurrentUser.mockResolvedValue(null);
    expect(await createHighlight("p1", input)).toBeNull();
    expect(prisma.highlight.count).not.toHaveBeenCalled();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("rejects content ids that resolve to no pinned artifact", async () => {
    arm();
    getPaperById.mockReturnValue(undefined);
    expect(await createHighlight("some-lesson", input)).toBeNull();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("accepts linked-reading content ids via the registry", async () => {
    arm();
    getPaperById.mockReturnValue(undefined);
    getLinkedReading.mockReturnValue({
      kind: "lesswrong",
      id: "site__post",
      url: "https://example.org/posts/x/y",
      title: "T",
    });
    linkedReadingSource.mockReturnValue({
      kind: "lesswrong",
      postUrl: "https://example.org/posts/x/y",
    });
    expect(await createHighlight("reading-site__post", input)).toEqual({
      groupId: expect.any(String),
      ids: ["h-new"],
    });
    // The registry is consulted with the shell prefix stripped.
    expect(getLinkedReading).toHaveBeenCalledWith("site__post");
  });

  it("rejects reading ids the registry doesn't know", async () => {
    arm();
    getPaperById.mockReturnValue(undefined);
    getLinkedReading.mockReturnValue(undefined);
    expect(await createHighlight("reading-nope", input)).toBeNull();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("rejects malformed payloads before touching the artifact", async () => {
    arm();
    expect(
      await createHighlight("p1", withSpan({ blockAnchor: "nope" })),
    ).toBeNull();
    expect(getHighlightArtifactContext).not.toHaveBeenCalled();
  });

  it("flags a stale converter version distinguishably", async () => {
    arm();
    expect(await createHighlight("p1", { ...input, convVersion: 20 })).toEqual({
      error: "stale",
    });
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("rejects an anchor the artifact does not have", async () => {
    arm();
    expect(
      await createHighlight("p1", withSpan({ blockAnchor: "b-9999" })),
    ).toBeNull();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("rejects a sentence range that runs off the block", async () => {
    arm();
    expect(await createHighlight("p1", withSpan({ sEnd: 4 }))).toBeNull();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("rejects a snippet that is not what those sentences say", async () => {
    arm();
    expect(
      await createHighlight("p1", withSpan({ snippet: "Tampered text." })),
    ).toBeNull();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("accepts a partial-word slice whose snippet matches exactly", async () => {
    arm();
    expect(
      await createHighlight(
        "p1",
        withSpan({
          sStart: 1,
          sEnd: 2,
          startOffset: 6,
          endOffset: 6,
          snippet: "sentence. Second",
        }),
      ),
    ).toEqual({ groupId: expect.any(String), ids: ["h-new"] });
  });

  it("rejects offsets that run off their sentences", async () => {
    arm();
    // "First sentence." is 15 chars — startOffset must stay inside it.
    expect(
      await createHighlight("p1", withSpan({ startOffset: 15 })),
    ).toBeNull();
    expect(
      await createHighlight("p1", withSpan({ endOffset: 200 })),
    ).toBeNull();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("rejects a partial snippet that doesn't match the slice", async () => {
    arm();
    expect(
      await createHighlight(
        "p1",
        withSpan({ startOffset: 6, endOffset: 6, snippet: "sentence. Wrong" }),
      ),
    ).toBeNull();
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("flags the per-item cap distinguishably without inserting", async () => {
    arm();
    // First count in the Promise.all is the per-item one.
    prisma.highlight.count
      .mockResolvedValueOnce(HIGHLIGHT_MAX_PER_ITEM)
      .mockResolvedValueOnce(HIGHLIGHT_MAX_PER_ITEM);
    expect(await createHighlight("p1", input)).toEqual({ error: "cap" });
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("flags the global per-user cap distinguishably without inserting", async () => {
    arm();
    prisma.highlight.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(HIGHLIGHT_MAX_PER_USER);
    expect(await createHighlight("p1", input)).toEqual({ error: "cap" });
    expect(prisma.highlight.create).not.toHaveBeenCalled();
  });

  it("inserts a valid group with server-derived values and returns its ids", async () => {
    arm();
    expect(await createHighlight("p1", input)).toEqual({
      groupId: expect.any(String),
      ids: ["h-new"],
    });
    expect(prisma.highlight.create).toHaveBeenCalledWith({
      data: {
        userId: "u1",
        contentId: "p1",
        groupId: expect.any(String),
        // Server-derived — the client's claim is never trusted.
        artifactKey: context.artifactKey,
        convVersion: input.convVersion,
        blockAnchor: span.blockAnchor,
        sStart: span.sStart,
        sEnd: span.sEnd,
        startOffset: span.startOffset,
        endOffset: span.endOffset,
        snippet: span.snippet,
        // The head row owns the group's note.
        note: null,
      },
      select: { id: true },
    });
  });

  it("persists one row per span for a multi-paragraph gesture", async () => {
    arm();
    const second = {
      ...span,
      blockAnchor: "b-0050",
      snippet: "Third sentence.",
      sStart: 3,
      sEnd: 3,
    };
    context.blocks.set("b-0050", {
      anchor: "b-0050",
      tag: "p",
      text: "First sentence. Second sentence. Third sentence.",
      sentences: ["First sentence.", "Second sentence.", "Third sentence."],
    });
    prisma.highlight.create
      .mockResolvedValueOnce({ id: "h-1" })
      .mockResolvedValueOnce({ id: "h-2" });
    expect(
      await createHighlight("p1", { ...input, spans: [span, second] }),
    ).toEqual({ groupId: expect.any(String), ids: ["h-1", "h-2"] });
    expect(prisma.highlight.create).toHaveBeenCalledTimes(2);
    // Both rows share one groupId; only the head carries the note slot.
    const [first, tail] = prisma.highlight.create.mock.calls.map(
      (call) => (call[0] as { data: Record<string, unknown> }).data,
    );
    expect(first.groupId).toEqual(tail.groupId);
    context.blocks.delete("b-0050");
  });

  it("reconciles a duplicate gesture to the existing row's id without rewriting it", async () => {
    arm();
    prisma.highlight.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("dup", {
        code: "P2002",
        clientVersion: "test",
      }),
    );
    prisma.highlight.findUnique.mockResolvedValue({
      id: "existing",
      groupId: "existing-group",
      snippet: span.snippet,
    });
    expect(await createHighlight("p1", input)).toEqual({
      groupId: "existing-group",
      ids: ["existing"],
    });
    expect(prisma.highlight.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userSpan: {
            userId: "u1",
            contentId: "p1",
            blockAnchor: "b-0042",
            sStart: 1,
            sEnd: 2,
            startOffset: 0,
            endOffset: -1,
          },
        },
      }),
    );
    // A true duplicate: the stored row already says the same thing.
    expect(prisma.highlight.update).not.toHaveBeenCalled();
  });

  it("converges a stale colliding row on the just-validated snippet", async () => {
    // Post-rebuild collision: the row at these coordinates holds a snippet
    // from an older artifact. The posted one was validated above, so the row
    // must be updated to current truth, not returned stale.
    arm();
    prisma.highlight.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("dup", {
        code: "P2002",
        clientVersion: "test",
      }),
    );
    prisma.highlight.findUnique.mockResolvedValue({
      id: "existing",
      groupId: "existing-group",
      snippet: "Text from an older artifact.",
    });
    expect(await createHighlight("p1", input)).toEqual({
      groupId: "existing-group",
      ids: ["existing"],
    });
    expect(prisma.highlight.update).toHaveBeenCalledWith({
      where: { id: "existing" },
      data: {
        snippet: span.snippet,
        artifactKey: context.artifactKey,
        convVersion: input.convVersion,
      },
    });
  });

  it("rethrows non-duplicate insert errors", async () => {
    arm();
    prisma.highlight.create.mockRejectedValue(new Error("connection reset"));
    await expect(createHighlight("p1", input)).rejects.toThrow(
      "connection reset",
    );
    expect(prisma.highlight.findUnique).not.toHaveBeenCalled();
  });
});

describe("updateHighlightNote", () => {
  it("returns false when signed out or on a bogus id (no write)", async () => {
    getCurrentUser.mockResolvedValue(null);
    expect(await updateHighlightNote("h1", "note")).toBe(false);
    getCurrentUser.mockResolvedValue({ id: "u1" });
    expect(await updateHighlightNote("", "note")).toBe(false);
    expect(await updateHighlightNote("x".repeat(65), "note")).toBe(false);
    expect(await updateHighlightNote(42 as never, "note")).toBe(false);
    expect(prisma.highlight.updateMany).not.toHaveBeenCalled();
  });

  it("rejects unstorable notes (no write)", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    expect(await updateHighlightNote("h1", 42)).toBe(false);
    expect(prisma.highlight.updateMany).not.toHaveBeenCalled();
  });

  it("scopes the write to the caller's own row and reports the outcome", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.highlight.updateMany.mockResolvedValue({ count: 1 });
    expect(await updateHighlightNote("h1", "worth remembering")).toBe(true);
    expect(prisma.highlight.updateMany).toHaveBeenCalledWith({
      where: { id: "h1", userId: "u1" },
      data: { note: "worth remembering" },
    });
    // Someone else's id (or a deleted row) matches nothing.
    prisma.highlight.updateMany.mockResolvedValue({ count: 0 });
    expect(await updateHighlightNote("not-mine", "x")).toBe(false);
  });

  it("clears the note on null", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.highlight.updateMany.mockResolvedValue({ count: 1 });
    expect(await updateHighlightNote("h1", null)).toBe(true);
    expect(prisma.highlight.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { note: null } }),
    );
  });
});

describe("deleteHighlight", () => {
  it("returns false when signed out or on a bogus id (no delete)", async () => {
    getCurrentUser.mockResolvedValue(null);
    expect(await deleteHighlight("h1")).toBe(false);
    getCurrentUser.mockResolvedValue({ id: "u1" });
    expect(await deleteHighlight("")).toBe(false);
    expect(prisma.highlight.deleteMany).not.toHaveBeenCalled();
  });

  it("deletes only the caller's own group and reports the outcome", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    prisma.highlight.deleteMany.mockResolvedValue({ count: 2 });
    expect(await deleteHighlight("g1")).toBe(true);
    expect(prisma.highlight.deleteMany).toHaveBeenCalledWith({
      where: { groupId: "g1", userId: "u1" },
    });
    prisma.highlight.deleteMany.mockResolvedValue({ count: 0 });
    expect(await deleteHighlight("not-mine")).toBe(false);
  });
});
