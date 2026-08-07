/* highlight.js — mark a passage and find it marked when you come back.

   Exposes window.VTHighlight = { supported, add, count }. The selection
   toolbar (SelectionActions) offers "Highlight" and calls add(); this file
   owns the store, the painting and removal.

   Painting is the CSS Custom Highlight API (::highlight(vt-hl) in
   theme.css), never a DOM edit: the reading column belongs to React, and a
   <mark> spliced into it would be unwound or duplicated by the next render.
   Where the API is missing, `supported` is false and the toolbar simply does
   not offer the action — a highlighter that half-works is worse than none.

   A highlight is stored as its own words plus a run of context either side
   (the W3C text-quote idea): { text, prefix, suffix }, keyed by pathname in
   one localStorage value, vt-highlights.v1. Re-anchoring walks the reading
   column's text and finds prefix+text+suffix, falling back to the bare
   text. sync.js carries the store to the account like the notebook.

   Trap: ranges die when React replaces text nodes (a router.refresh, the
   parts reader rechunking). A MutationObserver repaints from the store —
   cheap, because painting mutates nothing, so repainting can never feed the
   observer that triggered it.

   Trap: removal cannot hang on the toolbar — a click on a painted passage
   has a collapsed selection, so no toolbar appears. A document click listener
   offers "Remove highlight" when the caret under the pointer falls inside a
   stored range, and must ignore presses inside any floating UI or its own
   click would land on the thing it just tore down. */

"use strict";

