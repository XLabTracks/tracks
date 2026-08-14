import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import citations from "@/content/citations.json";

/**
 * The Works cited appendix assembles itself from each lesson's links, so the
 * registry must cover everything a lesson cites: a URL in a verification
 * lesson that is neither a registry entry nor deliberately excluded would be
 * a silent gap in the appendix. This test re-derives the citation list from
 * the raw MDX text — every markdown link, and every href/url attribute
 * wherever it is written, the same shapes rehype-lesson-citations walks —
 * and fails naming the lesson and URL.
 *
 * `excluded` is for links that are not works: the course's own interactive
 * tools and shared working documents. Excluding a published work is a
 * content decision that belongs in review, not here.
 */

const LESSONS_DIR = join(process.cwd(), "src/content/lessons");
const VERIFICATION_DIR = join(LESSONS_DIR, "verification");

function citedUrls(source: string): string[] {
  const stripped = source.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  const urls = new Set<string>();
  for (const m of stripped.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g))
    urls.add(m[1]);
  // Any href or url attribute, on any element or component — not a list of
  // blessed component names, which is how a ReadingCard's work stayed
  // invisible to the appendix while propping up a registry entry.
  for (const m of stripped.matchAll(/\bhref=\{?["'](https?:\/\/[^"']+)/g))
    urls.add(m[1]);
  for (const m of stripped.matchAll(/\burl=\{?["'](https?:\/\/[^"']+)/g))
    urls.add(m[1]);
  return [...urls];
}

function allLessonFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => join(dir, f));
}

const entries = citations.entries as Record<
  string,
  { title?: string; about?: string }
>;
const excluded = new Set(citations.excluded as string[]);
// The registry's honesty valve: a cited work whose bibliographic facts are
// not yet verified sits in `pending` — the appendix skips it rather than
// carrying an unchecked citation, and this test accepts it as covered so the
// gap is visible in data instead of papered over with guessed fields.
const pending = new Set(citations.pending as string[]);

describe("citations registry", () => {
  it("covers every URL the verification lessons cite", () => {
    const gaps: string[] = [];
    for (const file of allLessonFiles(VERIFICATION_DIR)) {
      for (const url of citedUrls(readFileSync(file, "utf8"))) {
        if (!entries[url] && !excluded.has(url) && !pending.has(url)) {
          gaps.push(`${file.split("/lessons/")[1]} -> ${url}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it("carries no orphan entries or stale exclusions", () => {
    const cited = new Set<string>();
    for (const file of allLessonFiles(LESSONS_DIR)) {
      for (const url of citedUrls(readFileSync(file, "utf8"))) cited.add(url);
    }
    const orphans = Object.keys(entries).filter((u) => !cited.has(u));
    const stale = [...excluded, ...pending].filter((u) => !cited.has(u));
    expect(orphans).toEqual([]);
    expect(stale).toEqual([]);
  });

  it("every entry carries a title and a hand-written about line", () => {
    const bad = Object.entries(entries)
      .filter(([, e]) => !e.title?.trim() || !e.about?.trim())
      .map(([url]) => url);
    expect(bad).toEqual([]);
  });
});
