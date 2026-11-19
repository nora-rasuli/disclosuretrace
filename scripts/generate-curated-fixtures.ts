import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { diffWordsWithSpace } from "diff";
import { COMPARISON_VERSION } from "../src/config/comparison";
import {
  ComparisonSchema,
  type Change,
  type Passage,
  type WordSpan,
} from "../src/contracts/comparison";
import type { Filing } from "../src/contracts/filing";
import {
  blockId,
  changeId,
  comparisonId,
  filingId,
  issuerId,
  sha256,
  sourceId,
} from "../src/domain/ids";
import type { CorpusFiling, CorpusPair } from "./pipeline/types";

type Manifest = { pairs: CorpusPair[] };
type CuratedChange = {
  kind: "added" | "removed" | "modified";
  heading: string;
  oldText?: string;
  newText?: string;
  note: string;
};

const RETRIEVED_AT = "2026-11-17T08:15:00.000Z";

const curated: Record<string, CuratedChange[]> = {
  CRWD: [
    {
      kind: "added",
      heading: "Summary of Risk Factors",
      newText:
        "The July 19 Incident has had, and is expected to continue to have, an adverse effect on our business, sales, customer and partner relations, reputation, results of operations and financial condition.",
      note: "Verified in the newer filing's Item 1A summary; no corresponding prior summary passage was found in the reviewed source context.",
    },
    {
      kind: "modified",
      heading: "Risks Related to Ownership of Our Common Stock",
      oldText:
        "Sales of substantial amounts of our Class A common stock in the public markets, or the perception that they might occur, could reduce the price that our Class A common stock might otherwise attain and may dilute your voting power and your ownership interest in us.",
      newText:
        "Sales of substantial amounts of our common stock in the public markets, or the perception that they might occur, could reduce the price that our common stock might otherwise attain and may dilute your voting power and your ownership interest in us.",
      note: "Verified in both official filings; Class A references were removed after the Class B conversion.",
    },
    {
      kind: "removed",
      heading: "Risks Related to Ownership of Our Common Stock",
      oldText:
        "The dual class structure of our common stock has the effect of concentrating voting control with those stockholders who held our capital stock prior to the completion of our initial public offering, including our executive officers, employees, directors, principal stockholders, and their affiliates, which will limit your ability to influence the outcome of matters submitted to our stockholders for approval.",
      note: "Verified in the prior filing; the newer filing reports that all Class B shares converted in December 2024 and omits this Item 1A passage.",
    },
  ],
  ABNB: [
    {
      kind: "modified",
      heading: "Risk Factors Summary",
      oldText:
        "If we fail to retain or add hosts and guests, if hosts fail to provide high-quality stays and experiences, if our new offerings and initiatives are unsuccessful or if our community support offerings are inadequate, our business, results of operations, and financial condition would be materially adversely affected.",
      newText:
        "If we fail to retain or add hosts and guests, if hosts do not provide high-quality stays, experiences, and services, if new offerings and initiatives on our platform are unsuccessful, or if our community support functions are inadequate, our business, results of operations, and financial condition would be materially adversely affected.",
      note: "Verified in the official Item 1A summary passages.",
    },
  ],
  COST: [
    {
      kind: "modified",
      heading: "Business and Operating Risks",
      oldText:
        "Our financial and operational performance is highly dependent on our U.S. and Canadian operations, which comprised 86% and 84% of net sales and operating income in 2025. Within the U.S., we are highly dependent on our California operations, which comprised 26% of U.S. net sales in 2025.",
      newText:
        "Our financial and operational performance is highly dependent on our U.S. and Canadian operations, which comprised 86% and 83% of net sales and operating income in 2026. Within the U.S., we are highly dependent on our California operations, which comprised 26% of U.S. net sales in 2026.",
      note: "Verified in the official Item 1A passages.",
    },
  ],
  DAL: [
    {
      kind: "modified",
      heading: "Risk Factors Relating to Delta",
      oldText:
        "Because passengers often purchase tickets well in advance of their travel, a significant rapid increase in fuel price may result in the fare charged not covering that increase.",
      newText:
        "Because passengers often purchase tickets well in advance of their travel, a significant rapid increase in fuel price could result in the fare charged not covering that increase.",
      note: "Verified in the official Item 1A passages.",
    },
    {
      kind: "modified",
      heading: "Risk Factors Relating to Delta",
      oldText:
        "Certain of these covenants impose restrictions on our business, and failure to comply with any of the covenants in these agreements could result in events of default.",
      newText:
        "Certain of these covenants could impose restrictions on our business, and failure to comply with any of the covenants in these agreements could result in events of default.",
      note: "Verified in the official Item 1A passages.",
    },
  ],
  F: [
    {
      kind: "modified",
      heading: "Item 1A. Risk Factors",
      oldText:
        "We have listed below the material risk factors applicable to us grouped into the following categories: Operational Risks; Macroeconomic, Market, and Strategic Risks; Financial Risks; and Legal and Regulatory Risks. We have a global business, and conditions in our industry and the regions where we operate and sell our products and services may change quickly.",
      newText:
        "We have listed below the material risk factors applicable to us grouped into the following categories: Operational Risks; Macroeconomic, Market, and Strategic Risks; Financial Risks; and Legal and Regulatory Risks. Some of the risks and contingencies discussed herein may have previously occurred.",
      note: "Verified in the official Item 1A introductions.",
    },
    {
      kind: "added",
      heading: "Macroeconomic, Market, and Strategic Risks",
      newText:
        "Changes in international trade policy can also have a substantial adverse effect on our financial condition, results of operations, or our business in general.",
      note: "Verified in the newer official Item 1A passage.",
    },
    {
      kind: "removed",
      heading: "Macroeconomic, Market, and Strategic Risks",
      oldText:
        "Further, the degree of success of some of our investment strategies depends upon IRA tax credit eligibility and for those credits to continue to remain available through the currently contemplated expiration.",
      note: "Verified in the prior official Item 1A passage; the newer filing instead describes 2025 legislation eliminating purchaser credits.",
    },
  ],
};

