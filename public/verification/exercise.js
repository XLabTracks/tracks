/* Exercise engine — renders data/exercises.js into a playable widget.

   Five types share one shell (progress row, body, feedback, footer). Linear
   types (mcq, sort) show one item at a time and never auto-advance: the
   learner commits, reads why, then presses Continue. Types that need the
   whole board at once (grid, plot, rank) render in full — the one-at-a-time
   rule is about linear sequences, not about hiding options the learner has
   to compare.

   Answers persist per exercise under vt-ex:<id> because 4.0 reopens the
   ranking sealed in 2.0. That store holds learner work only; unit
   completion still lives in VT, and nothing here writes to it directly —
   the host page decides what "finished" means and calls onDone. */

"use strict";

window.Exercise = (function () {

  const esc = window.VT.esc, fmt = window.VT.fmt;
  const KEY = id => 'vt-ex:' + id;

  function load(id) {
    try { return JSON.parse(localStorage.getItem(KEY(id)) || 'null'); } catch (e) { return null; }
  }
  function save(id, val) {
    try { localStorage.setItem(KEY(id), JSON.stringify(val)); } catch (e) { /* private mode */ }
  }

  /* ---------- shell ---------- */

  function shell(host, ex) {
    host.className = 'ex';
    host.innerHTML =
      '<div class="ex-head">' +
        '<span class="eyebrow">' + esc(typeLabel(ex.type)) + '</span>' +
        '<h3>' + esc(ex.title) + '</h3>' +
        '<p class="ex-lede">' + fmt(ex.lede) + '</p>' +
      '</div>' +
      '<div class="ex-progress" data-progress hidden></div>' +
      '<div class="ex-body" data-body></div>' +
      '<div class="ex-foot" data-foot></div>';
    return {
      progress: host.querySelector('[data-progress]'),
      body: host.querySelector('[data-body]'),
      foot: host.querySelector('[data-foot]')
    };
  }

  const typeLabel = t => ({
    mcq: 'check your understanding',
    sort: 'classify',
    rank: 'order',
    grid: 'self-assessment · ungraded',
    plot: 'position · ungraded'
  }[t] || 'exercise');

  /* Step dots plus an explicit counter — position is never implied by dots
     alone, because at eight items the dots stop being countable. */
  function drawProgress(el, i, n, marks) {
    el.hidden = false;
    let dots = '';
    for (let k = 0; k < n; k++) {
      const m = marks[k];
      dots += '<span class="step-dot' + (k === i ? ' now' : '') +
        (m === true ? ' hit' : m === false ? ' miss' : '') + '"></span>';
    }
    el.innerHTML = '<span class="dots">' + dots + '</span>' +
      '<span class="counter">' + (i + 1) + ' / ' + n + '</span>';
  }

  function scoreLine(marks) {
    const hit = marks.filter(m => m === true).length;
    return hit + ' / ' + marks.length;
  }

  /* ---------- mcq ---------- */

  function mcq(host, ex, onDone) {
    const ui = shell(host, ex);
    const n = ex.questions.length;
    const marks = new Array(n).fill(null);
    let i = 0, locked = false;

    function step() {
      const q = ex.questions[i];
      locked = false;
      drawProgress(ui.progress, i, n, marks);
      ui.body.innerHTML =
        '<p class="ex-q">' + fmt(q.q) + '</p>' +
        '<div class="opts">' + q.options.map((o, k) =>
          '<button class="opt" data-k="' + k + '">' + esc(o) + '</button>').join('') + '</div>' +
        '<div class="ex-feedback" data-fb hidden></div>';
      ui.foot.innerHTML = '';
    }

    host.addEventListener('click', e => {
      const opt = e.target.closest('.opt');
      if (opt && !locked) {
        locked = true;
        const k = +opt.dataset.k, q = ex.questions[i], right = k === q.key;
        marks[i] = right;
        host.querySelectorAll('.opt').forEach((b, bi) => {
          b.disabled = true;
          if (bi === q.key) b.classList.add('is-key');
          if (bi === k && !right) b.classList.add('is-wrong');
        });
        const fb = host.querySelector('[data-fb]');
        fb.hidden = false;
        fb.className = 'ex-feedback ' + (right ? 'ok' : 'no');
        fb.innerHTML = '<span class="label">' + (right ? 'Correct' : 'Not quite') + '</span>' +
          '<p>' + fmt(q.why) + '</p>';
        drawProgress(ui.progress, i, n, marks);
        ui.foot.innerHTML = i < n - 1
          ? '<button class="btn" data-next>Continue</button>'
          : '<span class="counter">' + scoreLine(marks) + ' correct</span>' +
            '<button class="btn" data-finish>Finish</button>';
        return;
      }
      if (e.target.closest('[data-next]')) { i++; step(); }
      if (e.target.closest('[data-finish]')) {
        save(ex.id, { marks: marks });
        finish(host, ui, ex, scoreLine(marks) + ' correct', onDone);
      }
    });

    step();
  }

  /* ---------- sort ---------- */

  function sort(host, ex, onDone) {
    const ui = shell(host, ex);
    const n = ex.items.length;
    const marks = new Array(n).fill(null);
    let i = 0, locked = false;

    function step() {
      const it = ex.items[i];
      locked = false;
      drawProgress(ui.progress, i, n, marks);
      ui.body.innerHTML =
        '<p class="ex-q">' + fmt(it.t) + '</p>' +
        '<div class="opts row">' + ex.buckets.map(b =>
          '<button class="opt" data-b="' + esc(b.id) + '">' + esc(b.label) + '</button>').join('') + '</div>' +
        '<div class="ex-feedback" data-fb hidden></div>';
      ui.foot.innerHTML = '';
    }

    host.addEventListener('click', e => {
      const opt = e.target.closest('.opt');
      if (opt && !locked) {
        locked = true;
        const pick = opt.dataset.b, it = ex.items[i], right = pick === it.key;
        marks[i] = right;
        host.querySelectorAll('.opt').forEach(b => {
          b.disabled = true;
          if (b.dataset.b === it.key) b.classList.add('is-key');
          if (b.dataset.b === pick && !right) b.classList.add('is-wrong');
        });
        const fb = host.querySelector('[data-fb]');
        fb.hidden = false;
        fb.className = 'ex-feedback ' + (right ? 'ok' : 'no');
        fb.innerHTML = '<span class="label">' +
          (right ? 'Correct' : 'It belongs under ' +
            esc((ex.buckets.find(b => b.id === it.key) || {}).label || it.key)) +
          '</span><p>' + fmt(it.why) + '</p>';
        drawProgress(ui.progress, i, n, marks);
        ui.foot.innerHTML = i < n - 1
          ? '<button class="btn" data-next>Continue</button>'
          : '<span class="counter">' + scoreLine(marks) + ' correct</span>' +
            '<button class="btn" data-finish>Finish</button>';
        return;
      }
      if (e.target.closest('[data-next]')) { i++; step(); }
      if (e.target.closest('[data-finish]')) {
        save(ex.id, { marks: marks });
        finish(host, ui, ex, scoreLine(marks) + ' correct', onDone);
      }
    });

    step();
  }

  /* ---------- rank ---------- */

  /* Keyboard-first ordering: every row has up/down buttons, so the exercise
     works without a pointer. Drag is not offered — a list this short does
     not need it, and drag without a keyboard path is an accessibility bug. */
  function rank(host, ex, onDone) {
    const ui = shell(host, ex);
    const prior = ex.reopen ? load(ex.reopen) : null;
    let order = (load(ex.id) || {}).order;
    if (!order || order.length !== ex.items.length) order = ex.items.map(it => it.id);
    let revealed = false;

    const label = id => (ex.items.find(it => it.id === id) || {}).t || id;

    function draw() {
      const priorRank = prior && prior.order ? prior.order : null;
      ui.body.innerHTML =
        (priorRank ? '<div class="note"><span class="label">Sealed in 2.0</span>' +
          '<ol class="prior">' + priorRank.map(id => '<li>' + esc(label(id)) + '</li>').join('') +
          '</ol></div>' : '') +
        '<ol class="rank-list">' + order.map((id, k) => {
          const moved = priorRank ? Math.abs(priorRank.indexOf(id) - k) : 0;
          return '<li class="rank-row"' + (moved >= 2 ? ' data-moved="1"' : '') + '>' +
            '<span class="rank-n mono">' + (k + 1) + '</span>' +
            '<span class="rank-t">' + esc(label(id)) + '</span>' +
            (moved >= 2 ? '<span class="chip accent">moved ' + moved + '</span>' : '') +
            '<span class="rank-ctl">' +
              '<button class="mv" data-mv="-1" data-i="' + k + '" aria-label="Move up"' +
                (k === 0 ? ' disabled' : '') + '>&uarr;</button>' +
              '<button class="mv" data-mv="1" data-i="' + k + '" aria-label="Move down"' +
                (k === order.length - 1 ? ' disabled' : '') + '>&darr;</button>' +
            '</span></li>';
        }).join('') + '</ol>' +
        (ex.prompt ? '<div class="ex-prompt"><p>' + fmt(ex.prompt) + '</p>' +
          '<textarea data-notes rows="4" placeholder="Your reasoning — stored in this browser."></textarea></div>' : '') +
        '<div class="ex-feedback" data-fb hidden></div>';

      const ta = host.querySelector('[data-notes]');
      if (ta) {
        ta.value = (load(ex.id) || {}).notes || '';
        ta.addEventListener('input', debounce(() => persist(), 400));
      }
      ui.foot.innerHTML = revealed
        ? '<button class="btn" data-finish>Finish</button>'
        : '<button class="btn" data-commit>' +
          (ex.seal ? 'Seal this order' : 'Check my order') + '</button>';
    }

    function persist() {
      const ta = host.querySelector('[data-notes]');
      save(ex.id, { order: order, notes: ta ? ta.value : '' });
    }

    function debounce(fn, ms) {
      let t = 0;
      return function () { clearTimeout(t); t = setTimeout(fn, ms); };
    }

    host.addEventListener('click', e => {
      const mv = e.target.closest('.mv');
      if (mv) {
        const i = +mv.dataset.i, d = +mv.dataset.mv, j = i + d;
        if (j < 0 || j >= order.length) return;
        const t = order[i]; order[i] = order[j]; order[j] = t;
        persist();
        draw();
        return;
      }
      if (e.target.closest('[data-commit]')) {
        revealed = true;
        persist();
        const fb = host.querySelector('[data-fb]');
        fb.hidden = false;
        if (ex.seal) {
          fb.className = 'ex-feedback';
          fb.innerHTML = '<span class="label">Sealed</span><p>' + fmt(ex.sealNote) + '</p>';
        } else {
          const hit = order.filter((id, k) => id === ex.key[k]).length;
          fb.className = 'ex-feedback ' + (hit === order.length ? 'ok' : '');
          fb.innerHTML = '<span class="label">' + hit + ' / ' + order.length +
            ' in place</span><ol class="prior">' +
            ex.key.map(id => '<li>' + esc(label(id)) + '</li>').join('') + '</ol>' +
            '<p>' + fmt(ex.why) + '</p>' +
            (ex.caveat ? '<p class="caveat">' + fmt(ex.caveat) + '</p>' : '');
        }
        draw();
        fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (e.target.closest('[data-finish]')) {
        persist();
        finish(host, ui, ex, ex.seal ? 'order sealed' : 'order checked', onDone);
      }
    });

    draw();
  }

  /* ---------- grid ---------- */

  function grid(host, ex, onDone) {
    const ui = shell(host, ex);
    const store = load(ex.id) || { cells: {}, notes: '' };
    let revealed = false;

    function draw() {
      const filled = Object.keys(store.cells).filter(k => store.cells[k]).length;
      ui.progress.hidden = false;
      ui.progress.innerHTML = '<span class="counter">' + filled + ' cells marked &middot; ' +
        ex.rows.length + ' routes &times; ' + ex.cols.length + ' layers</span>';

      ui.body.innerHTML =
        '<div class="grid-wrap"><table class="grid"><thead><tr><th scope="col">Route</th>' +
        ex.cols.map(c => '<th scope="col">' + esc(c.label) + '</th>').join('') +
        '</tr></thead><tbody>' +
        ex.rows.map(r => '<tr><th scope="row">' + esc(r.t) + '</th>' +
          ex.cols.map(c => {
            const k = r.id + ':' + c.id, on = !!store.cells[k];
            return '<td><button class="cell' + (on ? ' on' : '') + '" data-cell="' + k + '"' +
              ' aria-pressed="' + on + '" aria-label="' + esc(r.t + ' — ' + c.label) + '">' +
              (on ? 'fires' : '&mdash;') + '</button></td>';
          }).join('') + '</tr>').join('') +
        '</tbody></table></div>' +
        '<div class="ex-prompt"><p>' + fmt(ex.prompt) + '</p>' +
        '<textarea data-notes rows="4" placeholder="Your residual blind spot — stored in this browser."></textarea></div>' +
        '<div class="ex-feedback" data-fb hidden></div>';

      const ta = host.querySelector('[data-notes]');
      ta.value = store.notes || '';
      ta.addEventListener('input', debounce(() => { store.notes = ta.value; save(ex.id, store); }, 400));

      ui.foot.innerHTML = revealed
        ? '<button class="btn" data-finish>Finish</button>'
        : '<button class="btn" data-reveal>Check my board</button>';
    }

    function debounce(fn, ms) {
      let t = 0;
      return function () { clearTimeout(t); t = setTimeout(fn, ms); };
    }

    host.addEventListener('click', e => {
      const cell = e.target.closest('.cell');
      if (cell) {
        const k = cell.dataset.cell;
        store.cells[k] = !store.cells[k];
        save(ex.id, store);
        cell.classList.toggle('on', store.cells[k]);
        cell.setAttribute('aria-pressed', String(!!store.cells[k]));
        cell.innerHTML = store.cells[k] ? 'fires' : '&mdash;';
        const filled = Object.keys(store.cells).filter(x => store.cells[x]).length;
        ui.progress.querySelector('.counter').innerHTML = filled + ' cells marked &middot; ' +
          ex.rows.length + ' routes &times; ' + ex.cols.length + ' layers';
        return;
      }
      if (e.target.closest('[data-reveal]')) {
        revealed = true;
        draw();
        showReveal(host.querySelector('[data-fb]'), ex.reveal);
        return;
      }
      if (e.target.closest('[data-finish]')) finish(host, ui, ex, 'board committed', onDone);
    });

    draw();
  }

  /* ---------- plot ---------- */

  /* Click a cell to place the selected item; the grid is coarse (5x5) on
     purpose — the exercise is about relative position and the argument for
     it, not about pixel-accurate coordinates. */
  function plot(host, ex, onDone) {
    const ui = shell(host, ex);
    const store = load(ex.id) || { pos: {}, notes: '' };
    const N = 5;
    let sel = null, revealed = false;

    function draw() {
      const placed = Object.keys(store.pos).length;
      ui.progress.hidden = false;
      ui.progress.innerHTML = '<span class="counter">' + placed + ' / ' + ex.items.length + ' placed</span>';

      let cells = '';
      for (let y = N - 1; y >= 0; y--) {
        for (let x = 0; x < N; x++) {
          const here = ex.items.filter(it => {
            const p = store.pos[it];
            return p && p[0] === x && p[1] === y;
          });
          cells += '<button class="pcell" data-x="' + x + '" data-y="' + y + '"' +
            ' aria-label="Feasibility ' + (x + 1) + ', effectiveness ' + (y + 1) + '">' +
            here.map(t => '<span class="pchip">' + esc(t) + '</span>').join('') + '</button>';
        }
      }

      ui.body.innerHTML =
        '<div class="tray">' + ex.items.map(t =>
          '<button class="tchip' + (store.pos[t] ? ' placed' : '') + (sel === t ? ' sel' : '') +
          '" data-item="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div>' +
        '<p class="hint">Pick a bucket, then click a cell. Click a placed bucket again to lift it.</p>' +
        '<div class="plot"><span class="ax ax-y">' + esc(ex.axes.y) + '</span>' +
        '<div class="pgrid" style="--n:' + N + '">' + cells + '</div>' +
        '<span class="ax ax-x">' + esc(ex.axes.x) + '</span></div>' +
        '<div class="ex-prompt"><p>' + fmt(ex.prompt) + '</p>' +
        '<textarea data-notes rows="4" placeholder="Your defense — stored in this browser."></textarea></div>' +
        '<div class="ex-feedback" data-fb hidden></div>';

      const ta = host.querySelector('[data-notes]');
      ta.value = store.notes || '';
      ta.addEventListener('input', debounce(() => { store.notes = ta.value; save(ex.id, store); }, 400));

      ui.foot.innerHTML = revealed
        ? '<button class="btn" data-finish>Finish</button>'
        : '<button class="btn" data-reveal' +
          (placed === ex.items.length ? '' : ' disabled') + '>Reveal the argument</button>';
    }

    function debounce(fn, ms) {
      let t = 0;
      return function () { clearTimeout(t); t = setTimeout(fn, ms); };
    }

    host.addEventListener('click', e => {
      const chip = e.target.closest('.tchip');
      if (chip) {
        const t = chip.dataset.item;
        if (store.pos[t]) { delete store.pos[t]; sel = t; }
        else sel = (sel === t ? null : t);
        save(ex.id, store);
        draw();
        return;
      }
      const cell = e.target.closest('.pcell');
      if (cell && sel) {
        store.pos[sel] = [+cell.dataset.x, +cell.dataset.y];
        sel = null;
        save(ex.id, store);
        draw();
        return;
      }
      if (e.target.closest('[data-reveal]')) {
        revealed = true;
        draw();
        showReveal(host.querySelector('[data-fb]'), ex.reveal);
        return;
      }
      if (e.target.closest('[data-finish]')) finish(host, ui, ex, 'position committed', onDone);
    });

    draw();
  }

  /* ---------- shared tail ---------- */

  function showReveal(fb, rev) {
    if (!fb || !rev) return;
    fb.hidden = false;
    fb.className = 'ex-feedback';
    fb.innerHTML = '<span class="label">' + esc(rev.title) + '</span>' +
      rev.body.map(p => '<p>' + fmt(p) + '</p>').join('') +
      (rev.note ? '<p class="caveat">' + fmt(rev.note) + '</p>' : '');
    fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function finish(root, ui, ex, summary, onDone) {
    ui.foot.innerHTML = '<span class="counter">Exercise complete &middot; ' + esc(summary) + '</span>' +
      '<button class="btn outline" data-again>Start over</button>';
    ui.foot.querySelector('[data-again]').addEventListener('click', () => {
      try { localStorage.removeItem(KEY(ex.id)); } catch (e) { /* private mode */ }
      mount(root.parentNode, ex.id, { onDone: onDone });
    });
    if (onDone) onDone(ex);
  }

  /* ---------- entry ---------- */

  const RENDER = { mcq: mcq, sort: sort, rank: rank, grid: grid, plot: plot };

  function mount(host, id, opts) {
    const def = window.EXERCISES[id];
    if (!host) return;
    if (!def) {
      host.className = 'stub';
      host.innerHTML = '<span class="label">exercise</span>' +
        'No exercise is registered under <code>' + esc(id) + '</code>.';
      return;
    }
    const ex = Object.assign({ id: id }, def);
    /* Render into a fresh child, never into the host itself: every renderer
       delegates from its own root, so remounting (Start over) must drop the
       old node or the previous run's listeners fire alongside the new one. */
    host.replaceChildren();
    host.className = 'ex-host';
    const root = document.createElement('div');
    host.appendChild(root);
    RENDER[ex.type](root, ex, (opts && opts.onDone) || null);
    if (ex.source) {
      const s = document.createElement('p');
      s.className = 'ex-source';
      s.textContent = 'Built from: ' + ex.source;
      root.appendChild(s);
    }
  }

  return { mount: mount, load: load };
})();
