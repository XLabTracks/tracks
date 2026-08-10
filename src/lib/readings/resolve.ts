import { getContentLocation, papers } from "@/lib/content";
import { parseLessWrongId, parseLessWrongPostUrl } from "@/lib/lesswrong/id";
import { parseSubstackId, parseSubstackPostUrl } from "@/lib/substack/id";
import { linkedReadingHref, linkedReadings } from "./registry";

/**
 * Site-agnostic lookup key for a substack / LessWrong post URL. LessWrong and
 * the Alignment Forum serve the same posts under different hosts, so LW keys
 * on the ForumMagnum post id alone; substack keys on the artifact id
 * (host__slug). Links carrying a query or fragment (comment permalinks,
 * section anchors) are never internalized — the internal reader can't show
 * comments or the original's anchor targets.
 */
function postKey(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.search !== "" || url.hash !== "") return null;
  const lw = parseLessWrongPostUrl(href);
  if (lw) return `lw:${lw.postId}`;
  const sb = parseSubstackPostUrl(href);
  if (sb) return `sb:${sb.id}`;
  return null;
}

/** A linked reading's key, derived from its artifact id (never its URL). */
function readingKey(reading: (typeof linkedReadings)[number]): string | null {
  if (reading.kind === "lesswrong") {
    const ref = parseLessWrongId(reading.id);
    return ref ? `lw:${ref.postId}` : null;
  }
  return `sb:${reading.id}`;
}

// Every post-sourced course paper's course page, by post key.
const coursePaperHrefByKey: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const paper of papers) {
    if (paper.source.kind === "arxiv") continue;
    const key = postKey(paper.source.postUrl);
    const location = getContentLocation(paper.id);
    if (!key || !location) continue;
    map.set(key, location.href);
  }
  return map;
})();

// Course papers win over linked readings: a post the curriculum assigns as a
// reading opens at its course page (with its edits and activities), not the
// bare /readings view.
const internalHrefByKey: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const reading of linkedReadings) {
    const key = readingKey(reading);
    if (key && !map.has(key)) map.set(key, linkedReadingHref(reading));
  }
  for (const [key, href] of coursePaperHrefByKey) map.set(key, href);
  return map;
})();

/**
 * The internal destination for a post link inside a course paper or lesson,
 * or null to leave the link external. `rewriteReadingLinks` runs this over
 * post-sourced papers' HTML; `MdxLink` runs it over lessons' markdown links.
 */
export function resolveInternalReadingHref(href: string): string | null {
  const key = postKey(href);
  if (!key) return null;
  return internalHrefByKey.get(key) ?? null;
}

/**
 * The course page for the paper whose source is the post artifact
 * `artifactId`, or null if no course paper carries that post. Keyed
 * site-agnostically for LessWrong (a lesswrong__-keyed artifact matches an
 * alignmentforum-sourced paper and vice versa). The /readings route uses
 * this to redirect old bookmarks when a linked reading is promoted to a
 * course paper — promotion drops the registry entry, so the bare viewer
 * would otherwise 404 URLs that used to work.
 */
export function coursePaperHrefForArtifact(artifactId: string): string | null {
  const lw = parseLessWrongId(artifactId);
  const key = lw
    ? `lw:${lw.postId}`
    : parseSubstackId(artifactId)
      ? `sb:${artifactId}`
      : null;
  if (!key) return null;
  return coursePaperHrefByKey.get(key) ?? null;
}
