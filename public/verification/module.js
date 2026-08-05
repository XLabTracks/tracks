/* Module player. One unit at a time, addressed by ?m=<module>&u=<unit>&p=<part>.

   Navigation is pushState, not reload: the rail, the exercise and the
   progress bar all survive a move between units, and the URL stays a real
   deep link (the mockup's #s-2-1-3 habit, kept). popstate re-renders, so
   Back works exactly like the pager.

   A unit is further read one part at a time, with a strip of every part above
   it to jump between them and a toggle to lay the whole unit out at once.
   Parts are derived from the unit, never declared — see partsOf — so a new
   unit in data/course.js is chunked without being told how.

   Trap: parts are hidden, never re-rendered. The exercise engine holds a
   half-answered run in memory, so rebuilding the stack on a jump would throw
   it away; `hidden` is the only difference between the part you are on and
   the rest, and switching to the whole unit is a flag flip.

   Completion is explicit. Nothing here auto-completes a unit on scroll, or on
   reaching the last part — a progress bar that fills because you scrolled
   past something is a progress bar that lies. Two meters, two meanings, each
   labelled by the counter beside it: the strip's reports where you are in the
   unit, the pager's reports how much of the track is finished. */

"use strict";

{
  VT.mountChrome('module.html');

  const C = window.COURSE;
  const flat = [];
  C.modules.forEach(m => m.units.forEach(u => flat.push({ m: m, u: u })));

  /* Part-by-part or the whole unit, remembered per device like the theme is.
     It is a reading preference, not learner work, so it stays out of the
     progress store and out of the account sync. */
  const MODE_KEY = 'vt-reading-mode';

  function mode() {
    try { return localStorage.getItem(MODE_KEY) === 'whole' ? 'whole' : 'parts'; }
    catch (e) { return 'parts'; }
  }
  function setMode(v) {
    try { localStorage.setItem(MODE_KEY, v); } catch (e) { /* private mode */ }
  }

  function locate() {
    const q = new URLSearchParams(location.search);
    const uid = q.get('u');
    const mn = q.get('m');
    let i = flat.findIndex(x => x.u.id === uid);
    if (i < 0 && mn !== null) i = flat.findIndex(x => String(x.m.n) === mn);
    /* ?p is 1-based because it is a thing a learner reads and types; `part`
       is 0-based everywhere below. Out-of-range is clamped once the unit's
       parts are known, not here. */
    return { at: i < 0 ? 0 : i, part: Math.max(0, (parseInt(q.get('p'), 10) || 1) - 1) };
  }

  const start = locate();
  let at = start.at;
  let part = start.part;
  let parts = [];

  /* ---------- rail ---------- */

  /* Desktop keeps the rail permanently open; below the breakpoint it is a
     disclosure, closed by default, so nineteen unit rows do not sit between
     a phone learner and the unit they opened. The `open` attribute is set
     from a media query rather than CSS because a closed <details> hides its
     content in the UA layer, where a stylesheet cannot reliably reopen it. */
  const wide = matchMedia('(min-width: 941px)');

  function drawRail() {
    const cur = flat[at];
    const p = VT.trackProgress();
    document.querySelector('[data-rail]').innerHTML =
      '<details class="rail-box"' + (wide.matches ? ' open' : '') + '>' +
      '<summary class="rail-summary"><span>Track index</span>' +
        '<span class="counter">' + p.done + ' / ' + p.total + '</span></summary>' +
      '<div class="rail-head">' +
        '<a class="exit" href="track.html">&larr; exit to the track</a>' +
        '<div class="progress-row"><span class="meter"><i style="width:' +
          (p.frac * 100).toFixed(1) + '%"></i></span>' +
          '<span class="counter">' + p.done + ' / ' + p.total + '</span></div>' +
      '</div>' +
      C.modules.map(m => {
        const mp = VT.moduleProgress(m);
        return '<div class="rail-mod" style="--mod:var(--mod-' + m.n + ')">' +
          '<div class="head"><span class="n">Module ' + m.n + '</span>' +
          '<span class="ttl">' + VT.esc(m.title) + '</span>' +
          '<span class="frac">' + mp.done + '/' + mp.total + '</span></div>' +
          '<ul>' + m.units.map(u =>
            '<li><a href="module.html?m=' + m.n + '&u=' + encodeURIComponent(u.id) + '"' +
            (u.id === cur.u.id ? ' aria-current="true"' : '') + ' data-go="' + VT.esc(u.id) + '">' +
            '<span class="state' + (VT.isDone(u.id) ? ' on' : '') + '" aria-hidden="true"></span>' +
            '<span class="num">' + VT.esc(u.id) + '</span>' +
            '<span class="lbl">' + VT.esc(u.title) + '</span></a></li>').join('') +
          '</ul></div>';
      }).join('') + '</details>';
  }

  wide.addEventListener('change', drawRail);

  /* ---------- body blocks ---------- */

  function block(b) {
    if (b.p) return '<p>' + VT.fmt(b.p) + '</p>';
    if (b.h) return '<h4>' + VT.fmt(b.h) + '</h4>';
    if (b.ul) return '<ul>' + b.ul.map(li => '<li>' + VT.fmt(li) + '</li>').join('') + '</ul>';
    if (b.note) return '<div class="note"><span class="label">Note</span>' + VT.fmt(b.note) + '</div>';
    if (b.stub) return '<div class="stub"><span class="label">not drafted yet</span>' + VT.fmt(b.stub) + '</div>';
    return '';
  }

  /* The strip prints labels as text, so a label carrying the inline markup
     data/course.js allows loses it rather than showing the asterisks. */
  const plain = s => String(s).replace(/\*\*|`/g, '');

  /* ---------- capstone bank ---------- */

  /* The briefs come out of data/capstone-bank.js, generated from
     verification-capstones/*.md, so no capstone is named in this file: a new
     markdown file appears in the unit on its next build. The card is the bank
     page's card minus the filtering — same fields, same glyph vocabulary out
     of VT.bank — so a brief is recognisable on either surface.

     Trap: capstone-bank.html anchors on the slug and capstone.html resolves
     ?brief= against this same bank, so a card's links must carry the slug and
     never the title. */
  function bankCard(e, lead) {
    const B = VT.bank;
    const stats = [
      B.range(e.team) + (e.team.max === 1 ? ' solo' : ' people'),
      B.range(e.effort) + ' hrs',
      e.duration.label,
      e.perWeek
    ].filter(Boolean);

    const glyph = (g, word) =>
      '<span class="g" aria-hidden="true">' + VT.esc(g) + '</span>' + VT.esc(word);

    return '<article class="brief' + (lead ? ' lead' : '') + '">' +
      '<div class="brief-top">' +
      (lead ? '<span class="chip accent">this unit&rsquo;s brief</span>' : '') +
      '<span class="status">' + glyph(B.statusGlyph[e.status] || '○',
        B.statusWord[e.status] || e.status) + '</span>' +
      '</div>' +
      '<h3>' + VT.esc(e.title) + '</h3>' +
      '<p class="summary">' + VT.esc(e.summary) + '</p>' +
      '<p class="brief-stats">' + stats.map(VT.esc).join(' &middot; ') + '</p>' +
      '<div class="brief-chips">' +
      '<span class="chip">' + glyph(B.diffGlyph[e.difficulty] || '●', e.difficulty) + '</span>' +
      '<span class="chip">' + VT.esc(e.deliverableType) + '</span>' +
      '<span class="chip">' + VT.esc(e.mentor === 'none' ? 'no mentor' : 'mentor ' + e.mentor) + '</span>' +
      '</div>' +
      '<p class="brief-deliverable"><span class="label">Deliverable</span>' +
      VT.esc(e.deliverable) + '</p>' +
      '<div class="brief-actions">' +
      '<a class="btn small' + (lead ? '' : ' outline') + '" href="capstone-bank.html#' +
      encodeURIComponent(e.slug) + '">Read the full brief</a>' +
      /* Every brief opens its workspace from its own sheet on the bank page,
         so only the one this unit is written around carries the shortcut —
         twenty-one cards with two buttons each is a wall, not a choice. */
      (lead ? '<a class="btn small outline" href="capstone.html?brief=' +
        encodeURIComponent(e.slug) + '">Start in the workspace</a>' : '') +
      '</div>' +
      '</article>';
  }

  function bankPart(spec) {
    const entries = ((window.CAPSTONE_BANK || {}).entries || []).slice();
    if (!entries.length) return '';

    const lead = entries.find(e => e.slug === (spec && spec.lead)) || null;
    /* The lead's own track leads the groups — a learner reading a Verification
       unit meets the Verification briefs before the program-level ones. Every
       other track follows alphabetically. */
    const first = lead ? lead.track : null;
    const rest = entries.filter(e => e !== lead).sort((a, b) => {
      if (a.track === b.track) return a.title.localeCompare(b.title);
      if (a.track === first) return -1;
      if (b.track === first) return 1;
      return a.track.localeCompare(b.track);
    });

    let html = '<div class="briefs">';
    if (lead) html += '<div class="brief-grid solo">' + bankCard(lead, true) + '</div>';

    let track = null;
    let open = false;
    rest.forEach(e => {
      if (e.track !== track) {
        if (open) html += '</div>';
        track = e.track;
        const n = rest.filter(x => x.track === track).length;
        html += '<div class="track-head"><span class="name">' + VT.esc(track) + '</span>' +
          '<span class="rule"></span>' +
          '<span class="n">' + n + ' brief' + (n === 1 ? '' : 's') + '</span></div>' +
          '<div class="brief-grid">';
        open = true;
      }
      html += bankCard(e, false);
    });
    if (open) html += '</div>';

    return html + '<p class="briefs-more"><a href="capstone-bank.html">Open the bank &mdash; ' +
      entries.length + ' briefs with filters, prerequisites and sources &rarr;</a></p></div>';
  }

  /* ---------- parts ---------- */

  /* Each {h} in the body opens a part, the blocks before the first one open
     the part named "Start", and the exercise, the readings and the written
     output are each their own. Closing matter — planned coverage, the
     capstone workspace link, the skills line — rides on the last part instead
     of becoming a part nobody would choose to open.

     `label` is what the strip prints, so it has to stand on its own out of
     context. `title` is what the part prints above itself, and is null
     wherever the content below already carries its own heading. */
  function partsOf(m, u) {
    const out = [];
    let cur = null;

    (u.body || []).forEach(b => {
      if (b.h) {
        cur = { label: plain(b.h), title: VT.fmt(b.h), html: '' };
        out.push(cur);
        return;
      }
      if (!cur) { cur = { label: 'Start', title: null, html: '' }; out.push(cur); }
      cur.html += block(b);
    });

    out.forEach(p => { p.html = '<div class="prose">' + p.html + '</div>'; });

    if (u.exercise) {
      // The exercise shell renders its own eyebrow, title and lede.
      out.push({ label: 'Exercise', title: null, html: '<div data-ex></div>' });
    }

    if (u.readings) {
      out.push({ label: 'Readings', title: 'Readings',
        html: '<ul class="readings">' + u.readings.map(r =>
          '<li><span class="t">' + VT.esc(r.t) + '</span> ' +
          '<span class="a">&mdash; ' + VT.esc(r.a) + (r.y ? ', ' + VT.esc(r.y) : '') + '</span>' +
          (r.note ? '<p class="n">' + VT.fmt(r.note) + '</p>' : '') + '</li>').join('') + '</ul>' });
    }

    if (u.bank) {
      const html = bankPart(u.bank);
      if (html) out.push({ label: 'Choose a brief', title: 'Choose a brief', html: html });
    }

    if (u.output) {
      out.push({ label: 'Written output', title: null,
        html: '<div class="output"><span class="label">Written output</span><p>' +
          VT.fmt(u.output) + '</p></div>' });
    }

    let tail = '';

    if (u.coverage) {
      tail += '<div class="block-gap coverage"><span class="label">Planned coverage</span><ul>' +
        u.coverage.map(c => '<li>' + VT.fmt(c) + '</li>').join('') + '</ul></div>';
    }

    if (u.workspace) {
      tail += '<div class="block-gap"><a class="btn" href="' + VT.esc(u.workspace) +
        '">Open the capstone workspace</a></div>';
    }

    const skills = VT.skillsTouchedBy(u.id);
    if (skills.length) {
      tail += '<div class="block-gap advances">This unit advances ' + skills.length +
        ' skill' + (skills.length === 1 ? '' : 's') + ': ' +
        skills.map(s => '<a href="map.html?skill=' + encodeURIComponent(s.id) + '">' +
          VT.esc(s.label) + '</a>').join(', ') +
        '. <a href="map.html?unit=' + encodeURIComponent(u.id) + '">See them on the map &rarr;</a></div>';
    }

    if (tail) {
      if (!out.length) out.push({ label: 'This unit', title: null, html: '' });
      out[out.length - 1].html += tail;
    }

    return out;
  }

  /* ---------- unit ---------- */

  function drawUnit() {
    const { m, u } = flat[at];
    const done = VT.isDone(u.id);

    parts = partsOf(m, u);
    part = Math.max(0, Math.min(parts.length - 1, part));

    document.title = u.id + ' ' + u.title + ' — Verification · XLab Tracks';

    document.querySelector('[data-crumbs]').innerHTML =
      '<a href="landing.html">Home</a> / <a href="track.html">Track</a> / Module ' + m.n +
      ' &mdash; ' + VT.esc(m.title);

    /* What a unit *is* — kind, length, whether it carries an exercise — is
       description, so it reads as one line of text like the track rows do.
       A pill is reserved for state that changes: only "complete" gets one,
       and it carries the word and a tick, never a tint on its own. */
    const facts = [u.kind, u.mins];
    if (u.optional) facts.push('optional');
    if (u.exercise) facts.push('exercise');
    if (u.output) facts.push('written output');
    const chips = ['<span class="unit-facts">' + VT.esc(facts.join(' · ')) + '</span>'];
    if (done) chips.push('<span class="chip done">complete</span>');

    const many = parts.length > 1;

    let html =
      '<div class="unit-head" style="--mod:var(--mod-' + m.n + ')">' +
        '<span class="unit-num">' + VT.esc(u.id) + ' &middot; Module ' + m.n + '</span>' +
        '<h1>' + VT.esc(u.title) + '</h1>' +
        '<p class="unit-goal">' + VT.fmt(u.goal) + '</p>' +
        '<div class="unit-chips">' + chips.join('') + '</div>' +
      '</div>' +
      (many ? '<nav class="parts" data-parts aria-label="Parts of this unit"></nav>' : '') +
      '<div class="part-stack" data-stack>' +
        parts.map((p, i) =>
          '<section class="part" id="part-' + (i + 1) + '" tabindex="-1" ' +
          'aria-label="Part ' + (i + 1) + ' of ' + parts.length + ': ' + VT.esc(p.label) + '">' +
          (p.title ? '<h2 class="part-title">' + p.title + '</h2>' : '') +
          p.html + '</section>').join('') +
      '</div>' +
      (many ? '<div class="part-pager" data-ppager></div>' : '');

    document.querySelector('[data-unit]').innerHTML = html;

    if (u.exercise) {
      Exercise.mount(document.querySelector('[data-ex]'), u.exercise);
    }

    showPart();
  }

  /* ---------- parts: strip, pager, switching ---------- */

  function showPart() {
    const whole = mode() === 'whole';
    document.querySelectorAll('[data-stack] > .part')
      .forEach((el, i) => { el.hidden = !whole && i !== part; });
    drawPartStrip(whole);
    drawPartPager(whole);
    drawPager();
  }

  /* The strip is the index and the position readout in one: the meter is
     decoration for the "part n / m" beside it, and the part you are on says
     "now" in words as well as carrying the fill. In whole-unit mode there is
     no current part, so the rows become plain in-page links and the meter —
     which would read as a full bar — is replaced by the count. */
  function drawPartStrip(whole) {
    const strip = document.querySelector('[data-parts]');
    if (!strip) return;
    const n = parts.length;

    strip.innerHTML =
      '<div class="parts-head">' +
        (whole
          ? '<span class="counter">' + n + ' parts, all shown</span>'
          : '<span class="progress-row"><span class="meter seg" style="--cells:' + n +
            '"><i style="width:' + (((part + 1) / n) * 100).toFixed(1) + '%"></i></span>' +
            '<span class="counter">part ' + (part + 1) + ' / ' + n + '</span></span>') +
        '<button class="btn small outline" data-mode>' +
          (whole ? 'Read part by part' : 'Read the whole unit') + '</button>' +
      '</div>' +
      '<ol class="part-list">' + parts.map((p, i) => {
        const now = !whole && i === part;
        const open = whole
          ? '<a href="#part-' + (i + 1) + '" class="part-jump"'
          : '<button type="button" class="part-jump' + (now ? ' now' : '') + '"' +
            (now ? ' aria-current="step"' : '');
        return '<li>' + open + ' data-jump="' + i + '">' +
          '<span class="n">' + (i + 1) + '</span>' +
          '<span class="lbl">' + VT.esc(p.label) + '</span>' +
          (whole ? '</a>' : '</button>') + '</li>';
      }).join('') + '</ol>';
  }

  /* Repeated at the foot of the part so finishing one does not mean scrolling
     back up to leave it. The last part has no Next: the unit pager appears
     under it and carries the move out of the unit. */
  function drawPartPager(whole) {
    const el = document.querySelector('[data-ppager]');
    if (!el) return;
    el.hidden = whole;
    if (whole) { el.innerHTML = ''; return; }
    const last = part === parts.length - 1;
    el.innerHTML =
      '<button class="btn small outline" data-ppre' + (part === 0 ? ' disabled' : '') +
        '>&larr; Previous part</button>' +
      '<span class="counter">part ' + (part + 1) + ' / ' + parts.length + '</span>' +
      (last ? '' : '<button class="btn small" data-pnext>Next part &rarr;</button>');
  }

  function goPart(i) {
    part = Math.max(0, Math.min(parts.length - 1, i));
    showPart();
    syncUrl();
    /* Focus lands on the part so a screen reader hears the new content; the
       page scroll is ours to place, so it is taken off the focus call. */
    const el = document.querySelectorAll('[data-stack] > .part')[part];
    if (el) el.focus({ preventScroll: true });
    document.querySelector('.work').scrollIntoView({ block: 'start' });
  }

  /* Part moves rewrite the current history entry rather than adding one:
     Back stays a move between units, and the URL stays a link that opens on
     the part it was copied from. */
  function syncUrl() {
    const { m, u } = flat[at];
    history.replaceState({ i: at, p: part }, '',
      'module.html?m=' + m.n + '&u=' + encodeURIComponent(u.id) +
      (part ? '&p=' + (part + 1) : ''));
  }

  /* ---------- unit pager ---------- */

  /* Leaving the unit — completing it, or stepping to the next one — belongs at
     the end of the unit, so in part-by-part mode this row waits for the last
     part rather than offering Mark complete over part one of six. The rail is
     still there for anyone who wants out early. */
  function drawPager() {
    const el = document.querySelector('[data-pager]');
    const atEnd = mode() === 'whole' || part === parts.length - 1;
    el.hidden = !atEnd;
    if (!atEnd) { el.innerHTML = ''; return; }

    const { u } = flat[at];
    const done = VT.isDone(u.id);
    const p = VT.trackProgress();
    el.innerHTML =
      '<button class="btn outline" data-prev' + (at === 0 ? ' disabled' : '') + '>&larr; Previous</button>' +
      '<span class="progress-row track-of"><span class="meter"><i style="width:' +
        (p.frac * 100).toFixed(1) + '%"></i></span>' +
        '<span class="counter">' + p.done + ' / ' + p.total + ' units complete</span></span>' +
      (done
        ? '<span class="done-state">complete</span><button class="btn outline" data-undo>Mark not done</button>'
        : '<button class="btn" data-done>Mark complete</button>') +
      '<button class="btn outline" data-nextu' + (at === flat.length - 1 ? ' disabled' : '') + '>Next &rarr;</button>';
  }

  /* ---------- navigation ---------- */

  function go(i, push) {
    at = Math.max(0, Math.min(flat.length - 1, i));
    part = 0;
    const { m, u } = flat[at];
    if (push !== false) {
      history.pushState({ i: at, p: 0 }, '', 'module.html?m=' + m.n + '&u=' + encodeURIComponent(u.id));
    }
    drawRail();
    drawUnit();
    document.querySelector('.work').scrollIntoView({ block: 'start' });
  }

  document.addEventListener('click', e => {
    const jump = e.target.closest('[data-jump]');
    if (jump) {
      // In whole-unit mode the row is a real anchor; let the browser scroll it.
      if (mode() === 'whole') return;
      e.preventDefault();
      goPart(+jump.dataset.jump);
      return;
    }
    if (e.target.closest('[data-mode]')) {
      const whole = mode() !== 'whole';
      setMode(whole ? 'whole' : 'parts');
      showPart();
      // Switching view should not cost the learner their place in the unit.
      const el = document.querySelectorAll('[data-stack] > .part')[part];
      if (el) el.scrollIntoView({ block: 'start' });
      return;
    }
    if (e.target.closest('[data-ppre]')) { goPart(part - 1); return; }
    if (e.target.closest('[data-pnext]')) { goPart(part + 1); return; }

    const link = e.target.closest('[data-go]');
    if (link) {
      e.preventDefault();
      go(flat.findIndex(x => x.u.id === link.dataset.go));
      return;
    }
    if (e.target.closest('[data-prev]')) go(at - 1);
    if (e.target.closest('[data-nextu]')) go(at + 1);
    if (e.target.closest('[data-done]')) {
      VT.completeUnit(flat[at].u.id);
      drawRail();
      drawPager();
    }
    if (e.target.closest('[data-undo]')) {
      VT.uncompleteUnit(flat[at].u.id);
      drawRail();
      drawPager();
    }
  });

  addEventListener('popstate', () => {
    const p = locate();
    at = p.at;
    part = p.part;
    drawRail();
    drawUnit();
  });

  drawRail();
  drawUnit();
}
