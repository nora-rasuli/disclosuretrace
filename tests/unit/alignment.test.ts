import { describe, expect, test } from "vitest";
import {
  buildComparison,
  tokenSetSimilarity,
} from "../../scripts/pipeline/align";
import type {
  CorpusPair,
  NormalizedBlock,
  ParsedSection,
} from "../../scripts/pipeline/types";
import type { Filing } from "@/contracts/filing";
import { blockId, filingId, issuerId, sha256 } from "@/domain/ids";

const pair: CorpusPair = {
  ticker: "TEST",
  pair: "2024-2025",
  cik: "0000000001",
  legalName: "Test Issuer, Inc.",
  displayName: "Test Issuer",
  older: {
    accession: "0000000001-24-000001",
    filedAt: "2024-02-01",
    periodEnd: "2023-12-31",
    primaryDocument: "test-2023.htm",
    sourceUrl:
      "https://www.sec.gov/Archives/edgar/data/1/000000000124000001/test-2023.htm",
    indexUrl:
      "https://www.sec.gov/Archives/edgar/data/1/000000000124000001/0000000001-24-000001-index.html",
  },
  newer: {
    accession: "0000000001-25-000001",
    filedAt: "2025-02-01",
    periodEnd: "2024-12-31",
    primaryDocument: "test-2024.htm",
    sourceUrl:
      "https://www.sec.gov/Archives/edgar/data/1/000000000125000001/test-2024.htm",
    indexUrl:
      "https://www.sec.gov/Archives/edgar/data/1/000000000125000001/0000000001-25-000001-index.html",
  },
};

function filing(
  accession: string,
  sourceUrl: string,
  indexUrl: string,
  periodEnd: string,
  filedAt: string,
  primaryDocument: string,
): Filing {
  return {
    id: filingId(accession),
    issuerId: issuerId(pair.cik),
    accession,
    form: "10-K",
    periodEnd,
    filedAt,
    primaryDocument,
    sourceUrl,
    indexUrl,
    retrievedAt: "2026-11-18T00:00:00.000Z",
    sha256: sha256(accession),
    hashStatus: "verified_raw_source",
    bytes: 1,
    isAmendment: false,
    status: "validated",
  };
}

const olderFiling = filing(
  pair.older.accession,
  pair.older.sourceUrl,
  pair.older.indexUrl,
  pair.older.periodEnd,
  pair.older.filedAt,
  pair.older.primaryDocument,
);
const newerFiling = filing(
  pair.newer.accession,
  pair.newer.sourceUrl,
  pair.newer.indexUrl,
  pair.newer.periodEnd,
  pair.newer.filedAt,
  pair.newer.primaryDocument,
);

function block(
  accession: string,
  ordinal: number,
  displayText: string,
): NormalizedBlock {
  return {
    id: blockId(accession, ordinal, displayText),
    ordinal,
    kind: "paragraph",
    displayText,
    matchText: displayText.toLocaleLowerCase(),
    headingPath: ["Item 1A. Risk Factors"],
    displaySha256: sha256(displayText),
    normalizationFlags: [],
  };
}

function section(accession: string, texts: string[]): ParsedSection {
  return {
    accession,
    sourceHeading: "Item 1A. Risk Factors",
    boundaryStrategy: "item-1b",
    blocks: texts.map((text, index) => block(accession, index + 1, text)),
    textSha256: sha256(texts.join("\n")),
    validationMessages: [],
    removedBlocks: [],
  };
}

function compare(older: string[], newer: string[]) {
  return buildComparison(
    pair,
    section(olderFiling.accession, older),
    section(newerFiling.accession, newer),
    olderFiling,
    newerFiling,
    "2026-11-18T00:00:00.000Z",
  );
}

describe("CMP-01–CMP-06 deterministic alignment primitives", () => {
  test("CMP-01 exact normalized token sets score identically", () => {
    expect(
      tokenSetSimilarity(
        "Cloud service disruption",
        "Cloud service disruption",
      ),
    ).toBe(1);
  });

  test("CMP-02 light edits retain high deterministic similarity", () => {
    expect(
      tokenSetSimilarity(
        "A rapid increase may affect fares",
        "A rapid increase could affect fares",
      ),
    ).toBeGreaterThan(0.7);
  });

  test("CMP-06 unrelated blocks remain below the modified threshold", () => {
    expect(
      tokenSetSimilarity(
        "Aircraft fuel and fares",
        "Consumer data privacy regulation",
      ),
    ).toBeLessThan(0.3);
  });

  test("CMP-01 exact and reordered blocks do not become visible changes", () => {
    const result = compare(
      [
        "Cloud service disruption may affect operations.",
        "Privacy laws may change.",
      ],
      [
        "Privacy laws may change.",
        "Cloud service disruption may affect operations.",
      ],
    );
    expect(result.changes).toEqual([]);
    expect(result.counts).toEqual({
      total: 0,
      added: 0,
      removed: 0,
      modified: 0,
    });
  });

  test("CMP-02/CMP-04 pairs a light edit and preserves word-level spans", () => {
    const result = compare(
      ["A rapid increase in fuel price may affect fares."],
      ["A rapid increase in fuel price could affect fares."],
    );
    expect(result.counts).toEqual({
      total: 1,
      added: 0,
      removed: 0,
      modified: 1,
    });
    expect(result.changes[0]).toMatchObject({
      kind: "modified",
      alignmentReason: "light_edit",
    });
    expect(result.changes[0]?.oldWordSpans).toContainEqual({
      kind: "removed",
      text: "may",
    });
    expect(result.changes[0]?.newWordSpans).toContainEqual({
      kind: "added",
      text: "could",
    });
  });

  test("CMP-03 classifies unmatched insertions and removals explicitly", () => {
    const result = compare(
      ["A prior-only labor passage.", "The shared passage remains unchanged."],
      [
        "The shared passage remains unchanged.",
        "A current-only privacy passage.",
      ],
    );
    expect(result.counts).toEqual({
      total: 2,
      added: 1,
      removed: 1,
      modified: 0,
    });
    expect(result.changes.map((change) => change.kind).sort()).toEqual([
      "added",
      "removed",
    ]);
  });

  test("CMP-06 keeps an ambiguous match as explicit add/remove", () => {
    const result = compare(
      [
        "Operations may be affected by a cloud service interruption.",
        "Operations may be affected by a cloud platform interruption.",
      ],
      ["Operations may be affected by a cloud infrastructure interruption."],
    );
    expect(result.counts.modified).toBe(0);
    expect(result.counts.added).toBe(1);
    expect(result.counts.removed).toBe(2);
    expect(result.changes.every((change) => change.similarity === null)).toBe(
      true,
    );
  });

  test("QA-03 produces identical output for identical inputs", () => {
    const older = [
      "A rapid increase in fuel price may affect fares.",
      "A prior-only labor passage.",
    ];
    const newer = [
      "A rapid increase in fuel price could affect fares.",
      "A current-only privacy passage.",
    ];
    expect(compare(older, newer)).toEqual(compare(older, newer));
  });
});
