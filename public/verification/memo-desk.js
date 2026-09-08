/* Memo desk — one drafting surface for every written output the track outline
   marks. Three mechanics, all honest: no model in the loop, no score.

   1. Two blocks that are not the same kind of thing, and are built to look it.
      The letterhead — To, From, Date, Subject — is the document, and prints.
      The two desk questions — what decision does this inform, what would
      change my mind — are the writer's own, appear in no memo ever sent, and
      are still unskippable: the checks fail without them.
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
     instrument: the letterhead, the two desk questions, the "recommendation"
     subject line, the memo checks, the steelman deck. A map, an essay or a
     red-line is not a memo and must not be dressed as one, so those go off
     and a one-line note says so, so their absence reads as intent rather than a
     missing feature. Which slot is which is data (memos.ts → data/memos.js);
     this is only how the desk renders each.

     `letterhead` and `questions` move together on every genre we have, and are
     still two flags rather than one: they gate two different things. The
     letterhead is the document's own head, printed and read; the questions are
     the writer's, and no genre that drops the memo's form necessarily drops
     the obligation to know what decision it informs. Splitting them is what
     lets that be decided per genre later, in the data, rather than by
     untangling this. */
  var GENRE = {
    memo: {
      letterhead: true,
      questions: true,
      title: 'Subject — the recommendation, not the topic',
      checks: 'memo',
      steelman: true,
      hint: '',
    },
    map: {
      letterhead: false,
      questions: false,
      title: 'Title — what this map is of',
      checks: 'none',
      steelman: false,
      hint: 'This output is a map, not a memo — build it as annotated rows, not paragraphs, carrying what the brief above asks each row to hold. The memo’s letterhead, its two desk questions and its prose checks are off here.',
    },
    essay: {
      letterhead: false,
      questions: false,
      title: 'Title — your thesis, not the topic',
      checks: 'prose',
      steelman: false,
      hint: 'This output is an essay, not a memo — argue a thesis rather than issue a recommendation. The letterhead and the two desk questions are off; the general legibility checks stay.',
    },
    redline: {
      letterhead: false,
      questions: false,
      title: 'Title — the provision you are redrafting',
      checks: 'none',
      steelman: false,
      hint: 'This output is a red-line, not a memo: mark the article’s gaps and redraft the provision, following the brief above. The memo’s letterhead and its two desk questions are off; judge the draft on the criteria in the check rail.',
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

      /* Two questions the memo has to survive, asked before it is written and
         printed in no memo anywhere. They used to sit in the same block as the
         reader — three fields with matching labels, which taught that a memo
         has a "Decision this informs" line. It does not. So they are asked in
         the second person, with their own note saying where they do and do not
         go, and the document below starts at the letterhead. */
      '<div class="deskq" id="deskQuestions">',
        '<p class="dqk">Before you write',
          '<span class="dqk-note">Answer both. Neither appears in the memo — they are what it has to survive.</span></p>',
        '<label class="dq"><span class="dqq">What decision does this inform?</span>',
          '<span class="dqh">The reader\'s next move — what they do differently once they have read it.</span>',
          '<input id="fDecision" class="dq-in" type="text" autocomplete="off"',
          ' placeholder="e.g. whether to co-sponsor the reporting amendment this session"></label>',
        '<label class="dq"><span class="dqq">What would change my mind?</span>',
          '<span class="dqh">The evidence that would flip your recommendation. Name it before you argue, not after.</span>',
          '<input id="fFalsifier" class="dq-in" type="text" autocomplete="off"',
          ' placeholder="e.g. an independent replication showing the gap closes without the mandate"></label>',
      '</div>',

      /* The document's own head. On a memo it is stationery — To, From, Date,
         Subject, in that order, because that is the order every reader of one
         has already learned. On the other genres the whole block collapses to
         its last row and the title stands alone (class `plain`), so there is
         one title field on every genre and no second copy to keep in step. */
      '<div class="letterhead" id="letterhead">',
        '<p class="lh-caption">Memorandum</p>',
        '<div class="lh-rows" id="lhRows">',
          '<label class="lh-row"><span class="lhk">To</span>',
            '<input id="fAudience" class="lh-in" type="text" autocomplete="off"',
            ' placeholder="a named reader — the US delegation\'s technical adviser; the lab\'s policy lead"></label>',
          '<label class="lh-row"><span class="lhk">From</span>',
            '<input id="fFrom" class="lh-in" type="text" autocomplete="off"',
            ' placeholder="you, and the desk you write from"></label>',
          '<label class="lh-row"><span class="lhk">Date</span>',
            '<span class="lh-date"><input id="fDate" class="lh-in" type="text" autocomplete="off"',
            ' placeholder="the day it lands on the desk">',
            '<button type="button" class="lh-today" id="dateToday">today</button></span></label>',
        '</div>',
        '<label class="lh-row lh-subject"><span class="lhk" id="lhSubjectKey">Subject</span>',
          '<input id="fTitle" class="lh-in title-in" type="text" autocomplete="off"',
          ' placeholder="Subject — the recommendation, not the topic"></label>',
      '</div>',
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
        '<button type="button" class="mode" id="modeSkim" role="tab" aria-selected="false" aria-controls="paneSkim">Skim test &mdash; 90 seconds</button>',
      '</div>',
      '<div id="paneWrite" role="tabpanel" aria-labelledby="modeWrite">',
        '<div class="rail-card"><p class="rk">Genre checks',
          '<span class="rk-note">rule-based heuristics, every rule named — the rubric is the judge, not this rail</span></p>',
          '<div id="lint"></div></div>',
        '<div class="rail-card" id="criteriaCard" hidden>',
          '<p class="rk">Judge the draft on <span class="rk-note">the outline\'s criteria for this slot</span></p>',
          '<ul id="criteriaList" style="margin-left:18px;font-size:13px;line-height:1.6"></ul></div>',
        '<div class="rail-card" id="steelmanCard"><p class="rk">Steelman deck <span class="rk-note">contested claims get challenged, not narrated</span></p>',
          '<p class="deck-card" id="deckCard">Draw a challenge and answer it inside the memo — or in what would change your mind.</p>',
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
    /* Keys are the store's field names, so save() and every load can walk this
       object rather than list the fields a third time. */
    var F = {
      audience: el('fAudience'), from: el('fFrom'), date: el('fDate'),
      decision: el('fDecision'), falsifier: el('fFalsifier'),
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
  var HAS_LETTERHEAD = true;

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
        '<div class="slot-group" style="--mod:var(--mod-' + mod +
        ');--mod-type:var(--mod-' + mod + '-text)">' +
        '<p><b>M' + mod + '</b> ' + esc(MODULES[mod] || '') + '</p><ul>' +
        rows.map(function (s) {
          return '<li><button type="button" class="slot-btn" data-id="' + s.id + '" aria-current="' +
            (s.id === current.id) + '">' +
            '<span class="t">' + esc(s.unit) + ' — ' +
            (s.optional ? '<span class="optional-prefix">Optional:</span> ' : '') + esc(s.title) + '</span>' +
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
    el('slotTitle').textContent =
      s.unit + ' — ' + (s.optional ? 'Optional: ' : '') + s.title;
    el('slotMeta').innerHTML =
      '<span><b>M' + s.module + '</b> ' + esc(MODULES[s.module] || '') + '</span>' +
      '<span class="status ' + s.status + '">' + STATUS_WORD[s.status] + '</span>';

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

  /* Re-dress the desk for the current slot's genre: a non-memo collapses the
     letterhead, hides the desk questions and the steelman deck, swaps the
     title's coaching line, and switches which checks the rail runs. Runs on
     every select, so navigating re-dresses. */
  function applyGenre() {
    var g = genreOf(current);
    /* `plain` collapses the stationery to its last row rather than hiding the
       block: the subject field IS the title field, so there is one of them on
       every genre and nothing to keep in step. */
    el('letterhead').classList.toggle('plain', !g.letterhead);
    el('deskQuestions').hidden = !g.questions;
    el('steelmanCard').hidden = !g.steelman;
    F.title.placeholder = g.title;
    CHECKS = g.checks;
    HAS_LETTERHEAD = g.letterhead;
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
       its brief and the slot's criteria, not by prose heuristics. */
    if (CHECKS === 'none') {
      el('lint').innerHTML =
        '<p class="rk-note">No automated checks for this genre — the brief and the slot\'s criteria are the judge.</p>';
      return;
    }

    /* The letterhead is the document's contract and the two questions are the
       writer's, so they are checked as what they are: one row for the head,
       naming whichever lines are still blank, and one row each for the
       questions — which are the pedagogy, and never collapse into a list. The
       prose genres have no letterhead and no recommendation to pin. */
    if (CHECKS === 'memo') {
      var head = [
        { k: 'audience', word: 'To' }, { k: 'from', word: 'From' },
        { k: 'date', word: 'Date' }, { k: 'title', word: 'Subject' },
      ];
      var blank = head.filter(function (h) { return !F[h.k].value.trim(); });
      var noReader = !F.audience.value.trim();
      row(blank.length === 0 ? 'ok' : (noReader ? 'bad' : 'warn'),
        blank.length === 0
          ? 'Letterhead complete — To, From, Date, Subject.'
          : (noReader
            ? '<b>No reader.</b> A memo addressed to nobody is the genre’s standard failure. Still blank: ' +
              blank.map(function (h) { return h.word; }).join(', ') + '.'
            : '<b>Letterhead incomplete:</b> ' +
              blank.map(function (h) { return h.word; }).join(', ') +
              '. A memo that reaches a desk carries all four.'));

      row(F.decision.value.trim() ? 'ok' : 'bad', F.decision.value.trim()
        ? 'You have named the decision this informs.'
        : '<b>You have not said what decision this informs.</b> What does the reader do differently after reading?');
      row(F.falsifier.value.trim() ? 'ok' : 'warn', F.falsifier.value.trim()
        ? 'You have named what would change your mind — analytical, not persuasive.'
        : '<b>You have not said what would change your mind.</b> It is the track’s signature move.');
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
    /* Against a budget, not as a bare reading time. Ninety seconds is the
       prototype's figure and is what makes this a test rather than a readout:
       a number with nothing to exceed passes silently at any length. */
    el('skimStats').textContent =
      'the skim keeps ' + kept + ' of ' + words(body) + ' words · about ' + secs +
      's of a 90s budget' + (secs > 90 ? ' — over' : '');
    /* What the reader sees is the letterhead and the prose. It used to print
       "decision: …" here, which is the writer's own note and reaches no reader
       alive — the one panel on the desk that simulates being read was showing
       something unreadable. The head is built from whatever is filled, so a
       half-written letterhead skims as the half a reader would get. */
    var head = '';
    if (HAS_LETTERHEAD) {
      var bits = [];
      if (F.audience.value.trim()) bits.push('To ' + esc(F.audience.value));
      if (F.from.value.trim()) bits.push('From ' + esc(F.from.value));
      if (F.date.value.trim()) bits.push(esc(F.date.value));
      if (bits.length) head = '<div class="s-meta">' + bits.join(' · ') + '</div>';
    }
    out.innerHTML =
      (F.title.value.trim() ? '<div class="s-title">' + esc(F.title.value) + '</div>' : '') +
      head + html;
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
    /* The letterhead is the document and prints as one; a map or an essay
       never filled it, so it does not belong in that export. */
    var g = genreOf(current);
    if (g.letterhead) {
      lines.push(
        '**To:** ' + (F.audience.value.trim() || '—'),
        '**From:** ' + (F.from.value.trim() || '—'),
        '**Date:** ' + (F.date.value.trim() || '—'),
        '**Subject:** ' + (F.title.value.trim() || '—'),
        '',
        '---',
        '');
    }
    lines.push(F.body.value.trim(), '');

    /* The two questions are not part of the memo, and the export is also how a
       draft leaves the desk — dropping them would lose the writer's work,
       printing them inline would teach the thing the desk exists to unteach.
       So: below the document, behind a rule, named as notes. */
    if (g.questions && (F.decision.value.trim() || F.falsifier.value.trim())) {
      lines.push(
        '---',
        '',
        '_Desk notes — the writer’s own questions. Not part of the memo._',
        '',
        '**What decision does this inform?** ' + (F.decision.value.trim() || '—'),
        '',
        '**What would change my mind?** ' + (F.falsifier.value.trim() || '—'),
        '');
    }
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

  /* A memo carries the day it landed, so the date is worth one tap — but it is
     typed, never prefilled: a date nobody chose is content the desk invented,
     and it would also mark an untouched slot as drafted just for being opened.
     Long form because "10/08/2026" is a different day either side of the
     Atlantic and these memos are addressed across it. */
  el('dateToday').addEventListener('click', function () {
    F.date.value = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    save(); lint();
    if (!el('paneSkim').hidden) skim();
    F.date.focus();
  });

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
