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
  /* What the menu prints. The full label above stays the accessible name on
     the row, so the mode still announces what it does to the type; printing
     it ran to two lines and made the panel taller than the choice warranted. */
  var SHORT = {
    light: "Day",
    dark: "Night",
    contrast: "High contrast",
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

     The objection written over .theme-switch — that a single control hides
     which of the three is active, and that none of them is an obvious "next"
     — is answered rather than overruled: the button shows the ACTIVE theme's
     icon, and pressing it opens all three named in full and marks the one in
     use, so nothing is guessed at and nothing is reached by repetition.
     Where there is room for the segments they stay. */
  var narrow = window.matchMedia
    ? window.matchMedia("(max-width: 720px)")
    : null;

  function collapsed() {
    return !!narrow && narrow.matches;
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
    group
      .querySelectorAll("button[role='radio'], button[role='menuitemradio']")
      .forEach(function (b) {
        b.setAttribute("aria-checked", String(b.dataset.theme === theme));
      });
    var trigger = group.querySelector(".theme-trigger");
    if (trigger) {
      var label = "Display mode: " + LABELS[theme];
      trigger.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[theme] + "</svg>";
      trigger.dataset.theme = theme;
      trigger.setAttribute("aria-label", label);
      trigger.setAttribute("title", label);
    }
  }

  /* A radiogroup is only a radiogroup while its radios are on screen. When the
     stylesheet collapses the switch the radios are display:none — out of the
     accessibility tree — and what is left is a button that owns a menu, so
     the container is announced as a plain group instead of a set of three
     choices nobody can reach. Re-run on viewport change: a rotation crosses
     the breakpoint. */
  function syncGrouping() {
    var group = document.querySelector(".theme-switch");
    if (!group) return;
    group.setAttribute("role", collapsed() ? "group" : "radiogroup");
    if (!collapsed()) closeMenu(false);
  }

  function menuParts() {
    var group = document.querySelector(".theme-switch");
    if (!group) return null;
    var trigger = group.querySelector(".theme-trigger");
    var menu = group.querySelector(".theme-menu");
    return trigger && menu ? { group: group, trigger: trigger, menu: menu } : null;
  }

  function menuOpen() {
    var p = menuParts();
    return !!p && p.trigger.getAttribute("aria-expanded") === "true";
  }

  function openMenu() {
    var p = menuParts();
    if (!p) return;
    p.trigger.setAttribute("aria-expanded", "true");
    p.menu.hidden = false;
    var checked = p.menu.querySelector("[aria-checked='true']") ||
      p.menu.querySelector("button");
    if (checked) checked.focus();
  }

  /* refocus is false when the menu is closing because the viewport grew or a
     press landed elsewhere: moving focus back to a button the reader has just
     left, or to one the stylesheet has since hidden, steals the caret. */
  function closeMenu(refocus) {
    var p = menuParts();
    if (!p || p.trigger.getAttribute("aria-expanded") !== "true") return;
    p.trigger.setAttribute("aria-expanded", "false");
    p.menu.hidden = true;
    if (refocus) p.trigger.focus();
  }

  function moveFocus(step) {
    var p = menuParts();
    if (!p) return;
    var items = [].slice.call(p.menu.querySelectorAll("button"));
    var at = items.indexOf(document.activeElement);
    var next = items[(at + step + items.length) % items.length];
    if (next) next.focus();
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
      '<button type="button" class="theme-trigger" aria-haspopup="menu"' +
      ' aria-expanded="false"></button>' +
      '<div class="theme-menu" role="menu" aria-label="Display mode" hidden>' +
      THEMES.map(function (t) {
        return (
          '<button type="button" role="menuitemradio" data-theme="' +
          t +
          '" aria-checked="false" aria-label="' +
          LABELS[t] +
          '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          ICONS[t] +
          "</svg><span>" +
          SHORT[t] +
          "</span></button>"
        );
      }).join("") +
      "</div>";

    group.addEventListener("click", function (e) {
      if (e.target.closest(".theme-trigger")) {
        if (menuOpen()) closeMenu(true);
        else openMenu();
        return;
      }
      var picked = e.target.closest("button[data-theme]");
      if (!picked) return;
      apply(picked.dataset.theme);
      if (picked.getAttribute("role") === "menuitemradio") closeMenu(true);
    });

    group.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOpen()) {
        e.stopPropagation();
        closeMenu(true);
        return;
      }
      if (!menuOpen() || !e.target.closest(".theme-menu")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveFocus(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveFocus(-1);
      }
    });

    /* pointerdown, not click: a press that starts outside should dismiss the
       menu before the thing under it activates, which is what a reader means
       by pressing past an open menu. Capture, because a handler on the way
       down can stop the bubble. */
    document.addEventListener(
      "pointerdown",
      function (e) {
        if (menuOpen() && !e.target.closest(".theme-switch")) closeMenu(false);
      },
      true
    );
    /* Tabbing out of the menu closes it; the check is deferred because at
       focusout time the new focus has not landed yet. */
    group.addEventListener("focusout", function () {
      setTimeout(function () {
        if (menuOpen() && !group.contains(document.activeElement)) {
          closeMenu(false);
        }
      }, 0);
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
