/* The skill constellation: the 27-skill graph drawn as a fan of five module
   branches rather than a column chart. Each module is a ray out of the hub,
   its skills strung along it in row-band order; an edge is drawn wherever one
   skill feeds another, bowed toward the hub so crossing edges stay readable.

   Layout is computed from the data, never measured, so the whole figure is
   built in one pass before it is inserted — a measured layout would have to
   draw edges after paint, which means a frame where the graph is a pile of
   unconnected circles.

   Trap: the fan opens upward from the bottom edge, so cy sits ON the viewBox
   floor. Anything added below the hub is invisible; grow the box, don't move
   the hub.

   Trap: hue is never the only encoding. A star carries its module number as a
   numeral and its name as text, the panel names the module in words, and the
   filter chips are labelled — a learner who cannot separate the five hues
   loses nothing. */

(function () {
  var S = window.SKILLS;
  var sky = document.getElementById('sky');
  var panel = document.getElementById('skyPanel');
  var filters = document.getElementById('modFilters');
  if (!S || !sky || !panel) return;

  /* A 145° fan, so no ray runs near-horizontal: a label is pushed sideways off
     its star, and on a flat ray that lands on the next star along. r0 is large
     for the same reason — the rays are 29° apart, which is 152px of clearance
     at the innermost ring and nothing at all near the hub.

     Trap: the viewBox is fitted to the drawing afterwards (see fit()), so
     these numbers can be tuned without re-deriving the frame — but anything
     drawn outside the measured set will be cropped. Measure it or don't draw
     it. */
  /* Tuned for the smallest screen, not the largest. What decides whether a
     star's number can be read is the star's share of the whole box, since the
     box is scaled to the viewport: at r0 300 / dr 88 / nodeR 16 a star was
     3.5% of the outer radius and landed at 8px on a phone. Closing the rings
     and growing the stars puts it near 9%. The names left the figure, so the
     wide gap the rings used to keep for label blocks is free. */
  var V = { cx: 900, cy: 900, r0: 150, dr: 62, fan: 200, nodeR: 30, gap: 25, charW: 6.5 };
  V.sector = V.fan / 5;

  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  /* Deterministic star field. Math.random() would reshuffle the sky on every
     paint of a figure that is otherwise pure data. */
  function seeded(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function polar(deg, r) {
    var a = (deg * Math.PI) / 180;
    return [V.cx + r * Math.cos(a), V.cy - r * Math.sin(a)];
  }

  /* Break a skill name into at most two lines. The innermost ring leaves about
     152px between neighbouring rays, and several names run past that on one
     line — "Identifying failure modes" is 25 characters. */
  function wrap(label, max) {
    var words = label.split(' ');
    var lines = [''];
    for (var i = 0; i < words.length; i++) {
      var candidate = lines[lines.length - 1] ? lines[lines.length - 1] + ' ' + words[i] : words[i];
      if (candidate.length > max && lines[lines.length - 1] && lines.length < 2) lines.push(words[i]);
      else lines[lines.length - 1] = candidate;
    }
    return lines;
  }

  // One ray per module, its skills strung outward in row-band order.
  var box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  function fit(x0, y0, x1, y1) {
    if (x0 < box.x0) box.x0 = x0;
    if (y0 < box.y0) box.y0 = y0;
    if (x1 > box.x1) box.x1 = x1;
    if (y1 > box.y1) box.y1 = y1;
  }

  var placed = {};
  var order = [[], [], [], [], []];
  S.nodes.forEach(function (n, i) { order[n.mod].push({ n: n, i: i }); });
  var start = 90 + V.fan / 2; // leftmost edge of the fan
  order.forEach(function (col, mod) {
    col.sort(function (a, b) { return a.n.r - b.n.r || a.i - b.i; });
    var center = start - (mod + 0.5) * V.sector;
    col.center = center;
    col.forEach(function (entry, j) {
      var r = V.r0 + V.dr * j;
      /* Alternating wobble, so a branch reads as a constellation rather than
         a ruler. Kept to a few pixels of lateral travel — the constant is
         divided by r precisely to hold it constant in px, and a bigger one
         swings consecutive labels onto opposite sides of the ray, where they
         land on each other. */
      var jitter = (j % 2 === 0 ? 1 : -1) * (400 / r);
      var p = polar(center + jitter, r);
      placed[entry.n.id] = { node: entry.n, x: p[0], y: p[1], mod: mod, side: mod <= 1 ? 'left' : 'right' };
    });
    col.maxR = V.r0 + V.dr * (col.length - 1);
    var arc = polar(center, col.maxR + 74);
    col.arc = { x: arc[0], y: arc[1] };
    var half = ('M' + mod + ' · ' + S.moduleNames[mod]).length * V.charW * 0.5;
    fit(arc[0] - half, arc[1] - 13, arc[0] + half, arc[1] + 5);
  });

  /* ---------- markup ---------- */

  var rnd = seeded(20260805);
  var bg = '';
  /* Rings only span the sectors that reach them — a full-fan ring at the
     depth of the longest branch would push the frame out past four columns
     that stop far short of it. */
  var depth = Math.max.apply(null, order.map(function (c) { return c.length; }));
  for (var k = 0; k < depth; k++) {
    var reach = [0, 1, 2, 3, 4].filter(function (m) { return order[m].length > k; });
    var rr = V.r0 + V.dr * k;
    var a0 = order[reach[0]].center + V.sector / 2;
    var a1 = order[reach[reach.length - 1]].center - V.sector / 2;
    var p0 = polar(a0, rr), p1 = polar(a1, rr);
    bg += '<path class="ring" d="M ' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) +
      ' A ' + rr + ' ' + rr + ' 0 0 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + '"/>';
    fit(Math.min(p0[0], p1[0]), V.cy - rr, Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1]));
  }
  for (var s = 0; s < 150; s++) {
    var sr = V.r0 * 0.4 + rnd() * (V.r0 + V.dr * depth);
    var sp = polar(start - rnd() * V.fan, sr);
    bg += '<circle class="star" cx="' + sp[0].toFixed(1) + '" cy="' + sp[1].toFixed(1) +
      '" r="' + (rnd() * 1.2 + 0.3).toFixed(2) + '" opacity="' + (rnd() * 0.3 + 0.06).toFixed(2) + '"/>';
  }

  var edgeHtml = '';
  var edgesOf = {};
  S.edges.forEach(function (e, idx) {
    var a = placed[e[0]], b = placed[e[1]];
    if (!a || !b) return;
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    var qx = mx + (V.cx - mx) * 0.18, qy = my + (V.cy - my) * 0.18;
    var cross = a.mod !== b.mod;
    edgeHtml += '<path class="edge' + (cross ? ' cross' : '') + '" id="e' + idx + '" style="--sel:var(--mod-' + a.mod + ');--sel-ink:var(--mod-' + a.mod + '-ink);--sel-text:var(--mod-' + a.mod + '-text)" d="M ' +
      a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' Q ' + qx.toFixed(1) + ' ' + qy.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + '"/>';
    (edgesOf[e[0]] = edgesOf[e[0]] || []).push(idx);
    (edgesOf[e[1]] = edgesOf[e[1]] || []).push(idx);
  });

  var arcHtml = order.map(function (col, mod) {
    return '<g class="arc-label" data-mod="' + mod + '" style="--sel:var(--mod-' + mod + ');--sel-ink:var(--mod-' + mod + '-ink);--sel-text:var(--mod-' + mod + '-text)" role="button" tabindex="0"' +
      ' aria-label="Highlight module ' + mod + ', ' + esc(S.moduleNames[mod]) + '">' +
      '<text x="' + col.arc.x.toFixed(1) + '" y="' + col.arc.y.toFixed(1) + '">M' + mod + ' · ' + esc(S.moduleNames[mod]) + '</text></g>';
  }).join('');

  /* One running number per skill, module by module. It is the key between the
     figure and the list under it: the figure carries the number, the list
     carries the name. That split is what lets the figure shrink to a phone —
     27 names drawn inline held it at 760px wide and no scale rescued them. */
  var num = {};
  var seq = 0;
  order.forEach(function (col) {
    col.forEach(function (entry) { num[entry.n.id] = ++seq; });
  });

  var nodeHtml = S.nodes.map(function (n) {
    var p = placed[n.id];
    fit(p.x - V.nodeR, p.y - V.nodeR, p.x + V.nodeR, p.y + V.nodeR);
    return '<g class="node" data-id="' + n.id + '" style="--sel:var(--mod-' + n.mod + ');--sel-ink:var(--mod-' + n.mod + '-ink);--sel-text:var(--mod-' + n.mod + '-text)" role="button" tabindex="0"' +
      ' aria-label="' + num[n.id] + '. ' + esc(n.label) + ' — module ' + n.mod + ', ' + esc(S.moduleNames[n.mod]) + '">' +
      '<title>' + esc(n.label) + '</title>' +
      '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + V.nodeR + '"/>' +
      '<text class="node-num" x="' + p.x.toFixed(1) + '" y="' + (p.y + 4).toFixed(1) + '">' + num[n.id] + '</text></g>';
  }).join('');

  var pad = 18;
  var vb = [
    (box.x0 - pad).toFixed(0),
    (box.y0 - pad).toFixed(0),
    (box.x1 - box.x0 + pad * 2).toFixed(0),
    (box.y1 - box.y0 + pad * 2).toFixed(0),
  ].join(' ');

  sky.innerHTML =
    '<svg viewBox="' + vb + '" role="img" aria-label="Skill constellation: ' +
    S.nodes.length + ' skills in five module branches, joined wherever one skill feeds another.">' +
    bg + edgeHtml + arcHtml + nodeHtml + '</svg>';

  /* The key. The figure carries numbers, this carries the names — the split
     that lets the figure scale to a phone. It is also the reading order the
     figure cannot give a screen reader, and on a narrow screen it is the
     primary way in: a key row selects its star exactly as the star does. */
  var keyEl = document.getElementById('skyKey');
  if (keyEl) {
    keyEl.innerHTML = order.map(function (col, mod) {
      return '<li class="key-mod" style="--sel:var(--mod-' + mod + ');--sel-text:var(--mod-' + mod + '-text)">' +
        '<span class="key-mod-name">M' + mod + ' · ' + esc(S.moduleNames[mod]) + '</span><ol>' +
        col.map(function (entry) {
          var n = entry.n;
          return '<li><button type="button" data-key="' + esc(n.id) + '">' +
            '<span class="key-n">' + num[n.id] + '</span>' +
            '<span class="key-label">' + esc(n.label) + '</span></button></li>';
        }).join('') + '</ol></li>';
    }).join('');
  }

  var svg = sky.querySelector('svg');
  var nodeEls = {};
  svg.querySelectorAll('.node').forEach(function (g) { nodeEls[g.dataset.id] = g; });
  var edgeEls = S.edges.map(function (_, i) { return svg.querySelector('#e' + i); });
  var arcEls = svg.querySelectorAll('.arc-label');

  var neighbours = {};
  S.edges.forEach(function (e) {
    (neighbours[e[0]] = neighbours[e[0]] || []).push(e[1]);
    (neighbours[e[1]] = neighbours[e[1]] || []).push(e[0]);
  });

  /* ---------- focus + panel ---------- */

  var pinned = null;
  var hovered = null;
  var activeModule = null;

  function clearHot() {
    Object.keys(nodeEls).forEach(function (id) { nodeEls[id].classList.remove('hot'); });
    edgeEls.forEach(function (el) { if (el) el.classList.remove('hot'); });
    arcEls.forEach(function (el) { el.classList.remove('hot'); });
  }

  function focusNode(id) {
    clearHot();
    sky.classList.add('focusing');
    nodeEls[id].classList.add('hot');
    (neighbours[id] || []).forEach(function (other) {
      if (nodeEls[other]) nodeEls[other].classList.add('hot');
    });
    (edgesOf[id] || []).forEach(function (i) { if (edgeEls[i]) edgeEls[i].classList.add('hot'); });
    arcEls[placed[id].mod].classList.add('hot');
  }

  function focusModule(mod) {
    clearHot();
    sky.classList.add('focusing');
    arcEls[mod].classList.add('hot');
    S.nodes.forEach(function (n) { if (n.mod === mod) nodeEls[n.id].classList.add('hot'); });
    S.edges.forEach(function (e, i) {
      if (placed[e[0]].mod === mod || placed[e[1]].mod === mod) {
        if (edgeEls[i]) edgeEls[i].classList.add('hot');
      }
    });
  }

  var DEFAULT_PANEL =
    '<p class="p-hint">Every star is a skill; a line runs from a skill to the one it feeds. ' +
    'Hover a star to light its branch, click to pin it — the numeral inside is its module.</p>' +
    '<p class="p-hint" style="margin-top:12px">' + S.nodes.length + ' skills, ' + S.edges.length +
    ' dependencies. A skill is fed by specific units, so it fills as you complete them rather than when you finish a module.</p>';

  function renderPanel(id) {
    if (!id) { panel.style.removeProperty('--sel'); panel.innerHTML = DEFAULT_PANEL; return; }
    var n = placed[id].node;
    panel.style.setProperty('--sel', 'var(--mod-' + n.mod + ')');
    panel.style.setProperty('--sel-ink', 'var(--mod-' + n.mod + '-ink)');
    panel.style.setProperty('--sel-text', 'var(--mod-' + n.mod + '-text)');
    panel.innerHTML =
      '<p class="p-mod">M' + n.mod + ' · ' + esc(S.moduleNames[n.mod]) + '</p>' +
      '<h3>' + esc(n.label) + '</h3>' +
      '<p class="p-meta"><span>Module ' + n.mod + ' · ' + esc(S.moduleNames[n.mod]) + '</span>' +
      '<span>rooted in ' + esc(n.unit) + '</span></p>' +
      '<p class="p-desc">' + esc(n.desc) + '</p>' +
      '<ul class="p-rungs">' + n.rungs.map(function (r) {
        return '<li><span class="u">' + esc(r[0]) + '</span><span class="a">' + esc(r[1]) + '</span></li>';
      }).join('') + '</ul>';
  }

  function refresh() {
    var shown = hovered || pinned;
    if (hovered) focusNode(hovered);
    else if (pinned) focusNode(pinned);
    else if (activeModule !== null) focusModule(activeModule);
    else { clearHot(); sky.classList.remove('focusing'); }
    Object.keys(nodeEls).forEach(function (id) {
      nodeEls[id].classList.toggle('pinned', id === pinned);
    });
    renderPanel(shown);
  }

  svg.addEventListener('pointerover', function (e) {
    var g = e.target.closest('.node');
    if (!g || g.dataset.id === hovered) return;
    hovered = g.dataset.id;
    refresh();
  });
  svg.addEventListener('pointerout', function (e) {
    if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.node')) return;
    if (hovered === null) return;
    hovered = null;
    refresh();
  });

  function activate(target) {
    var node = target.closest('.node');
    if (node) {
      pinned = pinned === node.dataset.id ? null : node.dataset.id;
      activeModule = null;
      syncFilters();
      refresh();
      return true;
    }
    var arc = target.closest('.arc-label');
    if (arc) {
      var mod = Number(arc.dataset.mod);
      activeModule = activeModule === mod ? null : mod;
      pinned = null;
      syncFilters();
      refresh();
      return true;
    }
    return false;
  }

  svg.addEventListener('click', function (e) {
    if (!activate(e.target)) { pinned = null; activeModule = null; syncFilters(); refresh(); }
  });

  /* A key row pins its star, exactly as the star does. On a phone this is the
     way in: the numbers in the figure are legible at any scale, the names are
     only here. */
  if (keyEl) {
    keyEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-key]');
      if (!btn) return;
      pinned = pinned === btn.dataset.key ? null : btn.dataset.key;
      activeModule = null;
      syncFilters();
      refresh();
    });
  }
  svg.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (activate(e.target)) e.preventDefault();
  });
  svg.addEventListener('focusin', function (e) {
    var g = e.target.closest('.node');
    if (!g) return;
    hovered = g.dataset.id;
    refresh();
  });
  svg.addEventListener('focusout', function (e) {
    if (!e.target.closest('.node')) return;
    hovered = null;
    refresh();
  });

  /* ---------- module filter chips ---------- */

  function syncFilters() {
    if (!filters) return;
    filters.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.mod) === activeModule));
    });
  }

  if (filters) {
    filters.innerHTML = S.moduleNames.map(function (name, mod) {
      /* The name is its own span so a phone can drop it: five names do not fit
         a 390px row and the bar was cut off mid-word with nothing saying it
         scrolled. The numeral always shows, and the module's name is on its
         arc label inside the figure either way. */
      return '<button type="button" data-mod="' + mod + '" aria-pressed="false" style="--sel:var(--mod-' + mod + ');--sel-ink:var(--mod-' + mod + '-ink);--sel-text:var(--mod-' + mod + '-text)">M' +
        mod + '<span class="mod-name"> · ' + esc(name) + '</span></button>';
    }).join('');
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mod]');
      if (!b) return;
      var mod = Number(b.dataset.mod);
      activeModule = activeModule === mod ? null : mod;
      pinned = null;
      syncFilters();
      refresh();
    });
  }

  refresh();
})();
/* ---------------------------------------------------------------------------
   The page around the constellation. Every number and card below is read from
   data/course.js and data/skills.js, so a new unit or module appears here on
   its own — nothing about the course is written into this file.

   Trap: the hero's primary button is the learner's next incomplete unit, which
   means it depends on the progress store. Read it through VT, never from
   localStorage directly, or the two disagree after a reset.
--------------------------------------------------------------------------- */

(function () {
  var C = window.COURSE, S = window.SKILLS, VT = window.VT;
  if (!C || !VT) return;
  var esc = VT.esc;

  VT.mountChrome('landing.html');
  VT.mountFoot();

  /* Objectives come from the graph's own list, so the promises here cannot
     drift from the map beside them. */
  var ul = document.getElementById('objectives');
  if (ul && S) {
    ul.innerHTML = S.objectives.map(function (o, i) {
      return '<li><span class="n" aria-hidden="true">' + String(i + 1).padStart(2, '0') +
        '</span><span>' + esc(o) + '</span></li>';
    }).join('');
  }

  /* The hero's two ways in and its stat row are written in landing.html and
     stay there. They are the course's pitch, not a readout of this browser's
     progress — a returning learner picks up from the track page. */

})();
