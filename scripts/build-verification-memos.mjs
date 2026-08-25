#!/usr/bin/env node
/*
 * build-verification-memos.mjs
 *   src/content/verification/memos.ts  ->  public/verification/data/memos.js
 *
 * The written outputs exist once, in the content graph. The standalone memo
 * desk under public/verification/ has no build step of its own, so it reads
 * this generated copy.
 *
 *   npm run verification:memos            # write the data file
 *   npm run verification:memos -- --check # fail if it has drifted (CI)
 *
 * `lesson` is dropped on the way out: it says which app lesson carries the
 * card, which is meaningless to a page that has no lessons.
 *
 * Zero dependencies and no tsc: the source is flat literals, read with a
 * narrow parser that fails loudly rather than guessing. Output is
 * deterministic so --check diffs byte for byte.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src", "content", "verification", "memos.ts");
const OUT = path.join(ROOT, "public", "verification", "data", "memos.js");

const src = fs.readFileSync(SRC, "utf8");

function fail(msg) {
  console.error(`\nbuild-verification-memos failed:\n  x ${msg}`);
  process.exit(1);
}

/** The body of `export const NAME … [ … ];`, brace/bracket balanced. */
function block(name, open, close) {
  const start = src.indexOf(`export const ${name}`);
  if (start < 0) fail(`could not find "export const ${name}"`);
  const from = src.indexOf(open, src.indexOf("=", start));
  let depth = 0,
    i = from,
    inStr = false,
    q = "";
  while (i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === q) inStr = false;
    } else if (c === '"' || c === "'" || c === "`") {
      inStr = true;
      q = c;
    } else if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) break;
    }
    i++;
  }
  return src.slice(from, i + 1);
}

/* One record per top-level `{ … }` inside the array literal. Fields are read
   with JSON.parse on the quoted value, so escapes and the outline's own
   quotation marks survive intact. */
function records() {
  const body = block("memoSlots", "[", "]");
  const chunks = body.split(/\n  \{\n/).slice(1);
  const out = [];
  for (const rawChunk of chunks) {
    const rec = {};
    /* Drop whole-line block comments before reading the fields.
       memos.ts is where a slot's placement is argued — the header says so —
       so a note between two fields is the expected way to record why a slot
       sits on the lesson it sits on. Left in, it was swallowed by the value
       above it and the build failed on a comment. Whole-line only: a `/*`
       inside a quoted brief is still a brief. */
    const chunk = rawChunk.replace(/^[ \t]*\/\*[\s\S]*?\*\/[ \t]*\n/gm, "");
    for (const [, key, raw] of chunk.matchAll(
      /^\s{4}(\w+):\s*([\s\S]*?),?\n(?=\s{4}\w+:|\s{2}\},)/gm,
    )) {
      const value = raw.trim().replace(/,$/, "");
      if (value === "null") rec[key] = null;
      else if (value === "true" || value === "false") rec[key] = value === "true";
      else if (/^\d+$/.test(value)) rec[key] = Number(value);
      else if (value.startsWith("[")) {
        rec[key] = [...value.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) =>
          JSON.parse(`"${m[1]}"`),
        );
      } else {
        // A long string is prettier-wrapped onto its own line, and a value
        // holding a double quote is written in single quotes.
        const joined = value.replace(/"\s*\+\s*\n\s*"/g, "");
        const m = /^(['"])([\s\S]*)\1$/.exec(joined.trim());
        if (!m) fail(`could not read ${key} in ${rec.id ?? "a slot"}: ${value.slice(0, 60)}`);
        rec[key] = m[1] === '"' ? JSON.parse(`"${m[2]}"`) : m[2].replace(/\\'/g, "'");
      }
    }
    if (rec.id) out.push(rec);
  }
  if (!out.length) fail("memoSlots parsed empty");
  return out;
}

// The desk's module names come from the course, not from a list beside it.
// memos.ts used to carry its own five names and they disagreed with the
// track's on four of the five, so the desk called module 3 something the
// curriculum never says.
const CURRICULUM = path.join(ROOT, "src", "content", "verification", "curriculum.ts");
const curriculum = fs.readFileSync(CURRICULUM, "utf8");
const modules = (() => {
  const start = curriculum.indexOf("export const verificationModules");
  if (start < 0) fail("could not find verificationModules in curriculum.ts");
  const end = curriculum.indexOf("export const verificationLessons", start);
  const body = curriculum.slice(start, end < 0 ? undefined : end);
  const found = [];
  const re = /trackId:\s*"verification",\s*\n\s*title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(body))) found.push(JSON.parse(`"${m[1]}"`));
  return found;
})();
if (modules.length !== 5) {
  fail(`read ${modules.length} module titles from curriculum.ts, expected 5`);
}

const slots = records().map((slot) => {
  // `lesson` is an app-side placement and means nothing on the static desk.
  const { lesson: _lesson, ...rest } = slot;
  void _lesson;
  return rest;
});

for (const slot of slots) {
  if (slot.status !== "specified" && !slot.gap) {
    fail(`${slot.id} is "${slot.status}" and carries no gap note — say what is missing`);
  }
}

const banner =
  `/* GENERATED FILE - do not edit by hand.\n` +
  `   Source: src/content/verification/memos.ts\n` +
  `   Regenerate: npm run verification:memos\n\n` +
  `   Every place the course asks for a written output. The briefs are the\n` +
  `   outline's own words; \`status\` says how much of each one exists. */\n`;

const text =
  banner +
  `window.VERIFICATION_MEMO_MODULES = ${JSON.stringify(modules, null, 2)};\n\n` +
  `window.VERIFICATION_MEMOS = ${JSON.stringify(slots, null, 2)};\n`;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== text) {
    console.error(
      "\npublic/verification/data/memos.js is stale - run: npm run verification:memos",
    );
    process.exit(1);
  }
  console.log(`verification memos are up to date (${slots.length} slots).`);
  process.exit(0);
}

fs.writeFileSync(OUT, text);
console.log(
  `build-verification-memos: ${slots.length} slots -> ${path.relative(ROOT, OUT)}`,
);
