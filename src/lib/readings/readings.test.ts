import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { getAllResources, getContentLocation, papers } from "@/lib/content";
import { parseLessWrongId, parseLessWrongPostUrl } from "@/lib/lesswrong/id";
import {
  LESSWRONG_CONVERTER_VERSION,
  type LessWrongArtifact,
} from "@/lib/lesswrong/types";
import { parseSubstackId, parseSubstackPostUrl } from "@/lib/substack/id";
import {
  SUBSTACK_CONVERTER_VERSION,
  type SubstackArtifact,
} from "@/lib/substack/types";
import { linkedReadings, type LinkedReading } from "./registry";
import { resolveInternalReadingHref } from "./resolve";

// The linked-readings registry is generated (`npm run readings:build`) —
// these tests pin its contract: every entry backs a ready committed artifact,
// linked readings stay OUT of the content graph and the resource hub, and
// link resolution prefers course pages and stays one layer deep.

/** Site-agnostic key, mirroring resolve.ts. */
function keyOf(reading: LinkedReading): string {
  if (reading.kind === "lesswrong") {
    const ref = parseLessWrongId(reading.id);
    expect(ref, `${reading.id} must parse as a LessWrong artifact id`).not.toBeNull();
    return `lw:${ref!.postId}`;
  }
  expect(
    parseSubstackId(reading.id),
    `${reading.id} must parse as a Substack artifact id`,
  ).not.toBeNull();
  return `sb:${reading.id}`;
}

function primaryKey(postUrl: string): string | null {
  const lw = parseLessWrongPostUrl(postUrl);
  if (lw) return `lw:${lw.postId}`;
  const sb = parseSubstackPostUrl(postUrl);
  if (sb) return `sb:${sb.id}`;
  return null;
}

describe("linked readings registry", () => {
  it("has entries (regenerate with `npm run readings:build` if this fails)", () => {
    expect(linkedReadings.length).toBeGreaterThan(0);
  });

  it("every entry backs a ready, current-converter committed artifact", () => {
    for (const reading of linkedReadings) {
      const path = join(
        process.cwd(),
        "src",
        "content",
        reading.kind,
        `${reading.id}.json`,
      );
      expect(existsSync(path), `${reading.id}: missing artifact`).toBe(true);
      const artifact = JSON.parse(readFileSync(path, "utf8")) as
        | SubstackArtifact
        | LessWrongArtifact;
      expect(artifact.state, `${reading.id}: not ready`).toBe("ready");
      if (artifact.state !== "ready") continue;
      const expected =
        reading.kind === "substack"
          ? SUBSTACK_CONVERTER_VERSION
          : LESSWRONG_CONVERTER_VERSION;
      expect(
        artifact.post.converterVersion,
        `${reading.id}: stale converter — rerun npm run readings:build`,
      ).toBe(expected);
      expect(reading.title, `${reading.id}: title drifted`).toBe(
        artifact.post.meta.title,
      );
    }
  });

  it("ids are unique and disjoint from course paper sources", () => {
    const ids = linkedReadings.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);

    const readingKeys = new Set(linkedReadings.map(keyOf));
    for (const paper of papers) {
      if (paper.source.kind === "arxiv") continue;
      const key = primaryKey(paper.source.postUrl);
      expect(
        key && readingKeys.has(key),
        `${paper.id}: its source is also a linked reading — regenerate the registry`,
      ).toBeFalsy();
    }
  });

  it("linked readings never surface in the resource hub", () => {
    const readingKeys = new Set(linkedReadings.map(keyOf));
    for (const resource of getAllResources()) {
      const key = primaryKey(resource.url);
      expect(
        key && readingKeys.has(key),
        `resource ${resource.id} duplicates linked reading ${resource.url}`,
      ).toBeFalsy();
    }
  });
});

describe("resolveInternalReadingHref", () => {
  it("routes a course paper's source URL to its course page (both LW hosts)", () => {
    const paper = papers.find((p) => p.id === "c-case-for-control")!;
    const postUrl = (paper.source as { postUrl: string }).postUrl;
    const href = getContentLocation(paper.id)!.href;
    expect(resolveInternalReadingHref(postUrl)).toBe(href);

    // Same post id on the Alignment Forum host resolves site-agnostically.
    const ref = parseLessWrongPostUrl(postUrl)!;
    expect(
      resolveInternalReadingHref(
        `https://www.alignmentforum.org/posts/${ref.postId}/mirror-slug`,
      ),
    ).toBe(href);
  });

  it("routes a registered linked reading to /readings/[id]", () => {
    const reading = linkedReadings[0];
    expect(resolveInternalReadingHref(reading.url)).toBe(
      `/readings/${reading.id}`,
    );
  });

  it("leaves comment permalinks, anchored links, and foreign URLs external", () => {
    const reading = linkedReadings.find((r) => r.kind === "lesswrong")!;
    expect(resolveInternalReadingHref(`${reading.url}?commentId=abc`)).toBeNull();
    expect(resolveInternalReadingHref(`${reading.url}#section`)).toBeNull();
    expect(resolveInternalReadingHref("https://example.com/posts/x")).toBeNull();
    expect(resolveInternalReadingHref("not a url")).toBeNull();
  });
});
