import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { memoGenreLabels, memoSlots } from "@/content/verification/memos";
import { verificationModules } from "@/content/verification/curriculum";
import { verificationLessons } from "@/content/verification/curriculum";

const LESSONS_DIR = join(__dirname, "../../content/lessons/verification");

describe("verification written outputs", () => {
  it("every slot names a lesson that exists in the track", () => {
    const refs = new Set(
      verificationLessons
        .map((lesson) => lesson.contentRef)
        .filter((ref) => ref.startsWith("verification/"))
        .map((ref) => ref.slice("verification/".length)),
    );
    for (const slot of memoSlots) {
      expect(refs.has(slot.lesson), `${slot.id} -> ${slot.lesson} is not a track lesson`).toBe(
        true,
      );
    }
  });

  it("every lesson that owes a written output embeds the card once", () => {
    const owed = new Set(memoSlots.map((slot) => slot.lesson));
    for (const lesson of owed) {
      const path = join(LESSONS_DIR, `${lesson}.mdx`);
      expect(existsSync(path), `${lesson}.mdx missing`).toBe(true);
      const body = readFileSync(path, "utf8");
      const embeds = body.split(`<MemoDesk lesson="${lesson}" />`).length - 1;
      expect(embeds, `${lesson}.mdx must embed its written output exactly once`).toBe(1);
    }
  });

  it("no lesson embeds a card for a different lesson", () => {
    const owed = new Set(memoSlots.map((slot) => slot.lesson));
    for (const lesson of verificationLessons) {
      if (!lesson.contentRef.startsWith("verification/")) continue;
      const name = lesson.contentRef.slice("verification/".length);
      const path = join(LESSONS_DIR, `${name}.mdx`);
      if (!existsSync(path)) continue;
      const found = [...readFileSync(path, "utf8").matchAll(/<MemoDesk lesson="([^"]+)"/g)].map(
        (match) => match[1],
      );
      for (const ref of found) {
        expect(ref, `${name}.mdx embeds the card for ${ref}`).toBe(name);
      }
      if (found.length) expect(owed.has(name), `${name} embeds a card it owes nothing for`).toBe(true);
    }
  });

  it("anything short of a full brief says what is missing", () => {
    for (const slot of memoSlots) {
      if (slot.status === "specified" && slot.brief) continue;
      expect(slot.gap, `${slot.id} is "${slot.status}" and carries no gap note`).toBeTruthy();
    }
  });

  it("slot ids are unique and modules are in range", () => {
    const ids = memoSlots.map((slot) => slot.id);
    expect(new Set(ids).size).toBe(ids.length);
    const byOrder = [...verificationModules].sort((a, b) => a.order - b.order);
    for (const slot of memoSlots) {
      expect(byOrder[slot.module], `${slot.id} has module ${slot.module}`).toBeTruthy();
    }
  });

  it("every declared genre is one the desk and card know how to dress", () => {
    for (const slot of memoSlots) {
      if (!slot.genre) continue;
      expect(memoGenreLabels[slot.genre], `${slot.id} has genre ${slot.genre}`).toBeTruthy();
    }
  });
});
