/* vocab.js — look up a word you don't know, and keep it.

   Select a short phrase in the reading column and a "Define" button appears
   beside it. The definition comes from /api/verification/define: the app's own
   glossary first, the LessWrong wiki as a fallback. Saving files it on the
   Cheatsheet page of the notebook, so it persists, syncs to the account and
   exports with everything else — a second store would have been a second
   thing to migrate.

   Load AFTER notebook.js: it calls VTNotebook.

   Trap: a lookup can legitimately find nothing — the wiki API is behind bot
   protection and challenges datacenter requests, so the worker may get no
   answer for a term a laptop would resolve. Saving is therefore never gated
   on a definition: the card offers to keep the term with your own note, and
   says plainly that nothing was found. A vocabulary tool that refuses the
   words you most need is the wrong way round.

   Trap: the notebook's own capture button owns long selections. This one
   takes short ones, and the two must not both appear — the split is on word
   count, in one place (SHORT_WORDS). */

"use strict";

(function () {

  const SHORT_WORDS = 5;      // above this it is a passage, not a term
  const MIN_CHARS = 3;

  const esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  let btn = null, card = null;

  function drop() {
    if (btn) { btn.remove(); btn = null; }
    if (card) { card.remove(); card = null; }
  }

  function place(el, rect) {
    el.style.top = (rect.bottom + window.scrollY + 8) + 'px';
    el.style.left = Math.max(8, rect.left + window.scrollX) + 'px';
  }

  function show(term, rect) {
    card = document.createElement('div');
    card.className = 'vocab-card';
    card.innerHTML = '<p class="vocab-term">' + esc(term) + '</p>' +
      '<p class="vocab-body">Looking it up…</p>';
    place(card, rect);
    document.body.appendChild(card);

    fetch('/api/verification/define?term=' + encodeURIComponent(term), {
      headers: { Accept: 'application/json' }
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .catch(function () { return { ok: false, j: null }; })
      .then(function (res) {
        if (!card) return;
        const d = res.j || {};
        const found = res.ok && d.found;
        card.innerHTML =
          '<p class="vocab-term">' + esc(d.term || term) + '</p>' +
          (found
            ? '<p class="vocab-body">' + esc(d.definition) + '</p>' +
              '<p class="vocab-src">' +
                (d.url ? '<a href="' + esc(d.url) + '" target="_blank" rel="noopener">' +
                  esc(d.source) + '</a>' : esc(d.source)) + '</p>'
            : '<p class="vocab-body vocab-none">No definition found. Keep it anyway — ' +
              'you can write your own once you have one.</p>') +
          '<div class="vocab-acts">' +
            '<button class="btn small" type="button" data-keep>Save to cheatsheet</button>' +
            '<button class="btn small outline" type="button" data-close>Close</button>' +
          '</div>';

        card.querySelector('[data-close]').onclick = drop;
        card.querySelector('[data-keep]').onclick = function () {
          if (window.VTNotebook && VTNotebook.addTerm) {
            VTNotebook.addTerm(d.term || term, found ? d.definition : '', d.url || '', d.source || '');
          }
          drop();
          const sel = document.getSelection();
          if (sel && sel.removeAllRanges) sel.removeAllRanges();
        };
      });
  }

  document.addEventListener('mouseup', function (ev) {
    /* Trap: mouseup fires before click. A press on our own button would tear
       it down and rebuild it here, so the click it was pressed for never
       lands — the button looked dead. Ignore presses inside our own UI. */
    if (ev.target && ev.target.closest && ev.target.closest('.vocab-btn, .vocab-card')) return;
    setTimeout(function () {
      const sel = document.getSelection();
      const text = sel ? String(sel).trim() : '';
      drop();
      if (text.length < MIN_CHARS) return;
      if (text.split(/\s+/).length > SHORT_WORDS) return;   // the notebook takes it
      const host = sel.anchorNode && sel.anchorNode.parentElement;
      if (!host || !host.closest('main')) return;

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vocab-btn';
      btn.textContent = 'Define';
      place(btn, rect);
      btn.onclick = function () {
        const r = rect;
        if (btn) { btn.remove(); btn = null; }
        show(text, r);
      };
      document.body.appendChild(btn);
    }, 0);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') drop();
  });

})();
