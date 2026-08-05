/* Learner's guide. Renders data/glossary.js; the filter is a plain
   substring match over term, definition and prompt text — a module whose
   rows all fail the filter is removed rather than left as an empty heading. */

"use strict";

{
  VT.mountChrome('guide.html');
  VT.mountFoot();

  const C = window.COURSE;
  const G = window.GLOSSARY;
  const host = document.querySelector('[data-guide]');
  const hits = document.querySelector('[data-hits]');
  const search = document.querySelector('[data-search]');

  const modOf = n => C.modules.find(m => m.n === n) || { title: '', n: n };

  function unitHref(id) {
    for (const m of C.modules) {
      if (m.units.some(u => u.id === id)) return 'module.html?m=' + m.n + '&u=' + encodeURIComponent(id);
    }
    return 'track.html';
  }

  function draw(q) {
    const needle = (q || '').trim().toLowerCase();
    const match = s => !needle || s.toLowerCase().indexOf(needle) > -1;

    let shownTerms = 0, shownPrompts = 0;
    const html = G.modules.map(gm => {
      const terms = gm.terms.filter(t => match(t.t) || match(t.d));
      const prompts = gm.review.filter(p => match(p));
      if (!terms.length && !prompts.length) return '';
      shownTerms += terms.length;
      shownPrompts += prompts.length;
      const m = modOf(gm.n);

      return '<section class="gmod m' + gm.n + '">' +
        '<div class="head"><span class="n">Module ' + gm.n + '</span>' +
          '<h2>' + VT.esc(m.title) + '</h2>' +
          '<span class="frac">' + gm.terms.length + ' terms</span></div>' +
        (terms.length ? '<dl class="glossary">' + terms.map(t =>
          '<dt>' + VT.esc(t.t) +
            '<a class="u" href="' + unitHref(t.unit) + '">' + VT.esc(t.unit) + '</a></dt>' +
          '<dd>' + VT.fmt(t.d) + '</dd>').join('') + '</dl>' : '') +
        (prompts.length ? '<div class="review"><span class="label">Review prompts</span><ol>' +
          prompts.map(p => '<li>' + VT.fmt(p) + '</li>').join('') + '</ol></div>' : '') +
        '</section>';
    }).join('');

    host.innerHTML = html || '<p class="no-hits">Nothing matches that.</p>';
    hits.innerHTML = shownTerms + ' terms &middot; ' + shownPrompts + ' prompts';
  }

  let t = 0;
  search.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => draw(search.value), 120);
  });

  draw('');
}
