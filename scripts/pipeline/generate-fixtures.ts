import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ComparisonSchema } from "../../src/contracts/comparison";
import { FilingSchema, type Filing } from "../../src/contracts/filing";
import { filingId, issuerId, sha256 } from "../../src/domain/ids";
import { buildComparison } from "./align";
import { extractItem1A } from "./extract-item-1a";
import { verifyPairMetadata } from "./metadata";
import { fetchSec, type FetchRecord } from "./sec-client";
import type { CorpusFiling, CorpusPair } from "./types";

type Manifest = { version: string; inspectedAt: string; pairs: CorpusPair[] };

function filing(
  pair: CorpusPair,
  source: CorpusFiling,
  record: FetchRecord,
): Filing {
  return FilingSchema.parse({
    id: filingId(source.accession),
    issuerId: issuerId(pair.cik),
    accession: source.accession,
    form: "10-K",
    periodEnd: source.periodEnd,
    filedAt: source.filedAt,
    primaryDocument: source.primaryDocument,
    sourceUrl: source.sourceUrl,
    indexUrl: source.indexUrl,
    retrievedAt: record.retrievedAt,
    sha256: record.sha256,
    hashStatus: "verified_raw_source",
    bytes: record.bytes,
    isAmendment: false,
    status: "validated",
  });
}

export async function generateFixtures(
  outputDir = path.resolve("data/generated/v1"),
): Promise<string[]> {
  const manifest = JSON.parse(
    await readFile("data/corpus/five-pair-source-manifest.json", "utf8"),
  ) as Manifest;
  await mkdir(path.join(outputDir, "comparisons"), { recursive: true });
  const catalogItems = [];
  const provenance = [];
  const fixtureHashes: string[] = [];
  for (const pair of manifest.pairs) {
    await verifyPairMetadata(pair);
    // Keep the frozen SEC ingestion policy explicit: one network request at a
    // time, even within a single filing pair.
    const olderRecord = await fetchSec(
      pair.older.sourceUrl,
      pair.older.accession,
    );
    const newerRecord = await fetchSec(
      pair.newer.sourceUrl,
      pair.newer.accession,
    );
    const olderFiling = filing(pair, pair.older, olderRecord);
    const newerFiling = filing(pair, pair.newer, newerRecord);
    const olderSection = extractItem1A(olderRecord.body, pair.older.accession);
    const newerSection = extractItem1A(newerRecord.body, pair.newer.accession);
    const generatedAt = [olderRecord.retrievedAt, newerRecord.retrievedAt]
      .sort()
      .at(-1)!;
    const comparison = ComparisonSchema.parse(
      buildComparison(
        pair,
        olderSection,
        newerSection,
        olderFiling,
        newerFiling,
        generatedAt,
      ),
    );
    const serialized = `${JSON.stringify(comparison, null, 2)}\n`;
    const filename = `${pair.ticker.toLowerCase()}-${pair.pair}.json`;
    await writeFile(path.join(outputDir, "comparisons", filename), serialized);
    fixtureHashes.push(sha256(serialized));
    catalogItems.push({
      ticker: pair.ticker,
      pair: pair.pair,
      route: comparison.route,
      comparisonId: comparison.id,
      cik: pair.cik,
      legalName: pair.legalName,
      displayName: pair.displayName,
      older: {
        accession: pair.older.accession,
        periodEnd: pair.older.periodEnd,
        filedAt: pair.older.filedAt,
        sourceUrl: pair.older.sourceUrl,
        indexUrl: pair.older.indexUrl,
      },
      newer: {
        accession: pair.newer.accession,
        periodEnd: pair.newer.periodEnd,
        filedAt: pair.newer.filedAt,
        sourceUrl: pair.newer.sourceUrl,
        indexUrl: pair.newer.indexUrl,
      },
      status: "available",
    });
    provenance.push({
      ticker: pair.ticker,
      comparisonId: comparison.id,
      older: {
        ...olderFiling,
        section: { ...olderSection, blocks: undefined },
      },
      newer: {
        ...newerFiling,
        section: { ...newerSection, blocks: undefined },
      },
      counts: comparison.counts,
    });
  }
  const generatedAt = provenance
    .flatMap((entry) => [entry.older.retrievedAt, entry.newer.retrievedAt])
    .sort()
    .at(-1)!;
  const catalog = { fixtureVersion: "v1", generatedAt, items: catalogItems };
  await writeFile(
    path.join(outputDir, "catalog.json"),
    `${JSON.stringify(catalog, null, 2)}\n`,
  );
  await writeFile(
    path.join(outputDir, "provenance.json"),
    `${JSON.stringify({ generatedAt, filings: provenance }, null, 2)}\n`,
  );
  await writeFile(
    path.join(outputDir, "version-manifest.json"),
    `${JSON.stringify({ fixtureVersion: "v1", parserVersion: "parser-1.0.0", normalizerVersion: "normalizer-1.0.0", comparisonVersion: "align-1.0.0", fixtureHashes }, null, 2)}\n`,
  );
  return fixtureHashes;
}
