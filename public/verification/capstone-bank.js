/* Capstone bank — catalogue behaviour.

   Everything here is derived from window.CAPSTONE_BANK (generated from
   capstones/*.md by scripts/build-capstones.mjs). No entry is named in this
   file: facets, track headings and counts all come out of the data, so a new
   markdown file changes the page without touching this script.

   Trap: option counts respect every *other* facet's selection but not their
   own. That is what makes a count mean "what you would get by clicking this"
   rather than "what the folder holds" — passing the facet's own key into
   matches() would collapse every count to the current result set. */

"use strict";

VT.mountChrome('capstone-bank.html');
VT.mountFoot();

const DATA = window.CAPSTONE_BANK || { entries: [] };
const ENTRIES = DATA.entries || [];

/* Difficulty and status are glyph + word, never a bare tint, so the reading
   survives without colour at all. */
const DIFF_GLYPH = { core: '●', stretch: '◆', advanced: '▲' };
const STATUS_GLYPH = { ready: '●', draft: '◐', concept: '○' };
const STATUS_WORD = { ready: 'ready to run', draft: 'draft', concept: 'concept' };

/* ---------- facet definitions: which field, how it is grouped ---------- */

const FACETS = [
  { key: 'track', name: 'Track', get: e => e.track, primary: true },
  { key: 'difficulty', name: 'Difficulty', get: e => e.difficulty, primary: true, order: ['core', 'stretch', 'advanced'] },
  { key: 'team', name: 'Team size', get: e => e.team.bucket, primary: true, order: ['Solo', 'Pair or trio', 'Team of 4+'] },
  { key: 'effort', name: 'Effort', get: e => e.effort.bucket, order: ['Up to 14 hrs', '15–20 hrs', 'Over 20 hrs'] },
  { key: 'deliverable', name: 'Deliverable', get: e => e.deliverableType },
  { key: 'mentor', name: 'Mentor', get: e => e.mentor, order: ['none', 'optional', 'recommended', 'required'] },
  { key: 'status', name: 'Status', get: e => e.status, order: ['ready', 'draft', 'concept'] },
];

const selected = {};
for (const f of FACETS) selected[f.key] = new Set();
let query = '';
let sortBy = 'track';
let refocus = null;

/* ---------- filtering ---------- */

function haystack(e) {
  return [e.title, e.summary, e.track, e.deliverable, e.audience,
    e.skills.join(' '), e.prerequisites.join(' '), e.difficulty, e.deliverableType,
    e.sources.map(s => s.label).join(' ')]
    .join(' ').toLowerCase();
}

const HAY = new Map(ENTRIES.map(e => [e.slug, haystack(e)]));

function matches(e, skipKey) {
  if (query && !HAY.get(e.slug).includes(query)) return false;
  for (const f of FACETS) {
    if (f.key === skipKey) continue;
    const sel = selected[f.key];
    if (sel.size && !sel.has(f.get(e))) return false;
  }
  return true;
}

function optionsFor(f) {
  const all = new Map();
  for (const e of ENTRIES) {
    const v = f.get(e);
    if (!all.has(v)) all.set(v, 0);
    if (matches(e, f.key)) all.set(v, all.get(v) + 1);
  }
  let keys = [...all.keys()];
  if (f.order) keys.sort((a, b) => f.order.indexOf(a) - f.order.indexOf(b));
  else keys.sort((a, b) => a.localeCompare(b));
  return keys.map(v => ({ value: v, count: all.get(v) }));
}

/* ---------- sorting ---------- */

const SORTS = {
  track: (a, b) => a.track.localeCompare(b.track) || a.title.localeCompare(b.title),
  effort: (a, b) => (a.effort.min - b.effort.min) || (a.effort.max - b.effort.max) || a.title.localeCompare(b.title),
  team: (a, b) => (a.team.min - b.team.min) || (a.team.max - b.team.max) || a.title.localeCompare(b.title),
  duration: (a, b) => (a.duration.weeks - b.duration.weeks) || a.title.localeCompare(b.title),
  title: (a, b) => a.title.localeCompare(b.title),
};