(function () {

  const STORE = 'vt-highlights.v1';
  const NAME = 'vt-hl';
  const CONTEXT = 32;

  const supported =
    typeof CSS !== 'undefined' && 'highlights' in CSS &&
    typeof Highlight === 'function';

  /* ---------- store ---------- */

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (raw && typeof raw === 'object' && raw.pages) return raw;
    } catch (e) { /* fresh start */ }
    return { updatedAt: 0, pages: {} };
  }

  function write(data) {
    data.updatedAt = Date.now();
    try { localStorage.setItem(STORE, JSON.stringify(data)); }
    catch (e) { /* private mode / quota — the paint this session still holds */ }
    /* Same-tab writes fire no storage event, and a highlight should reach
       the account when it is made, not when the tab closes — sync.js
       listens for this and pushes. */
    try { window.dispatchEvent(new CustomEvent('vt-highlights-change')); }
    catch (e) { /* an ancient browser without CustomEvent syncs on pagehide */ }
  }

  function pageList(data) {
    return data.pages[location.pathname] || [];
  }

  /* ---------- the reading column as one string ---------- */

  function snapshot() {
    const root = document.querySelector('main');
    if (!root) return null;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        const p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest('script, style, textarea')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const entries = [];
    let text = '';
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      entries.push({ node: n, start: text.length });
      text += n.nodeValue;
    }
    return { entries: entries, text: text };
  }

  function domPos(snap, offset, atEnd) {
    for (let i = 0; i < snap.entries.length; i++) {
      const e = snap.entries[i];
      const len = e.node.nodeValue.length;
      if (offset < e.start + len || (atEnd && offset === e.start + len)) {
        return { node: e.node, offset: offset - e.start };
      }
    }
    const last = snap.entries[snap.entries.length - 1];
    return last ? { node: last.node, offset: last.node.nodeValue.length } : null;
  }

  function stringOffset(snap, node, nodeOffset) {
    for (let i = 0; i < snap.entries.length; i++) {
      if (snap.entries[i].node === node) return snap.entries[i].start + nodeOffset;
    }
    return -1;
  }

  /* ---------- painting ---------- */

  /* The stored entry each painted range came from, for removal. */
  let painted = [];

  function paint() {
    if (!supported) return;
    painted = [];
    const items = pageList(read());
    if (!items.length) { CSS.highlights.delete(NAME); return; }
    const snap = snapshot();
    if (!snap) return;
    const ranges = [];
    items.forEach(function (h) {
      let start = -1;
      const wrapped = snap.text.indexOf(h.prefix + h.text + h.suffix);
      if (wrapped >= 0) start = wrapped + h.prefix.length;
      else start = snap.text.indexOf(h.text);
      if (start < 0) return;   // the passage left the page; keep the record
      const a = domPos(snap, start, false);
      const b = domPos(snap, start + h.text.length, true);
      if (!a || !b) return;
      const r = document.createRange();
      r.setStart(a.node, a.offset);
      r.setEnd(b.node, b.offset);
      ranges.push(r);
      painted.push({ id: h.id, range: r });
    });
    if (ranges.length) {
      const hl = new Highlight();
      ranges.forEach(function (r) { hl.add(r); });
      CSS.highlights.set(NAME, hl);
    } else {
      CSS.highlights.delete(NAME);
    }
  }

  /* ---------- creating ---------- */

  function add() {
    if (!supported) return false;
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return false;
    const range = sel.getRangeAt(0);
    const snap = snapshot();
    if (!snap) return false;
    const start = stringOffset(snap, range.startContainer, range.startOffset);
    const end = stringOffset(snap, range.endContainer, range.endOffset);
    if (start < 0 || end <= start) return false;
    const data = read();
    const list = data.pages[location.pathname] || (data.pages[location.pathname] = []);
    list.push({
      id: 'h' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
      text: snap.text.slice(start, end),
      prefix: snap.text.slice(Math.max(0, start - CONTEXT), start),
      suffix: snap.text.slice(end, end + CONTEXT),
      at: Date.now()
    });
    write(data);
    paint();
    return true;
  }

  function removeById(id) {
    const data = read();
    const list = pageList(data).filter(function (h) { return h.id !== id; });
    if (list.length) data.pages[location.pathname] = list;
    else delete data.pages[location.pathname];
    write(data);
    paint();
  }

  /* ---------- the add button ---------- */

  /* Raising "Highlight" over a selection is the selection toolbar's job
     (SelectionActions): it calls add() below when CSS.highlights exists.
     This file used to do it from its own mouseup listener, which is why a
     phone adjusting a selection by its handles — a gesture that delivers no
     mouse event to the page — was offered nothing.

     Removal is a different gesture and stays here: it hangs off a click on
     painted text, where the selection is collapsed and the toolbar never
     appears. */

  /* ---------- removal strip ---------- */

  let strip = null;
  function dropStrip() { if (strip) { strip.remove(); strip = null; } }

  function caretAt(x, y) {
    if (document.caretPositionFromPoint) {
      const p = document.caretPositionFromPoint(x, y);
      return p ? { node: p.offsetNode, offset: p.offset } : null;
    }
    if (document.caretRangeFromPoint) {
      const r = document.caretRangeFromPoint(x, y);
      return r ? { node: r.startContainer, offset: r.startOffset } : null;
    }
    return null;
  }

  document.addEventListener('click', function (ev) {
    if (!supported) return;
    if (ev.target && ev.target.closest &&
        ev.target.closest('.hl-strip, .vocab-card, [role="toolbar"], .nb-root, a, button')) return;
    dropStrip();
    const sel = document.getSelection();
    if (sel && !sel.isCollapsed) return;   // a real selection belongs to the other strips
    const c = caretAt(ev.clientX, ev.clientY);
    if (!c || c.node.nodeType !== 3) return;
    const hit = painted.find(function (p) {
      const r = p.range;
      try { return r.isPointInRange(c.node, c.offset); }
      catch (e) { return false; }
    });
    if (!hit) return;
    const rect = hit.range.getBoundingClientRect();
    strip = document.createElement('div');
    strip.className = 'hl-strip';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vocab-btn';
    btn.textContent = 'Remove highlight';
    btn.onclick = function () { removeById(hit.id); dropStrip(); };
    strip.appendChild(btn);
    strip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
    strip.style.left = Math.max(8, rect.left + window.scrollX) + 'px';
    document.body.appendChild(strip);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dropStrip();
  });

  /* ---------- keeping the paint alive ---------- */

  let timer = null;
  function armObserver() {
    const root = document.querySelector('main');
    if (!root) return;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(paint, 250);
    }).observe(root, { childList: true, characterData: true, subtree: true });
  }

  window.addEventListener('storage', function (e) {
    if (e.key === STORE) paint();
  });

  if (supported) {
    paint();
    armObserver();
  }

  window.VTHighlight = {
    supported: supported,
    add: add,
    count: function () { return pageList(read()).length; }
  };

})();
