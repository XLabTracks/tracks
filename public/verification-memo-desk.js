/* Memo desk — one drafting surface for every written output the track outline
   marks. Three mechanics, all honest: no model in the loop, no score.

   1. Pinned fields — audience, decision, falsifier — the genre's
      non-negotiables, structurally unskippable.
   2. The skim test — renders what a reader in a hurry actually sees: the
      first sentence of each paragraph plus the **bold** lines.
   3. Genre checks — transparent rule-based heuristics, each naming its rule.

   Drafts are per slot and live in this browser only.

   Trap: a slot whose brief is undrafted upstream must keep saying so. The
   stub is the deliverable for those rows — filling it in from here would
   turn "nobody has written this assignment" into "here is the assignment". */

(function () {
  var SLOTS = window.VERIFICATION_MEMOS;
  var MODULES = window.VERIFICATION_MEMO_MODULES || [];
  var STORE = 'xlab-verification-memo-desk.v1';
  var WPM = 220;

  var el = function (id) { return document.getElementById(id); };
  var F = {
    audience: el('fAudience'), decision: el('fDecision'), falsifier: el('fFalsifier'),
    title: el('fTitle'), body: el('fBody'),
  };
  if (!SLOTS || !F.body) return;

  var STATUS_WORD = { specified: 'brief drafted', named: 'named only', unspecified: 'not drafted' };
  var byId = {};
  SLOTS.forEach(function (s) { byId[s.id] = s; });
  var current = SLOTS[0];

  /* ---------- storage ---------- */

  function readAll() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function writeAll(all) {
    try { localStorage.setItem(STORE, JSON.stringify(all)); } catch (e) { /* quota / private mode */ }
  }
  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      var all = readAll();
      var d = {};
      Object.keys(F).forEach(function (k) { d[k] = F[k].value; });
      if (Object.keys(d).every(function (k) { return !d[k].trim(); })) delete all[current.id];
      else all[current.id] = d;
      writeAll(all);
      renderRail();
    }, 300);
  }
  function hasDraft(id) {
    var d = readAll()[id];
    return !!d && Object.keys(d).some(function (k) { return (d[k] || '').trim(); });
  }

  /* ---------- helpers ---------- */

  var words = function (s) { return (s.trim().match(/\S+/g) || []).length; };
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  var inline = function (s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); };
  var sentences = function (s) { return s.split(/(?<=[.!?])\s+/).filter(function (x) { return x.trim(); }); };
  function splitFirst(p) {
    var m = p.match(/^[\s\S]*?[.!?](?=\s|$)/);
    return m ? [m[0], p.slice(m[0].length)] : [p, ''];
  }

  /* ---------- slot rail ---------- */

  function renderRail() {
    var host = el('slotList');
    var groups = [0, 1, 2, 3, 4].map(function (mod) {
      var rows = SLOTS.filter(function (s) { return s.module === mod; });
      if (!rows.length) return '';
      return (
        '<div class="slot-group" style="--mod:var(--mod-' + mod + ')">' +
        '<p>M' + mod + ' · ' + esc(MODULES[mod] || '') + '</p><ul>' +
        rows.map(function (s) {
          return '<li><button type="button" class="slot-btn" data-id="' + s.id + '" aria-current="' +
            (s.id === current.id) + '">' +
            '<span class="t">' + esc(s.unit) + ' — ' + esc(s.title) + (s.optional ? ' (optional)' : '') + '</span>' +
            '<span class="m"><span class="status ' + s.status + '">' + STATUS_WORD[s.status] + '</span>' +
            (hasDraft(s.id) ? '<span class="drafted">· drafted</span>' : '') + '</span></button></li>';
        }).join('') +
        '</ul></div>'
      );
    }).join('');
    host.innerHTML = groups;
  }

  el('slotList').addEventListener('click', function (e) {
    var b = e.target.closest('.slot-btn');
    if (b) select(b.dataset.id);
  });

  /* ---------- the brief ---------- */

  function renderBrief(s) {
    el('slotTitle').textContent = s.unit + ' — ' + s.title;
    el('slotMeta').innerHTML =
      '<span>M' + s.module + ' · ' + esc(MODULES[s.module] || '') + '</span>' +
      '<span class="status ' + s.status + '">' + STATUS_WORD[s.status] + '</span>' +
      (s.peerReviewed ? '<span>peer reviewed</span>' : '') +
      (s.optional ? '<span>optional</span>' : '');

    var host = el('slotBrief');
    var out = '';
    if (s.brief) {
      out +=
        '<div class="brief"><p class="bk">The outline’s brief</p><p>' + esc(s.brief) + '</p><dl>' +
        (s.audience ? '<div><dt>Reader</dt><dd>' + esc(s.audience) + '</dd></div>' : '') +
        (s.words ? '<div><dt>Budget</dt><dd>about ' + s.words + ' words</dd></div>' : '') +
        '</dl></div>';
    }
    if (s.gap) {
      out +=
        '<div class="stub"><b>Not drafted upstream.</b> ' + esc(s.gap) +
        ' Nothing here fills it in — that is a content decision for whoever owns the module. ' +
        'Draft into it if you like; the brief will replace this note when it lands.</div>';
    }
    host.innerHTML = out;

    var card = el('criteriaCard');
    if (s.criteria && s.criteria.length) {
      el('criteriaList').innerHTML = s.criteria.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
      card.hidden = false;
    } else {
      card.hidden = true;
    }
  }

  function select(id) {
    if (!byId[id]) return;
    current = byId[id];
    var d = readAll()[id] || {};
    Object.keys(F).forEach(function (k) { F[k].value = d[k] || ''; });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    renderBrief(current);
    renderRail();
    budget();
    lint();
    if (!el('paneSkim').hidden) skim();
  }

  /* ---------- genre checks ---------- */

  var HEDGES = ['maybe', 'perhaps', 'possibly', 'might be', 'could potentially',
    'somewhat', 'arguably', 'it seems', 'we believe', 'sort of'];

  function lint() {
    var body = F.body.value;
    var n = words(body);
    var out = [];
    var row = function (sev, html) { out.push({ sev: sev, html: html }); };

    row(F.audience.value.trim() ? 'ok' : 'bad', F.audience.value.trim()
      ? 'Reader named.'
      : '<b>No reader.</b> A memo addressed to nobody is the genre’s standard failure.');
    row(F.decision.value.trim() ? 'ok' : 'bad', F.decision.value.trim()
      ? 'Decision named.'
      : '<b>No decision.</b> What should the reader do differently after reading?');
    row(F.falsifier.value.trim() ? 'ok' : 'warn', F.falsifier.value.trim()
      ? 'Falsifier stated — analytical, not persuasive.'
      : '<b>No falsifier.</b> State what would change your mind; it is the track’s signature move.');

    if (n === 0) { render(out); return; }

    var tail = body.slice(Math.floor(body.length * 0.6));
    var hasRec = /(recommend|should|must|propose|urge)/i.test(tail);
    row(hasRec ? 'ok' : 'warn', hasRec
      ? 'A recommendation lives in the final third.'
      : '<b>No recommendation in the final third</b> (looked for recommend / should / must / propose / urge).');

    var hedges = HEDGES.filter(function (h) { return body.toLowerCase().indexOf(h) > -1; });
    row(hedges.length === 0 ? 'ok' : 'warn', hedges.length === 0
      ? 'No hedge words.'
      : '<b>Hedging:</b> ' + hedges.map(esc).join(', ') + ' — qualify with conditions, not mush.');

    var longs = sentences(body).filter(function (s) { return words(s) > 35; }).length;
    row(longs === 0 ? 'ok' : 'warn', longs === 0
      ? 'No sentence runs past 35 words.'
      : '<b>' + longs + ' sentence' + (longs > 1 ? 's' : '') + ' over 35 words.</b> Readers skim; long sentences sink.');

    var bigParas = body.split(/\n\s*\n/).filter(function (p) { return words(p) > 120; }).length;
    row(bigParas === 0 ? 'ok' : 'warn', bigParas === 0
      ? 'Paragraphs stay under 120 words.'
      : '<b>' + bigParas + ' paragraph' + (bigParas > 1 ? 's' : '') + ' over 120 words.</b> One point per paragraph, point first.');

    row(/\d/.test(body) ? 'ok' : 'warn', /\d/.test(body)
      ? 'Carries numbers.'
      : '<b>No numbers anywhere.</b> A mechanism claim usually quantifies something.');

    var passive = (body.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/g) || []).length;
    var per100 = n ? (passive / n) * 100 : 0;
    row(per100 <= 2 ? 'ok' : 'warn', per100 <= 2
      ? 'Active voice (rough check).'
      : '<b>Passive-ish constructions: ' + passive + '</b> (rough “to-be + -ed” count). Who is doing what?');

    render(out);

    function render(rows) {
      el('lint').innerHTML = rows.map(function (r) {
        return '<div class="lint-row ' + r.sev + '"><span class="d"></span><span>' + r.html + '</span></div>';
      }).join('');
    }
  }

  /* ---------- the skim test ---------- */

  function skim() {
    var body = F.body.value.trim();
    var out = el('skimOut');
    if (!body && !F.title.value.trim()) {
      out.innerHTML = '<p class="empty">Nothing to skim yet — write, then test what survives.</p>';
      el('skimStats').textContent = '';
      return;
    }
    var paras = body.split(/\n\s*\n/).filter(function (p) { return p.trim(); });
    var kept = 0;
    var html = paras.map(function (p) {
      var parts = splitFirst(p.trim());
      kept += words(parts[0]) + (parts[1].match(/\*\*([^*]+)\*\*/g) || []).reduce(function (a, m) {
        return a + words(m);
      }, 0);
      return '<p>' + inline(parts[0]) + (parts[1] ? '<span class="ghost">' + inline(parts[1]) + '</span>' : '') + '</p>';
    }).join('');
    var secs = Math.round((kept / WPM) * 60);
    el('skimStats').textContent =
      'the skim keeps ' + kept + ' of ' + words(body) + ' words · about ' + secs + 's of reading';
    out.innerHTML =
      (F.title.value.trim() ? '<div class="s-title">' + esc(F.title.value) + '</div>' : '') +
      (F.decision.value.trim() ? '<div class="s-meta">decision: ' + esc(F.decision.value) + '</div>' : '') +
      html;
  }

  /* ---------- steelman deck ---------- */

  var DECK = [
    'Who loses if your recommendation is adopted — and have you named them?',
    'What would the strongest opponent of this memo say in one sentence?',
    'Which timeline does this recommendation quietly bet on?',
    'If the number you cite is wrong by 2×, does the recommendation survive?',
    'Does the reader you named actually hold the lever you are pulling?',
    'What does this cost, and who pays it?',
    'Is anything here “required” that is actually voluntary? Fence them apart.',
    'Would this survive implementation — who must act, in what order?',
    'Strip every adjective from the key paragraph. Does the argument still stand?',
    'What happens if nobody acts on this? If “nothing bad”, why write it?',
    'Could a reader mistake your evidence for your conclusion? Separate them.',
    'Name the assumption you would defend least confidently in a hearing.',
    'Which sibling mechanism covers the blind spot you just admitted to?',
    'Write the sentence Beijing would object to. Then decide whether to keep it.',
  ];
  var lastCard = -1;
  function drawCard() {
    var i;
    do { i = Math.floor(Math.random() * DECK.length); } while (i === lastCard && DECK.length > 1);
    lastCard = i;
    el('deckCard').textContent = DECK[i];
  }

  /* ---------- budget ---------- */

  function budget() {
    var n = words(F.body.value);
    var target = current.words || 800;
    el('wordCount').textContent = n + ' / ' + target + ' words';
    el('budgetBar').style.width = Math.min(100, (n / target) * 100) + '%';
    el('wordCount').closest('.budget').classList.toggle('over', n > target);
  }

  /* ---------- export ---------- */

  function exportMd() {
    var md = [
      '# ' + (F.title.value.trim() || current.title),
      '',
      '_' + current.unit + ' — ' + current.title + ' · module ' + current.module + '_',
      '',
      '**To:** ' + (F.audience.value.trim() || '—'),
      '**Decision this informs:** ' + (F.decision.value.trim() || '—'),
      '**What would change my mind:** ' + (F.falsifier.value.trim() || '—'),
      '',
      F.body.value.trim(),
      '',
    ].join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
    a.download = current.id + '.md';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 0);
  }

  /* ---------- wiring ---------- */

  function setMode(skimMode) {
    el('paneWrite').hidden = skimMode;
    el('paneSkim').hidden = !skimMode;
    el('modeWrite').setAttribute('aria-selected', String(!skimMode));
    el('modeSkim').setAttribute('aria-selected', String(skimMode));
    if (skimMode) skim();
  }

  Object.keys(F).forEach(function (k) {
    F[k].addEventListener('input', function () {
      save(); budget(); lint();
      if (!el('paneSkim').hidden) skim();
    });
  });
  el('modeWrite').addEventListener('click', function () { setMode(false); });
  el('modeSkim').addEventListener('click', function () { setMode(true); });
  el('deckBtn').addEventListener('click', drawCard);
  el('exportBtn').addEventListener('click', exportMd);

  // Two-tap clear: a one-tap wipe of a draft nobody backed up is a trap.
  var clearBtn = el('clearBtn');
  var clearTimer = null;
  clearBtn.addEventListener('click', function () {
    if (!clearBtn.classList.contains('armed')) {
      clearBtn.classList.add('armed');
      clearBtn.textContent = 'Sure? tap again';
      clearTimeout(clearTimer);
      clearTimer = setTimeout(function () {
        clearBtn.classList.remove('armed');
        clearBtn.textContent = 'Clear this draft';
      }, 2500);
      return;
    }
    clearTimeout(clearTimer);
    clearBtn.classList.remove('armed');
    clearBtn.textContent = 'Clear this draft';
    Object.keys(F).forEach(function (k) { F[k].value = ''; });
    var all = readAll();
    delete all[current.id];
    writeAll(all);
    renderRail(); budget(); lint(); skim();
  });

  window.addEventListener('hashchange', function () {
    select(location.hash.slice(1));
  });

  select(byId[location.hash.slice(1)] ? location.hash.slice(1) : SLOTS[0].id);
})();
