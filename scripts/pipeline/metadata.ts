import { fetchSec } from "./sec-client";
import type { CorpusFiling, CorpusPair } from "./types";

type Submissions = {
  filings?: {
    recent?: {
      accessionNumber?: string[];
      filingDate?: string[];
      reportDate?: string[];
      form?: string[];
      primaryDocument?: string[];
    };
  };
};

export async function verifyPairMetadata(pair: CorpusPair): Promise<void> {
  const result = await fetchSec(
    `https://data.sec.gov/submissions/CIK${pair.cik}.json`,
    `submissions-${pair.cik}`,
  );
  const submissions = JSON.parse(result.body) as Submissions;
  for (const filing of [pair.older, pair.newer])
    verifyFilingMetadata(submissions, filing);
}

export function verifyFilingMetadata(
  submissions: Submissions,
  expected: CorpusFiling,
): void {
  const recent = submissions.filings?.recent;
  const index = recent?.accessionNumber?.indexOf(expected.accession) ?? -1;
  if (index < 0)
    throw new Error(
      `Exact accession absent from submissions: ${expected.accession}`,
    );
  if (recent?.form?.[index] !== "10-K") {
    throw new Error(`Exact accession is not form 10-K: ${expected.accession}`);
  }
  if (
    recent?.filingDate?.[index] !== expected.filedAt ||
    recent?.reportDate?.[index] !== expected.periodEnd ||
    recent?.primaryDocument?.[index] !== expected.primaryDocument
  ) {
    throw new Error(`Frozen metadata mismatch: ${expected.accession}`);
  }
}
