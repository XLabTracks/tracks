/* notebook.js — the persistent notebook the course welcome promises.
   A corner button opens a panel of pages; each page holds a free mix of
   blocks: a written note, a passage captured from the course text with its
   source, or a sketch. Pages persist to localStorage and the whole book
   exports to Markdown.

   Mechanics follow the Pony Arena notebook in the design repo; the surface is
   this site's — theme.css variables only, no literal colour, so it follows
   day, night and high contrast untouched.

   Exposes window.VTNotebook = { open, close, addNote, addQuote, count } so a
   page script can push a selection straight in.

   Trap: selection capture reads the DOM at mouseup. Anything pressable is
   user-select:none here, so a stray drag over chrome yields an empty string
   rather than a quote — check for that before offering to capture, or the
   button flashes up over nothing.

   Trap: the book is one localStorage value. Write it on a debounce, never on
   every keystroke, or a long note re-serialises the whole book per character. */

"use strict";

window.VTNotebook = (function () {

  const STORE = 'xlab-verification-notebook.v1';
  const SAVE_MS = 400;

  let data = load();
  let cur = clamp(data.cur || 0);
  let saveTimer = null;
  let root = null, pagesEl = null, counterEl = null, badgeEl = null;

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

  function clamp(i) { return Math.max(0, Math.min(i, (data.pages || []).length - 1)); }
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

  function paintPage() {
    if (!pagesEl) return;
    if (written) { paintWritten(); return; }
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

    counterEl.textContent = 'Page ' + (cur + 1) + ' / ' + data.pages.length;
    paintBadge();
  }

  function build() {
    if (root) return;

    root = mk('div', 'nb-root');
    root.hidden = true;
    root.innerHTML =
      '<div class="nb-scrim" data-close></div>' +
      '<aside class="nb-panel" role="dialog" aria-modal="true" aria-label="Notebook">' +
        '<header class="nb-head">' +
          '<h2>Notebook</h2>' +
          '<button class="nb-x" type="button" data-close aria-label="Close notebook">&times;</button>' +
        '</header>' +
        '<div class="nb-pages"></div>' +
        '<footer class="nb-foot">' +
          '<div class="nb-add">' +
            '<button class="btn small outline" type="button" data-add="text">Note</button>' +
            '<button class="btn small outline" type="button" data-add="sketch">Sketch</button>' +
            '<button class="btn small outline" type="button" data-written>Written work</button>' +
          '</div>' +
          '<div class="nb-pager">' +
            '<button class="btn small outline" type="button" data-page="-1" aria-label="Previous page">&larr;</button>' +
            '<span class="nb-count"></span>' +
            '<button class="btn small outline" type="button" data-page="1" aria-label="Next page">&rarr;</button>' +
            '<button class="btn small outline" type="button" data-newpage>New page</button>' +
          '</div>' +
          '<button class="btn small" type="button" data-export>Export</button>' +
        '</footer>' +
      '</aside>';
    document.body.appendChild(root);

    pagesEl = root.querySelector('.nb-pages');
    counterEl = root.querySelector('.nb-count');

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

  function mountButton() {
    if (document.querySelector('.nb-open')) return;
    const b = mk('button', 'nb-open',
      '<span class="nb-open-label">Notebook</span><span class="nb-badge" hidden></span>');
    b.type = 'button';
    b.setAttribute('aria-label', 'Open your notebook');
    b.onclick = open;
    document.body.appendChild(b);
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

  /* ---------- capture from the page ---------- */

  /* A selection in the reading column offers to be captured. The button is
     placed in document coordinates so it survives a scroll, and it is torn
     down on the next selection change rather than left to accumulate. */
  function armCapture() {
    let btn = null;
    function drop() { if (btn) { btn.remove(); btn = null; } }

    document.addEventListener('selectionchange', function () {
      const sel = document.getSelection();
      if (!sel || sel.isCollapsed || !String(sel).trim()) drop();
    });

    document.addEventListener('mouseup', function (ev) {
      // Same trap as vocab.js: mouseup precedes click, so a press on this
      // button must not rebuild it out from under its own click handler.
      if (ev.target && ev.target.closest && ev.target.closest('.nb-capture')) return;
      setTimeout(function () {
        const sel = document.getSelection();
        const text = sel ? String(sel).trim() : '';
        drop();
        /* Long selections only. vocab.js takes 5 words or fewer as a term to
           look up, and the two buttons must never both appear over the same
           selection — this bound and its SHORT_WORDS are one decision. */
        if (!text || text.split(/\s+/).length <= 5) return;
        const host = sel.anchorNode && sel.anchorNode.parentElement;
        if (!host || !host.closest('main')) return;

        const r = sel.getRangeAt(0).getBoundingClientRect();
        btn = mk('button', 'nb-capture', 'Add to notebook');
        btn.type = 'button';
        btn.style.top = (r.bottom + window.scrollY + 8) + 'px';
        btn.style.left = (r.left + window.scrollX) + 'px';
        btn.onclick = function () {
          addQuote(text, document.title.split('·')[0].trim(), location.href);
          drop();
          if (sel.removeAllRanges) sel.removeAllRanges();
        };
        document.body.appendChild(btn);
      }, 0);
    });
  }

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
    document.addEventListener('DOMContentLoaded', function () { mountButton(); armCapture(); });
  } else {
    mountButton();
    armCapture();
  }

  return {
    open: open,
    close: close,
    addNote: addNote,
    addQuote: addQuote,
    addTerm: addTerm,
    count: count,
    toMarkdown: toMarkdown
  };
})();
