/* The skill web: the 27-skill graph drawn as a radial web around a glowing
   hub. Each module is an arm — a 72° sector of the circle — and its skills
   sit on shared concentric rings, row band r choosing the ring. Three kinds
   of connective tissue, each a different fact:

     beam    — a tapered spindle in the module's hue: one skill feeding
               another INSIDE its module. The solid line of the legend.
     cross   — the same waisted beam, bowed toward the hub and stroked as a
               dashed outline instead of filled: a skill fed from ANOTHER
               module. Most of the fifty edges are these, which is why they
               stay a step fainter — fifty filled beams read as a hairball.
     spoke   — hub to each arm's innermost skills, and strand — the arc of
               ring that carries a module's stars at one band. Decoration:
               they say "belongs to module N / same band", which the hue and
               the key already say, never "feeds".

   Layout is computed from the data, never measured, so the whole figure is
   built in one pass before it is inserted — a measured layout would have to
   draw edges after paint, which means a frame where the graph is a pile of
   unconnected circles.

   Screen sizes: what decides whether a star's numeral can be read is the
   star's SHARE of the whole box, since the box is scaled to the viewport —
   so a phone does not get the desktop figure shrunk, it gets its own
   geometry. Two presets: full, and a compact web for narrow screens with
   bigger stars on wider rings, no plaques (the chip bar above and the key
   below carry the module names), and a thinner star field. The figure is
   rebuilt when the breakpoint flips; a pinned star survives the rebuild,
   a hover does not (the pointer is gone).

   Trap: the viewBox is fitted to the drawing afterwards (see fit()), so the
   radii can be tuned without re-deriving the frame — but anything drawn
   outside the measured set will be cropped. Measure it or don't draw it.

   Trap: hue is never the only encoding. A star carries its module number as
   a numeral, the panel names the module in words, and the filter chips are
   labelled — a learner who cannot separate the five hues loses nothing. */

