/* Memo desk — one drafting surface for every written output the track outline
   marks. Three mechanics, all honest: no model in the loop, no score.

   1. Pinned fields — audience, decision, falsifier — the genre's
      non-negotiables, structurally unskippable.
   2. The skim test — renders what a reader in a hurry actually sees: the
      first sentence of each paragraph plus the **bold** lines.
   3. Genre checks — transparent rule-based heuristics, each naming its rule.

   Drafts are per slot and belong to memo-store.js, so the notebook shows the
   same document and the account keeps it. Mount with VTMemoDesk.mount(host,
   {slots, hash}) — the standalone page mounts every slot, a unit page mounts
   only the ones its own unit asks for.

   Trap: a slot whose brief is undrafted upstream must keep saying so. The
   stub is the deliverable for those rows — filling it in from here would
   turn "nobody has written this assignment" into "here is the assignment". */

window.VTMemoDesk = (function () {
  var ALL = window.VERIFICATION_MEMOS;
  var MODULES = window.VERIFICATION_MEMO_MODULES || [];
  var WPM = 220;

  /* What each genre's desk is. Absent (or unknown) is a memo — the full
     instrument: the audience/decision/falsifier pins, the "recommendation"
     title, the memo checks, the steelman deck. A map, an essay or a red-line is
     not a memo and must not be dressed as one, so those pins and checks go off
     and a one-line note says so, so their absence reads as intent rather than a
     missing feature. Which slot is which is data (memos.ts → data/memos.js);
     this is only how the desk renders each. */
  var GENRE = {
    memo: {
      pins: true,
      title: 'Title — the recommendation, not the topic',
      checks: 'memo',
      steelman: true,
      skimDecision: true,
      hint: '',
    },
    map: {
      pins: false,
      title: 'Title — what this map is of',
      checks: 'none',
      steelman: false,
      skimDecision: false,
      hint: 'This output is a map, not a memo — build it as annotated rows, not paragraphs, carrying what the brief above asks each row to hold. The memo’s audience, decision and falsifier pins and its prose checks are off here.',
    },
    essay: {
      pins: false,
      title: 'Title — your thesis, not the topic',
      checks: 'prose',
      steelman: false,
      skimDecision: false,
      hint: 'This output is an essay, not a memo — argue a thesis rather than issue a recommendation. The audience, decision and falsifier pins are off; the general legibility checks stay.',
    },
    redline: {
      pins: false,
      title: 'Title — the provision you are redrafting',
      checks: 'none',
      steelman: false,
      skimDecision: false,
      hint: 'This output is a red-line, not a memo: mark the article’s gaps and redraft the provision, following the brief above. The memo’s audience, decision and falsifier pins are off; peer review runs on the criteria in the check rail.',
    },
  };
  function genreOf(s) { return (s && GENRE[s.genre]) || GENRE.memo; }

  /* The desk's own markup. It used to live in memo-desk.html, which meant the
     desk could only ever exist on that page; it is here so a unit page can
     mount the same surface beside the prompt that asks for the memo.

     Ids are kept as they were, and every lookup is scoped to the host, so one
     desk per page is the supported case — which is all any page needs. */
  var TEMPLATE = [
    '<aside class="slot-rail" data-rail>',
      '<h2>Written outputs</h2>',
      '<div id="slotList"></div>',
    '</aside>',
    '<section class="paper">',
      '<h2 class="slot-title" id="slotTitle">&mdash;</h2>',
      '<p class="slot-meta" id="slotMeta"></p>',
      '<div id="slotBrief"></div>',
      '<div class="genre-hint" id="genreHint" hidden></div>',
      '<div class="pins" id="pins">',
        '<label class="pin"><span class="pk">To &mdash; a specific audience</span>',
          '<input id="fAudience" class="pin-in" type="text" autocomplete="off"',
          ' placeholder="e.g. the US delegation\'s technical adviser; the lab\'s policy lead…"></label>',
        '<label class="pin"><span class="pk">Decision this informs</span>',
          '<input id="fDecision" class="pin-in" type="text" autocomplete="off"',
          ' placeholder="what the reader should do differently after reading"></label>',
        '<label class="pin"><span class="pk">What would change my mind</span>',
          '<input id="fFalsifier" class="pin-in" type="text" autocomplete="off"',
          ' placeholder="the evidence that would flip your recommendation"></label>',
      '</div>',
      '<input id="fTitle" class="title-in" type="text" autocomplete="off"',
      ' placeholder="Title — the recommendation, not the topic">',
      '<textarea id="fBody" class="body-in" placeholder="Write it. Markdown **bold** survives the skim — use it on the lines that must.&#10;&#10;Paragraph rule of thumb: the first sentence carries the point; a skimming reader gets nothing else."></textarea>',
      '<div class="desk-tools">',
        '<div class="budget"><span class="mono" id="wordCount">0 words</span>',
          '<div class="bbar"><i id="budgetBar" style="width:0%"></i></div></div>',
        '<button type="button" class="tool" id="exportBtn">Export .md</button>',
        '<button type="button" class="tool" id="clearBtn">Clear this draft</button>',
      '</div>',
      /* Where somebody is about to type an opinion, say where it goes. The
         drafts sit in this browser under memo-store.js's key AND ride to the
         account of a signed-in learner on sync.js, with the notebook and the
         progress — an earlier edition of this line promised nothing left the
         browser, which the sync had already stopped honouring. */
      '<p class="desk-note">Drafts autosave in this browser. Signed in, they travel with your account, like your notebook; signed out, they stay here and nowhere else.</p>',
    '</section>',
    '<aside class="check-rail">',
      '<div class="modes" role="tablist" aria-label="Rail mode">',
        '<button type="button" class="mode" id="modeWrite" role="tab" aria-selected="true" aria-controls="paneWrite">Desk checks</button>',
        '<button type="button" class="mode" id="modeSkim" role="tab" aria-selected="false" aria-controls="paneSkim">Skim test</button>',
      '</div>',
      '<div id="paneWrite" role="tabpanel" aria-labelledby="modeWrite">',
        '<div class="rail-card"><p class="rk">Genre checks',
          '<span class="rk-note">rule-based heuristics, every rule named — the rubric is the judge, not this rail</span></p>',
          '<div id="lint"></div></div>',
        '<div class="rail-card" id="criteriaCard" hidden>',
          '<p class="rk">Peer review runs on <span class="rk-note">the outline\'s criteria for this slot</span></p>',
          '<ul id="criteriaList" style="margin-left:18px;font-size:13px;line-height:1.6"></ul></div>',
        '<div class="rail-card" id="steelmanCard"><p class="rk">Steelman deck <span class="rk-note">contested claims get challenged, not narrated</span></p>',
          '<p class="deck-card" id="deckCard">Draw a challenge and answer it inside the memo — or in the falsifier field.</p>',
          '<button type="button" class="tool" id="deckBtn">Draw a challenge</button></div>',
      '</div>',
      '<div id="paneSkim" role="tabpanel" aria-labelledby="modeSkim" hidden>',
        '<div class="rail-card"><p class="rk">What a reader in a hurry sees',
          '<span class="rk-note">first sentences plus your <b>bold</b> lines; the rest is what a skim discards</span></p>',
          '<p class="skim-stats mono" id="skimStats"></p>',
          '<div class="skim" id="skimOut"></div></div>',
      '</div>',
    '</aside>'
  ].join('');

  /* opts.slots  — ids to offer, defaulting to every slot the outline marks.
     opts.hash   — own the location hash (the standalone page does; an inline
                   desk must not, or two of them fight over the URL). */
  function mount(host, opts) {
    opts = opts || {};
    /* Read the store at mount time, not at load time. Capturing it in module
       scope made the desk depend on memo-store.js having been evaluated first
       — true for an ordered <script> list, not for the header's tags — and the
       failure was silent: no store, no desk, no message. */
    var STORE = window.VTMemoStore;
    if (!host || !ALL || !STORE) return null;

    var SLOTS = opts.slots
      ? ALL.filter(function (s) { return opts.slots.indexOf(s.id) !== -1; })
      : ALL;
    if (!SLOTS.length) return null;

    var ownsHash = opts.hash !== false;

    host.classList.add('desk');
    host.innerHTML = TEMPLATE;

    var el = function (id) { return host.querySelector('#' + id); };
    var F = {
      audience: el('fAudience'), decision: el('fDecision'), falsifier: el('fFalsifier'),
      title: el('fTitle'), body: el('fBody'),
    };
    if (!F.body) return null;

    /* One slot needs no index of itself. */
    if (SLOTS.length < 2) host.querySelector('[data-rail]').hidden = true;

  /* The notebook edits the same body through its memo block. Repaint when the
     change came from there, never when it came from this desk's own field —
     rewriting the textarea under the caret would eat the keystroke. */
  STORE.onChange(function (slotId) {
    if (slotId !== current.id || document.activeElement === F.body) return;
    var d = STORE.read(current.id) || {};
    Object.keys(F).forEach(function (k) { F[k].value = d[k] || ''; });
    budget(); lint();
    if (!el('paneSkim').hidden) skim();
  });

  var STATUS_WORD = { specified: 'brief', named: 'named only', unspecified: 'no brief yet' };
  var byId = {};
  SLOTS.forEach(function (s) { byId[s.id] = s; });
  var current = SLOTS[0];
  var CHECKS = 'memo';
  var SKIM_DECISION = true;

  /* ---------- storage ---------- */

  /* The draft itself belongs to VTMemoStore, because the notebook shows the
     same text through a memo block and neither surface may hold a copy. */
  function save() {
    var d = {};
    Object.keys(F).forEach(function (k) { d[k] = F[k].value; });
    STORE.write(current.id, d);
    renderRail();
    /* Once there is something to keep, the memo gets its page in the book —
       created on the first real keystroke, never on merely opening a slot, so
       browsing the desk does not fill the notebook with empty pages. */
    if (window.VTNotebook && STORE.has(current.id)) {
      window.VTNotebook.bindMemo(current.id);
    }
  }
  function hasDraft(id) { return STORE.has(id); }

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
        '<p><b>M' + mod + '</b> ' + esc(MODULES[mod] || '') + '</p><ul>' +
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

  /* A brief is the outline's own words, and some of them are a list of claims
     to work through rather than a sentence. Blank-line-separated blocks become
     paragraphs and "- " lines become a list, so a seven-part task reads as one
     instead of as a wall. Everything is escaped: the brief is content, not
     markup. */
  function briefHtml(text) {
    return String(text).split(/\n\s*\n/).map(function (blockText) {
      var lines = blockText.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      var bullets = lines.filter(function (l) { return l.indexOf('- ') === 0; });
      if (bullets.length === lines.length && lines.length) {
        return '<ul>' + lines.map(function (l) {
          return '<li>' + inline(l.slice(2)) + '</li>';
        }).join('') + '</ul>';
      }
      return '<p>' + inline(lines.join(' ')) + '</p>';
    }).join('');
  }

  function renderBrief(s) {
    el('slotTitle').textContent = s.unit + ' — ' + s.title;
    el('slotMeta').innerHTML =
      '<span><b>M' + s.module + '</b> ' + esc(MODULES[s.module] || '') + '</span>' +
      '<span class="status ' + s.status + '">' + STATUS_WORD[s.status] + '</span>' +
      (s.peerReviewed ? '<span>peer reviewed</span>' : '') +
      (s.optional ? '<span>optional</span>' : '');

    var host = el('slotBrief');
    var out = '';
    if (s.brief) {
      out +=
        '<div class="brief"><p class="bk">The outline’s brief</p>' + briefHtml(s.brief) + '<dl>' +
        (s.audience ? '<div><dt>Reader</dt><dd>' + esc(s.audience) + '</dd></div>' : '') +
        (s.words ? '<div><dt>Budget</dt><dd>about ' + s.words + ' words</dd></div>' : '') +
        '</dl></div>';
    }
    if (s.gap) {
      out +=
        '<div class="stub"><b>No brief for this one yet.</b> ' + esc(s.gap) +
        ' Write into it anyway if you like — the brief will appear here once it exists.</div>';
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

  /* Re-dress the desk for the current slot's genre: a non-memo hides the pins
     and the steelman deck, swaps the title's coaching line, and switches which
     checks the rail runs. Runs on every select, so navigating re-dresses. */
  function applyGenre() {
    var g = genreOf(current);
    el('pins').hidden = !g.pins;
    el('steelmanCard').hidden = !g.steelman;
    F.title.placeholder = g.title;
    CHECKS = g.checks;
    SKIM_DECISION = g.skimDecision;
    var hint = el('genreHint');
    hint.innerHTML = g.hint || '';
    hint.hidden = !g.hint;
  }

  function select(id) {
    if (!byId[id]) return;
    current = byId[id];
    applyGenre();
    var d = STORE.read(id) || {};
    Object.keys(F).forEach(function (k) { F[k].value = d[k] || ''; });
    if (ownsHash && history.replaceState) history.replaceState(null, '', '#' + id);
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

    /* A map — or any genre the desk has no automated read on — is judged by
       its brief and the peer-review criteria, not by prose heuristics. */
    if (CHECKS === 'none') {
      el('lint').innerHTML =
        '<p class="rk-note">No automated checks for this genre — the brief and the peer-review criteria are the judge.</p>';
      return;
    }

    /* The reader / decision / falsifier trio is the memo's contract; the prose
       genres argue a thesis and have no recommendation to pin. */
    if (CHECKS === 'memo') {
    row(F.audience.value.trim() ? 'ok' : 'bad', F.audience.value.trim()
      ? 'Reader named.'
      : '<b>No reader.</b> A memo addressed to nobody is the genre’s standard failure.');
    row(F.decision.value.trim() ? 'ok' : 'bad', F.decision.value.trim()
      ? 'Decision named.'
      : '<b>No decision.</b> What should the reader do differently after reading?');
    row(F.falsifier.value.trim() ? 'ok' : 'warn', F.falsifier.value.trim()
      ? 'Falsifier stated — analytical, not persuasive.'
      : '<b>No falsifier.</b> State what would change your mind; it is the track’s signature move.');

    }

    if (n === 0) { render(out); return; }

    if (CHECKS === 'memo') {
      var tail = body.slice(Math.floor(body.length * 0.6));
      var hasRec = /(recommend|should|must|propose|urge)/i.test(tail);
      row(hasRec ? 'ok' : 'warn', hasRec
        ? 'A recommendation lives in the final third.'
        : '<b>No recommendation in the final third</b> (looked for recommend / should / must / propose / urge).');
    }

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
      el('lint').innerHTML = rows.length
        ? rows.map(function (r) {
            return '<div class="lint-row ' + r.sev + '"><span class="d"></span><span>' + r.html + '</span></div>';
          }).join('')
        : '<p class="rk-note">The checks appear as you write.</p>';
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
      (SKIM_DECISION && F.decision.value.trim() ? '<div class="s-meta">decision: ' + esc(F.decision.value) + '</div>' : '') +
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
    var lines = [
      '# ' + (F.title.value.trim() || current.title),
      '',
      '_' + current.unit + ' — ' + current.title + ' · module ' + current.module + '_',
      '',
    ];
    /* The pinned fields are part of a memo's document; a map or an essay never
       filled them, so they do not belong in that export. */
    if (genreOf(current).pins) {
      lines.push(
        '**To:** ' + (F.audience.value.trim() || '—'),
        '**Decision this informs:** ' + (F.decision.value.trim() || '—'),
        '**What would change my mind:** ' + (F.falsifier.value.trim() || '—'),
        '');
    }
    lines.push(F.body.value.trim(), '');
    var md = lines.join('\n');
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
    STORE.clear(current.id);
    renderRail(); budget(); lint(); skim();
  });

    if (ownsHash) {
      window.addEventListener('hashchange', function () {
        select(location.hash.slice(1));
      });
    }

    var from = ownsHash ? location.hash.slice(1) : '';
    select(byId[from] ? from : SLOTS[0].id);
    return { select: select, host: host };
  }

  return { mount: mount };
})();
