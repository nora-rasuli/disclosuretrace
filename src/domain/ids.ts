import { createHash } from "node:crypto";

export function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function issuerId(cik: string): string {
  return `issuer:${cik.padStart(10, "0")}`;
}

export function filingId(accession: string): string {
  return `filing:${accession}`;
}

export function blockId(
  accession: string,
  ordinal: number,
  displayText: string,
): string {
  return `block:${accession}:item-1a:${String(ordinal).padStart(5, "0")}:${sha256(displayText).slice(0, 12)}`;
}

export function comparisonId(
  older: string,
  newer: string,
  version: string,
): string {
  return `cmp:${older}:${newer}:item-1a:${version}`;
}

export function changeId(
  comparison: string,
  kind: string,
  blockIds: string[],
): string {
  return `chg:${comparison}:${kind}:${sha256(blockIds.join("|")).slice(0, 12)}`;
}

export function sourceId(filing: string, blockIds: string[]): string {
  return `src:${filing}:${blockIds[0]}:${blockIds.at(-1)}`;
}
