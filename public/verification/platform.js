/* Shared runtime: progress store, chrome, skill arithmetic.
   Loaded before every page script; owns the single source of learner state.

   The whole platform's state is one set of completed unit ids. Skill
   progress, module progress, the Continue card and the certificate gate are
   all derived from it — nothing else is persisted, so a migration to real
   accounts is a migration of one array.

   Trap: never write a derived value into storage. A stored skill count goes
   stale the moment a rung is re-tagged in data/skills.js, and the learner
   sees a map that disagrees with itself. */

"use strict";

window.VT = (function () {

  const KEY = 'vt-progress';
  const listeners = [];

  /* ---------- store ---------- */

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return (raw && typeof raw.units === 'object' && raw.units) ? raw : { units: {} };
    } catch (e) {
      return { units: {} };
    }
  }

  let state = read();

  /* Stamp the store, not just the units.

     The account sync dates this document by the newest unit stamp inside it,
     which works for completing a unit and fails for every removal: reset and
     un-complete take stamps away, so the store went BACKWARDS in time exactly
     when it changed, the server's older copy read as newer, and the sync put
     the progress back. A stamp on the store itself moves forward on every
     write, whichever direction the units went. */
  function persist() {
    state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
    listeners.forEach(fn => fn(state));
  }

  const isDone = id => Object.prototype.hasOwnProperty.call(state.units, id);
  const doneUnits = () => Object.keys(state.units);
  const onChange = fn => { listeners.push(fn); return fn; };

  function reset() {
    state = { units: {} };
    persist();
  }

  /* Hand the account sync its chance to send a change before the page goes
     away, and resolve either way — this gates a reload, and a learner must
     never be left staring at an un-reloaded page because the network was
     slow. sync.js publishes VTSync; without it (signed out, or the file not
     on this page) there is nothing to wait for. */
  function syncThen(done) {
    var sync = window.VTSync;
    if (!sync || typeof sync.flush !== 'function') return done();
    var fired = false;
    var once = function () { if (!fired) { fired = true; done(); } };
    setTimeout(once, 1500);
    try { Promise.resolve(sync.flush()).then(once, once); }
    catch (e) { once(); }
  }

  /* ---------- skills ---------- */

  /* Fraction of a rung the learner holds, 0..1. Only the compound
     2.1–2.4 rung is ever partial: it fills a quarter per evidence bucket. */
  function rungFill(unitTag) {
    const S = window.SKILLS;
    if (S && unitTag === S.compoundRung) {
      const hit = S.compoundUnits.filter(isDone).length;
      return hit / S.compoundUnits.length;
    }
    return isDone(unitTag) ? 1 : 0;
  }

  /* {done, total, frac, state} for one skill node. `state` is the word the
     UI prints beside the colour, so hue never stands alone. */
  function skillProgress(node) {
    const total = node.rungs.length;
    let filled = 0;
    node.rungs.forEach(r => { filled += rungFill(r[0]); });
    const frac = total ? filled / total : 0;
    return {
      done: filled,
      total: total,
      frac: frac,
      state: frac >= 1 ? 'complete' : (frac > 0 ? 'in progress' : 'locked')
    };
  }

  /* Skills whose fill changed when `unit` was completed, for the toast. */
  function skillsTouchedBy(unit) {
    const S = window.SKILLS;
    if (!S) return [];
    return S.nodes.filter(n =>
      n.rungs.some(r => r[0] === unit || (r[0] === S.compoundRung && S.compoundUnits.indexOf(unit) > -1))
    );
  }

  /* ---------- completion ---------- */

  /* Marks a unit complete and reports what it moved. Re-completing an
     already-complete unit is a no-op and shows nothing, per the spec. */
  function completeUnit(id, opts) {
    if (isDone(id)) return null;

    const before = skillsTouchedBy(id).map(n => ({ node: n, p: skillProgress(n) }));
    state.units[id] = Date.now();
    persist();

    const advanced = [], completed = [];
    before.forEach(b => {
      const after = skillProgress(b.node);
      if (after.frac >= 1 && b.p.frac < 1) completed.push({ node: b.node, p: after });
      else if (after.frac > b.p.frac) advanced.push({ node: b.node, p: after });
    });

    const change = { unit: id, completed: completed, advanced: advanced };
    if (!opts || opts.toast !== false) announce(change);
    return change;
  }

  function uncompleteUnit(id) {
    if (!isDone(id)) return;
    delete state.units[id];
    persist();
  }

  /* ---------- module / track progress ---------- */

  function moduleProgress(mod) {
    const ids = mod.units.map(u => u.id);
    const done = ids.filter(isDone).length;
    return { done: done, total: ids.length, frac: ids.length ? done / ids.length : 0 };
  }

  function trackProgress() {
    const C = window.COURSE;
    if (!C) return { done: 0, total: 0, frac: 0 };
    let done = 0, total = 0;
    C.modules.forEach(m => {
      const p = moduleProgress(m);
      done += p.done; total += p.total;
    });
    return { done: done, total: total, frac: total ? done / total : 0 };
  }

  /* The next unit a returning learner should open: first incomplete unit in
     course order. Null once the track is finished. */
  function nextUnit() {
    const C = window.COURSE;
    if (!C) return null;
    for (const m of C.modules) {
      for (const u of m.units) {
        if (!isDone(u.id)) return { module: m, unit: u };
      }
    }
    return null;
  }

  /* ---------- chrome ---------- */

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Minimal inline markup for authored copy: **bold**, *italic*, `code`,
     [text](href). Everything else is escaped — content data is trusted, but
     the formatter stays narrow so a stray angle bracket in a quote can't
     inject markup.

     Trap: bold has to run before italic, or the first two asterisks of a
     **bold** run get eaten as an empty emphasis and the rest of the line
     goes to pieces. */
  function fmt(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  /* ---------- capstone bank vocabulary ---------- */

  /* Status and difficulty are a glyph plus the word, never a bare tint, so
     the reading survives without colour. It lives here rather than in
     capstone-bank.js because any second surface that prints a brief has to
     print it the same way. */
  const bank = {
    statusGlyph: { ready: '●', draft: '◐', concept: '○' },
    statusWord: { ready: 'ready to run', draft: 'draft', concept: 'concept' },
    diffGlyph: { core: '●', stretch: '◆', advanced: '▲' },
    range: r => (r.min === r.max ? String(r.min) : r.min + '–' + r.max)
  };

  /* Course destinations first, then the two site pages, all packed against
     the brand. */
  /* The header and footer links come from data/chrome.js, generated from
     src/lib/verification/chrome.ts. The Next app renders the same chrome on
     /tracks/verification from the same source, so neither surface owns the
     list and the two cannot drift.

     Trap: chrome.js must be loaded before this file. A page that forgets it
     gets a header with no links rather than a crash — check the script order
     before hunting for a bug in here. */
  const CHROME = window.VT_CHROME || { nav: [], foot: [], copyright: '' };

  /* One header for every page, so the course reads as one site with the home
     page rather than a second product bolted to it. The markup is exactly
     what theme.css styles — .site-header > .bar with .brand, .nav and
     .header-right — and the theme switch is an empty node theme.js fills.

     Trap: theme.js mounts on DOMContentLoaded, and page scripts run before
     that at the end of <body>, so the switch node only has to exist by then.
     Mount the chrome from the page script, not from a later callback. */
  function mountChrome(current) {
    const host = document.querySelector('[data-topbar]');
    if (!host) return;
    const here = current || location.pathname.split('/').pop() || '/verification/landing';
    host.className = 'site-header';
    host.innerHTML =
      '<div class="bar">' +
      '<a class="brand" href="/verification/landing">Verification <i>@</i>' +
        '<svg class="brand-mark brand-symbol" xmlns="http://www.w3.org/2000/svg" ' +
        'viewBox="0 0 284.25 284.25" role="img" aria-label="XLab">' +
        '<polygon fill="#7f1416" points="284.25 87.86 199.86 1.38 143.17 56.69 ' +
        '87.86 0 1.38 84.38 56.69 141.07 0 196.39 84.38 282.87 141.07 227.56 ' +
        '196.39 284.25 282.87 199.86 227.56 143.17 284.25 87.86"></polygon></svg></a>' +
      '<nav class="nav" aria-label="Course">' +
      CHROME.nav.map(n => '<a href="' + n.href + '"' +
        (n.href === here ? ' aria-current="page"' : '') +
        '>' + esc(n.label) + '</a>').join('') +
      '</nav>' +
      '<div class="header-right"><div class="theme-switch"></div>' +
      '<a class="btn small" href="/login?next=' +
        encodeURIComponent(location.pathname + location.search) +
        '" data-signin>Sign in</a></div>' +
      '</div>';
  }

  /* Sign-in belongs to the Next app, at /login. These pages keep progress in
     this browser and never gate on it. */
  function mountFoot() {
    const host = document.querySelector('[data-foot]');
    if (!host) return;
    host.className = 'site-footer';
    host.innerHTML =
      '<div class="wrap">' +
      '<nav class="foot-links" aria-label="Site">' +
      CHROME.foot.map(f => f.href
        ? '<a href="' + f.href + '"' +
          (/^https?:\/\//.test(f.href) ? ' target="_blank" rel="noopener"' : '') +
          '>' + esc(f.label) + '</a>'
        : '<span class="pending" title="Link not supplied yet">' + esc(f.label) + '</span>'
      ).join('') +
      '</nav>' +
      '<div class="foot-end">' +
      '<span>' + esc(CHROME.copyright) + '</span>' +
      '<button class="btn small outline" id="vt-reset">Reset progress</button>' +
      '</div>' +
      '</div>';
    armReset(document.getElementById('vt-reset'));
  }

  /* Two-tap confirm instead of a browser dialog (house craft rule). */
  function armReset(btn) {
    if (!btn) return;
    let armed = false, timer = 0;
    btn.addEventListener('click', () => {
      if (!armed) {
        armed = true;
        btn.textContent = 'Sure? Tap again';
        timer = setTimeout(() => { armed = false; btn.textContent = 'Reset progress'; }, 4000);
        return;
      }
      clearTimeout(timer);
      armed = false;
      reset();
      /* Reloading straight after the reset used to race the sync's own
         debounce and lose: the tab went away with the cleared store unsent,
         and the account's copy — still holding every completed unit — came
         back on the next load and undid the reset. Push first, then reload. */
      btn.textContent = 'Resetting…';
      btn.disabled = true;
      syncThen(function () { location.reload(); });
    });
  }

  /* ---------- toast ---------- */

  function dock() {
    let d = document.querySelector('.toast-dock');
    if (!d) {
      d = document.createElement('div');
      d.className = 'toast-dock';
      document.body.appendChild(d);
    }
    return d;
  }

  /* One toast per completion event, never a stack of five. */
  function announce(change) {
    if (!change || (!change.completed.length && !change.advanced.length)) return;

    let label, body;
    if (change.completed.length) {
      label = change.completed.length > 1 ? 'Skills unlocked' : 'Skill unlocked';
      body = change.completed.map(c => c.node.label).join(', ');
      if (change.advanced.length) {
        body += ' &mdash; and progress on ' +
          change.advanced.map(a => a.node.label + ' ' + fracText(a.p)).join(', ');
      }
    } else {
      label = 'Progress';
      body = change.advanced.map(a => a.node.label + ' ' + fracText(a.p)).join(', ');
    }

    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="label">' + label + '</span>' +
      '<p>' + body + '</p>' +
      '<div class="row"><a href="/verification/map?unit=' + encodeURIComponent(change.unit) +
      '">See your map &rarr;</a><button class="x" aria-label="Dismiss">&times;</button></div>';

    const close = () => { el.remove(); };
    el.querySelector('.x').addEventListener('click', close);
    dock().appendChild(el);
    setTimeout(close, 8000);
  }

  const fracText = p =>
    Math.round(p.done * 100) / 100 + '/' + p.total;

  return {
    isDone: isDone,
    doneUnits: doneUnits,
    completeUnit: completeUnit,
    uncompleteUnit: uncompleteUnit,
    reset: reset,
    onChange: onChange,
    rungFill: rungFill,
    skillProgress: skillProgress,
    skillsTouchedBy: skillsTouchedBy,
    moduleProgress: moduleProgress,
    trackProgress: trackProgress,
    nextUnit: nextUnit,
    fracText: fracText,
    esc: esc,
    fmt: fmt,
    bank: bank,
    mountChrome: mountChrome,
    mountFoot: mountFoot,
    announce: announce
  };
})();

/* Say so. On the app routes this file arrives through the page's own ordered
   loader while sync.js arrives from the site chrome, so neither can assume it
   is second — and a sync.js that looked for window.VT a moment too early
   simply never subscribed, which is a completed unit that reaches the account
   only when the tab closes. */
try { window.dispatchEvent(new Event('vt-ready')); } catch (e) { /* ancient browser */ }
