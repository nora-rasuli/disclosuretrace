import { mkdir, readFile, writeFile } from "node:fs/promises";

type SourceManifest = {
  pairs: Array<{
    ticker: string;
    older: { sourceUrl: string; indexUrl: string };
    newer: { sourceUrl: string; indexUrl: string };
  }>;
};

async function main(): Promise<void> {
  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent)
    throw new Error("SEC_USER_AGENT is required for live source verification");
  const manifest = JSON.parse(
    await readFile("data/corpus/five-pair-source-manifest.json", "utf8"),
  ) as SourceManifest;
  const results = [];
  for (const pair of manifest.pairs) {
    for (const [period, filing] of [
      ["older", pair.older],
      ["newer", pair.newer],
    ] as const) {
      const response = await fetch(filing.sourceUrl, {
        headers: { "User-Agent": userAgent },
        signal: AbortSignal.timeout(30_000),
      });
      results.push({
        ticker: pair.ticker,
        period,
        url: filing.sourceUrl,
        status: response.status,
        ok: response.ok,
      });
      if (!response.ok)
        throw new Error(
          `${pair.ticker} ${period} source returned ${response.status}`,
        );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  const report = {
    checkedAt: new Date().toISOString(),
    userAgentRedacted: true,
    results,
  };
  await mkdir("data/reports", { recursive: true });
  await writeFile(
    "data/reports/source-verification.json",
    `${JSON.stringify(report, null, 2)}\n`,
  );
  process.stdout.write(
    `Verified ${results.length} official SEC filing URLs.\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Source verification failed"}\n`,
  );
  process.exitCode = 1;
});