/* ---------- rendering ---------- */

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

const grid = document.getElementById('grid');
const emptyMsg = document.getElementById('empty');
const resultCount = document.getElementById('resultCount');
const activeRow = document.getElementById('activeRow');
const activeChips = document.getElementById('activeChips');

function statTile(k, v, unit, derived) {
  const t = el('div', 'stat' + (derived ? ' derived' : ''));
  t.appendChild(el('span', 'k', k));
  const val = el('span', 'v', v);
  if (unit) {
    val.textContent = v + ' ';
    val.appendChild(el('span', 'u', unit));
  }
  t.appendChild(val);
  return t;
}

const range = r => (r.min === r.max ? String(r.min) : `${r.min}–${r.max}`);

function statsFor(e, host) {
  host.appendChild(statTile('People', range(e.team), e.team.max === 1 ? 'solo' : 'people'));
  host.appendChild(statTile('Total effort', range(e.effort), 'hrs'));
  host.appendChild(statTile('Runs over', e.duration.label.replace(/\s*weeks?$/, ''),
    /week/.test(e.duration.label) ? (e.duration.weeks === 1 ? 'week' : 'weeks') : ''));
  if (e.perWeek) host.appendChild(statTile('Weekly load', e.perWeek.replace(/\s*hrs\/wk$/, ''), 'hrs/wk', true));
}

function cardFor(e) {
  const card = el('a', 'cap-card');
  card.href = '#' + e.slug;

  const top = el('div', 'card-top');
  top.appendChild(el('span', 'card-track', e.track));
  top.appendChild(el('span', 'spacer'));
  const status = el('span', 'status');
  status.appendChild(el('span', 'g', STATUS_GLYPH[e.status] || '○'));
  status.appendChild(el('span', null, STATUS_WORD[e.status] || e.status));
  top.appendChild(status);
  card.appendChild(top);

  card.appendChild(el('h2', null, e.title));
  card.appendChild(el('p', 'summary', e.summary));

  const stats = el('div', 'stats');
  statsFor(e, stats);
  card.appendChild(stats);

  const meta = el('div', 'card-meta');
  const diff = el('span', 'chip');
  diff.appendChild(el('span', 'g', DIFF_GLYPH[e.difficulty] || '●'));
  diff.appendChild(el('span', null, e.difficulty));
  meta.appendChild(diff);
  meta.appendChild(el('span', 'chip', e.deliverableType));
  meta.appendChild(el('span', 'chip', e.mentor === 'none' ? 'no mentor' : 'mentor ' + e.mentor));
  card.appendChild(meta);

  const foot = el('div', 'card-foot');
  foot.appendChild(el('span', 'deliverable', e.deliverable));
  foot.appendChild(el('span', 'open-cue', 'brief →'));
  card.appendChild(foot);

  return card;
}

function render() {
  const visible = ENTRIES.filter(e => matches(e)).sort(SORTS[sortBy]);

  grid.replaceChildren();
  if (sortBy === 'track') {
    let current = null;
    for (const e of visible) {
      if (e.track !== current) {
        current = e.track;
        const n = visible.filter(x => x.track === current).length;
        const head = el('div', 'track-head');
        head.appendChild(el('span', 'name', current));
        head.appendChild(el('span', 'rule'));
        head.appendChild(el('span', 'n', `${n} capstone${n === 1 ? '' : 's'}`));
        grid.appendChild(head);
      }
      grid.appendChild(cardFor(e));
    }
  } else {
    for (const e of visible) grid.appendChild(cardFor(e));
  }

  emptyMsg.hidden = visible.length > 0;

  const filtered = visible.length !== ENTRIES.length;
  resultCount.replaceChildren();
  resultCount.appendChild(document.createTextNode('Showing '));
  resultCount.appendChild(el('b', null, String(visible.length)));
  resultCount.appendChild(document.createTextNode(
    filtered ? ` of ${ENTRIES.length} capstones` : ` capstone${visible.length === 1 ? '' : 's'}`));

  renderFacets();
  renderActive();

  // The chip list is rebuilt on every change; put focus back on the chip the
  // user just pressed so keyboard filtering doesn't dump you at the top.
  if (refocus) {
    const target = document.querySelector(
      `.facet-chip[data-facet="${refocus.facet}"][data-value="${CSS.escape(refocus.value)}"]`);
    if (target) target.focus();
    refocus = null;
  }
}

