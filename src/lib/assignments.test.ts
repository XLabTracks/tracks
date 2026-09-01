// Pins the derivation rules assignments rely on: only module items resolve
// (inserted lessons and unknown ids never do), a paper's done-ness requires
// its inserted lessons, stale ids shrink the item list but are counted, and
// a due date holds through the whole UTC day it names.
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ prisma: {} }));

import {
  assignmentDone,
  assignmentItemDone,
  isPastDue,
  parseDueDate,
  parseStoredContentIds,
  resolveAssignmentItem,
  sectionIdOf,
  type AssignmentView,
} from "./assignments";
import {
  getContentLocation,
  getInsertedLessonsForPaper,
  getItemsForModule,
  getModulesForTrack,
  itemIdOf,
  papers,
  tracks,
} from "@/lib/content";

function firstModuleItemId(): string {
  for (const track of tracks) {
    for (const mod of getModulesForTrack(track.id)) {
      const [item] = getItemsForModule(mod.id);
      if (item) return itemIdOf(item);
    }
  }
  throw new Error("content graph has no module items");
}

describe("resolveAssignmentItem", () => {
  it("resolves a real module item with its title, href, and progress units", () => {
    const id = firstModuleItemId();
    const resolved = resolveAssignmentItem(id);
    expect(resolved).not.toBeNull();
    expect(resolved!.id).toBe(id);
    expect(resolved!.title).toBeTruthy();
    expect(resolved!.href).toBe(getContentLocation(id)!.href);
    expect(resolved!.progressIds).toContain(id);
  });

  it("returns null for an id outside the content graph", () => {
    expect(resolveAssignmentItem("not-a-real-content-id")).toBeNull();
  });

  it("a section head answers for its subsections (the groupDone rule)", () => {
    for (const track of tracks) {
      for (const mod of getModulesForTrack(track.id)) {
        const items = getItemsForModule(mod.id);
        const head = items.find((it) =>
          items.some((child) => sectionIdOf(child) === itemIdOf(it)),
        );
        if (!head) continue;
        const headId = itemIdOf(head);
        const resolved = resolveAssignmentItem(headId);
        expect(resolved).not.toBeNull();
        for (const child of items.filter(
          (c) => sectionIdOf(c) === headId,
        )) {
          expect(resolved!.progressIds).toContain(itemIdOf(child));
        }
        return;
      }
    }
    // No section heads in the current graph — nothing to pin.
  });

  it("returns null for a paper's inserted lesson (it rides with its paper)", () => {
    const paper = papers.find(
      (p) => getInsertedLessonsForPaper(p.id).length > 0,
    );
    if (!paper) return; // no paper with inserted lessons in the current graph
    const inserted = getInsertedLessonsForPaper(paper.id)[0];
    expect(resolveAssignmentItem(inserted.id)).toBeNull();
    expect(resolveAssignmentItem(paper.id)!.progressIds).toContain(inserted.id);
  });
});

describe("parseStoredContentIds", () => {
  it("keeps only strings and tolerates non-array junk", () => {
    expect(parseStoredContentIds(["a", 1, null, "b"])).toEqual(["a", "b"]);
    expect(parseStoredContentIds({ a: 1 })).toEqual([]);
    expect(parseStoredContentIds(null)).toEqual([]);
  });
});

describe("parseDueDate", () => {
  it("maps empty to null (no due date)", () => {
    expect(parseDueDate("")).toBeNull();
  });

  it("parses a date to midnight UTC", () => {
    expect(parseDueDate("2026-08-22")?.toISOString()).toBe(
      "2026-08-22T00:00:00.000Z",
    );
  });

  it("rejects malformed and out-of-range values", () => {
    expect(parseDueDate("22-08-2026")).toBeUndefined();
    expect(parseDueDate("2026-13-01")).toBeUndefined();
    expect(parseDueDate("1999-01-01")).toBeUndefined();
    expect(parseDueDate("2101-01-01")).toBeUndefined();
  });

  it("rejects impossible days V8 would roll over instead of failing", () => {
    expect(parseDueDate("2026-02-30")).toBeUndefined();
    expect(parseDueDate("2026-04-31")).toBeUndefined();
    expect(parseDueDate("2026-02-29")).toBeUndefined(); // not a leap year
  });
});

describe("isPastDue", () => {
  const due = new Date("2026-08-22T00:00:00.000Z");

  it("is never past due without a due date", () => {
    expect(isPastDue(null, new Date("2099-01-01T00:00:00Z"))).toBe(false);
  });

  it("holds through the whole UTC day it names", () => {
    expect(isPastDue(due, new Date("2026-08-22T23:59:59Z"))).toBe(false);
    expect(isPastDue(due, new Date("2026-08-23T00:00:00Z"))).toBe(true);
  });
});

describe("done checks", () => {
  const item = (id: string, progressIds: string[]) => ({
    id,
    title: id,
    href: `/x/${id}`,
    progressIds,
  });
  const view = (items: ReturnType<typeof item>[]): AssignmentView => ({
    id: "a1",
    title: "t",
    note: null,
    dueAt: null,
    createdAt: new Date(0),
    createdByName: null,
    items,
    staleCount: 0,
  });

  it("an item is done only when every progress unit is (papers wait for inserted lessons)", () => {
    const paper = item("p1", ["p1", "p1-inserted"]);
    expect(assignmentItemDone(paper, new Set(["p1"]))).toBe(false);
    expect(assignmentItemDone(paper, new Set(["p1", "p1-inserted"]))).toBe(true);
  });

  it("an assignment is done when all items are, and never with no surviving items", () => {
    const a = view([item("l1", ["l1"]), item("l2", ["l2"])]);
    expect(assignmentDone(a, new Set(["l1"]))).toBe(false);
    expect(assignmentDone(a, new Set(["l1", "l2"]))).toBe(true);
    expect(assignmentDone(view([]), new Set(["l1"]))).toBe(false);
  });
});
