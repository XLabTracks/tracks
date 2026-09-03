/* sync.js — puts progress, the notebook, memo drafts and the Field Map on the
   account when there is one.

   These pages have no server session of their own, so they ask
   /api/verification/state. Signed in: every store independently takes its
   newer copy, and every later change is pushed. Signed out: 401, and the
   pages carry on with localStorage exactly as before. Both are supported
   modes — signed out is not an error state and must never be reported as one.

   Load AFTER platform.js, memo-store.js and notebook.js: it reads the stores
   they own.

   Trap: adopting server state means writing localStorage and then telling the
   page to repaint. The stores are read once into module scope by their
   owners, so a raw localStorage write is invisible until reload — that is why
   this reloads on adopt rather than patching their internals.

   Trap: last-write-wins is PER STORE, not for the enclosing document. A new
   Field Map must not make an old notebook win along with it. The route uses
   the same per-store clocks in a compare-and-swap loop, so concurrent tabs
   converge instead of replacing one another's unrelated work.

   Trap: every store has to date itself, removals included. Deriving the date
   from the newest unit stamp alone made a reset look OLDER than the progress
   it had just cleared, and the account then put it back; platform.js stamps
   the progress store itself for exactly that reason. */

"use strict";

(function () {

  const URL_STATE = '/api/verification/state';
  const PROGRESS_KEY = 'vt-progress';
  const NOTEBOOK_KEY = 'xlab-verification-notebook.v1';
  const HIGHLIGHTS_KEY = 'vt-highlights.v1';
  const MEMO_KEY = 'xlab-verification-memo-desk.v1';
  const FIELD_MAP_KEY = 'vt-field-map:v1';
  const WIDGET_STAMPS_KEY = 'vt-widget-stamps.v1';
  const PUSH_MS = 1200;
  const STORES = [
    { name: 'progress', key: PROGRESS_KEY },
    { name: 'notebook', key: NOTEBOOK_KEY },
    { name: 'highlights', key: HIGHLIGHTS_KEY },
    { name: 'memos', key: MEMO_KEY },
    { name: 'fieldMap', key: FIELD_MAP_KEY },
    { name: 'widgets', key: WIDGET_STAMPS_KEY }
  ];

  let signedIn = false;
  let pushTimer = null;
  /* Settles when the opening GET has been answered, so anything that has to
     push before the page goes away can wait for the answer instead of racing
     it. A reset in the first second of a page's life is otherwise pushed by a
     tab that does not yet know it is signed in. */
  let ready = null;

  function positiveStamp(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  /* The widgets store is a map of storage key -> { value, updatedAt }: every
     app widget that writes through kit/stored.ts stamps its key, and the
     map is composed from those stamps on read. Merged per key on both ends,
     so two widgets edited on two devices both survive. */
  function widgetsStamp(value) {
    if (!value || typeof value !== 'object') return 0;
    let newest = 0;
    Object.keys(value).forEach(function (key) {
      const entry = value[key];
      if (entry && typeof entry === 'object') newest = Math.max(newest, positiveStamp(entry.updatedAt));
    });
    return newest;
  }

  function readWidgets() {
    const stamps = getLocal(WIDGET_STAMPS_KEY);
    const out = {};
    if (!stamps || typeof stamps !== 'object') return out;
    Object.keys(stamps).forEach(function (key) {
      const stamp = positiveStamp(stamps[key]);
      if (!stamp) return;
      let value = null;
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) value = JSON.parse(raw);
      } catch (e) { return; }
      out[key] = { value: value, updatedAt: stamp };
    });
    return out;
  }

  function adoptNewerWidgets(server, local) {
    if (!server || typeof server !== 'object') return false;
    const stamps = getLocal(WIDGET_STAMPS_KEY) || {};
    let adopted = false;
    Object.keys(server).forEach(function (key) {
      const entry = server[key];
      const stamp = entry && typeof entry === 'object' ? positiveStamp(entry.updatedAt) : 0;
      if (!stamp) return;
      const mine = local && local[key] ? positiveStamp(local[key].updatedAt) : 0;
      if (stamp <= mine) return;
      try {
        if (entry.value === null || entry.value === undefined) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(entry.value));
        stamps[key] = stamp;
        adopted = true;
      } catch (e) { /* quota or private mode — the account copy stays authoritative */ }
    });
    if (adopted) {
      try { localStorage.setItem(WIDGET_STAMPS_KEY, JSON.stringify(stamps)); } catch (e) { /* as above */ }
    }
    return adopted;
  }

  function storeStamp(name, value) {
    if (name === 'widgets') return widgetsStamp(value);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return 0;
    if (name === 'memos') return positiveStamp(value._updatedAt);
    if (name !== 'progress') return positiveStamp(value.updatedAt);
    let newest = positiveStamp(value.updatedAt);
    if (value.units && typeof value.units === 'object') {
      Object.keys(value.units).forEach(function (key) {
        newest = Math.max(newest, positiveStamp(value.units[key]));
      });
    }
    return newest;
  }

  function getLocal(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch (e) { return null; }
  }

  function readLocal() {
    const document = { version: 2, stamps: {}, updatedAt: 0 };
    STORES.forEach(function (store) {
      const value = store.name === 'widgets' ? readWidgets() : getLocal(store.key);
      const stamp = storeStamp(store.name, value);
      document[store.name] = value;
      document.stamps[store.name] = stamp;
      document.updatedAt = Math.max(document.updatedAt, stamp);
    });
    return document;
  }

  function writeStore(store, value) {
    try {
      if (value === null || value === undefined) localStorage.removeItem(store.key);
      else localStorage.setItem(store.key, JSON.stringify(value));
      return true;
    } catch (e) {
      // Quota or private mode — the account copy stays authoritative.
      return false;
    }
  }

  function normalizedServer(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) return null;
    const current = state.version === 2;
    const supplied = state.stamps && typeof state.stamps === 'object' ? state.stamps : {};
    const legacy = positiveStamp(state.updatedAt);
    const document = { version: 2, stamps: {}, updatedAt: 0 };
    STORES.forEach(function (store) {
      const value = state[store.name] === undefined ? null : state[store.name];
      const direct = positiveStamp(supplied[store.name]);
      const derived = storeStamp(store.name, value);
      const stamp = Math.max(direct, derived, !current && value !== null && !direct && !derived ? legacy : 0);
      document[store.name] = value;
      document.stamps[store.name] = stamp;
      document.updatedAt = Math.max(document.updatedAt, stamp);
    });
    return document;
  }

  function adoptNewerStores(server, local) {
    let adopted = false;
    STORES.forEach(function (store) {
      if (store.name === 'widgets') {
        adopted = adoptNewerWidgets(server.widgets, local.widgets) || adopted;
        return;
      }
      if (server.stamps[store.name] > local.stamps[store.name]) {
        adopted = writeStore(store, server[store.name]) || adopted;
      }
    });
    return adopted;
  }

  /* One send. A 409 means five compare-and-swap attempts all collided; the
     debounce or unload retry will offer the same per-store document again. */
  function send() {
    return fetch(URL_STATE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(readLocal())
    }).catch(function () { /* offline: the browser copy is still correct */ });
  }

  function push() {
    if (!signedIn) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(send, PUSH_MS);
  }

  /* Send what is in the stores NOW, and resolve when the account has it.
     The debounce exists so typing does not become a request per keystroke; a
     caller about to destroy the page (platform.js's reset, which reloads) has
     to be able to skip it, or the change it just made never leaves the tab.

     It waits on the opening GET rather than on `signedIn`, because a tab that
     has not heard back yet is not a signed-out tab. */
  function flush() {
    clearTimeout(pushTimer);
    return Promise.resolve(ready).then(function () {
      return signedIn ? send() : undefined;
    });
  }

  window.VTSync = { push: push, flush: flush };

  /* Subscribe to the two stores that publish a hook — whenever they turn up.
     This file comes from the site chrome and they come from the page's own
     ordered loader, so neither side is reliably first; asking once, at the
     moment the opening GET happened to resolve, is how a completed unit ended
     up reaching the account only when the tab closed. Both stores announce
     themselves with vt-ready, and this is idempotent, so a store that was
     already there is subscribed once and the event changes nothing. */
  let armedProgress = false;
  let armedMemos = false;
  function armStores() {
    if (!armedProgress && window.VT && typeof window.VT.onChange === 'function') {
      window.VT.onChange(push);
      armedProgress = true;
    }
    if (!armedMemos && window.VTMemoStore) {
      window.VTMemoStore.onChange(push);
      armedMemos = true;
    }
    return armedProgress && armedMemos;
  }

  /* Anything that writes either store also announces it, so this does not have
     to poll. VT.onChange covers progress; the notebook has no listener hook,
     so its writes are caught by the storage event, by the panel's input
     events, and by page unload. */
  function arm() {
    if (!armStores()) window.addEventListener('vt-ready', armStores);
    window.addEventListener('storage', function (e) {
      if (e.key === PROGRESS_KEY || e.key === NOTEBOOK_KEY ||
          e.key === HIGHLIGHTS_KEY || e.key === MEMO_KEY ||
          e.key === FIELD_MAP_KEY || e.key === WIDGET_STAMPS_KEY) push();
    });
    // App widgets write in this tab through kit/stored.ts, which announces
    // every committed write; the stamps map is what the storage event sees
    // from other tabs.
    window.addEventListener('vt-widget-change', push);
    // Same-tab highlight writes fire no storage event; highlight.js
    // announces them so a mark reaches the account when it is made.
    window.addEventListener('vt-highlights-change', push);
    // The native Field Map writes in this tab, so the browser's `storage`
    // event does not fire. Its widget announces a committed local write.
    window.addEventListener('vt-field-map-change', push);
    /* The notebook writes on a debounce of its own; catch the last edit before
       the tab goes away, when a pending push would otherwise be lost.

       sendBeacon can only POST, which is why the route answers POST as well as
       PUT: it used to answer only PUT, so this — the one path that carries the
       last edit before a tab closes — was a 405 every time.

       Belt and braces, in that order: the beacon is the only thing a browser
       promises to deliver after the page is gone, and a keepalive fetch is the
       fallback where it is refused (a beacon over the browser's queue limit
       returns false). Both are best-effort by design; anything that must not
       be lost calls flush() before it destroys the page. */
    window.addEventListener('pagehide', function () {
      if (!signedIn) return;
      // Debounced stores get one synchronous chance to commit their latest
      // in-memory value before this handler snapshots localStorage.
      window.dispatchEvent(new CustomEvent('vt-before-account-sync'));
      const body = JSON.stringify(readLocal());
      let sent = false;
      try {
        sent = navigator.sendBeacon(URL_STATE, new Blob([body], { type: 'application/json' }));
      } catch (e) { /* no beacon here */ }
      if (sent) return;
      try {
        fetch(URL_STATE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true
        }).catch(function () { /* gone: the browser copy is still correct */ });
      } catch (e) { /* keepalive refused too (over 64KB): nothing more to try */ }
    });
    // The notebook panel is the one surface with no change event of its own.
    document.addEventListener('input', function (e) {
      if (e.target && e.target.closest && e.target.closest('.nb-panel')) push();
    });
  }

  /* The account guard (src/lib/verification/device-storage.ts) runs first on
     every page: it purges another account's — or a signed-out session's —
     learner work from this device before anything here could adopt it or
     push it into the wrong account. Wait for it; a page without the guard
     times out into the old behaviour rather than never syncing. */
  function whenAccountSettled() {
    if (window.__tracksAccountSettled) return Promise.resolve();
    return new Promise(function (resolve) {
      let done = false;
      function finish() { if (done) return; done = true; resolve(); }
      window.addEventListener('tracks-account-settled', finish, { once: true });
      setTimeout(finish, 4000);
    });
  }

  ready = whenAccountSettled()
    .then(function () {
      return fetch(URL_STATE, { headers: { Accept: 'application/json' } });
    })
    .then(function (r) {
      if (r.status === 401) return null;   // signed out: the local copy is it
      // 503 is the route saying its table has not been migrated yet. Same
      // answer as signed out: this browser is the copy, and saying nothing
      // is right — it is not the learner's problem to solve.
      return r.ok ? r.json() : null;
    })
    .then(function (res) {
      if (!res || !res.signedIn) return;
      signedIn = true;

      const local = readLocal();
      const server = normalizedServer(res.data);

      if (server && adoptNewerStores(server, local)) {
        /* The stores were read into module scope before this resolved, so the
           page is showing the old copy until it is rebuilt. Reload at most
           once per tab: if anything above ever miscompares again, the page
           degrades to slightly stale rather than to a reload loop. */
        let reload = false;
        try {
          if (!sessionStorage.getItem('vt-sync-adopted')) {
            sessionStorage.setItem('vt-sync-adopted', '1');
            reload = true;
          }
        } catch (e) { /* private mode: do not risk a reload loop */ }
        if (reload) {
          location.reload();
          return;
        }
      }
      // Browser is newer (or the account has nothing yet): seed the account.
      push();
      arm();
    })
    .catch(function () { /* no network: stay local, say nothing */ });

})();
