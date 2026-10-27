import { describe, expect, it } from "vitest";
import { deflateRawSync } from "node:zlib";

import { docxDocumentText, decodeXmlText } from "@/lib/uploads/docx-text";
import { readZipEntry, ZipError } from "@/lib/uploads/zip";
import {
  DocumentReadError,
  DOCUMENT_UPLOAD_MAX_BYTES,
  extractDocumentText,
  normalizeImportedText,
} from "@/lib/uploads/document-text";
import { WRITING_MAX_SECTION_CHARS, isStorableText } from "@/lib/content/exercise-view";

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Builds a real ZIP so the reader is exercised against bytes, not a mock. */
function zip(
  entries: [name: string, body: string][],
  opts: { store?: boolean } = {},
): Uint8Array {
  const locals: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const encoder = new TextEncoder();

  for (const [name, body] of entries) {
    const raw = encoder.encode(body);
    const method = opts.store ? 0 : 8;
    const data = opts.store ? raw : new Uint8Array(deflateRawSync(raw));
    const nameBytes = encoder.encode(name);

    const local = new Uint8Array(30);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(8, method, true);
    lv.setUint32(14, crc32(raw), true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, raw.length, true);
    lv.setUint16(26, nameBytes.length, true);
    locals.push(local, nameBytes, data);

    const header = new Uint8Array(46);
    const hv = new DataView(header.buffer);
    hv.setUint32(0, 0x02014b50, true);
    hv.setUint16(4, 20, true);
    hv.setUint16(6, 20, true);
    hv.setUint16(10, method, true);
    hv.setUint32(16, crc32(raw), true);
    hv.setUint32(20, data.length, true);
    hv.setUint32(24, raw.length, true);
    hv.setUint16(28, nameBytes.length, true);
    hv.setUint32(42, offset, true);
    central.push(header, nameBytes);

    offset += local.length + nameBytes.length + data.length;
  }

  const directory = concat(central);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, directory.length, true);
  ev.setUint32(16, offset, true);

  return concat([...locals, directory, end]);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

