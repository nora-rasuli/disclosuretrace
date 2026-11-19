import { notFound } from "next/navigation";
import { ComparisonWorkspace } from "@/components/comparison/comparison-workspace";
import { comparisonForRoute, loadComparison } from "@/data/fixture-store";

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ ticker: string; pair: string }>;
}) {
  const { ticker, pair } = await params;
  const item = await comparisonForRoute(ticker, pair);
  if (!item) notFound();
  const comparison = await loadComparison(item.comparisonId);
  if (!comparison) notFound();
  return (
    <ComparisonWorkspace
      comparisonId={item.comparisonId}
      initialComparison={comparison}
      issuerLabel={item.displayName}
      pairLabel={`${item.older.periodEnd} and ${item.newer.periodEnd}`}
    />
  );
}
