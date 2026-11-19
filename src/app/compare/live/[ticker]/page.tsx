import { ComparisonWorkspace } from "@/components/comparison/comparison-workspace";

export default async function LiveComparisonPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const normalizedTicker = ticker.trim().toUpperCase();
  return (
    <ComparisonWorkspace
      comparisonId={`live:${normalizedTicker}`}
      issuerLabel={normalizedTicker}
      pairLabel="latest two annual filings"
      dataUrl={`/api/v1/live-comparisons/${encodeURIComponent(ticker)}`}
      sourceMode="live"
    />
  );
}
