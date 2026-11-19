import { loadCatalog } from "@/data/fixture-store";
import { apiError } from "@/server/api-response";
import { logApiResult } from "@/server/logging";

export async function GET() {
  const startedAt = performance.now();
  try {
    const catalog = await loadCatalog();
    return Response.json(catalog, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
        ETag: '"catalog-v1"',
      },
    });
  } catch {
    logApiResult({
      route: "/api/v1/catalog",
      status: 500,
      latencyMs: performance.now() - startedAt,
      errorCode: "corrupt_fixture",
    });
    return apiError(
      500,
      "corrupt_fixture",
      "The verified catalog could not be loaded.",
    );
  }
}
