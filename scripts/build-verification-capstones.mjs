#!/usr/bin/env node
/*
 * build-verification-capstones.mjs
 *   verification-capstones/*.md  →  public/verification/data/capstone-bank.js
 *
 * The capstone bank has no hardcoded cards. Drop a markdown file into
 * capstones/, run this, and the card exists: hero stats from the front
 * matter, detail panel from the body, filter facets derived from whatever
 * values happen to be in the folder. A new track name or deliverable type
 * becomes a new filter chip without anyone editing the page.
 *
 *   npm run verification:capstones           # write the data file
 *   npm run verification:capstones -- --check   # verify it is up to date
 *
 * Zero dependencies on purpose. public/verification/ is a static island served
 * by the Next app, not compiled by it, so this output is committed and the
 * page works from a bare checkout.
 *
 * Output is deterministic (no timestamps, stable ordering) so --check can
 * diff it byte for byte.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'verification-capstones');
const OUT = path.join(ROOT, 'public', 'verification', 'data', 'capstone-bank.js');
// The app reads the same bank, and cannot read a file that assigns to
// `window`. One source, two shapes: the static page keeps its script tag and
// the app imports JSON. Both are written together and both are covered by
// --check, so neither can go stale on its own.
const OUT_JSON = path.join(ROOT, 'src', 'content', 'verification', 'capstone-bank.json');

const REQUIRED = ['title', 'track', 'status', 'summary', 'team', 'effort_hours',
  'duration', 'difficulty', 'deliverable', 'deliverable_type', 'mentor',
  'skills', 'updated'];
const OPTIONAL = ['audience', 'prerequisites', 'sources', 'verification_fit'];
/* The bank carries the whole program. These two tracks are the Verification
   course's own; an entry from any other track counts as in-course only when
   its file carries a verification_fit line saying which module it lands on. */
const NATIVE_TRACKS = new Set(['Verification', 'Cross-track']);
const ENUMS = {
  status: ['ready', 'draft', 'concept'],
  difficulty: ['core', 'stretch', 'advanced'],
  deliverable_type: ['memo', 'analysis', 'spec', 'dossier', 'notebook', 'design'],
  mentor: ['none', 'optional', 'recommended', 'required'],
};

const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`capstones/${file}: ${msg}`);

/* ---------------------------------------------------------------- front matter */

/* A deliberately small YAML subset: scalars, inline [a, b] arrays, and
   `- item` block arrays. Anything fancier belongs in the body, not the
   metadata — the front matter drives filter chips, and filter chips want
   flat values. */
function parseFrontMatter(src, file) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src);
  if (!m) { fail(file, 'no front-matter block (the file must start with ---)'); return null; }
  const data = {};
  const lines = m[1].split(/\r?\n/);
  let key = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const block = /^\s+-\s+(.*)$/.exec(line);
    if (block) {
      if (!key || !Array.isArray(data[key])) { fail(file, `line ${i + 1}: list item with no list key above it`); continue; }
      data[key].push(unquote(block[1]));
      continue;
    }
    const kv = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) { fail(file, `line ${i + 1}: cannot parse ${JSON.stringify(line)}`); continue; }
    key = kv[1];
    const raw = kv[2].trim();
    if (raw === '') data[key] = [];
    else if (raw.startsWith('[') && raw.endsWith(']')) data[key] = splitInline(raw.slice(1, -1));
    else data[key] = unquote(raw);
  }
  return { data, body: m[2] };
}

/* Split an inline array on commas that are not inside brackets, so a value
   like `[a, b [c, d]]` survives — the §-and-bracket citations in `sources`
   would otherwise shred. */
function splitInline(s) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '[') depth++;
    if (ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(v => unquote(v.trim())).filter(Boolean);
}

function unquote(v) {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
  return t;
}

/* ------------------------------------------------------------------- markdown */

