/* Track index. Renders every module and unit from data/course.js with live
   completion state. No card is written by hand — a new unit in the graph
   appears here, in the counters, and in the certificate gate at once. */

"use strict";

{
  VT.mountChrome('track.html');
  VT.mountFoot();

  const C = window.COURSE;
  document.querySelector('[data-question]').textContent = C.question;

  const KIND = {
    explainer: 'explainer', interactive: 'interactive', primer: 'primer',
    exercise: 'exercise', capstone: 'capstone'
  };

  function unitRow(m, u) {
    const done = VT.isDone(u.id);
    const bits = [KIND[u.kind] || u.kind, u.mins];
    if (u.optional) bits.push('optional');
    if (u.exercise) bits.push('exercise');
    if (u.output) bits.push('written output');
    return '<li class="unit-row' + (done ? ' is-done' : '') + '">' +
      '<span class="unit-num">' + VT.esc(u.id) + '</span>' +
      '<a class="t" href="module.html?m=' + m.n + '&u=' + encodeURIComponent(u.id) + '">' +
        VT.esc(u.title) + '</a>' +
      '<span class="meta">' + VT.esc(bits.join(' · ')) + '</span>' +
      (done ? '<span class="done-word">done</span>' : '') +
      '</li>';
  }

  function moduleBlock(m) {
    const p = VT.moduleProgress(m);
    /* --mod is the module's decorative accent. Everything it tints also
       carries the module number in text beside it, so the hue is never the
       only channel. */
    return '<section class="mod" style="--mod:var(--mod-' + m.n + ')">' +
      '<div class="mod-head">' +
        '<span class="mod-glyph" aria-hidden="true">' + m.glyph + '</span>' +
        '<span class="mod-num">Module ' + m.n + '</span>' +
        '<h2>' + VT.esc(m.title) + '</h2>' +
        '<span class="progress-row"><span class="meter"><i style="width:' +
          (p.frac * 100).toFixed(1) + '%"></i></span>' +
          '<span class="counter">' + p.done + ' / ' + p.total + '</span></span>' +
      '</div>' +
      '<p class="mod-goal">' + VT.fmt(m.goal) + '</p>' +
      '<p class="mod-summary">' + VT.fmt(m.summary) + '</p>' +
      '<div class="mod-chips"><span class="chip">' + VT.esc(m.week) + '</span>' +
        '<span class="chip">' + VT.esc(m.status) + '</span>' +
        (m.units.some(u => u.output) ? '<span class="chip">written output</span>' : '') +
        (p.done === p.total ? '<span class="chip done">complete</span>' : '') +
      '</div>' +
      '<ul class="units">' + m.units.map(u => unitRow(m, u)).join('') + '</ul>' +
      '</section>';
  }

  function draw() {
    document.querySelector('[data-modules]').innerHTML = C.modules.map(moduleBlock).join('');

    const p = VT.trackProgress();
    document.querySelector('[data-bar]').style.width = (p.frac * 100).toFixed(1) + '%';
    document.querySelector('[data-count]').textContent = p.done + ' / ' + p.total + ' units';

    const next = VT.nextUnit();
    document.querySelector('[data-next]').innerHTML = next
      ? 'Next: <a href="module.html?m=' + next.module.n + '&u=' + encodeURIComponent(next.unit.id) +
        '">' + VT.esc(next.unit.id + ' ' + next.unit.title) + '</a>'
      : 'Every unit complete.';

    /* The certificate is a visible, locked node — a real gate on real state,
       never a hidden feature. */
    const open = p.total > 0 && p.done === p.total;
    document.querySelector('[data-gate]').className = 'gate card' + (open ? ' open' : '');
    document.querySelector('[data-gate]').innerHTML =
      '<span class="lock" aria-hidden="true">' + (open ? '✦' : '⌂') + '</span>' +
      '<div><h3>Certificate of completion</h3>' +
      '<p>' + (open
        ? 'Unlocked. Ask your facilitator to issue it &mdash; the platform records completion, it does not mint certificates.'
        : 'Locked until every unit is complete, including the capstone. ' +
          (p.total - p.done) + ' remaining.') +
      '</p></div>';
  }

  draw();
  VT.onChange(draw);
}
