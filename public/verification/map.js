/* Skill map. Read-only for learners: it never gates navigation, it only
   shows what has filled in.

   The figure is the home page's skill web — skill-web.js draws it for both
   pages, so they cannot disagree. What this page adds rides on that
   renderer's hooks: each star's ring fills as its rungs complete, the ladder
   links every rung to the unit that teaches it, the panel says what a skill
   builds on and unlocks and which objectives it feeds, the objectives row
   filters the web, and ?skill= / ?unit= open the page on a star or on the
   stars a just-completed unit touched (platform.js's toast links here). */

"use strict";

{
  VT.mountChrome('/verification/map');
  VT.mountFoot();

  const S = window.SKILLS;
  const C = window.COURSE;
  const byId = {};
  S.nodes.forEach(n => { byId[n.id] = n; });

  const q = new URLSearchParams(location.search);
  let litUnit = q.get('unit') || null;
  let litLo = 0;

  /* Which unit page teaches a rung. Compound rungs point at 2.1, the first
     of the evidence buckets. */
  const unitHref = tag => {
    const id = tag === S.compoundRung ? S.compoundUnits[0] : tag;
    for (const m of C.modules) {
      const u = m.units.find(u => u.id === id);
      if (u) return u.href || '/tracks/verification';
    }
    return '/tracks/verification';
  };

  const touches = (n, unit) =>
    n.rungs.some(r => r[0] === unit ||
      (r[0] === S.compoundRung && S.compoundUnits.indexOf(unit) > -1));

  /* A star the current filter rejects: an objective it does not feed, or a
     unit it takes nothing from. */
  const dimmed = n =>
    (litLo && n.lo.indexOf(litLo) === -1) || (litUnit && !touches(n, litUnit));

  const chips = (cls, items) =>
    '<div class="p-links">' + items.map(x =>
      '<button type="button" ' + cls + '="' + VT.esc(x.id) + '">' + VT.esc(x.label) + '</button>').join('') +
    '</div>';

  const web = VTSkillWeb.mount({
    pinned: q.get('skill'),
    state: n => VT.skillProgress(n),
    dim: (litLo || litUnit) ? dimmed : null,
    hint:
      '<p class="p-hint">Pin a star, or its row in the key, to see what the skill lets you do, ' +
      'which unit fills each rung, and what it builds on. Every star is visible from day one; ' +
      'the ring around it fills as you complete the units that feed it.</p>',
    /* The ladder's rung marker is a glyph, so "filled" is a shape as well as
       a colour: ✓ full · ◐ partial · · empty. The unit tag links to the
       lesson that teaches it. */
    rung: r => {
      const f = VT.rungFill(r[0]);
      return '<li class="' + (f >= 1 ? 'hit' : '') + '">' +
        '<span class="state" aria-hidden="true">' + (f >= 1 ? '✓' : (f > 0 ? '◐' : '·')) + '</span>' +
        '<a class="u" href="' + unitHref(r[0]) + '">' + VT.esc(r[0]) + '</a>' +
        '<span class="a">' + VT.fmt(r[1]) + '</span></li>';
    },
    panelExtra: n => {
      const p = VT.skillProgress(n);
      const pre = S.edges.filter(e => e[1] === n.id).map(e => byId[e[0]]).filter(Boolean);
      const post = S.edges.filter(e => e[0] === n.id).map(e => byId[e[1]]).filter(Boolean);
      const firstOpen = n.rungs.find(r => VT.rungFill(r[0]) < 1);
      return (pre.length ? '<p class="p-sec">Builds on</p>' + chips('data-jump', pre) : '') +
        (post.length ? '<p class="p-sec">Unlocks</p>' + chips('data-jump', post) : '') +
        '<p class="p-sec">Feeds objectives</p>' +
        chips('data-lo', n.lo.map(i => ({ id: i, label: S.objectives[i - 1] }))) +
        '<p class="p-summary">' + VT.fracText(p) + ' rungs &middot; ' + p.state +
          (p.frac < 1 && firstOpen ? ' &mdash; next at <a href="' + unitHref(firstOpen[0]) + '">' +
            VT.esc(firstOpen[0]) + '</a>' : '') + '</p>';
    },
  });

  /* ---------- objectives row ---------- */

  const los = document.querySelector('[data-los]');
  los.innerHTML = S.objectives.map((o, i) =>
    '<button type="button" class="lo" data-lo="' + (i + 1) + '" aria-pressed="false">' + VT.esc(o) + '</button>').join('');

  function syncFilter() {
    los.querySelectorAll('.lo').forEach(b =>
      b.setAttribute('aria-pressed', String(+b.dataset.lo === litLo)));
    web.setDim((litLo || litUnit) ? dimmed : null);
  }

  const p = VT.trackProgress();
  document.querySelector('[data-bar]').style.width = (p.frac * 100).toFixed(1) + '%';
  document.querySelector('[data-count]').textContent = p.done + ' / ' + p.total + ' units';

  document.addEventListener('click', e => {
    const lo = e.target.closest('[data-lo]');
    if (lo) { litLo = (litLo === +lo.dataset.lo) ? 0 : +lo.dataset.lo; litUnit = null; syncFilter(); return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) web.pin(jump.dataset.jump);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && (litLo || litUnit)) { litLo = 0; litUnit = null; syncFilter(); }
  });
}
