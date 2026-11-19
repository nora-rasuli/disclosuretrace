import { describe, expect, test } from "vitest";
import { verifyFilingMetadata } from "../../scripts/pipeline/metadata";
import type { CorpusFiling } from "../../scripts/pipeline/types";

const expected: CorpusFiling = {
  accession: "0001535527-25-000009",
  filedAt: "2025-03-10",
  periodEnd: "2025-01-31",
  primaryDocument: "crwd-20250131.htm",
  sourceUrl:
    "https://www.sec.gov/Archives/edgar/data/1535527/000153552725000009/crwd-20250131.htm",
  indexUrl:
    "https://www.sec.gov/Archives/edgar/data/1535527/000153552725000009/0001535527-25-000009-index.html",
};

function submissions(form = "10-K", accession = expected.accession) {
  return {
    filings: {
      recent: {
        accessionNumber: [accession],
        filingDate: [expected.filedAt],
        reportDate: [expected.periodEnd],
        form: [form],
        primaryDocument: [expected.primaryDocument],
      },
    },
  };
}

describe("DATA-03 exact metadata acquisition", () => {
  test("accepts the exact frozen 10-K metadata", () => {
    expect(() => verifyFilingMetadata(submissions(), expected)).not.toThrow();
  });

  test("rejects silent 10-K/A substitution", () => {
    expect(() => verifyFilingMetadata(submissions("10-K/A"), expected)).toThrow(
      /not form 10-K/,
    );
  });

  test("rejects an absent accession or changed metadata", () => {
    expect(() =>
      verifyFilingMetadata(submissions("10-K", "different"), expected),
    ).toThrow(/Exact accession absent/);
    expect(() =>
      verifyFilingMetadata(
        {
          ...submissions(),
          filings: {
            recent: {
              ...submissions().filings.recent,
              reportDate: ["2024-01-31"],
            },
          },
        },
        expected,
      ),
    ).toThrow(/metadata mismatch/);
  });
});
