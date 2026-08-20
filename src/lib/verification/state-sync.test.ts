/**
 * The wiring between the course's plain-JS surfaces and the account.
 *
 * Every case here is a bug that shipped, and all of them shipped green: the
 * files were individually correct and the joins between them were not. A build
 * proves nothing about a page that never loads a script, a beacon whose verb
 * the route does not answer, or a reset whose push is not sent before the
 * reload. Nothing in vitest can drive a browser at these, so the joins are
 * asserted where they are written.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "../../..");
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

const MEMO_HOST = read("src/components/verification/memo-desk-host.tsx");
const CHROME = read("src/components/verification/site-chrome.tsx");
const SYNC = read("public/verification/sync.js");
const PLATFORM = read("public/verification/platform.js");
const ROUTE = read("src/app/api/verification/state/route.ts");

describe("the memo desk is mounted", () => {
  it("its host calls VTMemoDesk.mount", () => {
    // The desk publishes an entry point and mounts nothing itself. A page that
    // only loads the file gets no desk and no error — which is exactly how it
    // went unnoticed.
    expect(MEMO_HOST).toMatch(/\.mount\(/);
  });

  it("its host loads memo-store.js before memo-desk.js", () => {
    // memo-desk.js refuses to mount without the store. Order is the loader's
    // guarantee and the reason the desk's files do not go through next/script.
    const store = MEMO_HOST.indexOf('"memo-store.js"');
    const desk = MEMO_HOST.indexOf('"memo-desk.js"');
    expect(store, "memo-store.js is not in the desk's script list").toBeGreaterThan(-1);
    expect(desk, "memo-desk.js is not in the desk's script list").toBeGreaterThan(-1);
    expect(store).toBeLessThan(desk);
  });

  it("the site chrome carries the store on every page", () => {
    // The notebook's memo block and the account sync both read it away from
    // the desk. Without it the block reports the desk as "not loaded" and no
    // draft ever reaches the account.
    expect(CHROME).toContain("/verification/memo-store.js");
  });
});

describe("the account sync", () => {
  it("is answered on the verb sendBeacon can send", () => {
    // sendBeacon POSTs. A PUT-only route made the unload path — the one that
    // carries the last edit before a tab closes — a 405 every time.
    expect(SYNC).toContain("sendBeacon");
    expect(ROUTE).toMatch(/export async function POST\b/);
    expect(ROUTE).toMatch(/export async function PUT\b/);
  });

  it("dates the progress store by the store, not only by its units", () => {
    // Reset and un-complete take unit stamps away, so a document dated by its
    // newest unit went backwards in time exactly when it changed — and the
    // account's older copy then read as newer and put the progress back.
    expect(PLATFORM).toMatch(/state\.updatedAt = Date\.now\(\)/);
    expect(SYNC).toMatch(/name !== 'progress'[\s\S]*value\.updatedAt/);
    expect(SYNC).toMatch(/let newest = positiveStamp\(value\.updatedAt\)/);
  });

  it("carries the native Field Map in the same account document", () => {
    expect(SYNC).toContain("vt-field-map:v1");
    expect(SYNC).toContain("name: 'fieldMap'");
    expect(SYNC).toContain("vt-field-map-change");
  });

  it("compares and adopts every browser store independently", () => {
    expect(SYNC).toContain("version: 2");
    expect(SYNC).toContain("stamps");
    expect(SYNC).toMatch(/server\.stamps\[store\.name\] > local\.stamps\[store\.name\]/);
    expect(SYNC).toMatch(/adoptNewerStores/);
  });

  it("subscribes to the stores whenever they arrive, not only when it loads", () => {
    /* This file comes from the site chrome and the stores come from the
       page's own ordered loader, so asking for them once — at the moment the
       opening GET happened to resolve — subscribed to neither, and a
       completed unit reached the account only when the tab closed. */
    expect(read("public/verification/platform.js")).toContain("'vt-ready'");
    expect(read("public/verification/memo-store.js")).toContain("'vt-ready'");
    expect(SYNC).toMatch(/addEventListener\('vt-ready'/);
  });

  it("offers a flush, and reset waits for it before reloading", () => {
    expect(SYNC).toMatch(/window\.VTSync = \{[^}]*flush/);
    // Reloading straight after reset() raced the debounce and lost.
    const resetHandler = PLATFORM.slice(PLATFORM.indexOf("function armReset"));
    const flush = resetHandler.indexOf("syncThen");
    const reload = resetHandler.indexOf("location.reload()");
    expect(flush, "reset does not flush the sync").toBeGreaterThan(-1);
    expect(reload).toBeGreaterThan(-1);
    expect(flush).toBeLessThan(reload);
  });

  it("lets debounced stores commit before the unload snapshot", () => {
    expect(SYNC).toContain("vt-before-account-sync");
    expect(read("src/components/verification/widgets/field-map.tsx")).toContain(
      'addEventListener("vt-before-account-sync"',
    );
  });
});

describe("the state route", () => {
  it("merges stores inside an optimistic compare-and-swap loop", () => {
    expect(ROUTE).toContain("mergeVerificationStateDocuments");
    expect(ROUTE).toMatch(/updateManyAndReturn\([\s\S]*updatedAt: current\.updatedAt/);
    expect(ROUTE).toMatch(/409/);
  });

  it("limits the streamed request body by bytes", () => {
    expect(ROUTE).toContain("readLimitedBody");
    expect(ROUTE).not.toContain("request.text()");
  });

  it("degrades rather than throwing when its table is absent", () => {
    // The migration is applied by hand, so a deploy can carry this code
    // without it. Signed-out is already a supported mode for these pages;
    // "the account is not storing anything yet" behaves the same way.
    expect(ROUTE).toContain("isMissingTableError");
    expect(ROUTE).toMatch(/503/);
  });
});
