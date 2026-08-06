/* sync.js — puts progress, the notebook and the memo drafts on the account
   when there is one.

   These pages have no server session of their own, so they ask
   /api/verification/state. Signed in: the newer of server and browser wins,
   and every later change is pushed. Signed out: 401, and the pages carry on
   with localStorage exactly as before. Both are supported modes — signed out
   is not an error state and must never be reported as one.

   Load AFTER platform.js, memo-store.js and notebook.js: it reads the stores
   they own.

   Trap: adopting server state means writing localStorage and then telling the
   page to repaint. The stores are read once into module scope by their
   owners, so a raw localStorage write is invisible until reload — that is why
   this reloads on adopt rather than patching their internals.

   Trap: last-write-wins is on the client's own updatedAt. Two tabs of the
   same person are the only realistic conflict, so the newer edit is right;
   do not add a merge that could resurrect a unit the learner un-completed. */

"use strict";

(function () {

  const URL_STATE = '/api/verification/state';
  const PROGRESS_KEY = 'vt-progress';
  const NOTEBOOK_KEY = 'xlab-verification-notebook.v1';
  const HIGHLIGHTS_KEY = 'vt-highlights.v1';
  const MEMO_KEY = 'xlab-verification-memo-desk.v1';
  const PUSH_MS = 1200;

  let signedIn = false;
  let pushTimer = null;

  function readLocal() {
    function get(k) {
      try { return JSON.parse(localStorage.getItem(k) || 'null'); }
      catch (e) { return null; }
    }
    const progress = get(PROGRESS_KEY);
    const notebook = get(NOTEBOOK_KEY);
    const highlights = get(HIGHLIGHTS_KEY);
    const memos = get(MEMO_KEY);
    return {
      progress: progress,
      notebook: notebook,
      highlights: highlights,
      memos: memos,
      // The newest edit any store has seen. Progress carries a timestamp per
      // completed unit; the notebook, the highlights and the memo desk each
      // carry one for their whole store.
      updatedAt: Math.max(
        notebook && notebook.updatedAt ? notebook.updatedAt : 0,
        highlights && highlights.updatedAt ? highlights.updatedAt : 0,
        memos && memos._updatedAt ? memos._updatedAt : 0,
        progress && progress.units
          ? Object.keys(progress.units).reduce(function (m, k) {
              return Math.max(m, Number(progress.units[k]) || 0);
            }, 0)
          : 0
      )
    };
  }

  function writeLocal(state) {
    try {
      if (state.progress) localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
      if (state.notebook) localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(state.notebook));
      if (state.highlights) localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(state.highlights));
      if (state.memos) localStorage.setItem(MEMO_KEY, JSON.stringify(state.memos));
    } catch (e) { /* quota or private mode — the account copy stays authoritative */ }
  }

  function push() {
    if (!signedIn) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      const body = readLocal();
      fetch(URL_STATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(function () { /* offline: the browser copy is still correct */ });
    }, PUSH_MS);
  }

  /* Anything that writes either store also announces it, so this does not have
     to poll. VT.onChange covers progress; the notebook and the memo desk have
     no listener hook, so their writes are caught by the storage event, by
     VTMemoStore.onChange where the desk is mounted, and by page unload. */
  function arm() {
    if (window.VT && typeof window.VT.onChange === 'function') window.VT.onChange(push);
    if (window.VTMemoStore) window.VTMemoStore.onChange(push);
    window.addEventListener('storage', function (e) {
      if (e.key === PROGRESS_KEY || e.key === NOTEBOOK_KEY ||
          e.key === HIGHLIGHTS_KEY || e.key === MEMO_KEY) push();
    });
    // Same-tab highlight writes fire no storage event; highlight.js
    // announces them so a mark reaches the account when it is made.
    window.addEventListener('vt-highlights-change', push);
    // The notebook writes on a debounce of its own; catch the last edit before
    // the tab goes away, when a pending push would otherwise be lost.
    window.addEventListener('pagehide', function () {
      if (!signedIn) return;
      const body = JSON.stringify(readLocal());
      try { navigator.sendBeacon(URL_STATE, new Blob([body], { type: 'application/json' })); }
      catch (e) { /* sendBeacon is best-effort by design */ }
    });
    // The notebook panel is the one surface with no change event of its own.
    document.addEventListener('input', function (e) {
      if (e.target && e.target.closest && e.target.closest('.nb-panel')) push();
    });
  }

  fetch(URL_STATE, { headers: { Accept: 'application/json' } })
    .then(function (r) {
      if (r.status === 401) return null;   // signed out: the local copy is it
      return r.ok ? r.json() : null;
    })
    .then(function (res) {
      if (!res || !res.signedIn) return;
      signedIn = true;

      const local = readLocal();
      const server = res.data;
      /* Compare the client-derived stamp INSIDE the stored document, not the
         row's own updatedAt. The row is touched on every write, so it is
         always newer than the edit it holds — comparing against it would see
         the server as ahead on every load and reload forever. */
      const serverAt = server && Number(server.updatedAt) || 0;

      if (server && serverAt > local.updatedAt) {
        writeLocal(server);
        /* The stores were read into module scope before this resolved, so the
           page is showing the old copy until it is rebuilt. Reload at most
           once per tab: if anything above ever miscompares again, the page
           degrades to slightly stale rather than to a reload loop. */
        if (!sessionStorage.getItem('vt-sync-adopted')) {
          try { sessionStorage.setItem('vt-sync-adopted', '1'); } catch (e) { /* private mode */ }
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