const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
  let out = escapeHtml(s);
  const code = [];
  out = out.replace(/`([^`]+)`/g, (_, c) => `\u0000${code.push(c) - 1}\u0000`);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) =>
    `<a href="${href.replace(/"/g, '&quot;')}">${text}</a>`);
  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${code[Number(i)]}</code>`);
  return out;
}

function renderMarkdown(src, file) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;

  const isTableSep = l => /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(l) && l.includes('-');
  const cells = l => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (/^```/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      if (i >= lines.length) fail(file, 'unclosed fenced code block');
      i++;
      html.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      // Shift down one level: the page owns <h1>, an entry's "## The brief"
      // becomes an <h3> inside the detail panel.
      const level = Math.min(h[1].length + 1, 6);
      html.push(`<h${level}>${inline(h[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { html.push('<hr>'); i++; continue; }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      html.push(`<blockquote>${renderMarkdown(buf.join('\n'), file)}</blockquote>`);
      continue;
    }

    if (line.trim().startsWith('|') && isTableSep(lines[i + 1] || '')) {
      const head = cells(lines[i]);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      html.push(
        '<div class="table-scroll"><table><thead><tr>' +
        head.map(c => `<th>${inline(c)}</th>`).join('') +
        '</tr></thead><tbody>' +
        rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') +
        '</tbody></table></div>');
      continue;
    }

    const ordered = /^\s*\d+[.)]\s+/.test(line);
    if (ordered || /^\s*[-*]\s+/.test(line)) {
      const tag = ordered ? 'ol' : 'ul';
      const re = ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        let item = lines[i++].replace(re, '');
        // continuation lines: indented, not a new item, not blank
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !re.test(lines[i])) {
          item += ' ' + lines[i++].trim();
        }
        items.push(`<li>${inline(item)}</li>`);
      }
      html.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|```|\s*[-*]\s|\s*\d+[.)]\s)/.test(lines[i])
           && !(lines[i].trim().startsWith('|'))) {
      para.push(lines[i++].trim());
    }
    if (para.length) html.push(`<p>${inline(para.join(' '))}</p>`);
    else i++; // defensive: never spin
  }

  return html.join('\n');
}

/* -------------------------------------------------------------- derived stats */

function range(value, file, key) {
  const m = /^(\d+(?:\.\d+)?)(?:\s*[-–—]\s*(\d+(?:\.\d+)?))?$/.exec(String(value).trim());
  if (!m) { fail(file, `${key}: expected a number or a range like "2-4", got ${JSON.stringify(value)}`); return null; }
  const min = Number(m[1]);
  const max = m[2] === undefined ? min : Number(m[2]);
  if (max < min) { fail(file, `${key}: range runs backwards (${value})`); return null; }
  return { min, max };
}

function weeks(duration, file) {
  const m = /^(\d+)(?:\s*[-–—]\s*(\d+))?\s*(week|weeks|day|days)\b/i.exec(String(duration).trim());
  if (!m) { warnings.push(`capstones/${file}: duration "${duration}" has no parseable week count — sorting falls back to 0`); return 0; }
  const lo = Number(m[1]);
  const hi = m[2] === undefined ? lo : Number(m[2]);
  const mid = (lo + hi) / 2;
  return /day/i.test(m[3]) ? mid / 7 : mid;
}

/* A source is either a bare reference to something in this repo
   (`verification-track-outline.md §4.2`) or a markdown link out to the thing
   it actually came from. Both end up as {label, href}; href is null for the
   bare ones and the page renders those as plain text. Anything that looks
   like a half-written link — a bare URL, or `](` in a string that did not
   parse as one — is a build error, because a source that silently renders as
   unclickable text is worse than no source. Bare square brackets are fine on
   their own: one of the program docs is literally named
   `[Public] XLab Tracks - Program Proposal.md`. */
function parseSource(raw, file) {
  const link = /^\[([^\]]+)\]\((\S+)\)$/.exec(raw);
  if (link) {
    const href = link[2];
    if (!/^(https?:\/\/|\.{0,2}\/|[\w.-]+\.(html|md|js|json|py|css))/.test(href)) {
      fail(file, `sources: ${JSON.stringify(href)} is not an http(s) URL or a repo path`);
    }
    return { label: link[1].trim(), href };
  }
  if (/^https?:\/\//.test(raw)) {
    fail(file, `sources: ${JSON.stringify(raw)} is a bare URL — write it as [label](url) so the page has something to print`);
  } else if (/\]\(/.test(raw)) {
    fail(file, `sources: ${JSON.stringify(raw)} looks like a malformed markdown link`);
  }
  return { label: raw, href: null };
}

const teamBucket = t => t.max <= 1 ? 'Solo' : t.max <= 3 ? 'Pair or trio' : 'Team of 4+';
const effortBucket = e => e.max <= 14 ? 'Up to 14 hrs' : e.max <= 20 ? '15–20 hrs' : 'Over 20 hrs';
const fmtRange = r => r.min === r.max ? String(r.min) : `${r.min}–${r.max}`;

/* ----------------------------------------------------------------------- main */

if (!fs.existsSync(SRC)) {
  console.error(`ERROR: ${path.relative(ROOT, SRC)}/ does not exist.`);
  process.exit(1);
}

const files = fs.readdirSync(SRC)
  .filter(f => f.endsWith('.md') && !f.startsWith('_'))
  .sort();

if (!files.length) {
  console.error(`ERROR: no capstone markdown files in ${path.relative(ROOT, SRC)}/ (files starting with _ are ignored).`);
  process.exit(1);
}

const entries = [];
const slugs = new Set();

