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
   do not add a merge that could resurrect a unit the learner un-completed.
   The route enforces the same rule at its end — a push carrying an older
   stamp than the account holds is refused with 409, and the tab keeps its own
   copy until its next load, where adopting is safe.

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
  const PUSH_MS = 1200;

  let signedIn = false;
  let pushTimer = null;
  /* Settles when the opening GET has been answered, so anything that has to
     push before the page goes away can wait for the answer instead of racing
     it. A reset in the first second of a page's life is otherwise pushed by a
     tab that does not yet know it is signed in. */
  let ready = null;

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
      // The newest edit any store has seen. The notebook, the highlights, the
      // memo desk and the progress store each carry one for the whole store;
      // progress ALSO carries a timestamp per completed unit, and those are
      // still read so a store written before platform.js began stamping
      // itself still dates itself by its newest completion.
      updatedAt: Math.max(
        notebook && notebook.updatedAt ? notebook.updatedAt : 0,
        highlights && highlights.updatedAt ? highlights.updatedAt : 0,
        memos && memos._updatedAt ? memos._updatedAt : 0,
        progress && progress.updatedAt ? Number(progress.updatedAt) || 0 : 0,
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

  /* One send. A 409 is the route refusing a document older than the one the
     account holds — not an error to report: this tab keeps writing to its own
     stores and adopts the account's copy on its next load, which is the only
     moment swapping the stores out is safe. */
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
          e.key === HIGHLIGHTS_KEY || e.key === MEMO_KEY) push();
    });
    // Same-tab highlight writes fire no storage event; highlight.js
    // announces them so a mark reaches the account when it is made.
    window.addEventListener('vt-highlights-change', push);
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

  ready = fetch(URL_STATE, { headers: { Accept: 'application/json' } })
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
