/* memo-store.js — the one owner of the memo drafts.

   The desk and the notebook are two surfaces onto the same writing, so the
   text lives here and neither of them keeps a copy. A notebook memo block
   reads and writes through this; deleting that block removes the view, never
   the draft.

   Shape: { <slotId>: {audience, decision, falsifier, title, body}, _updatedAt }

   Trap: the stamp shares the object with the slot ids, so anything that walks
   the store must skip keys starting with "_". Slot ids never do.

   Trap: write() debounces the localStorage hit but notifies immediately, so a
   second surface repaints on the keystroke rather than 300ms behind it.

   Load BEFORE memo-desk.js, notebook.js and sync.js — all three read it.

   Trap: this file is on two loaders — the site chrome carries it on every
   page (the notebook's memo block and sync.js both read it), and the desk
   page's ordered list carries it again so it is provably there before
   memo-desk.js. Running the factory twice would hand the second surface a
   second store with none of the first's listeners, so the module keeps the
   instance it already published. */

"use strict";

window.VTMemoStore = window.VTMemoStore || (function () {

  const KEY = 'xlab-verification-memo-desk.v1';
  const SAVE_MS = 300;
  const FIELDS = ['audience', 'decision', 'falsifier', 'title', 'body'];

  let timer = null;
  const listeners = [];

  /* Memory is authoritative; localStorage is where it is kept. The write is
     debounced but every read goes to this object, so a read immediately after
     a write sees the write — reading through to storage would lag it by
     SAVE_MS and quietly report an empty draft. */
  let cache = (function () {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  })();

  function raw() { return cache; }

  function flush() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(cache)); }
      catch (e) { /* quota or private mode — the draft stays in this page */ }
    }, SAVE_MS);
  }

  /* Another tab, or sync.js adopting the account copy. Re-read rather than
     merge: last write wins, exactly as the account sync does. */
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    try { cache = JSON.parse(e.newValue) || {}; } catch (err) { cache = {}; }
    notify(null);
  });

  function notify(slotId) {
    listeners.forEach(function (fn) {
      try { fn(slotId); } catch (e) { /* one bad listener must not stop the rest */ }
    });
  }

  /* Every slot that carries anything, stamp excluded. */
  function all() {
    const store = raw();
    const out = {};
    Object.keys(store).forEach(function (k) {
      if (k.charAt(0) !== '_') out[k] = store[k];
    });
    return out;
  }

  function read(slotId) {
    const d = raw()[slotId];
    if (!d) return null;
    const out = {};
    FIELDS.forEach(function (f) { out[f] = d[f] || ''; });
    return out;
  }

  function has(slotId) {
    const d = raw()[slotId];
    return !!d && FIELDS.some(function (f) { return (d[f] || '').trim(); });
  }

  /* Partial writes are fine: pass only the fields that changed. An entry with
     nothing left in it is dropped rather than stored empty, so hasDraft and
     the rail count agree with what the learner can see. */
  function write(slotId, fields) {
    const store = raw();
    const d = store[slotId] || {};
    Object.keys(fields).forEach(function (f) {
      if (FIELDS.indexOf(f) !== -1) d[f] = fields[f];
    });
    const empty = FIELDS.every(function (f) { return !(d[f] || '').trim(); });
    if (empty) delete store[slotId]; else store[slotId] = d;
    store._updatedAt = Date.now();
    flush();
    notify(slotId);
  }

  function clear(slotId) {
    const store = raw();
    delete store[slotId];
    store._updatedAt = Date.now();
    flush();
    notify(slotId);
  }

  function onChange(fn) { listeners.push(fn); }

  /* A slot's human label, when data/memos.js is on the page. The notebook is
     loaded on pages that do not carry the memo list, so this has to degrade to
     the raw id rather than assume. */
  function label(slotId) {
    const slots = window.VERIFICATION_MEMOS || [];
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].id === slotId) return slots[i].title;
    }
    return slotId;
  }

  function unit(slotId) {
    const slots = window.VERIFICATION_MEMOS || [];
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].id === slotId) return slots[i].unit;
    }
    return '';
  }

  return {
    KEY: KEY,
    FIELDS: FIELDS,
    all: all,
    read: read,
    has: has,
    write: write,
    clear: clear,
    onChange: onChange,
    label: label,
    unit: unit,
  };

})();

/* Same announcement platform.js makes, and for the same reason: sync.js
   subscribes to this store and cannot know which of the two loaders on these
   pages got here first. */
try { window.dispatchEvent(new Event('vt-ready')); } catch (e) { /* ancient browser */ }
