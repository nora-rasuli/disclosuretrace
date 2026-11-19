import { loadComparison } from "@/data/fixture-store";
import { apiError } from "@/server/api-response";
import { logApiResult } from "@/server/logging";

export async function GET(
  _request: Request,
  context: { params: Promise<{ comparisonId: string }> },
) {
  const startedAt = performance.now();
  const { comparisonId } = await context.params;
  try {
    const comparison = await loadComparison(comparisonId);
    if (!comparison)
      return apiError(
        404,
        "comparison_not_found",
        "This comparison is not in the verified five-pair catalog.",
      );
    logApiResult({
      route: "/api/v1/comparisons/[comparisonId]",
      comparisonId,
      status: 200,
      latencyMs: performance.now() - startedAt,
    });
    return Response.json(comparison, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
        ETag: `"${comparison.fixtureVersion}-${comparison.id}"`,
      },
    });
  } catch {
    logApiResult({
      route: "/api/v1/comparisons/[comparisonId]",
      comparisonId,
      status: 500,
      latencyMs: performance.now() - startedAt,
      errorCode: "corrupt_fixture",
    });
    return apiError(
      500,
      "corrupt_fixture",
      "The comparison fixture failed validation.",
    );
  }
}
