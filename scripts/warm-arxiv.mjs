#!/usr/bin/env node
/**
 * Pre-warm the arXiv paper cache on a deployed site so students never hit
 * the cold fetch-and-convert path.
 *
 * Usage:
 *   ARXIV_WARM_TOKEN=... npm run warm:arxiv -- --site https://example.netlify.app
 *   ARXIV_WARM_TOKEN=... node scripts/warm-arxiv.mjs --site http://localhost:8888 --id 1706.03762v7
 *
 * Without --id, scans src/content/lessons/*.mdx for <ArxivPaper id="..."/>.
 * Retries transient failures with 3s spacing (arXiv rate courtesy).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
function argValue(flag) {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : undefined;
}

const site = argValue("--site")?.replace(/\/$/, "");
const token = process.env.ARXIV_WARM_TOKEN;
if (!site || !token) {
  console.error(
    "Usage: ARXIV_WARM_TOKEN=... node scripts/warm-arxiv.mjs --site https://<site> [--id 2301.12345v2]",
  );
  process.exit(1);
}

const explicitId = argValue("--id");
const ids = explicitId ? [explicitId] : scanLessonIds();
if (ids.length === 0) {
  console.log("No <ArxivPaper id=.../> found in src/content/lessons/.");
  process.exit(0);
}

function scanLessonIds() {
  const dir = join(import.meta.dirname, "..", "src", "content", "lessons");
  const found = new Set();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const source = readFileSync(join(dir, file), "utf8");
    for (const match of source.matchAll(/<ArxivPaper[^>]*\bid="([^"]+)"/g)) {
      found.add(match[1]);
    }
  }
  return [...found];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TERMINAL = new Set([
  "ready",
  "pdf-only",
  "not-found",
  "too-large",
  "unsupported",
  "failed",
]);

let hadFailure = false;
for (const id of ids) {
  let outcome = "transient-error";
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch(
      `${site}/api/arxiv/warm?id=${encodeURIComponent(id)}`,
      { headers: { "x-warm-token": token } },
    );
    const body = await response.json().catch(() => ({}));
    outcome = body.status ?? `http-${response.status}`;
    console.log(`${id}: ${outcome}${body.warnings !== undefined ? ` (${body.warnings} warnings, ${body.assets} assets)` : ""}`);
    if (response.status === 401 || response.status === 400) {
      hadFailure = true;
      break;
    }
    if (TERMINAL.has(outcome)) break;
    await sleep(3000);
  }
  if (!TERMINAL.has(outcome) || outcome === "failed") hadFailure = true;
  await sleep(3000);
}
process.exit(hadFailure ? 1 : 0);
