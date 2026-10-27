/**
 * Just enough ZIP to read one named entry, on the platform's own inflater.
 *
 * A .docx is a ZIP whose text lives in a single entry (`word/document.xml`),
 * so pulling that one entry out is the whole job — mammoth and JSZip exist to
 * do much more than this (style fidelity, images, writing archives) and cost
 * ~1.7MB and eight transitive dependencies to do it. `DecompressionStream` is
 * in every browser the course supports and in Node 18+, which leaves only the
 * archive's directory to walk.
 */

export class ZipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZipError";
  }
}

const EOCD_SIG = 0x06054b50;
const CDH_SIG = 0x02014b50;
const LFH_SIG = 0x04034b50;
/** End-of-directory record, plus the largest comment its length field allows. */
const EOCD_MAX_SCAN = 22 + 0xffff;
const ZIP64_SENTINEL = 0xffffffff;

const utf8 = new TextDecoder("utf-8");

/** Offset of the end-of-central-directory record, or -1. */
function findEndOfDirectory(view: DataView): number {
  const lowest = Math.max(0, view.byteLength - EOCD_MAX_SCAN);
  for (let at = view.byteLength - 22; at >= lowest; at--) {
    if (view.getUint32(at, true) === EOCD_SIG) return at;
  }
  return -1;
}

async function inflateRaw(deflated: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([deflated as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * Returns the named entry's bytes, or null when the archive has no such entry.
 * Throws ZipError when the bytes are not a ZIP we can read at all.
 *
 * Sizes come from the central directory rather than the local file header:
 * Word streams its entries and writes a data descriptor, which leaves the
 * local header's size fields zero.
 */
export async function readZipEntry(
  bytes: Uint8Array,
  name: string,
): Promise<Uint8Array | null> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = findEndOfDirectory(view);
  if (eocd < 0) throw new ZipError("not-a-zip");

  const directoryAt = view.getUint32(eocd + 16, true);
  const entryCount = view.getUint16(eocd + 10, true);
  // A ZIP64 archive parks sentinels here and keeps the real values in a record
  // of its own. Nothing a learner writes in Word reaches 4GB or 65535 entries,
  // so say so rather than growing a second directory format.
  if (directoryAt === ZIP64_SENTINEL || entryCount === 0xffff) {
    throw new ZipError("zip64");
  }

  let at = directoryAt;
  for (let i = 0; i < entryCount; i++) {
    if (at + 46 > bytes.byteLength || view.getUint32(at, true) !== CDH_SIG) {
      throw new ZipError("bad-directory");
    }
    const method = view.getUint16(at + 10, true);
    const compressedSize = view.getUint32(at + 20, true);
    const nameLength = view.getUint16(at + 28, true);
    const extraLength = view.getUint16(at + 30, true);
    const commentLength = view.getUint16(at + 32, true);
    const localAt = view.getUint32(at + 42, true);
    const entryName = utf8.decode(bytes.subarray(at + 46, at + 46 + nameLength));

    if (entryName === name) {
      if (localAt + 30 > bytes.byteLength || view.getUint32(localAt, true) !== LFH_SIG) {
        throw new ZipError("bad-entry");
      }
      // The local header carries its own name and extra fields, and their
      // lengths need not match the directory's — read them from the header.
      const localNameLength = view.getUint16(localAt + 26, true);
      const localExtraLength = view.getUint16(localAt + 28, true);
      const dataAt = localAt + 30 + localNameLength + localExtraLength;
      const data = bytes.subarray(dataAt, dataAt + compressedSize);
      if (data.byteLength < compressedSize) throw new ZipError("truncated");
      if (method === 0) return data;
      if (method === 8) return inflateRaw(data);
      throw new ZipError("unsupported-compression");
    }

    at += 46 + nameLength + extraLength + commentLength;
  }
  return null;
}