function filing(pair: CorpusPair, source: CorpusFiling): Filing {
  return {
    id: filingId(source.accession),
    issuerId: issuerId(pair.cik),
    accession: source.accession,
    form: "10-K",
    periodEnd: source.periodEnd,
    filedAt: source.filedAt,
    primaryDocument: source.primaryDocument,
    sourceUrl: source.sourceUrl,
    indexUrl: source.indexUrl,
    retrievedAt: RETRIEVED_AT,
    sha256: null,
    hashStatus: "pending_authorized_ingestion",
    bytes: null,
    isAmendment: false,
    status: "partial",
  };
}

function wordSpans(
  oldText: string,
  newText: string,
): { old: WordSpan[]; current: WordSpan[] } {
  const old: WordSpan[] = [];
  const current: WordSpan[] = [];
  for (const part of diffWordsWithSpace(oldText, newText)) {
    if (part.added) current.push({ kind: "added", text: part.value });
    else if (part.removed) old.push({ kind: "removed", text: part.value });
    else {
      old.push({ kind: "equal", text: part.value });
      current.push({ kind: "equal", text: part.value });
    }
  }
  return { old, current };
}

function passage(
  text: string,
  heading: string,
  filingRecord: Filing,
  ordinal: number,
): Passage {
  const id = blockId(filingRecord.accession, ordinal, text);
  return {
    blockId: id,
    displayText: text,
    headingPath: [heading],
    source: {
      id: sourceId(filingRecord.id, [id]),
      filingId: filingRecord.id,
      blockIds: [id],
      accession: filingRecord.accession,
      sourceUrl: filingRecord.sourceUrl,
      indexUrl: filingRecord.indexUrl,
      locatorLabel: "Item 1A — Risk Factors",
      excerptSha256: sha256(text),
    },
  };
}

