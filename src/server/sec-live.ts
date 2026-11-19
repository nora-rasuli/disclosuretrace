import "server-only";

import { ComparisonSchema, type Comparison } from "@/contracts/comparison";
import { FilingSchema, type Filing } from "@/contracts/filing";
import { filingId, issuerId, sha256 } from "@/domain/ids";
import { buildComparison } from "../../scripts/pipeline/align";
import { extractItem1A } from "../../scripts/pipeline/extract-item-1a";
import type { CorpusFiling, CorpusPair } from "../../scripts/pipeline/types";

const SEC_USER_AGENT =
  process.env.SEC_USER_AGENT ?? "Disclosure Trace nora.rasuli@gmail.com";
const SEC_ORIGINS = new Set(["https://www.sec.gov", "https://data.sec.gov"]);
const REVALIDATE_SECONDS = 60 * 60;

type TickerEntry = { cik_str: number; ticker: string; title: string };
type TickerDirectory = Record<string, TickerEntry>;
type RecentFilings = {
  accessionNumber?: string[];
  filingDate?: string[];
  reportDate?: string[];
  form?: string[];
  primaryDocument?: string[];
};
type Submissions = { filings?: { recent?: RecentFilings } };

export class LiveSecError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "ticker_not_found"
      | "filings_not_found"
      | "sec_unavailable"
      | "section_unavailable",
  ) {
    super(message);
  }
}

async function fetchSec(
  url: string,
): Promise<{ body: string; retrievedAt: string }> {
  const parsed = new URL(url);
  if (!SEC_ORIGINS.has(parsed.origin)) {
    throw new LiveSecError(
      "The requested source is not an SEC endpoint.",
      "sec_unavailable",
    );
  }
  let response: Response;
  try {
    const cacheableMetadata = parsed.pathname.endsWith(".json");
    response = await fetch(url, {
      headers: {
        "User-Agent": SEC_USER_AGENT,
        Accept: "text/html,application/json",
      },
      ...(cacheableMetadata
        ? { next: { revalidate: REVALIDATE_SECONDS } }
        : { cache: "no-store" }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    throw new LiveSecError(
      "SEC EDGAR could not be reached.",
      "sec_unavailable",
    );
  }
  if (!response.ok) {
    throw new LiveSecError(
      `SEC EDGAR returned ${response.status}.`,
      "sec_unavailable",
    );
  }
  return { body: await response.text(), retrievedAt: new Date().toISOString() };
}

function filingUrl(cik: string, accession: string, primaryDocument: string) {
  const cikPath = String(Number(cik));
  const accessionPath = accession.replaceAll("-", "");
  const root = `https://www.sec.gov/Archives/edgar/data/${cikPath}/${accessionPath}`;
  return {
    sourceUrl: `${root}/${primaryDocument}`,
    indexUrl: `${root}/${accession}-index.html`,
  };
}

function latestAnnualFilings(
  submissions: Submissions,
  cik: string,
): CorpusFiling[] {
  const recent = submissions.filings?.recent;
  if (!recent) return [];
  const filings: CorpusFiling[] = [];
  for (let index = 0; index < (recent.form?.length ?? 0); index += 1) {
    if (recent.form?.[index] !== "10-K") continue;
    const accession = recent.accessionNumber?.[index];
    const filedAt = recent.filingDate?.[index];
    const periodEnd = recent.reportDate?.[index];
    const primaryDocument = recent.primaryDocument?.[index];
    if (!accession || !filedAt || !periodEnd || !primaryDocument) continue;
    filings.push({
      accession,
      filedAt,
      periodEnd,
      primaryDocument,
      ...filingUrl(cik, accession, primaryDocument),
    });
    if (filings.length === 2) break;
  }
  return filings.reverse();
}

function filingRecord(
  pair: CorpusPair,
  source: CorpusFiling,
  body: string,
  retrievedAt: string,
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
    retrievedAt,
    sha256: sha256(body),
    hashStatus: "verified_raw_source",
    bytes: Buffer.byteLength(body),
    isAmendment: false,
    status: "validated",
  });
}

export async function loadLiveComparison(
  rawTicker: string,
): Promise<Comparison> {
  const ticker = rawTicker.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9.-]{0,9}$/.test(ticker)) {
    throw new LiveSecError(
      "Enter a valid U.S. public-company ticker.",
      "ticker_not_found",
    );
  }

  const directoryResult = await fetchSec(
    "https://www.sec.gov/files/company_tickers.json",
  );
  const directory = JSON.parse(directoryResult.body) as TickerDirectory;
  const company = Object.values(directory).find(
    (entry) => entry.ticker.toUpperCase() === ticker,
  );
  if (!company) {
    throw new LiveSecError(
      `${ticker} was not found in the SEC company directory.`,
      "ticker_not_found",
    );
  }

  const cik = String(company.cik_str).padStart(10, "0");
  const submissionsResult = await fetchSec(
    `https://data.sec.gov/submissions/CIK${cik}.json`,
  );
  const filings = latestAnnualFilings(
    JSON.parse(submissionsResult.body) as Submissions,
    cik,
  );
  const older = filings[0];
  const newer = filings[1];
  if (!older || !newer) {
    throw new LiveSecError(
      `Two annual 10-K filings were not available for ${ticker}.`,
      "filings_not_found",
    );
  }

  const pair: CorpusPair = {
    ticker,
    pair: `${older.periodEnd.slice(0, 4)}-${newer.periodEnd.slice(0, 4)}`,
    cik,
    legalName: company.title,
    displayName: company.title,
    older,
    newer,
  };
  const [olderResult, newerResult] = await Promise.all([
    fetchSec(older.sourceUrl),
    fetchSec(newer.sourceUrl),
  ]);

  try {
    const olderSection = extractItem1A(olderResult.body, older.accession);
    const newerSection = extractItem1A(newerResult.body, newer.accession);
    const generatedAt = [olderResult.retrievedAt, newerResult.retrievedAt]
      .sort()
      .at(-1)!;
    return ComparisonSchema.parse(
      buildComparison(
        pair,
        olderSection,
        newerSection,
        filingRecord(pair, older, olderResult.body, olderResult.retrievedAt),
        filingRecord(pair, newer, newerResult.body, newerResult.retrievedAt),
        generatedAt,
        "live",
      ),
    );
  } catch (error) {
    if (error instanceof LiveSecError) throw error;
    throw new LiveSecError(
      `Item 1A could not be reliably extracted for ${ticker}.`,
      "section_unavailable",
    );
  }
}
