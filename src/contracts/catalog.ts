import { z } from "zod";

export const CatalogFilingSchema = z.object({
  accession: z.string(),
  periodEnd: z.string(),
  filedAt: z.string(),
  sourceUrl: z.url(),
  indexUrl: z.url(),
});

export const CatalogItemSchema = z.object({
  ticker: z.string(),
  pair: z.string(),
  route: z.string(),
  comparisonId: z.string(),
  cik: z.string(),
  legalName: z.string(),
  displayName: z.string(),
  older: CatalogFilingSchema,
  newer: CatalogFilingSchema,
  status: z.enum(["available", "partial", "unavailable"]),
});

export const CatalogSchema = z.object({
  fixtureVersion: z.literal("v1"),
  generatedAt: z.string(),
  items: z.array(CatalogItemSchema).length(5),
});

export type Catalog = z.infer<typeof CatalogSchema>;
export type CatalogItem = z.infer<typeof CatalogItemSchema>;