(function () {
  var S = window.SKILLS;
  var sky = document.getElementById('sky');
  var panel = document.getElementById('skyPanel');
  var filters = document.getElementById('modFilters');
  if (!S || !sky || !panel) return;

  /* Ring pitch is chord-checked, not eyeballed: full's tightest ring is
     ring 0 with three stars 23° apart — an 80px chord against a 60px star;
     compact's is the same ring at 24° on r 240 — 100 against 84. Widening a
     step widens a gap everywhere; adding a ring means adding its radius AND
     its step, in both presets. numFs rides the svg as a CSS variable so the
     numeral grows with the star it sits in. */
  var PRESET = {
    full: {
      hubR: 52,                 /* the hub disc */
      ringR: [200, 330, 450],   /* row band r → ring radius */
      step: [23, 15, 13],       /* angular pitch between a module's stars at that ring */
      outerR: 520,              /* outermost decorative ring of the web */
      nodeR: 30,
      numFs: 27,
      beamEnd: 7,               /* beam half-width where it meets a star */
      beamMid: 2.2,             /* …and at its pinched middle */
      spokeEnd: 6,
      spokeMid: 2,
      plaques: true,
      stars: 150,
    },
    compact: {
      hubR: 64,
      ringR: [240, 400, 545],
      step: [24, 16.5, 14],
      outerR: 575,
      nodeR: 42,
      numFs: 36,
      beamEnd: 9,
      beamMid: 3,
      spokeEnd: 8,
      spokeMid: 2.6,
      plaques: false,
      stars: 90,
    },
  };
  var mq = window.matchMedia ? window.matchMedia('(max-width: 700px)') : null;

  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  /* Deterministic star field. Math.random() would reshuffle the sky on every
     paint of a figure that is otherwise pure data — including every
     breakpoint flip. */
  function seeded(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Angles in degrees, -90 is straight up; the hub is the origin and the
     viewBox is fitted around whatever gets drawn. */
  function polar(r, aDeg) {
    var a = (aDeg * Math.PI) / 180;
    return { x: r * Math.cos(a), y: r * Math.sin(a) };
  }

  /* The tapered beam: flared where it meets a star, pinched mid-flight —
     the waist of the reference's connectors, not a lens. Two quadratic
     flanks; a control offset of 2·midW − endW puts the curve exactly at
     midW half-width at the midpoint (a quadratic's midpoint is
     (P0 + 2C + P2) / 4), which for midW < endW/2 lands the control past
     the centreline and makes the flanks concave. Ends are flat, hidden
     under the discs.

     The centreline may itself be a curve: cx/cy is its control point
     (pass the midpoint for a straight beam). Flank offsets follow the
     local normal — end normals from the tangents at each end, the waist
     from the chord — which is what lets a cross edge bow toward the hub
     and still wear the same waisted shape as the straight beams.

     One path, two renderings: an in-module beam FILLS this outline, a
     cross edge STROKES it dashed (landing.css) — same width, same shape,
     different fact. */
  function beam(ax, ay, bx, by, cx, cy, endW, midW) {
    var nrm = function (dx, dy) { var l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
    var na = nrm(cx - ax, cy - ay);
    var nb = nrm(bx - cx, by - cy);
    var nm = nrm(bx - ax, by - ay);
    var c = 2 * midW - endW;
    return 'M ' + (ax + na[0] * endW).toFixed(1) + ' ' + (ay + na[1] * endW).toFixed(1) +
      ' Q ' + (cx + nm[0] * c).toFixed(1) + ' ' + (cy + nm[1] * c).toFixed(1) +
      ' ' + (bx + nb[0] * endW).toFixed(1) + ' ' + (by + nb[1] * endW).toFixed(1) +
      ' L ' + (bx - nb[0] * endW).toFixed(1) + ' ' + (by - nb[1] * endW).toFixed(1) +
      ' Q ' + (cx - nm[0] * c).toFixed(1) + ' ' + (cy - nm[1] * c).toFixed(1) +
      ' ' + (ax - na[0] * endW).toFixed(1) + ' ' + (ay - na[1] * endW).toFixed(1) + ' Z';
  }

  /* ---------- the data's own shape: preset-independent ---------- */

  var order = [[], [], [], [], []];
  S.nodes.forEach(function (n, i) { order[n.mod].push({ n: n, i: i }); });
  var SECTOR = 360 / order.length;
  order.forEach(function (col) {
    col.sort(function (a, b) { return a.n.r - b.n.r || a.i - b.i; });
  });

  /* One running number per skill, module by module. It is the key between the
     figure and the list under it: the figure carries the number, the list
     carries the name. That split is what lets the figure shrink to a phone. */
  var num = {};
  var seq = 0;
  order.forEach(function (col) {
    col.forEach(function (entry) { num[entry.n.id] = ++seq; });
  });

  var edgesOf = {};
  var neighbours = {};
  S.edges.forEach(function (e, idx) {
    (edgesOf[e[0]] = edgesOf[e[0]] || []).push(idx);
    (edgesOf[e[1]] = edgesOf[e[1]] || []).push(idx);
    (neighbours[e[0]] = neighbours[e[0]] || []).push(e[1]);
    (neighbours[e[1]] = neighbours[e[1]] || []).push(e[0]);
  });

  /* ---------- build: everything the preset decides ---------- */

  var placed, svg, nodeEls, edgeEls, arcEls, strandEls, spokeEls, spokeOf;

  function build() {
    var V = mq && mq.matches ? PRESET.compact : PRESET.full;

    var box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    function fit(x0, y0, x1, y1) {
      if (x0 < box.x0) box.x0 = x0;
      if (y0 < box.y0) box.y0 = y0;
      if (x1 > box.x1) box.x1 = x1;
      if (y1 > box.y1) box.y1 = y1;
    }

    /* One arm per module, fanned around the hub. Within an arm, band r sits
       on ring r, its stars spread symmetrically about the arm's centreline. */
    placed = {};
    order.forEach(function (col, mod) {
      var mid = -90 + SECTOR * mod;
      var rings = [];
      col.forEach(function (entry) { (rings[entry.n.r] = rings[entry.n.r] || []).push(entry); });
      col.mid = mid;
      col.rings = rings;
      col.maxRing = rings.length - 1;
      rings.forEach(function (row, r) {
        row.forEach(function (entry, i) {
          var a = mid + (i - (row.length - 1) / 2) * V.step[r];
          var p = polar(V.ringR[r], a);
          placed[entry.n.id] = { node: entry.n, x: p.x, y: p.y, mod: mod, row: r, a: a };
        });
      });
    });

    /* The web itself: concentric rings, a radial thread on each sector
       boundary — the emptier arcs of the circle read as woven rather than as
       missing — and a seeded star field that only night shows (landing.css):
       on paper the dots read as dirt, on the dark ground they read as sky. */
    var bg = '';
    V.ringR.concat([V.outerR]).forEach(function (r) {
      bg += '<circle class="ring" cx="0" cy="0" r="' + r + '"/>';
    });
    order.forEach(function (col) {
      var b0 = polar(V.hubR + 38, col.mid - SECTOR / 2);
      var b1 = polar(V.outerR, col.mid - SECTOR / 2);
      bg += '<line class="ray" x1="' + b0.x.toFixed(1) + '" y1="' + b0.y.toFixed(1) +
        '" x2="' + b1.x.toFixed(1) + '" y2="' + b1.y.toFixed(1) + '"/>';
    });
    var starMax = V.outerR + 20;
    var rng = seeded(27);
    for (var si = 0; si < V.stars; si++) {
      var sr = V.hubR + 40 + Math.sqrt(rng()) * (starMax - V.hubR - 40);
      var sp = polar(sr, rng() * 360);
      var tw = rng();
      bg += '<circle class="star' + (tw < 0.35 ? ' tw' : '') + '" cx="' + sp.x.toFixed(1) +
        '" cy="' + sp.y.toFixed(1) + '" r="' + (0.8 + rng() * 1.8).toFixed(2) +
        '" opacity="' + (0.25 + rng() * 0.55).toFixed(2) + '"' +
        (tw < 0.35 ? ' style="animation-delay:-' + (tw * 20).toFixed(1) + 's"' : '') + '/>';
    }
    fit(-starMax, -starMax, starMax, starMax);

    /* Strands: the stretch of ring that carries a module's stars at one band,
       in the module's hue. This is what keeps a star with no in-module feeder
       (Timeliness, Enforcement…) visibly part of its arm without drawing a
       dependency that does not exist. */
    var strandHtml = '';
    order.forEach(function (col, mod) {
      col.rings.forEach(function (row, r) {
        if (row.length < 2) return;
        var a0 = placed[row[0].n.id].a, a1 = placed[row[row.length - 1].n.id].a;
        var p0 = polar(V.ringR[r], a0), p1 = polar(V.ringR[r], a1);
        strandHtml += '<path class="strand" data-mod="' + mod + '" style="--sel:var(--mod-' + mod + ')" d="M ' +
          p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ' A ' + V.ringR[r] + ' ' + V.ringR[r] +
          ' 0 0 1 ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) + '"/>';
      });
    });

    /* Spokes: hub to each arm's ring-0 stars, tapered like the beams but a
       step quieter. Ring 0 only — a spoke reaching past ring 0 runs through
       whatever star sits on the centreline and reads as an edge that is not
       in the data. */
    var spokeHtml = '';
    order.forEach(function (col, mod) {
      (col.rings[0] || []).forEach(function (entry) {
        var p = placed[entry.n.id];
        var root = polar(V.hubR - 8, p.a);
        spokeHtml += '<path class="spoke" data-id="' + esc(entry.n.id) + '" data-mod="' + mod +
          '" style="--sel:var(--mod-' + mod + ')" d="' +
          beam(root.x, root.y, p.x, p.y, (root.x + p.x) / 2, (root.y + p.y) / 2, V.spokeEnd, V.spokeMid) + '"/>';
      });
    });

    /* Cross edges are drawn under the beams: they are the many, the beams are
       the arms. Both keep their #e<idx> ids — the focus code addresses edges
       by index, not by document order.

       A cross edge joins two hues, so its stroke is a three-stop gradient
       laid along the edge in user space: this module's colour, the other's,
       and between them their OKLCH midpoint on the shorter hue arc — sRGB
       interpolation drags a red-to-blue line through the grey middle of the
       cube, and the muddy band in the middle is exactly what a perceptual
       mix avoids. The stops are CSS colours, so the theme keeps owning them. */
    var crossHtml = '';
    var beamHtml = '';
    var gradHtml = '';
    S.edges.forEach(function (e, idx) {
      var a = placed[e[0]], b = placed[e[1]];
      if (!a || !b) return;
      if (a.mod !== b.mod) {
        /* The same waisted beam as the in-module edges — same width, same
           flare — but its centreline bows toward the hub, so the long
           crossings dive under the arms, and it is stroked dashed rather
           than filled: the dash is the "another module" fact. */
        gradHtml += '<linearGradient id="ge' + idx + '" gradientUnits="userSpaceOnUse" x1="' +
          a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '">' +
          '<stop offset="0" style="stop-color:var(--mod-' + a.mod + ')"/>' +
          '<stop offset=".5" style="stop-color:color-mix(in oklch shorter hue, var(--mod-' + a.mod + '), var(--mod-' + b.mod + '))"/>' +
          '<stop offset="1" style="stop-color:var(--mod-' + b.mod + ')"/>' +
          '</linearGradient>';
        crossHtml += '<path class="edge cross" id="e' + idx + '" style="--sel:var(--mod-' + a.mod +
          ');--grad:url(#ge' + idx + ')" d="' +
          beam(a.x, a.y, b.x, b.y, ((a.x + b.x) / 2) * 0.55, ((a.y + b.y) / 2) * 0.55, V.beamEnd, V.beamMid) + '"/>';
      } else {
        beamHtml += '<path class="edge beam" id="e' + idx + '" style="--sel:var(--mod-' + a.mod + ')" d="' +
          beam(a.x, a.y, b.x, b.y, (a.x + b.x) / 2, (a.y + b.y) / 2, V.beamEnd, V.beamMid) + '"/>';
      }
    });

    /* The hub. Pure anchor — it is not a skill and carries no hue: a flat
       pale disc, the reference's moon, hidden from the accessibility tree.
       Flat on purpose — no gradient playing at a lit sphere. */
    var hubHtml =
      '<g class="hub" aria-hidden="true">' +
      '<circle class="hub-halo" cx="0" cy="0" r="' + (V.hubR + 34) + '"/>' +
      '<circle class="hub-ring" cx="0" cy="0" r="' + (V.hubR + 14) + '"/>' +
      '<circle class="hub-disc" cx="0" cy="0" r="' + V.hubR + '"/>' +
      '</g>';

    /* The plaque: a filled pill at the tip of its arm — full preset only; the
       compact web's module names live in the chip bar and the key. Still the
       module's highlight control where it exists. One width for all five, set
       by the longest name — label-sized pills made the ring of plaques read
       ragged, and sizing from the names keeps a longer future name widening
       all five instead of clipping. */
    var arcHtml = '';
    if (V.plaques) {
      arcHtml = order.map(function (col, mod) {
        var label = S.moduleNames[mod];
        var w = Math.max.apply(null, S.moduleNames.map(function (n) { return n.length; })) * 8.9 + 56;
        var h = 36;
        /* The pill's clearance is directional: on a vertical arm only its
           height faces the stars, on a near-horizontal arm its whole width
           does — a fixed radial gap seated "Design" straight onto its last
           star. The stadium's half-extent along the arm is
           (w−h)/2·|cos| + h/2; seat the pill that far past the outermost
           ring plus a star's halo and a gap, as if a star sat on the
           centreline (odd-count rings put one there, even-count rings just
           get a hair more air). */
        var support = ((w - h) / 2) * Math.abs(Math.cos((col.mid * Math.PI) / 180)) + h / 2;
        var c = polar(V.ringR[col.maxRing] + V.nodeR + 8 + 22 + support, col.mid);
        fit(c.x - w / 2, c.y - h / 2, c.x + w / 2, c.y + h / 2);
        return '<g class="arc-label" data-mod="' + mod + '" style="--sel:var(--mod-' + mod + ');--sel-ink:var(--mod-' + mod + '-ink);--sel-text:var(--mod-' + mod + '-text)" role="button" tabindex="0"' +
          ' aria-label="Highlight module ' + mod + ', ' + esc(S.moduleNames[mod]) + '">' +
          '<rect class="plaque" x="' + (c.x - w / 2).toFixed(1) + '" y="' + (c.y - h / 2).toFixed(1) +
            '" width="' + w.toFixed(1) + '" height="' + h + '" rx="' + (h / 2) + '"/>' +
          '<text x="' + c.x.toFixed(1) + '" y="' + c.y.toFixed(1) + '">' + esc(label) + '</text></g>';
      }).join('');
    }

    var nodeHtml = S.nodes.map(function (n) {
      var p = placed[n.id];
      return '<g class="node" data-id="' + n.id + '" style="--sel:var(--mod-' + n.mod + ');--sel-ink:var(--mod-' + n.mod + '-ink);--sel-text:var(--mod-' + n.mod + '-text)" role="button" tabindex="0"' +
        ' aria-label="' + num[n.id] + '. ' + esc(n.label) + ' — module ' + n.mod + ', ' + esc(S.moduleNames[n.mod]) + '">' +
        '<title>' + esc(n.label) + '</title>' +
        '<circle class="node-halo" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (V.nodeR + 8) + '"/>' +
        '<circle class="node-core" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + V.nodeR + '"/>' +
        '<text class="node-num" x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '">' + num[n.id] + '</text></g>';
    }).join('');

    var pad = 18;
    var vb = [
      (box.x0 - pad).toFixed(0),
      (box.y0 - pad).toFixed(0),
      (box.x1 - box.x0 + pad * 2).toFixed(0),
      (box.y1 - box.y0 + pad * 2).toFixed(0),
    ].join(' ');

    sky.innerHTML =
      '<svg viewBox="' + vb + '" style="--num-fs:' + V.numFs + 'px" role="img" aria-label="Skill web: ' +
      S.nodes.length + ' skills in five module arms around one hub, joined wherever one skill feeds another.">' +
      (gradHtml ? '<defs>' + gradHtml + '</defs>' : '') +
      bg + strandHtml + crossHtml + spokeHtml + beamHtml + hubHtml + arcHtml + nodeHtml + '</svg>';

    svg = sky.querySelector('svg');
    nodeEls = {};
    svg.querySelectorAll('.node').forEach(function (g) { nodeEls[g.dataset.id] = g; });
    edgeEls = S.edges.map(function (_, i) { return svg.querySelector('#e' + i); });
    arcEls = svg.querySelectorAll('.arc-label');
    strandEls = svg.querySelectorAll('.strand');
    spokeEls = svg.querySelectorAll('.spoke');
    spokeOf = {};
    spokeEls.forEach(function (el) { spokeOf[el.dataset.id] = el; });

    /* Listeners go on the svg, so replacing it replaces them — nothing to
       unhook on a rebuild. */
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
    svg.addEventListener('click', function (e) {
      if (!activate(e.target)) { pinned = null; activeModule = null; syncFilters(); refresh(); }
    });
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
  }

  /* The key. The figure carries numbers, this carries the names — the split
     that lets the figure scale to a phone. It is also the reading order the
     figure cannot give a screen reader, and on a narrow screen it is the
     primary way in: a key row selects its star exactly as the star does.
     Built once — nothing in it depends on the preset. */
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
    keyEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-key]');
      if (!btn) return;
      pinned = pinned === btn.dataset.key ? null : btn.dataset.key;
      activeModule = null;
      syncFilters();
      refresh();
    });
  }

  /* ---------- focus + panel ---------- */

  var pinned = null;
  var hovered = null;
  var activeModule = null;

  function clearHot() {
    Object.keys(nodeEls).forEach(function (id) { nodeEls[id].classList.remove('hot'); });
    edgeEls.forEach(function (el) { if (el) el.classList.remove('hot'); });
    arcEls.forEach(function (el) { el.classList.remove('hot'); });
    strandEls.forEach(function (el) { el.classList.remove('hot'); });
    spokeEls.forEach(function (el) { el.classList.remove('hot'); });
  }

  function focusNode(id) {
    clearHot();
    sky.classList.add('focusing');
    nodeEls[id].classList.add('hot');
    (neighbours[id] || []).forEach(function (other) {
      if (nodeEls[other]) nodeEls[other].classList.add('hot');
    });
    (edgesOf[id] || []).forEach(function (i) { if (edgeEls[i]) edgeEls[i].classList.add('hot'); });
    if (spokeOf[id]) spokeOf[id].classList.add('hot');
    if (arcEls[placed[id].mod]) arcEls[placed[id].mod].classList.add('hot');
  }

  function focusModule(mod) {
    clearHot();
    sky.classList.add('focusing');
    if (arcEls[mod]) arcEls[mod].classList.add('hot');
    S.nodes.forEach(function (n) { if (n.mod === mod) nodeEls[n.id].classList.add('hot'); });
    S.edges.forEach(function (e, i) {
      if (placed[e[0]].mod === mod || placed[e[1]].mod === mod) {
        if (edgeEls[i]) edgeEls[i].classList.add('hot');
      }
    });
    strandEls.forEach(function (el) { if (Number(el.dataset.mod) === mod) el.classList.add('hot'); });
    spokeEls.forEach(function (el) { if (Number(el.dataset.mod) === mod) el.classList.add('hot'); });
  }

  /* The panel is a journal card: a filled outer frame — the selection's hue,
     the highlight OUTSIDE — with a header row on the frame (module left,
     star count right, the reference's 18/365), and a rounded inner sheet in
     the page's own background, the theme INSIDE. Unselected, the frame goes
     neutral and the header names the figure. */
  var DEFAULT_PANEL =
    '<header class="p-head"><p class="p-mod">Skill web</p>' +
    '<span class="p-count">' + S.nodes.length + ' skills</span></header>' +
    '<div class="p-body">' +
    '<p class="p-hint">Every star is a skill; a line runs from a skill to the one it feeds. ' +
    'Hover a star to light its branch, click to pin it — the numeral inside is its module.</p>' +
    '<p class="p-hint">' + S.nodes.length + ' skills, ' + S.edges.length +
    ' dependencies. A skill is fed by specific units, so it fills as you complete them rather than when you finish a module.</p>' +
    '</div>';

  function renderPanel(id) {
    if (!id) { panel.style.removeProperty('--sel'); panel.innerHTML = DEFAULT_PANEL; return; }
    var n = placed[id].node;
    panel.style.setProperty('--sel', 'var(--mod-' + n.mod + ')');
    panel.style.setProperty('--sel-ink', 'var(--mod-' + n.mod + '-ink)');
    panel.style.setProperty('--sel-text', 'var(--mod-' + n.mod + '-text)');
    /* One fact per line: the header already names the module, so the meta
       row does not say it again — it kept saying "Module 1 · Supply chain"
       twice, two lines apart. The ladder's label is the map page's own
       wording for the same list. */
    panel.innerHTML =
      '<header class="p-head">' +
      '<p class="p-mod">M' + n.mod + ' · ' + esc(S.moduleNames[n.mod]) + '</p>' +
      '<span class="p-count">' + num[id] + '/' + S.nodes.length + '</span></header>' +
      '<div class="p-body">' +
      '<h3>' + esc(n.label) + '</h3>' +
      '<p class="p-meta">rooted in ' + esc(n.unit) + '</p>' +
      '<p class="p-desc">' + esc(n.desc) + '</p>' +
      '<p class="p-sec">The ladder — what each unit adds</p>' +
      '<ul class="p-rungs">' + n.rungs.map(function (r) {
        return '<li><span class="u">' + esc(r[0]) + '</span><span class="a">' + esc(r[1]) + '</span></li>';
      }).join('') + '</ul>' +
      '</div>';
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
         scrolled. The numeral always shows, and the module's name is in the
         key below either way. */
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

  build();
  refresh();

  if (mq) {
    var onFlip = function () { hovered = null; build(); refresh(); };
    if (mq.addEventListener) mq.addEventListener('change', onFlip);
    else if (mq.addListener) mq.addListener(onFlip);
  }
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

  VT.mountChrome('/verification/landing');
  VT.mountFoot();

  /* Objectives come from the graph's own list, so the promises here cannot
     drift from the map beside them. */
  var ul = document.getElementById('objectives');
  if (ul && S) {
    ul.innerHTML = S.objectives.map(function (o, i) {
      return '<li><span class="n" aria-hidden="true">' + String(i + 1).padStart(2, '0') +
        '</span><span>' + esc(o) + '</span></li>';
    }).join('');
    // The column-fill in landing.css needs the row count; it is the list's,
    // so it is set here rather than guessed by a hardcoded CSS value.
    ul.style.setProperty('--rows', String(Math.ceil(S.objectives.length / 2)));
  }

  /* The hero's two ways in and its stat row are written in landing.html and
     stay there. They are the course's pitch, not a readout of this browser's
     progress — a returning learner picks up from the track page. */

})();