function renderFacets() {
  for (const container of [document.getElementById('facetsPrimary'), document.getElementById('facetsExtra')]) {
    container.replaceChildren();
  }
  for (const f of FACETS) {
    const container = document.getElementById(f.primary ? 'facetsPrimary' : 'facetsExtra');
    const group = el('div', 'facet-group');
    group.appendChild(el('span', 'facet-name', f.name));
    const opts = el('div', 'facet-opts');
    for (const { value, count } of optionsFor(f)) {
      const on = selected[f.key].has(value);
      const chip = el('button', 'facet-chip');
      chip.type = 'button';
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      chip.appendChild(el('span', null, value));
      chip.appendChild(el('span', 'n', String(count)));
      chip.disabled = count === 0 && !on;
      chip.dataset.facet = f.key;
      chip.dataset.value = value;
      chip.addEventListener('click', () => {
        if (on) selected[f.key].delete(value); else selected[f.key].add(value);
        refocus = { facet: f.key, value };
        render();
      });
      opts.appendChild(chip);
    }
    group.appendChild(opts);
    container.appendChild(group);
  }
}

function renderActive() {
  activeChips.replaceChildren();
  let any = false;
  for (const f of FACETS) {
    for (const value of selected[f.key]) {
      any = true;
      const chip = el('button', 'active-chip');
      chip.type = 'button';
      chip.setAttribute('aria-label', `Remove filter ${f.name}: ${value}`);
      chip.appendChild(el('span', null, `${f.name}: ${value}`));
      chip.appendChild(el('span', 'x', '×'));
      chip.addEventListener('click', () => { selected[f.key].delete(value); render(); });
      activeChips.appendChild(chip);
    }
  }
  activeRow.hidden = !any;
}

/* ---------- detail sheet ---------- */

const overlay = document.getElementById('overlay');
const sheet = document.getElementById('sheet');
const sheetBody = document.getElementById('sheetBody');
let lastFocus = null;

function factRow(dl, label, value) {
  if (!value || (Array.isArray(value) && !value.length)) return;
  dl.appendChild(el('dt', null, label));
  const dd = el('dd');
  if (Array.isArray(value)) {
    const tags = el('div', 'tags');
    for (const v of value) tags.appendChild(el('span', 'tag', v));
    dd.appendChild(tags);
  } else {
    dd.textContent = value;
  }
  dl.appendChild(dd);
}

