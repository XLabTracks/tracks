/**
 * Convert every LessWrong / Alignment Forum post the content references —
 * Paper sources with kind "lesswrong" in src/content/papers.data.ts — into
 * committed artifacts the site reads at runtime:
 *
 *   src/content/lesswrong/{id}.json     LessWrongArtifact (rendered HTML +
 *                                       toc, or a terminal state)
 *   public/lesswrong/{id}/assets/{path} image bytes referenced by the HTML
 *
 * Runs locally in Node at authoring time; the fetch/convert toolchain never
 * ships in the deployed worker. Raw post JSON caches under
 * LESSWRONG_CACHE_DIR (default: OS temp dir) — while it lives, re-runs
 * convert the same bytes; if the OS evicts it, the next build refetches
 * (like `--refresh`, which does so deliberately to pick up author edits).
 * Either way the committed artifact is the real pin, and the snippet
 * tripwires in content.test.ts name any Paper.edit a refetch broke.
 *
 * Usage (a <ref> is the post URL or the artifact id "{site}__{postId}"):
 *   npm run lesswrong:build                   # all lesswrong sources in papers.data.ts
 *   npm run lesswrong:build -- --id <ref>     # build one post
 *   npm run lesswrong:build -- --id <ref> --refresh   # refetch, then build
 *   npm run lesswrong:build -- --toc <ref>    # print a committed artifact's
 *                                             # section ids (for sectionEnd edits)
 *   npm run lesswrong:build -- --blocks <ref> [--section lw-sec-…]
 *                                             # print block anchors (+ sentences
 *                                             # when scoped) for Paper.edits;
 *                                             # snippets are prefixes of these lines
 *
 * Transient failures (network blips) exit nonzero without writing an
 * artifact — only deterministic outcomes get committed.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { papers } from "../src/content/papers.data";
import {
  parseLessWrongId,
  parseLessWrongPostUrl,
  type LessWrongRef,
} from "../src/lib/lesswrong/id";
import { getOrConvertPostUncached } from "../src/lib/lesswrong/pipeline";
import { getAsset } from "../src/lib/lesswrong/store";
import type { LessWrongArtifact } from "../src/lib/lesswrong/types";
import type { PaperTocEntry } from "../src/lib/arxiv/types";
import { buildBlockIndex } from "../src/lib/papers/block-index";
import { anchorNum } from "../src/lib/papers/anchors";
import { subtreeEndIndex } from "../src/lib/papers/split-paper";

const ARTIFACTS_DIR = join(process.cwd(), "src", "content", "lesswrong");
const ASSETS_ROOT = join(process.cwd(), "public", "lesswrong");

function urlsFromPapers(): string[] {
  return papers.flatMap((p) =>
    p.source.kind === "lesswrong" ? [p.source.postUrl] : [],
  );
}

/** Accept either the public post URL or the artifact id. */
function resolveRef(raw: string): LessWrongRef | null {
  return /^https?:\/\//.test(raw)
    ? parseLessWrongPostUrl(raw)
    : parseLessWrongId(raw);
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

const hasFlag = (flag: string) => process.argv.includes(flag);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function printToc(toc: PaperTocEntry[]): void {
  for (const entry of toc) {
    console.log(`  ${entry.title.padEnd(48)} →  ${entry.id}`);
  }
}

/** Load a committed artifact for read-only commands; null + exit code on failure. */
function loadReadyArtifact(refString: string) {
  const ref = resolveRef(refString);
  if (!ref) {
    console.error(
      `✗ ${refString}: not a LessWrong/Alignment Forum post URL (https://{host}/posts/{id}/…) or artifact id`,
    );
    process.exitCode = 1;
    return null;
  }
  const path = join(ARTIFACTS_DIR, `${ref.id}.json`);
  if (!existsSync(path)) {
    console.error(
      `✗ ${ref.id}: no committed artifact — run \`npm run lesswrong:build -- --id ${ref.id}\` first`,
    );
    process.exitCode = 1;
    return null;
  }
  const artifact = JSON.parse(readFileSync(path, "utf8")) as LessWrongArtifact;
  if (artifact.state !== "ready") {
    console.error(`✗ ${ref.id}: artifact state is "${artifact.state}"`);
    process.exitCode = 1;
    return null;
  }
  return { ref, artifact };
}

/** Print a committed artifact's section ids without any network/conversion. */
function tocCommand(refString: string): void {
  const loaded = loadReadyArtifact(refString);
  if (!loaded) return;
  console.log(
    `${loaded.ref.id} (converter v${loaded.artifact.post.converterVersion}):`,
  );
  printToc(loaded.artifact.post.toc);
}

const truncate = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1)}…` : s;

/**
 * Print block anchors (for Paper.edits). Unscoped: one line per block across
 * the post. With --section <toc-id>: only that section's subtree, plus a
 * line per sentence. Snippets are copied prefixes of these lines.
 */
function blocksCommand(refString: string, sectionId: string | undefined): void {
  const loaded = loadReadyArtifact(refString);
  if (!loaded) return;
  const { toc } = loaded.artifact.post;
  const index = buildBlockIndex(loaded.artifact.post.html);

  let range: [number, number] = [0, Number.POSITIVE_INFINITY];
  let sectionCursor = -1;
  if (sectionId) {
    const i = toc.findIndex((entry) => entry.id === sectionId);
    if (i === -1 || !toc[i].anchor) {
      console.error(
        `✗ ${loaded.ref.id}: no toc entry "${sectionId}" — run \`npm run lesswrong:build -- --toc ${loaded.ref.id}\``,
      );
      process.exitCode = 1;
      return;
    }
    const end = subtreeEndIndex(toc, i);
    range = [
      anchorNum(toc[i].anchor!),
      end < toc.length && toc[end].anchor
        ? anchorNum(toc[end].anchor!)
        : Number.POSITIVE_INFINITY,
    ];
    sectionCursor = i - 1; // don't print headers before the scoped section
  }

  console.log(
    `${loaded.ref.id} (converter v${loaded.artifact.post.converterVersion}) — blocks:`,
  );
  for (const block of index.values()) {
    const n = anchorNum(block.anchor);
    if (n < range[0] || n >= range[1]) continue;
    // Section headers between blocks (document order).
    while (
      sectionCursor + 1 < toc.length &&
      toc[sectionCursor + 1].anchor &&
      anchorNum(toc[sectionCursor + 1].anchor!) <= n
    ) {
      sectionCursor++;
      const entry = toc[sectionCursor];
      console.log(`\n${entry.title}  (${entry.id})`);
    }
    const sCol = block.sentences.length > 0 ? `s=${block.sentences.length}` : "";
    console.log(
      `  ${block.anchor}  ${block.tag.padEnd(6)} ${sCol.padEnd(5)} ${truncate(block.text, 70)}`,
    );
    if (sectionId) {
      block.sentences.forEach((sentence, i) => {
        console.log(`       s${i + 1}  ${truncate(sentence, 76)}`);
      });
    }
  }
}

