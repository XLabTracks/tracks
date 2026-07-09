import { parseArxivId } from "@/lib/arxiv/id";
import { getOrConvertPaperUncached } from "@/lib/arxiv/pipeline";

/**
 * Token-gated cache warmer: GET /api/arxiv/warm?id=2301.12345v2 with an
 * `x-warm-token` header matching ARXIV_WARM_TOKEN. Authors run
 * `npm run warm:arxiv` after adding papers so students never hit the cold
 * path. Idempotent — warming an already-cached paper is a fast no-op — and
 * staged by construction: the pipeline persists the raw e-print before
 * converting, so even a timed-out invocation makes the next one cheaper.
 */
export async function GET(request: Request) {
  const token = process.env.ARXIV_WARM_TOKEN;
  if (!token || request.headers.get("x-warm-token") !== token) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const idParam = new URL(request.url).searchParams.get("id");
  const id = idParam ? parseArxivId(idParam) : null;
  if (!id) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }

  const result = await getOrConvertPaperUncached(id.id);
  const status = result.state === "transient-error" ? 503 : 200;
  return Response.json(
    {
      id: id.id,
      status: result.state,
      ...(result.state === "ready"
        ? {
            warnings: result.paper.warnings.length,
            assets: result.paper.assets.length,
          }
        : {}),
    },
    { status },
  );
}
