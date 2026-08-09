/**
 * Guards on the landing page's course overview and the footer it sits under.
 *
 * Two things here are drift tripwires rather than unit tests: the six outcomes
 * are the long form of the skill map's six short labels, and every bare footer
 * route has to be a page somebody actually built.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { courseOverview } from "./overview";
import { FOOT, NAV, verificationHref } from "@/lib/verification/chrome";

const APP = join(__dirname, "../../app/verification");
const itemsOf = (id: string) => {
  const s = courseOverview.find((x) => x.id === id);
  if (!s || s.kind === "prose") throw new Error(`${id} is not a list section`);
  return s.groups.flat();
};

describe("course overview", () => {
  it("carries the author's four sections in order", () => {
    expect(courseOverview.map((s) => s.id)).toEqual(["who", "learn", "outcomes", "how"]);
  });

  it("keeps the counts the author wrote", () => {
    expect(itemsOf("who")).toHaveLength(2);
    expect(itemsOf("learn")).toHaveLength(8);
    expect(itemsOf("outcomes")).toHaveLength(6);
    const how = courseOverview.find((s) => s.id === "how");
    expect(how?.kind).toBe("prose");
    expect(how?.kind === "prose" && how.paragraphs).toHaveLength(2);
  });

  // The coverage questions arrive in blocks separated by blank lines, and the
  // blocks are the shape of the course. Flattening them loses that.
  it("keeps the coverage questions grouped", () => {
    const learn = courseOverview.find((s) => s.id === "learn");
    expect(learn?.kind === "numbered" && learn.groups.map((g) => g.length)).toEqual([
      2, 2, 2, 1, 1,
    ]);
  });

  /* The title is the only thing a closed card shows, so it carries the whole
     of what opening it gets you. */
  it("gives every section a title that is a lead-in, not a sentence", () => {
    for (const s of courseOverview) {
      expect(s.title.length, s.id).toBeGreaterThan(10);
      expect(s.title.endsWith("."), `${s.id} title is a lead-in, not a sentence`).toBe(false);
    }
  });

  // Both placeholders in the author's copy are resolved by the component, so
  // neither may survive into what a reader sees.
  it("prints no unresolved placeholder", () => {
    const all = JSON.stringify(courseOverview);
    expect(all).not.toMatch(/\[Claude[^\]]*\]/i);
    expect(all).not.toMatch(/\binsert link\b/i);
  });

  /* The six short labels in data/skills.js are the skill map's chips for these
     six outcomes, and the map indexes them by position (`lo: [3]` is the
     fourth). Adding an outcome here without adding its label there silently
     re-points every chip after it. */
  it("stays in step with the skill map's six objectives", () => {
    const skills = readFileSync(
      join(__dirname, "../../../public/verification/data/skills.js"),
      "utf8",
    );
    const block = skills.match(/objectives:\s*\[([\s\S]*?)\]/);
    expect(block, "skills.js has no objectives list").toBeTruthy();
    const labels = [...block![1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(labels).toHaveLength(itemsOf("outcomes").length);
  });
});

describe("chrome links point somewhere real", () => {
  // A footer row that names a page nobody built is worse than no row: it
  // renders as a link and 404s. Bare names are routes under /verification/.
  it.each([...NAV, ...FOOT].filter((l) => l.href && !/^([a-z]+:|\/)/.test(l.href)))(
    "$label resolves to a page",
    (link) => {
      expect(existsSync(join(APP, link.href!, "page.tsx")), link.href!).toBe(true);
    },
  );

  it("offers accessibility from the footer", () => {
    const row = FOOT.find((f) => f.label === "Accessibility");
    expect(row?.href).toBe("accessibility");
    expect(verificationHref(row!.href!)).toBe("/verification/accessibility");
  });
});
