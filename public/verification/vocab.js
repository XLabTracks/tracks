/* vocab.js — look up a word you don't know, and keep it.

   The definition comes from /api/verification/define: the app's own glossary
   first, the LessWrong wiki as a fallback. Saving files it on the Cheatsheet
   page of the notebook, so it persists, syncs to the account and exports with
   everything else — a second store would have been a second thing to migrate.

   Exposes window.VTVocab = { define(term, rect) }. Raising it is somebody
   else's job: the selection toolbar (SelectionActions) decides when a
   selection is short enough to be a term and calls this. This file used to
   own a mouseup listener of its own, which is exactly why a phone or a
   keyboard could select a word and be offered nothing.

   Load AFTER notebook.js: it calls VTNotebook.

   Trap: a lookup can legitimately find nothing — the wiki API is behind bot
   protection and challenges datacenter requests, so the worker may get no
   answer for a term a laptop would resolve. Saving is therefore never gated
   on a definition: the card offers to keep the term with your own note, and
   says plainly that nothing was found. A vocabulary tool that refuses the
   words you most need is the wrong way round. */

"use strict";

(function () {

  const esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  let card = null;

  function drop() {
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

    /* The sentence around the highlight rides along so the lookup can pick
       the right sense of an ambiguous word from the page's own vocabulary. */
    var dSel = window.getSelection();
    var dNode = dSel && dSel.anchorNode ? dSel.anchorNode.parentElement : null;
    var dCtx = dNode ? ((dNode.closest && dNode.closest('p,li,td,h1,h2,h3,h4')) || dNode).textContent || '' : '';
    /* The page's own name usually carries the deciding word ("4.2 Capstone
       project"), so it rides along with the sentence. */
    var dH1 = document.querySelector('h1');
    dCtx = (document.title || '') + ' ' + (dH1 ? dH1.textContent : '') + ' ' + dCtx;
    fetch('/api/verification/define?term=' + encodeURIComponent(term) +
        '&context=' + encodeURIComponent(dCtx.replace(/\s+/g, ' ').trim().slice(0, 400)), {
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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') drop();
  });

  /* A press outside closes the card, the way any popover does — but never one
     inside it, or its own buttons would never fire. */
  document.addEventListener('pointerdown', function (ev) {
    if (!card) return;
    if (ev.target && ev.target.closest && ev.target.closest('.vocab-card')) return;
    drop();
  });

  /* The selection toolbar decides when a selection is short enough to be a
     term; this is all it needs from here. `rect` is the selection in viewport
     coordinates, which is what place() expects. */
  window.VTVocab = {
    define: function (term, rect) {
      drop();
      show(term, rect);
    }
  };

})();