function openSheet(slug) {
  const e = ENTRIES.find(x => x.slug === slug);
  if (!e) return;
  if (overlay.hidden) lastFocus = document.activeElement;

  sheetBody.replaceChildren();

  const eyebrow = el('div', 'sheet-eyebrow');
  eyebrow.appendChild(el('span', null, e.track));
  const status = el('span', 'status');
  status.appendChild(el('span', 'g', STATUS_GLYPH[e.status] || '○'));
  status.appendChild(el('span', null, STATUS_WORD[e.status] || e.status));
  eyebrow.appendChild(status);
  sheetBody.appendChild(eyebrow);

  const h1 = el('h1', null, e.title);
  h1.id = 'sheetTitle';
  sheetBody.appendChild(h1);
  sheetBody.appendChild(el('p', 'sheet-summary', e.summary));

  const stats = el('div', 'sheet-stats');
  statsFor(e, stats);
  sheetBody.appendChild(stats);

  const dl = el('dl', 'facts');
  factRow(dl, 'Deliverable', e.deliverable);
  factRow(dl, 'Audience', e.audience);
  factRow(dl, 'Difficulty', `${e.difficulty} · mentor ${e.mentor}`);
  factRow(dl, 'Skills', e.skills);
  factRow(dl, 'Prerequisites', e.prerequisites);
  sheetBody.appendChild(dl);

  const body = el('div', 'body');
  body.innerHTML = e.html; // generated at build time from capstones/*.md
  sheetBody.appendChild(body);

  if (e.sources.length) {
    const box = el('section', 'sources');
    box.appendChild(el('h3', null, 'Where this came from'));
    const list = el('ul');
    for (const s of e.sources) {
      const li = el('li');
      if (s.href) {
        const a = el('a', null, s.label);
        a.href = s.href;
        // Off-site sources open in a new tab: the brief is a reading desk, and
        // following a citation must not close the thing you are reading it for.
        if (/^https?:/.test(s.href)) { a.target = '_blank'; a.rel = 'noopener'; }
        li.appendChild(a);
      } else {
        li.textContent = s.label;
      }
      list.appendChild(li);
    }
    box.appendChild(list);
    sheetBody.appendChild(box);
  }

  /* The bank is a catalogue; the workspace is where the drafting happens.
     The link carries the slug so the workspace can name what is being
     drafted rather than opening blank. */
  const act = el('div', 'sheet-actions');
  const draft = el('a', 'btn');
  draft.href = 'capstone.html?brief=' + encodeURIComponent(e.slug);
  draft.textContent = 'Draft this in the workspace';
  act.appendChild(draft);
  sheetBody.appendChild(act);

  const foot = el('div', 'sheet-foot');
  foot.appendChild(el('span', null, `source: ${e.source}`));
  foot.appendChild(el('span', null, `updated ${e.updated}`));
  sheetBody.appendChild(foot);

  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
  sheet.focus();
}

function closeSheet() {
  if (overlay.hidden) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
  // replaceState, not pushState: closing shouldn't leave a history entry that
  // reopens the same sheet on Back.
  if (location.hash) history.replaceState('', document.title, location.pathname + location.search);
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/* Keep Tab inside the open sheet — it is a modal, so the background must not
   be reachable while it is up. */
sheet.addEventListener('keydown', ev => {
  if (ev.key !== 'Tab') return;
  const focusable = sheet.querySelectorAll('a[href], button, input, select, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (ev.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
    ev.preventDefault();
    last.focus();
  } else if (!ev.shiftKey && document.activeElement === last) {
    ev.preventDefault();
    first.focus();
  }
});

function syncHash() {
  const slug = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (slug && ENTRIES.some(e => e.slug === slug)) openSheet(slug);
  else { overlay.hidden = true; document.body.style.overflow = ''; }
}

/* ---------- wiring ---------- */

document.getElementById('search').addEventListener('input', ev => {
  query = ev.target.value.trim().toLowerCase();
  render();
});

document.getElementById('sort').addEventListener('change', ev => {
  sortBy = ev.target.value;
  render();
});

const moreBtn = document.getElementById('moreBtn');
moreBtn.addEventListener('click', () => {
  const open = moreBtn.getAttribute('aria-expanded') === 'true';
  moreBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
  document.getElementById('facetsExtra').hidden = open;
  moreBtn.textContent = open ? 'More filters' : 'Fewer filters';
});

function clearAll() {
  for (const f of FACETS) selected[f.key].clear();
  query = '';
  document.getElementById('search').value = '';
  render();
}

document.getElementById('clearBtn').addEventListener('click', clearAll);
for (const b of document.querySelectorAll('[data-clear]')) b.addEventListener('click', clearAll);

document.getElementById('sheetClose').addEventListener('click', closeSheet);
overlay.addEventListener('click', ev => { if (ev.target === overlay) closeSheet(); });
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') closeSheet(); });
window.addEventListener('hashchange', syncHash);

render();
syncHash();
