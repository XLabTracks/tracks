import { describe, it, expect } from "vitest";
import { itemDone, groupDone, type ItemGroup } from "./item-done";
import {
  getItemsForModule,
  getModulesForTrack,
  getLessonById,
} from "./index";
import type { ModuleItem } from "./types";

const lesson = (id: string): ModuleItem => {
  const l = getLessonById(id);
  if (!l) throw new Error(`no lesson ${id}`);
  return { kind: "lesson", lesson: l };
};

describe("itemDone", () => {
  it("is the lesson's own id and nothing else", () => {
    expect(itemDone(lesson("v-hw-attestation"), new Set())).toBe(false);
    expect(itemDone(lesson("v-hw-attestation"), new Set(["v-hw-attestation"]))).toBe(true);
  });
});

describe("groupDone", () => {
  /* The defect this file exists for: subsections collapse by default, so a
     section head's row is the only thing a learner sees of an eight-section
     submodule. Ticking it on its own lesson reported 2.1 Hardware as finished
     to somebody who had read its opening page. */
  it("a section head is not done while any subsection is unread", () => {
    const head = lesson("v-hw-attestation");
    const children = [
      "v-hw-claim",
      "v-hw-trusted-statement",
      "v-hw-accounting",
    ].map(lesson);
    const group: ItemGroup = { item: head, children };

    expect(groupDone(group, new Set(["v-hw-attestation"]))).toBe(false);
    expect(
      groupDone(group, new Set(["v-hw-attestation", "v-hw-claim"])),
    ).toBe(false);
    expect(
      groupDone(
        group,
        new Set([
          "v-hw-attestation",
          "v-hw-claim",
          "v-hw-trusted-statement",
          "v-hw-accounting",
        ]),
      ),
    ).toBe(true);
  });

  it("does not tick a head whose own lesson is unread, however done its children", () => {
    const group: ItemGroup = {
      item: lesson("v-hw-attestation"),
      children: [lesson("v-hw-claim")],
    };
    expect(groupDone(group, new Set(["v-hw-claim"]))).toBe(false);
  });

  it("a childless row is exactly itemDone", () => {
    const item = lesson("v-welcome");
    for (const set of [new Set<string>(), new Set(["v-welcome"])]) {
      expect(groupDone({ item, children: [] }, set)).toBe(itemDone(item, set));
    }
  });

  /* Every section head in the course, against the whole track's completion —
     so a new submodule cannot quietly reintroduce a head that ticks alone. */
  it("no section head in Verification ticks before its subsections", () => {
    const heads: ItemGroup[] = [];
    for (const mod of getModulesForTrack("verification")) {
      const items = getItemsForModule(mod.id);
      const byId = new Map<string, ItemGroup>();
      for (const item of items) {
        const id = item.kind === "lesson" ? item.lesson.id : item.paper.id;
        const parent =
          item.kind === "lesson" ? item.lesson.sectionItemId : item.paper.sectionItemId;
        const group = parent ? byId.get(parent) : undefined;
        if (group) group.children.push(item);
        else {
          const fresh: ItemGroup = { item, children: [] };
          byId.set(id, fresh);
          heads.push(fresh);
        }
      }
    }
    const withChildren = heads.filter((g) => g.children.length > 0);
    expect(withChildren.length).toBeGreaterThan(3); // module 2 alone has several

    for (const group of withChildren) {
      const headId =
        group.item.kind === "lesson" ? group.item.lesson.id : group.item.paper.id;
      expect(groupDone(group, new Set([headId])), headId).toBe(false);
    }
  });
});
