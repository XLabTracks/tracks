/**
 * Pulls the text out of a learner's own .docx or .pdf so it can be dropped
 * into a writing box.
 *
 * This runs in the browser, on purpose. The file is the learner's draft, it
 * never needs to reach us, and only the extracted text goes up — through
 * `saveWritingDraft`/`submitWriting`, the path a typed answer already takes.
 * So there is no upload endpoint to authorize or rate-limit, no untrusted
 * archive or PDF parsed in the worker, and no request-size ceiling to hit.
 * The PDF reader is dynamically imported, so its weight is paid only by
 * somebody who actually picks a PDF.
 */

import { WRITING_MAX_SECTION_CHARS } from "@/lib/content/exercise-view";
import { docxDocumentText } from "@/lib/uploads/docx-text";
import { readZipEntry } from "@/lib/uploads/zip";

export const DOCUMENT_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

export const DOCUMENT_UPLOAD_ACCEPT = [
  ".docx",
  ".pdf",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

export type DocumentReadFailure =
  | "too-large"
  | "unsupported"
  | "legacy-doc"
  | "unreadable"
  | "no-text";

/** What the learner is told. Each one says what to do next. */
export const documentReadMessages: Record<DocumentReadFailure, string> = {
  "too-large": "That file is over 8MB. Save a copy without images and try again.",
  unsupported: "Only .docx and .pdf can be read. Paste the text in instead.",
  "legacy-doc":
    "That is the older .doc format. Open it in Word and save as .docx, then try again.",
  unreadable: "That file could not be read. Paste the text in instead.",
  "no-text":
    "No text was found in that file — a scanned or image-only PDF has none to take. Paste the text in instead.",
};

export class DocumentReadError extends Error {
  readonly code: DocumentReadFailure;
  constructor(code: DocumentReadFailure) {
    super(documentReadMessages[code]);
    this.name = "DocumentReadError";
    this.code = code;
  }
}

export interface ImportableFile {
  name: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface ImportedDocument {
  text: string;
  /** True when the text hit the per-section cap and the tail was dropped. */
  truncated: boolean;
}

const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;

/**
 * Makes extracted text safe to store and pleasant to edit: the server
 * sanitizer rejects a whole draft containing \u0000 or a lone surrogate (both
 * of which a PDF's text layer can yield), and a converter's runs of blank
 * lines are noise in a textarea.
 */
export function normalizeImportedText(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/\u0000/g, "")
    .replace(LONE_SURROGATE, "")
    // Soft hyphens and zero-width joiners survive a PDF copy and show up as
    // invisible breaks mid-word in the saved answer.
    .replace(/[­​-‍﻿]/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot).toLowerCase();
}

async function docxText(bytes: Uint8Array): Promise<string> {
  let entry: Uint8Array | null;
  try {
    entry = await readZipEntry(bytes, "word/document.xml");
  } catch {
    throw new DocumentReadError("unreadable");
  }
  // A .docx without that part is not a Word document — most often a .zip or a
  // Pages/ODT file wearing the extension.
  if (!entry) throw new DocumentReadError("unreadable");
  return docxDocumentText(new TextDecoder("utf-8").decode(entry));
}

/**
 * pdf.js calls `Promise.withResolvers`, which Safari gained in 17.4, Chrome in
 * 119 and Node in 22 — so on a browser a year or two old the reader throws on
 * import and every PDF looks corrupt. Four lines here is the difference
 * between "that file could not be read" and it working.
 */
function ensurePromiseWithResolvers(): void {
  const target = Promise as unknown as {
    withResolvers?: <T>() => {
      promise: Promise<T>;
      resolve: (value: T | PromiseLike<T>) => void;
      reject: (reason?: unknown) => void;
    };
  };
  if (typeof target.withResolvers === "function") return;
  target.withResolvers = function withResolvers<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

async function pdfText(bytes: Uint8Array): Promise<string> {
  try {
    ensurePromiseWithResolvers();
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractText(pdf, { mergePages: true });
    return Array.isArray(text) ? text.join("\n") : text;
  } catch {
    throw new DocumentReadError("unreadable");
  }
}

/**
 * Reads `file` and returns text ready for a writing box. Throws
 * DocumentReadError, whose `message` is written for the learner.
 */
export async function extractDocumentText(
  file: ImportableFile,
): Promise<ImportedDocument> {
  if (file.size > DOCUMENT_UPLOAD_MAX_BYTES) {
    throw new DocumentReadError("too-large");
  }
  const extension = extensionOf(file.name);
  if (extension === ".doc") throw new DocumentReadError("legacy-doc");
  if (extension !== ".docx" && extension !== ".pdf") {
    throw new DocumentReadError("unsupported");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const raw =
    extension === ".pdf" ? await pdfText(bytes) : await docxText(bytes);
  const text = normalizeImportedText(raw);
  if (!text) throw new DocumentReadError("no-text");

  return text.length > WRITING_MAX_SECTION_CHARS
    ? { text: text.slice(0, WRITING_MAX_SECTION_CHARS), truncated: true }
    : { text, truncated: false };
}