for (const file of files) {
  const parsed = parseFrontMatter(fs.readFileSync(path.join(SRC, file), 'utf8'), file);
  if (!parsed) continue;
  const { data, body } = parsed;

  for (const key of REQUIRED) {
    const v = data[key];
    if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) fail(file, `missing required key "${key}"`);
  }
  for (const [key, allowed] of Object.entries(ENUMS)) {
    if (data[key] !== undefined && !allowed.includes(data[key])) {
      fail(file, `${key}: ${JSON.stringify(data[key])} is not one of ${allowed.join(' | ')}`);
    }
  }
  for (const key of Object.keys(data)) {
    if (!REQUIRED.includes(key) && !OPTIONAL.includes(key)) {
      warnings.push(`capstones/${file}: unknown front-matter key "${key}" — carried through to the data file but no UI reads it`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.updated || ''))) fail(file, 'updated: expected YYYY-MM-DD');
  if (String(data.summary || '').length > 200) fail(file, `summary is ${data.summary.length} chars — keep it under 200 so cards stay comparable`);
  if (data.verification_fit !== undefined) {
    if (typeof data.verification_fit !== 'string' || !data.verification_fit.trim()) {
      fail(file, 'verification_fit: expected a one-line reason string');
    } else if (data.verification_fit.length > 200) {
      fail(file, `verification_fit is ${data.verification_fit.length} chars — one line, like summary`);
    }
    if (NATIVE_TRACKS.has(data.track)) {
      warnings.push(`capstones/${file}: verification_fit on a ${data.track} entry is redundant — the course already owns it`);
    }
  }

  const slug = file.replace(/\.md$/, '');
  if (slugs.has(slug)) fail(file, `duplicate slug "${slug}"`);
  slugs.add(slug);

  const team = range(data.team, file, 'team');
  const effort = range(data.effort_hours, file, 'effort_hours');
  if (!team || !effort) continue;

  const w = weeks(data.duration, file);
  const perWeek = w > 0 ? Math.round(((effort.min + effort.max) / 2) / w) : null;

  entries.push({
    slug,
    source: `verification-capstones/${file}`,
    title: data.title,
    track: data.track,
    status: data.status,
    summary: data.summary,
    team: { min: team.min, max: team.max, label: `${fmtRange(team)} ${team.max === 1 ? 'person' : 'people'}`, bucket: teamBucket(team) },
    effort: { min: effort.min, max: effort.max, label: `${fmtRange(effort)} hrs`, bucket: effortBucket(effort) },
    duration: { label: data.duration, weeks: w },
    perWeek: perWeek === null ? null : `≈${perWeek} hrs/wk`,
    difficulty: data.difficulty,
    deliverable: data.deliverable,
    deliverableType: data.deliverable_type,
    mentor: data.mentor,
    audience: data.audience || '',
    verificationFit: typeof data.verification_fit === 'string' && data.verification_fit.trim() || null,
    courseFit: NATIVE_TRACKS.has(data.track) || Boolean(data.verification_fit),
    skills: [].concat(data.skills || []),
    prerequisites: [].concat(data.prerequisites || []),
    sources: [].concat(data.sources || []).map(s => parseSource(s, file)),
    updated: data.updated,
    html: renderMarkdown(body.trim(), file),
  });
}

if (warnings.length) {
  console.warn('\nwarnings:');
  for (const w of warnings) console.warn(`  ! ${w}`);
}

if (errors.length) {
  console.error('\nbuild-capstones failed:');
  for (const e of errors) console.error(`  × ${e}`);
  console.error(`\n${errors.length} problem(s). See verification-capstones/_README.md for the front-matter contract.`);
  process.exit(1);
}

entries.sort((a, b) => a.slug.localeCompare(b.slug));

const banner = `/* GENERATED FILE — do not edit by hand.
   Source: verification-capstones/*.md
   Regenerate: npm run verification:capstones
   ${entries.length} capstone(s). Ordering and formatting are deterministic so
   CI can diff this file against a fresh build. */\n`;

const payload = { count: entries.length, entries };
const out = `${banner}window.CAPSTONE_BANK = ${JSON.stringify(payload, null, 2)};\n`;
const outJson = `${JSON.stringify(payload, null, 2)}\n`;

if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  const currentJson = fs.existsSync(OUT_JSON) ? fs.readFileSync(OUT_JSON, 'utf8') : '';
  if (current !== out || currentJson !== outJson) {
    console.error('\nthe generated capstone bank is stale — run: npm run verification:capstones');
    process.exit(1);
  }
  console.log(`capstone bank is up to date (${entries.length} entries).`);
  process.exit(0);
}

fs.writeFileSync(OUT, out);
fs.writeFileSync(OUT_JSON, outJson);
console.log(`build-capstones: ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} → ${path.relative(ROOT, OUT)} + ${path.relative(ROOT, OUT_JSON)}`);
