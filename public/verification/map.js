/* Skill map. Read-only for learners: it never gates navigation, it only
   shows what has filled in.

   The figure is the home page's skill web — skill-web.js draws it for every
   surface, so they cannot disagree. What this file adds rides on that
   renderer's hooks: each star's ring fills as its rungs complete, the ladder
   links every rung to the unit that teaches it, the panel says what a skill
   builds on and unlocks, and ?skill= / ?unit= open the page on a star or on
   the stars a just-completed unit touched (platform.js's toast links here).

   VTSkillMap.mount(opts) draws into opts.sky / panel / filters / key (the
   page's #sky, #skyPanel, #modFilters, #skyKey when omitted) and returns the
   web's own handle ({ pin, setDim, refresh }), with opts.query applying the
   URL's ?skill= / ?unit=. The notebook's Skill Map view draws no figure —
   bars and descriptions only — and takes just unitHref and rung from here,
   so its ladder is the panel's ladder. A library, not a page script:
   nothing runs on load, so the notebook can carry it on any route. */

"use strict";

window.VTSkillMap = (function () {

  /* Which unit page teaches a rung. Compound rungs point at 2.1, the first
     of the evidence buckets. */
  const unitHref = tag => {
    const S = window.SKILLS;
    const C = window.COURSE;
    const id = tag === S.compoundRung ? S.compoundUnits[0] : tag;
    for (const m of C.modules) {
      const u = m.units.find(u => u.id === id);
      if (u) return u.href || '/tracks/verification';
    }
    return '/tracks/verification';
  };

  /* One ladder row. The rung marker is a glyph, so "filled" is a shape as
     well as a colour: ✓ full · ◐ partial · · empty. The unit tag links to
     the lesson that teaches it. Shared with the notebook's progress view,
     so the two ladders cannot disagree. */
  const rung = r => {
    const f = VT.rungFill(r[0]);
    return '<li class="' + (f >= 1 ? 'hit' : '') + '">' +
      '<span class="state" aria-hidden="true">' + (f >= 1 ? '✓' : (f > 0 ? '◐' : '·')) + '</span>' +
      '<a class="u" href="' + unitHref(r[0]) + '">' + VT.esc(r[0]) + '</a>' +
      '<span class="a">' + VT.fmt(r[1]) + '</span></li>';
  };

  function mount(opts) {
    opts = opts || {};
    const S = window.SKILLS;
    const C = window.COURSE;
    if (!S || !C || !window.VTSkillWeb) return null;
    const byId = {};
    S.nodes.forEach(n => { byId[n.id] = n; });

    const q = opts.query ? new URLSearchParams(location.search) : null;
    let litUnit = q ? q.get('unit') : null;

    const touches = (n, unit) =>
      n.rungs.some(r => r[0] === unit ||
        (r[0] === S.compoundRung && S.compoundUnits.indexOf(unit) > -1));

    /* A star the unit deep link rejects: one that takes nothing from that unit. */
    const dimmed = n => !!(litUnit && !touches(n, litUnit));

    const chips = (cls, items) =>
      '<div class="p-links">' + items.map(x =>
        '<button type="button" ' + cls + '="' + VT.esc(x.id) + '">' + VT.esc(x.label) + '</button>').join('') +
      '</div>';

    const panel = opts.panel || document.getElementById('skyPanel');

    const web = VTSkillWeb.mount({
      sky: opts.sky,
      panel: panel,
      filters: opts.filters,
      key: opts.key,
      pinned: q ? q.get('skill') : null,
      state: n => VT.skillProgress(n),
      dim: litUnit ? dimmed : null,
      hint:
        '<p class="p-hint">Pin a star, or its row in the key, to see what the skill lets you do, ' +
        'which unit fills each rung, and what it builds on. Every star is visible from day one; ' +
        'the ring around it fills as you complete the units that feed it.</p>',
      rung: rung,
      panelExtra: n => {
        const p = VT.skillProgress(n);
        const pre = S.edges.filter(e => e[1] === n.id).map(e => byId[e[0]]).filter(Boolean);
        const post = S.edges.filter(e => e[0] === n.id).map(e => byId[e[1]]).filter(Boolean);
        const firstOpen = n.rungs.find(r => VT.rungFill(r[0]) < 1);
        return (pre.length ? '<p class="p-sec">Builds on</p>' + chips('data-jump', pre) : '') +
          (post.length ? '<p class="p-sec">Unlocks</p>' + chips('data-jump', post) : '') +
          '<p class="p-summary">' + VT.fracText(p) + ' rungs &middot; ' + p.state +
            (p.frac < 1 && firstOpen ? ' &mdash; next at <a href="' + unitHref(firstOpen[0]) + '">' +
              VT.esc(firstOpen[0]) + '</a>' : '') + '</p>';
      },
    });
    if (!web) return null;

    /* The chips pin within their own web. Delegated on the panel, not the
       document: the page and the notebook can both hold a map at once. */
    panel.addEventListener('click', e => {
      const jump = e.target.closest('[data-jump]');
      if (jump) web.pin(jump.dataset.jump);
    });

    /* Escape lifts the unit deep link's fade. */
    if (litUnit) {
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && litUnit) { litUnit = null; web.setDim(null); }
      });
    }

    return web;
  }

  return { mount: mount, unitHref: unitHref, rung: rung };
})();