function wordDoc(bodyXml: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${bodyXml}</w:body></w:document>`;
}

function docxFile(bodyXml: string, name = "memo.docx") {
  const bytes = zip([
    ["[Content_Types].xml", "<Types/>"],
    ["word/document.xml", wordDoc(bodyXml)],
  ]);
  return fileOf(bytes, name);
}

function fileOf(bytes: Uint8Array, name: string) {
  return {
    name,
    size: bytes.byteLength,
    arrayBuffer: async () =>
      bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer,
  };
}

/**
 * A one-page PDF with a real text layer, so the PDF path is exercised against
 * bytes a reader has to parse rather than a stubbed module.
 */
function pdfFile(lines: string[], name = "memo.pdf") {
  const content =
    "BT /F1 12 Tf 72 720 Td 14 TL\n" +
    lines
      .map((l) => `(${l.replace(/([()\\])/g, "\\$1")}) Tj T*`)
      .join("\n") +
    "\nET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((object, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });
  const startxref = pdf.length;
  pdf +=
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
    offsets.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return fileOf(bytes, name);
}

const para = (text: string) => `<w:p><w:r><w:t>${text}</w:t></w:p>`;

describe("readZipEntry", () => {
  it("inflates a deflated entry", async () => {
    const entry = await readZipEntry(zip([["a.txt", "hello world"]]), "a.txt");
    expect(new TextDecoder().decode(entry!)).toBe("hello world");
  });

  it("reads a stored (uncompressed) entry", async () => {
    const entry = await readZipEntry(
      zip([["a.txt", "stored"]], { store: true }),
      "a.txt",
    );
    expect(new TextDecoder().decode(entry!)).toBe("stored");
  });

  it("finds an entry that is not the first", async () => {
    const bytes = zip([
      ["[Content_Types].xml", "<Types/>"],
      ["word/document.xml", "<w:document/>"],
    ]);
    const entry = await readZipEntry(bytes, "word/document.xml");
    expect(new TextDecoder().decode(entry!)).toBe("<w:document/>");
  });

  it("returns null for a missing entry rather than throwing", async () => {
    await expect(readZipEntry(zip([["a.txt", "x"]]), "word/document.xml"))
      .resolves.toBeNull();
  });

  it("rejects bytes that are not a zip", async () => {
    await expect(
      readZipEntry(new TextEncoder().encode("%PDF-1.4 not a zip"), "a.txt"),
    ).rejects.toBeInstanceOf(ZipError);
  });
});

describe("docxDocumentText", () => {
  it("gives one line per paragraph", () => {
    expect(docxDocumentText(wordDoc(para("First") + para("Second")))).toBe(
      "First\nSecond",
    );
  });

  it("joins the runs of a split paragraph without a gap", () => {
    const xml = wordDoc(
      `<w:p><w:r><w:t xml:space="preserve">The estimate rests on </w:t></w:r><w:r><w:rPr><w:b/></w:rPr><w:t>two</w:t></w:r><w:r><w:t xml:space="preserve"> streams.</w:t></w:r></w:p>`,
    );
    expect(docxDocumentText(xml)).toBe("The estimate rests on two streams.");
  });

  it("breaks a line on w:br and keeps the paragraph going", () => {
    const xml = wordDoc(
      `<w:p><w:r><w:t>one</w:t></w:r><w:r><w:br/></w:r><w:r><w:t>two</w:t></w:r></w:p>`,
    );
    expect(docxDocumentText(xml)).toBe("one\ntwo");
  });

  it("keeps a table row on one line, cells tab-separated", () => {
    const xml = wordDoc(
      `<w:tbl><w:tr><w:tc>${para("Stream")}</w:tc><w:tc>${para("Who holds it")}</w:tc></w:tr><w:tr><w:tc>${para("Customs")}</w:tc><w:tc>${para("National services")}</w:tc></w:tr></w:tbl>`,
    );
    expect(docxDocumentText(xml)).toBe(
      "Stream\tWho holds it\nCustoms\tNational services",
    );
  });

  it("drops field instruction codes but keeps their visible result", () => {
    const xml = wordDoc(
      `<w:p><w:r><w:instrText>PAGE  \\* MERGEFORMAT</w:instrText></w:r><w:r><w:t>Page 3</w:t></w:r></w:p>`,
    );
    expect(docxDocumentText(xml)).toBe("Page 3");
  });

  it("ignores tracked deletions, which Word stores as w:delText", () => {
    const xml = wordDoc(
      `<w:p><w:del><w:r><w:delText>struck out</w:delText></w:r></w:del><w:r><w:t>kept</w:t></w:r></w:p>`,
    );
    expect(docxDocumentText(xml)).toBe("kept");
  });

  it("decodes entities and turns w:tab into a tab", () => {
    const xml = wordDoc(
      `<w:p><w:r><w:t>Ampersand &amp; angle &lt;x&gt;</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>after</w:t></w:r></w:p>`,
    );
    expect(docxDocumentText(xml)).toBe("Ampersand & angle <x>\tafter");
  });

  it("reads a body-less fragment rather than returning nothing", () => {
    expect(docxDocumentText(para("Loose"))).toBe("Loose");
  });
});

describe("decodeXmlText", () => {
  it("decodes named, decimal and hex references", () => {
    expect(decodeXmlText("&amp;&#65;&#x42;&quot;")).toBe('&AB"');
  });

  it("leaves an unknown entity alone instead of eating it", () => {
    expect(decodeXmlText("&unknownthing; stays")).toBe("&unknownthing; stays");
  });
});

describe("normalizeImportedText", () => {
  it("collapses runs of blank lines to one", () => {
    expect(normalizeImportedText("a\n\n\n\n\nb")).toBe("a\n\nb");
  });

  it("normalizes CRLF and trims trailing spaces", () => {
    expect(normalizeImportedText("a  \r\nb\t\r\n")).toBe("a\nb");
  });

  it("strips what the server sanitizer would reject the whole draft for", () => {
    const hostile = "good\u0000text\ud800 and \udc00more";
    const clean = normalizeImportedText(hostile);
    expect(isStorableText(clean)).toBe(true);
    expect(clean).toBe("goodtext and more");
  });

  it("strips invisibles a PDF copy carries", () => {
    expect(normalizeImportedText("mid­word​break﻿")).toBe(
      "midwordbreak",
    );
  });
});

describe("extractDocumentText", () => {
  it("reads a .docx into paragraphs", async () => {
    const result = await extractDocumentText(
      docxFile(para("Policy memo") + para("Second paragraph.")),
    );
    expect(result).toEqual({
      text: "Policy memo\nSecond paragraph.",
      truncated: false,
    });
  });

  it("truncates at the per-section cap and says so", async () => {
    const long = "x".repeat(WRITING_MAX_SECTION_CHARS + 500);
    const result = await extractDocumentText(docxFile(para(long)));
    expect(result.truncated).toBe(true);
    expect(result.text).toHaveLength(WRITING_MAX_SECTION_CHARS);
  });

  it("refuses the older .doc format with a way forward", async () => {
    await expect(
      extractDocumentText(docxFile(para("x"), "memo.doc")),
    ).rejects.toMatchObject({ code: "legacy-doc" });
  });

  it("refuses an unsupported extension", async () => {
    await expect(
      extractDocumentText(docxFile(para("x"), "memo.pages")),
    ).rejects.toMatchObject({ code: "unsupported" });
  });

  it("refuses a file over the size ceiling without reading it", async () => {
    let read = false;
    await expect(
      extractDocumentText({
        name: "huge.pdf",
        size: DOCUMENT_UPLOAD_MAX_BYTES + 1,
        arrayBuffer: async () => {
          read = true;
          return new ArrayBuffer(0);
        },
      }),
    ).rejects.toMatchObject({ code: "too-large" });
    expect(read).toBe(false);
  });

  it("reports a .docx that holds no text rather than saving an empty answer", async () => {
    await expect(extractDocumentText(docxFile("<w:p/>"))).rejects.toMatchObject(
      { code: "no-text" },
    );
  });

  it("reports a .docx that is not a Word document", async () => {
    const notWord = zip([["mimetype", "application/vnd.oasis.opendocument.text"]]);
    await expect(
      extractDocumentText(fileOf(notWord, "memo.docx")),
    ).rejects.toMatchObject({ code: "unreadable" });
  });

  it("reads a .pdf text layer", async () => {
    const result = await extractDocumentText(
      pdfFile(["Policy memo: export controls", "The estimate rests on two streams."]),
    );
    expect(result.truncated).toBe(false);
    expect(result.text).toBe(
      "Policy memo: export controls\nThe estimate rests on two streams.",
    );
  });

  it("reports a .pdf with no text layer instead of saving an empty answer", async () => {
    await expect(extractDocumentText(pdfFile([]))).rejects.toMatchObject({
      code: "no-text",
    });
  });

  it("reports a .pdf that is not a pdf", async () => {
    await expect(
      extractDocumentText(fileOf(new TextEncoder().encode("plain text"), "memo.pdf")),
    ).rejects.toMatchObject({ code: "unreadable" });
  });

  it("every failure carries a message written for the learner", async () => {
    const error = new DocumentReadError("no-text");
    expect(error.message).toMatch(/Paste the text in instead/);
    expect(error).toBeInstanceOf(Error);
  });
});
