/* Theme switch for the standalone verification pages. Three themes — day,
   night, high contrast — written to data-theme on <html> and remembered.

   Trap: the class has to land before first paint or the page flashes the
   wrong ground, so the head carries a tiny inline copy of the read step
   (see BOOT below) and this file only wires the control. Keep the two in
   agreement: same storage key, same attribute, same values.

   High contrast is never inferred from the system. prefers-color-scheme
   chooses between day and night only. */

(function () {
  var KEY = 'xlab-verification-theme';
  var THEMES = ['light', 'dark', 'contrast'];

  var ICONS = {
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" stroke="none"/>',
  };
  var LABELS = { light: 'Day', dark: 'Night', contrast: 'High contrast' };

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return THEMES.indexOf(v) > -1 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') || stored() || systemTheme();
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode */ }
    var group = document.querySelector('.theme-switch');
    if (!group) return;
    group.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.dataset.theme === theme));
    });
  }

  function mount() {
    var group = document.querySelector('.theme-switch');
    if (!group) return;
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', 'Colour theme');
    group.innerHTML = THEMES.map(function (t) {
      return (
        '<button type="button" role="radio" data-theme="' + t + '" aria-checked="false"' +
        ' aria-label="' + LABELS[t] + '" title="' + LABELS[t] + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[t] + '</svg></button>'
      );
    }).join('');
    group.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-theme]');
      if (b) apply(b.dataset.theme);
    });
    apply(current());
  }

  // The system preference only moves the page while the learner has not picked
  // a theme — once they have, their choice outranks the OS.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (!stored()) apply(systemTheme());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  /* The Next app renders the same switch on /tracks/verification, where there
     is no document load to hang mount() on — it calls this after its own
     render instead. Exposing it keeps one implementation of the switch rather
     than a React copy that has to be kept in step with this one.

     Trap: mount() is idempotent and re-reads the current theme, so calling it
     again after a client-side navigation is the intended use. */
  window.VT_THEME = { mount: mount, apply: apply, current: current };
})();