async function main(): Promise<void> {
  const manifest = JSON.parse(
    await readFile("data/corpus/five-pair-source-manifest.json", "utf8"),
  ) as Manifest;
  const output = path.resolve("data/generated/v1");
  await mkdir(path.join(output, "comparisons"), { recursive: true });
  const items = [];
  const provenance = [];
  const fixtureHashes = [];
  for (const pair of manifest.pairs) {
    const older = filing(pair, pair.older);
    const newer = filing(pair, pair.newer);
    const id = comparisonId(
      older.accession,
      newer.accession,
      COMPARISON_VERSION,
    );
    const changes: Change[] = (curated[pair.ticker] ?? []).map(
      (entry, index) => {
        const oldPassage = entry.oldText
          ? passage(entry.oldText, entry.heading, older, index * 2 + 1)
          : null;
        const newPassage = entry.newText
          ? passage(entry.newText, entry.heading, newer, index * 2 + 2)
          : null;
        const wordDiff = wordSpans(entry.oldText ?? "", entry.newText ?? "");
        const ids = [oldPassage?.blockId, newPassage?.blockId].filter(
          (value): value is string => Boolean(value),
        );
        return {
          id: changeId(id, entry.kind, ids),
          comparisonId: id,
          kind: entry.kind,
          ordinal: index + 1,
          oldPassage,
          newPassage,
          oldContext: { before: null, after: null },
          newContext: { before: null, after: null },
          oldWordSpans: wordDiff.old,
          newWordSpans: wordDiff.current,
          alignmentReason:
            entry.kind === "modified"
              ? "light_edit"
              : entry.kind === "added"
                ? "unmatched_current"
                : "unmatched_prior",
          similarity: entry.kind === "modified" ? 0.8 : null,
          orderChanged: false,
        };
      },
    );
    const counts = {
      total: changes.length,
      added: changes.filter((change) => change.kind === "added").length,
      removed: changes.filter((change) => change.kind === "removed").length,
      modified: changes.filter((change) => change.kind === "modified").length,
    };
    const comparison = ComparisonSchema.parse({
      id,
      route: `/compare/${pair.ticker.toLowerCase()}/${pair.pair}`,
      fixtureVersion: "v1",
      algorithmVersion: COMPARISON_VERSION,
      generatedAt: RETRIEVED_AT,
      status: "partial",
      issuer: {
        id: issuerId(pair.cik),
        cik: pair.cik,
        ticker: pair.ticker,
        legalName: pair.legalName,
        displayName: pair.displayName,
      },
      sectionCode: "item-1a",
      sectionTitle: "Item 1A — Risk Factors",
      olderFiling: older,
      newerFiling: newer,
      counts,
      changes,
      exclusions: [
        {
          code: "raw_source_ingestion_pending",
          count: 1,
          reason:
            "These manually verified source passages keep the local demo usable. Full-section generation and raw source hashes require an authorized SEC contact header.",
        },
      ],
      method: {
        parserVersion: "manual-source-review-2026-11-17",
        normalizerVersion: "normalizer-1.0.0",
        comparisonVersion: COMPARISON_VERSION,
      },
    });
    const serialized = `${JSON.stringify(comparison, null, 2)}\n`;
    await writeFile(
      path.join(
        output,
        "comparisons",
        `${pair.ticker.toLowerCase()}-${pair.pair}.json`,
      ),
      serialized,
    );
    fixtureHashes.push(sha256(serialized));
    items.push({
      ticker: pair.ticker,
      pair: pair.pair,
      route: comparison.route,
      comparisonId: id,
      cik: pair.cik,
      legalName: pair.legalName,
      displayName: pair.displayName,
      older: { ...pair.older },
      newer: { ...pair.newer },
      status: "partial",
    });
    provenance.push({
      ticker: pair.ticker,
      comparisonId: id,
      older,
      newer,
      counts,
      review: curated[pair.ticker],
    });
  }
  await writeFile(
    output + "/catalog.json",
    `${JSON.stringify({ fixtureVersion: "v1", generatedAt: RETRIEVED_AT, items }, null, 2)}\n`,
  );
  await writeFile(
    output + "/provenance.json",
    `${JSON.stringify({ generatedAt: RETRIEVED_AT, filings: provenance }, null, 2)}\n`,
  );
  await writeFile(
    output + "/version-manifest.json",
    `${JSON.stringify({ fixtureVersion: "v1", parserVersion: "manual-source-review-2026-11-17", normalizerVersion: "normalizer-1.0.0", comparisonVersion: COMPARISON_VERSION, fixtureHashes }, null, 2)}\n`,
  );
  process.stdout.write(
    `Generated ${items.length} curated partial comparison fixtures.\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.stack : "Curated generation failed"}\n`,
  );
  process.exitCode = 1;
});
