/* notebook.js — the persistent notebook the course welcome promises.
   A corner button opens a panel of pages; each page holds a free mix of
   blocks: a written note, a passage captured from the course text with its
   source, or a sketch. Pages persist to localStorage and the whole book
   exports to Markdown. The page number in the counter is editable: type a
   number and the book opens there.

   Mechanics follow the Pony Arena notebook in the design repo; the surface is
   this site's — theme.css variables only, no literal colour, so it follows
   day and night untouched.

   Exposes window.VTNotebook = { open, close, addNote, addQuote, count } so a
   page script can push a selection straight in.

   Three views under one header — Notes, Skill Map, Memo Desk — switched by
   the tabs beside the title and never by leaving the page: the map and the
   desk are the two learner surfaces that are not lessons, and the book is
   where they live. The Skill Map view is the bars — one row per skill,
   opening to the skill's description and ladder — and no figure: the web
   is the map page's, and drawing it again in a 560px column was the same
   thing twice. The desk is memo-desk.js's own. Both load their files on
   first use through the registry LegacyScripts keeps (window.__vtScripts),
   so a file either side has run never runs twice. The views are built once
   and hidden, never rebuilt: the desk holds a draft's field state and
   listeners.

   The panel is resizable from its left edge — a drag, or arrow keys on the
   handle — and the width is a device preference (vt-notebook-width), not
   learner work, so it stays out of the account sync and survives sign-out.

   Capturing a selection is the selection toolbar's job (SelectionActions),
   which calls addQuote. Anything pressable on this site is user-select:none,
   so a stray drag over chrome yields an empty string rather than a quote —
   which is what stops the toolbar flashing up over nothing.

   Trap: the book is one localStorage value. Write it on a debounce, never on
   every keystroke, or a long note re-serialises the whole book per character. */

"use strict";

