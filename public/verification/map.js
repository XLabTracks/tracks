/* Skill map. Read-only for learners: it never gates navigation, it only
   shows what has filled in.

   Layout is CSS grid inside bands; edges are drawn afterwards from measured
   DOM rectangles. That means one hard ordering rule — render nodes, let the
   browser lay them out, *then* draw edges. Drawing in the same frame as the
   markup gives every node a zero rect and every edge a line to the origin. */

"use strict";

{
  VT.mountChrome('/verification/map');
  VT.mountFoot();

  const S = window.SKILLS;
  const C = window.COURSE;
  const byId = {};
  S.nodes.forEach(n => { byId[n.id] = n; });

  const bands = document.querySelector('[data-bands]');
  const svg = document.querySelector('[data-edges]');
  const card = document.querySelector('[data-card]');

  const q = new URLSearchParams(location.search);
  let sel = q.get('skill') && byId[q.get('skill')] ? q.get('skill') : null;
  let litUnit = q.get('unit') || null;
  let litLo = 0;

  /* Which unit page teaches a rung. Compound rungs point at 2.1, the first
     of the four evidence buckets. */
  const unitHref = tag => {
    const id = tag === S.compoundRung ? S.compoundUnits[0] : tag;
    for (const m of C.modules) {
      if (m.units.some(u => u.id === id)) {
        return (m.units.find(u => u.id === id) || {}).href || '/verification/track';
      }
    }
    return '/verification/track';
  };

  /* ---------- bands ---------- */

  /* Grouped by module, and only by module. */
  function groups() {
    return C.modules.map(m => ({
      key: 'm' + m.n,
      label: '<b>Module ' + m.n + '</b> &middot; ' + VT.esc(m.title),
      accent: 'var(--mod-' + m.n + '-text)',
      nodes: S.nodes.filter(n => n.mod === m.n).sort((a, b) => a.r - b.r || a.label.localeCompare(b.label))
    }));
  }

  function nodeHtml(n) {
    const p = VT.skillProgress(n);
    const cls = p.frac >= 1 ? 'full' : (p.frac > 0 ? 'part' : '');
    const dim = (litLo && n.lo.indexOf(litLo) === -1) ||
      (litUnit && !touches(n, litUnit));
    return '<button class="node ' + cls + (n.id === sel ? ' sel' : '') +
      (dim ? ' dim' : '') + '" style="--mod:var(--mod-' + n.mod + ')"' +
      ' data-n="' + VT.esc(n.id) + '" id="node-' + VT.esc(n.id) + '">' +
      '<span class="n-label">' + VT.esc(n.label) + '</span>' +
      '<span class="n-meta"><span class="n-fill"><i style="width:' +
        (p.frac * 100).toFixed(0) + '%"></i></span>' +
        VT.fracText(p) + '</span></button>';
  }

  const touches = (n, unit) =>
    n.rungs.some(r => r[0] === unit ||
      (r[0] === S.compoundRung && S.compoundUnits.indexOf(unit) > -1));

  function drawBands() {
    bands.innerHTML = groups().map(g =>
      '<section class="band"' + (g.accent ? ' style="--mod:' + g.accent + '"' : '') + '>' +
        '<div class="band-label">' + g.label + '</div>' +
        '<div class="band-nodes">' + g.nodes.map(nodeHtml).join('') + '</div>' +
      '</section>').join('');
  }

  /* ---------- edges ---------- */

  function drawEdges() {
    const host = document.querySelector('[data-canvas]');
    const box = host.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    const at = id => {
      const el = document.getElementById('node-' + id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, h: r.height / 2 };
    };
    const path = [];
    S.edges.forEach(e => {
      const a = at(e[0]), b = at(e[1]);
      if (!a || !b) return;
      const lit = sel && (e[0] === sel || e[1] === sel);
      const mid = (a.y + b.y) / 2;
      path.push('<path class="edge' + (lit ? ' lit' : '') + '" d="M' + a.x.toFixed(1) + ' ' +
        (a.y + a.h).toFixed(1) + ' C' + a.x.toFixed(1) + ' ' + mid.toFixed(1) + ' ' +
        b.x.toFixed(1) + ' ' + mid.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' +
        (b.y - b.h).toFixed(1) + '"/>');
    });
    svg.innerHTML = path.join('');
  }

  /* ---------- node card ---------- */

  function drawCard() {
    if (!sel) {
      card.innerHTML = '<p class="empty">Pick any node &mdash; locked ones too. ' +
        'The card shows what the skill lets you do, which unit fills each rung, ' +
        'and what it builds on.</p>';
      return;
    }
    const n = byId[sel];
    const p = VT.skillProgress(n);
    const pre = S.edges.filter(e => e[1] === n.id).map(e => byId[e[0]]).filter(Boolean);
    const post = S.edges.filter(e => e[0] === n.id).map(e => byId[e[1]]).filter(Boolean);
    const firstOpen = n.rungs.find(r => VT.rungFill(r[0]) < 1);

    card.innerHTML =
      '<span class="eyebrow">Module ' + n.mod + ' &middot; ' +
        VT.esc(C.modules[n.mod] ? C.modules[n.mod].title : '') + '</span>' +
      '<h2 style="--mod:var(--mod-' + n.mod + ');--mod-type:var(--mod-' + n.mod + '-text)">' + VT.esc(n.label) + '</h2>' +
      '<p class="desc">' + VT.fmt(n.desc) + '</p>' +

      '<div class="sec">The ladder &mdash; what each unit adds</div>' +
      '<ul class="ladder">' + n.rungs.map(r => {
        const f = VT.rungFill(r[0]);
        return '<li class="' + (f >= 1 ? 'hit' : '') + '">' +
          '<span class="state" aria-hidden="true">' + (f >= 1 ? '✓' : (f > 0 ? '◐' : '·')) + '</span>' +
          '<a class="u" href="' + unitHref(r[0]) + '">' + VT.esc(r[0]) + '</a>' +
          '<span class="txt">' + VT.fmt(r[1]) + '</span></li>';
      }).join('') + '</ul>' +

      (pre.length ? '<div class="sec">Builds on</div><div class="links">' +
        pre.map(x => '<button data-jump="' + VT.esc(x.id) + '">' + VT.esc(x.label) + '</button>').join('') +
        '</div>' : '') +
      (post.length ? '<div class="sec">Unlocks</div><div class="links">' +
        post.map(x => '<button data-jump="' + VT.esc(x.id) + '">' + VT.esc(x.label) + '</button>').join('') +
        '</div>' : '') +

      '<div class="sec">Feeds objectives</div><div class="links">' +
        n.lo.map(i => '<button data-lo="' + i + '">' + VT.esc(S.objectives[i - 1]) + '</button>').join('') +
      '</div>' +

      '<p class="summary">' + VT.fracText(p) + ' rungs &middot; ' + p.state +
        (p.frac < 1 && firstOpen ? ' &mdash; next at <a href="' + unitHref(firstOpen[0]) + '">' +
          VT.esc(firstOpen[0]) + '</a>' : '') + '</p>';
  }

  /* ---------- objectives row ---------- */

  document.querySelector('[data-los]').innerHTML = S.objectives.map((o, i) =>
    '<button class="lo" data-lo="' + (i + 1) + '" aria-pressed="false">' + VT.esc(o) + '</button>').join('');

  /* ---------- render ---------- */

  function render(pulse) {
    drawBands();
    drawCard();
    const p = VT.trackProgress();
    document.querySelector('[data-bar]').style.width = (p.frac * 100).toFixed(1) + '%';
    document.querySelector('[data-count]').textContent = p.done + ' / ' + p.total + ' units';
    document.querySelectorAll('.lo').forEach(b =>
      b.setAttribute('aria-pressed', String(+b.dataset.lo === litLo)));
    requestAnimationFrame(drawEdges);
    if (pulse && sel) {
      const el = document.getElementById('node-' + sel);
      if (el) {
        el.classList.add('pulse');
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  document.addEventListener('click', e => {
    const lo = e.target.closest('[data-lo]');
    if (lo) { litLo = (litLo === +lo.dataset.lo) ? 0 : +lo.dataset.lo; litUnit = null; render(); return; }

    const jump = e.target.closest('[data-jump]');
    if (jump) { sel = jump.dataset.jump; litUnit = null; render(true); return; }

    const node = e.target.closest('.node');
    if (node) { sel = (sel === node.dataset.n) ? null : node.dataset.n; render(); }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && (sel || litLo || litUnit)) {
      sel = null; litLo = 0; litUnit = null; render();
    }
  });

  addEventListener('resize', () => requestAnimationFrame(drawEdges));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawEdges);

  render(!!sel);
}
