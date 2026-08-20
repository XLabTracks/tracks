export type LimitedBodyResult =
  | { ok: true; text: string; bytes: number }
  | { ok: false; bytes: number };

/** Read a request body without ever buffering more than the accepted bytes. */
export async function readLimitedBody(
  request: Request,
  maxBytes: number,
): Promise<LimitedBodyResult> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, bytes: declared };
  }

  if (!request.body) return { ok: true, text: "", bytes: 0 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return { ok: false, bytes };
    }
    chunks.push(value);
  }

  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, text: new TextDecoder().decode(body), bytes };
}
