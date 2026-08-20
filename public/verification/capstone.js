/* Capstone workspace. Autosaves to localStorage, exports Markdown.

   The red-team table is generated from the evasion routes in
   data/exercises.js rather than restated here — if 3.1 gains a ninth route,
   this pass gains a ninth row and the learner cannot quietly skip it.

   The pre-submit checks are rule-based and each one names its own rule in
   the message. They are lint, not judgment: nothing here scores the writing,
   and the panel says so. */

"use strict";

{
  VT.mountChrome('/verification/capstone');
  VT.mountFoot();

  const KEY = 'vt-capstone';
  const LAYERS = ['— not caught —', 'Hardware', 'Cloud', 'Intelligence', 'Human', 'Outside these layers'];

  /* A brief handed over from the capstone bank. The workspace's sections do
     not change — they are the track's template — so this is a banner naming
     what is being answered, with the full brief one click away.

     Trap: the slug comes from the URL. Look it up in the bank rather than
     printing it, or the page renders whatever a link put in the query. */
  (function brief() {
    const host = document.querySelector('[data-brief]');
    const slug = new URLSearchParams(location.search).get('brief');
    if (!host || !slug) return;
    const bank = (window.CAPSTONE_BANK || {}).entries || [];
    const e = bank.find(x => x.slug === slug);
    if (!e) return;
    host.className = 'note brief-note';
    host.innerHTML =
      '<b>Answering a brief from the bank.</b> ' + VT.esc(e.title) + ' &mdash; ' +
      VT.esc(e.deliverable) + '. ' +
      '<a href="/verification/capstone-bank#' + encodeURIComponent(e.slug) + '">Read the full brief &rarr;</a>';
  })();

  /* Pinned fields: audience, decision and falsifier equivalents for a regime
     design — the three things a reader needs before the prose is worth
     reading. */
  const PINS = [
    { id: 'claim', label: 'The claim', hint: 'What does your regime establish? One sentence.' },
    { id: 'adversary', label: 'Against whom', hint: 'Which adversary, at what capability.' },
    { id: 'horizon', label: 'Over what horizon', hint: 'The window the finding has to arrive inside.' },
    { id: 'audience', label: 'Written for', hint: 'The decisionmaker who has to act on it.' }
  ];

  const SECTIONS = [
    { id: 'agreement', t: 'The agreement', ask: 'The commitment itself, and the verification claim it implies. Goal, rule, claim — kept apart.' },
    { id: 'scope', t: 'Scope', ask: 'Covered actors, objects, activities, conditions. Where does each threshold sit, and what does it invite?' },
    { id: 'declarations', t: 'Declarations and reporting', ask: 'What must be declared, by whom, how often — and what independent evidence checks each declaration.' },
    { id: 'stack', t: 'The verification stack', ask: 'Which mechanisms you are deploying. Mark each load-bearing or corroborating, and say why.' },
    { id: 'access', t: 'The access regime', ask: 'What a verifier is allowed to see, and what stays confidential. Your answer to the verifier\'s paradox.' },
    { id: 'evidence', t: 'Evidence standards', ask: 'What counts as confirmed, plausible, unresolved, unsupported — and who grades it.' },
    { id: 'enforcement', t: 'Enforcement', ask: 'The pathway from a confirmed finding to a consequence, and the threshold that triggers each step.' },
    { id: 'failure', t: 'How you would know it failed', ask: 'The observations that would tell you the regime is not working. Be specific enough to be wrong.' },
    { id: 'pitch', t: 'The cold pitch', ask: 'Sixty seconds, to someone who did not ask. One recommendation, the claim, its confidence grade.' }
  ];

  let doc = load();

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || '{}');
      return Object.assign({ pins: {}, secs: {}, rt: {} }, d);
    } catch (e) { return { pins: {}, secs: {}, rt: {} }; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(doc)); } catch (e) { /* private mode */ }
  }

  const words = s => (s || '').trim() ? (s.trim().match(/\S+/g) || []).length : 0;
  const routes = window.EXERCISES['ex-evasion'].rows;

  /* ---------- render ---------- */

  document.querySelector('[data-pinned]').innerHTML = PINS.map(p =>
    '<div class="pin"><label for="pin-' + p.id + '">' + VT.esc(p.label) + '</label>' +
    '<input id="pin-' + p.id + '" data-pin="' + p.id + '" value="' + VT.esc(doc.pins[p.id] || '') + '">' +
    '<span class="hint">' + VT.esc(p.hint) + '</span></div>').join('');

  document.querySelector('[data-sections]').innerHTML = SECTIONS.map(s =>
    '<section class="ws-sec' + (words(doc.secs[s.id]) ? ' filled' : '') + '" data-sec="' + s.id + '">' +
      '<div class="head"><h3>' + VT.esc(s.t) + '</h3>' +
        '<span class="wc" data-wc="' + s.id + '">' + words(doc.secs[s.id]) + ' words</span></div>' +
      '<p class="ask">' + VT.esc(s.ask) + '</p>' +
      '<textarea rows="5" data-body="' + s.id + '">' + VT.esc(doc.secs[s.id] || '') + '</textarea>' +
    '</section>').join('');

  document.querySelector('[data-redteam]').innerHTML = routes.map(r => {
    const cur = doc.rt[r.id] || { layer: 0, how: '' };
    return '<section class="ws-sec"><div class="rt-row">' +
      '<span class="route">' + VT.esc(r.t) + '</span>' +
      '<select data-rt-layer="' + r.id + '" aria-label="Catching layer for ' + VT.esc(r.t) + '">' +
        LAYERS.map((l, i) => '<option value="' + i + '"' + (i === cur.layer ? ' selected' : '') + '>' +
          VT.esc(l) + '</option>').join('') + '</select>' +
      '<input data-rt-how="' + r.id + '" placeholder="What fires, and how fast" value="' +
        VT.esc(cur.how) + '">' +
      '</div></section>';
  }).join('');

  /* ---------- stats and lint ---------- */

  function totalWords() {
    return SECTIONS.reduce((n, s) => n + words(doc.secs[s.id]), 0);
  }

  function checks() {
    const uncaught = routes.filter(r => !doc.rt[r.id] || doc.rt[r.id].layer === 0);
    const noHow = routes.filter(r => doc.rt[r.id] && doc.rt[r.id].layer > 0 && !words(doc.rt[r.id].how));
    return [
      { ok: PINS.every(p => words(doc.pins[p.id])),
        t: 'All four non-negotiables filled — checked that claim, adversary, horizon and audience are each non-empty.' },
      { ok: SECTIONS.every(s => words(doc.secs[s.id]) >= 40),
        t: 'Every section past 40 words — a section under that is a heading, not an answer.' },
      { ok: uncaught.length === 0,
        t: uncaught.length
          ? uncaught.length + ' evasion route(s) still marked not caught: ' +
            uncaught.map(r => r.t).join(', ') + '. That may be the honest answer — say so in "How you would know it failed".'
          : 'Every evasion route assigned a catching layer.' },
      { ok: noHow.length === 0,
        t: 'Each caught route says what fires — looked for text beside every route with a layer selected.' },
      { ok: /confirmed|plausible|unresolved|unsupported/i.test(doc.secs.evidence || ''),
        t: 'Evidence standards name the confidence grades — searched for confirmed / plausible / unresolved / unsupported.' },
      { ok: /load-bearing|corroborat/i.test(doc.secs.stack || ''),
        t: 'The stack distinguishes load-bearing from corroborating — searched for those words in that section.' },
      { ok: words(doc.secs.pitch) > 0 && words(doc.secs.pitch) <= 180,
        t: 'The cold pitch is at most 180 words — sixty seconds of speech, roughly. Longer is a different document.' }
    ];
  }

  function drawStats() {
    const filled = SECTIONS.filter(s => words(doc.secs[s.id]) >= 40).length;
    document.querySelector('[data-bar]').style.width = (filled / SECTIONS.length * 100).toFixed(1) + '%';
    document.querySelector('[data-count]').textContent = filled + ' / ' + SECTIONS.length + ' sections';
    document.querySelector('[data-words]').textContent = totalWords() + ' words in the design';
    document.querySelector('[data-checks]').innerHTML = checks().map(c =>
      '<li class="' + (c.ok ? 'ok' : '') + '"><span class="mark">' + (c.ok ? 'passes' : 'open') +
      '</span><span class="txt">' + VT.esc(c.t) + '</span></li>').join('') +
      '<li><span class="mark">note</span><span class="txt">These are rule-based checks, not judgment. ' +
      'They look for words and lengths; the rubric and your facilitator are what actually assess the work.</span></li>';
  }

  /* ---------- wiring ---------- */

  let t = 0;
  const debounced = () => { clearTimeout(t); t = setTimeout(() => { save(); drawStats(); }, 350); };

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.pin) { doc.pins[el.dataset.pin] = el.value; debounced(); return; }
    if (el.dataset.body) {
      const id = el.dataset.body;
      doc.secs[id] = el.value;
      const n = words(el.value);
      document.querySelector('[data-wc="' + id + '"]').textContent = n + ' words';
      el.closest('.ws-sec').classList.toggle('filled', n > 0);
      debounced();
      return;
    }
    if (el.dataset.rtHow) {
      const id = el.dataset.rtHow;
      doc.rt[id] = Object.assign({ layer: 0, how: '' }, doc.rt[id], { how: el.value });
      debounced();
    }
  });

  document.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.rtLayer) {
      const id = el.dataset.rtLayer;
      doc.rt[id] = Object.assign({ layer: 0, how: '' }, doc.rt[id], { layer: +el.value });
      save();
      drawStats();
    }
  });

  /* ---------- export ---------- */

  document.querySelector('[data-export]').addEventListener('click', () => {
    const lines = ['# Verification regime — capstone', ''];
    PINS.forEach(p => lines.push('**' + p.label + ':** ' + (doc.pins[p.id] || '_(not stated)_')));
    lines.push('');
    SECTIONS.forEach(s => {
      lines.push('## ' + s.t, '', doc.secs[s.id] || '_(not written)_', '');
    });
    lines.push('## Red-team pass', '', '| Route | Caught by | What fires |', '| --- | --- | --- |');
    routes.forEach(r => {
      const c = doc.rt[r.id] || { layer: 0, how: '' };
      lines.push('| ' + r.t + ' | ' + LAYERS[c.layer] + ' | ' + (c.how || '') + ' |');
    });
    lines.push('');

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'verification-capstone.md';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  drawStats();
}
