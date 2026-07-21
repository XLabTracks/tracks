/**
 * Build the "linked readings" layer: the substack / LessWrong posts that the
 * course's post-sourced papers link to, so those links can open in the
 * internal reader (/readings/[id]) instead of leaving the site.
 *
 * Scans the committed artifacts of every non-arXiv Paper in papers.data.ts
 * for post links (clean URLs only — comment permalinks and anchored links
 * stay external), builds a committed artifact for each via the existing
 * per-source build scripts, and regenerates the runtime registry:
 *
 *   src/content/linked-readings.json    { readings: [{kind,id,url,title}] }
 *
 * One layer deep by design: only primary papers are scanned — a linked
 * reading's own sublinks are never followed or internalized.
 *
 * Usage:
 *   npm run readings:build               # build missing/stale, regenerate registry
 *   npm run readings:build -- --dry-run  # list candidates without building
 *   npm run readings:build -- --refresh  # refetch + rebuild every linked reading
 *
 * Runs locally in Node at authoring time; nothing here ships in the worker.
 * Posts that end terminal (not-found / paywalled / failed) keep their
 * committed terminal artifact but are excluded from the registry, so their
 * links simply stay external.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { papers } from "../src/content/papers.data";
import {
  parseLessWrongId,
  parseLessWrongPostUrl,
  buildPostUrl as buildLwPostUrl,
  type LessWrongRef,
} from "../src/lib/lesswrong/id";
import {
  parseSubstackPostUrl,
  buildPostUrl as buildSbPostUrl,
  type SubstackRef,
} from "../src/lib/substack/id";
import {
  LESSWRONG_CONVERTER_VERSION,
  type LessWrongArtifact,
} from "../src/lib/lesswrong/types";
import {
  SUBSTACK_CONVERTER_VERSION,
  type SubstackArtifact,
} from "../src/lib/substack/types";

const ROOT = process.cwd();
const REGISTRY_PATH = join(ROOT, "src", "content", "linked-readings.json");

interface Candidate {
  kind: "substack" | "lesswrong";
  /** Artifact id. */
  id: string;
  /** Site-agnostic dedup key (LW posts key on postId across both hosts). */
  key: string;
  /** The URL as first linked (what gets refetched). */
  url: string;
}

const hasFlag = (flag: string) => process.argv.includes(flag);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function artifactPath(kind: Candidate["kind"], id: string): string {
  return join(ROOT, "src", "content", kind, `${id}.json`);
}

function readArtifact(
  kind: Candidate["kind"],
  id: string,
): SubstackArtifact | LessWrongArtifact | null {
  const path = artifactPath(kind, id);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as
    | SubstackArtifact
    | LessWrongArtifact;
}

function converterVersionFor(kind: Candidate["kind"]): number {
  return kind === "substack"
    ? SUBSTACK_CONVERTER_VERSION
    : LESSWRONG_CONVERTER_VERSION;
}

/** A candidate from an href, or null for anything we leave external. */
function candidateFromHref(href: string): Candidate | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  // Comment permalinks / section anchors can't render internally.
  if (url.search !== "" || url.hash !== "") return null;
  const lw = parseLessWrongPostUrl(href);
  if (lw) return { kind: "lesswrong", id: lw.id, key: `lw:${lw.postId}`, url: href };
  const sb = parseSubstackPostUrl(href);
  if (sb) return { kind: "substack", id: sb.id, key: `sb:${sb.id}`, url: href };
  return null;
}

/** Keys already covered by course papers — those links go to course pages. */
function primaryKeys(): Set<string> {
  const keys = new Set<string>();
  for (const paper of papers) {
    if (paper.source.kind === "arxiv") continue;
    const candidate = candidateFromHref(paper.source.postUrl);
    if (candidate) keys.add(candidate.key);
  }
  return keys;
}

