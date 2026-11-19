export type CorpusFiling = {
  filedAt: string;
  periodEnd: string;
  accession: string;
  primaryDocument: string;
  sourceUrl: string;
  indexUrl: string;
};

export type CorpusPair = {
  ticker: string;
  pair: string;
  cik: string;
  legalName: string;
  displayName: string;
  older: CorpusFiling;
  newer: CorpusFiling;
};

export type NormalizedBlock = {
  id: string;
  ordinal: number;
  kind: "heading" | "paragraph" | "list_item" | "table_row";
  displayText: string;
  matchText: string;
  headingPath: string[];
  displaySha256: string;
  normalizationFlags: string[];
};

export type ParsedSection = {
  accession: string;
  sourceHeading: string;
  boundaryStrategy: "item-1b" | "item-1c" | "item-2";
  blocks: NormalizedBlock[];
  textSha256: string;
  validationMessages: string[];
  removedBlocks: Array<{ reason: string; text: string }>;
};
