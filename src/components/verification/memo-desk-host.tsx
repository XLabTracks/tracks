"use client";

import { useCallback, useRef } from "react";

import { LegacyScripts } from "@/components/verification/legacy-scripts";
import { workSampleNote } from "@/lib/content/work-sample-note";
import {
  extractDocumentText,
  type ImportedDocument,
} from "@/lib/uploads/document-text";

type MemoDeskApi = {
  mount: (
    host: HTMLElement,
    opts?: { slots?: string[]; hash?: boolean },
  ) => unknown;
};

type DeskGlobals = {
  VTMemoDesk?: MemoDeskApi;
  VT_WORK_SAMPLE_NOTE?: string;
  VTDocImport?: { read: (file: File) => Promise<ImportedDocument> };
};

const PAGE_SCRIPTS = [
  "data/course.js",
  "data/skills.js",
  "data/memos.js",
  "data/chrome.js",
  "platform.js",
  "memo-store.js",
  "memo-desk.js",
];

const INLINE_SCRIPTS = ["data/memos.js", "memo-store.js", "memo-desk.js"];

export function MemoDeskHost({ slots }: { slots?: string[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const mount = useCallback(() => {
    const host = hostRef.current;
    if (!host || mounted.current) return;
    const runtime = window as unknown as DeskGlobals;
    const desk = runtime.VTMemoDesk;
    if (!desk) return;
    runtime.VT_WORK_SAMPLE_NOTE = workSampleNote;
    runtime.VTDocImport = { read: (file) => extractDocumentText(file) };
    mounted.current = true;
    desk.mount(host, slots ? { slots, hash: false } : undefined);
  }, [slots]);

  return (
    <>
      <link
        rel="stylesheet"
        href="/verification/platform.css"
        precedence="high"
      />
      <link
        rel="stylesheet"
        href="/verification/memo-desk.css"
        precedence="high"
      />
      <div
        className={slots ? "desk desk-inline" : "desk"}
        ref={hostRef}
        suppressHydrationWarning
      >
        <p className="desk-note">
          The desk is a JavaScript surface. If this line stays, its scripts did
          not load — a reload usually fixes it.
        </p>
      </div>
      <LegacyScripts
        src={slots ? INLINE_SCRIPTS : PAGE_SCRIPTS}
        onReady={mount}
      />
    </>
  );
}