/** Post links inside the committed artifacts of all non-arXiv papers. */
function collectCandidates(): Candidate[] {
  const primaries = primaryKeys();
  const seen = new Set<string>();
  const candidates: Candidate[] = [];
  for (const paper of papers) {
    if (paper.source.kind === "arxiv") continue;
    const ref =
      paper.source.kind === "substack"
        ? parseSubstackPostUrl(paper.source.postUrl)
        : parseLessWrongPostUrl(paper.source.postUrl);
    if (!ref) continue;
    const artifact = readArtifact(paper.source.kind, ref.id);
    if (!artifact || artifact.state !== "ready") {
      console.warn(
        `! ${paper.id}: no ready ${paper.source.kind} artifact (${ref.id}) — ` +
          `run the source build first; skipping its links`,
      );
      continue;
    }
    for (const match of artifact.post.html.matchAll(
      /<a\b[^>]*?\bhref="(https:\/\/[^"]*)"/g,
    )) {
      const candidate = candidateFromHref(match[1]);
      if (!candidate) continue;
      if (primaries.has(candidate.key) || seen.has(candidate.key)) continue;
      seen.add(candidate.key);
      candidates.push(candidate);
    }
  }
  return candidates.sort((a, b) => a.id.localeCompare(b.id));
}

function needsBuild(candidate: Candidate, refresh: boolean): boolean {
  if (refresh) return true;
  const artifact = readArtifact(candidate.kind, candidate.id);
  if (!artifact) return true;
  // Terminal states are deterministic — don't refetch them on every run.
  if (artifact.state !== "ready") return false;
  return artifact.post.converterVersion !== converterVersionFor(candidate.kind);
}

function buildOne(candidate: Candidate, refresh: boolean): boolean {
  const script =
    candidate.kind === "substack"
      ? "scripts/build-substack.ts"
      : "scripts/build-lesswrong.ts";
  const args = ["tsx", script, "--id", candidate.id];
  if (refresh) args.push("--refresh");
  try {
    execFileSync("npx", args, { cwd: ROOT, stdio: "inherit" });
    return true;
  } catch {
    console.error(`✗ ${candidate.id}: build failed (transient?) — left out`);
    return false;
  }
}

interface RegistryEntry {
  kind: Candidate["kind"];
  id: string;
  url: string;
  title: string;
}

function registryEntry(candidate: Candidate): RegistryEntry | null {
  const artifact = readArtifact(candidate.kind, candidate.id);
  if (
    !artifact ||
    artifact.state !== "ready" ||
    artifact.post.converterVersion !== converterVersionFor(candidate.kind)
  ) {
    return null;
  }
  const canonical =
    candidate.kind === "substack"
      ? buildSbPostUrl(parseSubstackPostUrl(candidate.url) as SubstackRef)
      : buildLwPostUrl(
          (parseLessWrongPostUrl(candidate.url) ??
            parseLessWrongId(candidate.id)) as LessWrongRef,
        );
  // A registry entry needs a display title; a title-less post stays external.
  const title = artifact.post.meta.title;
  if (!title) return null;
  return {
    kind: candidate.kind,
    id: candidate.id,
    url: artifact.post.meta.canonicalUrl ?? canonical,
    title,
  };
}

async function main(): Promise<void> {
  const refresh = hasFlag("--refresh");
  const dryRun = hasFlag("--dry-run");

  const candidates = collectCandidates();
  console.log(`${candidates.length} linked post(s) referenced by course papers`);

  if (dryRun) {
    for (const candidate of candidates) {
      const state = readArtifact(candidate.kind, candidate.id)?.state ?? "missing";
      console.log(`  [${state.padEnd(9)}] ${candidate.id}  ${candidate.url}`);
    }
    return;
  }

  let built = 0;
  let failed = 0;
  for (const candidate of candidates) {
    if (!needsBuild(candidate, refresh)) continue;
    if (built + failed > 0) await sleep(1000);
    if (buildOne(candidate, refresh)) built += 1;
    else failed += 1;
  }

  const readings = candidates
    .map(registryEntry)
    .filter((entry): entry is RegistryEntry => entry !== null);
  writeFileSync(REGISTRY_PATH, `${JSON.stringify({ readings }, null, 2)}\n`);

  const excluded = candidates.length - readings.length;
  console.log(
    `✓ registry: ${readings.length} reading(s) written to ` +
      `src/content/linked-readings.json` +
      (excluded > 0 ? ` (${excluded} excluded: terminal/failed)` : ""),
  );
  if (built > 0) console.log(`  built ${built} artifact(s) this run`);
  if (failed > 0) {
    console.log(`  ${failed} build(s) failed — rerun to retry`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
