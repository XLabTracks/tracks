/* Module player. One unit at a time, addressed by ?m=<module>&u=<unit>.

   Navigation is pushState, not reload: the rail, the exercise and the
   progress bar all survive a move between units, and the URL stays a real
   deep link (the mockup's #s-2-1-3 habit, kept). popstate re-renders, so
   Back works exactly like the pager.

   Completion is explicit. Nothing here auto-completes a unit on scroll —
   a progress bar that fills because you scrolled past something is a
   progress bar that lies. */

"use strict";

{
  VT.mountChrome('module.html');

  const C = window.COURSE;
  const flat = [];
  C.modules.forEach(m => m.units.forEach(u => flat.push({ m: m, u: u })));

  function locate() {
    const q = new URLSearchParams(location.search);
    const uid = q.get('u');
    const mn = q.get('m');
    let i = flat.findIndex(x => x.u.id === uid);
    if (i < 0 && mn !== null) i = flat.findIndex(x => String(x.m.n) === mn);
    return i < 0 ? 0 : i;
  }

  let at = locate();

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

  /* ---------- unit ---------- */

  function drawUnit() {
    const { m, u } = flat[at];
    const done = VT.isDone(u.id);
    const skills = VT.skillsTouchedBy(u.id);

    document.title = u.id + ' ' + u.title + ' — Verification · XLab Tracks';

    document.querySelector('[data-crumbs]').innerHTML =
      '<a href="landing.html">Home</a> / <a href="track.html">Track</a> / Module ' + m.n +
      ' &mdash; ' + VT.esc(m.title);

    const chips = [
      '<span class="chip">' + VT.esc(u.kind) + '</span>',
      '<span class="chip">' + VT.esc(u.mins) + '</span>'
    ];
    if (u.optional) chips.push('<span class="chip">optional</span>');
    if (u.exercise) chips.push('<span class="chip accent">exercise</span>');
    if (done) chips.push('<span class="chip done">complete</span>');

    let html =
      '<div class="unit-head" style="--mod:var(--mod-' + m.n + ')">' +
        '<span class="unit-num">' + VT.esc(u.id) + ' &middot; Module ' + m.n + '</span>' +
        '<h1>' + VT.esc(u.title) + '</h1>' +
        '<p class="unit-goal">' + VT.fmt(u.goal) + '</p>' +
        '<div class="unit-chips">' + chips.join('') + '</div>' +
      '</div>' +
      '<div class="prose">' + (u.body || []).map(block).join('') + '</div>';

    if (u.exercise) html += '<div class="block-gap" data-ex></div>';

    if (u.coverage) {
      html += '<div class="block-gap coverage"><span class="label">Planned coverage</span><ul>' +
        u.coverage.map(c => '<li>' + VT.fmt(c) + '</li>').join('') + '</ul></div>';
    }

    if (u.readings) {
      html += '<div class="block-gap"><div class="sec-eyebrow" style="margin-top:0">Readings</div>' +
        '<ul class="readings">' + u.readings.map(r =>
          '<li><span class="t">' + VT.esc(r.t) + '</span> ' +
          '<span class="a">&mdash; ' + VT.esc(r.a) + (r.y ? ', ' + VT.esc(r.y) : '') + '</span>' +
          (r.note ? '<p class="n">' + VT.fmt(r.note) + '</p>' : '') + '</li>').join('') + '</ul></div>';
    }

    if (u.output) {
      html += '<div class="block-gap output"><span class="label">Written output</span><p>' +
        VT.fmt(u.output) + '</p></div>';
    }

    if (u.workspace) {
      html += '<div class="block-gap"><a class="btn" href="' + VT.esc(u.workspace) +
        '">Open the capstone workspace</a></div>';
    }

    if (skills.length) {
      html += '<div class="block-gap advances">This unit advances ' + skills.length +
        ' skill' + (skills.length === 1 ? '' : 's') + ': ' +
        skills.map(s => '<a href="map.html?skill=' + encodeURIComponent(s.id) + '">' +
          VT.esc(s.label) + '</a>').join(', ') +
        '. <a href="map.html?unit=' + encodeURIComponent(u.id) + '">See them on the map &rarr;</a></div>';
    }

    document.querySelector('[data-unit]').innerHTML = html;

    if (u.exercise) {
      Exercise.mount(document.querySelector('[data-ex]'), u.exercise);
    }

    drawPager();
  }

  function drawPager() {
    const { u } = flat[at];
    const done = VT.isDone(u.id);
    document.querySelector('[data-pager]').innerHTML =
      '<button class="btn outline" data-prev' + (at === 0 ? ' disabled' : '') + '>&larr; Previous</button>' +
      '<span class="counter">' + (at + 1) + ' / ' + flat.length + ' units</span>' +
      (done
        ? '<span class="done-state">complete</span><button class="btn outline" data-undo>Mark not done</button>'
        : '<button class="btn" data-done>Mark complete</button>') +
      '<button class="btn outline" data-nextu' + (at === flat.length - 1 ? ' disabled' : '') + '>Next &rarr;</button>';
  }

  /* ---------- navigation ---------- */

  function go(i, push) {
    at = Math.max(0, Math.min(flat.length - 1, i));
    const { m, u } = flat[at];
    if (push !== false) {
      history.pushState({ i: at }, '', 'module.html?m=' + m.n + '&u=' + encodeURIComponent(u.id));
    }
    drawRail();
    drawUnit();
    document.querySelector('.work').scrollIntoView({ block: 'start' });
  }

  document.addEventListener('click', e => {
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

  addEventListener('popstate', () => { at = locate(); drawRail(); drawUnit(); });

  drawRail();
  drawUnit();
}
