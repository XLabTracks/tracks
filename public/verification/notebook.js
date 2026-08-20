/* notebook.js — the persistent notebook the course welcome promises.
   A corner button opens a panel of pages; each page holds a free mix of
   blocks: a written note, a passage captured from the course text with its
   source, or a sketch. Pages persist to localStorage and the whole book
   exports to Markdown. The page number in the counter is editable: type a
   number and the book opens there.

   The last page is always the skill map — a read-only ladder derived from
   window.SKILLS and vt-progress at paint time. It is never stored: it sits
   past the end of data.pages, so the saved book and the account sync carry
   only the learner's own pages. The chrome loads this file on the app's
   course routes too, where neither data/skills.js nor platform.js is present,
   so the skill page fetches the data file itself and does its own rung
   arithmetic — keep that arithmetic in step with VT.rungFill/skillProgress.

   Mechanics follow the Pony Arena notebook in the design repo; the surface is
   this site's — theme.css variables only, no literal colour, so it follows
   day, night and high contrast untouched.

   Exposes window.VTNotebook = { open, close, addNote, addQuote, count } so a
   page script can push a selection straight in.

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
  let root = null, pagesEl = null, counterEl = null, badgeEl = null, gotoEl = null;

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

  /* One index past the stored pages is the skill-map page, so it is a valid
     position for `cur` but never a slot in data.pages. */
  function pageCount() { return (data.pages || []).length + 1; }
  function onSkillPage() { return cur === (data.pages || []).length; }
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
    // The skill page takes no blocks; a capture made while it is open lands
    // on the learner's last real page instead of being dropped.
    if (onSkillPage()) cur = data.pages.length - 1;
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
        wrap.appendChild(mk('p', 'nb-source', 'The memo desk is not loaded on this page.'));
        return wrap;
      }

      const ta = mk('textarea', 'nb-text');
      ta.placeholder = 'Draft it here or on the memo desk — it is the same document.';
      ta.value = (store.read(block.slot) || {}).body || '';
      ta.rows = 6;
      ta.oninput = function () {
        store.write(block.slot, { body: ta.value });
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
      };
      wrap.appendChild(ta);

      const link = mk('a', 'nb-memo-link', 'Open on the memo desk &rarr;');
      // The desk is an app route now, and this link is raised from inside a
      // panel that opens on every page — a relative one resolved against
      // whatever page that was, and 404'd from all of them.
      link.href = '/verification/memo-desk#' + block.slot;
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

  /* ---------- the skill-map page ---------- */

  /* Derived at paint time from window.SKILLS and vt-progress — nothing here
     is ever written back. The arithmetic mirrors VT.rungFill/skillProgress in
     platform.js (including the compound 2.1–2.4 rung); keep the two in step. */

  let skillsLoad = null; // null | 'loading' | 'failed'

  function readUnits() {
    try {
      const raw = JSON.parse(localStorage.getItem('vt-progress') || '{}');
      return (raw && typeof raw.units === 'object' && raw.units) ? raw.units : {};
    } catch (e) { return {}; }
  }

  function rungFill(units, tag, S) {
    if (tag === S.compoundRung) {
      const hit = S.compoundUnits.filter(function (u) {
        return Object.prototype.hasOwnProperty.call(units, u);
      }).length;
      return hit / S.compoundUnits.length;
    }
    return Object.prototype.hasOwnProperty.call(units, tag) ? 1 : 0;
  }

  function loadSkills() {
    if (skillsLoad === 'loading') return;
    skillsLoad = 'loading';
    const s = document.createElement('script');
    s.src = '/verification/data/skills.js';
    s.onload = function () { skillsLoad = null; if (root && !root.hidden && onSkillPage()) paintPage(); };
    s.onerror = function () { skillsLoad = 'failed'; if (root && !root.hidden && onSkillPage()) paintPage(); };
    document.head.appendChild(s);
  }

  function paintSkills() {
    pagesEl.innerHTML = '';
    const head = mk('div', 'nb-skills-head');
    head.appendChild(mk('h3', null, 'Skill map'));
    const a = mk('a', 'btn small outline', 'Open the full map');
    a.href = '/verification/map';
    head.appendChild(a);
    pagesEl.appendChild(head);

    const S = window.SKILLS;
    if (!S) {
      if (skillsLoad === 'failed') {
        pagesEl.appendChild(mk('p', 'nb-empty',
          'The skill data could not be loaded just now. The full map has it.'));
      } else {
        loadSkills();
        pagesEl.appendChild(mk('p', 'nb-empty', 'Loading the skill data…'));
      }
      return;
    }

    const units = readUnits();
    const prog = S.nodes.map(function (n) {
      let filled = 0;
      n.rungs.forEach(function (r) { filled += rungFill(units, r[0], S); });
      const frac = n.rungs.length ? filled / n.rungs.length : 0;
      return {
        node: n,
        done: Math.round(filled * 100) / 100,
        total: n.rungs.length,
        frac: frac,
        state: frac >= 1 ? 'complete' : (frac > 0 ? 'in progress' : 'locked')
      };
    });

    const full = prog.filter(function (p) { return p.frac >= 1; }).length;
    pagesEl.appendChild(mk('p', 'nb-skill-sum',
      full + ' of ' + prog.length + ' skills complete'));

    S.moduleNames.forEach(function (name, m) {
      const rows = prog.filter(function (p) { return p.node.mod === m; });
      if (!rows.length) return;
      const sec = mk('section', 'nb-skill-mod');
      sec.style.setProperty('--mod', 'var(--mod-' + m + ')');
      sec.appendChild(mk('p', 'nb-skill-modname', 'M' + m + ' &middot; ' + esc(name)));
      rows.forEach(function (p) {
        const row = mk('div', 'nb-skill');
        row.appendChild(mk('span', 'nb-skill-name', esc(p.node.label)));
        const bar = mk('span', 'nb-skill-bar');
        const fill = mk('i');
        fill.style.width = Math.round(p.frac * 100) + '%';
        bar.appendChild(fill);
        row.appendChild(bar);
        row.appendChild(mk('span', 'nb-skill-frac',
          p.done + '/' + p.total + ' &middot; ' + p.state));
        sec.appendChild(row);
      });
      pagesEl.appendChild(sec);
    });
  }

  function paintPage() {
    if (!pagesEl) return;
    if (written) { paintWritten(); return; }
    root.querySelectorAll('[data-add]').forEach(function (b) { b.disabled = onSkillPage(); });

    if (onSkillPage()) {
      paintSkills();
    } else {
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
            '<span class="nb-count">Page <input class="nb-goto" type="text" inputmode="numeric" aria-label="Page number — type one to jump"> / <span data-total></span></span>' +
            '<button class="btn small outline" type="button" data-page="1" aria-label="Next page">&rarr;</button>' +
            '<button class="btn small outline" type="button" data-newpage>New page</button>' +
          '</div>' +
          '<button class="btn small" type="button" data-export>Export</button>' +
        '</footer>' +
      '</aside>';
    document.body.appendChild(root);

    pagesEl = root.querySelector('.nb-pages');
    counterEl = root.querySelector('.nb-count');
    gotoEl = root.querySelector('.nb-goto');

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
    open();
  }

  /* The skill map is the book's permanent last page — one index past the
     stored pages, a position and never a slot in data.pages — so opening it
     is setting `cur` there, nothing is created and nothing is written back. */
  function openSkills() {
    cur = data.pages.length;
    save();
    open();
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
    openSkills: openSkills,
    count: count,
    toMarkdown: toMarkdown
  };
})();
