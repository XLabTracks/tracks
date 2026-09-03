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
    expect(MEMO_HOST).toMatch(/\.mount\(/);
  });

  it("its host loads memo-store.js before memo-desk.js", () => {
    const store = MEMO_HOST.indexOf('"memo-store.js"');
    const desk = MEMO_HOST.indexOf('"memo-desk.js"');
    expect(store, "memo-store.js is not in the desk's script list").toBeGreaterThan(-1);
    expect(desk, "memo-desk.js is not in the desk's script list").toBeGreaterThan(-1);
    expect(store).toBeLessThan(desk);
  });

  it("the site chrome carries the store on every page", () => {
    expect(CHROME).toContain("/verification/memo-store.js");
  });
});

describe("the account sync", () => {
  it("is answered on the verb sendBeacon can send", () => {
    expect(SYNC).toContain("sendBeacon");
    expect(ROUTE).toMatch(/export async function POST\b/);
    expect(ROUTE).toMatch(/export async function PUT\b/);
  });

  it("dates the progress store by the store, not only by its units", () => {
    expect(PLATFORM).toMatch(/state\.updatedAt = Date\.now\(\)/);
    expect(SYNC).toMatch(/name !== 'progress'[\s\S]*value\.updatedAt/);
    expect(SYNC).toMatch(/let newest = positiveStamp\(value\.updatedAt\)/);
  });

  it("carries the native Field Map in the same account document", () => {
    expect(SYNC).toContain("vt-field-map:v1");
    expect(SYNC).toContain("name: 'fieldMap'");
    expect(SYNC).toContain("vt-field-map-change");
  });

  it("carries app widget state as a sixth store, merged key by key", () => {
    expect(SYNC).toContain("name: 'widgets'");
    expect(SYNC).toContain("vt-widget-stamps.v1");
    expect(SYNC).toMatch(/addEventListener\('vt-widget-change'/);
    expect(SYNC).toMatch(/adoptNewerWidgets/);
    expect(read("src/components/verification/kit/stored.ts")).toContain("vt-widget-change");
  });

  it("waits for the account guard before adopting or pushing", () => {
    expect(SYNC).toMatch(/whenAccountSettled\(\)[\s\S]*fetch\(URL_STATE/);
    expect(SYNC).toContain("tracks-account-settled");
    expect(read("src/components/layout/app-chrome.tsx")).toContain("AccountStorageGuard");
    const menu = read("src/components/layout/account-menu.tsx");
    const forget = menu.indexOf("forgetDevice()");
    const out = menu.indexOf("signOut()");
    expect(forget).toBeGreaterThan(-1);
    expect(out).toBeGreaterThan(forget);
  });

  it("compares and adopts every browser store independently", () => {
    expect(SYNC).toContain("version: 2");
    expect(SYNC).toContain("stamps");
    expect(SYNC).toMatch(/server\.stamps\[store\.name\] > local\.stamps\[store\.name\]/);
    expect(SYNC).toMatch(/adoptNewerStores/);
  });

  it("subscribes to the stores whenever they arrive, not only when it loads", () => {
    expect(read("public/verification/platform.js")).toContain("'vt-ready'");
    expect(read("public/verification/memo-store.js")).toContain("'vt-ready'");
    expect(SYNC).toMatch(/addEventListener\('vt-ready'/);
  });

  it("offers a flush, and reset waits for it before reloading", () => {
    expect(SYNC).toMatch(/window\.VTSync = \{[^}]*flush/);
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
    expect(ROUTE).toContain("isMissingTableError");
    expect(ROUTE).toMatch(/503/);
  });
});
