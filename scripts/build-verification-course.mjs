#!/usr/bin/env node
/*
 * build-verification-course.mjs
 *   src/content/verification/curriculum.ts  ->  public/verification/data/course.js
 *
 * The Verification course exists once, in the content graph. The static site
 * under public/verification/ needs the same module and unit list to draw its
 * track page, its skill map and its guide, and it has no build step of its
 * own — so it reads this generated copy.
 *
 *   npm run verification:course            # write the data file
 *   npm run verification:course -- --check # fail if it has drifted (CI)
 *
 * What it does NOT carry is the prose. Lesson bodies are MDX and belong to the
 * app; the static site links into /tracks/verification for the reading itself.
 * That is the whole point of the merge — two copies of the text was the defect.
 *
 * Zero dependencies and no tsc: the source is flat literals, read with a
 * narrow parser that fails loudly rather than guessing. If curriculum.ts grows
 * real logic this stops being adequate and should become a tsx script.
 *
 * Output is deterministic so --check diffs byte for byte.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src", "content", "verification", "curriculum.ts");
const OUT = path.join(ROOT, "public", "verification", "data", "course.js");

const src = fs.readFileSync(SRC, "utf8");

function fail(msg) {
  console.error(`\nbuild-verification-course failed:\n  x ${msg}`);
  process.exit(1);
}

/** `export const NAME: TYPE = { ... };` — the object literal body. */
function objectBody(name) {
  const start = src.indexOf(`export const ${name}`);
  if (start < 0) fail(`could not find "export const ${name}"`);
  const open = src.indexOf("{", src.indexOf("=", start));
  let depth = 0, i = open, inStr = false, q = "";
  while (i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") { i += 2; continue; }
      if (c === q) inStr = false;
    } else if (c === '"' || c === "'" || c === "`") { inStr = true; q = c; }
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) break; }
    i++;
  }
  return src.slice(open, i + 1);
}

/** Flat `"key": "value"` pairs out of an object literal. */
function flatMap(name) {
  const body = objectBody(name);
  const out = {};
  for (const m of body.matchAll(/"([^"]+)":\s*"([^"]*)"/g)) out[m[1]] = m[2];
  if (!Object.keys(out).length) fail(`${name} parsed empty`);
  return out;
}

/** `"key": { ... }` records with string / number / boolean fields. */
function recordMap(name) {
  const body = objectBody(name);
  const out = {};
  for (const m of body.matchAll(/"([^"]+)":\s*\{([^}]*)\}/g)) {
    const rec = {};
    for (const f of m[2].matchAll(/(\w+):\s*(?:"([^"]*)"|(\d+)|(true|false))/g)) {
      rec[f[1]] = f[2] !== undefined ? f[2] : f[3] !== undefined ? Number(f[3]) : f[4] === "true";
    }
    out[m[1]] = rec;
  }
  if (!Object.keys(out).length) fail(`${name} parsed empty`);
  return out;
}