async function buildOne(refString: string, refresh: boolean): Promise<boolean> {
  const ref = resolveRef(refString);
  if (!ref) {
    console.error(
      `✗ ${refString}: not a LessWrong/Alignment Forum post URL (https://{host}/posts/{id}/…) or artifact id`,
    );
    return false;
  }

  const result = await getOrConvertPostUncached(ref, { refresh });
  if (result.state === "transient-error") {
    console.error(`✗ ${ref.id}: transient failure — nothing written, retry`);
    return false;
  }

  // Everything else is deterministic and safe to commit as-is.
  const artifact: LessWrongArtifact =
    result.state === "ready"
      ? { state: "ready", post: result.post }
      : { state: result.state };

  // Stage every asset from the cache BEFORE any destructive write — a cache
  // miss must not leave a torn artifact/public mirror behind.
  const staged: [string, Uint8Array][] = [];
  if (artifact.state === "ready") {
    for (const assetPath of artifact.post.assets) {
      const bytes = await getAsset(ref, assetPath);
      if (!bytes) {
        console.error(`✗ ${ref.id}: asset ${assetPath} missing from cache`);
        return false;
      }
      staged.push([assetPath, bytes]);
    }
  }

  mkdirSync(ARTIFACTS_DIR, { recursive: true });
  writeFileSync(join(ARTIFACTS_DIR, `${ref.id}.json`), JSON.stringify(artifact));

  // Mirror the referenced image bytes into public/ (replacing any previous
  // set, so removed images don't linger).
  rmSync(join(ASSETS_ROOT, ref.id), { recursive: true, force: true });
  for (const [assetPath, bytes] of staged) {
    const target = join(ASSETS_ROOT, ref.id, "assets", assetPath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
  }
  if (artifact.state === "ready") {
    const warnings = artifact.post.warnings.reduce((n, w) => n + w.count, 0);
    console.log(
      `✓ ${ref.id}: ready — ${artifact.post.assets.length} assets, ` +
        `${warnings} approximated elements`,
    );
    // Section ids are what sectionEnd edits key on — surface them here so
    // authors don't have to dig through the JSON.
    printToc(artifact.post.toc);
  } else {
    console.log(`✓ ${ref.id}: recorded terminal state "${artifact.state}"`);
  }
  return true;
}

async function main(): Promise<void> {
  const tocRef = argValue("--toc");
  if (tocRef) {
    tocCommand(tocRef);
    return;
  }
  const blocksRef = argValue("--blocks");
  if (blocksRef) {
    blocksCommand(blocksRef, argValue("--section"));
    return;
  }

  const refresh = hasFlag("--refresh");
  const single = argValue("--id");
  const refs = single ? [single] : [...new Set(urlsFromPapers())].sort();
  if (refs.length === 0) {
    console.log("No LessWrong sources in src/content/papers.data.ts.");
    return;
  }

  let ok = true;
  for (const [i, refString] of refs.entries()) {
    if (i > 0) await sleep(1000);
    ok = (await buildOne(refString, refresh)) && ok;
  }
  process.exitCode = ok ? 0 : 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
