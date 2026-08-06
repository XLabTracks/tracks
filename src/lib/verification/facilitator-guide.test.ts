/**
 * The field guide's internal links.
 *
 * Most of the guide's links are external reading. A few point back into the
 * course, because the material they name is a unit of it rather than a
 * standalone page — and those are the ones that can rot without anybody
 * noticing: the guide is authored HTML strings, so a renamed slug or a
 * renumbered unit breaks a link that nothing else reads.
 *
 * So: every in-app href must resolve in the content graph, and a link whose
 * text names a unit number must name the number that unit actually carries.
 */
import { describe, expect, it } from "vitest";
import { lessons, modules } from "@/content/curriculum.data";
import * as guide from "@/lib/verification/data/facilitator-guide";

/** Every `<a href="…">text</a>` in the guide's authored HTML. */
function allLinks(): { href: string; text: string }[] {
  const out: { href: string; text: string }[] = [];
  const seen = new Set<unknown>();
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      for (const m of v.matchAll(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/g)) {
        out.push({ href: m[1], text: m[2].replace(/<[^>]+>/g, "").trim() });
      }
      return;
    }
    if (!v || typeof v !== "object" || seen.has(v)) return;
    seen.add(v);
    for (const child of Object.values(v as Record<string, unknown>)) walk(child);
  };
  walk(guide);
  return out;
}

const everyLink = allLinks();
// Since the solo timeline game left the course (its unit 0.2.0 was deleted
// outright) the guide's course references are all external, so the in-app
// set may legitimately be empty — the canary below asserts on all anchors,
// which is what actually guards the extractor.
const links = everyLink.filter(({ href }) => href.startsWith("/"));

describe("facilitator guide internal links", () => {
  it("the link extractor finds the guide's anchors at all", () => {
    expect(everyLink.length).toBeGreaterThan(0);
  });

  it("every /tracks/ href resolves to a lesson in the graph", () => {
    const broken: string[] = [];
    for (const { href } of links) {
      const parts = href.split("#")[0].split("?")[0].split("/").filter(Boolean);
      if (parts[0] !== "tracks") continue;
      const [, trackSlug, moduleSlug, itemSlug] = parts;
      const mod = modules.find(
        (m) => m.slug === moduleSlug && m.trackId === trackSlug,
      );
      const lesson = mod
        ? lessons.find((l) => l.moduleId === mod.id && l.slug === itemSlug)
        : undefined;
      if (!lesson) broken.push(href);
    }
    expect(broken).toEqual([]);
  });

  it("a link that names a unit number names the right one", () => {
    const wrong: string[] = [];
    for (const { href, text } of links) {
      const named = /^unit\s+([\d.]+)$/i.exec(text);
      if (!named) continue;
      const parts = href.split("/").filter(Boolean);
      const mod = modules.find((m) => m.slug === parts[2]);
      const lesson = mod
        ? lessons.find((l) => l.moduleId === mod.id && l.slug === parts[3])
        : undefined;
      if (!lesson?.title.startsWith(named[1] + " ")) {
        wrong.push(`${text} -> ${lesson?.title ?? href}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
