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

  function persist() {
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

  /* Minimal inline markup for authored copy: **bold**, `code`, [text](href).
     Everything else is escaped — content data is trusted, but the formatter
     stays narrow so a stray angle bracket in a quote can't inject markup. */
  function fmt(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  /* Course destinations first, then the two site pages, all packed against
     the brand. */
  /* Two links, and they stay two. The course's own destinations — track,
     skill map, capstones, memo desk, guide — are reached from the landing
     page and from each other, not from the top bar; putting them here turned
     it into a seven-link row that had to scroll on a laptop. */
  const NAV = [
    ['team.html', 'Team'],
    ['about.html', 'About']
  ];

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
    const here = current || location.pathname.split('/').pop() || 'landing.html';
    host.className = 'site-header';
    host.innerHTML =
      '<div class="bar">' +
      '<a class="brand" href="landing.html">Verification <i>@</i>' +
        '<img class="brand-mark" src="assets/xLab_Logotype.png" alt="XLab" ' +
        'width="3300" height="1050" draggable="false"></a>' +
      '<nav class="nav" aria-label="Course">' +
      NAV.map(n => '<a href="' + n[0] + '"' + (n[0] === here ? ' aria-current="page"' : '') +
        '>' + esc(n[1]) + '</a>').join('') +
      '</nav>' +
      '<div class="header-right"><div class="theme-switch"></div>' +
      '<a class="btn small" href="/login">Sign in</a></div>' +
      '</div>';
  }

  /* Sign-in belongs to the Next app, at /login. These pages keep progress in
     this browser and never gate on it, so the footer says where the state
     actually lives rather than implying an account holds it. */
  function mountFoot() {
    const host = document.querySelector('[data-foot]');
    if (!host) return;
    host.className = 'site-footer';
    host.innerHTML =
      '<div class="wrap">' +
      '<span>XLab Tracks &middot; Verification</span>' +
      '<span>Progress is stored in this browser only.</span>' +
      '<button class="btn small outline" id="vt-reset">Reset progress</button>' +
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
      btn.textContent = 'Reset progress';
      reset();
      location.reload();
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
      '<div class="row"><a href="map.html?unit=' + encodeURIComponent(change.unit) +
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
    mountChrome: mountChrome,
    mountFoot: mountFoot,
    announce: announce
  };
})();
