/* Theme switch for the standalone verification pages. Three themes — day,
   night, high contrast — written to data-theme on <html> and remembered.

   Trap: the class has to land before first paint or the page flashes the
   wrong ground, so the head carries a tiny inline copy of the read step
   (see BOOT below) and this file only wires the control. Keep the two in
   agreement: same storage key, same attribute, same values.

   High contrast is never inferred from the system. prefers-color-scheme
   chooses between day and night only. */

(function () {
  var KEY = "xlab-verification-theme";
  var THEMES = ["light", "dark", "contrast"];

  var ICONS = {
    light:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    contrast:
      '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" stroke="none"/>',
  };
  var LABELS = {
    light: "Day",
    dark: "Night",
    contrast: "High contrast and larger text",
  };

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return THEMES.indexOf(v) > -1 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function current() {
    return (
      document.documentElement.getAttribute("data-theme") ||
      stored() ||
      systemTheme()
    );
  }

  /* Phones get one button instead of three, and this is the query that says
     so — it has to match the max-width the stylesheet collapses the switch
     at, or the control and its semantics disagree.

     Three 44px segments plus the brand overflow a phone header by about
     150px, which broke the brand onto a line of its own with the controls
     floating under it — the exact layout .header-right's rule says must not
     happen. The width has to come from somewhere and the tap floor is not
     negotiable, so the three segments become one.

     The switch is drawn as radios everywhere there is room for them, for the
     reason written over .theme-switch: a cycling control usually hides which
     of the three is active. The collapsed button answers that by showing the
     ACTIVE theme's icon rather than the next one's, and by naming both in its
     label — "Display mode: Day. Switch to Night." */
  var narrow = window.matchMedia
    ? window.matchMedia("(max-width: 720px)")
    : null;

  function collapsed() {
    return !!narrow && narrow.matches;
  }

  function nextTheme(theme) {
    var i = THEMES.indexOf(theme);
    return THEMES[(i < 0 ? 0 : i + 1) % THEMES.length];
  }

  function apply(theme) {
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    // The native Verification palette uses data-theme; app chrome and shadcn
    // use Tailwind's classes. Keep both surfaces on the selected theme.
    root.classList.toggle("dark", theme !== "light");
    root.classList.toggle("contrast", theme === "contrast");
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      /* private mode */
    }
    var group = document.querySelector(".theme-switch");
    if (!group) return;
    group.querySelectorAll("button[role='radio']").forEach(function (b) {
      b.setAttribute("aria-checked", String(b.dataset.theme === theme));
    });
    var cycle = group.querySelector(".theme-cycle");
    if (cycle) {
      var after = nextTheme(theme);
      var label = "Display mode: " + LABELS[theme] + ". Switch to " + LABELS[after] + ".";
      cycle.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[theme] + "</svg>";
      cycle.dataset.theme = theme;
      cycle.setAttribute("aria-label", label);
      cycle.setAttribute("title", label);
    }
  }

  /* A radiogroup is only a radiogroup while its radios are on screen. When the
     stylesheet collapses the switch the radios are display:none — out of the
     accessibility tree — and what is left is one ordinary button, so the
     container is announced as a plain group instead of a set of three
     choices nobody can reach. Re-run on viewport change: a rotation crosses
     the breakpoint. */
  function syncGrouping() {
    var group = document.querySelector(".theme-switch");
    if (!group) return;
    group.setAttribute("role", collapsed() ? "group" : "radiogroup");
  }

  function mount() {
    var group = document.querySelector(".theme-switch");
    if (!group) return;
    if (group.dataset.vtThemeMounted === "true") {
      syncGrouping();
      apply(current());
      return;
    }
    group.setAttribute("aria-label", "Display mode");
    group.innerHTML =
      THEMES.map(function (t) {
        return (
          '<button type="button" role="radio" data-theme="' +
          t +
          '" aria-checked="false"' +
          ' aria-label="' +
          LABELS[t] +
          '" title="' +
          LABELS[t] +
          '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          ICONS[t] +
          "</svg></button>"
        );
      }).join("") +
      '<button type="button" class="theme-cycle"></button>';
    group.addEventListener("click", function (e) {
      if (e.target.closest(".theme-cycle")) {
        apply(nextTheme(current()));
        return;
      }
      var b = e.target.closest("button[role='radio']");
      if (b) apply(b.dataset.theme);
    });
    group.dataset.vtThemeMounted = "true";
    syncGrouping();
    if (narrow) {
      narrow.addEventListener("change", function () {
        syncGrouping();
      });
    }
    apply(current());
  }

  // The system preference only moves the page while the learner has not picked
  // a theme — once they have, their choice outranks the OS.
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        if (!stored()) apply(systemTheme());
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
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
