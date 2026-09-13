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
 * A slot is one of three shapes, and the desk needs each resolved:
 *
 *   - a desk slot carries its brief in memos.ts and passes through;
 *   - a lesson task (`task`) is answered in the lesson's writing exercise, so
 *     its brief IS that exercise's prompt — read here from exercises.ts, never
 *     copied into memos.ts — and it gets an `href` to the exercise on its
 *     lesson page, resolved from curriculum.ts;
 *   - a page slot (`href`) points at another app surface and passes through.
 *
 * `lesson` is dropped on the way out: it says which app lesson carries the
 * work, which the static desk reaches through `href` instead.
 *
 * Zero dependencies and no tsc: the sources are flat literals, read with a
 * narrow parser that fails loudly rather than guessing. Output is
 * deterministic so --check diffs byte for byte.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "src", "content", "verification");
const SRC = path.join(CONTENT, "memos.ts");
const EXERCISES = path.join(CONTENT, "exercises.ts");
const CURRICULUM = path.join(CONTENT, "curriculum.ts");
const OUT = path.join(ROOT, "public", "verification", "data", "memos.js");

const src = fs.readFileSync(SRC, "utf8");

function fail(msg) {
  console.error(`\nbuild-verification-memos failed:\n  x ${msg}`);
  process.exit(1);
}

/** The body of `export const NAME … [ … ];`, brace/bracket balanced. */
function block(text, name, open, close) {
  const start = text.indexOf(`export const ${name}`);
  if (start < 0) fail(`could not find "export const ${name}"`);
  const from = text.indexOf(open, text.indexOf("=", start));
  let depth = 0,
    i = from,
    inStr = false,
    q = "";
  while (i < text.length) {
    const c = text[i];
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
  return text.slice(from, i + 1);
}

/* One record per top-level `{ … }` inside an array literal. Fields are read
   with JSON.parse on the quoted value, so escapes and the outline's own
   quotation marks survive intact. */
function records(text, name) {
  const body = block(text, name, "[", "]");
  const chunks = body.split(/\n  \{\n/).slice(1);
  const out = [];
  for (const rawChunk of chunks) {
    const rec = {};
    /* Drop whole-line block comments before reading the fields. Whole-line
       only: a `/*` inside a quoted brief is still a brief. */
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
        if (!m) fail(`could not read ${key} in ${rec.id ?? "a record"}: ${value.slice(0, 60)}`);
        rec[key] = m[1] === '"' ? JSON.parse(`"${m[2]}"`) : m[2].replace(/\\'/g, "'");
      }
    }
    if (rec.id) out.push(rec);
  }
  if (!out.length) fail(`${name} parsed empty`);
  return out;
}

/* ---------- the two sources a task slot resolves against ---------- */

const exercisesSrc = fs.readFileSync(EXERCISES, "utf8");
const exerciseById = new Map(
  records(exercisesSrc, "verificationExercises").map((e) => [e.id, e]),
);

const curriculumSrc = fs.readFileSync(CURRICULUM, "utf8");
const lessons = records(curriculumSrc, "verificationLessons");
const modules = [...block(curriculumSrc, "verificationModules", "[", "]").matchAll(
  /id:\s*"([^"]+)",\s*\n\s*slug:\s*"([^"]+)"/g,
)].map((m) => ({ id: m[1], slug: m[2] }));
const moduleSlug = new Map(modules.map((m) => [m.id, m.slug]));

/** The page a lesson lives on, by its contentRef stem. */
function lessonHref(stem) {
  const lesson = lessons.find((l) => l.contentRef === `verification/${stem}`);
  if (!lesson) fail(`no lesson has contentRef verification/${stem}`);
  const slug = moduleSlug.get(lesson.moduleId);
  if (!slug) fail(`lesson ${lesson.id} names module ${lesson.moduleId}, which has no slug`);
  return `/tracks/verification/${slug}/${lesson.slug}`;
}

/* ---------- the slots ---------- */

const memoModules = [...block(src, "memoModules", "[", "]").matchAll(/"([^"]+)"/g)].map(
  (m) => m[1],
);
if (memoModules.length !== 5) fail(`memoModules parsed ${memoModules.length} names, expected 5`);

const slots = records(src, "memoSlots").map((slot) => {
  const { lesson, ...rest } = slot;
  if (!rest.task) return rest;

  const exercise = exerciseById.get(rest.task);
  if (!exercise) fail(`${rest.id} names task ${rest.task}, which exercises.ts does not declare`);
  if (exercise.type !== "writing-prompt") {
    fail(`${rest.id} names task ${rest.task}, which is a ${exercise.type}, not writing`);
  }

  /* The prompt's opening "Optional: …" line is the task's own title line in
     the lesson; the slot carries the title, so the brief starts after it. */
  let brief = exercise.prompt;
  const optionalLead = /^Optional:\s*/.exec(brief);
  if (optionalLead) {
    const firstBreak = /\n\s*\n/.exec(brief);
    brief = firstBreak ? brief.slice(firstBreak.index + firstBreak[0].length) : brief.slice(optionalLead[0].length);
  }

  return {
    ...rest,
    ...(exercise.optional || optionalLead ? { optional: true } : {}),
    brief,
    words: exercise.maxWords ?? 0,
    ...(exercise.minWords ? { wordsMin: exercise.minWords } : {}),
    href: `${lessonHref(lesson)}#${rest.task}`,
  };
});

for (const slot of slots) {
  if (slot.status !== "specified" && !slot.gap) {
    fail(`${slot.id} is "${slot.status}" and carries no gap note — say what is missing`);
  }
  if (slot.status === "specified" && !slot.brief) {
    fail(`${slot.id} is "specified" but resolved to no brief`);
  }
}

const banner =
  `/* GENERATED FILE - do not edit by hand.\n` +
  `   Source: src/content/verification/memos.ts (+ exercises.ts for task prompts,\n` +
  `   curriculum.ts for lesson links)\n` +
  `   Regenerate: npm run verification:memos\n\n` +
  `   Every place the course asks for a written output. The briefs are the\n` +
  `   outline's own words; \`status\` says how much of each one exists; a slot\n` +
  `   with \`task\` is answered in the lesson at \`href\`, not drafted on the desk. */\n`;

const text =
  banner +
  `window.VERIFICATION_MEMO_MODULES = ${JSON.stringify(memoModules, null, 2)};\n\n` +
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