/** The arrays of module / lesson literals. */
function arrayOf(name, fields) {
  const start = src.indexOf(`export const ${name}`);
  if (start < 0) fail(`could not find "export const ${name}"`);
  const end = src.indexOf("\n];", start);
  const body = src.slice(start, end);
  const out = [];
  for (const chunk of body.split(/\n  \{\n/).slice(1)) {
    const rec = {};
    for (const f of fields) {
      const m = new RegExp(`${f}:\\s*"([^"]*)"`).exec(chunk);
      if (m) rec[f] = m[1];
    }
    const items = /itemIds:\s*\[([\s\S]*?)\]/.exec(chunk);
    if (items) rec.itemIds = [...items[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    if (rec.id) out.push(rec);
  }
  if (!out.length) fail(`${name} parsed empty`);
  return out;
}

const modules = arrayOf("verificationModules", ["id", "slug", "title", "summary"]);
const lessons = arrayOf("verificationLessons", ["id", "slug", "moduleId", "title"]);
const unitOf = flatMap("verificationUnitOfLesson");
const unitMeta = recordMap("verificationUnitMeta");
const modMeta = recordMap("verificationModuleMeta");

/* Module itemIds may name a paper from papers.data.ts, which this script does
   not read. curriculum.ts enumerates those ids so they can be skipped without
   weakening the "an unknown item is a build failure" rule. */
const paperIds = new Set(
  [...(/export const verificationPaperIds[^=]*=\s*\[([\s\S]*?)\]/.exec(src)?.[1] ?? "")
    .matchAll(/"([^"]+)"/g)].map((m) => m[1]),
);

const lessonById = new Map(lessons.map((l) => [l.id, l]));
const moduleById = new Map(modules.map((m) => [m.id, m]));

/* Every lesson must be placed, or the static site silently loses it. */
const unplaced = lessons.filter((l) => !unitOf[l.id]);
if (unplaced.length) {
  fail(
    `these lessons have no entry in verificationUnitOfLesson, so the static ` +
      `site cannot see them:\n     ` + unplaced.map((l) => l.id).join("\n     "),
  );
}

const out = { id: "verification", modules: [] };

for (const mod of modules) {
  const meta = modMeta[mod.id];
  if (!meta) fail(`verificationModuleMeta has no entry for ${mod.id}`);

  // Walk the module's own itemIds so unit order follows the graph, not this
  // script's idea of it.
  const seen = new Set();
  const units = [];
  for (const lessonId of mod.itemIds ?? []) {
    // Papers are readings hung off a unit, not units, so they carry no row in
    // the static course structure. Skipping them is declared in curriculum.ts
    // rather than guessed here, so an item that is neither still fails.
    if (paperIds.has(lessonId)) continue;
    const lesson = lessonById.get(lessonId);
    if (!lesson) {
      fail(
        `${mod.id} lists ${lessonId}, which is neither a lesson nor a listed ` +
          `paper. Add it to verificationLessons, or to verificationPaperIds ` +
          `if it is a paper from papers.data.ts.`,
      );
    }
    const unit = unitOf[lessonId];
    if (seen.has(unit)) {
      units[units.findIndex((u) => u.id === unit)].lessons.push(lesson.slug);
      continue;
    }
    seen.add(unit);
    const um = unitMeta[unit];
    if (!um) fail(`verificationUnitMeta has no entry for unit ${unit}`);
    units.push({
      id: unit,
      title: um.title,
      kind: um.kind,
      mins: um.mins,
      ...(um.optional ? { optional: true } : {}),
      // Where the reading actually lives. The static site links here rather
      // than carrying a second copy of the prose.
      href: `/tracks/verification/${mod.slug}/${lesson.slug}`,
      lessons: [lesson.slug],
    });
  }
  out.modules.push({
    n: meta.n,
    slug: meta.slug,
    title: meta.title,
    glyph: meta.glyph,
    week: meta.week,
    status: meta.status,
    goal: moduleById.get(mod.id).title,
    summary: mod.summary,
    units,
  });
}

out.modules.sort((a, b) => a.n - b.n);

const unitCount = out.modules.reduce((n, m) => n + m.units.length, 0);
const banner =
  `/* GENERATED FILE - do not edit by hand.\n` +
  `   Source: src/content/verification/curriculum.ts\n` +
  `   Regenerate: npm run verification:course\n\n` +
  `   The course exists once, in the content graph. This is the copy the\n` +
  `   no-build static site reads to draw its track page, skill map and guide.\n` +
  `   It carries structure only - no prose. Each unit's href points at the\n` +
  `   app, which owns the reading. */\n`;

const text = `${banner}window.COURSE = ${JSON.stringify(out, null, 2)};\n`;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== text) {
    console.error(
      "\npublic/verification/data/course.js is stale - run: npm run verification:course",
    );
    process.exit(1);
  }
  console.log(
    `verification course is up to date (${out.modules.length} modules, ${unitCount} units).`,
  );
  process.exit(0);
}

fs.writeFileSync(OUT, text);
console.log(
  `build-verification-course: ${out.modules.length} modules, ${unitCount} units -> ${path.relative(ROOT, OUT)}`,
);
