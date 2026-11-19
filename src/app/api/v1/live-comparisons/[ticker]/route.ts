import { LiveSecError, loadLiveComparison } from "@/server/sec-live";
import { apiError } from "@/server/api-response";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  _request: Request,
  context: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await context.params;
  try {
    const comparison = await loadLiveComparison(ticker);
    return Response.json(comparison, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        ETag: `"live-${comparison.id}-${comparison.generatedAt}"`,
      },
    });
  } catch (error) {
    if (error instanceof LiveSecError) {
      const status = error.code === "ticker_not_found" ? 404 : 503;
      return apiError(status, error.code, error.message);
    }
    return apiError(
      500,
      "comparison_failed",
      "The live comparison could not be generated.",
    );
  }
}