window.VTNotebook = (function () {

  const STORE = 'xlab-verification-notebook.v1';
  const SAVE_MS = 400;

  let data = load();
  let cur = clamp(data.cur || 0);
  let saveTimer = null;
  let root = null, panelEl = null, pagesEl = null, counterEl = null, badgeEl = null, gotoEl = null;
  let footEl = null, tabsEl = null;
  let view = 'notes';
  const views = {};
  let desk = null;

  const WIDTH_KEY = 'vt-notebook-width';
  const WIDTH_DEFAULT = 560;
  const WIDTH_MIN = 360;
  const WIDTH_EDGE = 48;
  const WIDTH_NARROW = 600;

  /* ---------- store ---------- */

  function newPage() { return { title: '', blocks: [] }; }

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (raw && Array.isArray(raw.pages) && raw.pages.length) return raw;
    } catch (e) { /* fall through to a fresh book */ }
    return { pages: [newPage()], cur: 0 };
  }

  function save() {
    data.cur = cur;
    data.updatedAt = Date.now();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(STORE, JSON.stringify(data)); }
      catch (e) { /* quota or private mode — the book stays in memory */ }
    }, SAVE_MS);
    paintBadge();
  }

  function pageCount() { return (data.pages || []).length; }
  function clamp(i) { return Math.max(0, Math.min(i, pageCount() - 1)); }
  function page() { return data.pages[cur]; }
  function count() {
    return data.pages.reduce(function (n, p) { return n + p.blocks.length; }, 0);
  }

  /* ---------- helpers ---------- */

  const esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  function mk(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* True while the document is showing a page outside the course. This
     script outlives the course chrome across the app's client-side
     navigations, so the chrome marks <html> with vt-off-course on the way
     out and the tools stand down: notebook.css hides them, and the handlers
     below check here before offering anything. Absent by default, so pages
     that never carry the app chrome (the static lift) are always on. */
  function offCourse() {
    return document.documentElement.classList.contains('vt-off-course');
  }

  /* ---------- blocks ---------- */

  function pushBlock(block) {
    page().blocks.push(block);
    save();
    if (root) paintPage();
    return block;
  }

  function blockEl(block, i) {
    const wrap = mk('div', 'nb-block nb-' + block.type);

    const bar = mk('div', 'nb-block-bar');
    bar.appendChild(mk('span', 'nb-block-kind', esc(
      block.type === 'quote' ? 'captured'
        : block.type === 'sketch' ? 'sketch'
        : block.type === 'term' ? 'term'
        : block.type === 'memo' ? 'memo — lives on the desk'
        : 'note'
    )));
    const del = mk('button', 'nb-x', '&times;');
    del.type = 'button';
    del.setAttribute('aria-label', 'Delete this block');
    del.onclick = function () {
      page().blocks.splice(i, 1);
      save();
      paintPage();
    };
    bar.appendChild(del);
    wrap.appendChild(bar);

    if (block.type === 'quote') {
      wrap.appendChild(mk('blockquote', 'nb-quote', esc(block.text)));
      if (block.source) {
        const cite = mk('p', 'nb-source');
        cite.appendChild(document.createTextNode('— '));
        if (block.href) {
          const a = mk('a', null, esc(block.source));
          a.href = block.href;
          cite.appendChild(a);
        } else {
          cite.appendChild(document.createTextNode(block.source));
        }
        wrap.appendChild(cite);
      }
      const ta = mk('textarea', 'nb-note-on-quote');
      ta.placeholder = 'What do you make of it?';
      ta.value = block.note || '';
      ta.rows = 2;
      ta.oninput = function () { block.note = ta.value; save(); };
      wrap.appendChild(ta);
      return wrap;
    }

    if (block.type === 'term') {
      wrap.appendChild(mk('p', 'nb-term-word', esc(block.term)));
      if (block.definition) {
        wrap.appendChild(mk('p', 'nb-term-def', esc(block.definition)));
      }
      if (block.source) {
        const cite = mk('p', 'nb-source');
        cite.appendChild(document.createTextNode('— '));
        if (block.url) {
          const a = mk('a', null, esc(block.source));
          a.href = block.url;
          a.target = '_blank';
          a.rel = 'noopener';
          cite.appendChild(a);
        } else {
          cite.appendChild(document.createTextNode(block.source));
        }
        wrap.appendChild(cite);
      }
      const ta = mk('textarea', 'nb-note-on-quote');
      ta.placeholder = block.definition ? 'In your own words…'
        : 'No definition was found — write one when you have it.';
      ta.value = block.note || '';
      ta.rows = 2;
      ta.oninput = function () { block.note = ta.value; save(); };
      wrap.appendChild(ta);
      return wrap;
    }

    /* A live view on the memo desk's draft, never a copy of it. The block
       carries only the slot id; the text is read and written through
       VTMemoStore, so the desk and this show one document.

       Trap: deleting this block deletes the view. The draft survives, which is
       why the kind label says where it really lives. */
    if (block.type === 'memo') {
      const store = window.VTMemoStore;
      const head = mk('p', 'nb-memo-head', esc(store ? store.label(block.slot) : block.slot));
      wrap.appendChild(head);
      const unit = store && store.unit(block.slot);
      if (unit) wrap.appendChild(mk('p', 'nb-source', esc('Unit ' + unit)));

      if (!store) {
        wrap.appendChild(mk('p', 'nb-source', 'The Memo Desk is not loaded on this page.'));
        return wrap;
      }

      const ta = mk('textarea', 'nb-text');
      ta.placeholder = 'Draft it here or on the Memo Desk — it is the same document.';
      ta.value = (store.read(block.slot) || {}).body || '';
      ta.rows = 6;
      ta.oninput = function () {
        store.write(block.slot, { body: ta.value });
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
      };
      wrap.appendChild(ta);

      const link = mk('button', 'nb-memo-link', 'Open on the Memo Desk &rarr;');
      link.type = 'button';
      link.onclick = function () { showView('desk', block.slot); };
      wrap.appendChild(link);

      /* The desk writes the same slot. Repaint unless this textarea is the
         one being typed into, or the caret jumps to the end mid-word. */
      store.onChange(function (slotId) {
        if (slotId !== block.slot || document.activeElement === ta) return;
        ta.value = (store.read(block.slot) || {}).body || '';
      });

      requestAnimationFrame(function () {
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
      });
      return wrap;
    }

    if (block.type === 'sketch') {
      wrap.appendChild(sketchEl(block));
      return wrap;
    }

    const ta = mk('textarea', 'nb-text');
    ta.placeholder = 'Thoughts, critiques, ambiguities, surprises, connections…';
    ta.value = block.text || '';
    ta.rows = 4;
    ta.oninput = function () {
      block.text = ta.value;
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
      save();
    };
    wrap.appendChild(ta);
    /* Height is set after the node is in the document — scrollHeight is 0
       while it is detached, so sizing here would collapse every note to one
       row on reopen. */
    requestAnimationFrame(function () {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    });
    return wrap;
  }

  /* A sketch is stored as a dataURL. The canvas is sized in CSS pixels and
     scaled by devicePixelRatio, or strokes land blurry on a retina screen. */
  function sketchEl(block) {
    const holder = mk('div', 'nb-sketch');
    const canvas = document.createElement('canvas');
    const W = 560, H = 260;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = '100%';
    canvas.style.aspectRatio = W + ' / ' + H;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function ink() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--foreground').trim() || '#000';
    }
    ctx.strokeStyle = ink();

    if (block.src) {
      const img = new Image();
      img.onload = function () { ctx.drawImage(img, 0, 0, W, H); };
      img.src = block.src;
    }

    let drawing = false;
    function pos(e) {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: (p.clientX - r.left) * (W / r.width), y: (p.clientY - r.top) * (H / r.height) };
    }
    function start(e) {
      drawing = true;
      ctx.strokeStyle = ink();
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      e.preventDefault();
    }
    function move(e) {
      if (!drawing) return;
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      e.preventDefault();
    }
    function end() {
      if (!drawing) return;
      drawing = false;
      block.src = canvas.toDataURL('image/png');
      save();
    }
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);

    holder.appendChild(canvas);
    const clear = mk('button', 'btn small outline nb-clear', 'Clear');
    clear.type = 'button';
    clear.onclick = function () {
      ctx.clearRect(0, 0, W, H);
      block.src = '';
      save();
    };
    holder.appendChild(clear);
    return holder;
  }

  /* ---------- export ---------- */

  function toMarkdown() {
    const out = ['# Verification notebook', ''];
    data.pages.forEach(function (p, i) {
      out.push('## ' + (p.title ? p.title : 'Page ' + (i + 1)), '');
      p.blocks.forEach(function (b) {
        if (b.type === 'quote') {
          String(b.text || '').split('\n').forEach(function (l) { out.push('> ' + l); });
          if (b.source) out.push('>', '> — ' + b.source + (b.href ? ' (' + b.href + ')' : ''));
          if (b.note) out.push('', b.note);
        } else if (b.type === 'term') {
          out.push('**' + (b.term || '') + '** — ' + (b.definition || '_no definition found_'));
          if (b.source) out.push('', '_' + b.source + (b.url ? ': ' + b.url : '') + '_');
          if (b.note) out.push('', b.note);
        } else if (b.type === 'sketch') {
          out.push('*(sketch — open the notebook to see it)*');
        } else if (b.text) {
          out.push(b.text);
        }
        out.push('');
      });
    });
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  function download() {
    const blob = new Blob([toMarkdown()], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'verification-notebook.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- chrome ---------- */

  function paintBadge() {
    if (!badgeEl) return;
    const n = count();
    badgeEl.textContent = n ? String(n) : '';
    badgeEl.hidden = !n;
  }

  /* ---------- page jump ---------- */

  /* The page number in the counter is an input: type a number, press Enter
     or leave the field, and the book opens there. Anything unreadable as a
     page reverts to where you are — a typo never navigates. */

  function commitGoto() {
    const n = parseInt(gotoEl.value, 10);
    if (!isNaN(n) && clamp(n - 1) === n - 1 && n - 1 !== cur) {
      cur = n - 1;
      save();
      paintPage();
    } else {
      gotoEl.value = String(cur + 1);
    }
  }

  /* The learner's task answers, shown beside their notes and never copied
     into the book. Their home is the Submission row the lesson editor writes;
     a second copy here would be a second truth that could disagree with it.
     Signed out the route says so and this says so back. */
  let written = null;

  function showWritten() {
    written = { loading: true, items: [] };
    paintPage();
    fetch('/api/verification/writing', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.status === 401 ? { signedIn: false, items: [] } : r.json(); })
      .then(function (res) { written = { loading: false, signedIn: !!res.signedIn, items: res.items || [] }; paintPage(); })
      .catch(function () { written = { loading: false, error: true, items: [] }; paintPage(); });
  }

  function paintWritten() {
    pagesEl.innerHTML = '';
    const head = mk('div', 'nb-written-head');
    head.appendChild(mk('h3', null, 'Written work'));
    const back = mk('button', 'btn small outline', 'Back to notes');
    back.type = 'button';
    back.onclick = function () { written = null; paintPage(); };
    head.appendChild(back);
    pagesEl.appendChild(head);

    if (written.loading) { pagesEl.appendChild(mk('p', 'nb-empty', 'Loading…')); return; }
    if (written.error) {
      pagesEl.appendChild(mk('p', 'nb-empty', 'Could not reach your answers just now.'));
      return;
    }
    if (!written.signedIn) {
      pagesEl.appendChild(mk('p', 'nb-empty',
        'Task answers are saved to your account. <a href="/login">Sign in</a> to see them here.'));
      return;
    }
    if (!written.items.length) {
      pagesEl.appendChild(mk('p', 'nb-empty',
        'Nothing written yet. Answers you save on a task appear here.'));
      return;
    }
    written.items.forEach(function (it) {
      const b = mk('div', 'nb-block nb-written');
      const bar = mk('div', 'nb-block-bar');
      bar.appendChild(mk('span', 'nb-block-kind', esc(it.status === 'draft' ? 'draft' : it.status)));
      b.appendChild(bar);
      b.appendChild(mk('p', 'nb-term-word', esc(it.title)));
      b.appendChild(mk('p', 'nb-written-text', esc(it.text)));
      pagesEl.appendChild(b);
    });
  }

  /* ---------- views ---------- */

  /* The files a view draws with, in the order they read each other. Loaded
     through the registry LegacyScripts shares on window, so a page that has
     already run them (the map page, the desk page) costs the view nothing,
     and a view loading them first spares that page the same. Scripts and
     stylesheets alike; a sheet is loaded once by href. */
  function registry() {
    const w = window;
    if (!w.__vtScripts) w.__vtScripts = { loaded: new Set(), loading: new Map() };
    return w.__vtScripts;
  }

  function loadScript(url) {
    const reg = registry();
    if (reg.loaded.has(url)) return Promise.resolve();
    if (reg.loading.has(url)) return reg.loading.get(url);
    const p = new Promise(function (resolve) {
      const tag = document.createElement('script');
      tag.src = url;
      tag.async = false;
      tag.onload = function () { reg.loaded.add(url); reg.loading.delete(url); resolve(); };
      tag.onerror = function () { reg.loading.delete(url); resolve(); };
      document.body.appendChild(tag);
    });
    reg.loading.set(url, p);
    return p;
  }

  function loadSheet(href) {
    if (document.querySelector('link[rel="stylesheet"][href="' + href + '"]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  function loadAll(files, sheets) {
    (sheets || []).forEach(function (f) { loadSheet('/verification/' + f); });
    return files.reduce(function (p, f) {
      return p.then(function () { return loadScript('/verification/' + f); });
    }, Promise.resolve());
  }

  const MAP_FILES = ['data/course.js', 'data/skills.js', 'data/chrome.js', 'platform.js', 'map.js'];
  const DESK_FILES = ['data/course.js', 'data/skills.js', 'data/memos.js', 'data/chrome.js', 'platform.js', 'memo-store.js', 'memo-desk.js'];
  const DESK_SHEETS = ['memo-desk.css', 'exercise.css'];

  function viewEl(name) {
    if (views[name]) return views[name];
    const el = mk('div', 'nb-view nb-view-' + name);
    el.hidden = true;
    root.querySelector('.nb-pages').appendChild(el);
    views[name] = el;
    return el;
  }

  /* Progress by skill: one row per skill, grouped by module, the module hue
     on the bar and on the module's name, the fraction and the state word
     beside it — hue never stands alone. Derived from VT.skillProgress, the
     same arithmetic the map page's rings use, never a second copy of it.
     A row is a disclosure: open, it shows the skill's description — the
     owner's learner goals and the ladder of units that fill it, the same
     ladder row the map page's panel prints (VTSkillMap.rung).

     Repainted whenever progress moves, so the open rows are remembered
     across the repaint or a Mark complete would fold what was being read. */
  function paintBars(host) {
    const el = host.querySelector('.nb-skills');
    const S = window.SKILLS;
    if (!el || !S || !window.VT || !window.VTSkillMap) return;
    const open = {};
    el.querySelectorAll('details[open]').forEach(function (d) { open[d.dataset.skill] = true; });
    el.innerHTML = '';
    const prog = S.nodes.map(function (n) { return { node: n, p: VT.skillProgress(n) }; });
    const full = prog.filter(function (x) { return x.p.frac >= 1; }).length;
    el.appendChild(mk('p', 'nb-skill-sum', full + ' of ' + prog.length + ' skills complete'));
    S.moduleNames.forEach(function (name, m) {
      const rows = prog.filter(function (x) { return x.node.mod === m; });
      if (!rows.length) return;
      const sec = mk('section', 'nb-skill-mod');
      sec.style.setProperty('--mod', 'var(--mod-' + m + ')');
      sec.style.setProperty('--mod-text', 'var(--mod-' + m + '-text)');
      sec.appendChild(mk('p', 'nb-skill-modname', '<b>M' + m + '</b>' + esc(name)));
      rows.forEach(function (x) {
        const n = x.node;
        const row = mk('details', 'nb-skill');
        row.dataset.skill = n.id;
        if (open[n.id]) row.open = true;
        const head = mk('summary', 'nb-skill-row');
        head.appendChild(mk('span', 'nb-skill-name',
          (n.opt ? '<span class="optional-prefix">Optional:</span> ' : '') + esc(n.label)));
        const bar = mk('span', 'nb-skill-bar');
        const fill = mk('i');
        fill.style.width = Math.round(x.p.frac * 100) + '%';
        bar.appendChild(fill);
        head.appendChild(bar);
        head.appendChild(mk('span', 'nb-skill-frac',
          VT.fracText(x.p) + ' &middot; ' + x.p.state));
        row.appendChild(head);
        row.appendChild(mk('div', 'nb-skill-body',
          '<p class="nb-source">rooted in ' + esc(n.unit) + '</p>' +
          '<ul class="nb-skill-goals">' + n.goals.map(function (g) {
            return '<li' + (g[0] ? ' class="sub"' : '') + '>' + VT.fmt(g[1]) + '</li>';
          }).join('') + '</ul>' +
          '<p class="nb-skill-sec">The ladder — what each unit adds</p>' +
          '<ul class="nb-skill-rungs">' + n.rungs.map(VTSkillMap.rung).join('') + '</ul>'));
        sec.appendChild(row);
      });
      el.appendChild(sec);
    });
  }

  /* Built once; repainted on every return, because progress moves while
     the book is closed (Mark complete) and the bars must say so when it
     opens. */
  function mountMap() {
    const host = viewEl('map');
    if (host.dataset.ready) { paintBars(host); return; }
    if (host.dataset.loading) return;
    host.dataset.loading = '1';
    host.innerHTML = '<p class="nb-empty">Loading your progress…</p>';
    loadAll(MAP_FILES).then(function () {
      if (!window.SKILLS || !window.VT || !window.VTSkillMap) {
        host.innerHTML = '<p class="nb-empty">Your progress did not load. <a href="/verification/map">Open the Skill Map page</a>.</p>';
        return;
      }
      host.innerHTML =
        '<p class="nb-view-lead">One row per skill. Open a row for what the skill lets you do and ' +
        'which unit fills each rung; the bar fills as you complete those units. ' +
        'The figure is on the <a href="/verification/map">Skill Map page</a>.</p>' +
        '<div class="nb-skills"></div>';
      host.dataset.ready = '1';
      paintBars(host);
      if (VT.onChange) VT.onChange(function () { paintBars(host); });
    });
  }

  /* One desk for the life of the page: memo-desk.js registers its store
     listeners at mount, and a draft's fields hold state a rebuild would
     drop. It never owns the location hash from inside the book — the desk
     page does, and two owners would fight over the URL. */
  function mountDesk(slot) {
    const host = viewEl('desk');
    if (desk) { if (slot) desk.select(slot); return; }
    if (host.dataset.loading) { if (slot) host.dataset.slot = slot; return; }
    host.dataset.loading = '1';
    if (slot) host.dataset.slot = slot;
    host.innerHTML = '<p class="nb-empty">Loading the memo desk…</p>';
    loadAll(DESK_FILES, DESK_SHEETS).then(function () {
      host.innerHTML =
        '<p class="nb-view-lead">Every written output the track asks for, drafted here and kept ' +
        'with your account. <a href="/verification/memo-desk">Full-width edition</a>.</p>';
      const deskHost = mk('div');
      host.appendChild(deskHost);
      desk = window.VTMemoDesk ? window.VTMemoDesk.mount(deskHost, { hash: false }) : null;
      if (!desk) {
        host.innerHTML = '<p class="nb-empty">The memo desk did not load. <a href="/verification/memo-desk">Open it as a page</a>.</p>';
        return;
      }
      if (host.dataset.slot) desk.select(host.dataset.slot);
    });
  }

  function showView(name, slot) {
    build();
    view = name;
    if (name === 'map') mountMap();
    if (name === 'desk') mountDesk(slot);
    paintPage();
  }

  function paintTabs() {
    tabsEl.querySelectorAll('[data-view]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view));
    });
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== view; });
    pagesEl.hidden = view !== 'notes';
    footEl.hidden = view !== 'notes';
  }

  function paintPage() {
    if (!pagesEl) return;
    paintTabs();
    if (view !== 'notes') return;
    if (written) { paintWritten(); return; }
    {
      pagesEl.innerHTML = '';
      const p = page();

      const title = mk('input', 'nb-title');
      title.type = 'text';
      title.placeholder = 'Page ' + (cur + 1);
      title.value = p.title || '';
      title.oninput = function () { p.title = title.value; save(); };
      pagesEl.appendChild(title);

      if (!p.blocks.length) {
        pagesEl.appendChild(mk('p', 'nb-empty',
          'Nothing on this page yet. Add a note, or select any passage in the ' +
          'course text and choose <b>Add to notebook</b>.'));
      }
      p.blocks.forEach(function (b, i) { pagesEl.appendChild(blockEl(b, i)); });
    }

    // Never clobber a number mid-edit — the commit on blur repaints anyway.
    if (document.activeElement !== gotoEl) gotoEl.value = String(cur + 1);
    counterEl.querySelector('[data-total]').textContent = String(pageCount());
    paintBadge();
  }

  function build() {
    if (root) return;

    root = mk('div', 'nb-root');
    root.hidden = true;
    root.innerHTML =
      '<div class="nb-scrim" data-close></div>' +
      '<aside class="nb-panel" role="dialog" aria-modal="true" aria-label="Notebook">' +
        '<div class="nb-resize" role="separator" aria-orientation="vertical" tabindex="0" ' +
          'aria-label="Resize notebook — drag, or use the arrow keys" title="Drag to resize"></div>' +
        '<header class="nb-head">' +
          '<h2>Notebook</h2>' +
          /* The course's two learner surfaces that are not lessons, in the
             book's own chrome: the map of what the reading has filled and
             the desk that indexes the writing. Views inside the book, so
             opening one never leaves the page being read. */
          '<nav class="nb-tools" aria-label="Notebook views">' +
            '<button class="btn small outline" type="button" data-view="notes" aria-pressed="true">Notes</button>' +
            '<button class="btn small outline" type="button" data-view="map" aria-pressed="false">Skill Map</button>' +
            '<button class="btn small outline" type="button" data-view="desk" aria-pressed="false">Memo Desk</button>' +
          '</nav>' +
          '<button class="nb-x" type="button" data-close aria-label="Close notebook">&times;</button>' +
        '</header>' +
        '<div class="nb-pages"><div class="nb-notes"></div></div>' +
        '<footer class="nb-foot">' +
          '<div class="nb-add">' +
            '<button class="btn small outline" type="button" data-add="text">Note</button>' +
            '<button class="btn small outline" type="button" data-add="sketch">Sketch</button>' +
            '<button class="btn small outline" type="button" data-written>Written work</button>' +
          '</div>' +
          '<div class="nb-pager">' +
            '<button class="btn small outline" type="button" data-page="-1" aria-label="Previous page">&larr;</button>' +
            '<span class="nb-count">Page <input class="nb-goto" type="text" inputmode="numeric" aria-label="Page number — type one to jump"> / <span data-total></span></span>' +
            '<button class="btn small outline" type="button" data-page="1" aria-label="Next page">&rarr;</button>' +
            '<button class="btn small outline" type="button" data-newpage>New page</button>' +
          '</div>' +
          '<button class="btn small" type="button" data-export>Export</button>' +
        '</footer>' +
      '</aside>';
    document.body.appendChild(root);

    panelEl = root.querySelector('.nb-panel');
    pagesEl = root.querySelector('.nb-notes');
    footEl = root.querySelector('.nb-foot');
    tabsEl = root.querySelector('.nb-tools');
    counterEl = root.querySelector('.nb-count');
    gotoEl = root.querySelector('.nb-goto');

    tabsEl.addEventListener('click', function (e) {
      const b = e.target.closest('[data-view]');
      if (b) showView(b.getAttribute('data-view'));
    });

    mountResize(root.querySelector('.nb-resize'));

    gotoEl.addEventListener('focus', function () { gotoEl.select(); });
    gotoEl.addEventListener('blur', commitGoto);
    gotoEl.addEventListener('keydown', function (e) {
      // Both keys stop here: Enter must not submit anything above, and
      // Escape cancels the edit without closing the notebook under it.
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); gotoEl.blur(); }
      if (e.key === 'Escape') {
        e.stopPropagation();
        gotoEl.value = String(cur + 1);
        gotoEl.blur();
      }
    });

    root.addEventListener('click', function (e) {
      const t = e.target.closest('[data-close],[data-add],[data-page],[data-newpage],[data-export],[data-written]');
      if (!t) return;
      if (t.hasAttribute('data-close')) return close();
      if (t.hasAttribute('data-export')) return download();
      if (t.hasAttribute('data-written')) return showWritten();
      if (t.hasAttribute('data-newpage')) {
        data.pages.push(newPage());
        cur = data.pages.length - 1;
        save();
        return paintPage();
      }
      if (t.hasAttribute('data-page')) {
        cur = clamp(cur + Number(t.getAttribute('data-page')));
        save();
        return paintPage();
      }
      const kind = t.getAttribute('data-add');
      pushBlock(kind === 'sketch' ? { type: 'sketch', src: '' } : { type: 'text', text: '' });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !root.hidden) close();
    });
  }

  /* ---------- resize ---------- */

  /* The panel is docked right, so its left edge is the handle: drag it, or
     focus it and press the arrows (left widens, right narrows; Home is the
     default). The width is clamped to leave the page's edge visible, and a
     phone, where the panel is the screen, has no handle (notebook.css).

     Trap: the drag must capture the pointer. The handle is 12px wide and a
     fast drag leaves it in one frame; without capture the move events go
     to the page, and the panel stops following the hand. */
  function readWidth() {
    try {
      const n = parseInt(localStorage.getItem(WIDTH_KEY), 10);
      return isNaN(n) ? WIDTH_DEFAULT : n;
    } catch (e) { return WIDTH_DEFAULT; }
  }

  function clampWidth(w) {
    const max = Math.max(WIDTH_MIN, window.innerWidth - WIDTH_EDGE);
    return Math.round(Math.max(WIDTH_MIN, Math.min(w, max)));
  }

  /* Paints the width the learner wants, clamped to the screen this is —
     the wanted width itself is never narrowed by a small screen, so a
     phone shows the stored 900 as the whole screen and the next monitor
     gets the 900 back. Under the breakpoint that hides the handle the
     panel is the screen, and the variable comes off. */
  function applyWidth(w, handle) {
    const px = clampWidth(w);
    if (window.innerWidth <= WIDTH_NARROW) panelEl.style.removeProperty('--nb-w');
    else panelEl.style.setProperty('--nb-w', px + 'px');
    handle.setAttribute('aria-valuenow', String(px));
    handle.setAttribute('aria-valuemin', String(WIDTH_MIN));
    handle.setAttribute('aria-valuemax', String(clampWidth(Infinity)));
  }

  function mountResize(handle) {
    let width = readWidth();
    applyWidth(width, handle);

    function commit(w) {
      width = clampWidth(w);
      applyWidth(width, handle);
      try {
        if (width === WIDTH_DEFAULT) localStorage.removeItem(WIDTH_KEY);
        else localStorage.setItem(WIDTH_KEY, String(width));
      } catch (e) { /* private mode — the width holds for this page */ }
    }

    handle.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      panelEl.classList.add('nb-resizing');
      const move = function (ev) {
        width = clampWidth(window.innerWidth - ev.clientX);
        applyWidth(width, handle);
      };
      const up = function () {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
        panelEl.classList.remove('nb-resizing');
        commit(width);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });

    handle.addEventListener('dblclick', function () { commit(WIDTH_DEFAULT); });

    handle.addEventListener('keydown', function (e) {
      const step = e.shiftKey ? 80 : 24;
      if (e.key === 'ArrowLeft') commit(width + step);
      else if (e.key === 'ArrowRight') commit(width - step);
      else if (e.key === 'Home') commit(WIDTH_DEFAULT);
      else if (e.key === 'End') commit(Infinity);
      else return;
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('resize', function () { applyWidth(width, handle); });
  }

  function mountButton() {
    if (document.querySelector('.nb-open')) return;
    const b = mk('button', 'nb-open',
      '<svg class="nb-open-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 3.5h9a2 2 0 0 1 2 2v15h-11a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"/><path d="M8.5 3.5v17M11.5 8h3.5M11.5 12h3.5"/></svg><span class="nb-open-label">Notebook</span><span class="nb-badge" hidden></span>');
    b.type = 'button';
    b.setAttribute('aria-label', 'Open your notebook');
    b.onclick = open;
    /* App lessons reserve a header slot. The static lift has no React chrome,
       so the same control keeps its fixed-corner fallback there. */
    const host = document.getElementById('verification-notebook-launcher');
    (host || document.body).appendChild(b);
    badgeEl = b.querySelector('.nb-badge');
    paintBadge();
  }

  function open() {
    build();
    root.hidden = false;
    document.documentElement.classList.add('nb-lock');
    paintPage();
  }

  function close() {
    if (!root) return;
    root.hidden = true;
    document.documentElement.classList.remove('nb-lock');
  }

  /* Capturing a passage from the page is the selection toolbar's job
     (SelectionActions): it calls addQuote below. This file used to raise its
     own button off its own mouseup listener, alongside two other scripts
     doing the same — which is why the three had to be placed at different
     heights to avoid stacking, and why a touch or keyboard selection was
     offered nothing at all. */

  /* ---------- public ---------- */

  function addNote(text) {
    build();
    return pushBlock({ type: 'text', text: String(text == null ? '' : text) });
  }

  /* Terms go on their own page, created once and reused, so the cheatsheet is
     a place rather than whatever page happened to be open. */
  function addTerm(term, definition, url, source) {
    build();
    let i = data.pages.findIndex(function (p) { return p.title === 'Cheatsheet'; });
    if (i < 0) {
      data.pages.push({ title: 'Cheatsheet', blocks: [] });
      i = data.pages.length - 1;
    }
    cur = i;
    const block = {
      type: 'term',
      term: String(term == null ? '' : term),
      definition: String(definition || ''),
      url: String(url || ''),
      source: String(source || ''),
      note: ''
    };
    return pushBlock(block);
  }

  /* One page per memo slot, created once and reused — so a written output has
     a place in the book rather than landing wherever was open. Returns the
     page index; opening it is the caller's choice. */
  function bindMemo(slotId) {
    build();
    const store = window.VTMemoStore;
    const title = store ? store.label(slotId) : slotId;
    let i = data.pages.findIndex(function (p) {
      return (p.blocks || []).some(function (b) { return b.type === 'memo' && b.slot === slotId; });
    });
    if (i < 0) {
      data.pages.push({ title: title, blocks: [{ type: 'memo', slot: slotId }] });
      i = data.pages.length - 1;
      save();
    }
    return i;
  }

  function openMemo(slotId) {
    cur = bindMemo(slotId);
    save();
    view = 'notes';
    open();
  }

  /* The desk, inside the book, on one slot — what a lesson's memo card can
     call instead of leaving the page. */
  function openDesk(slotId) {
    open();
    showView('desk', slotId);
  }

  function openMap() {
    open();
    showView('map');
  }

  function addQuote(text, source, href) {
    build();
    return pushBlock({
      type: 'quote',
      text: String(text == null ? '' : text),
      source: source || '',
      href: href || '',
      note: ''
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountButton);
  } else {
    mountButton();
  }

  return {
    open: open,
    close: close,
    addNote: addNote,
    addQuote: addQuote,
    addTerm: addTerm,
    bindMemo: bindMemo,
    mount: mountButton,
    openMemo: openMemo,
    openDesk: openDesk,
    openMap: openMap,
    count: count,
    toMarkdown: toMarkdown
  };
})();
